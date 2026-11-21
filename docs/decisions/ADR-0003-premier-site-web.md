# ADR-0003 — Premier socle du site web

- **Statut :** accepté provisoirement pour le MVP
- **Date :** 2026-11-21

## Contexte

Le dépôt contient les fondations produit et éditoriales, mais aucun code applicatif. Il faut matérialiser rapidement le parcours central de Namesia sans anticiper la base de données, le pipeline IA ou l'administration.

## Problème

Quel socle permet de livrer un site navigable, indexable et évolutif tout en limitant les dépendances et le coût de maintenance ?

## Options considérées

1. **Next.js avec App Router et TypeScript** : rendu serveur et génération statique adaptés aux pages de fiches ; coût d'apprentissage et dépendance au framework.
2. **Application React/Vite** : démarrage simple, mais nécessite de construire ou d'ajouter une stratégie de rendu serveur pour les pages publiques et le SEO.
3. **HTML/CSS/JavaScript statique** : coût initial minimal, mais risque de réécriture dès l'arrivée des routes et du catalogue dynamique.

## Décision

Retenir provisoirement Next.js App Router et TypeScript, sans bibliothèque UI, sans base de données et sans fournisseur IA dans ce premier incrément.

Le premier site comprend l'accueil, un catalogue avec recherche côté client, des routes de fiches prénoms et une page 404. Les données sont des fixtures de démonstration clairement signalées ; elles ne constituent pas un corpus éditorial publié.

## Conséquences et compromis

- Les routes publiques sont préparées pour le rendu serveur et les métadonnées.
- Le catalogue est volontairement petit et en mémoire ; ce n'est pas une solution de recherche à grande échelle.
- Les polices distantes sont un choix de présentation provisoire ; une stratégie d'hébergement local devra être étudiée avant mise en production.
- Aucune authentification, administration, persistance, analytics ou génération IA n'est incluse.
- Les versions de dépendances devront être réévaluées au moment de l'installation et du déploiement.

## Validation et réexamen

- Vérifier l'installation, le typage et le build de production.
- Tester les parcours accueil → recherche → fiche → retour catalogue, ainsi que les routes inconnues.
- Faire une revue responsive, clavier, contraste et métadonnées.
- Réexaminer ce choix avant l'ajout d'une administration, d'une recherche multi-critères ou d'un volume important de fiches.
