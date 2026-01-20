---
title: "Data Model & Topology Architecture"
slug: "data-model-topology-architecture"
published: true
tags: "Devs"
---

# Data Model & Topology Architecture

Quantum Core operates on a strict hierarchical data model designed to support "System of Systems" engineering. Unlike a simple drawing tool, the relationships between objects carry physical meaning.

This chapter details the database schema (`@repo/database`) and the specific topology algorithms used to interpret the graph.

### 1.1 The Entity Hierarchy

The data model follows a strict containment hierarchy defined in `schema.prisma`.

#### Level 1: The Project (Global Scope)
The `Project` is the root container. It represents an entire factory or site.
*   **Time Basis:** It holds global settings like `hoursPerDay`, `weeksPerYear`. All mass balance calculations are normalized to this time basis.
*   **The Bus:** It owns `ProjectStream` objects (see Section 1.3), which act as the "Inter-System Bus".

#### Level 2: The System (Local Canvas)
A `System` represents a specific unit operation (e.g., "Water Treatment Plant", "Production Line A").
*   **Isolation:** Each System has its own canvas, nodes, and edges.
*   **Type:** Can be `PRODUCTION` (Linear logic) or `TREATMENT` (Cyclical logic).

#### Level 3: Nodes & Edges (The Graph)
*   **`Node`:** An equipment asset. It contains a `properties` JSON blob which stores all domain-specific inputs defined in the Manifest.
*   **`Edge`:** A physical connection drawn by the user. By default, this represents a pipe or cable (`category: "PHYSICAL"`).

### 1.2 The "Wireless" Connection Logic

One of Quantum Core's most powerful architectural features is **Virtual Topology**.

In complex engineering P&IDs (Piping and Instrumentation Diagrams), drawing wires for every logical connection (e.g., "Pump A sends signal to Controller B" or "Tank C overflows to Drain D") creates visual chaos ("Spaghetti Diagram").

**The Solution:**
We allow connections to be defined as **Properties** (`node-selector` field) rather than **Edges**.

#### How it works in the Code:
1.  **User Interface:** The user selects a target node from a dropdown in the `PropertiesPanel`. This saves the target ID in `node.properties.overflowTargetId`.
2.  **Simulation Time (`actions/simulation.ts`):** Before sending data to Python, the system runs `createVirtualEdges()`.
3.  **Transformation:** It scans all properties. If it finds a `node-selector` field with a value, it generates a **Virtual Edge**.

```typescript
// Conceptual logic in apps/studio/app/actions/simulation.ts
function createVirtualEdges(nodes, manifest) {
  const virtualEdges = [];
  nodes.forEach(node => {
    // 1. Look up schema
    const fields = manifest.nodeTypes[node.type].fields;
    
    fields.forEach(field => {
      // 2. Detect "Wireless" fields
      if (field.type === 'node-selector') {
        const targetId = node.properties[field.id];
        
        // 3. Create ephemeral edge for the solver
        if (targetId) {
          virtualEdges.push({
            source: node.id,
            target: targetId,
            type: field.id.toUpperCase(), // e.g., "OVERFLOW"
            isVirtual: true
          });
        }
      }
    });
  });
  return virtualEdges;
}
```

**Architectural Impact:** The Python Solver receives a fully connected graph (Physical + Virtual) without the UI needing to render messy wires.

### 1.3 System of Systems (The Data Bus)

Large industrial sites are too complex for a single graph. Quantum Core splits them into Systems connected by a **Project Bus**.

*   **`ProjectStream`:** A shared data object at the Project level. It acts as a Pub/Sub topic.
*   **Publishing:** A Node (e.g., a "Drain" in System A) connects to a Stream via `outputStreamId`.
*   **Subscribing:** A Node (e.g., a "Source" in System B) connects to the same Stream via `inputStreamId`.

**The Solving Sequence (`orchestrator.py`):**
1.  The Engine analyzes dependencies between Systems based on Streams.
2.  It builds a topological execution order (DAG).
3.  It solves System A.
4.  It writes the output flow/concentration to the `ProjectStream`.
5.  It solves System B, injecting the `ProjectStream` data as input.

### 1.4 Data Persistence Strategy

The application uses a **"Destructive Sync"** strategy for saving graphs, optimized for consistency over granularity.

When `saveGraph` is called:
1.  **Transaction Start:** A Database Transaction (`db.$transaction`) is opened.
2.  **Wipe:** All Nodes, Edges, and Sequences for the current System are deleted.
3.  **Recreate:** The current state of the Canvas is inserted as new records.
4.  **Transaction Commit:** The changes are applied atomically.

*   **Pros:** Impossible to have "Orphaned Edges" (edges pointing to non-existent nodes). Simplifies the frontend logic (no need to track diffs).
*   **Cons:** Higher DB write load. ID preservation is handled by the frontend sending specific UUIDs, which Prisma respects during creation.
