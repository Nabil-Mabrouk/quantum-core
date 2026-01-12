---
title: "Case Study 5: Equipment Selection & CAPEX Estimation (The Hardware Library)"
slug: "case-study-hardware-library-capex"
published: true
tags: "Tutorial, CAPEX, Catalog, Equipment, ZLD"
---

# Case Study 5: Equipment Selection & CAPEX Estimation

In the previous tutorial, we designed a **Zero Liquid Discharge (ZLD)** plant. The simulation gave us the **Operating Points**:
*   **Evaporator Input:** 40 L/h (Acidic).
*   **Ion Exchange Input:** 200 L/h (Dilute).
*   **Makeup Water:** 4 L/h.

To turn this digital twin into a commercial proposal, we need to convert these physical requirements into a **Bill of Materials (BOM)** and a price tag.

In this tutorial, we will:
1.  Create a **Hardware Library** (Pumps, Tanks, Skids).
2.  Implement a **"Smart Selection"** workflow where the user selects equipment based on simulation results.
3.  Generate a **CAPEX Report** for the ZLD system.

---

## 1. Step 1: Defining the Hardware Library (JSON)

Unlike chemicals (which interact at the atomic level), equipment is defined by **Specifications** (Max Flow, Power, Material) and **Commercial Data** (Price, SKU).

We create a new JSON file: `surface-hardware.json`.

```json
[
  // --- EVAPORATORS (Vacuum) ---
  {
    "name": "Evaled PC-R 50",
    "category": "EVAPORATOR",
    "properties": {
      "nominalFlow": 50, 
      "technology": "Heat Pump",
      "power": 3.5,
      "price": 45000,
      "supplier": "Veolia"
    }
  },
  {
    "name": "Evaled PC-R 150",
    "category": "EVAPORATOR",
    "properties": {
      "nominalFlow": 150,
      "technology": "Heat Pump",
      "power": 8.0,
      "price": 68000,
      "supplier": "Veolia"
    }
  },

  // --- ION EXCHANGE SKIDS ---
  {
    "name": "EcoResin 500",
    "category": "SKID",
    "properties": {
      "maxFlow": 500,
      "resinVolume": 50,
      "type": "Cationic/Anionic",
      "price": 12500
    }
  },

  // --- TANKS ---
  {
    "name": "Storage Tank HDPE 1m3",
    "category": "TANK",
    "properties": { "volume": 1000, "material": "HDPE", "price": 850 }
  },
  {
    "name": "Storage Tank HDPE 5m3",
    "category": "TANK",
    "properties": { "volume": 5000, "material": "HDPE", "price": 2200 }
  },

  // --- PUMPS ---
  {
    "name": "Transfer Pump MagDrive",
    "category": "PUMP",
    "properties": { "maxFlow": 5000, "head": 20, "price": 1200 }
  }
]