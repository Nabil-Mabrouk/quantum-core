'use client';

import { useState } from 'react';
import { Trash2, Edit3, Folder, Check, X } from 'lucide-react';
import { deleteProjectAction, renameProjectAction } from '@/app/actions/project';
import Link from 'next/link';
import { toast } from "sonner";
import { useConfirm } from "@/components/providers/confirm-provider"; // Assurez-vous que ce chemin est correct

export function ProjectCard({ project }: { project: any }) {
  const { confirm } = useConfirm();
  
  // États pour l'édition en ligne (remplace le prompt)
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState(project.name);

  // --- ACTION : SUPPRESSION ---
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche d'entrer dans le projet
    e.stopPropagation();

    const isConfirmed = await confirm({
      title: "Supprimer le projet ?",
      description: `Êtes-vous sûr de vouloir supprimer "${project.name}" ? Cette action effacera tous les systèmes et historiques associés.`,
      confirmText: "Supprimer définitivement",
      variant: "danger"
    });

    if (isConfirmed) {
      toast.promise(deleteProjectAction(project.id), {
        loading: 'Suppression en cours...',
        success: 'Projet supprimé',
        error: 'Erreur lors de la suppression'
      });
    }
  };

  // --- ACTION : DÉMARRER LE RENOMMAGE ---
  const startRenaming = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRenaming(true);
    // Petit hack pour focus l'input au prochain render (si besoin)
  };

  // --- ACTION : SAUVEGARDER LE NOM ---
  const saveRename = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!tempName.trim() || tempName === project.name) {
      setIsRenaming(false);
      return;
    }

    toast.promise(renameProjectAction(project.id, tempName), {
      loading: 'Renommage...',
      success: () => {
        setIsRenaming(false);
        return 'Projet renommé';
      },
      error: 'Erreur lors du renommage'
    });
  };

  // --- ACTION : ANNULER LE RENOMMAGE ---
  const cancelRename = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTempName(project.name);
    setIsRenaming(false);
  };

  return (
    <div className="group bg-white border border-slate-200 p-6 rounded-[2.5rem] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all relative overflow-hidden flex flex-col h-full">
      
      {/* On utilise un div clickable ou un Link selon l'état */}
      {/* Si on renomme, on désactive le lien global pour éviter les clics accidentels */}
      <Link href={isRenaming ? '#' : `/project/${project.id}`} className={`block h-full ${isRenaming ? 'cursor-default' : ''}`}>
        
        {/* HEADER CARTE */}
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
            <Folder className="w-6 h-6" />
          </div>
          
          {/* BOUTONS ACTIONS (Cachés pendant le renommage) */}
          {!isRenaming && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={startRenaming} 
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
                title="Renommer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={handleDelete} 
                className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* TITRE / INPUT D'ÉDITION */}
        <div className="mb-2 min-h-[40px] flex items-center">
          {isRenaming ? (
            <div className="flex items-center gap-2 w-full animate-in fade-in zoom-in-95 duration-200">
              <input 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onClick={(e) => e.preventDefault()} // Empêche le Link de s'activer
                className="w-full bg-slate-50 border border-blue-300 rounded-lg px-2 py-1 text-xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                autoFocus
              />
              <button onClick={saveRename} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={cancelRename} className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h3 className="font-black text-xl text-slate-900 leading-tight truncate">
              {project.name}
            </h3>
          )}
        </div>

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {project.domain === 'WATER' ? 'Traitement Eaux' : 'Énergie'}
        </p>

      </Link>
    </div>
  );
}