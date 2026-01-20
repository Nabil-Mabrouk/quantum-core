---
title: "1-Configuration de l'environnement et configuration de la sécurité"
slug: "configuration-environnement-securite"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 1
---
# Configuration de l'environnement et de la sécurité

L'architecture Quantum Core se compose de trois services distincts qui doivent communiquer de manière sécurisée :
1.  **Studio (Next.js) :** L'interface utilisateur et la couche d'orchestration.
2.  **Engine (Python/FastAPI) :** L'unité de calcul scientifique.
3.  **Base de données (PostgreSQL) :** Le stockage persistant pour les projets et les bibliothèques.

Pour déployer ce système en toute sécurité, vous devez configurer le "Trust Bridge" entre ces services à l'aide de variables d'environnement.

### 1.1 Prérequis

Assurez-vous que la machine hôte (ou le pipeline CI/CD) a les éléments suivants installés :
*   **Node.js :** v18.17+ (LTS recommandé)
*   **pnpm :** v9.x (Requis pour les workspaces Turborepo)
*   **Python :** v3.10+ (Pour l'exécution locale du moteur)
*   **Docker & Docker Compose :** v2.20+

### 1.2 Le protocole "Secret Interne"

Le moteur Python est stateless et ne gère pas les sessions utilisateur. Au lieu de cela, il fait confiance aux requêtes provenant du Next.js Studio via une clé secrète partagée.

**⚠️ Sécurité Critique :**
Dans le code source (spécifiquement `docker-compose.yml` et `apps/engine/main.py`), un secret de remplacement (`super-secret-quantum-key-2026`) a été utilisé pour le développement. **Vous devez le remplacer pour la production.**

#### Générer un secret fort
Exécutez la commande suivante dans votre terminal pour générer une clé cryptographiquement forte :
```bash
openssl rand -base64 32
```
*Enregistrez cette sortie. Elle sera désignée ci-dessous par `[VOTRE_SECRET_GÉNÉRÉ]`.*

### 1.3 Configuration du moteur (Python)

Le moteur nécessite le secret pour valider les requêtes de simulation entrantes.

**1. Créer/Mettre à jour le fichier d'environnement**
Dans `apps/engine/.env` :
```ini
# Le port sur lequel le serveur FastAPI écoute
PORT=8000

# Le secret partagé (doit correspondre à la configuration du Studio)
INTERNAL_API_SECRET=[VOTRE_SECRET_GÉNÉRÉ]
```

**2. Patching de `docker-compose.yml`**
Le fichier `docker-compose.yml` original contenait une valeur codée en dur. Vous devez le mettre à jour pour utiliser la variable d'environnement.

*Fichier : `docker-compose.yml`*
```yaml
services:
  engine:
    build: ./apps/engine
    container_name: qcore_engine
    ports:
      - "8000:8000"
    environment:
      # CHANGÉ : Utilise maintenant l'interpolation de variable
      - INTERNAL_API_SECRET=${INTERNAL_API_SECRET} 
      - PYTHONUNBUFFERED=1
```

### 1.4 Configuration du Studio (Next.js)

Le Studio a besoin d'un accès à la base de données, des paramètres d'authentification et des coordonnées du Moteur.

**Créer/Mettre à jour `apps/studio/.env.local` :**

```ini
# --- Connexion à la base de données ---
# Assurez-vous que cela correspond à vos identifiants PostgreSQL
DATABASE_URL="postgresql://quantum:password@localhost:5434/quantum_core?schema=public"

# --- Authentification (NextAuth.js) ---
# Générez un nouveau secret : openssl rand -base64 32
AUTH_SECRET=[ANOTHER_GENERATED_SECRET]

# L'URL publique de l'application
AUTH_URL="http://localhost:3000"

# Fournisseur de messagerie (SMTP) pour les liens magiques
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="[YOUR_SMTP_PASSWORD]"
EMAIL_FROM="noreply@your-domain.com"

# --- Pont Moteur ---
# L'URL où Next.js peut trouver le conteneur Python
# Dans le réseau Docker, utilisez : http://engine:8000
# Pour le développement local, utilisez : http://127.0.0.1:8000
ENGINE_URL="http://127.0.0.1:8000"

# DOIT correspondre à la clé définie dans la Section 1.3
INTERNAL_API_SECRET=[VOTRE_SECRET_GÉNÉRÉ]

# --- Indicateurs de fonctionnalités ---
NEXT_PUBLIC_ACTIVE_DOMAIN="SURFACE_TREATMENT"
```

### 1.5 Étapes de Vérification

Avant de procéder au déploiement, vérifiez la configuration de sécurité :

1.  **Démarrer la Base de Données et le Moteur :**
    ```bash
    # Créez un fichier .env à la racine avec vos secrets pour Docker
    echo "INTERNAL_API_SECRET=[VOTRE_SECRET_GÉNÉRÉ]" > .env
    docker-compose up -d postgres engine
    ```

2.  **Tester le Verrouillage du Moteur :**
    Essayez d'appeler le moteur avec `curl` *sans* l'en-tête. Cela devrait échouer (403 Forbidden).
    ```bash
    curl -X POST http://localhost:8000/simulate \
      -H "Content-Type: application/json" \
      -d '{"domain": "TEST", "nodes": [], "edges": []}'
    ```
    *Résultat Attendu :* `{"detail":"Forbidden: Invalid API Secret"}`

3.  **Tester l'Accès au Moteur :**
    Essayez *avec* l'en-tête.
    ```bash
    curl -X POST http://localhost:8000/simulate \
      -H "x-internal-secret: [VOTRE_SECRET_GÉNÉRÉ]" \
      -H "Content-Type: application/json" \
      -d '{"domain": "TEST", "nodes": [], "edges": []}'
    ```
    *Résultat Attendu :* `400 Bad Request` (C'est bon ! Cela signifie que l'authentification a réussi, mais que la charge utile était invalide, ce qui confirme que le Moteur est accessible et sécurisé).
