# ADR-0011 — Puce de filtre partagée

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

Les filtres de genre et d'initiale du catalogue utilisaient des boutons globaux avec plusieurs séries de règles CSS : styles historiques, adaptations mobiles et overrides Material ajoutés plus tard. La sélection était indiquée uniquement par une inversion de couleur, sans marqueur iconographique.

## Challenge

- Conserver les classes globales : rapide, mais entretient les overrides et ne donne pas de contrat de composant.
- Utiliser le bouton générique : il ne porte pas la sémantique de filtre sélectionnable ni son indicateur.
- Extraire une puce dédiée : mutualise le comportement et l'état visuel sans transformer la logique de filtrage en composant UI.

## Décision

Créer `ChipFiltre` dans `components/ui/`. La puce conserve un bouton natif, `aria-pressed`, une coche visible lorsque le filtre est sélectionné et une surface tonale secondaire. La variante initiale adapte sa largeur et sa typographie sans créer une seconde implémentation.

Le catalogue conserve les genres, les initiales, les règles de sélection et la mise à jour de l'URL. Les anciennes classes globales `.filter-chip` et `.filter-letter`, leurs variantes mobiles et leurs overrides Material sont supprimés.

Les commentaires de la feuille globale qui désignaient encore Material 3 Expressive sont corrigés en Fidelity : la direction actuelle ne doit pas rester contredite par des annotations historiques.

## Conséquences

- Un seul contrat d'interaction et de style pour les filtres du catalogue.
- Les autres écrans peuvent adopter la puce lorsqu'ils exposent un vrai filtre sélectionnable ; ne pas remplacer les sélecteurs natifs par des chips sans raison.
- Aucun état global ni dépendance ajoutée.

## Validation

La CI vérifie l'état pressé, l'indicateur de sélection, le focus visible, l'usage dans le catalogue et la suppression des anciennes classes et références Expressive. Revue visuelle requise pour les groupes longs d'initiales, les contrastes clair/sombre et les petits écrans.
