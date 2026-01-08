import os
from fastapi import FastAPI, Header, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from domains.water.solver import run_water_simulation
from domains.water.proposal import generate_water_proposal
from numpy.linalg import LinAlgError

app = FastAPI(title="Quantum Core Engine")
INTERNAL_SECRET = os.getenv("INTERNAL_API_SECRET")

class Node(BaseModel):
    id: str
    type: str
    properties: Dict[str, Any]

class Edge(BaseModel):
    source: str
    target: str
    properties: Dict[str, Any]

class SimulationPayload(BaseModel):
    domain: str
    nodes: List[Node]
    edges: List[Edge]

async def verify_secret(x_internal_secret: str = Header(None)):
    if not INTERNAL_SECRET or x_internal_secret != INTERNAL_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")

@app.post("/simulate", dependencies=[Depends(verify_secret)])
def simulate(payload: SimulationPayload):
    # STRATEGY PATTERN : On choisit le solveur selon le domaine
    if payload.domain == "WATER":
        try:
            return run_water_simulation(payload.nodes, payload.edges)
        except LinAlgError:
            raise HTTPException(status_code=400, detail="La simulation d'eau n'a pas pu être résolue. Vérifiez la configuration de votre modèle (e.g., pas de chemins de sortie, matrice singulière).")
    
    # Prêt pour QuantumEnergy
    # elif payload.domain == "ENERGY":
    #     return run_energy_simulation(...)
    
    raise HTTPException(status_code=400, detail=f"Domaine {payload.domain} non supporté")

@app.post("/generate-proposal", dependencies=[Depends(verify_secret)])
def generate_proposal(payload: SimulationPayload):
    # STRATEGY PATTERN : On choisit le générateur selon le domaine
    if payload.domain == "WATER":
        proposal = generate_water_proposal(payload.nodes, payload.edges)
        return {"proposal": proposal}
    
    raise HTTPException(status_code=400, detail=f"Le domaine {payload.domain} n'est pas supporté pour la génération de propositions.")