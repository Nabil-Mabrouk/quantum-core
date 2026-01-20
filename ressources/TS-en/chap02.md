---
title: "2-The Physics of the Tank: Mass Balance & Evaporation"
slug: "st-tutorial-ch2-tank-physics"
published: true
tags: "Surface Treatment, Mass Balance, Evaporation"
tutorial: Mastering Surface Treatment Engineering
order: 2
---

# The Life of a Tank (Physics & Logistics)

In this chapter, we move from the industrial landscape into the heart of the workshop. To build a Digital Twin, we must treat every tank in a treatment line not as a static container, but as a **dynamic chemical reactor**. 

A surface treatment line is a sequence of tanks where parts are transported—usually by an automated crane or transporter—from one environment to the next. This movement creates a complex web of "invisible" material flows.

---

## The Logistic Flow: Drag-out (Entraînement)

The most critical physical phenomenon in surface treatment is **Drag-out**. When a rack of parts leaves a tank, it carries a film of liquid on its surface.

### The Calculation

The volume of liquid leaving the tank per hour ($Q_{drag}$) is defined by:
$$Q_{drag} (L/h) = S (m^2/h) \times q_{spec} (L/m^2)$$

*   **$S$**: The total surface area of parts processed per hour.
*   **$q_{spec}$**: The specific drag-out, which depends on the part geometry (flat parts vs. hollow parts) and the drainage time.

### The "Drag-in" Effect

Except for the very first tank in a line, every tank receives a "Drag-in" volume from the previous tank. 

*   **Mass Transfer:** This means Tank $N$ is constantly "polluted" by the chemistry of Tank $N-1$.
*   **Chemical Loss:** In a process bath, the operator must compensate for the chemicals lost via drag-out by adding fresh products. If the volume of these chemical additions differs from the drag-out volume, the level must be topped up with water.

---

## The Thermodynamic Loss: Evaporation

Process tanks are often heated (e.g., degreasing at 70°C or chrome plating at 55°C). This leads to significant water loss through evaporation.

### Factors Influencing Evaporation

Our solver must take into account a specific set of variables to calculate the hourly evaporation rate ($Q_{evap}$):

1.  **Tank Dimensions:** The surface area ($Length \times Width$) exposed to air.
2.  **Temperatures:** Both the bath temperature ($T_{bath}$) and the workshop ambient temperature ($T_{air}$).
3.  **Agitation:** Air bubbling or mechanical movement increases the exchange surface and the evaporation rate.
4.  **Humidity:** The relative humidity of the workshop air.
5.  **Covers:** The presence or absence of tank covers (which can reduce evaporation by up to 90%).

### The "24h Operation" Paradox

This is a major challenge for mass balance accuracy. 

*   **The Workshop Schedule:** Operates for a fixed duration (e.g., 8h/day, 5 days/week).
*   **The Equipment Schedule:** Ventilation and heating systems often run **24h/day** to keep the baths ready.
*   **The Logic:** Evaporation occurs 24/7, but **compensation** (adding water) only happens during working hours when the water valves are active. Our Digital Twin must calculate losses over the full week while balancing them against the limited working hours.

---

## Rinsing Strategies: Cascades and Sprays

Rinsing is the act of removing chemical films from the parts using water. The efficiency of this step dictates the quality of the final product and the cost of waste treatment.

### Rinse Tank Dynamics

A rinse tank has a complex water balance:

*   **Inlet:** Can be fed by clean water (source) or by the **overflow** of a subsequent rinse tank.
*   **Cascade Rinsing:** In a "Counter-current Cascade," clean water enters the *last* rinse and overflows into the *previous* one. This maximizes dilution while minimizing water consumption.
*   **Outlets:** The overflow can be directed to another tank, to a storage unit, or directly to a **Drain Network** (Acidic or Alkaline).

### Spray Rinsing (The Hybrid Solution)

Sprays can be installed on top of either process tanks or rinse tanks.

1.  **In Process Tanks:** Sprays are fed with clean water or water from the first rinse. The flow rate is ideally set to **exactly match the evaporation rate**.
2.  **Benefit:** This creates an "instant rinse" that reduces the concentration of the liquid film on the parts *before* they leave the tank, while simultaneously keeping the bath level constant without additional top-up valves.

---

## Damping and Waste Management

Tanks are not just subject to continuous flows; they also undergo **Batch Operations**.

### Damping (Vidange)
Based on a defined frequency (e.g., 4 times per year), a tank is completely emptied for cleaning or because the chemistry is exhausted.

*   **Drain Networks:** The system must track where this volume goes. A workshop typically has separate networks: **Acidic, Alkaline, Cyanide, or Chromic**.
*   **WWTP Sizing:** By calculating these damping volumes, we provide the data necessary to size the Waste Water Treatment Plant (WWTP).

---

## The Goal of the Simulation

By integrating all the factors above, our Quantum Core solver aims to solve two interconnected balances:

1.  **The Water Balance:** Ensures that for every tank, $Inlets \ge Outlets + Evaporation$. If not, the system must trigger a "Low Level" warning.
2.  **The Ionic/Chemical Balance:** Knowing the initial composition of the process baths, we calculate the steady-state concentration of every ion ($Ni^{2+}, Cr^{6+}, OH^-, etc.$) in every single tank of the line.

This allows the engineer to answer the most important question: **"Is my rinsing efficient enough to avoid cross-contamination, and how much is it costing me in water and chemistry?"**

