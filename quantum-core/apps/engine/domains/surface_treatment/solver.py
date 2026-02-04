# apps/engine/domains/surface_treatment/solver.py
import numpy as np
import json
import logging
import asyncio
from typing import List, Dict, Any, AsyncGenerator

# Import quantum-st (installé via pip)
from quantum_st import Workshop, ProcessNode, ProcessSequence, ProcessStep, Flow
from quantum_st.core.enums import NodeType, FlowType
from quantum_st.solver.stationary import StationarySolver
# 🚩 Import du solveur global pour les futurs domaines
from quantum_st.solver.global_solver import GlobalSolver 

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
    """
    try:
        # Étape 1: Construction du modèle
        yield json.dumps({
            "type": "log", 
            "message": "🔧 Construction du modèle topologique...", 
            "progress": 10
        }) + "\n"
        
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
        
        # 🚩 ENRICHISSEMENT du LOG : Afficher les issues de validation dans la console
        if not validation['valid']:
            yield json.dumps({
                "type": "warning",
                "message": f"Validation du modèle: {len(validation['issues'])} problèmes détectés. Voir les détails.",
                "details": validation['issues']
            }) + "\n"
            
            # 🚩 Loguer chaque issue pour le débug
            for issue in validation['issues']:
                 yield json.dumps({
                    "type": "log", 
                    "message": f" [Issue] {issue}", 
                    "progress": 12 
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
            if item.get('category') == 'ION'
        ]
        
        if not ions:
            ions = ["Zn2+", "Cl-", "Na+", "OH-", "SO4--", "H+", "Fe2+", "Al3+"]
            yield json.dumps({
                "type": "log",
                "message": f"⚠️ Aucun ion trouvé dans la librairie, utilisation des ions par défaut: {ions}"
            }) + "\n"
        
        await asyncio.sleep(0.05)

        # 🚩 Détermination du solveur (GlobalSolver si couplage, sinon Stationary)
        solver_class = GlobalSolver if len(workshop.lines) > 1 or len(workshop.get_coupling_matrix()) > 0 else StationarySolver
        
        # Étape 3: Résolution matricielle
        yield json.dumps({
            "type": "log", 
            "message": f"🧮 Initialisation {solver_class.__name__} ({len(ions)} ions, {validation.get('n_variables', 0)} variables)...", 
            "progress": 50
        }) + "\n"
        
        solver = solver_class(workshop)
        
        # Vérification critique des variables (0 variables mène au crash)
        if solver.builder.n == 0:
             raise ValueError("TOPOLOGY_ERROR: Aucun nœud variable (Rinçage/Stockage) trouvé. Le solveur ne peut rien calculer.")
        
        # Utilisation du solveur direct (sparse matrix)
        results_df = solver.solve(ions, method='direct')
        
        # Vérification des résultats
        if results_df.empty:
             # 🚩 LOG ENRICHI : Inclut le message pour 0 résultats (souvent lié à 0 débit)
             raise ValueError("MATH_ERROR: Le solveur n'a retourné aucun résultat. Vérifiez que les flux (Qd, Qhyd) sont > 0.")
        
        await asyncio.sleep(0.1)

        # Étape 4: Calcul des bilans globaux
        yield json.dumps({
            "type": "log", 
            "message": "📊 Calcul des bilans de masse et des KPI globaux...", 
            "progress": 75
        }) + "\n"
        
        # ... (Logique de calcul des KPIs globaux - conservée)
        total_water = 0.0
        for node_id, node_data in workshop.graph.nodes(data=True):
            node = node_data.get('data')
            if node and node.node_type == NodeType.SOURCE:
                for _, target, edge_data in workshop.graph.out_edges(node_id, data=True):
                    flow = edge_data.get('data')
                    if flow:
                        total_water += flow.flow_rate
        
        await asyncio.sleep(0.05)

        # Étape 5: Formatage des résultats pour le frontend
        yield json.dumps({
            "type": "log", 
            "message": "✅ Finalisation et formatage des données (Legacy)...", 
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
        # 🚩 CORRECTION: Supprimer le raise pour assurer une fermeture de flux propre (comme discuté)
        # On logue l'erreur complète sur le serveur pour le dev.
        logger.error(f"Erreur solver quantum-st (Final Catch): {str(e)}", exc_info=True)
        # On envoie un message d'erreur enrichi au client.
        yield json.dumps({
            "type": "error", 
            "message": str(e),
            "details": "Une erreur interne a arrêté la simulation. Voir le log pour le détail."
        }) + "\n"
        # 🚩 Le générateur se termine ici, fermant le flux de manière non-violente.