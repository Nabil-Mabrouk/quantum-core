'use client';
import { useCanvasStore } from '@/store/canvas-store';
import { Beaker, Zap, Activity, Droplets, Waves, Info } from 'lucide-react';
import { clsx } from 'clsx';

export function WaterPropertiesWidget({ nodeId }: { nodeId: string }) {
  const node = useCanvasStore(state => state.nodes.find(n => n.id === nodeId));
  const simResults = node?.data.properties.simulationResults || null;
  
  if (!node) return null;
  const isBath = node.type === 'PROCESS_BATH';

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* SECTION 1 : RÉSULTATS CALCULÉS (BLACK BOX) */}
      <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl border border-slate-800">
        <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bilan de Simulation</span>
            <Zap className={clsx("w-4 h-4", simResults ? "text-yellow-400" : "text-slate-700")} />
        </div>

        {simResults ? (
          <div className="space-y-4">
            {/* Appoints Eau */}
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Appoint Eau Requis</span>
                <span className="text-sm font-mono font-black text-blue-400">+{simResults.water_makeup?.toFixed(1)} L/h</span>
            </div>
            
            {/* Appoints Chimiques (Maintenance de concentration) */}
            {isBath && simResults.chemical_additions && (
              <div className="pt-3 border-t border-slate-800">
                <p className="text-[9px] font-black text-purple-400 uppercase mb-2">Maintien Consigne (Commercial)</p>
                {Object.entries(simResults.chemical_additions).map(([prod, val]: any) => (
                  <div key={prod} className="flex justify-between text-xs py-1">
                    <span className="text-slate-400">{prod}</span>
                    <span className="font-mono font-bold">+{val.toFixed(1)} g/h</span>
                  </div>
                ))}
              </div>
            )}

            {/* Composition Ionique finale */}
            <div className="pt-3 border-t border-slate-800">
                <p className="text-[9px] font-black text-emerald-400 uppercase mb-2">Composition Ionique</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(simResults.concentrations || {}).map(([ion, val]: any) => (
                    <div key={ion} className="bg-white/5 p-2 rounded-lg flex justify-between items-center">
                        <span className="text-[10px] font-bold">{ion}</span>
                        <span className="text-[10px] font-mono text-emerald-400">{val.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-slate-500 italic text-xs">
            Simulation requise pour calculer les appoints.
          </div>
        )}
      </div>

      {/* SECTION 2 : LOGIQUE MÉTIER (RAPPELS) */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
        <p className="text-[10px] text-blue-700 leading-relaxed">
          {isBath 
            ? "Priorité 1 : Compensation par produits commerciaux. Priorité 2 : Appoint d'eau via la source configurée."
            : "Le débit de surverse est calculé par différence : Entrée - Évaporation."}
        </p>
      </div>
    </div>
  );
}