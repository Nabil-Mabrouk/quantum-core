'use client';

import { useRouter } from 'next/navigation';
import { LayoutDashboard, ChevronDown } from 'lucide-react';
import { createLine } from '@/app/actions/line';

interface LineSelectorProps {
  lines: any[];
  currentLineId: string;
  projectId: string;
}

export function LineSelector({ lines, currentLineId, projectId }: LineSelectorProps) {
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    
    if (val === "NEW_LINE") {
      const name = prompt("Nom de la nouvelle ligne :");
      if (name) {
        const newLine = await createLine(projectId, name);
        // The createLine action should handle the redirect
      }
    } else {
      router.push(`?lineId=${val}`);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group">
      <LayoutDashboard className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
      
      <div className="relative flex items-center">
        <select 
          value={currentLineId}
          onChange={handleChange}
          className="appearance-none bg-transparent pr-5 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer"
        >
          {lines.map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
          <option value="NEW_LINE" className="text-blue-600 font-bold">+ Ajouter une ligne...</option>
        </select>
        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 pointer-events-none" />
      </div>
    </div>
  );
}