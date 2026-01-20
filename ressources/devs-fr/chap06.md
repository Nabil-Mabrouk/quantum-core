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

La bonne nouvelle est : **Vous n'avez généralement pas besoin d'écrire de code React.**

Le système inclut un composant générique appelé `SmartNode` (`components/canvas/smart-node.tsx`). Il effectue automatiquement les actions suivantes :
1. Lit le `iconName` de votre Manifest.
2. Applique la `color` définie.
3. Affiche le `label` et la `description`.
4. Rend les badges de statut basés sur les résultats de simulation.
5. Montre les "barres de santé" pour la pollution ou la capacité.

À moins que vous n'ayez besoin d'une visualisation très spécifique (comme une turbine animée ou un graphique complexe à l'intérieur du nœud), vous devriez mapper vos types à `SmartNode`.

### 2.2 Le registre des composants

Ouvrez `apps/studio/lib/component-registry.tsx`. Ce fichier est le "tableau de bord" qui connecte votre ID de domaine aux implémentations React.

Pour ajouter les visuels de votre nouveau domaine **ENERGY**, étendez l'objet `REGISTRY` :

```typescript
// apps/studio/lib/component-registry.tsx

import { SmartNode } from '@/components/canvas/smart-node';
import { EndpointNode } from '@/components/domains/surface_treatment/endpoint-node';
// Importez votre rapport personnalisé si vous en avez un
// import { EnergyReport } from '@/components/domains/energy/energy-report';

const REGISTRY: Record<string, ComponentMap> = {
  // Domaine existant...
  SURFACE_TREATMENT: { ... },

  // VOTRE NOUVEAU DOMAINE
  ENERGY: {
    nodes: {
      // Mappez vos types logiques aux composants React
      BOILER: SmartNode,
      TURBINE: SmartNode,
      
      // Vous pouvez réutiliser des composants spécifiques d'autres domaines s'ils conviennent
      GRID_POINT: EndpointNode, 
    },
    forms: {}, // Laissez vide pour utiliser le panneau de propriétés auto-généré
    widgets: {},
    panels: {
      // Panneau standard lors d'un clic sur un espace vide
      EMPTY_SELECTION: undefined 
    },
    reports: {
      // Le composant rendu dans la vue "Résumé"
      // SUMMARY: EnergyReport 
    }
  }
};
```

### 2.3 Création d'un nœud personnalisé (Avancé)

Parfois, `SmartNode` ne suffit pas. Vous pourriez vouloir un nœud qui change de forme en fonction de la pression, ou qui s'anime lorsqu'il est actif.

**Étape 1 : Créer le composant**
Créez `apps/studio/components/domains/energy/turbine-node.tsx`.

```typescript
'use client';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Fan } from 'lucide-react';

export function TurbineNode({ data, selected }: NodeProps) {
  // Accéder aux résultats de simulation via data.properties
  const speed = data.properties?.simulationResults?.rpm || 0;
  const isSpinning = speed > 0;

  return (
    <div className={`p-4 rounded-full border-4 ${selected ? 'border-blue-500' : 'border-slate-200'} bg-white shadow-xl`}>
      {/* Visuel personnalisé : Un ventilateur en animation */}
      <div className={isSpinning ? "animate-spin" : ""}>
        <Fan className="w-12 h-12 text-slate-700" />
      </div>
      
      <div className="text-center mt-2">
        <p className="font-bold text-xs">{data.label}</p>
        <p className="font-mono text-[10px] text-blue-600">{speed} RPM</p>
      </div>

      {/* Requis : Poignées d'entrée/sortie */}
      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-4 h-4 bg-red-500" />
    </div>
  );
}
```

**Étape 2 : L'enregistrer**
Mettez à jour `component-registry.tsx` :

```typescript
import { TurbineNode } from '@/components/domains/energy/turbine-node';

// ... à l'intérieur de REGISTRY.ENERGY.nodes
TURBINE: TurbineNode,
```

### 2.4 Personnalisation du panneau de propriétés

Par défaut, `PropertiesPanel` génère des entrées basées sur le tableau `fields` de votre Manifest. Cependant, vous pourriez vouloir injecter des widgets personnalisés, comme un graphique en temps réel ou un connecteur à une API externe (par exemple, pour récupérer les prix de l'électricité).

**Le modèle de widget :**
Vous pouvez injecter un composant en haut du panneau de propriétés pour des types de nœuds spécifiques.

1.  **Créer le widget :** `components/domains/energy/pricing-widget.tsx`
2.  **L'enregistrer :**
    ```typescript
    widgets: {
      GRID_POINT: PricingWidget
    }
    ```

### 2.5 Création du rapport de domaine

La vue "Résumé" (`/project/[id]?view=summary`) est une toile vierge. Vous devez fournir un composant React qui prend les résultats de la simulation et génère un rapport prêt à être exporté en PDF.

**Étape 1 : Créer le composant de rapport**
Emplacement : `components/domains/energy/energy-report.tsx`

```typescript
'use client';
import { useCanvasStore } from "@/store/canvas-store";

export function EnergyReport() {
  const summaryData = useCanvasStore(state => state.summaryData);

  if (!summaryData) return <div>No simulation run yet.</div>;

  return (
    <div className="p-10 bg-white">
      <h1 className="text-3xl font-bold mb-6">Energy Audit Report</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-xl">
            <h3>Total Consumption</h3>
            <p className="text-4xl font-mono text-blue-600">
                {summaryData.global_kwh} <span className="text-sm">kWh</span>
            </p>
        </div>
        {/* Add charts, tables, etc. */}
      </div>
    </div>
  );
}
```

**Étape 2 : Enregistrer le rapport**
```typescript
reports: {
  SUMMARY: EnergyReport
}
```

### 2.6 Vérification

1.  Naviguez jusqu'à votre projet **Energy** dans le Studio.
2.  Faites glisser une **Chaudière** (SmartNode) et une **Turbine** (Nœud personnalisé) sur le canevas.
3.  Vérifiez que la Chaudière ressemble à une carte standard avec vos champs spécifiques (Puissance, Carburant).
4.  Vérifiez que la Turbine ressemble à votre composant circulaire personnalisé.
5.  Cliquez sur la vue "Résumé" (si vous avez enregistré le rapport) pour vérifier la mise en page.
