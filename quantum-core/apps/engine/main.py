import os
from fastapi import FastAPI, Header, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from domains.water.solver import run_water_simulation

app = FastAPI(title="Quantum Core Engine")
INTERNAL_SECRET = os.getenv("INTERNAL_API_SECRET", "secret")

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

async def verify_secret(x_internal_secret: str = Header(...)):
    if x_internal_secret != INTERNAL_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")

@app.post("/simulate", dependencies=[Depends(verify_secret)])
def simulate(payload: SimulationPayload):
    # STRATEGY PATTERN : On choisit le solveur selon le domaine
    if payload.domain == "WATER":
        return run_water_simulation(payload.nodes, payload.edges)
    
    # Prêt pour QuantumEnergy
    # elif payload.domain == "ENERGY":
    #     return run_energy_simulation(...)
    
    raise HTTPException(status_code=400, detail=f"Domaine {payload.domain} non supporté")