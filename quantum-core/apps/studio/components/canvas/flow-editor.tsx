'use client';

import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCanvasStore } from '@/store/canvas-store';
import { useMemo, useCallback } from 'react';
import { getDomainConfig } from '@/lib/registry';
import { getFlowNodeTypes } from '@/lib/component-registry';
import { LayerControl } from './layer-control'; // <--- Import ajouté

export function FlowEditor() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    setSelectedNodeId, 
    setSelectedEdgeId 
  } = useCanvasStore();
  
  const config = getDomainConfig();

  const nodeTypes = useMemo(() => {
    // On passe un objet vide en fallback, le registre gère le reste
    return getFlowNodeTypes(config.id, {});
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
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        fitView
      >
        <Background color="#cbd5e1" gap={20} size={1} />
        
        {/* CONTRÔLES STANDARDS */}
        <Controls className="bg-white border-slate-200 shadow-xl rounded-xl text-slate-600" />
        <MiniMap className="border border-slate-200 rounded-xl shadow-sm" />

        {/* --- NOTRE NOUVEAU CONTRÔLEUR DE CALQUES --- */}
        <LayerControl />

      </ReactFlow>
    </div>
  );
}