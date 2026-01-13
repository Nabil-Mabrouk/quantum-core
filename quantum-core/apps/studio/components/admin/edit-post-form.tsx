'use client';

import { useActionState, useEffect } from 'react';
import { updatePostAction } from '@/app/actions/admin-blog';
import { Save, Layout, FileEdit, Loader2, Tag } from 'lucide-react';
import { toast } from 'sonner';

export function EditPostForm({ post }: { post: any }) {
  // useActionState attend une action à 2 arguments (state, formData)
  // formAction est la fonction "nettoyée" que l'on passe au HTML
  const [state, formAction, isPending] = useActionState(updatePostAction, null);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 items-start">
      {/* Champ caché pour l'ID */}
      <input type="hidden" name="id" value={post.id} />
      
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/30">
            <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Titre</label>
            <input 
              name="title" 
              defaultValue={post.title} 
              className="w-full bg-transparent text-4xl font-black tracking-tighter outline-none" 
              required 
            />
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <Layout className="w-3 h-3" /> Résumé SEO
              </label>
              <textarea 
                name="excerpt" 
                defaultValue={post.excerpt || ""} 
                className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none resize-none italic" 
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <FileEdit className="w-3 h-3" /> Corps (Markdown)
              </label>
              <textarea 
                name="content" 
                defaultValue={post.content} 
                className="w-full h-[600px] p-10 bg-slate-900 text-slate-100 rounded-[2.5rem] font-mono text-sm outline-none border-8 border-slate-800 focus:border-blue-600/20" 
              />
            </div>
          </div>
        </div>
      </div>

      <aside className="col-span-12 lg:col-span-4 space-y-6 sticky top-28">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-lg space-y-8">
          <label className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer hover:bg-blue-50 transition-all">
            <span className="text-sm font-bold text-slate-700">Publier l'article</span>
            <input 
              type="checkbox" 
              name="published" 
              defaultChecked={post.published} 
              className="w-6 h-6 accent-blue-600" 
            />
          </label>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
              <Tag className="w-3 h-3" /> Tags
            </label>
            <input 
              name="tags" 
              defaultValue={post.tags || ""} 
              placeholder="Chimie, ZLD..." 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending} 
            className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isPending ? "Enregistrement..." : "Mettre à jour l'expertise"}
          </button>
        </div>
      </aside>
    </form>
  );
}