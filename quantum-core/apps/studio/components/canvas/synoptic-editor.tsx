'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { useMemo } from 'react';
import { 
  ArrowDown, 
  AlertTriangle, 
  Map, 
  Layers, 
  Zap, 
  MoveRight 
} from 'lucide-react';
import { clsx } from 'clsx';
import { getDomainConfig } from '@/lib/registry';

export function SynopticEditor() {
  const nodes = useCanvasStore(state => state.nodes);
  const sequences = useCanvasStore(state => state.sequences);
  const selectedSequenceId = useCanvasStore(state => state.selectedSequenceId);
  const synopticMode = useCanvasStore(state => state.synopticMode);
  const setSelectedNodeId = useCanvasStore(state => state.setSelectedNodeId);
  const selectedNodeId = useCanvasStore(state => state.selectedNodeId);

  // On récupère la config du domaine courant pour le mapping des styles
  const config = getDomainConfig();

  // --- CALCUL REACTIF DE L'ORDRE D'AFFICHAGE ---
  const { orderedNodes, title, subTitle, activeSeq } = useMemo(() => {
    let _nodes: any[] = [];
    let _title = "";
    let _subTitle = "";
    let _activeSeq = null;

    if (synopticMode === 'PHYSICAL') {
      // MODE IMPLANTATION : Tri par position X
      // On filtre les éléments qui sont des équipements (pas des tuyaux/edges)
      _nodes = nodes
        .filter(n => !n.id.startsWith('edge-')) 
        .sort((a, b) => a.position.x - b.position.x);
      
      _title = "Synoptique d'Implantation";
      _subTitle = "Ordre géographique (Gauche -> Droite)";
    
    } else {
      // MODE SÉQUENCE : Suivi de la gamme
      _activeSeq = sequences.find(s => s.id === selectedSequenceId);
      
      if (_activeSeq) {
        _nodes = _activeSeq.steps
            .map(stepId => nodes.find(n => n.id === stepId))
            .filter(Boolean);
        
        _title = _activeSeq.name;
        _subTitle = `Itinéraire logique (${_nodes.length} étapes)`;
      } else {
        _title = "Sélectionnez une gamme";
        _subTitle = "Ouvrez le gestionnaire de gammes en bas pour visualiser un itinéraire.";
      }
    }

    return { orderedNodes: _nodes, title: _title, subTitle: _subTitle, activeSeq: _activeSeq };
  }, [nodes, sequences, selectedSequenceId, synopticMode]);

  // Helper pour trouver le style visuel depuis le manifeste
  const getNodeStyle = (node: any) => {
    const typeDef = config.nodeTypes[node.type];
    if (!typeDef) return {
        label: node.type,
        iconName: "Box",
        colorClass: "slate"
    };

    return {
        label: typeDef.label,
        iconName: typeDef.iconName,
        // On convertit "purple-600" en base "purple" pour les variantes
        colorClass: typeDef.color.split('-')[0] || "slate"
    };
  };

  return (
    <div 
      className="flex h-full bg-slate-50/50 overflow-hidden relative"
      onClick={() => setSelectedNodeId(null)}
    >
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* --- HEADER --- */}
          <div className="text-center animate-in fade-in slide-in-from-top-2 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 shadow-sm">
                {synopticMode === 'PHYSICAL' ? <Map className="w-3 h-3" /> : <Layers className="w-3 h-3 text-blue-500" />}
                Vue {synopticMode === 'PHYSICAL' ? 'Implantation' : 'Gamme'}
              </div>
              
              <h2 className={clsx(
                "text-3xl font-black tracking-tight transition-colors",
                synopticMode === 'SEQUENCE' && activeSeq ? "text-blue-600" : "text-slate-900"
              )}>
                {title}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">{subTitle}</p>

              {/* KPI GAMME (Si mode Séquence et propriétés définies) */}
              {activeSeq && (
                <div className="flex items-center justify-center gap-3 mt-4 animate-in zoom-in-95">
                    {/* On affiche les KPIs de la séquence de manière générique */}
                    {Object.entries(activeSeq.properties).map(([key, val]: any) => (
                        <div key={key} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{key}</span>
                            <span className="text-xs font-black text-slate-900">{val}</span>
                        </div>
                    ))}
                </div>
              )}
          </div>

          {/* --- LISTE DES ÉLÉMENTS --- */}
          {orderedNodes.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50">
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  {synopticMode === 'SEQUENCE' && !selectedSequenceId 
                    ? "Aucune gamme active" 
                    : "Aucun équipement dans cette vue"}
               </p>
            </div>
          ) : (
            <div className="space-y-0"> 
              {orderedNodes.map((node: any, idx: number) => {
                const props = node.data.properties || {};
                const style = getNodeStyle(node);
                const colorBase = style.colorClass;
                
                const isSelected = selectedNodeId === node.id;
                const simResults = props.simulationResults || {};
                
                // Extraction générique des résultats numériques pour affichage (ex: concentrations, températures)
                // On cherche des objets/dictionnaires dans les résultats
                const metrics = Object.entries(simResults).filter(([_, val]) => typeof val === 'object' && val !== null && !Array.isArray(val));
                const warnings = simResults.warnings || [];

                return (
                  <div key={`${node.id}-${idx}`} className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500 group/node" style={{ animationDelay: `${idx * 50}ms` }}>
                    
                    {/* CARTE */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                      className={clsx(
                        "w-full p-1 rounded-2xl transition-all cursor-pointer relative",
                        isSelected ? "bg-slate-900 scale-[1.02] shadow-2xl z-10" : "bg-transparent hover:bg-slate-100"
                      )}
                    >
                        <div className={clsx(
                            "bg-white border-2 p-5 rounded-xl relative overflow-hidden transition-colors",
                            `border-${colorBase}-100 hover:border-${colorBase}-300`,
                            isSelected ? "border-transparent" : ""
                        )}>
                            {/* Titre & Type */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl shadow-sm bg-${colorBase}-50 text-${colorBase}-600`}>
                                        <DynamicIcon name={style.iconName} className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                {synopticMode === 'SEQUENCE' ? `Étape ${idx + 1}` : `Pos. ${idx + 1}`}
                                            </span>
                                            <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase bg-${colorBase}-100 text-${colorBase}-700`}>
                                                {style.label}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 leading-none">{node.data.label}</h3>
                                    </div>
                                </div>

                                {/* Indicateurs Clés (Volume, Temp) - Générique */}
                                <div className="text-right space-y-1">
                                    {Object.entries(props).slice(0, 2).map(([k, v]: any) => (
                                        (typeof v === 'number' || typeof v === 'string') && k !== 'catalogId' && (
                                            <div key={k} className="text-[10px] font-mono font-bold text-slate-500">
                                                {v} <span className="opacity-50 uppercase">{k}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Alertes */}
                            {warnings.length > 0 && (
                                <div className="mb-4 space-y-1">
                                    {warnings.map((w: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                                            <AlertTriangle className="w-3 h-3" /> {w.message}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Barres de Résultats (Générique) */}
                            {metrics.length > 0 ? (
                                <div className="space-y-3 mt-4 bg-white/50 p-3 rounded-xl border border-slate-100/50">
                                    {metrics.map(([category, values]: any) => (
                                        <div key={category}>
                                            <p className="text-[9px] font-black uppercase text-slate-400 mb-2">{category}</p>
                                            <div className="space-y-2">
                                                {Object.entries(values).map(([k, v]: any) => (
                                                    <div key={k}>
                                                        <div className="flex justify-between items-end mb-1">
                                                            <span className="text-[10px] font-bold text-slate-600">{k}</span>
                                                            <span className="text-xs font-bold text-slate-900">{v}</span>
                                                        </div>
                                                        {/* Barre de progression simplifiée (échelle relative) */}
                                                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full rounded-full bg-${colorBase}-500`} 
                                                                style={{ width: `${Math.min((v / 100) * 100, 100)}%` }} 
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-4 p-3 rounded-xl border border-dashed border-slate-200 text-center">
                                    <p className="text-[9px] text-slate-400 font-medium italic">En attente de simulation...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FLÈCHE DE LIAISON */}
                    {idx < orderedNodes.length - 1 && (
                      <div className="h-10 flex items-center justify-center">
                          <div className="h-full w-0.5 bg-slate-200 relative">
                              {synopticMode === 'SEQUENCE' && (
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-slate-300 p-1 rounded-full border border-slate-200 shadow-sm">
                                      <ArrowDown className="w-3 h-3" />
                                  </div>
                              )}
                          </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}