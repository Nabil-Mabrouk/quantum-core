'use server';

import { getLibrary } from './library';

type SimulationNode = {
  id: string;
  type: string;
  properties: Record<string, any>;
};

type SimulationEdge = {
  source: string;
  target: string;
  properties: Record<string, any>;
};

type SimulationSequence = {
  id: string;
  steps: string[];
  properties: Record<string, any>;
};

type SimulationPayload = {
  domain: string;
  nodes: SimulationNode[];
  edges: SimulationEdge[];
  sequences: SimulationSequence[]; // NOUVEAU
  library: any;                     // NOUVEAU
};

/**
 * Appelle le moteur de calcul Python avec le contexte complet (Graphe + Chimie + Gammes)
 */
async function callEngine(
  endpoint: string, 
  domain: string, 
  nodes: any[], 
  edges: any[], 
  sequences: any[] = []
) {
  const engineUrl = process.env.ENGINE_URL;
  const secret = process.env.INTERNAL_API_SECRET;

  if (!engineUrl || !secret) {
    return { success: false, error: "Configuration serveur manquante (URL ou Secret)" };
  }

  // 1. RÉCUPÉRATION DU RÉFÉRENTIEL (Ex: Ions et Produits pour le domaine WATER)
  // Python a besoin de ces données pour transformer les produits commerciaux en ions réels.
  const library = await getLibrary(domain);

  // 2. CONSTRUCTION DU PAYLOAD COMPLET
  const payload: SimulationPayload = {
    domain: domain,
    library: library,
    nodes: nodes.map(n => ({
      id: n.id,
      type: n.data.type,
      properties: n.data.properties || {}
    })),
    edges: edges.map(e => ({
      source: e.source,
      target: e.target,
      properties: e.data || {}
    })),
    sequences: sequences.map(s => ({
      id: s.id,
      steps: s.steps,
      properties: s.properties || {}
    }))
  };

  try {
    const response = await fetch(`${engineUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': secret,
      },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = `Erreur Moteur (${response.status})`;
      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.detail) errorMessage = errorJson.detail;
      } catch (e) {}
      
      console.error(`Erreur Engine (${endpoint}):`, response.status, errorBody);
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    console.error(`Erreur de communication avec l'Engine (${endpoint}):`, error);
    return { success: false, error: "Le moteur de calcul est actuellement injoignable." };
  }
}

/**
 * Lance la simulation physique (Hydraulique + Ionique)
 */
export async function runSimulationAction(domain: string, nodes: any[], edges: any[], sequences: any[]) {
  console.log(`🚀 Simulation scientifique demandée [${domain}]`);
  // On passe maintenant les séquences (gammes) au moteur
  const result = await callEngine('/simulate', domain, nodes, edges, sequences);
  return result;
}

/**
 * Demande une proposition d'amélioration à l'IA basée sur le graphe
 */
export async function generateProposalAction(domain: string, nodes: any[], edges: any[], sequences: any[]) {
  console.log(`✨ Génération d'offre IA demandée [${domain}]`);
  const result = await callEngine('/generate-proposal', domain, nodes, edges, sequences);
  
  if (result.success) {
    return { success: true, proposal: result.data.proposal };
  }
  return result;
}