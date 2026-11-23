# ADR-0013 — Suppression des boutons globaux historiques

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

Après l'introduction des primitives `Bouton` et `LienBouton`, quelques actions utilisaient encore les classes globales `.button` / `.button-dark`, tandis que l'administration définissait sa propre variante `.secondary`. Ces styles pouvaient diverger du composant partagé et contredisaient l'objectif d'une source de vérité unique.

## Challenge

- Conserver les classes historiques : aucune migration immédiate, mais deux systèmes de styles continuent à coexister.
- Multiplier les variantes dans chaque CSS Module : déplace le problème sans le résoudre.
- Migrer les actions restantes vers les primitives : unifie les dimensions, les états et les couleurs sans déplacer les logiques d'écran.

## Décision

Migrer les actions de connexion, import, publication, déconnexion et prévisualisation de l'administration vers `Bouton`, avec les variantes filled et outlined. Migrer l'export des favoris et la relance du comparateur vers `Bouton`, et le lien d'exploration vide des favoris vers `LienBouton`.

Supprimer les styles globaux `.button` et `.button-dark`, les adaptations responsive associées et le style local `.secondary` de l'administration. Les CSS Modules métier gardent uniquement les particularités de disposition.

## Conséquences

- Les variantes de bouton ont une seule source de vérité dans `components/ui/bouton.module.css`.
- Les actions conservent leurs types natifs, leurs gestionnaires et leurs états désactivés.
- Les boutons propres à une interaction spécifique (import de fichier, copie, partage, historique) gardent leurs composants et styles tant qu'ils n'ont pas le même contrat.
- Pas de dépendance ajoutée.

## Validation

La CI vérifie la migration des écrans, l'absence des anciennes classes et l'usage des primitives. Revue visuelle nécessaire pour les variantes filled/outlined, l'administration et les états désactivés en clair/sombre.
