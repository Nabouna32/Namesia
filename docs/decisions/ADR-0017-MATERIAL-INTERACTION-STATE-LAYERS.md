# ADR-0017 — Couches d'état Material pour les interactions

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

Les actions partagées et les cartes utilisaient encore des filtres de luminosité, des translations et des ombres au survol. Ces effets sont des conventions Web génériques, pas le modèle d'interaction Material 3. Ils produisent en outre un déplacement visuel sur les cartes et une réponse différente entre souris et écran tactile.

## Challenge

- **Garder les filtres brightness :** ils modifient la couleur elle-même et peuvent dégrader les contrastes.
- **Ajouter une animation de zoom au clic :** le déplacement n'apporte aucune information sur l'état et s'écarte du modèle Material.
- **Ajouter une bibliothèque d'animation :** inutile pour des couches d'état simples déjà réalisables en CSS.

## Décision

- Les boutons partagés superposent une couche de couleur héritée (`currentColor`) : 8 % au survol (pointeur fin), 12 % au focus visible et à la pression.
- La couche ne capte pas les événements et respecte les cibles tactiles existantes.
- Les cartes de prénoms réagissent par un changement de surface tonale ; aucune translation ni ombre supplémentaire n'est appliquée au survol.
- Les durées et courbes proviennent des tokens globaux ; les animations décoratives restent exclues des interactions fonctionnelles.
- Les préférences `prefers-reduced-motion` continuent de supprimer les transitions non essentielles.

## Conséquences

- Les actions répondent de manière cohérente au clavier, à la souris et au tactile.
- Les couleurs fonctionnelles restent stables ; seul un calque d'état les nuance.
- Les cartes conservent leur géométrie et leur place dans la page.

## Validation

Des contrats CI vérifient les couches d'état et l'absence de zoom/élévation au survol. Aucun test ni build local n'est exécuté.
