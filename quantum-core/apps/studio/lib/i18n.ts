// apps/studio/lib/i18n.ts
import fr from '../locales/fr.json';
import en from '../locales/en.json';

export type Locale = 'fr' | 'en';

const dictionaries = {
  fr,
  en,
};

/**
 * Traduit un label provenant du Manifeste (type I18nLabel)
 * Gère les chaînes simples ou les objets { fr: "", en: "" }
 */
export function t(label: any, locale: Locale | string = 'fr'): string {
  if (!label) return '';
  
  // Si c'est déjà une string, on la renvoie
  if (typeof label === 'string') return label;
  
  // Si c'est un objet de traduction
  const targetLocale = (locale as Locale) || 'fr';
  return label[targetLocale] || label['fr'] || label['en'] || '';
}

/**
 * Récupère le dictionnaire de traduction statique
 */
export function getDictionary(locale: Locale | string = 'fr') {
  const targetLocale = (locale === 'en' || locale === 'fr') ? locale : 'fr';
  return dictionaries[targetLocale];
}