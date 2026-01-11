'use client';

import { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  Save, 
  Loader2, 
  RotateCw,
  Settings // <--- L'IMPORT MANQUANT ÉTAIT ICI
} from 'lucide-react';
import { updateProjectSettingsAction } from '@/app/actions/project';

export function ProjectSettingsModal({ projectId, onClose }: { projectId: string, onClose: () => void }) {
  const [isSaving, setIsSaving] = useState(false);
  
  // États locaux pour le formulaire
  const [data, setData] = useState({
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 47
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProjectSettingsAction(projectId, data);
      setIsSaving(false);
      onClose();
      // Optionnel : refresh pour mettre à jour les calculs globaux
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la sauvegarde");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                <Settings className="w-5 h-5 text-slate-900" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Paramètres Usine</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Formulaire */}
        <div className="p-8 space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
            <p className="text-[11px] text-blue-700 leading-relaxed">
                Configurez le régime temporel du site pour permettre au moteur de calculer les flux annuels et les bilans de masse globaux.
            </p>
          </div>

          <div className="space-y-4">
            {/* Heures / Jour */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-700">Heures / Jour</span>
              </div>
              <input 
                type="number" 
                className="w-16 bg-white border border-slate-200 rounded-lg p-2 text-right font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                value={data.hoursPerDay}
                onChange={e => setData({...data, hoursPerDay: parseFloat(e.target.value)})}
              />
            </div>

            {/* Jours / Semaine */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-700">Jours / Semaine</span>
              </div>
              <input 
                type="number" 
                className="w-16 bg-white border border-slate-200 rounded-lg p-2 text-right font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                value={data.daysPerWeek}
                onChange={e => setData({...data, daysPerWeek: parseFloat(e.target.value)})}
              />
            </div>

            {/* Semaines / An */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <RotateCw className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-700">Semaines / An</span>
              </div>
              <input 
                type="number" 
                className="w-16 bg-white border border-slate-200 rounded-lg p-2 text-right font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                value={data.weeksPerYear}
                onChange={e => setData({...data, weeksPerYear: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-500/20 flex justify-center items-center gap-2 disabled:opacity-50"
            >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Sauvegarder les paramètres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}