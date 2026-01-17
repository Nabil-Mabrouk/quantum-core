// apps/studio/app/[locale]/(marketing)/blog/[slug]/page.tsx

import { getPostBySlug } from '@/app/actions/blog';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';
import { notFound } from 'next/navigation';
import { 
  Calendar, 
  ArrowLeft, 
  Clock, 
  Share2, 
  ChevronRight, 
  Hexagon
} from 'lucide-react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { db } from "@repo/database";
import { clsx } from 'clsx';
import { ShareButton } from '@/components/marketing/share-button';

function getReadingTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Ajoutez cet import
import { Metadata } from 'next';

// 1. Fonction pour générer les Meta-données (SEO & Social)
// apps/studio/app/[locale]/(marketing)/blog/[slug]/page.tsx

export async function generateMetadata(props: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await props.params;
  const post = await getPostBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!post) return { title: 'Analyse non trouvée' };

  const fullUrl = `${baseUrl}/${locale}/blog/${slug}`;
  const truncatedDescription = post.excerpt?.slice(0, 160) || ""; // Limite SEO standard

  return {
    title: post.title,
    description: truncatedDescription,
    openGraph: {
      title: post.title,
      description: truncatedDescription,
      url: fullUrl,
      siteName: 'Quantum Core Engineering',
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      images: [
        {
          url: `${fullUrl}/openergraph-image`, // Utilise votre image dynamique
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: truncatedDescription,
      images: [`${fullUrl}/openergraph-image`],
    },
  };
}

export default async function PostPage(props: { 
  params: Promise<{ slug: string, locale: string }> 
}) {
  // 1. Résolution des paramètres (Next.js 15)
  const { slug, locale } = await props.params;

  // 2. Récupération de l'article
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // 3. Incrémentation des vues (Côté Serveur)
  try {
    await db.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });
  } catch (e) {
    console.error("Failed to increment views:", e);
  }

  const readingTime = getReadingTime(post.content);

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- 1. BARRE DE NAVIGATION (Sticky) --- */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link 
            href={`/${locale}/blog`}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Journal d'Ingénierie</span>
          </Link>
          
          <div className="flex items-center gap-4">
              <ShareButton post={post} locale={locale} />
          </div>
        </div>
      </nav>

      {/* --- 2. HEADER ÉDITORIAL --- */}
      <header className="relative pt-20 pb-16 overflow-hidden border-b border-slate-100 bg-slate-50/50">
        {/* Décoration d'arrière-plan */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top_right,#3b82f60a,transparent)] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
          <div className="flex justify-center gap-2 mb-8">
            {post.tags?.split(',').map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200 shadow-sm"
              >
                {tag.trim()}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-10">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-y-4 gap-x-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Hexagon className="w-3 h-3 fill-current" />
              </div>
              <span>Quantum Core Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-50" />
              {new Date(post.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 opacity-50" />
              {readingTime} min
            </div>
          </div>
        </div>
      </header>

      {/* --- 3. HERO IMAGE (SI PRÉSENTE) --- */}
      {post.image && (
        <div className="max-w-5xl mx-auto px-6 -mt-10 mb-16 relative z-20">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
            </div>
        </div>
      )}

      {/* --- 4. CONTENU DE L'ARTICLE --- */}
      <main className={clsx("max-w-3xl mx-auto px-6 pb-24", !post.image && "pt-16")}>
        <article className="prose prose-slate prose-lg max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900
          prose-p:leading-relaxed prose-p:text-slate-600
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic
          prose-img:rounded-[2rem] prose-img:shadow-2xl
          prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-bold">
          <MarkdownViewer content={post.content} />
        </article>

        {/* --- 5. CALL TO ACTION FIN D'ARTICLE --- */}
        <div className="mt-24 pt-16 border-t border-slate-100">
          <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 blur-[80px]" />
            
            <div className="relative z-10 max-w-xl">
              <h3 className="text-3xl font-black mb-6 tracking-tighter">
                Prêt à construire le futur de l'ingénierie ?
              </h3>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Rejoignez la plateforme Quantum Studio et transformez vos modèles théoriques en outils de simulation haute performance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href={`/${locale}/login`}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20"
                >
                  Essayer gratuitement <ChevronRight className="w-4 h-4" />
                </Link>
                <Link 
                  href={`/${locale}/blog`}
                  className="bg-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all"
                >
                  Plus d'analyses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- 6. PIED DE PAGE --- */}
      <footer className="bg-slate-50 border-t border-slate-100 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">QC</div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
                © 2026 Quantum Core Engineering
            </p>
            <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed uppercase tracking-wider font-medium">
                Savoir-faire technique et innovation logicielle <br /> pour les industries de procédés complexes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}