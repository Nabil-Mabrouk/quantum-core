---
title: "The Hybrid Brain: Next.js + FastAPI Architecture"
slug: "architecture-hybrid-stack"
published: true
tags: "Architecture, Python, TypeScript"
---

# Orchestration meets Calculation

Quantum Core is built on a "Split-Brain" architecture designed for high-performance engineering.

### Left Brain: Next.js (The Orchestrator)
Next.js handles the human-centric tasks:
*   **Auth & Security**: Managing users and project isolation.
*   **UX/UI**: The ReactFlow canvas and dynamic property panels.
*   **Persistence**: Communicating with PostgreSQL via Prisma 7.

### Right Brain: FastAPI (The Scientist)
Python is the native language of engineers. Our calculation engine uses **NumPy** for deterministic linear algebra. 

### The Synapse: Secure S2S Communication
When an engineer clicks "Simulate," Next.js sends a structured JSON payload to FastAPI. This communication is secured by an **Internal API Secret**. Python receives the graph, builds the mass balance equations, solves them using optimized C-extensions, and returns KPIs in milliseconds.

This decoupling ensures that heavy scientific calculations never block the user interface.