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
from domains.surface_treatment.solver import run_surface_simulation_stream
import orchestrator 

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
        }
        if record.exc_info:
            log_entry["exc_info"] = self.formatException(record.exc_info)
        if record.extra:
            log_entry.update(record.extra)
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
    description="Scientific Calculation Engine",
    version="3.3.1"
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

# --- MIDDLEWARE ---

async def verify_secret(x_internal_secret: str = Header(None)):
    if not INTERNAL_SECRET or x_internal_secret != INTERNAL_SECRET:
        logger.warning("Access denied: Invalid Secret")
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
    Endpoint Streaming : Retourne un flux NDJSON (New-Line Delimited JSON).
    """
    logger.info(f"Streaming Simulation: {payload.domain}")

    if payload.domain == "SURFACE_TREATMENT":
        try:
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
            logger.error(f"Error Surface Treatment: {str(e)}", exc_info=True)
            raise HTTPException(status_code=400, detail=f"Physics Error: {str(e)}")
    
    raise HTTPException(status_code=400, detail=f"Domain {payload.domain} not supported for streaming")



@app.post("/simulate", dependencies=[Depends(verify_secret)])
async def simulate(payload: SimulationPayload, request: Request):
    """
    Endpoint Legacy (Bloquant).
    Utile pour les tests ou les appels synchrones.
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
            
            # --- CORRECTION CRITIQUE ICI ---
            async for chunk in generator:
                if not chunk.strip(): continue
                
                # On découpe par ligne car un chunk peut contenir plusieurs JSON collés
                lines = chunk.strip().split('\n')
                
                for line in lines:
                    if not line.strip(): continue
                    try:
                        msg = json.loads(line)
                        if msg['type'] == 'result':
                            final_result = msg['data']
                        elif msg['type'] == 'error':
                            raise HTTPException(status_code=500, detail=msg['message'])
                    except json.JSONDecodeError:
                        pass
            # -------------------------------

            if final_result:
                return final_result
            else:
                raise HTTPException(status_code=500, detail="Aucun résultat retourné par le solveur")

        except Exception as e:
            logger.error(f"Erreur Simulation Legacy: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=str(e))

    raise HTTPException(status_code=400, detail=f"Domaine {payload.domain} non supporté")

# ... (Reste du fichier inchangé) ...
@app.post("/solve-project", dependencies=[Depends(verify_secret)])
async def solve_project(payload: ProjectPayload, request: Request):
    """
    Orchestrateur Global (System of Systems).
    """
    logger.info(f"Global Solve: {payload.projectId}")
    try:
        return await orchestrator.solve(payload)
    except Exception as e:
        logger.error(f"Orchestration Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Orchestration Failed: {str(e)}")

# Placeholder endpoints
@app.post("/evaluate-node", dependencies=[Depends(verify_secret)])
def evaluate_node(payload: Dict[str, Any]):
    return {"computed": {}}

@app.post("/generate-proposal", dependencies=[Depends(verify_secret)])
def generate_proposal(payload: SimulationPayload):
    return {"proposal": f"AI Proposal for {payload.domain} not implemented yet."}

@app.post("/project-summary", dependencies=[Depends(verify_secret)])
def project_summary(payload: Dict[str, Any]):
    return {"status": "deprecated", "message": "Use /solve-project"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)