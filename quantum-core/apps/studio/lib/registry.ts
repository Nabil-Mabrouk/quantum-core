// apps/studio/lib/registry.ts

import { SURFACE_TREATMENT_CONFIG } from './domains/surface-treatment';
// import { ENERGY_CONFIG } from './domains/energy';

// 1. REGISTRE CENTRAL
// C'est le seul endroit où les domaines sont "hardcodés" par importation.
const DOMAIN_REGISTRY: Record<string, any> = {
  SURFACE_TREATMENT: SURFACE_TREATMENT_CONFIG,
  // ENERGY: ENERGY_CONFIG
};

// 2. EXPORTS DYNAMIQUES
export const AVAILABLE_DOMAIN_IDS = Object.keys(DOMAIN_REGISTRY);

export function isDomainValid(domainId: string): boolean {
  return Object.prototype.hasOwnProperty.call(DOMAIN_REGISTRY, domainId);
}

export function getAvailableDomains() {
  return Object.values(DOMAIN_REGISTRY).map(d => ({
    id: d.id,
    name: d.name,
    icon: d.iconName
  }));
}

// 3. RÉCUPÉRATION DE CONFIGURATION (STRICTE)
export function getDomainConfig(domainId?: string) {
  // A. Si un ID est fourni, on vérifie son existence
  if (domainId) {
    const config = DOMAIN_REGISTRY[domainId];
    if (config) return config;
    
    // Si l'ID est invalide, on ne devine pas. On crashe pour alerter le dev.
    throw new Error(`Configuration introuvable pour le domaine : '${domainId}'. Domaines disponibles : ${AVAILABLE_DOMAIN_IDS.join(', ')}`);
  }

  // B. Fallback sur la variable d'environnement (Configuration Serveur explicite)
  const envDomain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN;
  if (envDomain && DOMAIN_REGISTRY[envDomain]) {
    return DOMAIN_REGISTRY[envDomain];
  }

  // C. Si aucune config n'est trouvée, on ARRÊTE TOUT.
  // Pas de "SURFACE_TREATMENT" par défaut.
  throw new Error(
    "Aucun domaine actif n'a pu être déterminé. " +
    "Veuillez passer un 'domainId' explicite ou configurer NEXT_PUBLIC_ACTIVE_DOMAIN."
  );
}