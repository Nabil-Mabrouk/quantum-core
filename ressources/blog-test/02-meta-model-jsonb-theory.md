---
title: "Modeling the Universe: Nodes, Edges, and JSONB"
slug: "theory-meta-model-jsonb"
published: true
tags: "Architecture, Database, PostgreSQL"
---

# How to Store Any Physical System

The greatest challenge of a generic engineering framework is the database schema. How can one table store both the molar mass of a chemical ion and the peak voltage of a transformer?

### The JSONB Revolution
Quantum Core utilizes PostgreSQL's **JSONB** type. Our schema is reduced to its mathematical essentials:

*   **Nodes**: Representing equipment (Process), inputs (Source), or outputs (Sink).
*   **Edges**: Representing the flow (Physical or Logical) between nodes.
*   **Properties**: A JSONB blob that holds the domain-specific data.

### Topological Roles
To ensure mathematical consistency, every Node in Quantum Core is assigned a **Functional Role**:
*   **SOURCE**: Nodes with only outgoing flows (e.g., Water Mains, Power Grid).
*   **PROCESS**: Nodes that transform or store mass/energy (e.g., Reaction Tanks, Batteries).
*   **SINK**: Nodes that accumulate final outputs (e.g., Waste Treatment, Earth).

This abstraction allows our Python Engine to build universal transfer matrices ($Ax = B$) regardless of the industry.