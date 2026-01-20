---
title: "2-Gestion de Base de Données & Migrations"
slug: "gestion-database-migrations"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 2
---
# (Tuto 2/10) Gestion de Base de Données & Migrations

Dans **Quantum Core**, la base de données est la "Source de Vérité". Elle stocke tout : les comptes utilisateurs, les configurations de projet, les graphes d'ingénierie et les bibliothèques chimiques.

Nous utilisons **PostgreSQL** comme moteur de base de données et **Prisma ORM** pour interagir avec elle. Dans cette architecture Monorepo, la logique de la base de données est isolée dans un package partagé situé à `packages/database`. Cela garantit que le Studio (Next.js) et potentiellement d'autres services partagent exactement les mêmes types de données.

### 2.1 L'architecture des données

Avant d'exécuter des commandes, il est crucial de comprendre où réside la logique des données :

*   **Définition du schéma :** `packages/database/prisma/schema.prisma`
    *   Ce fichier définit vos tables (Modèles) et leurs relations.
*   **Client de base de données :** `packages/database/index.ts`
    *   Ceci exporte l'objet `db` utilisé dans toute l'application.
*   **Chaîne de connexion :** Définie dans votre fichier `.env` comme `DATABASE_URL`.

**Note pédagogique :** Lorsque vous modifiez le fichier `schema.prisma`, vous modifiez le *plan*. Vous devez ensuite "appliquer" ce plan au conteneur PostgreSQL réel et "générer" les types TypeScript afin que le code prenne connaissance des changements.

### 2.2 Démarrage du conteneur de base de données

Quantum Core inclut une configuration Docker pré-configurée pour PostgreSQL.

1.  **Démarrer la base de données :**
    Depuis la racine du projet, exécutez :
    ```bash
    docker-compose up -d postgres
    ```

2.  **Vérifier la connexion :**
    Le fichier `docker-compose.yml` mappe le port interne `5432` au port **`5434`** de votre machine (pour éviter les conflits si vous avez déjà PostgreSQL installé localement).
    *   **Hôte :** `localhost`
    *   **Port :** `5434`
    *   **Utilisateur :** `quantum`
    *   **Mot de passe :** `password`
    *   **Base de données :** `quantum_core`

### 2.3 Synchronisation du Schéma (Dev vs. Prod)

Il existe deux façons de synchroniser votre schéma Prisma avec la base de données. Choisir la mauvaise peut entraîner une perte de données.

#### A. La Méthode de Développement (`db:push`)
C'est ce qui est actuellement configuré dans `turbo.json`. Elle examine votre schéma et force la base de données à correspondre. C'est rapide et excellent pour le prototypage.

**Commande (depuis la racine) :**
```bash
pnpm db:push
```

*   **Ce qu'elle fait :** Met à jour la structure de la base de données immédiatement.
*   **⚠️ Risque :** Si vous avez renommé une colonne, elle pourrait supprimer l'ancienne et en créer une nouvelle, entraînant une perte de données. **N'utilisez pas cette méthode sur une base de données de production contenant des données réelles.**

#### B. La Méthode de Production (Migrations)
Pour un environnement de production stable, vous devriez utiliser les Migrations. Cela crée un fichier d'historique (`.sql`) de chaque modification.

**1. Créer une Migration (Développement) :**
Lorsque vous modifiez `schema.prisma` :
```bash
# Allez dans le package de la base de données
cd packages/database
npx prisma migrate dev --name decrivez_votre_changement
```

**2. Appliquer les Migrations (Production/CI) :**
Sur votre serveur ou pipeline CI/CD :
```bash
npx prisma migrate deploy
```

### 2.4 Génération du client (sécurité des types)

Chaque fois que le schéma change, les types TypeScript (`node_modules/@prisma/client`) doivent être régénérés. Si vous voyez des erreurs comme `Property 'cost' does not exist on type 'Node'`, cela signifie que votre client n'est pas synchronisé.

**Commande (depuis la racine) :**
```bash
pnpm db:generate
```

*Astuce : Turborepo est configuré pour exécuter cette commande automatiquement lorsque vous lancez `pnpm build`, mais pendant le développement, vous pourriez avoir besoin de la déclencher manuellement après une modification du schéma.*

### 2.5 Amorçage des données initiales

Une nouvelle installation de Quantum Core est vide. Vous devez injecter les "Données Maîtresses" (Utilisateur Admin Initial et Bibliothèques).

#### 1. Création du premier administrateur
Étant donné que l'application restreint l'inscription aux invitations ou à des domaines spécifiques, vous devez souvent insérer manuellement le premier utilisateur administrateur pour accéder au tableau de bord `/admin`.

Vous pouvez utiliser **Prisma Studio**, un éditeur visuel intégré :

1. Exécutez `npx prisma studio` (dans `packages/database` ou à la racine).
2. Cela ouvrira une page web à l'adresse `http://localhost:5555`.
3. Sélectionnez le modèle **User**.
4. Cliquez sur **Add Record** (Ajouter un enregistrement) :
    * **Email :** `admin@quantum.corp`
    * **Role :** `ADMIN` (Crucial : Sélectionnez ADMIN dans le menu déroulant de l'énumération)
    * **Name :** `System Admin`
5. Cliquez sur **Save Changes** (Enregistrer les modifications).

Vous pouvez maintenant vous connecter via la page de connexion avec cet e-mail (en utilisant le Magic Link / la sortie console en mode développement).

#### 2. Hydratation des bibliothèques (Catalogue et Chimie)
L'application contient des "Seeders" intégrés, déclenchés via l'interface utilisateur, pour peupler les bibliothèques d'ingénierie.

1. Connectez-vous en tant qu'**Admin** que vous venez de créer.
2. Naviguez vers le tableau de bord.
3. Recherchez les **Icônes de base de données** dans la barre de navigation supérieure (En-tête).
    * **Icône 1 (Base de données) :** Importe le catalogue de matériel (Pompes, Réservoirs, Capteurs).
    * **Icône 2 (Fiole) :** Importe la bibliothèque chimique (Ions, Réactifs pour le domaine H2O).
4. Cliquez dessus une fois. Vous verrez des notifications "toast" confirmant l'importation.

### 2.6 Dépannage des problèmes courants

**Erreur : `P1001: Impossible d'atteindre le serveur de base de données à localhost:5434`**
*   **Cause :** Le conteneur Docker n'est pas en cours d'exécution.
*   **Solution :** Exécutez `docker-compose ps`. Si `postgres` n'est pas listé, exécutez `docker-compose up -d postgres`.

**Erreur : `La table public.User n'existe pas dans la base de données actuelle`**
*   **Cause :** Vous vous êtes connecté à la base de données, mais les tables n'ont pas encore été créées.
*   **Solution :** Exécutez `pnpm db:push` pour créer la structure des tables.

**Erreur : `Le client n'est pas compatible avec le schéma`**
*   **Cause :** Vous avez mis à jour `schema.prisma` mais n'avez pas mis à jour les fichiers générés.
*   **Solution :** Exécutez `pnpm db:generate`.
