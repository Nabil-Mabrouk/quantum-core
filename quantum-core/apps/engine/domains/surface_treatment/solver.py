import numpy as np
import logging
import json
import asyncio

logger = logging.getLogger("st_solver")

async def run_surface_simulation_stream(nodes, edges, sequences, library, project_settings):
    """
    Advanced Surface Treatment Solver
    Handles: 24/7 Evaporation, Multi-Sequence Drag-out, Auto-Sprays, Matrix resolution.
    """
    yield json.dumps({"type": "log", "message": "Initialisation du moteur physique...", "progress": 5}) + "\n"
    
    node_map = {n['id']: i for i, n in enumerate(nodes)}
    N = len(nodes)
    
    # 1. TEMPORAL SETTINGS
    # Normalized to weekly basis to handle the 168h vs Working Hours paradox
    hours_day = float(project_settings.get('hoursPerDay', 8))
    days_week = float(project_settings.get('daysPerWeek', 5))
    working_hours_week = hours_day * days_week
    # Ratio to convert 24/7 continuous loss to an equivalent hourly rate during production
    time_ratio = 168.0 / working_hours_week if working_hours_week > 0 else 0

    results = {n['id']: {
        "flow": 0.0,
        "concentrations": {},
        "evaporation": 0.0,
        "water_makeup": 0.0,
        "warnings": []
    } for n in nodes}

    # 2. LOGISTICS: SUMMING ALL SEQUENCES
    drag_outs = np.zeros((N, N))
    for seq in sequences:
        props = seq.get('properties', {})
        # Hourly drag-out for this sequence
        q_d = float(props.get('cadence', 0)) * float(props.get('surfacePerPart', 0)) * float(props.get('dragOutSpecific', 0.1))
        steps = seq.get('steps', [])
        for i in range(len(steps) - 1):
            src, dst = node_map.get(steps[i]), node_map.get(steps[i+1])
            if src is not None and dst is not None:
                drag_outs[src, dst] += q_d

    # 3. HYDRAULICS: EVAPORATION & CASCADES
    water_flows = np.zeros((N, N))
    
    # Calculate Evaporation first
    for n in nodes:
        p = n['properties']
        if 'length' in p and 'width' in p:
            area = (float(p['length']) * float(p['width'])) / 1_000_000 # m2
            t_bath = float(p.get('temp', 20))
            t_workshop = float(project_settings.get('workshopTemp', 20))
            
            # Simple Evaporation Model (L/h per 168h)
            evap_base = area * (0.02 * (t_bath - t_workshop))
            if p.get('agitation') == 'AIR': evap_base *= 1.5
            if p.get('hasCover'): evap_base *= 0.1 # 90% reduction
            
            # Continuous loss (L/h)
            q_evap_cont = max(0, evap_base)
            results[n['id']]['evaporation'] = q_evap_cont
            
            # Effective loss to compensate during Working Hours
            q_evap_eff = q_evap_cont * time_ratio
            
            # Logic: Auto-Spray or Manual top-up
            if n['type'] == 'PROCESS_BATH' and p.get('hasSpray'):
                src_id = p.get('spraySourceId')
                if src_id in node_map:
                    water_flows[node_map[src_id], node_map[n['id']]] = q_evap_eff
    
    # Resolve Rinse Cascades & Fresh Water
    for n in nodes:
        if n['type'] == 'RINSE_TANK':
            p = n['properties']
            src_id = p.get('waterSourceId')
            if src_id and node_map.get(src_id) is not None:
                src_node = next((x for x in nodes if x['id'] == src_id), None)
                if src_node and src_node['type'] == 'SOURCE':
                    water_flows[node_map[src_id], node_map[n['id']]] = float(p.get('flowRate', 0))

    # Stabilize Gravity Overflows
    for _ in range(N):
        changed = False
        for n in nodes:
            idx = node_map[n['id']]
            q_in = sum(water_flows[:, idx])
            q_evap_eff = results[n['id']]['evaporation'] * time_ratio
            
            # Q_overflow = Inlets - Evaporation (Simplified)
            q_out = max(0, q_in - q_evap_eff)
            target_id = n['properties'].get('overflowTargetId')
            if target_id and target_id in node_map:
                t_idx = node_map[target_id]
                if abs(water_flows[idx, t_idx] - q_out) > 1e-6:
                    water_flows[idx, t_idx] = q_out
                    changed = True
        if not changed: break

    # 4. CHEMISTRY: IONIC BALANCE (Ax = b)
    yield json.dumps({"type": "log", "message": "Calcul des bilans ioniques...", "progress": 60}) + "\n"
    
    chem_ids = {c['chemId'] for n in nodes for c in n['properties'].get('components', []) if c.get('chemId')}
    
    for chem_id in chem_ids:
        A, b = np.zeros((N, N)), np.zeros(N)
        for i, n in enumerate(nodes):
            q_drag_out = sum(drag_outs[i, :])
            q_water_out = sum(water_flows[i, :])
            
            if n['type'] == 'PROCESS_BATH':
                # Dirichlet Condition: Fixed concentration
                target = next((c['concentration'] for c in n['properties'].get('components', []) if c.get('chemId') == chem_id), 0)
                A[i, i] = 1.0
                b[i] = target
            else:
                # Equilibrium: sum(In) = sum(Out)
                A[i, i] = max(q_drag_out + q_water_out, 1e-9)
                for j in range(N):
                    if drag_outs[j, i] > 0: A[i, j] -= drag_outs[j, i]
                    if water_flows[j, i] > 0: A[i, j] -= water_flows[j, i]

        try:
            x = np.linalg.solve(A, b)
            for i, val in enumerate(x):
                if val > 1e-5: results[nodes[i]['id']]['concentrations'][chem_id] = round(float(val), 4)
        except np.linalg.LinAlgError:
            results[nodes[0]['id']]['warnings'].append(f"Erreur convergence: {chem_id}")

    # Map hydraulics back to results
    for n in nodes:
        idx = node_map[n['id']]
        results[n['id']]['flow'] = sum(water_flows[:, idx])

    yield json.dumps({"type": "result", "data": {"status": "success", "node_details": results}}) + "\n"