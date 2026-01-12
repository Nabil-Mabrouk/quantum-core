'use client';

import { BarChart3 } from 'lucide-react';
import { getDomainReport } from '@/lib/component-registry';
import { getDomainConfig } from '@/lib/registry';

interface SummaryViewProps {
  summaryData: any;
  domain?: string;
}

export function SummaryView({ summaryData, domain }: SummaryViewProps) {
  // 1. Résolution du Domaine : Prop > Config Active > Défaut
  const activeDomain = domain || getDomainConfig().id;
  
  // 2. Récupération dynamique du composant de rapport via le Registre
  const ReportComponent = getDomainReport(activeDomain);

  // 3. Affichage Conditionnel
  if (summaryData && ReportComponent) {
      return <ReportComponent />;
  }

  // 4. États vides / Fallback
  if (!summaryData) return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
        <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-bold uppercase text-xs tracking-widest">Lancez une analyse pour générer le bilan</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
        <p className="font-bold uppercase text-xs tracking-widest">
            Aucun modèle de rapport trouvé pour le domaine : {activeDomain}
        </p>
    </div>
  );
}