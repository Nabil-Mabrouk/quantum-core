import logging
import json
import asyncio
from collections import deque
from typing import List, Dict, Any

# Import du solveur
from domains.surface_treatment.solver import run_surface_simulation_stream

logger = logging.getLogger("orchestrator")

async def solve(payload: Any):
    """
    Point d'entrée principal pour la résolution d'un projet "System of Systems".
    """
    domain = payload.domain
    systems = payload.systems
    
    # Registre des flux (Bus de données)
    streams_registry = {
        s.id: {
            "name": s.name, 
            "value": {"flow": 0.0, "concentrations": {}}
        } for s in payload.streams
    }

    # 1. Calcul de l'ordre
    try:
        execution_order = calculate_execution_order(systems)
    except ValueError as e:
        return {"status": "error", "error_type": "TOPOLOGY_ERROR", "message": str(e)}

    global_results = { "systems": {}, "streams": {} }

    # 2. Boucle de résolution
    for system_id in execution_order:
        system = next(sys for sys in systems if sys.id == system_id)
        logger.info(f"Résolution du système : {system.id} ({system.type})")
        
        # A. Injection des Inputs depuis le Bus
        for node in system.nodes:
            if node.inputStreamId and node.inputStreamId in streams_registry:
                stream_data = streams_registry[node.inputStreamId]["value"]
                node.properties["inletFlow"] = stream_data.get("flow", 0)
                # Optionnel : injecter aussi les concentrations entrantes si le solveur le supporte

        # B. Exécution du Solver Local
        res = None
        if domain == "SURFACE_TREATMENT":
            
            # --- CORRECTION CRITIQUE : Conversion Pydantic -> Dict ---
            nodes_dict = [n.model_dump() for n in system.nodes]
            edges_dict = [e.model_dump() for e in system.edges]
            seqs_dict = [s.model_dump() for s in system.sequences]

            # Appel du générateur
            gen = run_surface_simulation_stream(
                nodes_dict, 
                edges_dict, 
                seqs_dict, 
                payload.library,
                payload.project_settings
            )
            
            # Consommation du flux pour obtenir le résultat final
            async for chunk in gen:
                try:
                    msg = json.loads(chunk)
                    if msg['type'] == 'result':
                        res = msg['data']
                    elif msg['type'] == 'error':
                        return {"status": "error", "message": msg['message']}
                except:
                    pass
        else:
            return {"status": "error", "message": f"Domaine {domain} non supporté"}

        if res and res.get("status") == "success":
            global_results["systems"][system_id] = res
            
            # C. Publication des Outputs vers le Bus
            for node in system.nodes:
                if node.outputStreamId and node.outputStreamId in streams_registry:
                    node_res = res["node_details"].get(node.id, {})
                    
                    current_bus = streams_registry[node.outputStreamId]["value"]
                    
                    added_flow = float(node_res.get("flow", 0))
                    added_concs = node_res.get("concentrations", {})

                    # Mélange Physique (Moyenne pondérée par le débit)
                    new_total_flow = current_bus["flow"] + added_flow
                    new_combined_concs = {}

                    if new_total_flow > 0:
                        all_ions = set(list(current_bus.get("concentrations", {}).keys()) + list(added_concs.keys()))
                        for ion in all_ions:
                            m1 = current_bus["flow"] * current_bus.get("concentrations", {}).get(ion, 0)
                            m2 = added_flow * added_concs.get(ion, 0)
                            new_combined_concs[ion] = round((m1 + m2) / new_total_flow, 4)

                    updated_value = {
                        "flow": round(new_total_flow, 2),
                        "concentrations": new_combined_concs
                    }
                    streams_registry[node.outputStreamId]["value"] = updated_value
                    global_results["streams"][node.outputStreamId] = updated_value
                    
                    logger.info(f"  < Node {node.id} publie vers {node.outputStreamId}: {updated_value['flow']} L/h")
        else:
            return {"status": "error", "message": f"Échec résolution {system.id}"}

    return {
        "status": "success",
        "projectId": payload.projectId,
        "results": global_results
    }

def calculate_execution_order(systems: List[Any]) -> List[str]:
    # Mapping Stream -> Producer System
    producers = {}
    for sys in systems:
        for node in sys.nodes:
            if node.outputStreamId:
                if node.outputStreamId not in producers:
                    producers[node.outputStreamId] = []
                producers[node.outputStreamId].append(sys.id)

    # Graphe de dépendance
    adj = {sys.id: [] for sys in systems}
    in_degree = {sys.id: 0 for sys in systems}

    for sys in systems:
        for node in sys.nodes:
            if node.inputStreamId:
                source_sys_ids = producers.get(node.inputStreamId, [])
                for source_id in source_sys_ids:
                    if source_id != sys.id:
                        adj[source_id].append(sys.id)
                        in_degree[sys.id] += 1

    # Algorithme de Kahn
    queue = deque([sid for sid in in_degree if in_degree[sid] == 0])
    order = []

    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    # Fallback si cycle
    if len(order) != len(systems):
        return [sys.id for sys in systems] 

    return order