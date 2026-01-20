---
title: "10-Aide-mémoire et dépannage du développeur"
slug: "aide-memoire-depannage-developpeur"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 10 
---

# Annexe : Aide-mémoire et dépannage du développeur

Cette section sert de référence rapide pour les opérations quotidiennes. Elle regroupe les commandes les plus courantes, les chemins de fichiers et les solutions aux problèmes fréquents rencontrés lors du développement et du déploiement.

### A.1 Référence des commandes essentielles

Exécutez ces commandes depuis la **racine** du monorepo.

| Action | Commande | Contexte |
| :--- | :--- | :--- |
| **Démarrer la pile** | `pnpm dev` | Démarre Next.js (Studio) + conteneurs Docker (DB/Engine) |
| **Démarrer la base de données uniquement** | `docker-compose up -d postgres` | Utile lors du travail sur le schéma Prisma |
| **Démarrer le moteur uniquement** | `docker-compose up -d --build engine` | Utile lors du débogage de la logique Python |
| **Synchroniser la base de données (Dev)** | `pnpm db:push` | Mise à jour rapide du schéma (risque de perte de données) |
| **Synchroniser la base de données (Prod)** | `npx prisma migrate deploy` | Mise à jour sécurisée du schéma (nécessite un fichier de migration) |
| **Générer les types** | `pnpm db:generate` | Met à jour les définitions TypeScript après un changement de schéma |
| **Afficher les données** | `npx prisma studio` | Ouvre l'interface utilisateur web pour parcourir les lignes de la base de données |
| **Linter le code** | `pnpm lint` | Vérifie le style du code et les erreurs |

### A.2 "Où est X ?" - Plan des Fichiers

Un guide de référence rapide pour les fichiers les plus importants de l'architecture.

| Concept | Emplacement du Fichier | Responsabilité |
| :--- | :--- | :--- |
| **Configuration du Domaine** | `apps/studio/lib/domains/*.ts` | Définit les actifs (Nœuds) et les entrées (Champs). |
| **Registre** | `apps/studio/lib/component-registry.tsx` | Mappe les IDs de configuration aux composants React. |
| **Nœuds React** | `apps/studio/components/canvas/smart-node.tsx` | Le composant visuel générique pour l'équipement. |
| **Logique Python** | `apps/engine/domains/[domain]/solver.py` | Le code de calcul mathématique/physique. |
| **Schéma de Base de Données** | `packages/database/prisma/schema.prisma` | La définition de la structure SQL. |
| **État du Canevas** | `apps/studio/store/canvas-store.ts` | Gestion de l'état du frontend (Zustand). |
| **Actions Serveur** | `apps/studio/app/actions/*.ts` | Couche API reliant le Client, la DB et le Moteur. |

### A.3 FAQ de dépannage

#### Q: J'ai ajouté un champ au Manifest, mais il n'apparaît pas.
**R:** Vérifiez `apps/studio/lib/registry.ts`. Avez-vous décommenté/importé votre nouveau fichier de configuration de domaine ? Assurez-vous également que l'ID de votre type de nœud dans le manifest correspond exactement à l'ID utilisé dans les clés de l'objet `nodeTypes`.

#### Q: La simulation renvoie "403 Forbidden".
**R:** Il s'agit d'une incompatibilité de sécurité.
1. Vérifiez `apps/studio/.env.local`: `INTERNAL_API_SECRET`.
2. Vérifiez `docker-compose.yml` ou `apps/engine/.env`: `INTERNAL_API_SECRET`.
3. Ils doivent être des chaînes de caractères identiques. Redémarrez le conteneur du moteur après l'avoir modifié.

#### Q: J'obtiens "PrismaClientInitializationError" dans les logs.
**R:** Le Studio ne peut pas atteindre la base de données.
1. Le conteneur Docker est-il en cours d'exécution ? (`docker-compose ps`)
2. Le port est-il correct ? Le port par défaut est `5434` (mappé au port interne 5432).
3. Vérifiez `DATABASE_URL` dans `.env`. Il devrait ressembler à : `postgresql://quantum:password@localhost:5434/quantum_core?schema=public`

#### Q: Mes modifications apportées à `solver.py` ne sont pas appliquées.
**R:** Python à l'intérieur de Docker ne se "recharge pas à chaud" automatiquement en mode production.
**Correction:** Exécutez `docker-compose restart engine`.

#### Q: Le canevas est vide ou plante au chargement.
**R:** Cela se produit souvent si l'ID `System` ou `Project` dans l'URL est invalide ou ne vous appartient pas.
1. Vérifiez votre URL : `/editor/[valid-project-id]?systemId=[valid-system-id]`.
2. Vérifiez la console du navigateur pour "Hydration Error" (rare dans cette base de code, mais possible si vous affichez directement des objets Date).

### A.4 Liste de contrôle de déploiement

Avant la mise en ligne (Production) :

1.  [ ] **Rotation des secrets :** Remplacez tous les secrets de remplacement dans les fichiers `.env`.
2.  [ ] **Vérification de la construction :** Exécutez `pnpm build` localement pour vous assurer qu'il n'y a pas d'erreurs de type.
3.  [ ] **Migration de la base de données :** Exécutez `prisma migrate deploy` sur la base de données de production.
4.  [ ] **Données d'amorçage :** Connectez-vous en tant qu'administrateur et cliquez sur les icônes "Seed" pour remplir les tables de la bibliothèque.
5.  [ ] **Variables d'environnement :** Assurez-vous que `ENGINE_URL` pointe vers l'alias du réseau Docker interne (par exemple, `http://engine:8000`) et non vers `localhost`.

---

**Fin de la documentation.** Vous êtes maintenant entièrement équipé pour maintenir, étendre et déployer Quantum Core. Bon travail d'ingénierie !
