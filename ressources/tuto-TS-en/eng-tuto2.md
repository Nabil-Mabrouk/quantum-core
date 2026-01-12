---
title: "Case Study 2: Multi-Stage Treatment & The 3-Tank Cascade (Hydrochloric Acid)"
slug: "case-study-multi-stage-etching-cascade"
published: true
tags: "Tutorial, Surface Treatment, Linear Algebra, Recursion"
---

# Case Study 2: Multi-Stage Treatment & The 3-Tank Cascade

In the previous tutorial, we solved a simple 2-tank rinse system. Now, we will simulate a realistic, multi-process production line.

**The Scenario:**
After degreasing (removing oil), parts must be **Etched** (removing oxides) using Hydrochloric Acid (HCl). Because HCl is aggressive and corrosive, it requires a more rigorous rinsing process: a **Triple Cascade**.

**The Line Configuration:**
1.  **Degreasing (NaOH):** 50 g/L (From Case Study 1).
2.  **Rinse 1 & 2:** Double Cascade.
3.  **Etching (HCl):** 100 g/L.
4.  **Rinse 3, 4, 5:** Triple Cascade.

We want to calculate the Chloride ($Cl^-$) concentration in the final rinse ($T_6$) to ensure the parts are perfectly clean before drying.

---

## 1. The Physics: Solving the Triple Cascade

Let's focus on the new section: The Etching + 3 Rinses.

### Parameters
*   **Tank 3 (Etching):** 100 g/L of HCl.
*   **Sequence:** Parts go $T_3 \to T_4 \to T_5 \to T_6$.
*   **Drag-out ($q_d$):** 10 L/h.
*   **Rinsing:** Fresh water ($Q_{fresh}$) enters $T_6$ at **100 L/h**.
*   **Cascade:** $T_6 \to T_5 \to T_4 \to \text{Drain}$.

### Step A: Chemistry
*   $H = 1$ g/mol, $Cl = 35.5$ g/mol. $HCl = 36.5$ g/mol.
*   Ratio $Cl^- = 35.5 / 36.5 \approx \mathbf{0.9726}$.
*   Concentration of $Cl^-$ in Active Bath ($T_3$) = $100 \times 0.9726 = \mathbf{97.26}$ g/L.

### Step B: The Geometric Progression
In a perfect counter-current system where $Q_{fresh} \gg q_d$, the concentration drops by a factor of $R = (Q_{fresh} + q_d) / q_d$ at each step.
Here, $R = (100 + 10) / 10 = 11$.

Let's verify this with the exact Mass Balance equations for 3 tanks.

1.  **Tank 6 (Last Rinse):**
    *   $In = Out \implies 10 \cdot C_5 = (10 + 100) \cdot C_6$.
    *   $C_5 = 11 \cdot C_6$.

2.  **Tank 5 (Middle Rinse):**
    *   $10 \cdot C_4 + 100 \cdot C_6 = 110 \cdot C_5$.
    *   Substitute $C_6$: $10 \cdot C_4 + 100 \cdot (C_5/11) = 110 \cdot C_5$.
    *   Solving leads to: $C_4 = 111 \cdot C_6$.

3.  **Tank 4 (First Rinse):**
    *   $Load_{in} + 100 \cdot C_5 = 110 \cdot C_4$.
    *   $Load_{in} = 97.26 \text{ g/L} \times 10 \text{ L/h} = 972.6 \text{ g/h}$.
    *   Solving leads to: $972.6 \propto 1111 \cdot C_6$ (Approximation).

**Analytical Solution:**
*   $C_6 \text{ (Final)} \approx 97.26 / 11^3 \approx \mathbf{0.073}$ g/L.
*   $C_5 \approx 0.80$ g/L.
*   $C_4 \approx 8.8$ g/L.

Let's implement this in Quantum Core and see if the Matrix Solver agrees.

---

## 2. Step 1: Extending the Library (JSON)

We need to add Hydrochloric Acid to our knowledge base. We update the JSON file used in the previous tutorial.

**File:** `surface-chemistry.json`

```json
[
  // ... Previous entries (Sodium, Hydroxide, Caustic Soda) ...
  {
    "name": "Chlorine",
    "category": "ION",
    "symbol": "Cl-",
    "properties": { "molarMass": 35.5, "charge": -1 }
  },
  {
    "name": "Proton",
    "category": "ION",
    "symbol": "H+",
    "properties": { "molarMass": 1.0, "charge": 1 }
  },
  {
    "name": "Hydrochloric Acid (33%)",
    "category": "REAGENT",
    "properties": { "density": 1.16 },
    "composition": [
      { "childName": "Proton", "quantity": 1, "unit": "mol" },
      { "childName": "Chlorine", "quantity": 1, "unit": "mol" }
    ]
  }
]