'use client';

import { currentConfig } from '@/lib/domain-config';
import { useCanvasStore } from '@/store/canvas-store';
import { Plus } from 'lucide-react';

export function NodePalette() {
  const addNode = useCanvasStore((state) => state.addNode);

  // On récupère la liste des types définis dans la config (TANK, PUMP...)
  const nodeTypes = Object.values(currentConfig.nodeTypes);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
          Bibliothèque {currentConfig.name}
        </h2>
      </div>
      
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        {nodeTypes.map((type) => {
          const Icon = type.icon;
          
          return (
            <button
              key={type.id}
              onClick={() => addNode(type.id, { x: Math.random() * 400, y: Math.random() * 400 })}
              className="group flex items-center w-full gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all text-left"
            >
              <div className={`p-2 rounded-md bg-white border shadow-sm group-hover:text-blue-600`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-700 group-hover:text-blue-700">{type.label}</p>
                <p className="text-[10px] text-slate-400 line-clamp-1">{type.description}</p>
              </div>
              <Plus className="w-4 h-4 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}