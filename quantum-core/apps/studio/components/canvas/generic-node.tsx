'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { getDomainConfig } from '@/lib/registry';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { clsx } from 'clsx';

export function GenericNode({ data, selected }: NodeProps<any>) {
  // 1. On récupère la config du domaine actif pour identifier ce type de noeud
  const config = getDomainConfig();
  const nodeConfig = config.nodeTypes[data.type];

  if (!nodeConfig) {
    return (
      <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-[10px] font-bold">
        Type Erreur: {data.type}
      </div>
    );
  }

  const properties = data.properties || {};

  return (
    <div 
      className={clsx(
        "min-w-[160px] rounded-2xl border-2 bg-white transition-all duration-300",
        selected 
          ? "border-slate-900 shadow-2xl ring-4 ring-slate-900/5 scale-105" 
          : `border-slate-200 shadow-sm hover:border-blue-400`
      )}
    >
      {/* Header du Nœud */}
      <div className="p-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50 rounded-t-[14px]">
        <div className="p-1 bg-white rounded-md border border-slate-200 shadow-sm">
            <DynamicIcon name={nodeConfig.iconName} className="w-3.5 h-3.5 text-slate-600" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            {nodeConfig.label}
        </span>
      </div>

      {/* Corps du Nœud */}
      <div className="p-4">
        <p className="text-xs font-bold text-slate-900 leading-none mb-1">
          {data.label || 'Sans nom'}
        </p>

        {/* Badge Catalogue si sélectionné */}
        {properties.catalogName && (
          <div className="mt-2 py-1 px-2 bg-blue-50 border border-blue-100 rounded-md">
             <p className="text-[8px] font-black text-blue-400 uppercase leading-none mb-0.5">Modèle</p>
             <p className="text-[10px] font-bold text-blue-700 truncate leading-tight">
               {properties.catalogName}
             </p>
          </div>
        )}
      </div>

      {/* Points de connexion (Handles) */}
      {/* Port d'entrée (Target) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-slate-300 border-2 border-white hover:bg-blue-500 transition-colors" 
      />
      
      {/* Port de sortie (Source) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-slate-300 border-2 border-white hover:bg-blue-500 transition-colors" 
      />
    </div>
  );
}