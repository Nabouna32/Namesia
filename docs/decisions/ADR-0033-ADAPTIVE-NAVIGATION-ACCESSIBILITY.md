# ADR-0033 — Sémantique et hauteur de la navigation adaptative

- **Statut :** acceptée
- **Évolution de structure :** la navigation est désormais exposée par les composants officiels `NavigationBar` et `NavigationRail` dans `components/material3/`, avec une liste de destinations partagée.
- **Date :** 2026-11-24

## Constat

La navigation partage ses quatre destinations entre une barre basse et un rail. Deux détails de son CSS fragilisaient le contrat :

- La liste HTML `ul.navigation-items` recevait `display: contents`. MDN documente que certaines implémentations de navigateurs retirent encore les éléments ainsi stylés de l'arbre d'accessibilité. La navigation peut alors perdre l'annonce de liste attendue par les technologies d'assistance.
- Dans les fenêtres larges mais peu hautes (paysage, hauteur ≤ 480 px), la barre basse affichait un conteneur de 8 px + 60 px + 8 px, soit 76 px hors zone sûre, tandis que le contenu ne réservait que 72 px. Quatre pixels pouvaient donc passer sous la barre fixe. Cette variante s'écartait aussi des 80 dp retenus pour le composable Material 3 NavigationBar de référence.

## Challenge

- **Ajouter `role="list"` pour compenser `display: contents` :** rustine inutile alors que la liste HTML native peut conserver sa boîte et son rôle.
- **Garder 72 px de réserve :** laisse le contenu se glisser sous la navigation.
- **Conserver la barre basse à 80 dp :** respecte le contrat géométrique M3 déjà adopté, avec une réserve de contenu identique ; la disposition horizontale des destinations reste une adaptation Namesia propre aux fenêtres peu hautes.

## Décision

- Le conteneur de destinations utilise une disposition flex par défaut ; les variantes actives le configurent ensuite en grille pour la barre basse ou en colonne pour le rail. La liste `ul` et ses `li` restent sémantiques et ne reçoivent jamais `display: contents`.
- La variante paysage garde des destinations d'au moins 64 px et un padding vertical de 8 px, soit 80 px au total hors zone sûre.
- Le contenu réserve exactement 80 px, plus `safe-area-inset-bottom`. La zone sûre reste distincte de la hauteur du composant.

## Conséquences

Les lecteurs d'écran conservent une liste de destinations identifiable. Le contenu ne défile plus derrière la barre en mode paysage compact. Les dimensions de la barre sont cohérentes entre les deux contextes où elle est affichée.

## Validation

Les contrats CI vérifient la structure `ul/li`, l'absence de `display: contents`, la disposition flex native, la hauteur minimale de 64 px des destinations en paysage et la réserve de 80 px plus la zone sûre.

Référence d'accessibilité : [MDN — propriété CSS display, section Accessibilité](https://developer.mozilla.org/en-US/docs/Web/CSS/display#accessibility), qui décrit les pertes d'exposition à l'arbre d'accessibilité de `display: contents` dans certaines implémentations.
