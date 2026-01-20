// apps/studio/components/marketing/blog-search-grid.tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, ArrowRight, ArrowLeft, Hexagon, Hash, 
  Clock, Sparkles, BookOpen, GraduationCap, ChevronRight 
} from 'lucide-react';
import { clsx } from 'clsx';

export function BlogSearchGrid({ 
    tutorials = [],
    initialPosts = [], 
    popularPosts = [],
    allTagsData = [], 
    locale, 
    totalPages, 
    currentPage,
    activeTag,
    activeQuery,
    isFiltering
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(activeQuery || '');

  // --- LOGIQUE UNIQUE DE MISE À JOUR DE L'URL ---
  const updateFilters = (newParams: Record<string, string | null>) => {
    // On récupère les paramètres actuels pour les préserver
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // 🚩 RÉPARATION : On ne force "page=1" QUE si on n'est pas en train de paginer.
    // Si newParams contient 'page', c'est qu'on a cliqué sur Suivant/Précédent.
    if (!newParams.hasOwnProperty('page')) {
      params.set('page', '1');
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  // Nuage de tags
  const tagCloud = useMemo(() => {
    const counts: Record<string, number> = {};
    allTagsData.forEach((p: any) => {
      if (p.tags) {
        p.tags.split(',').forEach((t: string) => {
          const tag = t.trim();
          if (tag) counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, weight: count > 5 ? 4 : count > 2 ? 2 : 1 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30);
  }, [allTagsData]);

  return (
    <div className="space-y-20">
      {/* 1. BARRE DE RECHERCHE */}
      <div className="bg-white border border-slate-200 p-2 rounded-[2rem] shadow-2xl flex items-center gap-4 group focus-within:ring-8 focus-within:ring-blue-50 transition-all">
        <div className="pl-6 text-slate-300 group-focus-within:text-blue-500 transition-colors">
            <Search size={24} />
        </div>
        <input 
            type="text"
            placeholder={locale === 'fr' ? "Rechercher une expertise, technologie..." : "Search keywords, technologies..."}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && updateFilters({ q: searchValue })}
            className="flex-1 py-4 bg-transparent outline-none text-lg font-medium text-slate-800 placeholder:text-slate-300"
        />
      </div>

      {/* 2. SECTION TUTORIELS (Uniquement si pas de recherche active) */}
      {!isFiltering && tutorials.length > 0 && (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <GraduationCap className="text-blue-600" size={24} />
                <h2 className="text-2xl font-black tracking-tight uppercase">
                    {locale === 'fr' ? "Parcours d'apprentissage" : "Learning Paths"}
                </h2>
                <div className="h-px bg-slate-100 flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorials.map((tuto: any) => (
                    <Link 
                        key={tuto.id}
                        href={`/${locale}/blog/${tuto.posts[0]?.slug || '#'}`}
                        className="group relative bg-slate-900 rounded-[2.5rem] p-8 overflow-hidden transition-all hover:scale-[1.01] hover:shadow-2xl shadow-blue-900/20"
                    >
                        <BookOpen className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <span className="px-3 py-1 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full w-fit mb-4">
                                {tuto._count.posts} {locale === 'fr' ? 'Chapitres' : 'Chapters'}
                            </span>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tighter">
                                {tuto.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">
                                {tuto.description || (locale === 'fr' ? "Maîtrisez ce sujet de A à Z." : "Master this subject from A to Z.")}
                            </p>
                            
                            <div className="mt-auto flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                                {locale === 'fr' ? "Commencer la série" : "Start series"} <ChevronRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
      )}

      {/* 3. NUAGE DE TAGS */}
      <div className="space-y-8 bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                <Hash size={14} /> {locale === 'fr' ? 'Thématiques' : 'Thematic Cloud'}
            </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6">
            {tagCloud.map((tag) => (
                <button
                    key={tag.name}
                    onClick={() => updateFilters({ tag: activeTag === tag.name ? null : tag.name })}
                    className={clsx(
                        "transition-all duration-300 uppercase tracking-tighter flex items-start gap-1 group",
                        activeTag === tag.name ? "text-blue-600 scale-110 underline underline-offset-8" : "text-slate-400 hover:text-slate-900",
                        tag.weight === 4 ? "text-2xl font-black" : tag.weight === 2 ? "text-lg font-bold" : "text-xs font-semibold"
                    )}
                >
                    {tag.name} <span className="text-[10px] opacity-40">({tag.count})</span>
                </button>
            ))}
        </div>
      </div>

      {/* 4. AFFICHAGE DES ARTICLES */}
      <div className="space-y-20">
          {!isFiltering && popularPosts.length > 0 && (
            <section className="space-y-10">
                <div className="flex items-center gap-4">
                    <Sparkles className="text-amber-500" size={20} />
                    <h2 className="text-2xl font-black tracking-tight uppercase">
                        {locale === 'fr' ? 'Les plus consultés' : 'Most Consulted'}
                    </h2>
                    <div className="h-px bg-slate-100 flex-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {popularPosts.map((post: any) => (
                        <PostCard key={post.id} post={post} locale={locale} isFeatured />
                    ))}
                </div>
            </section>
          )}

          <section className="space-y-10">
            <div className="flex items-center gap-4">
                <Clock className="text-blue-500" size={20} />
                <h2 className="text-2xl font-black tracking-tight uppercase">
                    {isFiltering ? (locale === 'fr' ? 'Résultats' : 'Results') : (locale === 'fr' ? 'Dernières analyses' : 'Latest Analysis')}
                </h2>
                <div className="h-px bg-slate-100 flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {initialPosts.map((post: any) => (
                    <PostCard key={post.id} post={post} locale={locale} />
                ))}
            </div>
            {initialPosts.length === 0 && (
                <div className="py-20 text-center text-slate-400 italic">
                    {locale === 'fr' ? "Aucun article trouvé." : "No articles found."}
                </div>
            )}
          </section>
      </div>

      {/* 5. PAGINATION */}
      {totalPages > 1 && (
        <div className="pt-20 border-t border-slate-100 flex items-center justify-between">
            <button 
                disabled={currentPage <= 1}
                onClick={() => updateFilters({ page: (currentPage - 1).toString() })}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-900 disabled:opacity-20 hover:gap-4 transition-all"
            >
                <ArrowLeft size={16} /> {locale === 'fr' ? 'Précédent' : 'Previous'}
            </button>
            
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Page {currentPage} / {totalPages}
            </div>

            <button 
                disabled={currentPage >= totalPages}
                onClick={() => updateFilters({ page: (currentPage + 1).toString() })}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-900 disabled:opacity-20 hover:gap-4 transition-all"
            >
                {locale === 'fr' ? 'Suivant' : 'Next'} <ArrowRight size={16} />
            </button>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, locale, isFeatured }: any) {
  return (
    <Link href={`/${post.language}/blog/${post.slug}`} className="group flex flex-col h-full">
      <div className={clsx(
          "mb-6 overflow-hidden rounded-[2.5rem] bg-slate-50 relative border border-slate-100 transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-200",
          isFeatured ? "aspect-[16/9] shadow-lg" : "aspect-[16/10]"
      )}>
        {post.image ? (
            <img 
              src={post.image} 
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-white">
                <div className="opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                    <Hexagon size={isFeatured ? 200 : 120} className="text-slate-950" />
                </div>
            </div>
        )}

        <div className="absolute bottom-6 left-6">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-blue-600 rounded-lg shadow-sm border border-white">
                {post.tags?.split(',')[0]}
            </span>
        </div>
      </div>

      <div className="space-y-3 flex-1 flex flex-col px-2">
        <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            {isFeatured && (
                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    <Sparkles size={10}/> Trending
                </span>
            )}
        </div>
        <h3 className={clsx(
            "font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tighter leading-tight",
            isFeatured ? "text-2xl" : "text-xl"
        )}>
            {post.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 font-medium italic">
            {post.excerpt}
        </p>
        <div className="pt-4 mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:gap-4 transition-all group-hover:text-blue-600">
            {locale === 'fr' ? 'Lire l\'analyse' : 'Read Analysis'} <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}