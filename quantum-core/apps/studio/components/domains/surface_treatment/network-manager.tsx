'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  Waves, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Factory
} from 'lucide-react';

export function NetworkManager() {
  const { nodes, addNode, onNodesChange, setSelectedNodeId } = useCanvasStore();
  
  const drains = nodes.filter(n => n.type === 'DRAIN');
  const sources = nodes.filter(n => n.type === 'SOURCE');

  const handleAdd = (type: string) => {
    const name = prompt(type === 'DRAIN' ? "Nom du Réseau (ex: Acide) :" : "Nom de la Source (ex: Eau Ville) :");
    if (name) {
      addNode(type, { x: 100 + Math.random() * 50, y: 100 + Math.random() * 50 });
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm("Supprimer cet élément ? Cela déconnectera les équipements associés.")) {
      onNodesChange([{ id, type: 'remove' }]);
    }
  };

  const ListItem = ({ node, icon: Icon, color }: any) => (
    <div 
        onClick={() => setSelectedNodeId(node.id)}
        className={`group flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-${color}-400 hover:shadow-md transition-all`}
    >
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full bg-${color}-50 flex items-center justify-center text-${color}-600`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700">{node.data.label}</span>
        </div>
        <button 
            onClick={(e) => handleDelete(e, node.id)} 
            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
        >
            <Trash2 className="w-3.5 h-3.5" />
        </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-xl">
            <Factory className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Configuration Site</h3>
            <p className="text-xs text-slate-400 mt-1">Définissez vos réseaux et sources.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black uppercase text-blue-600 tracking-widest flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> Sources
            </h4>
            <button onClick={() => handleAdd('SOURCE')} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase"><Plus className="w-3 h-3" /> Ajouter</button>
        </div>
        <div className="space-y-2">
            {sources.map(node => <ListItem key={node.id} node={node} icon={ArrowRight} color="blue" />)}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2">
                <Waves className="w-4 h-4" /> Réseaux Rejet
            </h4>
            <button onClick={() => handleAdd('DRAIN')} className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase"><Plus className="w-3 h-3" /> Ajouter</button>
        </div>
        <div className="space-y-2">
            {drains.map(node => <ListItem key={node.id} node={node} icon={Waves} color="emerald" />)}
        </div>
      </div>
    </div>
  );
}