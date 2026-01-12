import Link from 'next/link';
import { Home, ShieldCheck, Activity } from 'lucide-react';
import { LogsDashboard } from '@/components/admin/logs-dashboard';

export default function AdminLogsPage() {
  return (
    <div className="min-h-screen bg-slate-50/30 p-8 lg:p-12 space-y-10">
      
      {/* HEADER NAVIGATION */}
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
            <span className="text-blue-600">System Logs</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            Observability Center
          </h1>
          <p className="text-slate-500 italic mt-1">Monitor usage, errors, and user feedback in real-time.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* THE DASHBOARD COMPONENT */}
        <LogsDashboard />
      </div>
    </div>
  );
}