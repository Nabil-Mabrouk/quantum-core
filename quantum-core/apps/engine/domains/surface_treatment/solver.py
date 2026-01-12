import numpy as np
import logging
import json
import asyncio

logger = logging.getLogger("surface-solver")

def get_ion_ratio(library_item, ion_id):
    if not library_item or 'composition' not in library_item: return 0.0
    for comp in library_item['composition']:
        if comp['baseUnitId'] == ion_id: return float(comp['coefficient'])
    return 0.0

# --- NOTEZ LE CHANGEMENT ICI : async def ... yield ---
async def run_surface_simulation_stream(nodes, edges, sequences, library, project_settings=None):
    
    # 1. INITIALISATION
    yield json.dumps({"type": "log", "message": "Initialisation du graphe...", "progress": 5}) + "\n"
    await asyncio.sleep(0.05) # Petit délai pour l'UX

    try:
        N = len(nodes)
        node_map = {n['id']: i for i, n in enumerate(nodes)}
        
        if project_settings is None: project_settings = {}
        profiles = project_settings.get('profiles', {})
        prod_hours = float(profiles.get('production', 2000))
        heat_hours = float(profiles.get('heating', 8760))

        lib_map = {item['id']: item for item in library.get('referenceItems', [])}
        active_ions = set()
        for item in lib_map.values():
            for comp in item.get('composition', []):
                active_ions.add(comp['baseUnitId'])
        sorted_ions = sorted(list(active_ions))

        yield json.dumps({"type": "log", "message": f"Analyse de {len(sorted_ions)} espèces chimiques...", "progress": 15}) + "\n"

        results = {n['id']: {"concentrations": {}, "warnings": [], "flow_balance": {}} for n in nodes}

        # 2. BOUCLE DE RÉSOLUTION
        total_steps = len(sorted_ions)
        
        for idx, ion_id in enumerate(sorted_ions):
            # Feedback temps réel
            progress = 20 + int((idx / max(1, total_steps)) * 70)
            yield json.dumps({
                "type": "log", 
                "message": f"Résolution matrice: {ion_id}...", 
                "progress": progress
            }) + "\n"
            
            # Permet au serveur de respirer et d'accepter une annulation client
            await asyncio.sleep(0.02) 

            # --- CONSTRUCTION MATRICE (Logique identique à avant) ---
            A = np.zeros((N, N))
            B = np.zeros(N)
            
            for i, node in enumerate(nodes):
                props = node.get('properties', {})
                node_type = node.get('type')

                # Drag-out
                for seq in sequences:
                    steps = seq.get('steps', [])
                    seq_props = seq.get('properties', {})
                    if node['id'] in steps:
                        step_idx = steps.index(node['id'])
                        if step_idx < len(steps) - 1:
                            cadence = float(seq_props.get('cadence', 0))
                            unit_drag = float(seq_props.get('dragOut', 0))
                            if 'dragOut' in props and float(props['dragOut']) > 0:
                                q_drag_base = float(props['dragOut'])
                            else:
                                q_drag_base = cadence * unit_drag
                            
                            efficiency = float(props.get('sprayEfficiency', 50)) / 100.0 if props.get('hasSpray') else 0.0
                            q_drag = q_drag_base * (1.0 - efficiency)
                            
                            A[i, i] += q_drag
                            if steps[step_idx + 1] in node_map:
                                j = node_map[steps[step_idx + 1]]
                                A[j, i] -= q_drag

                # Edges (Pipes)
                for edge in [e for e in edges if e['source'] == node['id']]:
                    e_props = edge.get('properties', {})
                    target = edge['target']
                    if target in node_map:
                        j = node_map[target]
                        q_pipe = float(e_props.get('flowRate', 0)) if e_props.get('type') == 'PUMP' else float(props.get('inletFlow', 100))
                        A[i, i] += q_pipe
                        A[j, i] -= q_pipe

                # Wireless (Dump/Overflow/Comp)
                if 'dumpingEvents' in props:
                    q_dump = (float(props.get('volume',0)) * float(props['dumpingEvents'])) / max(1, prod_hours)
                    A[i, i] += q_dump
                    if props.get('dumpingNetworkId') in node_map:
                        A[node_map[props['dumpingNetworkId']], i] -= q_dump
                
                overflow_id = props.get('overflowNetworkId')
                if overflow_id and overflow_id in node_map:
                    q_over = float(props.get('inletFlow', 0))
                    A[i, i] += q_over
                    A[node_map[overflow_id], i] -= q_over

                comp_id = props.get('compensationSourceId')
                if comp_id and comp_id in node_map:
                    j = node_map[comp_id]
                    q_comp = float(props.get('_normalized_evaporationRate', 0)) # Déjà calculé par le TS
                    if q_comp > 0:
                        A[j, j] += q_comp
                        A[i, j] -= q_comp

                # Source Term (B)
                if node_type == 'PROCESS_BATH':
                    target_conc = 0.0
                    for comp in props.get('components', []):
                        chem_id = comp.get('chemId') or comp.get('id')
                        if chem_id in lib_map:
                            ratio = get_ion_ratio(lib_map[chem_id], ion_id)
                            target_conc += float(comp.get('concentration', 0)) * ratio
                    
                    if target_conc > 0:
                        A[i, :] = 0
                        A[i, i] = 1
                        B[i] = target_conc

            # Résolution
            for k in range(N):
                if A[k, k] == 0: A[k, k] = 1.0
            
            try:
                X = np.linalg.solve(A, B)
                for i, val in enumerate(X):
                    if val > 1e-5:
                        results[nodes[i]['id']]["concentrations"][ion_id] = round(float(val), 4)
            except np.linalg.LinAlgError:
                yield json.dumps({"type": "log", "message": f"⚠️ Matrice singulière pour {ion_id}"}) + "\n"

        # 3. FINALISATION
        yield json.dumps({"type": "log", "message": "Calculs terminés. Compilation...", "progress": 95}) + "\n"
        
        # Envoi du payload final
        final_payload = {
            "status": "success",
            "node_details": results
        }
        yield json.dumps({"type": "result", "data": final_payload}) + "\n"

    except Exception as e:
        logger.error(f"Solver Error: {e}")
        yield json.dumps({"type": "error", "message": str(e)}) + "\n"