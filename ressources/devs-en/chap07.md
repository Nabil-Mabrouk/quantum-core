---
title: "The Solver Interface & Physics Logic"
slug: "solver-interface-physics-logic"
published: true
tags: "Devs"
---

# The Solver Interface & Physics Logic

You have defined your inputs (Manifest) and your visuals (Registry). Now comes the most critical part: **The Physics.**

The Python Engine (`apps/engine`) is designed to be modular. It acts as a router that receives a standardized graph and dispatches it to a specific domain solver. This chapter explains how to implement the mathematical logic for your new **ENERGY** domain.

### 3.1 Directory Structure

The engine uses a package-based structure for domains.

1.  Navigate to `apps/engine/domains/`.
2.  Create a new folder matching your domain ID (lowercase): `energy/`.
3.  Create two files inside:
    *   `__init__.py`: (Can be empty)
    *   `solver.py`: This is where your code lives.

### 3.2 The Solver Contract

A solver in Quantum Core is an **Asynchronous Generator**. This allows it to stream progress logs to the UI in real-time before sending the final result.

**The Signature:**
```python
async def run_energy_simulation_stream(nodes, edges, sequences, library, project_settings):
    """
    Args:
        nodes (list): List of dicts representing equipment.
        edges (list): List of dicts representing connections (pipes/wires).
        sequences (list): Production sequences (if applicable).
        library (dict): The static knowledge base (fuels, materials).
        project_settings (dict): Global constants (hours/year, currency).
    
    Yields:
        str: JSON strings (Logs or Final Result).
    """
```

### 3.3 Implementing the Logic

Let's implement a simplified solver for our Boiler/Turbine example. We want to calculate the total energy produced and fuel consumed.

**File:** `apps/engine/domains/energy/solver.py`

```python
import json
import asyncio
import logging

logger = logging.getLogger("energy_solver")

async def run_energy_simulation_stream(nodes, edges, sequences, library, project_settings):
    # 1. NOTIFY UI: Calculation started
    yield json.dumps({"type": "log", "message": "Initializing Energy Model...", "progress": 10})
    await asyncio.sleep(0.1) # Simulate CPU work

    # 2. PREPARE DATA STRUCTURES
    results = {
        "node_details": {}, # Per-node results (to be mapped to SmartNodes)
        "kpis": [],         # Global Dashboard numbers
        "warnings": []
    }
    
    total_power_produced = 0.0
    total_fuel_consumed = 0.0

    # 3. THE PHYSICS LOOP (Simplified)
    # In a real scenario, you would build a Matrix (Ax=B) here using NumPy.
    
    yield json.dumps({"type": "log", "message": "Solving Mass & Energy Balances...", "progress": 50})

    for node in nodes:
        props = node.get('properties', {})
        node_res = {"warnings": []}
        
        # LOGIC FOR BOILERS
        if node['type'] == 'BOILER':
            # Inputs from UI fields
            power_out = float(props.get('power', 0)) # MW
            efficiency = float(props.get('efficiency', 0.9)) # 90% default
            
            # Physics: Fuel In = Power Out / Efficiency
            fuel_in = power_out / efficiency if efficiency > 0 else 0
            
            # Store results
            node_res['fuel_consumption'] = round(fuel_in, 2)
            node_res['steam_output'] = power_out
            
            total_fuel_consumed += fuel_in
            
        # LOGIC FOR TURBINES
        elif node['type'] == 'TURBINE':
            capacity = float(props.get('capacity', 0))
            # Mock logic: output depends on upstream connection
            # (In reality, traverse 'edges' to find the connected Boiler)
            actual_production = capacity * 0.85 
            
            node_res['rpm'] = 3000 # Static for demo
            node_res['production'] = actual_production
            
            total_power_produced += actual_production

        # Map results back to the Node ID
        results["node_details"][node['id']] = node_res

    # 4. FINALIZE GLOBAL KPIS
    yield json.dumps({"type": "log", "message": "Formatting Results...", "progress": 90})
    
    results["kpis"] = [
        {"label": "Total Power", "value": str(total_power_produced), "unit": "MW", "color": "text-blue-600"},
        {"label": "Fuel Input", "value": str(total_fuel_consumed), "unit": "MW", "color": "text-orange-600"},
        {"label": "System Efficiency", "value": f"{(total_power_produced/total_fuel_consumed*100):.1f}", "unit": "%", "color": "text-emerald-600"}
    ]

    # 5. SEND FINAL PAYLOAD
    # The type 'result' tells the UI to update the store
    yield json.dumps({"type": "result", "data": results})
```

### 3.4 Registering the Solver

Now you must tell the main API entry point about your new function.

**File:** `apps/engine/main.py`

1.  **Import your solver:**
    ```python
    from domains.energy.solver import run_energy_simulation_stream
    ```

2.  **Update the Router:**
    Look for the `/simulate-stream` endpoint. Add a condition for your domain ID.

    ```python
    @app.post("/simulate-stream", dependencies=[Depends(verify_secret)])
    async def simulate_stream(payload: SimulationPayload, request: Request):
        
        # ... existing logic ...

        if payload.domain == "ENERGY":
            try:
                return StreamingResponse(
                    run_energy_simulation_stream(
                        nodes_dict,
                        edges_dict,
                        sequences_dict,
                        payload.library,
                        payload.project_settings
                    ),
                    media_type="application/x-ndjson"
                )
            except Exception as e:
                # Error handling...
    ```

### 3.5 Mapping Results to UI

The connection between Python and React relies on the `node_details` dictionary key.

**In Python (`solver.py`):**
```python
results["node_details"]["node-123"] = { "rpm": 3000 }
```

**In React (`SmartNode.tsx` or `TurbineNode.tsx`):**
The UI automatically injects this dictionary into `data.properties.simulationResults`.

```typescript
// Inside your custom component
const rpm = data.properties.simulationResults?.rpm; // 3000
```

### 3.6 Best Practices: Using NumPy

For complex domains involving networks (pipes, cables), iterating through a list is not enough. You need to solve simultaneous equations.

**The Matrix Pattern:**
1.  **Map IDs to Indices:** `node_map = { node['id']: i for i, node in enumerate(nodes) }`
2.  **Build Adjacency Matrix:** Create an $N \times N$ matrix representing connections.
3.  **Build System Matrix ($A$):** Fill diagonal elements with flow capacities or resistances.
4.  **Solve:** `x = np.linalg.solve(A, b)`

*Refer to `apps/engine/domains/surface_treatment/solver.py` for a full implementation of the Matrix Pattern.*

