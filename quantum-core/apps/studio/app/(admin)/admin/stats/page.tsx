import { db } from '@repo/database';
import { 
  Users, 
  MousePointer2, 
  Mail, 
  Zap, 
  TrendingUp, 
  ArrowUpRight, 
  Globe, 
  Clock, 
  Home,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default async function StatsPage() {
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";

  // Parallel fetching for high performance
  const [leadCount, userCount, projectCount, recentLeads, recentUsers, domainStats] = await Promise.all([
    db.lead.count(),
    db.user.count(),
    db.project.count(),
    db.lead.findMany({ take: 6, orderBy: { createdAt: 'desc' } }),
    db.user.findMany({ take: 6, orderBy: { lastLogin: 'desc' } }),
    db.lead.groupBy({
        by: ['domain'],
        _count: { _all: true }
    })
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 lg:p-12 space-y-10 text-slate-900">
      
      {/* HEADER & BREADCRUMBS */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
            <Link href="/" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Home className="w-3 h-3" /> Accueil
            </Link>
            <span>/</span>
            <span className="text-slate-900">Administration</span>
            <span>/</span>
            <span className="text-blue-600">Analytics</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tighter">Command Center</h1>
          <p className="text-slate-500 italic mt-1 text-sm">Indicateurs de performance de la plateforme Quantum Core.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button className="px-4 py-2 text-[10px] font-black uppercase bg-slate-900 text-white rounded-xl shadow-lg">Global</button>
            <button className="px-4 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600">Mensuel</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP LEVEL KPIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Mail className="w-5 h-5" />} 
            label="Acquisition Leads" 
            value={leadCount} 
            trend="+12%" 
            color="blue" 
          />
          <StatCard 
            icon={<Users className="w-5 h-5" />} 
            label="Ingénieurs Actifs" 
            value={userCount} 
            trend="+5%" 
            color="purple" 
          />
          <StatCard 
            icon={<Zap className="w-5 h-5" />} 
            label="Projets Créés" 
            value={projectCount} 
            trend="+18%" 
            color="orange" 
          />
          <StatCard 
            icon={<TrendingUp className="w-5 h-5" />} 
            label="Taux de conversion" 
            value="4.2%" 
            trend="+1.2%" 
            color="emerald" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RECENT LEADS TABLE */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-black text-lg flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" /> Flux de Prospection
                </h3>
                <span className="text-[9px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase text-slate-500">Temps Réel</span>
            </div>
            <div className="flex-1">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-8 py-4 text-[9px] font-black uppercase text-slate-400">Email</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase text-slate-400">Vertical</th>
                            <th className="px-8 py-4 text-right text-[9px] font-black uppercase text-slate-400">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {recentLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5 text-sm font-bold text-slate-700">{lead.email}</td>
                                <td className="px-8 py-5">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black border border-blue-100">
                                        {lead.domain}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right text-xs font-mono text-slate-400 group-hover:text-slate-900 transition-colors">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Link href="/admin/leads" className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors">
                Voir tous les prospects
            </Link>
          </div>

          {/* RIGHT COLUMN: DISTRIBUTION & USERS */}
          <div className="space-y-8">
            {/* DOMAIN DISTRIBUTION */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" /> Répartition par Marché
                </h3>
                <div className="space-y-5">
                    {domainStats.map((stat: any) => (
                        <div key={stat.domain} className="space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span>{stat.domain}</span>
                                <span className="text-blue-400">{stat._count._all} leads</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500" 
                                    style={{ width: `${(stat._count._all / leadCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RECENT USERS */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-lg shadow-slate-200/30">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" /> Activité Sessions
                </h3>
                <div className="space-y-4">
                    {recentUsers.map(user => (
                        <div key={user.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                    {user.name?.[0] || 'U'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">{user.name || user.email}</p>
                                    <p className="text-[9px] text-slate-400 uppercase">{user.role}</p>
                                </div>
                            </div>
                            <span className="text-[9px] font-mono text-slate-300">
                                {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generic Stat Card with Trend
 */
function StatCard({ icon, label, value, trend, color }: any) {
    const colors: any = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        purple: "text-purple-600 bg-purple-50 border-purple-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl border ${colors[color]}`}>{icon}</div>
                <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-[9px] font-black">
                    <ArrowUpRight className="w-3 h-3" />
                    {trend}
                </div>
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] group-hover:text-blue-600 transition-colors">{label}</p>
            <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{value}</p>
        </div>
    );
}