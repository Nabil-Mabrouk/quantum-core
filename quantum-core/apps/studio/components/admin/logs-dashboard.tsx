'use client';

import { useState, useEffect } from 'react';
import { 
  Trash2, 
  Search, 
  Filter, 
  AlertTriangle, 
  Info, 
  MessageSquare, 
  Bot, 
  Terminal,
  Eye,
  RefreshCw,
  Archive
} from 'lucide-react';
import { toast } from 'sonner';
import { getLogsAction, deleteLogAction, clearOldLogsAction } from '@/app/actions/admin-logs';
import { clsx } from 'clsx';

// Helper to determine severity visual based on action name
const getSeverityStyle = (action: string) => {
  if (action.includes('ERROR')) return { color: 'text-red-600 bg-red-50 border-red-100', icon: AlertTriangle };
  if (action.includes('FEEDBACK')) return { color: 'text-purple-600 bg-purple-50 border-purple-100', icon: MessageSquare };
  if (action.includes('AI')) return { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: Bot };
  return { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Info };
};

export function LogsDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null); // For detail view

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getLogsAction({ action: filterAction, search: searchTerm });
      setLogs(data);
    } catch (err) {
      toast.error("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterAction]); // Re-fetch when filter changes

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this log?")) return;
    await deleteLogAction(id);
    setLogs(logs.filter(l => l.id !== id));
    toast.success("Log deleted");
  };

  const handleCleanup = async () => {
    if (!confirm("This will delete all logs older than 30 days. Continue?")) return;
    const res = await clearOldLogsAction(30);
    toast.success(`Cleanup complete. ${res.deleted} logs removed.`);
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      
      {/* --- TOOLBAR --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Search ID, User, Domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
            />
          </div>
          <select 
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="ALL">All Events</option>
            <option value="FEEDBACK_SUBMITTED">Feedbacks</option>
            <option value="SIMULATION_RUN">Simulations</option>
            <option value="AI_CHAT">AI Chats</option>
            <option value="ERROR">Errors</option>
          </select>
          <button onClick={fetchLogs} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} />
          </button>
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={handleCleanup}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold uppercase hover:bg-red-50 transition-all"
            >
                <Archive className="w-3.5 h-3.5" /> Purge Old Logs
            </button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Type / Severity</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Domain</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">User / ID</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
              <th className="p-4 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map(log => {
              const style = getSeverityStyle(log.action);
              const Icon = style.icon;
              return (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${style.color}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{log.action}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-100 rounded-md text-[9px] font-bold text-slate-500 uppercase">
                        {log.domain || "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{log.userId || "Anonymous"}</span>
                        <span className="text-[9px] font-mono text-slate-400">{log.id.slice(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-500 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => setSelectedLog(log)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="View JSON Details"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(log.id)}
                            className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {logs.length === 0 && !loading && (
                <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400 italic text-sm">No logs found matching criteria.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- DETAILS MODAL --- */}
      {selectedLog && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-sm text-slate-800">Log Details: {selectedLog.id}</h3>
                    <button onClick={() => setSelectedLog(null)}><Filter className="w-4 h-4 text-slate-400" /></button>
                </div>
                <div className="p-0 bg-slate-900">
                    <pre className="text-[10px] font-mono text-green-400 p-6 overflow-auto max-h-[60vh]">
                        {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                </div>
                <div className="p-4 bg-white flex justify-end">
                    <button onClick={() => setSelectedLog(null)} className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200">Close</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}