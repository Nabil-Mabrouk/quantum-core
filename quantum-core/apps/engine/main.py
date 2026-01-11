import os
import logging
from fastapi import FastAPI, Header, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from numpy.linalg import LinAlgError

# Imports des domaines
from domains.water.solver import run_water_simulation, evaluate_water_node
from domains.water.proposal import generate_water_proposal
# L'orchestrateur gère la logique multi-systèmes
import orchestrator 

# Configuration du Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("quantum-core-engine")

app = FastAPI(
    title="Quantum Core Engine",
    description="Calculateur scientifique pour l'ingénierie (Eau, Énergie, Systèmes)",
    version="2.1.0"
)

INTERNAL_SECRET = os.getenv("INTERNAL_API_SECRET")

# --- MODÈLES DE DONNÉES (Pydantic) ---

class Node(BaseModel):
    id: str
    type: str
    properties: Dict[str, Any] = {}
    # Nouveaux champs pour le Bus de Données (System of Systems)
    inputStreamId: Optional[str] = None
    outputStreamId: Optional[str] = None

class Edge(BaseModel):
    source: str
    target: str
    properties: Dict[str, Any] = {}

class Sequence(BaseModel):
    id: str
    name: Optional[str] = "Gamme"
    steps: List[str]  # Liste des IDs de noeuds
    properties: Dict[str, Any] = {}

class ProjectStream(BaseModel):
    id: str
    name: str
    value: Dict[str, Any] = Field(default_factory=dict) # Stocke {flow, concentrations...}

class SystemPayload(BaseModel):
    id: str
    type: str = "PRODUCTION"
    nodes: List[Node]
    edges: List[Edge]
    sequences: List[Sequence] = []

class SimulationPayload(BaseModel):
    """Payload pour simuler un seul système isolé."""
    domain: str
    nodes: List[Node]
    edges: List[Edge]
    sequences: List[Sequence] = []
    library: Optional[Dict[str, Any]] = None

class ProjectPayload(BaseModel):
    """Payload pour simuler un projet complet (System of Systems)."""
    projectId: str
    domain: str
    systems: List[SystemPayload]
    streams: List[ProjectStream]
    library: Optional[Dict[str, Any]] = None

# --- MIDDLEWARE DE SÉCURITÉ ---

async def verify_secret(x_internal_secret: str = Header(None)):
    """Vérifie que l'appel provient bien du Studio via le secret partagé."""
    if not INTERNAL_SECRET or x_internal_secret != INTERNAL_SECRET:
        logger.warning("Tentative d'accès non autorisée rejetée.")
        raise HTTPException(status_code=403, detail="Forbidden: Invalid API Secret")

# --- ROUTES API ---

@app.post("/simulate", dependencies=[Depends(verify_secret)])
def simulate(payload: SimulationPayload):
    """
    Simule un système unique de manière isolée.
    Utilisé par l'éditeur détaillé pour les retours temps réel.
    """
    if payload.domain == "WATER":
        try:
            return run_water_simulation(
                payload.nodes, 
                payload.edges, 
                payload.sequences, 
                payload.library
            )
        except LinAlgError:
            raise HTTPException(
                status_code=400, 
                detail="Erreur mathématique : La matrice est singulière. Vérifiez les boucles ou les absences de sortie."
            )
    
    # Prêt pour d'autres domaines (ex: ENERGY)
    # elif payload.domain == "ENERGY":
    #     return run_energy_simulation(...)

    raise HTTPException(status_code=400, detail=f"Domaine {payload.domain} non supporté")

@app.post("/solve-project", dependencies=[Depends(verify_secret)])
def solve_project(payload: ProjectPayload):
    """
    Orchestrateur Global : Résout l'ensemble des systèmes d'un projet.
    Fait circuler les données entre les systèmes via les ProjectStreams.
    """
    logger.info(f"Résolution globale demandée pour le projet: {payload.projectId}")
    try:
        return orchestrator.solve(payload)
    except Exception as e:
        logger.error(f"Erreur d'orchestration : {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la résolution globale : {str(e)}")

@app.post("/evaluate-node", dependencies=[Depends(verify_secret)])
def evaluate_node(payload: Dict[str, Any]):
    """
    Calcul rapide pour un noeud unique (ex: évaporation d'une cuve).
    Utilisé pour mettre à jour les propriétés 'computed' pendant la saisie.
    """
    domain = payload.get("domain")
    node_type = payload.get("node_type")
    properties = payload.get("properties", {})

    if domain == "WATER":
        return evaluate_water_node(node_type, properties)
    
    return {"computed": {}}

@app.post("/generate-proposal", dependencies=[Depends(verify_secret)])
def generate_proposal(payload: SimulationPayload):
    """
    Génère une analyse textuelle/technique basée sur l'état du système.
    """
    if payload.domain == "WATER":
        proposal = generate_water_proposal(payload.nodes, payload.edges)
        return {"proposal": proposal}
    
    raise HTTPException(status_code=400, detail="Génération non supportée pour ce domaine")

@app.post("/project-summary", dependencies=[Depends(verify_secret)])
def project_summary(payload: Dict[str, Any]):
    """
    Endpoint de résumé (Legacy). 
    Note: Devrait être migré vers /solve-project côté Frontend.
    """
    # ... (Garder la logique d'agrégation simple si nécessaire)
    return {"status": "deprecated", "message": "Utilisez /solve-project pour les bilans multi-systèmes"}

# --- EXÉCUTION ---

if __name__ == "__main__":
    import uvicorn
    # En développement, on active le reload
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)