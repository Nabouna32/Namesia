# ADR-0006 — Séparer le thème Material Fidelity des accents Rainbow

- **Statut :** remplacée par [ADR-0028](ADR-0028-baseline-material-3-androidx-et-couleurs-semantiques.md)
- **Date :** 2026-11-23
- **Remplace :** [ADR-0005](ADR-0005-material-3-expressive.md)

## Contexte

La demande produit est de rapprocher Namesia d'une application Android Pixel, avec une couleur source violette maîtrisée. La première implémentation a choisi à tort la variante Expressive pour l'ensemble du thème. Elle déplaçait la teinte primaire et ne respectait donc pas l'intention de fidélité à la couleur source.

Le besoin comporte deux usages chromatiques distincts :
- une palette d'interface stable et cohérente, fidèle au violet Namesia ;
- des couleurs variées pour distinguer les catégories éditoriales (par exemple les associations symboliques), sans transformer toute l'interface en arc-en-ciel.

La documentation officielle de Material Color Utilities distingue les variantes Fidelity et Rainbow. Fidelity préserve le caractère de la couleur source dans les rôles du thème ; Rainbow génère une expérience chromatique distincte, utile comme palette d'accent et non comme fondation de toutes les surfaces.

## Options examinées

1. **Expressive partout.** Rejetée : elle privilégie une variation expressive de teinte et ne correspond pas à la demande de fidélité à la couleur source.
2. **Rainbow partout.** Rejetée : trop coloré pour les contrôles, la navigation, les formulaires et les surfaces ; les catégories perdraient leur fonction de différenciation.
3. **Fidelity pour l'interface et Rainbow pour les catégories.** Retenue : deux schémas calculés séparément à partir de la même couleur source, avec des responsabilités explicites.

## Décision

- Utiliser `Variant.FIDELITY` comme schéma principal clair/sombre pour tous les rôles Material de l'interface.
- Calculer en parallèle `Variant.RAINBOW` avec la même source `#6750A4`, la même spécification 2025, la plateforme phone et le même niveau de contraste.
- Exposer les rôles primaire, secondaire et tertiaire du schéma Rainbow comme trois familles de couleurs catégorielles, chacune avec sa couleur, son conteneur et sa couleur de premier plan.
- Affecter les catégories éditoriales à l'une de ces familles de manière déterministe à partir de leur libellé normalisé. Une même catégorie garde ainsi la même teinte dans toutes les fiches et dans le comparateur.
- Conserver le dégradé de marque Namesia uniquement pour les détails décoratifs qui le justifient.
- Garder les actions, la navigation, les surfaces, les formulaires, les focus et les états fonctionnels sur les rôles Fidelity ou leurs rôles sémantiques dédiés.

## Conséquences

- Le violet source demeure la référence de l'identité de l'interface.
- Les catégories sont colorées sans stocker de couleur dans le contenu éditorial ni modifier le contrat JSON ou la base de données.
- Les teintes Rainbow suivent automatiquement le thème clair/sombre et leurs conteneurs conservent une couleur de premier plan adaptée.
- Trois familles catégorielles sont disponibles ; elles peuvent être réévaluées si l'interface révèle un besoin réel de davantage de groupes.
- Le dégradé de marque et les accents catégoriels ne doivent pas être utilisés pour coder des états de succès, d'erreur ou d'avertissement.

## Références

- [Guide officiel Material Color Utilities — création d'un schéma de couleurs](https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/creating_color_scheme.md)
- [Concept officiel Material — Dynamic Color Scheme](https://github.com/material-foundation/material-color-utilities/blob/main/concepts/dynamic_color_scheme.md)

## Validation

La CI vérifie les contrats source du fournisseur et les fallbacks CSS. La revue visuelle doit contrôler les trois teintes sur les fiches et le comparateur, en clair et sombre, avec contraste et cohérence entre les mêmes catégories.
