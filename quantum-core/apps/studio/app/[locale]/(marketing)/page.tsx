import { LeadCapture } from "@/components/marketing/lead-capture";
import { 
  ArrowRight, FileSpreadsheet, Network, 
  Check, X, ChevronRight, Zap, Database, Lock
} from "lucide-react";
import Link from "next/link";
import { getDictionary, Locale } from '@/lib/i18n';
import { clsx } from "clsx";

export default async function LandingPage(props: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await props.params;
  const dict = getDictionary(locale as Locale);
  const isFr = locale === 'fr';

  return (
    <div className="flex flex-col w-full bg-black text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      
      {/* --- HERO SECTION : THE TRANSITION --- */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center border-b border-white/10 overflow-hidden">
        
        {/* BACKGROUND VISUALS (The Metaphor) */}
        <div className="absolute inset-0 flex pointer-events-none">
            
            {/* LEFT SIDE: THE SPREADSHEET (Past) */}
            <div className="w-1/2 h-full relative overflow-hidden bg-zinc-950 border-r border-white/5">
                <div className="absolute inset-0 opacity-20 transform -skew-x-12 scale-150 origin-bottom-right grayscale blur-[2px]">
                    {/* Simulation d'une grille Excel infinie en CSS */}
                    <div className="grid grid-cols-12 gap-px bg-zinc-800 p-1 w-[200%] h-[200%]">
                        {Array.from({ length: 144 }).map((_, i) => (
                            <div key={i} className="bg-zinc-900 h-12 w-full flex items-center px-2 text-[8px] font-mono text-zinc-700">
                                {i % 3 === 0 ? '=VLOOKUP(#REF!)' : i % 5 === 0 ? '####' : '0.00'}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Overlay ombré pour focaliser le centre */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            </div>

            {/* RIGHT SIDE: THE CORE (Future) */}
            <div className="w-1/2 h-full relative overflow-hidden bg-black">
                {/* Simulation d'un réseau Graphe 3D */}
                <div className="absolute inset-0">
                    {/* Glowing Nodes */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
                    
                    {/* Graph Connections (SVG) */}
                    <svg className="absolute inset-0 w-full h-full opacity-40">
                        <line x1="10%" y1="20%" x2="40%" y2="50%" stroke="url(#gradient-line)" strokeWidth="1" />
                        <line x1="40%" y1="50%" x2="80%" y2="30%" stroke="url(#gradient-line)" strokeWidth="1" />
                        <line x1="40%" y1="50%" x2="60%" y2="80%" stroke="url(#gradient-line)" strokeWidth="1" />
                        <defs>
                            <linearGradient id="gradient-line" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                                <stop offset="50%" stopColor="rgba(59, 130, 246, 0.8)" />
                                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Nodes interactifs (visuels) */}
                    <div className="absolute top-[20%] left-[10%] w-3 h-3 bg-zinc-500 rounded-full" />
                    <div className="absolute top-[50%] left-[40%] w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,1)] animate-ping-slow" />
                    <div className="absolute top-[30%] left-[80%] w-2 h-2 bg-zinc-600 rounded-full" />
                    <div className="absolute top-[80%] left-[60%] w-3 h-3 bg-purple-500 rounded-full" />
                </div>
                {/* Overlay pour le texte */}
                <div className="absolute inset-0 bg-gradient-to-l from-black via-black/80 to-transparent" />
            </div>
        </div>

        {/* CONTENT CENTERED */}
        <div className="relative z-20 text-center max-w-4xl mx-auto px-6 space-y-10">
            
            {/* The Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-4 animate-in fade-in zoom-in duration-700">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Live Engine v3.3
            </div>

            {/* The Main Title with Animated Arrow */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter leading-none">
                <span className="text-zinc-700 line-through decoration-zinc-800 decoration-4 opacity-50 blur-[1px]">.xlsx</span>
                
                <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] animate-in zoom-in delay-200 duration-500">
                    <ArrowRight className="w-8 h-8 md:w-12 md:h-12 animate-pulse" />
                </div>
                
                <span className="text-white text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-500">.core</span>
            </div>

            {/* Subhead */}
            <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700">
                {isFr
                    ? "La mise à jour que votre ingénierie attend depuis 20 ans. Puissance matricielle. Interface fluide. Zéro compromis."
                    : "The update your engineering has been waiting 20 years for. Matrix power. Fluid interface. Zero compromise."}
            </p>

            {/* CTA */}
            <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 delay-500 duration-700">
                <LeadCapture />
                <p className="mt-6 text-xs text-zinc-600 font-mono">
                    {isFr ? "Rejoignez 500+ ingénieurs sur la Beta." : "Join 500+ engineers on the Beta."}
                </p>
            </div>
        </div>
      </section>

      {/* --- SECTION : THE COMPARISON (WHY SWAP?) --- */}
      <section className="py-32 px-6 border-b border-white/10 bg-zinc-950">
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6">
                    {isFr ? "Pourquoi changer de paradigme ?" : "Why shift the paradigm?"}
                </h2>
                <p className="text-zinc-500">
                    {isFr 
                        ? "Les tableurs ne sont pas faits pour des systèmes complexes"
                        : "Spreadsheets were not built for complexes systems"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
                
                {/* COLUMN: SPREADSHEET (PAIN) */}
                <div className="bg-zinc-900/50 p-12 space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-zinc-800 rounded-xl text-zinc-500"><FileSpreadsheet className="w-6 h-6" /></div>
                        <h3 className="text-xl font-bold text-zinc-500">Le Tableur</h3>
                    </div>
                    <ul className="space-y-6">
                        <PainPoint text={isFr ? "Erreurs de référence (#REF!) silencieuses" : "Silent reference errors (#REF!)"} />
                        <PainPoint text={isFr ? "Impossible de résoudre les boucles" : "Cannot solve recycling loops"} />
                        <PainPoint text={isFr ? "Données non structurées (Silos)" : "Unstructured Data (Silos)"} />
                        <PainPoint text={isFr ? "Maintenance cauchemardesque" : "Nightmare maintenance"} />
                    </ul>
                </div>

                {/* COLUMN: QUANTUM CORE (GAIN) */}
                <div className="bg-gradient-to-b from-blue-900/10 to-black p-12 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] pointer-events-none" />
                    
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-900/30 border border-blue-500/30 rounded-xl text-blue-400"><Network className="w-6 h-6" /></div>
                        <h3 className="text-xl font-bold text-white">Quantum Core</h3>
                    </div>
                    <ul className="space-y-6">
                        <GainPoint text={isFr ? "Validation physique native" : "Native physics validation"} />
                        <GainPoint text={isFr ? "Solveur itératif automatique" : "Automatic iterative solver"} />
                        <GainPoint text={isFr ? "Base de données orientée objet" : "Object-oriented database"} />
                        <GainPoint text={isFr ? "Collaboratif temps réel" : "Real-time collaboration"} />
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECTION : THE PILLARS --- */}
      <section className="py-32 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureMinimal 
                icon={<Zap />}
                title={isFr ? "Ultra-Rapide" : "Blazing Fast"}
                desc={isFr 
                    ? "Moteur C++ / Python optimisé. Simulez 10 ans de production en 2 secondes."
                    : "Optimized C++ / Python engine. Simulate 10 years of production in 2 seconds."}
            />
            <FeatureMinimal 
                icon={<Database />}
                title={isFr ? "Souverain" : "Sovereign"}
                desc={isFr
                    ? "Vos bibliothèques chimiques et thermiques vous appartiennent. Export JSON complet."
                    : "Your chemical and thermal libraries belong to you. Full JSON export."}
            />
            <FeatureMinimal 
                icon={<Lock />}
                title={isFr ? "Sécurisé" : "Secure"}
                desc={isFr
                    ? "Rôles granulaires, Audit Logs, et chiffrement de bout en bout pour vos secrets industriels."
                    : "Granular roles, Audit Logs, and end-to-end encryption for your industrial secrets."}
            />
        </div>
      </section>

      {/* --- FOOTER : SITEMAP STYLE --- */}
      <footer className="bg-zinc-950 border-t border-white/5 pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-20">
            
            {/* BRAND */}
            <div className="col-span-2 md:col-span-4">
              <Link href={`/${locale}`} className="flex items-center gap-3 mb-6 group">
                <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform">QC</div>
                <span className="font-medium text-xl tracking-tighter text-white">Quantum Core</span>
              </Link>
              <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
                {isFr ? "L'OS d'ingénierie nouvelle génération." : "The next-gen Engineering OS."}
              </p>
            </div>
            
            {/* LINKS */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Try</h4>
              <ul className="space-y-4 text-sm text-zinc-500 font-medium">
                <li><Link href={`/${locale}/login`} className="hover:text-white transition-colors">Studio</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Engine</Link></li>
                <li><Link href={`/${locale}/library`} className="hover:text-white transition-colors">Library</Link></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Learn</h4>
              <ul className="space-y-4 text-sm text-zinc-500 font-medium">
                <li><Link href={`/${locale}/blog`} className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Applications</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Devs</Link></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
                <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Legal</h4>
                <ul className="space-y-4 text-sm text-zinc-500 font-medium">
                    <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
            <p className="text-xs text-zinc-600 font-medium">
              © 2026 Quantum Core Engineering.
            </p>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-emerald-500 uppercase">System Stable</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- VISUAL COMPONENTS ---

function PainPoint({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-sm text-zinc-500">
            <X className="w-4 h-4 text-red-900/50" />
            <span className="line-through decoration-zinc-700">{text}</span>
        </li>
    )
}

function GainPoint({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-sm font-medium text-blue-100">
            <div className="p-0.5 bg-blue-500 rounded-full"><Check className="w-3 h-3 text-white" /></div>
            <span>{text}</span>
        </li>
    )
}

function FeatureMinimal({ icon, title, desc }: any) {
    return (
        <div className="space-y-4 group">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-zinc-600 transition-colors">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
                {desc}
            </p>
        </div>
    )
}