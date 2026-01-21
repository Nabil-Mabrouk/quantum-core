import numpy as np
import logging
import json
import asyncio

logger = logging.getLogger("st_solver")

async def run_surface_simulation_stream(nodes, edges, sequences, library, project_settings):
    """
    Solveur de Traitement de Surface Haute Fidélité.
    Gère : Dissociation ionique, Évaporation 24/7, Appoints priorisés, Effet Spray.
    """
    yield json.dumps({"type": "log", "message": "Initialisation du modèle physico-chimique...", "progress": 5}) + "\n"
    
    node_map = {n['id']: i for i, n in enumerate(nodes)}
    node_dict = {n['id']: n for n in nodes}
    N = len(nodes)
    
    # --- 1. PARAMÈTRES TEMPORELS ---
    hours_day = float(project_settings.get('hoursPerDay', 8))
    days_week = float(project_settings.get('daysPerWeek', 5))
    working_hours_week = hours_day * days_week
    # Ratio pour convertir l'évaporation continue (168h) en débit d'appoint (Working Hours)
    time_ratio = 168.0 / working_hours_week if working_hours_week > 0 else 0

    # --- 2. LOGISTIQUE : CALCUL DU DRAG-OUT CUMULÉ ---
    drag_outs = np.zeros((N, N))
    for seq in sequences:
        props = seq.get('properties', {})
        # Débit horaire d'entraînement pour cette séquence
        q_d = float(props.get('cadence', 0)) * float(props.get('surfacePerPart', 0)) * float(props.get('dragOutSpecific', 0.1))
        steps = seq.get('steps', [])
        for i in range(len(steps) - 1):
            src, dst = node_map.get(steps[i]), node_map.get(steps[i+1])
            if src is not None and dst is not None:
                drag_outs[src, dst] += q_d

    results = {n['id']: {
        "flow": 0.0,
        "concentrations": {},
        "chemical_additions": {},
        "evaporation": 0.0,
        "water_makeup": 0.0,
        "warnings": []
    } for n in nodes}

    # --- 3. DISSOCIATION CHIMIQUE (FLATTENING) ---
    # On transforme les g/L de Produits Commerciaux en g/L d'Ions cibles
    ionic_targets = {n['id']: {} for n in nodes if n['type'] == 'PROCESS_BATH'}
    
    for n in nodes:
        if n['type'] == 'PROCESS_BATH':
            reagents = n['properties'].get('reagents', [])
            for entry in reagents:
                prod_id = entry.get('productId')
                prod_conc = float(entry.get('concentration', 0))
                
                # Récupération récursive dans la bibliothèque
                # Niveau 1: Produit -> Réactifs
                product = next((item for item in library['referenceItems'] if item['id'] == prod_id), None)
                if product:
                    for r_link in product.get('composition', []):
                        reagent_id = r_link['baseUnitId']
                        r_coeff = r_link['coefficient'] # ex: g de réactif par g de produit
                        
                        # Niveau 2: Réactif -> Ions
                        reagent = next((item for item in library['referenceItems'] if item['id'] == reagent_id), None)
                        if reagent:
                            for i_link in reagent.get('composition', []):
                                ion_id = i_link['baseUnitId']
                                i_coeff = i_link['coefficient']
                                
                                current = ionic_targets[n['id']].get(ion_id, 0)
                                ionic_targets[n['id']][ion_id] = current + (prod_conc * r_coeff * i_coeff)

    # --- 4. HYDRAULIQUE : ÉVAPORATION ET APPOINTS ---
    water_flows = np.zeros((N, N))
    
    for n in nodes:
        p = n['properties']
        if p.get('hasEvaporation') and 'length' in p and 'width' in p:
            area = (float(p['length']) * float(p['width'])) / 1_000_000 # m2
            t_bath = float(p.get('temp', 20))
            t_workshop = float(project_settings.get('workshopTemp', 20))
            
            # Modèle d'évaporation
            evap_base = area * (0.02 * (t_bath - t_workshop))
            if p.get('agitation') == 'AIR': evap_base *= 1.5
            if p.get('hasCover'): evap_base *= 0.1
            
            q_evap_cont = max(0, evap_base) # L/h sur 24h
            results[n['id']]['evaporation'] = q_evap_cont
            
            # Appoint nécessaire pendant les heures de prod
            q_evap_eff = q_evap_cont * time_ratio
            
            # Compensation
            source_id = p.get('makeupSourceId') or p.get('evapCompensationSourceId')
            if source_id in node_map:
                water_flows[node_map[source_id], node_map[n['id']]] = q_evap_eff
                results[n['id']]['water_makeup'] = q_evap_eff

    # Stabilisation des cascades de rinçage
    for _ in range(N):
        changed = False
        for n in nodes:
            if n['type'] == 'RINSE_TANK':
                idx = node_map[n['id']]
                q_in = sum(water_flows[:, idx]) + float(n['properties'].get('manualFlowRate', 0))
                q_out = max(0, q_in - (results[n['id']]['evaporation'] * time_ratio))
                
                target_id = n['properties'].get('overflowTargetId')
                if target_id in node_map:
                    t_idx = node_map[target_id]
                    if abs(water_flows[idx, t_idx] - q_out) > 1e-6:
                        water_flows[idx, t_idx] = q_out
                        changed = True
        if not changed: break

    # --- 5. CHIMIE : RÉSOLUTION MATRICIELLE Ax = b ---
    yield json.dumps({"type": "log", "message": "Calcul des équilibres ioniques...", "progress": 70}) + "\n"
    
    all_ions = {ion for targets in ionic_targets.values() for ion in targets.keys()}
    
    for ion_id in all_ions:
        A, b = np.zeros((N, N)), np.zeros(N)
        for i, n in enumerate(nodes):
            q_d_out = sum(drag_outs[i, :])
            q_w_out = sum(water_flows[i, :])
            
            if n['type'] == 'PROCESS_BATH':
                # Condition de maintien : Concentration forcée à la consigne
                A[i, i] = 1.0
                b[i] = ionic_targets[n.get('id')].get(ion_id, 0)
                
                # Calcul de l'appoint chimique pour le rapport (Masse sortante - Masse entrante)
                m_out = q_d_out * b[i]
                m_in = sum(drag_outs[j, i] * results[nodes[j]['id']]['concentrations'].get(ion_id, 0) for j in range(N))
                results[n['id']]['chemical_additions'][ion_id] = max(0, m_out - m_in)
            else:
                # Équilibre de Rinçage : Entrées = Sorties
                # Si Spray actif dans le bain suivant, on applique le facteur de dilution
                dilution = 1.0
                # Recherche si ce rinçage alimente un spray de bain
                bath_fed = next((b for b in nodes if b['type'] == 'PROCESS_BATH' and b['properties'].get('spraySourceId') == n['id']), None)
                if bath_fed and bath_fed['properties'].get('useSpray'):
                    v_makeup = results[bath_fed['id']]['water_makeup']
                    q_d_bath = sum(drag_outs[node_map[bath_fed['id']], :])
                    dilution = q_d_bath / (q_d_bath + v_makeup) if (q_d_bath + v_makeup) > 0 else 1.0

                A[i, i] = max(q_d_out + q_w_out, 1e-9)
                for j in range(N):
                    if drag_outs[j, i] > 0: A[i, j] -= (drag_outs[j, i] * dilution)
                    if water_flows[j, i] > 0: A[i, j] -= water_flows[j, i]

        try:
            x = np.linalg.solve(A, b)
            for i, val in enumerate(x):
                if val > 1e-5: results[nodes[i]['id']]['concentrations'][ion_id] = round(float(val), 4)
        except np.linalg.LinAlgError:
            results[nodes[0]['id']]['warnings'].append(f"Erreur convergence ion {ion_id}")

    # Données finales
    for n in nodes:
        results[n['id']]['flow'] = sum(water_flows[:, node_map[n['id']]])

    yield json.dumps({"type": "result", "data": {"status": "success", "node_details": results}}) + "\n"