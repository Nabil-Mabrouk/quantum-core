---
title: "Smart Sequences: Modelling Movement and Mass Transfer"
slug: "theory-logical-sequences"
published: true
tags: "Engineering, Process-Design, Math"
---

# Beyond Static Pipes

In many industrial processes, such as electroplating or assembly lines, the movement of parts is just as important as the flow through pipes. This is the **Logical Topology**.

### Physical vs. Logical Edges
Quantum Core manages two layers of connectivity:
1.  **Physical Edges**: Drawn on the canvas (Pipes, Wires, Conveyors).
2.  **Logical Sequences (Gammes)**: A list of ordered steps defining the path of a part through the system.

### Mathematical Implementation of Drag-out
When a part moves from Node A to Node B, it carries a small amount of liquid or energy with it. In our Python solver, this is treated as a **Virtual Flow**:
$$ Q_{drag} = \text{Cadence} \times \text{Drag-out Factor} $$

By merging the Physical and Logical graphs into a single transfer matrix, Quantum Core provides a holistic view of pollution and efficiency that static P&ID tools cannot achieve.