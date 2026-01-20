---
title: "State Management & The Client Store"
slug: "state-management-client-store"
published: true
tags: "Devs"
---
# State Management & The Client Store

Building a high-performance engineering tool requires a robust state management strategy. A standard CRUD approach (fetching data on every click) is too slow for a drag-and-drop canvas.

Quantum Core uses a **Hybrid State Architecture**:
1.  **Server State (PostgreSQL):** The source of truth, accessed via Server Components and Server Actions.
2.  **Client State (Zustand):** An in-memory, high-frequency store for the interactive session.

This chapter details the `canvas-store.ts`, the central nervous system of the Studio frontend.

### 2.1 Why Zustand?

We chose **Zustand** over Redux or React Context for three reasons:
*   **Performance:** It allows components to subscribe to specific slices of state without re-rendering the entire app. This is critical when dragging a node at 60 FPS.
*   **Simplicity:** No boilerplate (reducers/actions). State logic is defined directly in the store hooks.
*   **Transient State:** It handles data that shouldn't be saved immediately, like simulation results (`simulationResults`) or UI view modes.

**File:** `apps/studio/store/canvas-store.ts`

### 2.2 Store Slices (The "God Store" Pattern)

To keep the code manageable, the store is split into functional **Slices**, combined into one hook `useCanvasStore`.

#### A. The Graph Slice (`createGraphSlice`)
Handles the React Flow data model.
*   **`nodes` & `edges`:** The raw arrays required by the canvas.
*   **`onNodesChange` / `onEdgesChange`:** Standard React Flow hooks that handle dragging, selection, and deletion.
*   **`updateNodeProperties(id, props)`:** The most used action. It performs a **shallow merge** of properties. This allows the `PropertiesPanel` to update a specific field (e.g., `temp`) without overwriting other data like `pressure`.

#### B. The Workspace Slice (`createWorkspaceSlice`)
Handles the UI context.
*   **`viewMode`:** Toggles between `GRAPH` (Editor), `SYNOPTIC` (List), and `SUMMARY` (Report).
*   **`synopticMode`:** Switches between Physical order (X-axis) and Sequence order (Process steps).
*   **`visibleScopes`:** Controls the Layer visibility (e.g., hiding Utility networks to focus on Process).

#### C. The Sequence Slice (`createSequenceSlice`)
Handles the logic for "Gammes" (Production Sequences).
*   **`sequences`:** An array of ordered lists of Node IDs.
*   **Logic:** It manages the drag-and-drop reordering in the Synoptic view (`SynopticEditor.tsx`) using `@dnd-kit`.

### 2.3 The Hydration Pattern (`ProjectInitializer`)

Since Next.js 15 uses Server Components by default, we cannot inject data directly into a Zustand store (which lives on the client) during the initial render pass.

We use the **Initializer Pattern** to bridge the gap.

**Component:** `apps/studio/components/layout/project-initializer.tsx`

1.  **Server Fetch:** The Page (`editor/[id]/page.tsx`) fetches the graph from Prisma.
2.  **Pass to Client:** It renders `<ProjectInitializer />` passing the data as props.
3.  **Hydration:** Inside `useEffect`, the initializer calls `store.setGraph(initialNodes, initialEdges)`.
4.  **Ref Guard:** A `useRef` ensures this only happens once per system load to prevent infinite loops or overwriting unsaved user changes.

```typescript
// Conceptual Flow
export default async function EditorPage({ params }) {
  const data = await db.system.findUnique(...); // Server Side
  
  return (
    <>
      <ProjectInitializer 
        initialNodes={data.nodes} 
        initialEdges={data.edges} 
      />
      <Workspace /> {/* Client Side, reads from Store */}
    </>
  );
}
```

### 2.4 Optimistic UI Updates

The Studio feels fast because it rarely waits for the server.

**Example: Renaming a Node**
1.  User types "Tank A" in the Properties Panel.
2.  **Client:** `useCanvasStore` updates the `label` in memory immediately. The Node on the canvas updates instantly.
3.  **Server:** Nothing happens yet. The change is marked as "dirty" in the user's mind.
4.  **Save:** When the user clicks "Save" (or triggers Auto-Save), `header.tsx` grabs the *current* state of the store and sends it to `saveGraph` server action.

**Exception:** Some actions are **Atomic**. For example, creating a Project (`createProjectAction`) or Uploading an Image (`uploadImageAction`) happens on the server first, then returns a result to update the UI.

### 2.5 Accessing Simulation Results

Simulation results are **Transient Data**. They are calculated by Python and displayed, but strictly speaking, they are derived data, not source data.

1.  **Python:** Returns a JSON with `node_details: { "node-1": { "flow": 50 } }`.
2.  **Header:** Receives the JSON and calls `store.updateNodeProperties("node-1", { simulationResults: ... })`.
3.  **SmartNode:** Subscribes to `nodes`. It sees the new `simulationResults` property and renders the "Health Bar" or flow rate badge.

*Architectural Note:* If the user refreshes the page, these results are lost (unless explicitly saved back to the DB, which is optional depending on the domain configuration).
