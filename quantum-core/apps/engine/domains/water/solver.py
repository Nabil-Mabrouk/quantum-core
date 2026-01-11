import numpy as np
from typing import List, Dict, Any

def run_water_simulation(nodes: List[Any], edges: List[Any], sequences: List[Any], library: Dict[str, Any]):
    # --- 1. HELPERS & SETUP ---
    def get_prop(obj, key, default=0):
        props = getattr(obj, 'properties', {}) if hasattr(obj, 'properties') else obj.get('properties', {})
        val = props.get(key, default)
        return val if val is not None else default

    valid_tank_types = ["TANK", "PROCESS", "STATIC_RINSE", "CLASSIC_RINSE"]
    tanks = [n for n in nodes if getattr(n, 'type', n.get('type')) in valid_tank_types or get_prop(n, 'type') in valid_tank_types]
    sinks = [n for n in nodes if getattr(n, 'type', n.get('type')) == "SINK"]

    tank_map = {getattr(t, 'id', t.get('id')): i for i, t in enumerate(tanks)}
    tank_ids = list(tank_map.keys())
    N = len(tanks)

    if N == 0:
        return {"status": "error", "message": "No tanks found."}

    lib_items = {item['id']: item for item in library.get('referenceItems', [])}
    lib_units = {unit['id']: unit for unit in library.get('baseUnits', [])}
    
    active_ion_ids = set()
    for item in lib_items.values():
        for comp in item.get('composition', []):
            active_ion_ids.add(comp['baseUnitId'])
    sorted_ions = sorted(list(active_ion_ids))

    # --- 2. PHYSICS: EVAPORATION ---
    evap_rates = np.zeros(N)
    for i, t in enumerate(tanks):
        if get_prop(t, 'evapAuto', True):
            length = float(get_prop(t, 'length', 1000))
            width = float(get_prop(t, 'width', 800))
            temp = float(get_prop(t, 'temp', 20))
            surface_m2 = (length * width) / 1_000_000
            delta_t = max(0, temp - 20)
            evap_rates[i] = surface_m2 * delta_t * 0.05
        else:
            evap_rates[i] = float(get_prop(t, 'evaporationRate', 0))

    # --- 3. DRAG-OUT MATRIX ---
    drag_out_total = np.zeros(N)
    drag_in_total = np.zeros(N)
    drag_matrix = np.zeros((N, N))

    for seq in sequences:
        steps = getattr(seq, 'steps', seq.get('steps', []))
        cadence = float(get_prop(seq, 'cadence', 0)) 
        factor = float(get_prop(seq, 'dragOut', 0))
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

    # --- 4. HYDRAULIC BALANCE ---
    q_overflow = np.zeros(N)
    v_stab = np.zeros(N)
    edge_inflows = {i: [] for i in range(N)}
    for e in edges:
        src = getattr(e, 'source', e.get('source'))
        tgt = getattr(e, 'target', e.get('target'))
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
                    v_stab[i] = abs(balance)
                    q_overflow[i] = 0
                else:
                    v_stab[i] = 0
                    q_overflow[i] = balance
            else:
                v_stab[i] = 0
                q_overflow[i] = max(0, balance)

    # --- 5. IONIC SOLVER (Ax = B) ---
    final_results = {t_id: {"concentrations": {}} for t_id in tank_ids}
    q_out_mass = q_overflow + drag_out_total
    
    for ion_id in sorted_ions:
        A = np.zeros((N, N))
        B = np.zeros(N)
        has_source = False
        for i in range(N):
            A[i, i] = max(q_out_mass[i], 1e-6)
            for j in range(N):
                if drag_matrix[j, i] > 0: A[i, j] -= drag_matrix[j, i]
            for src_idx, edge in edge_inflows[i]:
                etype = get_prop(edge, 'type', 'OVERFLOW')
                flow = q_overflow[src_idx] if etype == 'OVERFLOW' else float(get_prop(edge, 'flowRate', 0))
                A[i, src_idx] -= flow

            t = tanks[i]
            components = get_prop(t, 'components', [])
            for comp in components:
                if comp.get('targetType') == 'ION' and comp.get('targetIonId') == ion_id:
                    A[i, :] = 0; A[i, i] = 1; B[i] = float(comp.get('concentration', 0)); has_source = True
                elif comp.get('targetType') == 'PRODUCT':
                    prod = lib_items.get(comp.get('productId'))
                    if prod:
                        ion_part = next((c for c in prod.get('composition', []) if c['baseUnitId'] == ion_id), None)
                        if ion_part:
                            # Dirichlet pour les bains process
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

    # --- 6. NETWORK AGGREGATION & WARNINGS ---
    networks_summary = []
    for sink in sinks:
        sink_id = getattr(sink, 'id', sink.get('id'))
        total_flow = 0
        total_mass = 0
        for i, t in enumerate(tanks):
            # On vérifie les deux types de raccordement
            if get_prop(t, 'dumpingNetworkId') == sink_id or get_prop(t, 'overflowNetworkId') == sink_id:
                flow = q_overflow[i]
                total_flow += flow
                total_mass += flow * sum(final_results[tank_ids[i]]["concentrations"].values())
        
        networks_summary.append({
            "network": getattr(sink, 'data', {}).get('label', "Réseau"),
            "flow": round(total_flow, 2),
            "mass": round(total_mass, 2),
            "unit": "L/h"
        })
        final_results[sink_id] = {"flow": round(total_flow, 2)}

    # --- 6.5 WARNINGS (FIXED LOGIC) ---
    for i, t in enumerate(tanks):
        t_id = tank_ids[i]
        warnings = []
        
        # Correction DRY_TANK : on compte TOUTES les entrées
        total_q_in = drag_in_total[i] + float(get_prop(t, 'inletFlow', 0))
        for src_idx, edge in edge_inflows[i]:
            etype = get_prop(edge, 'type', 'OVERFLOW')
            total_q_in += q_overflow[src_idx] if etype == 'OVERFLOW' else float(get_prop(edge, 'flowRate', 0))

        if not get_prop(t, 'inletAuto', True) and (total_q_in < (evap_rates[i] + drag_out_total[i]) - 0.01):
            warnings.append({"type": "DRY_TANK", "severity": "CRITICAL", "message": "Niveau baisse : manque d'appoint."})

        # Correction STAGNANT : on ignore les bains process
        if get_prop(t, 'type') != 'PROCESS' and (q_overflow[i] + drag_out_total[i] < 0.01):
            warnings.append({"type": "STAGNANT", "severity": "WARNING", "message": "Poste stagnant : risque d'accumulation."})

        final_results[t_id].update({
            "warnings": warnings,
            "evaporation": round(evap_rates[i], 2),
            "waterMakeup": round(v_stab[i], 2)
        })

    return {
        "status": "success",
        "kpis": [
            {"label": "Conso Eau", "value": round(sum(v_stab), 0), "unit": "L/h", "color": "blue-600"},
            {"label": "Rejet Total", "value": round(sum(q_overflow), 0), "unit": "L/h", "color": "orange-600"}
        ],
        "node_details": final_results,
        "networks": networks_summary
    }