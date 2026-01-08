'use client';

import { useState } from 'react';
import { 
  Atom, 
  Beaker, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  ChevronRight, 
  Database,
  Search,
  CheckCircle2,
  X,
  PlusCircle,
  FileJson
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  importLibraryJson, 
  upsertReferenceItem,
  upsertBaseUnit 
} from '@/app/actions/library';

interface LibraryManagerProps {
  baseUnits: any[];
  referenceItems: any[];
  domain: string;
  vocabulary: any; // Reçu depuis page.tsx
}

export function LibraryManager({ baseUnits, referenceItems, domain, vocabulary }: LibraryManagerProps) {
  const [activeTab, setActiveTab] = useState('units');
  const [isImporting, setIsImporting] = useState(false);

  // Fallback si le vocabulaire est manquant
  const v = vocabulary || {
    baseUnitName: "Unités",
    referenceItemName: "Articles",
    baseUnitDescription: "Composants de base",
    referenceItemDescription: "Articles référencés"
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        const res = await importLibraryJson(domain, content);
        if (res.success) window.location.reload();
        else alert("Erreur : " + res.error);
      } catch (err) {
        alert("Fichier JSON invalide.");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
      
      {/* HEADER DE LA BIBLIOTHÈQUE */}
      <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white shrink-0">
        <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200">
          <TabsTrigger value="units" className="flex gap-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:text-blue-600">
            <Atom className="w-3.5 h-3.5" /> {v.baseUnitName}
          </TabsTrigger>
          <TabsTrigger value="items" className="flex gap-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:text-blue-600">
            <Beaker className="w-3.5 h-3.5" /> {v.referenceItemName}
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
            {isImporting ? <Database className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            Importer JSON
            <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} disabled={isImporting} />
          </label>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 overflow-hidden bg-white">
        {/* --- ONGLET 1 : UNITÉS DE BASE --- */}
        <TabsContent value="units" className="h-full m-0 p-8 overflow-y-auto outline-none">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{v.baseUnitName}</h2>
                    <p className="text-sm text-slate-500 italic">{v.baseUnitDescription}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">
                    <PlusCircle className="w-4 h-4" /> Ajouter {v.baseUnitName}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {baseUnits.map((unit: any) => (
                <div key={unit.id} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-mono font-bold text-blue-600 border border-slate-200 shadow-sm text-sm">
                        {unit.symbol || '??'}
                    </div>
                    <button className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-4">{unit.name}</h4>
                  <div className="space-y-2">
                    {Object.entries(unit.properties || {}).map(([k, v]: any) => (
                        <div key={k} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{k}</span>
                            <span className="text-xs font-mono font-bold text-slate-700">{v}</span>
                        </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* --- ONGLET 2 : ARTICLES --- */}
        <TabsContent value="items" className="h-full m-0 overflow-hidden outline-none">
           <ReferenceItemEditor 
             items={referenceItems} 
             baseUnits={baseUnits} 
             domain={domain} 
             vocabulary={v}
           />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function ReferenceItemEditor({ items, baseUnits, domain, vocabulary }: any) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [composition, setComposition] = useState<any[]>([]);
  const [properties, setProperties] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = (item: any) => {
    setSelectedItem(item);
    setComposition(item.composition || []);
    setProperties(item.properties || {});
  };

  const updateProperty = (key: string, value: any) => {
    setProperties({ ...properties, [key]: value });
  };

  const addCompositionLine = () => {
    setComposition([...composition, { baseUnitId: '', coefficient: 1 }]);
  };

  const updateCompositionLine = (index: number, data: any) => {
    const newComp = [...composition];
    newComp[index] = { ...newComp[index], ...data };
    setComposition(newComp);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        await upsertReferenceItem(domain, {
            ...selectedItem,
            properties: properties,
            composition: composition
        });
        alert("Enregistrement réussi !");
    } catch (e) {
        alert("Erreur lors de la sauvegarde.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full divide-x divide-slate-100">
      {/* SIDEBAR LISTE (Master) */}
      <div className="w-80 flex flex-col bg-slate-50/30 shrink-0">
        <div className="p-4 border-b border-slate-100">
            <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[11px] outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Filtrer..." />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {items.map((item: any) => (
            <div 
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`p-4 rounded-2xl cursor-pointer transition-all flex justify-between items-center group ${selectedItem?.id === item.id ? 'bg-white shadow-lg shadow-slate-200 border border-slate-100' : 'hover:bg-white/50 text-slate-500'}`}
            >
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate ${selectedItem?.id === item.id ? 'text-blue-600' : ''}`}>
                    {item.name}
                </p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">
                    {item.composition?.length || 0} {vocabulary.baseUnitName}
                </p>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedItem?.id === item.id ? 'text-blue-500 translate-x-1' : 'text-slate-300 group-hover:translate-x-1'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* FORMULAIRE (Detail) */}
      <div className="flex-1 bg-white overflow-y-auto">
        {selectedItem ? (
          <div className="p-12 max-w-3xl mx-auto space-y-12">
            
            {/* Header Form */}
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3" /> Fiche Technique Validée
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedItem.name}</h3>
               </div>
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/20"
               >
                 {isSaving ? <Database className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                 Sauvegarder
               </button>
            </div>

            {/* Propriétés dynamiques (JSONB) */}
            <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                    <FileJson className="w-3 h-3" /> Paramètres Physico-Chimiques
                </h4>
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                    {Object.entries(properties).map(([key, value]: any) => (
                        <div key={key} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">{key}</label>
                            <input 
                                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                                value={value}
                                onChange={(e) => updateProperty(key, e.target.value)}
                            />
                        </div>
                    ))}
                    {Object.keys(properties).length === 0 && (
                        <p className="col-span-2 text-center text-xs text-slate-400 italic">Aucune propriété spécifique définie.</p>
                    )}
                </div>
            </div>

            {/* Composition / Dissociation */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                    <Atom className="w-3 h-3" /> Composition ({vocabulary.baseUnitName})
                </h4>
                <button 
                    onClick={addCompositionLine}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors"
                >
                    <Plus className="w-3 h-3" /> Ajouter Ligne
                </button>
              </div>

              <div className="space-y-3">
                {composition.map((comp, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="flex-1">
                        <select 
                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        value={comp.baseUnitId}
                        onChange={(e) => updateCompositionLine(idx, { baseUnitId: e.target.value })}
                        >
                        <option value="">Choisir {vocabulary.baseUnitName}...</option>
                        {baseUnits.map((bu: any) => (
                            <option key={bu.id} value={bu.id}>{bu.symbol} - {bu.name}</option>
                        ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-1.5 border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Coefficient</span>
                        <input 
                            type="number" 
                            step="0.001"
                            className="w-20 bg-transparent py-2 text-sm font-mono font-black text-blue-600 outline-none text-center"
                            value={comp.coefficient}
                            onChange={(e) => updateCompositionLine(idx, { coefficient: parseFloat(e.target.value) })}
                        />
                    </div>
                    <button 
                        onClick={() => setComposition(composition.filter((_, i) => i !== idx))}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {composition.length === 0 && (
                    <div className="text-center py-16 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                        <Atom className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Produit pur / Sans composition</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-20">
             <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-6 shadow-inner">
                <Beaker className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Aucun article sélectionné</h3>
             <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">Choisissez un élément dans la liste de gauche pour configurer ses paramètres techniques.</p>
          </div>
        )}
      </div>
    </div>
  );
}