---
title: "The Matrix Solver: Automating Mass Balance for Surface Treatment Lines"
slug: "mass-balance-surface-treatment-solver"
published: true
tags: "Python, NumPy, Hydraulics, Surface Treatment, Algorithms"
---

# The Matrix Solver: Automating Mass Balance for Surface Treatment Lines

Designing a surface treatment workshop (Anodizing, Plating, Galvanizing) is a unique engineering challenge because it combines two contradictory physics:

1.  **Discrete Physics (The Sequence):** Parts move from tank to tank via cranes. They carry pollution via **Drag-out** (Entraînement).
2.  **Continuous Physics (The Hydraulics):** Water flows through pipes (Cascades, Overflow) to dilute this pollution.

To size a Water Treatment Plant (STEP) correctly, you cannot just sum up the water flow. You must calculate the exact chemical load (flux) exiting every rinse tank.

In this tutorial, we will configure **Quantum Core** to solve the **Hydraulic and Pollution Mass Balance** of a multi-line workshop.

---

## 1. The Domain Model: Defining the Physics

First, we need to tell the Studio what a "Surface Treatment Line" looks like. We define this in our domain manifest (`lib/domains/surface-treatment.ts`).

Unlike generic nodes, these carry specific process variables.

```typescript
// lib/domains/surface-treatment.ts

export const SURFACE_TREATMENT_CONFIG = {
  id: "SURFACE_TREATMENT",
  nodeTypes: {
    // 1. The Active Bath (Source of Pollution)
    PROCESS_TANK: {
      id: "PROCESS_TANK",
      label: "Active Bath",
      color: "purple-600",
      fields: [
        { id: "concentration", label: "Bath Concentration", type: "number", unit: "g/L" },
        { id: "temp", label: "Temperature", type: "number", unit: "°C" }, // Drives Evaporation
        { id: "dragOut", label: "Drag-out Factor", type: "number", unit: "L/m²" }
      ]
    },
    
    // 2. The Rinse Tank (The Dilution Solver)
    RINSE_TANK: {
      id: "RINSE_TANK",
      label: "Rinse Stage",
      color: "blue-500",
      fields: [
        { id: "volume", label: "Volume", type: "number", unit: "L" },
        { id: "turnover", label: "Renewal Rate", type: "number", unit: "Vol/h" }
      ]
    },

    // 3. The Output (The Network)
    NETWORK: {
      id: "SINK",
      label: "Waste Network",
      color: "emerald-500",
      description: "Connection to the central treatment plant."
    }
  }
};