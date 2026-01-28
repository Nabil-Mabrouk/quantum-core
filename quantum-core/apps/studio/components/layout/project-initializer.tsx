// FILE: apps/studio/components/layout/project-initializer.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { getDomainConfig } from '@/lib/registry'; // 👈 NOUVEL IMPORT NÉCESSAIRE

export function ProjectInitializer({ 
  projectId, 
  systemId,
  initialNodes, 
  initialEdges,
  initialSequences
}: any) {
  const store = useCanvasStore();
  const lastLoadedSystemId = useRef<string | null>(null);

  useEffect(() => {
    // La logique existante pour éviter l'initialisation multiple
    if (lastLoadedSystemId.current === systemId) return;

    console.log("🏗️ Initialisation du Store pour le système :", systemId);
    
    // 1. Initialisation des IDs de base
    store.setProjectId(projectId);
    store.setSystemId(systemId);
    
    // --- NOUVELLE LOGIQUE D'HYDRATATION DES VALEURS PAR DÉFAUT ---
    try {
      const config = getDomainConfig(store.domainId); // Récupère le Manifeste
      const nodeTypes = config.nodeTypes;
      
      const hydratedNodes = initialNodes.map((n: any) => {
        const nodeSchema = nodeTypes[n.type];
        if (!nodeSchema) return n; // Retourne le noeud tel quel si pas de schéma

        // Crée un objet des propriétés par défaut en parcourant tous les champs
        const defaultProps: Record<string, any> = {};
        nodeSchema.groups.flatMap((g: any) => g.fields).forEach((f: any) => {
          if (f.default !== undefined) {
            defaultProps[f.id] = f.default;
          }
        });
        
        // Fusion: Valeur par Défaut < Valeur Persistée (DB)
        const newProperties = {
          ...defaultProps,
          ...n.data.properties
        };

        return {
          ...n,
          data: {
            ...n.data,
            properties: newProperties, // 👈 INJECTION DES PROPRIÉTÉS COMPLÈTES
          },
        };
      });
      
      store.setGraph(hydratedNodes, initialEdges); // 👈 Passe les nœuds hydratés
      
    } catch (e) {
      console.error("Erreur lors de l'hydratation du ProjectInitializer :", e);
      store.setGraph(initialNodes, initialEdges); // Fallback
    }

    store.setSequences(initialSequences || []);
    
    store.setSelectedNodeId(null);
    store.setSelectedEdgeId(null);

    lastLoadedSystemId.current = systemId;
    
  }, [systemId, projectId, initialNodes, initialEdges, initialSequences, store]);

  return null;
}