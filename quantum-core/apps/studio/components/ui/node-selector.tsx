'use client';

import { useCanvasStore, AppNode } from '@/store/canvas-store';
import { useMemo } from 'react';
import { Link } from 'lucide-react';

interface NodeSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  filter?: string[]; // Array of node types to include, e.g., ['TANK', 'DRAIN']
}

export function NodeSelector({ value, onChange, filter }: NodeSelectorProps) {
  // Get all nodes and the ID of the node currently being edited
  const allNodes = useCanvasStore(state => state.nodes);
  const selectedNodeId = useCanvasStore(state => state.selectedNodeId);

  // Memoize the filtered and grouped list of nodes
  const groupedNodes = useMemo(() => {
    // Filter nodes based on the provided filter and exclude the node being edited
    const eligibleNodes = allNodes.filter(node => 
      node.id !== selectedNodeId && 
      (!filter || filter.length === 0 || filter.includes(node.data.type))
    );

    // Group nodes by their role for better UX in the dropdown
    return eligibleNodes.reduce((acc, node) => {
      const role = node.data.role || 'PROCESS';
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(node);
      return acc;
    }, {} as Record<string, AppNode[]>);

  }, [allNodes, selectedNodeId, filter]);

  const hasNodes = Object.keys(groupedNodes).length > 0;

  return (
    <div className="relative w-full">
      <select 
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none"
        disabled={!hasNodes}
      >
        <option value="">{hasNodes ? '--- Sélectionner une cible ---' : 'Aucune cible disponible'}</option>
        {Object.entries(groupedNodes).map(([role, nodes]) => (
          <optgroup key={role} label={role}>
            {nodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.data.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <Link className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}