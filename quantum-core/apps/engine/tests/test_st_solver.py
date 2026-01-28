# apps/engine/tests/test_st_solver.py
import pytest
import json
import asyncio
from domains.surface_treatment.solver import run_surface_simulation_stream

@pytest.mark.asyncio
async def test_simple_dilution_logic():
    # 1. PRÉPARATION DES DONNÉES (Mock du payload Studio)
    nodes = [
        {
            "id": "node_bath",
            "type": "PROCESS_BATH",
            "label": "Bain Actif",
            "properties": {
                "reagents": [{"productId": "prod_caustic", "concentration": 100}]
            }
        },
        {
            "id": "node_rinse",
            "type": "RINSE_TANK",
            "label": "Rinçage",
            "properties": {
                "manualFlowRate": 90, # 90 L/h d'eau neuve
                "overflowTargetId": "node_drain"
            }
        },
        {
            "id": "node_drain",
            "type": "DRAIN",
            "label": "Egout",
            "properties": {}
        }
    ]

    sequences = [
        {
            "id": "seq_1",
            "name": "Production",
            "steps": ["node_bath", "node_rinse"],
            "properties": {
                "productionRate": 100,      # 100 m2/h
                "dragOutSpecific": 0.1      # 0.1 L/m2 -> Total 10 L/h
            }
        }
    ]

    library = {
        "items": [
            {
                "id": "prod_caustic",
                "name": "Soude",
                "category": "REAGENT",
                "properties": {},
                "composition": [{"childId": "ion_na", "coefficient": 1.0}] # 1g de soude = 1g de Na
            },
            {
                "id": "ion_na",
                "name": "Sodium",
                "category": "ION",
                "properties": {}
            }
        ]
    }

    project_settings = {
        "hoursPerDay": 8,
        "daysPerWeek": 5,
        "workshopTemp": 20
    }

    # 2. EXÉCUTION DU SOLVEUR
    generator = run_surface_simulation_stream(nodes, [], sequences, library, project_settings)
    
    final_result = None
    async for chunk in generator:
        data = json.loads(chunk)
        if data["type"] == "result":
            final_result = data["data"]

    # 3. VERIFICATIONS (ASSERTIONS)
    assert final_result is not None
    details = final_result["node_details"]

    # Vérification de la concentration dans le rinçage (Doit être 10.0 g/L)
    # Formule : (10 L/h * 100 g/L) / (10 L/h + 90 L/h) = 10 g/L
    rinse_conc = details["node_rinse"]["concentrations"]["ion_na"]
    assert rinse_conc == 10.0, f"La concentration devrait être 10.0, reçu {rinse_conc}"

    # Vérification du flux à l'égout (100 L/h)
    drain_flow = details["node_drain"]["hydraulics"]["in"]
    assert drain_flow == 100.0, f"Le débit de purge devrait être 100.0, reçu {drain_flow}"

    print("\n✅ Test de dilution physique et structurelle réussi !")

if __name__ == "__main__":
    asyncio.run(test_simple_dilution_logic())