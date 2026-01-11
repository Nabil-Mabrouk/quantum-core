'use client';

import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCanvasStore } from '@/store/canvas-store';
import { useMemo, useCallback } from 'react';
import { GenericNode } from './generic-node';
import { getDomainConfig } from '@/lib/registry';
// ON IMPORTE LE REGISTRE
import { getFlowNodeTypes } from '@/lib/component-registry';

export function FlowEditor() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNodeId, setSelectedEdgeId } = useCanvasStore();
  const config = getDomainConfig(); // Récupère la config active (WATER)

  // ON GÉNÈRE LES TYPES DYNAMIQUEMENT
  const nodeTypes = useMemo(() => {
    const defaults = { genericNode: GenericNode };
    // Le registre va fusionner les types spécifiques (TANK, SINK...) selon le domaine actif
    return getFlowNodeTypes(config.id, defaults);
  }, [config.id]);

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [setSelectedNodeId, setSelectedEdgeId]);

  return (
    <div className="flex-1 h-full bg-slate-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes} // <--- C'est ici que ça devient générique
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        fitView
      >
        <Background color="#cbd5e1" gap={20} size={1} />
        <Controls className="bg-white border-slate-200 shadow-xl rounded-xl text-slate-600" />
        <MiniMap className="border border-slate-200 rounded-xl shadow-sm" />
      </ReactFlow>
    </div>
  );
}