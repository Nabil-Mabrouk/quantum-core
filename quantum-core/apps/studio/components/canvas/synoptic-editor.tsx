'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { 
  ArrowDown, 
  AlertTriangle, 
  ArrowRightLeft, 
  ArrowUpRight,
  CornerDownRight,
  Layers,
  Map,
  Zap,
  MoveRight
} from 'lucide-react';
import { clsx } from 'clsx';

// Configuration visuelle par type de bac
const TYPE_STYLES: any = {
  PROCESS: { 
    label: "Bain Actif", 
    iconName: "Beaker", 
    colors: "border-purple-200 bg-purple-50/30 hover:border-purple-400", 
    badge: "bg-purple-100 text-purple-700", 
    barColor: "bg-purple-500" 
  },
  CLASSIC_RINSE: { 
    label: "Rinçage", 
    iconName: "Droplets", 
    colors: "border-blue-200 bg-blue-50/30 hover:border-blue-400", 
    badge: "bg-blue-100 text-blue-700", 
    barColor: "bg-blue-500" 
  },
  STATIC_RINSE: { 
    label: "Bain Mort", 
    iconName: "Anchor", 
    colors: "border-slate-200 bg-slate-50/30 hover:border-slate-400", 
    badge: "bg-slate-100 text-slate-700", 
    barColor: "bg-slate-500" 
  }
};

export function SynopticEditor() {
  const { 
    nodes, 
    edges, 
    selectedNodeId, 
    setSelectedNodeId,
    synopticMode, // 'PHYSICAL' | 'SEQUENCE'
    sequences,
    selectedSequenceId 
  } = useCanvasStore();
  
  const activeSeq = sequences.find(s => s.id === selectedSequenceId);

  // --- 1. LOGIQUE D'ORDONNANCEMENT ---
  let orderedNodes: any[] = [];
  let title = "";
  let subTitle = "";

  if (synopticMode === 'PHYSICAL') {
    // MODE STRUCTURE : Tri géographique par l'axe X
    orderedNodes = nodes
      .filter(n => n.type === "TANK") 
      .sort((a, b) => a.position.x - b.position.x);
    title = "Synoptique du Système";
    subTitle = "Implantation physique des équipements (Ordre X)";
  } else {
    // MODE GAMME : Suivi de l'itinéraire logique
    if (activeSeq) {
        orderedNodes = activeSeq.steps
            .map(stepId => nodes.find(n => n.id === stepId))
            .filter(Boolean); // Ignore les noeuds supprimés
        
        title = activeSeq.name;
        subTitle = `Itinéraire logique de production (${orderedNodes.length} étapes)`;
    } else {
        title = "Sélectionnez une gamme";
        subTitle = "Utilisez le gestionnaire en bas pour choisir une séquence";
    }
  }

  // Helper pour les labels des connexions logiques
  const getNodeLabel = (targetId: string | null) => {
    if (!targetId) return null;
    const t = nodes.find(n => n.id === targetId);
    return t ? t.data.label : "?";
  };

  return (
    <div 
      className="flex h-full bg-slate-50 overflow-hidden relative"
      onClick={() => setSelectedNodeId(null)}
    >
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-xl mx-auto space-y-4">
          
          {/* --- HEADER DE VUE DYNAMIQUE --- */}
          <div className="mb-6 text-center animate-in fade-in slide-in-from-top-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 shadow-sm">
                {synopticMode === 'PHYSICAL' ? <Map className="w-3 h-3" /> : <Layers className="w-3 h-3 text-blue-500" />}
                Vue {synopticMode === 'PHYSICAL' ? 'Implantation' : 'Gamme de fabrication'}
              </div>
              
              <h2 className={clsx(
                "text-3xl font-black tracking-tight transition-colors",
                synopticMode === 'SEQUENCE' ? "text-blue-600" : "text-slate-900"
              )}>
                {title}
              </h2>

              {/* AFFICHAGE DES PARAMÈTRES DE LA GAMME (Mode Séquence uniquement) */}
              {synopticMode === 'SEQUENCE' && activeSeq && (
                <div className="flex items-center justify-center gap-3 mt-4 animate-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
                        <Zap className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-600 uppercase">
                          Cadence : <span className="font-black">{activeSeq.properties.cadence ?? 0} u/h</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
                        <MoveRight className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-600 uppercase">
                          Entraînement : <span className="font-black">{activeSeq.properties.dragOut ?? 0} L/u</span>
                        </span>
                    </div>
                </div>
              )}
              
              {synopticMode === 'PHYSICAL' && (
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-2">{subTitle}</p>
              )}
          </div>

          {/* ÉTAT VIDE */}
          {orderedNodes.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50">
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  {synopticMode === 'SEQUENCE' && !selectedSequenceId 
                    ? "Aucune gamme sélectionnée" 
                    : "Aucun élément à afficher"}
               </p>
            </div>
          )}

          {/* LISTE DES ÉTAPES / POSTES */}
          {orderedNodes.map((node: any, idx: number) => {
            const props = node.data.properties || {};
            const type = props.type || 'CLASSIC_RINSE';
            const style = TYPE_STYLES[type] || TYPE_STYLES.CLASSIC_RINSE;
            const isSelected = selectedNodeId === node.id;

            const simResults = props.simulationResults as any;
            const concentrations = simResults?.concentrations || {};
            const warnings = simResults?.warnings || [];
            const mainPollutant = Object.entries(concentrations)[0];
            
            const dumpLabel = getNodeLabel(props.dumpingNetworkId);
            const overflowLabel = getNodeLabel(props.overflowNetworkId);
            const compLabel = getNodeLabel(props.compensationSourceId);

            return (
              <div key={`${node.id}-${idx}`} className="flex flex-col items-center relative animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 40}ms` }}>
                
                {/* CARTE D'ÉQUIPEMENT */}
                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                  className={clsx(
                    "w-full p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden bg-white z-10",
                    style.colors,
                    isSelected ? "ring-2 ring-blue-500 ring-offset-2 border-transparent shadow-xl scale-[1.02]" : "shadow-sm",
                    warnings.some((w:any) => w.severity === 'CRITICAL') && !isSelected && "border-red-300 bg-red-50/20"
                  )}
                >
                  <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                          <div className={clsx("p-2 rounded-xl", style.badge)}>
                              <DynamicIcon name={style.iconName} className="w-5 h-5" />
                          </div>
                          <div>
                              <div className="flex items-center gap-2">
                                  <span className={clsx(
                                    "text-[9px] font-black uppercase tracking-widest",
                                    synopticMode === 'SEQUENCE' ? "text-blue-500" : "text-slate-400"
                                  )}>
                                    {synopticMode === 'SEQUENCE' ? `Étape ${idx + 1}` : `Poste ${idx + 1}`}
                                  </span>
                                  <span className={clsx("text-[8px] px-1.5 py-0.5 rounded font-bold uppercase", style.badge)}>{style.label}</span>
                              </div>
                              <h4 className="text-lg font-black text-slate-800 mt-1">{node.data.label}</h4>
                          </div>
                      </div>
                      
                      {/* --- INDICATEURS TECHNIQUES (Droit) --- */}
                      <div className="text-right space-y-1">
                          {synopticMode === 'PHYSICAL' ? (
                            <>
                                <div className="text-[10px] font-mono font-bold text-slate-500 bg-white/50 px-2 py-0.5 rounded border border-slate-100">
                                  {props.volume || 0} L
                                </div>
                                <div className="text-[10px] font-mono font-bold text-slate-500 bg-white/50 px-2 py-0.5 rounded border border-slate-100">
                                  {props.temp || 20}°C
                                </div>
                            </>
                          ) : (
                             <div className="text-[9px] font-black text-blue-600 bg-blue-50/50 px-2 py-1 rounded border border-blue-100 flex flex-col items-end">
                                <span className="opacity-60 uppercase text-[7px]">Apport Gamme</span>
                                <span className="text-xs">
                                    {((activeSeq?.properties.cadence ?? 0) * (activeSeq?.properties.dragOut ?? 0)).toFixed(2)} L/h
                                </span>
                             </div>
                          )}
                      </div>
                  </div>

                  {/* ALERTES D'INGÉNIERIE */}
                  {warnings.map((w: any, i: number) => (
                    <div key={i} className={clsx(
                        "mb-3 p-2 rounded-lg text-[10px] font-bold flex items-start gap-2 animate-in slide-in-from-left-2",
                        w.severity === 'CRITICAL' ? "bg-red-50 text-red-700 border border-red-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                    )}>
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{w.message}</span>
                    </div>
                  ))}

                  {/* BARRE DE POLLUTION (Simulation) */}
                  {mainPollutant && (
                      <div className="mt-4 bg-white/60 p-3 rounded-xl backdrop-blur-sm border border-white/50">
                          <div className="flex justify-between items-end mb-1.5">
                              <span className="text-[9px] font-bold text-slate-500 uppercase">{mainPollutant[0] as string}</span>
                              <span className="text-xs font-black text-slate-900">
                                {Number(mainPollutant[1]).toFixed(2)} <span className="text-[9px] text-slate-400 font-medium italic">g/L</span>
                              </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                              <div 
                                className={clsx("h-full rounded-full transition-all duration-1000", style.barColor)} 
                                style={{ width: `${Math.min((Number(mainPollutant[1]) / 50) * 100, 100)}%` }} 
                              />
                          </div>
                      </div>
                  )}

                  {/* CONNEXIONS LOGIQUES (Footer) */}
                  <div className="mt-4 pt-3 border-t border-slate-200/50 flex flex-wrap gap-2">
                    {compLabel && <Badge icon={ArrowRightLeft} label="Compensé par" value={compLabel} color="blue" />}
                    {dumpLabel && <Badge icon={ArrowDown} label="Vidange" value={dumpLabel} color="orange" />}
                    {overflowLabel && <Badge icon={ArrowUpRight} label="Surverse" value={overflowLabel} color="emerald" />}
                  </div>
                </div>

                {/* FLÈCHE DE LIAISON */}
                {idx < orderedNodes.length - 1 && (
                  <div className="h-8 w-0.5 bg-slate-200 my-1 relative z-0">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-full p-1 text-slate-300 shadow-sm">
                          <ArrowDown className="w-3 h-3" />
                      </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Petit badge informatif pour les raccordements "sans fils"
 */
function Badge({ icon: Icon, label, value, color }: any) {
    const colors: any = {
        blue: "bg-blue-50 border-blue-200 text-blue-700",
        orange: "bg-orange-50 border-orange-200 text-orange-700",
        emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    };
    const c = colors[color] || colors.blue;
    return (
        <div className={clsx("flex items-center gap-1.5 border px-2 py-1 rounded-lg transition-all", c)}>
            <Icon className="w-3 h-3 opacity-70" />
            <div className="flex flex-col leading-none">
                <span className="text-[7px] font-bold opacity-60 uppercase">{label}</span>
                <span className="text-[9px] font-bold max-w-[120px] truncate">{value}</span>
            </div>
        </div>
    );
}