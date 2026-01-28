'use client';

import { getDomainReport } from '@/lib/component-registry';
import { FileWarning, BarChart3, AlertTriangle } from 'lucide-react';
import { t } from '@/lib/i18n';
import { useCanvasStore } from '@/store/canvas-store'; // On va directement chercher les données ici

interface GenericReportViewerProps {
  domain: string;
  // 🚩 CHANGEMENT : Accepte l'objet de données complètes
  summaryData: any; 
}

export function GenericReportViewer({ domain, summaryData }: GenericReportViewerProps) {
  // 1. Résolution dynamique via le Registre
  const ReportComponent = getDomainReport(domain);
  
  // 2. Gestion du cas 'NO DATA'
  if (!summaryData) {
    return (
      <div className="flex flex-col items-center justify-center p-20 h-full">
        <BarChart3 className="w-12 h-12 mb-4 text-slate-300" />
        <p className="font-black text-sm uppercase tracking-widest text-slate-500 mb-2">
            {t({fr: "Lancez une simulation", en: "Run a simulation"}, 'fr')}
        </p>
        <p className="text-xs text-slate-400 italic">
            {t({fr: "Le rapport technique sera généré ici.", en: "The technical report will be generated here."}, 'fr')}
        </p>
      </div>
    );
  }

  // 3. Gestion du cas 'NO CONFIG' (Fallback de sécurité)
  if (!ReportComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-20 bg-red-50/50 border-2 border-dashed border-red-200 rounded-[2rem] text-red-700">
        <AlertTriangle className="w-12 h-12 mb-4 opacity-80" />
        <p className="font-bold text-sm uppercase tracking-widest">
          Erreur de Configuration
        </p>
        <p className="text-xs text-red-600 mt-2 text-center">
            Le domaine **{domain}** n'a pas de composant de rapport (`getDomainReport`) défini dans son registre.
        </p>
      </div>
    );
  }

  // 4. Rendu du rapport spécifique (On passe les données)
  // Le composant enfant (ex: ProcessReport) est responsable de l'affichage
  return <ReportComponent data={summaryData} />;
}