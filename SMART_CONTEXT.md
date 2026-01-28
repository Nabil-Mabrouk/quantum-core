# 🧠 SMART CONTEXT FOR AI AGENT
> Ce fichier contient une version compressée du code source. Les fichiers critiques sont complets, les autres sont squelettisés (signatures uniquement).

### 📂 PROJECT STRUCTURE
```
808-quantum-core/
├── AGENTS.md
├── README.md
├── SMART_CONTEXT.md
├── TODO.md
├── context.py
├── context_short.py
├── .vincent/
│   ├── mcp.json
├── Book/
│   ├── introduction.md
│   ├── sprint0.md
│   ├── sprint1.md
│   ├── sprint2.md
│   ├── sprint3.md
│   ├── sprint4.md
│   ├── sprint5.md
│   ├── sprint6.md
├── notebooks/
├── quantum-core/
│   ├── README.md
│   ├── docker-compose.yml
│   ├── package.json
│   ├── pnpm-workspace.yaml
│   ├── turbo.json
│   ├── .vscode/
│   │   ├── settings.json
│   ├── apps/
│   │   ├── engine/
│   │   │   ├── main.py
│   │   │   ├── orchestrator.py
│   │   │   ├── .pytest_cache/
│   │   │   │   ├── README.md
│   │   │   │   ├── v/
│   │   │   │   │   ├── cache/
│   │   │   ├── domains/
│   │   │   │   ├── surface_treatment/
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── solver.py
│   │   │   ├── tests/
│   │   │   │   ├── test_st_advanced.py
│   │   │   │   ├── test_st_solver.py
│   │   ├── studio/
│   │   │   ├── README.md
│   │   │   ├── auth.config.ts
│   │   │   ├── auth.ts
│   │   │   ├── eslint.config.js
│   │   │   ├── middleware.ts
│   │   │   ├── next-env.d.ts
│   │   │   ├── next.config.js
│   │   │   ├── package.json
│   │   │   ├── postcss.config.js
│   │   │   ├── tailwind.config.ts
│   │   │   ├── tsconfig.json
│   │   │   ├── app/
│   │   │   │   ├── actions/
│   │   │   │   │   ├── admin-blog.ts
│   │   │   │   │   ├── admin-logs.ts
│   │   │   │   │   ├── audit.ts
│   │   │   │   │   ├── blog.ts
│   │   │   │   │   ├── catalog.ts
│   │   │   │   │   ├── configuration.ts
│   │   │   │   │   ├── graph.ts
│   │   │   │   │   ├── leads.ts
│   │   │   │   │   ├── library.ts
│   │   │   │   │   ├── project.ts
│   │   │   │   │   ├── security.ts
│   │   │   │   │   ├── sequence.ts
│   │   │   │   │   ├── simulation.ts
│   │   │   │   │   ├── stream.ts
│   │   │   │   │   ├── system.ts
│   │   │   │   │   ├── upload.ts
│   │   │   │   ├── api/
│   │   │   │   │   ├── ai-chat/
│   │   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── [...nextauth]/
│   │   │   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── simulation/
│   │   │   │   │   │   ├── stream/
│   │   │   │   │   │   │   ├── route.ts
│   │   │   │   ├── [locale]/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── (admin)/
│   │   │   │   │   │   ├── admin/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   ├── blog/
│   │   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   │   ├── [id]/
│   │   │   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   ├── leads/
│   │   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   ├── logs/
│   │   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   ├── stats/
│   │   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── (marketing)/
│   │   │   │   │   │   ├── layout.tsx
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── blog/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   │   ├── pengraph-image.tsx
│   │   │   │   │   │   ├── login/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── editor/
│   │   │   │   │   │   ├── [id]/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── fonts/
│   │   │   │   │   ├── library/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── project/
│   │   │   │   │   │   ├── [id]/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── admin-header.tsx
│   │   │   │   │   ├── blog-batch-tools.tsx
│   │   │   │   │   ├── blog-delete-button.tsx
│   │   │   │   │   ├── create-tutorial-modal.tsx
│   │   │   │   │   ├── edit-post-form.tsx
│   │   │   │   │   ├── logs-dashboard.tsx
│   │   │   │   │   ├── manage-tutorials-modal.tsx
│   │   │   │   ├── canvas/
│   │   │   │   │   ├── flow-editor.tsx
│   │   │   │   │   ├── generic-node.tsx
│   │   │   │   │   ├── layer-control.tsx
│   │   │   │   │   ├── smart-node.tsx
│   │   │   │   │   ├── synoptic-editor.tsx
│   │   │   │   │   ├── blueprint/
│   │   │   │   │   │   ├── blueprint-flow.tsx
│   │   │   │   │   │   ├── system-node.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── create-project-modal.tsx
│   │   │   │   │   ├── project-card.tsx
│   │   │   │   ├── domains/
│   │   │   │   │   ├── surface_treatment/
│   │   │   │   │   │   ├── endpoint-node.tsx
│   │   │   │   │   │   ├── network-manager.tsx
│   │   │   │   │   │   ├── process-report.tsx
│   │   │   │   │   │   ├── stream-connection-widget.tsx
│   │   │   │   │   │   ├── water-properties-widget.tsx
│   │   │   │   ├── layout/
│   │   │   │   │   ├── app-shell.tsx
│   │   │   │   │   ├── catalog-selector.tsx
│   │   │   │   │   ├── editor-client-layout.tsx
│   │   │   │   │   ├── generic-report-viewer.tsx
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   ├── network-manager.tsx
│   │   │   │   │   ├── node-palette.tsx
│   │   │   │   │   ├── project-initializer.tsx
│   │   │   │   │   ├── project-settings-modal.tsx
│   │   │   │   │   ├── properties-panel.tsx
│   │   │   │   │   ├── sequence-manager.tsx
│   │   │   │   │   ├── summary-view.tsx
│   │   │   │   │   ├── system-selector.tsx
│   │   │   │   │   ├── workspace.tsx
│   │   │   │   │   ├── shell/
│   │   │   │   │   │   ├── language-switcher.tsx
│   │   │   │   │   │   ├── side-nav.tsx
│   │   │   │   │   │   ├── universal-header.tsx
│   │   │   │   ├── library/
│   │   │   │   │   ├── library-manager.tsx
│   │   │   │   │   ├── reference-item-editor.tsx
│   │   │   │   │   ├── views/
│   │   │   │   │   │   ├── library-io-view.tsx
│   │   │   │   │   │   ├── library-specs-view.tsx
│   │   │   │   ├── marketing/
│   │   │   │   │   ├── blog-search-grid.tsx
│   │   │   │   │   ├── lead-capture.tsx
│   │   │   │   │   ├── share-button.tsx
│   │   │   │   │   ├── tutorial-nav.tsx
│   │   │   │   ├── providers/
│   │   │   │   │   ├── auth-provider.tsx
│   │   │   │   │   ├── confirm-provider.tsx
│   │   │   │   ├── ui/
│   │   │   │   │   ├── ai-chat-modal.tsx
│   │   │   │   │   ├── dynamic-icon.tsx
│   │   │   │   │   ├── feedback-modal.tsx
│   │   │   │   │   ├── markdown-viewer.tsx
│   │   │   │   │   ├── node-selector.tsx
│   │   │   │   │   ├── resizable-panel.tsx
│   │   │   │   │   ├── simulation-console.tsx
│   │   │   │   │   ├── tabs.tsx
│   │   │   ├── lib/
│   │   │   │   ├── component-registry.tsx
│   │   │   │   ├── domain-config.ts
│   │   │   │   ├── i18n.ts
│   │   │   │   ├── registry.ts
│   │   │   │   ├── domains/
│   │   │   │   │   ├── energy.ts
│   │   │   │   │   ├── surface-treatment.ts
│   │   │   ├── locales/
│   │   │   │   ├── en.json
│   │   │   │   ├── fr.json
│   │   │   ├── public/
│   │   │   │   ├── uploads/
│   │   │   ├── store/
│   │   │   │   ├── canvas-store.ts
│   │   │   │   ├── types.ts
│   │   │   │   ├── domains/
│   │   │   │   │   ├── surface_treatment/
│   │   │   │   │   │   ├── topology.ts
│   │   │   │   ├── slices/
│   │   │   │   │   ├── graph-slice.ts
│   │   │   │   │   ├── sequence-slice.ts
│   │   │   │   │   ├── workspace-slice.ts
│   │   │   ├── types/
│   │   │   │   ├── next-auth.d.ts
│   ├── packages/
│   │   ├── database/
│   │   │   ├── index.ts
│   │   │   ├── package.json
│   │   │   ├── prisma.config.ts
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   ├── eslint-config/
│   │   │   ├── README.md
│   │   │   ├── base.js
│   │   │   ├── next.js
│   │   │   ├── package.json
│   │   │   ├── react-internal.js
│   │   ├── typescript-config/
│   │   │   ├── base.json
│   │   │   ├── nextjs.json
│   │   │   ├── package.json
│   │   │   ├── react-library.json
│   │   ├── ui/
│   │   │   ├── package.json
│   │   │   ├── tsconfig.json
│   │   │   ├── src/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── code.tsx
├── ressources/
│   ├── blog-test/
│   │   ├── 01-philosophy-engineering-os.md
│   │   ├── 02-meta-model-jsonb-theory.md
│   │   ├── 03-architecture-hybrid-stack.md
│   │   ├── 04-theory-logical-sequences.md
│   │   ├── 05-domain-agnosticism-future.md
│   │   ├── 06-Surface-treatment-solver.md
│   ├── devs-en/
│   │   ├── chap01.md
│   │   ├── chap02.md
│   │   ├── chap03.md
│   │   ├── chap04.md
│   │   ├── chap05.md
│   │   ├── chap06.md
│   │   ├── chap07.md
│   │   ├── chap08.md
│   │   ├── chap09.md
│   │   ├── chap10.md
│   ├── devs-fr/
│   │   ├── chap01.md
│   │   ├── chap02.md
│   │   ├── chap03.md
│   │   ├── chap04.md
│   │   ├── chap05.md
│   │   ├── chap06.md
│   │   ├── chap07.md
│   │   ├── chap08.md
│   │   ├── chap09.md
│   │   ├── chap10.md
│   ├── Libraries/
│   │   ├── chemicals/
│   │   │   ├── chemistry_library.json
│   │   ├── config/
│   │   │   ├── config_water.json
│   │   ├── equipements/
│   │   │   ├── equipment_library.json
│   │   ├── ions-reageant-chemicals/
│   │   │   ├── chemicals.json
│   ├── TS-en/
│   │   ├── chao04.md
│   │   ├── chap01.md
│   │   ├── chap02.md
│   │   ├── chap03.md
│   │   ├── chap05.md
│   ├── tuto-TS-en/
│   │   ├── eng-tuto1.md
│   │   ├── eng-tuto2.md
│   │   ├── eng-tuto3.md
│   │   ├── eng-tuto4.md
│   │   ├── eng-tuto5.md
│   ├── Tutos-devs-en/
│   │   ├── intro.md
│   │   ├── tuto1.md
│   │   ├── tuto2.md
│   │   ├── tuto3.md
│   │   ├── tuto4.md
│   │   ├── tuto5.md
│   │   ├── tuto6.md
```


============================================================
FILE: AGENTS.md (SKELETON)
============================================================
```md
Voici deux "System Prompts" (Instructions Système) conçus pour maximiser l'efficacité des modèles LLM (comme GPT-4, Claude 3.5 Sonnet) dans le cadre de votre projet **Quantum Core**.

Vous pouvez copier-coller ces instructions directement dans l'interface de chat ou les configurer comme "Custom Instructions".

---

## 1. Instruction pour l'Agent "Auditeur de Code" (Sécurité & Performance)

Ce prompt transforme l'IA en un auditeur impitoyable qui ne laisse rien passer. Il est structuré pour forcer une analyse en profondeur.

**Copier-coller le bloc ci-dessous :**

```markdown
### RÔLE
Tu es un Architecte Logiciel Senior spécialisé en Cyber-sécurité (CISSP) et en Optimisation de Performance Haute Fréquence. Ta mission est d'auditer le code source du projet "Quantum Core" (Next.js, Python/FastAPI, Prisma, PostgreSQL, Docker).
### OBJECTIFS
    *   Hardcoded Secrets (.env, docker-compose).
    *   Injections (SQL, Command, XSS).
    *   Broken Access Control (IDOR, Middleware bypass, Role escalation).
    *   Validation des entrées (Zod, Type checking).
    *   Problèmes "N+1" dans les requêtes DB (Prisma).
    *   Blocages de l'Event Loop (Node.js) ou du GIL (Python).
    *   Rendu React inutile (Re-renders).
    *   Payloads réseau trop lourds.
    *   Assurer que les corrections proposées ne cassent pas la logique métier.
    *   Maintenir le typage strict (TypeScript).
    *   Garantir la gestion des erreurs (Try/Catch, Graceful Degradation).
### MÉTHODOLOGIE D'ANALYSE
### FORMAT DE SORTIE ATTENDU
**[FICHIER]** `nom_du_fichier.ext`
**[TYPE]** (SÉCURITÉ | PERFORMANCE | QUALITÉ)
**[SEVERITÉ]** (CRITIQUE | ÉLEVÉE | MOYENNE)
**[DESCRIPTION]** Explication concise du pourquoi c'est un problème.
**[IMPACT]** Conséquence concrète (ex: "Un utilisateur peut supprimer le projet d'un autre").
**[CODE CORRIGÉ]** :
// Ton code corrigé et sécurisé ici
**ATTENTION :** Ne sois pas complaisant. Si le code est mauvais, dis-le. Si une pratique est "dépréciée" ou "dangereuse", signale-le. Considère que ce code va en production demain pour 1000 utilisateurs simultanés.
## 2. Instruction pour l'Agent "Développeur / Feature" (Implémentation Sécurisée)
**Copier-coller le bloc ci-dessous :**
### RÔLE
### TA PHILOSOPHIE : "DO NO HARM"
### CHECKLIST OBLIGATOIRE AVANT GÉNÉRATION
    *   Est-ce que j'expose une nouvelle route API ? Si oui, ai-je ajouté l'authentification ET l'autorisation (RBAC) ?
    *   Est-ce que je prends des données utilisateur ? Si oui, ai-je validé avec Zod/Pydantic ?
    *   Est-ce que j'accède à la base de données ? Si oui, est-ce que je vérifie que l'utilisateur possède la ressource (userId check) ?
    *   Est-ce que j'ajoute une requête dans une boucle ? (Interdit).
    *   Est-ce que j'utilise `await` inutilement en série au lieu de `Promise.all` ?
    *   Est-ce que je charge trop de données en mémoire ?
    *   Interdiction d'utiliser `any` ou `@ts-ignore`.
### INSTRUCTIONS D'ÉCRITURE
### FORMAT DE RÉPONSE
### Comment utiliser ces instructions efficacement ?
    *   Faites passer l'**Agent Auditeur** sur un fichier (ex: `actions/graph.ts`).
    *   Prenez ses corrections.
    *   Donnez le code corrigé à l'**Agent Développeur** si vous devez ajouter une feature par-dessus, en lui disant "Voici la base saine et sécurisée, ajoute maintenant la fonctionnalité X".
```

============================================================
FILE: README.md (SKELETON)
============================================================
```md
# Quantum
```

============================================================
FILE: SMART_CONTEXT.md (SKELETON)
============================================================
```md
# 🧠 SMART CONTEXT FOR AI AGENT
> Ce fichier contient une version compressée du code source. Les fichiers critiques sont complets, les autres sont squelettisés (signatures uniquement).

### 📂 PROJECT STRUCTURE
```
808-quantum-core/
├── AGENTS.md
├── README.md
├── SMART_CONTEXT.md
├── TODO.md
├── context.py
├── context_short.py
├── .vincent/
│   ├── mcp.json
├── Book/
## 1. Instruction pour l'Agent "Auditeur de Code" (Sécurité & Performance)
**Copier-coller le bloc ci-dessous :**
### RÔLE
### OBJECTIFS
    *   Hardcoded Secrets (.env, docker-compose).
    *   Injections (SQL, Command, XSS).
    *   Broken Access Control (IDOR, Middleware bypass, Role escalation).
    *   Validation des entrées (Zod, Type checking).
    *   Problèmes "N+1" dans les requêtes DB (Prisma).
    *   Blocages de l'Event Loop (Node.js) ou du GIL (Python).
    *   Rendu React inutile (Re-renders).
    *   Payloads réseau trop lourds.
    *   Assurer que les corrections proposées ne cassent pas la logique métier.
    *   Maintenir le typage strict (TypeScript).
    *   Garantir la gestion des erreurs (Try/Catch, Graceful Degradation).
### MÉTHODOLOGIE D'ANALYSE
### FORMAT DE SORTIE ATTENDU
**[FICHIER]** `nom_du_fichier.ext`
**[TYPE]** (SÉCURITÉ | PERFORMANCE | QUALITÉ)
**[SEVERITÉ]** (CRITIQUE | ÉLEVÉE | MOYENNE)
**[DESCRIPTION]** Explication concise du pourquoi c'est un problème.
**[IMPACT]** Conséquence concrète (ex: "Un utilisateur peut supprimer le projet d'un autre").
**[CODE CORRIGÉ]** :
// Ton code corrigé et sécurisé ici
**ATTENTION :** Ne sois pas complaisant. Si le code est mauvais, dis-le. Si une pratique est "dépréciée" ou "dangereuse", signale-le. Considère que ce code va en production demain pour 1000 utilisateurs simultanés.
## 2. Instruction pour l'Agent "Développeur / Feature" (Implémentation Sécurisée)
**Copier-coller le bloc ci-dessous :**
### RÔLE
### TA PHILOSOPHIE : "DO NO HARM"
### CHECKLIST OBLIGATOIRE AVANT GÉNÉRATION
    *   Est-ce que j'expose une nouvelle route API ? Si oui, ai-je ajouté l'authentification ET l'autorisation (RBAC) ?
    *   Est-ce que je prends des données utilisateur ? Si oui, ai-je validé avec Zod/Pydantic ?
    *   Est-ce que j'accède à la base de données ? Si oui, est-ce que je vérifie que l'utilisateur possède la ressource (userId check) ?
    *   Est-ce que j'ajoute une requête dans une boucle ? (Interdit).
    *   Est-ce que j'utilise `await` inutilement en série au lieu de `Promise.all` ?
    *   Est-ce que je charge trop de données en mémoire ?
    *   Interdiction d'utiliser `any` ou `@ts-ignore`.
### INSTRUCTIONS D'ÉCRITURE
### FORMAT DE RÉPONSE
### Comment utiliser ces instructions efficacement ?
    *   Faites passer l'**Agent Auditeur** sur un fichier (ex: `actions/graph.ts`).
    *   Prenez ses corrections.
    *   Donnez le code corrigé à l'**Agent Développeur** si vous devez ajouter une feature par-dessus, en lui disant "Voici la base saine et sécurisée, ajoute maintenant la fonctionnalité X".
# 🧠 SMART CONTEXT FOR AI AGENT
### 📂 PROJECT STRUCTURE
## 1. Instruction pour l'Agent "Auditeur de Code" (Sécurité & Performance)
**Copier-coller le bloc ci-dessous :**
### RÔLE
### OBJECTIFS
    *   Hardcoded Secrets (.env, docker-compose).
    *   Injections (SQL, Command, XSS).
    *   Broken Access Control (IDOR, Middleware bypass, Role escalation).
    *   Validation des entrées (Zod, Type checking).
    *   Problèmes "N+1" dans les requêtes DB (Prisma).
    *   Blocages de l'Event Loop (Node.js) ou du GIL (Python).
    *   Rendu React inutile (Re-renders).
    *   Payloads réseau trop lourds.
    *   Assurer que les corrections proposées ne cassent pas la logique métier.
    *   Maintenir le typage strict (TypeScript).
    *   Garantir la gestion des erreurs (Try/Catch, Graceful Degradation).
### MÉTHODOLOGIE D'ANALYSE
### FORMAT DE SORTIE ATTENDU
**[FICHIER]** `nom_du_fichier.ext`
**[TYPE]** (SÉCURITÉ | PERFORMANCE | QUALITÉ)
**[SEVERITÉ]** (CRITIQUE | ÉLEVÉE | MOYENNE)
**[DESCRIPTION]** Explication concise du pourquoi c'est un problème.
**[IMPACT]** Conséquence concrète (ex: "Un utilisateur peut supprimer le projet d'un autre").
**[CODE CORRIGÉ]** :
// Ton code corrigé et sécurisé ici
**ATTENTION :** Ne sois pas complaisant. Si le code est mauvais, dis-le. Si une pratique est "dépréciée" ou "dangereuse", signale-le. Considère que ce code va en production demain pour 1000 utilisateurs simultanés.
## 2. Instruction pour l'Agent "Développeur / Feature" (Implémentation Sécurisée)
**Copier-coller le bloc ci-dessous :**
### RÔLE
### TA PHILOSOPHIE : "DO NO HARM"
### CHECKLIST OBLIGATOIRE AVANT GÉNÉRATION
    *   Est-ce que j'expose une nouvelle route API ? Si oui, ai-je ajouté l'authentification ET l'autorisation (RBAC) ?
    *   Est-ce que je prends des données utilisateur ? Si oui, ai-je validé avec Zod/Pydantic ?
    *   Est-ce que j'accède à la base de données ? Si oui, est-ce que je vérifie que l'utilisateur possède la ressource (userId check) ?
    *   Est-ce que j'ajoute une requête dans une boucle ? (Interdit).
    *   Est-ce que j'utilise `await` inutilement en série au lieu de `Promise.all` ?
    *   Est-ce que je charge trop de données en mémoire ?
    *   Interdiction d'utiliser `any` ou `@ts-ignore`.
### INSTRUCTIONS D'ÉCRITURE
### FORMAT DE RÉPONSE
### Comment utiliser ces instructions efficacement ?
    *   Faites passer l'**Agent Auditeur** sur un fichier (ex: `actions/graph.ts`).
    *   Prenez ses corrections.
    *   Donnez le code corrigé à l'**Agent Développeur** si vous devez ajouter une feature par-dessus, en lui disant "Voici la base saine et sécurisée, ajoute maintenant la fonctionnalité X".
### 1. Security Analysis
*   **Authentication & Authorization:**
    *   **Weakness (`middleware.ts`):** The middleware uses `@ts-ignore` to bypass type checking on `req.auth`. If the session structure changes, this could fail silently, potentially exposing admin routes.
    *   **Role Management:** The logic relies on `token.role` being passed to the session. While functional, `auth.config.ts` types are loose (`any`). A user with a manipulated JWT could potentially escalate privileges if the signing key isn't secure (though NextAuth handles signing well by default).
    *   **Resource Ownership (`graph.ts`):** The `verifyLineOwnership` function is implemented and called in `saveGraph`, which is excellent. However, `loadGraph` does **not** appear to verify ownership. A user could potentially load a graph they don't own if they guess the `lineId` (ID Enumeration attack), even if they can't save changes to it.
*   **API Communication:**
    *   **Strength (`simulation.ts` & `engine/main.py`):** The Next.js app communicates with the Python engine using an `INTERNAL_API_SECRET`. This prevents external actors from hitting the calculation engine directly, provided the `INTERNAL_API_SECRET` is strong and kept safe.
*   **Input Validation:**
    *   **Weakness (Server Actions):** In `project.ts` and `admin-blog.ts`, inputs from `FormData` are cast to string (`as string`) without strict validation. A user could submit empty strings or malicious payloads.
    *   **Strength (`leads.ts`):** Uses `zod` for email validation, which is the correct approach. This should be adopted across all actions.
*   **Dependencies:**
    *   The project uses `next-auth: 5.0.0-beta.30`. Beta versions can contain unpatched security flaws or breaking changes.
### 2. Performance Analysis
*   **Database Interactions (N+1 Problem):**
    *   **Risk (`graph.ts` - `saveGraph`):** The save logic performs a "Diff Sync" using `deleteMany` followed by loops of `upsert`. For a line with hundreds of nodes/edges, this generates a massive amount of SQL queries within a transaction. This will become a bottleneck.
    *   **Recommendation:** Use `createMany` for new items and batched updates, or send a simplified JSON blob to the DB if granular row-level access isn't strictly required for nodes.
*   **Computation (Python Engine):**
    *   **Risk (`solver.py`):** The solver runs `np.linalg.solve` on every request. There is no caching mechanism. If multiple users simulate the same configuration (or the same user clicks simulate repeatedly), the CPU will do redundant work.
    *   **Design Choice:** Passing the *entire* graph (nodes/edges/sequences) in the payload for every simulation (`SimulationPayload`) is bandwidth-heavy for large projects.
*   **Frontend Rendering:**
    *   **Optimization:** The `FlowEditor` uses `ReactFlow` with `useMemo` for node types, which prevents unnecessary re-renders.
    *   **Loading States:** The project uses `Promise.all` in `admin/stats/page.tsx` for parallel data fetching, which is excellent for load times.
### 3. Programming Errors & Code Quality
*   **Type Safety (TypeScript):**
    *   **Issue:** Extensive use of `any` (e.g., `canvas-store.ts`, `nodeTypes` in `node-palette.tsx`). This defeats the purpose of TypeScript and will lead to "Cannot read property of undefined" runtime errors as the project grows.
    *   **Specific:** In `middleware.ts`, `// @ts-ignore` is used to suppress a type error regarding `req.auth`.
*   **Dead Code / Commented Code:**
    *   **File:** `apps/engine/main.py`
    *   There are commented-out class definitions (`SequenceStep`, etc.) and logic for the "ENERGY" domain. This creates confusion about which data models are actually active.
*   **Encoding Issues:**
    *   **File:** `README.md`
    *   The scanner reported `[Error reading file: 'utf-8' codec can't decode byte...]`. This suggests the README might contain binary characters or be saved in a non-UTF-8 encoding (like Windows-1252), which will break CI/CD pipelines expecting UTF-8.
*   **Prisma Schema:**
    *   The `Project` model has `onDelete: Cascade` for lines, which is good. However, the `Sequence` model relies on string-based `nodeId` in `SequenceStep`. While there is a relation defined, ensuring data integrity when Nodes are deleted requires careful handling in the application logic (which `onNodesChange` in the store attempts to do, but server-side enforcement is safer).
### 4. Logic Errors
*   **Simulation Math (`solver.py`):**
    *   **Singularity Handling:** `A[i, i] = max(q_out_total[i], 1e-9)`. While this prevents division by zero, physically it means a tank with zero outflow acts as if it has a tiny outflow. This might mask configuration errors (e.g., a tank with no exit pipe) rather than alerting the user.
    *   **Sequence Logic:** The solver iterates through sequences to calculate drag-out. If a sequence references a Node ID that no longer exists (due to a sync error between graph and DB), the solver loop might crash or produce incorrect mass balances.
*   **State Synchronization (`project-initializer.tsx`):**
    *   The `lastLoadedLineId` ref is used to prevent infinite loops. However, if the user navigates away and back to the same line, the store might not reset correctly if the component doesn't unmount fully (Next.js client-side navigation).
*   **Blog Update Logic (`admin-blog.ts`):**
    *   The logic `const published = formData.get('published') === 'on';` is standard for HTML forms, but fragile. If the UI library (`shadcn` or similar) changes how it handles checkboxes (sending `true`/`false` strings instead of `on`), this logic will silently fail to publish posts.
### 5. Layout & Design Structure
*   **Architecture:**
    *   The separation of `marketing`, `admin`, and `editor` layouts via Next.js Route Groups (`(admin)`, `(marketing)`) is excellent. It keeps styles and layouts distinct.
*   **UI/UX:**
    *   **Responsive Design:** The CSS uses mobile-first approaches (`hidden lg:flex`). However, complex components like `FlowEditor` are inherently difficult on mobile. The `Workspace` layout assumes a desktop environment.
    *   **Z-Index Management:** `SequenceManager` uses `z-40` and fixed positioning. It might overlap with the `ReactFlow` controls (bottom left) or the `SummaryView` content on smaller screens.
*   **File Structure:**
    *   **Logic placement:** `apps/engine` (Python) handles domain logic, while `apps/studio` handles UI. This is a clean separation.
    *   **Store:** `canvas-store.ts` is becoming a "God Object" handling Workspace, Graph, and Sequence logic. It should likely be split into multiple stores or slices (as partially done, but all in one file).
### Summary of Recommendations
### 1. Sécurité
**Points Forts :**
*   **Isolation du Moteur :** Le moteur Python est isolé et protégé par un `INTERNAL_API_SECRET`. Il n'est pas exposé directement au public, mais proxifié par les Server Actions de Next.js.
*   **Vérification de Propriété (`graph.ts`) :** La fonction `getAuthenticatedSystem` vérifie bien que le `systemId` appartient à un projet dont l'utilisateur est propriétaire. C'est crucial pour éviter l'IDOR (Insecure Direct Object Reference).
*   **Architecture "Server-First" :** L'utilisation massive des Server Actions (`'use server'`) réduit la surface d'attaque côté client.
**Points Critiques & Vulnérabilités :**
*   **Gestion des Secrets (Docker) :** Dans `docker-compose.yml`, le secret `INTERNAL_API_SECRET` est hardcodé (`super-secret-quantum-key-2026`). En production, ceci doit passer par des variables d'environnement injectées au runtime, pas écrites dans le fichier.
*   **Validation des Entrées (Inconsistant) :**
    *   *Bien :* `actions/leads.ts` utilise `zod` pour valider l'email.
    *   *Risqué :* `actions/admin-blog.ts` fait des casts bruts (`formData.get('title') as string`). Si un attaquant envoie un objet ou un tableau, cela peut faire crasher le serveur ou causer des comportements inattendus.
    *   *Risqué :* `actions/library.ts` -> `importLibraryAction` parse du JSON uploadé par l'utilisateur sans limite de taille stricte ni validation profonde de la structure avant le parsing, ce qui expose au DoS (Denial of Service).
*   **Middleware Auth (`middleware.ts`) :** L'usage de `// @ts-ignore` sur `req.auth` est dangereux. Si la structure de l'objet session change (ce qui arrive souvent avec les bêtas de NextAuth v5), tes routes admin pourraient devenir accessibles ou crasher silencieusement.
*   **NextAuth Beta :** Tu utilises `next-auth: 5.0.0-beta.30`. Les versions bêta contiennent souvent des failles de sécurité non corrigées ou des changements de rupture.
### 2. Performance
**Points Forts :**
*   **Parallel Data Fetching :** Dans `admin/stats/page.tsx`, l'utilisation de `Promise.all` pour charger les stats en parallèle est excellente.
*   **React Flow Optimization :** L'usage de `useMemo` pour `nodeTypes` dans `flow-editor.tsx` évite des re-renders inutiles du graphe complet.
**Points d'Amélioration :**
*   **Le problème "N+1" en écriture (`saveGraph`) :**
    *   Dans `actions/graph.ts`, la sauvegarde fait un `deleteMany` puis une boucle `for` avec `upsert` pour chaque nœud et chaque lien.
    *   *Impact :* Pour un système de 500 nœuds, tu ouvres 1000+ requêtes SQL séquentielles dans une transaction. Cela va bloquer la DB.
    *   *Solution :* Utiliser `createMany` pour les insertions massives ou envoyer un JSON global si l'accès unitaire aux nœuds n'est pas requis par d'autres services.
*   **Moteur Python (Absence de Cache) :**
    *   Chaque clic sur "Simuler" renvoie tout le graphe au Python qui recalcule tout (matrices NumPy).
    *   *Solution :* Implémenter un hash du payload côté Python (ex: Redis) pour renvoyer le résultat caché si les inputs n'ont pas changé.
*   **Bundle Size :** L'import de `lucide-react` est généralement bon, mais assure-toi que ton `import * as Icons` dans `dynamic-icon.tsx` ne casse pas le Tree-Shaking. Charger toutes les icônes peut alourdir le bundle client considérablement.
### 3. Expérience Utilisateur (UX)
**Points Forts :**
*   **Feedback Visuel :** Les "Health Bars" de pollution sur les nœuds (`GenericNode`) et les animations de flux dans `BlueprintFlow` rendent la physique "visible".
*   **Navigation Contextuelle :** Le `UniversalHeader` qui change selon qu'on est au niveau Projet ou Système est très intuitif.
*   **Mode "Synoptique" vs "Graph" :** C'est une excellente idée. Les ingénieurs procédés aiment les schémas P&ID (Graphe), les opérateurs préfèrent les vues séquentielles (Synoptique).
**Points d'Amélioration :**
*   **Interactions Bloquantes :**
    *   L'utilisation de `alert()` et `confirm()` natifs (ex: `header.tsx`, `library-manager.tsx`) est à bannir en 2026. Cela bloque le thread principal du navigateur et fait "amateur".
    *   *Solution :* Utiliser les "Toasts" (ex: `sonner` ou `react-hot-toast`) et des Modales (Dialog) de ta bibliothèque UI.
*   **Gestion des Erreurs Moteur :** Si le conteneur Python est éteint, l'utilisateur reçoit une alerte générique. Il faudrait un état visuel "Système Déconnecté" dans le Header.
*   **Responsive Mobile :** Le `FlowEditor` et le `Synoptique` semblent difficilement utilisables sur mobile (pas de contrôles tactiles spécifiques visibles). Un avertissement "Vue optimisée pour Desktop" serait pertinent sur petit écran.
### 4. Navigabilité & Qualité du Code
**Points Forts :**
*   **Pattern "Domain Registry" (`lib/component-registry.tsx`) :**
    *   C'est brillant. Tu injectes dynamiquement les composants (Formulaires, Widgets, Nœuds) selon le domaine (`WATER`, `ENERGY`). Cela te permet d'ajouter le domaine "ENERGY" sans toucher au code cœur du Studio.
*   **Séparation Logiciel/Métier :**
    *   `apps/engine` contient la physique (Python).
    *   `apps/studio` contient l'interface.
    *   `packages/database` contient le schéma.
    *   C'est une séparation des responsabilités très propre (Clean Architecture).
**Points de Vigilance :**
*   **Le "God Store" (`canvas-store.ts`) :**
    *   Ce fichier gère tout : le graphe, la sélection, les séquences, le mode de vue, les données de bilan... Il devient massif.
    *   *Conseil :* Découper avec le pattern "Slice" de Zustand (`createGraphSlice`, `createUISlice`, `createSimulationSlice`) dans des fichiers séparés.
*   **Typage `any` :**
    *   Il y a beaucoup de `any` dans le code (ex: `items: any[]` dans `LibraryManager`, `config: any` dans les props).
    *   Cela annule les bénéfices de TypeScript. Il faudrait définir des interfaces strictes (`LibraryItem`, `DomainConfig`) dans un package partagé (`packages/types` ?).
### Résumé des priorités
# --- CONFIGURATION ---
# Directories to completely ignore
}
# Specific files to ignore (like heavy lock files)
}
# File extensions to include
}
  // ... implementation hidden for brevity ...
        # Remove ignored directories from search
            # Only show files in tree if they aren't ignored
  // ... implementation hidden for brevity ...
            # Only read the file if it has a relevant extension
  // ... implementation hidden for brevity ...
# --- CONFIGURATION ---
# 1. Dossiers et Fichiers à IGNORER totalement
}
# 2. Fichiers CRITIQUES à lire EN ENTIER (High Context)
# Mettez ici les fichiers qui contiennent la "vérité" du projet (Schémas, Auth, Config)
}
# 3. Extensions à traiter
  // ... implementation hidden for brevity ...
        # Vérifie aussi si un dossier parent est ignoré
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
    # Regex simples pour détecter les structures importantes
    # TS/JS: export, import, interface, type, function, class, const X = (
    # Python: def, class, import, from, @
        # Garder les 10 premières lignes (imports souvent)
        # Garder les commentaires (documentation)
        # Détection selon langage
            # Ajouter une ligne vide ou "..." si la ligne précédente ne l'était pas déjà
        # Garder les accolades fermantes pour la structure visuelle
  // ... implementation hidden for brevity ...
    # 1. Structure
    # 2. Contenu
                    # Pas de compression pour les fichiers critiques ou de config pure
                    # Compression intelligente
                # Estimation très grossière (1 mot ~ 1.3 tokens, code est dense)
    }
  }
}
# Introduction : L'Avènement de Quantum Core
## 1. La Genèse : Sortir de l'Enfer du "One-Shot"
**Quantum Core** né d'un refus de ce modèle.
## 2. La Philosophie : "Meta-Modélisation" et Abstraction
*   Pour **QuantumH2O**, ce nœud sera une "Cuve" avec un volume et un pH.
*   Pour **QuantumEnergy**, ce même nœud sera une "Batterie" avec une capacité et un voltage.
## 3. L'Architecture Hybride : Le Meilleur des Deux Mondes
*   Le web (JavaScript/TypeScript) est roi pour l'interface utilisateur, l'interactivité et la gestion de projet.
*   La science (Python) est reine pour le calcul matriciel, l'optimisation et l'Intelligence Artificielle.
### Le "Cerveau Gauche" : Next.js (Orchestration)
*   L'authentification et la sécurité (RBAC).
*   L'interface utilisateur (React, Tailwind, ReactFlow).
*   La persistance des données (PostgreSQL via Prisma).
*   La relation client (CMS, Leads).
### Le "Cerveau Droit" : FastAPI (Intelligence)
*   L'algèbre linéaire (NumPy) pour les bilans de masse et d'énergie.
*   L'IA Générative (LangChain/LLM) pour l'analyse de cahiers des charges (RAG) et la rédaction technique.
*   Il est "Stateless" : on lui envoie un problème (JSON), il renvoie une solution.
## 4. La Stack Technique (2025/2026 Ready)
*   **Langages :** TypeScript (Strict) & Python 3.11+.
*   **Frontend/BFF :** Next.js 15 (App Router, Server Actions).
*   **Backend Engine :** FastAPI + NumPy + Pydantic.
*   **Base de Données :** PostgreSQL (avec support JSONB et pgvector).
*   **ORM :** Prisma (pour la sécurité des types).
*   **Repo Management :** Turborepo (Monorepo) + pnpm.
*   **Infrastructure :** Docker Compose (Dev) / Architecture Conteneurisée (Prod).
## 5. Les Défis à Relever
# Chapitre 1 : Sprint 0 - Les Fondations de l'Usine
## 1. Objectif du Sprint
## 2. La Stratégie Monorepo (Turborepo & pnpm)
### Pourquoi ce choix ?
### L'Arborescence Cible
## 3. Le Schéma de Données "Meta-Model"
### Le changement de paradigme
*   **Avant (Approche classique) :** Une table par équipement. Si on veut ajouter un "Panneau Solaire", on doit migrer la DB.
*   **Après (Quantum Core) :** Une table `Node` universelle.
    *   `type`: String ("TANK", "SOLAR_PANEL")
    *   `properties`: **JSONB**. C'est ici que réside la flexibilité. PostgreSQL valide le format JSON, et nos validateurs applicatifs (Pydantic/Zod) valideront le contenu métier.
## 4. L'Orchestration Hybride (Docker)
## 5. Rétrospective : Difficultés Rencontrées et Solutions
### Défi n°1 : Le "Breaking Change" de Prisma 7
**Le Problème :** Nous avons adopté la toute dernière version de Prisma (v7.2.0). Lors de la génération du client, nous avons rencontré l'erreur `P1012`. La définition de l'URL de connexion directement dans `schema.prisma` (`url = env("...")`) est devenue obsolète et interdite.
**La Solution :**
*Leçon apprise :* Toujours vérifier les "Release Notes" des outils majeurs avant de commencer, surtout sur les versions "Bleeding Edge".
### Défi n°2 : La Rigueur de pnpm dans un Monorepo
**Le Problème :** Lors de l'installation des dépendances (`dotenv`, `@prisma/config`), nous avons eu des erreurs `ERR_PNPM_ADDING_TO_ROOT`. De plus, pnpm refusait d'installer des paquets dans `packages/database` car il ne le reconnaissait pas comme un module valide.
**La Solution :**
### Défi n°3 : L'Orchestration des Tâches avec Turbo
**Le Problème :** La commande `npx turbo run db:generate` échouait car Turborepo ne savait pas que cette tâche existait.
**La Solution :**
### Conclusion du Chapitre 1
*   Le moteur Python répond "OK".
*   La base de données est provisionnée avec un schéma générique.
*   Le frontend Next.js est prêt à démarrer.
# Chapitre 2 : Sprint 1 - Le Lien Neuronal
## 1. Objectif du Sprint
## 2. Le Pattern "Backend-for-Frontend" (BFF)
*   ❌ *Mauvais :* `Browser` -> `Python API` (Problèmes de CORS, d'authentification double, d'exposition de l'IP).
*   ✅ *Bon (Notre choix) :* `Browser` -> `Next.js Server Action` -> `Python API`.
## 3. Sécurité : Le Secret Partagé (Internal Secret)
## 4. Le Contrat d'Interface (Payload JSON)
}
*   **Côté Python (Pydantic) :** Ce JSON est automatiquement validé et converti en objets Python typés. Si Next.js envoie un champ manquant, Python renvoie une erreur explicite avant même de lancer le calcul.
*   **Côté TypeScript :** Nous avons typé le payload pour garantir que les développeurs frontend envoient des structures conformes.
## 5. Rétrospective : Pourquoi le "Server Action" change tout ?
*   **Gain de sécurité :** La clé API secrète ne quitte jamais le serveur. Elle n'est pas visible dans le code source du navigateur ("Network Tab").
*   **Simplicité :** Pas de gestion de `JSON.stringify` ou de headers côté client. L'appel ressemble à un simple appel de fonction JavaScript.
### Conclusion du Chapitre 2
# Chapitre 3 : Sprint 2 - L'Interface Polymorphe
## 1. Le Piège de l'Interface "Métier"
## 2. Le concept de "Domain Manifest"
// Ce simple objet transforme l'application
  }
};
## 3. Le Moteur de Rendu Visuel (ReactFlow)
**Résultat :** Pour ajouter un nouvel équipement dans le logiciel, il n'y a plus de code React à écrire. Il suffit d'ajouter 3 lignes dans le fichier JSON de configuration.
## 4. Gestion d'État (Zustand)
## 5. Rétrospective : Le Défi du Styling (Tailwind v4)
**Le Problème :**
**La Résolution :**
*Leçon apprise :* Dans un environnement Monorepo (Turborepo), la gestion des dépendances "peer" (comme PostCSS/Tailwind) doit être explicite dans chaque sous-projet (`apps/studio`) pour éviter les conflits de résolution.
# Chapitre 4 : Sprint 3 - La Mémoire du Graphe
## 1. L'Enjeu de la Persistance Générique
## 2. Le Choix Technologique : Driver Adapters et JSONB
*   **JSONB pour la flexibilité :** Pour rester "agnostiques", nous ne créons pas de colonnes pour chaque propriété physique (volume, tension, débit). Nous utilisons une colonne unique de type `Json` (JSONB en PostgreSQL). Cela permet de stocker n'importe quelle structure de données métier sans jamais migrer la base de données.
*   **Driver Adapters :** Pour garantir la compatibilité avec les environnements "Serverless" et "Edge", nous avons implémenté l'instanciation du client via `@prisma/adapter-pg`.
## 3. Stratégie de Sauvegarde : "Atomic Replace"
## 4. Rétrospective : Les Pièges de la Configuration de Base de Données
*   **Le Défi du Localhost :** Sur Windows, la résolution de `localhost` vers Docker est souvent instable pour les drivers Node.js. Nous avons résolu les erreurs de connexion (P1001) en basculant sur l'adresse IP explicite `127.0.0.1`.
*   **L'Isolation des Secrets :** Dans un Monorepo, Prisma ne charge pas toujours automatiquement le fichier `.env` du dossier parent. Nous avons dû forcer le chargement des variables d'environnement via un fichier `prisma.config.ts` explicite utilisant l'helper `env()`.
*   **L'Instanciation du Client :** Nous avons appris que `new PrismaClient()` ne suffit plus lorsque l'`url` est absente du schéma. Il faut lui injecter manuellement l'adaptateur de driver configuré avec le Pool de connexion PostgreSQL.
# Chapitre 5 : Sprint 4 - L'Intelligence des Objets
## 1. De la Forme à la Fonction
## 2. Le Moteur de Rendu de Formulaires (Schema-Driven UI)
## 3. Synchronisation d'État et UX
## 4. Rétrospective : La Puissance de l'Abstraction
*   Nous pouvons ajouter un paramètre "Viscosité" à une cuve en modifiant une seule ligne de JSON.
*   L'interface s'adapte instantanément.
*   La base de données accepte la donnée sans broncher.
*   Le développeur n'a pas touché au code "Core".
***
# Chapitre 6 : Sprint 5 - Le Réveil de l'Intelligence
## 1. La Fin de l'Amnésie Physique
## 2. Le Mapping de Données (Payload Transformation)
*   ReactFlow manipule des objets lourds contenant des informations de rendu (coordonnées pixel, état de drag, etc.).
*   Nous avons développé un "Mapper" dans la Server Action qui nettoie ces données pour n'extraire que la substantifique moelle : le type de nœud et son dictionnaire de propriétés JSONB.
## 3. L'Analyse Topologique en Python
## 4. L'Interface de Feedback (Dashboard d'Analyse)
# Sprint 6 : Le Flux de Masse (Hydraulique & Connexions)
**Objectif :** Faire circuler "quelque chose" dans les tuyaux. 
### 1. Mise à jour du Manifeste (`lib/domain-config.ts`)
// apps/studio/lib/domain-config.ts
  // ... nodeTypes ...
    }
  }
};
### 2. Le Moteur Python : Loi des Nœuds (Bilan de Masse)
*   Pour chaque cuve, Python va calculer : `Somme(Entrées) - Somme(Sorties)`.
*   Si le résultat n'est pas zéro, il enverra un **Alerte de Débordement** ou de **Vidange**.
### 3. UI : Édition des liens
### Pourquoi c'est le "vrai" début de Quantum ?
**Es-tu prêt à coder la logique des flux ?**
***
# Chapitre 7 : Sprint 6 — La Dynamique des Flux
## 1. De la Statique à la Cinétique
## 2. Abstraction des Edges
## 3. Le Premier "Juge" Physique : Le Bilan de Masse
*   **Résultat > 0** : Risque de débordement.
*   **Résultat < 0** : Risque de désamorçage ou vidange.
## 4. Rétrospective : La Gestion des Sélections Hybrides
# Sprint 7 : Le Catalogue et le "Sizing" (Dimensionnement)
**Objectif :** Ne plus saisir des valeurs au hasard, mais choisir du matériel réel. 
### 1. La Base de Données "Catalogue"
### 2. UI : Le Sélecteur de Composant
### 3. Intelligence : Le "Auto-Fill" et la Validation
*   Quand l'utilisateur choisit une pompe de 12 $m^3/h$ dans le catalogue, le champ `flowRate` du nœud se remplit tout seul.
*   Le moteur Python pourra alors comparer la performance de l'équipement choisi avec le besoin réel du système.
### Pourquoi c'est l'étape cruciale pour le business ?
**Es-tu prêt à intégrer le catalogue d'équipements ?**
# Quantum Core
## What's inside?
### Apps and Packages
### Documentation
### Development
### Build
  # 1. Base de données
  # 2. Moteur de Calcul (Python)
  # 3. Studio (Préparation pour le futur ou le déploiement)
  # studio:
  #   build: 
  #     context: .
  #     dockerfile: apps/studio/Dockerfile.dev
  #   ports:
  #     - "3000:3000"
  #   volumes:
  #     - .:/app
  #     - /app/node_modules
  #     - ./apps/studio/public/uploads:/app/apps/studio/public/uploads # Persistance des images
  #   environment:
  #     - DATABASE_URL=postgresql://quantum:password@postgres:5432/quantum_core
  #     - ENGINE_URL=http://engine:8000
  }
}
    }
  }
}
    }
}
# apps/engine/main.py
# --- REGISTRE DES SOLVEURS (ENGINEERING OS PATTERN) ---
# Centralise ici les points d'entrée des domaines. 
# main.py ne connaît plus la logique interne des domaines.
    # "AI_FACTORY": run_ai_factory_stream, <-- Futur domaine
}
# --- CONFIGURATION DU LOGGING (JSON) ---
    }
        }
# --- INITIALISATION ---
)
        # En production, on pourrait forcer l'arrêt ici
# --- MODÈLES DE DONNÉES (Génériques) ---
# --- SÉCURITÉ ---
    # compare_digest évite de révéler quelle partie du secret est correcte via le temps de réponse
# --- ROUTES API ---
        # Conversion unique du payload pour NumPy/Logic métier
        # model_dump est plus performant que json.loads(payload.json())
        )
    # On réutilise la logique de streaming mais on consomme tout avant de répondre
# --- AUTRES POINTS D'ENTRÉE ---
# Import du solveur
    # Registre des flux (Bus de données)
    }
    # 1. Calcul de l'ordre
    # 2. Boucle de résolution
        # A. Injection des Inputs depuis le Bus
                # Optionnel : injecter aussi les concentrations entrantes si le solveur le supporte
        # B. Exécution du Solver Local
            # --- CORRECTION CRITIQUE : Conversion Pydantic -> Dict ---
            # Appel du générateur
            )
            # Consommation du flux pour obtenir le résultat final
            # C. Publication des Outputs vers le Bus
                    # Mélange Physique (Moyenne pondérée par le débit)
                    }
    }
  // ... implementation hidden for brevity ...
    # Mapping Stream -> Producer System
    # Graphe de dépendance
    # Algorithme de Kahn
    # Fallback si cycle
# pytest cache directory #
**Do not** commit this to version control.
        # --- LECTURE DES PARAMÈTRES GLOBAUX D'ÉVAPORATION ---
        # Valeurs par défaut génériques pour la sécurité (Fallback strict)
        # --- 1. PARAMÈTRES TEMPORELS ---
        # Ratio pour convertir l'évaporation (168h) en débit d'appoint (Working Hours)
        # --- 2. LOGISTIQUE : CALCUL DU DRAG-OUT (Entraînement) ---
            # Flux = Cadence (m2/h) * Entraînement spécifique (L/m2)
        # --- 3. CHIMIE : PRÉPARATION DES CIBLES (FLATTENING) ---
        # --- 4. HYDRAULIQUE : ÉVAPORATION, VIDANGES ET APPOINTS ---
        # A. INTEGRATION DES VIDANGES (DUMPING)
        # On transforme les vidanges périodiques en débit continu moyenné
                # Débit équivalent lissé (L/h)
                # Direction vers le drain
        # B. CALCUL DE L'ÉVAPORATION ET APPOINT ASSOCIÉ
            # Si c'est un bain, on calcule l'appoint automatique
                # Perte nette entraînement + Vidange
                # 🚩 DEBUG POINT 1 (Vérifie si on entre dans la boucle)
                # 🚩 DEBUG POINT 2 (Vérifie la valeur)
        # C. STABILISATION DES CASCADES DE RINÇAGE
                    # Entrées : Eau + Entraînement + Manuel
                    # Sorties prévisibles : Entraînement aval + Évaporation + Vidange
                    # Le reliquat part en surverse (Overflow)
        # --- 5. CHIMIE : RÉSOLUTION Ax = b ---
                # Somme des débits de liquide sortants (Eau + Entraînement)
                # Note: La vidange est déjà dans water_flows
        # Calcul des ajouts chimiques (Masse)
        # --- 6. FINALISATION ET KPIS ---
# apps/engine/tests/test_st_advanced.py
    # 1. SETUP NODES
            }
            }
    # 2. SETUP LOGISTICS (Bath -> R1 -> R2)
    # 3. SETUP LIBRARY (Flattening: Product -> Reagent -> Ion)
    }
    # 4. EXECUTE
    # --- 5. PHYSICAL VERIFICATIONS ---
    # A. Test Evaporation + Drag-out Compensation
    # Evap efficace = 4.2 L/h. Perte Drag-out = 10 L/h. 
    # Total "In" pour le bain doit être 14.2 L/h
    # B. Test Cascade Hydraulics (CORRIGÉ)
    # Rinse 2 reçoit 200 (eau) + 10 (pièces). Il déborde de 210 vers Rinse 1.
    # Rinse 1 reçoit 210 (eau) + 10 (pièces). Il sort 10 (pièces) + 210 (débordement).
    # Total "Out" de Rinse 1 = 220.0 L/h
    # C. Test de l'Équilibre de Masse (Uniquement pour les cuves de process)
    # On crée un dictionnaire pour accéder facilement aux types des nœuds
        # On n'équilibre pas les sources (elles fournissent) 
        # ni les drains (ils collectent)
        # Pour tout le reste (Bains, Rinçages), l'équilibre doit être parfait
# apps/engine/tests/test_st_solver.py
    # 1. PRÉPARATION DES DONNÉES (Mock du payload Studio)
            }
            }
        }
            }
        }
            }
    }
    }
    # 2. EXÉCUTION DU SOLVEUR
    # 3. VERIFICATIONS (ASSERTIONS)
    # Vérification de la concentration dans le rinçage (Doit être 10.0 g/L)
    # Formule : (10 L/h * 100 g/L) / (10 L/h + 90 L/h) = 10 g/L
    # Vérification du flux à l'égout (100 L/h)
## Getting Started
# or
# or
# or
## Learn More
## Deploy on Vercel
// apps/studio/auth.config.ts
    // 1. On ajoute le rôle au JWT lors de la connexion
      }
    // 2. On transmet le rôle du JWT vers la session accessible par le Middleware/UI
      }
      // Si on tente d'aller sur /admin...
        // @ts-ignore
      }
// apps/studio/auth.ts
// C'est cette ligne qui manquait ou était incomplète
        }
/** @type {import("eslint").Linter.Config[]} */
// 1. TYPAGE INTERNE POUR LA SÉCURITÉ DU CODE
    }
}
      }
    }
  }
}
// 2. LOGIQUE DU MIDDLEWARE
// Note : On ne met pas 'export default' ici directement pour éviter l'erreur d'inférence
  // On cast 'req' pour avoir l'autocomplétion sur 'req.auth' à l'intérieur
  // A. EXCLUSION
  }
  // B. LOCALE
  }
  // C. SÉCURITÉ
    }
    }
  }
// 3. EXPORT FINAL AVEC CAST
// C'est cette ligne qui corrige l'erreur "The inferred type..."
// On dit à TypeScript : "C'est bon, exporte ça comme un objet générique, ne cherche pas plus loin."
};
/// <reference types="next" />
/// <reference types="next/image-types/global" />
// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
/** @type {import('next').NextConfig} */
  }
}
}
      // 1. Définition des Keyframes (les mouvements)
        // Animation pour l'effet de brillance sur la carte "Engine"
        // Animation pour le texte dégradé du Hero
      // 2. Définition des utilitaires d'animation
};
      }
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
          }
      }
        }
    }
  }
}
  // ... implementation hidden for brevity ...
  }
  }
      }
  }
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // FIX: Fetch the user first
      // FIX: Use 'connect' syntax for relations
      }
    }
}
  // ... implementation hidden for brevity ...
    }
      // FIX: Connect the same author
      }
    }
}
  // ... implementation hidden for brevity ...
      }
  }
}
  // ... implementation hidden for brevity ...
    // 1. On détache d'abord tous les articles liés (pour éviter les erreurs de contrainte)
    // 2. On supprime le tutoriel
  }
}
// Verify Admin privileges
  // @ts-ignore - 'role' is injected via auth.config.ts
  }
}
  // ... implementation hidden for brevity ...
  // Filter by Action Type (Dropdown)
  }
  // Filter by Search (User ID, Domain, or ID)
  }
  // Fetch logs (Limit 100 for performance, could add pagination later)
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    }
}
    // Ne pas rejeter l'erreur pour ne pas bloquer l'action principale
  }
}
// apps/studio/app/actions/blog.ts
          }
        }
      }
    }
}
/**
 * NEW: Helper to find the slug of the SAME post in another language.
 * Used for the Language Switcher in the Header.
 */
  // ... implementation hidden for brevity ...
}
// --- SECURITY HELPER ---
  // @ts-ignore
  }
}
  // ... implementation hidden for brevity ...
    }
      }
  }
}
// --- CORRECTION DU TYPE ET DE LA LOGIQUE PRISMA ---
  // ... implementation hidden for brevity ...
  // 1. Construction dynamique de la clause Where
    // Si on reçoit un tableau ["REAGENT", "ION"], on utilise l'opérateur IN de Prisma
    // Sinon on fait une égalité simple
  }
}
// --- SECURITY HELPER ---
  // @ts-ignore
  }
}
// Validation du format du JSON de configuration
      // ... implementation hidden for brevity ...
        // ... implementation hidden for brevity ...
  )
/**
 * Importe un JSON de configuration des champs
 * Format attendu : { "PUMP": [ ...fields ], "TANK": [ ...fields ] }
 * Si une catégorie contient un tableau vide [], la configuration est supprimée (Reset).
 */
  // ... implementation hidden for brevity ...
  }
        // LOGIQUE DE RESET : Si le tableau de champs est vide, on supprime la config en base
          // Sinon, on met à jour (Upsert standard)
        }
      }
  }
}
/**
 * Récupère les schémas dynamiques pour l'éditeur
 */
  // ... implementation hidden for brevity ...
  // On transforme le tableau DB en objet { "PUMP": fields, ... }
}
// ====================================================================
// 1. SÉCURITÉ
// ====================================================================
  }
  // Vérification stricte : le système doit appartenir à un projet de l'utilisateur
    }
  }
}
// ====================================================================
// 2. CHARGEMENT (LOAD) - CORRIGÉ
// ====================================================================
  // ... implementation hidden for brevity ...
    // ✅ CORRECTION : On charge TOUT (Nodes, Edges, ET Séquences)
    // On utilise une seule requête relationnelle puissante plutôt que Promise.all
          }
        }
      }
    // Mapping Nodes
      // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
        // On réinjecte les IDs de streams pour le front
    // Mapping Edges
      // ... implementation hidden for brevity ...
        // ... implementation hidden for brevity ...
    // ✅ CORRECTION : Mapping Séquences
      // ... implementation hidden for brevity ...
  }
}
// ====================================================================
// 3. SAUVEGARDE (SAVE) - CORRIGÉ
// ====================================================================
  // ... implementation hidden for brevity ...
      // ✅ CORRECTION : Suppression SÉQUENTIELLE (Pas de Promise.all)
      // Pour éviter les verrous mortels (Deadlocks) et les erreurs de Clés Étrangères
      // 1. D'abord les petits enfants (Steps)
      // 2. Puis les parents (Sequences)
      // 3. Puis les dépendances (Edges)
      // 4. Enfin les maîtres (Nodes)
      // --- RECRÉATION ---
              // ... implementation hidden for brevity ...
            // ✅ CORRECTION : Mapping des colonnes relationnelles (Streams)
            // C'est vital pour que le solveur Python puisse relier les systèmes entre eux
      }
      }
        // Aplanissement des steps (Flatten)
        }
      }
  }
}
// apps/studio/app/actions/leads.ts
// 1. Define the schema
  // 2. Validate input
  }
  }
}
/**
 * Interface étendue pour NextAuth
 */
}
// --- SECURITY HELPER ---
  // ... implementation hidden for brevity ...
  }
}
// --- ACTIONS DE RÉCUPÉRATION ---
  // ... implementation hidden for brevity ...
  // Récupération optimisée avec tri
      }
}
// --- ACTIONS DE MODIFICATION ---
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    // 1. Upsert de l'item principal (Clé unique sur 'name' assurée par le schéma)
      }
    // 2. Synchronisation de la composition (Delete + Create)
      }
    }
}
  // ... implementation hidden for brevity ...
  // Empêcher la suppression si l'item est une dépendance
  }
}
// --- LOGIQUE D'IMPORTATION JSON (OPTIMISÉE) ---
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
  }
      // ÉTAPE 1 : Création des items parents (Bulk possible si on gère les conflits)
      // On utilise une boucle mais on évite les findUnique redondants
          }
      }
      // ÉTAPE 2 : Reconstruction des liens (Composition)
      // On récupère tous les IDs en une seule fois pour le mapping name -> id
        }
      }
  }
}
// --- EXPORTATION ---
  // ... implementation hidden for brevity ...
      }
}
// --- UTILITAIRES DE CALCUL (ALGORITHME OPTIMISÉ) ---
/**
 * Aplatit récursivement la nomenclature (BOM) en minimisant les appels DB.
 * Stratégie : Chargement de l'arbre de dépendance complet en une fois.
 */
  // ... implementation hidden for brevity ...
  // 1. On récupère d'abord l'item racine pour connaître son domaine
  // 2. On charge TOUS les liens de composition du domaine pour construire le graphe en mémoire
  // Cela évite le N+1 récursif en base de données.
    }
  // 3. Parcours DFS en mémoire (Ultra rapide)
    // ... implementation hidden for brevity ...
    }
    }
  }
}
// 'use server' indique que ce code s'exécute uniquement côté serveur.
// Il a accès direct à la BDD et aux secrets, mais rien ne fuite vers le client.
// 👇 Import des utilitaires dynamiques du registre (Étape cruciale pour la modularité)
// 👇 Import du logger de sécurité
// ====================================================================
// 1. SCHÉMAS DE VALIDATION (STRICTS)
// ====================================================================
  // ... implementation hidden for brevity ...
  // L'utilisateur DOIT sélectionner un domaine dans l'interface.
  // ... implementation hidden for brevity ...
// ====================================================================
// 2. HELPER DE SÉCURITÉ (Middleware Interne)
// ====================================================================
/**
 * Vérifie l'authentification ET la propriété du projet.
 * Cette fonction est appelée au début de chaque action sensible.
 */
  // ... implementation hidden for brevity ...
  }
  }
  // Protection IDOR (Insecure Direct Object Reference)
    // On loggue cette tentative d'accès illégal
  }
}
// ====================================================================
// 3. SERVER ACTIONS (API)
// ====================================================================
/**
 * ACTION : Initialiser une nouvelle étude
 */
  // ... implementation hidden for brevity ...
  // 1. Sécurité de base
  // 2. Sécurité avancée : "Session Fantôme"
  // 3. Préparation des données
  };
  // 4. Validation
    };
  }
  // 5. Exécution DB
      }
    // Création automatique du premier système
      }
    // 🔍 AUDIT LOG
  }
}
/**
 * ACTION : Supprimer une étude
 */
  // ... implementation hidden for brevity ...
    // Utilisation d'une clause composite pour la sécurité atomique
        }
    // 🔍 AUDIT LOG
      // Si le delete échoue (ex: IDOR), Prisma lève une erreur RecordNotFound
  }
}
/**
 * ACTION : Renommer une étude
 */
  // ... implementation hidden for brevity ...
  // 1. Vérification des droits
  // 2. Validation
  }
  // 3. Mise à jour
}
/**
 * ACTION : Partager un projet (Ajout collaborateur)
 */
  // ... implementation hidden for brevity ...
  }
      }
    // 🔍 AUDIT LOG
  }
}
/**
 * ACTION : Paramètres temporels (Global settings)
 */
  // ... implementation hidden for brevity ...
  }
  // 🔍 AUDIT LOG (Optionnel pour éviter le spam si auto-save, mais utile pour config critique)
}
}
    // Nettoyage préventif des métadonnées pour ne jamais logger de mots de passe
        }
      }
    // Si le log échoue, on l'affiche juste dans la console serveur pour ne pas crasher l'app
  }
}
// --- SECURITY HELPERS ---
}
  // ... implementation hidden for brevity ...
}
/**
 * Crée une nouvelle séquence (gamme) pour un système donné.
 */
  // ... implementation hidden for brevity ...
    }
}
/**
 * Met à jour les métadonnées d'une séquence (nom, propriétés).
 */
  // ... implementation hidden for brevity ...
    }
}
/**
 * Met à jour les étapes d'une séquence.
 */
  // ... implementation hidden for brevity ...
  // On supprime les anciennes étapes et on crée les nouvelles en une seule transaction
}
/**
 * Supprime une séquence.
 */
  // ... implementation hidden for brevity ...
}
// ====================================================================
// 1. TYPES & SCHÉMAS
// ====================================================================
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
  };
};
/**
 * Interface pour le retour standardisé des appels moteur
 */
  // ... implementation hidden for brevity ...
}
// ====================================================================
// 2. HELPERS DE SÉCURITÉ & ACCÈS
// ====================================================================
/**
 * Vérifie l'accès à un projet et inclut toute l'arborescence technique.
 * Cette version est optimisée pour charger tout le "System of Systems" en une fois.
 */
  // ... implementation hidden for brevity ...
          }
        }
    }
}
/**
 * Vérifie l'accès à un système spécifique et récupère le Bus Projet (Streams) associé.
 */
  // ... implementation hidden for brevity ...
  }
}
// ====================================================================
// 3. UTILITAIRES RÉSEAU (BRIDGE NEXT.JS <-> PYTHON)
// ====================================================================
/**
 * Gère la communication HTTP avec le moteur FastAPI.
 * @param endpoint - Route du moteur (ex: /simulate)
 * @param payload - Données JSON structurées
 * @returns Objet standardisé avec succès/erreur et données
 */
  // ... implementation hidden for brevity ...
  }
  // SÉCURITÉ : AbortController pour ne pas bloquer le thread Next.js indéfiniment
    }
    }
  }
}
// ====================================================================
// 4. LOGIQUE DE TOPOLOGIE (LIENS VIRTUELS & DÉDOUBLONNAGE)
// ====================================================================
/**
 * Analyse le Manifeste du Domaine pour transformer les sélections de champs 
 * (ex: 'Alimentation du spray') en arêtes logiques réelles pour le solveur.
 * Cela permet de relier des équipements sans dessiner de tuyaux sur le graphe.
 */
  // ... implementation hidden for brevity ...
      // Un champ 'node-selector' définit un lien logique (ex: un bac A puise dans un bac B)
              // ... implementation hidden for brevity ...
        }
      }
}
/**
 * Fusionne les arêtes dessinées (Pipes) et les arêtes logiques (Virtual)
 * en évitant les doublons si l'utilisateur a dessiné ce qui est déjà sélectionné.
 */
  // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
    }
}
/**
 * Prépare la bibliothèque pour NumPy.
 * Transforme les relations Prisma (Noms, Composants) en dictionnaires 
 * indexés par ID pour un calcul matriciel rapide.
 */
  // ... implementation hidden for brevity ...
    };
}
// ====================================================================
// 5. ACTIONS SERVEUR (LOGIQUE MÉTIER)
// ====================================================================
/**
 * SIMULATION D'UN SEUL SYSTÈME (LIGNE DE PRODUCTION)
 * C'est l'action appelée lors du clic sur le bouton "Simuler" dans l'éditeur.
 */
  // ... implementation hidden for brevity ...
    // 1. Chargement du contexte technique
    // 2. Traitement de la topologie hybride (Graph + Paramètres)
      // ... implementation hidden for brevity ...
        // ... implementation hidden for brevity ...
    // 3. Construction du Payload Physics
        // --- LOGIQUE BUS PROJET ---
        // Si le nœud est connecté à un flux global (Bus), on injecte les données calculées
        // provenant des autres systèmes du projet.
          }
        }
    };
    // 4. Logging & Exécution
    }
  }
}
/**
 * SIMULATION GLOBALE DU PROJET (SYSTEM OF SYSTEMS)
 * Résout les dépendances entre toutes les lignes de production (ex: rejet ligne 1 -> entrée station).
 */
  // ... implementation hidden for brevity ...
    // Construction du payload incluant TOUS les systèmes du projet
          // ... implementation hidden for brevity ...
            // ... implementation hidden for brevity ...
        };
    };
    // PERSISTANCE : Si le projet est résolu, on met à jour les flux (Bus) en base de données
        )
    }
  }
}
/**
 * POINT D'ENTRÉE POUR LE BILAN TECHNIQUE RÉSUMÉ
 * Récupère le bilan complet (financier, environnemental, ionique) pour le rapport final.
 */
  // ... implementation hidden for brevity ...
    // Extraction optimisée des données de simulation
      // ... implementation hidden for brevity ...
      // Note: On réutilise la logique de topologie pour chaque système
      // Mais ici, on utilise les données déjà chargées dans 'project' (évite le N+1)
        // ... implementation hidden for brevity ...
      };
    }
  }
}
/**
 * ÉVALUATION RÉACTIVE D'UN NŒUD (MICRO-CALCUL)
 * Permet de calculer l'évaporation ou le dimensionnement d'un bac en temps réel lors de la saisie.
 */
  // ... implementation hidden for brevity ...
}
/**
 * GÉNÉRATION DE PROPOSITION IA
 * Appelle le moteur LLM pour rédiger un argumentaire technique basé sur le graphe.
 */
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
  };
  }
}
// --- SECURITY HELPERS ---
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
// --- ACTIONS ---
  // ... implementation hidden for brevity ...
    }
}
  // ... implementation hidden for brevity ...
          }
        }
      }
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    }
}
  // ... implementation hidden for brevity ...
  // Sécurité : on s'assure que le stream appartient bien au projet vérifié
    } 
}
/**
 * Connecte un nœud à un flux global
 */
  }
}
// FILE: apps/studio/app/actions/system.ts
// --- SECURITY HELPERS ---
}
  // ... implementation hidden for brevity ...
}
// --- ACTIONS ---
  // ... implementation hidden for brevity ...
    }
  // On revalide et on redirige vers le nouveau système
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    } 
}
/**
 * ACTION MANQUANTE : Sauvegarde la position sur le Blueprint
 * Appelé lors du "Drag Stop" sur la vue Master Plan
 */
  // ... implementation hidden for brevity ...
      }
  }
}
// apps/studio/app/actions/upload.ts
// 1. Strict File Schema
  // ... implementation hidden for brevity ...
  // 2. Validate
  }
  // 3. Processing
    // Silent ignore if exists
  }
  // Resize and convert to WebP for optimization + security (strips metadata)
}
    // 1. RÉCUPÉRATION DU CONTEXTE TECHNIQUE
      }
    }
    // 2. APPEL GROQ EN MODE STREAM
    // 3. CRÉATION DU FLUX DE RÉPONSE (ReadableStream)
        }
    // Log d'audit (sans attendre la fin pour ne pas bloquer le stream)
  }
}
    // 1. CHARGEMENT DES DONNÉES (Bibliothèque + Projet)
    // On récupère tout ce qui manque au moteur Python
    // 2. FORMATAGE DE LA BIBLIOTHÈQUE (Format attendu par Python)
    };
    // 3. CALCUL DES SETTINGS PROJET
    // On construit l'objet profiles attendu par le solveur
        // Conversion des champs plats de la DB en structure profiles
            }
        };
    }
    // 4. CONSTRUCTION DU PAYLOAD COMPLET
    };
    // 5. APPEL AU MOTEUR PYTHON
      // @ts-ignore
        // On essaie de lire l'erreur JSON renvoyée par FastAPI
    }
    // 6. STREAMING DE LA RÉPONSE VERS LE CLIENT
  }
}
// apps/studio/app/[locale]/layout.tsx
}
    }
                // ... implementation hidden for brevity ...
}
// apps/studio/app/[locale]/(admin)/admin/blog/page.tsx
  // 1. Vérification de sécurité
  }
  // 2. Récupération parallèle des Articles et des Tutoriels (Séries)
                  // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                                // MODIFIEZ CETTE LIGNE 👇
                                  // ... implementation hidden for brevity ...
                                  // ... implementation hidden for brevity ...
}
// apps/studio/app/[locale]/(admin)/admin/blog/[id]/page.tsx
  // 1. Résolution des paramètres (Next.js 15)
  // 2. Récupération parallèle : Post + Tags + Tutoriels
    // A. L'article courant
    // B. Tous les tags pour l'autocomplétion
    // C. Tous les tutoriels pour le sélecteur
  // 3. Gestion du cas "non trouvé"
  // 4. Extraction et dédoublonnage des tags existants
    )
  // 5. Filtrage des tutoriels pertinents (Même langue que l'article)
  // Si l'article n'a pas de langue définie (vieux posts), on affiche tout par précaution.
              // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
}
  // Récupération de tous les leads
}
  // 1. SÉCURITÉ : Vérification Serveur (Double check après middleware)
  }
  // 2. DATA FETCHING : Récupération des logs (Derniers 50)
  // On inclut les infos utilisateur pour savoir "Qui" a fait l'action
      }
    }
                  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // Parallel fetching for high performance
}
/**
 * Generic Stat Card with Trend
 */
  // ... implementation hidden for brevity ...
    };
}
                      // ... implementation hidden for brevity ...
}
}
// --- REUSABLE MODERN COMPONENTS ---
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    )
}
  // ... implementation hidden for brevity ...
    )
}
// apps/studio/app/[locale]/(marketing)/blog/page.tsx
  // 🚩 DÉCLARATION UNIQUE DE LA CLAUSE WHERE
  };
  }
  // 1. RÉCUPÉRATION DES TUTORIELS (SÉRIES)
      }
  // 2. RÉCUPÉRATION PARALLÈLE DES ARTICLES ET STATS
    // Grille principale paginée
    // Articles populaires
    // Données pour le nuage de tags
    // Compte total pour la pagination
}
// apps/studio/app/[locale]/(marketing)/blog/[slug]/page.tsx
// --- ICONS ---
// --- ACTIONS & LIBS ---
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// --- COMPONENTS ---
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// --- HELPER LOCAL ---
  // ... implementation hidden for brevity ...
}
// --- 1. GÉNÉRATION DES MÉTADONNÉES (SEO) ---
        // ... implementation hidden for brevity ...
  };
}
// --- 2. COMPOSANT PAGE PRINCIPAL ---
  // A. Récupération de l'article dans la langue courante
  // B. Logique i18n : Trouver le slug de la traduction
  // Construction de l'objet alternates pour le LanguageSwitcher
  // C. Incrémentation des vues (Fire & Forget)
  }
              // ... implementation hidden for brevity ...
}
}
                // ... implementation hidden for brevity ...
}
  }
  // Récupération des projets liés à l'utilisateur
}
  // 1. Résolution des paramètres (Pattern Next.js 15)
  // 2. Chargement du projet
  // 3. Détermination du système courant
  }
  // 4. Configuration métier
  // 5. Chargement initial des données (Graphe + Séquences)
  // loadGraph a déjà été optimisé dans notre étape précédente
  // Mapping des séquences (On s'assure d'avoir un tableau propre)
}
  // 1. Résolution des Promises (Next.js 15+)
  // 2. GESTION DU DOMAINE DYNAMIQUE
  // Validation : Si le domaine est absent ou invalide, on redirige vers le premier domaine du registre
    // On conserve les autres paramètres (view, projectId) lors de la redirection
  }
  // 3. CHARGEMENT DES DONNÉES SPÉCIFIQUES AU DOMAINE
                          // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
        // ... implementation hidden for brevity ...
}
// apps/studio/app/[locale]/project/[id]/page.tsx
  // 1. Extraction asynchrone des paramètres
  // 2. Récupération sécurisée du projet (findUnique pour gérer l'erreur nous-même)
  }
  // 3. Fetch topology
  // 4. Prepare Nodes (Systems)
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
    }
  // 5. Prepare Edges (Streams)
    // ... implementation hidden for brevity ...
      };
    }
}
}
                  // ... implementation hidden for brevity ...
}
  // LOGIQUE EXPORT (Format QuantumH2O)
    }
  };
  // LOGIQUE IMPORT (Format QuantumH2O corrigé)
    // ... implementation hidden for brevity ...
        }
      }
    };
  };
            // ... implementation hidden for brevity ...
            // ... implementation hidden for brevity ...
}
        }
    };
}
    }
  };
          // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // --- ÉTATS ---
    // ... implementation hidden for brevity ...
  // --- ÉTATS TUTORIELS & LANGUE ---
  // --- MÉTRIQUES ÉDITORIALES ---
  // --- LOGIQUE IMAGE ---
    // ... implementation hidden for brevity ...
    }
    }
  };
  // --- LOGIQUE TAGS ---
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
    }
  };
                // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                                )
                            }
                                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                            }
                          // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                                      // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// Helper to determine severity visual based on action name
  // ... implementation hidden for brevity ...
};
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
  };
                // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
}
    }
  };
          // ... implementation hidden for brevity ...
                        // ... implementation hidden for brevity ...
}
    // ... implementation hidden for brevity ...
    // On passe un objet vide en fallback, le registre gère le reste
    // ... implementation hidden for brevity ...
}
  // 1. Identification du domaine et de la configuration métier
  // Sécurité si le type de noeud n'existe pas dans le manifeste
  }
  // Extraction des propriétés (JSONB) et des résultats de calcul (Simulation)
        // ... implementation hidden for brevity ...
                   // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
            // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // 1. CONFIGURATION DU DOMAINE
  }
  // 2. RÉCUPÉRATION DES DONNÉES DU STORE
  // 3. LOGIQUE : SOMME IONIQUE (HEALTH BAR)
    // ... implementation hidden for brevity ...
  // 4. CHAMPS RÉSUMÉS & ACCESSOIRES
    // ... implementation hidden for brevity ...
  // 5. ALERTES CRITIQUES
  // 6. LIAISONS SANS FIL (Wireless)
    // ... implementation hidden for brevity ...
            }
        }
    }
        // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// --- COMPOSANT : ÉLÉMENT DE LISTE ORDONNABLE ---
  // ... implementation hidden for brevity ...
  };
  // Simulation results peut contenir n'importe quoi (Mass balance, AI metrics, etc.)
  // 1. Extraction générique des connexions logiques (Wireless)
    // ... implementation hidden for brevity ...
          };
        }
  // 2. Champs de résumé dynamiques
    // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
          */}
}
// --- COMPOSANT PRINCIPAL ---
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    // Le scope filtré peut être paramétré dans le manifeste futur, par défaut PROCESS
      };
      };
    }
    // ... implementation hidden for brevity ...
      }
    }
  };
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
};
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // Accès au store pour injecter les résultats de simulation
  // 1. GESTION DU DÉPLACEMENT (LOCAL)
  // 2. SAUVEGARDE DE LA POSITION (BASE DE DONNÉES)
    // ... implementation hidden for brevity ...
      }
    }
  // 3. SIMULATION GLOBALE
    // ... implementation hidden for brevity ...
            // Pour la simulation globale, Python renvoie response.data.results
    }
      }
        // --- SUCCÈS ---
        // A. Injecter les résultats dans le store pour le AnalysisReport
        // B. Mettre à jour les labels des liens sur le Blueprint (optionnel mais recommandé)
          // ... implementation hidden for brevity ...
                };
            }
      }
    }
  };
              // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
            // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
      // On injecte le domaine sélectionné dans le formData
        // Redirection vers l'éditeur du projet
      }
    }
  };
          // ... implementation hidden for brevity ...
  }
                          // ... implementation hidden for brevity ...
                                  // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
}
  // États pour l'édition en ligne (remplace le prompt)
  // i18n context
  // Récupération de la configuration du domaine pour obtenir son label traduit
  // --- ACTION : SUPPRESSION ---
    // ... implementation hidden for brevity ...
    }
  };
  // --- ACTION : SAUVEGARDER LE NOM ---
    // ... implementation hidden for brevity ...
    }
  };
  // --- ACTION : ANNULER LE RENOMMAGE ---
    // ... implementation hidden for brevity ...
  };
          // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
}
  // Le rôle est défini dans le manifeste (SOURCE ou DRAIN)
  // Ou fallback sur le type
  // Résultats de simulation (ex: Total collecté par ce réseau)
        // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
}
  // --- 1. DATA PIVOTING & AGGREGATION ---
    // ... implementation hidden for brevity ...
    // A. Identifier tous les Ions uniques (Variables de calcul)
    // B. BILANS GLOBAUX
        // Somme des ajouts chimiques
        };
    // C. Map Drains (Effluents)
  // --- 2. EMPTY STATE ---
  }
}
  // ... implementation hidden for brevity ...
    };
}
    }
  // On ne montre ce widget que pour les terminaux ou les cuves importantes
  // Pour les Tanks, on n'affiche pas le widget complet ici, car ils ont déjà des champs "dumpingNetworkId" dans le formulaire générique.
  // Ce widget est surtout utile pour les noeuds TERMINAUX (Source/Drain) qui doivent se connecter au Bus Projet.
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
    }
  };
                  // ... implementation hidden for brevity ...
}
}
  };
          // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
}
}
  // ... implementation hidden for brevity ...
  // Charger les items quand on ouvre le menu
    }
  // Trouver le nom de l'item sélectionné pour l'affichage du bouton
    // ... implementation hidden for brevity ...
      // Cas A : Utilisation dans une collection (on renvoie l'objet)
      // Cas B : Utilisation directe sur un noeud (ex: Modèle de Pompe)
    }
  };
          // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
}
  // Ici, on est côté client, on peut utiliser Zustand !
}
  // 🚩 CHANGEMENT : Accepte l'objet de données complètes
}
  // 1. Résolution dynamique via le Registre
  // 2. Gestion du cas 'NO DATA'
  }
  // 3. Gestion du cas 'NO CONFIG' (Fallback de sécurité)
  }
  // 4. Rendu du rapport spécifique (On passe les données)
  // Le composant enfant (ex: ProcessReport) est responsable de l'affichage
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // --- ÉTATS DE CHARGEMENT ---
  // --- ÉTATS UI ---
  // --- ACTIONS ---
  // Gestion de l'import Catalogue avec feedback de chargement
    // ... implementation hidden for brevity ...
  };
  // Gestion de l'import Chimie avec feedback de chargement
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
    }
      // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
      }
    }
  };
    // ... implementation hidden for brevity ...
    }
    }
  };
                // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
}
}
  // ... implementation hidden for brevity ...
  // À l'avenir, cette valeur viendra d'un hook useLocale()
  // Groupement des nœuds par catégorie traduite
    // ... implementation hidden for brevity ...
      // On traduit la catégorie avant de s'en servir comme clé de groupe
                        // ... implementation hidden for brevity ...
}
// FILE: apps/studio/components/layout/project-initializer.tsx
}
}
  // ... implementation hidden for brevity ...
  // 1. DÉTERMINATION DES CHAMPS VIA LE MANIFESTE
  // Le composant sait quelles options il doit afficher
  // Combinaison des settings standards (Heures/Jours) et des settings spécifiques au domaine
    // ... implementation hidden for brevity ...
    // Schéma de base Next.js (Heures/Jours/Semaines)
    // 🚩 Ajout des champs spécifiques au domaine (s'ils existent)
  // 2. LOGIQUE DE CHARGEMENT ET MISE À JOUR DE L'ÉTAT LOCAL (Simulation)
  // En production, tu ferais un fetch pour récupérer les valeurs actuelles du projet.
  // Pour l'instant, on initialise avec les valeurs par défaut du manifeste.
    // Simuler le chargement des données actuelles du projet (qui pourraient être null)
    // On merge les valeurs DB (null) avec les valeurs par défaut du manifeste
    // NOTE: Ici, tu ferais un 'getProjectSettingsAction(projectId)'
  // 3. LOGIQUE DE SAUVEGARDE
    // ... implementation hidden for brevity ...
    // Construction du payload basé sur les champs actuels (y compris les nouveaux)
        }
    }
  };
    // ... implementation hidden for brevity ...
  };
                                  // ... implementation hidden for brevity ...
                                          // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// --- IMPORT DU REGISTRE ---
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
  }
  }
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
    }
    }
    }
          // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
        };
          // ... implementation hidden for brevity ...
        };
          // ... implementation hidden for brevity ...
    }
    }
  };
                      // ... implementation hidden for brevity ...
          /* FALLBACK SI PAS DE GROUPES (ex: Edges) */
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // Synchronisation : Remplit le formulaire quand on change de gamme
    }
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
  };
                  // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                                      // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                                }
          /* EMPTY STATE */
}
  // Supprimer summaryData ici pour utiliser le store (meilleure réactivité)
}
  // 1. Récupération des données du Store (Zustand)
  // 2. Résolution du Domaine : Prop > Config Active > Défaut (Le code d'origine est trop complexe)
  // On utilise la prop `domain` passée par le Workspace, qui vient du Project.
  // 3. Affichage Conditionnel
  // On délègue tout le travail de vérification et de rendu au GenericReportViewer
}
// FILE: apps/studio/components/layout/system-selector.tsx
}
    // ... implementation hidden for brevity ...
        // Par défaut on crée en PRODUCTION, on pourra améliorer l'UX plus tard
      }
    }
  };
}
  // SÉCURITÉ : Fallback si la vue n'est pas supportée par le domaine
    }
    // ... implementation hidden for brevity ...
}
  /**
   * Dictionnaire optionnel de liens alternatifs.
   * Ex: { en: '/en/blog/my-translated-slug', fr: '/fr/blog/mon-slug-original' }
   */
}
  // ... implementation hidden for brevity ...
  // Sécurisation du typage de la locale
  // Fermer le menu si on clique ailleurs
      // ... implementation hidden for brevity ...
      }
    };
    // ... implementation hidden for brevity ...
    // 1. Priorité : Si une URL spécifique est fournie pour cette langue (ex: article de blog traduit)
    }
    // 2. Fallback : Remplacement simple du segment de locale dans l'URL actuelle
    // Ex: /fr/dashboard -> /en/dashboard
    // On s'assure de remplacer le bon segment (index 1 car l'URL commence par /)
    // Si l'URL ne contient pas la locale (ex: racine), on la préfixe.
    }
  };
          // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // Vérification du rôle admin via la session NextAuth
  // Définition des items avec labels multilingues
    }
          // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
             // ... implementation hidden for brevity ...
             // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
}
  }
};
  // ... implementation hidden for brevity ...
  // 1. DÉPENDANCES DU DOMAINE
  // 2. ÉTATS ET STORE
  // 3. CONTEXTES DE NAVIGATION
  // --- ACTIONS ---
    // ... implementation hidden for brevity ...
    }
    // Nettoyage des nœuds pour la sauvegarde (Prisma n'a besoin que des données essentielles)
      // ... implementation hidden for brevity ...
      // Appel à la Server Action optimisée (Bulk Write)
        // Affiche l'erreur renvoyée par le serveur (ex: "IDOR Protection")
      }
    }
  };
    // ... implementation hidden for brevity ...
        // Envoie le signal d'annulation à la requête fetch en cours
    }
  };
    // ... implementation hidden for brevity ...
    }
        // Appel à l'API Route Next.js (Proxy Sécurisé)
                // On passe les données du store
        }
        // Boucle de lecture du flux NDJSON
                        // 🚩 Injection des résultats pour le SmartNode
                        // 🚩 Injection du rapport global pour la vue Bilan
                        // Si le solveur Python renvoie une erreur métier
                    }
            }
        }
        // 🚩 Une fois le stream terminé, on persiste le résultat final en base
            // NOTE: Ceci sera remplacé par la vraie Server Action de persistance
        }
        // 🚩 TRÈS IMPORTANT : Réinitialisation propre
    }
  };
              // Rendu pour la vue Blueprint (Plan + Bilan global)
                    // ... implementation hidden for brevity ...
                    // ... implementation hidden for brevity ...
                  // Séparateur juste avant le Bilan pour le distinguer des vues d'édition
                          // ... implementation hidden for brevity ...
                    // ... implementation hidden for brevity ...
}
}
  // ... implementation hidden for brevity ...
  // --- IMPORT DES DONNÉES (ITEMS) ---
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
          }
        }
      };
  };
  // --- IMPORT DE LA CONFIGURATION (SCHEMAS) ---
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
          }
        }
      };
  };
}
}
  // Context i18n
  // --- ÉTATS ---
  // --- FILTRAGE ---
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
  // --- HANDLERS ---
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
    }
    }
  };
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
  };
                                // ... implementation hidden for brevity ...
                            // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
  // --- IMPORTATION ---
        }
      }
    };
  };
  // --- EXPORTATION AVEC FILTRES ---
    // ... implementation hidden for brevity ...
      // Définition des catégories par famille
      }
      // Appel serveur avec les filtres
      // Génération du nom de fichier
      // Téléchargement
    }
  };
                          // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
}
        }
    };
  };
}
// apps/studio/components/marketing/blog-search-grid.tsx
  // --- LOGIQUE UNIQUE DE MISE À JOUR DE L'URL ---
    // ... implementation hidden for brevity ...
    // On récupère les paramètres actuels pour les préserver
      }
    // 🚩 RÉPARATION : On ne force "page=1" QUE si on n'est pas en train de paginer.
    // Si newParams contient 'page', c'est qu'on a cliqué sur Suivant/Précédent.
    }
  };
  // Nuage de tags
    // ... implementation hidden for brevity ...
      }
              // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
}
  };
  }
          // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
}
// apps/studio/components/marketing/share-button.tsx
  // On limite le résumé pour ne pas dépasser les quotas de caractères (X/Twitter)
    // ... implementation hidden for brevity ...
  };
      // LinkedIn ignore le texte forcé, il utilise UNIQUEMENT les balises OG de la page
      // Twitter prend le texte (Titre + Résumé) + l'URL
      // Email permet un formatage complet
    }
          // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
}
  };
}
  // ... implementation hidden for brevity ...
            // Assuming posts before current are "read"
                    // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
}
}
};
};
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
  };
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
};
  };
}
  // ... implementation hidden for brevity ...
  // Auto-scroll au bas du chat
    // ... implementation hidden for brevity ...
  };
  // Nettoyage lors de la fermeture
    }
    // ... implementation hidden for brevity ...
    // Initialisation de l'AbortController pour cette requête
    // Mise à jour locale immédiate (User + Placeholder AI)
        // Mise à jour réactive du dernier message (IA)
          }
      }
    }
  };
              // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
}
}
  // @ts-ignore - On récupère l'icône dynamiquement par son nom
  }
}
  };
}
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    }
    }
  };
              // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
}
          // ... vos composants h1, h2, p, etc. inchangés ...
          // --- LE CORRECTIF EST ICI ---
          // On force la balise <pre> parente à être transparente et sans marge
          // pour qu'elle n'interfère pas avec notre fenêtre de code personnalisée.
              // Le 'not-prose' ici protège le contenu, mais le 'pre' ci-dessus protège le conteneur
          }
}
}
  // 1. Filtrer les noeuds disponibles selon les critères du manifeste
    // ... implementation hidden for brevity ...
      // On ne peut pas se connecter à soi-même (logique)
      // Note: On pourrait passer l'ID du noeud courant pour filtrer plus précisément
  // 2. Trouver le label du noeud actuellement sélectionné
    // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
}
}
    // ... implementation hidden for brevity ...
        // Calcul depuis le bord droit
        // Calcul depuis le bord gauche (pour la palette)
      }
      }
    }
    };
          // ... implementation hidden for brevity ...
}
}
}
  // ... implementation hidden for brevity ...
}
// Helper pour fusionner les classes Tailwind
}
      // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// apps/studio/lib/component-registry.tsx
// Import des composants spécifiques au domaine
// Définition des types de slots disponibles pour l'injection
};
// --- LE REGISTRE ---
  // DOMAINE : SURFACE TREATMENT (Mise à jour Chapitre 6)
      // Les équipements principaux utilisent le SmartNode spécialisé (Health Bars, etc.)
      // Les terminaux utilisent le visuel spécifique "Pilule"
      // Géré dynamiquement par le PropertiesPanel générique via le Manifeste
      // On utilise le WaterPropertiesWidget pour tout ce qui touche à l'eau et aux flux
      // Ce widget gère à la fois le Bus Projet (Drain/Source) et les Appoints/Surverses (Baths/Rinses)
      // Affiche le gestionnaire de réseaux local quand rien n'est sélectionné
      // Le rapport complet de bilan de masse et ionique
    }
  }
};
// --- HELPERS D'ACCÈS ---
/**
 * Retourne le composant visuel pour le noeud sur le canvas
 */
  // ... implementation hidden for brevity ...
}
/**
 * Retourne un formulaire spécifique si défini (prioritaire sur le générique)
 */
  // ... implementation hidden for brevity ...
}
/**
 * Retourne un widget additionnel à afficher en haut du panneau de propriétés
 */
  // ... implementation hidden for brevity ...
}
/**
 * Retourne un composant pour l'affichage latéral hors sélection (ex: légende, global config)
 */
  // ... implementation hidden for brevity ...
}
/**
 * Retourne le composant de rapport final pour le mode "Bilan"
 */
  // ... implementation hidden for brevity ...
}
/**
 * Helper pour React Flow (génère l'objet nodeTypes complet dynamiquement)
 */
  // ... implementation hidden for brevity ...
}
// --- TYPES DE BASE ---
// Support pour les labels traduisibles : soit une chaîne simple, soit un objet par langue
// Scopes standards de l'ingénierie (ISA-S88 / P&ID)
// PROCESS: Équipement principal de la ligne (ex: Cuve)
// UTILITY: Réseau support (ex: Eau, Drain, Air)
/**
 * MODES DE VUE (Layouts)
 * GRAPH: Éditeur de nœuds libre (type React Flow)
 * SYNOPTIC: Vue verticale/linéaire ordonnée (Process Flow Diagram)
 * SEQUENCES: Gestionnaire de gammes opératoires / séquencement
 * SUMMARY: Bilan technique et rapport final
 */
// Définition pour les requêtes vers la bibliothèque (Filtres)
  // ... implementation hidden for brevity ...
};
// --- DÉFINITION DES CHAMPS (Méta-Modèle) ---
  // 1. Champ Numérique & Physique (Avec Unités et Profils Temporels)
    }
  // 2. Champs Texte Simple
    }
  // 3. Champ Booléen (Switch)
    }
  // 4. Liste Déroulante (Choix Statiques)
    }
  // 5. Sélecteur de Bibliothèque (Filtres Contextuels)
    }
  // 6. Sélecteur de Nœud (Liaisons Wireless)
    }
  // 7. Collection / Tableau (Support Natif du Nesting / Accessoires)
        // ... implementation hidden for brevity ...
    };
// --- NOUVEAU : STRUCTURE DE GROUPEMENT (TABS) ---
/**
 * Représente un groupe de champs qui sera affiché dans un onglet (Tab)
 */
  // ... implementation hidden for brevity ...
};
// --- SCHÉMAS D'OBJETS ---
// Définition d'un Noeud (Équipement / Asset)
  // ... implementation hidden for brevity ...
};
// Définition d'une Arête (Tuyauterie / Câblage)
  // ... implementation hidden for brevity ...
};
// Définition d'une Bibliothèque
  // ... implementation hidden for brevity ...
};
// --- CONFIGURATION UI (LAYOUTS) ---
/**
 * Définit le comportement de l'interface pour ce domaine particulier
 */
  // ... implementation hidden for brevity ...
};
// --- MANIFESTE GLOBAL ---
  // ... implementation hidden for brevity ...
};
// apps/studio/lib/i18n.ts
};
/**
 * Traduit un label provenant du Manifeste (type I18nLabel)
 * Gère les chaînes simples ou les objets { fr: "", en: "" }
 */
  // ... implementation hidden for brevity ...
  // Si c'est déjà une string, on la renvoie
  // Si c'est un objet de traduction
}
/**
 * Récupère le dictionnaire de traduction statique
 */
  // ... implementation hidden for brevity ...
}
// apps/studio/lib/registry.ts
// import { ENERGY_CONFIG } from './domains/energy';
// 1. REGISTRE CENTRAL
// C'est le seul endroit où les domaines sont "hardcodés" par importation.
  // ENERGY: ENERGY_CONFIG
};
// 2. EXPORTS DYNAMIQUES
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
// 3. RÉCUPÉRATION DE CONFIGURATION (STRICTE)
  // ... implementation hidden for brevity ...
  // A. Si un ID est fourni, on vérifie son existence
    // Si l'ID est invalide, on ne devine pas. On crashe pour alerter le dev.
  }
  // B. Fallback sur la variable d'environnement (Configuration Serveur explicite)
  }
  // C. Si aucune config n'est trouvée, on ARRÊTE TOUT.
  // Pas de "SURFACE_TREATMENT" par défaut.
}
// apps/studio/lib/domains/surface-treatment.ts
  // ... implementation hidden for brevity ...
  // 🚩 CONFIGURATION UI PILOTÉE PAR LE MANIFESTE
  // On définit ici les outils pertinents pour l'ingénieur procédé.
    // 🚩 DÉFINITION DES PARAMÈTRES DE GAMME
    // --- BAIN DE TRAITEMENT (PROCESS_BATH) ---
            }
        }
    // --- CUVE DE RINÇAGE (RINSE_TANK) ---
        }
    // --- UTILITIES (SOURCE) ---
        }
    // --- UTILITIES (DRAIN) ---
        }
    }
        }
    }
  }
};
  }
}
  }
}
}
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
/**
 * Synchronise les flux hydrauliques pour éviter la double saisie.
 */
  // RÈGLE 1 : Si A déborde dans B, alors B sait qu'il reçoit de A
  }
  // RÈGLE 2 : Si B est alimenté par A, alors A déborde dans B
  }
}
/**
 * Nettoie les références quand un nœud est supprimé.
 */
      }
}
      // ... implementation hidden for brevity ...
    };
      // Branchement logique de domaine (Surface Treatment)
      }
        }
      }
    // Logique d'auto-layout à importer d'un fichier lib séparé pour la propreté
  }
    }
  // Injection atomique des résultats de simulation
        // ... implementation hidden for brevity ...
          };
        }
      // ... implementation hidden for brevity ...
  }
  }
  }
}
    // ... implementation hidden for brevity ...
  }
}
// Fonction pour instancier le client avec l'adaptateur
  // 1. On crée un Pool de connexion PostgreSQL classique
  // 2. On crée l'adaptateur Prisma qui utilise ce pool
  // 3. On passe l'adaptateur au client
};
    }
  }
}
}
}
// ==========================================
// 1. AUTHENTIFICATION & UTILISATEURS
// ==========================================
}
  // Relations requises pour Auth.js
}
}
}
}
// ==========================================
// 2. MARKETING & KNOWLEDGE
// ==========================================
}
}
// ==========================================
// 3. HIERARCHIE PROJET
// ==========================================
}
}
  // État calculé (Snapshot de la dernière simulation)
  // Relations aux Noeuds (Qui écrit ? Qui lit ?)
}
// ==========================================
// 4. LE GRAPHE (CORE)
// ==========================================
}
}
}
// ==========================================
// 5. LOGIQUE SEQUENTIELLE (GAMMES)
// ==========================================
}
}
// ==========================================
// 6. BIBLIOTHÈQUE GÉNÉRIQUE
// ==========================================
}
// ==========================================
// 7. BIBLIOTHÈQUE SPÉCIFIQUE AU DOMAINE
// ==========================================
  // --- RÉCURSIVITÉ ---
  // --- CORRECTION ICI : Relation inverse pour NodeComponent ---
  // --- TRAÇABILITÉ ---
}
}
}
  // Cette ligne pointe vers LibraryItem
}
  // La définition des champs (Array of FieldDefinition)
  // Ex: [{ "id": "power", "label": "Puissance", "type": "number", "unit": "kW" }]
}
// --- COLLABORATION ---
}
// --- AUDIT & ANALYTICS ---
  // Qui ?
  // Quoi ?
  // Détails techniques (Parfait pour l'IA future)
  // Ex: { "path": "/admin/users", "method": "POST", "error": "Invalid CSRF" }
}
  // Unique slug PER language (e.g. /fr/tuto-1 and /en/tutorial-1)
}
# `@turbo/eslint-config`
/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
    // Default ignores of eslint-config-next:
      // React scope no longer necessary with new JSX transform.
  }
}
/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
      // React scope no longer necessary with new JSX transform.
  }
}
  }
}
  }
}
  }
}
  }
}
}
}
};
        // ... implementation hidden for brevity ...
}
}
# Beyond Hard-Coded Software
**Quantum Core** represents a paradigm shift: the **Software Factory**.
### The Core Principles
# How to Store Any Physical System
### The JSONB Revolution
*   **Nodes**: Representing equipment (Process), inputs (Source), or outputs (Sink).
*   **Edges**: Representing the flow (Physical or Logical) between nodes.
*   **Properties**: A JSONB blob that holds the domain-specific data.
### Topological Roles
*   **SOURCE**: Nodes with only outgoing flows (e.g., Water Mains, Power Grid).
*   **PROCESS**: Nodes that transform or store mass/energy (e.g., Reaction Tanks, Batteries).
*   **SINK**: Nodes that accumulate final outputs (e.g., Waste Treatment, Earth).
# Orchestration meets Calculation
### Left Brain: Next.js (The Orchestrator)
*   **Auth & Security**: Managing users and project isolation.
*   **UX/UI**: The ReactFlow canvas and dynamic property panels.
*   **Persistence**: Communicating with PostgreSQL via Prisma 7.
### Right Brain: FastAPI (The Scientist)
### The Synapse: Secure S2S Communication
# Beyond Static Pipes
### Physical vs. Logical Edges
### Mathematical Implementation of Drag-out
# One Core, Infinite Verticals
### How to Fork Quantum Core
### The Role of Generative AI
# The Engineering Specification: Quantum Core Physics Engine
## 1. The Temporal Normalization (The "24/7 Paradox")
**The Logic:**
**The Code Implementation:**
# Calculate how much we must over-feed during production hours 
# to compensate for the evaporation that happened while the factory was closed.
# time_ratio is typically 4.2 (168/40)
*   **Verification:** If `time_ratio` is ignored, the solver would underestimate the required water flow by 75%, leading to dry tanks in real life.
## 2. Logistic Topology (Transfer by Transporter)
**The Logic:**
**The Code Implementation:**
# Constructing the Drag-out Matrix (N x N)
    # Hourly flow caused by parts movement
            # We add to the matrix (multiple sequences can pass through the same tanks)
## 3. Chemical Flattening (Recursive BOM)
**The Code Implementation:**
# Breaking down: Commercial Product -> Reagents -> Ions
        # Direct ion (e.g., H+)
        # Intermediate reagent (e.g., NaOH contains Na+)
## 4. Hydraulic Stabilization (Mass Balance)
**The Code Implementation:**
# Iterative loop to stabilize the cascade flows
            # Sum of all incoming water (Makeup + Overflows from other tanks)
            # Subtract evaporation loss
            # Map the output to the target tank (Gravity pipe)
## 5. The Core Matrix: Solving $Ax = b$
**The Matrix Rules:**
**The Code Implementation:**
    # Total liquid leaving the tank (L/h)
        # Mass Balance: [Sum of Outflows] * Ci - [Sum of Inflows * Cj] = 0
            # If tank J flows into tank I, it brings its concentration Cj
# The Final Calculation
## 6. Verification & Anti-Corruption Safeguards
### A. The Singular Matrix Guard
### B. The Zero-Gravity Check
### C. Transparency via NDJSON
## Conclusion
# (Tuto 1/10) Environment Setup & Security Configuration
### 1.1 Prerequisites
*   **Node.js:** v18.17+ (LTS recommended)
*   **pnpm:** v9.x (Required for Turborepo workspaces)
*   **Python:** v3.10+ (For local engine execution)
*   **Docker & Docker Compose:** v2.20+
### 1.2 The "Internal Secret" Protocol
**⚠️ Security Critical:**
#### Generating a Strong Secret
*Save this output. It will be referred to as `[YOUR_GENERATED_SECRET]` below.*
### 1.3 Configuring the Engine (Python)
**1. Create/Update Environment File**
# The port the FastAPI server listens on
# The Shared Secret (Must match the Studio's configuration)
**2. Patching `docker-compose.yml`**
*File: `docker-compose.yml`*
      # CHANGED: Now uses variable interpolation
### 1.4 Configuring the Studio (Next.js)
**Create/Update `apps/studio/.env.local`:**
# --- Database Connection ---
# Ensure this matches your PostgreSQL credentials
# --- Authentication (NextAuth.js) ---
# Generate a new secret: openssl rand -base64 32
# The public URL of the application
# Email Provider (SMTP) for Magic Links
# --- Engine Bridge ---
# The URL where Next.js can find the Python Container
# Inside Docker network use: http://engine:8000
# For local dev use: http://127.0.0.1:8000
# MUST match the key defined in Section 1.3
# --- Feature Flags ---
### 1.5 Verification Steps
    # Create an .env file in root with your secrets for Docker
    *Expected Result:* `{"detail":"Forbidden: Invalid API Secret"}`
    *Expected Result:* `400 Bad Request` (This is good! It means auth passed, but the payload was invalid, which confirms the Engine is reachable and secure).
# (Tuto 2/10) Database Management & Migrations
### 2.1 The Data Architecture
*   **Schema Definition:** `packages/database/prisma/schema.prisma`
    *   This file defines your tables (Models) and relationships.
*   **Database Client:** `packages/database/index.ts`
    *   This exports the `db` object used throughout the application.
*   **Connection String:** Defined in your `.env` file as `DATABASE_URL`.
**Pedagogical Note:** When you change the `schema.prisma` file, you are changing the *blueprint*. You must then "apply" this blueprint to the actual PostgreSQL container and "generate" the TypeScript types so the code knows about the changes.
### 2.2 Starting the Database Container
    *   **Host:** `localhost`
    *   **Port:** `5434`
    *   **User:** `quantum`
    *   **Password:** `password`
    *   **Database:** `quantum_core`
### 2.3 Synchronizing the Schema (Dev vs. Prod)
#### A. The Development Method (`db:push`)
**Command (from root):**
*   **What it does:** Updates the DB structure immediately.
*   **⚠️ Risk:** If you renamed a column, it might delete the old one and create a new one, losing data. **Do not use this on a production database with real data.**
#### B. The Production Method (Migrations)
**1. Create a Migration (Development):**
# Go to the database package
**2. Apply Migrations (Production/CI):**
### 2.4 Generating the Client (Type Safety)
**Command (from root):**
*Tip: Turborepo is configured to run this automatically when you run `pnpm build`, but during development, you might need to trigger it manually after a schema edit.*
### 2.5 Seeding Initial Data
#### 1. Creating the First Admin
    *   **Email:** `admin@quantum.corp`
    *   **Role:** `ADMIN` (Crucial: Select ADMIN from the dropdown enum)
    *   **Name:** `System Admin`
#### 2. Hydrating the Libraries (Catalog & Chemistry)
    *   **Icon 1 (Database):** Imports the Hardware Catalog (Pumps, Tanks, Sensors).
    *   **Icon 2 (Flask):** Imports the Chemical Library (Ions, Reagents for the H2O domain).
### 2.6 Troubleshooting Common Issues
**Error: `P1001: Can't reach database server at localhost:5434`**
*   **Cause:** The Docker container is not running.
*   **Fix:** Run `docker-compose ps`. If `postgres` is not listed, run `docker-compose up -d postgres`.
**Error: `The table public.User does not exist in the current database`**
*   **Cause:** You connected to the DB, but the tables haven't been created yet.
*   **Fix:** Run `pnpm db:push` to create the table structure.
**Error: `Client is not compatible with the schema`**
*   **Cause:** You updated `schema.prisma` but didn't update the generated files.
*   **Fix:** Run `pnpm db:generate`.
# (Tuto 3/10) The Python Engine Integration
### 3.1 Architecture: The Stateless Calculator
*   It does **not** connect to the database.
*   It does **not** know who the user is.
*   It does **not** remember previous calculations.
**How it works:**
**Pedagogical Note:** This design makes the engine very robust. You can restart the Python container at any time without losing any user data. If the engine crashes, it only affects the specific calculation running at that millisecond.
### 3.2 The Communication Bridge
**The Flow:**
### 3.3 Monitoring the Brain
#### A. Docker Logs (The Raw Feed)
**Example Output:**
}
#### B. The Simulation Console (The UI Feed)
*   In the Studio UI, a "Console" drawer opens at the bottom right.
*   This displays the real-time progress steps (e.g., "Building Matrix...", "Solving Iteration 4...").
*   This is useful for debugging slow simulations without looking at server logs.
### 3.4 Common Maintenance Tasks
#### Updating the Solver Logic
#### Scaling
*   **Docker Swarm / Kubernetes:** You can deploy multiple replicas of the `engine` container.
*   **Load Balancing:** Since the engine is stateless, a simple Round-Robin load balancer can distribute requests across 5 or 10 engine instances seamlessly.
### 3.5 Troubleshooting Guide
**Scenario 1: `FetchError: ECONNREFUSED`**
*   **Symptom:** The Studio says "Connection Error" immediately upon clicking Simulate.
*   **Diagnosis:** Next.js cannot find the Python container.
*   **Fix:** Check `ENGINE_URL` in `.env`. Inside Docker, it should be `http://engine:8000`. Locally, it might be `http://127.0.0.1:8000`.
**Scenario 2: `403 Forbidden`**
*   **Symptom:** Logs show "Forbidden: Invalid API Secret".
*   **Diagnosis:** The `INTERNAL_API_SECRET` in Next.js does not match the one in Python.
*   **Fix:** Ensure both containers share the exact same string in their environment variables.
**Scenario 3: "Singular Matrix" / "LinAlgError"**
*   **Symptom:** The user sees a red error "Erreur de convergence".
*   **Diagnosis:** This is a **Physics Error**, not a bug in the code. It means the user designed a system that is mathematically impossible (e.g., a closed loop of pipes with no outlet, or trying to calculate concentration in an empty tank).
*   **Fix:** Instruct the user to check their graph connections (Arrows must connect properly).
# (Tuto 4/10) Monitoring & Observability
### 4.1 The Admin Command Center
**Access:** `https://your-domain.com/admin` (or `/admin/stats`)
#### Key Sections:
*   **KPIs (Command Center):** Real-time metrics on user acquisition (Leads), active projects, and conversion rates.
*   **Observability (Logs):** A searchable interface for the Audit Trail.
*   **Content (Expertise):** Management of the technical blog/knowledge base.
### 4.2 The Audit Trail System
#### How it works
**Recorded Events include:**
*   `SIMULATION_RUN`: Every time a user triggers a calculation (useful to track compute costs).
*   `AI_CHAT_STREAM`: usage of the LLM assistant (token usage proxy).
*   `FEEDBACK_SUBMITTED`: Direct reports from users.
*   `ERROR`: Critical application failures caught by boundary handlers.
#### Viewing Logs
### 4.3 Maintenance: Log Rotation
**Manual Cleanup:**
*Pedagogical Note for DevOps:* In a high-traffic production environment, you should automate this. You can set up a cron job to call this action or run a SQL query directly:
### 4.4 System Health Checks
#### 1. Check Container Status
*   **Healthy:** `Up` status for `studio`, `engine`, and `postgres`.
*   **Unhealthy:** `Exit 1` or `Restarting`.
#### 2. Check Database Connectivity
*   Go to the **Admin Hub** main page (`/admin`).
*   Look at the Footer. There is a **"Base de données: Connectée"** indicator.
*   *How it works:* The page attempts a lightweight DB query (`db.user.count()`) on render. If it fails, the page will error out or show a disconnected state.
#### 3. Check Python Engine Link
*   There is no persistent connection to check (stateless).
*   **Test:** Create a "Hello World" project, add one Source and one Sink, and click "Simulate".
*   **Success:** The "Console" drawer opens and shows progress.
*   **Failure:** A Red Toast notification appears. Check `docker logs qcore_engine` immediately.
### 4.5 Backup Strategy
**Backup Command:**
**Restore Command:**
# The Domain Manifest Protocol
### 1.1 The Architecture of a "Domain"
**Location:** `apps/studio/lib/domains/`
### 1.2 Anatomy of a Manifest
  // 1. LIBRARIES: What resources can be used?
    }
  // 2. NODE TYPES: What machines exist?
    }
  // 3. EDGE TYPES: How do they connect?
    }
  }
};
### 1.3 Defining Assets (Nodes) & Fields
#### A. Physical Quantities (`quantity`)
}
#### B. Selectors (`select`)
}
#### C. Wireless Connections (`node-selector`)
}
#### D. Nested Collections (`collection`)
}
### 1.4 Scopes: Process vs. Utility
    *   *Behavior:* These nodes are arranged linearly from left to right in the Synoptic view.
    *   *Examples:* Boiler, Turbine, Reaction Tank.
    *   *Behavior:* These nodes are placed at the top (Sources) or bottom (Sinks) of the canvas to avoid cluttering the main flow.
    *   *Examples:* Water Source, Electrical Grid, Drain.
    *   *Examples:* Storage Tanks, Buildings.
### 1.5 Registration: Activating the Domain
**File:** `apps/studio/lib/registry.ts`
};
### 1.6 Verification
# Visual Customization & Component Registry
### 2.1 The "SmartNode": Zero-Config UI
### 2.2 The Component Registry
// apps/studio/lib/component-registry.tsx
// Import your custom report if you have one
// import { EnergyReport } from '@/components/domains/energy/energy-report';
  // Existing domain...
  // YOUR NEW DOMAIN
      // Map your logical types to React Components
      // You can reuse specific components from other domains if they fit
      // Standard panel when clicking on empty space
      // The component rendered in "Summary" view
      // SUMMARY: EnergyReport 
    }
  }
};
### 2.3 Creating a Custom Node (Advanced)
**Step 1: Create the Component**
  // Access simulation results via data.properties
}
**Step 2: Register it**
// ... inside REGISTRY.ENERGY.nodes
### 2.4 Customizing the Properties Panel
**The Widget Pattern:**
    }
### 2.5 Creating the Domain Report
**Step 1: Create the Report Component**
}
**Step 2: Register the Report**
}
### 2.6 Verification
# The Solver Interface & Physics Logic
### 3.1 Directory Structure
    *   `__init__.py`: (Can be empty)
    *   `solver.py`: This is where your code lives.
### 3.2 The Solver Contract
**The Signature:**
### 3.3 Implementing the Logic
**File:** `apps/engine/domains/energy/solver.py`
    # 1. NOTIFY UI: Calculation started
    # 2. PREPARE DATA STRUCTURES
    }
    # 3. THE PHYSICS LOOP (Simplified)
    # In a real scenario, you would build a Matrix (Ax=B) here using NumPy.
        # LOGIC FOR BOILERS
            # Inputs from UI fields
            # Physics: Fuel In = Power Out / Efficiency
            # Store results
        # LOGIC FOR TURBINES
            # Mock logic: output depends on upstream connection
            # (In reality, traverse 'edges' to find the connected Boiler)
        # Map results back to the Node ID
    # 4. FINALIZE GLOBAL KPIS
    # 5. SEND FINAL PAYLOAD
    # The type 'result' tells the UI to update the store
### 3.4 Registering the Solver
**File:** `apps/engine/main.py`
        # ... existing logic ...
                )
                # Error handling...
### 3.5 Mapping Results to UI
**In Python (`solver.py`):**
**In React (`SmartNode.tsx` or `TurbineNode.tsx`):**
// Inside your custom component
### 3.6 Best Practices: Using NumPy
**The Matrix Pattern:**
*Refer to `apps/engine/domains/surface_treatment/solver.py` for a full implementation of the Matrix Pattern.*
# Data Model & Topology Architecture
### 1.1 The Entity Hierarchy
#### Level 1: The Project (Global Scope)
*   **Time Basis:** It holds global settings like `hoursPerDay`, `weeksPerYear`. All mass balance calculations are normalized to this time basis.
*   **The Bus:** It owns `ProjectStream` objects (see Section 1.3), which act as the "Inter-System Bus".
#### Level 2: The System (Local Canvas)
*   **Isolation:** Each System has its own canvas, nodes, and edges.
*   **Type:** Can be `PRODUCTION` (Linear logic) or `TREATMENT` (Cyclical logic).
#### Level 3: Nodes & Edges (The Graph)
*   **`Node`:** An equipment asset. It contains a `properties` JSON blob which stores all domain-specific inputs defined in the Manifest.
*   **`Edge`:** A physical connection drawn by the user. By default, this represents a pipe or cable (`category: "PHYSICAL"`).
### 1.2 The "Wireless" Connection Logic
**The Solution:**
#### How it works in the Code:
// Conceptual logic in apps/studio/app/actions/simulation.ts
    // 1. Look up schema
      // 2. Detect "Wireless" fields
        // 3. Create ephemeral edge for the solver
        }
      }
}
**Architectural Impact:** The Python Solver receives a fully connected graph (Physical + Virtual) without the UI needing to render messy wires.
### 1.3 System of Systems (The Data Bus)
*   **`ProjectStream`:** A shared data object at the Project level. It acts as a Pub/Sub topic.
*   **Publishing:** A Node (e.g., a "Drain" in System A) connects to a Stream via `outputStreamId`.
*   **Subscribing:** A Node (e.g., a "Source" in System B) connects to the same Stream via `inputStreamId`.
**The Solving Sequence (`orchestrator.py`):**
### 1.4 Data Persistence Strategy
*   **Pros:** Impossible to have "Orphaned Edges" (edges pointing to non-existent nodes). Simplifies the frontend logic (no need to track diffs).
*   **Cons:** Higher DB write load. ID preservation is handled by the frontend sending specific UUIDs, which Prisma respects during creation.
# State Management & The Client Store
### 2.1 Why Zustand?
*   **Performance:** It allows components to subscribe to specific slices of state without re-rendering the entire app. This is critical when dragging a node at 60 FPS.
*   **Simplicity:** No boilerplate (reducers/actions). State logic is defined directly in the store hooks.
*   **Transient State:** It handles data that shouldn't be saved immediately, like simulation results (`simulationResults`) or UI view modes.
**File:** `apps/studio/store/canvas-store.ts`
### 2.2 Store Slices (The "God Store" Pattern)
#### A. The Graph Slice (`createGraphSlice`)
*   **`nodes` & `edges`:** The raw arrays required by the canvas.
*   **`onNodesChange` / `onEdgesChange`:** Standard React Flow hooks that handle dragging, selection, and deletion.
*   **`updateNodeProperties(id, props)`:** The most used action. It performs a **shallow merge** of properties. This allows the `PropertiesPanel` to update a specific field (e.g., `temp`) without overwriting other data like `pressure`.
#### B. The Workspace Slice (`createWorkspaceSlice`)
*   **`viewMode`:** Toggles between `GRAPH` (Editor), `SYNOPTIC` (List), and `SUMMARY` (Report).
*   **`synopticMode`:** Switches between Physical order (X-axis) and Sequence order (Process steps).
*   **`visibleScopes`:** Controls the Layer visibility (e.g., hiding Utility networks to focus on Process).
#### C. The Sequence Slice (`createSequenceSlice`)
*   **`sequences`:** An array of ordered lists of Node IDs.
*   **Logic:** It manages the drag-and-drop reordering in the Synoptic view (`SynopticEditor.tsx`) using `@dnd-kit`.
### 2.3 The Hydration Pattern (`ProjectInitializer`)
**Component:** `apps/studio/components/layout/project-initializer.tsx`
// Conceptual Flow
}
### 2.4 Optimistic UI Updates
**Example: Renaming a Node**
**Exception:** Some actions are **Atomic**. For example, creating a Project (`createProjectAction`) or Uploading an Image (`uploadImageAction`) happens on the server first, then returns a result to update the UI.
### 2.5 Accessing Simulation Results
*Architectural Note:* If the user refreshes the page, these results are lost (unless explicitly saved back to the DB, which is optional depending on the domain configuration).
# Appendix: Developer Cheatsheet & Troubleshooting
### A.1 Essential Command Reference
### A.2 "Where is X?" - File Map
### A.3 Troubleshooting FAQ
#### Q: I added a field to the Manifest, but it doesn't show up.
**A:** Check `apps/studio/lib/registry.ts`. Did you uncomment/import your new domain config file? Also, ensure your Node Type ID in the manifest matches the ID used in the `nodeTypes` object keys exactly.
#### Q: The Simulation returns "403 Forbidden".
**A:** This is a security mismatch.
#### Q: I get "PrismaClientInitializationError" in the logs.
**A:** The Studio cannot reach the Database.
#### Q: My changes to `solver.py` are not applied.
**A:** Python inside Docker does not "hot reload" automatically in production mode.
**Fix:** Run `docker-compose restart engine`.
#### Q: The canvas is blank or crashes on load.
**A:** This often happens if the `System` or `Project` ID in the URL is invalid or doesn't belong to you.
### A.4 Deployment Checklist
**End of Documentation.** You are now fully equipped to maintain, extend, and deploy Quantum Core. Happy Engineering!
# Configuration de l'environnement et de la sécurité
### 1.1 Prérequis
*   **Node.js :** v18.17+ (LTS recommandé)
*   **pnpm :** v9.x (Requis pour les workspaces Turborepo)
*   **Python :** v3.10+ (Pour l'exécution locale du moteur)
*   **Docker & Docker Compose :** v2.20+
### 1.2 Le protocole "Secret Interne"
**⚠️ Sécurité Critique :**
#### Générer un secret fort
*Enregistrez cette sortie. Elle sera désignée ci-dessous par `[VOTRE_SECRET_GÉNÉRÉ]`.*
### 1.3 Configuration du moteur (Python)
**1. Créer/Mettre à jour le fichier d'environnement**
# Le port sur lequel le serveur FastAPI écoute
# Le secret partagé (doit correspondre à la configuration du Studio)
**2. Patching de `docker-compose.yml`**
*Fichier : `docker-compose.yml`*
      # CHANGÉ : Utilise maintenant l'interpolation de variable
### 1.4 Configuration du Studio (Next.js)
**Créer/Mettre à jour `apps/studio/.env.local` :**
# --- Connexion à la base de données ---
# Assurez-vous que cela correspond à vos identifiants PostgreSQL
# --- Authentification (NextAuth.js) ---
# Générez un nouveau secret : openssl rand -base64 32
# L'URL publique de l'application
# Fournisseur de messagerie (SMTP) pour les liens magiques
# --- Pont Moteur ---
# L'URL où Next.js peut trouver le conteneur Python
# Dans le réseau Docker, utilisez : http://engine:8000
# Pour le développement local, utilisez : http://127.0.0.1:8000
# DOIT correspondre à la clé définie dans la Section 1.3
# --- Indicateurs de fonctionnalités ---
### 1.5 Étapes de Vérification
    # Créez un fichier .env à la racine avec vos secrets pour Docker
    *Résultat Attendu :* `{"detail":"Forbidden: Invalid API Secret"}`
    *Résultat Attendu :* `400 Bad Request` (C'est bon ! Cela signifie que l'authentification a réussi, mais que la charge utile était invalide, ce qui confirme que le Moteur est accessible et sécurisé).
# (Tuto 2/10) Gestion de Base de Données & Migrations
### 2.1 L'architecture des données
*   **Définition du schéma :** `packages/database/prisma/schema.prisma`
    *   Ce fichier définit vos tables (Modèles) et leurs relations.
*   **Client de base de données :** `packages/database/index.ts`
    *   Ceci exporte l'objet `db` utilisé dans toute l'application.
*   **Chaîne de connexion :** Définie dans votre fichier `.env` comme `DATABASE_URL`.
**Note pédagogique :** Lorsque vous modifiez le fichier `schema.prisma`, vous modifiez le *plan*. Vous devez ensuite "appliquer" ce plan au conteneur PostgreSQL réel et "générer" les types TypeScript afin que le code prenne connaissance des changements.
### 2.2 Démarrage du conteneur de base de données
    *   **Hôte :** `localhost`
    *   **Port :** `5434`
    *   **Utilisateur :** `quantum`
    *   **Mot de passe :** `password`
    *   **Base de données :** `quantum_core`
### 2.3 Synchronisation du Schéma (Dev vs. Prod)
#### A. La Méthode de Développement (`db:push`)
**Commande (depuis la racine) :**
*   **Ce qu'elle fait :** Met à jour la structure de la base de données immédiatement.
*   **⚠️ Risque :** Si vous avez renommé une colonne, elle pourrait supprimer l'ancienne et en créer une nouvelle, entraînant une perte de données. **N'utilisez pas cette méthode sur une base de données de production contenant des données réelles.**
#### B. La Méthode de Production (Migrations)
**1. Créer une Migration (Développement) :**
# Allez dans le package de la base de données
**2. Appliquer les Migrations (Production/CI) :**
### 2.4 Génération du client (sécurité des types)
**Commande (depuis la racine) :**
*Astuce : Turborepo est configuré pour exécuter cette commande automatiquement lorsque vous lancez `pnpm build`, mais pendant le développement, vous pourriez avoir besoin de la déclencher manuellement après une modification du schéma.*
### 2.5 Amorçage des données initiales
#### 1. Création du premier administrateur
    * **Email :** `admin@quantum.corp`
    * **Role :** `ADMIN` (Crucial : Sélectionnez ADMIN dans le menu déroulant de l'énumération)
    * **Name :** `System Admin`
#### 2. Hydratation des bibliothèques (Catalogue et Chimie)
    * **Icône 1 (Base de données) :** Importe le catalogue de matériel (Pompes, Réservoirs, Capteurs).
    * **Icône 2 (Fiole) :** Importe la bibliothèque chimique (Ions, Réactifs pour le domaine H2O).
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
# (Tuto 3/10) L'intégration du moteur Python
### 3.1 Architecture : La Calculatrice Apatride
*   Il ne se connecte **pas** à la base de données.
*   Il ne sait **pas** qui est l'utilisateur.
*   Il ne se souvient **pas** des calculs précédents.
**Comment ça marche :**
**Note Pédagogique :** Cette conception rend le moteur très robuste. Vous pouvez redémarrer le conteneur Python à tout moment sans perdre de données utilisateur. Si le moteur plante, cela n'affecte que le calcul spécifique en cours à cet instant précis.
### 3.2 Le Pont de Communication
**Le Flux :**
### 3.3 Surveillance du Cerveau
#### A. Journaux Docker (Le Flux Brut)
**Exemple de sortie :**
}
#### B. La Console de Simulation (Le Flux UI)
*   Dans l'interface utilisateur de Studio, un tiroir "Console" s'ouvre en bas à droite.
*   Ceci affiche les étapes de progression en temps réel (par exemple, "Construction de la Matrice...", "Résolution de l'Itération 4...").
*   Ceci est utile pour déboguer les simulations lentes sans consulter les journaux du serveur.
### 3.4 Tâches de maintenance courantes
#### Mise à jour de la logique du solveur
#### Mise à l'échelle
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
# (Tuto 4/10) Monitoring & Observabilité
### 4.1 Le Centre de Commande Admin
**Accès :** `https://votre-domaine.com/admin` (ou `/admin/stats`)
#### Sections Clés :
*   **KPIs (Centre de Commande) :** Métriques en temps réel sur l'acquisition d'utilisateurs (Leads), les projets actifs et les taux de conversion.
*   **Observabilité (Logs) :** Une interface de recherche pour le Journal d'Audit.
*   **Contenu (Expertise) :** Gestion du blog technique/base de connaissances.
### 4.2 Le système de piste d'audit
#### Comment ça marche
**Les événements enregistrés incluent :**
*   `SIMULATION_RUN` : Chaque fois qu'un utilisateur déclenche un calcul (utile pour suivre les coûts de calcul).
*   `AI_CHAT_STREAM` : utilisation de l'assistant LLM (proxy d'utilisation des jetons).
*   `FEEDBACK_SUBMITTED` : Rapports directs des utilisateurs.
*   `ERROR` : Défaillances critiques de l'application interceptées par les gestionnaires de limites.
#### Affichage des journaux
### 4.3 Maintenance : Rotation des journaux
**Nettoyage manuel :**
*Note pédagogique pour les DevOps :* Dans un environnement de production à fort trafic, vous devriez automatiser cette tâche. Vous pouvez configurer une tâche cron pour appeler cette action ou exécuter directement une requête SQL :
### 4.4 Vérification de l'état du système
#### 1. Vérifier le statut des conteneurs
*   **Sain :** Statut `Up` pour `studio`, `engine` et `postgres`.
*   **Malsain :** `Exit 1` ou `Restarting`.
#### 2. Vérifier la connectivité de la base de données
*   Allez sur la page principale du **Hub d'administration** (`/admin`).
*   Regardez le pied de page. Il y a un indicateur **"Base de données : Connectée"**.
*   *Fonctionnement :* La page tente une requête de base de données légère (`db.user.count()`) lors du rendu. Si elle échoue, la page affichera une erreur ou un état déconnecté.
#### 3. Vérifier la liaison du moteur Python
*   Il n'y a pas de connexion persistante à vérifier (stateless).
*   **Test :** Créez un projet "Hello World", ajoutez une Source et un Sink, puis cliquez sur "Simuler".
*   **Succès :** Le tiroir "Console" s'ouvre et affiche la progression.
*   **Échec :** Une notification "Red Toast" apparaît. Vérifiez immédiatement `docker logs qcore_engine`.
### 4.5 Stratégie de Sauvegarde
**Commande de Sauvegarde :**
**Commande de Restauration :**
# Le protocole du manifeste de domaine
### 1.1 L'architecture d'un "Domaine"
**Emplacement :** `apps/studio/lib/domains/`
### 1.2 Anatomie d'un Manifeste
  // 1. BIBLIOTHÈQUES : Quelles ressources peuvent être utilisées ?
    }
  // 2. TYPES DE NŒUDS : Quelles machines existent ?
    }
  // 3. TYPES D'ARÊTES : Comment se connectent-elles ?
    }
  }
};
### 1.3 Définition des Actifs (Nœuds) et des Champs
#### A. Quantités Physiques (`quantity`)
}
#### B. Sélecteurs (`select`)
}
#### C. Connexions Sans Fil (`node-selector`)
}
#### D. Collections Imbriquées (`collection`)
}
### 1.4 Portées : Processus vs. Utilitaire
    *   *Comportement :* Ces nœuds sont agencés linéairement de gauche à droite dans la vue Synoptique.
    *   *Exemples :* Chaudière, Turbine, Réservoir de réaction.
    *   *Comportement :* Ces nœuds sont placés en haut (Sources) ou en bas (Puits) du canevas pour éviter d'encombrer le flux principal.
    *   *Exemples :* Source d'eau, Réseau électrique, Drain.
    *   *Exemples :* Réservoirs de stockage, Bâtiments.
### 1.5 Enregistrement : Activation du Domaine
**Fichier :** `apps/studio/lib/registry.ts`
};
### 1.6 Vérification
# Personnalisation Visuelle et Registre de Composants
### 2.1 Le "SmartNode" : Interface utilisateur sans configuration
### 2.2 Le registre des composants
// apps/studio/lib/component-registry.tsx
// Importez votre rapport personnalisé si vous en avez un
// import { EnergyReport } from '@/components/domains/energy/energy-report';
  // Domaine existant...
  // VOTRE NOUVEAU DOMAINE
      // Mappez vos types logiques aux composants React
      // Vous pouvez réutiliser des composants spécifiques d'autres domaines s'ils conviennent
      // Panneau standard lors d'un clic sur un espace vide
      // Le composant rendu dans la vue "Résumé"
      // SUMMARY: EnergyReport 
    }
  }
};
### 2.3 Création d'un nœud personnalisé (Avancé)
**Étape 1 : Créer le composant**
  // Accéder aux résultats de simulation via data.properties
}
**Étape 2 : L'enregistrer**
// ... à l'intérieur de REGISTRY.ENERGY.nodes
### 2.4 Personnalisation du panneau de propriétés
**Le modèle de widget :**
    }
### 2.5 Création du rapport de domaine
**Étape 1 : Créer le composant de rapport**
}
**Étape 2 : Enregistrer le rapport**
}
### 2.6 Vérification
# L'interface du solveur et la logique physique
### 3.1 Structure des répertoires
    * `__init__.py` : (Peut être vide)
    * `solver.py` : C'est ici que réside votre code.
### 3.2 Le Contrat du Solveur
**La Signature :**
### 3.3 Implémentation de la logique
**Fichier :** `apps/engine/domains/energy/solver.py`
    # 1. NOTIFIER L'INTERFACE UTILISATEUR : Calcul démarré
    # 2. PRÉPARER LES STRUCTURES DE DONNÉES
    }
    # 3. LA BOUCLE PHYSIQUE (Simplifiée)
    # Dans un scénario réel, vous construiriez ici une Matrice (Ax=B) en utilisant NumPy.
        # LOGIQUE POUR LES CHAUDIÈRES
            # Entrées des champs de l'interface utilisateur
            # Physique : Carburant Entrant = Puissance Sortante / Efficacité
            # Stocker les résultats
        # LOGIQUE POUR LES TURBINES
            # Logique simulée : la sortie dépend de la connexion en amont
            # (En réalité, parcourir les 'edges' pour trouver la chaudière connectée)
        # Mapper les résultats à l'ID du nœud
    # 4. FINALISER LES KPI GLOBAUX
    # 5. ENVOYER LA CHARGE UTILE FINALE
    # Le type 'result' indique à l'interface utilisateur de mettre à jour le magasin
### 3.4 Enregistrement du Solveur
**Fichier :** `apps/engine/main.py`
        # ... logique existante ...
                )
                # Gestion des erreurs...
### 3.5 Mappage des résultats à l'interface utilisateur
**En Python (`solver.py`) :**
**En React (`SmartNode.tsx` ou `TurbineNode.tsx`) :**
// Inside your custom component
### 3.6 Bonnes pratiques : Utilisation de NumPy
**Le modèle matriciel :**
*Référez-vous à `apps/engine/domains/surface_treatment/solver.py` pour une implémentation complète du modèle matriciel.*
# Modèle de données et architecture topologique
### 1.1 La Hiérarchie des Entités
#### Niveau 1 : Le Projet (Portée Globale)
*   **Base de Temps :** Il contient des paramètres globaux comme `hoursPerDay`, `weeksPerYear`. Tous les calculs de bilan massique sont normalisés par rapport à cette base de temps.
*   **Le Bus :** Il possède des objets `ProjectStream` (voir Section 1.3), qui agissent comme le "Bus Inter-Système".
#### Niveau 2 : Le Système (Canevas Local)
*   **Isolation :** Chaque Système a son propre canevas, ses nœuds et ses arêtes.
*   **Type :** Peut être `PRODUCTION` (Logique linéaire) ou `TREATMENT` (Logique cyclique).
#### Niveau 3 : Nœuds et Arêtes (Le Graphe)
*   **`Node` :** Un actif d'équipement. Il contient un blob JSON `properties` qui stocke toutes les entrées spécifiques au domaine définies dans le Manifeste.
*   **`Edge` :** Une connexion physique dessinée par l'utilisateur. Par défaut, cela représente un tuyau ou un câble (`category: "PHYSICAL"`).
### 1.2 La logique de connexion "sans fil"
**La Solution :**
#### Comment cela fonctionne dans le code :
// Logique conceptuelle dans apps/studio/app/actions/simulation.ts
    // 1. Rechercher le schéma
      // 2. Détecter les champs "sans fil"
        // 3. Créer une arête éphémère pour le solveur
        }
      }
}
**Impact Architectural :** Le Solveur Python reçoit un graphe entièrement connecté (Physique + Virtuel) sans que l'interface utilisateur n'ait besoin de rendre des fils désordonnés.
### 1.3 Système de Systèmes (Le Bus de Données)
*   **`ProjectStream` :** Un objet de données partagé au niveau du Projet. Il agit comme un sujet Pub/Sub.
*   **Publication :** Un Nœud (par exemple, un "Drain" dans le Système A) se connecte à un Stream via `outputStreamId`.
*   **Abonnement :** Un Nœud (par exemple, une "Source" dans le Système B) se connecte au même Stream via `inputStreamId`.
**La Séquence de Résolution (`orchestrator.py`) :**
### 1.4 Stratégie de Persistance des Données
*   **Avantages :** Impossible d'avoir des "arêtes orphelines" (arêtes pointant vers des nœuds inexistants). Simplifie la logique du frontend (pas besoin de suivre les différences).
*   **Inconvénients :** Charge d'écriture plus élevée sur la base de données. La préservation des identifiants est gérée par le frontend qui envoie des UUID spécifiques, que Prisma respecte lors de la création.
# Gestion de l'état et du magasin client
### 2.1 Pourquoi Zustand ?
*   **Performance :** Il permet aux composants de s'abonner à des tranches spécifiques de l'état sans re-rendre toute l'application. C'est essentiel lors du glissement d'un nœud à 60 FPS.
*   **Simplicité :** Pas de code passe-partout (reducers/actions). La logique d'état est définie directement dans les hooks du store.
*   **État transitoire :** Il gère les données qui ne devraient pas être sauvegardées immédiatement, comme les résultats de simulation (`simulationResults`) ou les modes d'affichage de l'interface utilisateur.
**Fichier :** `apps/studio/store/canvas-store.ts`
### 2.2 Stocker les Slices (Le modèle "God Store")
#### A. La Slice Graph (`createGraphSlice`)
*   **`nodes` & `edges` :** Les tableaux bruts requis par le canvas.
*   **`onNodesChange` / `onEdgesChange` :** Hooks React Flow standards qui gèrent le glisser-déposer, la sélection et la suppression.
*   **`updateNodeProperties(id, props)` :** L'action la plus utilisée. Elle effectue une **fusion superficielle** des propriétés. Cela permet au `PropertiesPanel` de mettre à jour un champ spécifique (par exemple, `temp`) sans écraser d'autres données comme `pressure`.
#### B. La Slice Workspace (`createWorkspaceSlice`)
*   **`viewMode` :** Bascule entre `GRAPH` (Éditeur), `SYNOPTIC` (Liste) et `SUMMARY` (Rapport).
*   **`synopticMode` :** Bascule entre l'ordre physique (axe X) et l'ordre séquentiel (étapes du processus).
*   **`visibleScopes` :** Contrôle la visibilité des couches (par exemple, masquer les réseaux utilitaires pour se concentrer sur le processus).
#### C. La Slice Sequence (`createSequenceSlice`)
*   **`sequences` :** Un tableau de listes ordonnées d'ID de nœuds.
*   **Logique :** Elle gère le réordonnancement par glisser-déposer dans la vue Synoptique (`SynopticEditor.tsx`) à l'aide de `@dnd-kit`.
### 2.3 Le Modèle d'Hydratation (`ProjectInitializer`)
**Composant :** `apps/studio/components/layout/project-initializer.tsx`
// Flux Conceptuel
}
### 2.4 Mises à jour optimistes de l'interface utilisateur
**Exemple : Renommer un nœud**
**Exception :** Certaines actions sont **atomiques**. Par exemple, la création d'un projet (`createProjectAction`) ou le téléchargement d'une image (`uploadImageAction`) se produisent d'abord sur le serveur, puis renvoient un résultat pour mettre à jour l'interface utilisateur.
### 2.5 Accéder aux résultats de simulation
*Note architecturale :* Si l'utilisateur rafraîchit la page, ces résultats sont perdus (à moins d'être explicitement sauvegardés dans la base de données, ce qui est optionnel selon la configuration du domaine).
# Annexe : Aide-mémoire et dépannage du développeur
### A.1 Référence des commandes essentielles
### A.2 "Où est X ?" - Plan des Fichiers
### A.3 FAQ de dépannage
#### Q: J'ai ajouté un champ au Manifest, mais il n'apparaît pas.
**R:** Vérifiez `apps/studio/lib/registry.ts`. Avez-vous décommenté/importé votre nouveau fichier de configuration de domaine ? Assurez-vous également que l'ID de votre type de nœud dans le manifest correspond exactement à l'ID utilisé dans les clés de l'objet `nodeTypes`.
#### Q: La simulation renvoie "403 Forbidden".
**R:** Il s'agit d'une incompatibilité de sécurité.
#### Q: J'obtiens "PrismaClientInitializationError" dans les logs.
**R:** Le Studio ne peut pas atteindre la base de données.
#### Q: Mes modifications apportées à `solver.py` ne sont pas appliquées.
**R:** Python à l'intérieur de Docker ne se "recharge pas à chaud" automatiquement en mode production.
**Correction:** Exécutez `docker-compose restart engine`.
#### Q: Le canevas est vide ou plante au chargement.
**R:** Cela se produit souvent si l'ID `System` ou `Project` dans l'URL est invalide ou ne vous appartient pas.
### A.4 Liste de contrôle de déploiement
**Fin de la documentation.** Vous êtes maintenant entièrement équipé pour maintenir, étendre et déployer Quantum Core. Bon travail d'ingénierie !
  }
}
  }
  }
# Chapter 4: The Domain Manifest (Engineering Schema)
### 4.1 L'Équipement de Procédé (`PROCESS_BATH`)
    // --- GÉOMÉTRIE (Pour le calcul d'évaporation) ---
    // --- PHYSIQUE & ENVIRONNEMENT ---
    // --- LOGIQUE DE SPRAY & COMPENSATION ---
    // --- GESTION DES VIDANGES (DAMPING) ---
    // --- CHIMIE (La Recette) ---
    }
}
### 4.2 L'Équipement de Rinçage (`RINSE_TANK`)
    // --- HYDRAULIQUE (CASCADES) ---
      // 🚩 REGLE : On exclut PROCESS_BATH car la surverse vers un bain est interdite
    // --- VIDANGES PÉRIODIQUES ---
}
### 4.3 Logique Temporelle Globale (Working Hours)
// Ces champs apparaîtront dans les réglages du projet
### 4.4 Les Séquences (Le Transporter)
}
### Résumé des concepts appliqués dans ce Manifeste :
**Next Chapter:** *Nous passons maintenant au **Chapitre 5 : Le Solveur Python**. Nous allons coder la logique qui somme les séquences, calcule l'évaporation selon l'humidité et résout les bilans ioniques.*
# The Life of a Tank (Physics & Logistics)
## The Logistic Flow: Drag-out (Entraînement)
### The Calculation
*   **$S$**: The total surface area of parts processed per hour.
*   **$q_{spec}$**: The specific drag-out, which depends on the part geometry (flat parts vs. hollow parts) and the drainage time.
### The "Drag-in" Effect
*   **Mass Transfer:** This means Tank $N$ is constantly "polluted" by the chemistry of Tank $N-1$.
*   **Chemical Loss:** In a process bath, the operator must compensate for the chemicals lost via drag-out by adding fresh products. If the volume of these chemical additions differs from the drag-out volume, the level must be topped up with water.
## The Thermodynamic Loss: Evaporation
### Factors Influencing Evaporation
### The "24h Operation" Paradox
*   **The Workshop Schedule:** Operates for a fixed duration (e.g., 8h/day, 5 days/week).
*   **The Equipment Schedule:** Ventilation and heating systems often run **24h/day** to keep the baths ready.
*   **The Logic:** Evaporation occurs 24/7, but **compensation** (adding water) only happens during working hours when the water valves are active. Our Digital Twin must calculate losses over the full week while balancing them against the limited working hours.
## Rinsing Strategies: Cascades and Sprays
### Rinse Tank Dynamics
*   **Inlet:** Can be fed by clean water (source) or by the **overflow** of a subsequent rinse tank.
*   **Cascade Rinsing:** In a "Counter-current Cascade," clean water enters the *last* rinse and overflows into the *previous* one. This maximizes dilution while minimizing water consumption.
*   **Outlets:** The overflow can be directed to another tank, to a storage unit, or directly to a **Drain Network** (Acidic or Alkaline).
### Spray Rinsing (The Hybrid Solution)
## Damping and Waste Management
### Damping (Vidange)
*   **Drain Networks:** The system must track where this volume goes. A workshop typically has separate networks: **Acidic, Alkaline, Cyanide, or Chromic**.
*   **WWTP Sizing:** By calculating these damping volumes, we provide the data necessary to size the Waste Water Treatment Plant (WWTP).
## The Goal of the Simulation
# Mathematical Modeling (Ax = b)
## The Scenario: A Three-Tank Line
**The Logistics (Transporter):**
*   Parts move from **B $\rightarrow$ R1 $\rightarrow$ R2**.
*   The drag-out flow is constant: $Q_d = 10$ L/h.
**The Hydraulics (Pipes):**
*   Fresh water $Q_w = 400$ L/h enters **R2**.
*   **Cascade:** R2 overflows into **R1**.
*   R1 overflows to the **Drain**.
## The Algebraic Solution (Step-by-Step)
### Equation for Rinse 2 (The Cleanest Tank):
*   **In:** $Q_d \cdot C_1$ (coming from R1 via parts).
*   **Out:** $Q_d \cdot C_2$ (leaving via parts) + $Q_w \cdot C_2$ (leaving via overflow to R1).
*   **Balance:** $Q_d \cdot C_1 = (Q_d + Q_w) \cdot C_2$ 
*   $\Rightarrow C_2 = \frac{Q_d}{Q_d + Q_w} \cdot C_1$
### Equation for Rinse 1 (The Intermediate Tank):
*   **In:** $Q_d \cdot C_B$ (from Bath) + $Q_w \cdot C_2$ (overflow from R2).
*   **Out:** $Q_d \cdot C_1$ (to R2 via parts) + $Q_w \cdot C_1$ (to Drain via overflow).
*   **Balance:** $Q_d \cdot C_B + Q_w \cdot C_2 = (Q_d + Q_w) \cdot C_1$
### Exact Result:
**The Problem:** If we add evaporation, a spray in the bath, or a third rinse, solving this manually becomes a nightmare of substitutions.
## The Matricial Approach ($Ax = b$)
### Building the Equations for the Matrix
### The $Ax = b$ Form
### Why this is the "Engine" of Quantum Core:
*   **The Diagonal:** Represents the **Total Outflow** of a tank ($Q_{drag\_out} + Q_{water\_out}$).
*   **The Off-Diagonal:** Represents the **Inflows** from other tanks. A negative sign indicates that a concentration from "Tank J" is contributing to "Tank I".
*   **Vector b:** Contains our "Sources"—the fixed concentrations of the process baths.
## Adding Physics: Evaporation & Sprays
*   **Evaporation ($E$):** If a rinse tank has evaporation, the water leaving the tank is reduced. In the matrix, the term $(Q_d + Q_w)$ becomes $(Q_d + Q_w - E)$. The system will automatically check if $Q_w > E$ to prevent a negative water balance.
*   **Sprays:** If a spray in the Bath is fed by Rinse 1, it adds a new term in the Bath equation and the Rinse 1 equation.
*   **24h Evaporation:** In our Python solver, we will calculate an "Effective Evaporation Rate" by multiplying the 24/7 loss by $(168 / \text{WorkingHours})$, ensuring the mass balance is correct over a full production week.
## Numerical Resolution
# Chapter 5: The Python Solver Implementation
## Data Pre-processing: Aggregating Logistics
# Aggregate drag-out from all sequences
    # Hourly drag-out for this specific sequence
            # We add to the matrix (summing sequences)
## Calculating the Thermodynamic Loss (Evaporation)
    # Surface Area in m2
    # Simplified evaporation model (L/h)
    # Rate increases with Temperature and Agitation
    # Reduction if covers are used
## Resolving the Hydraulic Balance (The 24h Paradox)
### Automatic Spray Logic
# Hydraulic Calculation
        # Record a pumped transfer from Source -> Bath
## The Ionic Matrix: Solving $Ax = b$
### 1. The Dirichlet Condition (Process Baths)
*   We force $A[i, i] = 1$ and $b[i] = TargetConcentration$.
### 2. The Equilibrium Condition (Rinse Tanks)
*   **Diagonal $A[i, i]$:** Sum of all outflows (Drag-out + Overflow to Drain/Rinse + Pumped out to Spray).
*   **Off-Diagonal $A[i, j]$:** Negative sum of all inflows from tank $j$.
# For each chemical species
            # Rule: Fixed Concentration
            # Rule: Mass Balance (In = Out)
                # Negative inflow from tank j
    # Solve the system
## Environmental Impact: Drains and WWTP
## Summary of Chapter 5
*   **Multi-sequence summing** (Complex logistics).
*   **Thermodynamic evaporation** (Physical reality).
*   **The 168h/WH conversion** (Operational reality).
*   **Pumped vs Gravity flows** (Engineering constraints).
# Case Study 1: Modeling a Counter-Current Rinse Cascade
*   If we simply dump fresh water into each rinse tank individually, we waste huge amounts of water.
*   If we use a **Counter-Current** strategy (Clean water enters Rinse 2, overflows to Rinse 1, then drains), we save water while maintaining rinse quality.
## 1. The Physics: Solving it by Hand
### The Scenario
### The Equations (Steady State)
*   **Step A: Molar Mass Calculation**
    *   $NaOH = 40$ g/mol. $Na = 23$ g/mol.
    *   Ratio $R = 23/40 = 0.575$.
    *   Concentration of $Na^+$ in $T_0$ is $50 \times 0.575 = \mathbf{28.75}$ g/L.
*   **Step B: Mass Balance Equations**
    *   *Equation for Tank 2 (Rinse 2):*
    *   *Equation for Tank 1 (Rinse 1):*
*   **Step C: The Result**
    *   **Tank 1 ($C_1$):** $\approx 2.85$ g/L of Na.
    *   **Tank 2 ($C_2$):** $\approx 0.26$ g/L of Na.
## 2. Step 1: The Domain Manifest
**File:** `apps/studio/lib/domains/surface-treatment.ts`
    // The Source of Pollution
        // Connects to the Library
    // The Dilution Tank
        // Water Supply Configuration
    // The Sewer
    }
    }
  }
};
# Case Study 2: Multi-Stage Treatment & The 3-Tank Cascade
**The Scenario:**
**The Line Configuration:**
## 1. The Physics: Solving the Triple Cascade
### Parameters
*   **Tank 3 (Etching):** 100 g/L of HCl.
*   **Sequence:** Parts go $T_3 \to T_4 \to T_5 \to T_6$.
*   **Drag-out ($q_d$):** 10 L/h.
*   **Rinsing:** Fresh water ($Q_{fresh}$) enters $T_6$ at **100 L/h**.
*   **Cascade:** $T_6 \to T_5 \to T_4 \to \text{Drain}$.
### Step A: Chemistry
*   $H = 1$ g/mol, $Cl = 35.5$ g/mol. $HCl = 36.5$ g/mol.
*   Ratio $Cl^- = 35.5 / 36.5 \approx \mathbf{0.9726}$.
*   Concentration of $Cl^-$ in Active Bath ($T_3$) = $100 \times 0.9726 = \mathbf{97.26}$ g/L.
### Step B: The Geometric Progression
    *   $In = Out \implies 10 \cdot C_5 = (10 + 100) \cdot C_6$.
    *   $C_5 = 11 \cdot C_6$.
    *   $10 \cdot C_4 + 100 \cdot C_6 = 110 \cdot C_5$.
    *   Substitute $C_6$: $10 \cdot C_4 + 100 \cdot (C_5/11) = 110 \cdot C_5$.
    *   Solving leads to: $C_4 = 111 \cdot C_6$.
    *   $Load_{in} + 100 \cdot C_5 = 110 \cdot C_4$.
    *   $Load_{in} = 97.26 \text{ g/L} \times 10 \text{ L/h} = 972.6 \text{ g/h}$.
    *   Solving leads to: $972.6 \propto 1111 \cdot C_6$ (Approximation).
**Analytical Solution:**
*   $C_6 \text{ (Final)} \approx 97.26 / 11^3 \approx \mathbf{0.073}$ g/L.
*   $C_5 \approx 0.80$ g/L.
*   $C_4 \approx 8.8$ g/L.
## 2. Step 1: Extending the Library (JSON)
**File:** `surface-chemistry.json`
  // ... Previous entries (Sodium, Hydroxide, Caustic Soda) ...
  }
# Case Study 3: Network Segregation & Optimization
*   Too much volume for an **Evaporator** (Energy bills will explode).
*   Too much chemical load for **Ion Exchange** (Resins will saturate instantly).
**The Solution: Split the Flow.**
## 1. The Physics: Sizing the Split
### Parameters
*   **Drag-out ($q_d$):** 10 L/h.
*   **Input Load ($T_3 \to T_4$):** 972.6 g/h of Chloride ($Cl^-$).
### Strategy A: The "Dirty" Loop ($T_4, T_5$)
*   **Mass Balance:**
*   **Concentration in $T_5$:**
### Strategy B: The "Polishing" Loop ($T_6$)
*   **Pollution Input:** $C_5 \times q_d = 3.89 \times 10 = \mathbf{38.9} \text{ g/h}$.
    *Note: We reduced the load from 972.6 g/h to 38.9 g/h thanks to the first loop.*
*   **Concentration in $T_6$:**
### The Economic Result
## 2. Step 1: Modifying the Topology (Graph Editor)
**Actions in `/editor/[id]`:**
    *   Select the pipe connecting `Rinse 3 (T6)` $\to$ `Rinse 2 (T5)`.
    *   Press **Delete**.
    *   *Result:* $T_6$ is now hydraulically isolated from $T_5$.
    *   Open the Palette. Drag a `SOURCE` node. Name it "Evap Feed".
    *   Connect "Evap Feed" $\to$ `Rinse 2 (T5)`.
    *   *Result:* The Cascade $T_5 \to T_4$ is now fed independently.
    *   Drag a `DRAIN` node. Name it "Resin Network".
    *   Connect `Rinse 3 (T6)` $\to$ "Resin Network".
    *   *Result:* The final rinse has its own dedicated exit.
## 3. Step 2: Configuring the Flows
    *   Inlet Flow: **40 L/h**. (This drives the Evaporation loop).
    *   Water Source: "FRESH_WATER".
    *   Inlet Flow: **200 L/h**. (This drives the Resin loop).
    *   Water Source: "FRESH_WATER".
*Note on Sequence:* We do **not** touch the sequence. The crane path is still $T_3 \to T_4 \to T_5 \to T_6$. The pollution transport via drag-out remains unchanged; only the water transport changes.
## 4. Step 3: The Engine Resolution
### Analyzing the Matrix Terms
    *   Total Output of $T_4$ is $40 (\text{overflow}) + 10 (\text{drag}) = 50$.
    *   Input from $T_5$ is $40$.
    *   **Crucial:** The term $A[1, 2]$ (Input from $T_6$) is **0**. There is no hydraulic connection anymore.
    *   Total Output is $200 + 10 = 210$.
    *   Input from Sequence ($T_5 \to T_6$) is represented by the term $-10$ at $A[2, 1]$.
    *   *Wait, strictly speaking in our solver implementation:* Sequence inputs are usually added to the $B$ vector iteratively or handled as a drag matrix $D$ where $A = H + D$. In Quantum Core, drag-out is part of the system matrix $A$ (off-diagonals).
### Simulation Results
*   **$C_4$:** 19.45 g/L
*   **$C_5$:** 3.89 g/L
*   **$C_6$:** 0.185 g/L
## 5. Visualizing the Networks
### Report Summary
## Conclusion
*   **Traditional Tools (Excel):** You would have to rewrite formulas, break circular references, and create new tabs.
*   **Quantum Core:** You just dragged a line. The Matrix Solver automatically adapted to the new topology (Block Diagonal Matrix).
# Case Study 4: Building a Zero Liquid Discharge (ZLD) Plant
## 1. The Physics: The Treatment Chain
    *   **Physics:** Boils water under vacuum.
    *   **Yield:** 90% Recovery. The remaining 10% is "Concentrate" (Sludge) sent to disposal.
    *   **Physics:** Removes trace ions.
    *   **Yield:** ~100% Recovery (Water loss only during regeneration, ignored here).
    *   STL Demand: 240 L/h.
    *   Available Waste: 240 L/h.
    *   Evaporator Loss: 10% of 40 L/h = 4 L/h.
    *   **Deficit:** 4 L/h.
    *   **Solution:** Automatic City Water makeup.
## 2. Step 1: Extending the Domain Manifest
// Additions to nodeTypes
    // Critical: The Makeup Logic
}
# Case Study 5: Equipment Selection & CAPEX Estimation
*   **Evaporator Input:** 40 L/h (Acidic).
*   **Ion Exchange Input:** 200 L/h (Dilute).
*   **Makeup Water:** 4 L/h.
## 1. Step 1: Defining the Hardware Library (JSON)
  // --- EVAPORATORS (Vacuum) ---
    }
    }
  // --- ION EXCHANGE SKIDS ---
    }
  // --- TANKS ---
  // --- PUMPS ---
  }
# Architecting the Industrial Meta-Framework
**Quantum Core** was born from a simple realization: **Mathematically and structurally, these problems are identical.** They are all directed graphs where nodes process resources and edges transport them.
## 1. The Core Philosophy: "Everything is a Node"
### The Abstraction Layer
*   **The Database (Prisma/PostgreSQL):** Stores the topology (XY coordinates, connections) and a massive `JSONB` blob called `properties`.
*   **The Frontend (Next.js/React Flow):** A generic renderer that asks: *"What does this node look like?"* and *"What fields should I render?"*.
*   **The Engine (Python/NumPy):** A blind calculator that receives matrices, solves linear equations ($Ax = B$), and returns results.
## 2. The Architecture: The "Studio-Engine" Duality
### A. The Studio (The Artist)
*Built with Next.js 15, React Flow, Zustand, and Tailwind.*
#### The Component Registry Pattern
// lib/component-registry.tsx
  }
};
}
# From Atoms to JSON: Modeling Physics in TypeScript
## 1. The "Meta-Model": A Schema for Schemas
// lib/domain-config.ts
};
};
};
# The Matrix Solver: Automating Mass Balance for Surface Treatment Lines
## 1. The Domain Model: Defining the Physics
// lib/domains/surface-treatment.ts
    // 1. The Active Bath (Source of Pollution)
    // 2. The Rinse Tank (The Dilution Solver)
    // 3. The Output (The Network)
    }
  }
};
# Bridging the Gap: Visualizing Physics with React & The Registry Pattern
*   A **Generic Node** is just a rectangle with a label.
*   An **Engineering Node** (e.g., a Surface Treatment Tank) is a live dashboard. It must show liquid levels, temperature, chemical concentration, and visually alert the user if a threshold is breached.
## 1. The Challenge: One UI, Infinite Domains
// ❌ The Anti-Pattern: Hard-coded conditional rendering
  }
}
# Bridging the Gap: Visualizing Physics with React & The Registry Pattern
*   A **Generic Node** is just a rectangle with a label.
*   An **Engineering Node** (e.g., a Surface Treatment Tank) is a live dashboard. It must show liquid levels, temperature, chemical concentration, and visually alert the user if a threshold is breached.
## 1. The Challenge: One UI, Infinite Domains
// ❌ The Anti-Pattern: Hard-coded conditional rendering
  }
}
# The Knowledge Base: Architecting a Recursive Industrial Library
*   **A Chemical Product** (e.g., *Sulfuric Acid 98%*) is not just a string. It is a composition of atoms ($2 \times H^+$, $1 \times SO_4^{2-}$), with a specific density ($1.84$) and purity.
*   **A Machine Skid** is an assembly of a Pump, two Valves, and a Sensor.
## 1. The Data Structure: Recursive BOM (Bill of Materials)
**File:** `packages/database/prisma/schema.prisma`
  // The "Physics" Payload (Density, Molar Mass, Power...)
  // Recursive Relations
  // 1. "I am composed of..." (Downstream)
  // 2. "I am used in..." (Upstream)
}
}
# Orchestrating the Factory: System of Systems & Topological Sorting
*   **System A (Production):** Generates wastewater containing acid and nickel.
*   **System B (Physico-Chemical Station):** Receives the wastewater, neutralizes the acid, and precipitates the nickel.
*   **System C (Evaporator):** Receives the sludge from System B and concentrates it.
**Quantum Core** solves this by adopting a **"System of Systems"** architecture. We treat each production line as a black box (a "Microservice") and connect them via a **Project Bus**.
## 1. The Architecture: The Project Bus
**File:** `packages/database/prisma/schema.prisma`
  // The State (Snapshot of the last simulation)
  // Example: { "flow": 15000, "concentrations": { "Ni": 12.5 } }
  // Connectivity
}
### 1. Security Analysis
*   **Authentication & Authorization:**
    *   **Weakness (`middleware.ts`):** The middleware uses `@ts-ignore` to bypass type checking on `req.auth`. If the session structure changes, this could fail silently, potentially exposing admin routes.
    *   **Role Management:** The logic relies on `token.role` being passed to the session. While functional, `auth.config.ts` types are loose (`any`). A user with a manipulated JWT could potentially escalate privileges if the signing key isn't secure (though NextAuth handles signing well by default).
    *   **Resource Ownership (`graph.ts`):** The `verifyLineOwnership` function is implemented and called in `saveGraph`, which is excellent. However, `loadGraph` does **not** appear to verify ownership. A user could potentially load a graph they don't own if they guess the `lineId` (ID Enumeration attack), even if they can't save changes to it.
*   **API Communication:**
    *   **Strength (`simulation.ts` & `engine/main.py`):** The Next.js app communicates with the Python engine using an `INTERNAL_API_SECRET`. This prevents external actors from hitting the calculation engine directly, provided the `INTERNAL_API_SECRET` is strong and kept safe.
*   **Input Validation:**
    *   **Weakness (Server Actions):** In `project.ts` and `admin-blog.ts`, inputs from `FormData` are cast to string (`as string`) without strict validation. A user could submit empty strings or malicious payloads.
    *   **Strength (`leads.ts`):** Uses `zod` for email validation, which is the correct approach. This should be adopted across all actions.
*   **Dependencies:**
    *   The project uses `next-auth: 5.0.0-beta.30`. Beta versions can contain unpatched security flaws or breaking changes.
### 2. Performance Analysis
*   **Database Interactions (N+1 Problem):**
    *   **Risk (`graph.ts` - `saveGraph`):** The save logic performs a "Diff Sync" using `deleteMany` followed by loops of `upsert`. For a line with hundreds of nodes/edges, this generates a massive amount of SQL queries within a transaction. This will become a bottleneck.
    *   **Recommendation:** Use `createMany` for new items and batched updates, or send a simplified JSON blob to the DB if granular row-level access isn't strictly required for nodes.
*   **Computation (Python Engine):**
    *   **Risk (`solver.py`):** The solver runs `np.linalg.solve` on every request. There is no caching mechanism. If multiple users simulate the same configuration (or the same user clicks simulate repeatedly), the CPU will do redundant work.
    *   **Design Choice:** Passing the *entire* graph (nodes/edges/sequences) in the payload for every simulation (`SimulationPayload`) is bandwidth-heavy for large projects.
*   **Frontend Rendering:**
    *   **Optimization:** The `FlowEditor` uses `ReactFlow` with `useMemo` for node types, which prevents unnecessary re-renders.
    *   **Loading States:** The project uses `Promise.all` in `admin/stats/page.tsx` for parallel data fetching, which is excellent for load times.
### 3. Programming Errors & Code Quality
*   **Type Safety (TypeScript):**
    *   **Issue:** Extensive use of `any` (e.g., `canvas-store.ts`, `nodeTypes` in `node-palette.tsx`). This defeats the purpose of TypeScript and will lead to "Cannot read property of undefined" runtime errors as the project grows.
    *   **Specific:** In `middleware.ts`, `// @ts-ignore` is used to suppress a type error regarding `req.auth`.
*   **Dead Code / Commented Code:**
    *   **File:** `apps/engine/main.py`
    *   There are commented-out class definitions (`SequenceStep`, etc.) and logic for the "ENERGY" domain. This creates confusion about which data models are actually active.
*   **Encoding Issues:**
    *   **File:** `README.md`
    *   The scanner reported `[Error reading file: 'utf-8' codec can't decode byte...]`. This suggests the README might contain binary characters or be saved in a non-UTF-8 encoding (like Windows-1252), which will break CI/CD pipelines expecting UTF-8.
*   **Prisma Schema:**
    *   The `Project` model has `onDelete: Cascade` for lines, which is good. However, the `Sequence` model relies on string-based `nodeId` in `SequenceStep`. While there is a relation defined, ensuring data integrity when Nodes are deleted requires careful handling in the application logic (which `onNodesChange` in the store attempts to do, but server-side enforcement is safer).
### 4. Logic Errors
*   **Simulation Math (`solver.py`):**
    *   **Singularity Handling:** `A[i, i] = max(q_out_total[i], 1e-9)`. While this prevents division by zero, physically it means a tank with zero outflow acts as if it has a tiny outflow. This might mask configuration errors (e.g., a tank with no exit pipe) rather than alerting the user.
    *   **Sequence Logic:** The solver iterates through sequences to calculate drag-out. If a sequence references a Node ID that no longer exists (due to a sync error between graph and DB), the solver loop might crash or produce incorrect mass balances.
*   **State Synchronization (`project-initializer.tsx`):**
    *   The `lastLoadedLineId` ref is used to prevent infinite loops. However, if the user navigates away and back to the same line, the store might not reset correctly if the component doesn't unmount fully (Next.js client-side navigation).
*   **Blog Update Logic (`admin-blog.ts`):**
    *   The logic `const published = formData.get('published') === 'on';` is standard for HTML forms, but fragile. If the UI library (`shadcn` or similar) changes how it handles checkboxes (sending `true`/`false` strings instead of `on`), this logic will silently fail to publish posts.
### 5. Layout & Design Structure
*   **Architecture:**
    *   The separation of `marketing`, `admin`, and `editor` layouts via Next.js Route Groups (`(admin)`, `(marketing)`) is excellent. It keeps styles and layouts distinct.
*   **UI/UX:**
    *   **Responsive Design:** The CSS uses mobile-first approaches (`hidden lg:flex`). However, complex components like `FlowEditor` are inherently difficult on mobile. The `Workspace` layout assumes a desktop environment.
    *   **Z-Index Management:** `SequenceManager` uses `z-40` and fixed positioning. It might overlap with the `ReactFlow` controls (bottom left) or the `SummaryView` content on smaller screens.
*   **File Structure:**
    *   **Logic placement:** `apps/engine` (Python) handles domain logic, while `apps/studio` handles UI. This is a clean separation.
    *   **Store:** `canvas-store.ts` is becoming a "God Object" handling Workspace, Graph, and Sequence logic. It should likely be split into multiple stores or slices (as partially done, but all in one file).
### Summary of Recommendations
### 1. Sécurité
**Points Forts :**
*   **Isolation du Moteur :** Le moteur Python est isolé et protégé par un `INTERNAL_API_SECRET`. Il n'est pas exposé directement au public, mais proxifié par les Server Actions de Next.js.
*   **Vérification de Propriété (`graph.ts`) :** La fonction `getAuthenticatedSystem` vérifie bien que le `systemId` appartient à un projet dont l'utilisateur est propriétaire. C'est crucial pour éviter l'IDOR (Insecure Direct Object Reference).
*   **Architecture "Server-First" :** L'utilisation massive des Server Actions (`'use server'`) réduit la surface d'attaque côté client.
**Points Critiques & Vulnérabilités :**
*   **Gestion des Secrets (Docker) :** Dans `docker-compose.yml`, le secret `INTERNAL_API_SECRET` est hardcodé (`super-secret-quantum-key-2026`). En production, ceci doit passer par des variables d'environnement injectées au runtime, pas écrites dans le fichier.
*   **Validation des Entrées (Inconsistant) :**
    *   *Bien :* `actions/leads.ts` utilise `zod` pour valider l'email.
    *   *Risqué :* `actions/admin-blog.ts` fait des casts bruts (`formData.get('title') as string`). Si un attaquant envoie un objet ou un tableau, cela peut faire crasher le serveur ou causer des comportements inattendus.
    *   *Risqué :* `actions/library.ts` -> `importLibraryAction` parse du JSON uploadé par l'utilisateur sans limite de taille stricte ni validation profonde de la structure avant le parsing, ce qui expose au DoS (Denial of Service).
*   **Middleware Auth (`middleware.ts`) :** L'usage de `// @ts-ignore` sur `req.auth` est dangereux. Si la structure de l'objet session change (ce qui arrive souvent avec les bêtas de NextAuth v5), tes routes admin pourraient devenir accessibles ou crasher silencieusement.
*   **NextAuth Beta :** Tu utilises `next-auth: 5.0.0-beta.30`. Les versions bêta contiennent souvent des failles de sécurité non corrigées ou des changements de rupture.
### 2. Performance
**Points Forts :**
*   **Parallel Data Fetching :** Dans `admin/stats/page.tsx`, l'utilisation de `Promise.all` pour charger les stats en parallèle est excellente.
*   **React Flow Optimization :** L'usage de `useMemo` pour `nodeTypes` dans `flow-editor.tsx` évite des re-renders inutiles du graphe complet.
**Points d'Amélioration :**
*   **Le problème "N+1" en écriture (`saveGraph`) :**
    *   Dans `actions/graph.ts`, la sauvegarde fait un `deleteMany` puis une boucle `for` avec `upsert` pour chaque nœud et chaque lien.
    *   *Impact :* Pour un système de 500 nœuds, tu ouvres 1000+ requêtes SQL séquentielles dans une transaction. Cela va bloquer la DB.
    *   *Solution :* Utiliser `createMany` pour les insertions massives ou envoyer un JSON global si l'accès unitaire aux nœuds n'est pas requis par d'autres services.
*   **Moteur Python (Absence de Cache) :**
    *   Chaque clic sur "Simuler" renvoie tout le graphe au Python qui recalcule tout (matrices NumPy).
    *   *Solution :* Implémenter un hash du payload côté Python (ex: Redis) pour renvoyer le résultat caché si les inputs n'ont pas changé.
*   **Bundle Size :** L'import de `lucide-react` est généralement bon, mais assure-toi que ton `import * as Icons` dans `dynamic-icon.tsx` ne casse pas le Tree-Shaking. Charger toutes les icônes peut alourdir le bundle client considérablement.
### 3. Expérience Utilisateur (UX)
**Points Forts :**
*   **Feedback Visuel :** Les "Health Bars" de pollution sur les nœuds (`GenericNode`) et les animations de flux dans `BlueprintFlow` rendent la physique "visible".
*   **Navigation Contextuelle :** Le `UniversalHeader` qui change selon qu'on est au niveau Projet ou Système est très intuitif.
*   **Mode "Synoptique" vs "Graph" :** C'est une excellente idée. Les ingénieurs procédés aiment les schémas P&ID (Graphe), les opérateurs préfèrent les vues séquentielles (Synoptique).
**Points d'Amélioration :**
*   **Interactions Bloquantes :**
    *   L'utilisation de `alert()` et `confirm()` natifs (ex: `header.tsx`, `library-manager.tsx`) est à bannir en 2026. Cela bloque le thread principal du navigateur et fait "amateur".
    *   *Solution :* Utiliser les "Toasts" (ex: `sonner` ou `react-hot-toast`) et des Modales (Dialog) de ta bibliothèque UI.
*   **Gestion des Erreurs Moteur :** Si le conteneur Python est éteint, l'utilisateur reçoit une alerte générique. Il faudrait un état visuel "Système Déconnecté" dans le Header.
*   **Responsive Mobile :** Le `FlowEditor` et le `Synoptique` semblent difficilement utilisables sur mobile (pas de contrôles tactiles spécifiques visibles). Un avertissement "Vue optimisée pour Desktop" serait pertinent sur petit écran.
### 4. Navigabilité & Qualité du Code
**Points Forts :**
*   **Pattern "Domain Registry" (`lib/component-registry.tsx`) :**
    *   C'est brillant. Tu injectes dynamiquement les composants (Formulaires, Widgets, Nœuds) selon le domaine (`WATER`, `ENERGY`). Cela te permet d'ajouter le domaine "ENERGY" sans toucher au code cœur du Studio.
*   **Séparation Logiciel/Métier :**
    *   `apps/engine` contient la physique (Python).
    *   `apps/studio` contient l'interface.
    *   `packages/database` contient le schéma.
    *   C'est une séparation des responsabilités très propre (Clean Architecture).
**Points de Vigilance :**
*   **Le "God Store" (`canvas-store.ts`) :**
    *   Ce fichier gère tout : le graphe, la sélection, les séquences, le mode de vue, les données de bilan... Il devient massif.
    *   *Conseil :* Découper avec le pattern "Slice" de Zustand (`createGraphSlice`, `createUISlice`, `createSimulationSlice`) dans des fichiers séparés.
*   **Typage `any` :**
    *   Il y a beaucoup de `any` dans le code (ex: `items: any[]` dans `LibraryManager`, `config: any` dans les props).
    *   Cela annule les bénéfices de TypeScript. Il faudrait définir des interfaces strictes (`LibraryItem`, `DomainConfig`) dans un package partagé (`packages/types` ?).
### Résumé des priorités
# --- CONFIGURATION ---
# Directories to completely ignore
}
# Specific files to ignore (like heavy lock files)
}
# File extensions to include
}
  // ... implementation hidden for brevity ...
        # Remove ignored directories from search
            # Only show files in tree if they aren't ignored
  // ... implementation hidden for brevity ...
            # Only read the file if it has a relevant extension
  // ... implementation hidden for brevity ...
# --- CONFIGURATION ---
# 1. Dossiers et Fichiers à IGNORER totalement
}
# 2. Fichiers CRITIQUES à lire EN ENTIER (High Context)
# Mettez ici les fichiers qui contiennent la "vérité" du projet (Schémas, Auth, Config)
}
# 3. Extensions à traiter
  // ... implementation hidden for brevity ...
        # Vérifie aussi si un dossier parent est ignoré
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
    # Regex simples pour détecter les structures importantes
    # TS/JS: export, import, interface, type, function, class, const X = (
    # Python: def, class, import, from, @
        # Garder les 10 premières lignes (imports souvent)
        # Garder les commentaires (documentation)
        # Détection selon langage
            # Ajouter une ligne vide ou "..." si la ligne précédente ne l'était pas déjà
        # Garder les accolades fermantes pour la structure visuelle
  // ... implementation hidden for brevity ...
    # 1. Structure
    # 2. Contenu
                    # Pas de compression pour les fichiers critiques ou de config pure
                    # Compression intelligente
                # Estimation très grossière (1 mot ~ 1.3 tokens, code est dense)
    }
  }
}
# Introduction : L'Avènement de Quantum Core
## 1. La Genèse : Sortir de l'Enfer du "One-Shot"
**Quantum Core** né d'un refus de ce modèle.
## 2. La Philosophie : "Meta-Modélisation" et Abstraction
*   Pour **QuantumH2O**, ce nœud sera une "Cuve" avec un volume et un pH.
*   Pour **QuantumEnergy**, ce même nœud sera une "Batterie" avec une capacité et un voltage.
## 3. L'Architecture Hybride : Le Meilleur des Deux Mondes
*   Le web (JavaScript/TypeScript) est roi pour l'interface utilisateur, l'interactivité et la gestion de projet.
*   La science (Python) est reine pour le calcul matriciel, l'optimisation et l'Intelligence Artificielle.
### Le "Cerveau Gauche" : Next.js (Orchestration)
*   L'authentification et la sécurité (RBAC).
*   L'interface utilisateur (React, Tailwind, ReactFlow).
*   La persistance des données (PostgreSQL via Prisma).
*   La relation client (CMS, Leads).
### Le "Cerveau Droit" : FastAPI (Intelligence)
*   L'algèbre linéaire (NumPy) pour les bilans de masse et d'énergie.
*   L'IA Générative (LangChain/LLM) pour l'analyse de cahiers des charges (RAG) et la rédaction technique.
*   Il est "Stateless" : on lui envoie un problème (JSON), il renvoie une solution.
## 4. La Stack Technique (2025/2026 Ready)
*   **Langages :** TypeScript (Strict) & Python 3.11+.
*   **Frontend/BFF :** Next.js 15 (App Router, Server Actions).
*   **Backend Engine :** FastAPI + NumPy + Pydantic.
*   **Base de Données :** PostgreSQL (avec support JSONB et pgvector).
*   **ORM :** Prisma (pour la sécurité des types).
*   **Repo Management :** Turborepo (Monorepo) + pnpm.
*   **Infrastructure :** Docker Compose (Dev) / Architecture Conteneurisée (Prod).
## 5. Les Défis à Relever
# Chapitre 1 : Sprint 0 - Les Fondations de l'Usine
## 1. Objectif du Sprint
## 2. La Stratégie Monorepo (Turborepo & pnpm)
### Pourquoi ce choix ?
### L'Arborescence Cible
## 3. Le Schéma de Données "Meta-Model"
### Le changement de paradigme
*   **Avant (Approche classique) :** Une table par équipement. Si on veut ajouter un "Panneau Solaire", on doit migrer la DB.
*   **Après (Quantum Core) :** Une table `Node` universelle.
    *   `type`: String ("TANK", "SOLAR_PANEL")
    *   `properties`: **JSONB**. C'est ici que réside la flexibilité. PostgreSQL valide le format JSON, et nos validateurs applicatifs (Pydantic/Zod) valideront le contenu métier.
## 4. L'Orchestration Hybride (Docker)
## 5. Rétrospective : Difficultés Rencontrées et Solutions
### Défi n°1 : Le "Breaking Change" de Prisma 7
**Le Problème :** Nous avons adopté la toute dernière version de Prisma (v7.2.0). Lors de la génération du client, nous avons rencontré l'erreur `P1012`. La définition de l'URL de connexion directement dans `schema.prisma` (`url = env("...")`) est devenue obsolète et interdite.
**La Solution :**
*Leçon apprise :* Toujours vérifier les "Release Notes" des outils majeurs avant de commencer, surtout sur les versions "Bleeding Edge".
### Défi n°2 : La Rigueur de pnpm dans un Monorepo
**Le Problème :** Lors de l'installation des dépendances (`dotenv`, `@prisma/config`), nous avons eu des erreurs `ERR_PNPM_ADDING_TO_ROOT`. De plus, pnpm refusait d'installer des paquets dans `packages/database` car il ne le reconnaissait pas comme un module valide.
**La Solution :**
### Défi n°3 : L'Orchestration des Tâches avec Turbo
**Le Problème :** La commande `npx turbo run db:generate` échouait car Turborepo ne savait pas que cette tâche existait.
**La Solution :**
### Conclusion du Chapitre 1
*   Le moteur Python répond "OK".
*   La base de données est provisionnée avec un schéma générique.
*   Le frontend Next.js est prêt à démarrer.
# Chapitre 2 : Sprint 1 - Le Lien Neuronal
## 1. Objectif du Sprint
## 2. Le Pattern "Backend-for-Frontend" (BFF)
*   ❌ *Mauvais :* `Browser` -> `Python API` (Problèmes de CORS, d'authentification double, d'exposition de l'IP).
*   ✅ *Bon (Notre choix) :* `Browser` -> `Next.js Server Action` -> `Python API`.
## 3. Sécurité : Le Secret Partagé (Internal Secret)
## 4. Le Contrat d'Interface (Payload JSON)
}
*   **Côté Python (Pydantic) :** Ce JSON est automatiquement validé et converti en objets Python typés. Si Next.js envoie un champ manquant, Python renvoie une erreur explicite avant même de lancer le calcul.
*   **Côté TypeScript :** Nous avons typé le payload pour garantir que les développeurs frontend envoient des structures conformes.
## 5. Rétrospective : Pourquoi le "Server Action" change tout ?
*   **Gain de sécurité :** La clé API secrète ne quitte jamais le serveur. Elle n'est pas visible dans le code source du navigateur ("Network Tab").
*   **Simplicité :** Pas de gestion de `JSON.stringify` ou de headers côté client. L'appel ressemble à un simple appel de fonction JavaScript.
### Conclusion du Chapitre 2
# Chapitre 3 : Sprint 2 - L'Interface Polymorphe
## 1. Le Piège de l'Interface "Métier"
## 2. Le concept de "Domain Manifest"
// Ce simple objet transforme l'application
  }
};
## 3. Le Moteur de Rendu Visuel (ReactFlow)
**Résultat :** Pour ajouter un nouvel équipement dans le logiciel, il n'y a plus de code React à écrire. Il suffit d'ajouter 3 lignes dans le fichier JSON de configuration.
## 4. Gestion d'État (Zustand)
## 5. Rétrospective : Le Défi du Styling (Tailwind v4)
**Le Problème :**
**La Résolution :**
*Leçon apprise :* Dans un environnement Monorepo (Turborepo), la gestion des dépendances "peer" (comme PostCSS/Tailwind) doit être explicite dans chaque sous-projet (`apps/studio`) pour éviter les conflits de résolution.
# Chapitre 4 : Sprint 3 - La Mémoire du Graphe
## 1. L'Enjeu de la Persistance Générique
## 2. Le Choix Technologique : Driver Adapters et JSONB
*   **JSONB pour la flexibilité :** Pour rester "agnostiques", nous ne créons pas de colonnes pour chaque propriété physique (volume, tension, débit). Nous utilisons une colonne unique de type `Json` (JSONB en PostgreSQL). Cela permet de stocker n'importe quelle structure de données métier sans jamais migrer la base de données.
*   **Driver Adapters :** Pour garantir la compatibilité avec les environnements "Serverless" et "Edge", nous avons implémenté l'instanciation du client via `@prisma/adapter-pg`.
## 3. Stratégie de Sauvegarde : "Atomic Replace"
## 4. Rétrospective : Les Pièges de la Configuration de Base de Données
*   **Le Défi du Localhost :** Sur Windows, la résolution de `localhost` vers Docker est souvent instable pour les drivers Node.js. Nous avons résolu les erreurs de connexion (P1001) en basculant sur l'adresse IP explicite `127.0.0.1`.
*   **L'Isolation des Secrets :** Dans un Monorepo, Prisma ne charge pas toujours automatiquement le fichier `.env` du dossier parent. Nous avons dû forcer le chargement des variables d'environnement via un fichier `prisma.config.ts` explicite utilisant l'helper `env()`.
*   **L'Instanciation du Client :** Nous avons appris que `new PrismaClient()` ne suffit plus lorsque l'`url` est absente du schéma. Il faut lui injecter manuellement l'adaptateur de driver configuré avec le Pool de connexion PostgreSQL.
# Chapitre 5 : Sprint 4 - L'Intelligence des Objets
## 1. De la Forme à la Fonction
## 2. Le Moteur de Rendu de Formulaires (Schema-Driven UI)
## 3. Synchronisation d'État et UX
## 4. Rétrospective : La Puissance de l'Abstraction
*   Nous pouvons ajouter un paramètre "Viscosité" à une cuve en modifiant une seule ligne de JSON.
*   L'interface s'adapte instantanément.
*   La base de données accepte la donnée sans broncher.
*   Le développeur n'a pas touché au code "Core".
***
# Chapitre 6 : Sprint 5 - Le Réveil de l'Intelligence
## 1. La Fin de l'Amnésie Physique
## 2. Le Mapping de Données (Payload Transformation)
*   ReactFlow manipule des objets lourds contenant des informations de rendu (coordonnées pixel, état de drag, etc.).
*   Nous avons développé un "Mapper" dans la Server Action qui nettoie ces données pour n'extraire que la substantifique moelle : le type de nœud et son dictionnaire de propriétés JSONB.
## 3. L'Analyse Topologique en Python
## 4. L'Interface de Feedback (Dashboard d'Analyse)
# Sprint 6 : Le Flux de Masse (Hydraulique & Connexions)
**Objectif :** Faire circuler "quelque chose" dans les tuyaux. 
### 1. Mise à jour du Manifeste (`lib/domain-config.ts`)
// apps/studio/lib/domain-config.ts
  // ... nodeTypes ...
    }
  }
};
### 2. Le Moteur Python : Loi des Nœuds (Bilan de Masse)
*   Pour chaque cuve, Python va calculer : `Somme(Entrées) - Somme(Sorties)`.
*   Si le résultat n'est pas zéro, il enverra un **Alerte de Débordement** ou de **Vidange**.
### 3. UI : Édition des liens
### Pourquoi c'est le "vrai" début de Quantum ?
**Es-tu prêt à coder la logique des flux ?**
***
# Chapitre 7 : Sprint 6 — La Dynamique des Flux
## 1. De la Statique à la Cinétique
## 2. Abstraction des Edges
## 3. Le Premier "Juge" Physique : Le Bilan de Masse
*   **Résultat > 0** : Risque de débordement.
*   **Résultat < 0** : Risque de désamorçage ou vidange.
## 4. Rétrospective : La Gestion des Sélections Hybrides
# Sprint 7 : Le Catalogue et le "Sizing" (Dimensionnement)
**Objectif :** Ne plus saisir des valeurs au hasard, mais choisir du matériel réel. 
### 1. La Base de Données "Catalogue"
### 2. UI : Le Sélecteur de Composant
### 3. Intelligence : Le "Auto-Fill" et la Validation
*   Quand l'utilisateur choisit une pompe de 12 $m^3/h$ dans le catalogue, le champ `flowRate` du nœud se remplit tout seul.
*   Le moteur Python pourra alors comparer la performance de l'équipement choisi avec le besoin réel du système.
### Pourquoi c'est l'étape cruciale pour le business ?
**Es-tu prêt à intégrer le catalogue d'équipements ?**
# Quantum Core
## What's inside?
### Apps and Packages
### Documentation
### Development
### Build
  # 1. Base de données
  # 2. Moteur de Calcul (Python)
  # 3. Studio (Préparation pour le futur ou le déploiement)
  # studio:
  #   build: 
  #     context: .
  #     dockerfile: apps/studio/Dockerfile.dev
  #   ports:
  #     - "3000:3000"
  #   volumes:
  #     - .:/app
  #     - /app/node_modules
  #     - ./apps/studio/public/uploads:/app/apps/studio/public/uploads # Persistance des images
  #   environment:
  #     - DATABASE_URL=postgresql://quantum:password@postgres:5432/quantum_core
  #     - ENGINE_URL=http://engine:8000
  }
}
    }
  }
}
    }
}
# apps/engine/main.py
# --- REGISTRE DES SOLVEURS (ENGINEERING OS PATTERN) ---
# Centralise ici les points d'entrée des domaines. 
# main.py ne connaît plus la logique interne des domaines.
    # "AI_FACTORY": run_ai_factory_stream, <-- Futur domaine
}
# --- CONFIGURATION DU LOGGING (JSON) ---
    }
        }
# --- INITIALISATION ---
)
        # En production, on pourrait forcer l'arrêt ici
# --- MODÈLES DE DONNÉES (Génériques) ---
# --- SÉCURITÉ ---
    # compare_digest évite de révéler quelle partie du secret est correcte via le temps de réponse
# --- ROUTES API ---
        # Conversion unique du payload pour NumPy/Logic métier
        # model_dump est plus performant que json.loads(payload.json())
        )
    # On réutilise la logique de streaming mais on consomme tout avant de répondre
# --- AUTRES POINTS D'ENTRÉE ---
# Import du solveur
    # Registre des flux (Bus de données)
    }
    # 1. Calcul de l'ordre
    # 2. Boucle de résolution
        # A. Injection des Inputs depuis le Bus
                # Optionnel : injecter aussi les concentrations entrantes si le solveur le supporte
        # B. Exécution du Solver Local
            # --- CORRECTION CRITIQUE : Conversion Pydantic -> Dict ---
            # Appel du générateur
            )
            # Consommation du flux pour obtenir le résultat final
            # C. Publication des Outputs vers le Bus
                    # Mélange Physique (Moyenne pondérée par le débit)
                    }
    }
  // ... implementation hidden for brevity ...
    # Mapping Stream -> Producer System
    # Graphe de dépendance
    # Algorithme de Kahn
    # Fallback si cycle
# pytest cache directory #
**Do not** commit this to version control.
# apps/engine/domains/surface_treatment/solver.py
    # Ajout d'une liste locale de warnings qui sera fusionnée avec le global plus tard
        # --- LECTURE DES PARAMÈTRES GLOBAUX D'ÉVAPORATION ---
        # --- 1. PARAMÈTRES TEMPORELS ---
        # --- 2. LOGISTIQUE : CALCUL DU DRAG-OUT (Entraînement) ---
        # --- 3. CHIMIE : PRÉPARATION DES CIBLES (FLATTENING) ---
        # Correction 3: Utiliser la structure de librairie formatée pour Python (referenceItems)
        # Conserver le lib_map des unités de base (ions) pour les compositions futures
        # base_units_map = {item['id']: item for item in library.get('baseUnits', [])}
                # print(f"DEBUG_BATH: reagents:  {reagents}") # Maintenu pour le debug si besoin
                    # --- RUPTURE FIXÉE ICI ---
                    # --- DÉBUT DU BLOC CORRIGÉ / ROBUSTE ---
                    # Accumulateur temporaire pour les ions purs : {ion_id: coefficient_total}
                    # Le solveur doit gérer 2 niveaux de récursivité pour l'instant (Produit Commercial -> Réactif -> Ion)
                            # Cas 1 : Le produit se décompose directement en ION (Niveau 1)
                            # Cas 2 : Le produit se décompose en un AUTRE produit (Niveau 2)
                                    # Le calcul clé est ici : multiplication des proportions N1 * N2
                    # Finalisation : Accumuler la concentration totale
                        # Multiplication unique par la concentration utilisateur (prod_conc)
                        # print(f"DEBUG_BATH: Ion {ion_id} target set to: {ionic_targets[n['id']][ion_id]}") # Maintenu pour le debug
        # --- 4. HYDRAULIQUE : ÉVAPORATION, VIDANGES ET APPOINTS ---
        # Le warnings sera local_warnings pour l'instant, fusionné à la fin
        # A. INTEGRATION DES VIDANGES (DUMPING)
        # B. CALCUL DE L'ÉVAPORATION ET APPOINT ASSOCIÉ
        # C. STABILISATION DES CASCADES DE RINÇAGE
        # --- 5. CHIMIE : RÉSOLUTION Ax = b ---
        # Calcul des ajouts chimiques (Masse)
                    # Calcul des inputs contaminés
                    # Ajout d'une protection contre les inputs qui n'existent pas
        # --- Injection des cibles ioniques et fusion des warnings ---
        # Ajout des débits In/Out calculés dans le résultat final pour les nœuds
        # --- 6. FINALISATION ET KPIS ---
        # Fusion des warnings locaux et warnings globaux du solveur
        # Correction 5: Utilisation du logger standard Python pour le terminal
# apps/engine/tests/test_st_advanced.py
    # 1. SETUP NODES
            }
            }
    # 2. SETUP LOGISTICS (Bath -> R1 -> R2)
    # 3. SETUP LIBRARY (Flattening: Product -> Reagent -> Ion)
    }
    # 4. EXECUTE
    # --- 5. PHYSICAL VERIFICATIONS ---
    # A. Test Evaporation + Drag-out Compensation
    # Evap efficace = 4.2 L/h. Perte Drag-out = 10 L/h. 
    # Total "In" pour le bain doit être 14.2 L/h
    # B. Test Cascade Hydraulics (CORRIGÉ)
    # Rinse 2 reçoit 200 (eau) + 10 (pièces). Il déborde de 210 vers Rinse 1.
    # Rinse 1 reçoit 210 (eau) + 10 (pièces). Il sort 10 (pièces) + 210 (débordement).
    # Total "Out" de Rinse 1 = 220.0 L/h
    # C. Test de l'Équilibre de Masse (Uniquement pour les cuves de process)
    # On crée un dictionnaire pour accéder facilement aux types des nœuds
        # On n'équilibre pas les sources (elles fournissent) 
        # ni les drains (ils collectent)
        # Pour tout le reste (Bains, Rinçages), l'équilibre doit être parfait
# apps/engine/tests/test_st_solver.py
    # 1. PRÉPARATION DES DONNÉES (Mock du payload Studio)
            }
            }
        }
            }
        }
            }
    }
    }
    # 2. EXÉCUTION DU SOLVEUR
    # 3. VERIFICATIONS (ASSERTIONS)
    # Vérification de la concentration dans le rinçage (Doit être 10.0 g/L)
    # Formule : (10 L/h * 100 g/L) / (10 L/h + 90 L/h) = 10 g/L
    # Vérification du flux à l'égout (100 L/h)
## Getting Started
# or
# or
# or
## Learn More
## Deploy on Vercel
// apps/studio/auth.config.ts
    // 1. On ajoute le rôle au JWT lors de la connexion
      }
    // 2. On transmet le rôle du JWT vers la session accessible par le Middleware/UI
      }
      // Si on tente d'aller sur /admin...
        // @ts-ignore
      }
// apps/studio/auth.ts
// C'est cette ligne qui manquait ou était incomplète
        }
/** @type {import("eslint").Linter.Config[]} */
// 1. TYPAGE INTERNE POUR LA SÉCURITÉ DU CODE
    }
}
      }
    }
  }
}
// 2. LOGIQUE DU MIDDLEWARE
// Note : On ne met pas 'export default' ici directement pour éviter l'erreur d'inférence
  // On cast 'req' pour avoir l'autocomplétion sur 'req.auth' à l'intérieur
  // A. EXCLUSION
  }
  // B. LOCALE
  }
  // C. SÉCURITÉ
    }
    }
  }
// 3. EXPORT FINAL AVEC CAST
// C'est cette ligne qui corrige l'erreur "The inferred type..."
// On dit à TypeScript : "C'est bon, exporte ça comme un objet générique, ne cherche pas plus loin."
};
/// <reference types="next" />
/// <reference types="next/image-types/global" />
// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
/** @type {import('next').NextConfig} */
  }
}
}
      // 1. Définition des Keyframes (les mouvements)
        // Animation pour l'effet de brillance sur la carte "Engine"
        // Animation pour le texte dégradé du Hero
      // 2. Définition des utilitaires d'animation
};
      }
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
          }
      }
        }
    }
  }
}
  // ... implementation hidden for brevity ...
  }
  }
      }
  }
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // FIX: Fetch the user first
      // FIX: Use 'connect' syntax for relations
      }
    }
}
  // ... implementation hidden for brevity ...
    }
      // FIX: Connect the same author
      }
    }
}
  // ... implementation hidden for brevity ...
      }
  }
}
  // ... implementation hidden for brevity ...
    // 1. On détache d'abord tous les articles liés (pour éviter les erreurs de contrainte)
    // 2. On supprime le tutoriel
  }
}
// Verify Admin privileges
  // @ts-ignore - 'role' is injected via auth.config.ts
  }
}
  // ... implementation hidden for brevity ...
  // Filter by Action Type (Dropdown)
  }
  // Filter by Search (User ID, Domain, or ID)
  }
  // Fetch logs (Limit 100 for performance, could add pagination later)
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    }
}
    // Ne pas rejeter l'erreur pour ne pas bloquer l'action principale
  }
}
// apps/studio/app/actions/blog.ts
          }
        }
      }
    }
}
/**
 * NEW: Helper to find the slug of the SAME post in another language.
 * Used for the Language Switcher in the Header.
 */
  // ... implementation hidden for brevity ...
}
// --- SECURITY HELPER ---
  // @ts-ignore
  }
}
  // ... implementation hidden for brevity ...
    }
      }
  }
}
// --- CORRECTION DU TYPE ET DE LA LOGIQUE PRISMA ---
  // ... implementation hidden for brevity ...
  // 1. Construction dynamique de la clause Where
    // Si on reçoit un tableau ["REAGENT", "ION"], on utilise l'opérateur IN de Prisma
    // Sinon on fait une égalité simple
  }
}
// --- SECURITY HELPER ---
  // @ts-ignore
  }
}
// Validation du format du JSON de configuration
      // ... implementation hidden for brevity ...
        // ... implementation hidden for brevity ...
  )
/**
 * Importe un JSON de configuration des champs
 * Format attendu : { "PUMP": [ ...fields ], "TANK": [ ...fields ] }
 * Si une catégorie contient un tableau vide [], la configuration est supprimée (Reset).
 */
  // ... implementation hidden for brevity ...
  }
        // LOGIQUE DE RESET : Si le tableau de champs est vide, on supprime la config en base
          // Sinon, on met à jour (Upsert standard)
        }
      }
  }
}
/**
 * Récupère les schémas dynamiques pour l'éditeur
 */
  // ... implementation hidden for brevity ...
  // On transforme le tableau DB en objet { "PUMP": fields, ... }
}
// ====================================================================
// 1. SÉCURITÉ
// ====================================================================
  }
  // Vérification stricte : le système doit appartenir à un projet de l'utilisateur
    }
  }
}
// ====================================================================
// 2. CHARGEMENT (LOAD) - CORRIGÉ
// ====================================================================
  // ... implementation hidden for brevity ...
    // ✅ CORRECTION : On charge TOUT (Nodes, Edges, ET Séquences)
    // On utilise une seule requête relationnelle puissante plutôt que Promise.all
          }
        }
      }
    // Mapping Nodes
      // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
        // On réinjecte les IDs de streams pour le front
    // Mapping Edges
      // ... implementation hidden for brevity ...
        // ... implementation hidden for brevity ...
    // ✅ CORRECTION : Mapping Séquences
      // ... implementation hidden for brevity ...
  }
}
// ====================================================================
// 3. SAUVEGARDE (SAVE) - CORRIGÉ
// ====================================================================
  // ... implementation hidden for brevity ...
      // ✅ CORRECTION : Suppression SÉQUENTIELLE (Pas de Promise.all)
      // Pour éviter les verrous mortels (Deadlocks) et les erreurs de Clés Étrangères
      // 1. D'abord les petits enfants (Steps)
      // 2. Puis les parents (Sequences)
      // 3. Puis les dépendances (Edges)
      // 4. Enfin les maîtres (Nodes)
      // --- RECRÉATION ---
              // ... implementation hidden for brevity ...
            // ✅ CORRECTION : Mapping des colonnes relationnelles (Streams)
            // C'est vital pour que le solveur Python puisse relier les systèmes entre eux
      }
      }
        // Aplanissement des steps (Flatten)
        }
      }
  }
}
// apps/studio/app/actions/leads.ts
// 1. Define the schema
  // 2. Validate input
  }
  }
}
/**
 * Interface étendue pour NextAuth
 */
}
// --- SECURITY HELPER ---
  // ... implementation hidden for brevity ...
  }
}
// --- ACTIONS DE RÉCUPÉRATION ---
  // ... implementation hidden for brevity ...
  // Récupération optimisée avec tri
      }
}
// --- ACTIONS DE MODIFICATION ---
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    // 1. Upsert de l'item principal (Clé unique sur 'name' assurée par le schéma)
      }
    // 2. Synchronisation de la composition (Delete + Create)
      }
    }
}
  // ... implementation hidden for brevity ...
  // Empêcher la suppression si l'item est une dépendance
  }
}
// --- LOGIQUE D'IMPORTATION JSON (OPTIMISÉE) ---
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
  }
      // ÉTAPE 1 : Création des items parents (Bulk possible si on gère les conflits)
      // On utilise une boucle mais on évite les findUnique redondants
          }
      }
      // ÉTAPE 2 : Reconstruction des liens (Composition)
      // On récupère tous les IDs en une seule fois pour le mapping name -> id
        }
      }
  }
}
// --- EXPORTATION ---
  // ... implementation hidden for brevity ...
      }
}
// --- UTILITAIRES DE CALCUL (ALGORITHME OPTIMISÉ) ---
/**
 * Aplatit récursivement la nomenclature (BOM) en minimisant les appels DB.
 * Stratégie : Chargement de l'arbre de dépendance complet en une fois.
 */
  // ... implementation hidden for brevity ...
  // 1. On récupère d'abord l'item racine pour connaître son domaine
  // 2. On charge TOUS les liens de composition du domaine pour construire le graphe en mémoire
  // Cela évite le N+1 récursif en base de données.
    }
  // 3. Parcours DFS en mémoire (Ultra rapide)
    // ... implementation hidden for brevity ...
    }
    }
  }
}
// 'use server' indique que ce code s'exécute uniquement côté serveur.
// Il a accès direct à la BDD et aux secrets, mais rien ne fuite vers le client.
// 👇 Import des utilitaires dynamiques du registre (Étape cruciale pour la modularité)
// 👇 Import du logger de sécurité
// ====================================================================
// 1. SCHÉMAS DE VALIDATION (STRICTS)
// ====================================================================
  // ... implementation hidden for brevity ...
  // L'utilisateur DOIT sélectionner un domaine dans l'interface.
  // ... implementation hidden for brevity ...
// ====================================================================
// 2. HELPER DE SÉCURITÉ (Middleware Interne)
// ====================================================================
/**
 * Vérifie l'authentification ET la propriété du projet.
 * Cette fonction est appelée au début de chaque action sensible.
 */
  // ... implementation hidden for brevity ...
  }
  }
  // Protection IDOR (Insecure Direct Object Reference)
    // On loggue cette tentative d'accès illégal
  }
}
// ====================================================================
// 3. SERVER ACTIONS (API)
// ====================================================================
/**
 * ACTION : Initialiser une nouvelle étude
 */
  // ... implementation hidden for brevity ...
  // 1. Sécurité de base
  // 2. Sécurité avancée : "Session Fantôme"
  // 3. Préparation des données
  };
  // 4. Validation
    };
  }
  // 5. Exécution DB
      }
    // Création automatique du premier système
      }
    // 🔍 AUDIT LOG
  }
}
/**
 * ACTION : Supprimer une étude
 */
  // ... implementation hidden for brevity ...
    // Utilisation d'une clause composite pour la sécurité atomique
        }
    // 🔍 AUDIT LOG
      // Si le delete échoue (ex: IDOR), Prisma lève une erreur RecordNotFound
  }
}
/**
 * ACTION : Renommer une étude
 */
  // ... implementation hidden for brevity ...
  // 1. Vérification des droits
  // 2. Validation
  }
  // 3. Mise à jour
}
/**
 * ACTION : Partager un projet (Ajout collaborateur)
 */
  // ... implementation hidden for brevity ...
  }
      }
    // 🔍 AUDIT LOG
  }
}
/**
 * ACTION : Paramètres temporels (Global settings)
 */
  // ... implementation hidden for brevity ...
  }
  // 🔍 AUDIT LOG (Optionnel pour éviter le spam si auto-save, mais utile pour config critique)
}
}
    // Nettoyage préventif des métadonnées pour ne jamais logger de mots de passe
        }
      }
    // Si le log échoue, on l'affiche juste dans la console serveur pour ne pas crasher l'app
  }
}
// --- SECURITY HELPERS ---
}
  // ... implementation hidden for brevity ...
}
/**
 * Crée une nouvelle séquence (gamme) pour un système donné.
 */
  // ... implementation hidden for brevity ...
    }
}
/**
 * Met à jour les métadonnées d'une séquence (nom, propriétés).
 */
  // ... implementation hidden for brevity ...
    }
}
/**
 * Met à jour les étapes d'une séquence.
 */
  // ... implementation hidden for brevity ...
  // On supprime les anciennes étapes et on crée les nouvelles en une seule transaction
}
/**
 * Supprime une séquence.
 */
  // ... implementation hidden for brevity ...
}
// ====================================================================
// 1. TYPES & SCHÉMAS
// ====================================================================
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
  };
};
/**
 * Interface pour le retour standardisé des appels moteur
 */
  // ... implementation hidden for brevity ...
}
// ====================================================================
// 2. HELPERS DE SÉCURITÉ & ACCÈS
// ====================================================================
/**
 * Vérifie l'accès à un projet et inclut toute l'arborescence technique.
 * Cette version est optimisée pour charger tout le "System of Systems" en une fois.
 */
  // ... implementation hidden for brevity ...
          }
        }
    }
}
/**
 * Vérifie l'accès à un système spécifique et récupère le Bus Projet (Streams) associé.
 */
  // ... implementation hidden for brevity ...
  }
}
// ====================================================================
// 3. UTILITAIRES RÉSEAU (BRIDGE NEXT.JS <-> PYTHON)
// ====================================================================
/**
 * Gère la communication HTTP avec le moteur FastAPI.
 * @param endpoint - Route du moteur (ex: /simulate)
 * @param payload - Données JSON structurées
 * @returns Objet standardisé avec succès/erreur et données
 */
  // ... implementation hidden for brevity ...
  }
  // SÉCURITÉ : AbortController pour ne pas bloquer le thread Next.js indéfiniment
    }
    }
  }
}
// ====================================================================
// 4. LOGIQUE DE TOPOLOGIE (LIENS VIRTUELS & DÉDOUBLONNAGE)
// ====================================================================
/**
 * Analyse le Manifeste du Domaine pour transformer les sélections de champs 
 * (ex: 'Alimentation du spray') en arêtes logiques réelles pour le solveur.
 * Cela permet de relier des équipements sans dessiner de tuyaux sur le graphe.
 */
  // ... implementation hidden for brevity ...
      // Un champ 'node-selector' définit un lien logique (ex: un bac A puise dans un bac B)
              // ... implementation hidden for brevity ...
        }
      }
}
/**
 * Fusionne les arêtes dessinées (Pipes) et les arêtes logiques (Virtual)
 * en évitant les doublons si l'utilisateur a dessiné ce qui est déjà sélectionné.
 */
  // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
    }
}
/**
 * Prépare la bibliothèque pour NumPy.
 * Transforme les relations Prisma (Noms, Composants) en dictionnaires 
 * indexés par ID pour un calcul matriciel rapide.
 */
  // ... implementation hidden for brevity ...
    };
}
// ====================================================================
// 5. ACTIONS SERVEUR (LOGIQUE MÉTIER)
// ====================================================================
/**
 * SIMULATION D'UN SEUL SYSTÈME (LIGNE DE PRODUCTION)
 * C'est l'action appelée lors du clic sur le bouton "Simuler" dans l'éditeur.
 */
  // ... implementation hidden for brevity ...
    // 1. Chargement du contexte technique
    // 2. Traitement de la topologie hybride (Graph + Paramètres)
      // ... implementation hidden for brevity ...
        // ... implementation hidden for brevity ...
    // 3. Construction du Payload Physics
        // --- LOGIQUE BUS PROJET ---
        // Si le nœud est connecté à un flux global (Bus), on injecte les données calculées
        // provenant des autres systèmes du projet.
          }
        }
    };
    // 4. Logging & Exécution
    }
  }
}
/**
 * SIMULATION GLOBALE DU PROJET (SYSTEM OF SYSTEMS)
 * Résout les dépendances entre toutes les lignes de production (ex: rejet ligne 1 -> entrée station).
 */
  // ... implementation hidden for brevity ...
    // Construction du payload incluant TOUS les systèmes du projet
          // ... implementation hidden for brevity ...
            // ... implementation hidden for brevity ...
        };
    };
    // PERSISTANCE : Si le projet est résolu, on met à jour les flux (Bus) en base de données
        )
    }
  }
}
/**
 * POINT D'ENTRÉE POUR LE BILAN TECHNIQUE RÉSUMÉ
 * Récupère le bilan complet (financier, environnemental, ionique) pour le rapport final.
 */
  // ... implementation hidden for brevity ...
    // Extraction optimisée des données de simulation
      // ... implementation hidden for brevity ...
      // Note: On réutilise la logique de topologie pour chaque système
      // Mais ici, on utilise les données déjà chargées dans 'project' (évite le N+1)
        // ... implementation hidden for brevity ...
      };
    }
  }
}
/**
 * ÉVALUATION RÉACTIVE D'UN NŒUD (MICRO-CALCUL)
 * Permet de calculer l'évaporation ou le dimensionnement d'un bac en temps réel lors de la saisie.
 */
  // ... implementation hidden for brevity ...
}
/**
 * GÉNÉRATION DE PROPOSITION IA
 * Appelle le moteur LLM pour rédiger un argumentaire technique basé sur le graphe.
 */
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
  };
  }
}
// --- SECURITY HELPERS ---
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
// --- ACTIONS ---
  // ... implementation hidden for brevity ...
    }
}
  // ... implementation hidden for brevity ...
          }
        }
      }
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    }
}
  // ... implementation hidden for brevity ...
  // Sécurité : on s'assure que le stream appartient bien au projet vérifié
    } 
}
/**
 * Connecte un nœud à un flux global
 */
  }
}
// FILE: apps/studio/app/actions/system.ts
// --- SECURITY HELPERS ---
}
  // ... implementation hidden for brevity ...
}
// --- ACTIONS ---
  // ... implementation hidden for brevity ...
    }
  // On revalide et on redirige vers le nouveau système
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    } 
}
/**
 * ACTION MANQUANTE : Sauvegarde la position sur le Blueprint
 * Appelé lors du "Drag Stop" sur la vue Master Plan
 */
  // ... implementation hidden for brevity ...
      }
  }
}
// apps/studio/app/actions/upload.ts
// 1. Strict File Schema
  // ... implementation hidden for brevity ...
  // 2. Validate
  }
  // 3. Processing
    // Silent ignore if exists
  }
  // Resize and convert to WebP for optimization + security (strips metadata)
}
    // 1. RÉCUPÉRATION DU CONTEXTE TECHNIQUE
      }
    }
    // 2. APPEL GROQ EN MODE STREAM
    // 3. CRÉATION DU FLUX DE RÉPONSE (ReadableStream)
        }
    // Log d'audit (sans attendre la fin pour ne pas bloquer le stream)
  }
}
    // 1. CHARGEMENT DES DONNÉES (Bibliothèque + Projet)
    // On récupère tout ce qui manque au moteur Python
    // 2. FORMATAGE DE LA BIBLIOTHÈQUE (Format attendu par Python)
    };
    // 3. CALCUL DES SETTINGS PROJET
    // On construit l'objet profiles attendu par le solveur
        // Conversion des champs plats de la DB en structure profiles
            }
        };
    }
    // 4. CONSTRUCTION DU PAYLOAD COMPLET
    };
    // 5. APPEL AU MOTEUR PYTHON
      // @ts-ignore
        // On essaie de lire l'erreur JSON renvoyée par FastAPI
    }
    // 6. STREAMING DE LA RÉPONSE VERS LE CLIENT
  }
}
// apps/studio/app/[locale]/layout.tsx
}
    }
                // ... implementation hidden for brevity ...
}
// apps/studio/app/[locale]/(admin)/admin/blog/page.tsx
  // 1. Vérification de sécurité
  }
  // 2. Récupération parallèle des Articles et des Tutoriels (Séries)
                  // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                                // MODIFIEZ CETTE LIGNE 👇
                                  // ... implementation hidden for brevity ...
                                  // ... implementation hidden for brevity ...
}
// apps/studio/app/[locale]/(admin)/admin/blog/[id]/page.tsx
  // 1. Résolution des paramètres (Next.js 15)
  // 2. Récupération parallèle : Post + Tags + Tutoriels
    // A. L'article courant
    // B. Tous les tags pour l'autocomplétion
    // C. Tous les tutoriels pour le sélecteur
  // 3. Gestion du cas "non trouvé"
  // 4. Extraction et dédoublonnage des tags existants
    )
  // 5. Filtrage des tutoriels pertinents (Même langue que l'article)
  // Si l'article n'a pas de langue définie (vieux posts), on affiche tout par précaution.
              // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
}
  // Récupération de tous les leads
}
  // 1. SÉCURITÉ : Vérification Serveur (Double check après middleware)
  }
  // 2. DATA FETCHING : Récupération des logs (Derniers 50)
  // On inclut les infos utilisateur pour savoir "Qui" a fait l'action
      }
    }
                  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // Parallel fetching for high performance
}
/**
 * Generic Stat Card with Trend
 */
  // ... implementation hidden for brevity ...
    };
}
                      // ... implementation hidden for brevity ...
}
}
// --- REUSABLE MODERN COMPONENTS ---
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    )
}
  // ... implementation hidden for brevity ...
    )
}
// apps/studio/app/[locale]/(marketing)/blog/page.tsx
  // 🚩 DÉCLARATION UNIQUE DE LA CLAUSE WHERE
  };
  }
  // 1. RÉCUPÉRATION DES TUTORIELS (SÉRIES)
      }
  // 2. RÉCUPÉRATION PARALLÈLE DES ARTICLES ET STATS
    // Grille principale paginée
    // Articles populaires
    // Données pour le nuage de tags
    // Compte total pour la pagination
}
// apps/studio/app/[locale]/(marketing)/blog/[slug]/page.tsx
// --- ICONS ---
// --- ACTIONS & LIBS ---
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// --- COMPONENTS ---
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// --- HELPER LOCAL ---
  // ... implementation hidden for brevity ...
}
// --- 1. GÉNÉRATION DES MÉTADONNÉES (SEO) ---
        // ... implementation hidden for brevity ...
  };
}
// --- 2. COMPOSANT PAGE PRINCIPAL ---
  // A. Récupération de l'article dans la langue courante
  // B. Logique i18n : Trouver le slug de la traduction
  // Construction de l'objet alternates pour le LanguageSwitcher
  // C. Incrémentation des vues (Fire & Forget)
  }
              // ... implementation hidden for brevity ...
}
}
                // ... implementation hidden for brevity ...
}
  }
  // Récupération des projets liés à l'utilisateur
}
  // 1. Résolution des paramètres (Pattern Next.js 15)
  // 2. Chargement du projet
  // 3. Détermination du système courant
  }
  // 4. Configuration métier
  // 5. Chargement initial des données (Graphe + Séquences)
  // loadGraph a déjà été optimisé dans notre étape précédente
  // Mapping des séquences (On s'assure d'avoir un tableau propre)
}
  // 1. Résolution des Promises (Next.js 15+)
  // 2. GESTION DU DOMAINE DYNAMIQUE
  // Validation : Si le domaine est absent ou invalide, on redirige vers le premier domaine du registre
    // On conserve les autres paramètres (view, projectId) lors de la redirection
  }
  // 3. CHARGEMENT DES DONNÉES SPÉCIFIQUES AU DOMAINE
                          // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
        // ... implementation hidden for brevity ...
}
// apps/studio/app/[locale]/project/[id]/page.tsx
  // 1. Extraction asynchrone des paramètres
  // 2. Récupération sécurisée du projet (findUnique pour gérer l'erreur nous-même)
  }
  // 3. Fetch topology
  // 4. Prepare Nodes (Systems)
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
    }
  // 5. Prepare Edges (Streams)
    // ... implementation hidden for brevity ...
      };
    }
}
}
                  // ... implementation hidden for brevity ...
}
  // LOGIQUE EXPORT (Format QuantumH2O)
    }
  };
  // LOGIQUE IMPORT (Format QuantumH2O corrigé)
    // ... implementation hidden for brevity ...
        }
      }
    };
  };
            // ... implementation hidden for brevity ...
            // ... implementation hidden for brevity ...
}
        }
    };
}
    }
  };
          // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // --- ÉTATS ---
    // ... implementation hidden for brevity ...
  // --- ÉTATS TUTORIELS & LANGUE ---
  // --- MÉTRIQUES ÉDITORIALES ---
  // --- LOGIQUE IMAGE ---
    // ... implementation hidden for brevity ...
    }
    }
  };
  // --- LOGIQUE TAGS ---
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
    }
  };
                // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                                )
                            }
                                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                            }
                          // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                                      // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// Helper to determine severity visual based on action name
  // ... implementation hidden for brevity ...
};
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
  };
                // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
}
    }
  };
          // ... implementation hidden for brevity ...
                        // ... implementation hidden for brevity ...
}
    // ... implementation hidden for brevity ...
    // On passe un objet vide en fallback, le registre gère le reste
    // ... implementation hidden for brevity ...
}
  // 1. Identification du domaine et de la configuration métier
  // Sécurité si le type de noeud n'existe pas dans le manifeste
  }
  // Extraction des propriétés (JSONB) et des résultats de calcul (Simulation)
        // ... implementation hidden for brevity ...
                   // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
            // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // 1. CONFIGURATION DU DOMAINE
  }
  // 2. RÉCUPÉRATION DES DONNÉES DU STORE
  // 3. LOGIQUE : SOMME IONIQUE (HEALTH BAR)
    // ... implementation hidden for brevity ...
  // 4. CHAMPS RÉSUMÉS & ACCESSOIRES
    // ... implementation hidden for brevity ...
    // Le cast est nécessaire car les types du manifest sont plus larges que 'any'
  // 5. ALERTES CRITIQUES
  // 6. LIAISONS SANS FIL (Wireless)
    // ... implementation hidden for brevity ...
    // Parcours toutes les propriétés pour trouver les IDs de connexion logiques
            }
        }
    }
  // 7. DONNÉES DE CONSIGNE (CIBLE)
  // Récupération de la nouvelle clé injectée par le solveur
        // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// --- COMPOSANT : ÉLÉMENT DE LISTE ORDONNABLE ---
  // ... implementation hidden for brevity ...
  };
  // Simulation results peut contenir n'importe quoi (Mass balance, AI metrics, etc.)
  // 1. Extraction générique des connexions logiques (Wireless)
    // ... implementation hidden for brevity ...
          };
        }
  // 2. Champs de résumé dynamiques
    // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
          */}
}
// --- COMPOSANT PRINCIPAL ---
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    // Le scope filtré peut être paramétré dans le manifeste futur, par défaut PROCESS
      };
      };
    }
    // ... implementation hidden for brevity ...
      }
    }
  };
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
};
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // Accès au store pour injecter les résultats de simulation
  // 1. GESTION DU DÉPLACEMENT (LOCAL)
  // 2. SAUVEGARDE DE LA POSITION (BASE DE DONNÉES)
    // ... implementation hidden for brevity ...
      }
    }
  // 3. SIMULATION GLOBALE
    // ... implementation hidden for brevity ...
            // Pour la simulation globale, Python renvoie response.data.results
    }
      }
        // --- SUCCÈS ---
        // A. Injecter les résultats dans le store pour le AnalysisReport
        // B. Mettre à jour les labels des liens sur le Blueprint (optionnel mais recommandé)
          // ... implementation hidden for brevity ...
                };
            }
      }
    }
  };
              // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
            // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
      // On injecte le domaine sélectionné dans le formData
        // Redirection vers l'éditeur du projet
      }
    }
  };
          // ... implementation hidden for brevity ...
  }
                          // ... implementation hidden for brevity ...
                                  // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
}
  // États pour l'édition en ligne (remplace le prompt)
  // i18n context
  // Récupération de la configuration du domaine pour obtenir son label traduit
  // --- ACTION : SUPPRESSION ---
    // ... implementation hidden for brevity ...
    }
  };
  // --- ACTION : SAUVEGARDER LE NOM ---
    // ... implementation hidden for brevity ...
    }
  };
  // --- ACTION : ANNULER LE RENOMMAGE ---
    // ... implementation hidden for brevity ...
  };
          // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
}
  // Le rôle est défini dans le manifeste (SOURCE ou DRAIN)
  // Ou fallback sur le type
  // Résultats de simulation (ex: Total collecté par ce réseau)
        // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
}
// --- HELPERS SIMULÉS (Pour R03) ---
/**
 * Simule la conversion du besoin en ion pur (g/h) vers une quantité de produit commercial (L/an).
 */
  // ... implementation hidden for brevity ...
  // Correction 2: Utiliser un strict '==' pour éviter les affectations incorrectes
  };
}
// ------------------------------------
  // ... implementation hidden for brevity ...
  // --- 1. DATA PIVOTING & AGGREGATION ---
    // ... implementation hidden for brevity ...
    // Correction 1: Vérification stricte des données (y compris global_kpis)
        // Préparation des données pour le tableau hydraulique
                    };
                }
            // ... implementation hidden for brevity ...
        };
          // --- NOUVELLE LIGNE DE DÉBOGAGE CRITIQUE (Étape D) ---
    // Assurez-vous que le KPI est en L/an pour la carte
    };
  // --- 2. EMPTY STATE ---
  }
  // --- COMPOSANT DÉTAILLÉ DE LA CARTE DE COMPOSITION (Nouveau style UX) ---
    // ... implementation hidden for brevity ...
  };
  // ---------------------------------------------------------------------------------
    // Correction 3: Utilisation de flex-col et min-h-0 sur le contenu principal
}
  // ... implementation hidden for brevity ...
    };
}
    }
  // On ne montre ce widget que pour les terminaux ou les cuves importantes
  // Pour les Tanks, on n'affiche pas le widget complet ici, car ils ont déjà des champs "dumpingNetworkId" dans le formulaire générique.
  // Ce widget est surtout utile pour les noeuds TERMINAUX (Source/Drain) qui doivent se connecter au Bus Projet.
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
    }
  };
                  // ... implementation hidden for brevity ...
}
}
  };
          // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
}
}
  // ... implementation hidden for brevity ...
  // Charger les items quand on ouvre le menu
    }
  // Trouver le nom de l'item sélectionné pour l'affichage du bouton
    // ... implementation hidden for brevity ...
      // Cas A : Utilisation dans une collection (on renvoie l'objet)
      // Cas B : Utilisation directe sur un noeud (ex: Modèle de Pompe)
    }
  };
          // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
}
  // Ici, on est côté client, on peut utiliser Zustand !
}
  // 🚩 CHANGEMENT : Accepte l'objet de données complètes
}
  // 1. Résolution dynamique via le Registre
  // 2. Gestion du cas 'NO DATA'
  }
  // 3. Gestion du cas 'NO CONFIG' (Fallback de sécurité)
  }
  // 4. Rendu du rapport spécifique (On passe les données)
  // Le composant enfant (ex: ProcessReport) est responsable de l'affichage
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // --- ÉTATS DE CHARGEMENT ---
  // --- ÉTATS UI ---
  // --- ACTIONS ---
  // Gestion de l'import Catalogue avec feedback de chargement
    // ... implementation hidden for brevity ...
  };
  // Gestion de l'import Chimie avec feedback de chargement
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
    }
      // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
      }
    }
  };
    // ... implementation hidden for brevity ...
    }
    }
  };
                // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
}
}
  // ... implementation hidden for brevity ...
  // À l'avenir, cette valeur viendra d'un hook useLocale()
  // Groupement des nœuds par catégorie traduite
    // ... implementation hidden for brevity ...
      // On traduit la catégorie avant de s'en servir comme clé de groupe
                        // ... implementation hidden for brevity ...
}
// FILE: apps/studio/components/layout/project-initializer.tsx
    // La logique existante pour éviter l'initialisation multiple
    // 1. Initialisation des IDs de base
    // --- NOUVELLE LOGIQUE D'HYDRATATION DES VALEURS PAR DÉFAUT ---
        // ... implementation hidden for brevity ...
        // Crée un objet des propriétés par défaut en parcourant tous les champs
          }
        // Fusion: Valeur par Défaut < Valeur Persistée (DB)
        };
        };
    }
}
}
  // ... implementation hidden for brevity ...
  // 1. DÉTERMINATION DES CHAMPS VIA LE MANIFESTE
  // Le composant sait quelles options il doit afficher
  // Combinaison des settings standards (Heures/Jours) et des settings spécifiques au domaine
    // ... implementation hidden for brevity ...
    // Schéma de base Next.js (Heures/Jours/Semaines)
    // 🚩 Ajout des champs spécifiques au domaine (s'ils existent)
  // 2. LOGIQUE DE CHARGEMENT ET MISE À JOUR DE L'ÉTAT LOCAL (Simulation)
  // En production, tu ferais un fetch pour récupérer les valeurs actuelles du projet.
  // Pour l'instant, on initialise avec les valeurs par défaut du manifeste.
    // Simuler le chargement des données actuelles du projet (qui pourraient être null)
    // On merge les valeurs DB (null) avec les valeurs par défaut du manifeste
    // NOTE: Ici, tu ferais un 'getProjectSettingsAction(projectId)'
  // 3. LOGIQUE DE SAUVEGARDE
    // ... implementation hidden for brevity ...
    // Construction du payload basé sur les champs actuels (y compris les nouveaux)
        }
    }
  };
    // ... implementation hidden for brevity ...
  };
                                  // ... implementation hidden for brevity ...
                                          // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// --- IMPORT DU REGISTRE ---
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
  }
  }
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
    }
    }
    }
          // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
        };
          // ... implementation hidden for brevity ...
        };
          // ... implementation hidden for brevity ...
    }
    }
  };
                      // ... implementation hidden for brevity ...
          /* FALLBACK SI PAS DE GROUPES (ex: Edges) */
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // Synchronisation : Remplit le formulaire quand on change de gamme
    }
    // ... implementation hidden for brevity ...
    }
  };
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
  };
                  // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                                      // ... implementation hidden for brevity ...
                              // ... implementation hidden for brevity ...
                                }
          /* EMPTY STATE */
}
  // Supprimer summaryData ici pour utiliser le store (meilleure réactivité)
}
  // 1. Récupération des données du Store (Zustand)
  // 2. Résolution du Domaine : Prop > Config Active > Défaut (Le code d'origine est trop complexe)
  // On utilise la prop `domain` passée par le Workspace, qui vient du Project.
  // 3. Affichage Conditionnel
  // On délègue tout le travail de vérification et de rendu au GenericReportViewer
}
// FILE: apps/studio/components/layout/system-selector.tsx
}
    // ... implementation hidden for brevity ...
        // Par défaut on crée en PRODUCTION, on pourra améliorer l'UX plus tard
      }
    }
  };
}
  // SÉCURITÉ : Fallback si la vue n'est pas supportée par le domaine
    }
    // ... implementation hidden for brevity ...
}
  /**
   * Dictionnaire optionnel de liens alternatifs.
   * Ex: { en: '/en/blog/my-translated-slug', fr: '/fr/blog/mon-slug-original' }
   */
}
  // ... implementation hidden for brevity ...
  // Sécurisation du typage de la locale
  // Fermer le menu si on clique ailleurs
      // ... implementation hidden for brevity ...
      }
    };
    // ... implementation hidden for brevity ...
    // 1. Priorité : Si une URL spécifique est fournie pour cette langue (ex: article de blog traduit)
    }
    // 2. Fallback : Remplacement simple du segment de locale dans l'URL actuelle
    // Ex: /fr/dashboard -> /en/dashboard
    // On s'assure de remplacer le bon segment (index 1 car l'URL commence par /)
    // Si l'URL ne contient pas la locale (ex: racine), on la préfixe.
    }
  };
          // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // Vérification du rôle admin via la session NextAuth
  // Définition des items avec labels multilingues
    }
          // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
             // ... implementation hidden for brevity ...
             // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
}
  }
};
  // ... implementation hidden for brevity ...
  // 1. DÉPENDANCES DU DOMAINE
  // 2. ÉTATS ET STORE
  // 3. CONTEXTES DE NAVIGATION
  // --- ACTIONS ---
    // ... implementation hidden for brevity ...
    }
    // Nettoyage des nœuds pour la sauvegarde (Prisma n'a besoin que des données essentielles)
      // ... implementation hidden for brevity ...
      // Appel à la Server Action optimisée (Bulk Write)
        // Affiche l'erreur renvoyée par le serveur (ex: "IDOR Protection")
      }
    }
  };
    // ... implementation hidden for brevity ...
        // Envoie le signal d'annulation à la requête fetch en cours
    }
  };
    // ... implementation hidden for brevity ...
    }
        // Nettoyage des noeuds: Exclure les résultats de la simulation précédente
          // ... implementation hidden for brevity ...
            // Copie des propriétés SANS la clé 'simulationResults'
            };
        };
        // Appel à l'API Route Next.js (Proxy Sécurisé)
        }
        // Boucle de lecture du flux NDJSON
                        // 🚩 Injection des résultats pour le SmartNode
                        // Si le solveur Python renvoie une erreur métier
                    }
            }
        }
        // 🚩 Une fois le stream terminé, on persiste le résultat final en base
            // NOTE: Ceci sera remplacé par la vraie Server Action de persistance
        }
        // 🚩 TRÈS IMPORTANT : Réinitialisation propre
    }
  };
              // Rendu pour la vue Blueprint (Plan + Bilan global)
                    // ... implementation hidden for brevity ...
                    // ... implementation hidden for brevity ...
                  // Séparateur juste avant le Bilan pour le distinguer des vues d'édition
                          // ... implementation hidden for brevity ...
                    // ... implementation hidden for brevity ...
}
}
  // ... implementation hidden for brevity ...
  // --- IMPORT DES DONNÉES (ITEMS) ---
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
          }
        }
      };
  };
  // --- IMPORT DE LA CONFIGURATION (SCHEMAS) ---
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
          }
        }
      };
  };
}
}
  // Context i18n
  // --- ÉTATS ---
  // --- FILTRAGE ---
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
  // --- HANDLERS ---
    // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
    }
    }
  };
    // ... implementation hidden for brevity ...
  };
    // ... implementation hidden for brevity ...
  };
                                // ... implementation hidden for brevity ...
                            // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
  // --- IMPORTATION ---
        }
      }
    };
  };
  // --- EXPORTATION AVEC FILTRES ---
    // ... implementation hidden for brevity ...
      // Définition des catégories par famille
      }
      // Appel serveur avec les filtres
      // Génération du nom de fichier
      // Téléchargement
    }
  };
                          // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
}
        }
    };
  };
}
// apps/studio/components/marketing/blog-search-grid.tsx
  // --- LOGIQUE UNIQUE DE MISE À JOUR DE L'URL ---
    // ... implementation hidden for brevity ...
    // On récupère les paramètres actuels pour les préserver
      }
    // 🚩 RÉPARATION : On ne force "page=1" QUE si on n'est pas en train de paginer.
    // Si newParams contient 'page', c'est qu'on a cliqué sur Suivant/Précédent.
    }
  };
  // Nuage de tags
    // ... implementation hidden for brevity ...
      }
              // ... implementation hidden for brevity ...
                          // ... implementation hidden for brevity ...
                      // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
}
  };
  }
          // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
}
// apps/studio/components/marketing/share-button.tsx
  // On limite le résumé pour ne pas dépasser les quotas de caractères (X/Twitter)
    // ... implementation hidden for brevity ...
  };
      // LinkedIn ignore le texte forcé, il utilise UNIQUEMENT les balises OG de la page
      // Twitter prend le texte (Titre + Résumé) + l'URL
      // Email permet un formatage complet
    }
          // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
                // ... implementation hidden for brevity ...
}
  };
}
  // ... implementation hidden for brevity ...
            // Assuming posts before current are "read"
                    // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
}
}
};
};
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
  };
                  // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
};
  };
}
  // ... implementation hidden for brevity ...
  // Auto-scroll au bas du chat
    // ... implementation hidden for brevity ...
  };
  // Nettoyage lors de la fermeture
    }
    // ... implementation hidden for brevity ...
    // Initialisation de l'AbortController pour cette requête
    // Mise à jour locale immédiate (User + Placeholder AI)
        // Mise à jour réactive du dernier message (IA)
          }
      }
    }
  };
              // ... implementation hidden for brevity ...
                  // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
}
}
  // @ts-ignore - On récupère l'icône dynamiquement par son nom
  }
}
  };
}
  // ... implementation hidden for brevity ...
    // ... implementation hidden for brevity ...
    }
    }
  };
              // ... implementation hidden for brevity ...
              // ... implementation hidden for brevity ...
}
          // ... vos composants h1, h2, p, etc. inchangés ...
          // --- LE CORRECTIF EST ICI ---
          // On force la balise <pre> parente à être transparente et sans marge
          // pour qu'elle n'interfère pas avec notre fenêtre de code personnalisée.
              // Le 'not-prose' ici protège le contenu, mais le 'pre' ci-dessus protège le conteneur
          }
}
}
  // 1. Filtrer les noeuds disponibles selon les critères du manifeste
    // ... implementation hidden for brevity ...
      // On ne peut pas se connecter à soi-même (logique)
      // Note: On pourrait passer l'ID du noeud courant pour filtrer plus précisément
  // 2. Trouver le label du noeud actuellement sélectionné
    // ... implementation hidden for brevity ...
          // ... implementation hidden for brevity ...
}
}
    // ... implementation hidden for brevity ...
        // Calcul depuis le bord droit
        // Calcul depuis le bord gauche (pour la palette)
      }
      }
    }
    };
          // ... implementation hidden for brevity ...
}
}
}
  // ... implementation hidden for brevity ...
}
// Helper pour fusionner les classes Tailwind
}
      // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
      // ... implementation hidden for brevity ...
  // ... implementation hidden for brevity ...
// apps/studio/lib/component-registry.tsx
// Import des composants spécifiques au domaine
// Définition des types de slots disponibles pour l'injection
};
// --- LE REGISTRE ---
  // DOMAINE : SURFACE TREATMENT (Mise à jour Chapitre 6)
      // Les équipements principaux utilisent le SmartNode spécialisé (Health Bars, etc.)
      // Les terminaux utilisent le visuel spécifique "Pilule"
      // Géré dynamiquement par le PropertiesPanel générique via le Manifeste
      // On utilise le WaterPropertiesWidget pour tout ce qui touche à l'eau et aux flux
      // Ce widget gère à la fois le Bus Projet (Drain/Source) et les Appoints/Surverses (Baths/Rinses)
      // Affiche le gestionnaire de réseaux local quand rien n'est sélectionné
      // Le rapport complet de bilan de masse et ionique
    }
  }
};
// --- HELPERS D'ACCÈS ---
/**
 * Retourne le composant visuel pour le noeud sur le canvas
 */
  // ... implementation hidden for brevity ...
}
/**
 * Retourne un formulaire spécifique si défini (prioritaire sur le générique)
 */
  // ... implementation hidden for brevity ...
}
/**
 * Retourne un widget additionnel à afficher en haut du panneau de propriétés
 */
  // ... implementation hidden for brevity ...
}
/**
 * Retourne un composant pour l'affichage latéral hors sélection (ex: légende, global config)
 */
  // ... implementation hidden for brevity ...
}
/**
 * Retourne le composant de rapport final pour le mode "Bilan"
 */
  // ... implementation hidden for brevity ...
}
/**
 * Helper pour React Flow (génère l'objet nodeTypes complet dynamiquement)
 */
  // ... implementation hidden for brevity ...
}
// --- TYPES DE BASE ---
// Support pour les labels traduisibles : soit une chaîne simple, soit un objet par langue
// Scopes standards de l'ingénierie (ISA-S88 / P&ID)
// PROCESS: Équipement principal de la ligne (ex: Cuve)
// UTILITY: Réseau support (ex: Eau, Drain, Air)
/**
 * MODES DE VUE (Layouts)
 * GRAPH: Éditeur de nœuds libre (type React Flow)
 * SYNOPTIC: Vue verticale/linéaire ordonnée (Process Flow Diagram)
 * SEQUENCES: Gestionnaire de gammes opératoires / séquencement
 * SUMMARY: Bilan technique et rapport final
 */
// Définition pour les requêtes vers la bibliothèque (Filtres)
  // ... implementation hidden for brevity ...
};
// --- DÉFINITION DES CHAMPS (Méta-Modèle) ---
  // 1. Champ Numérique & Physique (Avec Unités et Profils Temporels)
    }
  // 2. Champs Texte Simple
    }
  // 3. Champ Booléen (Switch)
    }
  // 4. Liste Déroulante (Choix Statiques)
    }
  // 5. Sélecteur de Bibliothèque (Filtres Contextuels)
    }
  // 6. Sélecteur de Nœud (Liaisons Wireless)
    }
  // 7. Collection / Tableau (Support Natif du Nesting / Accessoires)
        // ... implementation hidden for brevity ...
    };
// --- NOUVEAU : STRUCTURE DE GROUPEMENT (TABS) ---
/**
 * Représente un groupe de champs qui sera affiché dans un onglet (Tab)
 */
  // ... implementation hidden for brevity ...
};
// --- SCHÉMAS D'OBJETS ---
// Définition d'un Noeud (Équipement / Asset)
  // ... implementation hidden for brevity ...
};
// Définition d'une Arête (Tuyauterie / Câblage)
  // ... implementation hidden for brevity ...
};
// Définition d'une Bibliothèque
  // ... implementation hidden for brevity ...
};
// --- CONFIGURATION UI (LAYOUTS) ---
/**
 * Définit le comportement de l'interface pour ce domaine particulier
 */
  // ... implementation hidden for brevity ...
};
// --- MANIFESTE GLOBAL ---
  // ... implementation hidden for brevity ...
};
// apps/studio/lib/i18n.ts
};
/**
 * Traduit un label provenant du Manifeste (type I18nLabel)
 * Gère les chaînes simples ou les objets { fr: "", en: "" }
 */
  // ... implementation hidden for brevity ...
  // Si c'est déjà une string, on la renvoie
  // Si c'est un objet de traduction
}
/**
 * Récupère le dictionnaire de traduction statique
 */
  // ... implementation hidden for brevity ...
}
// apps/studio/lib/registry.ts
// import { ENERGY_CONFIG } from './domains/energy';
// 1. REGISTRE CENTRAL
// C'est le seul endroit où les domaines sont "hardcodés" par importation.
  // ENERGY: ENERGY_CONFIG
};
// 2. EXPORTS DYNAMIQUES
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
// 3. RÉCUPÉRATION DE CONFIGURATION (STRICTE)
  // ... implementation hidden for brevity ...
  // A. Si un ID est fourni, on vérifie son existence
    // Si l'ID est invalide, on ne devine pas. On crashe pour alerter le dev.
  }
  // B. Fallback sur la variable d'environnement (Configuration Serveur explicite)
  }
  // C. Si aucune config n'est trouvée, on ARRÊTE TOUT.
  // Pas de "SURFACE_TREATMENT" par défaut.
}
// apps/studio/lib/domains/surface-treatment.ts
  // ... implementation hidden for brevity ...
  // 🚩 CONFIGURATION UI PILOTÉE PAR LE MANIFESTE
  // On définit ici les outils pertinents pour l'ingénieur procédé.
    // 🚩 DÉFINITION DES PARAMÈTRES DE GAMME
    // --- BAIN DE TRAITEMENT (PROCESS_BATH) ---
            }
        }
    // --- CUVE DE RINÇAGE (RINSE_TANK) ---
        }
    // --- UTILITIES (SOURCE) ---
        }
    // --- UTILITIES (DRAIN) ---
        }
    }
        }
    }
  }
};
  }
}
  }
}
}
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
  // ... implementation hidden for brevity ...
}
/**
 * Synchronise les flux hydrauliques pour éviter la double saisie.
 */
  // RÈGLE 1 : Si A déborde dans B, alors B sait qu'il reçoit de A
  }
  // RÈGLE 2 : Si B est alimenté par A, alors A déborde dans B
  }
}
/**
 * Nettoie les références quand un nœud est supprimé.
 */
      }
}
        }
    };
      // Branchement logique de domaine (Surface Treatment)
      }
        }
      }
    // Logique d'auto-layout à importer d'un fichier lib séparé pour la propreté
  }
    }
  // Injection atomique des résultats de simulation
        // ... implementation hidden for brevity ...
          };
        }
      // ... implementation hidden for brevity ...
  }
  }
  }
}
    // ... implementation hidden for brevity ...
  }
}
// Fonction pour instancier le client avec l'adaptateur
  // 1. On crée un Pool de connexion PostgreSQL classique
  // 2. On crée l'adaptateur Prisma qui utilise ce pool
  // 3. On passe l'adaptateur au client
};
    }
  }
}
}
}
// ==========================================
// 1. AUTHENTIFICATION & UTILISATEURS
// ==========================================
}
  // Relations requises pour Auth.js
}
}
}
}
// ==========================================
// 2. MARKETING & KNOWLEDGE
// ==========================================
}
}
// ==========================================
// 3. HIERARCHIE PROJET
// ==========================================
}
}
  // État calculé (Snapshot de la dernière simulation)
  // Relations aux Noeuds (Qui écrit ? Qui lit ?)
}
// ==========================================
// 4. LE GRAPHE (CORE)
// ==========================================
}
}
}
// ==========================================
// 5. LOGIQUE SEQUENTIELLE (GAMMES)
// ==========================================
}
}
// ==========================================
// 6. BIBLIOTHÈQUE GÉNÉRIQUE
// ==========================================
}
// ==========================================
// 7. BIBLIOTHÈQUE SPÉCIFIQUE AU DOMAINE
// ==========================================
  // --- RÉCURSIVITÉ ---
  // --- CORRECTION ICI : Relation inverse pour NodeComponent ---
  // --- TRAÇABILITÉ ---
}
}
}
  // Cette ligne pointe vers LibraryItem
}
  // La définition des champs (Array of FieldDefinition)
  // Ex: [{ "id": "power", "label": "Puissance", "type": "number", "unit": "kW" }]
}
// --- COLLABORATION ---
}
// --- AUDIT & ANALYTICS ---
  // Qui ?
  // Quoi ?
  // Détails techniques (Parfait pour l'IA future)
  // Ex: { "path": "/admin/users", "method": "POST", "error": "Invalid CSRF" }
}
  // Unique slug PER language (e.g. /fr/tuto-1 and /en/tutorial-1)
}
# `@turbo/eslint-config`
/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
    // Default ignores of eslint-config-next:
      // React scope no longer necessary with new JSX transform.
  }
}
/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
      // React scope no longer necessary with new JSX transform.
  }
}
  }
}
  }
}
  }
}
  }
}
}
}
};
        // ... implementation hidden for brevity ...
}
}
# Beyond Hard-Coded Software
**Quantum Core** represents a paradigm shift: the **Software Factory**.
### The Core Principles
# How to Store Any Physical System
### The JSONB Revolution
*   **Nodes**: Representing equipment (Process), inputs (Source), or outputs (Sink).
*   **Edges**: Representing the flow (Physical or Logical) between nodes.
*   **Properties**: A JSONB blob that holds the domain-specific data.
### Topological Roles
*   **SOURCE**: Nodes with only outgoing flows (e.g., Water Mains, Power Grid).
*   **PROCESS**: Nodes that transform or store mass/energy (e.g., Reaction Tanks, Batteries).
*   **SINK**: Nodes that accumulate final outputs (e.g., Waste Treatment, Earth).
# Orchestration meets Calculation
### Left Brain: Next.js (The Orchestrator)
*   **Auth & Security**: Managing users and project isolation.
*   **UX/UI**: The ReactFlow canvas and dynamic property panels.
*   **Persistence**: Communicating with PostgreSQL via Prisma 7.
### Right Brain: FastAPI (The Scientist)
### The Synapse: Secure S2S Communication
# Beyond Static Pipes
### Physical vs. Logical Edges
### Mathematical Implementation of Drag-out
# One Core, Infinite Verticals
### How to Fork Quantum Core
### The Role of Generative AI
# The Engineering Specification: Quantum Core Physics Engine
## 1. The Temporal Normalization (The "24/7 Paradox")
**The Logic:**
**The Code Implementation:**
# Calculate how much we must over-feed during production hours 
# to compensate for the evaporation that happened while the factory was closed.
# time_ratio is typically 4.2 (168/40)
*   **Verification:** If `time_ratio` is ignored, the solver would underestimate the required water flow by 75%, leading to dry tanks in real life.
## 2. Logistic Topology (Transfer by Transporter)
**The Logic:**
**The Code Implementation:**
# Constructing the Drag-out Matrix (N x N)
    # Hourly flow caused by parts movement
            # We add to the matrix (multiple sequences can pass through the same tanks)
## 3. Chemical Flattening (Recursive BOM)
**The Code Implementation:**
# Breaking down: Commercial Product -> Reagents -> Ions
        # Direct ion (e.g., H+)
        # Intermediate reagent (e.g., NaOH contains Na+)
## 4. Hydraulic Stabilization (Mass Balance)
**The Code Implementation:**
# Iterative loop to stabilize the cascade flows
            # Sum of all incoming water (Makeup + Overflows from other tanks)
            # Subtract evaporation loss
            # Map the output to the target tank (Gravity pipe)
## 5. The Core Matrix: Solving $Ax = b$
**The Matrix Rules:**
**The Code Implementation:**
    # Total liquid leaving the tank (L/h)
        # Mass Balance: [Sum of Outflows] * Ci - [Sum of Inflows * Cj] = 0
            # If tank J flows into tank I, it brings its concentration Cj
# The Final Calculation
## 6. Verification & Anti-Corruption Safeguards
### A. The Singular Matrix Guard
### B. The Zero-Gravity Check
### C. Transparency via NDJSON
## Conclusion
# (Tuto 1/10) Environment Setup & Security Configuration
### 1.1 Prerequisites
*   **Node.js:** v18.17+ (LTS recommended)
*   **pnpm:** v9.x (Required for Turborepo workspaces)
*   **Python:** v3.10+ (For local engine execution)
*   **Docker & Docker Compose:** v2.20+
### 1.2 The "Internal Secret" Protocol
**⚠️ Security Critical:**
#### Generating a Strong Secret
*Save this output. It will be referred to as `[YOUR_GENERATED_SECRET]` below.*
### 1.3 Configuring the Engine (Python)
**1. Create/Update Environment File**
# The port the FastAPI server listens on
# The Shared Secret (Must match the Studio's configuration)
**2. Patching `docker-compose.yml`**
*File: `docker-compose.yml`*
      # CHANGED: Now uses variable interpolation
### 1.4 Configuring the Studio (Next.js)
**Create/Update `apps/studio/.env.local`:**
# --- Database Connection ---
# Ensure this matches your PostgreSQL credentials
# --- Authentication (NextAuth.js) ---
# Generate a new secret: openssl rand -base64 32
# The public URL of the application
# Email Provider (SMTP) for Magic Links
# --- Engine Bridge ---
# The URL where Next.js can find the Python Container
# Inside Docker network use: http://engine:8000
# For local dev use: http://127.0.0.1:8000
# MUST match the key defined in Section 1.3
# --- Feature Flags ---
### 1.5 Verification Steps
    # Create an .env file in root with your secrets for Docker
    *Expected Result:* `{"detail":"Forbidden: Invalid API Secret"}`
    *Expected Result:* `400 Bad Request` (This is good! It means auth passed, but the payload was invalid, which confirms the Engine is reachable and secure).
# (Tuto 2/10) Database Management & Migrations
### 2.1 The Data Architecture
*   **Schema Definition:** `packages/database/prisma/schema.prisma`
    *   This file defines your tables (Models) and relationships.
*   **Database Client:** `packages/database/index.ts`
    *   This exports the `db` object used throughout the application.
*   **Connection String:** Defined in your `.env` file as `DATABASE_URL`.
**Pedagogical Note:** When you change the `schema.prisma` file, you are changing the *blueprint*. You must then "apply" this blueprint to the actual PostgreSQL container and "generate" the TypeScript types so the code knows about the changes.
### 2.2 Starting the Database Container
    *   **Host:** `localhost`
    *   **Port:** `5434`
    *   **User:** `quantum`
    *   **Password:** `password`
    *   **Database:** `quantum_core`
### 2.3 Synchronizing the Schema (Dev vs. Prod)
#### A. The Development Method (`db:push`)
**Command (from root):**
*   **What it does:** Updates the DB structure immediately.
*   **⚠️ Risk:** If you renamed a column, it might delete the old one and create a new one, losing data. **Do not use this on a production database with real data.**
#### B. The Production Method (Migrations)
**1. Create a Migration (Development):**
# Go to the database package
**2. Apply Migrations (Production/CI):**
### 2.4 Generating the Client (Type Safety)
**Command (from root):**
*Tip: Turborepo is configured to run this automatically when you run `pnpm build`, but during development, you might need to trigger it manually after a schema edit.*
### 2.5 Seeding Initial Data
#### 1. Creating the First Admin
    *   **Email:** `admin@quantum.corp`
    *   **Role:** `ADMIN` (Crucial: Select ADMIN from the dropdown enum)
    *   **Name:** `System Admin`
#### 2. Hydrating the Libraries (Catalog & Chemistry)
    *   **Icon 1 (Database):** Imports the Hardware Catalog (Pumps, Tanks, Sensors).
    *   **Icon 2 (Flask):** Imports the Chemical Library (Ions, Reagents for the H2O domain).
### 2.6 Troubleshooting Common Issues
**Error: `P1001: Can't reach database server at localhost:5434`**
*   **Cause:** The Docker container is not running.
*   **Fix:** Run `docker-compose ps`. If `postgres` is not listed, run `docker-compose up -d postgres`.
**Error: `The table public.User does not exist in the current database`**
*   **Cause:** You connected to the DB, but the tables haven't been created yet.
*   **Fix:** Run `pnpm db:push` to create the table structure.
**Error: `Client is not compatible with the schema`**
*   **Cause:** You updated `schema.prisma` but didn't update the generated files.
*   **Fix:** Run `pnpm db:generate`.
# (Tuto 3/10) The Python Engine Integration
### 3.1 Architecture: The Stateless Calculator
*   It does **not** connect to the database.
*   It does **not** know who the user is.
*   It does **not** remember previous calculations.
**How it works:**
**Pedagogical Note:** This design makes the engine very robust. You can restart the Python container at any time without losing any user data. If the engine crashes, it only affects the specific calculation running at that millisecond.
### 3.2 The Communication Bridge
**The Flow:**
### 3.3 Monitoring the Brain
#### A. Docker Logs (The Raw Feed)
**Example Output:**
}
#### B. The Simulation Console (The UI Feed)
*   In the Studio UI, a "Console" drawer opens at the bottom right.
*   This displays the real-time progress steps (e.g., "Building Matrix...", "Solving Iteration 4...").
*   This is useful for debugging slow simulations without looking at server logs.
### 3.4 Common Maintenance Tasks
#### Updating the Solver Logic
#### Scaling
*   **Docker Swarm / Kubernetes:** You can deploy multiple replicas of the `engine` container.
*   **Load Balancing:** Since the engine is stateless, a simple Round-Robin load balancer can distribute requests across 5 or 10 engine instances seamlessly.
### 3.5 Troubleshooting Guide
**Scenario 1: `FetchError: ECONNREFUSED`**
*   **Symptom:** The Studio says "Connection Error" immediately upon clicking Simulate.
*   **Diagnosis:** Next.js cannot find the Python container.
*   **Fix:** Check `ENGINE_URL` in `.env`. Inside Docker, it should be `http://engine:8000`. Locally, it might be `http://127.0.0.1:8000`.
**Scenario 2: `403 Forbidden`**
*   **Symptom:** Logs show "Forbidden: Invalid API Secret".
*   **Diagnosis:** The `INTERNAL_API_SECRET` in Next.js does not match the one in Python.
*   **Fix:** Ensure both containers share the exact same string in their environment variables.
**Scenario 3: "Singular Matrix" / "LinAlgError"**
*   **Symptom:** The user sees a red error "Erreur de convergence".
*   **Diagnosis:** This is a **Physics Error**, not a bug in the code. It means the user designed a system that is mathematically impossible (e.g., a closed loop of pipes with no outlet, or trying to calculate concentration in an empty tank).
*   **Fix:** Instruct the user to check their graph connections (Arrows must connect properly).
# (Tuto 4/10) Monitoring & Observability
### 4.1 The Admin Command Center
**Access:** `https://your-domain.com/admin` (or `/admin/stats`)
#### Key Sections:
*   **KPIs (Command Center):** Real-time metrics on user acquisition (Leads), active projects, and conversion rates.
*   **Observability (Logs):** A searchable interface for the Audit Trail.
*   **Content (Expertise):** Management of the technical blog/knowledge base.
### 4.2 The Audit Trail System
#### How it works
**Recorded Events include:**
*   `SIMULATION_RUN`: Every time a user triggers a calculation (useful to track compute costs).
*   `AI_CHAT_STREAM`: usage of the LLM assistant (token usage proxy).
*   `FEEDBACK_SUBMITTED`: Direct reports from users.
*   `ERROR`: Critical application failures caught by boundary handlers.
#### Viewing Logs
### 4.3 Maintenance: Log Rotation
**Manual Cleanup:**
*Pedagogical Note for DevOps:* In a high-traffic production environment, you should automate this. You can set up a cron job to call this action or run a SQL query directly:
### 4.4 System Health Checks
#### 1. Check Container Status
*   **Healthy:** `Up` status for `studio`, `engine`, and `postgres`.
*   **Unhealthy:** `Exit 1` or `Restarting`.
#### 2. Check Database Connectivity
*   Go to the **Admin Hub** main page (`/admin`).
*   Look at the Footer. There is a **"Base de données: Connectée"** indicator.
*   *How it works:* The page attempts a lightweight DB query (`db.user.count()`) on render. If it fails, the page will error out or show a disconnected state.
#### 3. Check Python Engine Link
*   There is no persistent connection to check (stateless).
*   **Test:** Create a "Hello World" project, add one Source and one Sink, and click "Simulate".
*   **Success:** The "Console" drawer opens and shows progress.
*   **Failure:** A Red Toast notification appears. Check `docker logs qcore_engine` immediately.
### 4.5 Backup Strategy
**Backup Command:**
**Restore Command:**
# The Domain Manifest Protocol
### 1.1 The Architecture of a "Domain"
**Location:** `apps/studio/lib/domains/`
### 1.2 Anatomy of a Manifest
  // 1. LIBRARIES: What resources can be used?
    }
  // 2. NODE TYPES: What machines exist?
    }
  // 3. EDGE TYPES: How do they connect?
    }
  }
};
### 1.3 Defining Assets (Nodes) & Fields
#### A. Physical Quantities (`quantity`)
}
#### B. Selectors (`select`)
}
#### C. Wireless Connections (`node-selector`)
}
#### D. Nested Collections (`collection`)
}
### 1.4 Scopes: Process vs. Utility
    *   *Behavior:* These nodes are arranged linearly from left to right in the Synoptic view.
    *   *Examples:* Boiler, Turbine, Reaction Tank.
    *   *Behavior:* These nodes are placed at the top (Sources) or bottom (Sinks) of the canvas to avoid cluttering the main flow.
    *   *Examples:* Water Source, Electrical Grid, Drain.
    *   *Examples:* Storage Tanks, Buildings.
### 1.5 Registration: Activating the Domain
**File:** `apps/studio/lib/registry.ts`
};
### 1.6 Verification
# Visual Customization & Component Registry
### 2.1 The "SmartNode": Zero-Config UI
### 2.2 The Component Registry
// apps/studio/lib/component-registry.tsx
// Import your custom report if you have one
// import { EnergyReport } from '@/components/domains/energy/energy-report';
  // Existing domain...
  // YOUR NEW DOMAIN
      // Map your logical types to React Components
      // You can reuse specific components from other domains if they fit
      // Standard panel when clicking on empty space
      // The component rendered in "Summary" view
      // SUMMARY: EnergyReport 
    }
  }
};
### 2.3 Creating a Custom Node (Advanced)
**Step 1: Create the Component**
  // Access simulation results via data.properties
}
**Step 2: Register it**
// ... inside REGISTRY.ENERGY.nodes
### 2.4 Customizing the Properties Panel
**The Widget Pattern:**
    }
### 2.5 Creating the Domain Report
**Step 1: Create the Report Component**
}
**Step 2: Register the Report**
}
### 2.6 Verification
# The Solver Interface & Physics Logic
### 3.1 Directory Structure
    *   `__init__.py`: (Can be empty)
    *   `solver.py`: This is where your code lives.
### 3.2 The Solver Contract
**The Signature:**
### 3.3 Implementing the Logic
**File:** `apps/engine/domains/energy/solver.py`
    # 1. NOTIFY UI: Calculation started
    # 2. PREPARE DATA STRUCTURES
    }
    # 3. THE PHYSICS LOOP (Simplified)
    # In a real scenario, you would build a Matrix (Ax=B) here using NumPy.
        # LOGIC FOR BOILERS
            # Inputs from UI fields
            # Physics: Fuel In = Power Out / Efficiency
            # Store results
        # LOGIC FOR TURBINES
            # Mock logic: output depends on upstream connection
            # (In reality, traverse 'edges' to find the connected Boiler)
        # Map results back to the Node ID
    # 4. FINALIZE GLOBAL KPIS
    # 5. SEND FINAL PAYLOAD
    # The type 'result' tells the UI to update the store
### 3.4 Registering the Solver
**File:** `apps/engine/main.py`
        # ... existing logic ...
                )
                # Error handling...
### 3.5 Mapping Results to UI
**In Python (`solver.py`):**
**In React (`SmartNode.tsx` or `TurbineNode.tsx`):**
// Inside your custom component
### 3.6 Best Practices: Using NumPy
**The Matrix Pattern:**
*Refer to `apps/engine/domains/surface_treatment/solver.py` for a full implementation of the Matrix Pattern.*
# Data Model & Topology Architecture
### 1.1 The Entity Hierarchy
#### Level 1: The Project (Global Scope)
*   **Time Basis:** It holds global settings like `hoursPerDay`, `weeksPerYear`. All mass balance calculations are normalized to this time basis.
*   **The Bus:** It owns `ProjectStream` objects (see Section 1.3), which act as the "Inter-System Bus".
#### Level 2: The System (Local Canvas)
*   **Isolation:** Each System has its own canvas, nodes, and edges.
*   **Type:** Can be `PRODUCTION` (Linear logic) or `TREATMENT` (Cyclical logic).
#### Level 3: Nodes & Edges (The Graph)
*   **`Node`:** An equipment asset. It contains a `properties` JSON blob which stores all domain-specific inputs defined in the Manifest.
*   **`Edge`:** A physical connection drawn by the user. By default, this represents a pipe or cable (`category: "PHYSICAL"`).
### 1.2 The "Wireless" Connection Logic
**The Solution:**
#### How it works in the Code:
// Conceptual logic in apps/studio/app/actions/simulation.ts
    // 1. Look up schema
      // 2. Detect "Wireless" fields
        // 3. Create ephemeral edge for the solver
        }
      }
}
**Architectural Impact:** The Python Solver receives a fully connected graph (Physical + Virtual) without the UI needing to render messy wires.
### 1.3 System of Systems (The Data Bus)
*   **`ProjectStream`:** A shared data object at the Project level. It acts as a Pub/Sub topic.
*   **Publishing:** A Node (e.g., a "Drain" in System A) connects to a Stream via `outputStreamId`.
*   **Subscribing:** A Node (e.g., a "Source" in System B) connects to the same Stream via `inputStreamId`.
**The Solving Sequence (`orchestrator.py`):**
### 1.4 Data Persistence Strategy
*   **Pros:** Impossible to have "Orphaned Edges" (edges pointing to non-existent nodes). Simplifies the frontend logic (no need to track diffs).
*   **Cons:** Higher DB write load. ID preservation is handled by the frontend sending specific UUIDs, which Prisma respects during creation.
# State Management & The Client Store
### 2.1 Why Zustand?
*   **Performance:** It allows components to subscribe to specific slices of state without re-rendering the entire app. This is critical when dragging a node at 60 FPS.
*   **Simplicity:** No boilerplate (reducers/actions). State logic is defined directly in the store hooks.
*   **Transient State:** It handles data that shouldn't be saved immediately, like simulation results (`simulationResults`) or UI view modes.
**File:** `apps/studio/store/canvas-store.ts`
### 2.2 Store Slices (The "God Store" Pattern)
#### A. The Graph Slice (`createGraphSlice`)
*   **`nodes` & `edges`:** The raw arrays required by the canvas.
*   **`onNodesChange` / `onEdgesChange`:** Standard React Flow hooks that handle dragging, selection, and deletion.
*   **`updateNodeProperties(id, props)`:** The most used action. It performs a **shallow merge** of properties. This allows the `PropertiesPanel` to update a specific field (e.g., `temp`) without overwriting other data like `pressure`.
#### B. The Workspace Slice (`createWorkspaceSlice`)
*   **`viewMode`:** Toggles between `GRAPH` (Editor), `SYNOPTIC` (List), and `SUMMARY` (Report).
*   **`synopticMode`:** Switches between Physical order (X-axis) and Sequence order (Process steps).
*   **`visibleScopes`:** Controls the Layer visibility (e.g., hiding Utility networks to focus on Process).
#### C. The Sequence Slice (`createSequenceSlice`)
*   **`sequences`:** An array of ordered lists of Node IDs.
*   **Logic:** It manages the drag-and-drop reordering in the Synoptic view (`SynopticEditor.tsx`) using `@dnd-kit`.
### 2.3 The Hydration Pattern (`ProjectInitializer`)
**Component:** `apps/studio/components/layout/project-initializer.tsx`
// Conceptual Flow
}
### 2.4 Optimistic UI Updates
**Example: Renaming a Node**
**Exception:** Some actions are **Atomic**. For example, creating a Project (`createProjectAction`) or Uploading an Image (`uploadImageAction`) happens on the server first, then returns a result to update the UI.
### 2.5 Accessing Simulation Results
*Architectural Note:* If the user refreshes the page, these results are lost (unless explicitly saved back to the DB, which is optional depending on the domain configuration).
# Appendix: Developer Cheatsheet & Troubleshooting
### A.1 Essential Command Reference
### A.2 "Where is X?" - File Map
### A.3 Troubleshooting FAQ
#### Q: I added a field to the Manifest, but it doesn't show up.
**A:** Check `apps/studio/lib/registry.ts`. Did you uncomment/import your new domain config file? Also, ensure your Node Type ID in the manifest matches the ID used in the `nodeTypes` object keys exactly.
#### Q: The Simulation returns "403 Forbidden".
**A:** This is a security mismatch.
#### Q: I get "PrismaClientInitializationError" in the logs.
**A:** The Studio cannot reach the Database.
#### Q: My changes to `solver.py` are not applied.
**A:** Python inside Docker does not "hot reload" automatically in production mode.
**Fix:** Run `docker-compose restart engine`.
#### Q: The canvas is blank or crashes on load.
**A:** This often happens if the `System` or `Project` ID in the URL is invalid or doesn't belong to you.
### A.4 Deployment Checklist
**End of Documentation.** You are now fully equipped to maintain, extend, and deploy Quantum Core. Happy Engineering!
# Configuration de l'environnement et de la sécurité
### 1.1 Prérequis
*   **Node.js :** v18.17+ (LTS recommandé)
*   **pnpm :** v9.x (Requis pour les workspaces Turborepo)
*   **Python :** v3.10+ (Pour l'exécution locale du moteur)
*   **Docker & Docker Compose :** v2.20+
### 1.2 Le protocole "Secret Interne"
**⚠️ Sécurité Critique :**
#### Générer un secret fort
*Enregistrez cette sortie. Elle sera désignée ci-dessous par `[VOTRE_SECRET_GÉNÉRÉ]`.*
### 1.3 Configuration du moteur (Python)
**1. Créer/Mettre à jour le fichier d'environnement**
# Le port sur lequel le serveur FastAPI écoute
# Le secret partagé (doit correspondre à la configuration du Studio)
**2. Patching de `docker-compose.yml`**
*Fichier : `docker-compose.yml`*
      # CHANGÉ : Utilise maintenant l'interpolation de variable
### 1.4 Configuration du Studio (Next.js)
**Créer/Mettre à jour `apps/studio/.env.local` :**
# --- Connexion à la base de données ---
# Assurez-vous que cela correspond à vos identifiants PostgreSQL
# --- Authentification (NextAuth.js) ---
# Générez un nouveau secret : openssl rand -base64 32
# L'URL publique de l'application
# Fournisseur de messagerie (SMTP) pour les liens magiques
# --- Pont Moteur ---
# L'URL où Next.js peut trouver le conteneur Python
# Dans le réseau Docker, utilisez : http://engine:8000
# Pour le développement local, utilisez : http://127.0.0.1:8000
# DOIT correspondre à la clé définie dans la Section 1.3
# --- Indicateurs de fonctionnalités ---
### 1.5 Étapes de Vérification
    # Créez un fichier .env à la racine avec vos secrets pour Docker
    *Résultat Attendu :* `{"detail":"Forbidden: Invalid API Secret"}`
    *Résultat Attendu :* `400 Bad Request` (C'est bon ! Cela signifie que l'authentification a réussi, mais que la charge utile était invalide, ce qui confirme que le Moteur est accessible et sécurisé).
# (Tuto 2/10) Gestion de Base de Données & Migrations
### 2.1 L'architecture des données
*   **Définition du schéma :** `packages/database/prisma/schema.prisma`
    *   Ce fichier définit vos tables (Modèles) et leurs relations.
*   **Client de base de données :** `packages/database/index.ts`
    *   Ceci exporte l'objet `db` utilisé dans toute l'application.
*   **Chaîne de connexion :** Définie dans votre fichier `.env` comme `DATABASE_URL`.
**Note pédagogique :** Lorsque vous modifiez le fichier `schema.prisma`, vous modifiez le *plan*. Vous devez ensuite "appliquer" ce plan au conteneur PostgreSQL réel et "générer" les types TypeScript afin que le code prenne connaissance des changements.
### 2.2 Démarrage du conteneur de base de données
    *   **Hôte :** `localhost`
    *   **Port :** `5434`
    *   **Utilisateur :** `quantum`
    *   **Mot de passe :** `password`
    *   **Base de données :** `quantum_core`
### 2.3 Synchronisation du Schéma (Dev vs. Prod)
#### A. La Méthode de Développement (`db:push`)
**Commande (depuis la racine) :**
*   **Ce qu'elle fait :** Met à jour la structure de la base de données immédiatement.
*   **⚠️ Risque :** Si vous avez renommé une colonne, elle pourrait supprimer l'ancienne et en créer une nouvelle, entraînant une perte de données. **N'utilisez pas cette méthode sur une base de données de production contenant des données réelles.**
#### B. La Méthode de Production (Migrations)
**1. Créer une Migration (Développement) :**
# Allez dans le package de la base de données
**2. Appliquer les Migrations (Production/CI) :**
### 2.4 Génération du client (sécurité des types)
**Commande (depuis la racine) :**
*Astuce : Turborepo est configuré pour exécuter cette commande automatiquement lorsque vous lancez `pnpm build`, mais pendant le développement, vous pourriez avoir besoin de la déclencher manuellement après une modification du schéma.*
### 2.5 Amorçage des données initiales
#### 1. Création du premier administrateur
    * **Email :** `admin@quantum.corp`
    * **Role :** `ADMIN` (Crucial : Sélectionnez ADMIN dans le menu déroulant de l'énumération)
    * **Name :** `System Admin`
#### 2. Hydratation des bibliothèques (Catalogue et Chimie)
    * **Icône 1 (Base de données) :** Importe le catalogue de matériel (Pompes, Réservoirs, Capteurs).
    * **Icône 2 (Fiole) :** Importe la bibliothèque chimique (Ions, Réactifs pour le domaine H2O).
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
# (Tuto 3/10) L'intégration du moteur Python
### 3.1 Architecture : La Calculatrice Apatride
*   Il ne se connecte **pas** à la base de données.
*   Il ne sait **pas** qui est l'utilisateur.
*   Il ne se souvient **pas** des calculs précédents.
**Comment ça marche :**
**Note Pédagogique :** Cette conception rend le moteur très robuste. Vous pouvez redémarrer le conteneur Python à tout moment sans perdre de données utilisateur. Si le moteur plante, cela n'affecte que le calcul spécifique en cours à cet instant précis.
### 3.2 Le Pont de Communication
**Le Flux :**
### 3.3 Surveillance du Cerveau
#### A. Journaux Docker (Le Flux Brut)
**Exemple de sortie :**
}
#### B. La Console de Simulation (Le Flux UI)
*   Dans l'interface utilisateur de Studio, un tiroir "Console" s'ouvre en bas à droite.
*   Ceci affiche les étapes de progression en temps réel (par exemple, "Construction de la Matrice...", "Résolution de l'Itération 4...").
*   Ceci est utile pour déboguer les simulations lentes sans consulter les journaux du serveur.
### 3.4 Tâches de maintenance courantes
#### Mise à jour de la logique du solveur
#### Mise à l'échelle
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
# (Tuto 4/10) Monitoring & Observabilité
### 4.1 Le Centre de Commande Admin
**Accès :** `https://votre-domaine.com/admin` (ou `/admin/stats`)
#### Sections Clés :
*   **KPIs (Centre de Commande) :** Métriques en temps réel sur l'acquisition d'utilisateurs (Leads), les projets actifs et les taux de conversion.
*   **Observabilité (Logs) :** Une interface de recherche pour le Journal d'Audit.
*   **Contenu (Expertise) :** Gestion du blog technique/base de connaissances.
### 4.2 Le système de piste d'audit
#### Comment ça marche
**Les événements enregistrés incluent :**
*   `SIMULATION_RUN` : Chaque fois qu'un utilisateur déclenche un calcul (utile pour suivre les coûts de calcul).
*   `AI_CHAT_STREAM` : utilisation de l'assistant LLM (proxy d'utilisation des jetons).
*   `FEEDBACK_SUBMITTED` : Rapports directs des utilisateurs.
*   `ERROR` : Défaillances critiques de l'application interceptées par les gestionnaires de limites.
#### Affichage des journaux
### 4.3 Maintenance : Rotation des journaux
**Nettoyage manuel :**
*Note pédagogique pour les DevOps :* Dans un environnement de production à fort trafic, vous devriez automatiser cette tâche. Vous pouvez configurer une tâche cron pour appeler cette action ou exécuter directement une requête SQL :
### 4.4 Vérification de l'état du système
#### 1. Vérifier le statut des conteneurs
*   **Sain :** Statut `Up` pour `studio`, `engine` et `postgres`.
*   **Malsain :** `Exit 1` ou `Restarting`.
#### 2. Vérifier la connectivité de la base de données
*   Allez sur la page principale du **Hub d'administration** (`/admin`).
*   Regardez le pied de page. Il y a un indicateur **"Base de données : Connectée"**.
*   *Fonctionnement :* La page tente une requête de base de données légère (`db.user.count()`) lors du rendu. Si elle échoue, la page affichera une erreur ou un état déconnecté.
#### 3. Vérifier la liaison du moteur Python
*   Il n'y a pas de connexion persistante à vérifier (stateless).
*   **Test :** Créez un projet "Hello World", ajoutez une Source et un Sink, puis cliquez sur "Simuler".
*   **Succès :** Le tiroir "Console" s'ouvre et affiche la progression.
*   **Échec :** Une notification "Red Toast" apparaît. Vérifiez immédiatement `docker logs qcore_engine`.
### 4.5 Stratégie de Sauvegarde
**Commande de Sauvegarde :**
**Commande de Restauration :**
# Le protocole du manifeste de domaine
### 1.1 L'architecture d'un "Domaine"
**Emplacement :** `apps/studio/lib/domains/`
### 1.2 Anatomie d'un Manifeste
  // 1. BIBLIOTHÈQUES : Quelles ressources peuvent être utilisées ?
    }
  // 2. TYPES DE NŒUDS : Quelles machines existent ?
    }
  // 3. TYPES D'ARÊTES : Comment se connectent-elles ?
    }
  }
};
### 1.3 Définition des Actifs (Nœuds) et des Champs
#### A. Quantités Physiques (`quantity`)
}
#### B. Sélecteurs (`select`)
}
#### C. Connexions Sans Fil (`node-selector`)
}
#### D. Collections Imbriquées (`collection`)
}
### 1.4 Portées : Processus vs. Utilitaire
    *   *Comportement :* Ces nœuds sont agencés linéairement de gauche à droite dans la vue Synoptique.
    *   *Exemples :* Chaudière, Turbine, Réservoir de réaction.
    *   *Comportement :* Ces nœuds sont placés en haut (Sources) ou en bas (Puits) du canevas pour éviter d'encombrer le flux principal.
    *   *Exemples :* Source d'eau, Réseau électrique, Drain.
    *   *Exemples :* Réservoirs de stockage, Bâtiments.
### 1.5 Enregistrement : Activation du Domaine
**Fichier :** `apps/studio/lib/registry.ts`
};
### 1.6 Vérification
# Personnalisation Visuelle et Registre de Composants
### 2.1 Le "SmartNode" : Interface utilisateur sans configuration
### 2.2 Le registre des composants
// apps/studio/lib/component-registry.tsx
// Importez votre rapport personnalisé si vous en avez un
// import { EnergyReport } from '@/components/domains/energy/energy-report';
  // Domaine existant...
  // VOTRE NOUVEAU DOMAINE
      // Mappez vos types logiques aux composants React
      // Vous pouvez réutiliser des composants spécifiques d'autres domaines s'ils conviennent
      // Panneau standard lors d'un clic sur un espace vide
      // Le composant rendu dans la vue "Résumé"
      // SUMMARY: EnergyReport 
    }
  }
};
### 2.3 Création d'un nœud personnalisé (Avancé)
**Étape 1 : Créer le composant**
  // Accéder aux résultats de simulation via data.properties
}
**Étape 2 : L'enregistrer**
// ... à l'intérieur de REGISTRY.ENERGY.nodes
### 2.4 Personnalisation du panneau de propriétés
**Le modèle de widget :**
    }
### 2.5 Création du rapport de domaine
**Étape 1 : Créer le composant de rapport**
}
**Étape 2 : Enregistrer le rapport**
}
### 2.6 Vérification
# L'interface du solveur et la logique physique
### 3.1 Structure des répertoires
    * `__init__.py` : (Peut être vide)
    * `solver.py` : C'est ici que réside votre code.
### 3.2 Le Contrat du Solveur
**La Signature :**
### 3.3 Implémentation de la logique
**Fichier :** `apps/engine/domains/energy/solver.py`
    # 1. NOTIFIER L'INTERFACE UTILISATEUR : Calcul démarré
    # 2. PRÉPARER LES STRUCTURES DE DONNÉES
    }
    # 3. LA BOUCLE PHYSIQUE (Simplifiée)
    # Dans un scénario réel, vous construiriez ici une Matrice (Ax=B) en utilisant NumPy.
        # LOGIQUE POUR LES CHAUDIÈRES
            # Entrées des champs de l'interface utilisateur
            # Physique : Carburant Entrant = Puissance Sortante / Efficacité
            # Stocker les résultats
        # LOGIQUE POUR LES TURBINES
            # Logique simulée : la sortie dépend de la connexion en amont
            # (En réalité, parcourir les 'edges' pour trouver la chaudière connectée)
        # Mapper les résultats à l'ID du nœud
    # 4. FINALISER LES KPI GLOBAUX
    # 5. ENVOYER LA CHARGE UTILE FINALE
    # Le type 'result' indique à l'interface utilisateur de mettre à jour le magasin
### 3.4 Enregistrement du Solveur
**Fichier :** `apps/engine/main.py`
        # ... logique existante ...
                )
                # Gestion des erreurs...
### 3.5 Mappage des résultats à l'interface utilisateur
**En Python (`solver.py`) :**
**En React (`SmartNode.tsx` ou `TurbineNode.tsx`) :**
// Inside your custom component
### 3.6 Bonnes pratiques : Utilisation de NumPy
**Le modèle matriciel :**
*Référez-vous à `apps/engine/domains/surface_treatment/solver.py` pour une implémentation complète du modèle matriciel.*
# Modèle de données et architecture topologique
### 1.1 La Hiérarchie des Entités
#### Niveau 1 : Le Projet (Portée Globale)
*   **Base de Temps :** Il contient des paramètres globaux comme `hoursPerDay`, `weeksPerYear`. Tous les calculs de bilan massique sont normalisés par rapport à cette base de temps.
*   **Le Bus :** Il possède des objets `ProjectStream` (voir Section 1.3), qui agissent comme le "Bus Inter-Système".
#### Niveau 2 : Le Système (Canevas Local)
*   **Isolation :** Chaque Système a son propre canevas, ses nœuds et ses arêtes.
*   **Type :** Peut être `PRODUCTION` (Logique linéaire) ou `TREATMENT` (Logique cyclique).
#### Niveau 3 : Nœuds et Arêtes (Le Graphe)
*   **`Node` :** Un actif d'équipement. Il contient un blob JSON `properties` qui stocke toutes les entrées spécifiques au domaine définies dans le Manifeste.
*   **`Edge` :** Une connexion physique dessinée par l'utilisateur. Par défaut, cela représente un tuyau ou un câble (`category: "PHYSICAL"`).
### 1.2 La logique de connexion "sans fil"
**La Solution :**
#### Comment cela fonctionne dans le code :
// Logique conceptuelle dans apps/studio/app/actions/simulation.ts
    // 1. Rechercher le schéma
      // 2. Détecter les champs "sans fil"
        // 3. Créer une arête éphémère pour le solveur
        }
      }
}
**Impact Architectural :** Le Solveur Python reçoit un graphe entièrement connecté (Physique + Virtuel) sans que l'interface utilisateur n'ait besoin de rendre des fils désordonnés.
### 1.3 Système de Systèmes (Le Bus de Données)
*   **`ProjectStream` :** Un objet de données partagé au niveau du Projet. Il agit comme un sujet Pub/Sub.
*   **Publication :** Un Nœud (par exemple, un "Drain" dans le Système A) se connecte à un Stream via `outputStreamId`.
*   **Abonnement :** Un Nœud (par exemple, une "Source" dans le Système B) se connecte au même Stream via `inputStreamId`.
**La Séquence de Résolution (`orchestrator.py`) :**
### 1.4 Stratégie de Persistance des Données
*   **Avantages :** Impossible d'avoir des "arêtes orphelines" (arêtes pointant vers des nœuds inexistants). Simplifie la logique du frontend (pas besoin de suivre les différences).
*   **Inconvénients :** Charge d'écriture plus élevée sur la base de données. La préservation des identifiants est gérée par le frontend qui envoie des UUID spécifiques, que Prisma respecte lors de la création.
# Gestion de l'état et du magasin client
### 2.1 Pourquoi Zustand ?
*   **Performance :** Il permet aux composants de s'abonner à des tranches spécifiques de l'état sans re-rendre toute l'application. C'est essentiel lors du glissement d'un nœud à 60 FPS.
*   **Simplicité :** Pas de code passe-partout (reducers/actions). La logique d'état est définie directement dans les hooks du store.
*   **État transitoire :** Il gère les données qui ne devraient pas être sauvegardées immédiatement, comme les résultats de simulation (`simulationResults`) ou les modes d'affichage de l'interface utilisateur.
**Fichier :** `apps/studio/store/canvas-store.ts`
### 2.2 Stocker les Slices (Le modèle "God Store")
#### A. La Slice Graph (`createGraphSlice`)
*   **`nodes` & `edges` :** Les tableaux bruts requis par le canvas.
*   **`onNodesChange` / `onEdgesChange` :** Hooks React Flow standards qui gèrent le glisser-déposer, la sélection et la suppression.
*   **`updateNodeProperties(id, props)` :** L'action la plus utilisée. Elle effectue une **fusion superficielle** des propriétés. Cela permet au `PropertiesPanel` de mettre à jour un champ spécifique (par exemple, `temp`) sans écraser d'autres données comme `pressure`.
#### B. La Slice Workspace (`createWorkspaceSlice`)
*   **`viewMode` :** Bascule entre `GRAPH` (Éditeur), `SYNOPTIC` (Liste) et `SUMMARY` (Rapport).
*   **`synopticMode` :** Bascule entre l'ordre physique (axe X) et l'ordre séquentiel (étapes du processus).
*   **`visibleScopes` :** Contrôle la visibilité des couches (par exemple, masquer les réseaux utilitaires pour se concentrer sur le processus).
#### C. La Slice Sequence (`createSequenceSlice`)
*   **`sequences` :** Un tableau de listes ordonnées d'ID de nœuds.
*   **Logique :** Elle gère le réordonnancement par glisser-déposer dans la vue Synoptique (`SynopticEditor.tsx`) à l'aide de `@dnd-kit`.
### 2.3 Le Modèle d'Hydratation (`ProjectInitializer`)
**Composant :** `apps/studio/components/layout/project-initializer.tsx`
// Flux Conceptuel
}
### 2.4 Mises à jour optimistes de l'interface utilisateur
**Exemple : Renommer un nœud**
**Exception :** Certaines actions sont **atomiques**. Par exemple, la création d'un projet (`createProjectAction`) ou le téléchargement d'une image (`uploadImageAction`) se produisent d'abord sur le serveur, puis renvoient un résultat pour mettre à jour l'interface utilisateur.
### 2.5 Accéder aux résultats de simulation
*Note architecturale :* Si l'utilisateur rafraîchit la page, ces résultats sont perdus (à moins d'être explicitement sauvegardés dans la base de données, ce qui est optionnel selon la configuration du domaine).
# Annexe : Aide-mémoire et dépannage du développeur
### A.1 Référence des commandes essentielles
### A.2 "Où est X ?" - Plan des Fichiers
### A.3 FAQ de dépannage
#### Q: J'ai ajouté un champ au Manifest, mais il n'apparaît pas.
**R:** Vérifiez `apps/studio/lib/registry.ts`. Avez-vous décommenté/importé votre nouveau fichier de configuration de domaine ? Assurez-vous également que l'ID de votre type de nœud dans le manifest correspond exactement à l'ID utilisé dans les clés de l'objet `nodeTypes`.
#### Q: La simulation renvoie "403 Forbidden".
**R:** Il s'agit d'une incompatibilité de sécurité.
#### Q: J'obtiens "PrismaClientInitializationError" dans les logs.
**R:** Le Studio ne peut pas atteindre la base de données.
#### Q: Mes modifications apportées à `solver.py` ne sont pas appliquées.
**R:** Python à l'intérieur de Docker ne se "recharge pas à chaud" automatiquement en mode production.
**Correction:** Exécutez `docker-compose restart engine`.
#### Q: Le canevas est vide ou plante au chargement.
**R:** Cela se produit souvent si l'ID `System` ou `Project` dans l'URL est invalide ou ne vous appartient pas.
### A.4 Liste de contrôle de déploiement
**Fin de la documentation.** Vous êtes maintenant entièrement équipé pour maintenir, étendre et déployer Quantum Core. Bon travail d'ingénierie !
  }
}
  }
  }
# Chapter 4: The Domain Manifest (Engineering Schema)
### 4.1 L'Équipement de Procédé (`PROCESS_BATH`)
    // --- GÉOMÉTRIE (Pour le calcul d'évaporation) ---
    // --- PHYSIQUE & ENVIRONNEMENT ---
    // --- LOGIQUE DE SPRAY & COMPENSATION ---
    // --- GESTION DES VIDANGES (DAMPING) ---
    // --- CHIMIE (La Recette) ---
    }
}
### 4.2 L'Équipement de Rinçage (`RINSE_TANK`)
    // --- HYDRAULIQUE (CASCADES) ---
      // 🚩 REGLE : On exclut PROCESS_BATH car la surverse vers un bain est interdite
    // --- VIDANGES PÉRIODIQUES ---
}
### 4.3 Logique Temporelle Globale (Working Hours)
// Ces champs apparaîtront dans les réglages du projet
### 4.4 Les Séquences (Le Transporter)
}
### Résumé des concepts appliqués dans ce Manifeste :
**Next Chapter:** *Nous passons maintenant au **Chapitre 5 : Le Solveur Python**. Nous allons coder la logique qui somme les séquences, calcule l'évaporation selon l'humidité et résout les bilans ioniques.*
# The Life of a Tank (Physics & Logistics)
## The Logistic Flow: Drag-out (Entraînement)
### The Calculation
*   **$S$**: The total surface area of parts processed per hour.
*   **$q_{spec}$**: The specific drag-out, which depends on the part geometry (flat parts vs. hollow parts) and the drainage time.
### The "Drag-in" Effect
*   **Mass Transfer:** This means Tank $N$ is constantly "polluted" by the chemistry of Tank $N-1$.
*   **Chemical Loss:** In a process bath, the operator must compensate for the chemicals lost via drag-out by adding fresh products. If the volume of these chemical additions differs from the drag-out volume, the level must be topped up with water.
## The Thermodynamic Loss: Evaporation
### Factors Influencing Evaporation
### The "24h Operation" Paradox
*   **The Workshop Schedule:** Operates for a fixed duration (e.g., 8h/day, 5 days/week).
*   **The Equipment Schedule:** Ventilation and heating systems often run **24h/day** to keep the baths ready.
*   **The Logic:** Evaporation occurs 24/7, but **compensation** (adding water) only happens during working hours when the water valves are active. Our Digital Twin must calculate losses over the full week while balancing them against the limited working hours.
## Rinsing Strategies: Cascades and Sprays
### Rinse Tank Dynamics
*   **Inlet:** Can be fed by clean water (source) or by the **overflow** of a subsequent rinse tank.
*   **Cascade Rinsing:** In a "Counter-current Cascade," clean water enters the *last* rinse and overflows into the *previous* one. This maximizes dilution while minimizing water consumption.
*   **Outlets:** The overflow can be directed to another tank, to a storage unit, or directly to a **Drain Network** (Acidic or Alkaline).
### Spray Rinsing (The Hybrid Solution)
## Damping and Waste Management
### Damping (Vidange)
*   **Drain Networks:** The system must track where this volume goes. A workshop typically has separate networks: **Acidic, Alkaline, Cyanide, or Chromic**.
*   **WWTP Sizing:** By calculating these damping volumes, we provide the data necessary to size the Waste Water Treatment Plant (WWTP).
## The Goal of the Simulation
# Mathematical Modeling (Ax = b)
## The Scenario: A Three-Tank Line
**The Logistics (Transporter):**
*   Parts move from **B $\rightarrow$ R1 $\rightarrow$ R2**.
*   The drag-out flow is constant: $Q_d = 10$ L/h.
**The Hydraulics (Pipes):**
*   Fresh water $Q_w = 400$ L/h enters **R2**.
*   **Cascade:** R2 overflows into **R1**.
*   R1 overflows to the **Drain**.
## The Algebraic Solution (Step-by-Step)
### Equation for Rinse 2 (The Cleanest Tank):
*   **In:** $Q_d \cdot C_1$ (coming from R1 via parts).
*   **Out:** $Q_d \cdot C_2$ (leaving via parts) + $Q_w \cdot C_2$ (leaving via overflow to R1).
*   **Balance:** $Q_d \cdot C_1 = (Q_d + Q_w) \cdot C_2$ 
*   $\Rightarrow C_2 = \frac{Q_d}{Q_d + Q_w} \cdot C_1$
### Equation for Rinse 1 (The Intermediate Tank):
*   **In:** $Q_d \cdot C_B$ (from Bath) + $Q_w \cdot C_2$ (overflow from R2).
*   **Out:** $Q_d \cdot C_1$ (to R2 via parts) + $Q_w \cdot C_1$ (to Drain via overflow).
*   **Balance:** $Q_d \cdot C_B + Q_w \cdot C_2 = (Q_d + Q_w) \cdot C_1$
### Exact Result:
**The Problem:** If we add evaporation, a spray in the bath, or a third rinse, solving this manually becomes a nightmare of substitutions.
## The Matricial Approach ($Ax = b$)
### Building the Equations for the Matrix
### The $Ax = b$ Form
### Why this is the "Engine" of Quantum Core:
*   **The Diagonal:** Represents the **Total Outflow** of a tank ($Q_{drag\_out} + Q_{water\_out}$).
*   **The Off-Diagonal:** Represents the **Inflows** from other tanks. A negative sign indicates that a concentration from "Tank J" is contributing to "Tank I".
*   **Vector b:** Contains our "Sources"—the fixed concentrations of the process baths.
## Adding Physics: Evaporation & Sprays
*   **Evaporation ($E$):** If a rinse tank has evaporation, the water leaving the tank is reduced. In the matrix, the term $(Q_d + Q_w)$ becomes $(Q_d + Q_w - E)$. The system will automatically check if $Q_w > E$ to prevent a negative water balance.
*   **Sprays:** If a spray in the Bath is fed by Rinse 1, it adds a new term in the Bath equation and the Rinse 1 equation.
*   **24h Evaporation:** In our Python solver, we will calculate an "Effective Evaporation Rate" by multiplying the 24/7 loss by $(168 / \text{WorkingHours})$, ensuring the mass balance is correct over a full production week.
## Numerical Resolution
# Chapter 5: The Python Solver Implementation
## Data Pre-processing: Aggregating Logistics
# Aggregate drag-out from all sequences
    # Hourly drag-out for this specific sequence
            # We add to the matrix (summing sequences)
## Calculating the Thermodynamic Loss (Evaporation)
    # Surface Area in m2
    # Simplified evaporation model (L/h)
    # Rate increases with Temperature and Agitation
    # Reduction if covers are used
## Resolving the Hydraulic Balance (The 24h Paradox)
### Automatic Spray Logic
# Hydraulic Calculation
        # Record a pumped transfer from Source -> Bath
## The Ionic Matrix: Solving $Ax = b$
### 1. The Dirichlet Condition (Process Baths)
*   We force $A[i, i] = 1$ and $b[i] = TargetConcentration$.
### 2. The Equilibrium Condition (Rinse Tanks)
*   **Diagonal $A[i, i]$:** Sum of all outflows (Drag-out + Overflow to Drain/Rinse + Pumped out to Spray).
*   **Off-Diagonal $A[i, j]$:** Negative sum of all inflows from tank $j$.
# For each chemical species
            # Rule: Fixed Concentration
            # Rule: Mass Balance (In = Out)
                # Negative inflow from tank j
    # Solve the system
## Environmental Impact: Drains and WWTP
## Summary of Chapter 5
*   **Multi-sequence summing** (Complex logistics).
*   **Thermodynamic evaporation** (Physical reality).
*   **The 168h/WH conversion** (Operational reality).
*   **Pumped vs Gravity flows** (Engineering constraints).
# Case Study 1: Modeling a Counter-Current Rinse Cascade
*   If we simply dump fresh water into each rinse tank individually, we waste huge amounts of water.
*   If we use a **Counter-Current** strategy (Clean water enters Rinse 2, overflows to Rinse 1, then drains), we save water while maintaining rinse quality.
## 1. The Physics: Solving it by Hand
### The Scenario
### The Equations (Steady State)
*   **Step A: Molar Mass Calculation**
    *   $NaOH = 40$ g/mol. $Na = 23$ g/mol.
    *   Ratio $R = 23/40 = 0.575$.
    *   Concentration of $Na^+$ in $T_0$ is $50 \times 0.575 = \mathbf{28.75}$ g/L.
*   **Step B: Mass Balance Equations**
    *   *Equation for Tank 2 (Rinse 2):*
    *   *Equation for Tank 1 (Rinse 1):*
*   **Step C: The Result**
    *   **Tank 1 ($C_1$):** $\approx 2.85$ g/L of Na.
    *   **Tank 2 ($C_2$):** $\approx 0.26$ g/L of Na.
## 2. Step 1: The Domain Manifest
**File:** `apps/studio/lib/domains/surface-treatment.ts`
    // The Source of Pollution
        // Connects to the Library
    // The Dilution Tank
        // Water Supply Configuration
    // The Sewer
    }
    }
  }
};
# Case Study 2: Multi-Stage Treatment & The 3-Tank Cascade
**The Scenario:**
**The Line Configuration:**
## 1. The Physics: Solving the Triple Cascade
### Parameters
*   **Tank 3 (Etching):** 100 g/L of HCl.
*   **Sequence:** Parts go $T_3 \to T_4 \to T_5 \to T_6$.
*   **Drag-out ($q_d$):** 10 L/h.
*   **Rinsing:** Fresh water ($Q_{fresh}$) enters $T_6$ at **100 L/h**.
*   **Cascade:** $T_6 \to T_5 \to T_4 \to \text{Drain}$.
### Step A: Chemistry
*   $H = 1$ g/mol, $Cl = 35.5$ g/mol. $HCl = 36.5$ g/mol.
*   Ratio $Cl^- = 35.5 / 36.5 \approx \mathbf{0.9726}$.
*   Concentration of $Cl^-$ in Active Bath ($T_3$) = $100 \times 0.9726 = \mathbf{97.26}$ g/L.
### Step B: The Geometric Progression
    *   $In = Out \implies 10 \cdot C_5 = (10 + 100) \cdot C_6$.
    *   $C_5 = 11 \cdot C_6$.
    *   $10 \cdot C_4 + 100 \cdot C_6 = 110 \cdot C_5$.
    *   Substitute $C_6$: $10 \cdot C_4 + 100 \cdot (C_5/11) = 110 \cdot C_5$.
    *   Solving leads to: $C_4 = 111 \cdot C_6$.
    *   $Load_{in} + 100 \cdot C_5 = 110 \cdot C_4$.
    *   $Load_{in} = 97.26 \text{ g/L} \times 10 \text{ L/h} = 972.6 \text{ g/h}$.
    *   Solving leads to: $972.6 \propto 1111 \cdot C_6$ (Approximation).
**Analytical Solution:**
*   $C_6 \text{ (Final)} \approx 97.26 / 11^3 \approx \mathbf{0.073}$ g/L.
*   $C_5 \approx 0.80$ g/L.
*   $C_4 \approx 8.8$ g/L.
## 2. Step 1: Extending the Library (JSON)
**File:** `surface-chemistry.json`
  // ... Previous entries (Sodium, Hydroxide, Caustic Soda) ...
  }
# Case Study 3: Network Segregation & Optimization
*   Too much volume for an **Evaporator** (Energy bills will explode).
*   Too much chemical load for **Ion Exchange** (Resins will saturate instantly).
**The Solution: Split the Flow.**
## 1. The Physics: Sizing the Split
### Parameters
*   **Drag-out ($q_d$):** 10 L/h.
*   **Input Load ($T_3 \to T_4$):** 972.6 g/h of Chloride ($Cl^-$).
### Strategy A: The "Dirty" Loop ($T_4, T_5$)
*   **Mass Balance:**
*   **Concentration in $T_5$:**
### Strategy B: The "Polishing" Loop ($T_6$)
*   **Pollution Input:** $C_5 \times q_d = 3.89 \times 10 = \mathbf{38.9} \text{ g/h}$.
    *Note: We reduced the load from 972.6 g/h to 38.9 g/h thanks to the first loop.*
*   **Concentration in $T_6$:**
### The Economic Result
## 2. Step 1: Modifying the Topology (Graph Editor)
**Actions in `/editor/[id]`:**
    *   Select the pipe connecting `Rinse 3 (T6)` $\to$ `Rinse 2 (T5)`.
    *   Press **Delete**.
    *   *Result:* $T_6$ is now hydraulically isolated from $T_5$.
    *   Open the Palette. Drag a `SOURCE` node. Name it "Evap Feed".
    *   Connect "Evap Feed" $\to$ `Rinse 2 (T5)`.
    *   *Result:* The Cascade $T_5 \to T_4$ is now fed independently.
    *   Drag a `DRAIN` node. Name it "Resin Network".
    *   Connect `Rinse 3 (T6)` $\to$ "Resin Network".
    *   *Result:* The final rinse has its own dedicated exit.
## 3. Step 2: Configuring the Flows
    *   Inlet Flow: **40 L/h**. (This drives the Evaporation loop).
    *   Water Source: "FRESH_WATER".
    *   Inlet Flow: **200 L/h**. (This drives the Resin loop).
    *   Water Source: "FRESH_WATER".
*Note on Sequence:* We do **not** touch the sequence. The crane path is still $T_3 \to T_4 \to T_5 \to T_6$. The pollution transport via drag-out remains unchanged; only the water transport changes.
## 4. Step 3: The Engine Resolution
### Analyzing the Matrix Terms
    *   Total Output of $T_4$ is $40 (\text{overflow}) + 10 (\text{drag}) = 50$.
    *   Input from $T_5$ is $40$.
    *   **Crucial:** The term $A[1, 2]$ (Input from $T_6$) is **0**. There is no hydraulic connection anymore.
    *   Total Output is $200 + 10 = 210$.
    *   Input from Sequence ($T_5 \to T_6$) is represented by the term $-10$ at $A[2, 1]$.
    *   *Wait, strictly speaking in our solver implementation:* Sequence inputs are usually added to the $B$ vector iteratively or handled as a drag matrix $D$ where $A = H + D$. In Quantum Core, drag-out is part of the system matrix $A$ (off-diagonals).
### Simulation Results
*   **$C_4$:** 19.45 g/L
*   **$C_5$:** 3.89 g/L
*   **$C_6$:** 0.185 g/L
## 5. Visualizing the Networks
### Report Summary
## Conclusion
*   **Traditional Tools (Excel):** You would have to rewrite formulas, break circular references, and create new tabs.
*   **Quantum Core:** You just dragged a line. The Matrix Solver automatically adapted to the new topology (Block Diagonal Matrix).
# Case Study 4: Building a Zero Liquid Discharge (ZLD) Plant
## 1. The Physics: The Treatment Chain
    *   **Physics:** Boils water under vacuum.
    *   **Yield:** 90% Recovery. The remaining 10% is "Concentrate" (Sludge) sent to disposal.
    *   **Physics:** Removes trace ions.
    *   **Yield:** ~100% Recovery (Water loss only during regeneration, ignored here).
    *   STL Demand: 240 L/h.
    *   Available Waste: 240 L/h.
    *   Evaporator Loss: 10% of 40 L/h = 4 L/h.
    *   **Deficit:** 4 L/h.
    *   **Solution:** Automatic City Water makeup.
## 2. Step 1: Extending the Domain Manifest
// Additions to nodeTypes
    // Critical: The Makeup Logic
}
# Case Study 5: Equipment Selection & CAPEX Estimation
*   **Evaporator Input:** 40 L/h (Acidic).
*   **Ion Exchange Input:** 200 L/h (Dilute).
*   **Makeup Water:** 4 L/h.
## 1. Step 1: Defining the Hardware Library (JSON)
  // --- EVAPORATORS (Vacuum) ---
    }
    }
  // --- ION EXCHANGE SKIDS ---
    }
  // --- TANKS ---
  // --- PUMPS ---
  }
# Architecting the Industrial Meta-Framework
**Quantum Core** was born from a simple realization: **Mathematically and structurally, these problems are identical.** They are all directed graphs where nodes process resources and edges transport them.
## 1. The Core Philosophy: "Everything is a Node"
### The Abstraction Layer
*   **The Database (Prisma/PostgreSQL):** Stores the topology (XY coordinates, connections) and a massive `JSONB` blob called `properties`.
*   **The Frontend (Next.js/React Flow):** A generic renderer that asks: *"What does this node look like?"* and *"What fields should I render?"*.
*   **The Engine (Python/NumPy):** A blind calculator that receives matrices, solves linear equations ($Ax = B$), and returns results.
## 2. The Architecture: The "Studio-Engine" Duality
### A. The Studio (The Artist)
*Built with Next.js 15, React Flow, Zustand, and Tailwind.*
#### The Component Registry Pattern
// lib/component-registry.tsx
  }
};
}
# From Atoms to JSON: Modeling Physics in TypeScript
## 1. The "Meta-Model": A Schema for Schemas
// lib/domain-config.ts
};
};
};
# The Matrix Solver: Automating Mass Balance for Surface Treatment Lines
## 1. The Domain Model: Defining the Physics
// lib/domains/surface-treatment.ts
    // 1. The Active Bath (Source of Pollution)
    // 2. The Rinse Tank (The Dilution Solver)
    // 3. The Output (The Network)
    }
  }
};
# Bridging the Gap: Visualizing Physics with React & The Registry Pattern
*   A **Generic Node** is just a rectangle with a label.
*   An **Engineering Node** (e.g., a Surface Treatment Tank) is a live dashboard. It must show liquid levels, temperature, chemical concentration, and visually alert the user if a threshold is breached.
## 1. The Challenge: One UI, Infinite Domains
// ❌ The Anti-Pattern: Hard-coded conditional rendering
  }
}
# Bridging the Gap: Visualizing Physics with React & The Registry Pattern
*   A **Generic Node** is just a rectangle with a label.
*   An **Engineering Node** (e.g., a Surface Treatment Tank) is a live dashboard. It must show liquid levels, temperature, chemical concentration, and visually alert the user if a threshold is breached.
## 1. The Challenge: One UI, Infinite Domains
// ❌ The Anti-Pattern: Hard-coded conditional rendering
  }
}
# The Knowledge Base: Architecting a Recursive Industrial Library
*   **A Chemical Product** (e.g., *Sulfuric Acid 98%*) is not just a string. It is a composition of atoms ($2 \times H^+$, $1 \times SO_4^{2-}$), with a specific density ($1.84$) and purity.
*   **A Machine Skid** is an assembly of a Pump, two Valves, and a Sensor.
## 1. The Data Structure: Recursive BOM (Bill of Materials)
**File:** `packages/database/prisma/schema.prisma`
  // The "Physics" Payload (Density, Molar Mass, Power...)
  // Recursive Relations
  // 1. "I am composed of..." (Downstream)
  // 2. "I am used in..." (Upstream)
}
}
# Orchestrating the Factory: System of Systems & Topological Sorting
*   **System A (Production):** Generates wastewater containing acid and nickel.
*   **System B (Physico-Chemical Station):** Receives the wastewater, neutralizes the acid, and precipitates the nickel.
*   **System C (Evaporator):** Receives the sludge from System B and concentrates it.
**Quantum Core** solves this by adopting a **"System of Systems"** architecture. We treat each production line as a black box (a "Microservice") and connect them via a **Project Bus**.
## 1. The Architecture: The Project Bus
**File:** `packages/database/prisma/schema.prisma`
  // The State (Snapshot of the last simulation)
  // Example: { "flow": 15000, "concentrations": { "Ni": 12.5 } }
  // Connectivity
}
```

============================================================
FILE: TODO.md (SKELETON)
============================================================
```md
Based on the provided file structure and contents, here is a detailed analysis of the **808-quantum-core** project.

### 1. Security Analysis

The project implements several good security practices but has specific vulnerabilities typical of a "Speed-over-Perfection" development phase.

*   **Authentication & Authorization:**
    *   **Weakness (`middleware.ts`):** The middleware uses `@ts-ignore` to bypass type checking on `req.auth`. If the session structure changes, this could fail silently, potentially exposing admin routes.
    *   **Role Management:** The logic relies on `token.role` being passed to the session. While functional, `auth.config.ts` types are loose (`any`). A user with a manipulated JWT could potentially escalate privileges if the signing key isn't secure (though NextAuth handles signing well by default).
    *   **Resource Ownership (`graph.ts`):** The `verifyLineOwnership` function is implemented and called in `saveGraph`, which is excellent. However, `loadGraph` does **not** appear to verify ownership. A user could potentially load a graph they don't own if they guess the `lineId` (ID Enumeration attack), even if they can't save changes to it.
*   **API Communication:**
    *   **Strength (`simulation.ts` & `engine/main.py`):** The Next.js app communicates with the Python engine using an `INTERNAL_API_SECRET`. This prevents external actors from hitting the calculation engine directly, provided the `INTERNAL_API_SECRET` is strong and kept safe.
*   **Input Validation:**
    *   **Weakness (Server Actions):** In `project.ts` and `admin-blog.ts`, inputs from `FormData` are cast to string (`as string`) without strict validation. A user could submit empty strings or malicious payloads.
    *   **Strength (`leads.ts`):** Uses `zod` for email validation, which is the correct approach. This should be adopted across all actions.
*   **Dependencies:**
    *   The project uses `next-auth: 5.0.0-beta.30`. Beta versions can contain unpatched security flaws or breaking changes.
### 2. Performance Analysis
*   **Database Interactions (N+1 Problem):**
    *   **Risk (`graph.ts` - `saveGraph`):** The save logic performs a "Diff Sync" using `deleteMany` followed by loops of `upsert`. For a line with hundreds of nodes/edges, this generates a massive amount of SQL queries within a transaction. This will become a bottleneck.
    *   **Recommendation:** Use `createMany` for new items and batched updates, or send a simplified JSON blob to the DB if granular row-level access isn't strictly required for nodes.
*   **Computation (Python Engine):**
    *   **Risk (`solver.py`):** The solver runs `np.linalg.solve` on every request. There is no caching mechanism. If multiple users simulate the same configuration (or the same user clicks simulate repeatedly), the CPU will do redundant work.
    *   **Design Choice:** Passing the *entire* graph (nodes/edges/sequences) in the payload for every simulation (`SimulationPayload`) is bandwidth-heavy for large projects.
*   **Frontend Rendering:**
    *   **Optimization:** The `FlowEditor` uses `ReactFlow` with `useMemo` for node types, which prevents unnecessary re-renders.
    *   **Loading States:** The project uses `Promise.all` in `admin/stats/page.tsx` for parallel data fetching, which is excellent for load times.
### 3. Programming Errors & Code Quality
*   **Type Safety (TypeScript):**
    *   **Issue:** Extensive use of `any` (e.g., `canvas-store.ts`, `nodeTypes` in `node-palette.tsx`). This defeats the purpose of TypeScript and will lead to "Cannot read property of undefined" runtime errors as the project grows.
    *   **Specific:** In `middleware.ts`, `// @ts-ignore` is used to suppress a type error regarding `req.auth`.
*   **Dead Code / Commented Code:**
    *   **File:** `apps/engine/main.py`
    *   There are commented-out class definitions (`SequenceStep`, etc.) and logic for the "ENERGY" domain. This creates confusion about which data models are actually active.
*   **Encoding Issues:**
    *   **File:** `README.md`
    *   The scanner reported `[Error reading file: 'utf-8' codec can't decode byte...]`. This suggests the README might contain binary characters or be saved in a non-UTF-8 encoding (like Windows-1252), which will break CI/CD pipelines expecting UTF-8.
*   **Prisma Schema:**
    *   The `Project` model has `onDelete: Cascade` for lines, which is good. However, the `Sequence` model relies on string-based `nodeId` in `SequenceStep`. While there is a relation defined, ensuring data integrity when Nodes are deleted requires careful handling in the application logic (which `onNodesChange` in the store attempts to do, but server-side enforcement is safer).
### 4. Logic Errors
*   **Simulation Math (`solver.py`):**
    *   **Singularity Handling:** `A[i, i] = max(q_out_total[i], 1e-9)`. While this prevents division by zero, physically it means a tank with zero outflow acts as if it has a tiny outflow. This might mask configuration errors (e.g., a tank with no exit pipe) rather than alerting the user.
    *   **Sequence Logic:** The solver iterates through sequences to calculate drag-out. If a sequence references a Node ID that no longer exists (due to a sync error between graph and DB), the solver loop might crash or produce incorrect mass balances.
*   **State Synchronization (`project-initializer.tsx`):**
    *   The `lastLoadedLineId` ref is used to prevent infinite loops. However, if the user navigates away and back to the same line, the store might not reset correctly if the component doesn't unmount fully (Next.js client-side navigation).
*   **Blog Update Logic (`admin-blog.ts`):**
    *   The logic `const published = formData.get('published') === 'on';` is standard for HTML forms, but fragile. If the UI library (`shadcn` or similar) changes how it handles checkboxes (sending `true`/`false` strings instead of `on`), this logic will silently fail to publish posts.
### 5. Layout & Design Structure
*   **Architecture:**
    *   The separation of `marketing`, `admin`, and `editor` layouts via Next.js Route Groups (`(admin)`, `(marketing)`) is excellent. It keeps styles and layouts distinct.
*   **UI/UX:**
    *   **Responsive Design:** The CSS uses mobile-first approaches (`hidden lg:flex`). However, complex components like `FlowEditor` are inherently difficult on mobile. The `Workspace` layout assumes a desktop environment.
    *   **Z-Index Management:** `SequenceManager` uses `z-40` and fixed positioning. It might overlap with the `ReactFlow` controls (bottom left) or the `SummaryView` content on smaller screens.
*   **File Structure:**
    *   **Logic placement:** `apps/engine` (Python) handles domain logic, while `apps/studio` handles UI. This is a clean separation.
    *   **Store:** `canvas-store.ts` is becoming a "God Object" handling Workspace, Graph, and Sequence logic. It should likely be split into multiple stores or slices (as partially done, but all in one file).
### Summary of Recommendations
### 1. Sécurité
**Points Forts :**
*   **Isolation du Moteur :** Le moteur Python est isolé et protégé par un `INTERNAL_API_SECRET`. Il n'est pas exposé directement au public, mais proxifié par les Server Actions de Next.js.
*   **Vérification de Propriété (`graph.ts`) :** La fonction `getAuthenticatedSystem` vérifie bien que le `systemId` appartient à un projet dont l'utilisateur est propriétaire. C'est crucial pour éviter l'IDOR (Insecure Direct Object Reference).
*   **Architecture "Server-First" :** L'utilisation massive des Server Actions (`'use server'`) réduit la surface d'attaque côté client.
**Points Critiques & Vulnérabilités :**
*   **Gestion des Secrets (Docker) :** Dans `docker-compose.yml`, le secret `INTERNAL_API_SECRET` est hardcodé (`super-secret-quantum-key-2026`). En production, ceci doit passer par des variables d'environnement injectées au runtime, pas écrites dans le fichier.
*   **Validation des Entrées (Inconsistant) :**
    *   *Bien :* `actions/leads.ts` utilise `zod` pour valider l'email.
    *   *Risqué :* `actions/admin-blog.ts` fait des casts bruts (`formData.get('title') as string`). Si un attaquant envoie un objet ou un tableau, cela peut faire crasher le serveur ou causer des comportements inattendus.
    *   *Risqué :* `actions/library.ts` -> `importLibraryAction` parse du JSON uploadé par l'utilisateur sans limite de taille stricte ni validation profonde de la structure avant le parsing, ce qui expose au DoS (Denial of Service).
*   **Middleware Auth (`middleware.ts`) :** L'usage de `// @ts-ignore` sur `req.auth` est dangereux. Si la structure de l'objet session change (ce qui arrive souvent avec les bêtas de NextAuth v5), tes routes admin pourraient devenir accessibles ou crasher silencieusement.
*   **NextAuth Beta :** Tu utilises `next-auth: 5.0.0-beta.30`. Les versions bêta contiennent souvent des failles de sécurité non corrigées ou des changements de rupture.
### 2. Performance
**Points Forts :**
*   **Parallel Data Fetching :** Dans `admin/stats/page.tsx`, l'utilisation de `Promise.all` pour charger les stats en parallèle est excellente.
*   **React Flow Optimization :** L'usage de `useMemo` pour `nodeTypes` dans `flow-editor.tsx` évite des re-renders inutiles du graphe complet.
**Points d'Amélioration :**
*   **Le problème "N+1" en écriture (`saveGraph`) :**
    *   Dans `actions/graph.ts`, la sauvegarde fait un `deleteMany` puis une boucle `for` avec `upsert` pour chaque nœud et chaque lien.
    *   *Impact :* Pour un système de 500 nœuds, tu ouvres 1000+ requêtes SQL séquentielles dans une transaction. Cela va bloquer la DB.
    *   *Solution :* Utiliser `createMany` pour les insertions massives ou envoyer un JSON global si l'accès unitaire aux nœuds n'est pas requis par d'autres services.
*   **Moteur Python (Absence de Cache) :**
    *   Chaque clic sur "Simuler" renvoie tout le graphe au Python qui recalcule tout (matrices NumPy).
    *   *Solution :* Implémenter un hash du payload côté Python (ex: Redis) pour renvoyer le résultat caché si les inputs n'ont pas changé.
*   **Bundle Size :** L'import de `lucide-react` est généralement bon, mais assure-toi que ton `import * as Icons` dans `dynamic-icon.tsx` ne casse pas le Tree-Shaking. Charger toutes les icônes peut alourdir le bundle client considérablement.
### 3. Expérience Utilisateur (UX)
**Points Forts :**
*   **Feedback Visuel :** Les "Health Bars" de pollution sur les nœuds (`GenericNode`) et les animations de flux dans `BlueprintFlow` rendent la physique "visible".
*   **Navigation Contextuelle :** Le `UniversalHeader` qui change selon qu'on est au niveau Projet ou Système est très intuitif.
*   **Mode "Synoptique" vs "Graph" :** C'est une excellente idée. Les ingénieurs procédés aiment les schémas P&ID (Graphe), les opérateurs préfèrent les vues séquentielles (Synoptique).
**Points d'Amélioration :**
*   **Interactions Bloquantes :**
    *   L'utilisation de `alert()` et `confirm()` natifs (ex: `header.tsx`, `library-manager.tsx`) est à bannir en 2026. Cela bloque le thread principal du navigateur et fait "amateur".
    *   *Solution :* Utiliser les "Toasts" (ex: `sonner` ou `react-hot-toast`) et des Modales (Dialog) de ta bibliothèque UI.
*   **Gestion des Erreurs Moteur :** Si le conteneur Python est éteint, l'utilisateur reçoit une alerte générique. Il faudrait un état visuel "Système Déconnecté" dans le Header.
*   **Responsive Mobile :** Le `FlowEditor` et le `Synoptique` semblent difficilement utilisables sur mobile (pas de contrôles tactiles spécifiques visibles). Un avertissement "Vue optimisée pour Desktop" serait pertinent sur petit écran.
### 4. Navigabilité & Qualité du Code
**Points Forts :**
*   **Pattern "Domain Registry" (`lib/component-registry.tsx`) :**
    *   C'est brillant. Tu injectes dynamiquement les composants (Formulaires, Widgets, Nœuds) selon le domaine (`WATER`, `ENERGY`). Cela te permet d'ajouter le domaine "ENERGY" sans toucher au code cœur du Studio.
*   **Séparation Logiciel/Métier :**
    *   `apps/engine` contient la physique (Python).
    *   `apps/studio` contient l'interface.
    *   `packages/database` contient le schéma.
    *   C'est une séparation des responsabilités très propre (Clean Architecture).
**Points de Vigilance :**
*   **Le "God Store" (`canvas-store.ts`) :**
    *   Ce fichier gère tout : le graphe, la sélection, les séquences, le mode de vue, les données de bilan... Il devient massif.
    *   *Conseil :* Découper avec le pattern "Slice" de Zustand (`createGraphSlice`, `createUISlice`, `createSimulationSlice`) dans des fichiers séparés.
*   **Typage `any` :**
    *   Il y a beaucoup de `any` dans le code (ex: `items: any[]` dans `LibraryManager`, `config: any` dans les props).
    *   Cela annule les bénéfices de TypeScript. Il faudrait définir des interfaces strictes (`LibraryItem`, `DomainConfig`) dans un package partagé (`packages/types` ?).
### Résumé des priorités
```

============================================================
FILE: context.py (SKELETON)
============================================================
```py
import os

# --- CONFIGURATION ---
# Directories to completely ignore
IGNORE_DIRS = {
    'node_modules', '.next', '.venv', '.git', '.vincent', 
    'dist', 'build', '__pycache__', '.vscode', 'Book', 'docs', 'ressources', 'venv'
}

# Specific files to ignore (like heavy lock files)
IGNORE_FILES = {
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', '.DS_Store'
}

# File extensions to include
}
def generate_tree(startpath):
  // ... implementation hidden for brevity ...
        # Remove ignored directories from search
            # Only show files in tree if they aren't ignored
def get_file_contents(startpath):
  // ... implementation hidden for brevity ...
            # Only read the file if it has a relevant extension
def main():
  // ... implementation hidden for brevity ...
```

============================================================
FILE: context_short.py (SKELETON)
============================================================
```py
import os
import re
import fnmatch

# --- CONFIGURATION ---

# 1. Dossiers et Fichiers à IGNORER totalement
IGNORE_PATTERNS = {
    'node_modules', '.next', '.git', '.venv', '__pycache__', 
    'dist', 'build', '.turbo', 'yarn.lock', 'package-lock.json', 
    'pnpm-lock.yaml', '*.png', '*.jpg', '*.jpeg', '*.svg', '*.ico',
    '.DS_Store', 'LICENSE', 'venv'
}

# 2. Fichiers CRITIQUES à lire EN ENTIER (High Context)
# Mettez ici les fichiers qui contiennent la "vérité" du projet (Schémas, Auth, Config)
}
# 3. Extensions à traiter
def is_ignored(path):
  // ... implementation hidden for brevity ...
        # Vérifie aussi si un dossier parent est ignoré
def get_tree(startpath):
  // ... implementation hidden for brevity ...
def skeletonize_code(content, extension):
  // ... implementation hidden for brevity ...
    # Regex simples pour détecter les structures importantes
    # TS/JS: export, import, interface, type, function, class, const X = (
    # Python: def, class, import, from, @
        # Garder les 10 premières lignes (imports souvent)
        # Garder les commentaires (documentation)
        # Détection selon langage
            # Ajouter une ligne vide ou "..." si la ligne précédente ne l'était pas déjà
        # Garder les accolades fermantes pour la structure visuelle
def generate_smart_context():
  // ... implementation hidden for brevity ...
    # 1. Structure
    # 2. Contenu
                    # Pas de compression pour les fichiers critiques ou de config pure
                    # Compression intelligente
                # Estimation très grossière (1 mot ~ 1.3 tokens, code est dense)
```

============================================================
FILE: .vincent\mcp.json (SKELETON)
============================================================
```json
{
  "mcpServers": {
    "Vincent": {
      "url": "https://vincent.bespo.ai/api/v1/mcp/",
      "transport": "http"
    }
  }
}
```

============================================================
FILE: Book\introduction.md (SKELETON)
============================================================
```md
# Introduction : L'Avènement de Quantum Core

## 1. La Genèse : Sortir de l'Enfer du "One-Shot"

Dans le monde du développement logiciel pour l'ingénierie industrielle, un schéma se répète inlassablement. Un expert (en traitement de l'eau, en thermique ou en acoustique) a besoin d'un outil. On développe pour lui une application monolithique, rigide, où la logique métier est "codée en dur".

Si demain ce même expert veut adapter l'outil pour un domaine voisin, il faut tout réécrire. Le code est jetable, la dette technique s'accumule, et l'intelligence artificielle est souvent une pensée après-coup.

**Quantum Core** né d'un refus de ce modèle.

Ce projet n'est pas une application de traitement de surface. C'est une **usine à logiciels d'ingénierie**. Notre ambition est de créer un "Système d'Exploitation" (OS) pour le génie technique, capable de modéliser, simuler et optimiser n'importe quel flux physique (eau, électrons, chaleur, argent) à travers une interface web moderne et un moteur de calcul surpuissant.

## 2. La Philosophie : "Meta-Modélisation" et Abstraction

La pierre angulaire de Quantum Core tient en une phrase : **Ne codez pas le métier, configurez-le.**
*   Pour **QuantumH2O**, ce nœud sera une "Cuve" avec un volume et un pH.
*   Pour **QuantumEnergy**, ce même nœud sera une "Batterie" avec une capacité et un voltage.
## 3. L'Architecture Hybride : Le Meilleur des Deux Mondes
*   Le web (JavaScript/TypeScript) est roi pour l'interface utilisateur, l'interactivité et la gestion de projet.
*   La science (Python) est reine pour le calcul matriciel, l'optimisation et l'Intelligence Artificielle.
### Le "Cerveau Gauche" : Next.js (Orchestration)
*   L'authentification et la sécurité (RBAC).
*   L'interface utilisateur (React, Tailwind, ReactFlow).
*   La persistance des données (PostgreSQL via Prisma).
*   La relation client (CMS, Leads).
### Le "Cerveau Droit" : FastAPI (Intelligence)
*   L'algèbre linéaire (NumPy) pour les bilans de masse et d'énergie.
*   L'IA Générative (LangChain/LLM) pour l'analyse de cahiers des charges (RAG) et la rédaction technique.
*   Il est "Stateless" : on lui envoie un problème (JSON), il renvoie une solution.
## 4. La Stack Technique (2025/2026 Ready)
*   **Langages :** TypeScript (Strict) & Python 3.11+.
*   **Frontend/BFF :** Next.js 15 (App Router, Server Actions).
*   **Backend Engine :** FastAPI + NumPy + Pydantic.
*   **Base de Données :** PostgreSQL (avec support JSONB et pgvector).
*   **ORM :** Prisma (pour la sécurité des types).
*   **Repo Management :** Turborepo (Monorepo) + pnpm.
*   **Infrastructure :** Docker Compose (Dev) / Architecture Conteneurisée (Prod).
## 5. Les Défis à Relever
```

============================================================
FILE: Book\sprint0.md (SKELETON)
============================================================
```md
# Chapitre 1 : Sprint 0 - Les Fondations de l'Usine

## 1. Objectif du Sprint

Avant de poser la première brique de logique métier (calculer un pH ou dimensionner une cuve), nous devions construire l'usine elle-même. Dans un projet d'une telle envergure, la dette technique se paie *cash* dès le troisième mois si l'architecture initiale est bancale.

L'objectif du Sprint 0 était clair : **Mettre sur pied un environnement de développement unifié capable de faire cohabiter TypeScript (l'Interface) et Python (le Calcul) de manière fluide et typée.**

Nous ne voulions pas de deux dépôts Git séparés qui finissent par se désynchroniser. Nous voulions une **Source de Vérité Unique**.

## 2. La Stratégie Monorepo (Turborepo & pnpm)

Pour gérer cette polyglottie (JS/TS + Python), nous avons opté pour une structure **Monorepo** gérée par **Turborepo**.

### Pourquoi ce choix ?
### L'Arborescence Cible
## 3. Le Schéma de Données "Meta-Model"
### Le changement de paradigme
*   **Avant (Approche classique) :** Une table par équipement. Si on veut ajouter un "Panneau Solaire", on doit migrer la DB.
*   **Après (Quantum Core) :** Une table `Node` universelle.
    *   `type`: String ("TANK", "SOLAR_PANEL")
    *   `properties`: **JSONB**. C'est ici que réside la flexibilité. PostgreSQL valide le format JSON, et nos validateurs applicatifs (Pydantic/Zod) valideront le contenu métier.
## 4. L'Orchestration Hybride (Docker)
## 5. Rétrospective : Difficultés Rencontrées et Solutions
### Défi n°1 : Le "Breaking Change" de Prisma 7
**Le Problème :** Nous avons adopté la toute dernière version de Prisma (v7.2.0). Lors de la génération du client, nous avons rencontré l'erreur `P1012`. La définition de l'URL de connexion directement dans `schema.prisma` (`url = env("...")`) est devenue obsolète et interdite.
**La Solution :**
*Leçon apprise :* Toujours vérifier les "Release Notes" des outils majeurs avant de commencer, surtout sur les versions "Bleeding Edge".
### Défi n°2 : La Rigueur de pnpm dans un Monorepo
**Le Problème :** Lors de l'installation des dépendances (`dotenv`, `@prisma/config`), nous avons eu des erreurs `ERR_PNPM_ADDING_TO_ROOT`. De plus, pnpm refusait d'installer des paquets dans `packages/database` car il ne le reconnaissait pas comme un module valide.
**La Solution :**
### Défi n°3 : L'Orchestration des Tâches avec Turbo
**Le Problème :** La commande `npx turbo run db:generate` échouait car Turborepo ne savait pas que cette tâche existait.
**La Solution :**
### Conclusion du Chapitre 1
*   Le moteur Python répond "OK".
*   La base de données est provisionnée avec un schéma générique.
*   Le frontend Next.js est prêt à démarrer.
```

============================================================
FILE: Book\sprint1.md (SKELETON)
============================================================
```md
# Chapitre 2 : Sprint 1 - Le Lien Neuronal

## 1. Objectif du Sprint

Une fois l'usine construite (Sprint 0), nous avions deux cerveaux isolés : le cerveau gauche (Next.js) capable de gérer l'utilisateur, et le cerveau droit (Python) capable de calculer. Le but du Sprint 1 était de créer une synapse artificielle entre eux.

Le défi n'était pas seulement technique ("faire une requête HTTP"), mais architectural : **Comment garantir que seul notre frontend Next.js puisse solliciter le moteur de calcul, tout en protégeant ce dernier du monde extérieur ?**

## 2. Le Pattern "Backend-for-Frontend" (BFF)

Nous avons choisi d'utiliser Next.js non seulement comme un serveur de rendu (SSR), mais comme une **API Gateway**.

Dans notre architecture, le navigateur du client ne parle **jamais** directement à Python.
*   ❌ *Mauvais :* `Browser` -> `Python API` (Problèmes de CORS, d'authentification double, d'exposition de l'IP).
*   ✅ *Bon (Notre choix) :* `Browser` -> `Next.js Server Action` -> `Python API`.
## 3. Sécurité : Le Secret Partagé (Internal Secret)
## 4. Le Contrat d'Interface (Payload JSON)
}
*   **Côté Python (Pydantic) :** Ce JSON est automatiquement validé et converti en objets Python typés. Si Next.js envoie un champ manquant, Python renvoie une erreur explicite avant même de lancer le calcul.
*   **Côté TypeScript :** Nous avons typé le payload pour garantir que les développeurs frontend envoient des structures conformes.
## 5. Rétrospective : Pourquoi le "Server Action" change tout ?
*   **Gain de sécurité :** La clé API secrète ne quitte jamais le serveur. Elle n'est pas visible dans le code source du navigateur ("Network Tab").
*   **Simplicité :** Pas de gestion de `JSON.stringify` ou de headers côté client. L'appel ressemble à un simple appel de fonction JavaScript.
### Conclusion du Chapitre 2
```

============================================================
FILE: Book\sprint2.md (SKELETON)
============================================================
```md
# Chapitre 3 : Sprint 2 - L'Interface Polymorphe

## 1. Le Piège de l'Interface "Métier"

Dans le développement d'applications industrielles, l'erreur classique est de créer des composants React nommés `<TankCard />`, `<PumpWidget />` ou `<SolarPanel />`.

Cette approche semble naturelle au début, mais elle devient un cauchemar de maintenance. Si vous voulez créer **QuantumEnergy** après **QuantumH2O**, vous devez dupliquer et renommer tous vos composants. Le code devient rigide.

L'objectif du Sprint 2 était de briser ce lien. Nous voulions une interface **agnostique** qui ne connaît rien au métier, mais qui sait tout afficher.

## 2. Le concept de "Domain Manifest"

Nous avons introduit un fichier de configuration central : `domain-config.ts`. C'est l'ADN du produit.

```typescript
// Ce simple objet transforme l'application
  }
};
## 3. Le Moteur de Rendu Visuel (ReactFlow)
**Résultat :** Pour ajouter un nouvel équipement dans le logiciel, il n'y a plus de code React à écrire. Il suffit d'ajouter 3 lignes dans le fichier JSON de configuration.
## 4. Gestion d'État (Zustand)
## 5. Rétrospective : Le Défi du Styling (Tailwind v4)
**Le Problème :**
**La Résolution :**
*Leçon apprise :* Dans un environnement Monorepo (Turborepo), la gestion des dépendances "peer" (comme PostCSS/Tailwind) doit être explicite dans chaque sous-projet (`apps/studio`) pour éviter les conflits de résolution.
```

============================================================
FILE: Book\sprint3.md (SKELETON)
============================================================
```md
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
## 4. Rétrospective : Les Pièges de la Configuration de Base de Données
*   **Le Défi du Localhost :** Sur Windows, la résolution de `localhost` vers Docker est souvent instable pour les drivers Node.js. Nous avons résolu les erreurs de connexion (P1001) en basculant sur l'adresse IP explicite `127.0.0.1`.
*   **L'Isolation des Secrets :** Dans un Monorepo, Prisma ne charge pas toujours automatiquement le fichier `.env` du dossier parent. Nous avons dû forcer le chargement des variables d'environnement via un fichier `prisma.config.ts` explicite utilisant l'helper `env()`.
*   **L'Instanciation du Client :** Nous avons appris que `new PrismaClient()` ne suffit plus lorsque l'`url` est absente du schéma. Il faut lui injecter manuellement l'adaptateur de driver configuré avec le Pool de connexion PostgreSQL.
```

============================================================
FILE: Book\sprint4.md (SKELETON)
============================================================
```md
# Chapitre 5 : Sprint 4 - L'Intelligence des Objets

## 1. De la Forme à la Fonction
Un logiciel d'ingénierie se distingue d'un outil de dessin par sa capacité à porter de la donnée métier. L'objectif du Sprint 4 était de transformer nos "Nœuds" génériques en véritables fiches techniques interactives.

Nous avons relevé un défi architectural : comment créer un éditeur de propriétés sans savoir à l'avance quels champs seront nécessaires (Volume pour l'eau, Tension pour l'énergie, etc.) ?

## 2. Le Moteur de Rendu de Formulaires (Schema-Driven UI)
Nous avons implémenté un **Générateur de Formulaire Dynamique**. Au lieu de coder des composants `<InputVolume />`, nous avons créé un composant `PropertiesPanel` qui :
1. Détecte le type de l'objet sélectionné.
2. Lit la `FieldDefinition` dans le Manifeste du Domaine.
3. Génère les champs (Input, Select, Number) à la volée.

Cette approche garantit que Quantum Core reste 100% agnostique. Le code du panneau de droite est le même pour tous les métiers ; seul le fichier de configuration change.

## 3. Synchronisation d'État et UX
## 4. Rétrospective : La Puissance de l'Abstraction
*   Nous pouvons ajouter un paramètre "Viscosité" à une cuve en modifiant une seule ligne de JSON.
*   L'interface s'adapte instantanément.
*   La base de données accepte la donnée sans broncher.
*   Le développeur n'a pas touché au code "Core".
```

============================================================
FILE: Book\sprint5.md (SKELETON)
============================================================
```md
C'est une étape historique pour le projet. Nous avons prouvé que **Quantum Core** n'est pas qu'un outil de dessin, mais un cerveau capable de traiter des données physiques complexes.

Voici le **Chapitre 6** pour ton livre technique, documentant cette réussite, suivi du lancement du **Sprint 6**.

***

# Chapitre 6 : Sprint 5 - Le Réveil de l'Intelligence

## 1. La Fin de l'Amnésie Physique
Jusqu'au sprint précédent, Quantum Core était une "coquille vide" : il stockait des données mais ne les comprenait pas. L'objectif du Sprint 5 était de boucler la boucle cybernétique : **Interface $\rightarrow$ Serveur $\rightarrow$ Moteur de Calcul $\rightarrow$ Interface**.

Nous avons implémenté le premier véritable échange asynchrone entre l'orchestrateur Next.js et l'expert Python en utilisant des données saisies en temps réel par l'utilisateur.

## 2. Le Mapping de Données (Payload Transformation)
L'un des défis techniques a été la transformation du graphe visuel (ReactFlow) en un modèle mathématique exploitable. 
*   ReactFlow manipule des objets lourds contenant des informations de rendu (coordonnées pixel, état de drag, etc.).
*   Nous avons développé un "Mapper" dans la Server Action qui nettoie ces données pour n'extraire que la substantifique moelle : le type de nœud et son dictionnaire de propriétés JSONB.
## 3. L'Analyse Topologique en Python
## 4. L'Interface de Feedback (Dashboard d'Analyse)
# Sprint 6 : Le Flux de Masse (Hydraulique & Connexions)
**Objectif :** Faire circuler "quelque chose" dans les tuyaux. 
### 1. Mise à jour du Manifeste (`lib/domain-config.ts`)
// apps/studio/lib/domain-config.ts
  // ... nodeTypes ...
    }
  }
};
### 2. Le Moteur Python : Loi des Nœuds (Bilan de Masse)
*   Pour chaque cuve, Python va calculer : `Somme(Entrées) - Somme(Sorties)`.
*   Si le résultat n'est pas zéro, il enverra un **Alerte de Débordement** ou de **Vidange**.
### 3. UI : Édition des liens
### Pourquoi c'est le "vrai" début de Quantum ?
**Es-tu prêt à coder la logique des flux ?**
```

============================================================
FILE: Book\sprint6.md (SKELETON)
============================================================
```md
C'est une étape symbolique. En implémentant la loi de conservation de la masse, vous venez de transformer un simple éditeur de schémas en un **Jumeau Numérique (Digital Twin)** rudimentaire. Votre logiciel "comprend" maintenant les conséquences physiques des choix de l'ingénieur.

Voici le **Chapitre 7** pour votre livre technique, suivi du lancement du **Sprint 7**.

***

# Chapitre 7 : Sprint 6 — La Dynamique des Flux

## 1. De la Statique à la Cinétique
Jusqu'ici, Quantum Core ne traitait que des données isolées (le volume d'une cuve). L'objectif du Sprint 6 était de donner vie aux interconnexions. En ingénierie, un système est défini par ce qui circule entre ses composants. 

Nous avons introduit la notion de **Lien Porteur de Données** (Smart Edges). Un tuyau n'est plus seulement une ligne graphique, c'est un objet possédant ses propres attributs physiques, comme le débit horaire ($m^3/h$).

## 2. Abstraction des Edges
Fidèles à notre philosophie de "Meta-Modélisation", nous avons étendu le Manifeste du Domaine pour inclure les `edgeTypes`. Cela permet à l'interface de générer dynamiquement des panneaux de configuration pour les liaisons, exactement comme pour les équipements. Cette symétrie architecturale entre Nœuds et Liens est la clé de la flexibilité de Quantum Core.
## 3. Le Premier "Juge" Physique : Le Bilan de Masse
*   **Résultat > 0** : Risque de débordement.
*   **Résultat < 0** : Risque de désamorçage ou vidange.
## 4. Rétrospective : La Gestion des Sélections Hybrides
# Sprint 7 : Le Catalogue et le "Sizing" (Dimensionnement)
**Objectif :** Ne plus saisir des valeurs au hasard, mais choisir du matériel réel. 
### 1. La Base de Données "Catalogue"
### 2. UI : Le Sélecteur de Composant
### 3. Intelligence : Le "Auto-Fill" et la Validation
*   Quand l'utilisateur choisit une pompe de 12 $m^3/h$ dans le catalogue, le champ `flowRate` du nœud se remplit tout seul.
*   Le moteur Python pourra alors comparer la performance de l'équipement choisi avec le besoin réel du système.
### Pourquoi c'est l'étape cruciale pour le business ?
**Es-tu prêt à intégrer le catalogue d'équipements ?**
```

============================================================
FILE: quantum-core\README.md (SKELETON)
============================================================
```md
# Quantum Core

This repository contains the source code for Quantum Core, an Engineering OS for process simulation and optimization.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

-   `apps/studio`: a [Next.js](https://nextjs.org/) application that provides the main user interface for Quantum Core.
-   `apps/engine`: a [Python](https://www.python.org/) application that contains the core simulation and optimization engine.
-   `docs/user-guide`: a [Nextra](https://nextra.site/) site for the user documentation.
-   `packages/database`: a [Prisma](https://www.prisma.io/) package for database management.
-   `packages/ui`: a stub React component library shared by the `studio` application.
### Documentation
### Development
### Build
```

============================================================
FILE: quantum-core\docker-compose.yml (FULL)
============================================================
```yml
services:
  # 1. Base de données
  postgres:
    image: postgres:15-alpine
    container_name: qcore_db
    environment:
      POSTGRES_USER: ${POSTGRES_USER} 
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5434:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # 2. Moteur de Calcul (Python)
  engine:
    build: ./apps/engine
    container_name: qcore_engine
    ports:
      - "8000:8000"
    volumes:
      - ./apps/engine:/app
    environment:
      - INTERNAL_API_SECRET=${INTERNAL_API_SECRET} 
      - PYTHONUNBUFFERED=1

  # 3. Studio (Préparation pour le futur ou le déploiement)
  # studio:
  #   build: 
  #     context: .
  #     dockerfile: apps/studio/Dockerfile.dev
  #   ports:
  #     - "3000:3000"
  #   volumes:
  #     - .:/app
  #     - /app/node_modules
  #     - ./apps/studio/public/uploads:/app/apps/studio/public/uploads # Persistance des images
  #   environment:
  #     - DATABASE_URL=postgresql://quantum:password@postgres:5432/quantum_core
  #     - ENGINE_URL=http://engine:8000

volumes:
  postgres_data:
```

============================================================
FILE: quantum-core\package.json (FULL)
============================================================
```json
{
  "name": "quantum-core",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "check-types": "turbo run check-types"
  },
  "devDependencies": {
    "prettier": "^3.7.4",
    "turbo": "^2.7.3",
    "typescript": "5.9.2"
  },
  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=18"
  }
}

```

============================================================
FILE: quantum-core\pnpm-workspace.yaml (SKELETON)
============================================================
```yaml
packages:
  - "apps/*"
  - "packages/*"

```

============================================================
FILE: quantum-core\turbo.json (SKELETON)
============================================================
```json
{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "db:generate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    }
  }
}

```

============================================================
FILE: quantum-core\.vscode\settings.json (SKELETON)
============================================================
```json
{
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ]
}

```

============================================================
FILE: quantum-core\apps\engine\main.py (FULL)
============================================================
```py
# apps/engine/main.py
import os
import logging
import json
import asyncio
import secrets  # Pour une comparaison de secret sécurisée
from fastapi import FastAPI, Header, HTTPException, Depends, Request 
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Callable

# --- REGISTRE DES SOLVEURS (ENGINEERING OS PATTERN) ---
# Centralise ici les points d'entrée des domaines. 
# main.py ne connaît plus la logique interne des domaines.
from domains.surface_treatment.solver import run_surface_simulation_stream

SOLVER_REGISTRY: Dict[str, Callable] = {
    "SURFACE_TREATMENT": run_surface_simulation_stream,
    # "AI_FACTORY": run_ai_factory_stream, <-- Futur domaine
}

import orchestrator 

# --- CONFIGURATION DU LOGGING (JSON) ---
class JsonFormatter(logging.Formatter):
    STANDARD_ATTRS = {
        'args', 'asctime', 'created', 'exc_info', 'exc_text', 'filename',
        'funcName', 'levelname', 'levelno', 'lineno', 'module',
        'msecs', 'message', 'msg', 'name', 'pathname', 'process',
        'processName', 'relativeCreated', 'stack_info', 'thread', 'threadName'
    }

    def format(self, record):
        log_entry = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "module": record.module,
            "lineNo": record.lineno,
        }
        if record.exc_info:
            log_entry["exc_info"] = self.formatException(record.exc_info)
        for key, value in record.__dict__.items():
            if key not in self.STANDARD_ATTRS and not key.startswith('_'):
                log_entry[key] = value
        return json.dumps(log_entry)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("quantum-core-engine")

console_handler = logging.StreamHandler()
console_handler.setFormatter(JsonFormatter())
logger.handlers = [console_handler]
logger.propagate = False

# --- INITIALISATION ---
app = FastAPI(
    title="Quantum Core Engine",
    description="Engineering OS Multi-Domaine",
    version="4.0.0"
)

INTERNAL_SECRET = os.getenv("INTERNAL_API_SECRET")

@app.on_event("startup")
async def startup_event():
    if not INTERNAL_SECRET:
        logger.error("CRITICAL: INTERNAL_API_SECRET is not set in environment variables!")
        # En production, on pourrait forcer l'arrêt ici

# --- MODÈLES DE DONNÉES (Génériques) ---

class Node(BaseModel):
    id: str
    type: str
    properties: Dict[str, Any] = {}
    inputStreamId: Optional[str] = None
    outputStreamId: Optional[str] = None

class Edge(BaseModel):
    source: str
    target: str
    type: Optional[str] = "DEFAULT"
    properties: Dict[str, Any] = {}

class Sequence(BaseModel):
    id: str
    name: Optional[str] = "Sequence"
    steps: List[str]
    properties: Dict[str, Any] = {}

class ProjectStream(BaseModel):
    id: str
    name: str
    value: Dict[str, Any] = Field(default_factory=dict)

class SystemPayload(BaseModel):
    id: str
    type: str = "PRODUCTION"
    nodes: List[Node]
    edges: List[Edge]
    sequences: List[Sequence] = []

class SimulationPayload(BaseModel):
    domain: str
    nodes: List[Node]
    edges: List[Edge]
    sequences: List[Sequence] = []
    library: Optional[Dict[str, Any]] = None
    project_settings: Optional[Dict[str, Any]] = {}

class ProjectPayload(BaseModel):
    projectId: str
    domain: str
    systems: List[SystemPayload]
    streams: List[ProjectStream]
    library: Optional[Dict[str, Any]] = None
    project_settings: Optional[Dict[str, Any]] = {}

# --- SÉCURITÉ ---

async def verify_secret(x_internal_secret: str = Header(None)):
    """
    Vérification Zero-Trust avec protection contre les attaques temporelles.
    """
    if not INTERNAL_SECRET:
        raise HTTPException(status_code=500, detail="Server misconfigured: Secret missing")
    
    # compare_digest évite de révéler quelle partie du secret est correcte via le temps de réponse
    if not x_internal_secret or not secrets.compare_digest(x_internal_secret, INTERNAL_SECRET):
        logger.warning("Tentative d'accès non autorisée rejetée.")
        raise HTTPException(status_code=403, detail="Forbidden: Invalid API Secret")

# --- ROUTES API ---

@app.post("/simulate-stream", dependencies=[Depends(verify_secret)])
async def simulate_stream(payload: SimulationPayload):
    """
    Endpoint de Streaming Agnostique.
    Détermine le solveur dynamiquement via le registre.
    """
    logger.info(f"Simulation demandée pour le domaine: {payload.domain}")

    solver_func = SOLVER_REGISTRY.get(payload.domain)
    
    if not solver_func:
        logger.error(f"Domaine non supporté: {payload.domain}")
        raise HTTPException(status_code=400, detail=f"Domaine {payload.domain} non supporté par ce moteur.")

    try:
        # Conversion unique du payload pour NumPy/Logic métier
        # model_dump est plus performant que json.loads(payload.json())
        data = payload.model_dump()

        return StreamingResponse(
            solver_func(
                data['nodes'],
                data['edges'],
                data['sequences'],
                data['library'],
                data['project_settings']
            ),
            media_type="application/x-ndjson"
        )
    except Exception as e:
        logger.error(f"Erreur Solveur [{payload.domain}]: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erreur interne du solveur: {str(e)}")


@app.post("/simulate", dependencies=[Depends(verify_secret)])
async def simulate(payload: SimulationPayload):
    """
    Version Synchrone de /simulate-stream. 
    Utile pour les outils de test ou les intégrations Legacy.
    """
    # On réutilise la logique de streaming mais on consomme tout avant de répondre
    response = await simulate_stream(payload)
    
    final_result = None
    errors = []

    async for chunk in response.body_iterator:
        if not chunk.strip(): continue
        for line in chunk.decode().split('\n'):
            if not line.strip(): continue
            try:
                msg = json.loads(line)
                if msg.get('type') == 'result':
                    final_result = msg['data']
                elif msg.get('type') == 'error':
                    errors.append(msg['message'])
            except json.JSONDecodeError:
                continue

    if errors:
        raise HTTPException(status_code=400, detail=errors)
    
    if final_result:
        return final_result
    
    raise HTTPException(status_code=500, detail="Le solveur n'a retourné aucun résultat final.")


@app.post("/solve-project", dependencies=[Depends(verify_secret)])
async def solve_project(payload: ProjectPayload):
    """
    Orchestrateur global pour les projets complexes (System of Systems).
    """
    logger.info(f"Orchestration globale du projet: {payload.projectId}")
    try:
        return await orchestrator.solve(payload)
    except Exception as e:
        logger.error(f"Erreur Orchestration: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# --- AUTRES POINTS D'ENTRÉE ---

@app.post("/evaluate-node", dependencies=[Depends(verify_secret)])
async def evaluate_node(payload: Dict[str, Any]):
    """
    Calcul local ultra-rapide sans graphe complet.
    """
    return {"computed": {}}

@app.get("/health")
async def health_check():
    """Vérification d'état pour Docker/K8s"""
    return {"status": "online", "domains_ready": list(SOLVER_REGISTRY.keys())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

============================================================
FILE: quantum-core\apps\engine\orchestrator.py (SKELETON)
============================================================
```py
import logging
import json
import asyncio
from collections import deque
from typing import List, Dict, Any

# Import du solveur
from domains.surface_treatment.solver import run_surface_simulation_stream

logger = logging.getLogger("orchestrator")

async def solve(payload: Any):
    """
    Point d'entrée principal pour la résolution d'un projet "System of Systems".
    """
    # Registre des flux (Bus de données)
    }
    # 1. Calcul de l'ordre
    # 2. Boucle de résolution
        # A. Injection des Inputs depuis le Bus
                # Optionnel : injecter aussi les concentrations entrantes si le solveur le supporte
        # B. Exécution du Solver Local
            # --- CORRECTION CRITIQUE : Conversion Pydantic -> Dict ---
            # Appel du générateur
            )
            # Consommation du flux pour obtenir le résultat final
            # C. Publication des Outputs vers le Bus
                    # Mélange Physique (Moyenne pondérée par le débit)
                    }
    }
def calculate_execution_order(systems: List[Any]) -> List[str]:
  // ... implementation hidden for brevity ...
    # Mapping Stream -> Producer System
    # Graphe de dépendance
    # Algorithme de Kahn
    # Fallback si cycle
```

============================================================
FILE: quantum-core\apps\engine\.pytest_cache\README.md (SKELETON)
============================================================
```md
# pytest cache directory #

This directory contains data from the pytest's cache plugin,
which provides the `--lf` and `--ff` options, as well as the `cache` fixture.

**Do not** commit this to version control.

See [the docs](https://docs.pytest.org/en/stable/how-to/cache.html) for more information.

```

============================================================
FILE: quantum-core\apps\engine\domains\surface_treatment\__init__.py (SKELETON)
============================================================
```py

```

============================================================
FILE: quantum-core\apps\engine\domains\surface_treatment\solver.py (SKELETON)
============================================================
```py
# apps/engine/domains/surface_treatment/solver.py

import numpy as np
import logging
import json
import asyncio
import traceback

logger = logging.getLogger("st_solver")

def safe_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default
    # Ajout d'une liste locale de warnings qui sera fusionnée avec le global plus tard
        # --- LECTURE DES PARAMÈTRES GLOBAUX D'ÉVAPORATION ---
        # --- 1. PARAMÈTRES TEMPORELS ---
        # --- 2. LOGISTIQUE : CALCUL DU DRAG-OUT (Entraînement) ---
        # --- 3. CHIMIE : PRÉPARATION DES CIBLES (FLATTENING) ---
        # Correction 3: Utiliser la structure de librairie formatée pour Python (referenceItems)
        # Conserver le lib_map des unités de base (ions) pour les compositions futures
        # base_units_map = {item['id']: item for item in library.get('baseUnits', [])}
                # print(f"DEBUG_BATH: reagents:  {reagents}") # Maintenu pour le debug si besoin
                    # --- RUPTURE FIXÉE ICI ---
                    # --- DÉBUT DU BLOC CORRIGÉ / ROBUSTE ---
                    # Accumulateur temporaire pour les ions purs : {ion_id: coefficient_total}
                    # Le solveur doit gérer 2 niveaux de récursivité pour l'instant (Produit Commercial -> Réactif -> Ion)
                            # Cas 1 : Le produit se décompose directement en ION (Niveau 1)
                            # Cas 2 : Le produit se décompose en un AUTRE produit (Niveau 2)
                                    # Le calcul clé est ici : multiplication des proportions N1 * N2
                    # Finalisation : Accumuler la concentration totale
                        # Multiplication unique par la concentration utilisateur (prod_conc)
                        # print(f"DEBUG_BATH: Ion {ion_id} target set to: {ionic_targets[n['id']][ion_id]}") # Maintenu pour le debug
        # --- 4. HYDRAULIQUE : ÉVAPORATION, VIDANGES ET APPOINTS ---
        # Le warnings sera local_warnings pour l'instant, fusionné à la fin
        # A. INTEGRATION DES VIDANGES (DUMPING)
        # B. CALCUL DE L'ÉVAPORATION ET APPOINT ASSOCIÉ
        # C. STABILISATION DES CASCADES DE RINÇAGE
        # --- 5. CHIMIE : RÉSOLUTION Ax = b ---
        # Calcul des ajouts chimiques (Masse)
                    # Calcul des inputs contaminés
                    # Ajout d'une protection contre les inputs qui n'existent pas
        # --- Injection des cibles ioniques et fusion des warnings ---
        # Ajout des débits In/Out calculés dans le résultat final pour les nœuds
        # --- 6. FINALISATION ET KPIS ---
        # Fusion des warnings locaux et warnings globaux du solveur
        # Correction 5: Utilisation du logger standard Python pour le terminal
```

============================================================
FILE: quantum-core\apps\engine\tests\test_st_advanced.py (SKELETON)
============================================================
```py
# apps/engine/tests/test_st_advanced.py
import pytest
import json
from domains.surface_treatment.solver import run_surface_simulation_stream

@pytest.mark.asyncio
async def test_cascade_and_evaporation_physics():
    # 1. SETUP NODES
    nodes = [
        {"id": "source", "type": "SOURCE", "label": "Water", "properties": {}},
        {
            "id": "bath", "type": "PROCESS_BATH", "label": "Hot Acid",
            "properties": {
                "length": 1000, "width": 1000, "temp": 70, # Evap calculation
                "hasEvaporation": True,
            }
            }
    # 2. SETUP LOGISTICS (Bath -> R1 -> R2)
    # 3. SETUP LIBRARY (Flattening: Product -> Reagent -> Ion)
    }
    # 4. EXECUTE
    # --- 5. PHYSICAL VERIFICATIONS ---
    # A. Test Evaporation + Drag-out Compensation
    # Evap efficace = 4.2 L/h. Perte Drag-out = 10 L/h. 
    # Total "In" pour le bain doit être 14.2 L/h
    # B. Test Cascade Hydraulics (CORRIGÉ)
    # Rinse 2 reçoit 200 (eau) + 10 (pièces). Il déborde de 210 vers Rinse 1.
    # Rinse 1 reçoit 210 (eau) + 10 (pièces). Il sort 10 (pièces) + 210 (débordement).
    # Total "Out" de Rinse 1 = 220.0 L/h
    # C. Test de l'Équilibre de Masse (Uniquement pour les cuves de process)
    # On crée un dictionnaire pour accéder facilement aux types des nœuds
        # On n'équilibre pas les sources (elles fournissent) 
        # ni les drains (ils collectent)
        # Pour tout le reste (Bains, Rinçages), l'équilibre doit être parfait
```

============================================================
FILE: quantum-core\apps\engine\tests\test_st_solver.py (SKELETON)
============================================================
```py
# apps/engine/tests/test_st_solver.py
import pytest
import json
import asyncio
from domains.surface_treatment.solver import run_surface_simulation_stream

@pytest.mark.asyncio
async def test_simple_dilution_logic():
    # 1. PRÉPARATION DES DONNÉES (Mock du payload Studio)
    nodes = [
        {
            "id": "node_bath",
            "type": "PROCESS_BATH",
            "label": "Bain Actif",
            "properties": {
            }
            }
        }
            }
        }
            }
    }
    }
    # 2. EXÉCUTION DU SOLVEUR
    # 3. VERIFICATIONS (ASSERTIONS)
    # Vérification de la concentration dans le rinçage (Doit être 10.0 g/L)
    # Formule : (10 L/h * 100 g/L) / (10 L/h + 90 L/h) = 10 g/L
    # Vérification du flux à l'égout (100 L/h)
```

============================================================
FILE: quantum-core\apps\studio\README.md (SKELETON)
============================================================
```md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## Learn More
## Deploy on Vercel
```

============================================================
FILE: quantum-core\apps\studio\auth.config.ts (FULL)
============================================================
```ts
// apps/studio/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // 1. On ajoute le rôle au JWT lors de la connexion
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // 2. On transmet le rôle du JWT vers la session accessible par le Middleware/UI
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // <--- CRUCIAL
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      
      // Si on tente d'aller sur /admin...
      if (isAdminRoute) {
        // @ts-ignore
        if (isLoggedIn && auth.user.role === "ADMIN") return true;
        return false; // Bloque et redirige
      }
      return true;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;
```

============================================================
FILE: quantum-core\apps\studio\auth.ts (SKELETON)
============================================================
```ts
// apps/studio/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@repo/database";
import { authConfig } from "./auth.config";
import Nodemailer from "next-auth/providers/nodemailer";

// C'est cette ligne qui manquait ou était incomplète
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  basePath: "/api/auth", // Force le chemin sans locale
  providers: [
    Nodemailer({
        }
```

============================================================
FILE: quantum-core\apps\studio\eslint.config.js (SKELETON)
============================================================
```js
import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default nextJsConfig;

```

============================================================
FILE: quantum-core\apps\studio\middleware.ts (FULL)
============================================================
```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

const locales = ['fr', 'en'];
const defaultLocale = 'fr';

// 1. TYPAGE INTERNE POUR LA SÉCURITÉ DU CODE
interface NextAuthRequest extends NextRequest {
  auth: {
    user?: {
      id?: string;
      role?: string;
    }
  } | null;
}

function getLocale(request: NextRequest): string {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0]);
    for (const lang of languages) {
      if (locales.includes(lang)) {
        return lang;
      }
    }
  }
  return defaultLocale;
}

// 2. LOGIQUE DU MIDDLEWARE
// Note : On ne met pas 'export default' ici directement pour éviter l'erreur d'inférence
const middleware = auth((req) => {
  // On cast 'req' pour avoir l'autocomplétion sur 'req.auth' à l'intérieur
  const request = req as NextAuthRequest;
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // A. EXCLUSION
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // B. LOCALE
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const search = nextUrl.search;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}${search}`, request.url)
    );
  }

  // C. SÉCURITÉ
  const isLoggedIn = !!request.auth;
  const userRole = request.auth?.user?.role; 

  const currentLocale = pathname.split('/')[1] || defaultLocale;
  const isAdminRoute = pathname.startsWith(`/${currentLocale}/admin`);

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/${currentLocale}/login?callbackUrl=${callbackUrl}`, nextUrl.origin)
      );
    }
    
    if (userRole !== "ADMIN") {
      console.warn(JSON.stringify({
        level: "WARN",
        type: "SECURITY_AUDIT",
        event: "UNAUTHORIZED_ADMIN_ACCESS",
        userId: request.auth?.user?.id || "unknown",
        role: userRole || "unknown",
        path: pathname,
        ip: request.headers.get('x-forwarded-for') || "unknown",
        timestamp: new Date().toISOString()
      }));

      return NextResponse.redirect(
        new URL(`/${currentLocale}/dashboard`, nextUrl.origin)
      );
    }
  }

  return NextResponse.next();
});

// 3. EXPORT FINAL AVEC CAST
// C'est cette ligne qui corrige l'erreur "The inferred type..."
// On dit à TypeScript : "C'est bon, exporte ça comme un objet générique, ne cherche pas plus loin."
export default middleware as any; 

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
```

============================================================
FILE: quantum-core\apps\studio\next-env.d.ts (SKELETON)
============================================================
```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

============================================================
FILE: quantum-core\apps\studio\next.config.js (FULL)
============================================================
```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

```

============================================================
FILE: quantum-core\apps\studio\package.json (FULL)
============================================================
```json
{
  "name": "studio",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "eslint --max-warnings 0",
    "check-types": "next typegen && tsc --noEmit"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.11.1",
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@radix-ui/react-tabs": "^1.1.13",
    "@repo/database": "workspace:*",
    "@repo/ui": "workspace:*",
    "@tailwindcss/typography": "^0.5.19",
    "@xyflow/react": "^12.10.0",
    "clsx": "^2.1.1",
    "gray-matter": "^4.0.3",
    "groq-sdk": "^0.37.0",
    "jszip": "^3.10.1",
    "katex": "^0.16.27",
    "lucide-react": "^0.562.0",
    "next": "16.1.0",
    "next-auth": "5.0.0-beta.30",
    "nodemailer": "^7.0.12",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-markdown": "^10.1.0",
    "react-syntax-highlighter": "^16.1.0",
    "rehype-katex": "^7.0.1",
    "remark-gfm": "^4.0.1",
    "remark-math": "^6.0.0",
    "sharp": "^0.34.5",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "uuid": "^13.0.0",
    "zod": "3.24.1",
    "zustand": "^5.0.9"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@tailwindcss/postcss": "^4.1.18",
    "@types/next": "^9.0.0",
    "@types/node": "^22.15.3",
    "@types/react": "19.2.2",
    "@types/react-dom": "19.2.2",
    "@types/react-syntax-highlighter": "^15.5.13",
    "@types/uuid": "^11.0.0",
    "autoprefixer": "^10.4.23",
    "eslint": "^9.39.1",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "typescript": "5.9.2"
  }
}

```

============================================================
FILE: quantum-core\apps\studio\postcss.config.js (SKELETON)
============================================================
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
}

```

============================================================
FILE: quantum-core\apps\studio\tailwind.config.ts (SKELETON)
============================================================
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. Définition des Keyframes (les mouvements)
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
        // Animation pour l'effet de brillance sur la carte "Engine"
        // Animation pour le texte dégradé du Hero
      // 2. Définition des utilitaires d'animation
};
export default config;
```

============================================================
FILE: quantum-core\apps\studio\tsconfig.json (FULL)
============================================================
```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "next-env.d.ts",
    "next.config.js",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

```

============================================================
FILE: quantum-core\apps\studio\app\actions\admin-blog.ts (SKELETON)
============================================================
```ts
'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import JSZip from 'jszip';
import matter from 'gray-matter';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

const UpdatePostSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, "Titre requis").max(200),
  content: z.string().min(1, "Contenu requis"),
export async function exportBlogToZipAction() {
  // ... implementation hidden for brevity ...
}
export async function importBlogFromZipAction(base64Zip: string) {
  // ... implementation hidden for brevity ...
          }
      }
        }
    }
  }
}
export async function updatePostAction(prevState: any, formData: FormData) {
  // ... implementation hidden for brevity ...
  }
  }
      }
  }
}
export async function deletePostAction(postId: string) {
  // ... implementation hidden for brevity ...
}
export async function createPostAction() {
  // ... implementation hidden for brevity ...
  // FIX: Fetch the user first
      // FIX: Use 'connect' syntax for relations
      }
    }
}
export async function createTranslationAction(originalPostId: string, targetLanguage: string) {
  // ... implementation hidden for brevity ...
    }
      // FIX: Connect the same author
      }
    }
}
export async function createTutorialAction(title: string, language: string) {
  // ... implementation hidden for brevity ...
      }
  }
}
export async function deleteTutorialAction(tutorialId: string) {
  // ... implementation hidden for brevity ...
    // 1. On détache d'abord tous les articles liés (pour éviter les erreurs de contrainte)
    // 2. On supprime le tutoriel
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\admin-logs.ts (SKELETON)
============================================================
```ts
'use server';

import { db } from '@repo/database';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// Verify Admin privileges
async function requireAdmin() {
  const session = await auth();
  // @ts-ignore - 'role' is injected via auth.config.ts
  if (session?.user?.role !== 'ADMIN') {
    throw new Error("Unauthorized: Admin access required");
  }
}

export async function getLogsAction(filters: { action?: string; search?: string } = {}) {
  // ... implementation hidden for brevity ...
  // Filter by Action Type (Dropdown)
  }
  // Filter by Search (User ID, Domain, or ID)
  }
  // Fetch logs (Limit 100 for performance, could add pagination later)
}
export async function deleteLogAction(logId: string) {
  // ... implementation hidden for brevity ...
}
export async function clearOldLogsAction(daysToKeep: number = 30) {
  // ... implementation hidden for brevity ...
    }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\audit.ts (SKELETON)
============================================================
```ts
'use server';

import { db } from '@repo/database';
import { auth } from '@/auth'; // Pour récupérer l'ID utilisateur

export async function recordAuditLog(action: string, domain?: string, details?: Record<string, any>) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    await db.auditLog.create({
      data: {
        action,
        domain: domain || 'N/A',
        userId: userId, // Peut être null si non connecté
    // Ne pas rejeter l'erreur pour ne pas bloquer l'action principale
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\blog.ts (SKELETON)
============================================================
```ts
'use server';

import { db } from '@repo/database';

// apps/studio/app/actions/blog.ts

export async function getPostBySlug(slug: string, locale: string) {
  const domain = process.env.NEXT_PUBLIC_ACTIVE_DOMAIN || "SURFACE_TREATMENT";
  
  return await db.post.findFirst({
    where: { 
      slug: slug,
      language: locale, // 👈 Strict : l'article doit correspondre à la langue de l'URL
      domain: domain,
      published: true 
          }
        }
      }
    }
}
/**
 * NEW: Helper to find the slug of the SAME post in another language.
 * Used for the Language Switcher in the Header.
 */
export async function getTranslatedSlug(translationId: string, targetLocale: string) {
  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\catalog.ts (SKELETON)
============================================================
```ts
'use server';

import { db } from '@repo/database';
import { auth } from "@/auth";

// --- SECURITY HELPER ---

async function requireAdmin() {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'ADMIN') {
    throw new Error("Non autorisé: Accès administrateur requis.");
  }
}

export async function seedCatalog() {
  // ... implementation hidden for brevity ...
    }
      }
  }
}
// --- CORRECTION DU TYPE ET DE LA LOGIQUE PRISMA ---
export async function getCatalogItems(category: string | string[]) {
  // ... implementation hidden for brevity ...
  // 1. Construction dynamique de la clause Where
    // Si on reçoit un tableau ["REAGENT", "ION"], on utilise l'opérateur IN de Prisma
    // Sinon on fait une égalité simple
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\configuration.ts (SKELETON)
============================================================
```ts
'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from "@/auth";

// --- SECURITY HELPER ---

async function requireAdmin() {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== 'ADMIN') {
    throw new Error("Non autorisé: Accès administrateur requis.");
  }
}
// Validation du format du JSON de configuration
    z.object({
      // ... implementation hidden for brevity ...
      type: z.enum(['string', 'number', 'boolean', 'textarea', 'select']).optional().default('string'),
        // ... implementation hidden for brevity ...
  )
/**
 * Importe un JSON de configuration des champs
 * Format attendu : { "PUMP": [ ...fields ], "TANK": [ ...fields ] }
 * Si une catégorie contient un tableau vide [], la configuration est supprimée (Reset).
 */
export async function importCategorySchemas(domain: string, jsonData: any) {
  // ... implementation hidden for brevity ...
  }
        // LOGIQUE DE RESET : Si le tableau de champs est vide, on supprime la config en base
          // Sinon, on met à jour (Upsert standard)
        }
      }
  }
}
/**
 * Récupère les schémas dynamiques pour l'éditeur
 */
export async function getDynamicSchemas(domain: string) {
  // ... implementation hidden for brevity ...
  // On transforme le tableau DB en objet { "PUMP": fields, ... }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\graph.ts (SKELETON)
============================================================
```ts
'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// ====================================================================
// 1. SÉCURITÉ
// ====================================================================

async function getAuthenticatedSystem(systemId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Authentification requise.");
  }
  // Vérification stricte : le système doit appartenir à un projet de l'utilisateur
    }
  }
}
// ====================================================================
// 2. CHARGEMENT (LOAD) - CORRIGÉ
// ====================================================================
export async function loadGraph(systemId: string) {
  // ... implementation hidden for brevity ...
    // ✅ CORRECTION : On charge TOUT (Nodes, Edges, ET Séquences)
    // On utilise une seule requête relationnelle puissante plutôt que Promise.all
          }
        }
      }
    // Mapping Nodes
    const nodes = system.nodes.map(node => ({
      // ... implementation hidden for brevity ...
      type: node.type, 
      t  // ... implementation hidden for brevity ...
        type: node.type,
          // ... implementation hidden for brevity ...
        // On réinjecte les IDs de streams pour le front
    // Mapping Edges
    const edges = system.edges.map(edge => ({
      // ... implementation hidden for brevity ...
      type: 'default',
        // ... implementation hidden for brevity ...
    // ✅ CORRECTION : Mapping Séquences
    const sequences = system.sequences.map(seq => ({
      // ... implementation hidden for brevity ...
  }
}
// ====================================================================
// 3. SAUVEGARDE (SAVE) - CORRIGÉ
// ====================================================================
export async function saveGraph(systemId: string, nodes: any[], edges: any[], sequences: any[]) {
  // ... implementation hidden for brevity ...
      // ✅ CORRECTION : Suppression SÉQUENTIELLE (Pas de Promise.all)
      // Pour éviter les verrous mortels (Deadlocks) et les erreurs de Clés Étrangères
      // 1. D'abord les petits enfants (Steps)
      // 2. Puis les parents (Sequences)
      // 3. Puis les dépendances (Edges)
      // 4. Enfin les maîtres (Nodes)
      // --- RECRÉATION ---
            type: node.type,
              // ... implementation hidden for brevity ...
            // ✅ CORRECTION : Mapping des colonnes relationnelles (Streams)
            // C'est vital pour que le solveur Python puisse relier les systèmes entre eux
      }
      }
        // Aplanissement des steps (Flatten)
        const allSteps = sequences.flatMap((seq: any) => 
        c  // ... implementation hidden for brevity ...
        }
      }
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\leads.ts (SKELETON)
============================================================
```ts
// apps/studio/app/actions/leads.ts
'use server';

import { db } from '@repo/database';
import { z } from 'zod'; // Install with: pnpm add zod

// 1. Define the schema
const LeadSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  source: z.string().min(1).max(50).optional(),
});

export async function registerLeadAction(email: string, source: string) {
  // 2. Validate input
  const validation = LeadSchema.safeParse({ email, source });
  }
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\library.ts (SKELETON)
============================================================
```ts
'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from "@/auth";

/**
 * Interface étendue pour NextAuth
 */
interface ExtendedUser {
  role?: string;
  id?: string;
}

// --- SECURITY HELPER ---
async function requireAdmin() {
  // ... implementation hidden for brevity ...
  }
}
// --- ACTIONS DE RÉCUPÉRATION ---
export async function getLibrary(domain: string) {
  // ... implementation hidden for brevity ...
  // Récupération optimisée avec tri
      }
}
// --- ACTIONS DE MODIFICATION ---
export async function upsertLibraryItem(domain: string, data: any) {
  // ... implementation hidden for brevity ...
  const LibraryItemSchema = z.object({
    // ... implementation hidden for brevity ...
    composition: z.array(z.object({
      // ... implementation hidden for brevity ...
  const result = await db.$transaction(async (tx) => {
    // ... implementation hidden for brevity ...
    // 1. Upsert de l'item principal (Clé unique sur 'name' assurée par le schéma)
      }
    // 2. Synchronisation de la composition (Delete + Create)
      }
    }
}
export async function deleteLibraryItem(id: string) {
  // ... implementation hidden for brevity ...
  // Empêcher la suppression si l'item est une dépendance
  }
}
// --- LOGIQUE D'IMPORTATION JSON (OPTIMISÉE) ---
export async function importLibraryAction(domain: string, jsonData: any) {
  // ... implementation hidden for brevity ...
  const JSONImportSchema = z.array(z.object({
    // ... implementation hidden for brevity ...
    composition: z.array(z.object({
      // ... implementation hidden for brevity ...
  }
      // ÉTAPE 1 : Création des items parents (Bulk possible si on gère les conflits)
      // On utilise une boucle mais on évite les findUnique redondants
          }
      }
      // ÉTAPE 2 : Reconstruction des liens (Composition)
      // On récupère tous les IDs en une seule fois pour le mapping name -> id
      const nameToIdMap = new Map(allItemsInDomain.map(i => [i.name, i.id]));
        }
      }
  }
}
// --- EXPORTATION ---
export async function exportLibraryData(domain: string, categories?: string[]) {
  // ... implementation hidden for brevity ...
      }
}
// --- UTILITAIRES DE CALCUL (ALGORITHME OPTIMISÉ) ---
/**
 * Aplatit récursivement la nomenclature (BOM) en minimisant les appels DB.
 * Stratégie : Chargement de l'arbre de dépendance complet en une fois.
 */
export async function getFlattenedComposition(itemId: string): Promise<Record<string, number>> {
  // ... implementation hidden for brevity ...
  // 1. On récupère d'abord l'item racine pour connaître son domaine
  // 2. On charge TOUS les liens de composition du domaine pour construire le graphe en mémoire
  // Cela évite le N+1 récursif en base de données.
    }
  // 3. Parcours DFS en mémoire (Ultra rapide)
  function traverse(currentId: string, multiplier: number, path: Set<string>) {
    // ... implementation hidden for brevity ...
    }
    }
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\project.ts (SKELETON)
============================================================
```ts
// 'use server' indique que ce code s'exécute uniquement côté serveur.
// Il a accès direct à la BDD et aux secrets, mais rien ne fuite vers le client.
'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";
import { z } from 'zod';
import { redirect } from 'next/navigation';
// 👇 Import des utilitaires dynamiques du registre (Étape cruciale pour la modularité)
import { isDomainValid } from '@/lib/registry';
// 👇 Import du logger de sécurité
import { logSecurityEvent } from './security';

// ====================================================================
// 1. SCHÉMAS DE VALIDATION (STRICTS)
// ====================================================================
const CreateProjectSchema = z.object({
  // ... implementation hidden for brevity ...
  // L'utilisateur DOIT sélectionner un domaine dans l'interface.
const ProjectSettingsSchema = z.object({
  // ... implementation hidden for brevity ...
// ====================================================================
// 2. HELPER DE SÉCURITÉ (Middleware Interne)
// ====================================================================
/**
 * Vérifie l'authentification ET la propriété du projet.
 * Cette fonction est appelée au début de chaque action sensible.
 */
async function getAuthenticatedProject(projectId: string, userId: string | undefined) {
  // ... implementation hidden for brevity ...
  }
  }
  // Protection IDOR (Insecure Direct Object Reference)
    // On loggue cette tentative d'accès illégal
  }
}
// ====================================================================
// 3. SERVER ACTIONS (API)
// ====================================================================
/**
 * ACTION : Initialiser une nouvelle étude
 */
export async function createProjectAction(formData: FormData) {
  // ... implementation hidden for brevity ...
  // 1. Sécurité de base
  // 2. Sécurité avancée : "Session Fantôme"
  // 3. Préparation des données
  };
  // 4. Validation
    };
  }
  // 5. Exécution DB
      }
    // Création automatique du premier système
        type: "PRODUCTION", 
        t  // ... implementation hidden for brevity ...
      }
    // 🔍 AUDIT LOG
  }
}
/**
 * ACTION : Supprimer une étude
 */
export async function deleteProjectAction(projectId: string) {
  // ... implementation hidden for brevity ...
    // Utilisation d'une clause composite pour la sécurité atomique
        }
    // 🔍 AUDIT LOG
      // Si le delete échoue (ex: IDOR), Prisma lève une erreur RecordNotFound
  }
}
/**
 * ACTION : Renommer une étude
 */
export async function renameProjectAction(projectId: string, newName: string) {
  // ... implementation hidden for brevity ...
  // 1. Vérification des droits
  // 2. Validation
  }
  // 3. Mise à jour
}
/**
 * ACTION : Partager un projet (Ajout collaborateur)
 */
export async function shareProjectAction(projectId: string, email: string) {
  // ... implementation hidden for brevity ...
  }
      }
    // 🔍 AUDIT LOG
  }
}
/**
 * ACTION : Paramètres temporels (Global settings)
 */
export async function updateProjectSettingsAction(projectId: string, data: any) {
  // ... implementation hidden for brevity ...
  }
  // 🔍 AUDIT LOG (Optionnel pour éviter le spam si auto-save, mais utile pour config critique)
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\security.ts (SKELETON)
============================================================
```ts
'use server';

import { db } from '@repo/database';
import { headers } from 'next/headers';

type LogLevel = 'INFO' | 'WARN' | 'CRITICAL';

interface LogPayload {
  action: string;
  message?: string;
  metadata?: Record<string, any>;
  userId?: string;
}

export async function logSecurityEvent(level: LogLevel, payload: LogPayload) {
    // Nettoyage préventif des métadonnées pour ne jamais logger de mots de passe
        }
      }
    // Si le log échoue, on l'affiche juste dans la console serveur pour ne pas crasher l'app
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\sequence.ts (SKELETON)
============================================================
```ts
'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// --- SECURITY HELPERS ---

async function getAuthenticatedSystem(systemId: string, userId: string | undefined) {
  if (!userId) throw new Error("Non autorisé: Session utilisateur requise.");

  const system = await db.system.findUnique({
    where: { id: systemId },
    include: { project: true }
  });
}
async function getAuthenticatedSequence(sequenceId: string, userId: string | undefined) {
  // ... implementation hidden for brevity ...
}
/**
 * Crée une nouvelle séquence (gamme) pour un système donné.
 */
export async function createSequenceAction(systemId: string, name: string, properties: Record<string, any>) {
  // ... implementation hidden for brevity ...
    }
}
/**
 * Met à jour les métadonnées d'une séquence (nom, propriétés).
 */
export async function updateSequenceMetaAction(sequenceId: string, data: { name?: string; properties?: any; }) {
  // ... implementation hidden for brevity ...
    }
}
/**
 * Met à jour les étapes d'une séquence.
 */
export async function updateSequenceStepsAction(sequenceId: string, steps: string[]) {
  // ... implementation hidden for brevity ...
  // On supprime les anciennes étapes et on crée les nouvelles en une seule transaction
}
/**
 * Supprime une séquence.
 */
export async function deleteSequenceAction(sequenceId: string) {
  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\simulation.ts (SKELETON)
============================================================
```ts
'use server';

import { getLibrary } from './library';
import { db } from '@repo/database';
import { loadGraph } from './graph';
import { auth } from "@/auth";
import { getDomainConfig } from '@/lib/registry'; 
import { NodeSchema } from '@/lib/domain-config';
import { logSecurityEvent } from './security';
import { z } from 'zod';

// ====================================================================
// 1. TYPES & SCHÉMAS
// ====================================================================

type AppNodeWithData = {
  // ... implementation hidden for brevity ...
  type: string;
    // ... implementation hidden for brevity ...
    type: string;
      // ... implementation hidden for brevity ...
  };
};
/**
 * Interface pour le retour standardisé des appels moteur
 */
interface EngineResponse<T = any> {
  // ... implementation hidden for brevity ...
}
// ====================================================================
// 2. HELPERS DE SÉCURITÉ & ACCÈS
// ====================================================================
/**
 * Vérifie l'accès à un projet et inclut toute l'arborescence technique.
 * Cette version est optimisée pour charger tout le "System of Systems" en une fois.
 */
async function getAuthenticatedProject(projectId: string, userId: string | undefined) {
  // ... implementation hidden for brevity ...
          }
        }
    }
}
/**
 * Vérifie l'accès à un système spécifique et récupère le Bus Projet (Streams) associé.
 */
async function getAuthenticatedSystem(systemId: string, userId: string | undefined) {
  // ... implementation hidden for brevity ...
  }
}
// ====================================================================
// 3. UTILITAIRES RÉSEAU (BRIDGE NEXT.JS <-> PYTHON)
// ====================================================================
/**
 * Gère la communication HTTP avec le moteur FastAPI.
 * @param endpoint - Route du moteur (ex: /simulate)
 * @param payload - Données JSON structurées
 * @returns Objet standardisé avec succès/erreur et données
 */
async function callEngine(endpoint: string, payload: any): Promise<EngineResponse> {
  // ... implementation hidden for brevity ...
  }
  // SÉCURITÉ : AbortController pour ne pas bloquer le thread Next.js indéfiniment
  const timeoutId = setTimeout(() => controller.abort(), 30000);
    }
    }
  }
}
// ====================================================================
// 4. LOGIQUE DE TOPOLOGIE (LIENS VIRTUELS & DÉDOUBLONNAGE)
// ====================================================================
/**
 * Analyse le Manifeste du Domaine pour transformer les sélections de champs 
 * (ex: 'Alimentation du spray') en arêtes logiques réelles pour le solveur.
 * Cela permet de relier des équipements sans dessiner de tuyaux sur le graphe.
 */
function createVirtualEdges(nodes: AppNodeWithData[], domainManifest: any) {
  // ... implementation hidden for brevity ...
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
      // Un champ 'node-selector' définit un lien logique (ex: un bac A puise dans un bac B)
            type: field.id.toUpperCase(), // Le type de lien permet au solveur de savoir quel flux est concerné
              // ... implementation hidden for brevity ...
        }
      }
}
/**
 * Fusionne les arêtes dessinées (Pipes) et les arêtes logiques (Virtual)
 * en évitant les doublons si l'utilisateur a dessiné ce qui est déjà sélectionné.
 */
function deduplicateEdges(physicalEdges: any[], virtualEdges: any[]) {
  // ... implementation hidden for brevity ...
        type: type,
          // ... implementation hidden for brevity ...
    }
}
/**
 * Prépare la bibliothèque pour NumPy.
 * Transforme les relations Prisma (Noms, Composants) en dictionnaires 
 * indexés par ID pour un calcul matriciel rapide.
 */
function formatLibraryForPython(rawLibrary: any[]) {
  // ... implementation hidden for brevity ...
    };
}
// ====================================================================
// 5. ACTIONS SERVEUR (LOGIQUE MÉTIER)
// ====================================================================
/**
 * SIMULATION D'UN SEUL SYSTÈME (LIGNE DE PRODUCTION)
 * C'est l'action appelée lors du clic sur le bouton "Simuler" dans l'éditeur.
 */
export async function runSimulationAction(domain: string, systemId: string, nodes: any[], edges: any[], sequences: any[]) {
  // ... implementation hidden for brevity ...
    // 1. Chargement du contexte technique
    // 2. Traitement de la topologie hybride (Graph + Paramètres)
    const formattedNodes = nodes.map(n => ({
      // ... implementation hidden for brevity ...
      type: n.type,
        // ... implementation hidden for brevity ...
    // 3. Construction du Payload Physics
        // --- LOGIQUE BUS PROJET ---
        // Si le nœud est connecté à un flux global (Bus), on injecte les données calculées
        // provenant des autres systèmes du projet.
          const stream = projectStreams.find(s => s.id === n.data.properties.inputStreamId);
          }
        }
    };
    // 4. Logging & Exécution
    }
  }
}
/**
 * SIMULATION GLOBALE DU PROJET (SYSTEM OF SYSTEMS)
 * Résout les dépendances entre toutes les lignes de production (ex: rejet ligne 1 -> entrée station).
 */
export async function runGlobalProjectSimulation(projectId: string) {
  // ... implementation hidden for brevity ...
    // Construction du payload incluant TOUS les systèmes du projet
        const sysNodesTyped: AppNodeWithData[] = sys.nodes.map(n => ({
          // ... implementation hidden for brevity ...
          type: sys.type,
            // ... implementation hidden for brevity ...
        };
    };
    // PERSISTANCE : Si le projet est résolu, on met à jour les flux (Bus) en base de données
        )
    }
  }
}
/**
 * POINT D'ENTRÉE POUR LE BILAN TECHNIQUE RÉSUMÉ
 * Récupère le bilan complet (financier, environnemental, ionique) pour le rapport final.
 */
export async function runProjectSummaryAction(projectId: string) {
  // ... implementation hidden for brevity ...
    // Extraction optimisée des données de simulation
    const systemsSummaryPayload = project.systems.map((sys) => {
      // ... implementation hidden for brevity ...
      // Note: On réutilise la logique de topologie pour chaque système
      // Mais ici, on utilise les données déjà chargées dans 'project' (évite le N+1)
      const sysNodesTyped: AppNodeWithData[] = sys.nodes.map(n => ({
        // ... implementation hidden for brevity ...
      };
    }
  }
}
/**
 * ÉVALUATION RÉACTIVE D'UN NŒUD (MICRO-CALCUL)
 * Permet de calculer l'évaporation ou le dimensionnement d'un bac en temps réel lors de la saisie.
 */
export async function evaluateNodeAction(domain: string, nodeType: string, properties: any) {
  // ... implementation hidden for brevity ...
}
/**
 * GÉNÉRATION DE PROPOSITION IA
 * Appelle le moteur LLM pour rédiger un argumentaire technique basé sur le graphe.
 */
export async function generateProposalAction(domain: string, nodes: any[], edges: any[], sequences: any[]) {
  // ... implementation hidden for brevity ...
  const formattedNodes = nodes.map(n => ({
    // ... implementation hidden for brevity ...
  };
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\stream.ts (SKELETON)
============================================================
```ts
'use server';

import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { auth } from "@/auth";

// --- SECURITY HELPERS ---

async function getAuthenticatedProject(projectId: string, userId: string | undefined) {
  if (!userId) throw new Error("Non autorisé: Session utilisateur requise.");
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Projet introuvable.");
  if (project.userId !== userId) throw new Error("Non autorisé: Vous n'êtes pas le propriétaire de ce projet.");
  return project;
}
async function getAuthenticatedSystem(systemId: string, userId: string | undefined) {
  // ... implementation hidden for brevity ...
}
async function getAuthenticatedNode(nodeId: string, userId: string | undefined) {
  // ... implementation hidden for brevity ...
}
// --- ACTIONS ---
export async function updateSystemPosition(systemId: string, x: number, y: number) {
  // ... implementation hidden for brevity ...
    }
}
export async function getProjectTopology(projectId: string) {
  // ... implementation hidden for brevity ...
          }
        }
      }
}
export async function createStreamAction(projectId: string, name: string) {
  // ... implementation hidden for brevity ...
}
export async function getProjectStreams(projectId: string) {
  // ... implementation hidden for brevity ...
    }
}
export async function deleteStreamAction(streamId: string, projectId: string) {
  // ... implementation hidden for brevity ...
  // Sécurité : on s'assure que le stream appartient bien au projet vérifié
    } 
}
/**
 * Connecte un nœud à un flux global
 */
export async function connectNodeToStreamAction(
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\system.ts (SKELETON)
============================================================
```ts
// FILE: apps/studio/app/actions/system.ts
'use server';
import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from "@/auth";

// --- SECURITY HELPERS ---

async function getAuthenticatedProject(projectId: string, userId: string | undefined) {
  if (!userId) throw new Error("Non autorisé: Session utilisateur requise.");
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Projet introuvable.");
  if (project.userId !== userId) throw new Error("Non autorisé: Vous n'êtes pas le propriétaire de ce projet.");
  return project;
}
async function getAuthenticatedSystem(systemId: string, userId: string | undefined) {
  // ... implementation hidden for brevity ...
}
// --- ACTIONS ---
export async function createSystem(projectId: string, name: string, type: string = "PRODUCTION") {
  // ... implementation hidden for brevity ...
      type, // "PRODUCTION" ou "TREATMENT"
    }
  // On revalide et on redirige vers le nouveau système
}
export async function getSystems(projectId: string) {
  // ... implementation hidden for brevity ...
}
export async function deleteSystem(systemId: string, projectId: string) {
  // ... implementation hidden for brevity ...
    } 
}
/**
 * ACTION MANQUANTE : Sauvegarde la position sur le Blueprint
 * Appelé lors du "Drag Stop" sur la vue Master Plan
 */
export async function updateSystemPositionAction(systemId: string, x: number, y: number) {
  // ... implementation hidden for brevity ...
      }
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\actions\upload.ts (SKELETON)
============================================================
```ts
// apps/studio/app/actions/upload.ts
'use server';

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { z } from 'zod';

// 1. Strict File Schema
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const UploadSchema = z.object({
  file: z.instanceof(File, { message: "Fichier requis" })
export async function uploadImageAction(formData: FormData) {
  // ... implementation hidden for brevity ...
  // 2. Validate
  }
  // 3. Processing
    // Silent ignore if exists
  }
  // Resize and convert to WebP for optimization + security (strips metadata)
}
```

============================================================
FILE: quantum-core\apps\studio\app\api\ai-chat\route.ts (FULL)
============================================================
```ts
import { NextRequest } from 'next/server';
import { db } from '@repo/database';
import { auth } from '@/auth';
import { Groq } from 'groq-sdk';
import { recordAuditLog } from '@/app/actions/audit';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const { message, context } = await req.json();

  try {
    // 1. RÉCUPÉRATION DU CONTEXTE TECHNIQUE
    let projectContext = "Aucune donnée de projet disponible.";
    if (context.projectId) {
      const project = await db.project.findUnique({
        where: { id: context.projectId },
        include: { systems: { include: { nodes: true } } }
      });
      if (project) {
        projectContext = `PROJET: ${project.name} | DOMAINE: ${project.domain}
        UNITÉS PROJET: ${project.systems.map(s => 
          s.nodes.map(n => `- ${n.label} (${n.type}): ${JSON.stringify(n.properties)}`).join('\n')
        ).join('\n')}`;
      }
    }

    // 2. APPEL GROQ EN MODE STREAM
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `Vous êtes Quantum AI, expert en ingénierie de surface. 
          Analysez le contexte technique suivant pour aider l'utilisateur. 
          Répondez en Markdown de manière concise et technique.` 
        },
        { role: "user", content: `CONTEXTE:\n${projectContext}\n\nQUESTION: ${message}` }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.2,
      stream: true, // Activation du streaming
    });

    // 3. CRÉATION DU FLUX DE RÉPONSE (ReadableStream)
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    // Log d'audit (sans attendre la fin pour ne pas bloquer le stream)
    recordAuditLog("AI_CHAT_STREAM", context.domain, { message });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error: any) {
    console.error("Groq Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\api\auth\[...nextauth]\route.ts (FULL)
============================================================
```ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

============================================================
FILE: quantum-core\apps\studio\app\api\simulation\stream\route.ts (FULL)
============================================================
```ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { domain, projectId } = body;

  const engineUrl = process.env.ENGINE_URL;
  const secret = process.env.INTERNAL_API_SECRET;

  try {
    // 1. CHARGEMENT DES DONNÉES (Bibliothèque + Projet)
    // On récupère tout ce qui manque au moteur Python
    const [libraryItems, project] = await Promise.all([
        db.libraryItem.findMany({
            where: { domain },
            include: { components: { include: { child: true } } }
        }),
        projectId ? db.project.findUnique({ where: { id: projectId } }) : null
    ]);

    // 2. FORMATAGE DE LA BIBLIOTHÈQUE (Format attendu par Python)
    const formattedLibrary = {
        referenceItems: libraryItems.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            properties: item.properties,
            composition: item.components.map(c => ({
                baseUnitId: c.childId,
                coefficient: c.quantity
            }))
        })),
        baseUnits: libraryItems.filter(i => i.category === 'ION').map(i => ({
            id: i.id,
            properties: i.properties
        }))
    };

    // 3. CALCUL DES SETTINGS PROJET
    // On construit l'objet profiles attendu par le solveur
    let projectSettings = {};
    if (project) {
        // Conversion des champs plats de la DB en structure profiles
        const productionHours = (project.hoursPerDay || 8) * (project.daysPerWeek || 5) * (project.weeksPerYear || 47);
        projectSettings = {
            profiles: {
                production: productionHours,
                heating: 8760, // Par défaut 24/7, ou à ajouter dans le schéma Project
                maintenance: 52 // ex: 1h/semaine
            }
        };
    }

    // 4. CONSTRUCTION DU PAYLOAD COMPLET
    const enrichedBody = {
        ...body,
        library: formattedLibrary,        // On remplace le null
        project_settings: projectSettings // On remplace le {}
    };

    // 5. APPEL AU MOTEUR PYTHON
    const response = await fetch(`${engineUrl}/simulate-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': secret,
      },
      body: JSON.stringify(enrichedBody),
      // @ts-ignore
      duplex: 'half', 
    });

    if (!response.ok) {
        // On essaie de lire l'erreur JSON renvoyée par FastAPI
        const errorText = await response.text();
        throw new Error(`Engine Error (${response.status}): ${errorText}`);
    }

    // 6. STREAMING DE LA RÉPONSE VERS LE CLIENT
    return new NextResponse(response.body, {
        headers: { 'Content-Type': 'application/x-ndjson' }
    });

  } catch (error: any) {
    console.error("Stream API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\layout.tsx (SKELETON)
============================================================
```tsx
// apps/studio/app/[locale]/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";
import { ConfirmProvider } from "@/components/providers/confirm-provider";
import { Suspense } from 'react';
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params
}: {
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(admin)\admin\page.tsx (SKELETON)
============================================================
```tsx
import Link from 'next/link';
import { 
  FileText, 
  Users, 
  BarChart3, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  Settings,
  Database
} from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminHubPage() {
  const adminSections = [
    }
              className="group relative bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
                // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(admin)\admin\blog\page.tsx (SKELETON)
============================================================
```tsx
// apps/studio/app/[locale]/(admin)/admin/blog/page.tsx

import { db } from "@repo/database";
import { BlogBatchTools } from "@/components/admin/blog-batch-tools";
import { Edit, Eye, CheckCircle, Clock, Home, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth"; 
import { redirect } from "next/navigation"; 
import { createPostAction } from "@/app/actions/admin-blog";
import { BlogDeleteButton } from "@/components/admin/blog-delete-button";
import { CreateTutorialModal } from "@/components/admin/create-tutorial-modal";
import { ManageTutorialsModal } from "@/components/admin/manage-tutorials-modal";

export default async function AdminBlogPage() {
  // 1. Vérification de sécurité
  }
  // 2. Récupération parallèle des Articles et des Tutoriels (Séries)
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                  // ... implementation hidden for brevity ...
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center gap-2"
                      // ... implementation hidden for brevity ...
                                // MODIFIEZ CETTE LIGNE 👇
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all"
                                  // ... implementation hidden for brevity ...
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all"
                                  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(admin)\admin\blog\[id]\page.tsx (SKELETON)
============================================================
```tsx
// apps/studio/app/[locale]/(admin)/admin/blog/[id]/page.tsx

import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { EditPostForm } from '@/components/admin/edit-post-form';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Eye,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default async function EditPostPage(props: { 
  params: Promise<{ id: string, locale: string }> 
  // 1. Résolution des paramètres (Next.js 15)
  // 2. Récupération parallèle : Post + Tags + Tutoriels
    // A. L'article courant
    // B. Tous les tags pour l'autocomplétion
    // C. Tous les tutoriels pour le sélecteur
  // 3. Gestion du cas "non trouvé"
  // 4. Extraction et dédoublonnage des tags existants
    )
  // 5. Filtrage des tutoriels pertinents (Même langue que l'article)
  // Si l'article n'a pas de langue définie (vieux posts), on affiche tout par précaution.
  const relevantTutorials = allTutorials.filter(t => 
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-600 transition-all group"
              // ... implementation hidden for brevity ...
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(admin)\admin\leads\page.tsx (SKELETON)
============================================================
```tsx
import { db } from '@repo/database';
import { 
  Mail, 
  Home, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default async function LeadsAdminPage() {
  // Récupération de tous les leads
  const leads = await db.lead.findMany({
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" 
                    c  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(admin)\admin\logs\page.tsx (SKELETON)
============================================================
```tsx
import Link from 'next/link';
import { db } from '@repo/database';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  Home, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Search, 
  Terminal 
} from 'lucide-react';

export default async function AdminLogsPage() {
  // 1. SÉCURITÉ : Vérification Serveur (Double check après middleware)
  }
  // 2. DATA FETCHING : Récupération des logs (Derniers 50)
  // On inclut les infos utilisateur pour savoir "Qui" a fait l'action
      }
    }
                type="text" 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(admin)\admin\stats\page.tsx (SKELETON)
============================================================
```tsx
import { db } from '@repo/database';
import { 
  Users, 
  MousePointer2, 
  Mail, 
  Zap, 
  TrendingUp, 
  ArrowUpRight, 
  Globe, 
  Clock, 
  Home,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default async function StatsPage() {
  // ... implementation hidden for brevity ...
  // Parallel fetching for high performance
                                    className="h-full bg-blue-500" 
}
/**
 * Generic Stat Card with Trend
 */
function StatCard({ icon, label, value, trend, color }: any) {
  // ... implementation hidden for brevity ...
    };
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(marketing)\layout.tsx (SKELETON)
============================================================
```tsx
import Link from "next/link";
import { auth, signOut } from "@/auth"; // Import de signOut (version serveur)
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/shell/language-switcher";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="h-20 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-slate-900 p-2 rounded-xl group-hover:bg-blue-600 transition-colors shadow-lg">
                <span className="text-white font-black text-sm">QC</span>
                    type="submit"
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(marketing)\page.tsx (SKELETON)
============================================================
```tsx
import { LeadCapture } from "@/components/marketing/lead-capture";
import { 
  ArrowRight, FileSpreadsheet, Network, 
  Check, X, ChevronRight, Zap, Database, Lock,
  Cpu, Rocket, RefreshCw, ShieldCheck, BrainCircuit,
  Trophy, Workflow, Play, MousePointerClick, FileText
} from "lucide-react";
import Link from "next/link";
import { getDictionary, Locale } from '@/lib/i18n';
import { clsx } from "clsx";

export default async function LandingPage(props: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await props.params;
}
// --- REUSABLE MODERN COMPONENTS ---
function IndustryBrand({ name }: { name: string }) {
  // ... implementation hidden for brevity ...
}
function BentoCard({ colSpan, icon, title, desc }: any) {
  // ... implementation hidden for brevity ...
    )
}
function WorkflowStep({ number, title, desc, icon, last }: any) {
  // ... implementation hidden for brevity ...
    )
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(marketing)\blog\page.tsx (SKELETON)
============================================================
```tsx
// apps/studio/app/[locale]/(marketing)/blog/page.tsx
import { db } from "@repo/database";
import { BlogSearchGrid } from "@/components/marketing/blog-search-grid";
import { Hexagon, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function BlogPage(props: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ page?: string, tag?: string, q?: string }> 
}) {
  const { locale } = await props.params;
  const { page, tag, q } = await props.searchParams;

  const POSTS_PER_PAGE = 9;
  const currentPage = parseInt(page || "1", 10);
  // 🚩 DÉCLARATION UNIQUE DE LA CLAUSE WHERE
  };
  }
  // 1. RÉCUPÉRATION DES TUTORIELS (SÉRIES)
      }
  // 2. RÉCUPÉRATION PARALLÈLE DES ARTICLES ET STATS
    // Grille principale paginée
    // Articles populaires
    // Données pour le nuage de tags
    // Compte total pour la pagination
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(marketing)\blog\[slug]\page.tsx (SKELETON)
============================================================
```tsx
// apps/studio/app/[locale]/(marketing)/blog/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { db } from "@repo/database";
import { clsx } from 'clsx';

// --- ICONS ---
import { 
  Calendar, 
  ArrowLeft, 
  Clock, 
  ChevronRight, 
  Hexagon 
// --- ACTIONS & LIBS ---
import { getPostBySlug, getTranslatedSlug } from '@/app/actions/blog';
  // ... implementation hidden for brevity ...
import { Locale } from '@/lib/i18n';
  // ... implementation hidden for brevity ...
// --- COMPONENTS ---
import { MarkdownViewer } from '@/components/ui/markdown-viewer';
  // ... implementation hidden for brevity ...
import { ShareButton } from '@/components/marketing/share-button';
  // ... implementation hidden for brevity ...
import { TutorialNav } from '@/components/marketing/tutorial-nav';
  // ... implementation hidden for brevity ...
import { LanguageSwitcher } from '@/components/layout/shell/language-switcher';
  // ... implementation hidden for brevity ...
// --- HELPER LOCAL ---
function getReadingTime(content: string) {
  // ... implementation hidden for brevity ...
}
// --- 1. GÉNÉRATION DES MÉTADONNÉES (SEO) ---
export async function generateMetadata(props: { 
e  // ... implementation hidden for brevity ...
      type: 'article',
        // ... implementation hidden for brevity ...
  };
}
// --- 2. COMPOSANT PAGE PRINCIPAL ---
export default async function PostPage(props: { 
e  // ... implementation hidden for brevity ...
  // A. Récupération de l'article dans la langue courante
  // B. Logique i18n : Trouver le slug de la traduction
  // Construction de l'objet alternates pour le LanguageSwitcher
  // C. Incrémentation des vues (Fire & Forget)
  }
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors group"
              // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(marketing)\blog\[slug]\pengraph-image.tsx (SKELETON)
============================================================
```tsx
import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/app/[locale]/actions/blog';

export const runtime = 'edge';
export const alt = 'Quantum Core Expertise';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\(marketing)\login\page.tsx (SKELETON)
============================================================
```tsx
import { signIn } from "@/auth";
import { LogIn, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold mx-auto mb-4 shadow-lg">QC</div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bienvenue sur Quantum Core</h1>
          <p className="text-slate-500 text-sm mt-2">Connectez-vous pour gérer vos projets d'ingénierie.</p>
        </div>

        <form
          action={async (formData) => {
          className="space-y-4"
              type="email"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\dashboard\page.tsx (SKELETON)
============================================================
```tsx
import { db } from '@repo/database';
import { ProjectCard } from '@/components/dashboard/project-card';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
import { LayoutGrid, Search, Filter } from 'lucide-react';
import { CreateProjectModal } from '@/components/dashboard/create-project-modal';
import { auth } from "@/auth";
import { getDictionary, Locale } from '@/lib/i18n'; // Import de l'i18n

export default async function DashboardPage(props: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await props.params;
  const dict = getDictionary(locale as Locale);
  const session = await auth();
  }
  // Récupération des projets liés à l'utilisateur
                        className="w-full pl-11 pr-4 py-2 bg-transparent text-sm outline-none placeholder:text-slate-400 font-medium" 
                        c  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\editor\[id]\page.tsx (SKELETON)
============================================================
```tsx
import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { ProjectInitializer } from '@/components/layout/project-initializer';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
import { EditorClientLayout } from '@/components/layout/editor-client-layout'; // Import du nouveau wrapper
import { loadGraph } from '@/app/actions/graph';
import { getDomainConfig } from '@/lib/registry';

export default async function EngineeringStudio(props: {
  params: Promise<{ id: string, locale: string }>;
  searchParams: Promise<{ systemId?: string }>;
}) {  
  // 1. Résolution des paramètres (Pattern Next.js 15)
  const { id: projectId } = await props.params;
  // 2. Chargement du projet
  // 3. Détermination du système courant
  }
  // 4. Configuration métier
  // 5. Chargement initial des données (Graphe + Séquences)
  // loadGraph a déjà été optimisé dans notre étape précédente
  // Mapping des séquences (On s'assure d'avoir un tableau propre)
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\library\page.tsx (SKELETON)
============================================================
```tsx
import { getLibrary } from '@/app/actions/library';
import { getDynamicSchemas } from '@/app/actions/configuration';
import { getDomainConfig, AVAILABLE_DOMAIN_IDS, isDomainValid } from '@/lib/registry';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
import { LibraryManager } from '@/components/library/library-manager';
import { LibrarySpecsView } from '@/components/library/views/library-specs-view';
import { LibraryIOView } from '@/components/library/views/library-io-view';
import { BookOpen, Database, ShieldCheck, ChevronRight, Layers } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { clsx } from 'clsx';
import { t, Locale } from '@/lib/i18n';

export default async function LibraryPage(props: { 
  // 1. Résolution des Promises (Next.js 15+)
  // 2. GESTION DU DOMAINE DYNAMIQUE
  // Validation : Si le domaine est absent ou invalide, on redirige vers le premier domaine du registre
    // On conserve les autres paramètres (view, projectId) lors de la redirection
  }
  // 3. CHARGEMENT DES DONNÉES SPÉCIFIQUES AU DOMAINE
                        className={clsx(
                          // ... implementation hidden for brevity ...
}
function LibraryNavlink({ href, icon, label, active = false }: any) {
  // ... implementation hidden for brevity ...
      className={clsx(
        // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\app\[locale]\project\[id]\page.tsx (SKELETON)
============================================================
```tsx
// apps/studio/app/[locale]/project/[id]/page.tsx
import { db } from '@repo/database';
import { getProjectTopology } from '@/app/actions/stream'; // Vérifiez que le chemin inclut [locale] si vous avez déplacé les actions
import { BlueprintFlow } from '@/components/canvas/blueprint/blueprint-flow';
import { SideNav } from '@/components/layout/shell/side-nav';
import { UniversalHeader } from '@/components/layout/shell/universal-header';
import { GenericReportViewer } from '@/components/layout/generic-report-viewer';
import { auth } from "@/auth";
import { getDictionary, Locale } from '@/lib/i18n';

export default async function ProjectBlueprintPage(props: { 
  params: Promise<{ id: string; locale: string }>; // Correction : ajout de locale
  searchParams: Promise<{ view?: string }>; 
}) {
  // 1. Extraction asynchrone des paramètres
  // 2. Récupération sécurisée du projet (findUnique pour gérer l'erreur nous-même)
  }
  // 3. Fetch topology
  // 4. Prepare Nodes (Systems)
  const initialNodes = systems.map((sys) => ({
    // ... implementation hidden for brevity ...
    type: 'systemNode',
      // ... implementation hidden for brevity ...
        type: sys.type, 
        t  // ... implementation hidden for brevity ...
    }
  // 5. Prepare Edges (Streams)
  const initialEdges = streams.map(stream => {
    // ... implementation hidden for brevity ...
    const sourceSys = systems.find(s => s.nodes.some(n => n.outputStreamId === stream.id));
    const targetSys = systems.find(s => s.nodes.some(n => n.inputStreamId === stream.id));
      };
    }
}
```

============================================================
FILE: quantum-core\apps\studio\components\admin\admin-header.tsx (SKELETON)
============================================================
```tsx
'use client';

import Link from 'next/link';
import { ChevronRight, ShieldCheck, LayoutGrid, Home, ArrowLeft } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export function AdminHeader({ title, subtitle, breadcrumb }: AdminHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto mb-10 space-y-6">
      {/* 1. FIL D'ARIANE (BREADCRUMBS) */}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm group"
                  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\admin\blog-batch-tools.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState, useRef } from "react";
import { Download, Upload, Loader2, FileArchive } from "lucide-react";
import { exportBlogToZipAction, importBlogFromZipAction } from "@/app/actions/admin-blog";

export function BlogBatchTools() {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // LOGIQUE EXPORT (Format QuantumH2O)
  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const base64 = await exportBlogToZipAction();
    }
  };
  // LOGIQUE IMPORT (Format QuantumH2O corrigé)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... implementation hidden for brevity ...
        }
      }
    };
  };
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-purple-200 text-purple-600 rounded-xl text-xs font-bold hover:bg-purple-100 transition-all disabled:opacity-50"
            // ... implementation hidden for brevity ...
          type="file" 
          className="hidden" 
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50"
            // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\admin\blog-delete-button.tsx (SKELETON)
============================================================
```tsx
'use client';
import { Trash } from 'lucide-react';
import { deletePostAction } from '@/app/actions/admin-blog';

export function BlogDeleteButton({ postId, postTitle }: { postId: string, postTitle: string }) {
    const handleClick = async () => {
        if (confirm(`Supprimer l'article "${postTitle}" ?`)) {
            await deletePostAction(postId);
        }
    };

    return (
        <button onClick={handleClick} className="p-2 hover:bg-red-50 rounded-xl transition-all">
            <Trash className="w-4 h-4 text-red-400" />
        </button>
}
```

============================================================
FILE: quantum-core\apps\studio\components\admin\create-tutorial-modal.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState } from 'react';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import { createTutorialAction } from '@/app/actions/admin-blog';
import { toast } from 'sonner';

export function CreateTutorialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [lang, setLang] = useState("fr");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    }
  };
        className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
          // ... implementation hidden for brevity ...
            className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md space-y-6 border border-slate-100 animate-in zoom-in-95"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-800 transition-all"
                          // ... implementation hidden for brevity ...
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer font-bold text-slate-800"
                    type="button" 
                    className="flex-1 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                      // ... implementation hidden for brevity ...
                    type="submit" 
                    className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70"
                      // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\admin\edit-post-form.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState, useActionState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updatePostAction } from '@/app/actions/admin-blog';
import { uploadImageAction } from '@/app/actions/upload';
import { 
  Save, Layout, Edit3, Loader2, Tag as TagIcon, 
  X, Plus, Eye, Image as ImageIcon, 
  ArrowLeft, Clock, Hash, Trash2, UploadCloud, 
  BookOpen, ListOrdered,
  Globe,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';
  // ... implementation hidden for brevity ...
import { clsx } from 'clsx';
  // ... implementation hidden for brevity ...
export function EditPostForm({ 
e  // ... implementation hidden for brevity ...
  // --- ÉTATS ---
  const [tags, setTags] = useState<string[]>(post.tags ? post.tags.split(',').map((t: string) => t.trim()) : []);
    // ... implementation hidden for brevity ...
  // --- ÉTATS TUTORIELS & LANGUE ---
  // --- MÉTRIQUES ÉDITORIALES ---
  const wordCount = useMemo(() => content.split(/\s+/).filter(w => w.length > 0).length, [content]);
  // --- LOGIQUE IMAGE ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... implementation hidden for brevity ...
    }
    }
  };
  // --- LOGIQUE TAGS ---
  const addTag = (tag: string) => {
    // ... implementation hidden for brevity ...
    }
  };
  const removeTag = (tagToRemove: string) => {
    // ... implementation hidden for brevity ...
  };
  const handleClearContent = () => {
    // ... implementation hidden for brevity ...
    }
  };
              type="button"
              className={clsx(
                // ... implementation hidden for brevity ...
              type="button"
              className={clsx(
                // ... implementation hidden for brevity ...
                type="button"
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                  // ... implementation hidden for brevity ...
                  className="w-full bg-transparent text-4xl font-black tracking-tighter outline-none placeholder:text-slate-200 text-slate-900" 
                  c  // ... implementation hidden for brevity ...
                className="flex-1 w-full p-10 font-mono text-sm leading-relaxed outline-none resize-none bg-white text-slate-700 min-h-[500px]"
                type="submit" 
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  // ... implementation hidden for brevity ...
                type="button"
                className="w-full bg-white/5 text-slate-400 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
                  // ... implementation hidden for brevity ...
                        type="button"
                        className={clsx(
                          // ... implementation hidden for brevity ...
                        type="button"
                        className={clsx(
                          // ... implementation hidden for brevity ...
                            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer transition-all"
                              // ... implementation hidden for brevity ...
                            const t = tutorials.find(x => x.id === selectedTutorial);
                                )
                            }
                                type="number" 
                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10"
                                  // ... implementation hidden for brevity ...
                className={clsx(
                  // ... implementation hidden for brevity ...
                type="file" 
                className="hidden" 
                        type="text"
                            }
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10"
                          // ... implementation hidden for brevity ...
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600"
                          // ... implementation hidden for brevity ...
                                    type="button"
                                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-[9px] font-bold text-slate-500 border border-transparent hover:border-blue-100 transition-all"
                                      // ... implementation hidden for brevity ...
                className="w-full h-28 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium outline-none focus:bg-white transition-all resize-none italic leading-relaxed" 
                c  // ... implementation hidden for brevity ...
                type="checkbox" 
                className="w-6 h-6 rounded-lg accent-blue-500" 
}
```

============================================================
FILE: quantum-core\apps\studio\components\admin\logs-dashboard.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Trash2, 
  Search, 
  Filter, 
  AlertTriangle, 
  Info, 
  MessageSquare, 
  Bot, 
  Terminal,
  Eye,
  RefreshCw,
  Archive
import { toast } from 'sonner';
  // ... implementation hidden for brevity ...
import { getLogsAction, deleteLogAction, clearOldLogsAction } from '@/app/actions/admin-logs';
  // ... implementation hidden for brevity ...
import { clsx } from 'clsx';
  // ... implementation hidden for brevity ...
// Helper to determine severity visual based on action name
const getSeverityStyle = (action: string) => {
  // ... implementation hidden for brevity ...
};
export function LogsDashboard() {
  // ... implementation hidden for brevity ...
  const fetchLogs = async () => {
    // ... implementation hidden for brevity ...
    }
  };
  const handleDelete = async (id: string) => {
    // ... implementation hidden for brevity ...
  };
  const handleCleanup = async () => {
    // ... implementation hidden for brevity ...
  };
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                // ... implementation hidden for brevity ...
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-bold uppercase hover:bg-red-50 transition-all"
                  // ... implementation hidden for brevity ...
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              // ... implementation hidden for brevity ...
                            className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                              // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\admin\manage-tutorials-modal.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState } from 'react';
import { Settings2, Trash2, X, Loader2 } from 'lucide-react';
import { deleteTutorialAction } from '@/app/actions/admin-blog';
import { toast } from 'sonner';

export function ManageTutorialsModal({ tutorials }: { tutorials: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer la série "${title}" ? Les articles ne seront pas supprimés mais deviendront indépendants.`)) return;

    setIsDeleting(id);
    }
  };
        className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
          // ... implementation hidden for brevity ...
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\canvas\flow-editor.tsx (SKELETON)
============================================================
```tsx
'use client';

import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCanvasStore } from '@/store/canvas-store';
import { useMemo, useCallback } from 'react';
import { getDomainConfig } from '@/lib/registry';
import { getFlowNodeTypes } from '@/lib/component-registry';
import { LayerControl } from './layer-control'; // <--- Import ajouté

export function FlowEditor() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
  const nodeTypes = useMemo(() => {
    // ... implementation hidden for brevity ...
    // On passe un objet vide en fallback, le registre gère le reste
  const handlePaneClick = useCallback(() => {
    // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\canvas\generic-node.tsx (SKELETON)
============================================================
```tsx
'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { getDomainConfig } from '@/lib/registry';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { clsx } from 'clsx';

export function GenericNode({ data, selected }: NodeProps<any>) {
  // 1. Identification du domaine et de la configuration métier
  const config = getDomainConfig();
  const nodeConfig = config.nodeTypes[data.type];

  // Sécurité si le type de noeud n'existe pas dans le manifeste
  if (!nodeConfig) {
    return (
  }
  // Extraction des propriétés (JSONB) et des résultats de calcul (Simulation)
      className={clsx(
        // ... implementation hidden for brevity ...
                 className={clsx(
                   // ... implementation hidden for brevity ...
        type="target" 
        className="w-3 h-3 bg-slate-300 border-2 border-white hover:bg-blue-500 transition-colors !z-10" 
        c  // ... implementation hidden for brevity ...
        type="source" 
        className="w-3 h-3 bg-slate-300 border-2 border-white hover:bg-blue-500 transition-colors !z-10" 
        c  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\canvas\layer-control.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Factory, 
  Waves, 
  Box, 
  Wand2 
} from 'lucide-react';
import { clsx } from 'clsx';
import { Panel } from '@xyflow/react';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
  // ... implementation hidden for brevity ...
export function LayerControl() {
  // ... implementation hidden for brevity ...
  const visibleScopes = useCanvasStore((state) => state.visibleScopes);
  const toggleScopeVisibility = useCanvasStore((state) => state.toggleScopeVisibility);
  const applyAutoLayout = useCanvasStore((state) => state.applyAutoLayout);
          className="flex items-center gap-3 px-3 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all mb-2 shadow-lg shadow-blue-900/20 group/wand"
            // ... implementation hidden for brevity ...
              className={clsx(
                // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\canvas\smart-node.tsx (SKELETON)
============================================================
```tsx
'use client';

import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCanvasStore } from '@/store/canvas-store';
import { 
  ArrowDown, 
  ArrowRightLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  Settings2, 
  Activity, 
  Droplets
} from 'lucide-react';
import { clsx } from 'clsx';
import { getDomainConfig } from '@/lib/registry';
  // ... implementation hidden for brevity ...
import { DynamicIcon } from '@/components/ui/dynamic-icon';
  // ... implementation hidden for brevity ...
import { t } from '@/lib/i18n';
  // ... implementation hidden for brevity ...
export const SmartNode = memo(({ id, data, selected }: NodeProps) => {
  // ... implementation hidden for brevity ...
  // 1. CONFIGURATION DU DOMAINE
  }
  // 2. RÉCUPÉRATION DES DONNÉES DU STORE
  const allNodes = useCanvasStore(state => state.nodes);
  // 3. LOGIQUE : SOMME IONIQUE (HEALTH BAR)
  const totalIonicLoad = useMemo(() => {
    // ... implementation hidden for brevity ...
  // 4. CHAMPS RÉSUMÉS & ACCESSOIRES
  const summaryFields = useMemo(() => {
    // ... implementation hidden for brevity ...
    const allFields = nodeConfig.groups.flatMap(group => group.fields);
    // Le cast est nécessaire car les types du manifest sont plus larges que 'any'
  // 5. ALERTES CRITIQUES
  // 6. LIAISONS SANS FIL (Wireless)
  const wirelessLinks = useMemo(() => {
    // ... implementation hidden for brevity ...
    // Parcours toutes les propriétés pour trouver les IDs de connexion logiques
            const target = allNodes.find(n => n.id === value);
            }
        }
    }
  // 7. DONNÉES DE CONSIGNE (CIBLE)
  // Récupération de la nouvelle clé injectée par le solveur
      className={clsx(
        // ... implementation hidden for brevity ...
                    className="w-2.5 h-2.5 text-slate-400" 
                className={clsx(
                  // ... implementation hidden for brevity ...
```

============================================================
FILE: quantum-core\apps\studio\components\canvas\synoptic-editor.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useCanvasStore, AppNode } from '@/store/canvas-store';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { useMemo } from 'react';
import { 
  ArrowDown, 
  Map, 
  Layers, 
  Link as LinkIcon, 
  Settings2,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { getDomainConfig } from '@/lib/registry';
import { t } from '@/lib/i18n'; 
i  // ... implementation hidden for brevity ...
import { useParams } from 'next/navigation';
  // ... implementation hidden for brevity ...
import { Locale } from '@/lib/domain-config';
  // ... implementation hidden for brevity ...
import {
  // ... implementation hidden for brevity ...
import {
  // ... implementation hidden for brevity ...
import { CSS } from '@dnd-kit/utilities';
  // ... implementation hidden for brevity ...
// --- COMPOSANT : ÉLÉMENT DE LISTE ORDONNABLE ---
function SortableNodeItem({ node, isSelected, isSequenceMode, locale }: { node: AppNode, isSelected: boolean, isSequenceMode: boolean, locale: Locale }) {
  // ... implementation hidden for brevity ...
  };
  const allNodes = useCanvasStore(state => state.nodes);
  const setSelectedNodeId = useCanvasStore(state => state.setSelectedNodeId);
  // Simulation results peut contenir n'importe quoi (Mass balance, AI metrics, etc.)
  // 1. Extraction générique des connexions logiques (Wireless)
  const wirelessConnections = useMemo(() => {
    // ... implementation hidden for brevity ...
    const allFields = nodeSchema.groups.flatMap(g => g.fields);
          const targetNode = allNodes.find(n => n.id === targetId);
          };
        }
  // 2. Champs de résumé dynamiques
  const summaryFields = useMemo(() => {
    // ... implementation hidden for brevity ...
        className={clsx(
          // ... implementation hidden for brevity ...
          */}
}
// --- COMPOSANT PRINCIPAL ---
export function SynopticEditor() {
  // ... implementation hidden for brevity ...
  const { orderedNodes, title, subTitle, activeSeq } = useMemo(() => {
    // ... implementation hidden for brevity ...
    const _activeSeq = sequences.find(s => s.id === selectedSequenceId);
    // Le scope filtré peut être paramétré dans le manifeste futur, par défaut PROCESS
    const processNodes = nodes.filter(n => config.nodeTypes[n.type]?.scope === 'PROCESS');
      const remaining = processNodes.filter(n => !nodesInSequence.has(n.id));
      };
      };
    }
  const handleDragEnd = (event: DragEndEvent) => {
    // ... implementation hidden for brevity ...
      }
    }
  };
}
```

============================================================
FILE: quantum-core\apps\studio\components\canvas\blueprint\blueprint-flow.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  applyNodeChanges, 
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SystemNode } from './system-node';
  // ... implementation hidden for brevity ...
import { runGlobalProjectSimulation } from '@/app/actions/simulation';
  // ... implementation hidden for brevity ...
import { updateSystemPositionAction } from '@/app/actions/system'; // Action de sauvegarde
  // ... implementation hidden for brevity ...
import { useCanvasStore } from '@/store/canvas-store'; // Accès au store global
  // ... implementation hidden for brevity ...
import { Play, Loader2, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
  // ... implementation hidden for brevity ...
import { clsx } from 'clsx';
  // ... implementation hidden for brevity ...
};
interface BlueprintFlowProps {
  // ... implementation hidden for brevity ...
}
export function BlueprintFlow({ projectId, initialNodes, initialEdges }: BlueprintFlowProps) {
  // ... implementation hidden for brevity ...
  // Accès au store pour injecter les résultats de simulation
  const setSummaryData = useCanvasStore(state => state.setSummaryData);
  // 1. GESTION DU DÉPLACEMENT (LOCAL)
  // 2. SAUVEGARDE DE LA POSITION (BASE DE DONNÉES)
  const onNodeDragStop = useCallback(async (_: any, node: any) => {
    // ... implementation hidden for brevity ...
      }
    }
  // 3. SIMULATION GLOBALE
  const handleSimulate = async () => {
    // ... implementation hidden for brevity ...
            // Pour la simulation globale, Python renvoie response.data.results
    }
      }
        // --- SUCCÈS ---
        // A. Injecter les résultats dans le store pour le AnalysisReport
        // B. Mettre à jour les labels des liens sur le Blueprint (optionnel mais recommandé)
        const updatedEdges = edges.map(edge => {
          // ... implementation hidden for brevity ...
                };
            }
      }
    }
  };
            className={clsx(
              // ... implementation hidden for brevity ...
}
function ExternalLinkIcon() {
  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\canvas\blueprint\system-node.tsx (SKELETON)
============================================================
```tsx
'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { LayoutDashboard, ExternalLink, Activity, Droplets, Waves } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

export function SystemNode({ data, selected }: NodeProps<any>) {
  const isTreatment = data.type === 'TREATMENT';

  return (
    <div className={clsx(
      "min-w-[280px] bg-white border-2 rounded-[2rem] shadow-xl transition-all overflow-hidden",
      selected ? "border-blue-500 ring-4 ring-blue-500/10 scale-105" : "border-slate-200"
    )}>
          className="p-2 bg-white rounded-xl shadow-sm text-slate-400 hover:text-blue-600 transition-colors"
            // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\dashboard\create-project-modal.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, Plus, Rocket, Folder, 
  FlaskConical, Zap, Droplets, 
  ArrowRight, Loader2, Info 
} from 'lucide-react';
import { createProjectAction } from '@/app/actions/project';
import { getAvailableDomains } from '@/lib/registry';
import { t } from '@/lib/i18n'; // <--- Import du helper de traduction
import { clsx } from 'clsx';
import { toast } from 'sonner';

export function CreateProjectModal() {
  // ... implementation hidden for brevity ...
  const handleSubmit = async (formData: FormData) => {
    // ... implementation hidden for brevity ...
      // On injecte le domaine sélectionné dans le formData
        // Redirection vers l'éditeur du projet
      }
    }
  };
        className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 transition-all active:scale-95"
          // ... implementation hidden for brevity ...
  }
                        className="w-full text-2xl font-black tracking-tight text-slate-900 placeholder:text-slate-200 outline-none border-b-2 border-slate-100 focus:border-blue-500 transition-all pb-2"
                          // ... implementation hidden for brevity ...
                                className={clsx(
                                  // ... implementation hidden for brevity ...
                    type="button"
                    className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                      // ... implementation hidden for brevity ...
                    type="submit"
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
                      // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\dashboard\project-card.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState } from 'react';
import { Trash2, Edit3, Folder, Check, X } from 'lucide-react';
import { deleteProjectAction, renameProjectAction } from '@/app/actions/project';
import Link from 'next/link';
import { toast } from "sonner";
import { useConfirm } from "@/components/providers/confirm-provider";
import { getDomainConfig } from '@/lib/registry'; // Pour récupérer le nom du domaine
import { t } from '@/lib/i18n'; // Pour la traduction

export function ProjectCard({ project }: { project: any }) {
  const { confirm } = useConfirm();
  
  // États pour l'édition en ligne (remplace le prompt)
  // i18n context
  // Récupération de la configuration du domaine pour obtenir son label traduit
  // --- ACTION : SUPPRESSION ---
  const handleDelete = async (e: React.MouseEvent) => {
    // ... implementation hidden for brevity ...
    }
  };
  // --- ACTION : SAUVEGARDER LE NOM ---
  const saveRename = async (e: React.MouseEvent) => {
    // ... implementation hidden for brevity ...
    }
  };
  // --- ACTION : ANNULER LE RENOMMAGE ---
  const cancelRename = (e: React.MouseEvent) => {
    // ... implementation hidden for brevity ...
  };
        className={`block h-full ${isRenaming ? 'cursor-default' : ''}`}
          // ... implementation hidden for brevity ...
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
                  // ... implementation hidden for brevity ...
                className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600 transition-colors"
                  // ... implementation hidden for brevity ...
                className="w-full bg-slate-50 border border-blue-300 rounded-lg px-2 py-1 text-xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10"
                  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\domains\surface_treatment\endpoint-node.tsx (SKELETON)
============================================================
```tsx
'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Waves,       // Pour les Drains (Rejets)
  ArrowRight,  // Pour les Sources (Recyclage)
  Droplets
} from 'lucide-react';
import { clsx } from 'clsx';

export const EndpointNode = memo(({ id, data, selected }: NodeProps) => {
  // Le rôle est défini dans le manifeste (SOURCE ou DRAIN)
  // Ou fallback sur le type
  const isSource = data.type === 'SOURCE';
  // Résultats de simulation (ex: Total collecté par ce réseau)
      className={clsx(
        // ... implementation hidden for brevity ...
          type="source" 
          className="w-3 h-3 !bg-blue-500 border-2 border-white" 
          type="target" 
          className="w-3 h-3 !bg-emerald-500 border-2 border-white" 
```

============================================================
FILE: quantum-core\apps\studio\components\domains\surface_treatment\network-manager.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  Waves, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Factory
} from 'lucide-react';

export function NetworkManager() {
  const { nodes, addNode, onNodesChange, setSelectedNodeId } = useCanvasStore();
  
  const drains = nodes.filter(n => n.type === 'DRAIN');
  const sources = nodes.filter(n => n.type === 'SOURCE');
  const handleAdd = (type: string) => {
    // ... implementation hidden for brevity ...
    }
  };
  const handleDelete = (e: React.MouseEvent, id: string) => {
    // ... implementation hidden for brevity ...
    }
  };
  const ListItem = ({ node, icon: Icon, color }: any) => (
    // ... implementation hidden for brevity ...
        className={`group flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-${color}-400 hover:shadow-md transition-all`}
          // ... implementation hidden for brevity ...
            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
              // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\domains\surface_treatment\process-report.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useCanvasStore } from "@/store/canvas-store";
import { 
  Download, AlertCircle, Activity, ArrowDownCircle, 
  Droplets, ArrowLeft, Factory, TrendingUp, BarChart3,
  Beaker, FlaskConical, Thermometer, Wind
} from "lucide-react";
import { clsx } from 'clsx';
import { useMemo } from "react";

// --- HELPERS SIMULÉS (Pour R03) ---
const HOURS_PER_YEAR = 8 * 5 * 47; 

/**
 * Simule la conversion du besoin en ion pur (g/h) vers une quantité de produit commercial (L/an).
 */
function convertIonMassToCommercialProduct(ionName: string, massPerHour_g: number) {
  // ... implementation hidden for brevity ...
  // Correction 2: Utiliser un strict '==' pour éviter les affectations incorrectes
  };
}
// ------------------------------------
export function ProcessReport() {
  // ... implementation hidden for brevity ...
  // --- 1. DATA PIVOTING & AGGREGATION ---
  const report = useMemo(() => {
    // ... implementation hidden for brevity ...
    // Correction 1: Vérification stricte des données (y compris global_kpis)
        // Préparation des données pour le tableau hydraulique
                    };
                }
          type: node.type,
            // ... implementation hidden for brevity ...
        };
          // --- NOUVELLE LIGNE DE DÉBOGAGE CRITIQUE (Étape D) ---
    const bathMaintenance = internalTanks.filter(t => t.type === 'PROCESS_BATH');
    const totalChemLoss = internalTanks.flatMap(t => t.commercialNeeds).reduce((sum, need) => sum + (need?.litersPerYear || 0), 0);
    // Assurez-vous que le KPI est en L/an pour la carte
    };
  // --- 2. EMPTY STATE ---
  }
  // --- COMPOSANT DÉTAILLÉ DE LA CARTE DE COMPOSITION (Nouveau style UX) ---
  const TankDetailCard = ({ tank }: { tank: any }) => {
    // ... implementation hidden for brevity ...
  };
  // ---------------------------------------------------------------------------------
    // Correction 3: Utilisation de flex-col et min-h-0 sur le contenu principal
}
function KpiCard({ icon, label, value, unit, color }: any) {
  // ... implementation hidden for brevity ...
    };
}
```

============================================================
FILE: quantum-core\apps\studio\components\domains\surface_treatment\stream-connection-widget.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState, useEffect } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { Network, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import { getProjectStreams, connectNodeToStreamAction, createStreamAction } from '@/app/actions/stream';

export function StreamConnectionWidget({ nodeId }: { nodeId: string }) {
  const node = useCanvasStore(state => state.nodes.find(n => n.id === nodeId));
  const projectId = useCanvasStore(state => state.projectId);
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);

  const [projectStreams, setProjectStreams] = useState<any[]>([]);

  useEffect(() => {
    }
  // On ne montre ce widget que pour les terminaux ou les cuves importantes
  // Pour les Tanks, on n'affiche pas le widget complet ici, car ils ont déjà des champs "dumpingNetworkId" dans le formulaire générique.
  // Ce widget est surtout utile pour les noeuds TERMINAUX (Source/Drain) qui doivent se connecter au Bus Projet.
  const handleStreamConnect = async (streamId: string | null) => {
    // ... implementation hidden for brevity ...
    }
  };
  const handleCreateNewStream = async () => {
    // ... implementation hidden for brevity ...
    }
  };
                className="w-full p-3 bg-blue-800 border border-blue-700 rounded-xl text-sm font-bold text-white shadow-inner outline-none focus:ring-2 focus:ring-blue-400/50 appearance-none cursor-pointer"
                  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\domains\surface_treatment\water-properties-widget.tsx (SKELETON)
============================================================
```tsx
'use client';
import { useCanvasStore } from '@/store/canvas-store';
import { Beaker, Zap, Activity, Droplets, Waves, Info } from 'lucide-react';
import { clsx } from 'clsx';

export function WaterPropertiesWidget({ nodeId }: { nodeId: string }) {
  const node = useCanvasStore(state => state.nodes.find(n => n.id === nodeId));
  const simResults = node?.data.properties.simulationResults || null;
  
  if (!node) return null;
  const isBath = node.type === 'PROCESS_BATH';

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* SECTION 1 : RÉSULTATS CALCULÉS (BLACK BOX) */}
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\app-shell.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState, Suspense } from 'react';
import { usePathname, useParams, useSearchParams } from 'next/navigation';
import { MessageSquareText, Bot } from 'lucide-react';
import { FeedbackModal } from '@/components/ui/feedback-modal';
import { AiChatModal } from '@/components/ui/ai-chat-modal';
import { getDomainConfig } from '@/lib/registry';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isAiChatModalOpen, setIsAiChatModalOpen] = useState(false);
  
  const pathname = usePathname();
  const params = useParams();
  };
        className="fixed bottom-20 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-[90] flex items-center gap-2 group overflow-hidden"
          // ... implementation hidden for brevity ...
        className="fixed bottom-6 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all z-[90] flex items-center gap-2 group overflow-hidden"
          // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\catalog-selector.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState, useEffect } from 'react';
import { getCatalogItems } from '@/app/actions/catalog';
import { ShoppingBag, Check, Loader2, Search } from 'lucide-react';
import { useCanvasStore } from '@/store/canvas-store';

interface CatalogSelectorProps {
  category: string | string[];
  nodeId: string;
  onSelect?: (item: any) => void; // Optionnel pour les collections
  value?: string; // L'ID actuel
  label?: string;
}

export function CatalogSelector({ category, nodeId, onSelect, value, label }: CatalogSelectorProps) {
  // ... implementation hidden for brevity ...
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);
  // Charger les items quand on ouvre le menu
    }
  // Trouver le nom de l'item sélectionné pour l'affichage du bouton
  const selectedItemName = items.find(i => i.id === value)?.name;
  const handleSelect = (item: any) => {
    // ... implementation hidden for brevity ...
      // Cas A : Utilisation dans une collection (on renvoie l'objet)
      // Cas B : Utilisation directe sur un noeud (ex: Modèle de Pompe)
    }
  };
  const filteredItems = items.filter(i => 
        type="button"
        className="w-full flex items-center justify-between gap-2 p-2.5 text-xs font-bold bg-white border border-slate-200 rounded-xl hover:border-blue-400 transition-all shadow-sm"
          // ... implementation hidden for brevity ...
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border-none rounded-lg text-[10px] outline-none"
                className="p-3 hover:bg-blue-50 rounded-xl cursor-pointer border border-transparent hover:border-blue-100 transition-all group"
                  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\editor-client-layout.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { NodePalette } from '@/components/layout/node-palette';
import { PropertiesPanel } from '@/components/layout/properties-panel';
import { Workspace } from '@/components/layout/workspace';
import { DomainManifest } from '@/lib/domain-config';

export function EditorClientLayout({ config }: { config: DomainManifest }) {
  // Ici, on est côté client, on peut utiliser Zustand !
  const viewMode = useCanvasStore((s) => s.viewMode);

  return (
    <main className="flex-1 flex overflow-hidden bg-slate-50">
      {/* 🚩 On cache la palette si on est en mode Séquences ou Bilan */}
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\generic-report-viewer.tsx (SKELETON)
============================================================
```tsx
'use client';

import { getDomainReport } from '@/lib/component-registry';
import { FileWarning, BarChart3, AlertTriangle } from 'lucide-react';
import { t } from '@/lib/i18n';
import { useCanvasStore } from '@/store/canvas-store'; // On va directement chercher les données ici

interface GenericReportViewerProps {
  domain: string;
  // 🚩 CHANGEMENT : Accepte l'objet de données complètes
  summaryData: any; 
}

export function GenericReportViewer({ domain, summaryData }: GenericReportViewerProps) {
  // 1. Résolution dynamique via le Registre
  // 2. Gestion du cas 'NO DATA'
  }
  // 3. Gestion du cas 'NO CONFIG' (Fallback de sécurité)
  }
  // 4. Rendu du rapport spécifique (On passe les données)
  // Le composant enfant (ex: ProcessReport) est responsable de l'affichage
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\header.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { saveGraph } from '@/app/actions/graph';
import { 
  runSimulationAction, 
  generateProposalAction, 
  runProjectSummaryAction 
} from '@/app/actions/simulation';
import { seedCatalog } from '@/app/actions/catalog';
import { seedH2OLibrary } from '@/app/actions/seed-h2o';
import { useState } from 'react';
import { 
  Save, 
  Loader2, 
import { usePathname, useParams } from 'next/navigation';
  // ... implementation hidden for brevity ...
import Link from 'next/link';
import { signOut } from "next-auth/react";
  // ... implementation hidden for brevity ...
import { ProjectSettingsModal } from './project-settings-modal';
  // ... implementation hidden for brevity ...
import { SystemSelector } from './system-selector'; 
i  // ... implementation hidden for brevity ...
import { toast } from "sonner"; // Import de Sonner
  // ... implementation hidden for brevity ...
interface HeaderProps {
  // ... implementation hidden for brevity ...
}
export function Header({ config, systems, currentSystemId, projectId }: HeaderProps) {
  // ... implementation hidden for brevity ...
  // --- ÉTATS DE CHARGEMENT ---
  // --- ÉTATS UI ---
  // --- ACTIONS ---
  // Gestion de l'import Catalogue avec feedback de chargement
  const handleSeedCatalog = () => {
    // ... implementation hidden for brevity ...
  };
  // Gestion de l'import Chimie avec feedback de chargement
  const handleSeedChemistry = () => {
    // ... implementation hidden for brevity ...
  };
  const handleGenerateOffer = async () => {
    // ... implementation hidden for brevity ...
    }
  };
  const handleSave = async () => {
    // ... implementation hidden for brevity ...
    }
    const cleanNodes = nodes.map(n => ({
      // ... implementation hidden for brevity ...
      type: n.type 
      t  // ... implementation hidden for brevity ...
    }
  };
  const handleSimulate = async () => {
    // ... implementation hidden for brevity ...
      }
    }
  };
  const handleProjectSummary = async () => {
    // ... implementation hidden for brevity ...
    }
    }
  };
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all"
                // ... implementation hidden for brevity ...
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isLibrary ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                // ... implementation hidden for brevity ...
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isLibrary ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                // ... implementation hidden for brevity ...
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'GRAPH' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      // ... implementation hidden for brevity ...
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'SYNOPTIC' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      // ... implementation hidden for brevity ...
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'SUMMARY' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      // ... implementation hidden for brevity ...
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${synopticMode === 'PHYSICAL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                              // ... implementation hidden for brevity ...
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${synopticMode === 'SEQUENCE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                              // ... implementation hidden for brevity ...
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                  // ... implementation hidden for brevity ...
                className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                  // ... implementation hidden for brevity ...
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                  // ... implementation hidden for brevity ...
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 disabled:opacity-30 transition-all"
                  // ... implementation hidden for brevity ...
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all"
                  // ... implementation hidden for brevity ...
                className="flex items-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 rounded-xl hover:bg-black disabled:opacity-30 shadow-lg transition-all"
                  // ... implementation hidden for brevity ...
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\network-manager.tsx (SKELETON)
============================================================
```tsx

```

============================================================
FILE: quantum-core\apps\studio\components\layout\node-palette.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { Plus, ChevronDown } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { useMemo } from 'react';
import { ResizablePanel } from '@/components/ui/resizable-panel';
import { t } from '@/lib/i18n'; // <--- Import indispensable pour l'i18n
import { useParams } from 'next/navigation'; // 1. Import
import { Locale } from '@/lib/i18n'; // 2. Import du type

interface NodePaletteProps {
  config: any;
}

export function NodePalette({ config }: NodePaletteProps) {
  // ... implementation hidden for brevity ...
  const addNode = useCanvasStore((state) => state.addNode);
  const viewMode = useCanvasStore((state) => state.viewMode);
  // À l'avenir, cette valeur viendra d'un hook useLocale()
  // Groupement des nœuds par catégorie traduite
  const groupedNodes = useMemo(() => {
    // ... implementation hidden for brevity ...
      // On traduit la catégorie avant de s'en servir comme clé de groupe
                      className="group flex items-center w-full gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all text-left cursor-pointer overflow-hidden"
                        // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\project-initializer.tsx (SKELETON)
============================================================
```tsx
// FILE: apps/studio/components/layout/project-initializer.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { getDomainConfig } from '@/lib/registry'; // 👈 NOUVEL IMPORT NÉCESSAIRE

export function ProjectInitializer({ 
  projectId, 
  systemId,
  initialNodes, 
  initialEdges,
  initialSequences
}: any) {
  const store = useCanvasStore();
    // La logique existante pour éviter l'initialisation multiple
    // 1. Initialisation des IDs de base
    // --- NOUVELLE LOGIQUE D'HYDRATATION DES VALEURS PAR DÉFAUT ---
      const hydratedNodes = initialNodes.map((n: any) => {
        // ... implementation hidden for brevity ...
        // Crée un objet des propriétés par défaut en parcourant tous les champs
          }
        // Fusion: Valeur par Défaut < Valeur Persistée (DB)
        };
        };
    }
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\project-settings-modal.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  X, Clock, Save, Loader2, Settings, AlertTriangle, Zap
} from 'lucide-react';
import { updateProjectSettingsAction } from '@/app/actions/project';
import { getDomainConfig } from '@/lib/registry';
import { t, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';
import { toast } from "sonner";

interface ProjectSettingsModalProps {
  projectId: string;
  domainId: string; // Requis pour charger le Manifeste
}
export function ProjectSettingsModal({ projectId, domainId, onClose }: ProjectSettingsModalProps) {
  // ... implementation hidden for brevity ...
  // 1. DÉTERMINATION DES CHAMPS VIA LE MANIFESTE
  // Le composant sait quelles options il doit afficher
  // Combinaison des settings standards (Heures/Jours) et des settings spécifiques au domaine
  const allFields = useMemo(() => {
    // ... implementation hidden for brevity ...
    // Schéma de base Next.js (Heures/Jours/Semaines)
    // 🚩 Ajout des champs spécifiques au domaine (s'ils existent)
  // 2. LOGIQUE DE CHARGEMENT ET MISE À JOUR DE L'ÉTAT LOCAL (Simulation)
  // En production, tu ferais un fetch pour récupérer les valeurs actuelles du projet.
  // Pour l'instant, on initialise avec les valeurs par défaut du manifeste.
    // Simuler le chargement des données actuelles du projet (qui pourraient être null)
    // On merge les valeurs DB (null) avec les valeurs par défaut du manifeste
    // NOTE: Ici, tu ferais un 'getProjectSettingsAction(projectId)'
  // 3. LOGIQUE DE SAUVEGARDE
  const handleSave = async () => {
    // ... implementation hidden for brevity ...
    // Construction du payload basé sur les champs actuels (y compris les nouveaux)
        }
    }
  };
  const handleFieldChange = (id: string, value: string | number) => {
    // ... implementation hidden for brevity ...
  };
                                type="number" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                                  // ... implementation hidden for brevity ...
                                        type="number" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                                          // ... implementation hidden for brevity ...
                    className="w-64 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                      // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\properties-panel.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  Settings2, 
  Trash2, 
  Type, 
  Hash, 
  List, 
  ToggleLeft, 
  FileText, 
  Plus,
  Scale,
  LayoutGrid
} from 'lucide-react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
  // ... implementation hidden for brevity ...
import { ResizablePanel } from '@/components/ui/resizable-panel';
  // ... implementation hidden for brevity ...
import { CatalogSelector } from '@/components/layout/catalog-selector';
  // ... implementation hidden for brevity ...
import { NodeSelector } from '@/components/ui/node-selector';
  // ... implementation hidden for brevity ...
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  // ... implementation hidden for brevity ...
import { t, getDictionary } from '@/lib/i18n';
  // ... implementation hidden for brevity ...
import { useParams } from 'next/navigation';
  // ... implementation hidden for brevity ...
import { Locale, FieldGroup } from '@/lib/i18n';
  // ... implementation hidden for brevity ...
import { clsx } from 'clsx';
  // ... implementation hidden for brevity ...
// --- IMPORT DU REGISTRE ---
import { 
i  // ... implementation hidden for brevity ...
interface PropertiesPanelProps {
  // ... implementation hidden for brevity ...
}
export function PropertiesPanel({ config }: PropertiesPanelProps) {
  // ... implementation hidden for brevity ...
  const viewMode = useCanvasStore(state => state.viewMode);
  const selectedNodeId = useCanvasStore(state => state.selectedNodeId);
  const selectedEdgeId = useCanvasStore(state => state.selectedEdgeId);
  const nodes = useCanvasStore(state => state.nodes);
  const edges = useCanvasStore(state => state.edges);
  const updateNodeLabel = useCanvasStore(state => state.updateNodeLabel);
  const updateNodeProperties = useCanvasStore(state => state.updateNodeProperties);
  const updateEdgeProperties = useCanvasStore(state => state.updateEdgeProperties);
  const onNodesChange = useCanvasStore(state => state.onNodesChange);
  const onEdgesChange = useCanvasStore(state => state.onEdgesChange);
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
    // ... implementation hidden for brevity ...
  const selectedEdge = selectedEdgeId ? edges.find(e => e.id === selectedEdgeId) : null;
    // ... implementation hidden for brevity ...
  }
  }
  const handlePropChange = (key: string, value: any) => {
    // ... implementation hidden for brevity ...
  };
  const renderField = (field: any, value: any, onChange: (val: any) => void) => {
    // ... implementation hidden for brevity ...
    }
    }
    }
        const addItem = () => {
          // ... implementation hidden for brevity ...
            const newItem = field.schema.reduce((acc: any, f: any) => ({ ...acc, [f.id]: f.default }), {});
              // ... implementation hidden for brevity ...
        };
        const updateItem = (idx: number, k: string, v: any) => {
          // ... implementation hidden for brevity ...
        };
        const removeItem = (idx: number) => onChange(items.filter((_: any, i: number) => i !== idx));
          // ... implementation hidden for brevity ...
    }
    }
  };
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200 rounded-t-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all shrink-0"
                      // ... implementation hidden for brevity ...
          /* FALLBACK SI PAS DE GROUPES (ex: Edges) */
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\sequence-manager.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Play, 
  ArrowDown, 
  ChevronRight, 
  Activity,
  Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';
  // ... implementation hidden for brevity ...
import { clsx } from 'clsx';
  // ... implementation hidden for brevity ...
import { getDomainConfig } from '@/lib/registry';
  // ... implementation hidden for brevity ...
import { t } from '@/lib/i18n';
  // ... implementation hidden for brevity ...
import { useParams } from 'next/navigation';
  // ... implementation hidden for brevity ...
import { Locale } from '@/lib/domain-config';
  // ... implementation hidden for brevity ...
import { toast } from 'sonner';
  // ... implementation hidden for brevity ...
export function SequenceManager() {
  // ... implementation hidden for brevity ...
  const activeSeq = sequences.find(s => s.id === selectedSequenceId);
  // Synchronisation : Remplit le formulaire quand on change de gamme
    }
  const handleSave = async () => {
    // ... implementation hidden for brevity ...
    }
  };
  const handleAddStep = (nodeId: string) => {
    // ... implementation hidden for brevity ...
  };
  const handleRemoveStep = (idx: number) => {
    // ... implementation hidden for brevity ...
    const newSteps = activeSeq.steps.filter((_, i) => i !== idx);
  };
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-90"
                  // ... implementation hidden for brevity ...
              className={clsx(
                // ... implementation hidden for brevity ...
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all" 
                  c  // ... implementation hidden for brevity ...
                            className="text-5xl font-black text-slate-900 bg-transparent outline-none border-b-4 border-transparent focus:border-blue-500 placeholder:text-slate-200 w-full max-w-xl transition-all pb-2 tracking-tighter"
                              // ... implementation hidden for brevity ...
                        className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
                          // ... implementation hidden for brevity ...
                                            type="number" 
                                            className="w-28 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" 
                                            c  // ... implementation hidden for brevity ...
                    const node = nodes.find(n => n.id === stepId);
                                    className="p-4 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                      // ... implementation hidden for brevity ...
                            className="appearance-none w-full pl-8 pr-14 py-6 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] text-xs font-black uppercase tracking-widest text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer outline-none shadow-inner"
                              // ... implementation hidden for brevity ...
                                }
          /* EMPTY STATE */
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\summary-view.tsx (SKELETON)
============================================================
```tsx
'use client';

import { BarChart3 } from 'lucide-react';
import { getDomainConfig } from '@/lib/registry';
import { useCanvasStore } from '@/store/canvas-store'; // 🚩 Import du store pour la réactivité
import { GenericReportViewer } from './generic-report-viewer'; // 🚩 Import de la coque générique

interface SummaryViewProps {
  // Supprimer summaryData ici pour utiliser le store (meilleure réactivité)
  domain: string; 
}

export function SummaryView({ domain }: SummaryViewProps) {
  // 1. Récupération des données du Store (Zustand)
  const summaryData = useCanvasStore((state) => state.summaryData);
  // 2. Résolution du Domaine : Prop > Config Active > Défaut (Le code d'origine est trop complexe)
  // On utilise la prop `domain` passée par le Workspace, qui vient du Project.
  // 3. Affichage Conditionnel
  // On délègue tout le travail de vérification et de rendu au GenericReportViewer
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\system-selector.tsx (SKELETON)
============================================================
```tsx
// FILE: apps/studio/components/layout/system-selector.tsx
'use client';

import { useRouter } from 'next/navigation';
import { LayoutDashboard, ChevronDown, Plus } from 'lucide-react';
import { createSystem } from '@/app/actions/system'; // Import mis à jour

interface SystemSelectorProps {
  systems: any[];
  currentSystemId: string;
  projectId: string;
}

export function SystemSelector({ systems, currentSystemId, projectId }: SystemSelectorProps) {
  const router = useRouter();
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    // ... implementation hidden for brevity ...
        // Par défaut on crée en PRODUCTION, on pourra améliorer l'UX plus tard
      }
    }
  };
          className="appearance-none bg-transparent pr-8 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer min-w-[120px]"
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\workspace.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useEffect } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { FlowEditor } from '@/components/canvas/flow-editor';
import { SynopticEditor } from '@/components/canvas/synoptic-editor';
import { SequenceManager } from '@/components/layout/sequence-manager'; // Utilisé comme vue full page
import { SummaryView } from '@/components/layout/summary-view';
import { DomainManifest } from '@/lib/domain-config';

export function Workspace({ config }: { config: DomainManifest }) {
  const viewMode = useCanvasStore((state) => state.viewMode);
  const setViewMode = useCanvasStore((state) => state.setViewMode);
  const summaryData = useCanvasStore((state) => state.summaryData);

  // SÉCURITÉ : Fallback si la vue n'est pas supportée par le domaine
    }
  const isEnabled = (view: any) => config.ui.enabledViews.includes(view);
    // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\shell\language-switcher.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface LanguageSwitcherProps {
  /**
   * Dictionnaire optionnel de liens alternatifs.
   * Ex: { en: '/en/blog/my-translated-slug', fr: '/fr/blog/mon-slug-original' }
   */
  alternates?: Record<string, string>;
}

export function LanguageSwitcher({ alternates }: LanguageSwitcherProps) {
  // ... implementation hidden for brevity ...
  // Sécurisation du typage de la locale
  // Fermer le menu si on clique ailleurs
    const handleClickOutside = (event: MouseEvent) => {
      // ... implementation hidden for brevity ...
      }
    };
  const handleLanguageChange = (targetLocale: string) => {
    // ... implementation hidden for brevity ...
    // 1. Priorité : Si une URL spécifique est fournie pour cette langue (ex: article de blog traduit)
    }
    // 2. Fallback : Remplacement simple du segment de locale dans l'URL actuelle
    // Ex: /fr/dashboard -> /en/dashboard
    // On s'assure de remplacer le bon segment (index 1 car l'URL commence par /)
    // Si l'URL ne contient pas la locale (ex: racine), on la préfixe.
    }
  };
        className={clsx(
          // ... implementation hidden for brevity ...
              className={clsx(
                // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\shell\side-nav.tsx (SKELETON)
============================================================
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Network, 
  LayoutDashboard, 
  FlaskConical, 
  Home,
  Settings2,
  ArrowLeft,
  ShieldCheck,
  LogOut,
  BookOpen // Icône pour la doc
} from 'lucide-react';
import { clsx } from 'clsx';
  // ... implementation hidden for brevity ...
import { signOut, useSession } from "next-auth/react";
  // ... implementation hidden for brevity ...
import { t } from '@/lib/i18n'; // Helper de traduction indispensable
  // ... implementation hidden for brevity ...
import { useParams } from 'next/navigation'; // 1. Import
  // ... implementation hidden for brevity ...
import { Locale } from '@/lib/i18n'; // 2. Import du type
  // ... implementation hidden for brevity ...
interface SideNavProps {
  // ... implementation hidden for brevity ...
}
export function SideNav({ projectId, systemId }: SideNavProps) {
  // ... implementation hidden for brevity ...
  // Vérification du rôle admin via la session NextAuth
  // Définition des items avec labels multilingues
    }
        className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all mb-6 group shrink-0"
          // ... implementation hidden for brevity ...
              className={clsx(
                // ... implementation hidden for brevity ...
              className={clsx(
                // ... implementation hidden for brevity ...
           className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-all group relative"
             // ... implementation hidden for brevity ...
           className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group relative"
             // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\layout\shell\universal-header.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { 
  ChevronRight, Folder, LayoutDashboard, Save, 
  Play, Loader2, Network, ListOrdered, Factory, Map, 
  Settings, Sparkles, Layers, StopCircle, LayoutList
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { SystemSelector } from '../system-selector';
import { clsx } from 'clsx';
import { runProjectSummaryAction } from '@/app/actions/simulation';
import { saveGraph } from '@/app/actions/graph';
import { useState, useRef, useMemo } from 'react';
import { getDomainConfig } from '@/lib/registry';
  // ... implementation hidden for brevity ...
import { t, getDictionary } from '@/lib/i18n'; 
i  // ... implementation hidden for brevity ...
import { toast } from "sonner";
  // ... implementation hidden for brevity ...
import { ProjectSettingsModal } from '../project-settings-modal';
  // ... implementation hidden for brevity ...
import { SimulationConsole } from '@/components/ui/simulation-console';
  // ... implementation hidden for brevity ...
import { useParams } from 'next/navigation';
  // ... implementation hidden for brevity ...
import { Locale, ViewMode } from '@/lib/domain-config';
  // ... implementation hidden for brevity ...
import { LanguageSwitcher } from './language-switcher';
  // ... implementation hidden for brevity ...
interface UniversalHeaderProps {
  // ... implementation hidden for brevity ...
}
  }
};
export function UniversalHeader({ projectName, projectId, domainId, systems, currentSystemId }: UniversalHeaderProps) {
  // ... implementation hidden for brevity ...
  // 1. DÉPENDANCES DU DOMAINE
  // 2. ÉTATS ET STORE
  // 3. CONTEXTES DE NAVIGATION
  // --- ACTIONS ---
  const handleSave = async () => {
    // ... implementation hidden for brevity ...
    }
    // Nettoyage des nœuds pour la sauvegarde (Prisma n'a besoin que des données essentielles)
    const cleanNodes = nodes.map(n => ({
      // ... implementation hidden for brevity ...
      type: n.type 
      t  // ... implementation hidden for brevity ...
      // Appel à la Server Action optimisée (Bulk Write)
        // Affiche l'erreur renvoyée par le serveur (ex: "IDOR Protection")
      }
    }
  };
  const handleAbort = () => {
    // ... implementation hidden for brevity ...
        // Envoie le signal d'annulation à la requête fetch en cours
    }
  };
  const handleSimulateStreaming = async () => {
    // ... implementation hidden for brevity ...
    }
        // Nettoyage des noeuds: Exclure les résultats de la simulation précédente
        const cleanNodes = nodes.map(n => {
          // ... implementation hidden for brevity ...
            // Copie des propriétés SANS la clé 'simulationResults'
                type: n.type, 
                t  // ... implementation hidden for brevity ...
            };
        };
        // Appel à l'API Route Next.js (Proxy Sécurisé)
        }
        // Boucle de lecture du flux NDJSON
                        // 🚩 Injection des résultats pour le SmartNode
                        // Si le solveur Python renvoie une erreur métier
                    }
            }
        }
        // 🚩 Une fois le stream terminé, on persiste le résultat final en base
            // NOTE: Ceci sera remplacé par la vraie Server Action de persistance
        }
        // 🚩 TRÈS IMPORTANT : Réinitialisation propre
    }
  };
              // Rendu pour la vue Blueprint (Plan + Bilan global)
                  className={clsx(
                    // ... implementation hidden for brevity ...
                  className={clsx(
                    // ... implementation hidden for brevity ...
                  // Séparateur juste avant le Bilan pour le distinguer des vues d'édition
                        className={clsx(
                          // ... implementation hidden for brevity ...
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all disabled:opacity-50"
                    // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\library\library-manager.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState } from 'react';
import { Upload, Settings } from 'lucide-react';
import { DynamicIcon as Icon } from '@/components/ui/dynamic-icon'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { importLibraryAction } from '@/app/actions/library';
import { importCategorySchemas } from '@/app/actions/configuration';
import { ReferenceItemEditor } from './reference-item-editor'; 
import { getDomainConfig } from '@/lib/registry';
import { toast } from "sonner";
import { t } from '@/lib/i18n'; // Assurez-vous que l'import est correct

interface LibraryManagerProps {
  allItems: any[];
}
export function LibraryManager({ allItems, domain, dynamicSchemas }: LibraryManagerProps) {
  // ... implementation hidden for brevity ...
  // --- IMPORT DES DONNÉES (ITEMS) ---
  const handleDataUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... implementation hidden for brevity ...
    const promise = new Promise((resolve, reject) => {
      // ... implementation hidden for brevity ...
          }
        }
      };
  };
  // --- IMPORT DE LA CONFIGURATION (SCHEMAS) ---
  const handleConfigUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... implementation hidden for brevity ...
    const promise = new Promise((resolve, reject) => {
      // ... implementation hidden for brevity ...
          }
        }
      };
  };
                  type="file" 
                  className="hidden" 
                  type="file" 
                  className="hidden" 
}
```

============================================================
FILE: quantum-core\apps\studio\components\library\reference-item-editor.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState, useMemo } from 'react';
import { 
  Search, Plus, Save, Trash2, Layers, Settings2, ChevronRight, 
  Loader2, Package, Atom, Component, Cuboid, PlusCircle, X
} from 'lucide-react';
import { upsertLibraryItem, deleteLibraryItem } from '@/app/actions/library';
import { getDomainConfig } from '@/lib/registry';
import { t, getDictionary } from '@/lib/i18n'; // Import i18n
import { clsx } from 'clsx';
import { toast } from 'sonner';

interface ReferenceItemEditorProps {
  allItems: any[];       
}
export function ReferenceItemEditor({ 
e  // ... implementation hidden for brevity ...
  // Context i18n
  // --- ÉTATS ---
  // --- FILTRAGE ---
  const { basicItems, compositeItems } = useMemo(() => {
    // ... implementation hidden for brevity ...
    const matches = allItems.filter(item => {
      // ... implementation hidden for brevity ...
    const sortFn = (a: any, b: any) => a.name.localeCompare(b.name);
      // ... implementation hidden for brevity ...
  // --- HANDLERS ---
  const handleSelect = (item: any) => {
    // ... implementation hidden for brevity ...
    const flatComp = item.components?.map((c: any) => ({
      // ... implementation hidden for brevity ...
  };
  const handleNew = () => {
    // ... implementation hidden for brevity ...
  };
  const handleSave = async () => {
    // ... implementation hidden for brevity ...
    }
    }
  };
  const addCustomProperty = () => {
    // ... implementation hidden for brevity ...
  };
  const removeProperty = (key: string) => {
    // ... implementation hidden for brevity ...
  };
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
              c  // ... implementation hidden for brevity ...
                              type={field.type === 'number' ? 'number' : 'text'}
                                // ... implementation hidden for brevity ...
                          const isStandard = (schemas[selectedItem.category] || []).some((f: any) => f.id === key);
                            // ... implementation hidden for brevity ...
}
function ListItem({ item, isSelected, onClick }: any) {
  // ... implementation hidden for brevity ...
}
function PropField({ label, value, onChange, type = "text", asTextarea, unit, options }: any) {
  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\library\views\library-io-view.tsx (SKELETON)
============================================================
```tsx
'use client';

import { Upload, Download, FileJson, FileText, Database } from 'lucide-react';
import { importLibraryAction, exportLibraryData } from '@/app/actions/library';

export function LibraryIOView({ domain }: { domain: string }) {
  
  // --- IMPORTATION ---
  const handleDataUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        }
      }
    };
  };
  // --- EXPORTATION AVEC FILTRES ---
  const handleExport = async (filterType: 'ALL' | 'CHEMISTRY' | 'HARDWARE') => {
    // ... implementation hidden for brevity ...
      // Définition des catégories par famille
      }
      // Appel serveur avec les filtres
      // Génération du nom de fichier
      // Téléchargement
    }
  };
                        className="py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-100 transition-all"
                          // ... implementation hidden for brevity ...
                        className="py-2.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-[10px] font-bold uppercase hover:bg-blue-100 transition-all"
                          // ... implementation hidden for brevity ...
                    className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:border-slate-400 hover:text-slate-900 transition-all"
                      // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\library\views\library-specs-view.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState } from 'react';
import { Settings, Upload, Code } from 'lucide-react';
import { importCategorySchemas } from '@/app/actions/configuration';

export function LibrarySpecsView({ domain, schemas }: { domain: string, schemas: any }) {
  
  const handleConfigUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        }
    };
  };
}
```

============================================================
FILE: quantum-core\apps\studio\components\marketing\blog-search-grid.tsx (SKELETON)
============================================================
```tsx
// apps/studio/components/marketing/blog-search-grid.tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, ArrowRight, ArrowLeft, Hexagon, Hash, 
  Clock, Sparkles, BookOpen, GraduationCap, ChevronRight 
} from 'lucide-react';
import { clsx } from 'clsx';

export function BlogSearchGrid({ 
    tutorials = [],
    initialPosts = [], 
  // --- LOGIQUE UNIQUE DE MISE À JOUR DE L'URL ---
  const updateFilters = (newParams: Record<string, string | null>) => {
    // ... implementation hidden for brevity ...
    // On récupère les paramètres actuels pour les préserver
      }
    // 🚩 RÉPARATION : On ne force "page=1" QUE si on n'est pas en train de paginer.
    // Si newParams contient 'page', c'est qu'on a cliqué sur Suivant/Précédent.
    }
  };
  // Nuage de tags
  const tagCloud = useMemo(() => {
    // ... implementation hidden for brevity ...
      }
            type="text"
            className="flex-1 py-4 bg-transparent outline-none text-lg font-medium text-slate-800 placeholder:text-slate-300"
              // ... implementation hidden for brevity ...
                        className="group relative bg-slate-900 rounded-[2.5rem] p-8 overflow-hidden transition-all hover:scale-[1.01] hover:shadow-2xl shadow-blue-900/20"
                          // ... implementation hidden for brevity ...
                    className={clsx(
                      // ... implementation hidden for brevity ...
                className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-900 disabled:opacity-20 hover:gap-4 transition-all"
                  // ... implementation hidden for brevity ...
                className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-900 disabled:opacity-20 hover:gap-4 transition-all"
                  // ... implementation hidden for brevity ...
}
function PostCard({ post, locale, isFeatured }: any) {
  // ... implementation hidden for brevity ...
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\marketing\lead-capture.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState } from "react";
import { registerLeadAction } from "@/app/actions/leads";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export function LeadCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await registerLeadAction(email, "landing_hero");
    if (res.success) setStatus("success");
  };
  }
        type="email" 
        className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-slate-500 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          // ... implementation hidden for brevity ...
        type="submit" 
        className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-[0.2em] px-8 py-4 rounded-2xl shadow-lg shadow-blue-900/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\marketing\share-button.tsx (SKELETON)
============================================================
```tsx
// apps/studio/components/marketing/share-button.tsx
'use client';

import { Share2, Linkedin, Twitter, Mail, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ShareButton({ post, locale }: { post: any, locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  const url = `${baseUrl}/${locale}/blog/${post.slug}`;
  
  // On limite le résumé pour ne pas dépasser les quotas de caractères (X/Twitter)
  const handleCopy = async () => {
    // ... implementation hidden for brevity ...
  };
      // LinkedIn ignore le texte forcé, il utilise UNIQUEMENT les balises OG de la page
      // Twitter prend le texte (Titre + Résumé) + l'URL
      // Email permet un formatage complet
    }
        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex items-center gap-2 font-bold text-xs"
          // ... implementation hidden for brevity ...
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  // ... implementation hidden for brevity ...
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\marketing\tutorial-nav.tsx (SKELETON)
============================================================
```tsx
'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle, ChevronRight, ChevronLeft, List } from 'lucide-react';
import { clsx } from 'clsx';

interface TutorialNavProps {
  tutorial: {
    title: string;
    posts: { id: string; title: string; slug: string; order: number }[];
  };
  currentPostId: string;
  locale: string;
}

export function TutorialNav({ tutorial, currentPostId, locale }: TutorialNavProps) {
  // ... implementation hidden for brevity ...
  const currentIndex = tutorial.posts.findIndex(p => p.id === currentPostId);
            // Assuming posts before current are "read"
                  className={clsx(
                    // ... implementation hidden for brevity ...
            className="flex flex-col p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group text-left"
              // ... implementation hidden for brevity ...
            className="flex flex-col items-end p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group text-right"
              // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\providers\auth-provider.tsx (SKELETON)
============================================================
```tsx
'use client';

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

============================================================
FILE: quantum-core\apps\studio\components\providers\confirm-provider.tsx (SKELETON)
============================================================
```tsx
'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

type ConfirmOptions = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'info';
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};
export function ConfirmProvider({ children }: { children: ReactNode }) {
  // ... implementation hidden for brevity ...
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => {});
    // ... implementation hidden for brevity ...
  const confirm = useCallback((opts: ConfirmOptions) => {
    // ... implementation hidden for brevity ...
  const handleClose = (value: boolean) => {
    // ... implementation hidden for brevity ...
  };
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors"
                  // ... implementation hidden for brevity ...
                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white shadow-lg transition-transform active:scale-95 ${
                  // ... implementation hidden for brevity ...
}
export const useConfirm = () => {
  // ... implementation hidden for brevity ...
};
```

============================================================
FILE: quantum-core\apps\studio\components\ui\ai-chat-modal.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Bot, Send, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import ReactMarkdown from 'react-markdown';
import { t } from '@/lib/i18n'; // Import du helper i18n
import { useParams } from 'next/navigation'; // 1. Import
import { Locale } from '@/lib/i18n'; // 2. Import du type

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
  };
}
export function AiChatModal({ isOpen, onClose, context }: AiChatModalProps) {
  // ... implementation hidden for brevity ...
  // Auto-scroll au bas du chat
  const scrollToBottom = () => {
    // ... implementation hidden for brevity ...
  };
  // Nettoyage lors de la fermeture
    }
  const handleSendMessage = async (e?: React.FormEvent) => {
    // ... implementation hidden for brevity ...
    // Initialisation de l'AbortController pour cette requête
    // Mise à jour locale immédiate (User + Placeholder AI)
        // Mise à jour réactive du dernier message (IA)
          }
      }
    }
  };
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              // ... implementation hidden for brevity ...
                className={clsx(
                  // ... implementation hidden for brevity ...
            className="p-6 border-t border-slate-100 bg-white flex gap-4 shrink-0"
            type="text"
            className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 text-sm transition-all font-medium"
              // ... implementation hidden for brevity ...
            type="submit"
            className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all disabled:opacity-50 shadow-xl shadow-slate-200 flex items-center justify-center"
              // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\ui\dynamic-icon.tsx (SKELETON)
============================================================
```tsx
'use client';

import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  // @ts-ignore - On récupère l'icône dynamiquement par son nom
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return <Icons.HelpCircle {...props} />; // Icône par défaut si non trouvée
  }
}
```

============================================================
FILE: quantum-core\apps\studio\components\ui\feedback-modal.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState } from 'react';
import { X, MessageSquareText, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { recordAuditLog } from '@/app/actions/audit'; // Notre action d'audit

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    page: string;
    projectId?: string;
    systemId?: string;
    domain?: string;
  };
}
export function FeedbackModal({ isOpen, onClose, context }: FeedbackModalProps) {
  // ... implementation hidden for brevity ...
  const handleSubmit = async (e: React.FormEvent) => {
    // ... implementation hidden for brevity ...
    }
    }
  };
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              // ... implementation hidden for brevity ...
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\ui\markdown-viewer.tsx (SKELETON)
============================================================
```tsx
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function MarkdownViewer({ content }: { content: string }) {
  return (
    <div className="w-full text-slate-800">
      <ReactMarkdown 
          // ... vos composants h1, h2, p, etc. inchangés ...
          // --- LE CORRECTIF EST ICI ---
          // On force la balise <pre> parente à être transparente et sans marge
          // pour qu'elle n'interfère pas avec notre fenêtre de code personnalisée.
              // Le 'not-prose' ici protège le contenu, mais le 'pre' ci-dessus protège le conteneur
          }
}
```

============================================================
FILE: quantum-core\apps\studio\components\ui\node-selector.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { Network, Unplug, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useMemo } from 'react';

interface NodeSelectorProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  filter?: string[]; // Liste des types autorisés (ex: ['DRAIN', 'STORAGE_TANK'])
}

export function NodeSelector({ value, onChange, filter }: NodeSelectorProps) {
  const nodes = useCanvasStore((state) => state.nodes);
  // 1. Filtrer les noeuds disponibles selon les critères du manifeste
  const availableNodes = useMemo(() => {
    // ... implementation hidden for brevity ...
      // On ne peut pas se connecter à soi-même (logique)
      // Note: On pourrait passer l'ID du noeud courant pour filtrer plus précisément
  // 2. Trouver le label du noeud actuellement sélectionné
  const selectedNodeLabel = useMemo(() => {
    // ... implementation hidden for brevity ...
        className={clsx(
          // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\ui\resizable-panel.tsx (SKELETON)
============================================================
```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

interface ResizablePanelProps {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  side?: 'left' | 'right'; // 'left' pour la palette, 'right' pour les propriétés
}

export function ResizablePanel({ 
  children, 
  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);
  const resize = useCallback((e: MouseEvent) => {
    // ... implementation hidden for brevity ...
        // Calcul depuis le bord droit
        // Calcul depuis le bord gauche (pour la palette)
      }
      }
    }
    };
      className="h-full flex shrink-0 relative bg-white"
        className={clsx(
          // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\ui\simulation-console.tsx (SKELETON)
============================================================
```tsx
'use client';

import { X, Terminal, Loader2, StopCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface Log {
  message: string;
  timestamp: string;
}

interface SimulationConsoleProps {
  logs: Log[];
  progress: number;
  isOpen: boolean;
}
export function SimulationConsole({ logs, progress, isOpen, onClose, onAbort, status }: SimulationConsoleProps) {
  // ... implementation hidden for brevity ...
            className={clsx("h-full transition-all duration-300 ease-out", 
            c  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\components\ui\tabs.tsx (SKELETON)
============================================================
```tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Helper pour fusionner les classes Tailwind
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
    className={cn(
      // ... implementation hidden for brevity ...
      className
    className={cn(
      // ... implementation hidden for brevity ...
      className
    className={cn(
      // ... implementation hidden for brevity ...
      className
export { Tabs, TabsList, TabsTrigger, TabsContent }
  // ... implementation hidden for brevity ...
```

============================================================
FILE: quantum-core\apps\studio\lib\component-registry.tsx (SKELETON)
============================================================
```tsx
// apps/studio/lib/component-registry.tsx

import { SmartNode } from '@/components/canvas/smart-node';
import { GenericNode } from '@/components/canvas/generic-node';

// Import des composants spécifiques au domaine
import { EndpointNode } from '@/components/domains/surface_treatment/endpoint-node';
import { WaterPropertiesWidget } from '@/components/domains/surface_treatment/water-properties-widget';
import { NetworkManager } from '@/components/domains/surface_treatment/network-manager';
import { ProcessReport } from '@/components/domains/surface_treatment/process-report';

// Définition des types de slots disponibles pour l'injection
type ComponentMap = {
  nodes: Record<string, React.ComponentType<any>>;      // Composants graphiques (Graphe)
  forms: Record<string, React.ComponentType<any>>;      // Formulaires complets (Propriétés)
};
// --- LE REGISTRE ---
  // DOMAINE : SURFACE TREATMENT (Mise à jour Chapitre 6)
      // Les équipements principaux utilisent le SmartNode spécialisé (Health Bars, etc.)
      // Les terminaux utilisent le visuel spécifique "Pilule"
      // Géré dynamiquement par le PropertiesPanel générique via le Manifeste
      // On utilise le WaterPropertiesWidget pour tout ce qui touche à l'eau et aux flux
      // Ce widget gère à la fois le Bus Projet (Drain/Source) et les Appoints/Surverses (Baths/Rinses)
      // Affiche le gestionnaire de réseaux local quand rien n'est sélectionné
      // Le rapport complet de bilan de masse et ionique
    }
  }
};
// --- HELPERS D'ACCÈS ---
/**
 * Retourne le composant visuel pour le noeud sur le canvas
 */
export function getDomainNode(domain: string, type: string) {
  // ... implementation hidden for brevity ...
}
/**
 * Retourne un formulaire spécifique si défini (prioritaire sur le générique)
 */
export function getDomainForm(domain: string, type: string) {
  // ... implementation hidden for brevity ...
}
/**
 * Retourne un widget additionnel à afficher en haut du panneau de propriétés
 */
export function getDomainWidget(domain: string, type: string) {
  // ... implementation hidden for brevity ...
}
/**
 * Retourne un composant pour l'affichage latéral hors sélection (ex: légende, global config)
 */
export function getDomainPanel(domain: string, context: 'EMPTY_SELECTION') {
  // ... implementation hidden for brevity ...
}
/**
 * Retourne le composant de rapport final pour le mode "Bilan"
 */
export function getDomainReport(domain: string) {
  // ... implementation hidden for brevity ...
}
/**
 * Helper pour React Flow (génère l'objet nodeTypes complet dynamiquement)
 */
export function getFlowNodeTypes(domain: string, defaultTypes: any) {
  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\lib\domain-config.ts (SKELETON)
============================================================
```ts
import { LucideIcon } from 'lucide-react';

// --- TYPES DE BASE ---

// Support pour les labels traduisibles : soit une chaîne simple, soit un objet par langue
export type I18nLabel = string | { fr: string; en: string };

// Scopes standards de l'ingénierie (ISA-S88 / P&ID)
// PROCESS: Équipement principal de la ligne (ex: Cuve)
// UTILITY: Réseau support (ex: Eau, Drain, Air)
export type NodeScope = 'PROCESS' | 'UTILITY' | 'INFRASTRUCTURE';

/**
 * MODES DE VUE (Layouts)
 * GRAPH: Éditeur de nœuds libre (type React Flow)
 * SYNOPTIC: Vue verticale/linéaire ordonnée (Process Flow Diagram)
 * SEQUENCES: Gestionnaire de gammes opératoires / séquencement
 * SUMMARY: Bilan technique et rapport final
 */
export type ViewMode = 'GRAPH' | 'SYNOPTIC' | 'SEQUENCES' | 'SUMMARY';
// Définition pour les requêtes vers la bibliothèque (Filtres)
export type LibraryQuery = {
  // ... implementation hidden for brevity ...
};
// --- DÉFINITION DES CHAMPS (Méta-Modèle) ---
export type FieldDefinition = 
  // 1. Champ Numérique & Physique (Avec Unités et Profils Temporels)
      type: 'number' | 'quantity'; 
      t  // ... implementation hidden for brevity ...
    }
  // 2. Champs Texte Simple
      type: 'string'; 
      t  // ... implementation hidden for brevity ...
    }
  // 3. Champ Booléen (Switch)
      type: 'boolean'; 
      t  // ... implementation hidden for brevity ...
    }
  // 4. Liste Déroulante (Choix Statiques)
      type: 'select'; 
      t  // ... implementation hidden for brevity ...
    }
  // 5. Sélecteur de Bibliothèque (Filtres Contextuels)
      type: 'library-selector'; 
      t  // ... implementation hidden for brevity ...
    }
  // 6. Sélecteur de Nœud (Liaisons Wireless)
      type: 'node-selector'; 
      t  // ... implementation hidden for brevity ...
    }
  // 7. Collection / Tableau (Support Natif du Nesting / Accessoires)
      type: 'collection';
        // ... implementation hidden for brevity ...
    };
// --- NOUVEAU : STRUCTURE DE GROUPEMENT (TABS) ---
/**
 * Représente un groupe de champs qui sera affiché dans un onglet (Tab)
 */
export type FieldGroup = {
  // ... implementation hidden for brevity ...
};
// --- SCHÉMAS D'OBJETS ---
// Définition d'un Noeud (Équipement / Asset)
export type NodeSchema = {
  // ... implementation hidden for brevity ...
};
// Définition d'une Arête (Tuyauterie / Câblage)
export type EdgeSchema = {
  // ... implementation hidden for brevity ...
};
// Définition d'une Bibliothèque
export type LibraryDefinition = {
  // ... implementation hidden for brevity ...
  type: 'COMPOUND' | 'SIMPLE'; 
  t  // ... implementation hidden for brevity ...
};
// --- CONFIGURATION UI (LAYOUTS) ---
/**
 * Définit le comportement de l'interface pour ce domaine particulier
 */
export type UIConfiguration = {
  // ... implementation hidden for brevity ...
};
// --- MANIFESTE GLOBAL ---
export type DomainManifest = {
  // ... implementation hidden for brevity ...
};
```

============================================================
FILE: quantum-core\apps\studio\lib\i18n.ts (SKELETON)
============================================================
```ts
// apps/studio/lib/i18n.ts
import fr from '../locales/fr.json';
import en from '../locales/en.json';

export type Locale = 'fr' | 'en';

const dictionaries = {
  fr,
  en,
};

/**
 * Traduit un label provenant du Manifeste (type I18nLabel)
 * Gère les chaînes simples ou les objets { fr: "", en: "" }
 */
export function t(label: any, locale: Locale | string = 'fr'): string {
  // ... implementation hidden for brevity ...
  // Si c'est déjà une string, on la renvoie
  // Si c'est un objet de traduction
}
/**
 * Récupère le dictionnaire de traduction statique
 */
export function getDictionary(locale: Locale | string = 'fr') {
  // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\apps\studio\lib\registry.ts (SKELETON)
============================================================
```ts
// apps/studio/lib/registry.ts

import { SURFACE_TREATMENT_CONFIG } from './domains/surface-treatment';
// import { ENERGY_CONFIG } from './domains/energy';

// 1. REGISTRE CENTRAL
// C'est le seul endroit où les domaines sont "hardcodés" par importation.
const DOMAIN_REGISTRY: Record<string, any> = {
  SURFACE_TREATMENT: SURFACE_TREATMENT_CONFIG,
  // ENERGY: ENERGY_CONFIG
};

// 2. EXPORTS DYNAMIQUES
export const AVAILABLE_DOMAIN_IDS = Object.keys(DOMAIN_REGISTRY);

export function isDomainValid(domainId: string): boolean {
  // ... implementation hidden for brevity ...
}
export function getAvailableDomains() {
  // ... implementation hidden for brevity ...
}
// 3. RÉCUPÉRATION DE CONFIGURATION (STRICTE)
export function getDomainConfig(domainId?: string) {
  // ... implementation hidden for brevity ...
  // A. Si un ID est fourni, on vérifie son existence
    // Si l'ID est invalide, on ne devine pas. On crashe pour alerter le dev.
  }
  // B. Fallback sur la variable d'environnement (Configuration Serveur explicite)
  }
  // C. Si aucune config n'est trouvée, on ARRÊTE TOUT.
  // Pas de "SURFACE_TREATMENT" par défaut.
}
```

============================================================
FILE: quantum-core\apps\studio\lib\domains\energy.ts (SKELETON)
============================================================
```ts

```

============================================================
FILE: quantum-core\apps\studio\lib\domains\surface-treatment.ts (SKELETON)
============================================================
```ts
// apps/studio/lib/domains/surface-treatment.ts

import { DomainManifest, FieldDefinition } from '../domain-config';

const globalEvaporationSettings: FieldDefinition[] = [
    { 
        id: "workshopTemp", 
        label: { fr: "Température Atelier (°C)", en: "Workshop Temp (°C)" }, 
        type: "quantity", 
        unit: "°C", 
        default: 20 
    },
    { 
        id: "evapCoefficient", 
        label: { fr: "Coeff. Évaporation", en: "Evaporation Coeff." }, 
        type: "number", 
        t  // ... implementation hidden for brevity ...
        type: "number", 
        t  // ... implementation hidden for brevity ...
        type: "number", 
        t  // ... implementation hidden for brevity ...
export const SURFACE_TREATMENT_CONFIG: DomainManifest = {
  // ... implementation hidden for brevity ...
  // 🚩 CONFIGURATION UI PILOTÉE PAR LE MANIFESTE
  // On définit ici les outils pertinents pour l'ingénieur procédé.
    // 🚩 DÉFINITION DES PARAMÈTRES DE GAMME
        type: "quantity", 
        t  // ... implementation hidden for brevity ...
        type: "quantity", 
        t  // ... implementation hidden for brevity ...
    // --- BAIN DE TRAITEMENT (PROCESS_BATH) ---
              type: "collection", 
              t  // ... implementation hidden for brevity ...
            }
        }
    // --- CUVE DE RINÇAGE (RINSE_TANK) ---
        }
    // --- UTILITIES (SOURCE) ---
        }
    // --- UTILITIES (DRAIN) ---
        }
    }
        }
    }
  }
};
```

============================================================
FILE: quantum-core\apps\studio\locales\en.json (SKELETON)
============================================================
```json
{
  "ui": {
    "save": "Save",
    "simulate": "Simulate",
    "process": "Process",
    "utilities": "Utilities",
    "accessories": "Accessories",
    "loading": "Loading...",
    "error": "Error",
    "dashboard": "Projects",
    "settings": "Settings",
    "none": "None",
    "add": "Add",
    "delete": "Delete"
  },
  "scopes": {
    "PROCESS": "Process Equipment",
    "UTILITY": "Utility / Network"
  },
  "marketingPage": {
    "title": "Build the future of water treatment"
  },
  "dashboard": {
    "title": "My Projects",
    "subtitle": "Industrial digital twin management cockpit.",
    "searchPlaceholder": "Search project by name, client or domain...",
    "advancedFilters": "Advanced filters",
    "emptyTitle": "No active projects",
    "emptyDesc": "Start by initializing a new project using the button above.",
    "unauthorized": "Unauthorized access. Please log in."
  }
}
```

============================================================
FILE: quantum-core\apps\studio\locales\fr.json (SKELETON)
============================================================
```json
{
  "ui": {
    "save": "Sauvegarder",
    "simulate": "Simuler",
    "process": "Procédé",
    "utilities": "Utilités",
    "accessories": "Accessoires",
    "loading": "Chargement...",
    "error": "Erreur",
    "dashboard": "Projets",
    "settings": "Paramètres",
    "none": "Aucun",
    "add": "Ajouter",
    "delete": "Supprimer"
  },
  "scopes": {
    "PROCESS": "Équipement Process",
    "UTILITY": "Réseau / Utilité"
  },
  "marketingPage": {
    "title": "Bâtir le futur du traitement de l'eau"
  },
  "dashboard": {
    "title": "Mes Projets",
    "subtitle": "Cockpit de gestion des jumeaux numériques industriels.",
    "searchPlaceholder": "Rechercher une étude par nom, client ou domaine...",
    "advancedFilters": "Filtres avancés",
    "emptyTitle": "Aucune étude active",
    "emptyDesc": "Commencez par initialiser une nouvelle étude en utilisant le bouton ci-dessus.",
    "unauthorized": "Accès non autorisé. Veuillez vous connecter."
  }
}
```

============================================================
FILE: quantum-core\apps\studio\store\canvas-store.ts (SKELETON)
============================================================
```ts
import { create } from 'zustand';
import { CanvasState } from './types';
import { createWorkspaceSlice } from './slices/workspace-slice';
import { createGraphSlice } from './slices/graph-slice';
import { createSequenceSlice } from './slices/sequence-slice';

export const useCanvasStore = create<CanvasState>()((...a) => ({
  ...createWorkspaceSlice(...a),
  ...createGraphSlice(...a),
  ...createSequenceSlice(...a),
}));

export * from './types';
```

============================================================
FILE: quantum-core\apps\studio\store\types.ts (SKELETON)
============================================================
```ts
import { Edge, Node, OnNodesChange, OnEdgesChange, OnConnect, Connection } from '@xyflow/react';

export interface NodeProperties {
  [key: string]: any;
  simulationResults?: Record<string, any>;
  accessories?: any[];
}

export interface AppNodeData extends Record<string, unknown> {
  type: string;
  label: string;
  scope: 'PROCESS' | 'UTILITY' | 'INFRASTRUCTURE';
  properties: NodeProperties;
}

export type AppNode = Node<AppNodeData>;
export interface AppSequence {
  // ... implementation hidden for brevity ...
}
export interface WorkspaceSlice {
  // ... implementation hidden for brevity ...
}
export interface GraphSlice {
  // ... implementation hidden for brevity ...
}
export interface SequenceSlice {
  // ... implementation hidden for brevity ...
}
export type CanvasState = WorkspaceSlice & GraphSlice & SequenceSlice;
```

============================================================
FILE: quantum-core\apps\studio\store\domains\surface_treatment\topology.ts (SKELETON)
============================================================
```ts
import { AppNode, NodeProperties } from '../../types';

/**
 * Synchronise les flux hydrauliques pour éviter la double saisie.
 */
export function syncSurfaceTreatmentTopology(
  nodeId: string,
  newProps: Partial<NodeProperties>,
  allNodes: AppNode[]
): AppNode[] {
  let updatedNodes = [...allNodes];

  // RÈGLE 1 : Si A déborde dans B, alors B sait qu'il reçoit de A
  if (newProps.overflowTargetId) {
    const targetId = newProps.overflowTargetId;
  }
  // RÈGLE 2 : Si B est alimenté par A, alors A déborde dans B
  }
}
/**
 * Nettoie les références quand un nœud est supprimé.
 */
export function cleanupSurfaceTreatmentReferences(
      }
}
```

============================================================
FILE: quantum-core\apps\studio\store\slices\graph-slice.ts (SKELETON)
============================================================
```ts
import { StateCreator } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { CanvasState, GraphSlice } from '../types';
import { getDomainConfig } from '@/lib/registry';
import { syncSurfaceTreatmentTopology, cleanupSurfaceTreatmentReferences } from '../domains/surface_treatment/topology';

export const createGraphSlice: StateCreator<CanvasState, [], [], GraphSlice> = (set, get) => ({
  nodes: [],
  edges: [],

  setGraph: (nodes, edges) => set({ nodes, edges }),

  addNode: (type, position) => {
    const config = getDomainConfig();
    const nodeSchema = config.nodeTypes[type];
        }
      type,
    };
      // Branchement logique de domaine (Surface Treatment)
      }
      const removedIds = changes.filter(c => c.type === 'remove').map(c => c.id);
        }
      }
    // Logique d'auto-layout à importer d'un fichier lib séparé pour la propreté
  }
```

============================================================
FILE: quantum-core\apps\studio\store\slices\sequence-slice.ts (SKELETON)
============================================================
```ts
import { StateCreator } from 'zustand';
import { CanvasState, SequenceSlice } from '../types';
import { createSequenceAction, deleteSequenceAction, updateSequenceMetaAction, updateSequenceStepsAction } from '@/app/actions/sequence';

export const createSequenceSlice: StateCreator<CanvasState, [], [], SequenceSlice> = (set, get) => ({
  sequences: [],
  selectedSequenceId: null,

  setSequences: (sequences) => set({ sequences }),

  addSequence: async (name) => {
    const { systemId } = get();
    if (!systemId) return;
    const tempId = crypto.randomUUID();
    const defaultProps = { cadence: 10, dragOutSpecific: 0.1 };
    }
```

============================================================
FILE: quantum-core\apps\studio\store\slices\workspace-slice.ts (SKELETON)
============================================================
```ts
import { StateCreator } from 'zustand';
import { CanvasState, WorkspaceSlice } from '../types';

export const createWorkspaceSlice: StateCreator<CanvasState, [], [], WorkspaceSlice> = (set, get) => ({
  projectId: null,
  systemId: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  viewMode: 'GRAPH',
  synopticMode: 'PHYSICAL',
  summaryData: null,
  visibleScopes: ['PROCESS', 'UTILITY', 'INFRASTRUCTURE'],

  setProjectId: (id) => set({ projectId: id }),
  setSystemId: (id) => set({ systemId: id }),
  // Injection atomique des résultats de simulation
      const nextNodes = state.nodes.map((node) => {
        // ... implementation hidden for brevity ...
          };
        }
    const next = current.includes(scope) ? current.filter(s => s !== scope) : [...current, scope];
      // ... implementation hidden for brevity ...
  }
```

============================================================
FILE: quantum-core\apps\studio\types\next-auth.d.ts (SKELETON)
============================================================
```ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "USER"
    } & DefaultSession["user"]
  }

  interface User {
    role: "ADMIN" | "USER"
  }
}

  interface JWT {
    // ... implementation hidden for brevity ...
  }
}
```

============================================================
FILE: quantum-core\packages\database\index.ts (SKELETON)
============================================================
```ts
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Fonction pour instancier le client avec l'adaptateur
const createPrismaClient = () => {
  // 1. On crée un Pool de connexion PostgreSQL classique
  const pool = new Pool({ connectionString });
  
  // 2. On crée l'adaptateur Prisma qui utilise ce pool
  const adapter = new PrismaPg(pool);
  // 3. On passe l'adaptateur au client
};
export const db = globalForPrisma.prisma || createPrismaClient();
export * from '@prisma/client';
```

============================================================
FILE: quantum-core\packages\database\package.json (FULL)
============================================================
```json
{
  "name": "@repo/database",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./index.ts"
  },
  "typesVersions": {
    "*": {
      "*": [
        "src/*"
      ]
    }
  },
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^7.2.0",
    "@prisma/client": "latest",
    "pg": "^8.16.3"
  },
  "devDependencies": {
    "@prisma/config": "latest",
    "@types/node": "latest",
    "@types/pg": "^8.16.0",
    "dotenv": "latest",
    "prisma": "latest",
    "typescript": "latest"
  }
}
```

============================================================
FILE: quantum-core\packages\database\prisma.config.ts (SKELETON)
============================================================
```ts
import { defineConfig, env } from "@prisma/config";
import "dotenv/config"; 

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

============================================================
FILE: quantum-core\packages\database\prisma\schema.prisma (FULL)
============================================================
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

// ==========================================
// 1. AUTHENTIFICATION & UTILISATEURS
// ==========================================
enum UserRole {
  ADMIN
  USER
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime? // <--- REQUIS pour les liens magiques
  image         String?
  role          UserRole  @default(USER)
  lastLogin     DateTime? @default(now())

  // Relations requises pour Auth.js
  accounts Account[]
  sessions Session[]

  projects       Project[] // Projets dont je suis propriétaire
  collaborations ProjectCollaborator[] // Projets partagés avec moi
  posts          Post[]
  auditLogs      AuditLog[]
  createdAt      DateTime              @default(now())
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ==========================================
// 2. MARKETING & KNOWLEDGE
// ==========================================
model Post {
  id        String   @id @default(cuid())
  translationId String    @default(cuid()) // Links FR and EN versions together
  language      String    @default("fr")
  domain    String
  title     String
  slug      String // Pas de @unique ici si tu as @@unique en bas
  excerpt   String?  @db.Text
  content   String   @db.Text
  published Boolean  @default(false)
  image     String?
  tags      String?
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  tutorialId    String?
  tutorial      Tutorial? @relation(fields: [tutorialId], references: [id])
  order         Int       @default(0)
  views     Int      @default(0) // <--- AJOUTEZ CETTE LIGNE
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

   @@unique([language, slug]) 
}

model Lead {
  id        String   @id @default(cuid())
  email     String   @unique
  domain    String
  source    String?
  createdAt DateTime @default(now())
}

// ==========================================
// 3. HIERARCHIE PROJET
// ==========================================
model Project {
  id            String                @id @default(cuid())
  name          String
  domain        String
  userId        String
  user          User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  systems       System[]         
  streams       ProjectStream[] 
  hoursPerDay   Float                 @default(8)
  daysPerWeek   Float                 @default(5)
  weeksPerYear  Float                 @default(47)
  currency      String                @default("EUR")
  createdAt     DateTime              @default(now())
  updatedAt     DateTime              @updatedAt
  collaborators ProjectCollaborator[]
}

model System {
  id          String    @id @default(cuid())
  name        String
  description String?
  type        String    @default("PRODUCTION") // "PRODUCTION" | "TREATMENT"
  projectId   String
  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  positionX   Float     @default(100)
  positionY   Float     @default(100)
  
  nodes       Node[]
  edges       Edge[]
  sequences   Sequence[]
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model ProjectStream {
  id          String   @id @default(cuid())
  name        String
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  // État calculé (Snapshot de la dernière simulation)
  value       Json     @default("{}") @db.JsonB 
  
  // Relations aux Noeuds (Qui écrit ? Qui lit ?)
  inputs      Node[]   @relation("StreamInput")  // Noeuds qui LISENT ce flux (Sources)
  outputs     Node[]   @relation("StreamOutput") // Noeuds qui ÉCRIVENT ce flux (Sinks)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ==========================================
// 4. LE GRAPHE (CORE)
// ==========================================
enum NodeRole {
  SOURCE
  PROCESS
  SINK
}

model Node {
  id         String          @id @default(cuid())
  systemId      String
  system        System   @relation(fields: [systemId], references: [id], onDelete: Cascade)
  role       NodeRole        @default(PROCESS)
  type       String
  label      String
  properties Json            @db.JsonB
  positionX  Float
  positionY  Float
  inputs     Edge[]          @relation("EdgeTarget")
  outputs    Edge[]          @relation("EdgeSource")
  components NodeComponent[]
  steps      SequenceStep[]
  inputStreamId  String?
  inputStream    ProjectStream? @relation("StreamInput", fields: [inputStreamId], references: [id])
  outputStreamId String?
  outputStream   ProjectStream? @relation("StreamOutput", fields: [outputStreamId], references: [id])
}

model Edge {
  id         String @id @default(cuid())
  systemId    String
  system      System   @relation(fields: [systemId], references: [id], onDelete: Cascade)
  sourceId   String
  targetId   String
  source     Node   @relation("EdgeSource", fields: [sourceId], references: [id], onDelete: Cascade)
  target     Node   @relation("EdgeTarget", fields: [targetId], references: [id], onDelete: Cascade)
  category   String @default("PHYSICAL")
  properties Json   @db.JsonB
}

// ==========================================
// 5. LOGIQUE SEQUENTIELLE (GAMMES)
// ==========================================
model Sequence {
  id         String         @id @default(cuid())
  name       String
  systemId    String
  system      System   @relation(fields: [systemId], references: [id], onDelete: Cascade)
  properties Json           @db.JsonB
  steps      SequenceStep[]
}

model SequenceStep {
  id         String   @id @default(cuid())
  order      Int
  sequenceId String
  sequence   Sequence @relation(fields: [sequenceId], references: [id], onDelete: Cascade)
  nodeId     String
  node       Node     @relation(fields: [nodeId], references: [id], onDelete: Cascade)
}

// ==========================================
// 6. BIBLIOTHÈQUE GÉNÉRIQUE
// ==========================================

enum TargetType {
  ARTICLE
  UNIT
}

// ==========================================
// 7. BIBLIOTHÈQUE SPÉCIFIQUE AU DOMAINE
// ==========================================
model LibraryItem {
  id            String  @id @default(cuid())
  domain        String
  category      String
  name          String  @unique
  symbol        String?
  properties    Json    @default("{}") @db.JsonB
  computedCache Json?   @db.JsonB

  // --- RÉCURSIVITÉ ---
  components Composition[] @relation("parentItem")
  usedIn     Composition[] @relation("childItem")

  // --- CORRECTION ICI : Relation inverse pour NodeComponent ---
  nodeComponents NodeComponent[] // Prisma a besoin de savoir que cet item est utilisé par plusieurs composants de noeuds

  // --- TRAÇABILITÉ ---
  sourceType SourceType @default(MANUAL)
  sourceFile String?
  aiMetadata Json?      @db.JsonB

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Composition {
  id       String      @id @default(cuid())
  parentId String
  parent   LibraryItem @relation("parentItem", fields: [parentId], references: [id], onDelete: Cascade)
  childId  String
  child    LibraryItem @relation("childItem", fields: [childId], references: [id])

  quantity Float // Coeff stoechiométrique ou nombre d'unités
  unit     String? // "g/L", "pcs", "m"
}

enum SourceType {
  MANUAL
  JSON_IMPORT
  AI_EXTRACT
}

model NodeComponent {
  id     String @id @default(cuid())
  nodeId String
  node   Node   @relation(fields: [nodeId], references: [id], onDelete: Cascade)

  libraryItemId String
  // Cette ligne pointe vers LibraryItem
  libraryItem   LibraryItem @relation(fields: [libraryItemId], references: [id])

  targetId String?
  value    Float
}

model CategorySchema {
  id        String   @id @default(cuid())
  domain    String   // "WATER"
  category  String   // "PUMP", "TANK", "REAGENT"
  
  // La définition des champs (Array of FieldDefinition)
  // Ex: [{ "id": "power", "label": "Puissance", "type": "number", "unit": "kW" }]
  fields    Json     @db.JsonB 

  updatedAt DateTime @updatedAt

  @@unique([domain, category]) // Une seule config par catégorie dans un domaine
}

// --- COLLABORATION ---
model ProjectCollaborator {
  id        String @id @default(cuid())
  projectId String
  userId    String
  role      String @default("VIEWER") // "EDITOR", "VIEWER"

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
}

// --- AUDIT & ANALYTICS ---
model AuditLog {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  
  // Qui ?
  userId    String?  // Nullable (car l'attaquant n'est souvent pas connecté)
  user      User?    @relation(fields: [userId], references: [id])
  ipAddress String?  // CRUCIAL pour le bannissement (fail2ban)
  userAgent String?  // Pour détecter les scripts/bots

  // Quoi ?
  level     String   @default("INFO") // "INFO", "WARN", "CRITICAL"
  action    String   // "LOGIN_FAILED", "UNAUTHORIZED_ACCESS", "PROJECT_DELETE"
  domain    String   // "AUTH", "SYSTEM", "BILLING"
  
  // Détails techniques (Parfait pour l'IA future)
  // Ex: { "path": "/admin/users", "method": "POST", "error": "Invalid CSRF" }
  metadata  Json?    @db.JsonB

  @@index([userId])
  @@index([action])
  @@index([level])
}

model Tutorial {
  id            String   @id @default(cuid())
  translationId String   @default(cuid()) // Links FR and EN versions together
  language      String   @default("fr")   // The language of this specific record
  
  domain        String
  title         String
  slug          String   
  description   String?  @db.Text
  published     Boolean  @default(false)
  
  posts         Post[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Unique slug PER language (e.g. /fr/tuto-1 and /en/tutorial-1)
  @@unique([language, slug]) 
}

```

============================================================
FILE: quantum-core\packages\eslint-config\README.md (SKELETON)
============================================================
```md
# `@turbo/eslint-config`

Collection of internal eslint configurations.

```

============================================================
FILE: quantum-core\packages\eslint-config\base.js (SKELETON)
============================================================
```js
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
```

============================================================
FILE: quantum-core\packages\eslint-config\next.js (SKELETON)
============================================================
```js
import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import pluginNext from "@next/eslint-plugin-next";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
    // Default ignores of eslint-config-next:
      // React scope no longer necessary with new JSX transform.
```

============================================================
FILE: quantum-core\packages\eslint-config\package.json (FULL)
============================================================
```json
{
  "name": "@repo/eslint-config",
  "version": "0.0.0",
  "type": "module",
  "private": true,
  "exports": {
    "./base": "./base.js",
    "./next-js": "./next.js",
    "./react-internal": "./react-internal.js"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@next/eslint-plugin-next": "^15.5.0",
    "eslint": "^9.39.1",
    "eslint-config-prettier": "^10.1.1",
    "eslint-plugin-only-warn": "^1.1.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-turbo": "^2.7.1",
    "globals": "^16.5.0",
    "typescript": "^5.9.2",
    "typescript-eslint": "^8.50.0"
  }
}

```

============================================================
FILE: quantum-core\packages\eslint-config\react-internal.js (SKELETON)
============================================================
```js
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  js.configs.recommended,
      // React scope no longer necessary with new JSX transform.
```

============================================================
FILE: quantum-core\packages\typescript-config\base.json (SKELETON)
============================================================
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "incremental": false,
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "NodeNext",
    "moduleDetection": "force",
    "moduleResolution": "NodeNext",
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022"
  }
}

```

============================================================
FILE: quantum-core\packages\typescript-config\nextjs.json (SKELETON)
============================================================
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowJs": true,
    "jsx": "preserve",
    "noEmit": true
  }
}

```

============================================================
FILE: quantum-core\packages\typescript-config\package.json (FULL)
============================================================
```json
{
  "name": "@repo/typescript-config",
  "version": "0.0.0",
  "private": true,
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  }
}

```

============================================================
FILE: quantum-core\packages\typescript-config\react-library.json (SKELETON)
============================================================
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}

```

============================================================
FILE: quantum-core\packages\ui\package.json (FULL)
============================================================
```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./*": "./src/*.tsx"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "generate:component": "turbo gen react-component",
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@types/node": "^22.15.3",
    "@types/react": "19.2.2",
    "@types/react-dom": "19.2.2",
    "eslint": "^9.39.1",
    "typescript": "5.9.2"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}

```

============================================================
FILE: quantum-core\packages\ui\tsconfig.json (FULL)
============================================================
```json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}

```

============================================================
FILE: quantum-core\packages\ui\src\button.tsx (SKELETON)
============================================================
```tsx
"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={() => alert(`Hello from your ${appName} app!`)}
};
```

============================================================
FILE: quantum-core\packages\ui\src\card.tsx (SKELETON)
============================================================
```tsx
import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): JSX.Element {
  return (
    <a
      className={className}
        // ... implementation hidden for brevity ...
}
```

============================================================
FILE: quantum-core\packages\ui\src\code.tsx (SKELETON)
============================================================
```tsx
import { type JSX } from "react";

export function Code({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return <code className={className}>{children}</code>;
}

```

============================================================
FILE: ressources\blog-test\01-philosophy-engineering-os.md (SKELETON)
============================================================
```md
---
title: "The Engineering OS: Why we built Quantum Core"
slug: "philosophy-engineering-os"
published: true
tags: "Philosophy, Engineering, SaaS"
---

# Beyond Hard-Coded Software

In the traditional industrial software landscape, engineers are trapped in a cycle of "One-Shot" applications. Whether it is a water treatment calculator or a solar grid simulator, these tools are often rigid monoliths where the logic is hard-coded into the interface.

**Quantum Core** represents a paradigm shift: the **Software Factory**.

### The Core Principles
1. **Abstraction over Specificity**: We do not code "Tanks" or "Batteries." We code "Nodes" that carry dynamic properties.
```

============================================================
FILE: ressources\blog-test\02-meta-model-jsonb-theory.md (SKELETON)
============================================================
```md
---
title: "Modeling the Universe: Nodes, Edges, and JSONB"
slug: "theory-meta-model-jsonb"
published: true
tags: "Architecture, Database, PostgreSQL"
---

# How to Store Any Physical System

The greatest challenge of a generic engineering framework is the database schema. How can one table store both the molar mass of a chemical ion and the peak voltage of a transformer?

### The JSONB Revolution
Quantum Core utilizes PostgreSQL's **JSONB** type. Our schema is reduced to its mathematical essentials:

*   **Nodes**: Representing equipment (Process), inputs (Source), or outputs (Sink).
*   **Edges**: Representing the flow (Physical or Logical) between nodes.
*   **Properties**: A JSONB blob that holds the domain-specific data.
### Topological Roles
*   **SOURCE**: Nodes with only outgoing flows (e.g., Water Mains, Power Grid).
*   **PROCESS**: Nodes that transform or store mass/energy (e.g., Reaction Tanks, Batteries).
*   **SINK**: Nodes that accumulate final outputs (e.g., Waste Treatment, Earth).
```

============================================================
FILE: ressources\blog-test\03-architecture-hybrid-stack.md (SKELETON)
============================================================
```md
---
title: "The Hybrid Brain: Next.js + FastAPI Architecture"
slug: "architecture-hybrid-stack"
published: true
tags: "Architecture, Python, TypeScript"
---

# Orchestration meets Calculation

Quantum Core is built on a "Split-Brain" architecture designed for high-performance engineering.

### Left Brain: Next.js (The Orchestrator)
Next.js handles the human-centric tasks:
*   **Auth & Security**: Managing users and project isolation.
*   **UX/UI**: The ReactFlow canvas and dynamic property panels.
*   **Persistence**: Communicating with PostgreSQL via Prisma 7.
### Right Brain: FastAPI (The Scientist)
### The Synapse: Secure S2S Communication
```

============================================================
FILE: ressources\blog-test\04-theory-logical-sequences.md (SKELETON)
============================================================
```md
---
title: "Smart Sequences: Modelling Movement and Mass Transfer"
slug: "theory-logical-sequences"
published: true
tags: "Engineering, Process-Design, Math"
---

# Beyond Static Pipes

In many industrial processes, such as electroplating or assembly lines, the movement of parts is just as important as the flow through pipes. This is the **Logical Topology**.

### Physical vs. Logical Edges
Quantum Core manages two layers of connectivity:
1.  **Physical Edges**: Drawn on the canvas (Pipes, Wires, Conveyors).
2.  **Logical Sequences (Gammes)**: A list of ordered steps defining the path of a part through the system.
### Mathematical Implementation of Drag-out
```

============================================================
FILE: ressources\blog-test\05-domain-agnosticism-future.md (SKELETON)
============================================================
```md
---
title: "Domain Agnosticism: The Forkable Engineering Future"
slug: "domain-agnosticism-forkability"
published: true
tags: "SaaS, Scalability, AI"
---

# One Core, Infinite Verticals

The ultimate goal of Quantum Core is to reach **Total Domain Independence**. 

### How to Fork Quantum Core
Because of our modular architecture, launching a new engineering SaaS (e.g., QuantumSolar or QuantumHVAC) requires only three steps:

1.  **Define the Vocabulary**: Map the domain manifest (change "Tank" to "Inverter").
### The Role of Generative AI
```

============================================================
FILE: ressources\blog-test\06-Surface-treatment-solver.md (SKELETON)
============================================================
```md
---
title: "The Engineering Specification: Quantum Core Physics Engine"
slug: "solver-suraface-treatment"
published: true
tags: "solver, engineering, chemistry"
---
# The Engineering Specification: Quantum Core Physics Engine

The solver's primary goal is to determine the **Steady State** concentration of ions in an industrial line. To do this, it must solve two interdependent systems: the **Hydraulic Balance** (Water) and the **Ionic Balance** (Chemistry).

## 1. The Temporal Normalization (The "24/7 Paradox")
In a factory, evaporation is a continuous physical process, but compensation is a discrete operational process.

**The Logic:**
If a tank evaporates $E$ Liters/hour over 168 hours a week, the total volume lost is $V_{total} = E \times 168$. If the production only runs for 40 hours, the water inlet must "catch up."
**The Code Implementation:**
# Calculate how much we must over-feed during production hours 
# to compensate for the evaporation that happened while the factory was closed.
# time_ratio is typically 4.2 (168/40)
*   **Verification:** If `time_ratio` is ignored, the solver would underestimate the required water flow by 75%, leading to dry tanks in real life.
## 2. Logistic Topology (Transfer by Transporter)
**The Logic:**
**The Code Implementation:**
# Constructing the Drag-out Matrix (N x N)
    # Hourly flow caused by parts movement
            # We add to the matrix (multiple sequences can pass through the same tanks)
## 3. Chemical Flattening (Recursive BOM)
**The Code Implementation:**
# Breaking down: Commercial Product -> Reagents -> Ions
        # Direct ion (e.g., H+)
        # Intermediate reagent (e.g., NaOH contains Na+)
## 4. Hydraulic Stabilization (Mass Balance)
**The Code Implementation:**
# Iterative loop to stabilize the cascade flows
            # Sum of all incoming water (Makeup + Overflows from other tanks)
            # Subtract evaporation loss
            # Map the output to the target tank (Gravity pipe)
## 5. The Core Matrix: Solving $Ax = b$
**The Matrix Rules:**
**The Code Implementation:**
    # Total liquid leaving the tank (L/h)
        # Mass Balance: [Sum of Outflows] * Ci - [Sum of Inflows * Cj] = 0
            # If tank J flows into tank I, it brings its concentration Cj
# The Final Calculation
## 6. Verification & Anti-Corruption Safeguards
### A. The Singular Matrix Guard
### B. The Zero-Gravity Check
### C. Transparency via NDJSON
## Conclusion
```

============================================================
FILE: ressources\devs-en\chap01.md (SKELETON)
============================================================
```md
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
*   **Node.js:** v18.17+ (LTS recommended)
*   **pnpm:** v9.x (Required for Turborepo workspaces)
*   **Python:** v3.10+ (For local engine execution)
*   **Docker & Docker Compose:** v2.20+
### 1.2 The "Internal Secret" Protocol
**⚠️ Security Critical:**
#### Generating a Strong Secret
*Save this output. It will be referred to as `[YOUR_GENERATED_SECRET]` below.*
### 1.3 Configuring the Engine (Python)
**1. Create/Update Environment File**
# The port the FastAPI server listens on
# The Shared Secret (Must match the Studio's configuration)
**2. Patching `docker-compose.yml`**
*File: `docker-compose.yml`*
      # CHANGED: Now uses variable interpolation
### 1.4 Configuring the Studio (Next.js)
**Create/Update `apps/studio/.env.local`:**
# --- Database Connection ---
# Ensure this matches your PostgreSQL credentials
# --- Authentication (NextAuth.js) ---
# Generate a new secret: openssl rand -base64 32
# The public URL of the application
# Email Provider (SMTP) for Magic Links
# --- Engine Bridge ---
# The URL where Next.js can find the Python Container
# Inside Docker network use: http://engine:8000
# For local dev use: http://127.0.0.1:8000
# MUST match the key defined in Section 1.3
# --- Feature Flags ---
### 1.5 Verification Steps
    # Create an .env file in root with your secrets for Docker
    *Expected Result:* `{"detail":"Forbidden: Invalid API Secret"}`
    *Expected Result:* `400 Bad Request` (This is good! It means auth passed, but the payload was invalid, which confirms the Engine is reachable and secure).
```

============================================================
FILE: ressources\devs-en\chap02.md (SKELETON)
============================================================
```md
---
title: "Database Management & Migrations"
slug: "database-management-migrations"
published: true
tags: "Devs"
---
# (Tuto 2/10) Database Management & Migrations

In **Quantum Core**, the database is the "Source of Truth". It stores everything: user accounts, project configurations, engineering graphs, and the chemical libraries.

We use **PostgreSQL** as the database engine and **Prisma ORM** to interact with it. In this Monorepo architecture, the database logic is isolated in a shared package located at `packages/database`. This ensures that both the Studio (Next.js) and potentially other services share the exact same data types.

### 2.1 The Data Architecture

Before running commands, it is crucial to understand where the data logic lives:
*   **Schema Definition:** `packages/database/prisma/schema.prisma`
    *   This file defines your tables (Models) and relationships.
*   **Database Client:** `packages/database/index.ts`
    *   This exports the `db` object used throughout the application.
*   **Connection String:** Defined in your `.env` file as `DATABASE_URL`.
**Pedagogical Note:** When you change the `schema.prisma` file, you are changing the *blueprint*. You must then "apply" this blueprint to the actual PostgreSQL container and "generate" the TypeScript types so the code knows about the changes.
### 2.2 Starting the Database Container
    *   **Host:** `localhost`
    *   **Port:** `5434`
    *   **User:** `quantum`
    *   **Password:** `password`
    *   **Database:** `quantum_core`
### 2.3 Synchronizing the Schema (Dev vs. Prod)
#### A. The Development Method (`db:push`)
**Command (from root):**
*   **What it does:** Updates the DB structure immediately.
*   **⚠️ Risk:** If you renamed a column, it might delete the old one and create a new one, losing data. **Do not use this on a production database with real data.**
#### B. The Production Method (Migrations)
**1. Create a Migration (Development):**
# Go to the database package
**2. Apply Migrations (Production/CI):**
### 2.4 Generating the Client (Type Safety)
**Command (from root):**
*Tip: Turborepo is configured to run this automatically when you run `pnpm build`, but during development, you might need to trigger it manually after a schema edit.*
### 2.5 Seeding Initial Data
#### 1. Creating the First Admin
    *   **Email:** `admin@quantum.corp`
    *   **Role:** `ADMIN` (Crucial: Select ADMIN from the dropdown enum)
    *   **Name:** `System Admin`
#### 2. Hydrating the Libraries (Catalog & Chemistry)
    *   **Icon 1 (Database):** Imports the Hardware Catalog (Pumps, Tanks, Sensors).
    *   **Icon 2 (Flask):** Imports the Chemical Library (Ions, Reagents for the H2O domain).
### 2.6 Troubleshooting Common Issues
**Error: `P1001: Can't reach database server at localhost:5434`**
*   **Cause:** The Docker container is not running.
*   **Fix:** Run `docker-compose ps`. If `postgres` is not listed, run `docker-compose up -d postgres`.
**Error: `The table public.User does not exist in the current database`**
*   **Cause:** You connected to the DB, but the tables haven't been created yet.
*   **Fix:** Run `pnpm db:push` to create the table structure.
**Error: `Client is not compatible with the schema`**
*   **Cause:** You updated `schema.prisma` but didn't update the generated files.
*   **Fix:** Run `pnpm db:generate`.
```

============================================================
FILE: ressources\devs-en\chap03.md (SKELETON)
============================================================
```md
---
title: "The Python Engine Integration"
slug: "python-engine-integration"
published: true
tags: "Devs"
---

# (Tuto 3/10) The Python Engine Integration

If the Studio (Next.js) is the "Body" of Quantum Core, handling the user interface and data storage, the **Engine** is its "Brain".

This chapter explains how the scientific calculation layer operates, how it communicates with the rest of the system, and how to monitor it in a production environment.

### 3.1 Architecture: The Stateless Calculator

*   It does **not** connect to the database.
*   It does **not** know who the user is.
*   It does **not** remember previous calculations.
**How it works:**
**Pedagogical Note:** This design makes the engine very robust. You can restart the Python container at any time without losing any user data. If the engine crashes, it only affects the specific calculation running at that millisecond.
### 3.2 The Communication Bridge
**The Flow:**
### 3.3 Monitoring the Brain
#### A. Docker Logs (The Raw Feed)
**Example Output:**
}
#### B. The Simulation Console (The UI Feed)
*   In the Studio UI, a "Console" drawer opens at the bottom right.
*   This displays the real-time progress steps (e.g., "Building Matrix...", "Solving Iteration 4...").
*   This is useful for debugging slow simulations without looking at server logs.
### 3.4 Common Maintenance Tasks
#### Updating the Solver Logic
#### Scaling
*   **Docker Swarm / Kubernetes:** You can deploy multiple replicas of the `engine` container.
*   **Load Balancing:** Since the engine is stateless, a simple Round-Robin load balancer can distribute requests across 5 or 10 engine instances seamlessly.
### 3.5 Troubleshooting Guide
**Scenario 1: `FetchError: ECONNREFUSED`**
*   **Symptom:** The Studio says "Connection Error" immediately upon clicking Simulate.
*   **Diagnosis:** Next.js cannot find the Python container.
*   **Fix:** Check `ENGINE_URL` in `.env`. Inside Docker, it should be `http://engine:8000`. Locally, it might be `http://127.0.0.1:8000`.
**Scenario 2: `403 Forbidden`**
*   **Symptom:** Logs show "Forbidden: Invalid API Secret".
*   **Diagnosis:** The `INTERNAL_API_SECRET` in Next.js does not match the one in Python.
*   **Fix:** Ensure both containers share the exact same string in their environment variables.
**Scenario 3: "Singular Matrix" / "LinAlgError"**
*   **Symptom:** The user sees a red error "Erreur de convergence".
*   **Diagnosis:** This is a **Physics Error**, not a bug in the code. It means the user designed a system that is mathematically impossible (e.g., a closed loop of pipes with no outlet, or trying to calculate concentration in an empty tank).
*   **Fix:** Instruct the user to check their graph connections (Arrows must connect properly).
```

============================================================
FILE: ressources\devs-en\chap04.md (SKELETON)
============================================================
```md
---
title: "Monitoring & Observability"
slug: "monitoring-observability"
published: true
tags: "Devs"
---

# (Tuto 4/10) Monitoring & Observability

In an industrial context, "It works on my machine" is not enough. You need to know *who* is doing *what*, and if the system is healthy.

Quantum Core implements a **Dual-Layer Observability** strategy:
1.  **System Logs (DevOps):** Raw output from containers (crashes, network errors).
2.  **Audit Trails (Business):** Structured records of user actions (simulations run, feedback sent, projects created) stored in the database.

### 4.1 The Admin Command Center
**Access:** `https://your-domain.com/admin` (or `/admin/stats`)
#### Key Sections:
*   **KPIs (Command Center):** Real-time metrics on user acquisition (Leads), active projects, and conversion rates.
*   **Observability (Logs):** A searchable interface for the Audit Trail.
*   **Content (Expertise):** Management of the technical blog/knowledge base.
### 4.2 The Audit Trail System
#### How it works
**Recorded Events include:**
*   `SIMULATION_RUN`: Every time a user triggers a calculation (useful to track compute costs).
*   `AI_CHAT_STREAM`: usage of the LLM assistant (token usage proxy).
*   `FEEDBACK_SUBMITTED`: Direct reports from users.
*   `ERROR`: Critical application failures caught by boundary handlers.
#### Viewing Logs
### 4.3 Maintenance: Log Rotation
**Manual Cleanup:**
*Pedagogical Note for DevOps:* In a high-traffic production environment, you should automate this. You can set up a cron job to call this action or run a SQL query directly:
### 4.4 System Health Checks
#### 1. Check Container Status
*   **Healthy:** `Up` status for `studio`, `engine`, and `postgres`.
*   **Unhealthy:** `Exit 1` or `Restarting`.
#### 2. Check Database Connectivity
*   Go to the **Admin Hub** main page (`/admin`).
*   Look at the Footer. There is a **"Base de données: Connectée"** indicator.
*   *How it works:* The page attempts a lightweight DB query (`db.user.count()`) on render. If it fails, the page will error out or show a disconnected state.
#### 3. Check Python Engine Link
*   There is no persistent connection to check (stateless).
*   **Test:** Create a "Hello World" project, add one Source and one Sink, and click "Simulate".
*   **Success:** The "Console" drawer opens and shows progress.
*   **Failure:** A Red Toast notification appears. Check `docker logs qcore_engine` immediately.
### 4.5 Backup Strategy
**Backup Command:**
**Restore Command:**
```

============================================================
FILE: ressources\devs-en\chap05.md (SKELETON)
============================================================
```md
---
title: "The Domain Manifest Protocol"
slug: "domain-manifest-protocol"
published: true
tags: "Devs"
---

# The Domain Manifest Protocol

Quantum Core is designed as an **Engineering Operating System**. Just as Windows or Linux doesn't know what "Photoshop" is until you install it, Quantum Core doesn't know what a "Pump" or a "Chemical Tank" is until you define it.

This chapter explains the **Injection Pattern**. You will learn how to describe a new industrial domain using a **Manifest**.

### 1.1 The Architecture of a "Domain"

**Location:** `apps/studio/lib/domains/`
### 1.2 Anatomy of a Manifest
  // 1. LIBRARIES: What resources can be used?
    }
  // 2. NODE TYPES: What machines exist?
    }
  // 3. EDGE TYPES: How do they connect?
    }
  }
};
### 1.3 Defining Assets (Nodes) & Fields
#### A. Physical Quantities (`quantity`)
}
#### B. Selectors (`select`)
}
#### C. Wireless Connections (`node-selector`)
}
#### D. Nested Collections (`collection`)
}
### 1.4 Scopes: Process vs. Utility
    *   *Behavior:* These nodes are arranged linearly from left to right in the Synoptic view.
    *   *Examples:* Boiler, Turbine, Reaction Tank.
    *   *Behavior:* These nodes are placed at the top (Sources) or bottom (Sinks) of the canvas to avoid cluttering the main flow.
    *   *Examples:* Water Source, Electrical Grid, Drain.
    *   *Examples:* Storage Tanks, Buildings.
### 1.5 Registration: Activating the Domain
**File:** `apps/studio/lib/registry.ts`
};
### 1.6 Verification
```

============================================================
FILE: ressources\devs-en\chap06.md (SKELETON)
============================================================
```md
---
title: "Visual Customization & Component Registry"
slug: "visual-customization-component-registry"
published: true
tags: "Devs"
---

# Visual Customization & Component Registry

In Chapter 1, we defined the *Data Model* of our domain using the Manifest. Now, we need to define how it *looks*.

Quantum Core uses a **Registry Pattern** (`lib/component-registry.tsx`) to map the logical types defined in your Manifest (e.g., `BOILER`) to actual React components.

### 2.1 The "SmartNode": Zero-Config UI

### 2.2 The Component Registry
// apps/studio/lib/component-registry.tsx
// Import your custom report if you have one
// import { EnergyReport } from '@/components/domains/energy/energy-report';
  // Existing domain...
  // YOUR NEW DOMAIN
      // Map your logical types to React Components
      // You can reuse specific components from other domains if they fit
      // Standard panel when clicking on empty space
      // The component rendered in "Summary" view
      // SUMMARY: EnergyReport 
    }
  }
};
### 2.3 Creating a Custom Node (Advanced)
**Step 1: Create the Component**
  // Access simulation results via data.properties
}
**Step 2: Register it**
// ... inside REGISTRY.ENERGY.nodes
### 2.4 Customizing the Properties Panel
**The Widget Pattern:**
    }
### 2.5 Creating the Domain Report
**Step 1: Create the Report Component**
}
**Step 2: Register the Report**
}
### 2.6 Verification
```

============================================================
FILE: ressources\devs-en\chap07.md (SKELETON)
============================================================
```md
---
title: "The Solver Interface & Physics Logic"
slug: "solver-interface-physics-logic"
published: true
tags: "Devs"
---

# The Solver Interface & Physics Logic

You have defined your inputs (Manifest) and your visuals (Registry). Now comes the most critical part: **The Physics.**

The Python Engine (`apps/engine`) is designed to be modular. It acts as a router that receives a standardized graph and dispatches it to a specific domain solver. This chapter explains how to implement the mathematical logic for your new **ENERGY** domain.

### 3.1 Directory Structure

    *   `__init__.py`: (Can be empty)
    *   `solver.py`: This is where your code lives.
### 3.2 The Solver Contract
**The Signature:**
### 3.3 Implementing the Logic
**File:** `apps/engine/domains/energy/solver.py`
    # 1. NOTIFY UI: Calculation started
    # 2. PREPARE DATA STRUCTURES
    }
    # 3. THE PHYSICS LOOP (Simplified)
    # In a real scenario, you would build a Matrix (Ax=B) here using NumPy.
        # LOGIC FOR BOILERS
            # Inputs from UI fields
            # Physics: Fuel In = Power Out / Efficiency
            # Store results
        # LOGIC FOR TURBINES
            # Mock logic: output depends on upstream connection
            # (In reality, traverse 'edges' to find the connected Boiler)
        # Map results back to the Node ID
    # 4. FINALIZE GLOBAL KPIS
    # 5. SEND FINAL PAYLOAD
    # The type 'result' tells the UI to update the store
### 3.4 Registering the Solver
**File:** `apps/engine/main.py`
        # ... existing logic ...
                )
                # Error handling...
### 3.5 Mapping Results to UI
**In Python (`solver.py`):**
**In React (`SmartNode.tsx` or `TurbineNode.tsx`):**
// Inside your custom component
### 3.6 Best Practices: Using NumPy
**The Matrix Pattern:**
*Refer to `apps/engine/domains/surface_treatment/solver.py` for a full implementation of the Matrix Pattern.*
```

============================================================
FILE: ressources\devs-en\chap08.md (SKELETON)
============================================================
```md
---
title: "Data Model & Topology Architecture"
slug: "data-model-topology-architecture"
published: true
tags: "Devs"
---

# Data Model & Topology Architecture

Quantum Core operates on a strict hierarchical data model designed to support "System of Systems" engineering. Unlike a simple drawing tool, the relationships between objects carry physical meaning.

This chapter details the database schema (`@repo/database`) and the specific topology algorithms used to interpret the graph.

### 1.1 The Entity Hierarchy

#### Level 1: The Project (Global Scope)
*   **Time Basis:** It holds global settings like `hoursPerDay`, `weeksPerYear`. All mass balance calculations are normalized to this time basis.
*   **The Bus:** It owns `ProjectStream` objects (see Section 1.3), which act as the "Inter-System Bus".
#### Level 2: The System (Local Canvas)
*   **Isolation:** Each System has its own canvas, nodes, and edges.
*   **Type:** Can be `PRODUCTION` (Linear logic) or `TREATMENT` (Cyclical logic).
#### Level 3: Nodes & Edges (The Graph)
*   **`Node`:** An equipment asset. It contains a `properties` JSON blob which stores all domain-specific inputs defined in the Manifest.
*   **`Edge`:** A physical connection drawn by the user. By default, this represents a pipe or cable (`category: "PHYSICAL"`).
### 1.2 The "Wireless" Connection Logic
**The Solution:**
#### How it works in the Code:
// Conceptual logic in apps/studio/app/actions/simulation.ts
    // 1. Look up schema
      // 2. Detect "Wireless" fields
        // 3. Create ephemeral edge for the solver
        }
      }
}
**Architectural Impact:** The Python Solver receives a fully connected graph (Physical + Virtual) without the UI needing to render messy wires.
### 1.3 System of Systems (The Data Bus)
*   **`ProjectStream`:** A shared data object at the Project level. It acts as a Pub/Sub topic.
*   **Publishing:** A Node (e.g., a "Drain" in System A) connects to a Stream via `outputStreamId`.
*   **Subscribing:** A Node (e.g., a "Source" in System B) connects to the same Stream via `inputStreamId`.
**The Solving Sequence (`orchestrator.py`):**
### 1.4 Data Persistence Strategy
*   **Pros:** Impossible to have "Orphaned Edges" (edges pointing to non-existent nodes). Simplifies the frontend logic (no need to track diffs).
*   **Cons:** Higher DB write load. ID preservation is handled by the frontend sending specific UUIDs, which Prisma respects during creation.
```

============================================================
FILE: ressources\devs-en\chap09.md (SKELETON)
============================================================
```md
---
title: "State Management & The Client Store"
slug: "state-management-client-store"
published: true
tags: "Devs"
---
# State Management & The Client Store

Building a high-performance engineering tool requires a robust state management strategy. A standard CRUD approach (fetching data on every click) is too slow for a drag-and-drop canvas.

Quantum Core uses a **Hybrid State Architecture**:
1.  **Server State (PostgreSQL):** The source of truth, accessed via Server Components and Server Actions.
2.  **Client State (Zustand):** An in-memory, high-frequency store for the interactive session.

This chapter details the `canvas-store.ts`, the central nervous system of the Studio frontend.
### 2.1 Why Zustand?
*   **Performance:** It allows components to subscribe to specific slices of state without re-rendering the entire app. This is critical when dragging a node at 60 FPS.
*   **Simplicity:** No boilerplate (reducers/actions). State logic is defined directly in the store hooks.
*   **Transient State:** It handles data that shouldn't be saved immediately, like simulation results (`simulationResults`) or UI view modes.
**File:** `apps/studio/store/canvas-store.ts`
### 2.2 Store Slices (The "God Store" Pattern)
#### A. The Graph Slice (`createGraphSlice`)
*   **`nodes` & `edges`:** The raw arrays required by the canvas.
*   **`onNodesChange` / `onEdgesChange`:** Standard React Flow hooks that handle dragging, selection, and deletion.
*   **`updateNodeProperties(id, props)`:** The most used action. It performs a **shallow merge** of properties. This allows the `PropertiesPanel` to update a specific field (e.g., `temp`) without overwriting other data like `pressure`.
#### B. The Workspace Slice (`createWorkspaceSlice`)
*   **`viewMode`:** Toggles between `GRAPH` (Editor), `SYNOPTIC` (List), and `SUMMARY` (Report).
*   **`synopticMode`:** Switches between Physical order (X-axis) and Sequence order (Process steps).
*   **`visibleScopes`:** Controls the Layer visibility (e.g., hiding Utility networks to focus on Process).
#### C. The Sequence Slice (`createSequenceSlice`)
*   **`sequences`:** An array of ordered lists of Node IDs.
*   **Logic:** It manages the drag-and-drop reordering in the Synoptic view (`SynopticEditor.tsx`) using `@dnd-kit`.
### 2.3 The Hydration Pattern (`ProjectInitializer`)
**Component:** `apps/studio/components/layout/project-initializer.tsx`
// Conceptual Flow
}
### 2.4 Optimistic UI Updates
**Example: Renaming a Node**
**Exception:** Some actions are **Atomic**. For example, creating a Project (`createProjectAction`) or Uploading an Image (`uploadImageAction`) happens on the server first, then returns a result to update the UI.
### 2.5 Accessing Simulation Results
*Architectural Note:* If the user refreshes the page, these results are lost (unless explicitly saved back to the DB, which is optional depending on the domain configuration).
```

============================================================
FILE: ressources\devs-en\chap10.md (SKELETON)
============================================================
```md
---
title: "Developer Cheatsheet & Troubleshooting"
slug: "developer-cheatsheet-troubleshooting"
published: true
tags: "Devs"
---

# Appendix: Developer Cheatsheet & Troubleshooting

This section serves as a quick reference for daily operations. It aggregates the most common commands, file paths, and solutions to frequent issues encountered during development and deployment.

### A.1 Essential Command Reference

Run these commands from the **root** of the monorepo.

### A.2 "Where is X?" - File Map
### A.3 Troubleshooting FAQ
#### Q: I added a field to the Manifest, but it doesn't show up.
**A:** Check `apps/studio/lib/registry.ts`. Did you uncomment/import your new domain config file? Also, ensure your Node Type ID in the manifest matches the ID used in the `nodeTypes` object keys exactly.
#### Q: The Simulation returns "403 Forbidden".
**A:** This is a security mismatch.
#### Q: I get "PrismaClientInitializationError" in the logs.
**A:** The Studio cannot reach the Database.
#### Q: My changes to `solver.py` are not applied.
**A:** Python inside Docker does not "hot reload" automatically in production mode.
**Fix:** Run `docker-compose restart engine`.
#### Q: The canvas is blank or crashes on load.
**A:** This often happens if the `System` or `Project` ID in the URL is invalid or doesn't belong to you.
### A.4 Deployment Checklist
**End of Documentation.** You are now fully equipped to maintain, extend, and deploy Quantum Core. Happy Engineering!
```

============================================================
FILE: ressources\devs-fr\chap01.md (SKELETON)
============================================================
```md
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

### 1.1 Prérequis
*   **Node.js :** v18.17+ (LTS recommandé)
*   **pnpm :** v9.x (Requis pour les workspaces Turborepo)
*   **Python :** v3.10+ (Pour l'exécution locale du moteur)
*   **Docker & Docker Compose :** v2.20+
### 1.2 Le protocole "Secret Interne"
**⚠️ Sécurité Critique :**
#### Générer un secret fort
*Enregistrez cette sortie. Elle sera désignée ci-dessous par `[VOTRE_SECRET_GÉNÉRÉ]`.*
### 1.3 Configuration du moteur (Python)
**1. Créer/Mettre à jour le fichier d'environnement**
# Le port sur lequel le serveur FastAPI écoute
# Le secret partagé (doit correspondre à la configuration du Studio)
**2. Patching de `docker-compose.yml`**
*Fichier : `docker-compose.yml`*
      # CHANGÉ : Utilise maintenant l'interpolation de variable
### 1.4 Configuration du Studio (Next.js)
**Créer/Mettre à jour `apps/studio/.env.local` :**
# --- Connexion à la base de données ---
# Assurez-vous que cela correspond à vos identifiants PostgreSQL
# --- Authentification (NextAuth.js) ---
# Générez un nouveau secret : openssl rand -base64 32
# L'URL publique de l'application
# Fournisseur de messagerie (SMTP) pour les liens magiques
# --- Pont Moteur ---
# L'URL où Next.js peut trouver le conteneur Python
# Dans le réseau Docker, utilisez : http://engine:8000
# Pour le développement local, utilisez : http://127.0.0.1:8000
# DOIT correspondre à la clé définie dans la Section 1.3
# --- Indicateurs de fonctionnalités ---
### 1.5 Étapes de Vérification
    # Créez un fichier .env à la racine avec vos secrets pour Docker
    *Résultat Attendu :* `{"detail":"Forbidden: Invalid API Secret"}`
    *Résultat Attendu :* `400 Bad Request` (C'est bon ! Cela signifie que l'authentification a réussi, mais que la charge utile était invalide, ce qui confirme que le Moteur est accessible et sécurisé).
```

============================================================
FILE: ressources\devs-fr\chap02.md (SKELETON)
============================================================
```md
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
*   **Définition du schéma :** `packages/database/prisma/schema.prisma`
    *   Ce fichier définit vos tables (Modèles) et leurs relations.
*   **Client de base de données :** `packages/database/index.ts`
    *   Ceci exporte l'objet `db` utilisé dans toute l'application.
*   **Chaîne de connexion :** Définie dans votre fichier `.env` comme `DATABASE_URL`.
**Note pédagogique :** Lorsque vous modifiez le fichier `schema.prisma`, vous modifiez le *plan*. Vous devez ensuite "appliquer" ce plan au conteneur PostgreSQL réel et "générer" les types TypeScript afin que le code prenne connaissance des changements.
### 2.2 Démarrage du conteneur de base de données
    *   **Hôte :** `localhost`
    *   **Port :** `5434`
    *   **Utilisateur :** `quantum`
    *   **Mot de passe :** `password`
    *   **Base de données :** `quantum_core`
### 2.3 Synchronisation du Schéma (Dev vs. Prod)
#### A. La Méthode de Développement (`db:push`)
**Commande (depuis la racine) :**
*   **Ce qu'elle fait :** Met à jour la structure de la base de données immédiatement.
*   **⚠️ Risque :** Si vous avez renommé une colonne, elle pourrait supprimer l'ancienne et en créer une nouvelle, entraînant une perte de données. **N'utilisez pas cette méthode sur une base de données de production contenant des données réelles.**
#### B. La Méthode de Production (Migrations)
**1. Créer une Migration (Développement) :**
# Allez dans le package de la base de données
**2. Appliquer les Migrations (Production/CI) :**
### 2.4 Génération du client (sécurité des types)
**Commande (depuis la racine) :**
*Astuce : Turborepo est configuré pour exécuter cette commande automatiquement lorsque vous lancez `pnpm build`, mais pendant le développement, vous pourriez avoir besoin de la déclencher manuellement après une modification du schéma.*
### 2.5 Amorçage des données initiales
#### 1. Création du premier administrateur
    * **Email :** `admin@quantum.corp`
    * **Role :** `ADMIN` (Crucial : Sélectionnez ADMIN dans le menu déroulant de l'énumération)
    * **Name :** `System Admin`
#### 2. Hydratation des bibliothèques (Catalogue et Chimie)
    * **Icône 1 (Base de données) :** Importe le catalogue de matériel (Pompes, Réservoirs, Capteurs).
    * **Icône 2 (Fiole) :** Importe la bibliothèque chimique (Ions, Réactifs pour le domaine H2O).
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
```

============================================================
FILE: ressources\devs-fr\chap03.md (SKELETON)
============================================================
```md
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
*   Il ne se connecte **pas** à la base de données.
*   Il ne sait **pas** qui est l'utilisateur.
*   Il ne se souvient **pas** des calculs précédents.
**Comment ça marche :**
**Note Pédagogique :** Cette conception rend le moteur très robuste. Vous pouvez redémarrer le conteneur Python à tout moment sans perdre de données utilisateur. Si le moteur plante, cela n'affecte que le calcul spécifique en cours à cet instant précis.
### 3.2 Le Pont de Communication
**Le Flux :**
### 3.3 Surveillance du Cerveau
#### A. Journaux Docker (Le Flux Brut)
**Exemple de sortie :**
}
#### B. La Console de Simulation (Le Flux UI)
*   Dans l'interface utilisateur de Studio, un tiroir "Console" s'ouvre en bas à droite.
*   Ceci affiche les étapes de progression en temps réel (par exemple, "Construction de la Matrice...", "Résolution de l'Itération 4...").
*   Ceci est utile pour déboguer les simulations lentes sans consulter les journaux du serveur.
### 3.4 Tâches de maintenance courantes
#### Mise à jour de la logique du solveur
#### Mise à l'échelle
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
```

============================================================
FILE: ressources\devs-fr\chap04.md (SKELETON)
============================================================
```md
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
### 4.1 Le Centre de Commande Admin
**Accès :** `https://votre-domaine.com/admin` (ou `/admin/stats`)
#### Sections Clés :
*   **KPIs (Centre de Commande) :** Métriques en temps réel sur l'acquisition d'utilisateurs (Leads), les projets actifs et les taux de conversion.
*   **Observabilité (Logs) :** Une interface de recherche pour le Journal d'Audit.
*   **Contenu (Expertise) :** Gestion du blog technique/base de connaissances.
### 4.2 Le système de piste d'audit
#### Comment ça marche
**Les événements enregistrés incluent :**
*   `SIMULATION_RUN` : Chaque fois qu'un utilisateur déclenche un calcul (utile pour suivre les coûts de calcul).
*   `AI_CHAT_STREAM` : utilisation de l'assistant LLM (proxy d'utilisation des jetons).
*   `FEEDBACK_SUBMITTED` : Rapports directs des utilisateurs.
*   `ERROR` : Défaillances critiques de l'application interceptées par les gestionnaires de limites.
#### Affichage des journaux
### 4.3 Maintenance : Rotation des journaux
**Nettoyage manuel :**
*Note pédagogique pour les DevOps :* Dans un environnement de production à fort trafic, vous devriez automatiser cette tâche. Vous pouvez configurer une tâche cron pour appeler cette action ou exécuter directement une requête SQL :
### 4.4 Vérification de l'état du système
#### 1. Vérifier le statut des conteneurs
*   **Sain :** Statut `Up` pour `studio`, `engine` et `postgres`.
*   **Malsain :** `Exit 1` ou `Restarting`.
#### 2. Vérifier la connectivité de la base de données
*   Allez sur la page principale du **Hub d'administration** (`/admin`).
*   Regardez le pied de page. Il y a un indicateur **"Base de données : Connectée"**.
*   *Fonctionnement :* La page tente une requête de base de données légère (`db.user.count()`) lors du rendu. Si elle échoue, la page affichera une erreur ou un état déconnecté.
#### 3. Vérifier la liaison du moteur Python
*   Il n'y a pas de connexion persistante à vérifier (stateless).
*   **Test :** Créez un projet "Hello World", ajoutez une Source et un Sink, puis cliquez sur "Simuler".
*   **Succès :** Le tiroir "Console" s'ouvre et affiche la progression.
*   **Échec :** Une notification "Red Toast" apparaît. Vérifiez immédiatement `docker logs qcore_engine`.
### 4.5 Stratégie de Sauvegarde
**Commande de Sauvegarde :**
**Commande de Restauration :**
```

============================================================
FILE: ressources\devs-fr\chap05.md (SKELETON)
============================================================
```md
---
title: "5-Le protocole du manifeste de domaine"
slug: "protocole-manifeste-domaine"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 5 
---

# Le protocole du manifeste de domaine

Quantum Core est conçu comme un **système d'exploitation d'ingénierie**. Tout comme Windows ou Linux ne sait pas ce qu'est "Photoshop" tant que vous ne l'avez pas installé, Quantum Core ne sait pas ce qu'est une "pompe" ou un "réservoir chimique" tant que vous ne l'avez pas défini.

Ce chapitre explique le **modèle d'injection**. Vous apprendrez à décrire un nouveau domaine industriel à l'aide d'un **manifeste**.

### 1.1 L'architecture d'un "Domaine"
**Emplacement :** `apps/studio/lib/domains/`
### 1.2 Anatomie d'un Manifeste
  // 1. BIBLIOTHÈQUES : Quelles ressources peuvent être utilisées ?
    }
  // 2. TYPES DE NŒUDS : Quelles machines existent ?
    }
  // 3. TYPES D'ARÊTES : Comment se connectent-elles ?
    }
  }
};
### 1.3 Définition des Actifs (Nœuds) et des Champs
#### A. Quantités Physiques (`quantity`)
}
#### B. Sélecteurs (`select`)
}
#### C. Connexions Sans Fil (`node-selector`)
}
#### D. Collections Imbriquées (`collection`)
}
### 1.4 Portées : Processus vs. Utilitaire
    *   *Comportement :* Ces nœuds sont agencés linéairement de gauche à droite dans la vue Synoptique.
    *   *Exemples :* Chaudière, Turbine, Réservoir de réaction.
    *   *Comportement :* Ces nœuds sont placés en haut (Sources) ou en bas (Puits) du canevas pour éviter d'encombrer le flux principal.
    *   *Exemples :* Source d'eau, Réseau électrique, Drain.
    *   *Exemples :* Réservoirs de stockage, Bâtiments.
### 1.5 Enregistrement : Activation du Domaine
**Fichier :** `apps/studio/lib/registry.ts`
};
### 1.6 Vérification
```

============================================================
FILE: ressources\devs-fr\chap06.md (SKELETON)
============================================================
```md
---
title: "6-Personnalisation Visuelle et Registre de Composants"
slug: "personnalisation-visuelle-registre-composants"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 6 
---

# Personnalisation Visuelle et Registre de Composants

Dans le Chapitre 1, nous avons défini le *Modèle de Données* de notre domaine à l'aide du Manifeste. Maintenant, nous devons définir son *apparence*.

Quantum Core utilise un **Pattern de Registre** (`lib/component-registry.tsx`) pour mapper les types logiques définis dans votre Manifeste (par exemple, `BOILER`) à des composants React réels.

### 2.1 Le "SmartNode" : Interface utilisateur sans configuration
### 2.2 Le registre des composants
// apps/studio/lib/component-registry.tsx
// Importez votre rapport personnalisé si vous en avez un
// import { EnergyReport } from '@/components/domains/energy/energy-report';
  // Domaine existant...
  // VOTRE NOUVEAU DOMAINE
      // Mappez vos types logiques aux composants React
      // Vous pouvez réutiliser des composants spécifiques d'autres domaines s'ils conviennent
      // Panneau standard lors d'un clic sur un espace vide
      // Le composant rendu dans la vue "Résumé"
      // SUMMARY: EnergyReport 
    }
  }
};
### 2.3 Création d'un nœud personnalisé (Avancé)
**Étape 1 : Créer le composant**
  // Accéder aux résultats de simulation via data.properties
}
**Étape 2 : L'enregistrer**
// ... à l'intérieur de REGISTRY.ENERGY.nodes
### 2.4 Personnalisation du panneau de propriétés
**Le modèle de widget :**
    }
### 2.5 Création du rapport de domaine
**Étape 1 : Créer le composant de rapport**
}
**Étape 2 : Enregistrer le rapport**
}
### 2.6 Vérification
```

============================================================
FILE: ressources\devs-fr\chap07.md (SKELETON)
============================================================
```md
---
title: "7-L'interface du solveur et la logique physique"
slug: "interface-solveur-logique-physique"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 7 
---

# L'interface du solveur et la logique physique

Vous avez défini vos entrées (Manifeste) et vos visuels (Registre). Vient maintenant la partie la plus critique : **La Physique.**

Le moteur Python (`apps/engine`) est conçu pour être modulaire. Il agit comme un routeur qui reçoit un graphe standardisé et le distribue à un solveur de domaine spécifique. Ce chapitre explique comment implémenter la logique mathématique pour votre nouveau domaine **ÉNERGIE**.

### 3.1 Structure des répertoires
    * `__init__.py` : (Peut être vide)
    * `solver.py` : C'est ici que réside votre code.
### 3.2 Le Contrat du Solveur
**La Signature :**
### 3.3 Implémentation de la logique
**Fichier :** `apps/engine/domains/energy/solver.py`
    # 1. NOTIFIER L'INTERFACE UTILISATEUR : Calcul démarré
    # 2. PRÉPARER LES STRUCTURES DE DONNÉES
    }
    # 3. LA BOUCLE PHYSIQUE (Simplifiée)
    # Dans un scénario réel, vous construiriez ici une Matrice (Ax=B) en utilisant NumPy.
        # LOGIQUE POUR LES CHAUDIÈRES
            # Entrées des champs de l'interface utilisateur
            # Physique : Carburant Entrant = Puissance Sortante / Efficacité
            # Stocker les résultats
        # LOGIQUE POUR LES TURBINES
            # Logique simulée : la sortie dépend de la connexion en amont
            # (En réalité, parcourir les 'edges' pour trouver la chaudière connectée)
        # Mapper les résultats à l'ID du nœud
    # 4. FINALISER LES KPI GLOBAUX
    # 5. ENVOYER LA CHARGE UTILE FINALE
    # Le type 'result' indique à l'interface utilisateur de mettre à jour le magasin
### 3.4 Enregistrement du Solveur
**Fichier :** `apps/engine/main.py`
        # ... logique existante ...
                )
                # Gestion des erreurs...
### 3.5 Mappage des résultats à l'interface utilisateur
**En Python (`solver.py`) :**
**En React (`SmartNode.tsx` ou `TurbineNode.tsx`) :**
// Inside your custom component
### 3.6 Bonnes pratiques : Utilisation de NumPy
**Le modèle matriciel :**
*Référez-vous à `apps/engine/domains/surface_treatment/solver.py` pour une implémentation complète du modèle matriciel.*
```

============================================================
FILE: ressources\devs-fr\chap08.md (SKELETON)
============================================================
```md
---
title: "8-Modèle de données et architecture topologique"
slug: "modele-donnees-architecture-topologique"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 8 
---

# Modèle de données et architecture topologique

Quantum Core fonctionne sur un modèle de données hiérarchique strict, conçu pour prendre en charge l'ingénierie des "Systèmes de Systèmes". Contrairement à un simple outil de dessin, les relations entre les objets ont une signification physique.

Ce chapitre détaille le schéma de la base de données (`@repo/database`) et les algorithmes de topologie spécifiques utilisés pour interpréter le graphe.

### 1.1 La Hiérarchie des Entités
#### Niveau 1 : Le Projet (Portée Globale)
*   **Base de Temps :** Il contient des paramètres globaux comme `hoursPerDay`, `weeksPerYear`. Tous les calculs de bilan massique sont normalisés par rapport à cette base de temps.
*   **Le Bus :** Il possède des objets `ProjectStream` (voir Section 1.3), qui agissent comme le "Bus Inter-Système".
#### Niveau 2 : Le Système (Canevas Local)
*   **Isolation :** Chaque Système a son propre canevas, ses nœuds et ses arêtes.
*   **Type :** Peut être `PRODUCTION` (Logique linéaire) ou `TREATMENT` (Logique cyclique).
#### Niveau 3 : Nœuds et Arêtes (Le Graphe)
*   **`Node` :** Un actif d'équipement. Il contient un blob JSON `properties` qui stocke toutes les entrées spécifiques au domaine définies dans le Manifeste.
*   **`Edge` :** Une connexion physique dessinée par l'utilisateur. Par défaut, cela représente un tuyau ou un câble (`category: "PHYSICAL"`).
### 1.2 La logique de connexion "sans fil"
**La Solution :**
#### Comment cela fonctionne dans le code :
// Logique conceptuelle dans apps/studio/app/actions/simulation.ts
    // 1. Rechercher le schéma
      // 2. Détecter les champs "sans fil"
        // 3. Créer une arête éphémère pour le solveur
        }
      }
}
**Impact Architectural :** Le Solveur Python reçoit un graphe entièrement connecté (Physique + Virtuel) sans que l'interface utilisateur n'ait besoin de rendre des fils désordonnés.
### 1.3 Système de Systèmes (Le Bus de Données)
*   **`ProjectStream` :** Un objet de données partagé au niveau du Projet. Il agit comme un sujet Pub/Sub.
*   **Publication :** Un Nœud (par exemple, un "Drain" dans le Système A) se connecte à un Stream via `outputStreamId`.
*   **Abonnement :** Un Nœud (par exemple, une "Source" dans le Système B) se connecte au même Stream via `inputStreamId`.
**La Séquence de Résolution (`orchestrator.py`) :**
### 1.4 Stratégie de Persistance des Données
*   **Avantages :** Impossible d'avoir des "arêtes orphelines" (arêtes pointant vers des nœuds inexistants). Simplifie la logique du frontend (pas besoin de suivre les différences).
*   **Inconvénients :** Charge d'écriture plus élevée sur la base de données. La préservation des identifiants est gérée par le frontend qui envoie des UUID spécifiques, que Prisma respecte lors de la création.
```

============================================================
FILE: ressources\devs-fr\chap09.md (SKELETON)
============================================================
```md
---
title: "9-Gestion de l'état et du magasin client"
slug: "gestion-etat-magasin-client"
published: true
tags: "Devs"
tutorial: "Devs: démarrer avec Quantum Core"
order: 9 
---
# Gestion de l'état et du magasin client

La création d'un outil d'ingénierie haute performance nécessite une stratégie de gestion d'état robuste. Une approche CRUD standard (récupération de données à chaque clic) est trop lente pour un canevas de glisser-déposer.

Quantum Core utilise une **architecture d'état hybride** :
1.  **État du serveur (PostgreSQL) :** La source de vérité, accessible via les composants serveur et les actions serveur.
2.  **État du client (Zustand) :** Un magasin en mémoire à haute fréquence pour la session interactive.
### 2.1 Pourquoi Zustand ?
*   **Performance :** Il permet aux composants de s'abonner à des tranches spécifiques de l'état sans re-rendre toute l'application. C'est essentiel lors du glissement d'un nœud à 60 FPS.
*   **Simplicité :** Pas de code passe-partout (reducers/actions). La logique d'état est définie directement dans les hooks du store.
*   **État transitoire :** Il gère les données qui ne devraient pas être sauvegardées immédiatement, comme les résultats de simulation (`simulationResults`) ou les modes d'affichage de l'interface utilisateur.
**Fichier :** `apps/studio/store/canvas-store.ts`
### 2.2 Stocker les Slices (Le modèle "God Store")
#### A. La Slice Graph (`createGraphSlice`)
*   **`nodes` & `edges` :** Les tableaux bruts requis par le canvas.
*   **`onNodesChange` / `onEdgesChange` :** Hooks React Flow standards qui gèrent le glisser-déposer, la sélection et la suppression.
*   **`updateNodeProperties(id, props)` :** L'action la plus utilisée. Elle effectue une **fusion superficielle** des propriétés. Cela permet au `PropertiesPanel` de mettre à jour un champ spécifique (par exemple, `temp`) sans écraser d'autres données comme `pressure`.
#### B. La Slice Workspace (`createWorkspaceSlice`)
*   **`viewMode` :** Bascule entre `GRAPH` (Éditeur), `SYNOPTIC` (Liste) et `SUMMARY` (Rapport).
*   **`synopticMode` :** Bascule entre l'ordre physique (axe X) et l'ordre séquentiel (étapes du processus).
*   **`visibleScopes` :** Contrôle la visibilité des couches (par exemple, masquer les réseaux utilitaires pour se concentrer sur le processus).
#### C. La Slice Sequence (`createSequenceSlice`)
*   **`sequences` :** Un tableau de listes ordonnées d'ID de nœuds.
*   **Logique :** Elle gère le réordonnancement par glisser-déposer dans la vue Synoptique (`SynopticEditor.tsx`) à l'aide de `@dnd-kit`.
### 2.3 Le Modèle d'Hydratation (`ProjectInitializer`)
**Composant :** `apps/studio/components/layout/project-initializer.tsx`
// Flux Conceptuel
}
### 2.4 Mises à jour optimistes de l'interface utilisateur
**Exemple : Renommer un nœud**
**Exception :** Certaines actions sont **atomiques**. Par exemple, la création d'un projet (`createProjectAction`) ou le téléchargement d'une image (`uploadImageAction`) se produisent d'abord sur le serveur, puis renvoient un résultat pour mettre à jour l'interface utilisateur.
### 2.5 Accéder aux résultats de simulation
*Note architecturale :* Si l'utilisateur rafraîchit la page, ces résultats sont perdus (à moins d'être explicitement sauvegardés dans la base de données, ce qui est optionnel selon la configuration du domaine).
```

============================================================
FILE: ressources\devs-fr\chap10.md (SKELETON)
============================================================
```md
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

### A.2 "Où est X ?" - Plan des Fichiers
### A.3 FAQ de dépannage
#### Q: J'ai ajouté un champ au Manifest, mais il n'apparaît pas.
**R:** Vérifiez `apps/studio/lib/registry.ts`. Avez-vous décommenté/importé votre nouveau fichier de configuration de domaine ? Assurez-vous également que l'ID de votre type de nœud dans le manifest correspond exactement à l'ID utilisé dans les clés de l'objet `nodeTypes`.
#### Q: La simulation renvoie "403 Forbidden".
**R:** Il s'agit d'une incompatibilité de sécurité.
#### Q: J'obtiens "PrismaClientInitializationError" dans les logs.
**R:** Le Studio ne peut pas atteindre la base de données.
#### Q: Mes modifications apportées à `solver.py` ne sont pas appliquées.
**R:** Python à l'intérieur de Docker ne se "recharge pas à chaud" automatiquement en mode production.
**Correction:** Exécutez `docker-compose restart engine`.
#### Q: Le canevas est vide ou plante au chargement.
**R:** Cela se produit souvent si l'ID `System` ou `Project` dans l'URL est invalide ou ne vous appartient pas.
### A.4 Liste de contrôle de déploiement
**Fin de la documentation.** Vous êtes maintenant entièrement équipé pour maintenir, étendre et déployer Quantum Core. Bon travail d'ingénierie !
```

============================================================
FILE: ressources\Libraries\chemicals\chemistry_library.json (SKELETON)
============================================================
```json
[
  { "name": "Proton", "category": "ION", "symbol": "H+", "properties": { "molarMass": 1.008, "charge": 1 } },
  { "name": "Hydroxyde", "category": "ION", "symbol": "OH-", "properties": { "molarMass": 17.007, "charge": -1 } },
  { "name": "Sodium", "category": "ION", "symbol": "Na+", "properties": { "molarMass": 22.99, "charge": 1 } },
  { "name": "Sulfate", "category": "ION", "symbol": "SO4--", "properties": { "molarMass": 96.06, "charge": -2 } },
  { "name": "Chlorure", "category": "ION", "symbol": "Cl-", "properties": { "molarMass": 35.45, "charge": -1 } },
  { "name": "Nickel", "category": "ION", "symbol": "Ni++", "properties": { "molarMass": 58.69, "charge": 2 } },
  { "name": "Zinc", "category": "ION", "symbol": "Zn++", "properties": { "molarMass": 65.38, "charge": 2 } },
  { "name": "Potassium", "category": "ION", "symbol": "K+", "properties": { "molarMass": 39.1, "charge": 1 } },
  { "name": "Ammonium", "category": "ION", "symbol": "NH4+", "properties": { "molarMass": 18.04, "charge": 1 } },
  { "name": "Fer(II)", "category": "ION", "symbol": "Fe++", "properties": { "molarMass": 55.85, "charge": 2 } },
  { "name": "Fer(III)", "category": "ION", "symbol": "Fe+++", "properties": { "molarMass": 55.85, "charge": 3 } },
  { "name": "Cuivre(II)", "category": "ION", "symbol": "Cu++", "properties": { "molarMass": 63.55, "charge": 2 } },
  { "name": "Chrome(III)", "category": "ION", "symbol": "Cr+++", "properties": { "molarMass": 52.0, "charge": 3 } },
  { "name": "Chromate", "category": "ION", "symbol": "CrO4--", "properties": { "molarMass": 116.0, "charge": -2 } },
  { "name": "Dichromate", "category": "ION", "symbol": "Cr2O7--", "properties": { "molarMass": 216.0, "charge": -2 } },
  { "name": "Aluminium", "category": "ION", "symbol": "Al+++", "properties": { "molarMass": 26.98, "charge": 3 } },
  { "name": "Calcium", "category": "ION", "symbol": "Ca++", "properties": { "molarMass": 40.08, "charge": 2 } },
  { "name": "Magnésium", "category": "ION", "symbol": "Mg++", "properties": { "molarMass": 24.31, "charge": 2 } },
  { "name": "Etain(II)", "category": "ION", "symbol": "Sn++", "properties": { "molarMass": 118.71, "charge": 2 } },
  { "name": "Plomb(II)", "category": "ION", "symbol": "Pb++", "properties": { "molarMass": 207.2, "charge": 2 } },
  { "name": "Argent", "category": "ION", "symbol": "Ag+", "properties": { "molarMass": 107.87, "charge": 1 } },
  { "name": "Or(III)", "category": "ION", "symbol": "Au+++", "properties": { "molarMass": 196.97, "charge": 3 } },
  { "name": "Nitrate", "category": "ION", "symbol": "NO3-", "properties": { "molarMass": 62.0, "charge": -1 } },
  { "name": "Phosphate", "category": "ION", "symbol": "PO4---", "properties": { "molarMass": 94.97, "charge": -3 } },
  { "name": "Hydrogénophosphate", "category": "ION", "symbol": "HPO4--", "properties": { "molarMass": 95.98, "charge": -2 } },
  { "name": "Dihydrogénophosphate", "category": "ION", "symbol": "H2PO4-", "properties": { "molarMass": 96.99, "charge": -1 } },
  { "name": "Fluorure", "category": "ION", "symbol": "F-", "properties": { "molarMass": 19.0, "charge": -1 } },
  { "name": "Cyanure", "category": "ION", "symbol": "CN-", "properties": { "molarMass": 26.02, "charge": -1 } },
  { "name": "Carbonate", "category": "ION", "symbol": "CO3--", "properties": { "molarMass": 60.01, "charge": -2 } },
  { "name": "Acétate", "category": "ION", "symbol": "C2H3O2-", "properties": { "molarMass": 59.04, "charge": -1 } },
  { "name": "Permanganate", "category": "ION", "symbol": "MnO4-", "properties": { "molarMass": 118.94, "charge": -1 } },
  { "name": "Bicarbonate", "category": "ION", "symbol": "HCO3-", "properties": { "molarMass": 61.02, "charge": -1 } },
  { "name": "Métasilicate", "category": "ION", "symbol": "SiO3--", "properties": { "molarMass": 76.09, "charge": -2 } },
  { "name": "Borate", "category": "ION", "symbol": "BO3---", "properties": { "molarMass": 58.81, "charge": -3 } },
  {
    "name": "Acide Sulfurique 98%",
    "category": "REAGENT",
    "properties": { "density": 1.84, "purity": 98, "unitPrice": 0.85 },
    "composition": [
      { "childName": "Proton", "quantity": 2 },
      { "childName": "Sulfate", "quantity": 1 }
    ]
  },
  {
    "name": "Soude Caustique 30%",
    "category": "REAGENT",
    "properties": { "density": 1.33, "purity": 30, "unitPrice": 0.45 },
    "composition": [
      { "childName": "Sodium", "quantity": 1 },
      { "childName": "Hydroxyde", "quantity": 1 }
    ]
  },
  {
    "name": "Chlorure de Nickel",
    "category": "REAGENT",
    "properties": { "density": 1.92, "purity": 100, "unitPrice": 12.5 },
    "composition": [
      { "childName": "Nickel", "quantity": 1 },
      { "childName": "Chlorure", "quantity": 2 }
    ]
  },
  {
    "name": "Acide Chlorhydrique 37%",
    "category": "REAGENT",
    "properties": { "density": 1.19, "purity": 37, "unitPrice": 0.32 },
    "composition": [
      { "childName": "Proton", "quantity": 1 },
      { "childName": "Chlorure", "quantity": 1 }
    ]
  },
  {
    "name": "Acide Nitrique 65%",
    "category": "REAGENT",
    "properties": { "density": 1.4, "purity": 65, "unitPrice": 0.58 },
    "composition": [
      { "childName": "Proton", "quantity": 1 },
      { "childName": "Nitrate", "quantity": 1 }
    ]
  },
  {
    "name": "Acide Fluorhydrique 49%",
    "category": "REAGENT",
    "properties": { "density": 1.17, "purity": 49, "unitPrice": 1.25 },
    "composition": [
      { "childName": "Proton", "quantity": 1 },
      { "childName": "Fluorure", "quantity": 1 }
    ]
  },
  {
    "name": "Acide Phosphorique 85%",
    "category": "REAGENT",
    "properties": { "density": 1.68, "purity": 85, "unitPrice": 0.88 },
    "composition": [
      { "childName": "Proton", "quantity": 3 },
      { "childName": "Phosphate", "quantity": 1 }
    ]
  },
  {
    "name": "Acide Chromique",
    "category": "REAGENT",
    "properties": { "density": 2.7, "purity": 100, "unitPrice": 2.45 },
    "composition": [
      { "childName": "Proton", "quantity": 2 },
      { "childName": "Chromate", "quantity": 1 }
    ]
  },
  {
    "name": "Soude Caustique 50%",
    "category": "REAGENT",
    "properties": { "density": 1.52, "purity": 50, "unitPrice": 0.52 },
    "composition": [
      { "childName": "Sodium", "quantity": 1 },
      { "childName": "Hydroxyde", "quantity": 1 }
    ]
  },
  {
    "name": "Potasse Caustique 50%",
    "category": "REAGENT",
    "properties": { "density": 1.51, "purity": 50, "unitPrice": 0.65 },
    "composition": [
      { "childName": "Potassium", "quantity": 1 },
      { "childName": "Hydroxyde", "quantity": 1 }
    ]
  },
  {
    "name": "Ammoniaque 28%",
    "category": "REAGENT",
    "properties": { "density": 0.9, "purity": 28, "unitPrice": 0.28 },
    "composition": [
      { "childName": "Ammonium", "quantity": 1 },
      { "childName": "Hydroxyde", "quantity": 1 }
    ]
  },
  {
    "name": "Carbonate de Sodium",
    "category": "REAGENT",
    "properties": { "density": 2.54, "purity": 100, "unitPrice": 0.35 },
    "composition": [
      { "childName": "Sodium", "quantity": 2 },
      { "childName": "Carbonate", "quantity": 1 }
    ]
  },
  {
    "name": "Phosphate Trisodique",
    "category": "REAGENT",
    "properties": { "density": 1.62, "purity": 100, "unitPrice": 0.78 },
    "composition": [
      { "childName": "Sodium", "quantity": 3 },
      { "childName": "Phosphate", "quantity": 1 }
    ]
  },
  {
    "name": "Dichromate de Sodium",
    "category": "REAGENT",
    "properties": { "density": 2.35, "purity": 100, "unitPrice": 2.8 },
    "composition": [
      { "childName": "Sodium", "quantity": 2 },
      { "childName": "Dichromate", "quantity": 1 }
    ]
  },
  {
    "name": "Chlorure de Zinc",
    "category": "REAGENT",
    "properties": { "density": 2.91, "purity": 100, "unitPrice": 1.15 },
    "composition": [
      { "childName": "Zinc", "quantity": 1 },
      { "childName": "Chlorure", "quantity": 2 }
    ]
  },
  {
    "name": "Sulfate de Zinc",
    "category": "REAGENT",
    "properties": { "density": 3.54, "purity": 100, "unitPrice": 0.95 },
    "composition": [
      { "childName": "Zinc", "quantity": 1 },
      { "childName": "Sulfate", "quantity": 1 }
    ]
  },
  {
    "name": "Sulfate de Cuivre",
    "category": "REAGENT",
    "properties": { "density": 3.6, "purity": 100, "unitPrice": 2.2 },
    "composition": [
      { "childName": "Cuivre(II)", "quantity": 1 },
      { "childName": "Sulfate", "quantity": 1 }
    ]
  },
  {
    "name": "Chlorure d'Etain(II)",
    "category": "REAGENT",
    "properties": { "density": 3.95, "purity": 100, "unitPrice": 4.5 },
    "composition": [
      { "childName": "Etain(II)", "quantity": 1 },
      { "childName": "Chlorure", "quantity": 2 }
    ]
  },
  {
    "name": "Sulfate de Nickel",
    "category": "REAGENT",
    "properties": { "density": 3.68, "purity": 100, "unitPrice": 8.75 },
    "composition": [
      { "childName": "Nickel", "quantity": 1 },
      { "childName": "Sulfate", "quantity": 1 }
    ]
  },
  {
    "name": "Chlorure de Fer(III)",
    "category": "REAGENT",
    "properties": { "density": 2.9, "purity": 100, "unitPrice": 0.85 },
    "composition": [
      { "childName": "Fer(III)", "quantity": 1 },
      { "childName": "Chlorure", "quantity": 3 }
    ]
  },
  {
    "name": "Sulfate d'Aluminium",
    "category": "REAGENT",
    "properties": { "density": 2.71, "purity": 100, "unitPrice": 0.55 },
    "composition": [
      { "childName": "Aluminium", "quantity": 2 },
      { "childName": "Sulfate", "quantity": 3 }
    ]
  },
  {
    "name": "Chlorure de Calcium",
    "category": "REAGENT",
    "properties": { "density": 2.15, "purity": 100, "unitPrice": 0.28 },
    "composition": [
      { "childName": "Calcium", "quantity": 1 },
      { "childName": "Chlorure", "quantity": 2 }
    ]
  },
  {
    "name": "Sulfate de Magnésium",
    "category": "REAGENT",
    "properties": { "density": 2.66, "purity": 100, "unitPrice": 0.42 },
    "composition": [
      { "childName": "Magnésium", "quantity": 1 },
      { "childName": "Sulfate", "quantity": 1 }
    ]
  },
  {
    "name": "Nitrate de Plomb",
    "category": "REAGENT",
    "properties": { "density": 4.53, "purity": 100, "unitPrice": 2.9 },
    "composition": [
      { "childName": "Plomb(II)", "quantity": 1 },
      { "childName": "Nitrate", "quantity": 2 }
    ]
  },
  {
    "name": "Nitrate d'Argent",
    "category": "REAGENT",
    "properties": { "density": 4.35, "purity": 100, "unitPrice": 450.0 },
    "composition": [
      { "childName": "Argent", "quantity": 1 },
      { "childName": "Nitrate", "quantity": 1 }
    ]
  },
  {
    "name": "Chlorure d'Or(III)",
    "category": "REAGENT",
    "properties": { "density": 4.7, "purity": 100, "unitPrice": 3800.0 },
    "composition": [
      { "childName": "Or(III)", "quantity": 1 },
      { "childName": "Chlorure", "quantity": 3 }
    ]
  },
  {
    "name": "Cyanure de Sodium",
    "category": "REAGENT",
    "properties": { "density": 1.6, "purity": 100, "unitPrice": 1.85 },
    "composition": [
      { "childName": "Sodium", "quantity": 1 },
      { "childName": "Cyanure", "quantity": 1 }
    ]
  },
  {
    "name": "Permanganate de Potassium",
    "category": "REAGENT",
    "properties": { "density": 2.7, "purity": 100, "unitPrice": 3.2 },
    "composition": [
      { "childName": "Potassium", "quantity": 1 },
      { "childName": "Permanganate", "quantity": 1 }
    ]
  },
  {
    "name": "Chlorure d'Ammonium",
    "category": "REAGENT",
    "properties": { "density": 1.53, "purity": 100, "unitPrice": 0.35 },
    "composition": [
      { "childName": "Ammonium", "quantity": 1 },
      { "childName": "Chlorure", "quantity": 1 }
    ]
  },
  {
    "name": "Bicarbonate de Sodium",
    "category": "REAGENT",
    "properties": { "density": 2.2, "purity": 100, "unitPrice": 0.45 },
    "composition": [
      { "childName": "Sodium", "quantity": 1 },
      { "childName": "Bicarbonate", "quantity": 1 }
    ]
  },
  {
    "name": "Métasilicate de Sodium",
    "category": "REAGENT",
    "properties": { "density": 2.4, "purity": 100, "unitPrice": 0.72 },
    "composition": [
      { "childName": "Sodium", "quantity": 2 },
      { "childName": "Métasilicate", "quantity": 1 }
    ]
  },
  {
    "name": "Acide Borique",
    "category": "REAGENT",
    "properties": { "density": 1.44, "purity": 100, "unitPrice": 0.95 },
    "composition": [
      { "childName": "Proton", "quantity": 3 },
      { "childName": "Borate", "quantity": 1 }
    ]
  },
  {
    "name": "Chlorure de Potassium",
    "category": "REAGENT",
    "properties": { "density": 1.98, "purity": 100, "unitPrice": 0.58 },
    "composition": [
      { "childName": "Potassium", "quantity": 1 },
      { "childName": "Chlorure", "quantity": 1 }
    ]
  },
  {
    "name": "Sulfate de Fer(II)",
    "category": "REAGENT",
    "properties": { "density": 2.84, "purity": 100, "unitPrice": 0.48 },
    "composition": [
      { "childName": "Fer(II)", "quantity": 1 },
      { "childName": "Sulfate", "quantity": 1 }
    ]
  },
  {
    "name": "Acétate de Sodium",
    "category": "REAGENT",
    "properties": { "density": 1.53, "purity": 100, "unitPrice": 0.65 },
    "composition": [
      { "childName": "Sodium", "quantity": 1 },
      { "childName": "Acétate", "quantity": 1 }
    ]
  }
]
```

============================================================
FILE: ressources\Libraries\config\config_water.json (SKELETON)
============================================================
```json
{
  "PUMP": [
    { "id": "power", "label": "Puissance", "type": "number", "unit": "kW" },
    { "id": "maxFlow", "label": "Débit Maximum", "type": "number", "unit": "m³/h" },
    { "id": "maxPressure", "label": "Pression Maximum", "type": "number", "unit": "bar" },
    { "id": "voltage", "label": "Tension", "type": "select", "options": ["220V", "380V", "400V", "460V"] },
    { "id": "material", "label": "Corps de pompe", "type": "select", "options": ["PP", "PVDF", "PTFE", "Acier Inoxydable", "Fonte", "Titane"] },
    { "id": "connection", "label": "Raccordement", "type": "select", "options": ["DN25", "DN32", "DN40", "DN50", "DN65", "DN80", "DN100"] },
    { "id": "sealing", "label": "Joint d'étanchéité", "type": "select", "options": ["Mécanique", "Garniture", "Sans"] },
    { "id": "ipRating", "label": "Degré de protection", "type": "select", "options": ["IP55", "IP65", "IP67", "IP68"] },
    { "id": "manufacturer", "label": "Fabricant", "type": "string" },
    { "id": "model", "label": "Modèle", "type": "string" },
    { "id": "unitPrice", "label": "Prix Achat", "type": "number", "unit": "€" },
    { "id": "installationDate", "label": "Date Installation", "type": "string" }
  ],
  "REAGENT": [
    { "id": "density", "label": "Masse Volumique", "type": "number", "unit": "kg/L" },
    { "id": "purity", "label": "Concentration", "type": "number", "unit": "%" },
    { "id": "molarMass", "label": "Masse Molaire", "type": "number", "unit": "g/mol" },
    { "id": "ph", "label": "pH (solution à 1%)", "type": "number" },
    { "id": "casNumber", "label": "Numéro CAS", "type": "string" },
    { "id": "unNumber", "label": "Numéro ONU", "type": "string" },
    { "id": "hazardClass", "label": "Classe Danger", "type": "select", "options": ["Corrosif", "Toxique", "Oxydant", "Inflammable", "Irritant", "Dangereux pour l'environnement"] },
    { "id": "storageTemp", "label": "Température Stockage", "type": "select", "options": ["Ambiante", "Frigorifique", "< 20°C", "< 5°C"] },
    { "id": "shelfLife", "label": "Durée de Conservation", "type": "number", "unit": "mois" },
    { "id": "supplier", "label": "Fournisseur", "type": "string" },
    { "id": "fds", "label": "Fiche Sécurité", "type": "string" },
    { "id": "unitPrice", "label": "Prix au kg/L", "type": "number", "unit": "€" }
  ],
  "SENSOR": [
    { "id": "measurementType", "label": "Type de Mesure", "type": "select", "options": ["Conductivité", "pH", "ORP", "Débit", "Pression", "Température", "Niveau", "Turbidité", "Oxygène Dissous"] },
    { "id": "range", "label": "Plage de Mesure", "type": "string" },
    { "id": "precision", "label": "Précision", "type": "number" },
    { "id": "outputSignal", "label": "Signal de Sortie", "type": "select", "options": ["4-20mA", "0-10V", "Modbus RTU", "Profibus", "Ethernet IP"] },
    { "id": "material", "label": "Matériau Sonde", "type": "select", "options": ["Inox 316L", "Titane", "Hastelloy", "PVDF", "PP", "Verre"] },
    { "id": "mounting", "label": "Montage", "type": "select", "options": ["Immersion", "Insertion", "Bypass", "In-line"] },
    { "id": "ipRating", "label": "Degré de protection", "type": "select", "options": ["IP65", "IP67", "IP68", "IP69K"] },
    { "id": "temperatureRange", "label": "Plage Température", "type": "string" },
    { "id": "calibrationRequired", "label": "Calibration Requise", "type": "boolean" },
    { "id": "calibrationFrequency", "label": "Fréquence Calibration", "type": "number", "unit": "mois" },
    { "id": "unitPrice", "label": "Prix Achat", "type": "number", "unit": "€" }
  ],
  "SPARE": [
    { "id": "componentType", "label": "Type de Composant", "type": "select", "options": ["Membrane", "Cartouche", "Sac Filtrant", "Résine", "Lampe UV", "Joint", "Filtre", "Electrode"] },
    { "id": "model", "label": "Modèle/Référence", "type": "string" },
    { "id": "filtration", "label": "Filtration", "type": "string" },
    { "id": "dimensions", "label": "Dimensions", "type": "string" },
    { "id": "material", "label": "Matériau", "type": "select", "options": ["PA", "PP", "PVDF", "PTFE", "PE", "Inox", "Céramique", "Verre", "Quartz"] },
    { "id": "compatibleFluid", "label": "Fluide Compatible", "type": "select", "options": ["Eau Douce", "Eau Salée", "Acide", "Base", "Solvant", "Air"] },
    { "id": "maxTemp", "label": "Température Max", "type": "number", "unit": "°C" },
    { "id": "maxPressure", "label": "Pression Max", "type": "number", "unit": "bar" },
    { "id": "lifespan", "label": "Durée de Vie Estimée", "type": "number", "unit": "mois" },
    { "id": "unitPrice", "label": "Prix Achat", "type": "number", "unit": "€" },
    { "id": "minimumStock", "label": "Stock Minimum", "type": "number", "unit": "pièces" }
  ],
  "SKID": [
    { "id": "totalPower", "label": "Puissance Totale", "type": "number", "unit": "kW" },
    { "id": "flowRate", "label": "Débit Nominal", "type": "number", "unit": "m³/h" },
    { "id": "recoveryRate", "label": "Taux de Récupération", "type": "number", "unit": "%" },
    { "id": "automation", "label": "Automate", "type": "select", "options": ["Siemens", "Schneider", "Allen Bradley", "Mitsubishi", "Omron", "Beckhoff"] },
    { "id": "hmi", "label": "Type HMI", "type": "select", "options": ["7 pouces", "10 pouces", "12 pouces", "15 pouces"] },
    { "id": "remoteAccess", "label": "Accès à Distance", "type": "boolean" },
    { "id": "alarmSystem", "label": "Système d'Alarme", "type": "select", "options": ["Visuel", "Sonore", "SMS", "Email"] },
    { "id": "dimensions", "label": "Dimensions (LxWxH)", "type": "string", "unit": "m" },
    { "id": "weight", "label": "Poids", "type": "number", "unit": "kg" },
    { "id": "installationType", "label": "Type Installation", "type": "select", "options": ["Conteneur", "Sur châssis", "Indépendant"] },
    { "id": "unitPrice", "label": "Prix Achat", "type": "number", "unit": "€" }
  ],
  "EVAPORATOR": [
    { "id": "energy", "label": "Source d'Energie", "type": "select", "options": ["Vapeur", "Electrique", "Thermopompe", "Gaz", "Biomasse"] },
    { "id": "capacity", "label": "Capacité d'Évaporation", "type": "number", "unit": "L/h" },
    { "id": "concentrationFactor", "label": "Facteur de Concentration", "type": "number" },
    { "id": "material", "label": "Matériau", "type": "select", "options": ["Inox 316L", "Inox 904L", "Titane", "Hastelloy", "Graphite"] },
    { "id": "heatingSurface", "label": "Surface d'Échange", "type": "number", "unit": "m²" },
    { "id": "powerConsumption", "label": "Consommation Energie", "type": "number", "unit": "kWh/m³" },
    { "id": "vaporRecompression", "label": "Recompression Vapeur", "type": "boolean" },
    { "id": "foamingRisk", "label": "Risque de Mousse", "type": "select", "options": ["Faible", "Moyen", "Élevé"] },
    { "id": "cleaningSystem", "label": "Système de Nettoyage", "type": "select", "options": ["CIP", "Manuel", "Automatique"] },
    { "id": "unitPrice", "label": "Prix Achat", "type": "number", "unit": "€" }
  ],
  "EQUIPMENT": [
    { "id": "equipmentType", "label": "Type d'Équipement", "type": "select", "options": ["Filtre Presse", "Épaississeur", "Sécheur", "Souffleur", "Compresseur", "Agitateur", "Échangeur", "Système UV"] },
    { "id": "power", "label": "Puissance", "type": "number", "unit": "kW" },
    { "id": "material", "label": "Matériau", "type": "select", "options": ["PP", "PE", "PVDF", "Acier Epoxy", "Inox 316L", "Titane", "Fonte"] },
    { "id": "dimensions", "label": "Dimensions", "type": "string" },
    { "id": "capacity", "label": "Capacité", "type": "string" },
    { "id": "pressure", "label": "Pression de Service", "type": "number", "unit": "bar" },
    { "id": "temperature", "label": "Température de Service", "type": "number", "unit": "°C" },
    { "id": "automation", "label": "Automatisé", "type": "boolean" },
    { "id": "safetyDevice", "label": "Dispositif de Sécurité", "type": "boolean" },
    { "id": "manufacturer", "label": "Fabricant", "type": "string" },
    { "id": "unitPrice", "label": "Prix Achat", "type": "number", "unit": "€" }
  ],
  "TANK": [
    { "id": "volume", "label": "Volume", "type": "number", "unit": "m³" },
    { "id": "material", "label": "Matériau", "type": "select", "options": ["PP", "PE", "PVDF", "PVC", "FRP", "Inox 316L", "Titane"] },
    { "id": "diameter", "label": "Diamètre", "type": "number", "unit": "mm" },
    { "id": "height", "label": "Hauteur", "type": "number", "unit": "mm" },
    { "id": "wallThickness", "label": "Épaisseur Paroi", "type": "number", "unit": "mm" },
    { "id": "bottomType", "label": "Fond", "type": "select", "options": ["Plat", "Cônique", "Bombé"] },
    { "id": "lidType", "label": "Couvercle", "type": "select", "options": ["Oui", "Non", "Avec trappe"] },
    { "id": "agitation", "label": "Système d'Agitation", "type": "boolean" },
    { "id": "heating", "label": "Système de Chauffage", "type": "boolean" },
    { "id": "insulation", "label": "Isolation Thermique", "type": "boolean" },
    { "id": "unitPrice", "label": "Prix Achat", "type": "number", "unit": "€" }
  ],
  "VALVE": [
    { "id": "diameter", "label": "Diamètre Nominal", "type": "number", "unit": "mm" },
    { "id": "material", "label": "Matériau", "type": "select", "options": ["PVC", "PP", "PVDF", "Inox 316L", "Fonte", "Titane"] },
    { "id": "valveType", "label": "Type de Vanne", "type": "select", "options": ["Papillon", "À Bille", "Diaphragme", "De Regulation", "Aiguille", "Trois Voies"] },
    { "id": "actuator", "label": "Commande", "type": "select", "options": ["Manuelle", "Pneumatique", "Electrique", "Hydraulique"] },
    { "id": "sealingMaterial", "label": "Matériau Joint", "type": "select", "options": ["EPDM", "Viton", "PTFE", "NBR", "Silicone"] },
    { "id": "pressureRating", "label": "Pression PN", "type": "number", "unit": "bar" },
    { "id": "temperatureRange", "label": "Plage Température", "type": "string" },
    { "id": "endConnection", "label": "Raccordement", "type": "select", "options": ["ASTM Flange", "DIN Flange", "Gaz", "Clamp", "Soudure"] },
    { "id": "failSafe", "label": "Position Sécurité", "type": "select", "options": ["Normalement Ouverte", "Normalement Fermée"] },
    { "id": "unitPrice", "label": "Prix Achat", "type": "number", "unit": "€" }
  ],
  "ION": [
    { "id": "symbol", "label": "Symbole", "type": "string" },
    { "id": "molarMass", "label": "Masse Molaire", "type": "number", "unit": "g/mol" },
    { "id": "charge", "label": "Charge", "type": "number" },
    { "id": "oxidationState", "label": "Degré d'Oxydation", "type": "string" },
    { "id": "solubility", "label": "Solubilité", "type": "select", "options": ["Très soluble", "Soluble", "Peu soluble", "Insoluble"] },
    { "id": "toxicity", "label": "Toxicité", "type": "select", "options": ["Non toxique", "Irritant", "Toxique", "Très toxique"] },
    { "id": "regulatoryLimit", "label": "Limite Réglementaire", "type": "number", "unit": "mg/L" },
    { "id": "unitPrice", "label": "Prix standard", "type": "number", "unit": "€/kg" }
  ]
}
```

============================================================
FILE: ressources\Libraries\equipements\equipment_library.json (SKELETON)
============================================================
```json
[
  { "name": "Pompe Centrifuge 15m3/h", "category": "PUMP", "properties": { "power": 1.5, "material": "PP", "unitPrice": 1250 } },
  { "name": "Pompe Centrifuge 25m3/h", "category": "PUMP", "properties": { "power": 2.2, "material": "PVDF", "unitPrice": 1850 } },
  { "name": "Pompe Doseuse 50L/h", "category": "PUMP", "properties": { "power": 0.1, "material": "PVDF", "unitPrice": 890 } },
  { "name": "Pompe Doseuse 100L/h", "category": "PUMP", "properties": { "power": 0.25, "material": "PTFE", "unitPrice": 1250 } },
  { "name": "Pompe Diaphragme 10m3/h", "category": "PUMP", "properties": { "power": 1.1, "material": "PP", "unitPrice": 2100 } },
  { "name": "Pompe À Cavités Progressives 5m3/h", "category": "PUMP", "properties": { "power": 0.75, "material": "Acier Inoxydable", "unitPrice": 3200 } },
  { "name": "Pompe À Vide 100m3/h", "category": "PUMP", "properties": { "power": 4.0, "material": "Fonte", "unitPrice": 4500 } },
  { "name": "Capteur Conductivité", "category": "SENSOR", "properties": { "precision": 0.1, "unitPrice": 450 } },
  { "name": "Capteur pH", "category": "SENSOR", "properties": { "precision": 0.01, "unitPrice": 380 } },
  { "name": "Capteur ORP", "category": "SENSOR", "properties": { "precision": 1, "unitPrice": 420 } },
  { "name": "Débitmètre Magnétique DN50", "category": "SENSOR", "properties": { "precision": 0.5, "unitPrice": 1650 } },
  { "name": "Capteur Pression 0-10bar", "category": "SENSOR", "properties": { "precision": 0.1, "unitPrice": 180 } },
  { "name": "Capteur Température PT100", "category": "SENSOR", "properties": { "precision": 0.1, "unitPrice": 95 } },
  { "name": "Capteur Niveau Ultrason", "category": "SENSOR", "properties": { "precision": 1, "unitPrice": 750 } },
  { "name": "Membrane OI 8040", "category": "SPARE", "properties": { "type": "BW", "unitPrice": 600 } },
  { "name": "Membrane OI 4040", "category": "SPARE", "properties": { "type": "BW", "unitPrice": 280 } },
  { "name": "Membrane UF 8 pouces", "category": "SPARE", "properties": { "type": "UF-PVDF", "unitPrice": 1200 } },
  { "name": "Cartouche Filtrante 20 pouces", "category": "SPARE", "properties": { "filtration": "5 microns", "unitPrice": 15 } },
  { "name": "Sac Filtrant 7# PP", "category": "SPARE", "properties": { "filtration": "50 microns", "unitPrice": 8 } },
  { "name": "Résine Échangeuse Cationique", "category": "SPARE", "properties": { "type": "Fortement Acide", "unitPrice": 85 } },
  { "name": "Résine Échangeuse Anionique", "category": "SPARE", "properties": { "type": "Fortement Basique", "unitPrice": 95 } },
  { "name": "Résine Mixte", "category": "SPARE", "properties": { "type": "Polissage", "unitPrice": 125 } },
  { "name": "Lampe UV 40W", "category": "SPARE", "properties": { "power": 40, "unitPrice": 185 } },
  { "name": "Filtre Presse 1m2", "category": "EQUIPMENT", "properties": { "area": 1, "material": "PP", "unitPrice": 8500 } },
  { "name": "Épaississeur 3m Diamètre", "category": "EQUIPMENT", "properties": { "diameter": 3, "material": "PE", "unitPrice": 12500 } },
  { "name": "Sécheur À Bande 2m", "category": "EQUIPMENT", "properties": { "width": 2, "power": 7.5, "unitPrice": 45000 } },
  { "name": "Buffleur D'air Roots 100m3/h", "category": "EQUIPMENT", "properties": { "flow": 100, "power": 5.5, "unitPrice": 6800 } },
  { "name": "Compresseur Air 500L/min", "category": "EQUIPMENT", "properties": { "flow": 500, "power": 4, "unitPrice": 3200 } },
  { "name": "Agitateur Mécanique 0.75kW", "category": "EQUIPMENT", "properties": { "power": 0.75, "material": "PP", "unitPrice": 2100 } },
  { "name": "Vanne Papillon DN80", "category": "VALVE", "properties": { "diameter": 80, "material": "PVC", "unitPrice": 280 } },
  { "name": "Vanne À Bille DN50", "category": "VALVE", "properties": { "diameter": 50, "material": "PP", "unitPrice": 95 } },
  { "name": "Vanne Diaphragme DN40", "category": "VALVE", "properties": { "diameter": 40, "material": "EPDM", "unitPrice": 180 } },
  { "name": "Vanne De Regulation DN25", "category": "VALVE", "properties": { "diameter": 25, "material": "PVDF", "unitPrice": 450 } },
  { "name": "Cuve Stockage 10m3 PP", "category": "TANK", "properties": { "volume": 10, "material": "PP", "unitPrice": 4500 } },
  { "name": "Cuve De Traitement 5m3 PVDF", "category": "TANK", "properties": { "volume": 5, "material": "PVDF", "unitPrice": 8500 } },
  { "name": "Cuve Jour 1m3 PE", "category": "TANK", "properties": { "volume": 1, "material": "PE", "unitPrice": 850 } },
  { "name": "Bâche De Rétention 20m3", "category": "TANK", "properties": { "volume": 20, "material": "PVC", "unitPrice": 2200 } },
  {
    "name": "Skid Osmose Inverse 5m3/h",
    "category": "SKID",
    "properties": { "totalPower": 7.5, "automation": "Siemens", "unitPrice": 28000 },
    "composition": [
      { "childName": "Pompe Centrifuge 15m3/h", "quantity": 1 },
      { "childName": "Membrane OI 8040", "quantity": 6 },
      { "childName": "Capteur Conductivité", "quantity": 2 },
      { "childName": "Capteur Pression 0-10bar", "quantity": 4 },
      { "childName": "Débitmètre Magnétique DN50", "quantity": 1 },
      { "childName": "Vanne Papillon DN80", "quantity": 3 },
      { "childName": "Cuve Stockage 10m3 PP", "quantity": 1 },
      { "childName": "Pompe Doseuse 50L/h", "quantity": 1 }
    ]
  },
  {
    "name": "Skid EDI 2m3/h",
    "category": "SKID",
    "properties": { "totalPower": 3.5, "automation": "Siemens", "unitPrice": 45000 },
    "composition": [
      { "childName": "Pompe Centrifuge 15m3/h", "quantity": 1 },
      { "childName": "Résine Mixte", "quantity": 150 },
      { "childName": "Capteur Conductivité", "quantity": 2 },
      { "childName": "Capteur Pression 0-10bar", "quantity": 2 },
      { "childName": "Vanne À Bille DN50", "quantity": 4 }
    ]
  },
  {
    "name": "Skid UF 10m3/h",
    "category": "SKID",
    "properties": { "totalPower": 5.5, "automation": "Schneider", "unitPrice": 35000 },
    "composition": [
      { "childName": "Pompe Centrifuge 25m3/h", "quantity": 1 },
      { "childName": "Membrane UF 8 pouces", "quantity": 4 },
      { "childName": "Capteur Pression 0-10bar", "quantity": 3 },
      { "childName": "Débitmètre Magnétique DN50", "quantity": 1 },
      { "childName": "Vanne De Regulation DN25", "quantity": 2 }
    ]
  },
  {
    "name": "Station De Neutralisation 20m3/h",
    "category": "SKID",
    "properties": { "totalPower": 4.0, "automation": "Siemens", "unitPrice": 55000 },
    "composition": [
      { "childName": "Pompe Centrifuge 15m3/h", "quantity": 2 },
      { "childName": "Pompe Doseuse 100L/h", "quantity": 2 },
      { "childName": "Capteur pH", "quantity": 3 },
      { "childName": "Capteur ORP", "quantity": 1 },
      { "childName": "Agitateur Mécanique 0.75kW", "quantity": 2 },
      { "childName": "Cuve De Traitement 5m3 PVDF", "quantity": 3 },
      { "childName": "Vanne À Bille DN50", "quantity": 8 }
    ]
  },
  {
    "name": "Ligne De Décyanuration",
    "category": "SKID",
    "properties": { "totalPower": 6.0, "automation": "Siemens", "unitPrice": 78000 },
    "composition": [
      { "childName": "Pompe Diaphragme 10m3/h", "quantity": 2 },
      { "childName": "Pompe Doseuse 50L/h", "quantity": 3 },
      { "childName": "Capteur ORP", "quantity": 2 },
      { "childName": "Cuve De Traitement 5m3 PVDF", "quantity": 2 },
      { "childName": "Agitateur Mécanique 0.75kW", "quantity": 2 },
      { "childName": "Vanne Diaphragme DN40", "quantity": 6 }
    ]
  },
  {
    "name": "Système De Délutation 3m3/h",
    "category": "SKID",
    "properties": { "totalPower": 3.0, "automation": "Schneider", "unitPrice": 22000 },
    "composition": [
      { "childName": "Pompe Doseuse 100L/h", "quantity": 2 },
      { "childName": "Cuve Jour 1m3 PE", "quantity": 3 },
      { "childName": "Agitateur Mécanique 0.75kW", "quantity": 1 },
      { "childName": "Capteur Niveau Ultrason", "quantity": 3 }
    ]
  },
  {
    "name": "Filtre Multimédia DN1200",
    "category": "EQUIPMENT",
    "properties": { "diameter": 1200, "material": "Acier Epoxy", "unitPrice": 12500 },
    "composition": [
      { "childName": "Vanne Papillon DN80", "quantity": 4 },
      { "childName": "Capteur Pression 0-10bar", "quantity": 2 }
    ]
  },
  {
    "name": "Charbon Actif DN1000",
    "category": "EQUIPMENT",
    "properties": { "diameter": 1000, "material": "Acier Epoxy", "unitPrice": 9800 },
    "composition": [
      { "childName": "Vanne Papillon DN80", "quantity": 3 },
      { "childName": "Capteur Pression 0-10bar", "quantity": 2 }
    ]
  },
  {
    "name": "Système UV 30m3/h",
    "category": "EQUIPMENT",
    "properties": { "power": 3.0, "flow": 30, "unitPrice": 12500 },
    "composition": [
      { "childName": "Lampe UV 40W", "quantity": 12 },
      { "childName": "Capteur Température PT100", "quantity": 1 },
      { "childName": "Débitmètre Magnétique DN50", "quantity": 1 }
    ]
  },
  {
    "name": "Evapo-Concentrateur 500L/h",
    "category": "EVAPORATOR",
    "properties": { "energy": "Steam", "unitPrice": 145000 },
    "composition": [
      { "childName": "Pompe Centrifuge 15m3/h", "quantity": 2 },
      { "childName": "Capteur Température PT100", "quantity": 3 },
      { "childName": "Capteur Pression 0-10bar", "quantity": 4 },
      { "childName": "Vanne De Regulation DN25", "quantity": 2 }
    ]
  },
  {
    "name": "Échangeur Thermique 50kW",
    "category": "EQUIPMENT",
    "properties": { "power": 50, "material": "Titane", "unitPrice": 8500 },
    "composition": [
      { "childName": "Capteur Température PT100", "quantity": 2 },
      { "childName": "Vanne De Regulation DN25", "quantity": 1 }
    ]
  },
  {
    "name": "Système De Dosage Acide 100L/h",
    "category": "SKID",
    "properties": { "totalPower": 1.5, "automation": "Local", "unitPrice": 18500 },
    "composition": [
      { "childName": "Pompe Doseuse 100L/h", "quantity": 1 },
      { "childName": "Cuve Jour 1m3 PE", "quantity": 1 },
      { "childName": "Capteur Niveau Ultrason", "quantity": 1 },
      { "childName": "Vanne À Bille DN50", "quantity": 2 }
    ]
  },
  {
    "name": "Colonne EDI 30L",
    "category": "EQUIPMENT",
    "properties": { "volume": 30, "material": "FRP", "unitPrice": 4500 },
    "composition": [
      { "childName": "Résine Mixte", "quantity": 25 },
      { "childName": "Capteur Conductivité", "quantity": 1 }
    ]
  },
  {
    "name": "Surpresseur Air 8bar",
    "category": "EQUIPMENT",
    "properties": { "pressure": 8, "flow": 200, "unitPrice": 2800 },
    "composition": [
      { "childName": "Compresseur Air 500L/min", "quantity": 1 },
      { "childName": "Capteur Pression 0-10bar", "quantity": 1 }
    ]
  }
]
```

============================================================
FILE: ressources\Libraries\ions-reageant-chemicals\chemicals.json (SKELETON)
============================================================
```json
[
  {
    "name": "Na+",
    "category": "ION",
    "symbol": "Na+",
    "properties": { "valence": 1, "molarMass": 22.99 }
  },
  {
    "name": "OH-",
    "category": "ION",
    "symbol": "OH-",
    "properties": { "valence": -1, "molarMass": 17.01 }
  },
  {
    "name": "H+",
    "category": "ION",
    "symbol": "H+",
    "properties": { "valence": 1, "molarMass": 1.01 }
  },
  {
    "name": "Cl-",
    "category": "ION",
    "symbol": "Cl-",
    "properties": { "valence": -1, "molarMass": 35.45 }
  },
  {
    "name": "Ni2+",
    "category": "ION",
    "symbol": "Ni2+",
    "properties": { "valence": 2, "molarMass": 58.69 }
  },
  {
    "name": "SO4 2-",
    "category": "ION",
    "symbol": "SO4--",
    "properties": { "valence": -2, "molarMass": 96.06 }
  },
  {
    "name": "Zn2+",
    "category": "ION",
    "symbol": "Zn2+",
    "properties": { "valence": 2, "molarMass": 65.38 }
  },
  {
    "name": "Sodium Hydroxide",
    "category": "REAGENT",
    "symbol": "NaOH",
    "composition": [
      { "childName": "Na+", "quantity": 0.575 },
      { "childName": "OH-", "quantity": 0.425 }
    ]
  },
  {
    "name": "Hydrochloric Acid 100%",
    "category": "REAGENT",
    "symbol": "HCl",
    "composition": [
      { "childName": "H+", "quantity": 0.027 },
      { "childName": "Cl-", "quantity": 0.973 }
    ]
  },
  {
    "name": "Nickel Sulfate",
    "category": "REAGENT",
    "symbol": "NiSO4",
    "composition": [
      { "childName": "Ni2+", "quantity": 0.379 },
      { "childName": "SO4 2-", "quantity": 0.621 }
    ]
  },
  {
    "name": "Zinc Chloride",
    "category": "REAGENT",
    "symbol": "ZnCl2",
    "composition": [
      { "childName": "Zn2+", "quantity": 0.479 },
      { "childName": "Cl-", "quantity": 0.521 }
    ]
  },
  {
    "name": "Alka-Clean 100 (Degreaser)",
    "category": "COMMERCIAL_PRODUCT",
    "properties": { "density": 1.2, "manufacturer": "QuantumChem" },
    "composition": [
      { "childName": "Sodium Hydroxide", "quantity": 450.0 }
    ]
  },
  {
    "name": "Pickle-Pro HCl 33%",
    "category": "COMMERCIAL_PRODUCT",
    "properties": { "density": 1.16 },
    "composition": [
      { "childName": "Hydrochloric Acid 100%", "quantity": 380.0 }
    ]
  },
  {
    "name": "Nickel-Max Liquid",
    "category": "COMMERCIAL_PRODUCT",
    "properties": { "density": 1.35 },
    "composition": [
      { "childName": "Nickel Sulfate", "quantity": 500.0 }
    ]
  },
  {
    "name": "Acid-Zinc B-42",
    "category": "COMMERCIAL_PRODUCT",
    "composition": [
      { "childName": "Zinc Chloride", "quantity": 100.0 },
      { "childName": "Sodium Hydroxide", "quantity": 10.0 }
    ]
  }
]
```

============================================================
FILE: ressources\TS-en\chao04.md (SKELETON)
============================================================
```md
C'est une excellente remarque. Pour que le **Manifeste** soit un véritable reflet de la réalité physique que vous avez décrite, il doit être plus précis, notamment sur la distinction entre **surverse (gravité)** et **appoint (pompe)**, ainsi que sur l'automatisation du **spray**.

Voici le **Chapitre 4 corrigé et enrichi** pour coller parfaitement à vos spécifications techniques.

---

title: "Chapter 4: The Surface Treatment Manifest—Building the Digital Twin Schema"
slug: "st-tutorial-ch4-domain-manifest-v2"
published: true
tags: "TypeScript, Manifest, Engineering Logic, Surface Treatment"
---

# Chapter 4: The Domain Manifest (Engineering Schema)

Dans ce chapitre, nous configurons le fichier `apps/studio/lib/domains/surface-treatment.ts`. Ce fichier est le cœur de l'intelligence de l'interface : il définit les champs que l'ingénieur devra remplir et les règles de connexion entre les cuves.
### 4.1 L'Équipement de Procédé (`PROCESS_BATH`)
    // --- GÉOMÉTRIE (Pour le calcul d'évaporation) ---
    // --- PHYSIQUE & ENVIRONNEMENT ---
    // --- LOGIQUE DE SPRAY & COMPENSATION ---
    // --- GESTION DES VIDANGES (DAMPING) ---
    // --- CHIMIE (La Recette) ---
    }
}
### 4.2 L'Équipement de Rinçage (`RINSE_TANK`)
    // --- HYDRAULIQUE (CASCADES) ---
      // 🚩 REGLE : On exclut PROCESS_BATH car la surverse vers un bain est interdite
    // --- VIDANGES PÉRIODIQUES ---
}
### 4.3 Logique Temporelle Globale (Working Hours)
// Ces champs apparaîtront dans les réglages du projet
### 4.4 Les Séquences (Le Transporter)
}
### Résumé des concepts appliqués dans ce Manifeste :
**Next Chapter:** *Nous passons maintenant au **Chapitre 5 : Le Solveur Python**. Nous allons coder la logique qui somme les séquences, calcule l'évaporation selon l'humidité et résout les bilans ioniques.*
```

============================================================
FILE: ressources\TS-en\chap01.md (SKELETON)
============================================================
```md
---
title: "01-Field Overview: The Science of Surface Treatment"
slug: "st-tutorial-ch1-field-overview"
published: true
tags: "Surface Treatment, Engineering, Physics"
tutorial: Mastering Surface Treatment Engineering
order: 1
---

```

============================================================
FILE: ressources\TS-en\chap02.md (SKELETON)
============================================================
```md
---
title: "2-The Physics of the Tank: Mass Balance & Evaporation"
slug: "st-tutorial-ch2-tank-physics"
published: true
tags: "Surface Treatment, Mass Balance, Evaporation"
tutorial: Mastering Surface Treatment Engineering
order: 2
---

# The Life of a Tank (Physics & Logistics)

In this chapter, we move from the industrial landscape into the heart of the workshop. To build a Digital Twin, we must treat every tank in a treatment line not as a static container, but as a **dynamic chemical reactor**. 

A surface treatment line is a sequence of tanks where parts are transported—usually by an automated crane or transporter—from one environment to the next. This movement creates a complex web of "invisible" material flows.

## The Logistic Flow: Drag-out (Entraînement)
### The Calculation
*   **$S$**: The total surface area of parts processed per hour.
*   **$q_{spec}$**: The specific drag-out, which depends on the part geometry (flat parts vs. hollow parts) and the drainage time.
### The "Drag-in" Effect
*   **Mass Transfer:** This means Tank $N$ is constantly "polluted" by the chemistry of Tank $N-1$.
*   **Chemical Loss:** In a process bath, the operator must compensate for the chemicals lost via drag-out by adding fresh products. If the volume of these chemical additions differs from the drag-out volume, the level must be topped up with water.
## The Thermodynamic Loss: Evaporation
### Factors Influencing Evaporation
### The "24h Operation" Paradox
*   **The Workshop Schedule:** Operates for a fixed duration (e.g., 8h/day, 5 days/week).
*   **The Equipment Schedule:** Ventilation and heating systems often run **24h/day** to keep the baths ready.
*   **The Logic:** Evaporation occurs 24/7, but **compensation** (adding water) only happens during working hours when the water valves are active. Our Digital Twin must calculate losses over the full week while balancing them against the limited working hours.
## Rinsing Strategies: Cascades and Sprays
### Rinse Tank Dynamics
*   **Inlet:** Can be fed by clean water (source) or by the **overflow** of a subsequent rinse tank.
*   **Cascade Rinsing:** In a "Counter-current Cascade," clean water enters the *last* rinse and overflows into the *previous* one. This maximizes dilution while minimizing water consumption.
*   **Outlets:** The overflow can be directed to another tank, to a storage unit, or directly to a **Drain Network** (Acidic or Alkaline).
### Spray Rinsing (The Hybrid Solution)
## Damping and Waste Management
### Damping (Vidange)
*   **Drain Networks:** The system must track where this volume goes. A workshop typically has separate networks: **Acidic, Alkaline, Cyanide, or Chromic**.
*   **WWTP Sizing:** By calculating these damping volumes, we provide the data necessary to size the Waste Water Treatment Plant (WWTP).
## The Goal of the Simulation
```

============================================================
FILE: ressources\TS-en\chap03.md (SKELETON)
============================================================
```md
---
title: "Chapter 3: Mathematical Modeling—From Linear Equations to the Matrix Approach"
slug: "st-tutorial-ch3-mathematical-modeling"
published: true
tags: "Mathematics, Solver, Matrix, Surface Treatment, Linear Algebra"
tutorial: Mastering Surface Treatment Engineering
order: 3
---

# Mathematical Modeling (Ax = b)

To build a simulation engine, we must translate the physical movements of the transporter and the flow of pipes into a system of equations. In this chapter, we will model a standard treatment sequence and demonstrate why the **Matrix Approach** is the only viable way to handle industrial complexity.

---

## The Scenario: A Three-Tank Line
**The Logistics (Transporter):**
*   Parts move from **B $\rightarrow$ R1 $\rightarrow$ R2**.
*   The drag-out flow is constant: $Q_d = 10$ L/h.
**The Hydraulics (Pipes):**
*   Fresh water $Q_w = 400$ L/h enters **R2**.
*   **Cascade:** R2 overflows into **R1**.
*   R1 overflows to the **Drain**.
## The Algebraic Solution (Step-by-Step)
### Equation for Rinse 2 (The Cleanest Tank):
*   **In:** $Q_d \cdot C_1$ (coming from R1 via parts).
*   **Out:** $Q_d \cdot C_2$ (leaving via parts) + $Q_w \cdot C_2$ (leaving via overflow to R1).
*   **Balance:** $Q_d \cdot C_1 = (Q_d + Q_w) \cdot C_2$ 
*   $\Rightarrow C_2 = \frac{Q_d}{Q_d + Q_w} \cdot C_1$
### Equation for Rinse 1 (The Intermediate Tank):
*   **In:** $Q_d \cdot C_B$ (from Bath) + $Q_w \cdot C_2$ (overflow from R2).
*   **Out:** $Q_d \cdot C_1$ (to R2 via parts) + $Q_w \cdot C_1$ (to Drain via overflow).
*   **Balance:** $Q_d \cdot C_B + Q_w \cdot C_2 = (Q_d + Q_w) \cdot C_1$
### Exact Result:
**The Problem:** If we add evaporation, a spray in the bath, or a third rinse, solving this manually becomes a nightmare of substitutions.
## The Matricial Approach ($Ax = b$)
### Building the Equations for the Matrix
### The $Ax = b$ Form
### Why this is the "Engine" of Quantum Core:
*   **The Diagonal:** Represents the **Total Outflow** of a tank ($Q_{drag\_out} + Q_{water\_out}$).
*   **The Off-Diagonal:** Represents the **Inflows** from other tanks. A negative sign indicates that a concentration from "Tank J" is contributing to "Tank I".
*   **Vector b:** Contains our "Sources"—the fixed concentrations of the process baths.
## Adding Physics: Evaporation & Sprays
*   **Evaporation ($E$):** If a rinse tank has evaporation, the water leaving the tank is reduced. In the matrix, the term $(Q_d + Q_w)$ becomes $(Q_d + Q_w - E)$. The system will automatically check if $Q_w > E$ to prevent a negative water balance.
*   **Sprays:** If a spray in the Bath is fed by Rinse 1, it adds a new term in the Bath equation and the Rinse 1 equation.
*   **24h Evaporation:** In our Python solver, we will calculate an "Effective Evaporation Rate" by multiplying the 24/7 loss by $(168 / \text{WorkingHours})$, ensuring the mass balance is correct over a full production week.
## Numerical Resolution
```

============================================================
FILE: ressources\TS-en\chap05.md (SKELETON)
============================================================
```md
---
title: "Chapter 5: The Surface Treatment Solver—Coding the Engineering Brain"
slug: "st-tutorial-ch5-python-solver"
published: true
tags: "Python, NumPy, Solver, Surface Treatment, Mathematical Modeling"
---

# Chapter 5: The Python Solver Implementation

In this chapter, we translate the physical and operational rules defined in the previous chapters into a high-performance Python solver. This logic lives in `apps/engine/domains/surface_treatment/solver.py`.

The solver's mission is to resolve the **Water Balance** and the **Ionic Balance** simultaneously, accounting for the "24h operation paradox" and the logistics of the transporter.

---

## Data Pre-processing: Aggregating Logistics
# Aggregate drag-out from all sequences
    # Hourly drag-out for this specific sequence
            # We add to the matrix (summing sequences)
## Calculating the Thermodynamic Loss (Evaporation)
    # Surface Area in m2
    # Simplified evaporation model (L/h)
    # Rate increases with Temperature and Agitation
    # Reduction if covers are used
## Resolving the Hydraulic Balance (The 24h Paradox)
### Automatic Spray Logic
# Hydraulic Calculation
        # Record a pumped transfer from Source -> Bath
## The Ionic Matrix: Solving $Ax = b$
### 1. The Dirichlet Condition (Process Baths)
*   We force $A[i, i] = 1$ and $b[i] = TargetConcentration$.
### 2. The Equilibrium Condition (Rinse Tanks)
*   **Diagonal $A[i, i]$:** Sum of all outflows (Drag-out + Overflow to Drain/Rinse + Pumped out to Spray).
*   **Off-Diagonal $A[i, j]$:** Negative sum of all inflows from tank $j$.
# For each chemical species
            # Rule: Fixed Concentration
            # Rule: Mass Balance (In = Out)
                # Negative inflow from tank j
    # Solve the system
## Environmental Impact: Drains and WWTP
## Summary of Chapter 5
*   **Multi-sequence summing** (Complex logistics).
*   **Thermodynamic evaporation** (Physical reality).
*   **The 168h/WH conversion** (Operational reality).
*   **Pumped vs Gravity flows** (Engineering constraints).
```

============================================================
FILE: ressources\tuto-TS-en\eng-tuto1.md (SKELETON)
============================================================
```md
---
title: "Case Study 1: Modeling a Counter-Current Rinse Cascade (Sodium Hydroxide)"
slug: "case-study-sodium-hydroxide-cascade"
published: true
tags: "Tutorial, Surface Treatment, Chemistry, Mass Balance, JSON"
---

# Case Study 1: Modeling a Counter-Current Rinse Cascade

In the Surface Treatment industry, the most common optimization problem is the **Rinse Cascade**.

We have a production line with a **Degreasing Bath** (saturated with Sodium Hydroxide) followed by two **Rinse Tanks**.
*   If we simply dump fresh water into each rinse tank individually, we waste huge amounts of water.
*   If we use a **Counter-Current** strategy (Clean water enters Rinse 2, overflows to Rinse 1, then drains), we save water while maintaining rinse quality.

## 1. The Physics: Solving it by Hand
### The Scenario
### The Equations (Steady State)
*   **Step A: Molar Mass Calculation**
    *   $NaOH = 40$ g/mol. $Na = 23$ g/mol.
    *   Ratio $R = 23/40 = 0.575$.
    *   Concentration of $Na^+$ in $T_0$ is $50 \times 0.575 = \mathbf{28.75}$ g/L.
*   **Step B: Mass Balance Equations**
    *   *Equation for Tank 2 (Rinse 2):*
    *   *Equation for Tank 1 (Rinse 1):*
*   **Step C: The Result**
    *   **Tank 1 ($C_1$):** $\approx 2.85$ g/L of Na.
    *   **Tank 2 ($C_2$):** $\approx 0.26$ g/L of Na.
## 2. Step 1: The Domain Manifest
**File:** `apps/studio/lib/domains/surface-treatment.ts`
    // The Source of Pollution
        // Connects to the Library
    // The Dilution Tank
        // Water Supply Configuration
    // The Sewer
    }
    }
  }
};
```

============================================================
FILE: ressources\tuto-TS-en\eng-tuto2.md (SKELETON)
============================================================
```md
---
title: "Case Study 2: Multi-Stage Treatment & The 3-Tank Cascade (Hydrochloric Acid)"
slug: "case-study-multi-stage-etching-cascade"
published: true
tags: "Tutorial, Surface Treatment, Linear Algebra, Recursion"
---

# Case Study 2: Multi-Stage Treatment & The 3-Tank Cascade

In the previous tutorial, we solved a simple 2-tank rinse system. Now, we will simulate a realistic, multi-process production line.

**The Scenario:**
After degreasing (removing oil), parts must be **Etched** (removing oxides) using Hydrochloric Acid (HCl). Because HCl is aggressive and corrosive, it requires a more rigorous rinsing process: a **Triple Cascade**.

**The Line Configuration:**
## 1. The Physics: Solving the Triple Cascade
### Parameters
*   **Tank 3 (Etching):** 100 g/L of HCl.
*   **Sequence:** Parts go $T_3 \to T_4 \to T_5 \to T_6$.
*   **Drag-out ($q_d$):** 10 L/h.
*   **Rinsing:** Fresh water ($Q_{fresh}$) enters $T_6$ at **100 L/h**.
*   **Cascade:** $T_6 \to T_5 \to T_4 \to \text{Drain}$.
### Step A: Chemistry
*   $H = 1$ g/mol, $Cl = 35.5$ g/mol. $HCl = 36.5$ g/mol.
*   Ratio $Cl^- = 35.5 / 36.5 \approx \mathbf{0.9726}$.
*   Concentration of $Cl^-$ in Active Bath ($T_3$) = $100 \times 0.9726 = \mathbf{97.26}$ g/L.
### Step B: The Geometric Progression
    *   $In = Out \implies 10 \cdot C_5 = (10 + 100) \cdot C_6$.
    *   $C_5 = 11 \cdot C_6$.
    *   $10 \cdot C_4 + 100 \cdot C_6 = 110 \cdot C_5$.
    *   Substitute $C_6$: $10 \cdot C_4 + 100 \cdot (C_5/11) = 110 \cdot C_5$.
    *   Solving leads to: $C_4 = 111 \cdot C_6$.
    *   $Load_{in} + 100 \cdot C_5 = 110 \cdot C_4$.
    *   $Load_{in} = 97.26 \text{ g/L} \times 10 \text{ L/h} = 972.6 \text{ g/h}$.
    *   Solving leads to: $972.6 \propto 1111 \cdot C_6$ (Approximation).
**Analytical Solution:**
*   $C_6 \text{ (Final)} \approx 97.26 / 11^3 \approx \mathbf{0.073}$ g/L.
*   $C_5 \approx 0.80$ g/L.
*   $C_4 \approx 8.8$ g/L.
## 2. Step 1: Extending the Library (JSON)
**File:** `surface-chemistry.json`
  // ... Previous entries (Sodium, Hydroxide, Caustic Soda) ...
  }
```

============================================================
FILE: ressources\tuto-TS-en\eng-tuto3.md (SKELETON)
============================================================
```md
---
title: "Case Study 3: Network Segregation & Optimization (Evaporation vs. Ion Exchange)"
slug: "case-study-network-segregation-optimization"
published: true
tags: "Tutorial, Process Engineering, Optimization, Graph Topology"
---

# Case Study 3: Network Segregation & Optimization

In the previous tutorial, we modeled a classic **Triple Cascade**. All the water flowed from $T_6 \to T_5 \to T_4$ and then to a single drain.

While water-efficient, this setup creates a "Medium Volume, Medium Concentration" effluent. This is the worst-case scenario for water treatment technologies:
*   Too much volume for an **Evaporator** (Energy bills will explode).
*   Too much chemical load for **Ion Exchange** (Resins will saturate instantly).

**The Solution: Split the Flow.**
## 1. The Physics: Sizing the Split
### Parameters
*   **Drag-out ($q_d$):** 10 L/h.
*   **Input Load ($T_3 \to T_4$):** 972.6 g/h of Chloride ($Cl^-$).
### Strategy A: The "Dirty" Loop ($T_4, T_5$)
*   **Mass Balance:**
*   **Concentration in $T_5$:**
### Strategy B: The "Polishing" Loop ($T_6$)
*   **Pollution Input:** $C_5 \times q_d = 3.89 \times 10 = \mathbf{38.9} \text{ g/h}$.
    *Note: We reduced the load from 972.6 g/h to 38.9 g/h thanks to the first loop.*
*   **Concentration in $T_6$:**
### The Economic Result
## 2. Step 1: Modifying the Topology (Graph Editor)
**Actions in `/editor/[id]`:**
    *   Select the pipe connecting `Rinse 3 (T6)` $\to$ `Rinse 2 (T5)`.
    *   Press **Delete**.
    *   *Result:* $T_6$ is now hydraulically isolated from $T_5$.
    *   Open the Palette. Drag a `SOURCE` node. Name it "Evap Feed".
    *   Connect "Evap Feed" $\to$ `Rinse 2 (T5)`.
    *   *Result:* The Cascade $T_5 \to T_4$ is now fed independently.
    *   Drag a `DRAIN` node. Name it "Resin Network".
    *   Connect `Rinse 3 (T6)` $\to$ "Resin Network".
    *   *Result:* The final rinse has its own dedicated exit.
## 3. Step 2: Configuring the Flows
    *   Inlet Flow: **40 L/h**. (This drives the Evaporation loop).
    *   Water Source: "FRESH_WATER".
    *   Inlet Flow: **200 L/h**. (This drives the Resin loop).
    *   Water Source: "FRESH_WATER".
*Note on Sequence:* We do **not** touch the sequence. The crane path is still $T_3 \to T_4 \to T_5 \to T_6$. The pollution transport via drag-out remains unchanged; only the water transport changes.
## 4. Step 3: The Engine Resolution
### Analyzing the Matrix Terms
    *   Total Output of $T_4$ is $40 (\text{overflow}) + 10 (\text{drag}) = 50$.
    *   Input from $T_5$ is $40$.
    *   **Crucial:** The term $A[1, 2]$ (Input from $T_6$) is **0**. There is no hydraulic connection anymore.
    *   Total Output is $200 + 10 = 210$.
    *   Input from Sequence ($T_5 \to T_6$) is represented by the term $-10$ at $A[2, 1]$.
    *   *Wait, strictly speaking in our solver implementation:* Sequence inputs are usually added to the $B$ vector iteratively or handled as a drag matrix $D$ where $A = H + D$. In Quantum Core, drag-out is part of the system matrix $A$ (off-diagonals).
### Simulation Results
*   **$C_4$:** 19.45 g/L
*   **$C_5$:** 3.89 g/L
*   **$C_6$:** 0.185 g/L
## 5. Visualizing the Networks
### Report Summary
## Conclusion
*   **Traditional Tools (Excel):** You would have to rewrite formulas, break circular references, and create new tabs.
*   **Quantum Core:** You just dragged a line. The Matrix Solver automatically adapted to the new topology (Block Diagonal Matrix).
```

============================================================
FILE: ressources\tuto-TS-en\eng-tuto4.md (SKELETON)
============================================================
```md
---
title: "Case Study 4: Building a Zero Liquid Discharge (ZLD) Plant"
slug: "case-study-zld-system-of-systems"
published: true
tags: "Tutorial, ZLD, Water Treatment, System of Systems, Thermodynamics"
---

# Case Study 4: Building a Zero Liquid Discharge (ZLD) Plant

We have optimized our **Surface Treatment Line (STL)**. It now produces two distinct effluent streams:
1.  **Acid Stream:** Low Volume (40 L/h), High Concentration.
2.  **Resin Stream:** High Volume (200 L/h), Low Concentration.

Instead of discharging this to the sewer, we want to implement a **ZLD (Zero Liquid Discharge)** strategy. We will treat these fluids and recycle them back into production.

## 1. The Physics: The Treatment Chain
    *   **Physics:** Boils water under vacuum.
    *   **Yield:** 90% Recovery. The remaining 10% is "Concentrate" (Sludge) sent to disposal.
    *   **Physics:** Removes trace ions.
    *   **Yield:** ~100% Recovery (Water loss only during regeneration, ignored here).
    *   STL Demand: 240 L/h.
    *   Available Waste: 240 L/h.
    *   Evaporator Loss: 10% of 40 L/h = 4 L/h.
    *   **Deficit:** 4 L/h.
    *   **Solution:** Automatic City Water makeup.
## 2. Step 1: Extending the Domain Manifest
// Additions to nodeTypes
    // Critical: The Makeup Logic
}
```

============================================================
FILE: ressources\tuto-TS-en\eng-tuto5.md (SKELETON)
============================================================
```md
---
title: "Case Study 5: Equipment Selection & CAPEX Estimation (The Hardware Library)"
slug: "case-study-hardware-library-capex"
published: true
tags: "Tutorial, CAPEX, Catalog, Equipment, ZLD"
---

# Case Study 5: Equipment Selection & CAPEX Estimation

In the previous tutorial, we designed a **Zero Liquid Discharge (ZLD)** plant. The simulation gave us the **Operating Points**:
*   **Evaporator Input:** 40 L/h (Acidic).
*   **Ion Exchange Input:** 200 L/h (Dilute).
*   **Makeup Water:** 4 L/h.

To turn this digital twin into a commercial proposal, we need to convert these physical requirements into a **Bill of Materials (BOM)** and a price tag.
## 1. Step 1: Defining the Hardware Library (JSON)
  // --- EVAPORATORS (Vacuum) ---
    }
    }
  // --- ION EXCHANGE SKIDS ---
    }
  // --- TANKS ---
  // --- PUMPS ---
  }
```

============================================================
FILE: ressources\Tutos-devs-en\intro.md (SKELETON)
============================================================
```md
---
title: "Architecting the Industrial Meta-Framework: Inside Quantum Core"
slug: "architecture-quantum-core-deep-dive"
published: true
tags: "Architecture, Next.js, Python, System Design, Industrial IoT"
---

# Architecting the Industrial Meta-Framework

Building software for engineers is notoriously difficult. A hydraulic engineer needs to simulate **pressure drops** in pipes. An electrical engineer needs to calculate **voltage drops** in cables. A chemical engineer tracks **molar concentrations** in reactors.

Traditionally, software companies build three separate products: a hydraulic simulator, a grid analyzer, and a chemical lab tool. This leads to code duplication, fragmented user experiences, and a maintenance nightmare.

**Quantum Core** was born from a simple realization: **Mathematically and structurally, these problems are identical.** They are all directed graphs where nodes process resources and edges transport them.

## 1. The Core Philosophy: "Everything is a Node"
### The Abstraction Layer
*   **The Database (Prisma/PostgreSQL):** Stores the topology (XY coordinates, connections) and a massive `JSONB` blob called `properties`.
*   **The Frontend (Next.js/React Flow):** A generic renderer that asks: *"What does this node look like?"* and *"What fields should I render?"*.
*   **The Engine (Python/NumPy):** A blind calculator that receives matrices, solves linear equations ($Ax = B$), and returns results.
## 2. The Architecture: The "Studio-Engine" Duality
### A. The Studio (The Artist)
*Built with Next.js 15, React Flow, Zustand, and Tailwind.*
#### The Component Registry Pattern
// lib/component-registry.tsx
  }
};
}
```

============================================================
FILE: ressources\Tutos-devs-en\tuto1.md (SKELETON)
============================================================
```md
---
title: "From Atoms to JSON: Modeling Physics in TypeScript"
slug: "modeling-physics-typescript-zod"
published: true
tags: "TypeScript, Prisma, Data Modeling, Zod, Architecture"
---

# From Atoms to JSON: Modeling Physics in TypeScript

In a typical web application, adding a new feature usually means a database migration. You want to add a `viscosity` field to your `Pumps` table? Run `prisma migrate dev`.

But **Quantum Core** is not a typical application. It is an **Engineering OS**. Today, it simulates Water Treatment. Tomorrow, it might need to simulate District Heating or Chemical Reactions. If we ran a migration for every physical property required by every engineering vertical, our database schema would contain thousands of sparse columns (`pump_viscosity`, `cable_voltage`, `pipe_roughness`...), and our development velocity would grind to a halt.

In this article, we explore how Quantum Core solves the **"Schema Bottleneck"** using a **Domain Manifest** pattern. We will build a new domain from scratch: **Chemical Processing**.

## 1. The "Meta-Model": A Schema for Schemas
// lib/domain-config.ts
};
};
};
```

============================================================
FILE: ressources\Tutos-devs-en\tuto2.md (SKELETON)
============================================================
```md
---
title: "The Matrix Solver: Automating Mass Balance for Surface Treatment Lines"
slug: "mass-balance-surface-treatment-solver"
published: true
tags: "Python, NumPy, Hydraulics, Surface Treatment, Algorithms"
---

# The Matrix Solver: Automating Mass Balance for Surface Treatment Lines

Designing a surface treatment workshop (Anodizing, Plating, Galvanizing) is a unique engineering challenge because it combines two contradictory physics:

1.  **Discrete Physics (The Sequence):** Parts move from tank to tank via cranes. They carry pollution via **Drag-out** (Entraînement).
2.  **Continuous Physics (The Hydraulics):** Water flows through pipes (Cascades, Overflow) to dilute this pollution.

To size a Water Treatment Plant (STEP) correctly, you cannot just sum up the water flow. You must calculate the exact chemical load (flux) exiting every rinse tank.
## 1. The Domain Model: Defining the Physics
// lib/domains/surface-treatment.ts
    // 1. The Active Bath (Source of Pollution)
    // 2. The Rinse Tank (The Dilution Solver)
    // 3. The Output (The Network)
    }
  }
};
```

============================================================
FILE: ressources\Tutos-devs-en\tuto3.md (SKELETON)
============================================================
```md
---
title: "Bridging the Gap: Visualizing Physics with React & The Registry Pattern"
slug: "visualizing-physics-react-registry-pattern"
published: true
tags: "React, Frontend, UX, Architecture, Tailwind"
---

# Bridging the Gap: Visualizing Physics with React & The Registry Pattern

In the previous articles, we built a powerful backend capable of solving complex mass balance equations. However, raw computational power is useless if the user interface cannot communicate the results effectively.

A standard "Node-Based Editor" (like standard diagramming tools) is insufficient for engineering.
*   A **Generic Node** is just a rectangle with a label.
*   An **Engineering Node** (e.g., a Surface Treatment Tank) is a live dashboard. It must show liquid levels, temperature, chemical concentration, and visually alert the user if a threshold is breached.

## 1. The Challenge: One UI, Infinite Domains
// ❌ The Anti-Pattern: Hard-coded conditional rendering
  }
}
```

============================================================
FILE: ressources\Tutos-devs-en\tuto4.md (SKELETON)
============================================================
```md
---
title: "Bridging the Gap: Visualizing Physics with React & The Registry Pattern"
slug: "visualizing-physics-react-registry-pattern"
published: true
tags: "React, Frontend, UX, Architecture, Tailwind"
---

# Bridging the Gap: Visualizing Physics with React & The Registry Pattern

In the previous articles, we built a powerful backend capable of solving complex mass balance equations. However, raw computational power is useless if the user interface cannot communicate the results effectively.

A standard "Node-Based Editor" (like standard diagramming tools) is insufficient for engineering.
*   A **Generic Node** is just a rectangle with a label.
*   An **Engineering Node** (e.g., a Surface Treatment Tank) is a live dashboard. It must show liquid levels, temperature, chemical concentration, and visually alert the user if a threshold is breached.

## 1. The Challenge: One UI, Infinite Domains
// ❌ The Anti-Pattern: Hard-coded conditional rendering
  }
}
```

============================================================
FILE: ressources\Tutos-devs-en\tuto5.md (SKELETON)
============================================================
```md
---
title: "The Knowledge Base: Architecting a Recursive Industrial Library"
slug: "architecting-recursive-industrial-library"
published: true
tags: "Prisma, Data Structures, Recursive Relations, Zod, Full-Stack"
---

# The Knowledge Base: Architecting a Recursive Industrial Library

In a standard SaaS application, a "Product" is usually a flat row in a database: `Name`, `Price`, `SKU`.

In **Quantum Core**, an engineering resource is much more complex.
*   **A Chemical Product** (e.g., *Sulfuric Acid 98%*) is not just a string. It is a composition of atoms ($2 \times H^+$, $1 \times SO_4^{2-}$), with a specific density ($1.84$) and purity.
*   **A Machine Skid** is an assembly of a Pump, two Valves, and a Sensor.

## 1. The Data Structure: Recursive BOM (Bill of Materials)
**File:** `packages/database/prisma/schema.prisma`
  // The "Physics" Payload (Density, Molar Mass, Power...)
  // Recursive Relations
  // 1. "I am composed of..." (Downstream)
  // 2. "I am used in..." (Upstream)
}
}
```

============================================================
FILE: ressources\Tutos-devs-en\tuto6.md (SKELETON)
============================================================
```md
---
title: "Orchestrating the Factory: System of Systems & Topological Sorting"
slug: "orchestrator-topological-sort-systems"
published: true
tags: "Algorithms, Distributed Systems, Python, Architecture, Graph Theory"
---

# Orchestrating the Factory: System of Systems & Topological Sorting

In the previous articles, we built a solver capable of simulating a single Surface Treatment Line. But in the real world, a factory is never just one isolated line.

*   **System A (Production):** Generates wastewater containing acid and nickel.
*   **System B (Physico-Chemical Station):** Receives the wastewater, neutralizes the acid, and precipitates the nickel.
*   **System C (Evaporator):** Receives the sludge from System B and concentrates it.

**Quantum Core** solves this by adopting a **"System of Systems"** architecture. We treat each production line as a black box (a "Microservice") and connect them via a **Project Bus**.
## 1. The Architecture: The Project Bus
**File:** `packages/database/prisma/schema.prisma`
  // The State (Snapshot of the last simulation)
  // Example: { "flow": 15000, "concentrations": { "Ni": 12.5 } }
  // Connectivity
}
```
