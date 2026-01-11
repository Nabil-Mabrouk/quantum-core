---
title: "From Atoms to JSON: Modeling Physics in TypeScript"
slug: "modeling-physics-typescript-zod"
published: true
tags: "TypeScript, Prisma, Data Modeling, Zod, Architecture"
---

# From Atoms to JSON: Modeling Physics in TypeScript

In a typical web application, adding a new feature usually means a database migration. You want to add a `viscosity` field to your `Pumps` table? Run `prisma migrate dev`.

But **Quantum Core** is not a typical application. It is an **Engineering OS**. Today, it simulates Water Treatment. Tomorrow, it might need to simulate District Heating or Chemical Reactions. If we ran a migration for every physical property required by every engineering vertical, our database schema would contain thousands of sparse columns (`pump_viscosity`, `cable_voltage`, `pipe_roughness`...), and our development velocity would grind to a halt.

In this article, we explore how Quantum Core solves the **"Schema Bottleneck"** using a **Domain Manifest** pattern. We will build a new domain from scratch: **Chemical Processing**.

---

## 1. The "Meta-Model": A Schema for Schemas

Instead of defining physical objects in PostgreSQL, we define a **Meta-Model** in TypeScript. This acts as a Domain Specific Language (DSL) that describes what an object *is*, what data it *holds*, and how it *behaves*.

The core type definition resides in `lib/domain-config.ts`. This is the contract that every domain must fulfill.

```typescript
// lib/domain-config.ts

export type FieldDefinition = {
  id: string;           // The key in the JSONB object (e.g., "impellerSpeed")
  label: string;        // Human-readable label (e.g., "Impeller Speed")
  type: 'number' | 'string' | 'boolean' | 'select'; 
  unit?: string;        // e.g., "RPM", "m3/h"
  default?: any;        // Fallback value
  options?: string[];   // For select inputs
};

export type NodeSchema = {
  id: string;           // Internal Type ID (e.g., "REACTOR")
  label: string;        // Display Name
  iconName: string;     // Lucide Icon Name
  color: string;        // UI Theme Color
  fields: FieldDefinition[]; // The dynamic data structure
};

export type DomainManifest = {
  id: string;
  name: string;
  nodeTypes: Record<string, NodeSchema>;
  edgeTypes: Record<string, EdgeSchema>;
};