"""
Gammes de traitement : séquences de passage des pièces dans les cuves.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class ProcessStep(BaseModel):
    """
    Étape individuelle d'une gamme de traitement.
    
    Correspond au passage des pièces dans une cuve spécifique
    avec un facteur d'entraînement caractéristique.
    """
    tank_id: str = Field(..., description="ID de la cuve visitée")
    drag_out_factor: float = Field(
        0.5,
        gt=0,
        description="Facteur d'entraînement (L/m²)"
    )
    drip_time: Optional[float] = Field(
        None,
        description="Temps d'égouttage (secondes)"
    )
    spray_efficiency: Optional[float] = Field(
        None,
        ge=0,
        le=1,
        description="Efficacité du spray post-cuve (0-1)"
    )


class ProcessSequence(BaseModel):
    """
    Gamme de traitement complète (séquence de ProcessStep).
    
    Définit l'ordre de passage des pièces et les paramètres de production.
    Plusieurs gammes peuvent coexister sur une même ligne.
    
    Attributes:
        id: Identifiant unique de la gamme
        name: Nom descriptif (ex: "Zincage acier nu", "Zincage avec décapage")
        steps: Liste ordonnée des étapes
        surface_rate: Surface traitée par heure effective (m²/h)
        frequency: Fréquence relative d'utilisation (0-1) pour les gammes multiples
        
    Example:
        >>> sequence = ProcessSequence(
        ...     id="zinc_standard",
        ...     name="Zincage standard",
        ...     surface_rate=50.0,
        ...     steps=[
        ...         ProcessStep(tank_id="degraissage", drag_out_factor=0.8),
        ...         ProcessStep(tank_id="rinçage_1", drag_out_factor=0.3),
        ...         ProcessStep(tank_id="bain_zinc", drag_out_factor=1.0),
        ...     ]
        ... )
    """
    
    id: str = Field(..., description="Identifiant unique")
    name: str = Field(..., description="Nom descriptif")
    steps: List[ProcessStep] = Field(..., description="Étapes de la gamme")
    
    # Paramètres de production
    surface_rate: float = Field(
        ...,
        gt=0,
        description="Surface traitée (m²/h)"
    )
    frequency: float = Field(
        1.0,
        ge=0,
        le=1,
        description="Fréquence relative d'utilisation"
    )
    operating_hours: Optional[float] = Field(
        None,
        description="Heures de fonctionnement spécifiques (h/jour)"
    )
    
    def get_drag_out_flow(self, step_index: int) -> float:
        """
        Calcule le débit d'entraînement Qd pour une étape donnée.
        
        Qd = S × e × f
        
        où S = surface_rate, e = drag_out_factor, f = frequency
        
        Args:
            step_index: Index de l'étape dans la séquence
            
        Returns:
            Débit d'entraînement en L/h
        """
        if step_index >= len(self.steps):
            return 0.0
        
        step = self.steps[step_index]
        return self.surface_rate * step.drag_out_factor * self.frequency
    
    def get_total_drag_out(self) -> float:
        """
        Débit total d'entraînement sortant de la gamme (vers STEP ou autre).
        
        Returns:
            Débit total en L/h
        """
        if not self.steps:
            return 0.0
        
        # Dernière étape : entraînement vers puits
        last_step = self.steps[-1]
        return self.surface_rate * last_step.drag_out_factor * self.frequency
    
    def validate_tanks_exist(self, tank_ids: set) -> bool:
        """
        Vérifie que toutes les cuves de la gamme existent dans l'atelier.
        
        Args:
            tank_ids: Ensemble des IDs de cuves existantes
            
        Returns:
            True si toutes les cuves existent
            
        Raises:
            ValueError: Si une cuve est manquante
        """
        for step in self.steps:
            if step.tank_id not in tank_ids:
                raise ValueError(f"Cuve {step.tank_id} de la gamme {self.id} inexistante")
        return True
    
    def __len__(self) -> int:
        return len(self.steps)
    
    def __iter__(self):
        return iter(self.steps)
    
    def __repr__(self) -> str:
        return f"<ProcessSequence {self.id} ({len(self.steps)} étapes, {self.surface_rate} m²/h)>"