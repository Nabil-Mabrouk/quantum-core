// apps/studio/app/library/page.tsx

import { db } from '@repo/database';
import { getLibrary } from '../actions/library';
import { getDomainConfig } from '@/lib/registry';
import { LibraryManager } from '@/components/library/library-manager';
import { Header } from '@/components/layout/header';
import { BookOpen, Database, ShieldCheck, Settings } from 'lucide-react';

export default async function LibraryPage() {
  const config = getDomainConfig();
  const domainId = config.id;
  const { baseUnits, referenceItems } = await getLibrary(domainId);
  
  const project = await db.project.findFirst({ where: { domain: domainId } });
  const lines = project ? await db.line.findMany({ where: { projectId: project.id } }) : [];

  // On extrait le vocabulaire ou on met des fallbacks génériques
  const v = config.vocabulary || {
    libraryTitle: "Bibliothèque de Référence",
    baseUnitName: "Unités de base",
    referenceItemName: "Articles de référence"
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900">
      
      <Header 
        config={config} 
        lines={lines} 
        currentLineId={lines[0]?.id || ""} 
      />

      <div className="flex-1 flex overflow-hidden bg-slate-50/50">
        
        {/* SIDEBAR : Vocabulaire générique */}
        <aside className="w-64 border-r border-slate-200 bg-white hidden lg:flex flex-col shrink-0">
            <div className="p-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Plateforme</h2>
                <nav className="space-y-1">
                    <SidebarLink icon={<BookOpen className="w-4 h-4" />} label="Référentiel Master" active />
                    <SidebarLink icon={<Database className="w-4 h-4" />} label="Import / Export" />
                    <SidebarLink icon={<ShieldCheck className="w-4 h-4" />} label="Spécifications" />
                    <SidebarLink icon={<Settings className="w-4 h-4" />} label="Préférences" />
                </nav>
            </div>
            
            <div className="mt-auto p-6 border-t border-slate-100">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Système</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-600">Core Engine Online</span>
                    </div>
                </div>
            </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* HEADER DE PAGE : Dynamique via Manifeste */}
          <div className="px-8 pt-6 pb-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  <span>{config.name}</span>
                  <span>/</span>
                  <span className="text-blue-600">Library</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {v.libraryTitle}
              </h1>
          </div>

          {/* MANAGER : On lui passe le vocabulaire pour qu'il sache comment nommer ses onglets */}
          <div className="flex-1 overflow-hidden px-8 pb-8">
            <div className="h-full bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <LibraryManager 
                    baseUnits={baseUnits} 
                    referenceItems={referenceItems} 
                    domain={domainId}
                    vocabulary={v} // <--- INJECTION DU VOCABULAIRE
                />
            </div>
          </div>
        </main>
      </div>

      <div className="fixed bottom-4 left-72 z-50 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full" />
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
             {v.referenceItemName} <span className="text-slate-300 mx-2">|</span> {referenceItems.length} entrées
          </p>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${active ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
            {icon}
            {label}
        </div>
    )
}