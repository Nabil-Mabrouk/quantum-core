import { db } from "@repo/database";
import Link from "next/link";
import { Calendar, Tag, ChevronRight } from "lucide-react";

export default async function BlogPage() {
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  const posts = await db.post.findMany({
    where: { domain, published: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-slate-50 min-h-screen py-20 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Expertise Technique</h1>
            <p className="text-xl text-slate-500 italic max-w-2xl">
                Retrouvez nos guides d'ingénierie et analyses sur le {domain === 'WATER' ? 'traitement des eaux' : 'secteur énergétique'}.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group">
              <div className="h-full bg-white border border-slate-200 p-8 rounded-[2rem] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                </div>
                
                <h2 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors leading-tight mb-4">
                    {post.title}
                </h2>
                
                <p className="text-slate-500 text-sm line-clamp-3 mb-8 italic">
                    {post.excerpt || "Découvrez notre analyse technique détaillée sur ce sujet..."}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                    <div className="flex gap-2">
                        {post.tags?.split(',').map((tag: string) => (
                            <span key={tag} className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md uppercase">{tag.trim()}</span>
                        ))}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}