'use server';

import { getLibrary } from './library';
import { db } from '@repo/database';
import { loadGraph } from './graph';

// --- TYPES ---
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
  sequences: SimulationSequence[];
  library: any;
};

type ProjectSimulationPayload = {
  domain: string;
  lines: SimulationPayload[];
};

/**
 * Appelle le moteur de calcul Python de manière centralisée
 */
async function callEngine(
  endpoint: string, 
  payload: any
) {
  const engineUrl = process.env.ENGINE_URL;
  const secret = process.env.INTERNAL_API_SECRET;

  if (!engineUrl || !secret) {
    return { success: false, error: "Configuration serveur manquante (URL ou Secret)" };
  }

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
      return { success: false, error: `Moteur Python (${response.status}): ${errorBody}` };
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error: any) {
    return { success: false, error: "Incapable de joindre le moteur de calcul : " + error.message };
  }
}

/**
 * Lance la simulation d'une seule ligne
 */
export async function runSimulationAction(domain: string, nodes: any[], edges: any[], sequences: any[]) {
  const library = await getLibrary(domain);
  
  const payload: SimulationPayload = {
    domain,
    library,
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
      name: s.name,
      steps: s.steps,
      properties: s.properties || {}
    }))
  };

  return await callEngine('/simulate', payload);
}

/**
 * Génère l'offre IA
 */
export async function generateProposalAction(domain: string, nodes: any[], edges: any[], sequences: any[]) {
  const payload = {
    domain,
    nodes: nodes.map(n => ({ id: n.id, type: n.data.type, properties: n.data.properties || {} })),
    edges: edges.map(e => ({ source: e.source, target: e.target, properties: e.data || {} })),
    sequences: sequences.map(s => ({ id: s.id, steps: s.steps, properties: s.properties || {} }))
  };
  
  const result = await callEngine('/generate-proposal', payload);
  if (result.success) return { success: true, proposal: result.data.proposal };
  return result;
}

/**
 * Action Server : Bilan Global Usine (Consolide toutes les lignes)
 */
export async function runProjectSummaryAction(projectId: string) {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { lines: true }
    });

    if (!project) return { success: false, error: "Projet introuvable" };

    const library = await getLibrary(project.domain);

    // 1. Préparation massive des données pour toutes les lignes
    const linesData = await Promise.all(project.lines.map(async (line) => {
      const graph = await loadGraph(line.id);
      
      const sequencesFromDb = await db.sequence.findMany({
        where: { lineId: line.id },
        include: { steps: { orderBy: { order: 'asc' } } }
      });

      return {
        domain: project.domain,
        library,
        nodes: graph.nodes.map((n: any) => ({
          id: n.id,
          type: n.data.type,
          properties: n.data.properties || {}
        })),
        edges: graph.edges.map((e: any) => ({
          source: e.source,
          target: e.target,
          properties: e.data || {}
        })),
        sequences: sequencesFromDb.map(s => ({
          id: s.id,
          name: s.name,
          steps: s.steps.map(step => step.nodeId),
          properties: s.properties as Record<string, any>,
        }))
      };
    }));

    // 2. Appel au moteur avec le payload global
    const result = await callEngine('/project-summary', {
      domain: project.domain,
      lines: linesData
    });

    return result;

  } catch (error: any) {
    return { success: false, error: "Erreur lors du calcul global : " + error.message };
  }
}

export async function evaluateNodeAction(domain: string, nodeType: string, properties: any) {
  const engineUrl = process.env.ENGINE_URL;
  const secret = process.env.INTERNAL_API_SECRET;

  const response = await fetch(`${engineUrl}/evaluate-node`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal-secret': secret! },
    body: JSON.stringify({ domain, node_type: nodeType, properties }),
    cache: 'no-store'
  });

  if (!response.ok) return { computed: {} };
  return response.json();
}