'use client';

import { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  applyNodeChanges, 
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SystemNode } from './system-node';
import { runGlobalProjectSimulation } from '@/app/actions/simulation';
import { updateSystemPositionAction } from '@/app/actions/system'; // Action de sauvegarde
import { useCanvasStore } from '@/store/canvas-store'; // Accès au store global
import { Play, Loader2, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { clsx } from 'clsx';

const nodeTypes = {
  systemNode: SystemNode,
};

interface BlueprintFlowProps {
  projectId: string;
  initialNodes: any[];
  initialEdges: any[];
}

export function BlueprintFlow({ projectId, initialNodes, initialEdges }: BlueprintFlowProps) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  
  // Accès au store pour injecter les résultats de simulation
  const setSummaryData = useCanvasStore(state => state.setSummaryData);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  // 1. GESTION DU DÉPLACEMENT (LOCAL)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // 2. SAUVEGARDE DE LA POSITION (BASE DE DONNÉES)
  const onNodeDragStop = useCallback(async (_: any, node: any) => {
    if (node.type === 'systemNode') {
      try {
        await updateSystemPositionAction(node.id, node.position.x, node.position.y);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de la position :", error);
      }
    }
  }, []);

  // 3. SIMULATION GLOBALE
  const handleSimulate = async () => {
    if (!projectId) return;

    setStatus('loading');
    setErrorMessages([]);
    
    try {
      const response = await runGlobalProjectSimulation(projectId);
      if (response.success) {
            // Pour la simulation globale, Python renvoie response.data.results
            setSummaryData(response.data.results); 
            setStatus('success');
    }
      if (!response.success) {
        setStatus('error');
        setErrorMessages([response.error || "Erreur de communication avec le moteur Python."]);
        return;
      }

      const data = response.data;

      if (data.status === "error") {
        setStatus('error');
        setErrorMessages(data.messages || [data.message]);
      } else {
        // --- SUCCÈS ---
        setStatus('success');
        
        // A. Injecter les résultats dans le store pour le AnalysisReport
        setSummaryData(data.results);

        // B. Mettre à jour les labels des liens sur le Blueprint (optionnel mais recommandé)
        const updatedEdges = edges.map(edge => {
            const streamRes = data.results.streams[edge.id];
            if (streamRes) {
                return {
                    ...edge,
                    label: `${edge.label.split(':')[0]}: ${streamRes.flow.toFixed(1)} L/h`,
                    animated: streamRes.flow > 0
                };
            }
            return edge;
        });
        setEdges(updatedEdges);

        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (e) {
      setStatus('error');
      setErrorMessages(["Une erreur inattendue est survenue lors de la simulation."]);
    }
  };

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop} // Activation de la persistance
        fitView
      >
        <Background color="#cbd5e1" gap={40} size={1} />
        <Controls className="bg-white border-slate-200 shadow-xl rounded-xl" />
        <MiniMap className="border border-slate-200 rounded-xl" />

        {/* PANNEAU DE SIMULATION */}
        <Panel position="top-right" className="flex flex-col gap-4 max-w-md">
          <button
            onClick={handleSimulate}
            disabled={status === 'loading'}
            className={clsx(
              "flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.1em] shadow-2xl transition-all",
              status === 'loading' ? "bg-slate-100 text-slate-400" : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
            )}
          >
            {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
            Simuler Projet Global
          </button>

          {/* ERREURS DE VALIDATION */}
          {status === 'error' && (
            <div className="bg-white border-2 border-red-100 rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-right-4">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h4 className="font-black uppercase text-xs tracking-widest">Erreurs détectées</h4>
              </div>
              <ul className="space-y-3">
                {errorMessages.map((msg, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2 leading-relaxed italic">
                    <span className="text-red-400 font-bold">•</span> {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FEEDBACK SUCCÈS */}
          {status === 'success' && (
            <div className="bg-emerald-500 text-white rounded-[1.5rem] p-4 flex items-center gap-3 shadow-xl animate-in zoom-in">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Calculs terminés</span>
            </div>
          )}
        </Panel>

        {/* LÉGENDE */}
        <Panel position="bottom-left" className="bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-sm hidden md:block">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Info className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Instructions Blueprint</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
                • Réorganisez les systèmes par drag & drop (sauvegarde auto).<br/>
                • Les lignes animées indiquent un flux actif.<br/>
                • Consultez le "Bilan Global Site" en haut pour le rapport.
            </p>
        </Panel>
      </ReactFlow>
    </div>
  );
}

function ExternalLinkIcon() {
    return <span className="inline-block w-2 h-2 border-t-2 border-r-2 border-slate-400 rotate-45 ml-0.5" />;
}