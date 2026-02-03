"""
Atelier complet : graphe global contenant toutes les lignes et ressources.
"""

from typing import Dict, List, Optional, Set, Tuple, Any
from collections import defaultdict

import networkx as nx
import pandas as pd

from .node import ProcessNode, NodeType
from .line import ProcessingLine
from .sequence import ProcessSequence
from .edges import Flow, FlowType


class Workshop:
    """
    Atelier de traitement de surface : conteneur global du modèle.
    
    C'est le graphe orienté G = (V, E) qui représente l'ensemble de l'installation.
    Il contient :
    - Les lignes de traitement (sous-graphes connexes)
    - Les ressources partagées (sources d'eau, STEP commune)
    - Les flux de couplage entre lignes (recyclages)
    
    Attributes:
        name: Nom de l'atelier
        graph: Graphe NetworkX global (V=nœuds, E=flux)
        lines: Dict des lignes {id: ProcessingLine}
        sequences: Dict des gammes {id: ProcessSequence}
        
    Example:
        >>> atelier = Workshop("Atelier Nord")
        >>> atelier.create_line("zinc", name="Ligne Zincage")
        >>> atelier.add_node(ProcessNode(...), line_id="zinc")
    """
    
    def __init__(self, name: str = "Atelier"):
        self.name = name
        self.graph: nx.DiGraph = nx.DiGraph()
        
        # Registres
        self.lines: Dict[str, ProcessingLine] = {}
        self.sequences: Dict[str, ProcessSequence] = {}
        self.shared_nodes: Set[str] = set()  # Ressources atelier (sources, puits)
        
        # Cache pour optimisation
        self._node_to_line: Optional[Dict[str, str]] = None
        self._matrix_cache: Optional[Any] = None
    
    def create_line(self, line_id: str, name: str, **kwargs) -> ProcessingLine:
        """
        Crée et enregistre une nouvelle ligne de traitement.
        
        Args:
            line_id: Identifiant unique
            name: Nom métier
            **kwargs: Paramètres supplémentaires (operating_hours, etc.)
            
        Returns:
            Objet ProcessingLine créé
        """
        if line_id in self.lines:
            raise ValueError(f"Ligne {line_id} existe déjà")
        
        line = ProcessingLine(id=line_id, name=name, **kwargs)
        self.lines[line_id] = line
        self._node_to_line = None  # Invalidate cache
        return line
    
    def add_node(self, node: ProcessNode, line_id: Optional[str] = None) -> None:
        """
        Ajoute un nœud au graphe global.
        
        Args:
            node: Nœud à ajouter (bain, rinçage, etc.)
            line_id: Si spécifié, rattache à cette ligne. Sinon, ressource partagée.
            
        Raises:
            ValueError: Si line_id inexistant ou nœud déjà présent
        """
        if node.id in self.graph:
            raise ValueError(f"Nœud {node.id} existe déjà")
        
        if line_id and line_id not in self.lines:
            raise ValueError(f"Ligne {line_id} inexistante")
        
        # Ajout au graphe avec métadonnées
        self.graph.add_node(
            node.id,
            data=node,
            type=node.node_type,
            line=line_id,
            is_dirichlet=node.is_dirichlet
        )
        
        # Enregistrement dans la ligne ou ressources partagées
        if line_id:
            self.lines[line_id].add_node(node.id)
        else:
            self.shared_nodes.add(node.id)
        
        self._node_to_line = None  # Invalidate cache
    
    def add_flow(self, flow: Flow) -> None:
        """
        Ajoute un flux (arête) au graphe.
        
        Args:
            flow: Flux à ajouter entre deux nœuds existants
            
        Raises:
            ValueError: Si nœuds source ou cible inexistants
        """
        if flow.source_id not in self.graph:
            raise ValueError(f"Nœud source {flow.source_id} inexistant")
        if flow.target_id not in self.graph:
            raise ValueError(f"Nœud cible {flow.target_id} inexistant")
        
        # Détection couplage inter-lignes
        source_line = self.get_node_line(flow.source_id)
        target_line = self.get_node_line(flow.target_id)
        
        is_inter_line = (source_line is not None and 
                        target_line is not None and 
                        source_line != target_line)
        
        self.graph.add_edge(
            flow.source_id,
            flow.target_id,
            data=flow,
            flow_type=flow.flow_type,
            weight=flow.flow_rate,
            inter_line=is_inter_line,
            source_line=source_line,
            target_line=target_line
        )
    
    def add_sequence(self, sequence: ProcessSequence, line_id: Optional[str] = None) -> None:
        """
        Enregistre une gamme et crée les flux d'entraînement associés.
        
        Args:
            sequence: Gamme de traitement
            line_id: Ligne où s'applique cette gamme
        """
        # Validation
        existing_nodes = set(self.graph.nodes())
        sequence.validate_tanks_exist(existing_nodes)
        
        self.sequences[sequence.id] = sequence
        
        if line_id and line_id in self.lines:
            self.lines[line_id].add_sequence(sequence.id)
        
        # Création automatique des flux drag-out entre étapes consécutives
        for i in range(len(sequence.steps) - 1):
            current = sequence.steps[i]
            next_step = sequence.steps[i + 1]
            
            drag_flow = sequence.get_drag_out_flow(i)
            
            flow = Flow(
                source_id=current.tank_id,
                target_id=next_step.tank_id,
                flow_type=FlowType.DRAG_OUT,
                flow_rate=drag_flow,
                sequence_id=sequence.id,
                description=f"Drag-out {sequence.id} étape {i}"
            )
            self.add_flow(flow)
        
        # Dernière étape : drag-out vers puits (si pas déjà connecté)
        # Note: le puits doit être défini séparément
    
    def get_node_line(self, node_id: str) -> Optional[str]:
        """
        Retourne l'ID de la ligne à laquelle appartient un nœud.
        
        Args:
            node_id: ID du nœud
            
        Returns:
            ID de la ligne ou None (ressource partagée)
        """
        if self._node_to_line is None:
            self._build_node_index()
        
        return self._node_to_line.get(node_id)
    
    def _build_node_index(self) -> None:
        """Construit l'index nœud→ligne pour accès rapide."""
        self._node_to_line = {}
        for line_id, line in self.lines.items():
            for node_id in line.node_ids:
                self._node_to_line[node_id] = line_id
    
    def get_variable_nodes(self) -> List[str]:
        """
        Retourne les IDs des nœuds à concentration variable (inconnues).
        
        Ce sont les rinçages dont la concentration doit être calculée
        par résolution du système A·C = B.
        
        Returns:
            Liste des IDs de nœuds variables
        """
        return [
            n for n, attr in self.graph.nodes(data=True)
            if not attr.get('is_dirichlet')
            and attr.get('type') not in [NodeType.SOURCE, NodeType.SINK]
        ]
    
    def get_dirichlet_nodes(self) -> List[str]:
        """
        Retourne les IDs des nœuds à concentration fixe.
        
        Returns:
            Liste des IDs de nœuds Dirichlet
        """
        return [
            n for n, attr in self.graph.nodes(data=True)
            if attr.get('is_dirichlet')
        ]
    
    def get_coupling_matrix(self) -> Dict[Tuple[str, str], List[Flow]]:
        """
        Identifie et quantifie les couplages entre lignes.
        
        Returns:
            Dict {(ligne_source, ligne_cible): [liste des flux]}
        """
        couplings = defaultdict(list)
        
        for u, v, data in self.graph.edges(data=True):
            if data.get('inter_line'):
                src_line = data.get('source_line')
                tgt_line = data.get('target_line')
                if src_line and tgt_line:
                    flow = data.get('data')
                    if flow:
                        couplings[(src_line, tgt_line)].append(flow)
        
        return dict(couplings)
    
    def validate(self) -> Dict[str, Any]:
        """
        Valide la cohérence globale de l'atelier.
        
        Vérifie:
        - La connexité des lignes
        - Les bilans volumiques
        - La cohérence des gammes
        
        Returns:
            Dict avec résultats de validation
        """
        issues = []
        
        # 1. Vérification des nœuds isolés
        isolated = list(nx.isolates(self.graph))
        if isolated:
            issues.append(f"Nœuds isolés: {isolated}")
        
        # 2. Bilan volumique par nœud rinçage
        for node_id, node_data in self.graph.nodes(data=True):
            node = node_data.get('data')
            if node and node.node_type == NodeType.RINSE:
                in_flow = sum(
                    d.get('weight', 0) for _, _, d in self.graph.in_edges(node_id, data=True)
                    if d.get('flow_type') != FlowType.EVAPORATION
                )
                out_flow = sum(
                    d.get('weight', 0) for _, _, d in self.graph.out_edges(node_id, data=True)
                )
                evap = node.get_evaporation_rate()
                
                # Tolérance pour les rinçages (doivent être à l'équilibre)
                imbalance = abs(in_flow - out_flow - evap)
                if imbalance > 1.0:  # 1 L/h de tolérance
                    issues.append(
                        f"Déséquilibre à {node_id}: IN={in_flow:.1f}, "
                        f"OUT={out_flow:.1f}, EVAP={evap:.1f}"
                    )
        
        # 3. Vérification des gammes
        for seq_id, seq in self.sequences.items():
            try:
                seq.validate_tanks_exist(set(self.graph.nodes()))
            except ValueError as e:
                issues.append(f"Gamme {seq_id}: {e}")
        
        return {
            'valid': len(issues) == 0,
            'issues': issues,
            'n_nodes': self.graph.number_of_nodes(),
            'n_edges': self.graph.number_of_edges(),
            'n_lines': len(self.lines),
            'n_sequences': len(self.sequences)
        }
    
    def to_dataframe(self) -> pd.DataFrame:
        """
        Exporte l'état de l'atelier en DataFrame.
        
        Returns:
            DataFrame avec caractéristiques de chaque nœud
        """
        data = []
        for node_id, attr in self.graph.nodes(data=True):
            node = attr.get('data')
            if not node:
                continue
                
            row = {
                'node_id': node_id,
                'name': node.name,
                'type': node.node_type.value,
                'line': attr.get('line'),
                'volume': node.volume,
                'temperature': node.temperature,
                'is_dirichlet': node.is_dirichlet,
            }
            
            # Concentrations
            for ion, conc in {**node.fixed_concentrations, **node.computed_concentrations}.items():
                row[f'conc_{ion}'] = conc
                
            data.append(row)
        
        return pd.DataFrame(data)
    
    def get_summary(self) -> str:
        """
        Retourne un résumé textuel de l'atelier.
        
        Returns:
            Chaîne descriptive
        """
        lines = [
            f"Atelier: {self.name}",
            f"  Nœuds: {self.graph.number_of_nodes()}",
            f"  Flux: {self.graph.number_of_edges()}",
            f"  Lignes: {len(self.lines)}",
        ]
        
        for line_id, line in self.lines.items():
            lines.append(f"\n  [{line_id}] {line.name}")
            lines.append(f"    Nœuds: {len(line)}")
            lines.append(f"    Gammes: {line.sequence_ids}")
        
        # Couplages inter-lignes
        couplings = self.get_coupling_matrix()
        if couplings:
            lines.append(f"\n  Couplages inter-lignes:")
            for (src, tgt), flows in couplings.items():
                total_flow = sum(f.flow_rate for f in flows)
                lines.append(f"    {src} → {tgt}: {total_flow:.1f} L/h")
        
        return "\n".join(lines)
    
    def __repr__(self) -> str:
        return f"<Workshop '{self.name}' ({len(self.lines)} lignes, {self.graph.number_of_nodes()} nœuds)>"