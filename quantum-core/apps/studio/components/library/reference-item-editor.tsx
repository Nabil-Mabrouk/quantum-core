'use client';

import { useState, useMemo } from 'react';
import { 
  Search, Plus, Save, Trash2, Layers, Settings2, ChevronRight, 
  Loader2, Package, Atom, Component, Cuboid, PlusCircle, X
} from 'lucide-react';
import { upsertLibraryItem, deleteLibraryItem } from '@/app/actions/library';
import { getDomainConfig } from '@/lib/registry';
import { t, getDictionary } from '@/lib/i18n'; // Import i18n
import { clsx } from 'clsx';
import { toast } from 'sonner';

interface ReferenceItemEditorProps {
  allItems: any[];       
  domain: string;
  libraryLabel: string;
  allowedCategories: string[];
  enableComposition: boolean;
  dynamicSchemas: Record<string, any[]>;
}

export function ReferenceItemEditor({ 
  allItems, 
  domain, 
  libraryLabel, 
  allowedCategories, 
  enableComposition,
  dynamicSchemas 
}: ReferenceItemEditorProps) {
  
  const config = getDomainConfig();
  const staticSchemas = config.librarySchemas || {};
  const schemas = { ...staticSchemas, ...dynamicSchemas };

  // Context i18n
  const locale = 'fr'; 
  const dict = getDictionary(locale);

  // --- ÉTATS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [properties, setProperties] = useState<Record<string, any>>({});
  const [composition, setComposition] = useState<any[]>([]);
  const [newPropKey, setNewPropKey] = useState("");

  // --- FILTRAGE ---
  const { basicItems, compositeItems } = useMemo(() => {
    const matches = allItems.filter(item => {
      return allowedCategories.includes(item.category) && 
             item.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const basic: any[] = [];
    const composite: any[] = [];

    matches.forEach(item => {
      const isAtomic = ['ION', 'PUMP', 'TANK', 'SENSOR', 'SPARE', 'VALVE', 'PIPE'].includes(item.category);
      if (isAtomic) basic.push(item);
      else composite.push(item);
    });

    const sortFn = (a: any, b: any) => a.name.localeCompare(b.name);
    return { basicItems: basic.sort(sortFn), compositeItems: composite.sort(sortFn) };
  }, [allItems, allowedCategories, searchTerm]);

  // --- HANDLERS ---
  const handleSelect = (item: any) => {
    setSelectedItem({ ...item });
    setProperties(item.properties || {});
    const flatComp = item.components?.map((c: any) => ({
      childId: c.childId,
      quantity: c.quantity,
      unit: c.unit || ""
    })) || [];
    setComposition(flatComp);
  };

  const handleNew = () => {
    setSelectedItem({ id: null, name: "", category: allowedCategories[0], symbol: "" });
    setProperties({});
    setComposition([]);
  };

  const handleSave = async () => {
    if (!selectedItem.name) {
        toast.error(locale === 'fr' ? "Le nom est obligatoire" : "Name is required");
        return;
    }
    
    setIsSaving(true);
    try {
      await upsertLibraryItem(domain, {
        ...selectedItem,
        properties,
        composition: enableComposition ? composition : []
      });
      toast.success(dict.ui.save);
      if (!selectedItem.id) handleNew();
    } catch (error: any) {
      toast.error(dict.ui.error, { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const addCustomProperty = () => {
    if (!newPropKey) return;
    setProperties(prev => ({ ...prev, [newPropKey]: "" }));
    setNewPropKey("");
  };

  const removeProperty = (key: string) => {
    const newProps = { ...properties };
    delete newProps[key];
    setProperties(newProps);
  };

  return (
    <div className="flex h-full divide-x divide-slate-100">
      
      {/* 1. SIDEBAR */}
      <div className="w-80 flex flex-col bg-slate-50/30 shrink-0 border-r border-slate-200">
        <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
              placeholder={dict.ui.search} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-6 custom-scrollbar">
          {compositeItems.length > 0 && (
            <div className="space-y-1">
              <h4 className="px-2 text-[10px] font-black uppercase text-blue-500 tracking-widest mb-2 flex items-center gap-2">
                <Package className="w-3 h-3" /> {locale === 'fr' ? 'Assemblages & Produits' : 'Assemblies & Products'}
              </h4>
              {compositeItems.map(item => <ListItem key={item.id} item={item} isSelected={selectedItem?.id === item.id} onClick={() => handleSelect(item)} />)}
            </div>
          )}
          {basicItems.length > 0 && (
            <div className="space-y-1">
              <h4 className="px-2 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                <Atom className="w-3 h-3" /> {locale === 'fr' ? 'Composants de base' : 'Base Components'}
              </h4>
              {basicItems.map(item => <ListItem key={item.id} item={item} isSelected={selectedItem?.id === item.id} onClick={() => handleSelect(item)} />)}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <button onClick={handleNew} className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg">
            <Plus className="w-3.5 h-3.5" /> {dict.ui.add}
          </button>
        </div>
      </div>

      {/* 2. FORMULAIRE */}
      <div className="flex-1 bg-white overflow-y-auto">
        {selectedItem ? (
          <div className="max-w-4xl mx-auto p-12 space-y-12 animate-in fade-in duration-300">
            
            <div className="flex justify-between items-start">
               <div>
                  <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                    {enableComposition ? <Component className="w-4 h-4" /> : <Cuboid className="w-4 h-4" />}
                    {libraryLabel}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {selectedItem.id ? (locale === 'fr' ? "Édition Ressource" : "Edit Resource") : (locale === 'fr' ? "Nouvel Élément" : "New Item")}
                  </h2>
               </div>
               <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50">
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {dict.ui.save}
               </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{locale === 'fr' ? 'Désignation' : 'Designation'}</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" value={selectedItem.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{locale === 'fr' ? 'Catégorie' : 'Category'}</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer focus:bg-white transition-all" value={selectedItem.category} onChange={e => setSelectedItem({...selectedItem, category: e.target.value})}>
                  {allowedCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* --- SPÉCIFICATIONS TECHNIQUES DYNAMIQUES --- */}
            <div className="space-y-4">
               <h3 className="text-xs font-black uppercase text-slate-900 flex items-center gap-2 border-b pb-2">
                 <Settings2 className="w-4 h-4 text-slate-400" /> {locale === 'fr' ? 'Spécifications Techniques' : 'Technical Specifications'}
               </h3>
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                  
                  <div className="grid grid-cols-2 gap-4">
                      <PropField label={locale === 'fr' ? "Symbole / Code" : "Symbol / Code"} value={selectedItem.symbol} onChange={(val:any) => setSelectedItem({...selectedItem, symbol: val})} />
                      
                      {/* Champs dynamiques traduits via t() */}
                      {(schemas[selectedItem.category] || schemas['DEFAULT'] || []).map((field: any) => (
                        <div key={field.id} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                           <PropField 
                              label={t(field.label, locale)} 
                              unit={field.unit}
                              type={field.type === 'number' ? 'number' : 'text'}
                              asTextarea={field.type === 'textarea'}
                              options={field.options}
                              value={properties[field.id] ?? selectedItem[field.id]} 
                              onChange={(val: any) => {
                                 const numVal = field.type === 'number' ? parseFloat(val) : val;
                                 setProperties(prev => ({ ...prev, [field.id]: numVal }));
                              }} 
                           />
                        </div>
                      ))}
                  </div>

                  <div className="h-px bg-slate-200" />

                  {/* B. CHAMPS PERSONNALISÉS */}
                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{locale === 'fr' ? 'Propriétés Spécifiques' : 'Custom Properties'}</label>
                      {Object.entries(properties).map(([key, value]) => {
                          const isStandard = (schemas[selectedItem.category] || []).some((f: any) => f.id === key);
                          if (isStandard) return null; 
                          return (
                              <div key={key} className="flex items-center gap-2 group">
                                  <div className="w-1/3 text-xs font-bold text-slate-600 text-right pr-2">{key}</div>
                                  <input className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:border-blue-400" value={value as string} onChange={(e) => setProperties({...properties, [key]: e.target.value})} />
                                  <button onClick={() => removeProperty(key)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                              </div>
                          );
                      })}
                      <div className="flex gap-2 pt-2">
                          <input className="w-1/3 bg-white border border-slate-200 border-dashed rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-400" placeholder="..." value={newPropKey} onChange={e => setNewPropKey(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomProperty()} />
                          <button onClick={addCustomProperty} disabled={!newPropKey} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase transition-all disabled:opacity-50"><PlusCircle className="w-3.5 h-3.5" /> {dict.ui.add}</button>
                      </div>
                  </div>
               </div>
            </div>

            {/* --- NOMENCLATURE --- */}
            {enableComposition && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-xs font-black uppercase text-slate-900 flex items-center gap-2"><Layers className="w-4 h-4 text-purple-500" /> {locale === 'fr' ? 'Nomenclature (Composition)' : 'Bill of Materials'}</h3>
                  <button onClick={() => setComposition([...composition, { childId: "", quantity: 1, unit: "" }])} className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold uppercase hover:bg-purple-100 transition-all"><Plus className="w-3 h-3" /> {dict.ui.add}</button>
                </div>
                <div className="space-y-3">
                  {composition.map((comp, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-left-2">
                      <div className="flex-1">
                        <select className="w-full bg-slate-50 border-none rounded-xl p-2 text-xs font-bold outline-none cursor-pointer" value={comp.childId} onChange={e => { const newComp = [...composition]; newComp[idx].childId = e.target.value; setComposition(newComp); }}>
                          <option value="">{locale === 'fr' ? 'Choisir un composant...' : 'Select component...'}</option>
                          {allItems.filter(i => i.id !== selectedItem.id).map(i => <option key={i.id} value={i.id}>{i.name} ({i.category})</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1 border"><span className="text-[9px] font-black text-slate-400 uppercase">Qté</span><input type="number" step="any" className="w-16 bg-transparent text-sm font-mono font-black text-blue-600 outline-none text-center" value={comp.quantity} onChange={e => { const newComp = [...composition]; newComp[idx].quantity = parseFloat(e.target.value); setComposition(newComp); }} /></div>
                      <button onClick={() => setComposition(composition.filter((_, i) => i !== idx))} className="p-2 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {composition.length === 0 && <div className="text-center py-8 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200"><p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{locale === 'fr' ? 'Élément Atomique' : 'Atomic Item'}</p></div>}
                </div>
              </div>
            )}

            {selectedItem.id && (
              <div className="pt-8 border-t border-red-100 flex justify-center">
                 <button onClick={async () => { if(confirm(locale === 'fr' ? "Supprimer définitivement ?" : "Delete permanently?")) { await deleteLibraryItem(selectedItem.id); setSelectedItem(null); } }} className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-3 h-3" /> {dict.ui.delete}</button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-20 text-slate-300">
             <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-6 shadow-inner border border-slate-100"><Package className="w-10 h-10 opacity-20" /></div>
             <h3 className="text-lg font-black uppercase tracking-tight text-slate-400">{locale === 'fr' ? 'Sélectionnez un article' : 'Select an item'}</h3>
             <p className="text-sm mt-2 max-w-xs mx-auto">{locale === 'fr' ? 'Choisissez un élément dans la liste de gauche ou créez-en un nouveau.' : 'Select an item from the left list or create a new one.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ListItem({ item, isSelected, onClick }: any) {
  return (
    <div onClick={onClick} className={clsx("p-3 rounded-xl cursor-pointer transition-all flex justify-between items-center group", isSelected ? "bg-white shadow-md border border-blue-100 ring-1 ring-blue-50" : "hover:bg-white hover:shadow-sm border border-transparent")}>
      <div className="min-w-0">
        <p className={clsx("text-xs font-bold truncate", isSelected ? "text-blue-600" : "text-slate-700")}>{item.name}</p>
        <div className="flex items-center gap-2 mt-1"><span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{item.category}</span>{item.symbol && <span className="text-[8px] font-mono text-slate-400">{item.symbol}</span>}</div>
      </div>
      <ChevronRight className={clsx("w-3 h-3 transition-transform", isSelected ? "text-blue-500" : "text-slate-300 opacity-0 group-hover:opacity-100")} />
    </div>
  );
}

function PropField({ label, value, onChange, type = "text", asTextarea, unit, options }: any) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between"><label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">{label}</label>{unit && <span className="text-[9px] font-bold text-slate-300">{unit}</span>}</div>
            {options ? (
               <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer" value={value || ""} onChange={(e) => onChange(e.target.value)}>
                  {options.map((opt:any) => (
                    <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                        {typeof opt === 'string' ? opt : opt.label}
                    </option>
                  ))}
               </select>
            ) : asTextarea ? (
                <textarea className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none h-20" value={value || ""} onChange={(e) => onChange(e.target.value)} />
            ) : (
                <input type={type} step="any" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" value={value || ""} onChange={(e) => onChange(e.target.value)} />
            )}
        </div>
    );
}