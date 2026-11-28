# ADR-0014 — Neutralité chromatique de la vitrine de prénoms

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:05:17 (Europe/Paris)
- **Décision prise le :** 2026-11-23 (heure non consignée)

## Contexte

La vitrine de l'accueil présente jusqu'à trois prénoms tirés de différentes zones du catalogue. Les styles globaux conservaient des variantes `.featured-1`, `.featured-2` et `.featured-3` : elles associaient primary, secondary et tertiary à la position de chaque carte. Ces règles n'étaient plus appliquées par le composant, mais restaient une convention trompeuse et une source de régression possible.

## Challenge

- Garder trois couleurs distinctes : cela suggère une différence éditoriale inexistante et contredit la règle selon laquelle Rainbow est réservé aux catégories identifiées.
- Utiliser les rôles primary, secondary et tertiary en rotation : ces rôles sont sémantiques dans Fidelity, pas des couleurs décoratives à distribuer selon l'ordre.
- Uniformiser les cartes sur une surface neutre : la hiérarchie visuelle repose sur la typographie, la forme, le contraste et l'interaction ; le contenu n'est pas artificiellement catégorisé.

## Décision

Supprimer toutes les variantes positionnelles `.featured-1` à `.featured-3` et leurs couleurs de premier plan associées. Les cartes partagent une surface `surface-container-low`, un texte `on-surface`, un contour `outline-variant` et une action `primary`. La lettre décorative reste un accent discret dérivé de primary, sans signification éditoriale.

Adapter aussi la grille aux fenêtres intermédiaires : deux colonnes de 600 à 899 px, trois à partir de 900 px et une sous 600 px.

## Conséquences

- La couleur n'encode plus une position arbitraire dans la vitrine.
- Les catégories éditoriales conservent seules les rôles Rainbow.
- La vitrine garde une hiérarchie visuelle, mais sans différence chromatique non justifiée.
- Les règles CSS historiques ne peuvent pas réintroduire silencieusement les anciennes variantes ; un contrat CI couvre leur absence et l'usage de la surface neutre.

## Validation

La CI vérifie le contrat CSS et le composant. La revue visuelle doit notamment contrôler le contraste des cartes en clair et sombre ainsi que la grille sur fenêtre intermédiaire. Aucun contrôle local n'est exécuté.
