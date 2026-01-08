import numpy as np
from typing import List, Dict, Any

def run_water_simulation(nodes: List[Any], edges: List[Any], sequences: List[Any], library: Dict[str, Any]):
    """
    Moteur de résolution matricielle Quantum Core v1.0
    Calcule l'équilibre hydraulique et la concentration ionique stationnaire.
    """
    # 1. PRÉPARATION DU RÉFÉRENTIEL CHIMIQUE
    # On crée un dictionnaire pour accéder vite aux compositions des produits
    ref_items = {item['id']: item for item in library.get('referenceItems', [])}
    
    # Identifier tous les ions (BaseUnits) présents dans le système
    all_ion_ids = set()
    for item in ref_items.values():
        for comp in item.get('composition', []):
            all_ion_ids.add(comp['baseUnitId'])
    
    # 2. IDENTIFICATION DES NOEUDS DE CALCUL (PROCESS/RINSE)
    calculation_nodes = [n for n in nodes if n.type in ["TANK", "RINSE"]]
    node_map = {n.id: i for i, n in enumerate(calculation_nodes)}
    num_nodes = len(calculation_nodes)
    
    if num_nodes == 0:
        return {"status": "error", "message": "Aucun noeud de calcul trouvé"}

    # 3. CALCUL DU BILAN HYDRAULIQUE (STATIONNAIRE)
    # On calcule les débits sortants réels (Overlays + Drag-out)
    q_out_total = np.zeros(num_nodes)
    drag_out_matrix = np.zeros((num_nodes, num_nodes)) # [source][target]

    for i, node in enumerate(calculation_nodes):
        # Flux via tuyaux sortants (Edges)
        pipes_out = sum(float(e.properties.get("flowRate", 0)) for e in edges if e.source == node.id)
        
        # Flux via entraînement (Sequences / Gammes)
        drag_out_node = 0
        for seq in sequences:
            steps = seq.steps
            cadence = float(seq.properties.get("cadence", 0))
            factor = float(seq.properties.get("dragOut", 0))
            q_step = cadence * factor # L/h
            
            if node.id in steps:
                drag_out_node += q_step
                # Si le noeud a un suivant dans la gamme, on marque le transfert
                idx = steps.index(node.id)
                if idx < len(steps) - 1:
                    target_id = steps[idx + 1]
                    if target_id in node_map:
                        drag_out_matrix[i, node_map[target_id]] += q_step
        
        q_out_total[i] = pipes_out + drag_out_node

    # 4. RÉSOLUTION ION PAR ION
    final_results = {n.id: {"concentrations": {}} for n in calculation_nodes}
    global_kpis = []

    for ion_id in all_ion_ids:
        # Ax = B
        # A : Matrice de transport (L/h)
        # B : Vecteur source (Apport de masse g/h)
        A = np.zeros((num_nodes, num_nodes))
        B = np.zeros(num_nodes)

        for i, node in enumerate(calculation_nodes):
            # Diagonale : Sorties totales de masse du bac i
            # (Ce qui part à l'égout + ce qui part au bac suivant par les pièces)
            A[i, i] = q_out_total[i]

            # Hors-diagonale : Apports venant des autres bacs
            # A. Par tuyauterie (Cascades)
            for e in [e for e in edges if e.target == node.id]:
                if e.source in node_map:
                    A[i, node_map[e.source]] -= float(e.properties.get("flowRate", 0))
            
            # B. Par entraînement (Pièces venant du bac précédent)
            for j in range(num_nodes):
                if drag_out_matrix[j, i] > 0:
                    A[i, j] -= drag_out_matrix[j, i]

            # VECTEUR SOURCE B : Apport chimique direct (Bain de Process)
            # On calcule la masse d'ion injectée par les ReferenceItems (Produits)
            node_components = node.properties.get("components", [])
            for comp in node_components:
                ref_item = ref_items.get(comp['referenceItemId'])
                if not ref_item: continue
                
                # Chercher la fraction de cet ion dans le produit
                ion_coeff = next((c['coefficient'] for c in ref_item['composition'] if c['baseUnitId'] == ion_id), 0)
                
                if ion_coeff > 0:
                    # g/h = Concentration(g/L) * Débit de purge(L/h)
                    # Note: Dans un bain process à l'équilibre, on compense ce qui sort
                    mass_input = float(comp['value']) * q_out_total[i] * ion_coeff
                    B[i] += mass_input

        # Résolution du système pour cet ion
        try:
            if np.any(B): # On ne calcule que si l'ion est présent
                x = np.linalg.solve(A, B)
                for i, node in enumerate(calculation_nodes):
                    final_results[node.id]["concentrations"][ion_id] = round(max(0, x[i]), 3)
        except np.linalg.LinAlgError:
            continue

    # 5. FORMATAGE DES KPIS
    total_chemicals = sum(float(n.properties.get("price", 0)) for n in nodes)
    
    return {
        "status": "success",
        "kpis": [
            {"label": "Investissement", "value": total_chemicals, "unit": "€", "color": "emerald-600"},
            {"label": "Ions suivis", "value": len(all_ion_ids), "unit": "", "color": "blue-600"},
            {"label": "Débit Rejet", "value": sum(q_out_total), "unit": "L/h", "color": "blue-400"}
        ],
        "node_details": final_results
    }