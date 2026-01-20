---
title: "The Python Engine Integration"
slug: "python-engine-integration"
published: true
tags: "Devs"
---

# (Tuto 3/10) The Python Engine Integration

If the Studio (Next.js) is the "Body" of Quantum Core, handling the user interface and data storage, the **Engine** is its "Brain".

This chapter explains how the scientific calculation layer operates, how it communicates with the rest of the system, and how to monitor it in a production environment.

### 3.1 Architecture: The Stateless Calculator

The most important concept to understand about the Engine (`apps/engine`) is that it is **stateless**.

*   It does **not** connect to the database.
*   It does **not** know who the user is.
*   It does **not** remember previous calculations.

**How it works:**
1.  It waits for a request containing a full description of a system (Nodes, Pipes, Chemical Recipes).
2.  It builds a mathematical model (Matrices).
3.  It solves the model (Linear Algebra).
4.  It returns the results and immediately forgets everything.

**Pedagogical Note:** This design makes the engine very robust. You can restart the Python container at any time without losing any user data. If the engine crashes, it only affects the specific calculation running at that millisecond.

### 3.2 The Communication Bridge

The Studio talks to the Engine via **HTTP POST** requests. This communication happens entirely **server-side**. The user's browser never talks to the Python engine directly; the Next.js server acts as a proxy.

**The Flow:**
1.  **User Action:** User clicks "Simulate" in the browser.
2.  **Server Action:** Next.js triggers `actions/simulation.ts`.
3.  **Transformation:** The code converts the database format (Visual Nodes) into the Physics format (Topology Lists).
4.  **The Call:** Next.js sends a POST request to `ENGINE_URL` (defined in `.env`) with the `INTERNAL_API_SECRET` header.
5.  **Response:** Python returns the calculated values (Flow rates, Concentrations).
6.  **Update:** Next.js updates the Database and the UI stores via Server Actions.

### 3.3 Monitoring the Brain

Because the engine performs complex math, it is the most likely component to encounter "logical" errors (e.g., dividing by zero if a user designs a bad pipe network).

#### A. Docker Logs (The Raw Feed)
To see exactly what the engine is doing, view the container logs. The engine uses a custom JSON logger for machine-readable output.

```bash
docker logs -f qcore_engine
```

**Example Output:**
```json
{
  "timestamp": "2026-01-17 14:05:00",
  "level": "INFO",
  "message": "Simulation demandée pour : SURFACE_TREATMENT",
  "project_id": "cm1...",
  "path": "/simulate-stream",
  "process_time": "0.452s"
}
```

#### B. The Simulation Console (The UI Feed)
The application implements a **Streaming Response**. When a simulation runs, the Engine sends data chunk-by-chunk.
*   In the Studio UI, a "Console" drawer opens at the bottom right.
*   This displays the real-time progress steps (e.g., "Building Matrix...", "Solving Iteration 4...").
*   This is useful for debugging slow simulations without looking at server logs.

### 3.4 Common Maintenance Tasks

#### Updating the Solver Logic
The physics logic lives in `apps/engine/domains/surface_treatment/solver.py`.
If you deploy a code update to the engine:
1.  **Rebuild the Container:** Since it's Python, code isn't "hot reloaded" in production efficiently without a restart.
    ```bash
    docker-compose up -d --build engine
    ```
2.  **No Downtime (Tip):** Since the Studio handles retries, a brief restart usually just looks like a long loading spinner to the user.

#### Scaling
If you have many users running simulations simultaneously, the Python engine (CPU bound) will become the bottleneck.
*   **Docker Swarm / Kubernetes:** You can deploy multiple replicas of the `engine` container.
*   **Load Balancing:** Since the engine is stateless, a simple Round-Robin load balancer can distribute requests across 5 or 10 engine instances seamlessly.

### 3.5 Troubleshooting Guide

**Scenario 1: `FetchError: ECONNREFUSED`**
*   **Symptom:** The Studio says "Connection Error" immediately upon clicking Simulate.
*   **Diagnosis:** Next.js cannot find the Python container.
*   **Fix:** Check `ENGINE_URL` in `.env`. Inside Docker, it should be `http://engine:8000`. Locally, it might be `http://127.0.0.1:8000`.

**Scenario 2: `403 Forbidden`**
*   **Symptom:** Logs show "Forbidden: Invalid API Secret".
*   **Diagnosis:** The `INTERNAL_API_SECRET` in Next.js does not match the one in Python.
*   **Fix:** Ensure both containers share the exact same string in their environment variables.

**Scenario 3: "Singular Matrix" / "LinAlgError"**
*   **Symptom:** The user sees a red error "Erreur de convergence".
*   **Diagnosis:** This is a **Physics Error**, not a bug in the code. It means the user designed a system that is mathematically impossible (e.g., a closed loop of pipes with no outlet, or trying to calculate concentration in an empty tank).
*   **Fix:** Instruct the user to check their graph connections (Arrows must connect properly).
