'use client';

import { useState, useEffect } from 'react';
import { getCatalogItems } from '@/app/actions/catalog';
import { ShoppingBag, Check } from 'lucide-react';
import { useCanvasStore } from '@/store/canvas-store';

export function CatalogSelector({ category, nodeId }: { category: string, nodeId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);

  useEffect(() => {
    if (isOpen) getCatalogItems(category).then(setItems);
  }, [isOpen, category]);

  const handleSelect = (item: any) => {
    // On injecte les specs du catalogue + le nom de l'équipement dans le noeud
    updateNodeProperties(nodeId, { 
      ...item.specs, 
      catalogName: item.name,
      price: item.specs.price || 0 
    });
    setIsOpen(false);
  };

  return (
    <div className="relative mt-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 p-2 text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
      >
        <ShoppingBag className="w-3 h-3" />
        Catalogue {category}s
      </button>

      {isOpen && (
        <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 max-h-60 overflow-y-auto">
          {items.map(item => (
            <div 
              key={item.id}
              onClick={() => handleSelect(item)}
              className="p-3 hover:bg-blue-50 rounded-lg cursor-pointer border border-transparent hover:border-blue-100 transition-all group"
            >
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-slate-700 group-hover:text-blue-700">{item.name}</p>
                <Check className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100" />
              </div>
              <p className="text-[9px] text-slate-400 mt-1">
                Prix : {item.specs.price} € | Specs : {JSON.stringify(item.specs)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}