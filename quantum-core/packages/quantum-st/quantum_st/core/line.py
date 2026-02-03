"""
Ligne de traitement de surface : sous-graphe connexe de l'atelier.
"""

from typing import List, Dict, Optional, Set
from pydantic import BaseModel, Field

import networkx as nx


class ProcessingLine(BaseModel):
    """
    Ligne de traitement autonome au sein d'un atelier.
    
    Une ligne est un sous-graphe connexe avec ses propres cuves et gammes.
    Elle peut échanger des flux (recyclage) avec d'autres lignes via l'atelier.
    
    Attributes:
        id: Identifiant unique (ex: "ligne_zinc_1")
        name: Nom métier (ex: "Ligne Zincage Automatique Nord")
        node_ids: IDs des nœuds (cuves) constituant la ligne
        sequence_ids: IDs des gammes possibles sur cette ligne
        operating_hours: Heures de fonctionnement (h/jour)
        max_surface_rate: Capacité maximale (m²/h)
        
    Example:
        >>> line = ProcessingLine(
        ...     id="zinc_1",
        ...     name="Ligne Zincage Manuelle",
        ...     operating_hours=16,
        ...     max_surface_rate=80
        ... )
    """
    
    # Identification
    id: str = Field(..., description="Identifiant unique")
    name: str = Field(..., description="Nom métier")
    description: Optional[str] = Field(None, description="Description détaillée")
    
    # Composition
    node_ids: List[str] = Field(
        default_factory=list,
        description="IDs des nœuds de la ligne"
    )
    sequence_ids: List[str] = Field(
        default_factory=list,
        description="IDs des gammes disponibles"
    )
    
    # Capacités
    operating_hours: float = Field(
        16.0,
        gt=0,
        le=24,
        description="Heures de fonctionnement (h/jour)"
    )
    max_surface_rate: float = Field(
        100.0,
        gt=0,
        description="Capacité max (m²/h)"
    )
    
    # Résultats
    water_consumption: Optional[float] = Field(
        None,
        description="Consommation eau calculée (L/an)"
    )
    effluent_flow: Optional[float] = Field(
        None,
        description="Débit effluent vers STEP (L/an)"
    )
    
    def get_nodes(self, workshop_graph: nx.DiGraph) -> List['ProcessNode']:
        """
        Récupère les objets ProcessNode depuis le graphe global.
        
        Args:
            workshop_graph: Graphe NetworkX de l'atelier
            
        Returns:
            Liste des nœuds de la ligne
        """
        from .node import ProcessNode
        nodes = []
        for node_id in self.node_ids:
            if node_id in workshop_graph.nodes:
                data = workshop_graph.nodes[node_id].get('data')
                if isinstance(data, ProcessNode):
                    nodes.append(data)
        return nodes
    
    def get_subgraph(self, workshop_graph: nx.DiGraph) -> nx.DiGraph:
        """
        Extrait le sous-graphe de cette ligne avec ses voisins directs.
        
        Inclut les nœuds de la ligne plus les sources/puits connectés.
        
        Args:
            workshop_graph: Graphe global de l'atelier
            
        Returns:
            Sous-graphe NetworkX
        """
        # Nœuds de la ligne
        nodes = set(self.node_ids)
        
        # Voisins directs (sources, puits, recyclages)
        for node in self.node_ids:
            if node in workshop_graph:
                nodes.update(workshop_graph.predecessors(node))
                nodes.update(workshop_graph.successors(node))
        
        return workshop_graph.subgraph(nodes).copy()
    
    def is_coupled_with(self, other_line_id: str, workshop_graph: nx.DiGraph) -> bool:
        """
        Détecte s'il existe des flux directs avec une autre ligne.
        
        Args:
            other_line_id: ID de l'autre ligne
            workshop_graph: Graphe global
            
        Returns:
            True si couplage existe
        """
        other_nodes = set()
        for node, attr in workshop_graph.nodes(data=True):
            if attr.get('line') == other_line_id:
                other_nodes.add(node)
        
        # Vérifie les connexions sortantes vers l'autre ligne
        for node in self.node_ids:
            if node in workshop_graph:
                for _, target, data in workshop_graph.out_edges(node, data=True):
                    if target in other_nodes or data.get('target_line') == other_line_id:
                        return True
        return False
    
    def add_node(self, node_id: str) -> None:
        """Ajoute un nœud à la ligne."""
        if node_id not in self.node_ids:
            self.node_ids.append(node_id)
    
    def add_sequence(self, sequence_id: str) -> None:
        """Ajoute une gamme à la ligne."""
        if sequence_id not in self.sequence_ids:
            self.sequence_ids.append(sequence_id)
    
    def __contains__(self, node_id: str) -> bool:
        """Test d'appartenance : 'cuve_1' in line"""
        return node_id in self.node_ids
    
    def __len__(self) -> int:
        return len(self.node_ids)
    
    def __repr__(self) -> str:
        return f"<ProcessingLine {self.id} ({len(self)} nœuds, {self.operating_hours}h/j)>"