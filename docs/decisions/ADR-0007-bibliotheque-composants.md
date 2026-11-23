# ADR-0007 — Bibliothèque de composants partagés

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

L'interface mélangeait des boutons définis dans les CSS Modules, des classes globales et des styles locaux. Les variantes et leurs états pouvaient diverger selon la page. Les cartes de la vitrine recevaient en outre une classe basée sur leur index, reliée à des rôles de couleur sans signification éditoriale.

## Challenge

- Conserver les styles locaux : simple à court terme, mais entretient les divergences et les répétitions.
- Installer une bibliothèque UI externe : elle ajouterait une dépendance et une migration disproportionnées ; Material Web n'est pas retenue comme fondation maintenue du projet.
- Créer une couche de primitives minimale : mutualise les contrats transversaux tout en laissant les composants métier autonomes.

## Décision

Créer `components/ui/` comme point de centralisation des primitives réellement partagées. La première primitive est `Bouton`, complétée par `LienBouton` pour préserver la sémantique des liens Next.js. Les variantes filled, tonal, outlined et text consomment les rôles Material 3 Fidelity ; la taille icône garantit une cible tactile de 48 px.

Les composants métier conservent leur logique, mais délèguent le rendu des boutons génériques aux primitives. Leur CSS Module reste responsable de la disposition et des particularités métier.

Les cartes de la vitrine ne reçoivent plus de couleur selon leur rang. La palette Rainbow est réservée aux catégories éditoriales identifiables ; la position d'un prénom dans un échantillon n'est pas une donnée sémantique.

## Conséquences

- Les états de base, dimensions, focus et variantes des boutons ont une seule implémentation.
- La bibliothèque reste volontairement petite : pas de système de design abstrait ni de dépendance supplémentaire.
- Les usages historiques de boutons globaux doivent être migrés progressivement lorsqu'ils sont touchés ; cette PR n'affirme pas que toute l'interface a déjà été convertie.
- Chaque nouvelle primitive doit répondre à au moins deux usages réels et figurer dans `docs/composants.md`.

## Validation

La CI doit couvrir le contrat des primitives et l'absence d'affectation chromatique de la vitrine par index. La revue visuelle doit contrôler les états, le contraste et les cibles tactiles en clair/sombre et sur mobile/tablette.
