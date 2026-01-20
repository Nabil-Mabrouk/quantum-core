'use client';

import { useState } from 'react';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import { createTutorialAction } from '@/app/actions/admin-blog';
import { toast } from 'sonner';

export function CreateTutorialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [lang, setLang] = useState("fr");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    const res = await createTutorialAction(title, lang);
    setIsLoading(false);

    if (res.success) {
      toast.success("Série créée avec succès !");
      setIsOpen(false);
      setTitle("");
    } else {
      toast.error("Erreur : " + res.error);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
      >
        <BookOpen className="w-3.5 h-3.5" /> Nouvelle Série
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md space-y-6 border border-slate-100 animate-in zoom-in-95"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-black text-lg text-slate-900 tracking-tight">Créer une Série</h3>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Titre de la série</label>
                    <input 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-800 transition-all"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Maîtriser l'Osmose Inverse"
                        autoFocus
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Langue</label>
                    <select 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer font-bold text-slate-800"
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                    >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button 
                    type="button" 
                    onClick={() => setIsOpen(false)} 
                    className="flex-1 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                >
                    Annuler
                </button>
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Créer
                </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}