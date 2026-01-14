import { getLibrary } from '@/app/actions/library';
import { getDynamicSchemas } from '@/app/actions/configuration';
import { getDomainConfig } from '@/lib/registry';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
import { LibraryManager } from '@/components/library/library-manager';
import { LibrarySpecsView } from '@/components/library/views/library-specs-view';
import { LibraryIOView } from '@/components/library/views/library-io-view';
import { BookOpen, Database, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { t, Locale } from '@/lib/i18n'; // Import du type Locale

export default async function LibraryPage(props: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ view?: string, projectId?: string }> 
}) {
  const { locale } = (await props.params) as { locale: Locale }; 
  // Dans Next.js 15/16, searchParams est une Promise
  const searchParams = await props.searchParams;
  const currentView = searchParams.view || 'master';
  const projectId = searchParams.projectId;
  
  const config = getDomainConfig();
  const domainId = config.id;
  

  // Récupération des données techniques
  const allItems = await getLibrary(domainId);
  const dynamicSchemas = await getDynamicSchemas(domainId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* 1. SIDEBAR GLOBALE (Lien vers dashboard et projet) */}
      <SideNav projectId={projectId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* 2. HEADER UNIFIÉ */}
        <UniversalHeader projectId={projectId} />

        <div className="flex-1 flex overflow-hidden">
          
          {/* 3. SIDEBAR INTERNE (PROPRE À LA BIBLIOTHÈQUE) */}
          <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col shrink-0">
            <div className="p-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-8">
                {locale === 'fr' ? 'Base de Connaissances' : 'Knowledge Base'}
              </h2>
              <nav className="space-y-2">
                <LibraryNavlink 
                  href={`/${locale}/library?view=master`} // Utilisation du locale dynamique
                  icon={<BookOpen className="w-4 h-4" />} 
                  label={locale === 'fr' ? 'Référentiel Master' : 'Master Registry'} 
                  active={currentView === 'master'} 
                />
                <LibraryNavlink 
                  href="/library?view=io" 
                  icon={<Database className="w-4 h-4" />} 
                  label="Import / Export" 
                  active={currentView === 'io'} 
                />
                <LibraryNavlink 
                  href="/library?view=specs" 
                  icon={<ShieldCheck className="w-4 h-4" />} 
                  label={locale === 'fr' ? 'Modèles de Données' : 'Data Models'} 
                  active={currentView === 'specs'} 
                />
              </nav>
            </div>
            
            <div className="mt-auto p-8 border-t border-slate-100">
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-2">
                        {locale === 'fr' ? 'Domaine Actif' : 'Active Domain'}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        {/* CORRECTION : On utilise t() pour afficher l'objet I18nLabel */}
                        <span className="text-xs font-bold text-slate-700">{t(config.name, locale)}</span>
                    </div>
                </div>
            </div>
          </aside>

          {/* 4. ZONE DE TRAVAIL LIBRARY */}
          <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
            <div className="flex-1 overflow-hidden">
              {currentView === 'master' && (
                <div className="h-full flex flex-col">
                  <div className="px-10 pt-8 pb-4">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {locale === 'fr' ? 'Référentiel Master' : 'Master Registry'}
                    </h1>
                    <p className="text-slate-500 text-sm italic">
                        {locale === 'fr' ? 'Gérez les composants chimiques et matériels standards.' : 'Manage standard chemical and hardware components.'}
                    </p>
                  </div>
                  <div className="flex-1 px-10 pb-10 overflow-hidden">
                    <div className="h-full bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                      <LibraryManager 
                        allItems={allItems} 
                        domain={domainId} 
                        dynamicSchemas={dynamicSchemas} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentView === 'io' && <LibraryIOView domain={domainId} />}
              
              {currentView === 'specs' && <LibrarySpecsView domain={domainId} schemas={dynamicSchemas} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * Lien de navigation spécifique à la bibliothèque
 */
function LibraryNavlink({ href, icon, label, active = false }: any) {
  return (
    <Link 
      href={href} 
      className={clsx(
        "flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all group",
        active 
          ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50" 
          : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      <ChevronRight className={clsx("w-3 h-3 transition-transform", active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")} />
    </Link>
  );
}