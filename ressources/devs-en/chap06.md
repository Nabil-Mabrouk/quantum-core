---
title: "Visual Customization & Component Registry"
slug: "visual-customization-component-registry"
published: true
tags: "Devs"
---

# Visual Customization & Component Registry

In Chapter 1, we defined the *Data Model* of our domain using the Manifest. Now, we need to define how it *looks*.

Quantum Core uses a **Registry Pattern** (`lib/component-registry.tsx`) to map the logical types defined in your Manifest (e.g., `BOILER`) to actual React components.

### 2.1 The "SmartNode": Zero-Config UI

The good news is: **You usually don't need to write React code.**

The system includes a generic component called `SmartNode` (`components/canvas/smart-node.tsx`). It automatically:
1.  Reads the `iconName` from your Manifest.
2.  Applies the defined `color`.
3.  Displays the `label` and `description`.
4.  Renders status badges based on simulation results.
5.  Shows "Health Bars" for pollution or capacity.

Unless you need a very specific visualization (like an animated turbine or a complex chart inside the node), you should map your types to `SmartNode`.

### 2.2 The Component Registry

Open `apps/studio/lib/component-registry.tsx`. This file is the "Switchboard" connecting your Domain ID to the React implementations.

To add your new **ENERGY** domain visuals, extend the `REGISTRY` object:

```typescript
// apps/studio/lib/component-registry.tsx

import { SmartNode } from '@/components/canvas/smart-node';
import { EndpointNode } from '@/components/domains/surface_treatment/endpoint-node';
// Import your custom report if you have one
// import { EnergyReport } from '@/components/domains/energy/energy-report';

const REGISTRY: Record<string, ComponentMap> = {
  // Existing domain...
  SURFACE_TREATMENT: { ... },

  // YOUR NEW DOMAIN
  ENERGY: {
    nodes: {
      // Map your logical types to React Components
      BOILER: SmartNode,
      TURBINE: SmartNode,
      
      // You can reuse specific components from other domains if they fit
      GRID_POINT: EndpointNode, 
    },
    forms: {}, // Leave empty to use the auto-generated properties panel
    widgets: {},
    panels: {
      // Standard panel when clicking on empty space
      EMPTY_SELECTION: undefined 
    },
    reports: {
      // The component rendered in "Summary" view
      // SUMMARY: EnergyReport 
    }
  }
};
```

### 2.3 Creating a Custom Node (Advanced)

Sometimes, `SmartNode` isn't enough. You might want a node that changes shape based on pressure, or animates when active.

**Step 1: Create the Component**
Create `apps/studio/components/domains/energy/turbine-node.tsx`.

```typescript
'use client';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Fan } from 'lucide-react';

export function TurbineNode({ data, selected }: NodeProps) {
  // Access simulation results via data.properties
  const speed = data.properties?.simulationResults?.rpm || 0;
  const isSpinning = speed > 0;

  return (
    <div className={`p-4 rounded-full border-4 ${selected ? 'border-blue-500' : 'border-slate-200'} bg-white shadow-xl`}>
      {/* Custom Visual: An animating Fan */}
      <div className={isSpinning ? "animate-spin" : ""}>
        <Fan className="w-12 h-12 text-slate-700" />
      </div>
      
      <div className="text-center mt-2">
        <p className="font-bold text-xs">{data.label}</p>
        <p className="font-mono text-[10px] text-blue-600">{speed} RPM</p>
      </div>

      {/* Required: Input/Output Handles */}
      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-4 h-4 bg-red-500" />
    </div>
  );
}
```

**Step 2: Register it**
Update `component-registry.tsx`:

```typescript
import { TurbineNode } from '@/components/domains/energy/turbine-node';

// ... inside REGISTRY.ENERGY.nodes
TURBINE: TurbineNode,
```

### 2.4 Customizing the Properties Panel

By default, `PropertiesPanel` generates inputs based on the `fields` array in your Manifest. However, you may want to inject custom widgets, like a real-time graph or a connector to an external API (e.g., retrieving electricity prices).

**The Widget Pattern:**
You can inject a component at the top of the properties panel for specific node types.

1.  **Create the Widget:** `components/domains/energy/pricing-widget.tsx`
2.  **Register it:**
    ```typescript
    widgets: {
      GRID_POINT: PricingWidget
    }
    ```

### 2.5 Creating the Domain Report

The "Summary" view (`/project/[id]?view=summary`) is a blank canvas. You must provide a React component that takes the simulation results and renders a PDF-ready report.

**Step 1: Create the Report Component**
Location: `components/domains/energy/energy-report.tsx`

```typescript
'use client';
import { useCanvasStore } from "@/store/canvas-store";

export function EnergyReport() {
  const summaryData = useCanvasStore(state => state.summaryData);

  if (!summaryData) return <div>No simulation run yet.</div>;

  return (
    <div className="p-10 bg-white">
      <h1 className="text-3xl font-bold mb-6">Energy Audit Report</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-xl">
            <h3>Total Consumption</h3>
            <p className="text-4xl font-mono text-blue-600">
                {summaryData.global_kwh} <span className="text-sm">kWh</span>
            </p>
        </div>
        {/* Add charts, tables, etc. */}
      </div>
    </div>
  );
}
```

**Step 2: Register the Report**
```typescript
reports: {
  SUMMARY: EnergyReport
}
```

### 2.6 Verification

1.  Navigate to your **Energy** project in the Studio.
2.  Drag a **Boiler** (SmartNode) and a **Turbine** (Custom Node) onto the canvas.
3.  Verify that the Boiler looks like a standard card with your specific fields (Power, Fuel).
4.  Verify that the Turbine looks like your custom circular component.
5.  Click on the "Summary" view (if you registered the report) to check the layout.
