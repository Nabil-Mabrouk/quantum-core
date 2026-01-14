'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Factory, 
  Waves, 
  Box, 
  Wand2 
} from 'lucide-react';
import { clsx } from 'clsx';
import { Panel } from '@xyflow/react';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';

export function LayerControl() {
  const visibleScopes = useCanvasStore((state) => state.visibleScopes);
  const toggleScopeVisibility = useCanvasStore((state) => state.toggleScopeVisibility);
  const applyAutoLayout = useCanvasStore((state) => state.applyAutoLayout);
  
  const locale = 'fr'; // À terme, peut être récupéré via un hook contextuel

  const scopeConfig = [
    { id: 'PROCESS', icon: Factory, color: 'blue', label: { fr: 'Ligne Process', en: 'Process Line' } },
    { id: 'UTILITY', icon: Waves, color: 'emerald', label: { fr: 'Réseaux & Utilités', en: 'Utilities' } },
    { id: 'INFRASTRUCTURE', icon: Box, color: 'slate', label: { fr: 'Infrastructure', en: 'Infrastructure' } },
  ];

  return (
    <Panel position="bottom-left" className="mb-20 ml-4">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-1.5 rounded-2xl shadow-2xl flex flex-col gap-1 min-w-[200px]">
        
        {/* --- SECTION 1 : OUTILS D'ORGANISATION --- */}
        <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2 mb-1">
            <Wand2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Organisation</span>
        </div>

        <button
          onClick={() => {
            applyAutoLayout();
            toast.success("Auto-Layout appliqué", {
                description: "Le graphe a été réorganisé selon le flux de production."
            });
          }}
          className="flex items-center gap-3 px-3 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all mb-2 shadow-lg shadow-blue-900/20 group/wand"
        >
          <div className="p-1.5 bg-white/20 rounded-lg group-hover/wand:rotate-12 transition-transform">
            <Wand2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Réorganiser le graphe</span>
        </button>

        <div className="h-px bg-slate-100 my-1 mx-2" />

        {/* --- SECTION 2 : VISIBILITÉ DES CALQUES --- */}
        <div className="px-3 py-2 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Calques de vue</span>
        </div>

        {scopeConfig.map((scope) => {
          const isVisible = visibleScopes.includes(scope.id);
          const Icon = scope.icon;

          return (
            <button
              key={scope.id}
              onClick={() => toggleScopeVisibility(scope.id)}
              className={clsx(
                "flex items-center justify-between gap-4 px-3 py-2 rounded-xl transition-all group",
                isVisible 
                  ? `bg-${scope.color}-50 text-${scope.color}-700 border border-${scope.color}-100` 
                  : "bg-transparent text-slate-400 border border-transparent hover:bg-slate-100"
              )}
            >
              <div className="flex items-center gap-2">
                <div className={clsx(
                    "p-1.5 rounded-lg transition-colors",
                    isVisible ? `bg-${scope.color}-500 text-white shadow-sm` : "bg-slate-100 text-slate-400"
                )}>
                    <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tight">
                    {t(scope.label, locale as any)}
                </span>
              </div>

              {isVisible ? (
                <Eye className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 opacity-20" />
              )}
            </button>
          );
        })}
      </div>
    </Panel>
  );
}