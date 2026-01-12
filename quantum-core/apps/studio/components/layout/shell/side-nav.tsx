'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Network, 
  LayoutDashboard, 
  FlaskConical, 
  Home,
  Settings2,
  ArrowLeft,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { signOut, useSession } from "next-auth/react";

interface SideNavProps {
  projectId?: string;
  systemId?: string;
}

export function SideNav({ projectId, systemId }: SideNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Vérification du rôle admin via la session NextAuth
  const isAdmin = session?.user?.role === 'ADMIN';

  // Définition des items de navigation principale
  const navItems = [
    { 
      key: 'dashboard',
      icon: Home, 
      label: 'Tableau de Bord', 
      href: '/dashboard', 
      active: pathname === '/dashboard',
      disabled: false,
      disabledReason: null
    },
    { 
      key: 'blueprint',
      icon: Network, 
      label: 'Master Blueprint', 
      href: projectId ? `/project/${projectId}` : '#', 
      active: pathname.startsWith('/project'),
      disabled: !projectId,
      disabledReason: "Ouvrez un projet d'abord"
    },
    { 
      key: 'editor',
      icon: LayoutDashboard, 
      label: 'Conception Détail', 
      href: (projectId && systemId) ? `/editor/${projectId}?systemId=${systemId}` : '#', 
      active: pathname.startsWith('/editor'),
      disabled: !systemId,
      disabledReason: "Sélectionnez un système"
    },
    { 
      key: 'library',
      icon: FlaskConical, 
      label: 'Bibliothèque', 
      href: '/library', 
      active: pathname.startsWith('/library'),
      disabled: false,
      disabledReason: null
    }
  ];

  return (
    <aside className="w-16 bg-slate-900 flex flex-col items-center py-6 z-50 shrink-0 border-r border-white/5 shadow-2xl h-screen select-none">
      
      {/* 1. BOUTON RETOUR / QUITTER */}
      <Link 
        href="/" 
        className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all mb-6 group shrink-0"
        title="Quitter l'application"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>

      <div className="w-8 h-px bg-slate-800 mb-6 shrink-0" />

      {/* 2. NAVIGATION PRINCIPALE */}
      <nav className="flex flex-col gap-3 flex-1 w-full items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <Link
              key={item.key}
              href={item.disabled ? '#' : item.href}
              onClick={(e) => item.disabled && e.preventDefault()}
              className={clsx(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group relative",
                item.active 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : item.disabled 
                    ? "text-slate-700 cursor-not-allowed bg-transparent" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={clsx("w-5 h-5", item.disabled && "opacity-40")} />
              
              {/* INDICATEUR ACTIF (Barre latérale bleue) */}
              {item.active && (
                <div className="absolute -left-2 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
              )}

              {/* TOOLTIP FLOTTANT */}
              <div className="absolute left-14 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-[100] translate-x-2 group-hover:translate-x-0 pointer-events-none">
                 <div className={clsx(
                   "text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg shadow-2xl border flex items-center gap-2",
                   item.disabled 
                    ? "bg-slate-800 text-slate-500 border-slate-700" 
                    : "bg-white text-slate-900 border-slate-200"
                 )}>
                    {item.label}
                    {item.disabled && (
                      <span className="text-[8px] bg-red-900/20 px-1.5 py-0.5 rounded text-red-400 normal-case tracking-normal border border-red-900/30">
                        {item.disabledReason}
                      </span>
                    )}
                 </div>
              </div>
            </Link>
          );
        })}

        {/* --- SECTION ADMINISTRATION (Hub Centralisé) --- */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-slate-800 w-full flex flex-col items-center">
            <Link
              href="/admin"
              className={clsx(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group relative",
                pathname.startsWith('/admin') 
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                  : "text-slate-500 hover:text-amber-400 hover:bg-white/5"
              )}
            >
              <ShieldCheck className="w-5 h-5" />
              
              {/* Indicateur actif Admin */}
              {pathname.startsWith('/admin') && (
                <div className="absolute -left-2 w-1.5 h-6 bg-amber-500 rounded-r-full shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
              )}

              {/* Tooltip Admin */}
              <div className="absolute left-14 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-[100] translate-x-2 group-hover:translate-x-0 pointer-events-none">
                <div className="bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap">
                    Console Administration
                </div>
              </div>
            </Link>
          </div>
        )}
      </nav>

      {/* 3. ACTIONS DE BAS DE PAGE */}
      <div className="mt-auto flex flex-col gap-4 shrink-0 pb-2">
         {/* Préférences Utilisateur */}
         <button className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all group relative">
            <Settings2 className="w-5 h-5" />
            <div className="absolute left-14 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-[100] translate-x-2 group-hover:translate-x-0 pointer-events-none">
                <div className="bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg shadow-2xl border border-slate-700">
                    Préférences
                </div>
            </div>
         </button>

         {/* Déconnexion */}
         <button 
           onClick={() => signOut({ callbackUrl: "/" })}
           className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group relative"
         >
            <LogOut className="w-5 h-5" />
            <div className="absolute left-14 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-[100] translate-x-2 group-hover:translate-x-0 pointer-events-none">
                <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg shadow-2xl border border-red-500">
                    Déconnexion
                </div>
            </div>
         </button>
      </div>
    </aside>
  );
}