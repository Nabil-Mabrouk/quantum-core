---
title: "8-Modèle de données et architecture topologique"
slug: "modele-donnees-architecture-topologique"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 8 
---

# Modèle de données et architecture topologique

Quantum Core fonctionne sur un modèle de données hiérarchique strict, conçu pour prendre en charge l'ingénierie des "Systèmes de Systèmes". Contrairement à un simple outil de dessin, les relations entre les objets ont une signification physique.

Ce chapitre détaille le schéma de la base de données (`@repo/database`) et les algorithmes de topologie spécifiques utilisés pour interpréter le graphe.

### 1.1 La Hiérarchie des Entités

Le modèle de données suit une hiérarchie de confinement stricte définie dans `schema.prisma`.

#### Niveau 1 : Le Projet (Portée Globale)
Le `Project` est le conteneur racine. Il représente une usine ou un site entier.
*   **Base de Temps :** Il contient des paramètres globaux comme `hoursPerDay`, `weeksPerYear`. Tous les calculs de bilan massique sont normalisés par rapport à cette base de temps.
*   **Le Bus :** Il possède des objets `ProjectStream` (voir Section 1.3), qui agissent comme le "Bus Inter-Système".

#### Niveau 2 : Le Système (Canevas Local)
Un `System` représente une opération unitaire spécifique (par exemple, "Usine de Traitement de l'Eau", "Ligne de Production A").
*   **Isolation :** Chaque Système a son propre canevas, ses nœuds et ses arêtes.
*   **Type :** Peut être `PRODUCTION` (Logique linéaire) ou `TREATMENT` (Logique cyclique).

#### Niveau 3 : Nœuds et Arêtes (Le Graphe)
*   **`Node` :** Un actif d'équipement. Il contient un blob JSON `properties` qui stocke toutes les entrées spécifiques au domaine définies dans le Manifeste.
*   **`Edge` :** Une connexion physique dessinée par l'utilisateur. Par défaut, cela représente un tuyau ou un câble (`category: "PHYSICAL"`).

### 1.2 La logique de connexion "sans fil"

L'une des caractéristiques architecturales les plus puissantes de Quantum Core est la **Topologie Virtuelle**.

Dans les schémas P&ID (Piping and Instrumentation Diagrams) d'ingénierie complexes, dessiner des fils pour chaque connexion logique (par exemple, "La pompe A envoie un signal au contrôleur B" ou "Le réservoir C déborde vers le drain D") crée un chaos visuel ("Diagramme Spaghetti").

**La Solution :**
Nous permettons que les connexions soient définies comme des **Propriétés** (champ `node-selector`) plutôt que comme des **Arêtes**.

#### Comment cela fonctionne dans le code :
1.  **Interface Utilisateur :** L'utilisateur sélectionne un nœud cible dans une liste déroulante du `PropertiesPanel`. Cela enregistre l'ID cible dans `node.properties.overflowTargetId`.
2.  **Temps de Simulation (`actions/simulation.ts`) :** Avant d'envoyer des données à Python, le système exécute `createVirtualEdges()`.
3.  **Transformation :** Il scanne toutes les propriétés. S'il trouve un champ `node-selector` avec une valeur, il génère une **Arête Virtuelle**.

```typescript
// Logique conceptuelle dans apps/studio/app/actions/simulation.ts
function createVirtualEdges(nodes, manifest) {
  const virtualEdges = [];
  nodes.forEach(node => {
    // 1. Rechercher le schéma
    const fields = manifest.nodeTypes[node.type].fields;
    
    fields.forEach(field => {
      // 2. Détecter les champs "sans fil"
      if (field.type === 'node-selector') {
        const targetId = node.properties[field.id];
        
        // 3. Créer une arête éphémère pour le solveur
        if (targetId) {
          virtualEdges.push({
            source: node.id,
            target: targetId,
            type: field.id.toUpperCase(), // par exemple, "OVERFLOW"
            isVirtual: true
          });
        }
      }
    });
  });
  return virtualEdges;
}
```

**Impact Architectural :** Le Solveur Python reçoit un graphe entièrement connecté (Physique + Virtuel) sans que l'interface utilisateur n'ait besoin de rendre des fils désordonnés.

### 1.3 Système de Systèmes (Le Bus de Données)

Les grands sites industriels sont trop complexes pour un seul graphe. Quantum Core les divise en Systèmes connectés par un **Bus de Projet**.

*   **`ProjectStream` :** Un objet de données partagé au niveau du Projet. Il agit comme un sujet Pub/Sub.
*   **Publication :** Un Nœud (par exemple, un "Drain" dans le Système A) se connecte à un Stream via `outputStreamId`.
*   **Abonnement :** Un Nœud (par exemple, une "Source" dans le Système B) se connecte au même Stream via `inputStreamId`.

**La Séquence de Résolution (`orchestrator.py`) :**
1.  Le Moteur analyse les dépendances entre les Systèmes basées sur les Streams.
2.  Il construit un ordre d'exécution topologique (DAG).
3.  Il résout le Système A.
4.  Il écrit le flux/la concentration de sortie dans le `ProjectStream`.
5.  Il résout le Système B, en injectant les données du `ProjectStream` en tant qu'entrée.

### 1.4 Stratégie de Persistance des Données

L'application utilise une stratégie de **"Synchronisation Destructive"** pour la sauvegarde des graphes, optimisée pour la cohérence plutôt que la granularité.

Lors de l'appel à `saveGraph` :
1.  **Début de la Transaction :** Une transaction de base de données (`db.$transaction`) est ouverte.
2.  **Effacement :** Tous les nœuds, arêtes et séquences du système actuel sont supprimés.
3.  **Recréation :** L'état actuel du Canvas est inséré comme de nouveaux enregistrements.
4.  **Validation de la Transaction :** Les modifications sont appliquées de manière atomique.

*   **Avantages :** Impossible d'avoir des "arêtes orphelines" (arêtes pointant vers des nœuds inexistants). Simplifie la logique du frontend (pas besoin de suivre les différences).
*   **Inconvénients :** Charge d'écriture plus élevée sur la base de données. La préservation des identifiants est gérée par le frontend qui envoie des UUID spécifiques, que Prisma respecte lors de la création.
