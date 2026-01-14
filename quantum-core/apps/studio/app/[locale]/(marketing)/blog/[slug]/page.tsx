// apps/studio/app/(marketing)/blog/[slug]/page.tsx

import { getPostBySlug } from '@/app/actions/blog';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';
import { notFound } from 'next/navigation';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function PostPage(props: { 
  params: Promise<{ slug: string }> 
}) {
  // 1. Résolution du slug (Next.js 15+)
  const { slug } = await props.params;

  // 2. Récupération de l'article en base
  const post = await getPostBySlug(slug);

  // 3. Si l'article n'existe pas ou n'appartient pas au bon domaine -> 404
  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Header de l'article */}
      <header className="bg-slate-50 border-b border-slate-100 py-16 mb-12">
        <div className="max-w-3xl mx-auto px-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour à l'expertise
          </Link>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-300" />
              {new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            {post.tags && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-300" />
                <span className="text-blue-500">{post.tags}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Corps de l'article */}
      <div className="max-w-3xl mx-auto px-8">
        <MarkdownViewer content={post.content} />
      </div>
      
      {/* Footer de l'article */}
      <footer className="max-w-3xl mx-auto px-8 mt-20 pt-10 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-400 italic">
          Cette analyse fait partie du corpus de connaissances de Quantum Core pour le domaine {post.domain}.
        </p>
      </footer>
    </article>
  );
}