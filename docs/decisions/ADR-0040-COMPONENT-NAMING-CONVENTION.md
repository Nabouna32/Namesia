# ADR-0040 — Nomenclature anglaise des composants

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:18:09 (Europe/Paris)
- **Décision prise le :** 2026-11-24 (heure non consignée)
- **Complète :** ADR-0037, ADR-0038 et ADR-0039

## Contexte

La migration des primitives UI vers Material 3 a laissé des composants de parcours et des fournisseurs d'état avec des noms français. Ces composants ne sont pas des composants M3 et ne doivent pas être déguisés en primitives. Ils expriment toutefois des responsabilités produit et doivent être identifiables dans le code sans maintenir un vocabulaire technique français parallèle.

## Décision

- Les primitives UI utilisent le nom officiel du composant Material 3 (`Button`, `IconButton`, `SearchBar`, `FilterChip`, `InputChip`, `Icon`, `TopAppBar`, `NavigationBar`, `NavigationRail`).
- Les compositions métier utilisent des noms anglais descriptifs (`FavoriteButton`, `FavoriteList`, `NameSearch`, `NameComparator`, `ComparisonBar`, `NameHistory`, `RandomDiscovery`, `FeaturedNames`, `NameSuggestions`, `ShareLink`, `ShareName`).
- Les context providers et hooks utilisent également des identifiants anglais (`FavoritesProvider`, `HistoryProvider`, `useFavorites`, `useHistory`).
- Les identifiants techniques, noms de fichiers, exports et API de composants sont en anglais. Les libellés et textes visibles du site restent en français.
- Les noms métier ne prétendent pas être des composants Material 3 ; ils composent les primitives M3 et conservent uniquement la logique produit.
- Les anciens fichiers, exports et alias français sont supprimés. Aucun wrapper de compatibilité n'est ajouté.

## Conséquences

Les imports et la structure des fichiers sont prévisibles, les composants métier sont distingués des primitives M3 et les tests empêchent le retour des anciens noms. Les noms du modèle de données, des fonctions SQL et du contenu métier ne sont pas renommés mécaniquement par cette décision.

## Validation

La CI vérifie les fichiers, exports, imports, hooks et l'absence des anciens noms de composants dans l'arborescence React.
