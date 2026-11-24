# ADR-0044 — Historique des surfaces et actions du catalogue et du comparateur

- **Statut :** remplacée par [ADR-0037](ADR-0037-architecture-composants-material3.md), [ADR-0041](ADR-0041-card-material-3.md) et [ADR-0043](ADR-0043-actions-et-pictogrammes-de-genre.md)
- **Portée historique :** cette décision décrit les anciennes primitives et surfaces du catalogue/comparateur. Les composants et états actuels sont définis par les ADR référencés et les documents canoniques `docs/design.md`, `docs/composants.md` et `docs/material-3-verification.md`.
- **Date :** 2026-11-23

## Contexte

Les filtres du catalogue, le sélecteur du comparateur, les cartes de prénoms et les options de comparaison conservaient des fonds dégradés, des rayons et des couleurs historiques. Une couche Fidelity finale redéfinissait ensuite ces mêmes sélecteurs. Les actions de réinitialisation, d'effacement et de pagination étaient aussi des boutons natifs stylés à part, malgré l'existence de la primitive Bouton. Les options de comparaison ne distinguaient pas le survol souris du survol tactile collant.

## Challenge

- **Garder les styles historiques et les overrides :** cela conserve des surfaces concurrentes et rend le thème dépendant de l'ordre de cascade.
- **Créer un composant générique pour chaque carte :** le besoin est une règle visuelle partagée, pas une nouvelle couche React.
- **Garder les boutons natifs avec une classe CSS :** cela contourne la primitive commune et ses couches d'état.
- **Appliquer `:hover` partout :** sur tactile, cet état peut persister après la pression.

## Décision

- Les filtres et le sélecteur de comparaison utilisent `surface-container-low`, `outline-variant` et les formes extra-large.
- Les cartes de prénoms et les cartes de comparaison utilisent les surfaces Fidelity, un contour standard et des états de pression ; la sélection comparative utilise `primary-container` et `on-primary-container`, avec une initiale `primary` / `on-primary` pour garder un repère visuel distinct.
- Les survols des options de comparaison ne sont appliqués qu'aux pointeurs fins ; les états pressés restent actifs sur tactile.
- Les initiales utilisent `primary-container` / `on-primary-container` ; les textes secondaires utilisent `on-surface-variant`.
- Les actions de réinitialisation, de pagination, d'effacement et de copie utilisent la primitive `Bouton` en variante text ou tonal. Les anciennes classes ne gardent que les contraintes de disposition.
- Les styles de boutons locaux concurrents sont supprimés.

## Conséquences

- Catalogue, favoris et comparateur partagent le même langage de surface et les mêmes actions.
- Les états sélectionnés sont lisibles sans dépendre uniquement de la couleur.
- Les interactions tactiles ne restent pas dans un état de survol artificiel.
- La couche Fidelity finale ne redéfinit plus les filtres, cartes et options de comparaison.

## Validation

Les contrats CI vérifient les surfaces canoniques, les boutons partagés et les états de comparaison adaptés au pointeur. Aucun test ni build local n'est exécuté.
