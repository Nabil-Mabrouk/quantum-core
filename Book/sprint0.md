# Chapitre 1 : Sprint 0 - Les Fondations de l'Usine

## 1. Objectif du Sprint

Avant de poser la première brique de logique métier (calculer un pH ou dimensionner une cuve), nous devions construire l'usine elle-même. Dans un projet d'une telle envergure, la dette technique se paie *cash* dès le troisième mois si l'architecture initiale est bancale.

L'objectif du Sprint 0 était clair : **Mettre sur pied un environnement de développement unifié capable de faire cohabiter TypeScript (l'Interface) et Python (le Calcul) de manière fluide et typée.**

Nous ne voulions pas de deux dépôts Git séparés qui finissent par se désynchroniser. Nous voulions une **Source de Vérité Unique**.

## 2. La Stratégie Monorepo (Turborepo & pnpm)

Pour gérer cette polyglottie (JS/TS + Python), nous avons opté pour une structure **Monorepo** gérée par **Turborepo**.

### Pourquoi ce choix ?
1.  **Code Partagé :** Le schéma de base de données (Prisma) doit être accessible par le backend Next.js (`apps/studio`) mais aussi potentiellement par des scripts de maintenance, sans duplication.
2.  **Atomicité :** Une seule commande `pnpm install` installe les dépendances de tout le projet. Une seule commande `docker-compose up` lance toute l'infrastructure.

### L'Arborescence Cible
Nous avons structuré le projet ainsi :

```text
quantum-core/
├── apps/
│   ├── studio/       # (Next.js 15) Le cockpit de l'ingénieur
│   └── engine/       # (FastAPI) Le micro-service de calcul Python
├── packages/
│   ├── database/     # Le schéma Prisma et le client généré
│   ├── ui-kit/       # (Futur) Les composants React réutilisables
│   └── typescript/   # Configs TS partagées
├── docker-compose.yml
└── turbo.json
```

Cette structure isole proprement les responsabilités : le `studio` gère l'humain, l'`engine` gère la physique, et `packages` gère la structure.

## 3. Le Schéma de Données "Meta-Model"

Le cœur de notre philosophie de réutilisabilité réside dans la base de données. Au lieu de créer des tables spécifiques (`Tank`, `Pump`), nous avons conçu un modèle abstrait dans `packages/database`.

Nous avons utilisé **PostgreSQL** pour sa robustesse et **Prisma** pour l'expérience développeur (DX).

### Le changement de paradigme
*   **Avant (Approche classique) :** Une table par équipement. Si on veut ajouter un "Panneau Solaire", on doit migrer la DB.
*   **Après (Quantum Core) :** Une table `Node` universelle.
    *   `type`: String ("TANK", "SOLAR_PANEL")
    *   `properties`: **JSONB**. C'est ici que réside la flexibilité. PostgreSQL valide le format JSON, et nos validateurs applicatifs (Pydantic/Zod) valideront le contenu métier.

## 4. L'Orchestration Hybride (Docker)

Le défi principal était de faire tourner côte à côte un environnement Node.js et un environnement Python.

Nous avons conteneurisé le moteur Python (`apps/engine`) pour une raison simple : **l'isolation des dépendances**. Les librairies scientifiques (NumPy, SciPy) ont besoin de binaires système spécifiques. Docker garantit que le calcul s'exécute exactement de la même manière sur le PC du développeur et sur le serveur de production.

Le fichier `docker-compose.yml` agit comme le chef d'orchestre :
1.  Il lève **PostgreSQL**.
2.  Il lève l'**Engine Python** (port 8000).
3.  Il expose ces services au réseau local pour que **Next.js** (qui tourne souvent en local hors Docker pour la vitesse de dev) puisse s'y connecter.

---

## 5. Rétrospective : Difficultés Rencontrées et Solutions

Comme tout démarrage de projet technique ambitieux, ce Sprint 0 ne s'est pas déroulé sans accrocs. Voici les trois défis majeurs que nous avons surmontés pour stabiliser la stack.

### Défi n°1 : Le "Breaking Change" de Prisma 7
**Le Problème :** Nous avons adopté la toute dernière version de Prisma (v7.2.0). Lors de la génération du client, nous avons rencontré l'erreur `P1012`. La définition de l'URL de connexion directement dans `schema.prisma` (`url = env("...")`) est devenue obsolète et interdite.

**La Solution :**
Nous avons dû adopter la nouvelle norme de configuration de Prisma 7.
1.  Création d'un fichier dédié `prisma.config.ts` dans le package database.
2.  Utilisation de l'helper `env` importé depuis `@prisma/config`.
3.  Suppression des propriétés `url` et `provider` du bloc `datasource` dans le fichier `schema.prisma`.

*Leçon apprise :* Toujours vérifier les "Release Notes" des outils majeurs avant de commencer, surtout sur les versions "Bleeding Edge".

### Défi n°2 : La Rigueur de pnpm dans un Monorepo
**Le Problème :** Lors de l'installation des dépendances (`dotenv`, `@prisma/config`), nous avons eu des erreurs `ERR_PNPM_ADDING_TO_ROOT`. De plus, pnpm refusait d'installer des paquets dans `packages/database` car il ne le reconnaissait pas comme un module valide.

**La Solution :**
1.  Nous avons créé un fichier `package.json` explicite dans `packages/database` définissant son nom (`@repo/database`) et ses exports.
2.  Nous avons appris à utiliser les filtres pnpm ou à naviguer dans le dossier spécifique avant d'installer : `cd packages/database && pnpm add ...`.
3.  Nous avons banni l'utilisation mixte de `npm` et `pnpm` pour éviter les conflits de lockfiles.

### Défi n°3 : L'Orchestration des Tâches avec Turbo
**Le Problème :** La commande `npx turbo run db:generate` échouait car Turborepo ne savait pas que cette tâche existait.

**La Solution :**
Il a fallu configurer explicitement le "Pipeline" dans `turbo.json`. Nous avons déclaré la tâche `db:generate` et indiqué qu'elle ne produisait pas d'artefacts de cache persistants, permettant ainsi d'exécuter la génération du client Prisma depuis la racine du projet en une seule commande.

---

### Conclusion du Chapitre 1

À la fin de ce Sprint 0, nous avons une **usine logicielle fonctionnelle**.
*   Le moteur Python répond "OK".
*   La base de données est provisionnée avec un schéma générique.
*   Le frontend Next.js est prêt à démarrer.

Le terrain est déminé. Nous pouvons maintenant passer au **Sprint 1** : Créer le premier pont de communication réel entre Next.js et Python pour initier un calcul.