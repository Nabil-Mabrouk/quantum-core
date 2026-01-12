---
title: "Case Study 1: Modeling a Counter-Current Rinse Cascade (Sodium Hydroxide)"
slug: "case-study-sodium-hydroxide-cascade"
published: true
tags: "Tutorial, Surface Treatment, Chemistry, Mass Balance, JSON"
---

# Case Study 1: Modeling a Counter-Current Rinse Cascade

In the Surface Treatment industry, the most common optimization problem is the **Rinse Cascade**.

We have a production line with a **Degreasing Bath** (saturated with Sodium Hydroxide) followed by two **Rinse Tanks**.
*   If we simply dump fresh water into each rinse tank individually, we waste huge amounts of water.
*   If we use a **Counter-Current** strategy (Clean water enters Rinse 2, overflows to Rinse 1, then drains), we save water while maintaining rinse quality.

But how efficient is it? And what is the exact concentration of Sodium ($Na^+$) rejected into the sewer?

In this tutorial, we will model this specific scenario in **Quantum Core**, covering the entire stack: from the **JSON Chemical Library** to the **Matrix Solver**.

---

## 1. The Physics: Solving it by Hand

Before coding, we must understand the math to verify our software later.

### The Scenario
1.  **Tank 0 (Degreasing):** Concentration $C_0 = 50$ g/L of NaOH (100%).
2.  **Sequence:** Parts go $T_0 \to T_1 \to T_2$.
3.  **Drag-out ($q_d$):** The flow carried by the parts is **10 L/h**.
4.  **Rinsing:** Clean water ($Q_{fresh}$) enters $T_2$ at **100 L/h**.
5.  **Cascade:** $T_2$ overflows into $T_1$. $T_1$ overflows to the Drain.

### The Equations (Steady State)
We are looking for the concentration of Sodium ($Na^+$) in the rinse tanks.

*   **Step A: Molar Mass Calculation**
    *   $NaOH = 40$ g/mol. $Na = 23$ g/mol.
    *   Ratio $R = 23/40 = 0.575$.
    *   Concentration of $Na^+$ in $T_0$ is $50 \times 0.575 = \mathbf{28.75}$ g/L.

*   **Step B: Mass Balance Equations**
    *   *Equation for Tank 2 (Rinse 2):*
        Input (Drag from T1) = Output (Drag to Exit + Overflow to T1)
        $$ C_1 \cdot q_d = C_2 (q_d + Q_{fresh}) $$
        $$ 10 C_1 = 110 C_2 \implies C_1 = 11 C_2 $$

    *   *Equation for Tank 1 (Rinse 1):*
        Input (Drag from T0 + Overflow from T2) = Output (Drag to T2 + Overflow to Drain)
        $$ C_0 \cdot q_d + C_2 \cdot Q_{fresh} = C_1 (q_d + Q_{fresh}) $$
        $$ 28.75 \cdot 10 + 100 C_2 = 110 C_1 $$

*   **Step C: The Result**
    Solving this system yields:
    *   **Tank 1 ($C_1$):** $\approx 2.85$ g/L of Na.
    *   **Tank 2 ($C_2$):** $\approx 0.26$ g/L of Na.

Now, let's make Quantum Core calculate this automatically.

---

## 2. Step 1: The Domain Manifest

We need to define the "Vocabulary" of our line. We need generic Tanks, but we also need to distinguish between a **Process Bath** (fixed concentration source) and a **Rinse Tank** (variable concentration).

**File:** `apps/studio/lib/domains/surface-treatment.ts`

```typescript
export const SURFACE_TREATMENT_CONFIG = {
  id: "SURFACE_TREATMENT",
  name: "Surface Treatment",
  libraries: [
    { id: 'chemistry', label: 'Chemistry', iconName: 'FlaskConical', type: 'COMPOUND', categories: ['ION', 'REAGENT'] }
  ],
  nodeTypes: {
    // The Source of Pollution
    PROCESS_BATH: {
      id: "PROCESS_BATH",
      label: "Active Bath",
      iconName: "Beaker",
      color: "purple-600",
      fields: [
        { id: "volume", label: "Volume", type: "number", unit: "L", default: 1000 },
        // Connects to the Library
        { id: "chemistry", label: "Chemical Product", type: "library-selector", category: "REAGENT" },
        { id: "concentration", label: "Concentration", type: "number", unit: "g/L", default: 50 },
        { id: "temp", label: "Temperature", type: "number", unit: "°C", default: 20 }
      ]
    },
    // The Dilution Tank
    RINSE_TANK: {
      id: "RINSE_TANK",
      label: "Rinse Tank",
      iconName: "Droplets",
      color: "blue-500",
      fields: [
        { id: "volume", label: "Volume", type: "number", unit: "L", default: 1000 },
        // Water Supply Configuration
        { id: "waterInlet", label: "Water Source", type: "select", options: ["NONE", "FRESH_WATER"], default: "NONE" },
        { id: "inletFlow", label: "Inlet Flow", type: "number", unit: "L/h", default: 0 }
      ]
    },
    // The Sewer
    DRAIN: {
      id: "DRAIN",
      label: "Sewer / Network",
      iconName: "Waves",
      color: "emerald-600",
      fields: []
    }
  },
  edgeTypes: {
    PIPE: {
      id: "PIPE",
      label: "Pipe",
      fields: [
        { id: "type", label: "Type", type: "select", options: ["OVERFLOW", "PUMP"], default: "OVERFLOW" }
      ]
    }
  }
};