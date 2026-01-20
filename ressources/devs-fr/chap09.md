---
title: "9-Gestion de l'état et du magasin client"
slug: "gestion-etat-magasin-client"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 9 
---
# Gestion de l'état et du magasin client

La création d'un outil d'ingénierie haute performance nécessite une stratégie de gestion d'état robuste. Une approche CRUD standard (récupération de données à chaque clic) est trop lente pour un canevas de glisser-déposer.

Quantum Core utilise une **architecture d'état hybride** :
1.  **État du serveur (PostgreSQL) :** La source de vérité, accessible via les composants serveur et les actions serveur.
2.  **État du client (Zustand) :** Un magasin en mémoire à haute fréquence pour la session interactive.

Ce chapitre détaille le `canvas-store.ts`, le système nerveux central du frontend de Studio.

### 2.1 Pourquoi Zustand ?

Nous avons choisi **Zustand** plutôt que Redux ou React Context pour trois raisons :
*   **Performance :** Il permet aux composants de s'abonner à des tranches spécifiques de l'état sans re-rendre toute l'application. C'est essentiel lors du glissement d'un nœud à 60 FPS.
*   **Simplicité :** Pas de code passe-partout (reducers/actions). La logique d'état est définie directement dans les hooks du store.
*   **État transitoire :** Il gère les données qui ne devraient pas être sauvegardées immédiatement, comme les résultats de simulation (`simulationResults`) ou les modes d'affichage de l'interface utilisateur.

**Fichier :** `apps/studio/store/canvas-store.ts`

### 2.2 Stocker les Slices (Le modèle "God Store")

Pour maintenir le code gérable, le store est divisé en **Slices** fonctionnelles, combinées en un seul hook `useCanvasStore`.

#### A. La Slice Graph (`createGraphSlice`)
Gère le modèle de données React Flow.
*   **`nodes` & `edges` :** Les tableaux bruts requis par le canvas.
*   **`onNodesChange` / `onEdgesChange` :** Hooks React Flow standards qui gèrent le glisser-déposer, la sélection et la suppression.
*   **`updateNodeProperties(id, props)` :** L'action la plus utilisée. Elle effectue une **fusion superficielle** des propriétés. Cela permet au `PropertiesPanel` de mettre à jour un champ spécifique (par exemple, `temp`) sans écraser d'autres données comme `pressure`.

#### B. La Slice Workspace (`createWorkspaceSlice`)
Gère le contexte de l'interface utilisateur.
*   **`viewMode` :** Bascule entre `GRAPH` (Éditeur), `SYNOPTIC` (Liste) et `SUMMARY` (Rapport).
*   **`synopticMode` :** Bascule entre l'ordre physique (axe X) et l'ordre séquentiel (étapes du processus).
*   **`visibleScopes` :** Contrôle la visibilité des couches (par exemple, masquer les réseaux utilitaires pour se concentrer sur le processus).

#### C. La Slice Sequence (`createSequenceSlice`)
Gère la logique des "Gammes" (Séquences de production).
*   **`sequences` :** Un tableau de listes ordonnées d'ID de nœuds.
*   **Logique :** Elle gère le réordonnancement par glisser-déposer dans la vue Synoptique (`SynopticEditor.tsx`) à l'aide de `@dnd-kit`.

### 2.3 Le Modèle d'Hydratation (`ProjectInitializer`)

Étant donné que Next.js 15 utilise les Composants Serveur par défaut, nous ne pouvons pas injecter directement des données dans un store Zustand (qui réside côté client) lors du rendu initial.

Nous utilisons le **Modèle d'Initialisation** pour combler cette lacune.

**Composant :** `apps/studio/components/layout/project-initializer.tsx`

1.  **Récupération Serveur :** La Page (`editor/[id]/page.tsx`) récupère le graphe depuis Prisma.
2.  **Passage au Client :** Elle rend `<ProjectInitializer />` en passant les données comme props.
3.  **Hydratation :** À l'intérieur de `useEffect`, l'initialiseur appelle `store.setGraph(initialNodes, initialEdges)`.
4.  **Garde de Réf :** Un `useRef` garantit que cela ne se produit qu'une seule fois par chargement du système afin d'éviter les boucles infinies ou l'écrasement des modifications utilisateur non sauvegardées.

```typescript
// Flux Conceptuel
export default async function EditorPage({ params }) {
  const data = await db.system.findUnique(...); // Côté Serveur
  
  return (
    <>
      <ProjectInitializer 
        initialNodes={data.nodes} 
        initialEdges={data.edges} 
      />
      <Workspace /> {/* Côté Client, lit depuis le Store */}
    </>
  );
}
```

### 2.4 Mises à jour optimistes de l'interface utilisateur

Le Studio semble rapide car il attend rarement le serveur.

**Exemple : Renommer un nœud**
1. L'utilisateur tape "Tank A" dans le panneau des propriétés.
2. **Client :** `useCanvasStore` met à jour immédiatement le `label` en mémoire. Le nœud sur le canevas se met à jour instantanément.
3. **Serveur :** Rien ne se passe encore. Le changement est marqué comme "sale" dans l'esprit de l'utilisateur.
4. **Sauvegarde :** Lorsque l'utilisateur clique sur "Enregistrer" (ou déclenche la sauvegarde automatique), `header.tsx` récupère l'état *actuel* du store et l'envoie à l'action serveur `saveGraph`.

**Exception :** Certaines actions sont **atomiques**. Par exemple, la création d'un projet (`createProjectAction`) ou le téléchargement d'une image (`uploadImageAction`) se produisent d'abord sur le serveur, puis renvoient un résultat pour mettre à jour l'interface utilisateur.

### 2.5 Accéder aux résultats de simulation

Les résultats de simulation sont des **données transitoires**. Ils sont calculés par Python et affichés, mais à proprement parler, ce sont des données dérivées, et non des données sources.

1.  **Python :** Renvoie un JSON avec `node_details: { "node-1": { "flow": 50 } }`.
2.  **En-tête :** Reçoit le JSON et appelle `store.updateNodeProperties("node-1", { simulationResults: ... })`.
3.  **SmartNode :** S'abonne aux `nodes`. Il voit la nouvelle propriété `simulationResults` et affiche la "Barre de Santé" ou le badge de débit.

*Note architecturale :* Si l'utilisateur rafraîchit la page, ces résultats sont perdus (à moins d'être explicitement sauvegardés dans la base de données, ce qui est optionnel selon la configuration du domaine).
