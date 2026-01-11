'use client';

import { Upload, Download, FileJson, FileText, Database } from 'lucide-react';
import { importLibraryAction, exportLibraryData } from '@/app/actions/library';

export function LibraryIOView({ domain }: { domain: string }) {
  
  // --- IMPORTATION ---
  const handleDataUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawContent = event.target?.result as string;
        const content = JSON.parse(rawContent);
        
        const res = await importLibraryAction(domain, content);
        
        if (res.success) {
            alert(`Succès : ${res.count} éléments importés.`);
            window.location.reload();
        } else {
            alert("Erreur : " + res.error);
        }
      } catch (err: any) { 
        alert("Fichier JSON invalide : " + err.message); 
      }
    };
    reader.readAsText(file);
  };

  // --- EXPORTATION AVEC FILTRES ---
  const handleExport = async (filterType: 'ALL' | 'CHEMISTRY' | 'HARDWARE') => {
    try {
      let categories: string[] | undefined = undefined;

      // Définition des catégories par famille
      if (filterType === 'CHEMISTRY') {
          categories = ['ION', 'REAGENT', 'COAGULANT'];
      } else if (filterType === 'HARDWARE') {
          categories = ['PUMP', 'TANK', 'SENSOR', 'SKID', 'VALVE', 'SPARE', 'EVAPORATOR', 'EQUIPMENT'];
      }

      // Appel serveur avec les filtres
      const data = await exportLibraryData(domain, categories);
      
      // Génération du nom de fichier
      const fileName = filterType === 'ALL' 
        ? `library_full_backup.json`
        : `library_${filterType.toLowerCase()}.json`;

      // Téléchargement
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      
    } catch (e) { 
      console.error(e);
      alert("Erreur lors de l'exportation des données."); 
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Import / Export</h2>
          <p className="text-slate-500">Outils de migration et d'alimentation de la base de connaissances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARTE IMPORT JSON */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 hover:border-blue-200 transition-all group flex flex-col">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileJson className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Importation JSON</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">
                Chargez un fichier complet (Chimie ou Équipements) pour mettre à jour la bibliothèque. Le système détecte automatiquement les catégories.
            </p>
            <label className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                <Upload className="w-4 h-4" /> Sélectionner Fichier
                <input type="file" className="hidden" accept=".json" onChange={handleDataUpload} />
            </label>
        </div>

        {/* CARTE EXPORT CIBLÉ */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 hover:border-emerald-200 transition-all group flex flex-col">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Exportation des Données</h3>
            <p className="text-sm text-slate-500 mb-6">
                Téléchargez vos données pour sauvegarde ou transfert.
            </p>
            
            <div className="space-y-3 mt-auto">
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleExport('CHEMISTRY')} 
                        className="py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-100 transition-all"
                    >
                        Chimie Seule
                    </button>
                    <button 
                        onClick={() => handleExport('HARDWARE')} 
                        className="py-2.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-[10px] font-bold uppercase hover:bg-blue-100 transition-all"
                    >
                        Matériel Seul
                    </button>
                </div>
                <button 
                    onClick={() => handleExport('ALL')} 
                    className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:border-slate-400 hover:text-slate-900 transition-all"
                >
                    <Download className="w-4 h-4" /> Sauvegarde Complète
                </button>
            </div>
        </div>

        {/* CARTE FUTURE IA (Placeholder) */}
        <div className="md:col-span-2 bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300 flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity cursor-not-allowed">
            <div className="w-12 h-12 bg-slate-200 text-slate-400 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-bold text-slate-700 text-lg">Extraction Intelligente (Bientôt)</h3>
                <p className="text-sm text-slate-500">
                    Uploadez un PDF (FDS, Datasheet) et laissez l'IA remplir la fiche technique automatiquement.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}