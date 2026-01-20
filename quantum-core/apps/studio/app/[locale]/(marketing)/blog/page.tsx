// apps/studio/app/[locale]/(marketing)/blog/page.tsx
import { db } from "@repo/database";
import { BlogSearchGrid } from "@/components/marketing/blog-search-grid";
import { Hexagon, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function BlogPage(props: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ page?: string, tag?: string, q?: string }> 
}) {
  const { locale } = await props.params;
  const { page, tag, q } = await props.searchParams;

  const POSTS_PER_PAGE = 9;
  const currentPage = parseInt(page || "1", 10);
  const skip = Math.max(0, (currentPage - 1) * POSTS_PER_PAGE);

  // 🚩 DÉCLARATION UNIQUE DE LA CLAUSE WHERE
  const where: any = { 
    published: true, 
    language: locale 
  };

  if (tag) where.tags = { contains: tag, mode: 'insensitive' };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { excerpt: { contains: q, mode: 'insensitive' } }
    ];
  }

  // 1. RÉCUPÉRATION DES TUTORIELS (SÉRIES)
  const tutorials = await db.tutorial.findMany({
    where: { language: locale, published: true },
    include: {
      _count: {
        select: { posts: { where: { published: true } } }
      },
      posts: {
        where: { published: true, order: 1 }, 
        select: { slug: true },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 2. RÉCUPÉRATION PARALLÈLE DES ARTICLES ET STATS
  const [
    filteredPosts, 
    popularPosts, 
    allPostsForTags, 
    totalPosts
  ] = await Promise.all([
    // Grille principale paginée
    db.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: POSTS_PER_PAGE,
      skip: skip,
    }),
    // Articles populaires
    db.post.findMany({
      where: { published: true, language: locale },
      orderBy: { views: 'desc' },
      take: 3
    }),
    // Données pour le nuage de tags
    db.post.findMany({ 
        where: { published: true, language: locale }, 
        select: { tags: true } 
    }),
    // Compte total pour la pagination
    db.post.count({ where })
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* --- HEADER HERO --- */}
      <section className="bg-slate-50 border-b border-slate-100 pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-12 hover:gap-3 transition-all group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                {locale === 'fr' ? 'Retour accueil' : 'Back home'}
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Hexagon size={20} className="fill-current" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Engineering Ledger</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.85]">
                        Expertise & <br/><span className="text-blue-600">Engineering.</span>
                    </h1>
                </div>
            </div>
        </div>
      </section>

      {/* --- GRILLE DE RECHERCHE ET RÉSULTATS --- */}
      <main className="max-w-6xl mx-auto px-6 -mt-8">
        <BlogSearchGrid 
            tutorials={tutorials}
            initialPosts={filteredPosts} 
            popularPosts={popularPosts}
            allTagsData={allPostsForTags || []} 
            locale={locale}
            totalPages={totalPages}
            currentPage={currentPage}
            activeTag={tag}
            activeQuery={q}
            isFiltering={!!(tag || q)}
        />
      </main>
    </div>
  );
}