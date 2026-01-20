'use client';

import { useState, useEffect } from 'react';
import { getCatalogItems } from '@/app/actions/catalog';
import { ShoppingBag, Check, Loader2, Search } from 'lucide-react';
import { useCanvasStore } from '@/store/canvas-store';

interface CatalogSelectorProps {
  category: string | string[];
  nodeId: string;
  onSelect?: (item: any) => void; // Optionnel pour les collections
  value?: string; // L'ID actuel
  label?: string;
}

export function CatalogSelector({ category, nodeId, onSelect, value, label }: CatalogSelectorProps) {
  const [items, setItems] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);

  // Charger les items quand on ouvre le menu
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getCatalogItems(category)
        .then(setItems)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, category]);

  // Trouver le nom de l'item sélectionné pour l'affichage du bouton
  const selectedItemName = items.find(i => i.id === value)?.name;

  const handleSelect = (item: any) => {
    if (onSelect) {
      // Cas A : Utilisation dans une collection (on renvoie l'objet)
      onSelect(item);
    } else {
      // Cas B : Utilisation directe sur un noeud (ex: Modèle de Pompe)
      updateNodeProperties(nodeId, { 
        ...item.specs, 
        catalogName: item.name,
        price: item.specs.price || 0 
      });
    }
    setIsOpen(false);
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 p-2.5 text-xs font-bold bg-white border border-slate-200 rounded-xl hover:border-blue-400 transition-all shadow-sm"
      >
        <span className="truncate flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
            {selectedItemName || label || "Choisir..."}
        </span>
        <Check className={value ? "w-3 h-3 text-emerald-500" : "w-3 h-3 text-slate-300"} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 min-w-[250px] animate-in zoom-in-95 duration-100">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
            <input 
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border-none rounded-lg text-[10px] outline-none"
                placeholder="Filtrer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
            {isLoading ? (
                <div className="p-4 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-300" /></div>
            ) : filteredItems.length === 0 ? (
                <div className="p-4 text-center text-[10px] text-slate-400 italic">Aucun élément trouvé</div>
            ) : filteredItems.map(item => (
              <div 
                key={item.id}
                onClick={() => handleSelect(item)}
                className="p-3 hover:bg-blue-50 rounded-xl cursor-pointer border border-transparent hover:border-blue-100 transition-all group"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-700 group-hover:text-blue-700">{item.name}</p>
                  {value === item.id && <Check className="w-3 h-3 text-blue-500" />}
                </div>
                {item.specs && (
                  <p className="text-[9px] text-slate-400 mt-0.5 truncate">
                    {Object.entries(item.specs).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}