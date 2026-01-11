'use server';

import { getLibrary } from './library';
import { db } from '@repo/database';
import { loadGraph } from './graph';

// --- TYPES ---

type SimulationNode = {
  id: string;
  type: string;
  properties: Record<string, any>;
  inputStreamId?: string | null;
  outputStreamId?: string | null;
};

type SimulationEdge = {
  source: string;
  target: string;
  properties: Record<string, any>;
};

type SimulationSequence = {
  id: string;
  name: string;
  steps: string[];
  properties: Record<string, any>;
};

type SystemSimulationPayload = {
  id: string;
  type: string;
  nodes: SimulationNode[];
  edges: SimulationEdge[];
  sequences: SimulationSequence[];
};

type ProjectSimulationPayload = {
  projectId: string;
  domain: string;
  systems: SystemSimulationPayload[];
  streams: Array<{
    id: string;
    name: string;
    value: any;
  }>;
  library: any;
};

/**
 * Appelle le moteur de calcul Python de manière centralisée
 */
async function callEngine(endpoint: string, payload: any) {
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
    return { success: false, error: "Incapable de joindre le moteur : " + error.message };
  }
}

/**
 * 1. SIMULATION D'UN SEUL SYSTÈME (Local)
 */
// FILE: apps/studio/app/actions/simulation.ts

export async function runSimulationAction(domain: string, systemId: string, nodes: any[], edges: any[], sequences: any[]) {
  const library = await getLibrary(domain);

    // Vérification de sécurité interne
  if (typeof systemId !== 'string') {
      console.error("Erreur: systemId n'est pas une string", systemId);
      return { success: false, error: "ID de système invalide." };
  }
  // 1. Récupérer les valeurs actuelles des ProjectStreams pour ce système
  // Cela permet de savoir quel débit/pollution arrive des autres systèmes
  const systemWithStreams = await db.system.findUnique({
    where: { id: systemId },
    include: {
      project: {
        include: { streams: true }
      }
    }
  });

  const projectStreams = systemWithStreams?.project.streams || [];

  const payload = {
    domain,
    library: formatLibraryForPython(library), // Utilise la fonction de formatage
    nodes: nodes.map(n => {
      const props = { ...n.data.properties };
      
      // SI LE NOEUD LIT UN FLUX GLOBAL : on injecte la valeur statique du bus
      if (n.data.properties?.inputStreamId) {
        const stream = projectStreams.find(s => s.id === n.data.properties.inputStreamId);
        if (stream) {
          const streamVal = stream.value as any;
          props.inletFlow = streamVal?.flow || 0;
          props.externalConcentrations = streamVal?.concentrations || {};
        }
      }

      return {
        id: n.id,
        type: n.data.type,
        properties: props,
      };
    }),
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

// Helper pour le formatage (déjà discuté précédemment)
function formatLibraryForPython(rawLibrary: any[]) {
    return {
        referenceItems: rawLibrary.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            properties: item.properties,
            composition: item.components?.map((c:any) => ({
                baseUnitId: c.childId,
                coefficient: c.quantity
            })) || []
        })),
        baseUnits: rawLibrary.filter(i => i.category === 'ION').map(i => ({
            id: i.id,
            properties: i.properties
        }))
    };
}

/**
 * 2. ÉVALUATION D'UN NŒUD UNIQUE
 */
export async function evaluateNodeAction(domain: string, nodeType: string, properties: any) {
  const result = await callEngine('/evaluate-node', { domain, node_type: nodeType, properties });
  if (!result.success) return { computed: {} };
  return result.data;
}

/**
 * 3. GÉNÉRATION DE PROPOSITION IA
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
 * 4. SIMULATION GLOBALE PROJET (System of Systems)
 */
export async function runGlobalProjectSimulation(projectId: string) {
  if (!projectId) return { success: false, error: "ID de projet manquant" };

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        systems: {
          include: {
            nodes: true,
            edges: true,
            sequences: {
              include: { steps: { orderBy: { order: 'asc' } } }
            }
          }
        },
        streams: true
      }
    });

    if (!project) throw new Error("Projet introuvable");

    const rawLibrary = await getLibrary(project.domain);
    
    // Formatage de la library pour Python (Dictionnaire au lieu de Liste)
    const formattedLibrary = {
      referenceItems: rawLibrary.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        properties: item.properties,
        composition: item.components?.map(c => ({
          baseUnitId: c.childId,
          coefficient: c.quantity
        })) || []
      })),
      baseUnits: rawLibrary.filter(i => i.category === 'ION').map(i => ({
        id: i.id,
        properties: i.properties
      }))
    };

    const payload: ProjectSimulationPayload = {
      projectId: project.id,
      domain: project.domain,
      library: formattedLibrary,
      systems: project.systems.map(sys => ({
        id: sys.id,
        type: sys.type,
        nodes: sys.nodes.map(n => ({
          id: n.id,
          type: n.type,
          properties: n.properties as any,
          inputStreamId: n.inputStreamId,
          outputStreamId: n.outputStreamId
        })),
        edges: sys.edges.map(e => ({
          source: e.sourceId,
          target: e.targetId,
          properties: e.properties as any
        })),
        sequences: sys.sequences.map(s => ({
          id: s.id,
          name: s.name,
          steps: s.steps.map(st => st.nodeId),
          properties: s.properties as any
        }))
      })),
      streams: project.streams.map(s => ({
        id: s.id,
        name: s.name,
        value: s.value
      }))
    };

    const response = await callEngine('/solve-project', payload);

    if (response.success && response.data.status === "success") {
      const streamResults = response.data.results.streams;
      
      // Mise à jour des streams en une transaction
      await db.$transaction(
        Object.entries(streamResults).map(([streamId, value]) =>
          db.projectStream.update({
            where: { id: streamId },
            data: { value: value as any }
          })
        )
      );
    }

    return response;

  } catch (error: any) {
    console.error("Global Sim Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 5. BILAN RÉSUMÉ (Legacy / Agrégation)
 */
export async function runProjectSummaryAction(projectId: string) {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { systems: true }
    });

    if (!project) return { success: false, error: "Projet introuvable" };

    const library = await getLibrary(project.domain);

    const systemsData = await Promise.all(project.systems.map(async (sys) => {
      const graph = await loadGraph(sys.id);
      const sequencesFromDb = await db.sequence.findMany({
        where: { systemId: sys.id },
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

    return await callEngine('/project-summary', {
      domain: project.domain,
      systems: systemsData
    });

  } catch (error: any) {
    return { success: false, error: "Erreur bilan : " + error.message };
  }
}