---
title: "Chapter 3: Mathematical Modeling—From Linear Equations to the Matrix Approach"
slug: "st-tutorial-ch3-mathematical-modeling"
published: true
tags: "Mathematics, Solver, Matrix, Surface Treatment, Linear Algebra"
tutorial: Mastering Surface Treatment Engineering
order: 3
---

# Mathematical Modeling (Ax = b)

To build a simulation engine, we must translate the physical movements of the transporter and the flow of pipes into a system of equations. In this chapter, we will model a standard treatment sequence and demonstrate why the **Matrix Approach** is the only viable way to handle industrial complexity.

---

## The Scenario: A Three-Tank Line
Let's define a small "system" consisting of:
1.  **Bath (B):** A chrome plating bath maintained at $C_B = 250$ g/L.
2.  **Rinse 1 (R1):** The first rinsing stage.
3.  **Rinse 2 (R2):** The final rinsing stage, fed with fresh water.

**The Logistics (Transporter):**
*   Parts move from **B $\rightarrow$ R1 $\rightarrow$ R2**.
*   The drag-out flow is constant: $Q_d = 10$ L/h.

**The Hydraulics (Pipes):**
*   Fresh water $Q_w = 400$ L/h enters **R2**.
*   **Cascade:** R2 overflows into **R1**.
*   R1 overflows to the **Drain**.

---

## The Algebraic Solution (Step-by-Step)

We assume a **Steady State**: the mass of chrome entering a tank must equal the mass of chrome leaving it. Let $C_1$ be the concentration in R1 and $C_2$ the concentration in R2.

### Equation for Rinse 2 (The Cleanest Tank):

*   **In:** $Q_d \cdot C_1$ (coming from R1 via parts).
*   **Out:** $Q_d \cdot C_2$ (leaving via parts) + $Q_w \cdot C_2$ (leaving via overflow to R1).
*   **Balance:** $Q_d \cdot C_1 = (Q_d + Q_w) \cdot C_2$ 
*   $\Rightarrow C_2 = \frac{Q_d}{Q_d + Q_w} \cdot C_1$

### Equation for Rinse 1 (The Intermediate Tank):

*   **In:** $Q_d \cdot C_B$ (from Bath) + $Q_w \cdot C_2$ (overflow from R2).
*   **Out:** $Q_d \cdot C_1$ (to R2 via parts) + $Q_w \cdot C_1$ (to Drain via overflow).
*   **Balance:** $Q_d \cdot C_B + Q_w \cdot C_2 = (Q_d + Q_w) \cdot C_1$

### Exact Result:

By substituting $C_2$ into the R1 equation and using $Q_d=10, Q_w=400, C_B=250$:

1.  Calculate $C_1 \approx 6.23$ g/L.
2.  Calculate $C_2 \approx 0.15$ g/L.

**The Problem:** If we add evaporation, a spray in the bath, or a third rinse, solving this manually becomes a nightmare of substitutions.

---

## The Matricial Approach ($Ax = b$)

In computer science and complex engineering, we use **Linear Algebra**. We represent the entire line as a single matrix equation where **$x$** is the vector of unknown concentrations we want to find.

$$x = \begin{bmatrix} C_B \\ C_1 \\ C_2 \end{bmatrix}$$

### Building the Equations for the Matrix
We rewrite our mass balance equations so that all variables are on the left and constants are on the right:

1.  **For Bath (B):** $1 \cdot C_B = 250$ (Since it is a controlled process bath).
2.  **For Rinse 1:** $-Q_d \cdot C_B + (Q_d + Q_w) \cdot C_1 - Q_w \cdot C_2 = 0$
3.  **For Rinse 2:** $0 \cdot C_B - Q_d \cdot C_1 + (Q_d + Q_w) \cdot C_2 = 0$

### The $Ax = b$ Form
This system translates into:

$$
\begin{bmatrix} 
1 & 0 & 0 \\
-Q_d & (Q_d + Q_w) & -Q_w \\
0 & -Q_d & (Q_d + Q_w)
\end{bmatrix}
\cdot
\begin{bmatrix} C_B \\ C_1 \\ C_2 \end{bmatrix}
=
\begin{bmatrix} 250 \\ 0 \\ 0 \end{bmatrix}
$$

### Why this is the "Engine" of Quantum Core:

*   **The Diagonal:** Represents the **Total Outflow** of a tank ($Q_{drag\_out} + Q_{water\_out}$).
*   **The Off-Diagonal:** Represents the **Inflows** from other tanks. A negative sign indicates that a concentration from "Tank J" is contributing to "Tank I".
*   **Vector b:** Contains our "Sources"—the fixed concentrations of the process baths.

---

## Adding Physics: Evaporation & Sprays

The matrix approach handles complex physical constraints effortlessly by simply modifying the coefficients:

*   **Evaporation ($E$):** If a rinse tank has evaporation, the water leaving the tank is reduced. In the matrix, the term $(Q_d + Q_w)$ becomes $(Q_d + Q_w - E)$. The system will automatically check if $Q_w > E$ to prevent a negative water balance.
*   **Sprays:** If a spray in the Bath is fed by Rinse 1, it adds a new term in the Bath equation and the Rinse 1 equation.
*   **24h Evaporation:** In our Python solver, we will calculate an "Effective Evaporation Rate" by multiplying the 24/7 loss by $(168 / \text{WorkingHours})$, ensuring the mass balance is correct over a full production week.

## Numerical Resolution
In our Python engine (`solver.py`), we use the `numpy` library. The command is simple:
```python
import numpy as np
concentrations = np.linalg.solve(A, b)
```
This single line of code can solve a line with 200 tanks, 50 different ions, and complex recycling loops in less than 1 millisecond.

