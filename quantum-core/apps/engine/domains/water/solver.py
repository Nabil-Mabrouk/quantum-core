import numpy as np
import logging
from typing import List, Dict, Any, Union

logger = logging.getLogger("water-solver")

# --- HELPERS DE COMPATIBILITÉ (DICT VS PYDANTIC) ---

def _get_val(obj: Any, key: str, default: Any = None) -> Any:
    """Helper pour lire une valeur sur un dictionnaire ou un objet Pydantic."""
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)

def _get_id(obj: Any) -> str:
    """Récupère l'ID de manière robuste."""
    return _get_val(obj, 'id')

def _get_type(obj: Any) -> str:
    """Récupère le Type de manière robuste."""
    return _get_val(obj, 'type')

def get_prop(obj: Any, key: str, default: Any = 0) -> Any:
    """
    Extrait une propriété à l'intérieur du champ 'properties'.
    Fonctionne avec les objets Pydantic Node/Edge et les dicts.
    """
    props = _get_val(obj, 'properties', {})
    if props is None:
        return default
    return props.get(key, default)

# --- PHYSIQUE LOCALE ---

def evaluate_water_node(node_type: str, props: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calcule les indicateurs physiques immédiats pour un noeud (Preview).
    Centralise la physique de l'évaporation et des volumes.
    """
    computed = {}
    if node_type == "TANK":
        # Valeurs par défaut pour éviter les crashs si champs vides
        length = float(props.get('length') or 1000)
        width = float(props.get('width') or 800)
        temp = float(props.get('temp') or 20)
        
        surface_m2 = (length * width) / 1_000_000
        delta_t = max(0, temp - 20)
        
        computed["evaporation"] = round(surface_m2 * delta_t * 0.05, 2)
        computed["volume_m3"] = round(surface_m2 * 1.2, 2)
        
    return {"computed": computed}

# --- SOLVEUR PRINCIPAL ---

def run_water_simulation(nodes: List[Any], edges: List[Any], sequences: List[Any], library: Dict[str, Any]):
    """
    Moteur de simulation hydraulique et ionique stationnaire.
    Compatible avec l'architecture System of Systems.
    """

    # --- 1. INITIALISATION & FILTRAGE ---
    valid_tank_types = ["TANK", "PROCESS", "STATIC_RINSE", "CLASSIC_RINSE"]
    
    # Filtrage robuste (Pydantic safe)
    tanks = [n for n in nodes if _get_type(n) in valid_tank_types]
    sinks = [n for n in nodes if _get_type(n) == "SINK"]

    if not tanks:
        return {"status": "error", "message": "Aucune cuve (TANK) détectée dans le système."}

    tank_map = {_get_id(t): i for i, t in enumerate(tanks)}
    tank_ids = list(tank_map.keys())
    N = len(tanks)

    # Préparation de la bibliothèque (Ions actifs)
    if not isinstance(library, dict):
        library = {}

    lib_items = {item['id']: item for item in library.get('referenceItems', [])}
    lib_units = {unit['id']: unit for unit in library.get('baseUnits', [])}
    
    active_ion_ids = set()
    for item in lib_items.values():
        for comp in item.get('composition', []):
            active_ion_ids.add(comp['baseUnitId'])
    sorted_ions = sorted(list(active_ion_ids))

    # --- 2. PHYSIQUE : ÉVAPORATION ---
    evap_rates = np.zeros(N)
    for i, t in enumerate(tanks):
        if get_prop(t, 'evapAuto', True):
            # On passe les propriétés comme un dict à la fonction physique
            p = _get_val(t, 'properties', {})
            res = evaluate_water_node("TANK", p)
            evap_rates[i] = res["computed"]["evaporation"]
        else:
            evap_rates[i] = float(get_prop(t, 'evaporationRate', 0))

    # --- 3. MATRICE D'ENTRAÎNEMENT (DRAG-OUT) ---
    drag_out_total = np.zeros(N)
    drag_in_total = np.zeros(N)
    drag_matrix = np.zeros((N, N))

    for seq in sequences:
        steps = _get_val(seq, 'steps', [])
        props = _get_val(seq, 'properties', {})
        cadence = float(props.get('cadence') or 0) 
        factor = float(props.get('dragOut') or 0)
        q_step = cadence * factor
        
        for idx, step_node_id in enumerate(steps):
            if step_node_id not in tank_map: continue
            u = tank_map[step_node_id]
            drag_out_total[u] += q_step
            if idx < len(steps) - 1:
                next_id = steps[idx + 1]
                if next_id in tank_map:
                    v = tank_map[next_id]
                    drag_matrix[u, v] += q_step
                    drag_in_total[v] += q_step

    # --- 4. ÉQUILIBRE HYDRAULIQUE ---
    q_overflow = np.zeros(N)
    v_makeup = np.zeros(N)
    
    edge_inflows = {i: [] for i in range(N)}
    for e in edges:
        src = _get_val(e, 'source')
        tgt = _get_val(e, 'target')
        if src in tank_map and tgt in tank_map:
            edge_inflows[tank_map[tgt]].append((tank_map[src], e))

    for _ in range(20):
        for i in range(N):
            t = tanks[i]
            loss_physics = evap_rates[i] + drag_out_total[i]
            q_in = drag_in_total[i]
            if get_prop(t, 'inletType') != 'CASCADE': 
                q_in += float(get_prop(t, 'inletFlow', 0))
            
            for src_idx, edge in edge_inflows[i]:
                etype = get_prop(edge, 'type', 'OVERFLOW')
                q_in += q_overflow[src_idx] if etype == 'OVERFLOW' else float(get_prop(edge, 'flowRate', 0))
            
            balance = q_in - loss_physics
            if get_prop(t, 'inletAuto', True):
                if balance < 0:
                    v_makeup[i] = abs(balance)
                    q_overflow[i] = 0
                else:
                    v_makeup[i] = 0
                    q_overflow[i] = balance
            else:
                v_makeup[i] = 0
                q_overflow[i] = max(0, balance)

    # --- 5. SOLVEUR IONIQUE (Ax = B) ---
    final_results = {t_id: {"concentrations": {}} for t_id in tank_ids}
    q_out_total = q_overflow + drag_out_total
    
    for ion_id in sorted_ions:
        A = np.zeros((N, N))
        B = np.zeros(N)
        has_source = False
        
        for i in range(N):
            A[i, i] = max(q_out_total[i], 1e-6)
            for j in range(N):
                if drag_matrix[j, i] > 0: A[i, j] -= drag_matrix[j, i]
            for src_idx, edge in edge_inflows[i]:
                etype = get_prop(edge, 'type', 'OVERFLOW')
                flow = q_overflow[src_idx] if etype == 'OVERFLOW' else float(get_prop(edge, 'flowRate', 0))
                A[i, src_idx] -= flow

            t = tanks[i]
            # Prise en compte du BUS PROJET (System of Systems)
            ext_concs = get_prop(t, 'externalConcentrations', {})
            if ion_id in ext_concs:
                inlet_flow = float(get_prop(t, 'inletFlow', 0))
                B[i] += inlet_flow * ext_concs[ion_id]
                has_source = True

            components = get_prop(t, 'components', [])
            for comp in components:
                if comp.get('targetType') == 'ION' and comp.get('targetIonId') == ion_id:
                    A[i, :] = 0; A[i, i] = 1; B[i] = float(comp.get('concentration', 0)); has_source = True
                elif comp.get('targetType') == 'PRODUCT':
                    prod = lib_items.get(comp.get('productId'))
                    if prod:
                        ion_part = next((c for c in prod.get('composition', []) if c['baseUnitId'] == ion_id), None)
                        if ion_part:
                            A[i, :] = 0; A[i, i] = 1
                            m_ion = lib_units.get(ion_id, {}).get('properties', {}).get('molarMass', 1)
                            m_prod_total = sum(c['coefficient'] * lib_units.get(c['baseUnitId'], {}).get('properties', {}).get('molarMass', 1) for c in prod.get('composition', []))
                            ratio = (ion_part['coefficient'] * m_ion) / m_prod_total if m_prod_total > 0 else 0
                            B[i] += float(comp.get('concentration', 0)) * ratio; has_source = True

        if has_source:
            try:
                x = np.linalg.solve(A, B)
                for i in range(N): final_results[tank_ids[i]]["concentrations"][ion_id] = round(max(0, float(x[i])), 4)
            except np.linalg.LinAlgError: pass

    # --- 6. AGGRÉGATION PAR RÉSEAU (SINK) ---
    networks_summary = []
    for sink in sinks:
        sink_id = _get_id(sink)
        total_flow = 0
        total_mass = {}
        
        for i, t in enumerate(tanks):
            if get_prop(t, 'dumpingNetworkId') == sink_id or get_prop(t, 'overflowNetworkId') == sink_id:
                flow = q_overflow[i]
                total_flow += flow
                for ion, conc in final_results[tank_ids[i]]["concentrations"].items():
                    total_mass[ion] = total_mass.get(ion, 0) + (flow * conc)
        
        res_conc = {k: round(v/total_flow, 4) if total_flow > 0 else 0 for k, v in total_mass.items()}
        
        # On utilise le label si disponible (Pydantic safe)
        sink_label = _get_val(sink, 'label') or "Réseau"
        if not sink_label and isinstance(sink, dict):
            sink_label = sink.get('data', {}).get('label', "Réseau")

        networks_summary.append({
            "network": sink_label,
            "flow": round(total_flow, 2),
            "concentrations": res_conc,
            "unit": "L/h"
        })
        final_results[sink_id] = {"flow": round(total_flow, 2), "concentrations": res_conc}

    # --- 7. ALERTES ET FINNALISATION ---
    for i, t in enumerate(tanks):
        t_id = tank_ids[i]
        warnings = []
        
        total_q_in = drag_in_total[i] + float(get_prop(t, 'inletFlow', 0))
        for src_idx, edge in edge_inflows[i]:
            etype = get_prop(edge, 'type', 'OVERFLOW')
            total_q_in += q_overflow[src_idx] if etype == 'OVERFLOW' else float(get_prop(edge, 'flowRate', 0))

        if not get_prop(t, 'inletAuto', True) and (total_q_in < (evap_rates[i] + drag_out_total[i]) - 0.01):
            warnings.append({"type": "DRY_TANK", "severity": "CRITICAL", "message": "Niveau baisse : manque d'appoint."})

        if get_prop(t, 'type') != 'PROCESS' and (q_overflow[i] + drag_out_total[i] < 0.01):
            warnings.append({"type": "STAGNANT", "severity": "WARNING", "message": "Poste stagnant : risque d'accumulation."})

        final_results[t_id].update({
            "warnings": warnings,
            "evaporation": round(evap_rates[i], 2),
            "waterMakeup": round(v_makeup[i], 2)
        })

    return {
        "status": "success",
        "kpis": [
            {"label": "Conso Eau", "value": round(sum(v_makeup), 0), "unit": "L/h", "color": "blue-600"},
            {"label": "Rejet Total", "value": round(sum(q_overflow), 0), "unit": "L/h", "color": "orange-600"}
        ],
        "node_details": final_results,
        "networks": networks_summary
    }