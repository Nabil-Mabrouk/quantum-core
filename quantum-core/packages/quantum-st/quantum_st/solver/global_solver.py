"""
Solveur global pour ateliers multi-lignes avec couplages.
"""

from typing import Dict, List, Optional
import pandas as pd
import numpy as np

from quantum_st.core.workshop import Workshop
from .stationary import StationarySolver


class GlobalSolver(StationarySolver):
    """
    Solveur global pour ateliers avec recyclages inter-lignes.
    
    Hérite de StationarySolver mais garantit que tous les couplages
    sont résolus simultanément dans une seule matrice A.
    
    C'est la méthode rigoureuse recommandée pour les ateliers avec
    des recyclages complexes entre lignes.
    """
    
    def __init__(self, workshop: Workshop):
        """
        Initialise le solveur global.
        
        Args:
            workshop: Atelier complet avec potentiels couplages
        """
        super().__init__(workshop)
        
        # Analyse des couplages
        self.couplings = workshop.get_coupling_matrix()
        self.has_couplings = len(self.couplings) > 0
    
    def solve(self, 
             ion_ids: List[str], 
             method: str = 'direct') -> pd.DataFrame:
        """
        Résout l'atelier entier en une seule passe.
        
        La matrice A inclut tous les nœuds variables de toutes les lignes,
        garantissant la cohérence des concentrations aux interfaces.
        
        Args:
            ion_ids: Liste des ions à simuler
            method: Méthode de résolution
            
        Returns:
            DataFrame avec résultats complets
        """
        if self.has_couplings:
            print(f"Résolution globale avec {len(self.couplings)} couplages inter-lignes")
        
        return super().solve(ion_ids, method)
    
    def get_inter_line_fluxes(self, ion_id: str) -> pd.DataFrame:
        """
        Calcule les flux massiques échangés entre lignes.
        
        Args:
            ion_id: Ion concerné
            
        Returns:
            DataFrame avec les flux par paire de lignes
        """
        if not self.has_couplings:
            return pd.DataFrame()
        
        if ion_id not in self.results:
            raise ValueError(f"Ion {ion_id} non calculé")
        
        rows = []
        
        for (src_line, tgt_line), flows in self.couplings.items():
            total_mass_flow = 0.0
            
            for flow in flows:
                # Concentration à la source du flux
                source_node = flow.source_id
                
                if source_node in self.results[ion_id]:
                    c_source = self.results[ion_id][source_node]
                elif self.workshop.graph.nodes[source_node].get('is_dirichlet'):
                    c_source = self.workshop.graph.nodes[source_node].get('data').get_concentration(ion_id)
                else:
                    c_source = 0.0
                
                mass_flow = flow.get_effective_flow() * c_source
                total_mass_flow += mass_flow
            
            rows.append({
                'source_line': src_line,
                'target_line': tgt_line,
                'volumetric_flow_L_h': sum(f.flow_rate for f in flows),
                'mass_flow_g_h': total_mass_flow,
                'ion': ion_id
            })
        
        return pd.DataFrame(rows)
    
    def get_line_contributions(self, ion_id: str) -> Dict[str, Dict[str, float]]:
        """
        Décompose les bilans par ligne.
        
        Returns:
            Dict {line_id: {entrées, sorties, interne}}
        """
        contributions = {}
        
        for line_id, line in self.workshop.lines.items():
            line_nodes = set(line.node_ids)
            
            line_in = 0.0
            line_out = 0.0
            line_internal = 0.0
            
            # Parcourir les flux de la ligne
            for node_id in line.node_ids:
                if node_id not in self.results[ion_id]:
                    continue
                
                c_node = self.results[ion_id][node_id]
                
                for _, target, data in self.workshop.graph.out_edges(node_id, data=True):
                    flow = data.get('data')
                    if not flow:
                        continue
                    
                    mass = flow.get_effective_flow() * c_node
                    
                    if target in line_nodes:
                        line_internal += mass
                    else:
                        # Sortie vers autre ligne ou puits
                        line_out += mass
                
                for source, _, data in self.workshop.graph.in_edges(node_id, data=True):
                    if source not in line_nodes:
                        # Entrée depuis autre ligne ou source
                        flow = data.get('data')
                        if flow:
                            if source in self.results[ion_id]:
                                c_src = self.results[ion_id][source]
                            else:
                                src_node = self.workshop.graph.nodes[source].get('data')
                                c_src = src_node.get_concentration(ion_id) if src_node else 0.0
                            
                            line_in += flow.get_effective_flow() * c_src
            
            contributions[line_id] = {
                'entrées_externes_g_h': line_in,
                'sorties_externes_g_h': line_out,
                'recyclage_interne_g_h': line_internal,
                'bilan_net_g_h': line_in - line_out
            }
        
        return contributions