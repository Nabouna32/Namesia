# ADR-0025 — Unifier la lecture des fiches sur Material 3

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:18:09 (Europe/Paris)
- **Décision prise le :** 2026-11-23 (heure non consignée)

## Contexte

La fiche est le principal contenu de Namesia, mais plusieurs de ses styles conservaient des couleurs historiques puis étaient corrigés par une couche Fidelity placée en fin de feuille. Le texte éditorial héritait de la couleur primaire, le sommaire ressemblait à une liste de liens soulignés et les ancres pouvaient placer un titre sous la barre supérieure fixe. Les surfaces de découverte et les métadonnées étaient également redéfinies tardivement.

## Challenge

- **Garder la couche tardive :** elle rend l'ordre de cascade déterminant et contredit la règle du dépôt qui impose une seule source de vérité par composant.
- **Transformer le sommaire en navigation complexe :** un composant interactif dédié ou un tablist serait disproportionné ; les liens d'ancrage natifs répondent déjà au besoin.
- **Colorer le texte éditorial en primaire :** cette couleur est un rôle d'action et n'est pas le rôle de lecture courant.
- **Conserver les ancres sous la barre fixe :** cela masque le titre ciblé et nuit au repérage après navigation.

## Décision

- Utiliser `on-surface` pour l'introduction et les textes éditoriaux, et `on-surface-variant` pour les libellés secondaires.
- Présenter les liens natifs du sommaire comme des chips outlined tonales, avec focus clavier explicite, état pressé et survol limité aux pointeurs fins.
- Réserver 88 px au-dessus des rubriques lors d'une navigation par ancre afin de tenir compte de la barre supérieure fixe.
- Utiliser les rôles Fidelity et les tokens de forme directement dans les règles CSS canoniques de la fiche.
- Supprimer les redéfinitions de la fiche dans la couche Fidelity tardive et retirer les anciens dégradés/surfaces concurrents.
- Garder le layout métier et les liens HTML natifs ; ne pas ajouter de dépendance ni de composant React supplémentaire.

## Conséquences

La lecture gagne en contraste et en hiérarchie, le sommaire se comporte comme un contrôle Material accessible sans perdre la sémantique d'un lien, et les ancres ne masquent plus les titres. Les styles de la fiche sont plus prévisibles car leur rendu ne dépend plus d'overrides placés en fin de feuille.

## Validation

Les contrats CI vérifient les rôles de texte, les chips du sommaire, le focus, le décalage des ancres et l'absence de redéfinitions tardives. Aucun test ni build local n'est exécuté.
