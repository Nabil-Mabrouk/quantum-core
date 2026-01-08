import os
from fastapi import FastAPI, Header, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List


app = FastAPI(title="Quantum Core Engine")

# Récupération du secret depuis l'environnement
INTERNAL_SECRET = os.getenv("INTERNAL_API_SECRET", "default-insecure-secret")

# --- MODÈLES DE DONNÉES (Le Contrat d'Interface) ---
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

# --- SÉCURITÉ ---
async def verify_secret(x_internal_secret: str = Header(...)):
    if x_internal_secret != INTERNAL_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid Internal Secret")

# --- ENDPOINTS ---

@app.get("/")
def health_check():
    return {"status": "ok", "engine": "Quantum Core v1"}

# apps/engine/main.py (Mise à jour de la fonction run_simulation)
# apps/engine/main.py

# apps/engine/main.py

@app.post("/simulate", dependencies=[Depends(verify_secret)])
def run_simulation(payload: SimulationPayload):
    nodes = payload.nodes
    edges = payload.edges
    
    total_capex = 0
    warnings = []
    
    for node in nodes:
        # On récupère le prix injecté par le catalogue (0 par défaut)
        price = float(node.properties.get("price", 0))
        total_capex += price
        
        # Exemple d'intelligence : Vérifier si l'équipement est sous-dimensionné
        if node.type == "PUMP":
            nominal_flow = float(node.properties.get("flow", 0))
            # On regarde les tuyaux connectés
            actual_flow = sum(float(e.properties.get("flowRate", 0)) for e in edges if e.source == node.id)
            if actual_flow > nominal_flow and nominal_flow > 0:
                warnings.append(f"La pompe '{node.properties.get('catalogName')}' est surchargée ({actual_flow} > {nominal_flow} m3/h)")

    return {
        "status": "success",
        "kpis": [
            {"label": "Coût Équipements", "value": total_capex, "unit": "€", "color": "emerald"},
            {"label": "Flux Global", "value": sum(float(e.properties.get("flowRate", 0)) for e in edges), "unit": "m3/h"},
            {"label": "Alertes", "value": len(warnings), "unit": "", "color": "red" if warnings else "slate"}
        ],
        "warnings": warnings
    }

@app.post("/generate-proposal", dependencies=[Depends(verify_secret)])
def generate_proposal(payload: SimulationPayload):
    nodes = payload.nodes
    
    # 1. Préparation du contexte pour l'IA
    # On crée une description textuelle du système pour que l'IA comprenne
    system_description = f"Projet de domaine {payload.domain}. "
    equipments = [f"- {n.properties.get('catalogName', n.type)} (Label: {n.properties.get('label')})" for n in nodes]
    equipment_list = "\n".join(equipments)
    
    # 2. Le "Prompt" (Instruction pour l'IA)
    prompt = f"""
    Tu es un ingénieur commercial expert en {payload.domain}.
    Rédige le paragraphe d'introduction technique d'une offre commerciale pour le système suivant :
    {equipment_list}
    
    L'offre doit être professionnelle, mettre en avant la fiabilité du matériel sélectionné 
    et expliquer brièvement comment ces éléments vont fonctionner ensemble.
    """

    # 3. Appel à l'IA (Simulation ici pour que ça marche chez vous sans clé)
    # Dans un vrai projet, vous feriez : response = openai.ChatCompletion.create(...)
    
    ai_text = f"### Proposition Technique - Quantum Core AI\n\n"
    ai_text += f"Suite à l'analyse de votre configuration pour le projet {payload.domain}, "
    ai_text += f"nous avons le plaisir de vous proposer une solution optimisée s'appuyant sur {len(nodes)} équipements majeurs.\n\n"
    
    if any("PUMP" in n.type for n in nodes):
        ai_text += "La sélection de pompes industrielles haute performance garantit un flux constant et une maintenance réduite. "
    
    ai_text += "Cette installation a été conçue pour répondre aux exigences de votre cahier des charges tout en minimisant l'empreinte au sol et les coûts opérationnels."

    return {"proposal": ai_text}