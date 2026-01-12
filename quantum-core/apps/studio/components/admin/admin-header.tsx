'use client';

import Link from 'next/link';
import { ChevronRight, ShieldCheck, LayoutGrid, Home, ArrowLeft } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export function AdminHeader({ title, subtitle, breadcrumb }: AdminHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto mb-10 space-y-6">
      {/* 1. FIL D'ARIANE (BREADCRUMBS) */}
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link href="/" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
          <Home className="w-3 h-3" /> Accueil
        </Link>
        <ChevronRight className="w-3 h-3 opacity-30" />
        <Link href="/admin" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
          Administration
        </Link>
        {breadcrumb?.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 opacity-30" />
            {item.href ? (
              <Link href={item.href} className="hover:text-blue-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-blue-600">{item.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* 2. TITRE ET BOUTON RETOUR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            {title}
          </h1>
          {subtitle && <p className="text-slate-500 italic text-sm">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
            <Link 
                href="/admin" 
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Retour au Hub Admin
            </Link>
        </div>
      </div>
      
      <div className="h-px w-full bg-slate-200/60" />
    </div>
  );
}