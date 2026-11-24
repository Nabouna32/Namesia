# Bibliothèque de composants — Namesia

- **Statut :** inventaire des composants partagés réellement disponibles
- **Mis à jour :** 2026-11-24

Ce document définit le contrat canonique des composants d'interface. Il distingue les composants Material 3 (noms et API M3) des composants métier Namesia. Une implémentation React peut adapter le comportement à HTML et au navigateur, mais ne crée pas une nomenclature parallèle. L'inventaire du code est un état de migration, pas une liste de composants à sanctuariser.

## Principes

- **Nommage canonique :** les primitives d'interface portent le nom officiel du composant Material 3 qu'elles implémentent (`Button`, `IconButton`, `SearchBar`, `TextField`, `FilterChip`, `InputChip`, `Card`, `NavigationBar`, `NavigationRail`, `TopAppBar`, `Dialog`, `Menu`, etc.). Les fichiers, exports, props et variantes suivent autant que possible l'API M3 ; aucune couche de traduction française ou alias `*Namesia` n'est conservée.
- **Frontière métier :** les composants qui représentent une capacité produit (favori, comparaison, fiche, catalogue) peuvent garder un nom métier. Ils composent les primitives M3 et ne redéfinissent jamais leur apparence.
- **Pas de compatibilité cosmétique :** pas d'exports alias, de réexport legacy, de wrappers uniquement destinés à préserver un ancien nom, de fallback visuel ou de second système de composants. Une migration renomme les usages et supprime les anciens fichiers/styles dans la même évolution.
- **Correspondance réelle :** ne pas choisir un composant M3 par simple proximité de nom. Reprendre son anatomie, ses variantes, ses états et ses tokens AndroidX. Si le besoin Web ne correspond pas au composant, utiliser le bon élément HTML natif plutôt que créer un faux composant M3.
- **Aucune API Android dans le navigateur :** AndroidX Compose est la référence d'implémentation, pas une dépendance exécutable du site. Les traductions Web sont écrites en React/HTML sémantique et documentent uniquement les écarts imposés par la plateforme.

- Une primitive partagée porte une interaction ou un contrat visuel commun, pas seulement un nom générique.
- Les variantes sont explicites et reposent sur les rôles système M3 Fidelity, calculés depuis la source de baseline M3 `#6750A4`. Les extensions propres à Namesia utilisent `--namesia-*` et ne sont jamais nommées comme des rôles système.
- Une couleur ne doit jamais être attribuée selon la position d'un élément dans une liste. Rainbow est réservé à une catégorie éditoriale identifiée.
- Les CSS Modules des composants métier gèrent leur disposition ; les primitives partagées gèrent leur apparence et leurs états communs. Toute règle `:hover` est réservée aux pointeurs fins ; les interactions tactiles utilisent `:active`. Les composants interactifs suivent les mêmes cibles tactiles, transitions et états pressed/focus ; le mouvement et ses durées viennent des tokens globaux.
- Préférer les éléments HTML natifs et les liens Next.js. Garder distincts les contrôles interactifs et les liens de navigation.
- Une primitive est extraite après identification d'au moins deux usages concrets ; elle ne doit pas absorber la logique métier des écrans.

## Primitives Material 3

Le code cible expose directement les composants M3, dans un espace de noms organisé par composant. Les noms ci-dessous sont normatifs ; le chemin actuel entre parenthèses signale un fichier à migrer, il ne constitue pas un alias autorisé.

| Composant Material 3 | Contrat Web |
|---|---|
| `MaterialTheme` / `ColorScheme` | Thème global, rôles Fidelity clair/sombre et extensions de couleurs explicitement documentées |
| `TopAppBar` | Barre supérieure commune du shell |
| `NavigationBar` | Navigation de premier niveau sur fenêtre compacte |
| `NavigationRail` | Navigation de premier niveau sur fenêtre medium/expanded |
| `Button` | Variantes Filled, Filled Tonal, Outlined et Text |
| `IconButton` | Action iconique avec cible tactile adaptée |
| `SearchBar` | Recherche repliée correspondant à l'anatomie AndroidX ; les résultats restent dans le flux de page si le parcours Web ne requiert pas l'expansion |
| `TextField` | Saisie de formulaire, variantes Filled et Outlined selon le besoin |
| `FilterChip` | Filtre sélectionnable avec état et géométrie AndroidX |
| `InputChip` | Élément sélectionné avec action de retrait |
| `Card` | Surfaces de contenu Filled, Elevated ou Outlined selon la hiérarchie réelle |
| `Select` HTML | Sélection native lorsque le menu du navigateur est le comportement approprié |
| `Icon` | Glyphe Material Symbols ; la cible interactive appartient à `IconButton` |

### Migration de l'implémentation existante

Les fichiers ci-dessous sont des reliquats de l'ancienne architecture et doivent disparaître au profit des composants M3 nommés ci-dessus : `components/ui/bouton.tsx` (`Button`), `lien-bouton.tsx` (lien natif Next.js avec présentation `Button`, sans primitive distincte), `champ-recherche.tsx` (`SearchBar`), `chip-filtre.tsx` (`FilterChip`), `champ-select.tsx` (élément HTML `select` directement composé) et `message-statut.tsx` (composition sémantique de `Card`/contenu et couleurs personnalisées, sans prétendre qu'il s'agit d'un composant M3). Les exports et noms français historiques ne sont pas conservés comme compatibilité.

Les styles doivent vivre avec l'implémentation du composant concerné. Les variantes et états sont ceux de M3 ; les dimensions Web supplémentaires ne sont admises que pour garantir les contraintes tactiles et sémantiques du navigateur. Les tokens système restent la source de vérité.

## Composants métier

Les composants métier comme `FavoriteButton`, `NameComparison`, `NameSearch` et `NameComparator` portent exclusivement la logique du produit. Leur nomenclature sera également normalisée en anglais pour les composants React ; les textes visibles restent en français. Ils composent les composants Material 3 sans les encapsuler dans des wrappers de compatibilité.

## Correspondance avec les composants Material 3

Les noms M3 sont les seuls noms autorisés pour les primitives. La colonne d'implémentation historique est supprimée : le nom M3 est celui de l'export et du fichier.

| Composant Material 3 | Contrat à respecter |
|---|---|---|
| [`MaterialTheme`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialTheme.kt) / [`ColorScheme`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ColorScheme.kt) | `lib/material-theme.ts` + `MaterialThemeProvider` | Source M3 baseline, rôles Fidelity, modes clair/sombre et extensions déclarées uniquement |
| [`TopAppBar`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/AppBar.kt) | Barre supérieure du shell dans `app/layout.tsx` et `app/globals.css` | Hauteur, alignement, rôles et comportement M3 ; pas de barre propriétaire par page |
| [`FilterChip`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Chip.kt) et [`FilterChipTokens`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilterChipTokens.kt) | `ChipFiltre` | Hauteur visuelle 32 dp, cible interactive 48 dp, contour `outline-variant` au repos, surface secondaire sans contour en sélection, icône de coche et rôle `label-large`
| [`NavigationBar`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt) | `NavigationAdaptative` sur fenêtre compacte | Conteneur 80 dp (`TallContainerHeight` du `NavigationBar()` stable), destinations de premier niveau, icône, libellé `label-medium` et indicateur sélectionné |
| [`NavigationRail`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationRail.kt) | `NavigationAdaptative` sur fenêtre medium/expanded | Même destinations et état que la NavigationBar ; libellé `label-medium` |
| [`Button`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt) | `Bouton` | Variantes Filled, Filled Tonal, Outlined et Text ; conteneur 40 dp, cible 48 px, largeur minimale 58 dp, padding et états AndroidX |
| [`IconButton`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt) | `Bouton taille="icon"` | Cible tactile 48 px, conteneur 40 dp, icône 24 dp et couleurs standard ou outlined selon la variante |
| [`SearchBar`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SearchBar.kt) | `ChampRecherche` | Champ replié de 56 dp, forme `full`, `surface-container-high`, saisie `body-large`, icônes `on-surface` / `on-surface-variant` ; les résultats restent dans le flux Namesia, sans faux panneau expansé |
| [`TextField`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/TextField.kt) | Champs natifs de formulaire | Libellé, hauteur, contour ou indicateur selon la variante, focus, erreur et comportement natif |
| `InputChip` | `ListeSelectionComparaison` | Élément sélectionné avec action de retrait explicite |
| `Icon` / [`IconButton`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt) | `IconeMaterial` + variante iconique de `Bouton` | Glyphe Material Symbols Rounded, cible interactive portée par le bouton |
| [`Card`](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Card.kt) | Cartes métier `name-card`, cartes vedettes et cartes d'association | Sémantique `article`, rôles de surface/contour, densité et états cohérents ; ne pas créer un nouveau style de carte par page |
| Couleurs personnalisées M3 | `MessageStatut` | `success`, `warning`, `info` sont des extensions sémantiques Namesia avec quatre rôles tonals ; `error` utilise le ColorScheme M3 |
| `Select` natif | `ChampSelect` | Exception de frontière navigateur : conserver le menu natif, ne pas le remplacer par un faux menu inaccessible |

Les composants M3 non encore nécessaires (Dialog, Menu, Bottom Sheet, FAB, Date Picker, etc.) ne sont pas à simuler avec une composition improvisée. Lorsqu'un besoin réel apparaît, consulter d'abord les spécifications M3 et l'implémentation AndroidX correspondante, puis ajouter un adaptateur Web partagé si le comportement se répète. Le choix d'un élément HTML natif est autorisé lorsqu'il constitue la meilleure traduction Web ou une limite réelle du navigateur ; cette exception doit être explicitement notée.

## Recettes de composition des pages

| Page | Composition M3 attendue |
|---|---|
| Accueil | Shell commun, hiérarchie de titres, Search/TextField, Card pour la découverte, Button pour les actions |
| Catalogue | Shell commun, TextField de recherche, FilterChip, Card de résultat et InputChip pour la sélection comparative |
| Fiche prénom | Shell commun, hiérarchie de lecture, liens/chips pour le sommaire, Card pour les blocs éditoriaux et actions Button |
| Comparateur | Shell commun, TextField, Card pour les options et les résultats, InputChip pour la sélection, Button pour les actions |
| Favoris | Shell commun, TextField, Select natif, InputChip, Card de résultat et MessageStatut |
| Administration | Shell commun, TextField natifs, Button partagé, Card de prévisualisation et MessageStatut |

## Contrat obligatoire pour toute nouvelle page

1. Lire `docs/design.md` et cette bibliothèque avant de créer le JSX ou le CSS.
2. Utiliser directement le nom officiel M3 pour toute primitive d'interface ; ne jamais créer de doublon ou d'alias Namesia.
3. Composer le shell existant ; ne pas recréer une barre supérieure, une navigation, des boutons ou des champs locaux.
4. Réutiliser les composants M3 existants. Une nouvelle implémentation doit correspondre à un composant M3 identifiable et à un besoin réel ; elle est ajoutée ici avec ses variantes et états.
5. Utiliser exclusivement les rôles `--md-sys-*` et les extensions `--namesia-*` documentées. Aucun hex, couleur arbitraire, gradient ou fallback CSS dans une page.
6. Couvrir repos, hover sur pointeur fin, focus-visible, pressed, selected, disabled, loading et error selon le composant.
7. Vérifier clair/sombre, largeur 320 px, 600 px, 840 px et grand écran, clavier, zoom et réduction des mouvements.
8. Si un comportement ne possède pas d'équivalent Web M3, utiliser l'élément natif le plus proche et consigner la limite du navigateur plutôt que fabriquer une imitation Android. Aucun fallback, alias ou wrapper de compatibilité n'est ajouté.

## Ajouter ou faire évoluer un composant

Avant de créer une primitive, vérifier qu'au moins deux usages réels partagent le même comportement. Définir les variantes et états nécessaires, puis migrer les usages concernés. Éviter les composants fourre-tout et les abstractions basées uniquement sur des classes CSS. Supprimer les anciens styles devenus inutiles, mettre à jour cet inventaire et ajouter des contrats CI lorsque le comportement partagé change.
