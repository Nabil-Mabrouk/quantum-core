# Chapitre 4 : Sprint 3 - La Mémoire du Graphe

## 1. L'Enjeu de la Persistance Générique
Sauvegarder un graphe est une tâche complexe. Sauvegarder un graphe dont on ne connaît pas les propriétés à l'avance (le propre de Quantum Core) est un défi architectural. 

L'objectif de ce sprint était de transformer nos composants visuels éphémères en enregistrements permanents dans **PostgreSQL**.

## 2. Le Choix Technologique : Driver Adapters et JSONB
Nous avons utilisé **Prisma 7**. Cette version moderne impose une séparation stricte entre la définition du schéma et la connexion réelle. 

*   **JSONB pour la flexibilité :** Pour rester "agnostiques", nous ne créons pas de colonnes pour chaque propriété physique (volume, tension, débit). Nous utilisons une colonne unique de type `Json` (JSONB en PostgreSQL). Cela permet de stocker n'importe quelle structure de données métier sans jamais migrer la base de données.
*   **Driver Adapters :** Pour garantir la compatibilité avec les environnements "Serverless" et "Edge", nous avons implémenté l'instanciation du client via `@prisma/adapter-pg`.

## 3. Stratégie de Sauvegarde : "Atomic Replace"
Pour ce premier palier, nous avons opté pour une stratégie de sauvegarde simple mais robuste : la transaction atomique. À chaque clic sur "Sauvegarder", le système :
1. Ouvre une transaction SQL.
2. Supprime l'ancien état du graphe pour le projet donné.
3. Réinsère les nouveaux nœuds et liens avec leurs positions et propriétés JSON.
Cela garantit qu'on ne se retrouve jamais avec un graphe "partiel" ou corrompu en cas d'erreur réseau.

## 4. Rétrospective : Les Pièges de la Configuration de Base de Données
Le passage à Prisma 7 et l'architecture Monorepo ont révélé des difficultés majeures de "plomberie" technique :

*   **Le Défi du Localhost :** Sur Windows, la résolution de `localhost` vers Docker est souvent instable pour les drivers Node.js. Nous avons résolu les erreurs de connexion (P1001) en basculant sur l'adresse IP explicite `127.0.0.1`.
*   **L'Isolation des Secrets :** Dans un Monorepo, Prisma ne charge pas toujours automatiquement le fichier `.env` du dossier parent. Nous avons dû forcer le chargement des variables d'environnement via un fichier `prisma.config.ts` explicite utilisant l'helper `env()`.
*   **L'Instanciation du Client :** Nous avons appris que `new PrismaClient()` ne suffit plus lorsque l'`url` est absente du schéma. Il faut lui injecter manuellement l'adaptateur de driver configuré avec le Pool de connexion PostgreSQL.

---
