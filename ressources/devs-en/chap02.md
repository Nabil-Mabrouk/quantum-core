---
title: "Database Management & Migrations"
slug: "database-management-migrations"
published: true
tags: "Devs"
---
# (Tuto 2/10) Database Management & Migrations

In **Quantum Core**, the database is the "Source of Truth". It stores everything: user accounts, project configurations, engineering graphs, and the chemical libraries.

We use **PostgreSQL** as the database engine and **Prisma ORM** to interact with it. In this Monorepo architecture, the database logic is isolated in a shared package located at `packages/database`. This ensures that both the Studio (Next.js) and potentially other services share the exact same data types.

### 2.1 The Data Architecture

Before running commands, it is crucial to understand where the data logic lives:

*   **Schema Definition:** `packages/database/prisma/schema.prisma`
    *   This file defines your tables (Models) and relationships.
*   **Database Client:** `packages/database/index.ts`
    *   This exports the `db` object used throughout the application.
*   **Connection String:** Defined in your `.env` file as `DATABASE_URL`.

**Pedagogical Note:** When you change the `schema.prisma` file, you are changing the *blueprint*. You must then "apply" this blueprint to the actual PostgreSQL container and "generate" the TypeScript types so the code knows about the changes.

### 2.2 Starting the Database Container

Quantum Core includes a pre-configured Docker setup for PostgreSQL.

1.  **Start the Database:**
    From the root of the project, run:
    ```bash
    docker-compose up -d postgres
    ```

2.  **Verify Connection:**
    The `docker-compose.yml` maps the internal port `5432` to your machine's port **`5434`** (to avoid conflicts if you already have Postgres installed locally).
    *   **Host:** `localhost`
    *   **Port:** `5434`
    *   **User:** `quantum`
    *   **Password:** `password`
    *   **Database:** `quantum_core`

### 2.3 Synchronizing the Schema (Dev vs. Prod)

There are two ways to sync your Prisma schema with the database. Choosing the wrong one can lead to data loss.

#### A. The Development Method (`db:push`)
This is what is currently configured in `turbo.json`. It looks at your schema and forces the database to match it. It is fast and great for prototyping.

**Command (from root):**
```bash
pnpm db:push
```

*   **What it does:** Updates the DB structure immediately.
*   **⚠️ Risk:** If you renamed a column, it might delete the old one and create a new one, losing data. **Do not use this on a production database with real data.**

#### B. The Production Method (Migrations)
For a stable production environment, you should use Migrations. This creates a history file (`.sql`) of every change.

**1. Create a Migration (Development):**
When you modify `schema.prisma`:
```bash
# Go to the database package
cd packages/database
npx prisma migrate dev --name describe_your_change
```

**2. Apply Migrations (Production/CI):**
On your server or CI/CD pipeline:
```bash
npx prisma migrate deploy
```

### 2.4 Generating the Client (Type Safety)

Every time the schema changes, the TypeScript types (`node_modules/@prisma/client`) must be regenerated. If you see errors like `Property 'cost' does not exist on type 'Node'`, it means your client is out of sync.

**Command (from root):**
```bash
pnpm db:generate
```

*Tip: Turborepo is configured to run this automatically when you run `pnpm build`, but during development, you might need to trigger it manually after a schema edit.*

### 2.5 Seeding Initial Data

A fresh installation of Quantum Core is empty. You need to inject the "Master Data" (Initial Admin User and Libraries).

#### 1. Creating the First Admin
Since the application restricts registration to invites or specific domains, you often need to manually insert the first Admin user to access the `/admin` dashboard.

You can use **Prisma Studio**, a visual editor built-in:

1.  Run `npx prisma studio` (inside `packages/database` or root).
2.  It opens a web page at `http://localhost:5555`.
3.  Select the **User** model.
4.  Click **Add Record**:
    *   **Email:** `admin@quantum.corp`
    *   **Role:** `ADMIN` (Crucial: Select ADMIN from the dropdown enum)
    *   **Name:** `System Admin`
5.  Click **Save Changes**.

Now you can log in via the Login page with this email (using the Magic Link / Console output in dev mode).

#### 2. Hydrating the Libraries (Catalog & Chemistry)
The application contains built-in "Seeders" triggered via the UI to populate the engineering libraries.

1.  Log in as the **Admin** you just created.
2.  Navigate to the Dashboard.
3.  Look for the **Database Icons** in the top navigation bar (Header).
    *   **Icon 1 (Database):** Imports the Hardware Catalog (Pumps, Tanks, Sensors).
    *   **Icon 2 (Flask):** Imports the Chemical Library (Ions, Reagents for the H2O domain).
4.  Click them once. You will see "toast" notifications confirming the import.

### 2.6 Troubleshooting Common Issues

**Error: `P1001: Can't reach database server at localhost:5434`**
*   **Cause:** The Docker container is not running.
*   **Fix:** Run `docker-compose ps`. If `postgres` is not listed, run `docker-compose up -d postgres`.

**Error: `The table public.User does not exist in the current database`**
*   **Cause:** You connected to the DB, but the tables haven't been created yet.
*   **Fix:** Run `pnpm db:push` to create the table structure.

**Error: `Client is not compatible with the schema`**
*   **Cause:** You updated `schema.prisma` but didn't update the generated files.
*   **Fix:** Run `pnpm db:generate`.
