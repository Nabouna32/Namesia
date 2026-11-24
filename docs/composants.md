# Bibliothèque de composants — Material 3

- **Statut :** contrat canonique de l'interface
- **Mis à jour :** 2026-11-24
- **Référence :** AndroidX Compose Material 3 1.5.0 stable, commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`
- **Décisions :** [ADR-0037 — Utiliser directement les composants Material 3](decisions/ADR-0037-composants-material-3-directs.md) · [ADR-0038 — Migration effective des primitives](decisions/ADR-0038-migration-effective-material-3.md) · [ADR-0039 — Shell Material 3](decisions/ADR-0039-shell-material-3.md) · [ADR-0040 — Nomenclature des composants](decisions/ADR-0040-nomenclature-composants.md)

Ce document définit les composants d'interface autorisés et leur composition. Le nom Material 3 est le nom du composant dans le code : il n'existe pas de vocabulaire de primitives parallèle propre à Namesia. L'implémentation React traduit les contrats AndroidX en HTML/CSS accessibles ; elle n'importe pas Compose dans le navigateur.

## 1. Règles d'architecture

- Les primitives UI, lorsqu'elles sont réellement utilisées, portent leur nom Material 3 officiel : `Button`, `IconButton`, `SearchBar`, `TextField`, `FilterChip`, `InputChip`, `Card`, `TopAppBar`, `NavigationBar`, `NavigationRail`, etc.
- Les fichiers, exports, props et variantes suivent la nomenclature et les conventions M3. Les identifiants techniques des primitives ne sont pas traduits en français.
- Les composants métier (favoris, comparaison, catalogue, fiche) restent des composants métier ; ils composent les composants M3 et ne créent pas de primitives UI concurrentes.
- Un lien de navigation demeure un lien HTML/Next.js, même lorsqu'il reçoit l'apparence d'un `Button`. Un `select` demeure un élément HTML natif.
- Ne pas implémenter par anticipation des composants M3 sans besoin réel. Ne pas créer de faux équivalents à Dialog, Menu, BottomSheet ou FAB.
- Aucun alias, export historique, wrapper purement nominal, couche de compatibilité ou fallback visuel. Une migration renomme tous les usages et supprime les anciens fichiers et styles dans la même évolution.
- Les différences Android/Web sont limitées aux frontières réelles du navigateur : sémantique HTML, navigation, clavier, focus, lecteurs d'écran et cible tactile. Elles sont documentées, pas maquillées.
- Les CSS Modules des composants métier gèrent leur composition et leur disposition ; ils ne redéfinissent pas l'anatomie d'un composant M3.
- Les couleurs proviennent des rôles Fidelity et des seules extensions `--namesia-*` documentées dans [le système de design](design.md). Rainbow est réservé aux catégories éditoriales stables. Les couleurs success/warning/info restent des extensions sémantiques personnalisées, pas des rôles système M3.

## 2. Catalogue Material 3

| Composant | Usage sur le site | Contrat de référence |
|---|---|---|
| `MaterialTheme` / `ColorScheme` | Thème global clair/sombre | Rôles Fidelity calculés et extensions explicites |
| `TopAppBar` | Barre supérieure commune | Anatomie, hauteur, alignement et couleurs AndroidX |
| `NavigationBar` | Navigation compacte | Navigation de premier niveau, `NavigationBarTokens.TallContainerHeight = 80 dp`, indicateur et libellés `label-medium` |
| `NavigationRail` | Navigation medium/expanded | Navigation de premier niveau, rail de 80 dp et libellés `label-medium` |
| `Button` | Actions textuelles | Filled, Filled Tonal, Outlined et Text ; géométrie et états AndroidX |
| `IconButton` | Actions iconiques | Icône de 24 dp et cible tactile Web adaptée |
| `SearchBar` | Recherche du catalogue et des parcours | Champ replié AndroidX de 56 dp ; pas de faux panneau expansé |
| `TextField` | Saisie de formulaire | Variantes et états correspondant au besoin |
| `FilterChip` | Filtres sélectionnables | `FilterChipTokens.ContainerHeight = 32 dp`, cible tactile de 48 px, sélection explicite |
| `InputChip` | Éléments sélectionnés et retrait | Anatomie et action de suppression M3 |
| `Card` | Contenu éditorial et résultats | Variantes Elevated, Filled ou Outlined selon la hiérarchie |
| `Icon` | Pictogrammes | Material Symbols ; la cible interactive appartient à `IconButton` |
| `Select` HTML | Choix natif | Conserver le contrôle natif du navigateur |

Les liens de référence AndroidX et les valeurs vérifiées sont centralisés dans [material-3-verification.md](material-3-verification.md) et la source AndroidX est épinglée [ici](https://github.com/androidx/androidx/blob/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt). Les tokens et leur usage visuel sont définis dans [design.md](design.md).

## 3. Implémentation Web

Les primitives présentes dans le code sont directement nommées d'après Material 3 :

| Composant | Fichier | Responsabilité |
|---|---|---|
| `TopAppBar` | `components/ui/TopAppBar.tsx` | Barre supérieure compacte et marque du site |
| `NavigationBar` | `components/ui/NavigationBar.tsx` | Navigation compacte en bas |
| `NavigationRail` | `components/ui/NavigationRail.tsx` | Navigation latérale sur fenêtres medium/expanded |
| `Button` | `components/ui/Button.tsx` | Actions textuelles Filled, Filled Tonal, Outlined et Text |
| `IconButton` | `components/ui/IconButton.tsx` | Actions iconiques, cible Web de 48 px et conteneur visuel de 40 px |
| `SearchBar` | `components/ui/SearchBar.tsx` | Recherche repliée de 56 dp et effacement par IconButton |
| `FilterChip` | `components/ui/FilterChip.tsx` | Filtre sélectionnable, conteneur visuel de 32 dp |
| `InputChip` | `components/ui/InputChip.tsx` | Élément sélectionné avec action de retrait |
| `Icon` | `components/ui/Icon.tsx` | Pictogrammes Material Symbols Rounded |
| `Card` | `components/ui/Card.tsx` | Variantes Elevated, Filled et Outlined, sémantique native via `as` |

`NavigationBar` et `NavigationRail` partagent uniquement le rendu des destinations via `NavigationDestinations` ; les deux composants M3 restent distincts dans le shell. `TopAppBar` porte la barre supérieure. `Card` centralise la surface des résultats, favoris, historique, suggestions, comparateur et prénoms mis en avant. Les composants métier `FavoriteButton`, `FavoriteList`, `NameSearch`, `NameComparator`, `ComparisonBar`, `ComparisonButton`, `ComparisonSelection`, `NameHistory`, `RandomDiscovery`, `FeaturedNames`, `NameSuggestions`, `ShareLink` et `ShareName` portent les parcours produit ; ils composent les primitives M3 sans redéfinir leur anatomie. Les context providers sont `FavoritesProvider` et `HistoryProvider`, exposant `useFavorites` et `useHistory`. `StatusMessage` est une composition sémantique de statut accessible (annonce `status` ou `alert`) et des extensions de couleur Namesia ; ce n'est pas un composant Material 3. Les liens de navigation utilisent directement `Link` de Next.js avec les styles de `Button`, sans wrapper. Les filtres de favoris utilisent `select` HTML natif, sans abstraction de formulaire supplémentaire.

Les anciennes primitives françaises, leurs feuilles CSS et leurs exports sont supprimés dans la même migration. Aucun alias de compatibilité ne subsiste. Les noms métier du domaine restent français dans le contenu visible ; les identifiants des primitives UI suivent Material 3.

## 4. Recettes de composition

| Page | Composition attendue |
|---|---|
| Accueil | Shell commun, hiérarchie typographique M3, `SearchBar`, `Card`, `Button` |
| Catalogue | Shell commun, `SearchBar`, `FilterChip`, `Card`, `InputChip` |
| Fiche prénom | Shell commun, hiérarchie de lecture M3, liens natifs, `Card`, `Button` |
| Comparateur | Shell commun, `SearchBar`, `Card`, `InputChip`, `Button` |
| Favoris | Shell commun, `SearchBar`, `select` natif, `InputChip`, `Card` |
| Administration | Shell commun, `TextField`, `Button`, `Card`, couleurs sémantiques personnalisées |

## 5. Règles pour toute évolution

1. Lire `docs/design.md` et `docs/material-3-verification.md` avant de créer ou refondre un écran.
2. Identifier le composant M3 réel et sa source AndroidX épinglée.
3. Employer directement son nom officiel dans les fichiers, exports et usages.
4. Utiliser les éléments HTML natifs adaptés et préserver leur sémantique.
5. Consommer les tokens `--md-sys-*` et les seules extensions `--namesia-*` documentées. Aucun hex arbitraire, alias, fallback CSS ou couche d'override finale.
6. Couvrir les états définis par le composant : repos, survol sur pointeur fin, focus visible, pression, sélection, désactivation, chargement et erreur lorsqu'ils s'appliquent.
7. Vérifier clair/sombre, 320, 600, 840 px et grand écran, clavier, zoom, lecteurs d'écran et réduction des mouvements.
8. Supprimer les anciennes implémentations, fichiers et styles au moment de la migration ; ne pas maintenir deux systèmes en parallèle.

## 6. Extraction et réutilisation

Une implémentation partagée doit répondre à un besoin concret et récurrent. Ne pas créer de composant générique pour un seul écran, de composant fourre-tout ou d'abstraction fondée uniquement sur une classe CSS. Le composant M3 est la source de vérité ; les règles métier restent dans les composants métier.
