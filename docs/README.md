# Documentation de Namesia

- **Version :** 1.0
- **Mis à jour le :** 2026-11-27 10:38:00 (Europe/Paris)

Ce répertoire rassemble la documentation produit, les contrats techniques, les procédures et les décisions de Namesia. Le dépôt Git est la mémoire durable du projet ; les documents ci-dessous ont des responsabilités distinctes et ne doivent pas devenir des copies les uns des autres.

## Lire la bonne source

| Besoin | Source de référence | Responsabilité |
|---|---|---|
| Savoir comment contribuer et livrer | [AGENTS.md](../AGENTS.md) | Contrat opérationnel applicable à chaque travail |
| Connaître l'état réel du produit | [État du projet](etat-du-projet.md) | Phase, capacités présentes, limites et arbitrages ouverts |
| Comprendre les limites d'autonomie | [Gouvernance](gouvernance.md) | Principes, niveaux de décision et arbitrages humains |
| Comprendre la direction produit | [Vision produit](vision-produit.md) | Positionnement, promesse, périmètre et expérience visée |
| Comprendre l'architecture applicative | [Architecture](architecture.md) | Structure et responsabilités techniques de l'application |
| Vérifier le modèle et l'import des données | [Modèle de données](modele-donnees.md) et [schéma JSON](../schemas/fiche-prenom.schema.json) | Stockage relationnel et contrat d'échange |
| Produire et contrôler les fiches | [Qualité éditoriale](qualite-editoriale.md), [politique éditoriale](politique-editoriale.md) et [pipeline de génération](pipeline-generation-ia.md) | Fiabilité, règles de rédaction, génération et import |
| Exploiter et sécuriser le service | [Opérations](operations.md) | Sécurité, exploitation, incidents et assurance qualité |
| Développer et maintenir le code | [Standards techniques](standards-techniques.md) | Conventions d'implémentation et maintenabilité |
| Concevoir l'interface | [Système de design](design.md), [composants](composants.md) et [vérification Material 3](material-3-verification.md) | Direction visuelle, composants et preuves de fidélité |
| Préserver la portabilité | [Portabilité et réversibilité](portabilite-et-reversibilite.md) | Formats d'échange, dépendances et stratégie de sortie |
| Mesurer la découvrabilité et la croissance | [Mesure et croissance](mesure-et-croissance.md) | SEO, mesure, expérimentation et limites de croissance |

## Hiérarchie documentaire

- **AGENTS.md** fixe les règles de travail et de livraison. Les procédures spécialisées le complètent sans le recopier.
- **docs/etat-du-projet.md** est la référence pour l'état courant. Une ancienne décision ou une description d'architecture ne doit pas être utilisée pour déduire qu'une fonction est actuellement disponible.
- **Les documents thématiques** portent chacun un contrat ou un domaine précis. Lorsqu'un sujet relève d'un document spécialisé, celui-ci est la référence détaillée de ce sujet.
- **Les ADR** conservent le contexte et les raisons des décisions. Une ADR remplacée reste un historique ; elle ne décrit plus la règle courante sur le périmètre remplacé.
- **Les instructions ChatGPT** sont des résumés opérationnels à copier manuellement. Elles renvoient vers les sources canoniques et ne les remplacent pas.

En cas de contradiction, ne pas choisir silencieusement le texte le plus récent ou le plus détaillé : identifier le propriétaire de la règle, vérifier l'état réel et corriger les documents concernés dans une même demande de fusion.

## Registre des décisions

Consulter le [registre des ADR](decisions/README.md) pour retrouver les décisions acceptées, partielles ou remplacées. Les décisions historiques sont conservées afin de rendre les changements de cap compréhensibles.

## Instructions du projet ChatGPT

Le dossier [instructions-chatgpt](instructions-chatgpt/README.md) contient le guide d'utilisation et les deux modes copiables :
- [Mode autonome](instructions-chatgpt/mode-autonome.txt)
- [Mode discussion](instructions-chatgpt/mode-discussion.txt)

## Entretien de la documentation

Toute évolution qui change une règle, un comportement, un contrat, un état produit ou une décision doit mettre à jour la source canonique concernée dans la même demande de fusion. Mettre également à jour les index et les liens touchés. Éviter les journaux de tâches dans la documentation courante : l'historique Git, les PR et les ADR assurent la traçabilité.
