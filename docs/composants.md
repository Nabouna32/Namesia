# Bibliothèque de composants — Namesia

- **Statut :** inventaire des composants partagés réellement disponibles
- **Mis à jour :** 2026-11-24

Ce document est le point d'entrée pour les composants d'interface réutilisables. Il distingue les primitives de présentation des composants métier. Il ne constitue pas une obligation de conserver un composant : chaque élément reste soumis au challenge produit et technique.

## Principes

- Une primitive partagée porte une interaction ou un contrat visuel commun, pas seulement un nom générique.
- Les variantes sont explicites et reposent sur les rôles système M3 Fidelity, calculés depuis la source de baseline M3 `#6750A4`. Les extensions propres à Namesia utilisent `--namesia-*` et ne sont jamais nommées comme des rôles système.
- Une couleur ne doit jamais être attribuée selon la position d'un élément dans une liste. Rainbow est réservé à une catégorie éditoriale identifiée.
- Les CSS Modules des composants métier gèrent leur disposition ; les primitives partagées gèrent leur apparence et leurs états communs. Toute règle `:hover` est réservée aux pointeurs fins ; les interactions tactiles utilisent `:active`. Les composants interactifs suivent les mêmes cibles tactiles, transitions et états pressed/focus ; le mouvement et ses durées viennent des tokens globaux.
- Préférer les éléments HTML natifs et les liens Next.js. Garder distincts les contrôles interactifs et les liens de navigation.
- Une primitive est extraite après identification d'au moins deux usages concrets ; elle ne doit pas absorber la logique métier des écrans.

## Primitives partagées

| Composant | Emplacement | Responsabilité |
|---|---|---|
| `IconeMaterial` | `components/icone-material.tsx` | Registre unique des tracés Google Material Symbols Rounded 400, SVG locaux 24 px et variantes pleines disponibles |
| `Bouton` | `components/ui/bouton.tsx` | Action native avec variantes filled, tonal, outlined et text ; typographie `label-large` M3 et tailles standard et icône, utilisée par l'administration, les actions d'effacement de l'historique et des recherches, et la sélection comparative |
| `LienBouton` | `components/ui/lien-bouton.tsx` | Navigation Next.js présentée comme une action, notamment pour ouvrir le comparateur depuis la barre de sélection |
| `ChampRecherche` | `components/ui/champ-recherche.tsx` | Champ de recherche contrôlé, libellé accessible, icône, effacement et états Material partagés |
| `BoutonComparaison` | `components/ui/bouton-comparaison.tsx` | Sélection comparative accessible, état sélectionné, limite désactivée et adaptation mobile |
| `ListeSelectionComparaison` | `components/ui/liste-selection-comparaison.tsx` | Liste sémantique des prénoms retenus, retrait individuel et puces tonales |
| `ChipFiltre` | `components/ui/chip-filtre.tsx` | Filtre sélectionnable avec typographie `label-large` M3, état pressé, indicateur de sélection et variante initiale |
| `ChampSelect` | `components/ui/champ-select.tsx` | Sélecteur natif contrôlé, libellé associé et options typées |
| `MessageStatut` | `components/ui/message-statut.tsx` | Message inline accessible avec variantes success, warning, info et error ; couleurs sémantiques personnalisées M3 pour les trois premières |
| `PartagerLien` | `components/partager-fiche.tsx` | Partage natif ou copie d'une URL reconstruite avec une liste explicite de paramètres autorisés |

Les boutons et FilterChip utilisent le rôle typographique système `label-large` (taille, graisse, interligne et approche), comme les composants Button et FilterChip AndroidX Material 3. La variante initiale de FilterChip conserve ce rôle au lieu de lui substituer un style body. Les libellés de `NavigationBar` et `NavigationRail` utilisent `label-medium`, conformément aux tokens AndroidX `NavigationBarTokens.LabelTextFont` et `NavigationRailVerticalItemTokens.LabelTextFont`. Les contrôles partagés reposent sur les tokens Fidelity et conservent les éléments natifs. `ChipFiltre` et `ListeSelectionComparaison` réservent le survol aux pointeurs fins et exposent un état pressé adapté au tactile. Le champ de recherche délègue son action d'effacement à la variante textuelle iconique de `Bouton` ; le bouton de suppression natif du navigateur est masqué pour éviter deux affordances concurrentes. Après effacement, le focus revient dans le champ pour permettre une nouvelle saisie immédiate au clavier. `ChampSelect` garde le comportement natif du sélecteur : il ne simule pas un menu personnalisé. Les composants métier gardent leurs règles de recherche, de synchronisation d'URL et de sélection ; les contrôles de comparaison ne connaissent ni la limite métier ni la synchronisation d'URL. La liste partagée reçoit les identités à afficher et un callback de retrait.

## Composants métier

Les composants comme `BoutonFavori`, `NavigationAdaptative`, `RecherchePrenoms` et `ComparateurPrenoms` restent propriétaires de leur logique métier. Ils doivent composer les primitives partagées au lieu de redéfinir les styles d'un contrôle générique.

## Correspondance avec les composants Material 3

Les noms M3 ci-dessous sont les noms de référence. Les noms de code français sont les adaptateurs Web de Namesia ; ils ne redéfinissent pas le composant Android.

| Nom Material 3 | Implémentation Namesia | Contrat à respecter |
|---|---|---|
| [`MaterialTheme`](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MaterialTheme.kt) / [`ColorScheme`](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/ColorScheme.kt) | `lib/material-theme.ts` + `MaterialThemeProvider` | Source M3 baseline, rôles Fidelity, modes clair/sombre et extensions déclarées uniquement |
| [`TopAppBar`](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/AppBar.kt) | Barre supérieure du shell dans `app/layout.tsx` et `app/globals.css` | Hauteur, alignement, rôles et comportement M3 ; pas de barre propriétaire par page |
| [`NavigationBar`](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt) | `NavigationAdaptative` sur fenêtre compacte | Conteneur 64 dp, destinations de premier niveau, icône, libellé `label-medium` et indicateur sélectionné |
| [`NavigationRail`](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationRail.kt) | `NavigationAdaptative` sur fenêtre medium/expanded | Même destinations et état que la NavigationBar ; libellé `label-medium` |
| [`Button`](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt) | `Bouton` | Variantes Filled, Filled Tonal, Outlined et Text ; une seule implémentation partagée |
| [`TextField`](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/TextField.kt) | `ChampRecherche`, `ChampSelect` et champs natifs de formulaire | Libellé visible ou accessible, hauteur, contour, focus, erreur et comportement natif |
| [`FilterChip`](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Chip.kt) | `ChipFiltre` | Sélection explicite, coche, état pressé et cible tactile |
| `InputChip` | `ListeSelectionComparaison` | Élément sélectionné avec action de retrait explicite |
| `Icon` / [`IconButton`](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/IconButton.kt) | `IconeMaterial` + variante iconique de `Bouton` | Glyphe Material Symbols Rounded, cible interactive portée par le bouton |
| [`Card`](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Card.kt) | Cartes métier `name-card`, cartes vedettes et cartes d'association | Sémantique `article`, rôles de surface/contour, densité et états cohérents ; ne pas créer un nouveau style de carte par page |
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
2. Identifier le composant M3 correspondant et son nom officiel avant de créer un composant Namesia.
3. Composer le shell existant ; ne pas recréer une barre supérieure, une navigation, des boutons ou des champs locaux.
4. Réutiliser les primitives existantes. Une nouvelle primitive doit correspondre à un composant M3 identifiable et à un besoin réel ; elle est ajoutée ici avec ses variantes et états.
5. Utiliser exclusivement les rôles `--md-sys-*` et les extensions `--namesia-*` documentées. Aucun hex, couleur arbitraire, gradient ou fallback CSS dans une page.
6. Couvrir repos, hover sur pointeur fin, focus-visible, pressed, selected, disabled, loading et error selon le composant.
7. Vérifier clair/sombre, largeur 320 px, 600 px, 840 px et grand écran, clavier, zoom et réduction des mouvements.
8. Si un comportement ne possède pas d'équivalent Web M3, utiliser l'élément natif le plus proche et consigner la limite du navigateur plutôt que fabriquer une imitation Android.

## Ajouter ou faire évoluer un composant

Avant de créer une primitive, vérifier qu'au moins deux usages réels partagent le même comportement. Définir les variantes et états nécessaires, puis migrer les usages concernés. Éviter les composants fourre-tout et les abstractions basées uniquement sur des classes CSS. Supprimer les anciens styles devenus inutiles, mettre à jour cet inventaire et ajouter des contrats CI lorsque le comportement partagé change.
