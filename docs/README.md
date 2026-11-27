# Documentation de Namesia

- **Version :** 1.1
- **Mis à jour le :** 2026-11-27 11:05:11 (Europe/Paris)

Ce répertoire rassemble les références produit, les contrats techniques, les procédures et les décisions utiles au fonctionnement actuel de Namesia. Chaque document possède une responsabilité distincte ; la documentation courante n'est pas un journal des travaux passés.

## Lire la bonne source

| Besoin | Source de référence | Responsabilité |
|---|---|---|
| Contribuer et livrer | [AGENTS.md](../AGENTS.md) | Contrat opérationnel de travail et de livraison |
| Connaître l'état réel du produit | [État du projet](etat-du-projet.md) | Phase, capacités présentes, limites et arbitrages ouverts |
| Comprendre les limites d'autonomie | [Gouvernance](gouvernance.md) | Principes de décision et arbitrages humains |
| Comprendre la direction produit | [Vision produit](vision-produit.md) | Positionnement, promesse et périmètre visé |
| Connaître les comportements disponibles | [Fonctionnalités actuelles](fonctionnalites.md) | Inventaire des parcours et fonctions réellement présents |
| Comprendre l'architecture technique | [Architecture](architecture.md) | Couches, flux, responsabilités et frontières de sécurité |
| Vérifier le modèle et l'import | [Modèle de données](modele-donnees.md) et [schéma JSON](../schemas/fiche-prenom.schema.json) | Stockage relationnel et contrat d'échange |
| Produire et contrôler les fiches | [Pipeline](pipeline-generation-ia.md), [qualité éditoriale](qualite-editoriale.md) et [politique éditoriale](politique-editoriale.md) | Production, revue et règles de contenu |
| Exploiter et sécuriser le service | [Opérations](operations.md) | Exploitation, incidents, sauvegardes et sécurité |
| Maintenir le code | [Standards techniques](standards-techniques.md) | Conventions d'implémentation et maintenabilité |
| Concevoir l'interface | [Design](design.md), [composants](composants.md) et [vérification Material 3](material-3-verification.md) | Direction visuelle, contrats des composants et preuves |
| Préserver la portabilité | [Portabilité et réversibilité](portabilite-et-reversibilite.md) | Formats d'échange, dépendances et stratégie de sortie |
| Mesurer la découvrabilité | [Mesure et croissance](mesure-et-croissance.md) | SEO, mesure, expérimentation et limites de croissance |
| Retrouver une décision | [Registre des ADR](decisions/README.md) | Décisions structurantes encore utiles |

## Hiérarchie documentaire

- **AGENTS.md** fixe les règles de travail et de livraison.
- **État du projet** décrit ce qui existe réellement aujourd'hui ; il prévaut sur une vision ou une ancienne décision pour qualifier une fonction de disponible.
- **Vision produit** décrit la direction et les capacités envisagées, sans prétendre qu'elles sont implémentées.
- **Fonctionnalités actuelles** décrit les comportements présents ; **Architecture** décrit les mécanismes techniques qui les rendent possibles.
- **Les documents thématiques** portent chacun leur contrat. Ils ne recopient pas les détails déjà propriétaires d'un autre document.
- **Les ADR** consignent les décisions structurantes toujours utiles pour comprendre une règle en vigueur. Les décisions remplacées sans portée résiduelle ne sont pas conservées par défaut.

En cas de contradiction, identifier le propriétaire de la règle et vérifier l'état réel ; corriger les sources concernées dans une même PR.

## Instructions ChatGPT

Le dossier [instructions-chatgpt](instructions-chatgpt/README.md) contient le guide et les deux modes copiables en TXT.

## Entretien

Toute évolution qui change un comportement, un contrat, un état produit ou une décision met à jour sa source canonique dans la même PR. Mettre à jour les index et liens touchés. Supprimer les procédures terminées, les pistes abandonnées et les doublons ; l'historique Git suffit pour retrouver l'ancien contenu lorsqu'il n'a plus de valeur opérationnelle.
