'use client';

import { useState, useEffect } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { 
  Waves, 
  ArrowRightLeft, 
  ArrowDown, 
  Beaker, 
  Network, 
  Droplets, 
  ArrowUpRight, 
  ArrowDownLeft,
  Activity,
  Plus
} from 'lucide-react';
import { getProjectStreams, connectNodeToStreamAction, createStreamAction } from '@/app/actions/stream';
import { clsx } from 'clsx';

export function WaterPropertiesWidget({ nodeId }: { nodeId: string }) {
  const node = useCanvasStore(state => state.nodes.find(n => n.id === nodeId));
  const nodes = useCanvasStore(state => state.nodes);
  const projectId = useCanvasStore(state => state.projectId);
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);

  const [projectStreams, setProjectStreams] = useState<any[]>([]);
  const [isLoadingStreams, setIsLoadingStreams] = useState(false);

  // --- CHARGEMENT DES FLUX ---
  useEffect(() => {
    if (projectId) {
      setIsLoadingStreams(true);
      getProjectStreams(projectId)
        .then(setProjectStreams)
        .finally(() => setIsLoadingStreams(false));
    }
  }, [projectId]);

  // --- SÉCURITÉ : On autorise TANK, SINK et SOURCE ---
  if (!node) return null;
  const isTank = node.type === 'TANK';
  const isSink = node.data.role === 'SINK';
  const isSource = node.data.role === 'SOURCE';

  if (!isTank && !isSink && !isSource) return null;

  const props = node.data.properties || {};
  const simResults = props.simulationResults || {};

  // --- ACTIONS ---
  const handleStreamConnect = async (streamId: string | null) => {
    const direction = isSink ? 'OUTPUT' : 'INPUT';
    try {
      await connectNodeToStreamAction(nodeId, streamId, direction);
      const field = direction === 'INPUT' ? 'inputStreamId' : 'outputStreamId';
      updateNodeProperties(nodeId, { [field]: streamId });
    } catch (e) {
      alert("Erreur de connexion au bus.");
    }
  };

  const handleCreateNewStream = async () => {
    const name = prompt("Nom du nouveau flux global (ex: Rejets Acides) :");
    if (name && projectId) {
      const newStream = await createStreamAction(projectId, name);
      setProjectStreams([...projectStreams, newStream]);
      handleStreamConnect(newStream.id);
    }
  };

  // Helper Select
  const Select = ({ label, value, field, options, icon: Icon, color = "slate" }: any) => (
    <div className="space-y-1.5">
      <label className={clsx("text-[9px] font-bold uppercase flex items-center gap-1.5", `text-${color}-500`)}>
        {Icon && <Icon className={clsx("w-3 h-3", `text-${color}-400`)} />} {label}
      </label>
      <select
        className={clsx(
          "w-full p-2 border rounded-lg text-xs font-bold text-slate-700 outline-none transition-all",
          `bg-${color}-50/50 border-${color}-200 focus:ring-2 focus:ring-${color}-500/20`
        )}
        value={value || ""}
        onChange={(e) => updateNodeProperties(nodeId, { [field]: e.target.value })}
      >
        <option value="">-- Non raccordé --</option>
        {options.map((opt: any) => (
          <option key={opt.id} value={opt.id}>{opt.data.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. SECTION BUS GLOBAL (Pour SINK et SOURCE) */}
      {(isSink || isSource) && (
        <div className="p-5 bg-blue-900 text-white rounded-[2rem] space-y-5 shadow-2xl border border-blue-800 relative overflow-hidden">
            {/* Déco de fond */}
            <Network className="absolute -right-4 -top-4 w-24 h-24 text-white/5 rotate-12" />

            <div className="flex items-center gap-3 border-b border-blue-800 pb-3 relative z-10">
                <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
                    <Network className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-200 leading-none">Bus Projet</h4>
                    <p className="text-xs font-bold text-white mt-1">Interface Système</p>
                </div>
            </div>
            
            <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black text-blue-400 uppercase tracking-tighter flex items-center gap-2">
                        {isSink ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                        {isSink ? "Expédier vers le flux :" : "Recevoir depuis le flux :"}
                    </label>
                    <button 
                        onClick={handleCreateNewStream}
                        className="p-1 bg-blue-700 hover:bg-blue-600 rounded text-blue-200 transition-colors"
                        title="Créer un nouveau flux"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>
                
                <select 
                    className="w-full p-3 bg-blue-800 border border-blue-700 rounded-xl text-sm font-bold text-white shadow-inner outline-none focus:ring-2 focus:ring-blue-400/50 appearance-none cursor-pointer"
                    value={isSink ? (props.outputStreamId || "") : (props.inputStreamId || "")}
                    onChange={(e) => handleStreamConnect(e.target.value || null)}
                >
                    <option value="">-- Réseau Local Isolé --</option>
                    {projectStreams.map(s => (
                        <option key={s.id} value={s.id}>FLUX: {s.name}</option>
                    ))}
                </select>

                <div className="bg-blue-950/50 p-3 rounded-xl border border-blue-800/50">
                    <p className="text-[9px] text-blue-300 leading-relaxed italic">
                        {isSink 
                          ? "En connectant ce réseau au bus, ses données de débit et de pollution seront partagées avec les autres systèmes du projet."
                          : "Ce point d'entrée héritera automatiquement des caractéristiques du flux sélectionné après simulation globale."}
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* 2. SECTION BILAN (Pour TANK) */}
      {isTank && (
        <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3 shadow-xl border border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Performances</span>
                <Activity className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Appoint estimé</span>
                <span className="text-xs font-mono font-bold text-blue-400">
                    {simResults.waterMakeup ? `+${simResults.waterMakeup.toFixed(1)}` : '0.0'} L/h
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Évaporation</span>
                <span className="text-xs font-mono font-bold text-orange-400">
                    -{simResults.evaporation ? simResults.evaporation.toFixed(1) : '0.0'} L/h
                </span>
            </div>
        </div>
      )}

      {/* 3. SECTION RACCORDEMENTS LOCAUX (Pour TANK) */}
      {isTank && (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Raccordements Rejets</span>
                </div>
                <Select 
                    label="Vidange (Drain)" 
                    field="dumpingNetworkId"
                    value={props.dumpingNetworkId}
                    options={nodes.filter(n => n.data.role === 'SINK')}
                    icon={ArrowDown}
                    color="orange"
                />
                <Select 
                    label="Trop-plein (Overflow)" 
                    field="overflowNetworkId"
                    value={props.overflowNetworkId}
                    options={[...nodes.filter(n => n.data.role === 'SINK'), ...nodes.filter(n => n.type === 'TANK' && n.id !== nodeId)]}
                    icon={Waves}
                    color="orange"
                />
            </div>

            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compensations</span>
                </div>
                <Select 
                    label="Source de compensation" 
                    field="compensationSourceId"
                    value={props.compensationSourceId}
                    options={nodes.filter(n => n.type === 'TANK' && n.id !== nodeId)}
                    icon={ArrowRightLeft}
                    color="blue"
                />
            </div>
        </div>
      )}

      {/* FOOTER INFO */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col items-center gap-1">
          <p className="text-[8px] text-slate-400 uppercase font-black tracking-tighter">
            Quantum Core Engine v2.1
          </p>
          <p className="text-[7px] text-slate-300 font-mono">
            NODE_UID: {nodeId}
          </p>
      </div>

    </div>
  );
}