'use client';

import { useState, useEffect } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { Network, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import { getProjectStreams, connectNodeToStreamAction, createStreamAction } from '@/app/actions/stream';

export function StreamConnectionWidget({ nodeId }: { nodeId: string }) {
  const node = useCanvasStore(state => state.nodes.find(n => n.id === nodeId));
  const projectId = useCanvasStore(state => state.projectId);
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);

  const [projectStreams, setProjectStreams] = useState<any[]>([]);

  useEffect(() => {
    if (projectId) {
      getProjectStreams(projectId).then(setProjectStreams);
    }
  }, [projectId]);

  if (!node) return null;
  
  // On ne montre ce widget que pour les terminaux ou les cuves importantes
  const isSink = node.type === 'DRAIN';
  const isSource = node.type === 'SOURCE';
  const isTank = node.type === 'PROCESS_BATH' || node.type === 'RINSE_TANK';

  // Pour les Tanks, on n'affiche pas le widget complet ici, car ils ont déjà des champs "dumpingNetworkId" dans le formulaire générique.
  // Ce widget est surtout utile pour les noeuds TERMINAUX (Source/Drain) qui doivent se connecter au Bus Projet.
  if (!isSink && !isSource) return null;

  const props = node.data.properties || {};

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

  return (
    <div className="p-5 bg-blue-900 text-white rounded-[2rem] space-y-5 shadow-2xl border border-blue-800 relative overflow-hidden mb-6">
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
                <button onClick={handleCreateNewStream} className="p-1 bg-blue-700 hover:bg-blue-600 rounded text-blue-200"><Plus className="w-3 h-3" /></button>
            </div>
            
            <select 
                className="w-full p-3 bg-blue-800 border border-blue-700 rounded-xl text-sm font-bold text-white shadow-inner outline-none focus:ring-2 focus:ring-blue-400/50 appearance-none cursor-pointer"
                value={isSink ? (props.outputStreamId || "") : (props.inputStreamId || "")}
                onChange={(e) => handleStreamConnect(e.target.value || null)}
            >
                <option value="">-- Local (Non connecté) --</option>
                {projectStreams.map(s => (
                    <option key={s.id} value={s.id}>FLUX: {s.name}</option>
                ))}
            </select>
        </div>
    </div>
  );
}