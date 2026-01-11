---
title: "The Knowledge Base: Architecting a Recursive Industrial Library"
slug: "architecting-recursive-industrial-library"
published: true
tags: "Prisma, Data Structures, Recursive Relations, Zod, Full-Stack"
---

# The Knowledge Base: Architecting a Recursive Industrial Library

In a standard SaaS application, a "Product" is usually a flat row in a database: `Name`, `Price`, `SKU`.

In **Quantum Core**, an engineering resource is much more complex.
*   **A Chemical Product** (e.g., *Sulfuric Acid 98%*) is not just a string. It is a composition of atoms ($2 \times H^+$, $1 \times SO_4^{2-}$), with a specific density ($1.84$) and purity.
*   **A Machine Skid** is an assembly of a Pump, two Valves, and a Sensor.

To build a true **Software Factory**, we cannot hard-code these relationships. We need a **Recursive Library System** that allows domain experts to define the "DNA" of their industry.

This article explores how we implemented the **Library Manager**, the **Composition Engine**, and how this data feeds into the Python Solver.

---

## 1. The Data Structure: Recursive BOM (Bill of Materials)

The challenge is to model both atomic elements (Ions) and compound products (Reagents) in the same table, while allowing infinite nesting (A Skid contains a Tank, which contains a Heater...).

We use a **Self-Referential Many-to-Many Relationship** in Prisma.

**File:** `packages/database/prisma/schema.prisma`

```prisma
model LibraryItem {
  id            String   @id @default(cuid())
  domain        String   // "WATER"
  category      String   // "ION", "REAGENT", "PUMP", "ASSEMBLY"
  name          String   @unique
  
  // The "Physics" Payload (Density, Molar Mass, Power...)
  properties    Json     @db.JsonB 

  // Recursive Relations
  // 1. "I am composed of..." (Downstream)
  components    Composition[] @relation("parentItem")
  
  // 2. "I am used in..." (Upstream)
  usedIn        Composition[] @relation("childItem")
}

model Composition {
  id        String      @id @default(cuid())
  
  parentId  String
  parent    LibraryItem @relation("parentItem", fields: [parentId], references: [id])
  
  childId   String
  child     LibraryItem @relation("childItem", fields: [childId], references: [id])

  quantity  Float   // e.g., 2.0 (Stoichiometry) or 1.0 (Count)
  unit      String? // "mol", "pcs", "%"
}