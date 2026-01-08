import { WATER_CONFIG } from './domains/water';

export const DOMAIN_REGISTRY = {
  WATER: WATER_CONFIG,
  // ENERGY: ENERGY_CONFIG (Futur)
};

export type DomainId = keyof typeof DOMAIN_REGISTRY;

export function getDomainConfig() {
  // On lit le domaine depuis la variable d'environnement
  const activeDomain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN as DomainId;
  return DOMAIN_REGISTRY[activeDomain] || WATER_CONFIG;
}