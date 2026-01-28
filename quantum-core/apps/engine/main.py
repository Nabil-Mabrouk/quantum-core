# apps/engine/main.py
import os
import logging
import json
import asyncio
import secrets  # Pour une comparaison de secret sécurisée
from fastapi import FastAPI, Header, HTTPException, Depends, Request 
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Callable

# --- REGISTRE DES SOLVEURS (ENGINEERING OS PATTERN) ---
# Centralise ici les points d'entrée des domaines. 
# main.py ne connaît plus la logique interne des domaines.
from domains.surface_treatment.solver import run_surface_simulation_stream

SOLVER_REGISTRY: Dict[str, Callable] = {
    "SURFACE_TREATMENT": run_surface_simulation_stream,
    # "AI_FACTORY": run_ai_factory_stream, <-- Futur domaine
}

import orchestrator 

# --- CONFIGURATION DU LOGGING (JSON) ---
class JsonFormatter(logging.Formatter):
    STANDARD_ATTRS = {
        'args', 'asctime', 'created', 'exc_info', 'exc_text', 'filename',
        'funcName', 'levelname', 'levelno', 'lineno', 'module',
        'msecs', 'message', 'msg', 'name', 'pathname', 'process',
        'processName', 'relativeCreated', 'stack_info', 'thread', 'threadName'
    }

    def format(self, record):
        log_entry = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "module": record.module,
            "lineNo": record.lineno,
        }
        if record.exc_info:
            log_entry["exc_info"] = self.formatException(record.exc_info)
        for key, value in record.__dict__.items():
            if key not in self.STANDARD_ATTRS and not key.startswith('_'):
                log_entry[key] = value
        return json.dumps(log_entry)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("quantum-core-engine")

console_handler = logging.StreamHandler()
console_handler.setFormatter(JsonFormatter())
logger.handlers = [console_handler]
logger.propagate = False

# --- INITIALISATION ---
app = FastAPI(
    title="Quantum Core Engine",
    description="Engineering OS Multi-Domaine",
    version="4.0.0"
)

INTERNAL_SECRET = os.getenv("INTERNAL_API_SECRET")

@app.on_event("startup")
async def startup_event():
    if not INTERNAL_SECRET:
        logger.error("CRITICAL: INTERNAL_API_SECRET is not set in environment variables!")
        # En production, on pourrait forcer l'arrêt ici

# --- MODÈLES DE DONNÉES (Génériques) ---

class Node(BaseModel):
    id: str
    type: str
    properties: Dict[str, Any] = {}
    inputStreamId: Optional[str] = None
    outputStreamId: Optional[str] = None

class Edge(BaseModel):
    source: str
    target: str
    type: Optional[str] = "DEFAULT"
    properties: Dict[str, Any] = {}

class Sequence(BaseModel):
    id: str
    name: Optional[str] = "Sequence"
    steps: List[str]
    properties: Dict[str, Any] = {}

class ProjectStream(BaseModel):
    id: str
    name: str
    value: Dict[str, Any] = Field(default_factory=dict)

class SystemPayload(BaseModel):
    id: str
    type: str = "PRODUCTION"
    nodes: List[Node]
    edges: List[Edge]
    sequences: List[Sequence] = []

class SimulationPayload(BaseModel):
    domain: str
    nodes: List[Node]
    edges: List[Edge]
    sequences: List[Sequence] = []
    library: Optional[Dict[str, Any]] = None
    project_settings: Optional[Dict[str, Any]] = {}

class ProjectPayload(BaseModel):
    projectId: str
    domain: str
    systems: List[SystemPayload]
    streams: List[ProjectStream]
    library: Optional[Dict[str, Any]] = None
    project_settings: Optional[Dict[str, Any]] = {}

# --- SÉCURITÉ ---

async def verify_secret(x_internal_secret: str = Header(None)):
    """
    Vérification Zero-Trust avec protection contre les attaques temporelles.
    """
    if not INTERNAL_SECRET:
        raise HTTPException(status_code=500, detail="Server misconfigured: Secret missing")
    
    # compare_digest évite de révéler quelle partie du secret est correcte via le temps de réponse
    if not x_internal_secret or not secrets.compare_digest(x_internal_secret, INTERNAL_SECRET):
        logger.warning("Tentative d'accès non autorisée rejetée.")
        raise HTTPException(status_code=403, detail="Forbidden: Invalid API Secret")

# --- ROUTES API ---

@app.post("/simulate-stream", dependencies=[Depends(verify_secret)])
async def simulate_stream(payload: SimulationPayload):
    """
    Endpoint de Streaming Agnostique.
    Détermine le solveur dynamiquement via le registre.
    """
    logger.info(f"Simulation demandée pour le domaine: {payload.domain}")

    solver_func = SOLVER_REGISTRY.get(payload.domain)
    
    if not solver_func:
        logger.error(f"Domaine non supporté: {payload.domain}")
        raise HTTPException(status_code=400, detail=f"Domaine {payload.domain} non supporté par ce moteur.")

    try:
        # Conversion unique du payload pour NumPy/Logic métier
        # model_dump est plus performant que json.loads(payload.json())
        data = payload.model_dump()

        return StreamingResponse(
            solver_func(
                data['nodes'],
                data['edges'],
                data['sequences'],
                data['library'],
                data['project_settings']
            ),
            media_type="application/x-ndjson"
        )
    except Exception as e:
        logger.error(f"Erreur Solveur [{payload.domain}]: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erreur interne du solveur: {str(e)}")


@app.post("/simulate", dependencies=[Depends(verify_secret)])
async def simulate(payload: SimulationPayload):
    """
    Version Synchrone de /simulate-stream. 
    Utile pour les outils de test ou les intégrations Legacy.
    """
    # On réutilise la logique de streaming mais on consomme tout avant de répondre
    response = await simulate_stream(payload)
    
    final_result = None
    errors = []

    async for chunk in response.body_iterator:
        if not chunk.strip(): continue
        for line in chunk.decode().split('\n'):
            if not line.strip(): continue
            try:
                msg = json.loads(line)
                if msg.get('type') == 'result':
                    final_result = msg['data']
                elif msg.get('type') == 'error':
                    errors.append(msg['message'])
            except json.JSONDecodeError:
                continue

    if errors:
        raise HTTPException(status_code=400, detail=errors)
    
    if final_result:
        return final_result
    
    raise HTTPException(status_code=500, detail="Le solveur n'a retourné aucun résultat final.")


@app.post("/solve-project", dependencies=[Depends(verify_secret)])
async def solve_project(payload: ProjectPayload):
    """
    Orchestrateur global pour les projets complexes (System of Systems).
    """
    logger.info(f"Orchestration globale du projet: {payload.projectId}")
    try:
        return await orchestrator.solve(payload)
    except Exception as e:
        logger.error(f"Erreur Orchestration: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# --- AUTRES POINTS D'ENTRÉE ---

@app.post("/evaluate-node", dependencies=[Depends(verify_secret)])
async def evaluate_node(payload: Dict[str, Any]):
    """
    Calcul local ultra-rapide sans graphe complet.
    """
    return {"computed": {}}

@app.get("/health")
async def health_check():
    """Vérification d'état pour Docker/K8s"""
    return {"status": "online", "domains_ready": list(SOLVER_REGISTRY.keys())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)