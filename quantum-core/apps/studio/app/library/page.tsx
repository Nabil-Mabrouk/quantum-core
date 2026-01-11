import { db } from '@repo/database';
import { getLibrary } from '../actions/library';
import { getDynamicSchemas } from '@/app/actions/configuration';
import { getDomainConfig } from '@/lib/registry';
import { Header } from '@/components/layout/header';
import Link from 'next/link'; // <--- IMPORT LINK
import { BookOpen, Database, ShieldCheck, Settings } from 'lucide-react';

// IMPORT DES VUES
import { LibraryManager } from '@/components/library/library-manager';
import { LibrarySpecsView } from '@/components/library/views/library-specs-view';
import { LibraryIOView } from '@/components/library/views/library-io-view';

export default async function LibraryPage(props: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await props.searchParams; // Récupère la vue active depuis l'URL
  const currentView = view || 'master';

  const config = getDomainConfig();
  const domainId = config.id;
  const project = await db.project.findFirst({ where: { domain: domainId } });
  const lines = project ? await db.line.findMany({ where: { projectId: project.id } }) : [];

  // Récupération des données selon la vue (Optimisation possible ici)
  const allItems = await getLibrary(domainId);
  const dynamicSchemas = await getDynamicSchemas(domainId);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900">
      
      <Header config={config} lines={lines} currentLineId={lines[0]?.id || ""} projectId={project?.id || ""} />

      <div className="flex-1 flex overflow-hidden bg-slate-50/50">
        
        {/* SIDEBAR DE NAVIGATION */}
        <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col shrink-0">
            <div className="p-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Plateforme</h2>
                <nav className="space-y-1">
                    <SidebarLink 
                        href="/library?view=master" 
                        icon={<BookOpen className="w-4 h-4" />} 
                        label="Référentiel Master" 
                        active={currentView === 'master'} 
                    />
                    <SidebarLink 
                        href="/library?view=io" 
                        icon={<Database className="w-4 h-4" />} 
                        label="Import / Export" 
                        active={currentView === 'io'} 
                    />
                    <SidebarLink 
                        href="/library?view=specs" 
                        icon={<ShieldCheck className="w-4 h-4" />} 
                        label="Spécifications" 
                        active={currentView === 'specs'} 
                    />
                    <SidebarLink 
                        href="/library?view=settings" 
                        icon={<Settings className="w-4 h-4" />} 
                        label="Préférences" 
                        active={currentView === 'settings'} 
                    />
                </nav>
            </div>
            
            {/* Footer système inchangé */}
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* ROUTING INTERNE */}
          <div className="flex-1 overflow-hidden">
            {currentView === 'master' && (
                <div className="h-full flex flex-col">
                    <div className="px-8 pt-6 pb-4">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Référentiel Master</h1>
                    </div>
                    <div className="flex-1 px-8 pb-8 overflow-hidden">
                        <div className="h-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
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

            {currentView === 'settings' && (
                <div className="p-20 text-center text-slate-400 italic">Paramètres globaux non implémentés.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false }: any) {
    return (
        <Link 
            href={href} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${active ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
        >
            {icon}
            {label}
        </Link>
    )
}