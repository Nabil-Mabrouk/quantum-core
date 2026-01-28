'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  X, Clock, Save, Loader2, Settings, AlertTriangle, Zap
} from 'lucide-react';
import { 
  updateProjectSettingsAction, 
  updateProjectDomainSettingsAction,
  getProjectDomainSettingsAction 
} from '@/app/actions/project';
import { getDomainConfig } from '@/lib/registry';
import { t, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';
import { toast } from "sonner";

interface ProjectSettingsModalProps {
  projectId: string;
  domainId: string; // Requis pour charger le Manifeste
  initialSettings?: { // Optionnel : valeurs initiales des paramètres généraux
    hoursPerDay?: number;
    daysPerWeek?: number;
    weeksPerYear?: number;
  };
  onClose: () => void;
}

export function ProjectSettingsModal({ 
  projectId, 
  domainId, 
  initialSettings = {},
  onClose 
}: ProjectSettingsModalProps) {
  const params = useParams();
  const locale = (params.locale as Locale) || 'fr';
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // État séparé : Paramètres généraux (colonnes DB) vs Paramètres domaine (JSONB)
  const [generalSettings, setGeneralSettings] = useState({
    hoursPerDay: 8,
    daysPerWeek: 5,
    weeksPerYear: 47,
    ...initialSettings
  });
  
  const [domainSettings, setDomainSettings] = useState<Record<string, any>>({});

  // 1. DÉTERMINATION DES CHAMPS VIA LE MANIFESTE
  const config = getDomainConfig(domainId);
  
  const domainFields = useMemo(() => {
    return (config as any).globalSettings || [];
  }, [config]);

  // 2. CHARGEMENT DES DONNÉES EXISTANTES
  useEffect(() => {
    async function loadSettings() {
      try {
        // Charger les paramètres spécifiques au domaine (depuis properties JSONB)
        const domainResult = await getProjectDomainSettingsAction(projectId, domainId);
        
        if (domainResult.success && domainResult.data) {
          setDomainSettings(domainResult.data);
        } else if (domainResult.error) {
          console.error("Erreur chargement settings domaine:", domainResult.error);
          // Initialiser avec les valeurs par défaut du manifeste en cas d'erreur
          const defaults: Record<string, any> = {};
          domainFields.forEach((f: any) => {
            defaults[f.id] = f.default;
          });
          setDomainSettings(defaults);
        }
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [projectId, domainId, domainFields]);

  // 3. LOGIQUE DE SAUVEGARDE
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Sauvegarde des paramètres généraux (hoursPerDay, etc.)
        const generalResult = await updateProjectSettingsAction(projectId, generalSettings);
            
        if (generalResult?.error) {  // ✅ Ajout du ?. pour sécurité
        toast.error("Erreur paramètres généraux", { description: generalResult.error });
        setIsSaving(false);
        return;
        }

      // Sauvegarde des paramètres spécifiques au domaine (evapCoefficient, etc.)
      // On filtre seulement les champs définis dans le manifeste du domaine
      const domainPayload: Record<string, any> = {};
      domainFields.forEach((field: any) => {
        domainPayload[field.id] = domainSettings[field.id] ?? field.default;
      });

      const domainResult = await updateProjectDomainSettingsAction(projectId, domainId, domainPayload);
      
      if (domainResult.error) {
        toast.error("Erreur paramètres domaine", { description: domainResult.error });
        setIsSaving(false);
        return;
      }

      toast.success(t({fr: "Paramètres sauvegardés", en: "Settings saved"}, locale));
      onClose();
      
    } catch(e) {
      toast.error("Erreur serveur inattendue.");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneralChange = (id: string, value: number) => {
    setGeneralSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleDomainChange = (id: string, value: number) => {
    setDomainSettings(prev => ({ ...prev, [id]: value }));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
        <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* HEADER MODAL */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                    <Settings className="w-6 h-6 text-blue-600" />
                    {t({fr: "Réglages du Projet", en: "Project Settings"}, locale)}
                </h2>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* MESSAGE D'ALERTE */}
            <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                 <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                 <p className="text-sm text-orange-800">
                    La modification de ces paramètres affecte tous les calculs de bilans de masse et d'énergie.
                 </p>
            </div>

            {/* FORMULAIRE DYNAMIQUE */}
            <div className="space-y-8">
                {/* SECTION 1 : LOGIQUE TEMPORELLE (Standard OS) */}
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                   <Clock className="w-4 h-4" /> Base de Temps & Logistique
                </h3>
                <div className="grid grid-cols-3 gap-6">
                    {[
                      { id: "hoursPerDay", label: {fr: "Heures/Jour", en: "Hours/Day"}, unit: "h", max: 24, min: 1 },
                      { id: "daysPerWeek", label: {fr: "Jours/Semaine", en: "Days/Week"}, unit: "j", max: 7, min: 1 },
                      { id: "weeksPerYear", label: {fr: "Semaines/An", en: "Weeks/Year"}, unit: "sem.", max: 52, min: 1 },
                    ].map(field => (
                        <div key={field.id} className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 block">
                                {t(field.label, locale)}
                            </label>
                            <input 
                                type="number" 
                                min={field.min}
                                max={field.max}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={generalSettings[field.id as keyof typeof generalSettings]}
                                onChange={e => handleGeneralChange(field.id, parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-xs text-slate-400 block ml-1">{field.unit}</span>
                        </div>
                    ))}
                </div>

                {/* SECTION 2 : PARAMÈTRES DOMAINE SPÉCIFIQUE */}
                {domainFields.length > 0 && (
                    <>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pt-4 flex items-center gap-2">
                           <Zap className="w-4 h-4" /> {t({fr: "Hypothèses de Simulation", en: "Simulation Hypotheses"}, locale)}
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {domainFields.map((field: any) => (
                                <div key={field.id} className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block">
                                        {t(field.label, locale)}
                                    </label>
                                    <input 
                                        type="number" 
                                        step={field.type === 'number' ? 0.01 : 1}
                                        min={field.min}
                                        max={field.max}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={domainSettings[field.id] ?? field.default}
                                        onChange={e => handleDomainChange(field.id, parseFloat(e.target.value) || 0)}
                                    />
                                    {field.unit && (
                                        <span className="text-xs text-slate-400 block ml-1">{field.unit}</span>
                                    )}
                                    {field.description && (
                                        <p className="text-xs text-slate-400 block ml-1 italic">{t(field.description, locale)}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* PIED DE PAGE / ACTION */}
            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-64 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {locale === 'fr' ? 'Sauvegarder les Hypothèses' : 'Save Hypotheses'}
                </button>
            </div>
        </div>
    </div>
  );
}