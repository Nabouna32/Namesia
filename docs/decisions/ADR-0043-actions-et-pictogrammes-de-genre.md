# ADR-0043 — Actions de prénom et pictogrammes de genre

- **Statut :** accepté
- **Date :** 2026-11-24

## Contexte

Les cartes de découverte cumulaient la navigation, l'initiale, le nom, le genre, le favori et parfois la comparaison. Les deux actions superposées réduisaient la surface utile et déséquilibraient la composition. Les valeurs de genre étaient également rendues tantôt en texte, tantôt en pictogrammes, sans registre partagé.

## Challenge

Ajouter des actions à chaque carte semblait réduire le nombre d'étapes, mais transformait chaque liste en mini-tableau de commandes et rendait le nom moins lisible. À l'inverse, les retirer partout sans conserver un accès évident ferait perdre les fonctions favorites et comparaison. Le compromis retenu est de concentrer ces actions sur la fiche, où l'utilisateur dispose du contexte complet du prénom. Le comparateur conserve ses cases à cocher, car elles sont le mécanisme central de sélection de cet outil, et non des actions ajoutées aux cartes de découverte.

Les libellés visibles de genre répétés n'apportent pas de valeur une fois les pictogrammes établis. Les supprimer sans nom accessible dégraderait toutefois l'expérience des lecteurs d'écran.

## Décision

- Les cartes du catalogue, de l'accueil, des suggestions, de l'historique, des favoris et les résultats du comparateur n'affichent plus de bouton favori ou de comparaison.
- La fiche du prénom devient l'emplacement unique des actions de mise en favori et d'entrée dans la comparaison.
- Les vues de prénoms affichent un pictogramme SVG de genre au lieu du libellé visible ; un nom accessible est conservé sur le pictogramme.
- Le registre des quatre genres et leurs icônes est centralisé dans `lib/genre-icons.ts`, sans correspondance locale dupliquée ; `GenreIcon` porte le nom accessible.
- Les filtres de genre utilisent les mêmes pictogrammes dans des FilterChip icon-only, nommés pour les technologies d'assistance.
- Le genre reste une donnée textuelle dans le modèle, les URL, les filtres de données et les contenus structurés ; seule sa présentation visuelle change.

## Conséquences

- Les cartes retrouvent une hiérarchie simple : initiale, prénom, pictogramme et affordance de navigation.
- L'utilisateur ouvre la fiche avant d'enregistrer ou de comparer un prénom ; la fiche devient le point de décision contextualisé.
- Les filtres de genre sont plus compacts, mais leurs pictogrammes doivent rester distincts et accessibles.
- Toute nouvelle vue de prénom réutilise `GenreIcon` et ne recrée pas de mapping.
- Les tests de contrat vérifient la couverture des quatre genres et l'absence des anciennes actions dans les cartes.
