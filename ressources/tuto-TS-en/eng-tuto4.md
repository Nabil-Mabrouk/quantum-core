---
title: "Case Study 4: Building a Zero Liquid Discharge (ZLD) Plant"
slug: "case-study-zld-system-of-systems"
published: true
tags: "Tutorial, ZLD, Water Treatment, System of Systems, Thermodynamics"
---

# Case Study 4: Building a Zero Liquid Discharge (ZLD) Plant

We have optimized our **Surface Treatment Line (STL)**. It now produces two distinct effluent streams:
1.  **Acid Stream:** Low Volume (40 L/h), High Concentration.
2.  **Resin Stream:** High Volume (200 L/h), Low Concentration.

Instead of discharging this to the sewer, we want to implement a **ZLD (Zero Liquid Discharge)** strategy. We will treat these fluids and recycle them back into production.

In this tutorial, we will build a secondary system—the **Wastewater Treatment Plant (STEP)**—and connect it to the production line using the **Project Bus**.

---

## 1. The Physics: The Treatment Chain

We are designing a hybrid treatment process:

1.  **Evaporation Branch:** Handles the Acid Stream.
    *   **Physics:** Boils water under vacuum.
    *   **Yield:** 90% Recovery. The remaining 10% is "Concentrate" (Sludge) sent to disposal.
2.  **Ion Exchange Branch:** Handles the Resin Stream + Distillate.
    *   **Physics:** Removes trace ions.
    *   **Yield:** ~100% Recovery (Water loss only during regeneration, ignored here).
3.  **Water Balance:**
    *   STL Demand: 240 L/h.
    *   Available Waste: 240 L/h.
    *   Evaporator Loss: 10% of 40 L/h = 4 L/h.
    *   **Deficit:** 4 L/h.
    *   **Solution:** Automatic City Water makeup.

---

## 2. Step 1: Extending the Domain Manifest

We need new equipment types. Let's update `lib/domains/surface-treatment.ts`.

```typescript
// Additions to nodeTypes
EVAPORATOR: {
  id: "EVAPORATOR",
  label: "Vacuum Evaporator",
  iconName: "Flame", // Or 'Waves'
  color: "orange-500",
  fields: [
    { id: "capacity", label: "Max Capacity", type: "number", unit: "L/h" },
    { id: "recoveryRate", label: "Distillate Yield", type: "number", unit: "%", default: 90 },
    { id: "energy", label: "Energy Cons.", type: "number", unit: "kWh/m3", default: 150 }
  ]
},
STORAGE_TANK: {
  id: "STORAGE_TANK",
  label: "Buffer / Storage",
  iconName: "Cylinder",
  color: "slate-500",
  fields: [
    { id: "volume", label: "Capacity", type: "number", unit: "L" },
    // Critical: The Makeup Logic
    { id: "inletAuto", label: "Auto Makeup (City Water)", type: "boolean", default: false } 
  ]
}