# apps/engine/main.py
import os
import logging
import json
import asyncio
from fastapi import FastAPI, Header, HTTPException, Depends, Request 
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# --- IMPORTS DES DOMAINES ---
# Le solveur du Chapitre 5 qui gère la dissociation, l'évap 24/7 et les sprays
from domains.surface_treatment.solver import run_surface_simulation_stream
import orchestrator 

# --- CONFIGURATION DU LOGGING (JSON pour la production) ---
class JsonFormatter(logging.Formatter):
    # Liste des attributs standards de LogRecord à ignorer pour ne garder que le contenu de "extra"
    STANDARD_ATTRS = {
        'args', 'asctime', 'created', 'exc_info', 'exc_text', 'filename',
        'funcName', 'levelname', 'levelno', 'lineno', 'module',
        'msecs', 'message', 'msg', 'name', 'pathname', 'process',
        'processName', 'relativeCreated', 'stack_info', 'thread', 'threadName'
    }

    def format(self, record):
        # 1. Préparation de l'entrée de log de base
        log_entry = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "module": record.module,
            "funcName": record.funcName,
            "lineNo": record.lineno,
        }

        # 2. Gestion des exceptions
        if record.exc_info:
            log_entry["exc_info"] = self.formatException(record.exc_info)

        # 3. Capture des données "extra" personnalisées
        # On parcourt tout le dictionnaire de l'objet record
        # et on ajoute ce qui n'est pas un attribut standard de logging
        for key, value in record.__dict__.items():
            if key not in self.STANDARD_ATTRS and not key.startswith('_'):
                log_entry[key] = value

        return json.dumps(log_entry) 
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("quantum-core-engine")

if logger.handlers:
    for handler in logger.handlers:
        logger.removeHandler(handler)

console_handler = logging.StreamHandler()
console_handler.setFormatter(JsonFormatter())
logger.addHandler(console_handler)

app = FastAPI(
    title="Quantum Core Engine",
    description="Calculateur scientifique pour l'ingénierie (Traitement de Surface)",
    version="3.3.2"
)

INTERNAL_SECRET = os.getenv("INTERNAL_API_SECRET")

# --- MODÈLES DE DONNÉES (Pydantic) ---

class Node(BaseModel):
    id: str
    type: str
    properties: Dict[str, Any] = {}
    inputStreamId: Optional[str] = None
    outputStreamId: Optional[str] = None

class Edge(BaseModel):
    source: str
    target: str
    properties: Dict[str, Any] = {}

class Sequence(BaseModel):
    id: str
    name: Optional[str] = "Gamme"
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

# --- MIDDLEWARE DE SÉCURITÉ ---

async def verify_secret(x_internal_secret: str = Header(None)):
    if not INTERNAL_SECRET or x_internal_secret != INTERNAL_SECRET:
        logger.warning("Tentative d'accès non autorisée rejetée (Secret invalide).")
        raise HTTPException(status_code=403, detail="Forbidden: Invalid API Secret")

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = asyncio.get_event_loop().time()
    response = await call_next(request)
    process_time = asyncio.get_event_loop().time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# --- ROUTES API ---

@app.post("/simulate-stream", dependencies=[Depends(verify_secret)])
async def simulate_stream(payload: SimulationPayload, request: Request):
    """
    Endpoint Streaming : Retourne un flux NDJSON.
    """
    logger.info(f"Streaming Simulation demandée pour : {payload.domain}")

    if payload.domain == "SURFACE_TREATMENT":
        try:
            # Conversion Pydantic -> Dict pour le solveur NumPy
            nodes_dict = [n.model_dump() for n in payload.nodes]
            edges_dict = [e.model_dump() for e in payload.edges]
            sequences_dict = [s.model_dump() for s in payload.sequences]

            return StreamingResponse(
                run_surface_simulation_stream(
                    nodes_dict,
                    edges_dict,
                    sequences_dict,
                    payload.library,
                    payload.project_settings
                ),
                media_type="application/x-ndjson"
            )
        except Exception as e:
            logger.error(f"Erreur Surface Treatment (Stream): {str(e)}", exc_info=True)
            raise HTTPException(status_code=400, detail=f"Erreur de calcul physique : {str(e)}")
    
    raise HTTPException(status_code=400, detail=f"Domaine {payload.domain} non supporté")


@app.post("/simulate", dependencies=[Depends(verify_secret)])
async def simulate(payload: SimulationPayload, request: Request):
    """
    Endpoint Synchrone (Bloquant) : Consomme le flux et renvoie uniquement le résultat.
    Utile pour les appels serveurs classiques sans streaming.
    """
    if payload.domain == "SURFACE_TREATMENT":
        try:
            nodes_dict = [n.model_dump() for n in payload.nodes]
            edges_dict = [e.model_dump() for e in payload.edges]
            sequences_dict = [s.model_dump() for s in payload.sequences]

            generator = run_surface_simulation_stream(
                nodes_dict, edges_dict, sequences_dict,
                payload.library, payload.project_settings
            )
            
            final_result = None
            
            # Consommation du générateur NDJSON
            async for chunk in generator:
                if not chunk.strip(): continue
                
                # Découpage par ligne pour gérer les chunks concaténés par le réseau
                lines = chunk.strip().split('\n')
                for line in lines:
                    if not line.strip(): continue
                    try:
                        msg = json.loads(line)
                        if msg.get('type') == 'result':
                            final_result = msg['data']
                        elif msg.get('type') == 'error':
                            raise HTTPException(status_code=500, detail=msg['message'])
                    except json.JSONDecodeError:
                        pass

            if final_result:
                return final_result
            else:
                raise HTTPException(status_code=500, detail="Le solveur n'a retourné aucun résultat.")

        except Exception as e:
            logger.error(f"Erreur Simulation (Sync): {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=str(e))

    raise HTTPException(status_code=400, detail=f"Domaine {payload.domain} non supporté")


@app.post("/solve-project", dependencies=[Depends(verify_secret)])
async def solve_project(payload: ProjectPayload, request: Request):
    """
    Orchestrateur Global : Résout la dépendance entre systèmes via le Bus Projet.
    """
    logger.info(f"Résolution globale du projet: {payload.projectId}")
    try:
        return await orchestrator.solve(payload)
    except Exception as e:
        logger.error(f"Erreur Orchestration: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Échec de la résolution globale : {str(e)}")


@app.post("/evaluate-node", dependencies=[Depends(verify_secret)])
async def evaluate_node(payload: Dict[str, Any]):
    """
    Calcul local rapide (ex: évaporation d'un seul bac lors de la saisie).
    """
    return {"computed": {}}


@app.post("/generate-proposal", dependencies=[Depends(verify_secret)])
def generate_proposal(payload: SimulationPayload):
    """
    Génération de l'offre technique via l'intelligence métier.
    """
    return {"proposal": f"Fonctionnalité IA pour {payload.domain} active."}


@app.post("/project-summary", dependencies=[Depends(verify_secret)])
async def project_summary(payload: SimulationPayload, request: Request):
    """
    Point d'entrée pour le rapport de bilan détaillé (alias de /simulate).
    """
    return await simulate(payload, request)


if __name__ == "__main__":
    import uvicorn
    # Lancement du serveur avec rechargement automatique en développement
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)