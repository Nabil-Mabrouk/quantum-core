'use client';

import { useState } from 'react';
import { Settings, Upload, Code } from 'lucide-react';
import { importCategorySchemas } from '@/app/actions/configuration';

export function LibrarySpecsView({ domain, schemas }: { domain: string, schemas: any }) {
  
  const handleConfigUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        const res = await importCategorySchemas(domain, content);
        if (res.success) {
            alert(`Configuration mise à jour !`);
            window.location.reload();
        } else {
            alert("Erreur : " + res.error);
        }
      } catch (err) { alert("JSON invalide"); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Spécifications</h2>
          <p className="text-slate-500">Configuration des modèles de données (Champs par catégorie).</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase cursor-pointer hover:bg-slate-700 transition-all">
            <Upload className="w-3.5 h-3.5" /> Importer Config JSON
            <input type="file" className="hidden" accept=".json" onChange={handleConfigUpload} />
        </label>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
            <Code className="w-4 h-4" /> Configuration Actuelle (Lecture Seule)
        </div>
        <pre className="text-[10px] font-mono bg-white p-4 rounded-xl border border-slate-200 overflow-auto max-h-[600px] text-slate-700">
            {JSON.stringify(schemas, null, 2)}
        </pre>
      </div>
    </div>
  );
}