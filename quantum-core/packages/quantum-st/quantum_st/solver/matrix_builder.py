"""
Construction des matrices A et B pour le système linéaire A·C = B.
"""

from typing import Dict, List, Tuple, Optional
import numpy as np
from scipy.sparse import csr_matrix, lil_matrix

from quantum_st.core.workshop import Workshop
from quantum_st.core.edges import FlowType


class MatrixBuilder:
    """
    Constructeur des matrices du système linéaire pour un ion donné.
    
    Pour chaque ion, on établit le bilan de masse en chaque nœud variable :
    Σ(Qin × Cin) = Σ(Qout × Cout)
    
    Ce qui se ramène à : A·C = B
    
    où:
    - A: matrice des coefficients (dépend des débits)
    - C: vecteur des concentrations inconnues (nœuds variables)
    - B: vecteur des contributions des nœuds Dirichlet
    """
    
    def __init__(self, workshop: Workshop):
        """
        Initialise le constructeur avec l'atelier à modéliser.
        
        Args:
            workshop: Atelier contenant le graphe global
        """
        self.workshop = workshop
        self.var_nodes = workshop.get_variable_nodes()
        self.dir_nodes = workshop.get_dirichlet_nodes()
        
        # Index pour accès rapide
        self.node_index = {node: i for i, node in enumerate(self.var_nodes)}
        self.n = len(self.var_nodes)
        
        if self.n == 0:
            raise ValueError("Aucun nœud variable dans l'atelier")
    
    def build_matrices(self, ion_id: str) -> Tuple[csr_matrix, np.ndarray]:
        """
        Construit les matrices A et B pour un ion spécifique.
        
        Équation pour chaque nœud variable i:
        A[i,i]×C[i] - Σ(A[i,j]×C[j]) = B[i]
        
        où:
        - A[i,i] = Σ(Q sortants de i)  [terme diagonal]
        - A[i,j] = Q de j vers i       [termes extra-diagonaux]
        - B[i] = Σ(Q depuis Dirichlet × C_dirichlet)
        
        Args:
            ion_id: Identifiant de l'ion (ex: 'Ni2+', 'Cl-')
            
        Returns:
            Tuple (A, B) avec A matrice creuse CSR et B vecteur numpy
        """
        A = lil_matrix((self.n, self.n))
        B = np.zeros(self.n)
        
        G = self.workshop.graph
        
        for i, node_id in enumerate(self.var_nodes):
            node_data = G.nodes[node_id]
            node = node_data.get('data')
            
            if not node:
                continue
            
            # === TERME DIAGONAL : Somme des flux SORTANTS ===
            diagonal = 0.0
            
            # Flux hydrauliques et entraînement sortants
            for _, target, edge_data in G.out_edges(node_id, data=True):
                flow = edge_data.get('data')
                if not flow or not flow.active:
                    continue
                
                # Débit effectif (avec efficacité)
                q_out = flow.get_effective_flow()
                
                # Pour les flux vers d'autres nœuds variables: terme extra-diagonal
                if target in self.node_index:
                    j = self.node_index[target]
                    # Contribution au terme extra-diagonal de la cible
                    # (sera traité dans la boucle de la cible)
                    pass
                
                # Évaporation ne transporte pas d'ions (sortie d'eau pure)
                if edge_data.get('flow_type') != FlowType.EVAPORATION:
                    diagonal += q_out
            
            # Entraînement sortant (drag-out) - toujours avec la concentration du nœud courant
            for _, target, edge_data in G.out_edges(node_id, data=True):
                if edge_data.get('flow_type') == FlowType.DRAG_OUT:
                    flow = edge_data.get('data')
                    if flow:
                        diagonal += flow.get_effective_flow()
            
            A[i, i] = diagonal
            
            # === TERMES EXTRA-DIAGONAUX et VECTEUR B ===
            # Flux ENTRANTS
            
            for source, _, edge_data in G.in_edges(node_id, data=True):
                flow = edge_data.get('data')
                if not flow or not flow.active:
                    continue
                
                q_in = flow.get_effective_flow()
                flow_type = edge_data.get('flow_type')
                
                # Source est un nœud Dirichlet: contribution dans B
                if source in self.dir_nodes:
                    source_node = G.nodes[source].get('data')
                    if source_node:
                        c_source = source_node.get_concentration(ion_id)
                        B[i] += q_in * c_source
                
                # Source est un nœud variable: terme extra-diagonal dans A
                elif source in self.node_index:
                    j = self.node_index[source]
                    A[i, j] -= q_in  # Signe négatif car ramené au membre de gauche
                
                # Source est un nœud SOURCE (eau pure): contribution nulle à B
                
        return csr_matrix(A), B
    
    def get_sparsity_pattern(self) -> Dict[str, any]:
        """
        Analyse la structure creuse de la matrice.
        
        Returns:
            Statistiques sur la structure de A
        """
        if self.n == 0:
            return {}
        
        # Construction d'une matrice de test
        A_test, _ = self.build_matrices("dummy")
        A_dense = A_test.toarray()
        
        nnz = A_test.nnz
        total = self.n * self.n
        
        return {
            'n_variables': self.n,
            'n_dirichlet': len(self.dir_nodes),
            'nnz': nnz,
            'sparsity': 1 - (nnz / total),
            'is_diagonally_dominant': self._check_diagonal_dominance(A_dense)
        }
    
    def _check_diagonal_dominance(self, A: np.ndarray) -> bool:
        """Vérifie si la matrice est à diagonale dominante."""
        for i in range(self.n):
            diag = abs(A[i, i])
            off_diag = sum(abs(A[i, j]) for j in range(self.n) if j != i)
            if diag < off_diag:
                return False
        return True