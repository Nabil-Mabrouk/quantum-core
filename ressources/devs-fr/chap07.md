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

Le moteur utilise une structure basée sur des paquets pour les domaines.

1. Naviguez vers `apps/engine/domains/`.
2. Créez un nouveau dossier correspondant à l'ID de votre domaine (en minuscules) : `energy/`.
3. Créez deux fichiers à l'intérieur :
    * `__init__.py` : (Peut être vide)
    * `solver.py` : C'est ici que réside votre code.

### 3.2 Le Contrat du Solveur

Un solveur dans Quantum Core est un **Générateur Asynchrone**. Cela lui permet de diffuser des journaux de progression vers l'interface utilisateur en temps réel avant d'envoyer le résultat final.

**La Signature :**
```python
async def run_energy_simulation_stream(nodes, edges, sequences, library, project_settings):
    """
    Args:
        nodes (list): Liste de dictionnaires représentant les équipements.
        edges (list): Liste de dictionnaires représentant les connexions (tuyaux/câbles).
        sequences (list): Séquences de production (le cas échéant).
        library (dict): La base de connaissances statique (carburants, matériaux).
        project_settings (dict): Constantes globales (heures/an, devise).
    
    Yields:
        str: Chaînes JSON (Journaux ou Résultat Final).
    """
```

### 3.3 Implémentation de la logique

Implémentons un solveur simplifié pour notre exemple Chaudière/Turbine. Nous voulons calculer l'énergie totale produite et le carburant consommé.

**Fichier :** `apps/engine/domains/energy/solver.py`

```python
import json
import asyncio
import logging

logger = logging.getLogger("energy_solver")

async def run_energy_simulation_stream(nodes, edges, sequences, library, project_settings):
    # 1. NOTIFIER L'INTERFACE UTILISATEUR : Calcul démarré
    yield json.dumps({"type": "log", "message": "Initialisation du modèle énergétique...", "progress": 10})
    await asyncio.sleep(0.1) # Simuler le travail du CPU

    # 2. PRÉPARER LES STRUCTURES DE DONNÉES
    results = {
        "node_details": {}, # Résultats par nœud (à mapper aux SmartNodes)
        "kpis": [],         # Chiffres du tableau de bord global
        "warnings": []
    }
    
    total_power_produced = 0.0
    total_fuel_consumed = 0.0

    # 3. LA BOUCLE PHYSIQUE (Simplifiée)
    # Dans un scénario réel, vous construiriez ici une Matrice (Ax=B) en utilisant NumPy.
    
    yield json.dumps({"type": "log", "message": "Résolution des bilans massiques et énergétiques...", "progress": 50})

    for node in nodes:
        props = node.get('properties', {})
        node_res = {"warnings": []}
        
        # LOGIQUE POUR LES CHAUDIÈRES
        if node['type'] == 'BOILER':
            # Entrées des champs de l'interface utilisateur
            power_out = float(props.get('power', 0)) # MW
            efficiency = float(props.get('efficiency', 0.9)) # 90% par défaut
            
            # Physique : Carburant Entrant = Puissance Sortante / Efficacité
            fuel_in = power_out / efficiency if efficiency > 0 else 0
            
            # Stocker les résultats
            node_res['fuel_consumption'] = round(fuel_in, 2)
            node_res['steam_output'] = power_out
            
            total_fuel_consumed += fuel_in
            
        # LOGIQUE POUR LES TURBINES
        elif node['type'] == 'TURBINE':
            capacity = float(props.get('capacity', 0))
            # Logique simulée : la sortie dépend de la connexion en amont
            # (En réalité, parcourir les 'edges' pour trouver la chaudière connectée)
            actual_production = capacity * 0.85 
            
            node_res['rpm'] = 3000 # Statique pour la démo
            node_res['production'] = actual_production
            
            total_power_produced += actual_production

        # Mapper les résultats à l'ID du nœud
        results["node_details"][node['id']] = node_res

    # 4. FINALISER LES KPI GLOBAUX
    yield json.dumps({"type": "log", "message": "Formatage des résultats...", "progress": 90})
    
    results["kpis"] = [
        {"label": "Puissance Totale", "value": str(total_power_produced), "unit": "MW", "color": "text-blue-600"},
        {"label": "Consommation de Carburant", "value": str(total_fuel_consumed), "unit": "MW", "color": "text-orange-600"},
        {"label": "Efficacité du Système", "value": f"{(total_power_produced/total_fuel_consumed*100):.1f}", "unit": "%", "color": "text-emerald-600"}
    ]

    # 5. ENVOYER LA CHARGE UTILE FINALE
    # Le type 'result' indique à l'interface utilisateur de mettre à jour le magasin
    yield json.dumps({"type": "result", "data": results})
```

### 3.4 Enregistrement du Solveur

Vous devez maintenant informer le point d'entrée principal de l'API de votre nouvelle fonction.

**Fichier :** `apps/engine/main.py`

1.  **Importez votre solveur :**
    ```python
    from domains.energy.solver import run_energy_simulation_stream
    ```

2.  **Mettez à jour le routeur :**
    Recherchez le point de terminaison `/simulate-stream`. Ajoutez une condition pour l'ID de votre domaine.

    ```python
    @app.post("/simulate-stream", dependencies=[Depends(verify_secret)])
    async def simulate_stream(payload: SimulationPayload, request: Request):
        
        # ... logique existante ...

        if payload.domain == "ENERGY":
            try:
                return StreamingResponse(
                    run_energy_simulation_stream(
                        nodes_dict,
                        edges_dict,
                        sequences_dict,
                        payload.library,
                        payload.project_settings
                    ),
                    media_type="application/x-ndjson"
                )
            except Exception as e:
                # Gestion des erreurs...
    ```

### 3.5 Mappage des résultats à l'interface utilisateur

La connexion entre Python et React repose sur la clé du dictionnaire `node_details`.

**En Python (`solver.py`) :**
```python
results["node_details"]["node-123"] = { "rpm": 3000 }
```

**En React (`SmartNode.tsx` ou `TurbineNode.tsx`) :**
L'interface utilisateur injecte automatiquement ce dictionnaire dans `data.properties.simulationResults`.

```typescript
// Inside your custom component
const rpm = data.properties.simulationResults?.rpm; // 3000
```

### 3.6 Bonnes pratiques : Utilisation de NumPy

Pour les domaines complexes impliquant des réseaux (tuyaux, câbles), itérer à travers une liste ne suffit pas. Vous devez résoudre des équations simultanées.

**Le modèle matriciel :**
1.  **Mapper les ID aux indices :** `node_map = { node['id']: i for i, node in enumerate(nodes) }`
2.  **Construire la matrice d'adjacence :** Créer une matrice $N 	imes N$ représentant les connexions.
3.  **Construire la matrice système ($A$) :** Remplir les éléments diagonaux avec les capacités de flux ou les résistances.
4.  **Résoudre :** `x = np.linalg.solve(A, b)`

*Référez-vous à `apps/engine/domains/surface_treatment/solver.py` pour une implémentation complète du modèle matriciel.*

```
