# ADR-0030 — Géométrie du conteneur NavigationBar

- **Statut :** remplacée par [ADR-0031](ADR-0031-hauteur-navigation-bar-compose-1-5.md)
- **Date :** 2026-11-24

## Contexte

La barre de navigation compacte ajoutait 8 px en haut et 8 px en bas à ses 64 px de contenu, ainsi qu'une bordure supérieure. Le dégagement du contenu était fixé à 80 px, indépendamment de la hauteur normative du composant.

## Challenge

- Conserver 80 px : cela crée un composant plus haut que le token AndroidX et réduit inutilement l'espace de lecture.
- Utiliser 64 px sans zone sûre : le contenu peut entrer dans l'espace système réservé aux gestes ou à l'indicateur du navigateur.
- Utiliser les 64 dp du composant et ajouter seulement l'inset réel du navigateur : respecte le token M3 sans sacrifier la sécurité des zones tactiles.

## Décision

La NavigationBar a une hauteur de contenu de 64 dp, conformément à `NavigationBarTokens.ContainerHeight`. Supprimer le padding vertical ajouté et la bordure supérieure non prévue par le token. Réserver `safe-area-inset-bottom` en complément, et appliquer le même dégagement au contenu principal.

## Conséquences

La barre retrouve la hauteur Material 3 et libère 16 px de hauteur utile. Sur les appareils avec zone sûre basse, celle-ci reste entièrement réservée. Le rail n'est pas modifié.

## Vérification

La CI vérifie la hauteur, l'absence de bordure/padding artificiels et la cohérence du dégagement du contenu. La source AndroidX est répertoriée dans [Vérification Material 3](../material-3-verification.md).
