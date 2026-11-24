# ADR-0041 — Centraliser les surfaces de contenu avec Card

- **Statut :** acceptée
- **Date :** 2026-11-24
- **Référence :** AndroidX Compose Material 3 1.5.0 stable, commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`

## Contexte

Les résultats, favoris, historique, suggestions, comparateur et prénoms mis en avant portaient chacun leurs propres règles de surface, bordure, forme et état. Cette duplication rendait la fidélité M3 difficile à maintenir et permettait aux pages de diverger.

## Décision

L’implémentation canonique est `components/material3/Card.tsx` et `components/material3/Card.module.css`.

- Introduire le composant `Card` avec les variantes M3 `elevated`, `filled` et `outlined`.
- Autoriser le choix d'un élément HTML sémantique via `as`, sans créer une API métier parallèle.
- Déplacer la surface, la forme, la bordure et l'élévation dans `Card.module.css`.
- Garder dans les CSS Modules des pages uniquement les règles de disposition et de contenu.
- Migrer les cartes de résultats, favoris, historique, suggestions, comparateur et vedette vers `Card`.
- Utiliser `Card` avec `Link` comme élément racine pour les cartes de prénoms entièrement navigables.
- L'indicateur de focus reste défini une seule fois dans le style global ; `Card` ne duplique pas cette règle.

## Conséquences

Les variantes de surface sont cohérentes entre les pages, les décisions de surface sont visibles dans l'API M3 et les pages ne peuvent plus redéfinir localement les couleurs ou formes des cartes. Les CSS Modules gardent le contrôle de la mise en page et de la densité propre à chaque contenu.

## Validation

Les tests vérifient les variantes, les tokens, les usages des pages et l'absence de styles de surface concurrents. La CI GitHub Actions est la seule autorité pour les tests et le build.
