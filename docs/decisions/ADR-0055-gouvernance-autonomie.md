# ADR-0055 — Gouvernance et autonomie de Namesia

- **Statut :** accepté
- **Version :** 1.0
- **Décision prise le :** 2026-11-26 (heure non consignée)
- **Mis à jour le :** 2026-11-26 20:41:00 (Europe/Paris)
- **Décideur :** propriétaire de Namesia

## Contexte

Namesia est un projet personnel dont le propriétaire délègue à l’agent IA le rôle de tech lead opérationnel. Une conversation ne peut pas servir de mémoire durable et une validation technique systématique ralentirait inutilement le projet. À l’inverse, l’autonomie ne doit pas engager silencieusement l’identité, les promesses, les droits des visiteurs ou les finances de Namesia.

## Options examinées

1. Validation préalable de chaque changement : trop lente et confond les choix techniques avec les engagements produit.
2. Autonomie sans distinction ni traçabilité : risque de décisions irréversibles ou d’engagements non voulus.
3. Autonomie graduée selon les conséquences, avec information, traçabilité et arbitrage préalable pour les engagements du propriétaire : équilibre retenu.

## Décision

L’option 3 est retenue. Le niveau d’autonomie dépend des conséquences concrètes, de la gravité de l’impact, de la réversibilité et de la phase réelle du produit, pas de la difficulté technique.

L’agent décide et agit sur les choix techniques, l’architecture, les dépendances, les migrations, la sécurité, la CI/CD, le design, l’accessibilité, la performance, l’éditorial et l’exploitation. Les changements structurants sont tracés dans les ADR, les PR et les documents canoniques.

Le propriétaire conserve les arbitrages qui modifient le positionnement, les promesses fondamentales, le modèle économique effectivement adopté, la publicité, les partenariats engageants, les dépenses nouvelles, les fonctionnalités payantes, les collectes sensibles et les engagements envers des tiers. L’étude et la recommandation de ces sujets restent autonomes.

Une donnée personnelle ordinaire strictement utile à une fonction facultative et privée peut être traitée avec minimisation, protection, information, conservation cohérente et moyens de suppression. Les données sensibles, inférences sensibles, profilages substantiels et partages non évidents nécessitent un arbitrage préalable.

Lorsqu’un arbitrage humain est requis, l’agent ouvre une issue intitulée [Action Humaine] …, suspend uniquement le travail dépendant et poursuit les tâches indépendantes. Une solution provisoire réversible peut être utilisée si elle ne préjuge pas de la décision.

La phase actuelle est PRÉ-LANCEMENT / DÉVELOPPEMENT. Une transition vers LANCEMENT ou POST-LANCEMENT est explicitement confirmée et datée par le propriétaire ; l’agent ne change jamais silencieusement la phase.

Le dépôt Git est la mémoire durable. AGENTS.md porte le contrat opérationnel ; les documents thématiques décrivent les règles applicables ; docs/etat-du-projet.md décrit l’état courant ; les instructions ChatGPT résument ces sources et restent sous 8 000 caractères chacune.

## Conséquences

- L’agent prend les initiatives et décisions techniques nécessaires sans demander une permission à chaque étape.
- Les décisions produit, économiques et personnelles qui engagent le propriétaire sont soumises à arbitrage.
- Les PR sont séquentielles, la CI est attendue jusqu’à la fin des contrôles requis, et aucune réussite n’est annoncée sans preuve.
- Les règles détaillées et exemples sont maintenus dans gouvernance.md et AGENTS.md.

## Réexamen

Réexaminer cet ADR si la phase du produit, la nature des données, les responsabilités du propriétaire ou les engagements envers les visiteurs changent.
