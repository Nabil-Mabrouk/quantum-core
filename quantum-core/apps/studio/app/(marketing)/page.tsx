'use client';

import { LeadCapture } from "@/components/marketing/lead-capture";
import { 
  Zap, 
  Shield, 
  Layers, 
  Cpu, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3,
  Network,
  Binary
} from "lucide-react";
import Link from "next/link";
import { clsx } from 'clsx';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden border-b border-white/5">
        {/* Background Grid & Glow */}
        <div className="absolute inset-0 z-0 opacity-30 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-top-4 duration-1000">
            <Binary className="w-3 h-3" /> Engineering OS v3.0
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] lg:max-w-4xl mx-auto">
            L'ingénierie <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-700 italic">Quantifiée.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Libérez vos ingénieurs du carcan d'Excel. Modélisez, simulez et optimisez vos flux industriels sur une plateforme conçue pour la complexité.
          </p>

          <div className="flex flex-col items-center gap-6 pt-4">
            <LeadCapture />
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Propulsé par le moteur matriciel Quantum-Solver™
            </p>
          </div>
        </div>
      </section>

      {/* --- SECTION : THE QUANTUM EXPLAINER --- */}
      <section className="py-24 px-6 border-b border-white/5 bg-slate-900/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
                <h2 className="text-3xl font-black text-white tracking-tight">Pourquoi <span className="text-blue-500">Quantum</span> ?</h2>
                <p className="text-slate-400 leading-relaxed">
                    En physique, un <span className="text-slate-200 italic">quantum</span> est la plus petite unité indivisible d'une propriété. 
                </p>
                <p className="text-slate-400 leading-relaxed">
                    Nous avons appliqué cette philosophie à l'industrie : chaque pompe, chaque vanne, chaque ion est traité comme une unité de donnée discrète et souveraine. En quantifiant chaque élément de votre usine, nous transformons le chaos des flux en une matrice mathématique résoluble.
                </p>
                <div className="flex gap-4 pt-4">
                    <div className="flex flex-col">
                        <span className="text-4xl font-black text-white">4x</span>
                        <span className="text-[10px] font-bold uppercase text-blue-500 tracking-widest">Efficacité accrue</span>
                    </div>
                    <div className="w-px h-12 bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-4xl font-black text-white">100%</span>
                        <span className="text-[10px] font-bold uppercase text-blue-500 tracking-widest">Digital Twin</span>
                    </div>
                </div>
            </div>
            <div className="relative group">
                <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full group-hover:bg-blue-600/30 transition-all" />
                <div className="relative bg-slate-950 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                    <pre className="text-[10px] font-mono text-blue-400 leading-relaxed">
                        {`// Quantum Matrix Resolution
const matrixA = [
  [110, -100,  0], 
  [-10,  110, -100],
  [  0,  -10,  110]
];

const vectorB = [287.5, 0, 0];

// Solving mass balance...
// Result: Steady State Reached.
                        `}
                    </pre>
                </div>
            </div>
        </div>
      </section>

      {/* --- SECTION : THE EXCEL KILLER --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tight">L'alternative ultime à Excel.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
                Les tableurs sont des silos d'erreurs. Quantum Core est une forge de connaissances partagées.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<Cpu className="w-6 h-6" />}
                title="Vitesse de Calcul"
                desc="Passez de 3 heures de saisie Excel à 30 secondes de simulation matricielle grâce à notre solveur NumPy."
            />
            <FeatureCard 
                icon={<Layers className="w-6 h-6" />}
                title="Architecture Multi-Système"
                desc="Connectez vos lignes de production à votre station d'épuration via un bus de données global."
            />
            <FeatureCard 
                icon={<Database className="w-6 h-6" />}
                title="Bibliothèque Souveraine"
                desc="Capitalisez votre savoir-faire chimique et matériel dans une base de données centralisée et récursive."
            />
            <FeatureCard 
                icon={<Network className="w-6 h-6" />}
                title="Topologie sans Erreur"
                desc="Fini les références circulaires. Le graphe gère nativement les recyclages et les boucles de compensation."
            />
            <FeatureCard 
                icon={<Shield className="w-6 h-6" />}
                title="Sûreté Industrielle"
                desc="Traçabilité complète des modifications, logs d'audit et validation des données par l'IA."
            />
            <FeatureCard 
                icon={<BarChart3 className="w-6 h-6" />}
                title="Reporting Instantané"
                desc="Générez vos bilans de masse, CAPEX et offres techniques en un clic après chaque modification."
            />
        </div>
      </section>

      {/* --- RICH FOOTER --- */}
      <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">QC</div>
                <span className="font-black text-2xl tracking-tighter text-white">Quantum Core</span>
              </Link>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                La plateforme d'ingénierie nouvelle génération pour les industries de procédés complexes.
                Conçu pour transformer le savoir métier en actif digital.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Plateforme</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link href="/login" className="hover:text-blue-400 transition-colors">Studio de Conception</Link></li>
                <li><Link href="/library" className="hover:text-blue-400 transition-colors">Référentiel Master</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Moteur de Calcul</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">API Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Domaines</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Traitement de Surface</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">ZLD & Recyclage</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Réseaux de Chaleur</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Hydrogène Vert</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Ressources</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Centre d'Expertise</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Études de Cas</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Webinaires</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Support Technique</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
            <p className="text-xs text-slate-600">
              © 2026 Quantum Core Engineering. Tous droits réservés.
            </p>
            <div className="flex gap-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                <Link href="#" className="hover:text-white transition-colors">Confidentialité</Link>
                <Link href="#" className="hover:text-white transition-colors">Mentions Légales</Link>
                <Link href="#" className="hover:text-white transition-colors">Status Système</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 bg-slate-900/50 border border-white/5 rounded-[2rem] hover:border-blue-500/50 transition-all duration-500 group">
      <div className="w-12 h-12 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl">
        {icon}
      </div>
      <h3 className="text-lg font-black text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}