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

Dans le code source (`apps/studio/lib`), la logique de l'application est générique. Elle sait comment dessiner des boîtes, connecter des fils et sauvegarder des données. Elle ne connaît *pas* la physique ou les machines spécifiques.

Pour créer une verticale personnalisée (par exemple, "Chauffage Urbain", "Agroalimentaire", "Pétrole et Gaz"), vous devez créer un **Manifeste de Domaine**. Il s'agit d'un objet TypeScript qui agit comme un fichier de configuration pour l'ensemble du système d'exploitation.

**Emplacement :** `apps/studio/lib/domains/`

### 1.2 Anatomie d'un Manifeste

Un Manifeste est un objet TypeScript strictement typé par `DomainManifest`. Créons un domaine hypothétique **Énergie** pour illustrer.

Créez un fichier : `apps/studio/lib/domains/energy.ts`

```typescript
import { DomainManifest } from '../domain-config';

export const ENERGY_CONFIG: DomainManifest = {
  id: "ENERGY", // ID système unique
  name: { fr: "Énergie & Thermique", en: "Power & Thermal" }, // Libellés UI
  
  // 1. BIBLIOTHÈQUES : Quelles ressources peuvent être utilisées ?
  libraries: [
    { 
      id: 'fuels', 
      label: { fr: "Combustibles", en: "Fuels" }, 
      iconName: 'Flame', 
      type: 'SIMPLE', 
      categories: ['GAS', 'BIOMASS', 'OIL'] 
    }
  ],

  // 2. TYPES DE NŒUDS : Quelles machines existent ?
  nodeTypes: {
    BOILER: {
      id: "BOILER",
      label: { fr: "Chaudière", en: "Boiler" },
      scope: "PROCESS", // Cela fait partie de la ligne principale
      iconName: "Thermometer",
      color: "red-500",
      fields: [ /* Voir Section 1.3 */ ]
    },
    TURBINE: {
      id: "TURBINE",
      label: { fr: "Turbine Vapeur", en: "Steam Turbine" },
      scope: "PROCESS",
      iconName: "Fan",
      color: "slate-600",
      fields: []
    }
  },

  // 3. TYPES D'ARÊTES : Comment se connectent-elles ?
  edgeTypes: {
    STEAM_PIPE: {
      id: "STEAM_PIPE",
      label: { fr: "Vapeur HP", en: "HP Steam" },
      color: "orange-500",
      fields: []
    }
  }
};
```

### 1.3 Définition des Actifs (Nœuds) et des Champs

La puissance du système réside dans le tableau `fields`. Celui-ci indique à l'interface utilisateur (`PropertiesPanel`) les entrées à afficher et au Moteur les données à attendre.

Nous prenons en charge plusieurs **Types Primitifs** :

#### A. Quantités Physiques (`quantity`)
Utilisé pour les nombres qui représentent une réalité physique. L'interface utilisateur ajoute automatiquement les étiquettes d'unité.
```typescript
{
  id: "power",
  label: { fr: "Puissance Thermique", en: "Thermal Power" },
  type: "quantity",
  unit: "MW",
  unitFamily: "power",
  default: 10
}
```

#### B. Sélecteurs (`select`)
Options codées en dur pour les modes de configuration.
```typescript
{
  id: "technology",
  label: "Technologie",
  type: "select",
  options: [
    { value: "CONDENSING", label: "Condensation" },
    { value: "BACK_PRESSURE", label: "Contre-Pression" }
  ],
  default: "CONDENSING"
}
```

#### C. Connexions Sans Fil (`node-selector`)
C'est un concept critique. Au lieu de dessiner des fils désordonnés à travers l'écran pour les utilitaires (comme l'envoi d'électricité à un réseau), vous pouvez sélectionner un nœud cible dans une liste déroulante.
```typescript
{
  id: "gridConnectionId",
  label: { fr: "Raccordement Réseau", en: "Grid Connection" },
  type: "node-selector",
  filter: ["GRID_POINT"], // N'afficher que les nœuds de type 'GRID_POINT'
  category: "Utilities"
}
```

#### D. Collections Imbriquées (`collection`)
Pour des recettes complexes ou des composants internes (par exemple, une chaudière a plusieurs brûleurs).
```typescript
{
  id: "burners",
  label: "Brûleurs",
  type: "collection",
  schema: [
    { id: "capacity", label: "Capacité", type: "number", unit: "kW" },
    { id: "efficiency", label: "Rendement", type: "number", unit: "%" }
  ]
}
```

### 1.4 Portées : Processus vs. Utilitaire

Lors de la définition d'un Nœud, vous devez lui attribuer une `portée`. Cela contrôle le fonctionnement de l'algorithme de **Disposition Automatique** et de la **Visibilité des Calques**.

1.  **`PROCESSUS`** : La séquence principale des opérations.
    *   *Comportement :* Ces nœuds sont agencés linéairement de gauche à droite dans la vue Synoptique.
    *   *Exemples :* Chaudière, Turbine, Réservoir de réaction.
2.  **`UTILITAIRE`** : Infrastructure de support.
    *   *Comportement :* Ces nœuds sont placés en haut (Sources) ou en bas (Puits) du canevas pour éviter d'encombrer le flux principal.
    *   *Exemples :* Source d'eau, Réseau électrique, Drain.
3.  **`INFRASTRUCTURE`** : Actifs statiques.
    *   *Exemples :* Réservoirs de stockage, Bâtiments.

### 1.5 Enregistrement : Activation du Domaine

Une fois que votre fichier `energy.ts` est prêt, vous devez indiquer au Studio de le charger.

**Fichier :** `apps/studio/lib/registry.ts`

```typescript
import { SURFACE_TREATMENT_CONFIG } from './domains/surface-treatment';
import { ENERGY_CONFIG } from './domains/energy'; // <--- Importez votre fichier

const DOMAIN_REGISTRY: Record<string, any> = {
  SURFACE_TREATMENT: SURFACE_TREATMENT_CONFIG,
  ENERGY: ENERGY_CONFIG // <--- Enregistrez-le ici
};
```

### 1.6 Vérification

1.  Redémarrez le serveur Next.js (`pnpm dev`).
2.  Allez au Tableau de bord.
3.  Cliquez sur **"Nouveau Projet"**.
4.  Dans la modale, vous devriez maintenant voir **"Énergie et Thermique"** (ou le nom de votre domaine) comme option sélectionnable.
5.  Créez un projet. La palette de nœuds à gauche affichera maintenant "Chaudière" et "Turbine" au lieu de l'équipement de traitement de l'eau.
