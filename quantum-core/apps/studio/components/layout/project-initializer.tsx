'use client';

import { useEffect } from 'react';
import { useCanvasStore } from '@/store/canvas-store';

export function ProjectInitializer({ projectId, initialNodes, initialEdges }: any) {
  const { setProjectId, setGraph } = useCanvasStore();

  // On synchronise le store dès que le composant est monté
  useEffect(() => {
    setProjectId(projectId);
    setGraph(initialNodes, initialEdges);
  }, [projectId, initialNodes, initialEdges, setProjectId, setGraph]);

  return null; // Ce composant ne rend rien visuellement
}