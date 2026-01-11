import { DomainManifest } from './domain-config';
import { WATER_CONFIG } from './domains/water';
// import { ENERGY_CONFIG } from './domains/energy'; // Plus tard

const DOMAIN_REGISTRY: Record<string, DomainManifest> = {
  WATER: WATER_CONFIG,
  // ENERGY: ENERGY_CONFIG,
};

export function getDomainConfig(): DomainManifest {
  const activeDomain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "WATER";
  return DOMAIN_REGISTRY[activeDomain] || WATER_CONFIG;
}