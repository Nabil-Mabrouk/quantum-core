'use client';

import { useState } from 'react';
import { Upload, Settings } from 'lucide-react';
import { DynamicIcon as Icon } from '@/components/ui/dynamic-icon'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { importLibraryAction } from '@/app/actions/library';
import { importCategorySchemas } from '@/app/actions/configuration';
import { ReferenceItemEditor } from './reference-item-editor'; 
import { getDomainConfig } from '@/lib/registry';
import { toast } from "sonner";

interface LibraryManagerProps {
  allItems: any[];
  domain: string;
  dynamicSchemas: Record<string, any[]>;
}

export function LibraryManager({ allItems, domain, dynamicSchemas }: LibraryManagerProps) {
  const config = getDomainConfig();
  const [activeTab, setActiveTab] = useState(config.libraries[0]?.id || 'units');

  // --- IMPORT DES DONNÉES (ITEMS) ---
  const handleDataUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // On enveloppe la lecture du fichier et l'action serveur dans une Promise
    // pour que Sonner puisse gérer les états (Loading / Success / Error)
    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = JSON.parse(event.target?.result as string);
          const res = await importLibraryAction(domain, content);
          
          if (res.success) {
            resolve(res.count);
          } else {
            reject(res.error);
          }
        } catch (err) { 
          reject("Fichier JSON invalide ou corrompu."); 
        }
      };

      reader.onerror = () => reject("Erreur de lecture du fichier.");
      reader.readAsText(file);
    });

    toast.promise(promise, {
      loading: 'Importation des données en cours...',
      success: (count) => {
        // On recharge la page pour afficher les nouvelles données
        window.location.reload();
        return `Succès : ${count} éléments importés.`;
      },
      error: (err) => `Erreur : ${err}`
    });
  };

  // --- IMPORT DE LA CONFIGURATION (SCHEMAS) ---
  const handleConfigUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = JSON.parse(event.target?.result as string);
          const res = await importCategorySchemas(domain, content);
          
          if (res.success) {
            resolve(res.count);
          } else {
            reject(res.error);
          }
        } catch (err) { 
          reject("Structure JSON de configuration invalide."); 
        }
      };

      reader.onerror = () => reject("Erreur de lecture du fichier.");
      reader.readAsText(file);
    });

    toast.promise(promise, {
      loading: 'Mise à jour des modèles de données...',
      success: (count) => {
        window.location.reload();
        return `Configuration mise à jour pour ${count} catégories.`;
      },
      error: (err) => `Erreur Config : ${err}`
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
      <div className="flex justify-between items-center p-6 border-b bg-white shrink-0">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          {config.libraries.map(lib => (
            <TabsTrigger key={lib.id} value={lib.id} className="flex gap-2 text-[10px] font-black uppercase tracking-widest">
              <Icon name={lib.iconName} className="w-3.5 h-3.5" /> {lib.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex items-center gap-2">
            {/* Bouton Import Config (Champs) */}
            <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase cursor-pointer hover:bg-slate-200 transition-all border border-slate-200">
                <Settings className="w-3.5 h-3.5" /> Config Fields
                {/* On vide la value onClick pour permettre de re-uploader le même fichier si besoin */}
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleConfigUpload}
                  onClick={(e) => (e.target as HTMLInputElement).value = ''} 
                />
            </label>

            {/* Bouton Import Data (Items) */}
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase cursor-pointer hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
                <Upload className="w-3.5 h-3.5" /> Importer Données
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleDataUpload}
                  onClick={(e) => (e.target as HTMLInputElement).value = ''}
                />
            </label>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-white">
        {config.libraries.map(lib => (
          <TabsContent key={lib.id} value={lib.id} className="h-full m-0 overflow-hidden outline-none">
            <ReferenceItemEditor 
              allItems={allItems}
              domain={domain}
              libraryLabel={lib.label}
              allowedCategories={lib.categories}
              enableComposition={lib.type === 'COMPOUND'}
              dynamicSchemas={dynamicSchemas}
            />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}