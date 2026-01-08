import { db } from '@repo/database';
import Link from 'next/link';
import { Plus, Folder, Calendar } from 'lucide-react';
import { createProjectAction } from '@/app/actions/project';

export default async function DashboardPage() {
  // TODO: Filtrer par userId quand l'auth sera là
  const projects = await db.project.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes Projets</h1>
          <p className="text-slate-500 italic">Gérez vos sites industriels et vos simulations.</p>
        </div>
        
        {/* Formulaire simple pour nouveau projet */}
        <form action={createProjectAction} className="flex gap-2">
          <input 
            name="name" 
            placeholder="Nom du nouveau projet..." 
            className="border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <Plus className="w-4 h-4" /> Nouveau Projet
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link href={`/editor/${project.id}`} key={project.id}>
            <div className="group bg-white border border-slate-200 p-6 rounded-3xl hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                  <Folder className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{project.domain}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-8 group-hover:text-blue-900">{project.name}</h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                <Calendar className="w-3 h-3" />
                Dernière modification : {project.updatedAt.toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}