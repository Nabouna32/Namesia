# ADR-0024 — Contrat design Material 3 sans alias ni overrides

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

La passe M3 Fidelity a révélé que la feuille globale et les modules CSS n'appliquaient pas encore un contrat unique. Les rôles Material coexistaient avec des alias historiques, des fallbacks de variables, des valeurs typographiques hors échelle et une couche finale de redéfinitions. Le fournisseur de thème est déjà la source active des rôles calculés ; ces couches supplémentaires n'apportent donc aucune capacité nécessaire.

## Challenge

- **Conserver les alias pour faciliter les migrations :** ils prolongent la double nomenclature et permettent aux nouveaux usages de continuer à contourner la source de vérité.
- **Garder les fallbacks de variables :** ils rendent l'interface apparemment robuste mais masquent une donnée de thème ou de catégorie absente.
- **Garder les règles tardives :** elles préservent des déclarations historiques contradictoires et rendent la cascade dépendante de l'ordre du fichier.
- **Remplacer chaque dimension par un token arbitraire :** ce serait créer un second système de design ; seuls les rôles Material, les formes et les contraintes de grille méritent un token partagé.

## Décision

- Les CSS consomment directement les rôles `--md-sys-color-*`, les rôles typographiques `--md-sys-typescale-*`, les formes `--md-sys-shape-*` et les tokens de mouvement/élévation `--md-sys-*`.
- Un unique bloc `:root` fournit les valeurs initiales SSR ; le fournisseur calcule le thème actif et les extensions sémantiques après hydratation.
- Les alias `--color-*`, `--ink`, `--muted`, `--line`, les alias de rayon/police/espacement et les valeurs de secours `var(..., ...)` sont supprimés.
- Les règles de la couche Fidelity finale sont déplacées dans les règles canoniques ou dans les media queries responsives correspondantes.
- L'échelle typographique Material 3 complète est disponible ; seules les graisses 400/500 sont admises, sans capitalisation forcée des labels.
- Les espacements suivent une grille de 4 px ; les formes utilisent exclusivement les tokens Material.
- Les données de domaine invalides échouent explicitement au lieu d'être converties en chaînes vides ou en libellés génériques.

## Conséquences

La cascade devient lisible et les tokens portent une seule signification. Le rendu SSR possède une base déterministe, tandis que les couleurs actives restent calculées par Material Color Utilities. Une donnée de catégorie ou de thème absente n'est plus maquillée par une couleur de secours. Les exceptions propres à un composant restent locales, sans créer de nouvelles primitives globales.

## Références

- [Material 3 — Type scale tokens](https://m3.material.io/styles/typography/type-scale-tokens)
- [Android Developers — Material 3 typography](https://developer.android.com/develop/ui/compose/designsystems/material3)

## Validation

`tests/design-contract.test.mjs` contrôle les alias, fallbacks, blocs racine, règles dupliquées, typographie, rayons, espacements et valeurs par défaut dans les modules de domaine. La CI GitHub Actions est le seul mécanisme de validation.
