---
title: "3-L'intégration du moteur Python"
slug: "integration-moteur-python"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 3 
---

# (Tuto 3/10) L'intégration du moteur Python

Si le Studio (Next.js) est le "Corps" de Quantum Core, gérant l'interface utilisateur et le stockage des données, le **Moteur** en est le "Cerveau".

Ce chapitre explique comment la couche de calcul scientifique fonctionne, comment elle communique avec le reste du système et comment la surveiller dans un environnement de production.

### 3.1 Architecture : La Calculatrice Apatride

Le concept le plus important à comprendre concernant le Moteur (`apps/engine`) est qu'il est **apatride** (stateless).

*   Il ne se connecte **pas** à la base de données.
*   Il ne sait **pas** qui est l'utilisateur.
*   Il ne se souvient **pas** des calculs précédents.

**Comment ça marche :**
1.  Il attend une requête contenant une description complète d'un système (Nœuds, Tuyaux, Recettes Chimiques).
2.  Il construit un modèle mathématique (Matrices).
3.  Il résout le modèle (Algèbre Linéaire).
4.  Il renvoie les résultats et oublie immédiatement tout.

**Note Pédagogique :** Cette conception rend le moteur très robuste. Vous pouvez redémarrer le conteneur Python à tout moment sans perdre de données utilisateur. Si le moteur plante, cela n'affecte que le calcul spécifique en cours à cet instant précis.

### 3.2 Le Pont de Communication

Le Studio communique avec le Moteur via des requêtes **HTTP POST**. Cette communication se fait entièrement **côté serveur**. Le navigateur de l'utilisateur ne parle jamais directement au moteur Python ; le serveur Next.js agit comme un proxy.

**Le Flux :**
1.  **Action Utilisateur :** L'utilisateur clique sur "Simuler" dans le navigateur.
2.  **Action Serveur :** Next.js déclenche `actions/simulation.ts`.
3.  **Transformation :** Le code convertit le format de la base de données (Nœuds Visuels) en format Physique (Listes de Topologie).
4.  **L'Appel :** Next.js envoie une requête POST à `ENGINE_URL` (défini dans `.env`) avec l'en-tête `INTERNAL_API_SECRET`.
5.  **Réponse :** Python renvoie les valeurs calculées (Débits, Concentrations).
6.  **Mise à Jour :** Next.js met à jour la base de données et les magasins de l'interface utilisateur via les actions du serveur.

### 3.3 Surveillance du Cerveau

Étant donné que le moteur effectue des calculs complexes, il est le composant le plus susceptible de rencontrer des erreurs "logiques" (par exemple, une division par zéro si un utilisateur conçoit un mauvais réseau de tuyaux).

#### A. Journaux Docker (Le Flux Brut)
Pour voir exactement ce que fait le moteur, consultez les journaux du conteneur. Le moteur utilise un journaliseur JSON personnalisé pour une sortie lisible par machine.

```bash
docker logs -f qcore_engine
```

**Exemple de sortie :**
```json
{
  "timestamp": "2026-01-17 14:05:00",
  "level": "INFO",
  "message": "Simulation demandée pour : SURFACE_TREATMENT",
  "project_id": "cm1...",
  "path": "/simulate-stream",
  "process_time": "0.452s"
}
```

#### B. La Console de Simulation (Le Flux UI)
L'application implémente une **Réponse en Streaming**. Lorsqu'une simulation s'exécute, le Moteur envoie les données morceau par morceau.
*   Dans l'interface utilisateur de Studio, un tiroir "Console" s'ouvre en bas à droite.
*   Ceci affiche les étapes de progression en temps réel (par exemple, "Construction de la Matrice...", "Résolution de l'Itération 4...").
*   Ceci est utile pour déboguer les simulations lentes sans consulter les journaux du serveur.

### 3.4 Tâches de maintenance courantes

#### Mise à jour de la logique du solveur
La logique physique se trouve dans `apps/engine/domains/surface_treatment/solver.py`.
Si vous deployez une mise à jour de code sur le moteur :
1.  **Reconstruire le conteneur :** Puisqu'il s'agit de Python, le code n'est pas "rechargé à chaud" en production de manière efficace sans un redémarrage.
    ```bash
    docker-compose up -d --build engine
    ```
2.  **Pas d'interruption de service (Astuce) :** Étant donné que le Studio gère les tentatives, un bref redémarrage ressemble généralement à un long indicateur de chargement pour l'utilisateur.

#### Mise à l'échelle
Si de nombreux utilisateurs exécutent des simulations simultanément, le moteur Python (limité par le CPU) deviendra le goulot d'étranglement.
*   **Docker Swarm / Kubernetes :** Vous pouvez déployer plusieurs répliques du conteneur `engine`.
*   **Équilibrage de charge :** Puisque le moteur est sans état, un simple équilibreur de charge Round-Robin peut distribuer les requêtes sur 5 ou 10 instances de moteur de manière transparente.

### 3.5 Guide de dépannage

**Scénario 1: `FetchError: ECONNREFUSED`**
*   **Symptôme:** Le Studio affiche "Erreur de connexion" immédiatement après avoir cliqué sur Simuler.
*   **Diagnostic:** Next.js ne trouve pas le conteneur Python.
*   **Solution:** Vérifiez `ENGINE_URL` dans `.env`. À l'intérieur de Docker, il devrait être `http://engine:8000`. Localement, il pourrait être `http://127.0.0.1:8000`.

**Scénario 2: `403 Forbidden`**
*   **Symptôme:** Les journaux affichent "Forbidden: Invalid API Secret".
*   **Diagnostic:** Le `INTERNAL_API_SECRET` dans Next.js ne correspond pas à celui de Python.
*   **Solution:** Assurez-vous que les deux conteneurs partagent exactement la même chaîne dans leurs variables d'environnement.

**Scénario 3: "Singular Matrix" / "LinAlgError"**
*   **Symptôme:** L'utilisateur voit une erreur rouge "Erreur de convergence".
*   **Diagnostic:** Il s'agit d'une **Erreur Physique**, et non d'un bug dans le code. Cela signifie que l'utilisateur a conçu un système mathématiquement impossible (par exemple, une boucle fermée de tuyaux sans sortie, ou tenter de calculer la concentration dans un réservoir vide).
*   **Solution:** Demandez à l'utilisateur de vérifier les connexions de son graphique (les flèches doivent être correctement connectées).
