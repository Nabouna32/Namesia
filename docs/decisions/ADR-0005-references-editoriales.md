# ADR-0005 — Références éditoriales légères par rubrique

- **Statut :** accepté
- **Date :** 2026-11-22

## Contexte

Les six fiches initiales comportent des affirmations étymologiques et historiques sans références visibles. Le modèle documentaire historique (sources, claims et liens de preuve) a été supprimé parce que Namesia ne dispose pas d'un véritable workflow de vérification. Le besoin utilisateur reste toutefois réel : permettre de retrouver les ressources réellement consultées et de comprendre quelles rubriques elles éclairent.

## Options examinées

1. Réintroduire un graphe de claims, de preuves et de statuts : rejeté, car il promettrait un processus de vérification qui n'existe pas et ajouterait une charge éditoriale disproportionnée.
2. Conserver uniquement des URL dans le texte : rejeté, car les liens ne seraient ni structurés, ni rattachés proprement à une rubrique, ni faciles à afficher.
3. Ajouter une table relationnelle simple liée à chaque version et à une rubrique : retenu.

## Décision

Le contrat JSON 3.0.0 accepte une liste facultative de références comprenant la rubrique (origine, histoire, usages), le titre, l'éditeur ou organisme, l'URL et la date de consultation. À l'import, chaque référence est stockée dans name_profile_references, avec sa position, et liée à la version de fiche. Les références sont visibles sur les fiches publiées et dans la prévisualisation d'administration.

Une référence signifie uniquement qu'une ressource a été consultée. Elle ne prouve pas automatiquement chaque phrase, ne certifie pas l'étymologie et ne produit aucun statut « vérifié ». Les sources insuffisantes ou contradictoires doivent conduire à une formulation prudente ou à l'absence d'une affirmation.

## Conséquences

- Le stockage reste relationnel ; aucun document JSON complet n'est ajouté en base.
- Les références suivent l'historique des versions et la publication explicite.
- Les anciennes fiches sans références restent valides et affichent simplement aucune référence.
- Les six fiches initiales sont reprises avec des références réellement ouvertes et des formulations plus prudentes.
- Il n'existe toujours pas de workflow de claims, de validation scientifique ou de collecte documentaire automatisée.

## Réexamen

Réévaluer ce choix uniquement si Namesia met en place un processus réel de vérification indépendante nécessitant le rattachement de sources à des affirmations atomiques.
