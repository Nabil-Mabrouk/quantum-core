"""
Définition des flux (arêtes) entre nœuds du graphe.
"""

from __future__ import annotations
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

from .enums import FlowType


class Flow(BaseModel):
    """
    Flux orienté entre deux nœuds du graphe (arête).
    
    Représente un transfert de masse et/ou de volume entre cuves.
    Mathématiquement, c'est une arête E du graphe G=(V,E) avec un poids Q.
    
    Attributes:
        source_id: ID du nœud origine
        target_id: ID du nœud destination
        flow_type: Type de flux (hydraulique, entraînement, etc.)
        flow_rate: Débit volumique (L/h)
        efficiency: Efficacité du transfert (0-1), utilisé pour les sprays
        species_modifier: Modificateur de transfert par espèce chimique
        time_basis: Base temporelle du débit
        
    Example:
        >>> flow = Flow(
        ...     source_id="bain_zinc_1",
        ...     target_id="rinçage_1",
        ...     flow_type=FlowType.DRAG_OUT,
        ...     flow_rate=25.0,  # L/h entraînés
        ... )
    """
    
    source_id: str = Field(..., description="Nœud origine")
    target_id: str = Field(..., description="Nœud destination")
    flow_type: FlowType = Field(..., description="Type de flux")
    
    # Débit et efficacité
    flow_rate: float = Field(
        0.0,
        ge=0,
        description="Débit volumique (L/h)"
    )
    efficiency: float = Field(
        1.0,
        ge=0.0,
        le=1.0,
        description="Efficacité de transfert (0-1)"
    )
    
    # Modificateurs chimiques
    species_modifier: Optional[Dict[str, float]] = Field(
        None,
        description="Fraction transférée par espèce {ion: fraction}"
    )
    
    # Métadonnées
    sequence_id: Optional[str] = Field(
        None,
        description="ID de la gamme (pour drag-out)"
    )
    description: Optional[str] = Field(
        None,
        description="Description du flux"
    )
    active: bool = Field(True, description="Flux actif dans la simulation")
    
    def get_effective_flow(self) -> float:
        """
        Débit effectif après application de l'efficacité.
        
        Pour les sprays : réduction du drag-out entrant.
        Pour les autres : débit nominal × efficacité.
        """
        return self.flow_rate * self.efficiency
    
    def get_mass_flow(self, concentration: float, ion: Optional[str] = None) -> float:
        """
        Calcule le flux massique (g/h) pour une concentration donnée.
        
        Args:
            concentration: Concentration en g/L
            ion: Identifiant de l'ion (pour modificateur spécifique)
            
        Returns:
            Flux massique en g/h
        """
        modifier = 1.0
        if ion and self.species_modifier:
            modifier = self.species_modifier.get(ion, 1.0)
        
        return self.get_effective_flow() * concentration * modifier
    
    def __hash__(self) -> int:
        return hash((self.source_id, self.target_id, self.flow_type, self.sequence_id))
    
    def __repr__(self) -> str:
        return (f"<Flow {self.source_id}→{self.target_id} "
                f"({self.flow_type.value}, {self.flow_rate:.1f} L/h)>")