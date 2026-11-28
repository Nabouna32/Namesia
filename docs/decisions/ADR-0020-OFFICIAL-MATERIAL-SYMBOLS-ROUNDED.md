# ADR-0020 — Utiliser les pictogrammes officiels Material Symbols Rounded

- **Statut :** active
- **Version :** 1.2
- **Mis à jour le :** 2026-11-28 11:41:28 (Europe/Paris)
- **Décision prise le :** 2026-11-23 (heure non consignée)

## Contexte

Le registre SVG était centralisé, mais ses tracés étaient des dessins maison assemblés au fil des besoins. Leurs proportions, leur poids visuel et leur niveau de détail ne correspondaient pas exactement à la famille d'icônes d'Android. La tentative précédente de créer une variante pleine pour chacune des destinations supposait aussi que chaque symbole possède réellement une variante FILL distincte, ce qui n'est pas le cas pour tous les pictogrammes Material Symbols.

## Challenge

- **Conserver les tracés maison :** ils sont légers, mais la cohérence visuelle dépend de décisions manuelles et s'éloigne de la référence demandée.
- **Importer toute la bibliothèque SVG :** le projet n'utilise qu'une dizaine de symboles ; installer et charger une collection entière serait disproportionné.
- **Charger une police d'icônes distante :** cela ajoute un réseau, un délai d'affichage et une dépendance à la disponibilité d'un tiers.
- **Forcer un glyphe plein différent pour chaque destination :** cela inventerait des variantes que la bibliothèque officielle ne fournit pas.

## Décision

- Utiliser les tracés Google Material Symbols Rounded, poids 400, pour les pictogrammes fonctionnels actuellement nécessaires.
- Épingler la source au commit Google `10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7` et vérifier en CI les 13 fichiers SVG effectivement utilisés, puis comparer leurs tracés au registre React.
- Conserver les chemins SVG dans un registre local unique, avec la viewBox officielle `0 -960 960 960`, un remplissage `currentColor` et une taille d'affichage adaptée à la grille 24 px.
- Employer une variante pleine uniquement si le symbole possède un dessin FILL distinct. Les symboles Recherche et Comparer conservent leur tracé officiel identique ; leur sélection est signalée par le conteneur tonal et l'état du lien.
- Garder les icônes décoratives pour les technologies d'assistance ; le nom accessible reste porté par le contrôle interactif.
- Utiliser le glyphe officiel `info` pour les encadrés d'information du parcours.
- Réserver `components/material3/Icon.tsx` aux seuls glyphes Google vérifiés. Les pictogrammes de genre propres aux données Namesia sont isolés dans le composant métier `GenderIcon` et `lib/gender-icons.ts` ; ils ne sont pas présentés comme des Material Symbols.
- Ne pas ajouter de dépendance ni de chargement réseau.
- Conserver l'attribution et la licence Apache-2.0 dans `licenses/`.
- Cette décision remplace le volet iconographique de l'ADR-0018 ; ses décisions sur les formulaires et le partage restent applicables.

## Conséquences

- Les pictogrammes partagent les mêmes formes, proportions et poids que la famille Material Symbols Rounded.
- Les icônes sont disponibles immédiatement, sans requête réseau ni flash de police.
- Le dépôt ne contient que les quelques tracés effectivement utilisés.
- Les états actifs restent honnêtes : pas de variante artificielle lorsque le symbole n'en propose pas.

## Validation

Les contrats CI vérifient le viewBox, la couleur héritée, le registre central et les variantes réellement présentes. Aucun test ni build local n'est exécuté.
