# apps/engine/tests/test_st_advanced.py
import pytest
import json
from domains.surface_treatment.solver import run_surface_simulation_stream

@pytest.mark.asyncio
async def test_cascade_and_evaporation_physics():
    # 1. SETUP NODES
    nodes = [
        {"id": "source", "type": "SOURCE", "label": "Water", "properties": {}},
        {
            "id": "bath", "type": "PROCESS_BATH", "label": "Hot Acid",
            "properties": {
                "length": 1000, "width": 1000, "temp": 70, # Evap calculation
                "hasEvaporation": True,
                "makeupSourceId": "source", # Automatic makeup
                "reagents": [{"productId": "product_a", "concentration": 100}]
            }
        },
        {
            "id": "rinse_1", "type": "RINSE_TANK", "label": "Dirty Rinse",
            "properties": {"overflowTargetId": "drain"}
        },
        {
            "id": "rinse_2", "type": "RINSE_TANK", "label": "Clean Rinse",
            "properties": {
                "manualFlowRate": 200, # Fresh water in
                "overflowTargetId": "rinse_1" # Cascade
            }
        },
        {"id": "drain", "type": "DRAIN", "label": "Exit", "properties": {}}
    ]

    # 2. SETUP LOGISTICS (Bath -> R1 -> R2)
    sequences = [{
        "id": "line_1", "steps": ["bath", "rinse_1", "rinse_2"],
        "properties": {"productionRate": 100, "dragOutSpecific": 0.1} # 10 L/h drag-out
    }]

    # 3. SETUP LIBRARY (Flattening: Product -> Reagent -> Ion)
    library = {
        "items": [
            {
                "id": "product_a", "name": "Commercial Acid", "category": "REAGENT",
                "composition": [{"childId": "ion_h", "coefficient": 0.5}] # 50% H+
            },
            {"id": "ion_h", "name": "Proton", "category": "ION", "properties": {}}
        ]
    }

    project_settings = {"hoursPerDay": 8, "daysPerWeek": 5} # 40h/week

    # 4. EXECUTE
    generator = run_surface_simulation_stream(nodes, [], sequences, library, project_settings)
    final_result = None
    async for chunk in generator:
        msg = json.loads(chunk)
        if msg["type"] == "result": final_result = msg["data"]

    # --- 5. PHYSICAL VERIFICATIONS ---
    details = final_result["node_details"]

    # A. Test Evaporation + Drag-out Compensation
    # Evap efficace = 4.2 L/h. Perte Drag-out = 10 L/h. 
    # Total "In" pour le bain doit être 14.2 L/h
    makeup = details["bath"]["hydraulics"]["in"]
    assert 14.1 < makeup < 14.3, f"Makeup logic failed. Expected ~14.2, got {makeup}"

    # B. Test Cascade Hydraulics (CORRIGÉ)
    # Rinse 2 reçoit 200 (eau) + 10 (pièces). Il déborde de 210 vers Rinse 1.
    # Rinse 1 reçoit 210 (eau) + 10 (pièces). Il sort 10 (pièces) + 210 (débordement).
    # Total "Out" de Rinse 1 = 220.0 L/h
    r1_out = details["rinse_1"]["hydraulics"]["out"]
    assert r1_out == 220.0, f"Cascade flow failed. Expected 220.0, got {r1_out}"



    # C. Test de l'Équilibre de Masse (Uniquement pour les cuves de process)
    # On crée un dictionnaire pour accéder facilement aux types des nœuds
    node_type_map = {n["id"]: n["type"] for n in nodes}

    for node_id, data in details.items():
        h = data["hydraulics"]
        n_type = node_type_map.get(node_id)

        # On n'équilibre pas les sources (elles fournissent) 
        # ni les drains (ils collectent)
        if n_type in ["SOURCE", "DRAIN", "UTILITY"]:
            continue 

        # Pour tout le reste (Bains, Rinçages), l'équilibre doit être parfait
        error_msg = f"Mass balance error in {node_id} ({n_type}): In={h['in']} != Out={h['out']}"
        assert abs(h["in"] - h["out"]) < 1e-3, error_msg

    print(f"\n✅ Advanced Physics Test Passed!")
    print(f"   - Bath Balance: {details['bath']['hydraulics']['in']} == {details['bath']['hydraulics']['out']} (OK)")
    print(f"   - Rinse 1 Balance: {details['rinse_1']['hydraulics']['in']} == {details['rinse_1']['hydraulics']['out']} (OK)")
