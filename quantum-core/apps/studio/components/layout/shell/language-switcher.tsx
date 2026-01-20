'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface LanguageSwitcherProps {
  /**
   * Dictionnaire optionnel de liens alternatifs.
   * Ex: { en: '/en/blog/my-translated-slug', fr: '/fr/blog/mon-slug-original' }
   */
  alternates?: Record<string, string>;
}

export function LanguageSwitcher({ alternates }: LanguageSwitcherProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sécurisation du typage de la locale
  const currentLocale = (params?.locale as string) || 'fr';

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
  ];

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (targetLocale: string) => {
    if (targetLocale === currentLocale) return;

    setIsOpen(false);

    // 1. Priorité : Si une URL spécifique est fournie pour cette langue (ex: article de blog traduit)
    if (alternates && alternates[targetLocale]) {
      router.push(alternates[targetLocale]);
      return;
    }

    // 2. Fallback : Remplacement simple du segment de locale dans l'URL actuelle
    // Ex: /fr/dashboard -> /en/dashboard
    const segments = pathname.split('/');
    
    // On s'assure de remplacer le bon segment (index 1 car l'URL commence par /)
    // Si l'URL ne contient pas la locale (ex: racine), on la préfixe.
    if (['fr', 'en'].includes(segments[1])) {
        segments[1] = targetLocale;
        router.push(segments.join('/'));
    } else {
        router.push(`/${targetLocale}${pathname}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BOUTON ICONE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-xl transition-all border",
          isOpen 
            ? "bg-blue-50 border-blue-200 text-blue-600 shadow-inner" 
            : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
        )}
        title={currentLocale === 'fr' ? "Changer de langue" : "Switch language"}
      >
        <Globe className={clsx("w-5 h-5", isOpen && "animate-spin-slow")} />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] py-2 animate-in fade-in zoom-in-95 duration-200">
          <p className="px-4 py-2 text-[9px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 mb-1">
            {currentLocale === 'fr' ? 'Langue' : 'Language'}
          </p>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={clsx(
                "w-full px-4 py-2.5 text-sm font-bold flex items-center justify-between transition-colors",
                currentLocale === lang.code 
                  ? "text-blue-600 bg-blue-50/50" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {lang.label}
              {currentLocale === lang.code && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}