# ADR-0038 — Migration effective des primitives Material 3

- **Statut :** acceptée
- **Date :** 2026-11-24
- **Version :** 1.0
- **Mis à jour le :** 2026-11-27 20:10:47 (Europe/Paris)
- **Référence :** AndroidX Compose Material 3 1.5.0 stable, commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`
- **Complète :** ADR-0037

## Contexte et challenge

Le contrat documentaire précédent ne suffisait pas : le code conservait encore des composants UI français, des wrappers de lien, un select encapsulé et une seule API pour les boutons iconiques et textuels. Les laisser coexister aurait maintenu deux nomenclatures et deux niveaux d'abstraction. Importer une bibliothèque Compose Android dans Next.js reste impossible et ne serait pas souhaitable.

## Décision

- Migrer les usages vers les primitives React portant les noms Material 3 : `Button`, `IconButton`, `SearchBar`, `FilterChip` et `InputChip`.
- Séparer `Button` et `IconButton` : la taille iconique n'est pas une variante de Button dans Material 3.
- Utiliser directement `Link` de Next.js pour les navigations, avec les classes visuelles de Button ; aucune primitive `ButtonLink` n'est créée.
- Utiliser directement le `select` HTML pour les filtres natifs ; aucune abstraction locale de select n'est conservée.
- Conserver `StatusMessage` comme composition sémantique accessible, non comme primitive M3.
- Garder `FavoriteButton`, `ComparisonButton` et `ComparisonSelection` comme compositions métier, et construire la puce sélectionnée avec `InputChip`.
- Supprimer les anciens fichiers et styles français ; aucun alias ni réexport n'est prévu.

## Conséquences

Les noms techniques des primitives sont alignés sur Material 3. Les textes du site restent en français. Le code continue d'utiliser React, CSS Modules et HTML natif ; seuls les contrats visuels, les variantes, les états et les noms sont repris de la référence AndroidX. Au moment de cette décision, les composants de navigation et de shell restaient une prochaine zone de migration explicite ; cette étape a depuis été réalisée par ADR-0039.

## État actuel

Cette ADR conserve la décision de migration initiale ; elle ne remplace pas l'inventaire courant des composants.

- Le shell a été migré en `TopAppBar`, `NavigationBar` et `NavigationRail` par [ADR-0039](ADR-0039-shell-material-3.md).
- La nomenclature des compositions métier et des hooks a été finalisée par [ADR-0040](ADR-0040-nomenclature-composants.md).
- Les noms intermédiaires `StatusMessage` et `ComparisonButton` cités dans le périmètre initial ne sont pas des primitives de présentation à réintroduire. Le registre actuel et les usages autorisés sont définis dans [Bibliothèque Material 3](../design/COMPONENTS.md).
- Les ports React/HTML restent des implémentations Web des contrats AndroidX ; ils ne sont pas des composants Compose importés dans Next.js.

## Validation

La CI doit couvrir les imports, les composants, l'accessibilité des interactions, les tokens et l'absence des anciens exports. Les tests/build ne sont considérés réussis qu'après confirmation par GitHub Actions.
