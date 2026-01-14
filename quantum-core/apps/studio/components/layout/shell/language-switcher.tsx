'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = params.locale as string;

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

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    // Remplacer la locale dans l'URL actuelle
    // Exemple: /fr/dashboard -> /en/dashboard
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    setIsOpen(false);
    router.push(newPath);
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
        title="Changer de langue"
      >
        <Globe className={clsx("w-5 h-5", isOpen && "animate-spin-slow")} />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] py-2 animate-in fade-in zoom-in-95 duration-200">
          <p className="px-4 py-2 text-[9px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 mb-1">
            Sélecteur de langue
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