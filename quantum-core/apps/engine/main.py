import os
from fastapi import FastAPI, Header, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from domains.water.solver import run_water_simulation
from domains.water.proposal import generate_water_proposal
from numpy.linalg import LinAlgError

app = FastAPI(title="Quantum Core Engine")
INTERNAL_SECRET = os.getenv("INTERNAL_API_SECRET")


# --- MODÈLES CORRIGÉS ---

class Node(BaseModel):
    id: str
    type: str
    properties: Dict[str, Any]

class Edge(BaseModel):
    source: str
    target: str
    properties: Dict[str, Any]

class Sequence(BaseModel):
    id: str
    name: Optional[str] = "Gamme" # On le rend optionnel pour éviter le crash
    steps: List[str]             # Liste de strings (IDs des noeuds)
    properties: Dict[str, Any]

class SimulationPayload(BaseModel):
    domain: str
    nodes: List[Node]
    edges: List[Edge]
    sequences: List[Sequence] = []
    library: Optional[Dict[str, Any]] = None

# NEW PROJECT SIMULATION PAYLOAD
class ProjectSimulationPayload(BaseModel):
    domain: str
    lines: List[SimulationPayload] # Liste des graphes individuels


async def verify_secret(x_internal_secret: str = Header(None)):
    if not INTERNAL_SECRET or x_internal_secret != INTERNAL_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")

@app.post("/simulate", dependencies=[Depends(verify_secret)])
def simulate(payload: SimulationPayload):
    # STRATEGY PATTERN : On choisit le solveur selon le domaine
    if payload.domain == "WATER":
        try:
            # Need to pass sequences and library to run_water_simulation
            return run_water_simulation(payload.nodes, payload.edges, payload.sequences, payload.library)
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
        # Need to pass sequences and library to generate_water_proposal if it uses them
        proposal = generate_water_proposal(payload.nodes, payload.edges) # Assuming it doesn't need sequences/library for now
        return {"proposal": proposal}
    
    raise HTTPException(status_code=400, detail=f"Le domaine {payload.domain} n'est pas supporté pour la génération de propositions.")

@app.post("/project-summary", dependencies=[Depends(verify_secret)])
def project_summary(payload: ProjectSimulationPayload):
    global_networks = {} # Clé: networkName, Valeur: Somme des flux/masses

    # On fait tourner le solveur sur chaque ligne
    for line_payload in payload.lines:
        # Assuming run_water_simulation updates edges in place or returns modified edges
        line_result = run_water_simulation(
            line_payload.nodes, 
            line_payload.edges, 
            line_payload.sequences,
            line_payload.library
        )
        
        # On extrait les noeuds SINK de cette ligne
        for node in line_payload.nodes:
            if node.role == "SINK":
                net_name = node.properties.get("networkName", "DEFAULT")
                
                # On récupère ce qui arrive dans ce sink (calculé par le solveur)
                # Note: Le solveur doit maintenant renvoyer 'inflow' pour les sinks
                inflow = sum(float(e.properties.get("flowRate", 0)) for e in line_payload.edges if e.target == node.id)
                
                if net_name not in global_networks:
                    global_networks[net_name] = {"total_flow": 0, "contributing_lines": []}
                
                global_networks[net_name]["total_flow"] += inflow
                # domain is from project, not line payload for contributing_lines
                if payload.domain not in global_networks[net_name]["contributing_lines"]:
                    global_networks[net_name]["contributing_lines"].append(payload.domain)

    # On transforme en liste de KPIs pour le front
    summary_kpis = []
    for name, data in global_networks.items():
        summary_kpis.append({
            "network": name,
            "flow": round(data["total_flow"], 2),
            "unit": "m3/h",
            "lines": data["contributing_lines"]
        })

    return {"status": "success", "networks": summary_kpis}

@app.post("/evaluate-node", dependencies=[Depends(verify_secret)])
def evaluate_node(payload: Dict[str, Any]):
    domain = payload.get("domain")
    node_type = payload.get("node_type")
    properties = payload.get("properties", {})

    # Stratégie : On délègue au domaine concerné
    if domain == "WATER":
        from domains.water.solver import evaluate_water_node
        return evaluate_water_node(node_type, properties)
    
    return {"computed": {}}

def evaluate_water_node(node_type: str, props: Dict[str, Any]):
    computed = {}
    
    if node_type == "TANK":
        # On centralise la physique ici (Une seule source de vérité)
        length = float(props.get('length', 1000))
        width = float(props.get('width', 800))
        temp = float(props.get('temp', 20))
        
        surface_m2 = (length * width) / 1_000_000
        delta_t = max(0, temp - 20)
        
        computed["evaporation"] = round(surface_m2 * delta_t * 0.05, 2)
        computed["volume_m3"] = round(surface_m2 * 1.2, 2) # Exemple profondeur 1.2m
        
    return {"computed": computed}

@app.post("/project-summary")
def project_summary(payload: Dict[str, Any]):
    domain = payload.get("domain")
    lines = payload.get("lines", []) # Liste de payloads de simulation
    
    global_networks = {} # Agrégation par nom de réseau

    for line_payload in lines:
        # 1. On simule la ligne individuellement
        res = run_water_simulation(
            line_payload['nodes'], 
            line_payload['edges'], 
            line_payload['sequences'], 
            line_payload['library']
        )
        
        # 2. On récupère le résumé des réseaux de cette ligne
        line_nets = res.get("networks", [])
        for net in line_nets:
            name = net['network'].upper().strip()
            if name not in global_networks:
                global_networks[name] = {"flow": 0, "mass": 0, "sources": []}
            
            global_networks[name]["flow"] += net['flow']
            global_networks[name]["mass"] += net.get('mass', 0)
            global_networks[name]["sources"].append(line_payload.get('line_name', 'Ligne'))

    # Formater pour le frontend
    summary = []
    for name, data in global_networks.items():
        summary.append({
            "network": name,
            "flow": round(data["flow"], 2),
            "mass": round(data["mass"], 2),
            "lines": list(set(data["sources"]))
        })

    return {"status": "success", "networks": summary}