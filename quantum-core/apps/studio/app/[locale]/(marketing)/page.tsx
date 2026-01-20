import { LeadCapture } from "@/components/marketing/lead-capture";
import { 
  ArrowRight, FileSpreadsheet, Network, 
  Check, X, ChevronRight, Zap, Database, Lock,
  Cpu, Rocket, RefreshCw, ShieldCheck, BrainCircuit,
  Trophy, Workflow, Play, MousePointerClick, FileText
} from "lucide-react";
import Link from "next/link";
import { getDictionary, Locale } from '@/lib/i18n';
import { clsx } from "clsx";

export default async function LandingPage(props: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await props.params;
  const isFr = locale === 'fr';

  return (
    <div className="flex flex-col w-full bg-black text-white font-sans selection:bg-blue-500/30">
      
      {/* --- 1. HERO SECTION: CINEMATIC & FOCUSED --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden">
        {/* Ambient background effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] opacity-50" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

        <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {isFr ? "Maintenant en Beta Publique" : "Now in Public Beta"}
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight leading-[1.05] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {isFr ? "L'ingénierie sans le" : "Engineering without the"} <br/>
                <span className="text-zinc-500 line-through decoration-zinc-700 decoration-4 mr-4">.xls</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    chaos.
                </span>
            </h1>
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 delay-200 duration-1000">
                    {isFr ? (
                        <>
                            Capitalisez sur votre expertise et libérez vos flux de travail.
                            <br />
                            L'ingénierie haute performance, version moderne.
                        </>
                    ) : (
                        <>
                            Capitalize on your expertise and streamline your workflows.
                            <br />
                            High-performance engineering, the modern way.
                        </>
                    )}
                </p>

            <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 delay-300 duration-1000">
                <LeadCapture />
                <div className="flex items-center gap-8 text-[14px] font-mono text-zinc-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Check className="w-3 h-3" /> No Install</span>
                    <span className="flex items-center gap-2"><Check className="w-3 h-3" /> Cloud Native</span>
                    <span className="flex items-center gap-2"><Check className="w-3 h-3" /> Export PDF/XLS</span>
                </div>
            </div>
        </div>

        {/* Floating Product Preview (The "Conversion" Hook) */}
        <div className="relative mt-20 w-full max-w-5xl mx-auto px-6 animate-in fade-in zoom-in duration-1000 delay-500">
            <div className="aspect-video bg-zinc-900 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                {/* Simulated UI Content */}
                <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-zinc-900/50 backdrop-blur-md">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    </div>
                    <div className="px-3 py-1 bg-zinc-800 rounded-md text-[10px] text-zinc-500 font-mono ml-4">
                        quantum-studio.cloud/project/0x4F2
                    </div>
                </div>
                <div className="flex items-center justify-center h-full">
                   <div className="flex flex-col items-center gap-4 text-zinc-600">
                        <Play className="w-12 h-12 text-blue-500 fill-blue-500 group-hover:scale-110 transition-transform cursor-pointer" />
                        <span className="text-xs font-mono uppercase tracking-widest">{isFr ? "Voir la simulation" : "Watch Simulation"}</span>
                   </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 2. TRUST BANNER: INDUSTRIES --- */}
      <section className="py-12 border-y border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[16px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-8">
                {isFr ? "Conçu pour les secteurs de pointe" : "Built for mission-critical industries"}
            </p>
            <div className="flex  flex-wrap justify-center gap-8 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all">
                <IndustryBrand name="Water Treatment" />
                <IndustryBrand name="Green Hydrogen" />
                <IndustryBrand name="Surface Finishing" />
                <IndustryBrand name="Fine Chemicals" />
            </div>
        </div>
      </section>

      {/* --- 3. THE "WHY" (BENTO GRID) --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="max-w-xl">
                    <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6">
                        {isFr ? "Passez de l'arithmétique à la physique." : "From Arithmetic to Physics."}
                    </h2>
                </div>
                    <p className="text-zinc-500 max-w-sm text-sm leading-relaxed pb-2">
                        {isFr 
                            ? "Centralisez vos données, votre knowledge management et votre expertise sur une plateforme unique. Concevez, calculez vos bilans matières et chiffrez vos systèmes complexes en un instant."
                            : "Unify your data, knowledge management, and expertise in one place. Design, run material balances, and quote complex engineering systems instantly."}
                    </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <BentoCard 
                    colSpan="md:col-span-3"
                    icon={<BrainCircuit className="text-blue-400" />}
                    title={isFr ? "Intelligence Procédurale" : "Procedural Intelligence"}
                    desc={isFr ? "Vos modèles ne sont plus des cellules, mais des objets physiques connectés." : "Your models are no longer cells, but connected physical objects."}
                />
                <BentoCard 
                    colSpan="md:col-span-3"
                    icon={<Workflow className="text-purple-400" />}
                    title={isFr ? "Propagation en temps réel" : "Real-time Propagation"}
                    desc={isFr ? "Changez un paramètre, voyez l'impact sur le CAPEX et les bilans de masse instantanément." : "Change a parameter, see the impact on CAPEX and mass balances instantly."}
                />
                <BentoCard 
                    colSpan="md:col-span-2"
                    icon={<Database className="text-emerald-400" />}
                    title={isFr ? "Bibliothèque Master" : "Master Library"}
                    desc={isFr ? "Centralisez votre savoir-faire." : "Centralize your know-how."}
                />
                <BentoCard 
                    colSpan="md:col-span-4"
                    icon={<RefreshCw className="text-orange-400" />}
                    title={isFr ? "Défi 90 Minutes" : "90-Minute Challenge"}
                    desc={isFr ? "Donnez-nous votre .xls le plus complexe, nous le transformons en jumeau numérique vivant en moins de 2 heures." : "Give us your most complex .xls, we turn it into a living digital twin in under 2 hours."}
                />
            </div>
        </div>
      </section>

      {/* --- 4. STEP BY STEP WORKFLOW --- */}
      <section className="py-32 px-6 bg-zinc-950/50 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-3xl font-medium mb-20">{isFr ? "Comment ça marche ?" : "How it works"}</h2>
            <div className="space-y-24">
                <WorkflowStep 
                    number="01"
                    title={isFr ? "Définissez la topologie" : "Define Topology"}
                    desc={isFr ? "Glissez-déposez vos équipements. Le graphe valide la cohérence des flux automatiquement." : "Drag and drop your equipment. The graph validates flow consistency automatically."}
                    icon={<Network className="w-8 h-8" />}
                />
                <WorkflowStep 
                    number="02"
                    title={isFr ? "Simulez les scénarios" : "Simulate Scenarios"}
                    desc={isFr ? "Ajustez les curseurs physiques (température, concentrations) et observez la convergence en temps réel." : "Adjust physical sliders (temp, concentrations) and watch real-time convergence."}
                    icon={<Cpu className="w-8 h-8" />}
                />
                <WorkflowStep 
                    number="03"
                    title={isFr ? "Exportez vos Offres" : "Export Proposals"}
                    desc={isFr ? "Générez des rapports CAPEX/OPEX et des bilans de masse prêts pour vos clients." : "Generate CAPEX/OPEX reports and mass balances ready for your clients."}
                    icon={<FileText className="w-8 h-8" />}
                    last
                />
            </div>
        </div>
      </section>

      {/* --- 5. FINAL CTA: HIGH IMPACT --- */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight">
                {isFr ? "Prêt à gagner plus d'offres ?" : "Ready to win more bids?"}
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                {isFr 
                    ? "Rejoignez les ingénieurs qui ont abandonné Excel pour la précision de Quantum Studio."
                    : "Join the engineers who abandoned Excel for the precision of Quantum Studio."}
            </p>
            <div className="flex flex-col items-center gap-4">
                <LeadCapture />
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    {isFr ? "Garantie 'No Regret' de 3 mois" : "3-month 'No Regret' Warranty"}
                </p>
            </div>
        </div>
      </section>

      {/* --- FOOTER (UNCHANGED BUT CLEAN) --- */}
      <footer className="bg-black border-t border-white/5 pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
            {/* Same Footer as before... */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
                <p className="text-xs text-zinc-600 font-medium">© 2026 Quantum Core.</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-500 uppercase">System Stable</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}

// --- REUSABLE MODERN COMPONENTS ---

function IndustryBrand({ name }: { name: string }) {
    return (
        <span className="text-lg font-bold font-mono tracking-[0.2em] text-zinc-400 hover:text-white cursor-default">
            {name}
        </span>
    );
}

function BentoCard({ colSpan, icon, title, desc }: any) {
    return (
        <div className={clsx("bg-zinc-900/50 border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-all group", colSpan)}>
            <div className="mb-6 p-3 bg-zinc-800 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
        </div>
    )
}

function WorkflowStep({ number, title, desc, icon, last }: any) {
    return (
        <div className="flex gap-8 md:gap-16 items-start group">
            <div className="flex flex-col items-center">
                <div className="text-md font-mono text-blue-500 font-black mb-4">({number})</div>
                {!last && <div className="w-px h-32 bg-gradient-to-b from-blue-500/50 to-transparent" />}
            </div>
            <div className="flex-1 space-y-4">
                <div className="text-zinc-600 group-hover:text-blue-400 transition-colors duration-500">
                    {icon}
                </div>
                <h3 className="text-2xl font-medium text-white tracking-tight">{title}</h3>
                <p className="text-zinc-500 max-w-md leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}