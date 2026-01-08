import { LeadCapture } from "@/components/marketing/lead-capture";
import { getDomainConfig } from "@/lib/registry";
import { Sparkles, ShieldCheck, Zap, Factory } from "lucide-react";

export default function LandingPage() {
  const config = getDomainConfig();

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-40 px-8 bg-slate-900 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-top-4">
            <Sparkles className="w-3 h-3" /> Plateforme d'Ingénierie Nouvelle Génération
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[1.1]">
            L'Intelligence Opérationnelle <br/>
            <span className="text-blue-500 italic">pour le {config.name}.</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Modélisez vos flux, automatisez vos calculs matriciels et générez vos offres techniques en quelques secondes avec Quantum Core.
          </p>

          <LeadCapture />
        </div>

        {/* Grille de fond industrielle */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px]" />
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        <Feature 
            icon={<Zap className="w-8 h-8 text-blue-500" />}
            title="Moteur NumPy"
            desc="Résolution de systèmes linéaires complexes en temps réel pour des bilans de masse parfaits."
        />
        <Feature 
            icon={<ShieldCheck className="w-8 h-8 text-blue-500" />}
            title="Souveraineté des Données"
            desc="Base de données PostgreSQL sécurisée avec isolation complète de vos projets industriels."
        />
        <Feature 
            icon={<Factory className="w-8 h-8 text-blue-500" />}
            title="Conception P&ID"
            desc="Éditeur de graphe intuitif pour dessiner vos lignes de production et vos réseaux de traitement."
        />
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <div className="space-y-4 group">
      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
