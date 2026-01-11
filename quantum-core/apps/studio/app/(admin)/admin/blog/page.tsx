import { db } from "@repo/database";
import { BlogBatchTools } from "@/components/admin/blog-batch-tools";
import { Edit, Eye, Trash, CheckCircle, Clock, Home, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminBlogPage() {
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  
  const posts = await db.post.findMany({
    where: { domain },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-50/30 p-8 lg:p-12 space-y-10">
      
      {/* BARRE DE NAVIGATION SUPÉRIEURE (BREADCRUMBS) */}
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
          <p className="text-slate-500 italic mt-1">Configurez le contenu technique pour le vertical {domain}.</p>
        </div>

        <div className="flex items-center gap-3">
            <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Quitter l'Admin
            </Link>
            <Link 
                href="/admin/blog/new" 
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-black transition-all flex items-center gap-2"
            >
                <Plus className="w-4 h-4" /> Nouvel Article
            </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* OUTILS DE SYNCHRONISATION ZIP */}
        <BlogBatchTools />

        {/* TABLEAU DES ARTICLES */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm shadow-slate-200/50">
            <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Article</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Statut</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                <th className="p-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                </tr>
            </thead>
            <tbody>
                {posts.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="p-20 text-center text-slate-400 italic">
                            Aucun article trouvé. Importez un ZIP ou créez-en un nouveau.
                        </td>
                    </tr>
                ) : posts.map(post => (
                <tr key={post.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors group">
                    <td className="p-6">
                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{post.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono italic mt-1">/{post.slug}</p>
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
                    <td className="p-6 text-xs font-medium text-slate-500">
                        {new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                        {/* Voir sur le site public */}
                        <Link 
                            href={`/blog/${post.slug}`} 
                            target="_blank"
                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all"
                        >
                            <Eye className="w-4 h-4" />
                        </Link>
                        {/* Editer */}
                        <Link 
                            href={`/admin/blog/${post.id}`} 
                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        {/* Supprimer */}
                        <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                            <Trash className="w-4 h-4" />
                        </button>
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