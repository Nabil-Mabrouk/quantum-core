'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { Plus, ChevronDown } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { useMemo } from 'react';
import { ResizablePanel } from '@/components/ui/resizable-panel';
import { t } from '@/lib/i18n'; // <--- Import indispensable pour l'i18n
import { useParams } from 'next/navigation'; // 1. Import
import { Locale } from '@/lib/i18n'; // 2. Import du type

interface NodePaletteProps {
  config: any;
}

export function NodePalette({ config }: NodePaletteProps) {
  const addNode = useCanvasStore((state) => state.addNode);
  const viewMode = useCanvasStore((state) => state.viewMode);
  
  // À l'avenir, cette valeur viendra d'un hook useLocale()
  const params = useParams(); // 3. Récupère les paramètres d'URL
  const locale = (params.locale as Locale) || 'fr'; // 4. Dynamique !

  // Groupement des nœuds par catégorie traduite
  const groupedNodes = useMemo(() => {
    const groups: Record<string, any[]> = {};
    const nodes = Object.values(config.nodeTypes || {});
    
    nodes.forEach((node: any) => {
      // On traduit la catégorie avant de s'en servir comme clé de groupe
      const cat = t(node.category, locale) || "Autres";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(node);
    });
    
    return groups;
  }, [config, locale]);

  if (viewMode === 'SUMMARY') return null;

  return (
    <ResizablePanel side="left" initialWidth={260} minWidth={180} maxWidth={450}>
      <div className="flex flex-col h-full bg-white">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">
            {/* Traduction du nom du domaine (ex: Traitement de Surface) */}
            Équipements {t(config.name, locale)}
          </h2>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {Object.entries(groupedNodes).map(([category, nodes]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-slate-400 pl-1 flex items-center gap-1 truncate">
                  <ChevronDown className="w-3 h-3 shrink-0" /> 
                  {/* La catégorie est déjà traduite via le useMemo */}
                  {category}
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

                      {/* Flex-1 et min-w-0 pour permettre au truncate de fonctionner */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate group-hover:text-blue-700">
                            {/* Traduction du label (ex: Bain de Traitement) */}
                            {t(node.label, locale)}
                        </p>
                        {node.description && (
                          <p className="text-[9px] text-slate-400 truncate italic">
                            {/* Traduction de la description */}
                            {t(node.description, locale)}
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
              v3.3 • {config.id}
            </p>
        </div>
      </div>
    </ResizablePanel>
  );
}