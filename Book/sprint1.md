# Chapitre 2 : Sprint 1 - Le Lien Neuronal

## 1. Objectif du Sprint

Une fois l'usine construite (Sprint 0), nous avions deux cerveaux isolés : le cerveau gauche (Next.js) capable de gérer l'utilisateur, et le cerveau droit (Python) capable de calculer. Le but du Sprint 1 était de créer une synapse artificielle entre eux.

Le défi n'était pas seulement technique ("faire une requête HTTP"), mais architectural : **Comment garantir que seul notre frontend Next.js puisse solliciter le moteur de calcul, tout en protégeant ce dernier du monde extérieur ?**

## 2. Le Pattern "Backend-for-Frontend" (BFF)

Nous avons choisi d'utiliser Next.js non seulement comme un serveur de rendu (SSR), mais comme une **API Gateway**.

Dans notre architecture, le navigateur du client ne parle **jamais** directement à Python.
*   ❌ *Mauvais :* `Browser` -> `Python API` (Problèmes de CORS, d'authentification double, d'exposition de l'IP).
*   ✅ *Bon (Notre choix) :* `Browser` -> `Next.js Server Action` -> `Python API`.

Next.js agit comme un **Proxy de confiance**. Il vérifie l'identité de l'humain (via le cookie de session), puis il endosse son rôle de "système" pour parler à Python.

## 3. Sécurité : Le Secret Partagé (Internal Secret)

Puisque Next.js et Python tournent dans un réseau privé (Docker ou VPC), nous n'avons pas besoin d'OAuth2 complexe pour leur communication. Nous avons opté pour un **Secret d'API Interne** (`INTERNAL_API_SECRET`).

C'est une clé cryptographique longue, connue uniquement des deux serveurs via leurs variables d'environnement.
1.  Next.js injecte cette clé dans le header `x-internal-secret` à chaque requête.
2.  FastAPI intercepte la requête grâce à une "Dependency" (`verify_secret`) et rejette impitoyablement tout appel qui ne possède pas ce sésame (Erreur 403).

Ce mécanisme simple est extrêmement robuste pour la communication machine-à-machine (M2M).

## 4. Le Contrat d'Interface (Payload JSON)

Pour que l'abstraction fonctionne, les deux systèmes doivent parler la même langue. Nous avons défini un format de données pivot en JSON :

```json
{
  "domain": "WATER",
  "nodes": [ { "id": "1", "type": "TANK", "properties": {...} } ],
  "edges": [ { "source": "1", "target": "2", "properties": {...} } ]
}
```

*   **Côté Python (Pydantic) :** Ce JSON est automatiquement validé et converti en objets Python typés. Si Next.js envoie un champ manquant, Python renvoie une erreur explicite avant même de lancer le calcul.
*   **Côté TypeScript :** Nous avons typé le payload pour garantir que les développeurs frontend envoient des structures conformes.

## 5. Rétrospective : Pourquoi le "Server Action" change tout ?

Avant Next.js 14, nous aurions dû créer une route API (`pages/api/calculate.ts`) et l'appeler via `fetch` depuis le client React.

Avec les **Server Actions**, nous avons pu écrire une fonction asynchrone `runSimulationAction` qui s'exécute directement sur le serveur, mais que l'on appelle depuis le bouton React comme une fonction locale.
*   **Gain de sécurité :** La clé API secrète ne quitte jamais le serveur. Elle n'est pas visible dans le code source du navigateur ("Network Tab").
*   **Simplicité :** Pas de gestion de `JSON.stringify` ou de headers côté client. L'appel ressemble à un simple appel de fonction JavaScript.

---

### Conclusion du Chapitre 2

Le "système nerveux" de Quantum Core est opérationnel. Nous avons prouvé qu'un clic sur une interface React peut déclencher un algorithme Python isolé et récupérer des KPIs structurés.

La route est ouverte pour le **Sprint 2** : Nous allons maintenant attaquer le cœur de l'innovation de Quantum Core : **L'Interface pilotée par la Configuration (Config-Driven UI).** Nous allons arrêter d'envoyer des données fictives et permettre à l'utilisateur de créer ses propres nœuds.

