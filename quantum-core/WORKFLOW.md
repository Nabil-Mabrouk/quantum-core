### Workflow: From Project Creation to Simulation Results

The architecture is split between the `studio` (a Next.js frontend) which handles the user interface, and the `engine` (a Python FastAPI backend) which performs the heavy computational work.

---

#### 1. Project Creation & Setup

This is where the user defines the basic parameters of their new simulation project.

*   **Workflow**:
    1.  The user navigates to their dashboard.
    2.  They click a "Create Project" button, which opens a modal (`create-project-modal.tsx`).
    3.  Inside the modal, they enter a name for the project and select an engineering domain (e.g., "Surface Treatment").
    4.  Submitting the form triggers a server action (`project.ts`) that saves the new project to the PostgreSQL database via Prisma.
    5.  Upon successful creation, the application navigates the user to the main editor page for the newly created project.

*   **Key Files**:
    *   `apps/studio/components/dashboard/create-project-modal.tsx`: The React component for the creation form.
    *   `apps/studio/app/actions/project.ts`: The server-side logic that handles the creation request and interacts with the database.
    *   `packages/database/prisma/schema.prisma`: Defines the project data structure in the database.
    *   `apps/studio/app/[locale]/editor/[id]/page.tsx`: The main page for the project editor workspace.

---

#### 2. Building the Process Graph

The user visually constructs the process they want to simulate using a node-based editor.

*   **Workflow**:
    1.  The editor interface loads, centered around a canvas (`flow-editor.tsx`).
    2.  The user drags different process units (e.g., tanks, pumps) as "nodes" from a palette (`node-palette.tsx`) onto the canvas. The available nodes are determined by the project's domain.
    3.  The user connects these nodes with "edges" to define the process flow.
    4.  They select individual nodes to configure their specific parameters (e.g., tank volume, chemical concentration) in a properties panel (`properties-panel.tsx`).
    5.  All these actions (adding/deleting nodes, connecting them, updating properties) are captured and managed in real-time by a client-side state manager (Zustand).

*   **Key Files**:
    *   `apps/studio/components/canvas/flow-editor.tsx`: The main React Flow canvas where the graph is built.
    *   `apps/studio/components/layout/node-palette.tsx`: The sidebar component listing available nodes for the domain.
    *   `apps/studio/lib/domains/surface-treatment.ts`: An example of a domain configuration file that defines the nodes, icons, and properties for the "Surface Treatment" domain.
    *   `apps/studio/components/layout/properties-panel.tsx`: The component that displays and allows editing of the selected node's properties.
    *   `apps/studio/store/canvas-store.ts`: The Zustand store that holds the state of the graph (nodes, edges, etc.).

---

#### 3. Running the Simulation

The user initiates the simulation, sending the graph data from the frontend to the backend engine.

*   **Workflow**:
    1.  The user clicks a "Run Simulation" button in the UI.
    2.  The frontend gathers all the data from the Zustand store (nodes, edges, settings) and bundles it into a `SimulationPayload`.
    3.  This payload is sent via an HTTP POST request to a dedicated API route within the Next.js app (`/api/simulation/stream`).
    4.  This route handler acts as a secure proxy. It receives the request, attaches the required `INTERNAL_API_SECRET`, and forwards it to the Python `engine`'s `/simulate-stream` endpoint.

*   **Key Files**:
    *   `apps/studio/app/api/simulation/stream/route.ts`: The Next.js API route that securely forwards the simulation request to the engine.
    *   `apps/engine/main.py`: The main FastAPI file that defines the `/simulate-stream` and `/solve-project` endpoints.

---

#### 4. Computation in the Engine

The Python engine receives the request and performs the engineering calculations.

*   **Workflow**:
    1.  The `engine` receives the `SimulationPayload` at the `/simulate-stream` endpoint.
    2.  It identifies the requested `domain` ("SURFACE_TREATMENT") and looks up the corresponding solver function in its `SOLVER_REGISTRY`.
    3.  **For complex projects** with multiple interconnected systems, the `/solve-project` endpoint is used. The `orchestrator` first calculates the correct execution order (topological sort) to handle dependencies.
    4.  The orchestrator then executes the simulation for each system in sequence, passing outputs from one system as inputs to the next using an internal "data bus".
    5.  The core logic inside the solver (`solver.py`) runs the scientific calculations.
    6.  The engine streams the results back as newline-delimited JSON (`ndjson`), allowing the frontend to receive real-time progress updates, logs, and the final results.

*   **Key Files**:
    *   `apps/engine/main.py`: Routes the incoming request to the correct solver.
    *   `apps/engine/orchestrator.py`: Manages the execution order and data flow for complex, multi-system projects.
    *   `apps/engine/domains/surface_treatment/solver.py`: Contains the core simulation logic for the surface treatment domain.

---

#### 5. Displaying Results

The frontend receives the data stream from the engine and visualizes the results for the user.

*   **Workflow**:
    1.  The frontend receives the `ndjson` stream from the engine.
    2.  A simulation console (`simulation-console.tsx`) displays incoming log messages and progress updates in real-time.
    3.  When the final result message is received, the frontend parses the data.
    4.  The UI is updated with the results. This can include:
        *   Displaying calculated values directly on the nodes in the graph.
        *   Showing detailed tables and charts in a dedicated report viewer (`process-report.tsx`).
        *   Updating summary panels with key performance indicators.

*   **Key Files**:
    *   `apps/studio/components/ui/simulation-console.tsx`: Displays real-time logs and messages from the engine.
    *   `apps/studio/components/domains/surface_treatment/process-report.tsx`: A domain-specific component to display a detailed report of the simulation results.
    *   `apps/studio/components/layout/summary-view.tsx`: A component for showing high-level results or KPIs.