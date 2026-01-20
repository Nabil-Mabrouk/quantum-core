---
title: "Developer Cheatsheet & Troubleshooting"
slug: "developer-cheatsheet-troubleshooting"
published: true
tags: "Devs"
---

# Appendix: Developer Cheatsheet & Troubleshooting

This section serves as a quick reference for daily operations. It aggregates the most common commands, file paths, and solutions to frequent issues encountered during development and deployment.

### A.1 Essential Command Reference

Run these commands from the **root** of the monorepo.

| Action | Command | Context |
| :--- | :--- | :--- |
| **Start Stack** | `pnpm dev` | Starts Next.js (Studio) + Docker containers (DB/Engine) |
| **Start DB Only** | `docker-compose up -d postgres` | Useful when working on Prisma schema |
| **Start Engine Only** | `docker-compose up -d --build engine` | Useful when debugging Python logic |
| **Sync DB (Dev)** | `pnpm db:push` | Fast schema update (Data loss risk) |
| **Sync DB (Prod)** | `npx prisma migrate deploy` | Safe schema update (requires migration file) |
| **Generate Types** | `pnpm db:generate` | Update TypeScript definitions after schema change |
| **View Data** | `npx prisma studio` | Opens web UI to browse database rows |
| **Lint Code** | `pnpm lint` | Checks for code style and errors |

### A.2 "Where is X?" - File Map

A quick lookup guide for the most important files in the architecture.

| Concept | File Location | Responsibility |
| :--- | :--- | :--- |
| **Domain Config** | `apps/studio/lib/domains/*.ts` | Defines the assets (Nodes) and inputs (Fields). |
| **Registry** | `apps/studio/lib/component-registry.tsx` | Maps config IDs to React components. |
| **React Nodes** | `apps/studio/components/canvas/smart-node.tsx` | The generic visual component for equipment. |
| **Python Logic** | `apps/engine/domains/[domain]/solver.py` | The math/physics calculation code. |
| **Database Schema** | `packages/database/prisma/schema.prisma` | The SQL structure definition. |
| **Canvas State** | `apps/studio/store/canvas-store.ts` | Frontend state management (Zustand). |
| **Server Actions** | `apps/studio/app/actions/*.ts` | API layer bridging Client, DB, and Engine. |

### A.3 Troubleshooting FAQ

#### Q: I added a field to the Manifest, but it doesn't show up.
**A:** Check `apps/studio/lib/registry.ts`. Did you uncomment/import your new domain config file? Also, ensure your Node Type ID in the manifest matches the ID used in the `nodeTypes` object keys exactly.

#### Q: The Simulation returns "403 Forbidden".
**A:** This is a security mismatch.
1. Check `apps/studio/.env.local`: `INTERNAL_API_SECRET`.
2. Check `docker-compose.yml` or `apps/engine/.env`: `INTERNAL_API_SECRET`.
3. They must be identical strings. Restart the engine container after changing it.

#### Q: I get "PrismaClientInitializationError" in the logs.
**A:** The Studio cannot reach the Database.
1. Is the Docker container running? (`docker-compose ps`)
2. Is the port correct? Default is `5434` (mapped to internal 5432).
3. Check `DATABASE_URL` in `.env`. It should look like: `postgresql://quantum:password@localhost:5434/quantum_core?schema=public`

#### Q: My changes to `solver.py` are not applied.
**A:** Python inside Docker does not "hot reload" automatically in production mode.
**Fix:** Run `docker-compose restart engine`.

#### Q: The canvas is blank or crashes on load.
**A:** This often happens if the `System` or `Project` ID in the URL is invalid or doesn't belong to you.
1. Check your URL: `/editor/[valid-project-id]?systemId=[valid-system-id]`.
2. Check browser console for "Hydration Error" (rare in this codebase, but possible if you render Date objects directly).

### A.4 Deployment Checklist

Before going live (Production):

1.  [ ] **Secrets Rotation:** Replace all placeholder secrets in `.env` files.
2.  [ ] **Build Check:** Run `pnpm build` locally to ensure no Type errors.
3.  [ ] **Database Migration:** Run `prisma migrate deploy` on the production DB.
4.  [ ] **Seed Data:** Log in as Admin and click the "Seed" icons to populate the Library tables.
5.  [ ] **Environment Variables:** Ensure `ENGINE_URL` points to the internal Docker network alias (e.g., `http://engine:8000`) and not `localhost`.

---

**End of Documentation.** You are now fully equipped to maintain, extend, and deploy Quantum Core. Happy Engineering!