'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { Waves, ArrowRightLeft, ArrowDown, Beaker } from 'lucide-react';

export function WaterPropertiesWidget({ nodeId }: { nodeId: string }) {
  const node = useCanvasStore(state => state.nodes.find(n => n.id === nodeId));
  const nodes = useCanvasStore(state => state.nodes);
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);

  if (!node || node.type !== 'TANK') return null;

  const props = node.data.properties || {};
  const simResults = props.simulationResults || {};
  
  const sinkNodes = nodes.filter(n => n.type === 'SINK');
  const otherTanks = nodes.filter(n => n.type === 'TANK' && n.id !== nodeId);

  // Helper Select
  const Select = ({ label, value, field, options, icon: Icon, color = "slate" }: any) => (
    <div className="space-y-1.5">
      <label className={`text-[9px] font-bold text-${color}-500 uppercase flex items-center gap-1.5`}>
        {Icon && <Icon className={`w-3 h-3 text-${color}-400`} />} {label}
      </label>
      <select
        className={`w-full p-2 bg-${color}-50/50 border border-${color}-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-${color}-500/20`}
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
    <div className="space-y-6">
      
      {/* BILAN (Mis en valeur tout en haut pour le feedback immédiat) */}
      <div className="bg-slate-900 rounded-xl p-4 text-white space-y-3 shadow-md">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Simulation</span>
             <Beaker className="w-3 h-3 text-purple-400" />
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[10px] font-bold text-slate-300">Appoint Produit</span>
             <span className="text-xs font-mono font-bold text-purple-400">
               {simResults.chemicalAddition > 0 ? `+${simResults.chemicalAddition.toFixed(2)}` : '0'} L/h
             </span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[10px] font-bold text-slate-300">Évaporation</span>
             <span className="text-xs font-mono font-bold text-orange-400">
               -{simResults.evaporation ? simResults.evaporation.toFixed(1) : '0.0'} L/h
             </span>
          </div>
      </div>

      {/* REJETS (Orange) */}
      <div className="space-y-3">
         <Select 
           label="Vidange périodique" 
           field="dumpingNetworkId"
           value={props.dumpingNetworkId}
           options={sinkNodes}
           icon={ArrowDown}
           color="orange"
         />
         <Select 
           label="Débordement continu" 
           field="overflowNetworkId"
           value={props.overflowNetworkId}
           options={[...sinkNodes, ...otherTanks]}
           icon={Waves}
           color="orange"
         />
      </div>

      {/* COMPENSATIONS (Bleu) */}
      <div className="space-y-3">
         <Select 
           label="Compenser évaporation via" 
           field="compensationSourceId"
           value={props.compensationSourceId}
           options={otherTanks}
           icon={ArrowRightLeft}
           color="blue"
         />
      </div>

    </div>
  );
}