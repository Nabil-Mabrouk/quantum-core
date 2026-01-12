'use client';

import { X, Terminal, Loader2, StopCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface Log {
  message: string;
  timestamp: string;
}

interface SimulationConsoleProps {
  logs: Log[];
  progress: number;
  isOpen: boolean;
  onClose: () => void;
  onAbort: () => void;
  status: 'idle' | 'running' | 'success' | 'error';
}

export function SimulationConsole({ logs, progress, isOpen, onClose, onAbort, status }: SimulationConsoleProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[450px] bg-slate-900 text-slate-200 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-[100] font-mono text-xs flex flex-col animate-in slide-in-from-bottom-10">
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {status === 'running' ? <Loader2 className="w-3 h-3 animate-spin text-blue-400" /> : <Terminal className="w-3 h-3" />}
          <span className="font-bold uppercase tracking-widest text-[10px]">Quantum Solver v3.0</span>
        </div>
        <div className="flex gap-2">
            {status === 'running' && (
                <button onClick={onAbort} className="text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-0.5 rounded bg-red-900/30 border border-red-900 hover:bg-red-900/50 transition-colors">
                    <StopCircle className="w-3 h-3" /> STOP
                </button>
            )}
            <button onClick={onClose} className="hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-slate-800">
          <div 
            className={clsx("h-full transition-all duration-300 ease-out", 
                status === 'error' ? "bg-red-500" : 
                status === 'success' ? "bg-emerald-500" : "bg-blue-500"
            )} 
            style={{ width: `${progress}%` }} 
          />
      </div>

      {/* Logs Area */}
      <div className="h-64 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-slate-900/90 backdrop-blur">
        {logs.length === 0 && <p className="text-slate-600 italic">Prêt pour la simulation...</p>}
        {logs.map((log, i) => (
            <div key={i} className="flex gap-3 border-l-2 border-slate-700 pl-2">
                <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                <span className="break-words">{log.message}</span>
            </div>
        ))}
        
        {status === 'error' && <div className="text-red-400 font-bold mt-2 border-t border-slate-700 pt-2"> PROCESS FAILED</div>}
        {status === 'success' && <div className="text-emerald-400 font-bold mt-2 border-t border-slate-700 pt-2"> CALCULATION COMPLETE</div>}
        
        <div ref={endRef} />
      </div>
    </div>
  );
}