"""
Solveur pour le régime permanent : résolution de A·C = B.
"""

from typing import Dict, List, Optional, Union
import numpy as np
from scipy.sparse.linalg import spsolve, gmres, bicgstab
import pandas as pd
import warnings

from quantum_st.core.workshop import Workshop
from .matrix_builder import MatrixBuilder


class StationarySolver:
    """
    Solveur pour le régime permanent (stationnaire).
    
    Résout le système linéaire A·C = B pour chaque ion indépendamment.
    La matrice A est identique pour tous les ions (même hydraulique),
    seul le vecteur B change selon les contributions Dirichlet.
    
    Attributes:
        workshop: Atelier à résoudre
        builder: Constructeur de matrices
        results: Résultats stockés {ion: {node_id: concentration}}
    """
    
    # Méthodes de résolution disponibles
    SOLVERS = {
        'direct': spsolve,
        'gmres': lambda A, b: gmres(A, b, tol=1e-10)[0],
        'bicgstab': lambda A, b: bicgstab(A, b, tol=1e-10)[0]
    }
    
    def __init__(self, workshop: Workshop):
        """
        Initialise le solveur.
        
        Args:
            workshop: Atelier à simuler
        """
        self.workshop = workshop
        self.builder = MatrixBuilder(workshop)
        self.results: Dict[str, Dict[str, float]] = {}
        
        # Analyse de la structure
        self.sparsity_info = self.builder.get_sparsity_pattern()
    
    def solve(self, 
             ion_ids: List[str], 
             method: str = 'direct',
             store_results: bool = True) -> pd.DataFrame:
        """
        Résout le système pour une liste d'ions.
        
        Args:
            ion_ids: Liste des ions à simuler (ex: ['Ni2+', 'Cl-', 'Na+'])
            method: Méthode de résolution ('direct', 'gmres', 'bicgstab')
            store_results: Si True, stocke dans les objets ProcessNode
            
        Returns:
            DataFrame avec les concentrations par nœud et par ion
            
        Raises:
            ValueError: Si méthode inconnue ou système singulier
        """
        if method not in self.SOLVERS:
            raise ValueError(f"Méthode {method} inconnue. Choix: {list(self.SOLVERS.keys())}")
        
        solver_func = self.SOLVERS[method]
        all_results = []
        
        for ion in ion_ids:
            # Construction des matrices
            A, B = self.builder.build_matrices(ion)
            
            # Vérification de la régularité
            if A.nnz == 0:
                warnings.warn(f"Matrice vide pour {ion}")
                continue
            
            # Résolution
            try:
                C = solver_func(A, B)
            except Exception as e:
                raise RuntimeError(f"Échec résolution pour {ion}: {e}")
            
            # Vérification des valeurs négatives (non-physiques)
            negative_mask = C < 0
            if np.any(negative_mask):
                neg_count = np.sum(negative_mask)
                warnings.warn(f"{neg_count} concentrations négatives pour {ion} "
                            f"(tronquées à 0)")
                C = np.maximum(C, 0)
            
            # Stockage
            self.results[ion] = {}
            var_nodes = self.builder.var_nodes
            
            for idx, node_id in enumerate(var_nodes):
                conc = float(C[idx])
                self.results[ion][node_id] = conc
                
                # Stockage dans l'objet ProcessNode
                if store_results:
                    node = self.workshop.graph.nodes[node_id].get('data')
                    if node:
                        node.computed_concentrations[ion] = conc
            
            # Création DataFrame pour cet ion
            df_ion = pd.DataFrame({
                'node_id': var_nodes,
                'ion': ion,
                'concentration_g_l': C,
                'line_id': [self.workshop.get_node_line(n) for n in var_nodes]
            })
            all_results.append(df_ion)
        
        if not all_results:
            return pd.DataFrame()
        
        return pd.concat(all_results, ignore_index=True)
    
    def get_mass_balance(self, ion_id: str, node_id: str) -> Dict[str, float]:
        """
        Calcule le bilan de masse détaillé pour un nœud et un ion.
        
        Args:
            ion_id: Ion concerné
            node_id: Nœud à analyser
            
        Returns:
            Dict avec entrées, sorties, et résidu
        """
        if ion_id not in self.results:
            raise ValueError(f"Ion {ion_id} non calculé. Appelez solve() d'abord.")
        
        G = self.workshop.graph
        if node_id not in G:
            raise ValueError(f"Nœud {node_id} inexistant")
        
        balance = {
            'entrées': 0.0,
            'sorties': 0.0,
            'stockage': 0.0,
            'résidu': 0.0
        }
        
        c_node = self.results[ion_id].get(node_id, 0.0)
        
        # Flux entrants
        for source, _, data in G.in_edges(node_id, data=True):
            flow = data.get('data')
            if not flow:
                continue
            
            q = flow.get_effective_flow()
            
            if source in self.builder.dir_nodes:
                c_source = G.nodes[source].get('data').get_concentration(ion_id)
            elif source in self.results[ion_id]:
                c_source = self.results[ion_id][source]
            else:
                c_source = 0.0
            
            balance['entrées'] += q * c_source
        
        # Flux sortants
        for _, target, data in G.out_edges(node_id, data=True):
            flow = data.get('data')
            if not flow:
                continue
            
            q = flow.get_effective_flow()
            balance['sorties'] += q * c_node
        
        # Résidu (doit être proche de 0 en régime permanent)
        balance['résidu'] = balance['entrées'] - balance['sorties']
        
        return balance
    
    def get_global_balance(self, ion_id: str) -> Dict[str, float]:
        """
        Bilan de masse global de l'atelier pour un ion.
        
        Returns:
            Dict avec entrées totales, sorties, et conservation
        """
        total_in = 0.0
        total_out = 0.0
        
        # Entrées depuis les sources Dirichlet
        for node_id in self.builder.dir_nodes:
            node = self.workshop.graph.nodes[node_id].get('data')
            if not node:
                continue
            
            c = node.get_concentration(ion_id)
            
            # Flux sortants de ce nœud Dirichlet
            for _, target, data in self.workshop.graph.out_edges(node_id, data=True):
                flow = data.get('data')
                if flow:
                    total_in += flow.get_effective_flow() * c
        
        # Sorties vers les puits
        for node_id in self.builder.var_nodes:
            c = self.results[ion_id].get(node_id, 0.0)
            
            for _, target, data in self.workshop.graph.out_edges(node_id, data=True):
                target_node = self.workshop.graph.nodes[target].get('data')
                if target_node and target_node.node_type.value == 'puits':
                    flow = data.get('data')
                    if flow:
                        total_out += flow.get_effective_flow() * c
        
        return {
            'entrées_g_h': total_in,
            'sorties_g_h': total_out,
            'conservation_%': 100 * (1 - abs(total_in - total_out) / max(total_in, 1e-10))
        }