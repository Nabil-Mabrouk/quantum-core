---
title: "Orchestrating the Factory: System of Systems & Topological Sorting"
slug: "orchestrator-topological-sort-systems"
published: true
tags: "Algorithms, Distributed Systems, Python, Architecture, Graph Theory"
---

# Orchestrating the Factory: System of Systems & Topological Sorting

In the previous articles, we built a solver capable of simulating a single Surface Treatment Line. But in the real world, a factory is never just one isolated line.

*   **System A (Production):** Generates wastewater containing acid and nickel.
*   **System B (Physico-Chemical Station):** Receives the wastewater, neutralizes the acid, and precipitates the nickel.
*   **System C (Evaporator):** Receives the sludge from System B and concentrates it.

If we tried to model this entire factory in a single graph (Nodes & Edges), the matrix would become massive ($10,000 \times 10,000$), sparse, and impossible to debug.

**Quantum Core** solves this by adopting a **"System of Systems"** architecture. We treat each production line as a black box (a "Microservice") and connect them via a **Project Bus**.

This article details how we built the **Orchestrator**, the logic that decides *in which order* to simulate these systems to respect the flow of matter.

---

## 1. The Architecture: The Project Bus

We need a way to transport data (Flow, Temperature, Composition) from one system to another without tightly coupling them. We introduced a new concept in our Data Model: the **Project Stream**.

**File:** `packages/database/prisma/schema.prisma`

```prisma
model ProjectStream {
  id          String   @id @default(cuid())
  name        String   // e.g., "Acid Network"
  projectId   String
  
  // The State (Snapshot of the last simulation)
  value       Json     @default("{}") @db.JsonB 
  // Example: { "flow": 15000, "concentrations": { "Ni": 12.5 } }

  // Connectivity
  inputs      Node[]   @relation("StreamInput")  // Who reads me? (Consumers)
  outputs     Node[]   @relation("StreamOutput") // Who writes to me? (Producers)
}