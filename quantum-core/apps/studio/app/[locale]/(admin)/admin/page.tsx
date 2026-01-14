import Link from 'next/link';
import { 
  FileText, 
  Users, 
  BarChart3, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  Settings,
  Database
} from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminHubPage() {
  const adminSections = [
    {
      title: "Centre d'Expertise",
      description: "Gérer les articles techniques, guides d'ingénierie et documentation publique.",
      href: "/admin/blog",
      icon: FileText,
      color: "blue",
      countLabel: "Articles"
    },
    {
      title: "Gestion des Leads",
      description: "Suivre les prospects et contacts générés via la plateforme marketing.",
      href: "/admin/leads",
      icon: Users,
      color: "emerald",
      countLabel: "Prospects"
    },
    {
      title: "Command Center",
      description: "Analytiques globales, taux d'utilisation et statistiques de performance.",
      href: "/admin/stats",
      icon: BarChart3,
      color: "purple",
      countLabel: "KPIs"
    },
    {
      title: "Observabilité Système",
      description: "Consulter les logs d'erreurs, les feedbacks utilisateurs et l'activité IA.",
      href: "/admin/logs",
      icon: Activity,
      color: "amber",
      countLabel: "Logs"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 lg:p-12 space-y-10">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Administration Centrale
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
            Engineering <span className="text-blue-600">OS</span> Control
        </h1>
        <p className="text-slate-500 italic max-w-2xl">
            Bienvenue dans le cockpit de Quantum Core. Gérez le contenu, surveillez les performances et analysez les retours de vos ingénieurs.
        </p>
      </div>

      {/* GRILLE D'ACTIONS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link 
              key={section.href} 
              href={section.href}
              className="group relative bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
            >
              {/* Background Decoration */}
              <div className={clsx(
                "absolute -right-8 -top-8 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity",
                `text-${section.color}-600`
              )}>
                <Icon size={128} />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={clsx(
                    "p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110",
                    `bg-${section.color}-50 text-${section.color}-600 border border-${section.color}-100`
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-500 transition-colors">
                    {section.countLabel}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                    {section.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    {section.description}
                </p>

                <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600">
                    Ouvrir le module <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* FOOTER / MAINTENANCE */}
      <div className="max-w-6xl mx-auto pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base de données: Connectée</span>
            </div>
            <div className="flex items-center gap-2">
                <Database className="w-3 h-3 text-slate-300" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version API: 3.3.1</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-slate-400">
            <Settings className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Configuration Système Globale</span>
          </div>
      </div>
    </div>
  );
}