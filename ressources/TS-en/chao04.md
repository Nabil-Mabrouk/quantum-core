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

---

### 4.1 L'Équipement de Procédé (`PROCESS_BATH`)

La cuve de traitement est la source de la chimie. Selon vos spécifications, elle doit gérer l'évaporation 24h/24 et la compensation par spray automatique.

```typescript
PROCESS_BATH: {
  id: "PROCESS_BATH",
  label: { fr: "Bain de Traitement", en: "Process Bath" },
  scope: "PROCESS",
  iconName: "Beaker",
  color: "purple-600",
  fields: [
    // --- GÉOMÉTRIE (Pour le calcul d'évaporation) ---
    { id: "length", label: "Longueur (mm)", type: "quantity", unit: "mm", unitFamily: "length", default: 1000 },
    { id: "width", label: "Largeur (mm)", type: "quantity", unit: "mm", unitFamily: "length", default: 800 },
    
    // --- PHYSIQUE & ENVIRONNEMENT ---
    { id: "temp", label: "Température Bain (°C)", type: "quantity", unit: "°C", unitFamily: "temperature", default: 60, isSummary: true },
    { id: "hasCover", label: "Couvercles fermés hors prod ?", type: "boolean", default: false },
    { id: "agitation", label: "Niveau d'Agitation", type: "select", options: [
        { value: "NONE", label: "Calme" },
        { value: "AIR", label: "Bullage Air (Augmente l'évap.)" },
        { value: "MECHANICAL", label: "Mécanique" }
    ], default: "NONE" },

    // --- LOGIQUE DE SPRAY & COMPENSATION ---
    { id: "hasSpray", label: "Équiper d'un Spray d'appoint ?", type: "boolean", default: false },
    { 
      id: "spraySourceId", 
      label: "Source du Spray (Pompe)", 
      type: "node-selector", 
      filter: ["SOURCE", "RINSE_TANK"], 
      description: "L'eau du spray compense l'évaporation et rince les pièces sortantes."
    },

    // --- GESTION DES VIDANGES (DAMPING) ---
    { id: "dumpingFreq", label: "Fréq. Vidange (par an)", type: "quantity", unit: "/an", default: 2 },
    { 
      id: "dumpingNetworkId", 
      label: "Réseau de Vidange", 
      type: "node-selector", 
      filter: ["DRAIN"], 
      category: "Rejets" 
    },

    // --- CHIMIE (La Recette) ---
    {
      id: "components",
      label: "Concentrations Cibles",
      type: "collection",
      schema: [
        { id: "chemId", label: "Ion / Produit", type: "library-selector", query: { category: ["ION", "REAGENT"] } },
        { id: "concentration", label: "Cible (g/L)", type: "quantity", unit: "g/L", default: 50 }
      ]
    }
  ]
}
```

---

### 4.2 L'Équipement de Rinçage (`RINSE_TANK`)

Pour les cuves de rinçage, nous devons respecter une règle stricte : **pas de surverse vers un bain de traitement**. Le transfert vers un bain ne peut se faire que par pompe (via le champ `spraySourceId` du bain).

```typescript
RINSE_TANK: {
  id: "RINSE_TANK",
  label: { fr: "Cuve de Rinçage", en: "Rinse Tank" },
  scope: "PROCESS",
  iconName: "Droplets",
  color: "blue-500",
  fields: [
    { id: "workingVol", label: "Volume Utile (L)", type: "quantity", unit: "L", default: 500, isSummary: true },
    
    // --- HYDRAULIQUE (CASCADES) ---
    { 
      id: "waterSourceId", 
      label: "Alimentation Eau", 
      type: "node-selector", 
      filter: ["SOURCE", "RINSE_TANK"], 
      category: "Entrées" 
    },
    { 
      id: "overflowTargetId", 
      label: "Surverse (Gravité) vers", 
      type: "node-selector", 
      // 🚩 REGLE : On exclut PROCESS_BATH car la surverse vers un bain est interdite
      filter: ["DRAIN", "RINSE_TANK", "STORAGE_TANK"], 
      category: "Sorties" 
    },

    // --- VIDANGES PÉRIODIQUES ---
    { id: "dumpingFreq", label: "Fréq. Vidange", type: "quantity", unit: "/an", default: 6 },
    { id: "dumpingNetworkId", label: "Réseau de Vidange", type: "node-selector", filter: ["DRAIN"], category: "Rejets" }
  ]
}
```

---

### 4.3 Logique Temporelle Globale (Working Hours)

Comme l'évaporation est calculée sur **24h/24** (chauffage constant) mais que l'appoint d'eau ne se fait que durant les **heures de travail**, nous définissons ces constantes dans le manifeste pour qu'elles soient accessibles au solveur.

```typescript
// Ces champs apparaîtront dans les réglages du projet
projectSettings: [
  { id: "hoursPerDay", label: "Heures de production / jour", type: "number", default: 8 },
  { id: "daysPerWeek", label: "Jours de production / semaine", type: "number", default: 5 },
  { id: "workshopTemp", label: "Température Atelier (°C)", type: "number", default: 20 },
  { id: "workshopHumidity", label: "Humidité relative (%)", type: "number", default: 60 }
]
```

---

### 4.4 Les Séquences (Le Transporter)

Le calcul de l'entraînement (Drag-out) dépend de la somme de toutes les séquences. Chaque séquence définit les caractéristiques d'une famille de pièces.

```typescript
sequences: {
  properties: [
    { id: "cadence", label: "Cadence (montages/h)", type: "number", default: 10 },
    { id: "surfacePerPart", label: "Surface par montage (m²)", type: "number", default: 2.5 },
    { id: "dragOutSpecific", label: "Entraînement spécifique (L/m²)", type: "number", default: 0.1 }
  ]
}
```

---

### Résumé des concepts appliqués dans ce Manifeste :

1.  **Liaison Physique vs Logique :** On utilise `node-selector` pour les sprays (pompes) et les cascades (surverses).
2.  **Validation Métier :** Le filtre sur `overflowTargetId` empêche l'utilisateur de connecter une surverse de rinçage vers un bain actif, ce qui est une erreur de conception majeure.
3.  **Automatisation du Spray :** Le champ `hasSpray` permettra au solveur Python de forcer le débit entrant égal à l'évaporation calculée.
4.  **Préparation du Bilan de Masse :** En séparant `dumpingNetworkId` (batch) et `overflowTargetId` (continu), nous préparons un rapport détaillé pour la station d'épuration.

**Next Chapter:** *Nous passons maintenant au **Chapitre 5 : Le Solveur Python**. Nous allons coder la logique qui somme les séquences, calcule l'évaporation selon l'humidité et résout les bilans ioniques.*