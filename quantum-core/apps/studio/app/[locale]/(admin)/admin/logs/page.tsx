import Link from 'next/link';
import { db } from '@repo/database';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  Home, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Search, 
  Terminal 
} from 'lucide-react';

export default async function AdminLogsPage() {
  // 1. SÉCURITÉ : Vérification Serveur (Double check après middleware)
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    redirect('/');
  }

  // 2. DATA FETCHING : Récupération des logs (Derniers 50)
  // On inclut les infos utilisateur pour savoir "Qui" a fait l'action
  const logs = await db.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true, name: true, image: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-slate-50/30 p-8 lg:p-12 space-y-10">
      
      {/* --- HEADER NAVIGATION --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
            <Link href="/" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Home className="w-3 h-3" /> Home
            </Link>
            <span>/</span>
            <Link href="/admin/" className="hover:text-blue-600 transition-colors">
              Administration
            </Link>
            <span>/</span>
            <span className="text-blue-600">Security Logs</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            Security & Audit Trail
          </h1>
          <p className="text-slate-500 italic mt-1">
            Trace immuable des actions sensibles et des alertes de sécurité.
          </p>
        </div>
      </div>

      {/* --- TABLEAU DES LOGS --- */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Toolbar (Fake Search pour l'instant) */}
          <div className="p-6 border-b border-slate-100 flex gap-4 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher par IP, User ou Action..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                disabled
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
              <Activity className="w-3 h-3" />
              {logs.length} événements récents
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-5 border-b border-slate-100">Niveau</th>
                  <th className="p-5 border-b border-slate-100">Action</th>
                  <th className="p-5 border-b border-slate-100">Utilisateur / IP</th>
                  <th className="p-5 border-b border-slate-100">Métadonnées Techniques</th>
                  <th className="p-5 border-b border-slate-100 text-right">Horodatage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-slate-50 transition-colors">
                    {/* 1. NIVEAU */}
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
                        log.level === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' :
                        log.level === 'WARN' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {log.level === 'CRITICAL' && <AlertTriangle className="w-3 h-3" />}
                        {log.level}
                      </span>
                    </td>

                    {/* 2. ACTION */}
                    <td className="p-5">
                      <div className="font-bold text-slate-700">{log.action}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.domain}</div>
                    </td>

                    {/* 3. CONTEXTE (QUI ?) */}
                    <td className="p-5">
                      <div className="flex flex-col">
                        {log.user ? (
                          <div className="font-bold text-slate-900">{log.user.email}</div>
                        ) : (
                          <div className="italic text-slate-400">Anonyme / Système</div>
                        )}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-1">
                          <Terminal className="w-3 h-3" />
                          {log.ipAddress || 'IP Inconnue'}
                        </div>
                      </div>
                    </td>

                    {/* 4. METADATA (JSON DUMP) */}
                    <td className="p-5 max-w-sm">
                      <code className="block bg-slate-100 p-2 rounded-lg text-[10px] text-slate-600 font-mono overflow-hidden text-ellipsis whitespace-nowrap group-hover:whitespace-normal group-hover:overflow-visible transition-all border border-slate-200">
                        {log.metadata ? JSON.stringify(log.metadata) : '-'}
                      </code>
                    </td>

                    {/* 5. DATE */}
                    <td className="p-5 text-right text-xs font-medium text-slate-400 tabular-nums">
                      {new Date(log.createdAt).toLocaleString('fr-FR', {
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400 italic">
                      Aucun log de sécurité enregistré pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}