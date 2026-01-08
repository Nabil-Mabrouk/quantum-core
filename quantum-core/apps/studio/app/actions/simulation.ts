'use server';

// Types pour le contrat d'interface avec Python
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

type SimulationPayload = {
  domain: string;
  nodes: SimulationNode[];
  edges: SimulationEdge[];
};

/**
 * Action Serveur qui fait le pont entre le Canvas (React) 
 * et le moteur de calcul scientifique (Python)
 */
export async function runSimulationAction(domain: string, nodes: any[], edges: any[]) {
  console.log(`🚀 Simulation demandée pour le domaine : ${domain}`);

  // 1. TRANSFORMATION : On convertit les objets complexes de ReactFlow 
  // en un format JSON simple et propre pour Python
  const payload: SimulationPayload = {
    domain: domain,
    nodes: nodes.map(n => ({
      id: n.id,
      type: n.data.type,
      properties: n.data.properties || {} // Ici on envoie Volume, Temp, etc.
    })),
    edges: edges.map(e => ({
      source: e.source,
      target: e.target,
      properties: e.data || {} // Propriétés éventuelles du tuyau/lien
    }))
  };

  const engineUrl = process.env.ENGINE_URL;
  const secret = process.env.INTERNAL_API_SECRET;

  if (!engineUrl || !secret) {
    return { error: "Configuration serveur manquante (URL ou Secret)" };
  }

  try {
    // 2. APPEL : Envoi au micro-service Python (FastAPI)
    const response = await fetch(`${engineUrl}/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': secret, 
      },
      body: JSON.stringify(payload),
      cache: 'no-store' 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Engine:", response.status, errorText);
      return { error: `Erreur Moteur (${response.status})` };
    }

    // 3. RETOUR : On renvoie les résultats (KPIs, alertes) au Frontend
    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    console.error("Erreur de communication avec l'Engine:", error);
    return { error: "Le moteur de calcul est actuellement injoignable." };
  }
}

export async function generateProposalAction(domain: string, nodes: any[], edges: any[]) {
  const engineUrl = process.env.ENGINE_URL;
  const secret = process.env.INTERNAL_API_SECRET;

  const payload = {
    domain,
    nodes: nodes.map(n => ({ id: n.id, type: n.data.type, properties: n.data.properties || {} })),
    edges: edges.map(e => ({ source: e.source, target: e.target, properties: e.data || {} }))
  };

  try {
    const response = await fetch(`${engineUrl}/generate-proposal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-internal-secret': secret! },
      body: JSON.stringify(payload),
      cache: 'no-store' 
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur Engine (Proposal):", response.status, errorText);
        return { success: false, error: `Erreur Moteur IA (${response.status})` };
    }

    const data = await response.json();
    return { success: true, proposal: data.proposal };
  } catch (error) {
    return { success: false, error: "Erreur IA" };
  }
}