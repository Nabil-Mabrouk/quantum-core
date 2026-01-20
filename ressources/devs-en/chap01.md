---
title: "Environment Setup & Security Configuration"
slug: "environement-setup-security-configuration"
published: true
tags: "Devs"
---
# (Tuto 1/10) Environment Setup & Security Configuration

The Quantum Core architecture consists of three distinct services that must communicate securely:
1.  **Studio (Next.js):** The user interface and orchestration layer.
2.  **Engine (Python/FastAPI):** The scientific calculation unit.
3.  **Database (PostgreSQL):** The persistent storage for projects and libraries.

To deploy this system securely, you must configure the "Trust Bridge" between these services using environment variables.

### 1.1 Prerequisites

Ensure the host machine (or CI/CD pipeline) has the following installed:
*   **Node.js:** v18.17+ (LTS recommended)
*   **pnpm:** v9.x (Required for Turborepo workspaces)
*   **Python:** v3.10+ (For local engine execution)
*   **Docker & Docker Compose:** v2.20+

### 1.2 The "Internal Secret" Protocol

The Python Engine is stateless and does not handle user sessions. Instead, it trusts requests coming from the Next.js Studio via a shared secret key.

**⚠️ Security Critical:**
In the source code (specifically `docker-compose.yml` and `apps/engine/main.py`), a placeholder secret (`super-secret-quantum-key-2026`) was used for development. **You must replace this for production.**

#### Generating a Strong Secret
Run the following command in your terminal to generate a cryptographically strong key:
```bash
openssl rand -base64 32
```
*Save this output. It will be referred to as `[YOUR_GENERATED_SECRET]` below.*

### 1.3 Configuring the Engine (Python)

The Engine requires the secret to validate incoming simulation requests.

**1. Create/Update Environment File**
In `apps/engine/.env`:
```ini
# The port the FastAPI server listens on
PORT=8000

# The Shared Secret (Must match the Studio's configuration)
INTERNAL_API_SECRET=[YOUR_GENERATED_SECRET]
```

**2. Patching `docker-compose.yml`**
The original `docker-compose.yml` contained a hardcoded value. You must update it to use the environment variable.

*File: `docker-compose.yml`*
```yaml
services:
  engine:
    build: ./apps/engine
    container_name: qcore_engine
    ports:
      - "8000:8000"
    environment:
      # CHANGED: Now uses variable interpolation
      - INTERNAL_API_SECRET=${INTERNAL_API_SECRET} 
      - PYTHONUNBUFFERED=1
```

### 1.4 Configuring the Studio (Next.js)

The Studio needs database access, authentication settings, and the Engine's coordinates.

**Create/Update `apps/studio/.env.local`:**

```ini
# --- Database Connection ---
# Ensure this matches your PostgreSQL credentials
DATABASE_URL="postgresql://quantum:password@localhost:5434/quantum_core?schema=public"

# --- Authentication (NextAuth.js) ---
# Generate a new secret: openssl rand -base64 32
AUTH_SECRET=[ANOTHER_GENERATED_SECRET]

# The public URL of the application
AUTH_URL="http://localhost:3000"

# Email Provider (SMTP) for Magic Links
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="[YOUR_SMTP_PASSWORD]"
EMAIL_FROM="noreply@your-domain.com"

# --- Engine Bridge ---
# The URL where Next.js can find the Python Container
# Inside Docker network use: http://engine:8000
# For local dev use: http://127.0.0.1:8000
ENGINE_URL="http://127.0.0.1:8000"

# MUST match the key defined in Section 1.3
INTERNAL_API_SECRET=[YOUR_GENERATED_SECRET]

# --- Feature Flags ---
NEXT_PUBLIC_ACTIVE_DOMAIN="SURFACE_TREATMENT"
```

### 1.5 Verification Steps

Before proceeding to deployment, verify the security configuration:

1.  **Start the Database and Engine:**
    ```bash
    # Create an .env file in root with your secrets for Docker
    echo "INTERNAL_API_SECRET=[YOUR_GENERATED_SECRET]" > .env
    docker-compose up -d postgres engine
    ```

2.  **Test the Engine Lock:**
    Try to curl the engine *without* the header. It should fail (403 Forbidden).
    ```bash
    curl -X POST http://localhost:8000/simulate \
      -H "Content-Type: application/json" \
      -d '{"domain": "TEST", "nodes": [], "edges": []}'
    ```
    *Expected Result:* `{"detail":"Forbidden: Invalid API Secret"}`

3.  **Test the Engine Access:**
    Try *with* the header.
    ```bash
    curl -X POST http://localhost:8000/simulate \
      -H "x-internal-secret: [YOUR_GENERATED_SECRET]" \
      -H "Content-Type: application/json" \
      -d '{"domain": "TEST", "nodes": [], "edges": []}'
    ```
    *Expected Result:* `400 Bad Request` (This is good! It means auth passed, but the payload was invalid, which confirms the Engine is reachable and secure).
