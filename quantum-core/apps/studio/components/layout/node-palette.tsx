'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { Plus, ChevronDown } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { useMemo } from 'react';
import { ResizablePanel } from '@/components/ui/resizable-panel';

interface NodePaletteProps {
  config: any;
}

export function NodePalette({ config }: NodePaletteProps) {
  const addNode = useCanvasStore((state) => state.addNode);
  const viewMode = useCanvasStore((state) => state.viewMode);

  const groupedNodes = useMemo(() => {
    const groups: Record<string, any[]> = {};
    const nodes = Object.values(config.nodeTypes || {});
    nodes.forEach((node: any) => {
      const cat = node.category || "Autres";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(node);
    });
    return groups;
  }, [config]);

  if (viewMode === 'SUMMARY') return null;

  return (
    <ResizablePanel side="left" initialWidth={260} minWidth={180} maxWidth={450}>
      <div className="flex flex-col h-full bg-white">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">
            Équipements {config.name}
          </h2>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {Object.entries(groupedNodes).map(([category, nodes]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-slate-400 pl-1 flex items-center gap-1 truncate">
                  <ChevronDown className="w-3 h-3 shrink-0" /> {category}
              </h3>
              
              <div className="grid gap-2">
                  {nodes.map((node: any) => (
                    <button
                      key={node.id}
                      onClick={() => addNode(node.id, { x: 100, y: 100 })}
                      className="group flex items-center w-full gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all text-left cursor-pointer overflow-hidden"
                    >
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
                        <DynamicIcon name={node.iconName} className="w-4 h-4" />
                      </div>

                      {/* CORRECTION OVERFLOW : min-w-0 et truncate */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate group-hover:text-blue-700">
                            {node.label}
                        </p>
                        {node.description && (
                          <p className="text-[9px] text-slate-400 truncate italic">
                            {node.description}
                          </p>
                        )}
                      </div>
                      
                      <Plus className="w-3 h-3 text-slate-300 group-hover:text-blue-500 shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-center shrink-0">
            <p className="text-[8px] text-slate-300 font-bold uppercase tracking-tighter">
              v2.2 • {config.id}
            </p>
        </div>
      </div>
    </ResizablePanel>
  );
}