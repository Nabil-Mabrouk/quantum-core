# apps/engine/domains/surface_treatment/solver.py

import numpy as np
import logging
import json
import asyncio
import traceback

logger = logging.getLogger("st_solver")

def safe_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default

async def run_surface_simulation_stream(nodes, edges, sequences, library, project_settings):
    """
    Solveur Haute Fidélité : Traitement de Surface.
    Gère : Hydraulique, Chimie, Évaporation et Vidanges périodiques.
    """
    # Ajout d'une liste locale de warnings qui sera fusionnée avec le global plus tard
    local_warnings = [] 
    
    try:
        yield json.dumps({"type": "log", "message": "🔍 Analyse de la topologie et validation...", "progress": 10}) + "\n"
        
        node_map = {n['id']: i for i, n in enumerate(nodes)}
        node_dict = {n['id']: n for n in nodes}
        N = len(nodes)
        
        # --- LECTURE DES PARAMÈTRES GLOBAUX D'ÉVAPORATION ---
        ps = project_settings if project_settings else {}
        
        temp_ref = safe_float(ps.get('workshopTemp', 20.0))
        evap_coeff = safe_float(ps.get('evapCoefficient', 0.02))
        agitation_factor = safe_float(ps.get('evapAgitationFactor', 1.5))
        cover_reduction_factor = safe_float(ps.get('evapCoverReductionFactor', 0.1))

        # --- 1. PARAMÈTRES TEMPORELS ---
        hours_day = safe_float(project_settings.get('hoursPerDay', 8))
        days_week = safe_float(project_settings.get('daysPerWeek', 5))
        weeks_year = safe_float(project_settings.get('weeksPerYear', 52))
        
        working_hours_week = hours_day * days_week
        working_hours_year = working_hours_week * weeks_year
        
        time_ratio = 168.0 / working_hours_week if working_hours_week > 0 else 1.0

        # --- 2. LOGISTIQUE : CALCUL DU DRAG-OUT (Entraînement) ---
        drag_outs = np.zeros((N, N))
        q_drag_out_final = np.zeros(N) 

        for seq in sequences:
            props = seq.get('properties', {})
            q_d = safe_float(props.get('productionRate', 0)) * safe_float(props.get('dragOutSpecific', 0.1))
            
            steps = seq.get('steps', [])
            for i in range(len(steps)): 
                src_id = steps[i]
                src_idx = node_map.get(src_id)
                
                if src_idx is None: continue
                
                if i < len(steps) - 1:
                    dst_id = steps[i+1]
                    dst_idx = node_map.get(dst_id)
                    if dst_idx is not None:
                        drag_outs[src_idx, dst_idx] += q_d
                else:
                    q_drag_out_final[src_idx] += q_d

        # --- 3. CHIMIE : PRÉPARATION DES CIBLES (FLATTENING) ---
        yield json.dumps({"type": "log", "message": "🧪 Dissociation des produits chimiques...", "progress": 30}) + "\n"
        ionic_targets = {n['id']: {} for n in nodes if n['type'] == 'PROCESS_BATH'}
        
        # Correction 3: Utiliser la structure de librairie formatée pour Python (referenceItems)
        lib_map = {item['id']: item for item in library.get('referenceItems', [])} 
        
        # Conserver le lib_map des unités de base (ions) pour les compositions futures
        # base_units_map = {item['id']: item for item in library.get('baseUnits', [])}


        for n in nodes:
            if n['type'] == 'PROCESS_BATH':
                reagents = n['properties'].get('reagents', [])
                # print(f"DEBUG_BATH: reagents:  {reagents}") # Maintenu pour le debug si besoin

                for entry in reagents:
                    prod_entry = entry.get('productId')
                    
                    # --- RUPTURE FIXÉE ICI ---
                    prod_id = None
                    if isinstance(prod_entry, dict):
                        prod_id = prod_entry.get('id') # Capture l'ID si c'est un objet (cas catalogue)
                    elif isinstance(prod_entry, str):
                        prod_id = prod_entry         # Capture l'ID si c'est une simple chaîne (cas import direct)
                    
                    prod_conc = safe_float(entry.get('concentration', 0))
                    
                    if not prod_id or prod_conc <= 0: continue
                    
                    product = lib_map.get(prod_id)

                    if not product:
                        local_warnings.append(f"⚠️ Le produit ID {prod_id} pour {n.get('label')} est manquant dans la librairie.")
                        continue
                    
                    # --- DÉBUT DU BLOC CORRIGÉ / ROBUSTE ---
                    
                    # Accumulateur temporaire pour les ions purs : {ion_id: coefficient_total}
                    ion_contributions = {}
                    
                    # Le solveur doit gérer 2 niveaux de récursivité pour l'instant (Produit Commercial -> Réactif -> Ion)

                    for link_n1 in product.get('composition', []):
                        child_n1 = lib_map.get(link_n1['baseUnitId']) # baseUnitId pour la librairie formatée
                        coeff_n1 = safe_float(link_n1['coefficient'], 0)
                        
                        if not child_n1:
                            local_warnings.append(f"⚠️ Un composant de {product.get('name', 'produit')} est manquant.")
                            continue
                            
                        if child_n1.get('category') == 'ION':
                            # Cas 1 : Le produit se décompose directement en ION (Niveau 1)
                            ion_id = child_n1['id']
                            ion_contributions[ion_id] = ion_contributions.get(ion_id, 0) + coeff_n1
                            
                        elif child_n1.get('composition'): # C'est un Réactif (niveau intermédiaire)
                            # Cas 2 : Le produit se décompose en un AUTRE produit (Niveau 2)
                            for link_n2 in child_n1.get('composition', []):
                                child_n2 = lib_map.get(link_n2['baseUnitId'])
                                coeff_n2 = safe_float(link_n2['coefficient'], 0)
                                
                                if child_n2 and child_n2.get('category') == 'ION':
                                    # Le calcul clé est ici : multiplication des proportions N1 * N2
                                    ion_id = child_n2['id']
                                    total_coeff = coeff_n1 * coeff_n2
                                    ion_contributions[ion_id] = ion_contributions.get(ion_id, 0) + total_coeff
                    
                    # Finalisation : Accumuler la concentration totale
                    for ion_id, total_coeff in ion_contributions.items():
                        # Multiplication unique par la concentration utilisateur (prod_conc)
                        contribution = prod_conc * total_coeff 
                        ionic_targets[n['id']][ion_id] = ionic_targets[n['id']].get(ion_id, 0) + contribution
                        # print(f"DEBUG_BATH: Ion {ion_id} target set to: {ionic_targets[n['id']][ion_id]}") # Maintenu pour le debug
                        
        # --- 4. HYDRAULIQUE : ÉVAPORATION, VIDANGES ET APPOINTS ---
        yield json.dumps({"type": "log", "message": "💧 Calcul des bilans hydrauliques et vidanges...", "progress": 50}) + "\n"
        water_flows = np.zeros((N, N))
        
        # Le warnings sera local_warnings pour l'instant, fusionné à la fin
        evap_data = {n['id']: 0.0 for n in nodes}
        q_dump_total = {n['id']: 0.0 for n in nodes}

        # A. INTEGRATION DES VIDANGES (DUMPING)
        for n in nodes:
            p = n['properties']
            if p.get('dumpingFreq') and p.get('workingVol'):
                freq = safe_float(p['dumpingFreq'])
                vol = safe_float(p['workingVol'])
                q_dump = (vol * freq) / working_hours_year if working_hours_year > 0 else 0
                q_dump_total[n['id']] = q_dump
                
                drain_id = p.get('dumpingNetworkId')
                if drain_id in node_map:
                    water_flows[node_map[n['id']], node_map[drain_id]] += q_dump

        # B. CALCUL DE L'ÉVAPORATION ET APPOINT ASSOCIÉ
        for n in nodes:
            p = n['properties']
            idx = node_map[n['id']]
            if p.get('hasEvaporation'):
                area = (safe_float(p.get('length', 0)) * safe_float(p.get('width', 0))) / 1_000_000 
                if area > 0:
                    t_bath = safe_float(p.get('temp', 20))
                    evap_base = area * (evap_coeff * (t_bath - temp_ref))
                    if p.get('agitation') == 'AIR': 
                        evap_base *= agitation_factor 
                    if p.get('hasCover'): 
                        evap_base *= cover_reduction_factor 
                    evap_data[n['id']] = max(0, evap_base)

            if n['type'] == 'PROCESS_BATH':
                q_evap_prod = evap_data[n['id']] * time_ratio
                q_loss = (sum(drag_outs[idx, :]) - sum(drag_outs[:, idx])) + q_dump_total[n['id']]

                q_makeup = q_evap_prod + q_loss
                
                source_id = p.get('makeupSourceId')
                if source_id and source_id in node_map:
                    water_flows[node_map[source_id], idx] = max(0, q_makeup)
                elif q_makeup > 0.001:
                    local_warnings.append(f"⚠️ {n.get('label')} perd {q_makeup:.1f} L/h mais n'a pas de source d'appoint.")

        # C. STABILISATION DES CASCADES DE RINÇAGE
        for _ in range(N):
            changed = False
            for n in nodes:
                if n['type'] == 'RINSE_TANK':
                    idx = node_map[n['id']]
                    q_vol_in = sum(water_flows[:, idx]) + sum(drag_outs[:, idx]) + safe_float(n['properties'].get('manualFlowRate', 0))
                    q_vol_out_other = sum(drag_outs[idx, :]) + (evap_data[n['id']] * time_ratio) + q_dump_total[n['id']]
                    
                    q_overflow = max(0, q_vol_in - q_vol_out_other)
                    
                    target_id = n['properties'].get('overflowTargetId')
                    if target_id in node_map:
                        t_idx = node_map[target_id]
                        if abs(water_flows[idx, t_idx] - q_overflow) > 1e-6:
                            water_flows[idx, t_idx] = q_overflow
                            changed = True
            if not changed: break

        # --- 5. CHIMIE : RÉSOLUTION Ax = b ---
        yield json.dumps({"type": "log", "message": "🧩 Résolution des équilibres ioniques...", "progress": 80}) + "\n"
        results = {n['id']: {
            "concentrations": {}, "chemical_additions": {}, "warnings": [],
            "hydraulics": {"in": 0.0, "out": 0.0, "evap": evap_data[n['id']], "dump": q_dump_total[n['id']]}
        } for n in nodes}

        all_ions = {ion for targets in ionic_targets.values() for ion in targets.keys()}
        
        for ion_id in all_ions:
            A, b = np.zeros((N, N)), np.zeros(N)
            for i, n in enumerate(nodes):
                idx = node_map[n['id']]
                q_out = sum(drag_outs[i, :]) + sum(water_flows[i, :])
                target_value = ionic_targets.get(n['id'], {}).get(ion_id, 0)

                if n['type'] == 'PROCESS_BATH' and target_value > 0:
                    A[i, i] = 1.0
                    b[i] = target_value
                else:
                    A[i, i] = max(q_out, 1e-9)
                    for j in range(N):
                        if drag_outs[j, i] > 0: A[i, j] -= drag_outs[j, i]
                        if water_flows[j, i] > 0: A[i, j] -= water_flows[j, i]

            try:
                x = np.linalg.solve(A, b)
                for i, val in enumerate(x):
                    if val > 1e-4: results[nodes[i]['id']]['concentrations'][ion_id] = round(float(val), 4)
            except np.linalg.LinAlgError:
                local_warnings.append(f"⚠️ Instabilité mathématique sur l'ion {ion_id}. Vérifiez la topologie (boucles fermées ou débits nuls).")


        # Calcul des ajouts chimiques (Masse)
        for n in nodes:
            if n['type'] == 'PROCESS_BATH':
                for ion_id, target in ionic_targets.get(n['id'], {}).items():
                    idx = node_map[n['id']]
                    m_out = (sum(drag_outs[idx, :]) + sum(water_flows[idx, :])) * target
                    # Calcul des inputs contaminés
                    m_in = sum(drag_outs[j, idx] * results[nodes[j]['id']]['concentrations'].get(ion_id, 0) for j in range(N))
                    m_in += sum(water_flows[j, idx] * results[nodes[j]['id']]['concentrations'].get(ion_id, 0) for j in range(N))
                    
                    # Ajout d'une protection contre les inputs qui n'existent pas
                    if m_out - m_in > 0:
                         results[n['id']]['chemical_additions'][ion_id] = round(m_out - m_in, 4)


        # --- Injection des cibles ioniques et fusion des warnings ---
        for n in nodes:
            if n['type'] == 'PROCESS_BATH':
                node_id = n['id']
                if 'target_concentrations' not in results[node_id]:
                    results[node_id]['target_concentrations'] = {}
                
                targets = ionic_targets.get(node_id, {})
                for ion_id, target_value in targets.items():
                    results[node_id]['target_concentrations'][ion_id] = round(float(target_value), 4)
        
        # Ajout des débits In/Out calculés dans le résultat final pour les nœuds
        for n in nodes:
            idx = node_map[n['id']]
            q_in = sum(water_flows[:, idx]) + sum(drag_outs[:, idx]) + safe_float(n['properties'].get('manualFlowRate', 0))
            q_out = sum(water_flows[idx, :]) + sum(drag_outs[idx, :]) + (evap_data[n['id']] * time_ratio)
            
            results[n['id']]['hydraulics']['in'] = round(float(q_in), 4)
            results[n['id']]['hydraulics']['out'] = round(float(q_out), 4)
            

        # --- 6. FINALISATION ET KPIS ---
        yield json.dumps({"type": "log", "message": "📊 Finalisation du bilan...", "progress": 95}) + "\n"
        total_water_consumption = 0.0
        
        for n in nodes:
            if n['type'] == 'SOURCE': total_water_consumption += results[n['id']]['hydraulics']['out']

        # Fusion des warnings locaux et warnings globaux du solveur
        final_warnings = local_warnings + project_settings.get('warnings', [])
        
        yield json.dumps({"type": "result", "data": {
            "status": "success" if not final_warnings else "warning",
            "node_details": results,
            "global_kpis": {"total_water_consumption": round(total_water_consumption, 2), "warnings_count": len(final_warnings)},
            "warnings": final_warnings
        }}) + "\n"

    except Exception as e:
        error_trace = traceback.format_exc()
        # Correction 5: Utilisation du logger standard Python pour le terminal
        logger.error(f"FATAL SOLVER ERROR: {str(e)}", exc_info=True)
        yield json.dumps({"type": "error", "message": str(e), "trace": error_trace}) + "\n"