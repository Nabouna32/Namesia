# ADR-0027 — Génération et vérification stricte des rôles Material 3 Fidelity

- **Statut :** acceptée
- **Date :** 2026-11-24

## Contexte

Le contrat M3 existant présentait deux écarts. Des extensions Namesia (statuts, catégories Rainbow et dégradé de marque) utilisaient le préfixe réservé aux rôles système `--md-sys-color-*`. Le fournisseur ignorait silencieusement les propriétés absentes de `DynamicScheme`. Enfin, les couleurs initiales SSR étaient maintenues séparément dans CSS : elles pouvaient diverger du thème Fidelity calculé après hydratation.

## Challenge

- **Garder les valeurs SSR statiques :** elles évitent un calcul initial mais constituent une seconde palette manuelle, sujette aux dérives et au flash de couleur.
- **Laisser les rôles absents être ignorés :** le site peut continuer avec une palette incomplète sans signaler la rupture du contrat.
- **Conserver les extensions dans le namespace M3 :** cela fait passer des choix Namesia pour des rôles officiels.
- **Demander la spécification 2025 pour toutes les variantes :** le code source de la bibliothèque applique une version de spécification antérieure aux variantes qui ne sont pas prises en charge par 2025 ; laisser ce repli implicite masque le choix réel.

## Décision

- Centraliser le calcul clair/sombre dans `lib/material-theme.ts`, partagé par le rendu serveur et le fournisseur client.
- Injecter les tokens générés dans le `<head>` dès le rendu initial ; réappliquer les mêmes objets de tokens lorsque la préférence système change.
- Fixer explicitement `specVersion: "2021"` pour Fidelity et Rainbow.
- Limiter `--md-sys-color-*` à une liste fermée de rôles système M3, vérifiée par la CI.
- Préfixer les extensions Namesia par `--namesia-*`.
- Faire échouer explicitement le calcul si un rôle requis est absent. Aucun fallback de valeur ou de rôle.
- Centraliser les références, les paramètres, les contrôles CI et les limites Web dans [Vérification Material 3](../material-3-verification.md).

## Conséquences

Le rendu serveur et le thème après hydratation utilisent la même génération. Les valeurs de fond exposées au navigateur proviennent également de ce schéma. La bibliothèque de couleurs reste une dépendance, mais le site n'ajoute aucune bibliothèque de composants. Les extensions de marque et de statut restent possibles, sans être confondues avec Material. La conformité visuelle de chaque écran doit toujours être contrôlée séparément.

## Validation

Les tests CI vérifient la liste fermée des rôles, l'absence de nomenclature M3 usurpée, l'échec explicite sur rôle absent, le calcul SSR et la synchronisation client. Les contrôles visuels clair/sombre et les comparaisons de thème restent une revue périodique documentée ; aucun résultat visuel n'est déclaré sans observation.
