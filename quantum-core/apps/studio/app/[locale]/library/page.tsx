import { getLibrary } from '@/app/actions/library';
import { getDynamicSchemas } from '@/app/actions/configuration';
import { getDomainConfig, AVAILABLE_DOMAIN_IDS, isDomainValid } from '@/lib/registry';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
import { LibraryManager } from '@/components/library/library-manager';
import { LibrarySpecsView } from '@/components/library/views/library-specs-view';
import { LibraryIOView } from '@/components/library/views/library-io-view';
import { BookOpen, Database, ShieldCheck, ChevronRight, Layers } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { clsx } from 'clsx';
import { t, Locale } from '@/lib/i18n';

export default async function LibraryPage(props: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ view?: string, projectId?: string, domain?: string }> 
}) {
  // 1. Résolution des Promises (Next.js 15+)
  const { locale } = (await props.params) as { locale: Locale }; 
  const searchParams = await props.searchParams;
  
  const currentView = searchParams.view || 'master';
  const projectId = searchParams.projectId;
  
  // 2. GESTION DU DOMAINE DYNAMIQUE
  let domainId = searchParams.domain;

  // Validation : Si le domaine est absent ou invalide, on redirige vers le premier domaine du registre
  if (!domainId || !isDomainValid(domainId)) {
    const defaultDomain = AVAILABLE_DOMAIN_IDS[0];
    if (!defaultDomain) throw new Error("Aucun domaine configuré dans le registre.");
    
    // On conserve les autres paramètres (view, projectId) lors de la redirection
    const params = new URLSearchParams();
    if (currentView) params.set('view', currentView);
    if (projectId) params.set('projectId', projectId);
    params.set('domain', defaultDomain);
    
    redirect(`/${locale}/library?${params.toString()}`);
  }

  // 3. CHARGEMENT DES DONNÉES SPÉCIFIQUES AU DOMAINE
  const config = getDomainConfig(domainId);
  const allItems = await getLibrary(domainId);
  const dynamicSchemas = await getDynamicSchemas(domainId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* SIDEBAR GLOBALE */}
      <SideNav projectId={projectId} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER UNIFIÉ */}
        <UniversalHeader projectId={projectId} />

        <div className="flex-1 flex overflow-hidden">
          
          {/* SIDEBAR INTERNE (Bibliothèque) */}
          <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col shrink-0">
            <div className="p-8 space-y-8">
              
              {/* SECTION A : SÉLECTEUR DE DOMAINE (Le côté OS) */}
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                  {locale === 'fr' ? 'Domaine Métier' : 'Industrial Domain'}
                </h2>
                <div className="space-y-1">
                  {AVAILABLE_DOMAIN_IDS.map((id) => {
                    const domConfig = getDomainConfig(id);
                    const isActive = domainId === id;
                    return (
                      <Link
                        key={id}
                        href={`/${locale}/library?domain=${id}&view=${currentView}${projectId ? `&projectId=${projectId}` : ''}`}
                        className={clsx(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all",
                          isActive 
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <Layers className={clsx("w-3.5 h-3.5", isActive ? "text-blue-400" : "text-slate-300")} />
                        {t(domConfig.name, locale)}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B : NAVIGATION VUES */}
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4">
                  {locale === 'fr' ? 'Base de Connaissances' : 'Knowledge Base'}
                </h2>
                <nav className="space-y-1">
                  <LibraryNavlink 
                    href={`/${locale}/library?domain=${domainId}&view=master${projectId ? `&projectId=${projectId}` : ''}`}
                    icon={<BookOpen className="w-4 h-4" />} 
                    label={locale === 'fr' ? 'Référentiel Master' : 'Master Registry'} 
                    active={currentView === 'master'} 
                  />
                  <LibraryNavlink 
                    href={`/${locale}/library?domain=${domainId}&view=io${projectId ? `&projectId=${projectId}` : ''}`}
                    icon={<Database className="w-4 h-4" />} 
                    label="Import / Export" 
                    active={currentView === 'io'} 
                  />
                  <LibraryNavlink 
                    href={`/${locale}/library?domain=${domainId}&view=specs${projectId ? `&projectId=${projectId}` : ''}`}
                    icon={<ShieldCheck className="w-4 h-4" />} 
                    label={locale === 'fr' ? 'Modèles de Données' : 'Data Models'} 
                    active={currentView === 'specs'} 
                  />
                </nav>
              </div>
            </div>
            
            {/* INDICATEUR DE STATUT */}
            <div className="mt-auto p-8 border-t border-slate-100">
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase text-blue-400 mb-2">
                        {locale === 'fr' ? 'Mise à jour en direct' : 'Live Update'}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-600">
                            {domainId} Engine Active
                        </span>
                    </div>
                </div>
            </div>
          </aside>

          {/* ZONE DE TRAVAIL */}
          <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
            <div className="flex-1 overflow-hidden">
              {currentView === 'master' && (
                <div className="h-full flex flex-col">
                  <div className="px-10 pt-8 pb-4">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {t(config.name, locale)}
                    </h1>
                    <p className="text-slate-500 text-sm italic">
                        {locale === 'fr' 
                          ? `Gérez le catalogue d'équipements et la chimie du domaine ${domainId}.` 
                          : `Manage equipment catalog and chemistry for ${domainId}.`}
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