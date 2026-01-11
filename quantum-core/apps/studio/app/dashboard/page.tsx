import { db } from '@repo/database';
import { createProjectAction } from '@/app/actions/project';
import { ProjectCard } from '@/components/dashboard/project-card';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
import { Plus, LayoutGrid, Search, Filter } from 'lucide-react';

export default async function DashboardPage() {
  // Récupération de tous les projets
  const projects = await db.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { systems: true }
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* 1. SIDEBAR GLOBALE */}
      <SideNav />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 2. HEADER UNIFIÉ (Fil d'ariane simplifié pour le dashboard) */}
        <UniversalHeader />

        {/* 3. CONTENU PRINCIPAL SCROLLABLE */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8 lg:p-12">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Header de section & Nouveau Projet */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Mes Projets</h1>
                <p className="text-slate-500 mt-1 font-medium italic">Gérez vos jumeaux numériques industriels.</p>
              </div>

              <form action={createProjectAction} className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                <input 
                  name="name" 
                  placeholder="Nom du projet..." 
                  className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                  required
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-blue-500/20">
                  <Plus className="w-4 h-4" /> Créer
                </button>
              </form>
            </div>

            {/* Barre de recherche et filtres rapide */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input className="w-full pl-11 pr-4 py-2 bg-transparent text-sm outline-none" placeholder="Rechercher un projet par nom ou domaine..." />
                </div>
                <div className="h-6 w-px bg-slate-100" />
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                    <Filter className="w-4 h-4" /> Filtres
                </button>
            </div>

            {/* Grille de Projets */}
            {projects.length === 0 ? (
                <div className="py-20 text-center border-4 border-dashed border-slate-200 rounded-[3rem] space-y-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                        <LayoutGrid className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Aucun projet actif. Commencez par en créer un ci-dessus.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}