# Bibliothèque Material 3 — Namesia

- **Statut :** référence canonique des composants d'interface
- **Version :** 1.0
- **Mis à jour le :** 2026-11-27 01:08:00 (Europe/Paris)

Ce document est le point d'entrée unique pour composer l'interface. Les ports Web des contrats Material 3 sont centralisés dans `components/material3/` ; les fonctions propres au produit sont isolées dans `components/features/`. Il n'existe pas de seconde bibliothèque de primitives ni de wrappers de convenance. Les ports locaux sont nécessaires parce qu'AndroidX Compose cible Android/Kotlin et que Material Web ne couvre pas le besoin stable complet ; ils ne sont pas présentés comme des composants AndroidX exécutés dans le navigateur. La décision, les alternatives et les limites sont détaillées dans [ADR-0037](decisions/ADR-0037-architecture-composants-material3.md).

## Architecture

```text
styles/
  material3/
    tokens.css               # Échelle typographique, formes, mouvement et états M3
components/
  material3/                 # Implémentations React/HTML des composants M3
    AlertDialog.tsx
    AlertDialog.module.css
    Button.tsx
    Card.tsx
    Checkbox.tsx
    IconButton.tsx
    SearchBar.tsx
    TextField.tsx
    FilterChip.tsx
    InputChip.tsx
    Snackbar.tsx
    TopAppBar.tsx
    Icon.tsx
    NavigationBar.tsx
    NavigationRail.tsx
    NavigationDestinations.tsx
    Button.module.css
    Card.module.css
    Checkbox.module.css
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
      GenderIcon.tsx
      GenderIcon.module.css
    comparison/
      NameComparator.tsx
      ComparisonSelection.tsx
    favorites/
      FavoritesProvider.tsx
      FavoritesList.tsx
      FavoriteButton.tsx
```

Les composants Material 3 sont implémentés en React et HTML, mais leurs noms, variantes, anatomie, dimensions et états suivent AndroidX Compose Material 3 1.5.0 stable, figé au commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c` ([arbre source AndroidX figé](https://github.com/androidx/androidx/tree/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3)). Compose étant une bibliothèque Kotlin/Android, son code ne peut pas être importé dans Next.js : les composants Web sont des ports explicites des contrats AndroidX, pas des composants Compose exécutés dans le navigateur.

Material Web 2.5.0 a été évalué comme alternative de composants. Le [README officiel épinglé](https://github.com/material-components/material-web/blob/d4f63c567f73b16717f4c04b57fa6390d0b2312d/README.md) indique que le projet est en maintenance dans l'attente de nouveaux mainteneurs ; la [roadmap officielle épinglée](https://github.com/material-components/material-web/blob/d4f63c567f73b16717f4c04b57fa6390d0b2312d/docs/roadmap.md) précise qu'aucune nouvelle fonctionnalité ni aucun nouveau composant ne sont planifiés et que plusieurs composants nécessaires au shell restent absents de la couverture stable. Ces deux snapshots sont ceux vérifiés par `scripts/verify-design-sources.mjs`. Material Web reste une référence secondaire, pas une dépendance structurante : son API et ses comportements ne sont pas interchangeables avec AndroidX Compose. La décision et ses compromis sont consignés dans ADR-0037.

## Correspondance avec les composants Material 3

Les primitives de présentation sont implémentées une seule fois dans `components/material3/` sous leur nom AndroidX officiel. Les compositions propres au produit résident dans `components/features/` et utilisent ces primitives sans recréer leur surface, leur typographie ou leurs états. Les éléments HTML natifs restent utilisés lorsqu'AndroidX ne définit pas de composant Web équivalent.

## Composants Material 3 disponibles

| Nom officiel | Fichier | Contrat et périmètre Web |
|---|---|---|
| `AlertDialog` | `material3/AlertDialog.tsx` | Dialogue de confirmation construit sur le vrai élément HTML `dialog` et son top layer modal : fermeture par Échap ou clic sur le scrim, focus modal et retour vers le déclencheur gérés par le navigateur, nom et description accessibles. Largeur 280–560 dp, surface `surface-container-high`, forme `corner-extra-large`, élévation AndroidX `Level3`, titre `headline-small`, texte `body-medium` et actions `TextButton`. Utilisé pour confirmer la publication publique d’une fiche. |
| `Button` | `material3/Button.tsx` | Variantes `filled`, `tonal`, `outlined`, `text`. Élément natif `button` pour une action et lien Next.js pour une destination. Son API TypeScript discriminée interdit `disabled`, `onClick` et `aria-pressed` sur un lien : un lien désactivé n’a pas de sémantique HTML native et ne doit jamais être simulé par `aria-disabled`. Cible 48 px, `ButtonSmallTokens.ContainerHeight = 40.dp`, largeur minimale 58 dp, typographie `label-large`, contenu désactivé à 38 % de `on-surface` et conteneur Filled/Tonal à 10 % de `on-surface`, conformément à AndroidX. |
| `Card` | `material3/Card.tsx` | Surfaces AndroidX `elevated`, `filled` et `outlined`. La prop `as` est obligatoire : chaque usage choisit explicitement son élément HTML sémantique, sans racine `div` implicite. L'état `interactive` est lui aussi explicite. |
| `Checkbox` | `material3/Checkbox.tsx` | Port Web de Checkbox AndroidX : input natif contrôlé, indicateur de 18 dp, state layer circulaire de 40 dp, anneau de focus 40 dp (`RoundedCornerShape(25)`, `Secondary`), cible tactile de 62 px portée par le label parent et forme d'indicateur AndroidX `RoundedCornerShape(2.dp)`. Les états hover/focus/pressed utilisent les couleurs et couches AndroidX ; le parent `label` fournit le nom accessible. |
| `IconButton` | `material3/IconButton.tsx` et `IconButton.module.css` | Action iconique AndroidX distincte de Button : cible 48 dp, cercle visuel transparent de 40 dp, glyphe 24 dp et couches d'état dans le cercle. La couleur hérite du contexte (`LocalContentColor`) ; l'état désactivé applique 38 % de cette couleur. La variante AndroidX `iconButtonVibrantColors` utilise `on-surface-variant` et `on-surface` à 38 %. Son contrat est une action simple, pas un contrôle toggle ; le nom accessible est obligatoire. Le style est isolé et ne réutilise aucune variante de Button. |
| `SearchBar` | `material3/SearchBar.tsx` | Champ replié de SearchBar AndroidX : `SearchBarTokens.ContainerHeight = 56.dp`, forme `full`, surface `surface-container-high`, saisie `body-large`, icônes et effacement accessibles. Le clavier mobile affiche l'action Search ; la capitalisation, la correction automatique et la vérification orthographique sont désactivées pour préserver les graphies des prénoms. Les résultats restent dans le flux de la page ; aucune fausse fenêtre d'expansion n'est dessinée. |
| `TextField` | `material3/TextField.tsx` | Champ `filled` ou `outlined`, label flottant, supporting text, erreur, désactivation et focus selon l'anatomie AndroidX. En mode multiligne, le label reste aligné en haut du champ même lorsqu'il est vide et non focalisé. |
| `FilterChip` | `material3/FilterChip.tsx` | Filtre sélectionnable avec `aria-pressed`, coche, `FilterChipTokens.ContainerHeight = 32 dp (32.dp)` dans une cible de 48 dp, contour et couches d'état AndroidX. |
| `InputChip` | `material3/InputChip.tsx` | Puce de saisie avec action de retrait, `InputChipTokens.ContainerHeight = 32.dp`, contour `outline-variant` au repos, `secondary-container` à l'état sélectionné et cible de 48 px. |
| `Snackbar` | `material3/Snackbar.tsx` | Port AndroidX : conteneur `inverse-surface` / `inverse-on-surface` par défaut, forme `CornerExtraSmall` (4 dp), largeur maximale 560 dp, hauteur minimale 48 dp, typographie `body-medium`, élévation `Level3` (6 dp), action `inverse-primary`, action de fermeture `inverse-on-surface` et gabarit 68 dp lorsque l'action passe sur une nouvelle ligne. Les slots `action`, `dismissAction` et `actionOnNewLine` suivent l'API AndroidX. Les couleurs `success`, `warning`, `info` et `error` restent des personnalisations explicites du conteneur. Les rôles implicites `status` / `alert` portent l'annonce accessible sans redéclarer `aria-live`. |
| `TopAppBar` | `material3/TopAppBar.tsx` | Barre supérieure du shell, marque et titre secondaire ; dimensions et couleurs centralisées dans le système M3. |
| `NavigationBar` | `material3/NavigationBar.tsx` | Navigation de premier niveau compacte, `NavigationBarTokens.TallContainerHeight = 80.dp`, destinations, indicateur et libellés `label-medium`. |
| `NavigationRail` | `material3/NavigationRail.tsx` | Même navigation de premier niveau sur fenêtres medium/expanded, `NavigationRail` de 80 dp et libellés `label-medium`. |
| `Icon` | `components/material3/Icon.tsx` | Registre local des tracés Google Material Symbols Rounded 400 ; le pictogramme masculin utilise un cercle et une flèche équilibrés sur la même grille ; les contrôles interactifs restent portés par Button ou IconButton. |

### Contrôles Web natifs

AndroidX Compose Material 3 ne définit pas un composant nommé `Select`. Pour les filtres de genre et de tri, le site conserve donc l'élément HTML `select` natif avec libellé associé, dimensions, forme, couleurs et focus M3. Ce n'est ni un fallback visuel ni un faux menu personnalisé : c'est le contrôle de sélection du navigateur, choisi pour préserver clavier, lecteur d'écran, ouverture système et comportement attendu sur le Web.

La sélection du comparateur utilise `Checkbox`, port Web du composant AndroidX correspondant. Il conserve un véritable `input type="checkbox"` pour la sémantique et le clavier, mais centralise l'indicateur, la cible, les couleurs et les états dans `components/material3/Checkbox.module.css` ; les pages ne stylent plus directement `accent-color`. Les sélecteurs de fichiers JSON des favoris et de l'administration restent natifs : le navigateur doit ouvrir son sélecteur système et Namesia ne réimplémente pas l'accès aux fichiers locaux. Ce sont des frontières de plateforme, pas des composants de présentation à remplacer.

Les titres, paragraphes et libellés utilisent les éléments HTML sémantiques et les rôles typographiques M3 `--md-sys-typescale-*`. Il n'existe pas de composant React `Typography` parallèle : la typographie est un système de tokens, pas une seconde couche de composants.

## Composants métier

| Composant | Fichier | Responsabilité |
|---|---|---|
| `FavoritesProvider` | `features/favorites/FavoritesProvider.tsx` | État partagé des favoris et synchronisation inter-onglets. |
| `FavoritesList` | `features/favorites/FavoritesList.tsx` | Recherche, FilterChip icon-only pour le genre, tri natif, import/export et liste des favoris. |
| `HistoryProvider` | `features/history/HistoryProvider.tsx` | Historique de navigation conservé dans la session. |
| `RecentNames` | `features/history/RecentNames.tsx` | Liste des fiches récemment consultées. |
| `RecordVisit` | `features/history/RecordVisit.tsx` | Enregistre une consultation dans l'historique de session. |
| `NameSearch` | `features/catalog/NameSearch.tsx` | Recherche, filtres et pagination du catalogue. |
| `GenderIcon` | `features/names/GenderIcon.tsx` | Pictogramme SVG exhaustif des quatre genres, avec nom accessible ; la correspondance est centralisée dans `lib/gender-icons.ts`. |
| `FeaturedNames` | `features/catalog/FeaturedNames.tsx` | Présentation des prénoms mis en avant. |
| `RelatedNames` | `features/catalog/RelatedNames.tsx` | Suggestions liées depuis une fiche. |
| `RandomDiscovery` | `features/discovery/RandomDiscovery.tsx` | Découverte aléatoire avec pictogramme de genre accessible et lien vers la fiche. |
| `NameComparator` | `features/comparison/NameComparator.tsx` | Recherche et comparaison de deux ou trois fiches. |
| `ShareProfile` | `features/sharing/ShareLink.tsx` | Composition du partage d'une fiche de prénom. |
| `FavoriteButton` | `features/favorites/FavoriteButton.tsx` | Ajout/retrait d'un favori depuis la fiche, état de chargement et erreur du stockage ; compose Button. |
| `ComparisonSelection` | `features/comparison/ComparisonSelection.tsx` | Liste des prénoms retenus ; compose InputChip pour le retrait individuel. |
| `ShareLink` | `features/sharing/ShareLink.tsx` | Partage natif ou copie d'une URL reconstruite avec une liste explicite de paramètres autorisés. |

Les cartes de résultats, de suggestions, de favoris et d'historique utilisent le lien `Card` comme surface de navigation. Le résultat textuel de la découverte aléatoire associe également le nom à `GenderIcon` avant d'ouvrir la fiche. Le genre est représenté exclusivement par `GenderIcon`, dont la correspondance exhaustive est centralisée dans `lib/gender-icons.ts` : `gender-female`, `gender-male`, `gender-mixed` et `gender-unknown`. Le pictogramme masculin sépare le contour circulaire de la flèche diagonale afin de conserver une épaisseur et une lecture équilibrées à 20 px comme à 24 px. Le nom du genre est fourni à l'arbre d'accessibilité par le pictogramme, sans libellé visible redondant. Les filtres de genre utilisent la même iconographie dans des `FilterChip` icon-only, avec nom accessible et état sélectionné. La flèche suffit à signaler l'ouverture de la fiche ; aucun texte « Découvrir » n'est ajouté au catalogue. Les cartes de découverte ne portent ni action de favori ni action de comparaison : ces deux actions sont regroupées sur la fiche du prénom. Le comparateur compose `Checkbox` pour chaque choix ; la limite de trois éléments est exprimée par son état désactivé.


Les composants métier peuvent être propres à Namesia, mais ils ne redéfinissent jamais les styles, états ou interactions d'un composant Material 3 générique. Les règles de disposition restent dans leurs CSS Modules ; les variantes et états M3 restent dans `components/material3/`.

## Contrat obligatoire pour toute nouvelle page

Toute nouvelle page doit composer le shell partagé, les primitives officielles de `components/material3/` et les fonctions métier de `components/features/`. Elle doit choisir les rôles typographiques et les variantes M3 explicitement, conserver les éléments HTML sémantiques et documenter toute exception propre au Web. Il est interdit de réintroduire une primitive Namesia, un alias, un wrapper de présentation, une palette parallèle ou un fallback.

## Conventions d'implémentation

- Employer exactement les noms Material 3 pour les composants correspondants : `AlertDialog`, `Button`, `IconButton`, `SearchBar`, `FilterChip`, `InputChip`, `Checkbox`, `Snackbar`, `TopAppBar`, `NavigationBar`, `NavigationRail`, `Icon`, `Card`, `TextField`.
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
| Accueil | TopAppBar, NavigationBar/NavigationRail, SearchBar, Button et Card sémantique navigable |
| Catalogue | Shell, SearchBar, FilterChip icon-only pour le genre et cartes de résultats navigables |
| Fiche | Shell, titres et corps typographiques M3, GenderIcon, FavoriteButton, Button de comparaison, partage et cartes éditoriales sémantiques |
| Comparateur | Shell, SearchBar, Checkbox, ComparisonSelection, Button et cartes de comparaison |
| Favoris | Shell, SearchBar, FilterChip icon-only pour le genre, `select` natif pour le tri, Snackbar et cartes navigables |
| Administration | Shell, champs natifs, Button, Snackbar et cartes de prévisualisation |

## Ajouter un composant

Avant toute création, vérifier le nom officiel, l'anatomie, les tokens, les variantes, les états et la source AndroidX versionnée dans [Vérification Material 3](material-3-verification.md). Si le besoin est métier, placer la composition dans `components/features/` et la construire avec les composants Material 3 existants. Ne jamais créer une nouvelle primitive générique Namesia pour contourner un composant existant.

## Contrats des props

Les compositions de catalogue utilisent des props anglaises : `names`, `initialSearch`, `initialGender`, `initialLetter`, `initialVisibleCount` et `syncUrl` pour `NameSearch` ; `names` pour `FeaturedNames`, `RelatedNames`, `RecentNames` et `RandomDiscovery`. `FavoritesList` reçoit `names`, `initialSearch`, `initialGender`, `initialSort` et `initialVisibleCount`. `NameComparator` reçoit `names` et `initialSelection`. `RelatedNames` reçoit également `returnContext`. Les noms des routes, paramètres d'URL et clés de réponse API restent français lorsqu'ils font partie d'un contrat public.
