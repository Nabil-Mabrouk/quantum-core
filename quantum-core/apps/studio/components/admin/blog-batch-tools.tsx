'use client';

import { useState, useRef } from "react";
import { Download, Upload, Loader2, FileArchive } from "lucide-react";
import { exportBlogToZipAction, importBlogFromZipAction } from "@/app/actions/admin-blog";

export function BlogBatchTools() {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // LOGIQUE EXPORT (Format QuantumH2O)
  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const base64 = await exportBlogToZipAction();
      const link = document.createElement("a");
      link.href = `data:application/zip;base64,${base64}`;
      link.download = `quantum_blog_backup_${new Date().toISOString().split('T')[0]}.zip`;
      link.click();
    } catch (e) {
      alert("Erreur lors de l'exportation");
    } finally {
      setIsProcessing(false);
    }
  };

  // LOGIQUE IMPORT (Format QuantumH2O corrigé)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const result = event.target?.result as string;
        const base64Content = result.split(',')[1];
        const res = await importBlogFromZipAction(base64Content);
        if (res.success) {
          alert("Importation réussie !");
          window.location.reload();
        } else {
          alert("Erreur: " + res.error);
        }
      } catch (e) {
        alert("Erreur lors de l'importation");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-purple-50 border border-purple-100 rounded-3xl mb-8 items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-purple-600 p-3 rounded-2xl shadow-lg shadow-purple-200">
            <FileArchive className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-black text-purple-900 uppercase tracking-widest">Gestion par lots (ZIP / Markdown)</p>
          <p className="text-xs text-purple-600 italic">Importez ou sauvegardez votre expertise technique.</p>
        </div>
      </div>
      
      <div className="flex gap-3 w-full md:w-auto">
        <button 
          onClick={handleExport} 
          disabled={isProcessing} 
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-purple-200 text-purple-600 rounded-xl text-xs font-bold hover:bg-purple-100 transition-all disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Exporter ZIP
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".zip" 
          onChange={handleFileUpload} 
        />
        <button 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isProcessing} 
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Importer ZIP
        </button>
      </div>
    </div>
  );
}