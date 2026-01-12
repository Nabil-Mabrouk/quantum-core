'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { Plus, ChevronDown } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { useMemo } from 'react';

interface NodePaletteProps {
  config: any;
}

export function NodePalette({ config }: NodePaletteProps) {
  const addNode = useCanvasStore((state) => state.addNode);
  const viewMode = useCanvasStore((state) => state.viewMode);

  // Groupement des nœuds par catégorie
  const groupedNodes = useMemo(() => {
    const groups: Record<string, any[]> = {};
    const nodes = Object.values(config.nodeTypes || {});
    
    nodes.forEach((node: any) => {
      const cat = node.category || "Autres";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(node);
    });
    
    // On peut optionnellement trier les catégories ici si besoin
    return groups;
  }, [config]);

  if (viewMode === 'SUMMARY') return null;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Bibliothèque {config.name}
        </h2>
      </div>
      
      <div className="p-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
        {Object.entries(groupedNodes).map(([category, nodes]) => (
          <div key={category} className="space-y-2">
            {/* Titre de Section */}
            <h3 className="text-[10px] font-black uppercase text-slate-400 pl-1 flex items-center gap-1">
                <ChevronDown className="w-3 h-3" /> {category}
            </h3>
            
            {/* Grille de boutons */}
            <div className="grid gap-2">
                {nodes.map((node: any) => (
                <button
                    key={node.id}
                    onClick={() => addNode(node.id, { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 })}
                    className="group flex items-center w-full gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all text-left cursor-pointer"
                >
                    <div className={`p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors`}>
                    <DynamicIcon name={node.iconName} className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate group-hover:text-blue-700">
                        {node.label}
                    </p>
                    {node.description && (
                        <p className="text-[9px] text-slate-400 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {node.description}
                        </p>
                    )}
                    </div>
                    
                    <Plus className="w-3 h-3 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
                ))}
            </div>
          </div>
        ))}
        
        {Object.keys(groupedNodes).length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Aucun équipement<br/>disponible
            </p>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-center">
          <p className="text-[8px] text-slate-300 font-bold uppercase tracking-tighter">
            Domain: {config.id} • v2.2
          </p>
      </div>
    </aside>
  );
}