---
title: "The Domain Manifest Protocol"
slug: "domain-manifest-protocol"
published: true
tags: "Devs"
---

# The Domain Manifest Protocol

Quantum Core is designed as an **Engineering Operating System**. Just as Windows or Linux doesn't know what "Photoshop" is until you install it, Quantum Core doesn't know what a "Pump" or a "Chemical Tank" is until you define it.

This chapter explains the **Injection Pattern**. You will learn how to describe a new industrial domain using a **Manifest**.

### 1.1 The Architecture of a "Domain"

In the source code (`apps/studio/lib`), the application logic is generic. It knows how to draw boxes, connect wires, and save data. It does *not* know about physics or specific machinery.

To create a custom vertical (e.g., "District Heating", "Agro-Food", "Oil & Gas"), you need to create a **Domain Manifest**. This is a TypeScript object that acts as a configuration file for the entire OS.

**Location:** `apps/studio/lib/domains/`

### 1.2 Anatomy of a Manifest

A Manifest is a TypeScript object strictly typed by `DomainManifest`. Let's create a hypothetical **Energy** domain to illustrate.

Create a file: `apps/studio/lib/domains/energy.ts`

```typescript
import { DomainManifest } from '../domain-config';

export const ENERGY_CONFIG: DomainManifest = {
  id: "ENERGY", // Unique system ID
  name: { fr: "Énergie & Thermique", en: "Power & Thermal" }, // UI Labels
  
  // 1. LIBRARIES: What resources can be used?
  libraries: [
    { 
      id: 'fuels', 
      label: { fr: "Combustibles", en: "Fuels" }, 
      iconName: 'Flame', 
      type: 'SIMPLE', 
      categories: ['GAS', 'BIOMASS', 'OIL'] 
    }
  ],

  // 2. NODE TYPES: What machines exist?
  nodeTypes: {
    BOILER: {
      id: "BOILER",
      label: { fr: "Chaudière", en: "Boiler" },
      scope: "PROCESS", // It's part of the main line
      iconName: "Thermometer",
      color: "red-500",
      fields: [ /* See Section 1.3 */ ]
    },
    TURBINE: {
      id: "TURBINE",
      label: { fr: "Turbine Vapeur", en: "Steam Turbine" },
      scope: "PROCESS",
      iconName: "Fan",
      color: "slate-600",
      fields: []
    }
  },

  // 3. EDGE TYPES: How do they connect?
  edgeTypes: {
    STEAM_PIPE: {
      id: "STEAM_PIPE",
      label: { fr: "Vapeur HP", en: "HP Steam" },
      color: "orange-500",
      fields: []
    }
  }
};
```

### 1.3 Defining Assets (Nodes) & Fields

The power of the system lies in the `fields` array. This tells the UI (`PropertiesPanel`) what inputs to render and the Engine what data to expect.

We support several **Primitive Types**:

#### A. Physical Quantities (`quantity`)
Used for numbers that represent physical reality. The UI adds unit labels automatically.
```typescript
{ 
  id: "power", 
  label: { fr: "Puissance Thermique", en: "Thermal Power" }, 
  type: "quantity", 
  unit: "MW", 
  unitFamily: "power", 
  default: 10 
}
```

#### B. Selectors (`select`)
Hardcoded options for configuration modes.
```typescript
{ 
  id: "technology", 
  label: "Technologie", 
  type: "select", 
  options: [
    { value: "CONDENSING", label: "Condensation" },
    { value: "BACK_PRESSURE", label: "Contre-Pression" }
  ],
  default: "CONDENSING"
}
```

#### C. Wireless Connections (`node-selector`)
This is a critical concept. Instead of drawing messy wires across the screen for utilities (like sending electricity to a grid), you can select a target node from a dropdown.
```typescript
{ 
  id: "gridConnectionId", 
  label: { fr: "Raccordement Réseau", en: "Grid Connection" }, 
  type: "node-selector", 
  filter: ["GRID_POINT"], // Only show nodes of type 'GRID_POINT'
  category: "Utilities" 
}
```

#### D. Nested Collections (`collection`)
For complex recipes or internal components (e.g., a boiler has multiple burners).
```typescript
{
  id: "burners",
  label: "Brûleurs",
  type: "collection",
  schema: [
    { id: "capacity", label: "Capacité", type: "number", unit: "kW" },
    { id: "efficiency", label: "Rendement", type: "number", unit: "%" }
  ]
}
```

### 1.4 Scopes: Process vs. Utility

When defining a Node, you must assign a `scope`. This controls how the **Auto-Layout** algorithm and **Layer Visibility** work.

1.  **`PROCESS`**: The main sequence of operations.
    *   *Behavior:* These nodes are arranged linearly from left to right in the Synoptic view.
    *   *Examples:* Boiler, Turbine, Reaction Tank.
2.  **`UTILITY`**: Supporting infrastructure.
    *   *Behavior:* These nodes are placed at the top (Sources) or bottom (Sinks) of the canvas to avoid cluttering the main flow.
    *   *Examples:* Water Source, Electrical Grid, Drain.
3.  **`INFRASTRUCTURE`**: Static assets.
    *   *Examples:* Storage Tanks, Buildings.

### 1.5 Registration: Activating the Domain

Once your file `energy.ts` is ready, you must tell the Studio to load it.

**File:** `apps/studio/lib/registry.ts`

```typescript
import { SURFACE_TREATMENT_CONFIG } from './domains/surface-treatment';
import { ENERGY_CONFIG } from './domains/energy'; // <--- Import your file

const DOMAIN_REGISTRY: Record<string, any> = {
  SURFACE_TREATMENT: SURFACE_TREATMENT_CONFIG,
  ENERGY: ENERGY_CONFIG // <--- Register it here
};
```

### 1.6 Verification

1.  Restart the Next.js server (`pnpm dev`).
2.  Go to the Dashboard.
3.  Click **"New Project"**.
4.  In the modal, you should now see **"Power & Thermal"** (or your domain name) as a selectable option.
5.  Create a project. The Node Palette on the left will now show "Boiler" and "Turbine" instead of the Water Treatment equipment.

