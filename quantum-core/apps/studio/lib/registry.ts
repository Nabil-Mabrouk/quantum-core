
import { SURFACE_TREATMENT_CONFIG } from './domains/surface-treatment';
// import { ENERGY_CONFIG } from './domains/energy';

const DOMAIN_REGISTRY: Record<string, any> = {
  SURFACE_TREATMENT: SURFACE_TREATMENT_CONFIG,
  // ENERGY: ENERGY_CONFIG
};

// 1. Nouvelle fonction pour récupérer la liste pour le Select UI
export function getAvailableDomains() {
  return Object.values(DOMAIN_REGISTRY).map(d => ({
    id: d.id,
    name: d.name,
    icon: d.iconName // Si vous ajoutez une icône dans le manifeste
  }));
}

// 2. Mise à jour de la fonction de récupération de config
// Elle ne lit plus le .env, elle attend un ID explicite
export function getDomainConfig(domainId?: string) {
  // Fallback sur le .env si aucun ID n'est passé (rétro-compatibilité)
  const id = domainId || process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "SURFACE_TREATMENT";
  return DOMAIN_REGISTRY[id] || DOMAIN_REGISTRY["SURFACE_TREATMENT"];
}