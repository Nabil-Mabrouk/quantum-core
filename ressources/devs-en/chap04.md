---
title: "Monitoring & Observability"
slug: "monitoring-observability"
published: true
tags: "Devs"
---

# (Tuto 4/10) Monitoring & Observability

In an industrial context, "It works on my machine" is not enough. You need to know *who* is doing *what*, and if the system is healthy.

Quantum Core implements a **Dual-Layer Observability** strategy:
1.  **System Logs (DevOps):** Raw output from containers (crashes, network errors).
2.  **Audit Trails (Business):** Structured records of user actions (simulations run, feedback sent, projects created) stored in the database.

### 4.1 The Admin Command Center

The application ships with a built-in Administration Hub restricted to users with the `ADMIN` role. This is your primary interface for day-to-day monitoring without touching the command line.

**Access:** `https://your-domain.com/admin` (or `/admin/stats`)

#### Key Sections:
*   **KPIs (Command Center):** Real-time metrics on user acquisition (Leads), active projects, and conversion rates.
*   **Observability (Logs):** A searchable interface for the Audit Trail.
*   **Content (Expertise):** Management of the technical blog/knowledge base.

### 4.2 The Audit Trail System

Unlike standard server logs which are ephemeral (lost on restart), the Audit Trail is persistent. It is designed for **traceability** and **compliance**.

#### How it works
The system uses a dedicated Server Action `recordAuditLog` (`apps/studio/app/actions/audit.ts`) to write events to the `AuditLog` table in PostgreSQL.

**Recorded Events include:**
*   `SIMULATION_RUN`: Every time a user triggers a calculation (useful to track compute costs).
*   `AI_CHAT_STREAM`: usage of the LLM assistant (token usage proxy).
*   `FEEDBACK_SUBMITTED`: Direct reports from users.
*   `ERROR`: Critical application failures caught by boundary handlers.

#### Viewing Logs
Navigate to **Admin > System Logs**.
The `LogsDashboard` component allows you to:
1.  **Filter by Severity:** Quickly isolate Errors vs. Info.
2.  **Inspect Payloads:** Click the "Eye" icon to see the JSON context (e.g., which specific Project ID caused a crash).
3.  **Search:** Find all actions performed by a specific User email.

### 4.3 Maintenance: Log Rotation

Over time, the `AuditLog` table will grow. A "Purge" mechanism is implemented to keep the database performant.

**Manual Cleanup:**
1.  Go to **Admin > System Logs**.
2.  Click the **"Purge Old Logs"** button.
3.  This triggers `clearOldLogsAction`, which deletes records older than 30 days.

*Pedagogical Note for DevOps:* In a high-traffic production environment, you should automate this. You can set up a cron job to call this action or run a SQL query directly:
```sql
DELETE FROM "AuditLog" WHERE "createdAt" < NOW() - INTERVAL '90 days';
```

### 4.4 System Health Checks

If users report "The system is down," follow this diagnosis flowchart:

#### 1. Check Container Status
Are the Docker containers actually running?
```bash
docker-compose ps
```
*   **Healthy:** `Up` status for `studio`, `engine`, and `postgres`.
*   **Unhealthy:** `Exit 1` or `Restarting`.

#### 2. Check Database Connectivity
Is the Studio connected to Postgres?
*   Go to the **Admin Hub** main page (`/admin`).
*   Look at the Footer. There is a **"Base de données: Connectée"** indicator.
*   *How it works:* The page attempts a lightweight DB query (`db.user.count()`) on render. If it fails, the page will error out or show a disconnected state.

#### 3. Check Python Engine Link
Is the bridge active?
*   There is no persistent connection to check (stateless).
*   **Test:** Create a "Hello World" project, add one Source and one Sink, and click "Simulate".
*   **Success:** The "Console" drawer opens and shows progress.
*   **Failure:** A Red Toast notification appears. Check `docker logs qcore_engine` immediately.

### 4.5 Backup Strategy

Data is the most valuable asset. Since all state is in PostgreSQL, backing up is straightforward.

**Backup Command:**
```bash
docker exec -t qcore_db pg_dumpall -c -U quantum > dump_$(date +%Y-%m-%d).sql
```

**Restore Command:**
```bash
cat dump_2026-01-17.sql | docker exec -i qcore_db psql -U quantum -d quantum_core
```
