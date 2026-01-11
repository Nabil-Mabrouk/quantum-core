// FILE: apps/studio/components/layout/system-selector.tsx
'use client';

import { useRouter } from 'next/navigation';
import { LayoutDashboard, ChevronDown, Plus } from 'lucide-react';
import { createSystem } from '@/app/actions/system'; // Import mis à jour

interface SystemSelectorProps {
  systems: any[];
  currentSystemId: string;
  projectId: string;
}

export function SystemSelector({ systems, currentSystemId, projectId }: SystemSelectorProps) {
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    
    if (val === "NEW_SYSTEM") {
      const name = prompt("Nom du nouveau système :");
      if (name) {
        // Par défaut on crée en PRODUCTION, on pourra améliorer l'UX plus tard
        await createSystem(projectId, name, "PRODUCTION");
      }
    } else {
      router.push(`?systemId=${val}`);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group">
      <LayoutDashboard className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
      
      <div className="relative flex items-center">
        <select 
          value={currentSystemId}
          onChange={handleChange}
          className="appearance-none bg-transparent pr-8 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer min-w-[120px]"
        >
          {systems.map((sys) => (
            <option key={sys.id} value={sys.id}>
              {sys.name} ({sys.type === 'TREATMENT' ? 'STEP' : 'PROD'})
            </option>
          ))}
          <option value="NEW_SYSTEM" className="text-blue-600 font-bold">+ Nouveau Système...</option>
        </select>
        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 pointer-events-none" />
      </div>
    </div>
  );
}