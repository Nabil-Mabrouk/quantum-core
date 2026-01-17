// apps/studio/components/marketing/share-button.tsx
'use client';

import { Share2, Linkedin, Twitter, Mail, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ShareButton({ post, locale }: { post: any, locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  const url = `${baseUrl}/${locale}/blog/${post.slug}`;
  
  // On limite le résumé pour ne pas dépasser les quotas de caractères (X/Twitter)
  const summary = post.excerpt ? `${post.excerpt.slice(0, 120)}...` : "";
  const shareTitle = `${post.title}\n\n${summary}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Lien copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { 
      name: 'LinkedIn', 
      icon: <Linkedin size={16} className="text-[#0077b5]" />, 
      // LinkedIn ignore le texte forcé, il utilise UNIQUEMENT les balises OG de la page
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` 
    },
    { 
      name: 'X / Twitter', 
      icon: <Twitter size={16} className="text-black" />, 
      // Twitter prend le texte (Titre + Résumé) + l'URL
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(url)}` 
    },
    { 
      name: 'Email', 
      icon: <Mail size={16} className="text-slate-600" />, 
      // Email permet un formatage complet
      link: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Découvrez cette analyse sur Quantum Core :\n\n${post.title}\n\n${post.excerpt}\n\nLire l'article complet ici : ${url}`)}` 
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex items-center gap-2 font-bold text-xs"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden md:inline">Partager</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 py-3 animate-in fade-in zoom-in-95 duration-200">
            <p className="px-4 pb-2 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 mb-2">
              Diffuser l'expertise
            </p>
            
            {shareLinks.map(s => (
              <a 
                key={s.name} 
                href={s.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                  {s.icon}
                </div>
                {s.name}
              </a>
            ))}

            <div className="h-px bg-slate-50 my-2" />

            <button 
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </div>
              {copied ? "Copié !" : "Copier le lien"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}