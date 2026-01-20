---
title: "4-Monitoring & Observabilité"
slug: "monitoring-observabilite"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 4 
---

# (Tuto 4/10) Monitoring & Observabilité

Dans un contexte industriel, "Ça marche sur ma machine" ne suffit pas. Vous devez savoir *qui* fait *quoi*, et si le système est sain.

Quantum Core implémente une stratégie d'**Observabilité à Double Couche** :
1.  **Journaux Système (DevOps) :** Sorties brutes des conteneurs (plantages, erreurs réseau).
2.  **Pistes d'Audit (Business) :** Enregistrements structurés des actions des utilisateurs (simulations exécutées, retours envoyés, projets créés) stockés dans la base de données.

### 4.1 Le Centre de Commande Admin

L'application est livrée avec un Hub d'Administration intégré, restreint aux utilisateurs ayant le rôle `ADMIN`. C'est votre interface principale pour le suivi quotidien sans toucher à la ligne de commande.

**Accès :** `https://votre-domaine.com/admin` (ou `/admin/stats`)

#### Sections Clés :
*   **KPIs (Centre de Commande) :** Métriques en temps réel sur l'acquisition d'utilisateurs (Leads), les projets actifs et les taux de conversion.
*   **Observabilité (Logs) :** Une interface de recherche pour le Journal d'Audit.
*   **Contenu (Expertise) :** Gestion du blog technique/base de connaissances.

### 4.2 Le système de piste d'audit

Contrairement aux journaux de serveur standard qui sont éphémères (perdus au redémarrage), la piste d'audit est persistante. Elle est conçue pour la **traçabilité** et la **conformité**.

#### Comment ça marche
Le système utilise une action de serveur dédiée `recordAuditLog` (`apps/studio/app/actions/audit.ts`) pour écrire les événements dans la table `AuditLog` de PostgreSQL.

**Les événements enregistrés incluent :**
*   `SIMULATION_RUN` : Chaque fois qu'un utilisateur déclenche un calcul (utile pour suivre les coûts de calcul).
*   `AI_CHAT_STREAM` : utilisation de l'assistant LLM (proxy d'utilisation des jetons).
*   `FEEDBACK_SUBMITTED` : Rapports directs des utilisateurs.
*   `ERROR` : Défaillances critiques de l'application interceptées par les gestionnaires de limites.

#### Affichage des journaux
Naviguez vers **Admin > System Logs**.
Le composant `LogsDashboard` vous permet de :
1.  **Filtrer par gravité** : Isoler rapidement les erreurs des informations.
2.  **Inspecter les charges utiles** : Cliquez sur l'icône "Œil" pour voir le contexte JSON (par exemple, quel ID de projet spécifique a provoqué un crash).
3.  **Rechercher** : Trouver toutes les actions effectuées par un e-mail d'utilisateur spécifique.

### 4.3 Maintenance : Rotation des journaux

Au fil du temps, la table `AuditLog` va s'agrandir. Un mécanisme de purge est implémenté pour maintenir les performances de la base de données.

**Nettoyage manuel :**
1.  Allez dans **Admin > Journaux système**.
2.  Cliquez sur le bouton **"Purger les anciens journaux"**.
3.  Ceci déclenche l'action `clearOldLogsAction`, qui supprime les enregistrements de plus de 30 jours.

*Note pédagogique pour les DevOps :* Dans un environnement de production à fort trafic, vous devriez automatiser cette tâche. Vous pouvez configurer une tâche cron pour appeler cette action ou exécuter directement une requête SQL :
```sql
DELETE FROM "AuditLog" WHERE "createdAt" < NOW() - INTERVAL '90 days';
```

### 4.4 Vérification de l'état du système

Si les utilisateurs signalent que "Le système est en panne", suivez cet organigramme de diagnostic :

#### 1. Vérifier le statut des conteneurs
Les conteneurs Docker sont-ils réellement en cours d'exécution ?
```bash
docker-compose ps
```
*   **Sain :** Statut `Up` pour `studio`, `engine` et `postgres`.
*   **Malsain :** `Exit 1` ou `Restarting`.

#### 2. Vérifier la connectivité de la base de données
Le Studio est-il connecté à Postgres ?
*   Allez sur la page principale du **Hub d'administration** (`/admin`).
*   Regardez le pied de page. Il y a un indicateur **"Base de données : Connectée"**.
*   *Fonctionnement :* La page tente une requête de base de données légère (`db.user.count()`) lors du rendu. Si elle échoue, la page affichera une erreur ou un état déconnecté.

#### 3. Vérifier la liaison du moteur Python
Le pont est-il actif ?
*   Il n'y a pas de connexion persistante à vérifier (stateless).
*   **Test :** Créez un projet "Hello World", ajoutez une Source et un Sink, puis cliquez sur "Simuler".
*   **Succès :** Le tiroir "Console" s'ouvre et affiche la progression.
*   **Échec :** Une notification "Red Toast" apparaît. Vérifiez immédiatement `docker logs qcore_engine`.

### 4.5 Stratégie de Sauvegarde

Les données sont l'actif le plus précieux. Puisque tout l'état est dans PostgreSQL, la sauvegarde est simple.

**Commande de Sauvegarde :**
```bash
docker exec -t qcore_db pg_dumpall -c -U quantum > dump_$(date +%Y-%m-%d).sql
```

**Commande de Restauration :**
```bash
cat dump_2026-01-17.sql | docker exec -i qcore_db psql -U quantum -d quantum_core
```
