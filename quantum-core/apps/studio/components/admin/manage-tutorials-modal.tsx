'use client';

import { useState } from 'react';
import { Settings2, Trash2, X, Loader2 } from 'lucide-react';
import { deleteTutorialAction } from '@/app/actions/admin-blog';
import { toast } from 'sonner';

export function ManageTutorialsModal({ tutorials }: { tutorials: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer la série "${title}" ? Les articles ne seront pas supprimés mais deviendront indépendants.`)) return;

    setIsDeleting(id);
    const res = await deleteTutorialAction(id);
    setIsDeleting(null);

    if (res.success) {
      toast.success("Série supprimée");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
        title="Gérer les séries"
      >
        <Settings2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Gérer les Séries</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-200 rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto space-y-2">
              {tutorials.length === 0 ? (
                <p className="text-center py-10 text-slate-400 italic text-sm">Aucune série créée.</p>
              ) : (
                tutorials.map((tuto) => (
                  <div key={tuto.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{tuto.title}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{tuto.language}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(tuto.id, tuto.title)}
                      disabled={isDeleting === tuto.id}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      {isDeleting === tuto.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[9px] text-slate-400 uppercase font-bold">Total : {tutorials.length} séries</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}