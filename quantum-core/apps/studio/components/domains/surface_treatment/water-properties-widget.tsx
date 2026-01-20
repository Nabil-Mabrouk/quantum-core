'use client';

import { useState, useEffect } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { 
  Waves, 
  ArrowRightLeft, 
  ArrowDown, 
  Network, 
  Droplets, 
  ArrowUpRight, 
  ArrowDownLeft,
  Activity,
  Plus,
  Zap,
  Info
} from 'lucide-react';
import { getProjectStreams, connectNodeToStreamAction, createStreamAction } from '@/app/actions/stream';
import { clsx } from 'clsx';
import { NodeSelector } from '@/components/ui/node-selector';

export function WaterPropertiesWidget({ nodeId }: { nodeId: string }) {
  const node = useCanvasStore(state => state.nodes.find(n => n.id === nodeId));
  const nodes = useCanvasStore(state => state.nodes);
  const projectId = useCanvasStore(state => state.projectId);
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);

  const [projectStreams, setProjectStreams] = useState<any[]>([]);
  const [isLoadingStreams, setIsLoadingStreams] = useState(false);

  useEffect(() => {
    if (projectId) {
      setIsLoadingStreams(true);
      getProjectStreams(projectId)
        .then(setProjectStreams)
        .finally(() => setIsLoadingStreams(false));
    }
  }, [projectId]);

  if (!node) return null;

  const isProcessBath = node.type === 'PROCESS_BATH';
  const isRinseTank = node.type === 'RINSE_TANK';
  const isSink = node.type === 'DRAIN';
  const isSource = node.type === 'SOURCE';
  const isAnyTank = isProcessBath || isRinseTank;

  const props = node.data.properties || {};
  const simResults = props.simulationResults || null;

  const handleStreamConnect = async (streamId: string | null) => {
    const direction = isSink ? 'OUTPUT' : 'INPUT';
    try {
      await connectNodeToStreamAction(nodeId, streamId, direction);
      const field = direction === 'INPUT' ? 'inputStreamId' : 'outputStreamId';
      updateNodeProperties(nodeId, { [field]: streamId });
    } catch (e) {
      alert("Erreur de connexion au bus projet.");
    }
  };

  const handleCreateNewStream = async () => {
    const name = prompt("Nom du nouveau flux global (ex: Rejets Cyanurés) :");
    if (name && projectId) {
      const newStream = await createStreamAction(projectId, name);
      setProjectStreams([...projectStreams, newStream]);
      handleStreamConnect(newStream.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. SECTION BUS PROJET (DRAIN / SOURCE) */}
      {(isSink || isSource) && (
        <div className="p-5 bg-blue-900 text-white rounded-[2rem] space-y-5 shadow-2xl border border-blue-800 relative overflow-hidden">
            <Network className="absolute -right-4 -top-4 w-24 h-24 text-white/5 rotate-12" />
            <div className="flex items-center gap-3 border-b border-blue-800 pb-3 relative z-10">
                <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
                    <Network className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-200 leading-none">Bus Projet</h4>
                    <p className="text-xs font-bold text-white mt-1">Interface Inter-Systèmes</p>
                </div>
            </div>
            <div className="space-y-3 relative z-10">
                <label className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">
                    {isSink ? "Expédier vers le flux global :" : "Recevoir depuis le flux global :"}
                </label>
                <select 
                    className="w-full p-3 bg-blue-800 border border-blue-700 rounded-xl text-sm font-bold text-white shadow-inner outline-none appearance-none cursor-pointer"
                    value={isSink ? (props.outputStreamId || "") : (props.inputStreamId || "")}
                    onChange={(e) => handleStreamConnect(e.target.value || null)}
                >
                    <option value="">-- Réseau Local Isolé --</option>
                    {projectStreams.map(s => (
                        <option key={s.id} value={s.id}>FLUX: {s.name}</option>
                    ))}
                </select>
            </div>
        </div>
      )}

      {/* 2. SECTION RÉSULTATS (AUTOMATISATION) */}
      {isAnyTank && (
        <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-4 shadow-xl border border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {simResults ? "Calculs d'Appoints" : "Attente Simulation"}
                </span>
                <Zap className={clsx("w-3.5 h-3.5", simResults ? "text-yellow-400" : "text-slate-600")} />
            </div>

            {simResults ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Appoint Eau Requis</span>
                            <span className="text-xs font-mono font-bold text-blue-400">
                                +{simResults.water_makeup?.toFixed(1) || '0.0'} L/h
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase italic">Pertes par Évaporation</span>
                            <span className="text-xs font-mono font-bold text-orange-400">
                                -{simResults.evaporation?.toFixed(1) || '0.0'} L/h
                            </span>
                        </div>
                    </div>

                    {isProcessBath && simResults.chemical_additions && (
                        <div className="pt-3 border-t border-slate-700 space-y-2">
                            <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Compensation Drag-out</p>
                            {Object.entries(simResults.chemical_additions).map(([chem, val]: any) => (
                                <div key={chem} className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-300">{chem}</span>
                                    <span className="text-xs font-mono font-bold text-purple-400">+{val.toFixed(1)} g/h</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="py-2 text-center">
                    <p className="text-[10px] text-slate-500 italic">Lancez la simulation pour calculer les compensations.</p>
                </div>
            )}
        </div>
      )}

      {/* 3. CONFIGURATION DES RACCORDEMENTS */}
      {isAnyTank && (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Alimentation (Eau)</span>
                </div>
                
                {isProcessBath && (
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase flex items-center gap-1.5 text-slate-500">
                      <Zap className="w-3 h-3 text-blue-400" /> Source de compensation (Pompe)
                    </label>
                    <NodeSelector 
                      value={props.spraySourceId}
                      filter={["SOURCE", "RINSE_TANK"]}
                      onChange={(val) => updateNodeProperties(nodeId, { spraySourceId: val })}
                    />
                  </div>
                )}

                {isRinseTank && (
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase flex items-center gap-1.5 text-slate-500">
                      <Droplets className="w-3 h-3 text-blue-400" /> Alimentation Cascade
                    </label>
                    <NodeSelector 
                      value={props.waterSourceId}
                      filter={["SOURCE", "RINSE_TANK"]}
                      onChange={(val) => updateNodeProperties(nodeId, { waterSourceId: val })}
                    />
                  </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Sorties & Rejets</span>
                </div>
                
                {/* 🚩 CORRECTION : Seuls les RINSE_TANK ont une surverse par gravité */}
                {isRinseTank && (
                  <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase flex items-center gap-1.5 text-slate-500">
                        <Waves className="w-3 h-3 text-orange-400" /> Surverse vers (Gravité)
                      </label>
                      <NodeSelector 
                        value={props.overflowTargetId}
                        filter={["DRAIN", "RINSE_TANK", "STORAGE_TANK"]}
                        onChange={(val) => updateNodeProperties(nodeId, { overflowTargetId: val })}
                      />
                  </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase flex items-center gap-1.5 text-slate-500">
                      <ArrowDown className="w-3 h-3 text-red-400" /> Réseau de Vidange (Batch)
                    </label>
                    <NodeSelector 
                      value={props.dumpingNetworkId}
                      filter={["DRAIN"]}
                      onChange={(val) => updateNodeProperties(nodeId, { dumpingNetworkId: val })}
                    />
                </div>
            </div>
        </div>
      )}

      {/* NOTE TECHNIQUE */}
      {isAnyTank && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3 shadow-inner">
            <Info className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
            <p className="text-[9px] text-slate-500 leading-relaxed italic">
                {isProcessBath 
                  ? "Un bain n'a pas de surverse continue. Son niveau est maintenu par l'appoint automatique basé sur l'évaporation et l'entraînement."
                  : "Le débit de surverse du rinçage est égal au débit entrant moins l'évaporation locale."}
            </p>
        </div>
      )}

      <div className="pt-4 mt-4 border-t border-slate-100 text-center opacity-50">
          <p className="text-[8px] text-slate-400 font-mono">UID: {nodeId}</p>
      </div>

    </div>
  );
}