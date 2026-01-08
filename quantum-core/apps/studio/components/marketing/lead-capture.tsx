'use client';

import { useState } from "react";
import { registerLeadAction } from "@/app/actions/leads";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export function LeadCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await registerLeadAction(email, "landing_hero");
    if (res.success) setStatus("success");
    else setStatus("error");
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 animate-in zoom-in duration-300">
        <CheckCircle2 className="h-5 w-5" />
        <span className="text-sm font-bold">Inscription confirmée. Bienvenue dans la Beta.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input 
        type="email" 
        placeholder="votre@email-ingenieur.com" 
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-slate-500 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <button 
        type="submit" 
        disabled={status === "loading"}
        className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-[0.2em] px-8 py-4 rounded-2xl shadow-lg shadow-blue-900/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Accès Beta <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );
}