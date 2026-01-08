# Chapitre 3 : Sprint 2 - L'Interface Polymorphe

## 1. Le Piège de l'Interface "Métier"

Dans le développement d'applications industrielles, l'erreur classique est de créer des composants React nommés `<TankCard />`, `<PumpWidget />` ou `<SolarPanel />`.

Cette approche semble naturelle au début, mais elle devient un cauchemar de maintenance. Si vous voulez créer **QuantumEnergy** après **QuantumH2O**, vous devez dupliquer et renommer tous vos composants. Le code devient rigide.

L'objectif du Sprint 2 était de briser ce lien. Nous voulions une interface **agnostique** qui ne connaît rien au métier, mais qui sait tout afficher.

## 2. Le concept de "Domain Manifest"

Nous avons introduit un fichier de configuration central : `domain-config.ts`. C'est l'ADN du produit.

```typescript
// Ce simple objet transforme l'application
export const WATER_CONFIG = {
  nodeTypes: {
    TANK: { label: "Cuve", icon: Beaker, color: "blue" },
    PUMP: { label: "Pompe", icon: Fan, color: "slate" }
  }
};
```

Grâce à ce manifeste, le composant `<NodePalette />` n'a pas besoin de savoir ce qu'il affiche. Il boucle simplement sur la configuration. C'est ce qu'on appelle une **Config-Driven UI**.

## 3. Le Moteur de Rendu Visuel (ReactFlow)

Pour le Canvas, nous avons choisi **ReactFlow** (désormais `@xyflow/react`).

Au lieu de créer plusieurs types de nœuds dans ReactFlow, nous avons enregistré un seul type universel : **`genericNode`**.
Ce composant agit comme un caméléon. Il reçoit un `type` ("TANK" ou "PUMP"), consulte le Manifeste pour savoir quelle couleur et quelle icône utiliser, et se rend en conséquence.

**Résultat :** Pour ajouter un nouvel équipement dans le logiciel, il n'y a plus de code React à écrire. Il suffit d'ajouter 3 lignes dans le fichier JSON de configuration.

## 4. Gestion d'État (Zustand)

Pour manipuler ce graphe (Ajout, Suppression, Connexion), nous avons utilisé **Zustand**. Contrairement à Redux (trop verbeux) ou Context API (problèmes de performance sur les gros graphes), Zustand offre un compromis parfait pour gérer l'état local du Canvas avant de le sauvegarder en base de données.

## 5. Rétrospective : Le Défi du Styling (Tailwind v4)

Ce sprint a été marqué par un défi technique inattendu lié à l'infrastructure frontend : la migration vers **Tailwind CSS v4**.

**Le Problème :**
Nous avons initialisé le projet avec les dernières versions disponibles. Tailwind v4 a radicalement changé son architecture (abandon du fichier `tailwind.config.ts` classique, nouveau plugin PostCSS). Cela a cassé le style de notre application Monorepo, rendant l'interface illisible.

**La Résolution :**
Nous avons dû reconfigurer la chaîne de build CSS :
1.  Installation explicite du plugin `@tailwindcss/postcss`.
2.  Configuration d'un fichier `postcss.config.mjs` minimaliste.
3.  Adoption de la directive CSS native `@import "tailwindcss";`.

*Leçon apprise :* Dans un environnement Monorepo (Turborepo), la gestion des dépendances "peer" (comme PostCSS/Tailwind) doit être explicite dans chaque sous-projet (`apps/studio`) pour éviter les conflits de résolution.
