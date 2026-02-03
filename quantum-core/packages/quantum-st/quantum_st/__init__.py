"""
Quantum-ST : Modélisation Systémique des Flux en Traitement de Surface

Bibliothèque Python pour la modélisation et l'optimisation des ateliers
de traitement de surface basée sur la théorie des graphes et l'algèbre linéaire.
"""

__version__ = "0.1.0"

# API publique simplifiée
from quantum_st.core.workshop import Workshop
from quantum_st.core.line import ProcessingLine
from quantum_st.core.node import ProcessNode, NodeType
from quantum_st.core.edges import Flow, FlowType
from quantum_st.core.sequence import ProcessSequence, ProcessStep
from quantum_st.solver.stationary import StationarySolver
from quantum_st.solver.global_solver import GlobalSolver

__all__ = [
    "Workshop",
    "ProcessingLine", 
    "ProcessNode",
    "NodeType",
    "Flow",
    "FlowType",
    "ProcessSequence",
    "ProcessStep",
    "StationarySolver",
    "GlobalSolver",
]