import { Edge, Node, OnNodesChange, OnEdgesChange, OnConnect, Connection } from '@xyflow/react';

export interface NodeProperties {
  [key: string]: any;
  simulationResults?: Record<string, any>;
  accessories?: any[];
}

export interface AppNodeData extends Record<string, unknown> {
  type: string;
  label: string;
  scope: 'PROCESS' | 'UTILITY' | 'INFRASTRUCTURE';
  properties: NodeProperties;
}

export type AppNode = Node<AppNodeData>;

export interface AppSequence {
  id: string;
  name: string;
  properties: Record<string, any>;
  steps: string[];
}

export interface WorkspaceSlice {
  projectId: string | null;
  systemId: string | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  viewMode: 'GRAPH' | 'SYNOPTIC' | 'SUMMARY';
  synopticMode: 'PHYSICAL' | 'SEQUENCE';
  summaryData: any | null;
  visibleScopes: string[];
  setProjectId: (id: string) => void;
  setSystemId: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setViewMode: (mode: 'GRAPH' | 'SYNOPTIC' | 'SUMMARY') => void;
  setSynopticMode: (mode: 'PHYSICAL' | 'SEQUENCE') => void;
  setSummaryData: (data: any | null) => void;
  toggleScopeVisibility: (scope: string) => void;
}

export interface GraphSlice {
  nodes: AppNode[];
  edges: Edge[];
  setGraph: (nodes: AppNode[], edges: Edge[]) => void;
  addNode: (type: string, position: { x: number, y: number }) => void;
  updateNodeProperties: (nodeId: string, properties: Partial<NodeProperties>) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateEdgeProperties: (edgeId: string, properties: any) => void;
  applyAutoLayout: () => void;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

export interface SequenceSlice {
  sequences: AppSequence[];
  selectedSequenceId: string | null;
  setSequences: (seqs: AppSequence[]) => void;
  addSequence: (name: string) => Promise<void>;
  updateSequenceMeta: (id: string, data: { name?: string; properties?: any }) => Promise<void>;
  updateSequenceSteps: (id: string, steps: string[]) => Promise<void>;
  removeSequence: (id: string) => Promise<void>;
  setSelectedSequenceId: (id: string | null) => void;
}

export type CanvasState = WorkspaceSlice & GraphSlice & SequenceSlice;