# apps/engine/domains/surface_treatment/solver.py
import numpy as np
import json
import logging
import asyncio
from typing import List, Dict, Any, AsyncGenerator

# Import quantum-st (installé via pip)
from quantum_st import Workshop, ProcessNode, ProcessSequence, ProcessStep, Flow
# 🚩 CORRECTION: On importe NodeType pour la vérification du type de nœud.
from quantum_st.core.enums import NodeType, FlowType
from quantum_st.solver.stationary import StationarySolver

from .adapter_quantum_st import payload_to_workshop, quantum_results_to_legacy

logger = logging.getLogger("st_solver")

async def run_surface_simulation_stream(
    nodes: List[Dict], 
    edges: List[Dict], 
    sequences: List[Dict], 
    library: Dict[str, Any], 
    project_settings: Dict[str, Any]
) -> AsyncGenerator[str, None]:
    """
    Solveur de traitement de surface utilisant quantum-st.
    Remplace complètement l'ancien solveur numpy.
    """
    try:
        # Étape 1: Construction du modèle
        yield json.dumps({
            "type": "log", 
            "message": "🔧 Construction du modèle topologique...", 
            "progress": 10
        }) + "\n"
        
        # Simuler un temps de traitement pour le streaming
        await asyncio.sleep(0.05)
        
        payload = {
            'nodes': nodes,
            'edges': edges,
            'sequences': sequences,
            'library': library,
            'project_settings': project_settings
        }
        
        workshop = payload_to_workshop(payload)
        
        # Validation
        validation = workshop.validate()
        if not validation['valid']:
            yield json.dumps({
                "type": "warning",
                "message": f"Validation du modèle: {len(validation['issues'])} problèmes détectés",
                "details": validation['issues']
            }) + "\n"
        
        # Étape 2: Extraction des ions
        yield json.dumps({
            "type": "log", 
            "message": "🧪 Identification des espèces ioniques...", 
            "progress": 25
        }) + "\n"

        # On s'assure d'avoir la liste des ions à simuler
        ions = [
            item['id'] for item in library.get('baseUnits', [])
            # On cherche les items qui sont des Ions et qui sont actifs dans la librairie
            if item.get('category') == 'ION'
        ]
        
        if not ions:
            # Ions par défaut si la library est vide (nécessaire pour que le solveur tourne)
            ions = ["Zn2+", "Cl-", "Na+", "OH-", "SO4--", "H+", "Fe2+", "Al3+"]
            yield json.dumps({
                "type": "log",
                "message": f"⚠️ Aucun ion trouvé dans la librairie, utilisation des ions par défaut: {ions}"
            }) + "\n"
        
        await asyncio.sleep(0.05)

        # Étape 3: Résolution matricielle
        yield json.dumps({
            "type": "log", 
            "message": f"🧮 Résolution du système linéaire ({len(ions)} ions, {validation.get('n_variables', 0)} variables)...", 
            "progress": 50
        }) + "\n"
        
        solver = StationarySolver(workshop)
        
        # Utilisation du solveur direct (sparse matrix)
        results_df = solver.solve(ions, method='direct')
        
        # Vérification des résultats
        if results_df.empty:
            raise ValueError("Le solveur n'a retourné aucun résultat")
        
        await asyncio.sleep(0.1)

        # Étape 4: Calcul des bilans globaux
        yield json.dumps({
            "type": "log", 
            "message": "📊 Calcul des bilans de masse...", 
            "progress": 75
        }) + "\n"
        
        # Calcul des KPIs globaux
        total_water = 0.0
        for node_id, node_data in workshop.graph.nodes(data=True):
            node = node_data.get('data')
            # 🚩 CORRECTION: Utilisation de NodeType.SOURCE (nœud) au lieu de FlowType.SOURCE (arête)
            if node and node.node_type == NodeType.SOURCE:
                # Calcul du débit sortant de la source
                for _, target, edge_data in workshop.graph.out_edges(node_id, data=True):
                    flow = edge_data.get('data')
                    if flow:
                        total_water += flow.flow_rate
        
        await asyncio.sleep(0.05)

        # Étape 5: Formatage des résultats pour le frontend
        yield json.dumps({
            "type": "log", 
            "message": "✅ Finalisation...", 
            "progress": 90
        }) + "\n"
        
        legacy_results = quantum_results_to_legacy(workshop, results_df, ions)
        
        # Ajout des métadonnées
        legacy_results.update({
            "status": "success",
            "solver_version": "quantum-st-1.0",
            "global_kpis": {
                "total_water_consumption": round(total_water, 2),
                "n_nodes": validation.get('n_nodes', 0),
                # 🚩 Correction: Utilisation de n_variables pour l'affichage des équations
                "n_equations": len(ions) * validation.get('n_variables', 0), 
                "ions_calculated": ions
            }
        })
        
        await asyncio.sleep(0.05)

        yield json.dumps({
            "type": "result", 
            "data": legacy_results,
            "progress": 100
        }) + "\n"
        
    except Exception as e:
        logger.error(f"Erreur solver quantum-st: {str(e)}", exc_info=True)
        # 🚩 On s'assure d'inclure le message complet d'erreur de la librairie
        yield json.dumps({
            "type": "error", 
            "message": str(e),
            "details": "Une erreur est survenue lors de la résolution du système"
        }) + "\n"
        # Révèle l'exception pour être catchée par l'API (pour le 500 HTTP)
        raise