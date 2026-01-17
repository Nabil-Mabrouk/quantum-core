// apps/studio/app/[locale]/(admin)/admin/blog/[id]/page.tsx

import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { EditPostForm } from '@/components/admin/edit-post-form';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Eye,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default async function EditPostPage(props: { 
  params: Promise<{ id: string, locale: string }> 
}) {
  // 1. Résolution des paramètres (Next.js 15)
  const { id, locale } = await props.params;

  // 2. Récupération parallèle du post et de la liste globale des tags
  // On récupère tous les tags pour permettre l'auto-complétion dans le formulaire client
  const [post, allPostsWithTags] = await Promise.all([
    db.post.findUnique({ 
      where: { id },
      include: { author: true }
    }),
    db.post.findMany({
      select: { tags: true }
    })
  ]);

  // 3. Gestion du cas "non trouvé"
  if (!post) notFound();

  // 4. Extraction et dédoublonnage des tags existants pour le composant client
  const uniqueTags = Array.from(
    new Set(
      allPostsWithTags
        .flatMap(p => p.tags ? p.tags.split(',') : [])
        .map(t => t.trim())
        .filter(t => t !== "")
    )
  ).sort();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-900">
      
      {/* 1. HEADER DE NAVIGATION (Stable / Serveur) */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Link 
            href={`/${locale}/admin/blog`} 
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
            <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut actuel</span>
                <span className={`text-[10px] font-black uppercase ${post.published ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {post.published ? '● En ligne' : '○ Brouillon'}
                </span>
            </div>
            <Link 
              href={`/${locale}/blog/${post.slug}`} 
              target="_blank"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
            >
                <Eye className="w-4 h-4" /> Voir l'article
            </Link>
        </div>
      </header>

      {/* 2. ESPACE DE TRAVAIL ÉDITEUR (Client Side) */}
      <main className="flex-1 p-8">
        {/* 
          On passe 'existingTags' au formulaire pour permettre 
          la sélection rapide des thématiques déjà utilisées.
        */}
        <EditPostForm 
            post={post} 
            existingTags={uniqueTags} 
        />
      </main>

      {/* 3. FOOTER INFOS (Serveur) */}
      <footer className="max-w-[1600px] mx-auto w-full p-10 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-3 text-slate-400">
            <FileText size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                ID Document : {post.id}
            </span>
         </div>
         <div className="text-[10px] font-medium text-slate-400 italic">
            Dernière modification par {post.author?.name || "Système"} le {new Date(post.updatedAt).toLocaleString()}
         </div>
      </footer>
    </div>
  );
}