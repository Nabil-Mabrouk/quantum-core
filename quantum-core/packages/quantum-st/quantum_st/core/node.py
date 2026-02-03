"""
Définition des nœuds du graphe : bains, cuves, postes de traitement.
"""

from __future__ import annotations
from typing import Dict, Optional, Any
from pydantic import BaseModel, Field, field_validator

from .enums import NodeType


class ProcessNode(BaseModel):
    """
    Nœud du graphe de traitement représentant une cuve ou un bain.
    
    Mathématiquement, c'est un sommet V du graphe orienté G=(V,E).
    Physiquement, c'est un réacteur chimique avec échanges de masse.
    
    Attributes:
        id: Identifiant unique technique (ex: 'rinçage_Z2_étage1')
        name: Nom métier descriptif (ex: 'Rinçage Zinc - Cuve 1')
        node_type: Classification du nœud (bain process, rinçage, etc.)
        volume: Volume nominal du bain en litres (L)
        temperature: Température de service en °C (influence l'évaporation)
        surface_area: Surface de l'interface air/liquide en m²
        is_dirichlet: True si concentration imposée (bain process régulé)
        fixed_concentrations: Dict {ion: concentration_g/L} pour nœuds Dirichlet
        operating_time_basis: Base temporelle pour les bilans
        
    Example:
        >>> bath = ProcessNode(
        ...     id="bain_zinc_1",
        ...     name="Bain de zinc acide",
        ...     node_type=NodeType.PROCESS_BATH,
        ...     volume=3000,
        ...     temperature=30,
        ...     is_dirichlet=True,
        ...     fixed_concentrations={"Zn2+": 45.0, "Cl-": 120.0}
        ... )
    """
    
    # Identification
    id: str = Field(..., description="Identifiant unique technique")
    name: str = Field(..., description="Nom métier descriptif")
    node_type: NodeType = Field(..., description="Type de nœud")
    
    # Caractéristiques physiques
    volume: float = Field(
        ..., 
        gt=0, 
        description="Volume du bain en litres (L)"
    )
    temperature: Optional[float] = Field(
        None, 
        description="Température de service (°C)"
    )
    surface_area: Optional[float] = Field(
        None,
        gt=0,
        description="Surface interface air/liquide (m²)"
    )
    
    # Propriétés mathématiques
    is_dirichlet: bool = Field(
        False,
        description="True = concentration imposée (bain process)"
    )
    fixed_concentrations: Dict[str, float] = Field(
        default_factory=dict,
        description="Concentrations imposées {ion: g/L}"
    )
    
    # Paramètres opérationnels
    evaporation_rate: Optional[float] = Field(
        None,
        ge=0,
        description="Débit d'évaporation spécifique (L/h)"
    )
    
    # Résultats de simulation (exclus de la sérialisation)
    computed_concentrations: Dict[str, float] = Field(
        default_factory=dict,
        exclude=True,
        description="Concentrations calculées par le solveur"
    )
    computed_flows: Dict[str, Any] = Field(
        default_factory=dict,
        exclude=True,
        description="Bilans calculés"
    )
    
    @field_validator('fixed_concentrations')
    @classmethod
    def validate_dirichlet_consistency(cls, v: Dict, info) -> Dict:
        """Vérifie la cohérence entre is_dirichlet et fixed_concentrations."""
        is_dirichlet = info.data.get('is_dirichlet', False)
        if is_dirichlet and not v:
            raise ValueError("Un nœud Dirichlet doit avoir des concentrations fixées")
        if v and not is_dirichlet:
            raise ValueError("Des concentrations sont fixées mais is_dirichlet=False")
        return v
    
    def get_evaporation_rate(self, k_evap: float = 0.8) -> float:
        """
        Calcule le débit d'évaporation selon la loi de Dalton simplifiée.
        
        Q_evap = k × A × (T - 20) / 10  pour T > 50°C
        
        Args:
            k_evap: Coefficient d'évaporation empirique (L/m²/h/10°C)
            
        Returns:
            Débit d'évaporation en L/h
        """
        if self.evaporation_rate is not None:
            return self.evaporation_rate
        
        if self.temperature and self.temperature > 50 and self.surface_area:
            return k_evap * self.surface_area * (self.temperature - 50) / 10
        
        return 0.0
    
    def get_concentration(self, ion: str) -> float:
        """
        Retourne la concentration d'un ion (fixée ou calculée).
        
        Args:
            ion: Identifiant de l'ion (ex: 'Ni2+', 'Cl-')
            
        Returns:
            Concentration en g/L
        """
        if self.is_dirichlet:
            return self.fixed_concentrations.get(ion, 0.0)
        return self.computed_concentrations.get(ion, 0.0)
    
    def __hash__(self) -> int:
        return hash(self.id)
    
    def __eq__(self, other: object) -> bool:
        if isinstance(other, ProcessNode):
            return self.id == other.id
        return False
    
    def __repr__(self) -> str:
        type_str = "Dirichlet" if self.is_dirichlet else "Variable"
        return f"<ProcessNode {self.id} ({self.node_type.value}, {type_str})>"
    
    def __str__(self) -> str:
        return f"{self.name} ({self.id})"