'use client';

import { BarChart3 } from 'lucide-react';
import { getDomainConfig } from '@/lib/registry';
import { useCanvasStore } from '@/store/canvas-store'; // 🚩 Import du store pour la réactivité
import { GenericReportViewer } from './generic-report-viewer'; // 🚩 Import de la coque générique

interface SummaryViewProps {
  // Supprimer summaryData ici pour utiliser le store (meilleure réactivité)
  domain: string; 
}

export function SummaryView({ domain }: SummaryViewProps) {
  // 1. Récupération des données du Store (Zustand)
  const summaryData = useCanvasStore((state) => state.summaryData);
  
  // 2. Résolution du Domaine : Prop > Config Active > Défaut (Le code d'origine est trop complexe)
  // On utilise la prop `domain` passée par le Workspace, qui vient du Project.
  const activeDomain = domain || getDomainConfig().id;

  // 3. Affichage Conditionnel
  // On délègue tout le travail de vérification et de rendu au GenericReportViewer
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
        {/* On passe le Domain et les Données brutes de simulation */}
        <GenericReportViewer domain={activeDomain} summaryData={summaryData} />
    </div>
  );
}