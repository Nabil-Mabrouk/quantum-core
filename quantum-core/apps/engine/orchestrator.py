# FILE: apps/engine/orchestrator.py
import logging
from collections import deque
from typing import List, Dict, Any
from domains.water.solver import run_water_simulation

logger = logging.getLogger("orchestrator")

def solve(payload: Any):
    """
    Point d'entrée principal pour la résolution d'un projet "System of Systems".
    Gère le mélange des flux si plusieurs nœuds écrivent dans le même ProjectStream.
    """
    domain = payload.domain
    systems = payload.systems
    
    # Initialisation du registre des flux avec des valeurs à zéro pour permettre l'agrégation
    streams_registry = {
        s.id: {
            "name": s.name, 
            "value": {"flow": 0.0, "concentrations": {}}
        } for s in payload.streams
    }

    # --- ÉTAPE 1 : CALCUL DE L'ORDRE D'EXÉCUTION ---
    try:
        execution_order = calculate_execution_order(systems)
    except ValueError as e:
        return {
            "status": "error",
            "error_type": "TOPOLOGY_ERROR",
            "message": str(e)
        }

    # --- ÉTAPE 2 : VALIDATION DE L'INTÉGRITÉ ---
    validation_errors = validate_streams_integrity(systems, streams_registry)
    if validation_errors:
        return {
            "status": "error",
            "error_type": "VALIDATION_ERROR",
            "messages": validation_errors
        }

    global_results = {
        "systems": {},
        "streams": {}
    }

    # --- ÉTAPE 3 : BOUCLE DE RÉSOLUTION SÉQUENTIELLE ---
    for system_id in execution_order:
        system = next(sys for sys in systems if sys.id == system_id)
        logger.info(f"Résolution du système : {system.id} ({system.type})")
        
        # A. INJECTION DES ENTRÉES DEPUIS LE BUS (INPUTS)
        for node in system.nodes:
            if node.inputStreamId and node.inputStreamId in streams_registry:
                stream_data = streams_registry[node.inputStreamId]["value"]
                
                # Injection dans les propriétés du node pour le solver local
                node.properties["inletFlow"] = stream_data.get("flow", 0)
                node.properties["externalConcentrations"] = stream_data.get("concentrations", {})
                logger.info(f"  > Node {node.id} reçoit du bus {node.inputStreamId}: {node.properties['inletFlow']} L/h")

        # B. EXÉCUTION DU SOLVER LOCAL
        if domain == "WATER":
            res = run_water_simulation(system.nodes, system.edges, system.sequences, payload.library)
        else:
            res = {"status": "error", "message": f"Domaine {domain} non supporté"}

        if res.get("status") == "success":
            global_results["systems"][system_id] = res
            
            # C. CAPTURE DES SORTIES AVEC MÉLANGE (OUTPUTS)
            for node in system.nodes:
                if node.outputStreamId and node.outputStreamId in streams_registry:
                    node_res = res["node_details"].get(node.id, {})
                    
                    # Données actuelles du bus
                    current_bus = streams_registry[node.outputStreamId]["value"]
                    
                    # Données apportées par ce nouveau nœud
                    added_flow = float(node_res.get("flow", 0))
                    added_concs = node_res.get("concentrations", {})

                    # CALCUL DU MÉLANGE PHYSIQUE (Mass Balance)
                    # Nouveau Débit = Somme des débits
                    new_total_flow = current_bus["flow"] + added_flow
                    new_combined_concs = {}

                    if new_total_flow > 0:
                        # Liste unique de tous les ions présents dans les deux flux
                        all_ions = set(list(current_bus["concentrations"].keys()) + list(added_concs.keys()))
                        
                        for ion in all_ions:
                            # Masse 1 + Masse 2
                            m1 = current_bus["flow"] * current_bus["concentrations"].get(ion, 0)
                            m2 = added_flow * added_concs.get(ion, 0)
                            # Nouvelle Concentration = Masse Totale / Débit Total
                            new_combined_concs[ion] = round((m1 + m2) / new_total_flow, 4)

                    # Mise à jour du registre
                    updated_value = {
                        "flow": round(new_total_flow, 2),
                        "concentrations": new_combined_concs
                    }
                    streams_registry[node.outputStreamId]["value"] = updated_value
                    global_results["streams"][node.outputStreamId] = updated_value
                    
                    logger.info(f"  < Node {node.id} alimente bus {node.outputStreamId}. Nouveau total: {updated_value['flow']} L/h")
        else:
            return {
                "status": "error",
                "message": f"Échec de résolution du système {system.id}: {res.get('message')}"
            }

    return {
        "status": "success",
        "projectId": payload.projectId,
        "results": global_results
    }

def validate_streams_integrity(systems: List[Any], streams_registry: Dict[str, Any]) -> List[str]:
    """
    Vérifie les erreurs de configuration du bus.
    Note: Plusieurs sorties vers le même flux sont désormais autorisées (mélange).
    """
    errors = []
    for sys in systems:
        for node in sys.nodes:
            # Vérifier si un système tente de lire un flux qui n'est pas déclaré dans le projet
            if node.inputStreamId and node.inputStreamId not in streams_registry:
                errors.append(f"Erreur de bus : Le système '{sys.id}' (noeud {node.id}) tente de lire le flux '{node.inputStreamId}' qui n'existe pas dans le projet.")
    return errors

def calculate_execution_order(systems: List[Any]) -> List[str]:
    """
    Algorithme de Kahn (Tri Topologique).
    Détermine l'ordre de calcul pour que les producteurs soient calculés avant les consommateurs.
    """
    # 1. stream_id -> system_id_producteur (mapping des dépendances)
    producers = {}
    for sys in systems:
        for node in sys.nodes:
            if node.outputStreamId:
                # Note: Un flux peut avoir plusieurs producteurs, on les stocke tous
                if node.outputStreamId not in producers:
                    producers[node.outputStreamId] = []
                producers[node.outputStreamId].append(sys.id)

    # 2. Construction du graphe
    adj = {sys.id: [] for sys in systems}
    in_degree = {sys.id: 0 for sys in systems}

    for sys in systems:
        for node in sys.nodes:
            if node.inputStreamId:
                source_sys_ids = producers.get(node.inputStreamId, [])
                for source_id in source_sys_ids:
                    if source_id != sys.id: # Éviter l'auto-dépendance
                        adj[source_id].append(sys.id)
                        in_degree[sys.id] += 1

    # 3. Tri
    queue = deque([sid for sid in in_degree if in_degree[sid] == 0])
    order = []

    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    if len(order) != len(systems):
        raise ValueError("Boucle de dépendance (cycle) détectée entre les systèmes. Le recyclage inter-systèmes direct n'est pas supporté.")

    return order