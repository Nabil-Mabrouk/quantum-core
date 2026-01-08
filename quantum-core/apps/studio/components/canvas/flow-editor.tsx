'use client';

import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // Import CSS obligatoire
import { useCanvasStore } from '@/store/canvas-store';
import { GenericNode } from './generic-node';
import { useMemo } from 'react';

// On mappe le type interne "genericNode" vers notre composant React visuel
const nodeTypes = {
  genericNode: GenericNode,
};

export function FlowEditor() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect 
  } = useCanvasStore();

  // useMemo pour éviter que ReactFlow ne re-crée les objets à chaque render
  const memoNodeTypes = useMemo(() => nodeTypes, []);

  return (
    <div className="flex-1 h-full bg-slate-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={memoNodeTypes}
        fitView
      >
        <Background color="#cbd5e1" gap={20} size={1} />
        <Controls className="bg-white border-slate-200 shadow-xl" />
        <MiniMap className="border border-slate-200 rounded-lg shadow-sm" />
      </ReactFlow>
    </div>
  );
}