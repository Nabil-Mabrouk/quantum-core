'use server';

import { getLibrary } from './library';
import { db } from '@repo/database';
import { loadGraph } from './graph';
import { auth } from "@/auth";
import { getDomainConfig } from '@/lib/registry'; 
import { NodeSchema } from '@/lib/domain-config';

// --- SECURITY HELPERS ---

async function getAuthenticatedProject(projectId: string, userId: string | undefined) {
  if (!userId) throw new Error("Non autorisé: Session utilisateur requise.");
  const project = await db.project.findUnique({
    where: { id: projectId, userId: userId },
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
  if (!project) throw new Error("Projet introuvable ou non autorisé.");
  return project;
}

async function getAuthenticatedSystem(systemId: string, userId: string | undefined) {
  if (!userId) throw new Error("Non autorisé: Session utilisateur requise.");
  const system = await db.system.findUnique({
    where: { id: systemId },
    include: { project: { include: { streams: true } } }
  });
  if (!system) throw new Error("Système introuvable.");
  if (system.project.userId !== userId) throw new Error("Non autorisé: Propriétaire requis.");
  return system;
}

// --- NETWORK UTILS ---

/**
 * Appelle le moteur de calcul Python avec un Timeout de sécurité
 */
async function callEngine(endpoint: string, payload: any) {
  const engineUrl = process.env.ENGINE_URL;
  const secret = process.env.INTERNAL_API_SECRET;

  if (!engineUrl || !secret) {
    return { success: false, error: "Configuration serveur manquante (URL ou Secret)" };
  }

  // SÉCURITÉ : Timeout de 15 secondes pour éviter le blocage UI
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${engineUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': secret,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: controller.signal, // Lier le signal d'abort
    });

    clearTimeout(timeoutId); // Annuler le timeout si réponse reçue

    if (!response.ok) {
      const errorBody = await response.text();
      return { success: false, error: `Moteur Python (${response.status}): ${errorBody}` };
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error: any) {
    if (error.name === 'AbortError') {
        return { success: false, error: "Le moteur de calcul ne répond pas (Timeout 15s)." };
    }
    return { success: false, error: "Incapable de joindre le moteur : " + error.message };
  }
}

// --- HELPER WIRELESS & FORMATTING ---

type AppNodeWithData = {
  id: string;
  type: string;
  data: {
    type: string;
    properties: Record<string, any>;
  };
};

function createVirtualEdges(nodes: AppNodeWithData[], domainManifest: any) {
  const virtualEdges: any[] = [];
  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  nodes.forEach(sourceNode => {
    const nodeSchema: NodeSchema | undefined = domainManifest.nodeTypes[sourceNode.data.type];
    if (!nodeSchema) return;

    nodeSchema.fields.forEach(field => {
      if (field.type === 'node-selector') {
        const targetNodeId = sourceNode.data.properties[field.id];
        if (targetNodeId && nodeMap.has(targetNodeId)) {
          const virtualEdgeType = field.id.toUpperCase(); 
          virtualEdges.push({
            id: `virtual-${sourceNode.id}-${targetNodeId}-${virtualEdgeType}`,
            source: sourceNode.id,
            target: targetNodeId,
            type: virtualEdgeType,
            properties: { isVirtual: true, fieldId: field.id }
          });
        }
      }
    });
  });
  return virtualEdges;
}

function deduplicateEdges(physicalEdges: any[], virtualEdges: any[]) {
  const finalEdges = [...virtualEdges];
  const virtualEdgeSet = new Set<string>();

  virtualEdges.forEach(edge => {
    virtualEdgeSet.add(`${edge.source}-${edge.target}-${edge.type}`);
  });

  physicalEdges.forEach(pEdge => {
    const pEdgeKey = `${pEdge.source}-${pEdge.target}-${pEdge.type || 'default'}`;
    if (!virtualEdgeSet.has(pEdgeKey)) {
      finalEdges.push({
        id: pEdge.id,
        source: pEdge.source || pEdge.sourceId,
        target: pEdge.target || pEdge.targetId,
        type: pEdge.type || 'default',
        properties: pEdge.data || pEdge.properties || {}
      });
    }
  });

  return finalEdges;
}

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

// --- SERVER ACTIONS ---

/**
 * 1. SIMULATION D'UN SEUL SYSTÈME
 */
export async function runSimulationAction(domain: string, systemId: string, nodes: any[], edges: any[], sequences: any[]) {
  const session = await auth();
  const systemWithStreams = await getAuthenticatedSystem(systemId, session?.user?.id);
  
  const library = await getLibrary(domain);
  const domainManifest = getDomainConfig(domain);

  const projectStreams = systemWithStreams.project.streams || [];

  const formattedNodes = nodes.map(n => ({
    id: n.id,
    type: n.type,
    data: { type: n.data.type, properties: n.data.properties }
  }));

  const virtualEdges = createVirtualEdges(formattedNodes, domainManifest);
  const processedEdges = deduplicateEdges(edges, virtualEdges);

  const payload = {
    domain,
    library: formatLibraryForPython(library),
    nodes: nodes.map(n => {
      const props = { ...n.data.properties };
      // Injection des données du bus (Project Streams)
      if (n.data.properties?.inputStreamId) {
        const stream = projectStreams.find(s => s.id === n.data.properties.inputStreamId);
        if (stream) {
          const streamVal = stream.value as any;
          props.inletFlow = streamVal?.flow || 0;
          props.externalConcentrations = streamVal?.concentrations || {};
        }
      }
      return { id: n.id, type: n.data.type, properties: props };
    }),
    edges: processedEdges,
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
  const domainManifest = getDomainConfig(domain);
  const formattedNodes = nodes.map(n => ({
    id: n.id,
    type: n.type,
    data: { type: n.data.type, properties: n.data.properties }
  }));

  const virtualEdges = createVirtualEdges(formattedNodes, domainManifest);
  const processedEdges = deduplicateEdges(edges, virtualEdges);

  const payload = {
    domain,
    nodes: nodes.map(n => ({ id: n.id, type: n.data.type, properties: n.data.properties || {} })),
    edges: processedEdges,
    sequences: sequences.map(s => ({ id: s.id, steps: s.steps, properties: s.properties || {} }))
  };
  
  const result = await callEngine('/generate-proposal', payload);
  if (result.success) return { success: true, proposal: result.data.proposal };
  return result;
}

/**
 * 4. SIMULATION GLOBALE PROJET
 */
export async function runGlobalProjectSimulation(projectId: string) {
  const session = await auth();
  if (!projectId) return { success: false, error: "ID de projet manquant" };

  try {
    const project = await getAuthenticatedProject(projectId, session?.user?.id);
    const rawLibrary = await getLibrary(project.domain);
    const domainManifest = getDomainConfig(project.domain);
    
    const formattedLibrary = formatLibraryForPython(rawLibrary);

    const payload = {
      projectId: project.id,
      domain: project.domain,
      library: formattedLibrary,
      systems: project.systems.map(sys => {
        const sysNodes: AppNodeWithData[] = sys.nodes.map(n => ({
          id: n.id,
          type: n.type,
          data: {
            type: n.type,
            properties: n.properties as Record<string, any>,
          }
        }));

        const virtualEdges = createVirtualEdges(sysNodes, domainManifest);
        const processedEdges = deduplicateEdges(sys.edges, virtualEdges);

        return {
          id: sys.id,
          type: sys.type,
          nodes: sys.nodes.map(n => ({
            id: n.id,
            type: n.type,
            properties: n.properties as any,
            inputStreamId: n.inputStreamId,
            outputStreamId: n.outputStreamId
          })),
          edges: processedEdges,
          sequences: sys.sequences.map(s => ({
            id: s.id,
            name: s.name,
            steps: s.steps.map(st => st.nodeId),
            properties: s.properties as any
          }))
        };
      }),
      streams: project.streams.map(s => ({
        id: s.id,
        name: s.name,
        value: s.value
      }))
    };

    const response = await callEngine('/solve-project', payload);

    if (response.success && response.data.status === "success") {
      const streamResults = response.data.results.streams;
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
 * 5. BILAN RÉSUMÉ (Legacy)
 */
export async function runProjectSummaryAction(projectId: string) {
  const session = await auth();
  try {
    const project = await getAuthenticatedProject(projectId, session?.user?.id);
    const library = await getLibrary(project.domain);
    const domainManifest = getDomainConfig(project.domain);

    const systemsData = await Promise.all(project.systems.map(async (sys) => {
      const graph = await loadGraph(sys.id); 
      const sequencesFromDb = await db.sequence.findMany({
        where: { systemId: sys.id },
        include: { steps: { orderBy: { order: 'asc' } } }
      });

      const sysNodes: AppNodeWithData[] = graph.nodes.map((n: any) => ({
        id: n.id,
        type: n.type,
        data: { type: n.data.type, properties: n.data.properties || {} }
      }));

      const virtualEdges = createVirtualEdges(sysNodes, domainManifest);
      const processedEdges = deduplicateEdges(graph.edges, virtualEdges);

      return {
        domain: project.domain,
        library,
        nodes: graph.nodes.map((n: any) => ({
          id: n.id,
          type: n.data.type,
          properties: n.data.properties || {}
        })),
        edges: processedEdges,
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