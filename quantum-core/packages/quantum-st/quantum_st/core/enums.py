"""
Énumérations pour la classification des nœuds et flux.
"""

from enum import Enum, auto


class NodeType(str, Enum):
    """
    Types de nœuds dans le graphe de traitement de surface.
    
    La distinction Process/Variable correspond aux conditions aux limites
    mathématiques (Dirichlet vs Variable).
    """
    PROCESS_BATH = "bain_process"      # Bain chimique régulé (Dirichlet)
    RINSE = "rinçage"                  # Cuve de rinçage (Variable)
    DRAIN = "égouttage"                # Zone d'égouttage
    SPRAY = "pulvérisation"            # Rinçage par aspersion
    SOURCE = "source"                  # Entrée eau/réactif (condition limite)
    SINK = "puits"                     # Sortie STEP/évaporation
    STORAGE = "stockage"               # Réservoir tampon


class FlowType(str, Enum):
    """
    Types de flux (arêtes) dans le graphe.
    
    Chaque type a une signification physique différente dans le bilan de masse.
    """
    HYDRAULIC = "hydraulique"          # Surverse, pompage (Q constant)
    DRAG_OUT = "entraînement"          # Entraînement par pièces (Qd)
    SPRAY = "spray"                    # Aspersion avec efficacité η
    EVAPORATION = "évaporation"        # Perte vers atmosphère
    MAKEUP = "appoint"                 # Eau de compensation
    RECYCLE = "recyclage"              # Boucle de récupération


class TimeBasis(str, Enum):
    """Bases temporelles pour les calculs de débits."""
    CONTINUOUS = "24h"                 # Équipement permanent (évaporation)
    PRODUCTION = "production"          # Temps de production effectif
    OPERATING = "operating"            # Temps d'ouverture atelier