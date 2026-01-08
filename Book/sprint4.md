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
L'un des points délicats a été la synchronisation entre la sélection visuelle (ReactFlow) et l'état de l'application (Zustand). En interceptant les événements de changement de nœuds, nous avons assuré que le panneau de propriétés reste parfaitement aligné avec le curseur de l'utilisateur.

L'utilisation du stockage **JSONB** dans PostgreSQL a prouvé sa valeur ici : nous avons pu sauvegarder des structures de données radicalement différentes (une cuve et une pompe) dans la même table, sans aucune altération de schéma.

## 4. Rétrospective : La Puissance de l'Abstraction
À la fin de ce sprint, nous avons validé la théorie du "Meta-Model" :
*   Nous pouvons ajouter un paramètre "Viscosité" à une cuve en modifiant une seule ligne de JSON.
*   L'interface s'adapte instantanément.
*   La base de données accepte la donnée sans broncher.
*   Le développeur n'a pas touché au code "Core".
