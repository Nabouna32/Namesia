# ADR-0031 — Hauteur réelle de NavigationBar avec Compose Material 3 1.5.0

- **Statut :** active
- **Décision prise le :** 2026-11-24 (heure non consignée)
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:18:09 (Europe/Paris)
- **Remplace :** [ADR-0030 — Géométrie du conteneur NavigationBar](ADR-0030-geometrie-navigation-bar.md)

## Contexte

L'ADR-0030 a réduit la barre à 64 dp en s'appuyant sur le token NavigationBarTokens.ContainerHeight. Cette lecture était incomplète : dans la version stable de référence, le composable public NavigationBar() ne lit pas ce token pour sa hauteur par défaut.

## Vérification de la source

La référence est l'artefact stable androidx.compose.material3:material3:1.5.0, publié le 18 novembre 2026. Les fichiers sont consultés dans l'arbre source figé au commit 919e948eaa351c590e7e6fc89d4014fad7a6e78c, borne de fin de la plage de commits annoncée par les notes de version officielles.

- [NavigationBar.kt — hauteur réellement utilisée](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt) : la propriété privée NavigationBarHeight retourne NavigationBarTokens.TallContainerHeight.
- [NavigationBarTokens.kt — dimensions et typographie](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarTokens.kt) : TallContainerHeight = 80.dp, ContainerHeight = 64.dp, ContainerColor = SurfaceContainer et LabelTextFont = LabelMedium.
- [NavigationRailVerticalItemTokens.kt — typographie](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationRailVerticalItemTokens.kt) : LabelTextFont = LabelMedium.
- [Notes de version Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material3#version_1_5) : version stable 1.5.0 et date de publication.

## Challenge

- **Garder 64 dp parce que le token existe :** incorrect pour reproduire le composable public par défaut ; ce token n'est pas celui lu par NavigationBarHeight.
- **Garder 80 dp sans distinguer contenu et conteneur :** exact sur la hauteur totale, mais insuffisamment précis pour traduire le composant en CSS.
- **Reproduire 80 dp au total :** correspond au comportement source ; les destinations occupent 64 dp et le padding vertical de 8 dp de chaque côté complète la hauteur.

## Décision

La NavigationBar Namesia mesure 80 dp hors zone sûre, comme le composable NavigationBar() de Compose Material 3 1.5.0. La règle Web conserve une zone de destinations de 64 dp et ajoute 8 dp de padding vertical au conteneur. La zone sûre basse du navigateur s'ajoute séparément ; le contenu de page réserve le même total de 80 dp plus l'inset.

La bordure supérieure n'est pas ajoutée : elle ne fait pas partie de cette géométrie source. La typographie des destinations reste label-medium.

## Conséquences

La hauteur de 64 dp précédemment appliquée était une erreur de lecture du token et est corrigée. La barre retrouve 16 dp, nécessaires pour correspondre à la variante haute effectivement utilisée par l'implémentation Material 3 par défaut. Le dégagement du contenu reste cohérent avec la hauteur visible et l'inset système.

## Vérification

La CI vérifie le padding vertical de 8 dp, les 64 dp minimum des destinations, le dégagement de 80 dp du contenu, l'absence de bordure ajoutée et la présence du commit AndroidX figé dans la bibliothèque de composants. La source canonique est [Vérification Material 3](../MATERIAL-3-VERIFICATION.md).
