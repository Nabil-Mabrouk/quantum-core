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
C'est dans le moteur Python que l'innovation est la plus flagrante. Nous avons implémenté la **Loi des Nœuds**. 
Pour chaque équipement, le solveur calcule désormais la différence entre les flux entrants et sortants. 
*   **Résultat > 0** : Risque de débordement.
*   **Résultat < 0** : Risque de désamorçage ou vidange.

Le logiciel passe du rôle d'outil de saisie à celui de **Conseiller Technique**. Il ne se contente plus de stocker ce que dit l'utilisateur, il le confronte à la réalité physique.

## 4. Rétrospective : La Gestion des Sélections Hybrides
Le défi UI de ce sprint a été de gérer une sélection "double" dans le panneau de propriétés. L'utilisateur doit pouvoir passer d'une cuve à un tuyau sans que l'interface ne s'interrompe. Nous avons résolu cela en implémentant un état de sélection mutuellement exclusif dans le Store Zustand, garantissant une expérience utilisateur fluide et sans ambiguïté.

---

# Sprint 7 : Le Catalogue et le "Sizing" (Dimensionnement)

**Objectif :** Ne plus saisir des valeurs au hasard, mais choisir du matériel réel. 
Un ingénieur ne dit pas "je veux une pompe de 10 $m^3/h$", il choisit une pompe dans un catalogue et vérifie si elle convient.

### 1. La Base de Données "Catalogue"
Nous allons utiliser la table `CatalogItem` de notre schéma Prisma pour stocker des équipements réels (ex: Pompe Grundfos, Filtre industriel).

### 2. UI : Le Sélecteur de Composant
Dans le panneau de propriétés, nous allons ajouter un bouton "Choisir dans le catalogue". 
Cela ouvrira une liste d'équipements compatibles avec le type de nœud sélectionné (ex: si je clique sur une Pompe, je ne vois que des pompes).

### 3. Intelligence : Le "Auto-Fill" et la Validation
*   Quand l'utilisateur choisit une pompe de 12 $m^3/h$ dans le catalogue, le champ `flowRate` du nœud se remplit tout seul.
*   Le moteur Python pourra alors comparer la performance de l'équipement choisi avec le besoin réel du système.

### Pourquoi c'est l'étape cruciale pour le business ?
C'est ici que Quantum Core commence à générer de la valeur commerciale (établi le prix). Si chaque objet du catalogue a un prix, nous pouvons calculer instantanément le **coût total de l'installation (CAPEX)**.

**Es-tu prêt à intégrer le catalogue d'équipements ?**