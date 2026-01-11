// FILE: apps/studio/components/layout/project-initializer.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/store/canvas-store';

export function ProjectInitializer({ 
  projectId, 
  systemId, // <--- RENOMMÉ
  initialNodes, 
  initialEdges,
  initialSequences
}: any) {
  const store = useCanvasStore();
  const lastLoadedSystemId = useRef<string | null>(null);

  useEffect(() => {
    if (lastLoadedSystemId.current === systemId) return;

    console.log("🏗️ Initialisation du Store pour le système :", systemId);
    
    store.setProjectId(projectId);
    store.setSystemId(systemId); // <--- RENOMMÉ
    store.setGraph(initialNodes, initialEdges);
    store.setSequences(initialSequences || []);
    
    store.setSelectedNodeId(null);
    store.setSelectedEdgeId(null);

    lastLoadedSystemId.current = systemId;
    
  }, [systemId, projectId, initialNodes, initialEdges, initialSequences, store]);

  return null;
}