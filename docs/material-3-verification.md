# Vérification de la fidélité Material 3

- **Statut :** contrat de vérification actif
- **Mis à jour :** 2026-11-24
- **Portée :** fondations de couleur et nomenclature des tokens ; ce document ne certifie pas à lui seul la conformité visuelle de chaque composant.

## Sources de référence

| Sujet | Source primaire | Usage dans Namesia |
|---|---|---|
| Rôles et associations de couleurs | [Material 3 — Color roles](https://m3.material.io/styles/color/roles) | Noms des rôles `--md-sys-color-*` et associations premier plan / conteneur |
| Système de couleur dynamique | [Material 3 — Color system](https://m3.material.io/styles/color) | Génération des palettes tonales et hiérarchie des surfaces |
| Variantes et rôles calculés | [Google Material Color Utilities — DynamicScheme](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/dynamic_scheme.ts) | Comportement réel de Fidelity/Rainbow et propriétés accessibles |
| Définitions des couleurs M3 | [Google Material Color Utilities — MaterialDynamicColors](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/material_dynamic_colors.ts) | Rôles calculables et distinction des clés de palette |
| Variantes disponibles | [Google Material Color Utilities — Variant](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/variant.ts) | Noms officiels des variantes |
| Définition de la variante Fidelity | [Google Material Color Utilities — ColorSpec 2021](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/color_spec_2021.ts) | Règles de couleur associées à Fidelity |
| Motion | [Angular Material — _md-sys-motion.scss](https://github.com/angular/components/blob/main/src/material/core/tokens/m3/_md-sys-motion.scss) | Noms et valeurs officielles des durées et courbes |
| État | [Angular Material — _md-sys-state.scss](https://github.com/angular/components/blob/main/src/material/core/tokens/m3/_md-sys-state.scss) | Opacités de survol, focus, pression et déplacement |
| Élévation | [Angular Material — _md-sys-elevation.scss](https://github.com/angular/components/blob/main/src/material/core/tokens/m3/_md-sys-elevation.scss) | Niveaux d'élévation numériques 0 à 5 |
| Formes | [Angular Material — _md-sys-shape.scss](https://github.com/angular/components/blob/main/src/material/core/tokens/m3/_md-sys-shape.scss) | Échelle de coins M3 |
| Export et aperçu de thème | [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) | Contrôle visuel indépendant du thème calculé |

Les sources sont les spécifications Material 3 et le code source officiel Google. Les pages et la bibliothèque peuvent évoluer ; toute mise à jour de dépendance ou de spécification déclenche une nouvelle vérification avant modification des rôles.

## Paramètres retenus

| Paramètre | Valeur | Justification |
|---|---|---|
| Couleur source | `#005AC1` | Choix de couleur source Namesia ; ce n'est pas une couleur officielle Pixel revendiquée, et le navigateur n'accède pas au fond d'écran Android |
| Variante d'interface | `Variant.FIDELITY` | Conserve le caractère de la couleur source selon la variante M3 |
| Variante catégorielle | `Variant.RAINBOW` | Schéma distinct réservé aux catégories éditoriales |
| Spécification | `2021` | Le code source de `DynamicScheme.maybeFallbackSpecVersion` force les variantes non prises en charge par 2025 vers 2021 ; le choix est donc déclaré explicitement |
| Plateforme | non renseignée | Paramètre utilisé par les spécifications ultérieures, sans effet sur Fidelity/Rainbow 2021 |
| Contraste | `0` | Contraste standard M3 |
| Modes | clair et sombre | Deux schémas issus de la même source et des mêmes paramètres |

## Contrôles automatisés

La CI doit garantir les points suivants via `tests/material-theme.test.mjs` et `tests/design-contract.test.mjs` :

1. La liste des rôles système est explicite, fermée et comparée à une liste attendue ; aucune clé de palette interne ni propriété non M3 ne reçoit le préfixe `--md-sys-color-*`.
2. Les rôles consommés par les CSS appartiennent à cette liste fermée.
3. Les extensions de marque, de statut et de catégories portent `--namesia-*`, jamais `--md-sys-*`.
4. Un rôle Fidelity ou Rainbow absent provoque une erreur explicite ; il n'est ni ignoré ni remplacé.
5. Le CSS initial du document est calculé depuis les mêmes schémas que ceux réappliqués après hydratation. Il n'existe pas de seconde palette statique dans `globals.css`.
6. Les couleurs de la barre du navigateur utilisent les rôles de fond calculés pour les deux modes.
7. Les CSS ne contiennent aucun `var(..., ...)` de secours ni couleur hexadécimale codée en dur.
8. Motion, état et forme utilisent les noms système M3 ; aucun alias Namesia n'usurpe ces familles. Les ombres non nécessaires sont retirées au lieu de simuler des niveaux d'élévation.

Un contrôle statique ne remplace pas un examen du rendu. Après un changement de source, de version de bibliothèque ou de paramètres, comparer les modes clair/sombre avec Material Theme Builder et vérifier les contrastes de chaque paire réellement utilisée.

## Extensions Namesia, hors nomenclature M3

| Préfixe | Usage | Règle |
|---|---|---|
| `--namesia-color-category-*` | Couleurs issues du schéma Rainbow secondaire | Catégorie éditoriale identifiée uniquement |

Les variables Rainbow sont un namespace d'adaptation Namesia pour distinguer le schéma catégoriel secondaire du schéma Fidelity principal. Les statuts sans rôle M3 dédié ne reçoivent pas de couleurs inventées ; la marque utilise les rôles Fidelity, sans dégradé non-M3. Les familles typographiques, géométriques, de mouvement et d'état utilisent les préfixes système M3 exacts : `--md-sys-typescale-*`, `--md-sys-shape-corner-*`, `--md-sys-motion-easing-*`, `--md-sys-motion-duration-*` et `--md-sys-state-*-state-layer-opacity`.

## Limites du navigateur : seules exceptions acceptées

- Le navigateur ne donne pas accès à la couleur du fond d'écran Android ; la couleur source reste donc une décision Namesia.
- Les barres système, gestes de retour et animations système Android sont gérés par l'OS et le navigateur. Namesia ne dessine pas de substituts.
- Le site suit `prefers-color-scheme` et expose une couleur de thème au navigateur, mais ne peut pas imposer le thème des contrôles natifs au-delà des mécanismes CSS et viewport supportés.
- Les éléments natifs `select`, `input` et les dialogues conservent leurs interactions et limites propres au navigateur ; ils ne sont pas remplacés par des clones décoratifs uniquement pour simuler Android.

Les tokens de mouvement et d'état sont vérifiés contre les sources M3 d'Angular Material : `_md-sys-motion.scss`, `_md-sys-state.scss`, `_md-sys-elevation.scss` et `_md-sys-shape.scss`. Les niveaux d'élévation M3 sont des valeurs numériques en dp ; Namesia n'utilise actuellement pas de `box-shadow` et ne les transforme donc pas en ombres CSS.

Aucun autre fallback visuel non-M3 n'est accepté. Toute nouvelle exception doit être liée à une limite vérifiable du navigateur, ciblée, documentée ici et couverte par un contrôle adapté.
