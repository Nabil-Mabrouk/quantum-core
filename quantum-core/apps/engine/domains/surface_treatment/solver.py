# apps/engine/domains/surface_treatment/solver.py
import numpy as np
import logging

logger = logging.getLogger("solver")

async def run_surface_simulation_stream(nodes, edges, sequences, library, project_settings):
    """
    Solveur complet : Hydraulique (Cascade) + Chimie (Matricielle)
    """
    
    # --- 1. PRÉPARATION DES DONNÉES ---
    node_map = {n['id']: i for i, n in enumerate(nodes)}
    node_dict = {n['id']: n for n in nodes}
    N = len(nodes)
    
    # Structure pour stocker les résultats
    results = {n['id']: {
        "flow": 0.0,           # Débit d'eau traversant (L/h)
        "concentrations": {},  # Concentration par produit (g/L)
        "water_makeup": 0.0,   # Appoint eau requis
        "warnings": []
    } for n in nodes}

    # Calcul des Drag-out (Entraînement par les pièces)
    # drag_outs[source_id][target_id] = volume en L/h
    drag_outs = np.zeros((N, N))
    
    for seq in sequences:
        props = seq.get('properties', {})
        # Q_drag (L/h) = Cadence (u/h) * Surface (m²/u) * Spécifique (L/m²)
        cadence = float(props.get('cadence', 0))
        surface = float(props.get('surfacePerPart', 1))
        spec = float(props.get('dragOutSpecific', 0.1))
        q_drag_seq = cadence * surface * spec
        
        steps = seq.get('steps', [])
        for i in range(len(steps) - 1):
            src_idx = node_map.get(steps[i])
            dst_idx = node_map.get(steps[i+1])
            if src_idx is not None and dst_idx is not None:
                drag_outs[src_idx, dst_idx] += q_drag_seq

    # --- 2. RÉSOLUTION HYDRAULIQUE (CASCADES) ---
    # On doit déterminer Q_water pour chaque cuve.
    # C'est un graphe de flux d'eau. On propage l'eau des sources vers les drains.
    
    # On initialise les débits connus (Eau Neuve)
    water_flows = np.zeros((N, N)) # water_flows[src][dst]
    
    # Passe 1 : Injection d'eau neuve (Source -> Tank)
    for node in nodes:
        props = node.get('properties', {})
        if node['type'] == 'RINSE_TANK':
            src_id = props.get('waterSourceId')
            # Si la source est une "SOURCE" (pas un autre bac), c'est de l'injection directe
            src_node = node_dict.get(src_id)
            if src_node and src_node['type'] == 'SOURCE':
                q_in = float(props.get('flowRate', 0))
                idx_src = node_map[src_id]
                idx_dst = node_map[node['id']]
                water_flows[idx_src, idx_dst] += q_in
                results[node['id']]['flow'] += q_in

    # Passe 2 : Propagation des cascades (Rinçage -> Rinçage ou Rinçage -> Bain)
    # On utilise un algo itératif simple pour propager le flux
    # (Attention aux boucles, ici on suppose un flux acyclique majoritaire)
    for _ in range(N): # Suffisant pour propager sur N niveaux de cascade
        changed = False
        for node in nodes:
            idx = node_map[node['id']]
            props = node.get('properties', {})
            
            # Somme de toute l'eau entrant dans ce nœud (Venant de sources ou d'autres bacs)
            q_water_in = sum(water_flows[:, idx])
            
            # Gestion Évaporation
            # (Pour simplifier ici, on dit que l'eau sortante = eau entrante - evap)
            # Dans la réalité, le niveau baisse et on compense, donc Q_out = Q_in si débordement.
            # Supposons ici Q_out = Q_in pour le flux hydraulique de surverse
            
            target_id = props.get('overflowTargetId')
            if target_id and target_id in node_map:
                target_idx = node_map[target_id]
                
                # Si le flux calculé est différent de ce qu'on a déjà, on met à jour
                if water_flows[idx, target_idx] != q_water_in:
                    water_flows[idx, target_idx] = q_water_in
                    results[target_id]['flow'] = q_water_in # Mise à jour du débit traversant la cible
                    changed = True
        
        if not changed: break

    # --- 3. RÉSOLUTION CHIMIQUE (MATRICIELLE) ---
    # Bilan Masse : Accumulation = Entrée - Sortie + Réaction
    # À l'équilibre : Entrée = Sortie
    # Entrée i = (DragIn * C_prev) + (WaterIn * C_water_src) + Ajout_Chimique
    # Sortie i = (DragOut * C_i) + (WaterOut * C_i)
    
    # On identifie tous les produits chimiques uniques utilisés
    chem_ids = set()
    for node in nodes:
        for comp in node.get('properties', {}).get('components', []):
            if comp.get('chemId'): chem_ids.add(comp['chemId'])
            
    # On résout une matrice par produit chimique
    for chem_id in chem_ids:
        A = np.zeros((N, N))
        B = np.zeros(N)
        
        for i, node in enumerate(nodes):
            # Terme de sortie (Diagonale) : Ce qui part du noeud i
            # Q_total_out = DragOut_Total + WaterOut_Total
            q_drag_out_total = sum(drag_outs[i, :])
            q_water_out_total = sum(water_flows[i, :])
            
            # Si c'est un bain mort/drain sans sortie, on évite la division par 0
            if q_drag_out_total + q_water_out_total == 0:
                A[i, i] = 1.0 # Concentration statique
            else:
                A[i, i] = q_drag_out_total + q_water_out_total

            # Termes d'entrée (Hors diagonale) : Ce qui arrive de j vers i
            # 1. Par Drag-out (j -> i)
            for j in range(N):
                if drag_outs[j, i] > 0:
                    A[i, j] -= drag_outs[j, i]
            
            # 2. Par Eau (j -> i) (Dilution / Cascade inverse)
            for j in range(N):
                if water_flows[j, i] > 0:
                    A[i, j] -= water_flows[j, i]

            # 3. Source Chimique (Le bidon qu'on verse)
            # Si c'est un PROCESS_BATH avec une consigne de concentration
            props = node.get('properties', {})
            target_conc = 0.0
            is_active_bath = False
            
            if node['type'] == 'PROCESS_BATH':
                for comp in props.get('components', []):
                    if comp.get('chemId') == chem_id:
                        target_conc = float(comp.get('concentration', 0))
                        is_active_bath = True
                        break
            
            if is_active_bath:
                # C'est une condition limite de Dirichlet : C_i = Target
                # On écrase la ligne de la matrice pour forcer la valeur
                A[i, :] = 0
                A[i, i] = 1.0
                B[i] = target_conc

        # Résolution Ax = B
        try:
            C = np.linalg.solve(A, B)
            # Stockage des résultats
            for i, val in enumerate(C):
                if val > 1e-6: # On ignore les traces infinitésimales
                    results[nodes[i]['id']]['concentrations'][chem_id] = round(float(val), 4)
        except np.linalg.LinAlgError:
            results[nodes[0]['id']]['warnings'].append(f"Erreur convergence pour {chem_id}")

    return {"status": "success", "node_details": results}