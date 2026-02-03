"""
Adaptateur entre le format Legacy (JSON from TS) et quantum-st.
"""
from typing import Dict, List, Any
from quantum_st import Workshop, ProcessNode, ProcessSequence, ProcessStep, Flow
from quantum_st.core.enums import NodeType, FlowType
from quantum_st.solver.stationary import StationarySolver
import pandas as pd
from typing import Dict, List, Any

NODE_TYPE_MAPPING = {
    'PROCESS_BATH': NodeType.PROCESS_BATH,
    'RINSE_TANK': NodeType.RINSE,
    'RINSE_STAGE': NodeType.RINSE,
    'SOURCE': NodeType.SOURCE,
    'SINK': NodeType.SINK,
    'DRAIN': NodeType.DRAIN,
    'SPRAY': NodeType.SPRAY,
    'STORAGE': NodeType.STORAGE,
    'default': NodeType.STORAGE
}

FLOW_TYPE_MAPPING = {
    'default': FlowType.HYDRAULIC,
    'PIPE': FlowType.HYDRAULIC,
    'hydraulics': FlowType.HYDRAULIC,
    'DRAG_OUT': FlowType.DRAG_OUT,
    'drag-out': FlowType.DRAG_OUT,
    'SPRAY': FlowType.SPRAY,
    'EVAPORATION': FlowType.EVAPORATION,
    'MAKEUP': FlowType.MAKEUP,
    'RECYCLE': FlowType.RECYCLE,
    'virtual': FlowType.HYDRAULIC
}

def map_node_type(domain_type: str) -> NodeType:
    """Mappe le type de nœud du domaine (TS) vers l'enum quantum-st."""
    return NODE_TYPE_MAPPING.get(domain_type, NodeType.STORAGE)

def map_flow_type(domain_type: str) -> FlowType:
    """Mappe le type de flux du domaine (TS) vers l'enum quantum-st."""
    return FLOW_TYPE_MAPPING.get(domain_type, FlowType.HYDRAULIC)

def _parse_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

def payload_to_workshop(payload: Dict[str, Any]) -> Workshop:
    """
    Convertit le payload générique (envoyé par le nouveau TS) en Workshop quantum-st.
    """
    workshop = Workshop(name="Simulation Surface Treatment")
    line = workshop.create_line("main_line", name="Ligne principale")
    node_map = {}

    # 1. Création des nœuds
    for node_data in payload['nodes']:
        # Le nouveau payload niche les données dans 'data' et 'properties'
        node_ui_data = node_data.get('data', {})
        props = node_ui_data.get('properties', {})
        domain_type = node_ui_data.get('type', 'default')
        
        node_type = map_node_type(domain_type)
        is_dirichlet = node_type == NodeType.PROCESS_BATH
        
        fixed_concs = {}
        if is_dirichlet and 'manualConcentrations' in props:
            fixed_concs = props['manualConcentrations']

        # Nœuds sans surface physique
        NODES_WITHOUT_AREA = {NodeType.SOURCE, NodeType.SINK, NodeType.DRAIN, NodeType.SPRAY}
        
        surface_area = None
        if node_type not in NODES_WITHOUT_AREA:
            area_m2 = (_parse_float(props.get('length', 0)) * _parse_float(props.get('width', 0))) / 1_000_000
            if area_m2 > 0:
                surface_area = area_m2

        node = ProcessNode(
            id=node_data['id'],
            name=props.get('label', node_data['id']),
            node_type=node_type,
            volume=_parse_float(props.get('workingVol', 1000)),
            temperature=_parse_float(props.get('temp', 20)),
            surface_area=surface_area,
            is_dirichlet=is_dirichlet,
            fixed_concentrations=fixed_concs,
            user_properties=props 
        )
        
        workshop.add_node(node, line_id=line.id)
        node_map[node.id] = node

    # 2. Création des flux (depuis 'flows' et non plus 'edges')
    for flow_data in payload.get('flows', []):
        props = flow_data.get('properties', {})
        domain_type = flow_data.get('type', 'default')

        flow_type = map_flow_type(domain_type)
        
        flow = Flow(
            source_id=flow_data['source'],
            target_id=flow_data['target'],
            flow_type=flow_type,
            flow_rate=_parse_float(props.get('flow_rate', 0)),
            efficiency=_parse_float(props.get('efficiency', 1.0))
        )
        
        workshop.add_flow(flow)

    # 3. Création des séquences
    for seq_data in payload.get('sequences', []):
        props = seq_data.get('properties', {})
        steps_ids = seq_data.get('steps', [])
        
        # 🚩 CORRECTION: Lecture du nom du champ du Manifeste TS
        # On lit 'productionRate' (le nom de l'ID du champ)
        surface_rate = _parse_float(props.get('productionRate', 10.0)) 
        
        # 🚩 S'assurer qu'il est bien > 0, sinon le solveur crashera.
        if surface_rate <= 0:
            raise ValueError(f"La cadence (productionRate) de la séquence {seq_data['id']} doit être > 0.")

        # La logique de récupération des drag_out_factors est maintenant ici
        drag_factors = props.get('step_drag_out_factors', [])
        if not drag_factors:
            # 🚩 CORRECTION: Lecture du nom du champ du Manifeste TS
            default_drag = _parse_float(props.get('dragOutSpecific', 0.1))
            drag_factors = [default_drag] * len(steps_ids)
            
        process_steps = [
            ProcessStep(
                tank_id=tank_id,
                drag_out_factor=drag_factors[i] if i < len(drag_factors) else 0.1
            )
            for i, tank_id in enumerate(steps_ids)
        ]
        
        sequence = ProcessSequence(
            id=seq_data['id'],
            name=seq_data.get('name', seq_data['id']),
            surface_rate=surface_rate,
            frequency=_parse_float(props.get('frequency', 1.0)),
            steps=process_steps
        )
        
        workshop.add_sequence(sequence, line_id=line.id)
    
    return workshop


def quantum_results_to_legacy(
    workshop: Workshop, 
    results_df: pd.DataFrame, 
    ions: List[str]
) -> Dict[str, Any]:
    """
    Convertit les résultats quantum-st (DataFrame) vers le format attendu par le frontend.
    """
    node_details = {}
    
    # Indexer les résultats par node_id et ion
    results_pivot = results_df.pivot_table(
        index='node_id', 
        columns='ion', 
        values='concentration_g_l', 
        aggfunc='first'
    ).to_dict('index')
    
    for node_id, node_data in workshop.graph.nodes(data=True):
        node = node_data.get('data')
        if not node:
            continue
        
        # Récupération des concentrations calculées
        concentrations = results_pivot.get(node_id, {})
        
        # Construction de l'entrée pour ce nœud
        node_result = {
            "concentrations": {
                ion: round(conc, 4) 
                for ion, conc in concentrations.items() 
                if conc > 1e-4
            },
            "target_concentrations": node.fixed_concentrations if node.is_dirichlet else {},
            "hydraulics": {
                "evap": node.get_evaporation_rate(),
                "in": 0.0,  # Calculé ci-dessous
                "out": 0.0  # Calculé ci-dessous
            },
            "chemical_additions": {},  # À calculer si besoin
            "warnings": []
        }
        
        # Calcul des bilans hydrauliques
        q_in = 0
        q_out = 0
        
        for _, target, edge_data in workshop.graph.out_edges(node_id, data=True):
            flow = edge_data.get('data')
            if flow:
                q_out += flow.get_effective_flow()
        
        for source, _, edge_data in workshop.graph.in_edges(node_id, data=True):
            flow = edge_data.get('data')
            if flow:
                q_in += flow.get_effective_flow()
        
        node_result["hydraulics"]["in"] = round(q_in, 4)
        node_result["hydraulics"]["out"] = round(q_out, 4)
        
        node_details[node_id] = node_result
    
    return {
        "node_details": node_details,
        "topology_summary": {
            "n_nodes": workshop.graph.number_of_nodes(),
            "n_edges": workshop.graph.number_of_edges(),
            "n_lines": len(workshop.lines)
        }
    }