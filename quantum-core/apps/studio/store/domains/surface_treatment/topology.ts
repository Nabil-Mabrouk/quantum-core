import { AppNode, NodeProperties } from '../../types';

/**
 * Synchronise les flux hydrauliques pour éviter la double saisie.
 */
export function syncSurfaceTreatmentTopology(
  nodeId: string,
  newProps: Partial<NodeProperties>,
  allNodes: AppNode[]
): AppNode[] {
  let updatedNodes = [...allNodes];

  // RÈGLE 1 : Si A déborde dans B, alors B sait qu'il reçoit de A
  if (newProps.overflowTargetId) {
    const targetId = newProps.overflowTargetId;
    updatedNodes = updatedNodes.map(n =>
      n.id === targetId
        ? { ...n, data: { ...n.data, properties: { ...n.data.properties, inletSourceId: nodeId } } }
        : n
    );
  }

  // RÈGLE 2 : Si B est alimenté par A, alors A déborde dans B
  if (newProps.inletSourceId) {
    const sourceId = newProps.inletSourceId;
    updatedNodes = updatedNodes.map(n =>
      n.id === sourceId
        ? { ...n, data: { ...n.data, properties: { ...n.data.properties, overflowTargetId: nodeId } } }
        : n
    );
  }

  return updatedNodes;
}

/**
 * Nettoie les références quand un nœud est supprimé.
 */
export function cleanupSurfaceTreatmentReferences(
  removedIds: string[],
  allNodes: AppNode[]
): AppNode[] {
  return allNodes.map((node) => {
    const p = node.data.properties;
    const updatedProps = { ...p };
    let isDirty = false;

    const keysToClean = ['overflowTargetId', 'inletSourceId', 'spraySourceId', 'dumpingNetworkId'];
    keysToClean.forEach((key) => {
      if (removedIds.includes(updatedProps[key])) {
        updatedProps[key] = null;
        isDirty = true;
      }
    });

    return isDirty ? { ...node, data: { ...node.data, properties: updatedProps } } : node;
  });
}