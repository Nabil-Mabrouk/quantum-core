import { db } from '@repo/database';
import { ProjectCard } from '@/components/dashboard/project-card';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
import { LayoutGrid, Search, Filter } from 'lucide-react';
import { CreateProjectModal } from '@/components/dashboard/create-project-modal';
import { auth } from "@/auth";
import { getDictionary, Locale } from '@/lib/i18n'; // Import de l'i18n

export default async function DashboardPage(props: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await props.params;
  const dict = getDictionary(locale as Locale);
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-bold">{dict.dashboard.unauthorized}</p>
      </div>
    );
  }

  // Récupération des projets liés à l'utilisateur
  const projects = await db.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: { systems: true }
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Barre latérale */}
      <SideNav />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (il détectera la locale via useParams en interne ou vous pouvez lui passer) */}
        <UniversalHeader projectId="" />

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8 lg:p-12">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* EN-TÊTE : Titre & Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                  {dict.dashboard.title}
                </h1>
                <p className="text-slate-500 mt-1 font-medium italic">
                  {dict.dashboard.subtitle}
                </p>
              </div>

              <CreateProjectModal />
            </div>

            {/* BARRE D'OUTILS */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm focus-within:shadow-md transition-all">
                <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                        className="w-full pl-11 pr-4 py-2 bg-transparent text-sm outline-none placeholder:text-slate-400 font-medium" 
                        placeholder={dict.dashboard.searchPlaceholder} 
                    />
                </div>
                <div className="h-6 w-px bg-slate-100" />
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                    <Filter className="w-4 h-4" /> {dict.dashboard.advancedFilters}
                </button>
            </div>

            {/* GRILLE DES ÉTUDES */}
            {projects.length === 0 ? (
                <div className="py-32 text-center border-4 border-dashed border-slate-200 rounded-[4rem] space-y-6 bg-white/30">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <LayoutGrid className="w-10 h-10 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-slate-900 font-black uppercase text-sm tracking-widest">
                          {dict.dashboard.emptyTitle}
                        </p>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto italic">
                          {dict.dashboard.emptyDesc}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
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