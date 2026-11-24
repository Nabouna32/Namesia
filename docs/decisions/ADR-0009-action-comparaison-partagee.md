# ADR-0009 — Action de sélection comparative partagée

- **Statut :** remplacée par [ADR-0037](ADR-0037-architecture-composants-material3.md)
- **Portée historique :** la décision décrit l'ancienne organisation. La nomenclature et l'architecture actuelles sont définies par ADR-0037 et `docs/composants.md`.
- **Date :** 2026-11-23

## Contexte

Le catalogue et les favoris permettaient de retenir un prénom pour le comparateur. Les deux écrans dupliquaient le même bouton, le même libellé accessible, l'état sélectionné, l'état désactivé à trois prénoms et le basculement vers une icône compacte sur mobile. Les styles étaient copiés dans deux CSS Modules.

## Challenge

- Garder les deux implémentations : simple en apparence, mais le contrat d'accessibilité et les états risquent de diverger.
- Mutualiser toute la barre de comparaison et la sélection : déplacerait de la logique d'écran et de navigation dans une primitive.
- Mutualiser seulement l'action élémentaire : partage le comportement visuel et accessible, tout en laissant les slugs, la limite, la sélection et la barre aux écrans.

## Décision

Créer `BoutonComparaison` dans `components/ui/`. Il compose le bouton partagé, utilise les variantes outlined/tonal selon l'état, expose un nom accessible décrivant l'action et conserve `aria-pressed`. Sur les fenêtres étroites, le libellé devient une icône dans une cible de 48 px.

Le catalogue et les favoris transmettent le nom, l'état sélectionné, l'état désactivé et leur propre callback. Le contrôle ne connaît ni la sélection globale, ni la limite de trois éléments, ni l'URL.

Les CSS Modules des deux écrans ne définissent plus les styles de cette action.

## Conséquences

- Une seule définition du bouton d'ajout/retrait, de son nom accessible et de son affichage compact.
- La logique de comparaison reste dans chaque écran ; aucun store ou contexte supplémentaire.
- La barre de comparaison et les chips de sélection restent distinctes : leur comportement et leur responsabilité ne sont pas identiques.

## Validation

La CI vérifie l'usage du contrôle par les deux écrans, l'existence des états accessibles et la suppression des styles dupliqués. La revue visuelle contrôle l'état sélectionné/désactivé en clair/sombre et sur téléphone/tablette.
