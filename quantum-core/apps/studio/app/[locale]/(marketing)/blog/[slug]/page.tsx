// apps/studio/app/[locale]/(marketing)/blog/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { db } from "@repo/database";
import { clsx } from 'clsx';

// --- ICONS ---
import { 
  Calendar, 
  ArrowLeft, 
  Clock, 
  ChevronRight, 
  Hexagon 
} from 'lucide-react';

// --- ACTIONS & LIBS ---
import { getPostBySlug, getTranslatedSlug } from '@/app/actions/blog';
import { Locale } from '@/lib/i18n';

// --- COMPONENTS ---
import { MarkdownViewer } from '@/components/ui/markdown-viewer';
import { ShareButton } from '@/components/marketing/share-button';
import { TutorialNav } from '@/components/marketing/tutorial-nav';
import { LanguageSwitcher } from '@/components/layout/shell/language-switcher';

// --- HELPER LOCAL ---
function getReadingTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// --- 1. GÉNÉRATION DES MÉTADONNÉES (SEO) ---
export async function generateMetadata(props: { 
  params: Promise<{ slug: string, locale: string }> 
}): Promise<Metadata> {
  const { slug, locale } = await props.params;
  const post = await getPostBySlug(slug, locale);
  
  if (!post) return { title: 'Analyse non trouvée' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const fullUrl = `${baseUrl}/${locale}/blog/${slug}`;
  const truncatedDescription = post.excerpt?.slice(0, 160) || ""; 

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
      images: [{ url: `${fullUrl}/openergraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: truncatedDescription,
      images: [`${fullUrl}/openergraph-image`],
    },
  };
}

// --- 2. COMPOSANT PAGE PRINCIPAL ---
export default async function PostPage(props: { 
  params: Promise<{ slug: string, locale: string }> 
}) {
  const { slug, locale } = await props.params;

  // A. Récupération de l'article dans la langue courante
  const post = await getPostBySlug(slug, locale);

  if (!post) notFound();

  // B. Logique i18n : Trouver le slug de la traduction
  const targetLocale = locale === 'fr' ? 'en' : 'fr';
  const translatedSlug = await getTranslatedSlug(post.translationId, targetLocale);
  
  // Construction de l'objet alternates pour le LanguageSwitcher
  const alternates = translatedSlug ? {
    [targetLocale]: `/${targetLocale}/blog/${translatedSlug}`
  } : undefined;

  // C. Incrémentation des vues (Fire & Forget)
  try {
    await db.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });
  } catch (e) {
    console.error("Failed to increment views:", e);
  }

  const readingTime = getReadingTime(post.content);
  const hasTutorial = !!post.tutorial;

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- NAV BAR LOCALE (Sticky) --- */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          
          {/* Fil d'ariane / Retour */}
          <Link 
            href={`/${locale}/blog`}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Journal d'Ingénierie</span>
            <span className="sm:hidden">Retour</span>
          </Link>
          
          {/* Actions Droite */}
          <div className="flex items-center gap-3">
              {/* Selecteur de langue intelligent */}
              <div className="scale-90">
                <LanguageSwitcher alternates={alternates} />
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <ShareButton post={post} locale={locale} />
          </div>
        </div>
      </nav>

      {/* --- HEADER ÉDITORIAL (Titre & Meta) --- */}
      <header className="relative pt-20 pb-16 overflow-hidden border-b border-slate-100 bg-slate-50/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top_right,#3b82f60a,transparent)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="flex justify-center gap-2 mb-8">
            {/* Badge : Série vs Tags */}
            {hasTutorial ? (
               <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 shadow-sm flex items-center gap-2">
                  <span>Série : {post.tutorial?.title}</span>
               </div>
            ) : (
                post.tags?.split(',').map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200 shadow-sm">
                    {tag.trim()}
                </span>
                ))
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-10">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Hexagon className="w-3 h-3 fill-current" />
              </div>
              <span>Quantum Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-50" />
              {new Date(post.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 opacity-50" />
              {readingTime} min
            </div>
          </div>
        </div>
      </header>

      {/* --- HERO IMAGE --- */}
      {post.image && (
        <div className={clsx("mx-auto px-6 -mt-10 mb-16 relative z-20", hasTutorial ? "max-w-7xl" : "max-w-5xl")}>
            <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
        </div>
      )}

      {/* --- LAYOUT PRINCIPAL (2 colonnes si tuto) --- */}
      <main className={clsx(
          "mx-auto px-6 pb-24",
          !post.image && "pt-16",
          hasTutorial ? "max-w-7xl flex flex-col lg:flex-row gap-12 items-start" : "max-w-3xl"
      )}>
        
        {/* --- COLONNE GAUCHE : CONTENU ARTICLE --- */}
        <div className={clsx("min-w-0 transition-all", hasTutorial ? "lg:w-2/3" : "w-full")}>
            <article className="prose prose-slate prose-lg max-w-none 
                prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900
                prose-p:leading-relaxed prose-p:text-slate-600
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                prose-img:rounded-[2rem] prose-img:shadow-2xl
                prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-bold">
                
                <MarkdownViewer content={post.content} />
            </article>

            {/* CALL TO ACTION (Fin de lecture) */}
            <div className="mt-24 pt-16 border-t border-slate-100">
                <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 blur-[80px]" />
                    <div className="relative z-10 max-w-xl">
                        <h3 className="text-3xl font-black mb-6 tracking-tighter">
                            {locale === 'fr' ? "Prêt à construire le futur ?" : "Ready to build the future?"}
                        </h3>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            {locale === 'fr' 
                                ? "Rejoignez la plateforme Quantum Studio et transformez vos modèles théoriques."
                                : "Join the Quantum Studio platform and transform your theoretical models."}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href={`/${locale}/login`} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20">
                                {locale === 'fr' ? "Essayer gratuitement" : "Try for free"} <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- COLONNE DROITE : SIDEBAR TUTORIEL --- */}
        {hasTutorial && post.tutorial && (
            <aside className="hidden lg:block lg:w-1/3 sticky top-24 space-y-8 animate-in slide-in-from-right-4 duration-700">
                <TutorialNav 
                    tutorial={post.tutorial} 
                    currentPostId={post.id} 
                    locale={locale} 
                />
            </aside>
        )}

        {/* NAVIGATION MOBILE (Tutoriel) */}
        {hasTutorial && post.tutorial && (
            <div className="lg:hidden w-full pt-10 border-t border-slate-100">
                 <TutorialNav 
                    tutorial={post.tutorial} 
                    currentPostId={post.id} 
                    locale={locale} 
                />
            </div>
        )}

      </main>

      {/* --- PIED DE PAGE --- */}
      <footer className="bg-slate-50 border-t border-slate-100 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">QC</div>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
              © 2026 Quantum Core Engineering
          </p>
        </div>
      </footer>
    </div>
  );
}