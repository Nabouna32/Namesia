# ADR-0034 — Géométrie et états du FilterChip AndroidX 1.5.0

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:18:09 (Europe/Paris)
- **Évolution de structure :** le composant porte désormais le nom officiel `FilterChip` dans `components/material3/`. La géométrie et les états décrits ici restent applicables ; voir ADR-0037 pour l'organisation actuelle.
- **Décision prise le :** 2026-11-24 (heure non consignée)

## Contexte

Le composant partagé `ChipFiltre` affichait une capsule de 48 px de haut. Cette valeur provenait de la cible tactile minimale et avait été appliquée directement au conteneur visible. Elle confondait deux dimensions distinctes du composant AndroidX.

## Vérification de la source

La référence est Compose Material 3 1.5.0 stable, arbre source figé au commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`.

- [Chip.kt — FilterChip et FilterChipDefaults](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Chip.kt) : `FilterChipDefaults.Height` est la hauteur appliquée au composant.
- [FilterChipTokens.kt](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilterChipTokens.kt) : `ContainerHeight = 32.dp`, forme `CornerSmall`, contour non sélectionné `OutlineVariant`, largeur du contour sélectionné `0.dp`, typographie `LabelLarge`, icône de 18 dp.
- Le conteneur de 32 dp ne doit pas être confondu avec la cible interactive minimale de 48 dp, assurée par la couche d'interaction Compose.

## Challenge

- **Conserver 48 px comme hauteur visuelle :** accessible, mais non fidèle à la géométrie AndroidX.
- **Réduire le bouton natif à 32 px :** fidèle visuellement, mais cible tactile insuffisante.
- **Distinguer la surface de la cible :** reproduit la capsule de 32 dp à l'intérieur d'une cible native de 48 px ; c'est la traduction Web retenue.

L'ancien contour `outline` était également plus marqué que le token `outline-variant`. Le contour sélectionné n'est pas conservé dans les tokens flat : sa largeur vaut zéro. Les états utilisent les opacités système plutôt que des couleurs d'état recopiées.

## Décision

Le bouton HTML conserve une hauteur interactive minimale de 48 px. Un pseudo-élément interne dessine la capsule de 32 px, avec les tokens de forme, de surface et de contour AndroidX. La sélection applique `secondary-container`, `on-secondary-container` et la coche existante, sans contour. Les états hover, focus et pressed utilisent les tokens `--md-sys-state-*-state-layer-opacity`.

## Conséquences

La zone cliquable ne diminue pas. La capsule devient plus compacte, conformément à AndroidX ; l'espacement du groupe de filtres reste piloté par son conteneur et ne doit pas être compensé en augmentant la capsule. La variante initiale conserve sa cible minimale de 48 px.

## Vérification

Le contrat CI vérifie la séparation 32/48 px, le contour `outline-variant`, l'absence de contour sélectionné et l'usage des trois tokens d'état. La conformité visuelle complète doit aussi être vérifiée sur les filtres du catalogue à différentes densités et largeurs.
