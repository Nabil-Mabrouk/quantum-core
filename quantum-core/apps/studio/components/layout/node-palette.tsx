'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { Plus } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';

interface NodePaletteProps {
  config: any;
}

export function NodePalette({ config }: NodePaletteProps) {
  const addNode = useCanvasStore((state) => state.addNode);

  // On récupère la liste des types définis dans le manifeste du domaine
  const nodeTypes = Object.values(config.nodeTypes || {});

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Bibliothèque {config.name}
        </h2>
      </div>
      
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        {nodeTypes.map((node: any) => (
          <button
            key={node.id}
            onClick={() => addNode(node.id, { x: Math.random() * 200, y: Math.random() * 200 })}
            className="group flex items-center w-full gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left"
          >
            {/* Icône dynamique basée sur le nom dans la config */}
            <div className={`p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors`}>
              <DynamicIcon name={node.iconName} className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-700">
                {node.label}
              </p>
              {node.description && (
                <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                  {node.description}
                </p>
              )}
            </div>
            
            <Plus className="w-4 h-4 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        ))}

        {nodeTypes.length === 0 && (
          <p className="text-xs text-center text-slate-400 py-10">
            Aucun équipement configuré.
          </p>
        )}
      </div>
    </aside>
  );
}