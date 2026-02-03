// apps/studio/app/actions/simulation.ts
'use server';

import { getLibrary } from './library';
import { db } from '@repo/database';
import { loadGraph } from './graph';
import { auth } from "@/auth";
import { getDomainConfig } from '@/lib/registry'; 
import { NodeSchema } from '@/lib/domain-config';
import { logSecurityEvent } from './security';
import { z } from 'zod';

// ====================================================================
// 1. TYPES & SCHÉMAS
// ====================================================================

type AppNodeWithData = {
  id: string;
  type: string;
  data: {
    type: string;
    properties: Record<string, any>;
  };
};

/**
 * Interface pour le retour standardisé des appels moteur
 */
interface EngineResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// ====================================================================
// 2. HELPERS DE SÉCURITÉ & ACCÈS
// ====================================================================

/**
 * Extrait les paramètres spécifiques au domaine depuis les properties JSONB du projet
 */
function getDomainSettings(project: any, domain: string) {
  const properties = (project?.properties as any) || {};
  return properties[domain] || {};
}

/**
 * Vérifie l'accès à un projet et inclut toute l'arborescence technique.
 * Cette version est optimisée pour charger tout le "System of Systems" en une fois.
 */
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

  if (!project) throw new Error("Projet introuvable ou accès refusé.");
  return project;
}

/**
 * Vérifie l'accès à un système spécifique et récupère le Bus Projet (Streams) associé.
 */
async function getAuthenticatedSystem(systemId: string, userId: string | undefined) {
  if (!userId) throw new Error("Non autorisé: Session utilisateur requise.");
  
  const system = await db.system.findUnique({
    where: { id: systemId },
    include: { project: { include: { streams: true } } }
  });

  if (!system || system.project.userId !== userId) {
    throw new Error("Accès refusé: Vous n'êtes pas propriétaire de ce système.");
  }
  return system;
}

// ====================================================================
// 3. UTILITAIRES RÉSEAU (BRIDGE NEXT.JS <-> PYTHON)
// ====================================================================

/**
 * Gère la communication HTTP avec le moteur FastAPI.
 * @param endpoint - Route du moteur (ex: /simulate)
 * @param payload - Données JSON structurées
 * @returns Objet standardisé avec succès/erreur et données
 */
async function callEngine(endpoint: string, payload: any): Promise<EngineResponse> {
  const engineUrl = process.env.ENGINE_URL;
  const secret = process.env.INTERNAL_API_SECRET;

  if (!engineUrl || !secret) {
    console.error("❌ CRITIQUE: Configuration moteur manquante dans .env");
    return { success: false, error: "Configuration serveur incomplète." };
  }

  // SÉCURITÉ : AbortController pour ne pas bloquer le thread Next.js indéfiniment
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const startTime = Date.now();
    const response = await fetch(`${engineUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': secret,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMsg = await response.text();
      return { success: false, error: `Erreur Moteur Physics (${response.status}): ${errorMsg}` };
    }

    const data = await response.json();
    const duration = Date.now() - startTime;

    console.log(`🚀 [ENGINE] Simulation sur ${endpoint} terminée en ${duration}ms`);
    return { success: true, data };

  } catch (error: any) {
    if (error.name === 'AbortError') {
        return { success: false, error: "Le moteur de calcul n'a pas répondu à temps (Timeout 30s)." };
    }
    return { success: false, error: "Connexion au moteur de calcul impossible." };
  }
}

// ====================================================================
// 4. LOGIQUE DE TOPOLOGIE (LIENS VIRTUELS & DÉDOUBLONNAGE)
// ====================================================================

/**
 * Analyse le Manifeste du Domaine pour transformer les sélections de champs 
 * (ex: 'Alimentation du spray') en arêtes logiques réelles pour le solveur.
 * Cela permet de relier des équipements sans dessiner de tuyaux sur le graphe.
 */
function createVirtualEdges(nodes: AppNodeWithData[], domainManifest: any) {
  const virtualEdges: any[] = [];
  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  nodes.forEach(sourceNode => {
    const nodeSchema: NodeSchema | undefined = domainManifest.nodeTypes[sourceNode.data.type];
    if (!nodeSchema) return;

    // 🚩 CORRECTION DU BUG CRITIQUE (v. fournie) : nodeSchema.fields n'existe pas.
    // Il faut itérer sur nodeSchema.groups puis sur group.fields.
    (nodeSchema.groups || []).forEach(group => {
      (group.fields || []).forEach(field => {
        
        // Un champ 'node-selector' définit un lien logique (ex: un bac A puise dans un bac B)
        if (field.type === 'node-selector') {
          const targetNodeId = sourceNode.data.properties[field.id];
          if (targetNodeId && nodeMap.has(targetNodeId)) {
            virtualEdges.push({
              id: `virtual-${sourceNode.id}-${targetNodeId}-${field.id}`,
              source: sourceNode.id,
              target: targetNodeId,
              type: field.id.toUpperCase(), // Le type de lien permet au solveur de savoir quel flux est concerné
              properties: { isVirtual: true, fieldId: field.id }
            });
          }
        }
      });
    });
  });
  return virtualEdges;
} // 🚩 CORRECTION DU BUG DE SYNTAXE: Le bloc de code de la fonction doit se terminer ici.

/**
 * Fusionne les arêtes dessinées (Pipes) et les arêtes logiques (Virtual)
 * en évitant les doublons si l'utilisateur a dessiné ce qui est déjà sélectionné.
 */
function deduplicateEdges(physicalEdges: any[], virtualEdges: any[]) {
  const finalEdges = [...virtualEdges];
  const virtualEdgeSet = new Set<string>();

  virtualEdges.forEach(edge => {
    virtualEdgeSet.add(`${edge.source}-${edge.target}-${edge.type}`);
  });

  physicalEdges.forEach(pEdge => {
    const sourceId = pEdge.source || pEdge.sourceId;
    const targetId = pEdge.target || pEdge.targetId;
    const type = pEdge.type || 'default';
    const pEdgeKey = `${sourceId}-${targetId}-${type}`;

    if (!virtualEdgeSet.has(pEdgeKey)) {
      finalEdges.push({
        id: pEdge.id,
        source: sourceId,
        target: targetId,
        type: type,
        properties: pEdge.data || pEdge.properties || {}
      });
    }
  });

  return finalEdges;
}

/**
 * Prépare la bibliothèque pour NumPy.
 * Transforme les relations Prisma (Noms, Composants) en dictionnaires 
 * indexés par ID pour un calcul matriciel rapide.
 */
function formatLibraryForPython(rawLibrary: any[]) {
    return {
        referenceItems: rawLibrary.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            properties: item.properties,
            composition: item.components?.map((c: any) => ({
                baseUnitId: c.childId,
                coefficient: c.quantity,
                unit: c.unit
            })) || []
        })),
        baseUnits: rawLibrary
            .filter(i => i.category === 'ION')
            .map(i => ({
                id: i.id,
                name: i.name,
                properties: i.properties
            }))
    };
}

// Helper pour mapper les séquences (cadence -> productionRate)
function mapSequenceForSolver(s: any) {
  // 🚩 CORRECTION DU BUG PREDEDENT & ALIGNEMENT NOMENCLATURE: 
  // productionRate doit être > 0. On prend 10.0 comme valeur par défaut sécurisée.
  const productionRate = s.properties?.surfaceRate ?? s.properties?.productionRate ?? 10.0;
  const dragOutSpecific = s.properties?.dragOutSpecific ?? 0.1;
    
  // Utilise s.steps si c'est un tableau de strings, sinon s.steps.map(st => st.nodeId)
  const stepsList = Array.isArray(s.steps) 
    ? s.steps.map((st: any) => typeof st === 'string' ? st : st.nodeId)
    : [];

  return {
    id: s.id, 
    steps: stepsList, 
    properties: {
      // Les noms des propriétés du manifeste sont utilisés pour la rétrocompatibilité et le payload
      productionRate: productionRate, // Alias de surfaceRate
      dragOutSpecific: dragOutSpecific,
      
      // Assurer que les noms des champs sont cohérents avec le manifeste
      surfaceRate: productionRate, 
      
      // Conserver toutes les propriétés stockées en DB
      ...s.properties
    }
  };
}

// ====================================================================
// 5. ACTIONS SERVEUR (LOGIQUE MÉTIER)
// ====================================================================

/**
 * SIMULATION D'UN SEUL SYSTÈME (LIGNE DE PRODUCTION)
 * C'est l'action appelée lors du clic sur le bouton "Simuler" dans l'éditeur.
 */
export async function runSimulationAction(domain: string, systemId: string, nodes: any[], edges: any[], sequences: any[]) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const systemWithStreams = await getAuthenticatedSystem(systemId, userId);
    
    // 1. Chargement du contexte technique
    const library = await getLibrary(domain);
    const domainManifest = getDomainConfig(domain);
    const projectStreams = systemWithStreams.project.streams || [];
    
    // Extraction des paramètres spécifiques au domaine depuis properties JSONB
    const domainSettings = getDomainSettings(systemWithStreams.project, domain);

    // 2. Traitement de la topologie hybride (Graph + Paramètres)
    const formattedNodes = nodes.map(n => ({
      id: n.id,
      type: n.type,
      data: { type: n.data.type, properties: n.data.properties }
    }));

    const virtualEdges = createVirtualEdges(formattedNodes, domainManifest);
    const processedEdges = deduplicateEdges(edges, virtualEdges);

    // 3. Construction du Payload Physics
    const payload = {
      domain,
      library: formatLibraryForPython(library),
      project_settings: {
        // Champs génériques (communs)
        hoursPerDay: systemWithStreams.project.hoursPerDay,
        daysPerWeek: systemWithStreams.project.daysPerWeek,
        weeksPerYear: systemWithStreams.project.weeksPerYear,
        // Champs spécifiques au domaine (depuis properties JSONB)
        workshopTemp: domainSettings.workshopTemp ?? 20,
        evapCoefficient: domainSettings.evapCoefficient ?? 0.02,
        evapAgitationFactor: domainSettings.evapAgitationFactor ?? 1.5,
        evapCoverReductionFactor: domainSettings.evapCoverReductionFactor ?? 0.1,
        workshopHumidity: domainSettings.workshopHumidity ?? 60
      },
      nodes: nodes.map(n => {
        const props = { ...n.data.properties };
        // --- LOGIQUE BUS PROJET ---
        // Si le nœud est connecté à un flux global (Bus), on injecte les données calculées
        // provenant des autres systèmes du projet.
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
          data: { label: n.data.label || n.id },
          properties: props 
        };
      }),
      edges: processedEdges,
      sequences: sequences.map(mapSequenceForSolver)
    };

    // 4. Logging & Exécution
    await logSecurityEvent('INFO', { action: 'SIMULATION_LOCAL_START', userId, metadata: { systemId, domain } });

    console.log("PAYLOAD VERS SOLVER:", JSON.stringify({
        ...payload,
        sequences: payload.sequences.map(s => ({  
          id: s.id,
          // 🚩 CORRECTION DU BUG PREDEDENT (Nommage) : Utilisation de surfaceRate pour le log
          prodRate: s.properties.surfaceRate, 
          dragOut: s.properties.dragOutSpecific,
          stepsCount: s.steps.length
        }))
      }, null, 2));

    const result = await callEngine('/simulate', payload);

    if (result.success) {
        await logSecurityEvent('INFO', { action: 'SIMULATION_LOCAL_SUCCESS', userId, metadata: { systemId } });
    } else {
        await logSecurityEvent('WARN', { action: 'SIMULATION_LOCAL_FAILED', userId, metadata: { error: result.error } });
    }

    return result;

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * SIMULATION GLOBALE DU PROJET (SYSTEM OF SYSTEMS)
 * Résout les dépendances entre toutes les lignes de production (ex: rejet ligne 1 -> entrée station).
 */
export async function runGlobalProjectSimulation(projectId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const project = await getAuthenticatedProject(projectId, userId);
    const rawLibrary = await getLibrary(project.domain);
    const domainManifest = getDomainConfig(project.domain);
    
    // Extraction des paramètres spécifiques au domaine depuis properties JSONB
    const domainSettings = getDomainSettings(project, project.domain);
    
    // Construction du payload incluant TOUS les systèmes du projet
    const payload = {
      projectId: project.id,
      domain: project.domain,
      library: formatLibraryForPython(rawLibrary),
      project_settings: {
          hoursPerDay: project.hoursPerDay,
          daysPerWeek: project.daysPerWeek,
          weeksPerYear: project.weeksPerYear,
          workshopTemp: domainSettings.workshopTemp ?? 20,
          evapCoefficient: domainSettings.evapCoefficient ?? 0.02,
          evapAgitationFactor: domainSettings.evapAgitationFactor ?? 1.5,
          evapCoverReductionFactor: domainSettings.evapCoverReductionFactor ?? 0.1,
          workshopHumidity: domainSettings.workshopHumidity ?? 60
      },
      systems: project.systems.map(sys => {
        const sysNodesTyped: AppNodeWithData[] = sys.nodes.map(n => ({
          id: n.id, type: n.type, data: { type: n.type, properties: n.properties as any }
        }));
        return {
          id: sys.id,
          type: sys.type,
          nodes: sys.nodes.map(n => ({
            id: n.id, 
            type: n.type, 
            data: { label: n.label || n.id }, // Ajout du label
            properties: n.properties as any,
            inputStreamId: n.inputStreamId, 
            outputStreamId: n.outputStreamId
          })),
          edges: deduplicateEdges(sys.edges, createVirtualEdges(sysNodesTyped, domainManifest)),
          sequences: sys.sequences.map(s => ({
            id: s.id, 
            steps: s.steps.map(st => st.nodeId), 
            properties: {
              // 🚩 BUG DE VALEUR: productionRate doit être > 0
              productionRate: s.properties?.surfaceRate ?? s.properties?.productionRate ?? 10.0, 
              dragOutSpecific: s.properties?.dragOutSpecific ?? 0.1
            }
          }))
        };
      }),
      streams: project.streams.map(s => ({ id: s.id, name: s.name, value: s.value }))
    };

    const response = await callEngine('/solve-project', payload);

    // PERSISTANCE : Si le projet est résolu, on met à jour les flux (Bus) en base de données
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
      
      await logSecurityEvent('INFO', { action: 'SIMULATION_GLOBAL_SUCCESS', userId, metadata: { projectId } });
    }

    return response;
  } catch (error: any) {
    console.error("Global Sim Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * POINT D'ENTRÉE POUR LE BILAN TECHNIQUE RÉSUMÉ
 * Récupère le bilan complet (financier, environnemental, ionique) pour le rapport final.
 */
export async function runProjectSummaryAction(projectId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const project = await getAuthenticatedProject(projectId, userId);
    const library = await getLibrary(project.domain);
    
    // Extraction des paramètres spécifiques au domaine depuis properties JSONB
    const domainSettings = getDomainSettings(project, project.domain);

    // Extraction optimisée des données de simulation
    const systemsSummaryPayload = project.systems.map((sys) => {
      // Note: On réutilise la logique de topologie pour chaque système
      // Mais ici, on utilise les données déjà chargées dans 'project' (évite le N+1)
      const domainManifest = getDomainConfig(project.domain);
      const sysNodesTyped: AppNodeWithData[] = sys.nodes.map(n => ({
        id: n.id, type: n.type, data: { type: n.type, properties: n.properties as any }
      }));

      return {
        id: sys.id,
        nodes: sys.nodes.map(n => ({ 
          id: n.id, 
          type: n.type, 
          data: { label: n.label || n.id }, // Ajout du label
          properties: n.properties || {} 
        })),
        edges: deduplicateEdges(sys.edges, createVirtualEdges(sysNodesTyped, domainManifest)),
        sequences: sys.sequences.map(s => ({
          id: s.id, 
          steps: s.steps.map(step => step.nodeId), 
          properties: {
            // 🚩 BUG DE VALEUR: productionRate doit être > 0
            productionRate: s.properties?.surfaceRate ?? s.properties?.productionRate ?? 10.0, 
            dragOutSpecific: s.properties?.dragOutSpecific ?? 0.1
          }
        }))
      };
    });

    const result = await callEngine('/project-summary', {
      domain: project.domain,
      library: formatLibraryForPython(library),
      project_settings: { 
        hoursPerDay: project.hoursPerDay, 
        daysPerWeek: project.daysPerWeek,
        weeksPerYear: project.weeksPerYear,
        workshopTemp: domainSettings.workshopTemp ?? 20,
        evapCoefficient: domainSettings.evapCoefficient ?? 0.02,
        evapAgitationFactor: domainSettings.evapAgitationFactor ?? 1.5,
        evapCoverReductionFactor: domainSettings.evapCoverReductionFactor ?? 0.1
      },
      systems: systemsSummaryPayload
    });

    if (result.success) {
        await logSecurityEvent('INFO', { action: 'PROJECT_REPORT_GENERATED', userId, metadata: { projectId } });
    }

    return result;

  } catch (error: any) {
    return { success: false, error: "Erreur lors de la génération du bilan : " + error.message };
  }
}

/**
 * ÉVALUATION RÉACTIVE D'UN NŒUD (MICRO-CALCUL)
 * Permet de calculer l'évaporation ou le dimensionnement d'un bac en temps réel lors de la saisie.
 */
export async function evaluateNodeAction(domain: string, nodeType: string, properties: any) {
  const result = await callEngine('/evaluate-node', { domain, node_type: nodeType, properties });
  if (!result.success) return { computed: {} };
  return result.data;
}

/**
 * GÉNÉRATION DE PROPOSITION IA
 * Appelle le moteur LLM pour rédiger un argumentaire technique basé sur le graphe.
 */
export async function generateProposalAction(domain: string, nodes: any[], edges: any[], sequences: any[]) {
  const session = await auth();
  const domainManifest = getDomainConfig(domain);
  
  const formattedNodes = nodes.map(n => ({
    id: n.id, type: n.type, data: { type: n.data.type, properties: n.data.properties }
  }));

  const payload = {
    domain,
    nodes: nodes.map(n => ({ 
      id: n.id, 
      type: n.data.type, 
      data: { label: n.data.label || n.id }, // Ajout du label pour cohérence
      properties: n.data.properties || {} 
    })),
    edges: deduplicateEdges(edges, createVirtualEdges(formattedNodes, domainManifest)),
    sequences: sequences.map(mapSequenceForSolver) // Utilisation du helper pour mapper cadence->productionRate
  };
  
  const result = await callEngine('/generate-proposal', payload);
  
  if (result.success) {
      await logSecurityEvent('INFO', { action: 'AI_PROPOSAL_GENERATED', userId: session?.user?.id, metadata: { domain } });
      return { success: true, proposal: result.data.proposal };
  }
  return result;
}