// apps/studio/app/[locale]/(admin)/admin/blog/page.tsx

import { db } from "@repo/database";
import { BlogBatchTools } from "@/components/admin/blog-batch-tools";
import { Edit, Eye, CheckCircle, Clock, Home, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth"; 
import { redirect } from "next/navigation"; 
import { createPostAction } from "@/app/actions/admin-blog";
import { BlogDeleteButton } from "@/components/admin/blog-delete-button";
import { CreateTutorialModal } from "@/components/admin/create-tutorial-modal";
import { ManageTutorialsModal } from "@/components/admin/manage-tutorials-modal";

export default async function AdminBlogPage() {
  // 1. Vérification de sécurité
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  
  // 2. Récupération parallèle des Articles et des Tutoriels (Séries)
  const [posts, tutorials] = await Promise.all([
    db.post.findMany({
      where: { domain },
      orderBy: { createdAt: 'desc' },
      include: { tutorial: true } // Crucial pour afficher le badge de la série
    }),
    db.tutorial.findMany({
      where: { domain },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <div className="min-h-screen bg-slate-50/30 p-8 lg:p-12 space-y-10">
      
      {/* --- HEADER --- */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
            <Link href="/" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Home className="w-3 h-3" /> Accueil
            </Link>
            <span>/</span>
            <span className="text-slate-900">Administration</span>
            <span>/</span>
            <span className="text-blue-600">Blog</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Gestion de l'Expertise
          </h1>
          <p className="text-slate-500 italic mt-1 text-sm">Articles techniques et séries de tutoriels.</p>
        </div>

        <div className="flex items-center gap-3">
            <Link 
                href="/admin" 
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Quitter
            </Link>
            
            {/* BOUTON GESTION (MODIFICATION/SUPPRESSION DES SÉRIES) */}
            <ManageTutorialsModal tutorials={tutorials} />

            {/* BOUTON CRÉATION SÉRIE */}
            <CreateTutorialModal />

            {/* BOUTON NOUVEL ARTICLE */}
            <form action={createPostAction}>
                <button 
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Nouvel Article
                </button>
            </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* OUTILS ZIP (IMPORT/EXPORT) */}
        <BlogBatchTools />

        {/* TABLEAU DES ARTICLES */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm shadow-slate-200/50">
            <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Article</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Série / Chapitre</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Langue</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Statut</th>
                <th className="p-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                </tr>
            </thead>
            <tbody>
                {posts.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="p-20 text-center text-slate-400 italic">
                            Aucun article trouvé.
                        </td>
                    </tr>
                ) : posts.map(post => (
                <tr key={post.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors group">
                    <td className="p-6">
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{post.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono italic mt-1">/{post.slug}</p>
                    </td>
                    <td className="p-6">
                        {post.tutorial ? (
                            <div className="flex flex-col gap-1">
                                <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[9px] font-black rounded-md border border-purple-100 uppercase tracking-tight w-fit">
                                    {post.tutorial.title}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase ml-1">Étape n°{post.order}</span>
                            </div>
                        ) : (
                            <span className="text-[10px] text-slate-300 italic">Article indépendant</span>
                        )}
                    </td>
                    <td className="p-6 text-center">
                        <span className="text-[10px] uppercase font-black text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            {post.language}
                        </span>
                    </td>
                    <td className="p-6">
                        {post.published ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[9px] uppercase border border-emerald-100">
                                <CheckCircle className="w-3 h-3" /> En ligne
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-400 rounded-full font-bold text-[9px] uppercase border border-slate-200">
                                <Clock className="w-3 h-3" /> Brouillon
                            </span>
                        )}
                    </td>
                    <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                            <Link 
                                // MODIFIEZ CETTE LIGNE 👇
                                href={`/${post.language}/blog/${post.slug}`} 
                                target="_blank"
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all"
                                title="Voir l'article"
                            >
                                <Eye className="w-4 h-4" />
                            </Link>
                            <Link 
                                href={`/admin/blog/${post.id}`} 
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all"
                                title="Modifier"
                            >
                                <Edit className="w-4 h-4" />
                            </Link>
                            
                            <BlogDeleteButton postId={post.id} postTitle={post.title} />
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}