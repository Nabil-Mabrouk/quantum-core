import { db } from '@repo/database';
import { 
  Mail, 
  Home, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default async function LeadsAdminPage() {
  // Récupération de tous les leads
  const leads = await db.lead.findMany({
    orderBy: { createdAt: 'desc' }
  });

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
            <Link href="/admin" className="hover:text-blue-600 transition-colors">Administration</Link>
            <span>/</span>
            <span className="text-blue-600">Leads</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tighter">Base de Prospection</h1>
          <p className="text-slate-500 italic mt-1 text-sm">Liste complète des contacts capturés via la Landing Page.</p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20">
            <Download className="w-4 h-4" /> Exporter CSV
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* FILTRES & RECHERCHE */}
        <div className="bg-white border border-slate-200 p-4 rounded-3xl mb-8 flex flex-col md:flex-row gap-4 shadow-sm">
            <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" 
                    placeholder="Rechercher un email ou un domaine..." 
                />
            </div>
            <div className="flex gap-2">
                <button className="px-4 py-3 bg-slate-50 text-slate-500 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-all">
                    <Filter className="w-4 h-4" /> Domaine
                </button>
                <button className="px-4 py-3 bg-slate-50 text-slate-500 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-all">
                    <Calendar className="w-4 h-4" /> Date
                </button>
            </div>
        </div>

        {/* TABLEAU DES LEADS */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Prospect</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Marché cible</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Source</th>
                        <th className="px-8 py-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Date d'inscription</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {leads.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-20 text-center text-slate-400 italic">
                                Aucun prospect enregistré pour le moment.
                            </td>
                        </tr>
                    ) : (
                        leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-800">{lead.email}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-tighter">
                                        <Globe className="w-3 h-3 text-blue-400" />
                                        {lead.domain}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {lead.source || 'Landing Page'}
                                </td>
                                <td className="px-8 py-6 text-right text-sm font-mono text-slate-500 font-medium">
                                    {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            
            {/* FOOTER STATS */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Total : {leads.length} contacts
                </p>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="w-2 h-2 rounded-full bg-blue-300" />
                    <div className="w-2 h-2 rounded-full bg-blue-100" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}