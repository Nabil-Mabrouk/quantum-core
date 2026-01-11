'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { 
  ArrowDown, 
  AlertTriangle, 
  ArrowRightLeft, 
  Waves,
  ArrowUpRight,
  CornerDownRight
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
  const { nodes, edges, selectedNodeId, setSelectedNodeId } = useCanvasStore();
  
  // 1. Identification de la gamme et des noeuds ordonnés
  //const activeSeq = sequences.find(s => s.id === selectedSequenceId);
  const orderedNodes = nodes
    .filter(n => n.type === "TANK") 
    .sort((a, b) => a.position.x - b.position.x);

  // Helper pour transformer un ID en Nom lisible
  const getNodeLabel = (targetId: string | null) => {
    if (!targetId) return null;
    const t = nodes.find(n => n.id === targetId);
    return t ? t.data.label : "?";
  };

  return (
    <div 
      className="flex h-full bg-slate-50 overflow-hidden relative"
      onClick={() => setSelectedNodeId(null)} // CLIC FOND = DÉSÉLECTION
    >
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-xl mx-auto space-y-2">
          
          <div className="mb-8 text-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Synoptique du système
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Ordre physique</p>
          </div>

          {orderedNodes.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[3rem]">
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucune étape définie</p>
            </div>
          )}

          {orderedNodes.map((node: any, idx: number) => {
            const props = node.data.properties || {};
            const type = props.type || 'CLASSIC_RINSE';
            const style = TYPE_STYLES[type] || TYPE_STYLES.CLASSIC_RINSE;
            const isSelected = selectedNodeId === node.id;

            // Données de Simulation et Alertes
            const simResults = props.simulationResults as any;
            const concentrations = simResults?.concentrations || {};
            const warnings = simResults?.warnings || [];
            const mainPollutant = Object.entries(concentrations)[0];
            
            // Connexions "Sans Fil"
            const dumpLabel = getNodeLabel(props.dumpingNetworkId);
            const overflowLabel = getNodeLabel(props.overflowNetworkId);
            const compLabel = getNodeLabel(props.compensationSourceId);

            // Cascade Physique (Lien Graphe)
            const incomingEdge = edges.find(e => e.target === node.id && nodes.find(src => src.id === e.source)?.type === 'TANK');
            const cascadeSourceLabel = incomingEdge ? getNodeLabel(incomingEdge.source) : null;

            return (
              <div key={node.id} className="flex flex-col items-center relative">
                
                {/* Visualisation Cascade Latérale */}
                {cascadeSourceLabel && (
                    <div className="absolute -left-32 top-8 flex items-center gap-2 text-blue-400 opacity-80 animate-in slide-in-from-right-2">
                        <span className="text-[9px] font-bold uppercase text-right w-24 leading-tight">Cascade depuis<br/>{cascadeSourceLabel}</span>
                        <CornerDownRight className="w-5 h-5" />
                    </div>
                )}

                {/* CARTE D'ÉTAPE */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation(); // EMPÊCHE LA DÉSÉLECTION DU FOND
                    setSelectedNodeId(node.id);
                  }}
                  className={clsx(
                    "w-full p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden bg-white z-10",
                    style.colors,
                    isSelected ? "ring-2 ring-blue-500 ring-offset-2 border-transparent shadow-xl scale-[1.02]" : "shadow-sm",
                    warnings.some((w:any) => w.severity === 'CRITICAL') && !isSelected && "border-red-300 bg-red-50/20"
                  )}
                >
                  {/* En-tête de la carte */}
                  <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                          <div className={clsx("p-2 rounded-xl", style.badge)}>
                              <DynamicIcon name={style.iconName} className="w-5 h-5" />
                          </div>
                          <div>
                              <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Étape {idx + 1}</span>
                                  <span className={clsx("text-[8px] px-1.5 py-0.5 rounded font-bold uppercase", style.badge)}>{style.label}</span>
                              </div>
                              <h4 className="text-lg font-black text-slate-800 leading-none mt-1">{node.data.label}</h4>
                          </div>
                      </div>
                      <div className="text-right space-y-1">
                          <div className="text-[10px] font-mono font-bold text-slate-500 bg-white/50 px-2 py-0.5 rounded border border-slate-100">
                            {props.volume || 0} L
                          </div>
                          <div className="text-[10px] font-mono font-bold text-slate-500 bg-white/50 px-2 py-0.5 rounded border border-slate-100">
                            {props.temp || 20}°C
                          </div>
                      </div>
                  </div>

                  {/* --- SECTION ALERTES --- */}
                  {warnings.map((w: any, i: number) => (
                    <div key={i} className={clsx(
                        "mb-3 p-2 rounded-lg text-[10px] font-bold flex items-start gap-2 animate-in slide-in-from-left-2",
                        w.severity === 'CRITICAL' ? "bg-red-50 text-red-700 border border-red-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                    )}>
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{w.message}</span>
                    </div>
                  ))}

                  {/* --- RÉSULTATS SIMULATION --- */}
                  {mainPollutant && (
                      <div className="mt-4 bg-white/60 p-3 rounded-xl backdrop-blur-sm border border-white/50">
                          <div className="flex justify-between items-end mb-1.5">
                              <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                {mainPollutant[0] as string}
                              </span>
                              <span className="text-xs font-black text-slate-900">
                                {Number(mainPollutant[1]).toFixed(2)} <span className="text-[9px] text-slate-400 font-medium">g/L</span>
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

                  {/* --- BADGES DE CONNEXION (FOOTER) --- */}
                  <div className="mt-4 pt-3 border-t border-slate-200/50 flex flex-wrap gap-2">
                    {compLabel && <Badge icon={ArrowRightLeft} label="Compensé par" value={compLabel} color="blue" />}
                    {dumpLabel && <Badge icon={ArrowDown} label="Vidange" value={dumpLabel} color="orange" />}
                    {overflowLabel && <Badge icon={ArrowUpRight} label="Surverse" value={overflowLabel} color="emerald" />}
                  </div>
                </div>

                {/* Flèche Séquentielle */}
                {idx < orderedNodes.length - 1 && (
                  <div className="h-8 w-0.5 bg-slate-200 my-1 relative z-0">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-full p-1 text-slate-300">
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
 * Composant interne pour l'affichage propre des tags de connexion
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