# ADR-0010 — Liste de sélection comparative partagée

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

La barre de comparaison du catalogue et le pied du sélecteur comparateur affichaient les prénoms retenus. Les deux écrans répétaient le balisage de liste, le bouton de retrait individuel, son nom accessible et les styles des puces. Les styles étaient globaux et liés à des noms de classes utilisés uniquement par ces deux emplacements.

## Challenge

- Conserver les deux listes : faible coût immédiat, mais le comportement clavier et les styles restent couplés à des règles globales.
- Fusionner toute la barre et le pied de sélection : leurs actions de navigation et d'effacement diffèrent ; les fusionner forcerait des variantes artificielles.
- Mutualiser seulement la liste et le retrait individuel : même interaction et même rendu, tout en laissant le statut, l'effacement global et le lien de comparaison aux parents.

## Décision

Créer `ListeSelectionComparaison` dans `components/ui/`. Le composant reçoit les prénoms, un libellé accessible et un callback de retrait. Il conserve une liste HTML native, un bouton de retrait nommé par prénom et une puce tonale Fidelity avec icône de fermeture.

La barre du catalogue et le comparateur gardent leurs actions contextuelles, leurs compteurs et leur logique de sélection. Les anciennes classes globales `.compare-selected-list` et `.compare-selected-item` sont supprimées.

L'icône de fermeture est ajoutée à la petite bibliothèque SVG Material existante afin d'éviter le caractère typographique « × » comme substitut d'icône.

## Conséquences

- Une seule implémentation du retrait individuel et de l'apparence des prénoms sélectionnés.
- Les contextes gardent leurs propres compteurs et actions globales.
- Pas de nouvel état partagé, de dépendance ou de changement d'URL.
- La liste reste masquée lorsqu'elle ne contient aucun prénom.

## Validation

La CI vérifie les deux usages, le libellé accessible, la cible tactile et la suppression des styles globaux. La revue visuelle contrôle les puces longues, les retours à la ligne et les contrastes en clair/sombre sur mobile et tablette.
