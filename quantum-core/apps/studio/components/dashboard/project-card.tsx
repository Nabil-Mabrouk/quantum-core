'use client';

import { Trash2, Edit3, Share2, Folder } from 'lucide-react';
import { deleteProjectAction, renameProjectAction } from '@/app/actions/project';
import Link from 'next/link';

export function ProjectCard({ project }: { project: any }) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation vers l'éditeur
    if (confirm(`Supprimer le projet "${project.name}" ?`)) {
      await deleteProjectAction(project.id);
    }
  };

  const handleRename = async (e: React.MouseEvent) => {
    e.preventDefault();
    const newName = prompt("Nouveau nom du projet :", project.name);
    if (newName) await renameProjectAction(project.id, newName);
  };

  return (
    <div className="group bg-white border border-slate-200 p-6 rounded-[2.5rem] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all relative overflow-hidden">
      <Link href={`/editor/${project.id}`} className="block h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
            <Folder className="w-6 h-6" />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleRename} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900"><Edit3 className="w-4 h-4" /></button>
            <button onClick={handleDelete} className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        <h3 className="font-black text-xl text-slate-900 mb-2 leading-tight">{project.name}</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{project.domain}</p>
      </Link>
    </div>
  );
}
