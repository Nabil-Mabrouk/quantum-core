// apps/studio/app/(admin)/admin/blog/[id]/page.tsx

import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { updatePostAction } from '@/app/actions/admin-blog'; 
import { 
  Globe, 
  Tag, 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  Clock, 
  Layout, 
  FileEdit,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default async function EditPostPage(props: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await props.params;
  const post = await db.post.findUnique({ 
    where: { id },
    include: { author: true }
  });

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-900">
      
      {/* 1. HEADER DE NAVIGATION (Sticky) */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Link 
            href="/admin/blog" 
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-600 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                Administration Système
            </div>
            <h1 className="text-xl font-black tracking-tight">Éditeur d'Expertise</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <Link 
              href={`/blog/${post.slug}`} 
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
                <Eye className="w-4 h-4" /> Voir en ligne
            </Link>
        </div>
      </header>

      {/* 2. ESPACE DE TRAVAIL */}
      <main className="flex-1 p-8">
        <form action={updatePostAction} className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 items-start">
          
          {/* COLONNE GAUCHE : RÉDACTION (Immersive) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="slug" value={post.slug} />
                    
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block ml-1">Titre de la publication</label>
                    <input 
                        name="title" 
                        defaultValue={post.title} 
                        className="w-full bg-transparent text-4xl font-black tracking-tighter text-slate-900 outline-none placeholder:text-slate-200"
                        placeholder="Entrez un titre percutant..."
                    />
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                            <Layout className="w-3 h-3" /> Résumé SEO (Excerpt)
                        </div>
                        <textarea 
                            name="excerpt" 
                            defaultValue={post.excerpt || ""} 
                            className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-3xl text-slate-600 leading-relaxed outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all resize-none italic"
                            placeholder="Décrivez brièvement le contenu technique de cet article..."
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                <FileEdit className="w-3 h-3" /> Corps du document (Markdown)
                            </div>
                            <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">LaTeX & GFM Enabled</span>
                        </div>
                        <textarea 
                            name="content" 
                            defaultValue={post.content} 
                            className="w-full h-[800px] p-10 bg-slate-900 text-slate-100 rounded-[2.5rem] font-mono text-sm leading-relaxed outline-none border-8 border-slate-800 focus:border-blue-600/20 transition-all shadow-inner custom-scrollbar"
                            placeholder="# Commencez à rédiger..."
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* COLONNE DROITE : CONTRÔLE & MÉTA (Sticky) */}
          <aside className="col-span-12 lg:col-span-4 space-y-6 sticky top-28">
            
            {/* CARTE PUBLICATION */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-lg shadow-slate-200/40 space-y-8">
                <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Globe className="w-3 h-3 text-blue-500" /> Paramètres de visibilité
                    </h4>
                    
                    <label className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl bg-white shadow-sm ${post.published ? 'text-emerald-500' : 'text-slate-300'}`}>
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">Publier l'article</span>
                        </div>
                        <input 
                            type="checkbox" 
                            name="published" 
                            defaultChecked={post.published}
                            className="w-6 h-6 rounded-lg accent-blue-600 cursor-pointer"
                        />
                    </label>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                        <Tag className="w-3 h-3 text-blue-500" /> Classification
                    </h4>
                    <input 
                        name="tags" 
                        defaultValue={post.tags || ""} 
                        placeholder="Chimie, Nickel, ZLD..."
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 transition-all"
                    />
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group"
                    >
                        <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Mettre à jour l'expertise
                    </button>
                </div>
            </div>

            {/* CARTE INFOS SYSTÈME */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <Clock className="w-4 h-4" /> Historique
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Créé le</span>
                        <span className="text-xs font-mono">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Dernière modif</span>
                        <span className="text-xs font-mono">{new Date(post.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Auteur</span>
                        <span className="text-xs font-bold text-blue-400">{post.author?.name || "Système"}</span>
                    </div>
                </div>
            </div>
          </aside>

        </form>
      </main>
    </div>
  );
}

// Composant icône pour le statut
function CheckCircle2(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
}