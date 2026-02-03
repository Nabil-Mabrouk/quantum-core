'use client';

import { useCanvasStore } from "@/store/canvas-store";
import { 
  Download, AlertCircle, ArrowUpRight, ArrowDownRight, 
  Droplets, ArrowLeft, Beaker, Wind,
  Activity, Zap, CheckCircle2, AlertTriangle, BarChart3,
  FlaskConical, TrendingUp, Database, GitBranch
} from "lucide-react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useMemo, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = {
  blue: '#3b82f6',
  indigo: '#6366f1',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  slate: '#64748b'
};

const HOURS_PER_YEAR = 8 * 5 * 47; 

const MetricCard = ({ 
  title, value, unit, icon: Icon, trend, color = 'blue', subtitle 
}: { 
  title: string; 
  value: string | number; 
  unit: string; 
  icon: any; 
  trend?: { value: number; isPositive: boolean };
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo';
  subtitle?: string;
}) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={cn("absolute top-0 right-0 p-3 rounded-bl-2xl border-l border-b", colorStyles[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
          <span className="text-sm font-medium text-slate-400">{unit}</span>
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, icon: Icon, action }: { title: string; icon: any; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-100 rounded-xl">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    </div>
    {action}
  </div>
);

const StatusBadge = ({ status, count }: { status: 'success' | 'warning' | 'error'; count?: number }) => {
  const configs = {
    success: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, label: 'Simulation réussie' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle, label: `${count} avertissement${count && count > 1 ? 's' : ''}` },
    error: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: AlertCircle, label: 'Erreur critique' }
  };
  const config = configs[status];
  const Icon = config.icon;
  return (
    <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium", config.bg, config.text, config.border)}>
      <Icon className="w-4 h-4" />
      {config.label}
    </div>
  );
};

function convertIonMassToCommercialProduct(ionName: string, massPerHour_g: number) {
  const GRAMS_ION_PER_LITER_COMMERCIAL = 200; 
  const litersPerHour = massPerHour_g / GRAMS_ION_PER_LITER_COMMERCIAL;
  const litersPerYear = litersPerHour * HOURS_PER_YEAR; 
  const commercialProductName = ionName.startsWith('Na') ? 'Soude Caustique 50%' : ionName.startsWith('H+') ? 'Acide Sulfurique 98%' : 'Produit Inconnu';
  return { name: commercialProductName, litersPerYear, litersPerMonth: litersPerYear / 12 };
}

export function ProcessReport() {
  const { summaryData, nodes, setViewMode } = useCanvasStore();
  const [selectedBath, setSelectedBath] = useState<string | null>(null);

  const report = useMemo(() => {
    if (!summaryData || !summaryData.node_details) return null;
    const details = summaryData.node_details;
    const globalKpis = summaryData.global_kpis; 
    const ionsSet = new Set<string>();
    Object.values(details).forEach((res: any) => {
      Object.keys(res.concentrations || {}).forEach(ion => ionsSet.add(ion));
    });
    const allIons = Array.from(ionsSet).sort();
    let totalWaterMakeup = 0;   
    let totalEvaporation = 0;   
    let totalChemLoss = 0;

    const hydraulicData = nodes
      .filter(n => n.type === 'PROCESS_BATH' || n.type === 'RINSE_TANK')
      .map(node => {
        const res = details[node.id];
        if (!res) return null;
        totalWaterMakeup += res.hydraulics?.in || 0; 
        totalEvaporation += res.hydraulics?.evap || 0; 
        return {
          id: node.id,
          name: node.data?.label || node.id,
          in: res.hydraulics?.in || 0,
          out: res.hydraulics?.out || 0,
          evap: res.hydraulics?.evap || 0,
          dump: res.hydraulics?.dump || 0,
          balance: (res.hydraulics?.in || 0) - (res.hydraulics?.out || 0),
          type: node.type
        };
      }).filter(Boolean);

    // Séparation des nœuds pour la cartographie
    const tankNodes = nodes.filter(n => n.type === 'PROCESS_BATH' || n.type === 'RINSE_TANK');
    const networkNodes = nodes.filter(n => n.type === 'SOURCE' || n.type === 'DRAIN');

    const bathMaintenance = nodes
      .filter(n => n.type === 'PROCESS_BATH')
      .map(node => {
        const res = details[node.id];
        if (!res) return null;
        const commercialNeeds = Object.entries(res.chemical_additions || {})
          .map(([ion, val]: [string, any]) => {
            if (val > 0.001) return { ion, massPerHour: val, ...convertIonMassToCommercialProduct(ion, val) };
            return null;
          }).filter(Boolean);
        totalChemLoss += commercialNeeds.reduce((sum, need) => sum + (need?.litersPerYear || 0), 0);
        return {
          id: node.id,
          name: node.data?.label || node.id,
          evap: res.hydraulics?.evap || 0,
          makeup: res.hydraulics?.in || 0,
          targets: res.target_concentrations || {},
          actuals: res.concentrations || {},
          additions: res.chemical_additions || {},
          commercialNeeds
        };
      }).filter(Boolean);

    const drainLines = nodes
      .filter(n => n.type === 'DRAIN')
      .map(node => ({
        name: node.data?.label || node.id,
        flow: details[node.id]?.hydraulics?.in || 0,
        concentrations: details[node.id]?.concentrations || {},
        networkType: node.properties?.networkType || 'STANDARD'
      }))
      .filter(d => d.flow > 0);

    return {
      status: summaryData.warnings?.length > 0 ? 'warning' : 'success',
      allIons,
      totalWaterMakeup,
      totalEvaporation,
      totalChemLoss,
      hydraulicData,
      tankNodes,
      networkNodes,
      bathMaintenance,
      drainLines,
      warnings: summaryData.warnings || [],
      warningsCount: globalKpis?.warnings_count || summaryData.warnings?.length || 0
    };
  }, [summaryData, nodes]);

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-200 rounded-2xl mx-auto flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Aucune simulation</h3>
          <button onClick={() => setViewMode('GRAPH')} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
            Retour à l'éditeur
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setViewMode('GRAPH')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Rapport de Simulation</h1>
                <p className="text-sm text-slate-500">Traitement de Surface • Bilan de masse détaillé</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={report.status} count={report.warningsCount} />
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-sm">
                <Download className="w-4 h-4" /> Exporter PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Consommation Eau" value={report.totalWaterMakeup.toFixed(0)} unit="L/h" icon={Droplets} color="blue" subtitle="Débit maximal de production" />
          <MetricCard title="Évaporation Totale" value={report.totalEvaporation.toFixed(1)} unit="L/h" icon={Wind} color="indigo" />
          <MetricCard title="Produits Chimiques" value={report.totalChemLoss.toFixed(0)} unit="L/an" icon={FlaskConical} color="amber" />
          <MetricCard title="Bilans Vérifiés" value={report.hydraulicData.length} unit="nœuds" icon={CheckCircle2} color="emerald" />
        </div>

        {/* Alertes */}
        {report.warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Points d'attention ({report.warnings.length})</h3>
                <ul className="space-y-2">
                  {report.warnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 1: CARTOGRAPHIE DES CUVES (Tanks) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <SectionHeader 
            title="Cartographie des Cuves" 
            icon={Database}
            action={
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-purple-500" /> Bains
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-blue-400" /> Rinçages
                </span>
              </div>
            }
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {report.tankNodes.map((node) => {
              const nodeResult = summaryData?.node_details?.[node.id];
              if (!nodeResult) return null;
              const concentrations = nodeResult.concentrations || {};
              const targets = nodeResult.target_concentrations || {};
              const isProcess = node.type === 'PROCESS_BATH';
              
              return (
                <div key={node.id} className={cn(
                  "rounded-xl border p-4 transition-all hover:shadow-md",
                  isProcess ? "border-purple-200 bg-purple-50/20" : "border-blue-200 bg-blue-50/20"
                )}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isProcess ? <Beaker className="w-4 h-4 text-purple-600" /> : <Droplets className="w-4 h-4 text-blue-500" />}
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{node.data?.label || node.id}</h4>
                        <span className={cn("text-[10px] uppercase font-medium px-1.5 py-0.5 rounded mt-1 inline-block", 
                          isProcess ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")}>
                          {isProcess ? "Bain Actif" : "Rinçage"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {Object.keys(concentrations).length === 0 && Object.keys(targets).length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Eau pure</p>
                    ) : (
                      <div className="space-y-1.5">
                        {isProcess && Object.entries(targets).map(([ion, target]) => {
                          const actual = concentrations[ion] || 0;
                          const isMatch = Math.abs(actual - (target as number)) < 0.01;
                          return (
                            <div key={ion} className="flex items-center justify-between text-sm">
                              <span className="font-mono text-slate-600 text-xs">{ion}</span>
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col items-end">
                                  <span className="text-[10px] text-slate-400">cible</span>
                                  <span className="font-mono font-medium text-slate-400">{(target as number).toFixed(2)}</span>
                                </div>
                                <div className="w-8 h-px bg-slate-200" />
                                <div className="flex flex-col items-end">
                                  <span className="text-[10px] text-slate-400">réel</span>
                                  <span className={cn("font-mono font-bold", isMatch ? "text-emerald-600" : "text-amber-600")}>
                                    {actual.toFixed(2)}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 w-6">g/L</span>
                              </div>
                            </div>
                          );
                        })}
                        
                        {!isProcess && Object.entries(concentrations).map(([ion, value]) => (
                          <div key={ion} className="flex items-center justify-between text-sm py-1 border-b border-slate-100/50 last:border-0">
                            <span className="font-mono text-slate-600 text-xs">{ion}</span>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full", (value as number) > 1 ? "bg-rose-400" : (value as number) > 0.1 ? "bg-amber-400" : "bg-emerald-400")}
                                  style={{ width: `${Math.min(100, (value as number) * 10)}%` }} />
                              </div>
                              <span className="font-mono font-medium text-slate-700 w-10 text-right">{(value as number).toFixed(3)}</span>
                              <span className="text-[10px] text-slate-400">g/L</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> {nodeResult.hydraulics?.in?.toFixed(1) || 0} L/h</span>
                    <span className="flex items-center gap-1"><ArrowDownRight className="w-3 h-3" /> {nodeResult.hydraulics?.out?.toFixed(1) || 0} L/h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: CARTOGRAPHIE DES RÉSEAUX (Sources & Drains) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <SectionHeader 
            title="Cartographie des Réseaux" 
            icon={GitBranch}
            action={
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Sources
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-rose-500" /> Rejets
                </span>
              </div>
            }
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne Sources */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" /> Entrées (Sources)
              </h4>
              {report.networkNodes.filter(n => n.type === 'SOURCE').map((node) => {
                const nodeResult = summaryData?.node_details?.[node.id];
                if (!nodeResult) return null;
                return (
                  <div key={node.id} className="flex items-center justify-between p-4 bg-emerald-50/30 border border-emerald-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900">{node.data?.label || node.id}</h5>
                        <p className="text-xs text-slate-500">Qualité: {node.properties?.waterType || 'Standard'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-700">{nodeResult.hydraulics?.out?.toFixed(1) || 0} <span className="text-sm font-normal text-emerald-600">L/h</span></p>
                      <p className="text-xs text-emerald-600/70">Débit fourni</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Colonne Rejets */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500" /> Sorties (Drains)
              </h4>
              {report.drainLines.map((drain, idx) => (
                <div key={idx} className="group p-4 bg-rose-50/30 border border-rose-100 rounded-xl hover:border-rose-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900">{drain.name}</h5>
                        <p className="text-xs text-slate-500">Réseau {drain.networkType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-rose-700">{drain.flow.toFixed(1)} <span className="text-sm font-normal text-rose-600">L/h</span></p>
                    </div>
                  </div>
                  
                  {/* Composition des rejets si ions présents */}
                  {report.allIons.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-rose-100 grid grid-cols-3 gap-2">
                      {report.allIons.map(ion => {
                        const conc = (drain.concentrations[ion] || 0) * 1000;
                        if (conc < 0.01) return null;
                        return (
                          <div key={ion} className="text-xs">
                            <span className="text-slate-400 block">{ion}</span>
                            <span className={cn("font-mono font-bold", conc > 50 ? "text-rose-600" : "text-slate-700")}>
                              {conc.toFixed(1)} <span className="text-[10px] font-normal">mg/L</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION BAINS - Cards interactives */}


{/* MAINTENANCE CHIMIQUE - Vue détaillée */}
<section className="space-y-6">
  <SectionHeader 
    title="Stratégie d'Apport Chimique" 
    icon={FlaskConical}
    action={
      <span className="text-xs text-slate-500">
        {report.bathMaintenance.reduce((acc, b) => acc + b.commercialNeeds.length, 0)} produits à ajouter
      </span>
    }
  />
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {report.bathMaintenance.map((bath) => (
      <div 
        key={bath.id}
        className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        {/* Header avec gradient subtil */}
        <div className="bg-gradient-to-r from-purple-50 to-white border-b border-purple-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                {bath.name}
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Maintenance continue • Volume utile ?
              </p>
            </div>
            <div className="p-2 bg-white rounded-xl shadow-sm border border-purple-100">
              <Beaker className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          
          {/* Métriques rapides */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-purple-100/50">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Appoint eau</p>
              <p className="text-lg font-bold text-blue-600">{bath.makeup.toFixed(0)} <span className="text-sm font-normal text-slate-400">L/h</span></p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Évaporation</p>
              <p className="text-lg font-bold text-amber-600">{bath.evap.toFixed(1)} <span className="text-sm font-normal text-slate-400">L/h</span></p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Pertes</p>
              <p className="text-lg font-bold text-rose-600">{(bath.makeup - bath.evap).toFixed(1)} <span className="text-sm font-normal text-slate-400">L/h</span></p>
            </div>
          </div>
        </div>

        {/* Liste des besoins */}
        <div className="p-6 space-y-4">
          {bath.commercialNeeds.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-emerald-900">Équilibre stable</p>
                <p className="text-sm text-emerald-700/70">Aucun ajout chimique requis sous ces conditions</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Produits commerciaux requis
              </p>
              
              {bath.commercialNeeds.map((need: any, idx: number) => (
                <div 
                  key={need.ion} 
                  className="relative flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{need.name}</p>
                      <p className="text-xs text-slate-500">Compense les pertes en <span className="font-mono text-purple-600">{need.ion}</span></p>
                      <p className="text-xs text-slate-400 mt-1">
                        {(need.massPerHour * 1000).toFixed(2)} g/h ionique
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {need.litersPerMonth.toFixed(1)}
                      <span className="text-sm font-medium text-slate-500 ml-1">L/mois</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      soit {need.litersPerYear.toFixed(0)} L/an
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Total */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="text-slate-500">Volume total annuel</span>
                <span className="font-bold text-slate-900">
                  {bath.commercialNeeds.reduce((acc: number, n: any) => acc + n.litersPerYear, 0).toFixed(0)} L
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    ))}
  </div>
</section>

        {/* SECTION REJETS */}
        {report.drainLines.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionHeader title="Matrice des Rejets" icon={Activity} />
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left font-semibold text-slate-700 p-4">Réseau</th>
                    <th className="text-right font-semibold text-slate-700 p-4">Débit (L/h)</th>
                    {report.allIons.map(ion => (
                      <th key={ion} className="text-right font-semibold text-slate-500 p-4 text-xs">
                        {ion}
                        <span className="block text-slate-400 font-normal">mg/L</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.drainLines.map((drain, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-4 font-medium text-slate-900">{drain.name}</td>
                      <td className="p-4 text-right font-mono font-medium text-blue-600">
                        {drain.flow.toFixed(1)}
                      </td>
                      {report.allIons.map(ion => {
                        const conc = (drain.concentrations[ion] || 0) * 1000;
                        return (
                          <td key={ion} className={cn(
                            "p-4 text-right font-mono text-xs",
                            conc > 50 ? "text-rose-600 font-bold" : "text-slate-600"
                          )}>
                            {conc > 0.01 ? conc.toFixed(1) : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        
        {/* Footer */}
        <div className="flex items-center gap-4 justify-center pt-8 border-t border-slate-200">
          <button onClick={() => setViewMode('GRAPH')} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" /> Retour à l'éditeur
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-sm">
            <Download className="w-4 h-4" /> Télécharger le rapport
          </button>
        </div>
      </main>
    </div>
  );
}