'use client';

import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/store/canvas-store';

export function ProjectInitializer({ 
  projectId, 
  lineId,              // Ajoutez lineId (pivot de la ligne active)
  initialNodes, 
  initialEdges,
  initialSequences     // Ajoutez les séquences (gammes)
}: any) {
  const store = useCanvasStore();
  
  // ✅ LE VERROU : On garde une trace de ce qui a été chargé en dernier
  const lastLoadedLineId = useRef<string | null>(null);

  useEffect(() => {
    // 🛡️ SÉCURITÉ : Si cette ligne est déjà chargée, on ne fait RIEN.
    // Cela coupe court à toute boucle infinie de rendu.
    if (lastLoadedLineId.current === lineId) return;

    console.log("🏗️ Initialisation du Store pour la ligne :", lineId);
    
    // Mise à jour de l'état global
    store.setProjectId(projectId);
    store.setLineId(lineId);
    store.setGraph(initialNodes, initialEdges);
    store.setSequences(initialSequences || []);
    
    // On réinitialise la sélection pour éviter les bugs visuels au changement de ligne
    store.setSelectedNodeId(null);
    store.setSelectedEdgeId(null);

    // ✅ On mémorise que cette ligne est chargée
    lastLoadedLineId.current = lineId;
    
  }, [lineId, projectId, initialNodes, initialEdges, initialSequences, store]);

  return null;
}