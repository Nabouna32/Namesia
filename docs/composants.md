# Bibliothèque Material 3 — Namesia

- **Statut :** référence canonique des composants d'interface
- **Mis à jour :** 2026-11-24

Ce document est le point d'entrée unique pour composer l'interface. Les composants de présentation portent les noms officiels Material 3 et sont centralisés dans `components/material3/`. Les fonctions propres au produit sont isolées dans `components/features/`. Il n'existe pas de couche parallèle de primitives génériques nommées en français, ni de wrappers de convenance qui masquent le contrat M3.

## Architecture

```text
styles/
  material3/
    tokens.css               # Échelle typographique, formes, mouvement et états M3
components/
  material3/                 # Implémentations React/HTML des composants M3
    Button.tsx
    Card.tsx
    IconButton.tsx
    SearchBar.tsx
    TextField.tsx
    FilterChip.tsx
    InputChip.tsx
    Snackbar.tsx
    TopAppBar.tsx
    MaterialThemeProvider.tsx
    Icon.tsx
    NavigationBar.tsx
    NavigationRail.tsx
    NavigationDestinations.tsx
    Button.module.css
    Card.module.css
    SearchBar.module.css
    TextField.module.css
    FilterChip.module.css
    InputChip.module.css
    Snackbar.module.css
    index.ts
  features/                  # Composition métier, jamais une seconde bibliothèque UI
    history/
      HistoryProvider.tsx
      RecentNames.tsx
      RecordVisit.tsx
    catalog/
      NameSearch.tsx
      FeaturedNames.tsx
      RelatedNames.tsx
    discovery/
      RandomDiscovery.tsx
    sharing/
      ShareLink.tsx
    profile/
      ProfileActions.module.css
    names/
      GenreIcon.tsx
      GenreIcon.module.css
    comparison/
      NameComparator.tsx
      ComparisonSelection.tsx
    favorites/
      FavoritesProvider.tsx
      FavoritesList.tsx
      FavoriteButton.tsx
```

Les composants Material 3 sont implémentés en React et HTML, mais leurs noms, variantes, anatomie, dimensions et états suivent AndroidX Compose Material 3 1.5.0 stable, figé au commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c` ([arbre source AndroidX figé](https://github.com/androidx/androidx/tree/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3)). Compose étant une bibliothèque Kotlin/Android, son code ne peut pas être importé dans Next.js : les composants Web sont des ports explicites des contrats AndroidX, pas des composants Compose exécutés dans le navigateur.

Material Web 2.5.0 a été évalué. Le [README officiel](https://github.com/material-components/material-web/blob/b4de401eb665ec63474f39319a4ba8f2145974cc/README.md) le place en maintenance en attente de nouveaux mainteneurs et la [discussion de maintenance](https://github.com/material-components/material-web/discussions/5642) confirme l'absence de feuille de route de nouvelles fonctionnalités ; il ne devient donc pas la dépendance structurante du site. Son API et ses comportements ne sont pas interchangeables avec AndroidX Compose. La décision et ses compromis sont consignés dans ADR-0037.

## Correspondance avec les composants Material 3

Les primitives de présentation sont implémentées une seule fois dans `components/material3/` sous leur nom AndroidX officiel. Les compositions propres au produit résident dans `components/features/` et utilisent ces primitives sans recréer leur surface, leur typographie ou leurs états. Les éléments HTML natifs restent utilisés lorsqu'AndroidX ne définit pas de composant Web équivalent.

## Composants Material 3 disponibles

| Nom officiel | Fichier | Contrat et périmètre Web |
|---|---|---|
| `Button` | `material3/Button.tsx` | Variantes `filled`, `tonal`, `outlined`, `text`. Élément natif `button` pour une action ; la prop `href` rend un lien Next.js avec la même apparence pour préserver la navigation Web. Cible 48 px, `ButtonSmallTokens.ContainerHeight = 40.dp`, largeur minimale 58 dp, typographie `label-large`, dimensions et états AndroidX. |
| `Card` | `material3/Card.tsx` | Surfaces AndroidX `elevated`, `filled` et `outlined`, avec élément HTML racine explicite et états interactifs centralisés. |
| `IconButton` | `material3/IconButton.tsx` | Action iconique distincte de Button : cible 48 dp, glyphe 24 dp, couleur et état désactivé AndroidX. Le nom accessible est obligatoire. |
| `SearchBar` | `material3/SearchBar.tsx` | Champ replié de SearchBar AndroidX : `SearchBarTokens.ContainerHeight = 56.dp`, forme `full`, surface `surface-container-high`, saisie `body-large`, icônes et effacement accessibles. Les résultats restent dans le flux de la page ; aucune fausse fenêtre d'expansion n'est dessinée. |
| `TextField` | `material3/TextField.tsx` | Champ `filled` ou `outlined`, label flottant, supporting text, erreur, désactivation et focus selon l'anatomie AndroidX. |
| `FilterChip` | `material3/FilterChip.tsx` | Filtre sélectionnable avec `aria-pressed`, coche, `FilterChipTokens.ContainerHeight = 32 dp (32.dp)` dans une cible de 48 dp, contour et couches d'état AndroidX. |
| `InputChip` | `material3/InputChip.tsx` | Puce de saisie avec action de retrait, `InputChipTokens.ContainerHeight = 32.dp`, contour `outline-variant` au repos, `secondary-container` à l'état sélectionné et cible de 48 px. |
| `Snackbar` | `material3/Snackbar.tsx` | Présentation de retours d'action avec rôles accessibles. Les sévérités produit `success`, `warning`, `info` utilisent les extensions tonales Namesia ; `error` utilise les rôles système M3. Le placement est laissé au contexte de l'écran. |
| `TopAppBar` | `material3/TopAppBar.tsx` | Barre supérieure du shell, marque et titre secondaire ; dimensions et couleurs centralisées dans le système M3. |
| `NavigationBar` | `material3/NavigationBar.tsx` | Navigation de premier niveau compacte, `NavigationBarTokens.TallContainerHeight = 80.dp`, destinations, indicateur et libellés `label-medium`. |
| `NavigationRail` | `material3/NavigationRail.tsx` | Même navigation de premier niveau sur fenêtres medium/expanded, `NavigationRail` de 80 dp et libellés `label-medium`. |
| `MaterialThemeProvider` | `components/material3/MaterialThemeProvider.tsx` | Synchronise les schémas Fidelity/Rainbow calculés côté serveur et les changements de préférence système. |
| `Icon` | `components/material3/Icon.tsx` | Registre local des tracés Google Material Symbols Rounded 400 ; les contrôles interactifs restent portés par Button ou IconButton. |

### Contrôles Web natifs

AndroidX Compose Material 3 ne définit pas un composant nommé `Select`. Pour les filtres de genre et de tri, le site conserve donc l'élément HTML `select` natif avec libellé associé, dimensions, forme, couleurs et focus M3. Ce n'est ni un fallback visuel ni un faux menu personnalisé : c'est le contrôle de sélection du navigateur, choisi pour préserver clavier, lecteur d'écran, ouverture système et comportement attendu sur le Web.

Les titres, paragraphes et libellés utilisent les éléments HTML sémantiques et les rôles typographiques M3 `--md-sys-typescale-*`. Il n'existe pas de composant React `Typography` parallèle : la typographie est un système de tokens, pas une seconde couche de composants.

## Composants métier

| Composant | Fichier | Responsabilité |
|---|---|---|
| `FavoritesProvider` | `features/favorites/FavoritesProvider.tsx` | État partagé des favoris et synchronisation inter-onglets. |
| `FavoritesList` | `features/favorites/FavoritesList.tsx` | Recherche, filtres natifs, tri, import/export et composition des favoris. |
| `HistoryProvider` | `features/history/HistoryProvider.tsx` | Historique de navigation conservé dans la session. |
| `RecentNames` | `features/history/RecentNames.tsx` | Liste des fiches récemment consultées. |
| `RecordVisit` | `features/history/RecordVisit.tsx` | Enregistre une consultation dans l'historique de session. |
| `NameSearch` | `features/catalog/NameSearch.tsx` | Recherche, filtres et pagination du catalogue. |
| `GenreIcon` | `features/names/GenreIcon.tsx` | Pictogramme SVG exhaustif des quatre genres, avec nom accessible ; la correspondance est centralisée dans `lib/genre-icons.ts`. |
| `FeaturedNames` | `features/catalog/FeaturedNames.tsx` | Présentation des prénoms mis en avant. |
| `RelatedNames` | `features/catalog/RelatedNames.tsx` | Suggestions liées depuis une fiche. |
| `RandomDiscovery` | `features/discovery/RandomDiscovery.tsx` | Découverte aléatoire d'un prénom. |
| `NameComparator` | `features/comparison/NameComparator.tsx` | Recherche et comparaison de deux ou trois fiches. |
| `ShareProfile` | `features/sharing/ShareLink.tsx` | Composition du partage d'une fiche de prénom. |
| `FavoriteButton` | `features/favorites/FavoriteButton.tsx` | Ajout/retrait d'un favori, état de chargement et erreur du stockage ; compose Button et IconButton. |
| `ComparisonSelection` | `features/comparison/ComparisonSelection.tsx` | Liste des prénoms retenus ; compose InputChip pour le retrait individuel. |
| `ShareLink` | `features/sharing/ShareLink.tsx` | Partage natif ou copie d'une URL reconstruite avec une liste explicite de paramètres autorisés. |

Les cartes de résultats, de suggestions, de favoris, d'historique et de découverte utilisent le lien `Card` comme surface de navigation. Le genre est représenté exclusivement par `GenreIcon`, dont la correspondance exhaustive est centralisée dans `lib/genre-icons.ts` : `gender-female`, `gender-male`, `gender-mixed` et `gender-unknown`. Le nom du genre est fourni à l'arbre d'accessibilité par le pictogramme, sans libellé visible redondant. Les filtres de genre utilisent la même iconographie dans des `FilterChip` icon-only, avec nom accessible et état sélectionné. La flèche suffit à signaler l'ouverture de la fiche ; aucun texte « Découvrir » n'est ajouté au catalogue. Les cartes de découverte ne portent ni action de favori ni action de comparaison : ces deux actions sont regroupées sur la fiche du prénom. Le comparateur conserve sa sélection native par cases à cocher, nécessaire à son usage propre.


Les composants métier peuvent être propres à Namesia, mais ils ne redéfinissent jamais les styles, états ou interactions d'un composant Material 3 générique. Les règles de disposition restent dans leurs CSS Modules ; les variantes et états M3 restent dans `components/material3/`.

## Contrat obligatoire pour toute nouvelle page

Toute nouvelle page doit composer le shell partagé, les primitives officielles de `components/material3/` et les fonctions métier de `components/features/`. Elle doit choisir les rôles typographiques et les variantes M3 explicitement, conserver les éléments HTML sémantiques et documenter toute exception propre au Web. Il est interdit de réintroduire une primitive Namesia, un alias, un wrapper de présentation, une palette parallèle ou un fallback.

## Conventions d'implémentation

- Employer exactement les noms Material 3 pour les composants correspondants : `Button`, `IconButton`, `SearchBar`, `FilterChip`, `InputChip`, `Snackbar`, `TopAppBar`, `NavigationBar`, `NavigationRail`, `Icon`, `Card`, `TextField`.
- Ne pas créer de traduction, alias, wrapper ou fallback parallèle pour ces composants.
- Garder les éléments HTML natifs adaptés : `button`, `a`, `input`, `select`, `nav`, `header`, titres et listes sémantiques. Ne pas remplacer leur sémantique par des `div` et des rôles ARIA redondants.
- Les CSS Modules de `components/material3/` consomment directement les tokens `--md-sys-*` et les seules extensions `--namesia-*` déclarées dans [le système de design](design.md).
- Aucun fallback dans `var()`, alias de tokens, palette CSS parallèle, hex arbitraire ou couche d'overrides finale.
- Les dimensions visuelles et les cibles tactiles sont distinctes lorsqu'AndroidX les distingue : ne jamais agrandir une capsule pour atteindre 48 dp si la cible native peut porter cette dimension.
- Les états hover sont limités aux pointeurs fins ; focus, pressed, selected et disabled utilisent les tokens AndroidX et les rôles de premier plan appropriés.
- Une exception Web doit correspondre à une limite réelle du navigateur et être documentée ; elle ne justifie pas la création d'un faux composant Android.

## Recettes de composition

| Écran | Composition |
|---|---|
| Accueil | TopAppBar, NavigationBar/NavigationRail, SearchBar, Button, Card sémantique et FavoriteButton |
| Catalogue | Shell, SearchBar, FilterChip icon-only pour le genre et cartes de résultats navigables |
| Fiche | Shell, titres et corps typographiques M3, GenreIcon, FavoriteButton, Button de comparaison, partage et cartes éditoriales sémantiques |
| Comparateur | Shell, SearchBar, cases à cocher natives, ComparisonSelection, Button et cartes de comparaison |
| Favoris | Shell, SearchBar, FilterChip icon-only pour le genre, `select` natif pour le tri, Snackbar et cartes navigables |
| Administration | Shell, champs natifs, Button, Snackbar et cartes de prévisualisation |

## Ajouter un composant

Avant toute création, vérifier le nom officiel, l'anatomie, les tokens, les variantes, les états et la source AndroidX versionnée dans [Vérification Material 3](material-3-verification.md). Si le besoin est métier, placer la composition dans `components/features/` et la construire avec les composants Material 3 existants. Ne jamais créer une nouvelle primitive générique Namesia pour contourner un composant existant.
