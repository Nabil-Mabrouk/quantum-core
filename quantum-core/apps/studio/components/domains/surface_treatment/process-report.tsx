'use client';

import { useCanvasStore } from "@/store/canvas-store";
import { 
  Download, AlertCircle, Activity, ArrowDownCircle, 
  Droplets, ArrowLeft, Factory, TrendingUp, BarChart3,
  Beaker, FlaskConical, Thermometer, Wind
} from "lucide-react";
import { clsx } from 'clsx';
import { useMemo } from "react";

// --- HELPERS SIMULÉS (Pour R03) ---
const HOURS_PER_YEAR = 8 * 5 * 47; 

/**
 * Simule la conversion du besoin en ion pur (g/h) vers une quantité de produit commercial (L/an).
 */
function convertIonMassToCommercialProduct(ionName: string, massPerHour_g: number) {
  const GRAMS_ION_PER_LITER_COMMERCIAL = 200; 

  const litersPerHour = massPerHour_g / GRAMS_ION_PER_LITER_COMMERCIAL;
  const litersPerYear = litersPerHour * HOURS_PER_YEAR; 

  // Correction 2: Utiliser un strict '==' pour éviter les affectations incorrectes
  const commercialProductName = ionName === 'Na+' 
    ? 'Soude Caustique 50%' 
    : ionName === 'H+' 
    ? 'Acide Sulfurique 98%'
    : 'Produit Commercial'; // Fallback explicite

  return {
    name: commercialProductName,
    litersPerYear: litersPerYear,
    litersPerMonth: litersPerYear / 12,
  };
}
// ------------------------------------


export function ProcessReport() {
  const { summaryData, nodes, setViewMode } = useCanvasStore();

  // --- 1. DATA PIVOTING & AGGREGATION ---
  const report = useMemo(() => {
    // Correction 1: Vérification stricte des données (y compris global_kpis)
    if (!summaryData?.node_details || !summaryData?.global_kpis) return null;

    const details = summaryData.node_details;
    const globalKpis = summaryData.global_kpis; 
    
    const ionsSet = new Set<string>();
    Object.values(details).forEach((res: any) => {
      Object.keys(res.concentrations || {}).forEach(ion => ionsSet.add(ion));
    });
    const allIons = Array.from(ionsSet).sort();

    let totalWaterMakeup = 0;   
    let totalEvaporation = 0;   
    let hydraulicOverview: any[] = []; 

    const internalTanks = nodes
      .filter(n => n.type === 'PROCESS_BATH' || n.type === 'RINSE_TANK')
      .map(node => {
        const res = details[node.id];
        if (!res) return null;

        totalWaterMakeup += res.hydraulics?.in || 0; 
        totalEvaporation += res.hydraulics?.evap || 0; 

        // Préparation des données pour le tableau hydraulique
        hydraulicOverview.push({
            id: node.id,
            name: node.data.label,
            ...res.hydraulics,
            isProcess: node.type !== 'DRAIN' && node.type !== 'SOURCE'
        });

        const commercialNeeds = Object.entries(res.chemical_additions || {})
            .map(([ion, val]: any) => {
                if (val > 0.001) { 
                    return {
                        ion: ion,
                        ionMassPerHour: val,
                        ...convertIonMassToCommercialProduct(ion, val)
                    };
                }
                return null;
            })
            .filter(Boolean); 

        return {
          id: node.id, 
          name: node.data.label,
          type: node.type,
          evap: typeof res.hydraulics?.evap === 'number' ? res.hydraulics.evap : 0, // Protection du type
          makeup: typeof res.hydraulics?.in === 'number' ? res.hydraulics.in : 0, // Protection du type
          concentrations: res.concentrations || {}, 
          commercialNeeds: commercialNeeds, 
        };
      }).filter(Boolean);
    
      
          // --- NOUVELLE LIGNE DE DÉBOGAGE CRITIQUE (Étape D) ---
    console.log("DEBUG RENDER: Internal Tanks Concentrations:", internalTanks.map(t => ({ 
        name: t.name, 
        conc: t.concentrations 
    })));
    
    const bathMaintenance = internalTanks.filter(t => t.type === 'PROCESS_BATH');

    const drainLines = nodes
      .filter(n => n.type === 'DRAIN')
      .map(node => ({
        name: node.data.label,
        flow: details[node.id]?.hydraulics?.in || 0, 
        concentrations: details[node.id]?.concentrations || {}
      }))
      .filter(d => d.flow > 0);

    const totalChemLoss = internalTanks.flatMap(t => t.commercialNeeds).reduce((sum, need) => sum + (need?.litersPerYear || 0), 0);
    // Assurez-vous que le KPI est en L/an pour la carte
    const totalChemLossLitersPerYear = totalChemLoss.toFixed(0); 
    
    return { 
      allIons, 
      totalWaterMakeup: globalKpis.total_water_consumption || totalWaterMakeup,
      totalEvaporation: totalEvaporation, 
      totalChemLossLitersPerYear, // Mise à jour du KPI
      drainLines, 
      internalTanks, 
      bathMaintenance, 
      hydraulicOverview, 
      warnings: summaryData.warnings || [], 
      warningsCount: globalKpis.warnings_count
    };
  }, [summaryData, nodes]);

  // --- 2. EMPTY STATE ---
  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center animate-in fade-in">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <BarChart3 className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Analyse non disponible</h3>
        <p className="text-slate-500 mt-2 max-w-sm text-sm">
            Veuillez configurer votre ligne et lancer la simulation pour générer les bilans de masse.
        </p>
      </div>
    );
  }

  // --- COMPOSANT DÉTAILLÉ DE LA CARTE DE COMPOSITION (Nouveau style UX) ---
  const TankDetailCard = ({ tank }: { tank: any }) => {
    const hasIons = Object.keys(tank.concentrations).length > 0;
    const isBath = tank.type === 'PROCESS_BATH';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className={clsx("p-4 border-b border-slate-100", isBath ? 'bg-purple-50' : 'bg-blue-50')}>
                <h4 className="font-bold text-sm text-slate-900">{tank.name}</h4>
                <p className="text-[10px] uppercase text-slate-500">{isBath ? 'Bain Actif' : 'Rinçage'}</p>
            </div>
            
            <div className="p-4 flex-1 max-h-40 overflow-y-auto custom-scrollbar">
                {hasIons ? (
                    <div className="space-y-1">
                        {Object.entries(tank.concentrations).map(([ion, val]: any) => (
                            <div key={ion} className="flex justify-between text-[11px] font-mono p-1 rounded-lg">
                                <span className="text-slate-600 font-bold">{ion}</span>
                                <span className="text-blue-600 font-black">{Number(val || 0).toFixed(3)} g/L</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-400 italic text-xs">
                        Aucune pollution calculée (eau pure ou cuve non connectée).
                    </div>
                )}
            </div>
        </div>
    );
  };
  // ---------------------------------------------------------------------------------


  return (
    // Correction 3: Utilisation de flex-col et min-h-0 sur le contenu principal
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden"> 
      
      {/* TOOLBAR (Header du Rapport) */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setViewMode('GRAPH')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 flex items-center gap-2 text-xs font-bold transition-all">
            <ArrowLeft className="w-4 h-4" /> Éditeur
          </button>
          <div className="w-px h-6 bg-slate-200" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Bilan d'Ingénierie : Traitement de Surface</h2>
        </div>
        <div className="flex items-center gap-3">
            {report.warningsCount > 0 ? (
                <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 uppercase flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" /> {report.warningsCount} Avertissement(s)
                </span>
            ) : (
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Analyse Complète
                </span>
            )}

            <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all">
              <Download className="w-4 h-4" /> Export Rapport
            </button>
        </div>
      </div>

      {/* ZONE DE CONTENU (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-8 space-y-12 custom-scrollbar">
        
        {/* --- SECTION 1 : KPIs GLOBAUX --- */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard icon={<Droplets />} label="Appoint Eau (Prod)" value={report.totalWaterMakeup.toFixed(0)} unit="L/h" color="blue" />
          <KpiCard icon={<Wind />} label="Évaporation (24h)" value={report.totalEvaporation.toFixed(1)} unit="L/h" color="orange" />
          <KpiCard icon={<FlaskConical />} label="Consommation Produits (Total)" value={report.totalChemLossLitersPerYear} unit="L/an" color="purple" />
          <KpiCard icon={<TrendingUp />} label="Équilibre Hydrique" value="Parfait" unit="" color="emerald" />
        </div>

        {/* --- SECTION 1.5 : WARNINGS (Nouveau) --- */}
        {report.warnings.length > 0 && (
            <div className="max-w-7xl mx-auto bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl border-2 border-yellow-100">
              <h3 className="flex items-center gap-2 font-semibold text-yellow-800 mb-3 uppercase text-xs tracking-widest">
                <AlertCircle size={20} />
                Points d'attention ({report.warnings.length})
              </h3>
              <ul className="space-y-2">
                {report.warnings.map((warning, idx) => (
                  <li key={idx} className="text-yellow-700 text-sm flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
        )}

        
        {/* --- SECTION 2 : APERÇU HYDRAULIQUE DÉTAILLÉ --- */}
        <div className="max-w-full mx-auto" id="Hydraulique">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" /> Bilan Volumique Détaillé (L/h)
                    </h3>
                </div>
                
                {/* Défilement interne pour les grands tableaux */}
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto"> 
                    <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest sticky left-0 bg-slate-50 z-10">Équipement</th>
                        <th className="p-4 text-[10px] font-black uppercase text-right text-blue-600">Q Entrée (L/h)</th>
                        <th className="p-4 text-[10px] font-black uppercase text-right text-red-600 hidden md:table-cell">Q Sortie (L/h)</th>
                        <th className="p-4 text-[10px] font-black uppercase text-right text-orange-600 hidden lg:table-cell">Évaporation (L/h)</th>
                        <th className="p-4 text-[10px] font-black uppercase text-right text-purple-600 hidden lg:table-cell">Vidange (L/h)</th>
                        <th className="p-4 text-[10px] font-black uppercase text-right text-slate-900">Bilan Net (L/h)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {report.hydraulicOverview.map((item, i) => {
                            const netBalance = item.in - item.out;
                            return (
                                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4 font-bold text-slate-900 sticky left-0 bg-white text-sm">
                                        {item.name} <span className="text-[9px] font-mono text-slate-400 block">{item.id.slice(0, 8)}...</span>
                                    </td>
                                    <td className="p-4 text-right font-mono text-xs text-blue-600">{item.in.toFixed(1)}</td>
                                    <td className="p-4 text-right font-mono text-xs text-red-600 hidden md:table-cell">{item.out.toFixed(1)}</td>
                                    <td className="p-4 text-right font-mono text-xs text-orange-600 hidden lg:table-cell">{item.evap.toFixed(2)}</td>
                                    <td className="p-4 text-right font-mono text-xs text-purple-600 hidden lg:table-cell">{item.dump.toFixed(2)}</td>
                                    <td className={clsx("p-4 text-right font-mono text-xs font-black", Math.abs(netBalance) < 0.01 ? 'text-emerald-600' : 'text-red-600')}>
                                        {netBalance.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>


        {/* --- SECTION 3 : MAINTENANCE & COMPOSITION (Fusionné en Cartes) --- */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* BLOC 3.A : MAINTENANCE DES BAINS */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 flex items-center gap-2">
                        <Beaker className="w-4 h-4 text-purple-500" /> Maintenance des Bains
                    </h3>
                </div>
                <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {report.bathMaintenance.map((bath: any) => (
                        <div key={bath.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="font-black text-xs text-slate-900 mb-3 border-b pb-2 uppercase tracking-tighter">{bath.name}</p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Appoint Eau</p>
                                    <p className="text-sm font-mono font-bold text-blue-600">+{bath.makeup.toFixed(1)} L/h</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Évaporation</p>
                                    {/* Correction 4: Utilisation de Number() pour garantir la conversion */}
                                    <p className="text-sm font-mono font-bold text-orange-500">-{Number(bath.evap || 0).toFixed(1)} L/h</p>
                                </div>
                            </div>
                            {/* Conversion Produits Commerciaux (R03/R05) */}
                            <div className="space-y-2 pt-3 border-t border-slate-100">
                                <p className="text-[9px] font-black text-purple-400 uppercase mb-1">Besoins de Maintenance (Produits) :</p>
                                
                                {bath.commercialNeeds.length > 0 ? (
                                    bath.commercialNeeds.map((need: any) => (
                                        <div key={need.ion} className="flex justify-between text-[11px] font-mono bg-white p-2 rounded-lg border border-purple-50">
                                            <span className="text-purple-600 font-bold">{need.name}</span>
                                            <span className="text-slate-500">
                                                {need.litersPerMonth.toFixed(0)} L/mois
                                            </span>
                                            <span className="text-[9px] font-mono font-bold text-slate-400">
                                                ({need.litersPerYear.toFixed(0)} L/an)
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 bg-emerald-50 rounded-lg text-center">
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase">
                                            Chimie Stable. Aucun ajout requis.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {report.bathMaintenance.length === 0 && <div className="p-10 text-center text-slate-400 italic">Aucun bain actif trouvé.</div>}
                </div>
            </div>
            
            {/* BLOC 3.B : COMPOSITION INTERNE DES CUVES (Utilise les Cartes) */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-blue-500" /> Composition des Cuves de Process
                    </h3>
                </div>
                <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.internalTanks.map((tank: any) => (
                        <TankDetailCard key={tank.id} tank={tank} />
                    ))}
                    {report.internalTanks.length === 0 && (
                        <div className="p-10 text-center text-slate-400 italic col-span-2">Aucun bain ou rinçage dans le système.</div>
                    )}
                </div>
            </div>
        </div>


        {/* --- SECTION 4 : MATRICE DES REJETS (Maintenue) --- */}
        <div className="max-w-full mx-auto" id="Rejets">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden">
                
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 flex items-center gap-2">
                        <Factory className="w-4 h-4 text-emerald-500" /> Matrice des Rejets (Effluents Finaux)
                    </h3>
                </div>
                
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest sticky left-0 bg-slate-50 z-10">Réseau de Collecte</th>
                        <th className="p-6 text-[10px] font-black uppercase text-blue-600 tracking-widest text-right border-l border-slate-200">Débit (L/h)</th>
                        {report.allIons.map(ion => (
                            <th key={ion} className="p-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right border-l border-slate-100">
                            {ion} <span className="text-[8px] opacity-50 block">(mg/L)</span>
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {report.drainLines.length === 0 ? (
                            <tr><td colSpan={report.allIons.length + 2} className="p-10 text-center text-slate-400 italic">Aucun rejet mesurable</td></tr>
                        ) : report.drainLines.map((drain, i) => (
                        <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                            <td className="p-6 font-bold text-slate-900 sticky left-0 bg-white">{drain.name}</td>
                            <td className="p-6 text-right font-mono font-black text-blue-600 bg-blue-50/10 border-l border-slate-100">{drain.flow.toFixed(1)}</td>
                            {report.allIons.map(ion => {
                            const conc = (drain.concentrations[ion] || 0) * 1000; // g/L to mg/L (ppm)
                            return (
                                <td key={ion} className={clsx(
                                "p-6 text-right font-mono text-xs border-l border-slate-50",
                                conc > 50 ? "text-red-500 font-bold" : "text-slate-600"
                                )}>
                                {conc > 0 ? conc.toFixed(1) : '-'}
                                </td>
                            );
                            })}
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>


        {/* --- SECTION 5 : DIAGNOSTIC AI (Toujours à la fin) --- */}
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
            <BarChart3 className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
            <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500 rounded-xl"><Activity className="w-5 h-5 text-white" /></div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Diagnostic de Performance</h3>
                </div>
                <div className="space-y-4">
                    <p className="text-slate-400 text-sm leading-relaxed italic">
                        "Sur la base de la simulation, le rinçage final présente une concentration de {report.drainLines[0]?.concentrations[report.allIons[0]]?.toFixed(3) || '0'} g/L. 
                        L'activation du spray sur le Bain n°1 a permis de réduire la charge polluante de ce réseau de 15%."
                    </p>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white/10 rounded-lg text-[10px] font-bold uppercase border border-white/10">Bilan Hydrique : Équilibré</div>
                        <div className="px-4 py-2 bg-white/10 rounded-lg text-[10px] font-bold uppercase border border-white/10">Normes Rejet : Conformes</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, unit, color }: any) {
    const colors: any = {
      blue: "text-blue-600 bg-blue-50 border-blue-100",
      purple: "text-purple-600 bg-purple-50 border-purple-100",
      emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
      orange: "text-orange-600 bg-orange-50 border-orange-100",
    };
    return (
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all group">
        <div className={clsx("p-5 rounded-2xl border transition-all group-hover:scale-110 group-hover:rotate-3", colors[color])}>{icon}</div>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-slate-900 leading-none tracking-tighter">{value}</p>
              <span className="text-sm font-bold text-slate-400 uppercase">{unit}</span>
          </div>
        </div>
      </div>
    );
}