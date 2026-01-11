'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { getLibrary } from '@/app/actions/library';
import { 
  Thermometer, 
  Maximize, 
  Droplets, 
  Wind, 
  Lock, 
  Unlock, 
  Zap,
  Info,
  FlaskConical,
  Plus,
  Trash2
} from 'lucide-react';
import { clsx } from 'clsx';

export function WaterTankForm({ nodeId }: { nodeId: string }) {
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);
  const node = useCanvasStore(state => state.nodes.find(n => n.id === nodeId));
  
  // --- ÉTAT DE LA BIBLIOTHÈQUE (TABLEAU UNIFIÉ) ---
  const [libraryItems, setLibraryItems] = useState<any[]>([]);

  useEffect(() => {
    // getLibrary renvoie maintenant un tableau de LibraryItem
    getLibrary("WATER").then(setLibraryItems);
  }, []);

  if (!node) return null;
  
  const p = node.data.properties || {};
  const computed = p.computed || {}; 
  const components = p.components || [];

  // --- FILTRAGE POUR LE SÉLECTEUR CHIMIQUE ---
  // On ne veut proposer que les produits (REAGENT) dans la liste d'ajout
  const availableChemicals = useMemo(() => {
    return libraryItems.filter(item => item.category === 'REAGENT');
  }, [libraryItems]);

  // --- HANDLERS ---
  const handleChange = (key: string, val: any) => updateNodeProperties(nodeId, { [key]: val });

  const addComponent = (libraryItemId: string) => {
    if (!libraryItemId) return;
    const item = libraryItems.find((i: any) => i.id === libraryItemId);
    if (!item) return;

    const newComponent = {
      libraryItemId,
      name: item.name,
      concentration: 0,
    };
    handleChange('components', [...components, newComponent]);
  };

  const updateComponentConc = (idx: number, conc: number) => {
    const newComps = [...components];
    newComps[idx].concentration = conc;
    handleChange('components', newComps);
  };

  const removeComponent = (idx: number) => {
    handleChange('components', components.filter((_: any, i: number) => i !== idx));
  };

  const typeBtnClass = (active: boolean, color: string) => clsx(
    "flex-1 py-2 text-[9px] font-bold uppercase rounded-lg border transition-all",
    active ? `bg-${color}-50 border-${color}-200 text-${color}-700 shadow-sm` : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
  );

  return (
    <div className="space-y-6">
      
      {/* --- 1. RÉSULTATS DU MOTEUR --- */}
      {Object.keys(computed).length > 0 && (
        <div className="grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-500">
           {computed.evaporation !== undefined && (
             <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-lg">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Évaporation</p>
                <p className="text-lg font-black text-orange-400 font-mono">
                    {computed.evaporation} <span className="text-[10px] text-slate-500">L/h</span>
                </p>
             </div>
           )}
           {computed.volume_m3 !== undefined && (
             <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-lg">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Vol. Estimé</p>
                <p className="text-lg font-black text-blue-400 font-mono">
                    {computed.volume_m3} <span className="text-[10px] text-slate-500">m³</span>
                </p>
             </div>
           )}
        </div>
      )}

      {/* --- 2. FONCTION --- */}
      <div className="space-y-2">
        <label className="text-[9px] font-bold text-slate-400 uppercase">Fonction du poste</label>
        <div className="flex gap-2">
            <button onClick={() => handleChange('type', 'PROCESS')} className={typeBtnClass(p.type === 'PROCESS', 'purple')}>Bain</button>
            <button onClick={() => handleChange('type', 'CLASSIC_RINSE')} className={typeBtnClass(p.type === 'CLASSIC_RINSE', 'blue')}>Rinçage</button>
            <button onClick={() => handleChange('type', 'STATIC_RINSE')} className={typeBtnClass(p.type === 'STATIC_RINSE', 'slate')}>Mort</button>
        </div>
      </div>

      {/* --- 3. PHYSIQUE --- */}
      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Thermometer className="w-3 h-3" /> Temp. (°C)
                </label>
                <input 
                    type="number" 
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20"
                    value={p.temp ?? 20}
                    onChange={(e) => handleChange('temp', parseFloat(e.target.value))}
                />
            </div>
            
            <div className="space-y-1">
                <div className="flex justify-between">
                    <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Mode Évap.
                    </label>
                    <button onClick={() => handleChange('evapAuto', !p.evapAuto)}>
                        {p.evapAuto ? <Lock className="w-3 h-3 text-blue-500" /> : <Unlock className="w-3 h-3 text-slate-400" />}
                    </button>
                </div>
                <div className="relative">
                    <input 
                        type="number" 
                        className={clsx(
                            "w-full p-2 border rounded-lg text-sm font-mono outline-none transition-colors",
                            p.evapAuto ? "bg-slate-100 text-slate-400 italic" : "bg-white text-slate-700 border-blue-200"
                        )}
                        value={p.evapAuto ? (computed.evaporation || 0) : (p.evaporationRate ?? 0)}
                        onChange={(e) => handleChange('evaporationRate', parseFloat(e.target.value))}
                        disabled={p.evapAuto}
                    />
                    <span className="absolute right-2 top-2.5 text-[9px] font-bold text-slate-300">L/h</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/50">
             <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-400 uppercase">Longueur (mm)</label>
                <input className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs font-bold" value={p.length ?? 1000} onChange={e => handleChange('length', parseFloat(e.target.value))} />
             </div>
             <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-400 uppercase">Largeur (mm)</label>
                <input className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs font-bold" value={p.width ?? 800} onChange={e => handleChange('width', parseFloat(e.target.value))} />
             </div>
        </div>
      </div>

      {/* --- 4. ALIMENTATION --- */}
      <div className="p-3 border border-blue-100 bg-blue-50/30 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <Droplets className="w-3 h-3" /> Appoint Eau
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Auto</span>
                    <input type="checkbox" checked={p.inletAuto ?? true} onChange={(e) => handleChange('inletAuto', e.target.checked)} className="w-3.5 h-3.5 accent-blue-600" />
                </div>
            </div>

            <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                <button onClick={() => handleChange('inletType', 'CLEAN_WATER')} className={clsx("flex-1 py-1.5 text-[9px] font-bold uppercase rounded", p.inletType !== 'CASCADE' ? "bg-blue-100 text-blue-700 shadow-sm" : "text-slate-400")}>Eau Neuve</button>
                <button onClick={() => handleChange('inletType', 'CASCADE')} className={clsx("flex-1 py-1.5 text-[9px] font-bold uppercase rounded", p.inletType === 'CASCADE' ? "bg-blue-100 text-blue-700 shadow-sm" : "text-slate-400")}>Cascade</button>
            </div>

            {p.inletType !== 'CASCADE' && (
                <input type="number" placeholder="Débit L/h" className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-700" value={p.inletFlow ?? 0} onChange={(e) => handleChange('inletFlow', parseFloat(e.target.value))} />
            )}
      </div>

      {/* --- 5. COMPOSITION CHIMIQUE (LE CORRECTIF EST ICI) --- */}
      <div className="space-y-4 border-t border-slate-100 pt-6">
          <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase text-purple-600 tracking-widest flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5" /> Chimie & Cibles
              </h4>
              <select 
                  className="text-[9px] bg-purple-50 text-purple-700 border border-purple-100 rounded-md px-2 py-1 outline-none font-bold cursor-pointer"
                  onChange={(e) => { addComponent(e.target.value); e.target.value = ""; }}
                  value=""
              >
                  <option value="">+ Ajouter Produit</option>
                  {/* CORRECTION : On map sur availableChemicals au lieu de library.referenceItems */}
                  {availableChemicals.map((item: any) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
              </select>
          </div>

          <div className="space-y-2">
              {components.map((comp: any, idx: number) => (
                  <div key={idx} className="bg-white border border-purple-100 rounded-xl p-3 shadow-sm flex items-center justify-between group animate-in slide-in-from-right-2">
                      <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-slate-700 truncate">{comp.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                              <input 
                                  type="number"
                                  className="w-16 p-1 bg-slate-50 border border-purple-100 rounded text-xs font-mono font-bold text-purple-600 focus:bg-white outline-none"
                                  value={comp.concentration}
                                  onChange={(e) => updateComponentConc(idx, parseFloat(e.target.value))}
                              />
                              <span className="text-[9px] font-bold text-slate-400">g/L</span>
                          </div>
                      </div>
                      <button onClick={() => removeComponent(idx)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
              ))}
              {components.length === 0 && (
                <div className="text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">
                   <p className="text-[10px] text-slate-300 italic uppercase">Aucun additif chimique</p>
                </div>
              )}
          </div>
      </div>

      <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-2">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[9px] text-amber-700 leading-tight">
              Les indicateurs physiques en haut sont calculés par le moteur <strong>Python</strong>.
          </p>
      </div>

    </div>
  );
}