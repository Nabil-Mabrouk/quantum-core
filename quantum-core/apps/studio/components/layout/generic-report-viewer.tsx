'use client';

import { getDomainReport } from '@/lib/component-registry';
import { FileWarning } from 'lucide-react';

interface GenericReportViewerProps {
  domain: string;
}

export function GenericReportViewer({ domain }: GenericReportViewerProps) {
  // 1. Résolution dynamique via le Registre
  const ReportComponent = getDomainReport(domain);

  // 2. Gestion du cas où le domaine n'a pas de rapport défini
  if (!ReportComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <FileWarning className="w-12 h-12 mb-4 opacity-50" />
        <p className="font-bold text-sm uppercase tracking-widest">
          Aucun rapport configuré pour le domaine : {domain}
        </p>
      </div>
    );
  }

  // 3. Rendu du rapport spécifique (ex: ProcessReport)
  return <ReportComponent />;
}