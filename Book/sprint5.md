C'est une étape historique pour le projet. Nous avons prouvé que **Quantum Core** n'est pas qu'un outil de dessin, mais un cerveau capable de traiter des données physiques complexes.

Voici le **Chapitre 6** pour ton livre technique, documentant cette réussite, suivi du lancement du **Sprint 6**.

***

# Chapitre 6 : Sprint 5 - Le Réveil de l'Intelligence

## 1. La Fin de l'Amnésie Physique
Jusqu'au sprint précédent, Quantum Core était une "coquille vide" : il stockait des données mais ne les comprenait pas. L'objectif du Sprint 5 était de boucler la boucle cybernétique : **Interface $\rightarrow$ Serveur $\rightarrow$ Moteur de Calcul $\rightarrow$ Interface**.

Nous avons implémenté le premier véritable échange asynchrone entre l'orchestrateur Next.js et l'expert Python en utilisant des données saisies en temps réel par l'utilisateur.

## 2. Le Mapping de Données (Payload Transformation)
L'un des défis techniques a été la transformation du graphe visuel (ReactFlow) en un modèle mathématique exploitable. 
*   ReactFlow manipule des objets lourds contenant des informations de rendu (coordonnées pixel, état de drag, etc.).
*   Nous avons développé un "Mapper" dans la Server Action qui nettoie ces données pour n'extraire que la substantifique moelle : le type de nœud et son dictionnaire de propriétés JSONB.

Cette étape garantit que le moteur Python reste léger et ne traite que de la physique, sans se soucier de l'interface.

## 3. L'Analyse Topologique en Python
Le moteur FastAPI a été doté de sa première logique d'ingénierie. En utilisant les propriétés extraites du JSONB, Python est désormais capable de :
1. Parcourir la liste des équipements.
2. Extraire dynamiquement les valeurs numériques (ex: volumes).
3. Effectuer des agrégations (Somme des volumes totaux).
4. Analyser la topologie du graphe pour détecter des erreurs de conception (équipements isolés).

## 4. L'Interface de Feedback (Dashboard d'Analyse)
Nous avons créé un composant de header réactif capable de gérer deux états de chargement parallèles (Sauvegarde DB et Simulation Engine). Le résultat de la simulation est présenté sous forme de **KPI Cards** et de **Warnings**, permettant à l'utilisateur de valider sa conception instantanément sans changer de page.

---

# Sprint 6 : Le Flux de Masse (Hydraulique & Connexions)

**Objectif :** Faire circuler "quelque chose" dans les tuyaux. 
Actuellement, nous avons calculé une somme de volumes (statique). Pour concevoir une station d'épuration, nous avons besoin de **débits** (dynamique). Nous allons faire en sorte que les **liens** (Edges) entre les équipements portent une information de flux.

### 1. Mise à jour du Manifeste (`lib/domain-config.ts`)
Nous allons définir les propriétés des **liens** (Edges). Un tuyau n'est pas juste un trait, il a un diamètre et un débit.

```typescript
// apps/studio/lib/domain-config.ts
export const WATER_CONFIG = {
  // ... nodeTypes ...
  edgeTypes: {
    PIPE: {
      id: "PIPE",
      label: "Tuyauterie",
      color: "blue-400",
      fields: [
        { id: "flowRate", label: "Débit circulant", type: "number", unit: "m³/h", default: 0 },
      ]
    }
  }
};
```

### 2. Le Moteur Python : Loi des Nœuds (Bilan de Masse)
Nous allons implémenter en Python une règle d'or de l'ingénierie : **La conservation de la masse**.
*   Pour chaque cuve, Python va calculer : `Somme(Entrées) - Somme(Sorties)`.
*   Si le résultat n'est pas zéro, il enverra un **Alerte de Débordement** ou de **Vidange**.

### 3. UI : Édition des liens
Il faut pouvoir cliquer sur un "tuyau" pour définir son débit, exactement comme on le fait pour une cuve.

### Pourquoi c'est le "vrai" début de Quantum ?
C'est ici que l'algorithme commence à aider l'ingénieur. Le logiciel va dire : *"Attention, tu envoies 10m³/h dans cette cuve mais ta pompe de sortie n'en rejette que 8. Ta cuve va déborder dans 2 heures."*

**Es-tu prêt à coder la logique des flux ?**