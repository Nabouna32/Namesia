# ADR-0018 — Icônes actives et formulaires Material 3

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

L'interface avait un registre SVG unique, mais les destinations Explorer et Comparer ne changeaient pas de pictogramme à l'état actif. Les autres icônes alternaient déjà entre tracés et formes pleines, sans contrat explicite pour les paires de navigation. L'administration utilisait encore des champs de 44 px, des couleurs alias historiques, des rayons et une ombre qui la distinguaient du reste du thème Fidelity. Le bouton de partage possédait enfin un style global concurrent du bouton partagé.

## Challenge

- **Installer une bibliothèque d'icônes complète :** le site n'utilise qu'un petit nombre de pictogrammes ; importer une collection entière ou ajouter un chargeur SVG serait disproportionné et introduirait une nouvelle contrainte de build.
- **Garder les mêmes icônes à tous les états :** la navigation perd un repère visuel Material important pour identifier la destination courante.
- **Créer une primitive de formulaire générique :** l'administration est le seul parcours qui utilise ces champs spécifiques ; une abstraction à usage unique ne justifierait pas sa maintenance.
- **Conserver les styles locaux des boutons :** cela réintroduirait une deuxième source de vérité déjà supprimée ailleurs.

## Décision

- Garder les SVG fonctionnels dans `components/icone-material.tsx`, avec une grille 24 px, une couleur héritée, des tracés arrondis et des variantes de contour/pleines.
- Définir explicitement une paire contour/pleine pour chacune des quatre destinations ; le pictogramme plein est affiché quand la destination est active.
- Retirer le pictogramme inutilisé et conserver les cibles tactiles sur les boutons et liens qui contiennent les icônes, pas sur le SVG.
- Refaire les champs administratifs avec les rôles Fidelity, une hauteur minimale de 56 px pour les champs de saisie, une cible de 48 px pour le sélecteur de fichier et un focus visible.
- Conserver les champs natifs propres à l'administration dans son CSS Module : pas de primitive formulaire à usage unique.
- Remplacer le bouton spécifique du partage par la primitive `Bouton` en variante tonal et supprimer ses anciens styles globaux.

## Conséquences

- Les quatre destinations ont un état visuel actif explicite et cohérent.
- Les pictogrammes restent locaux, sans police distante ni dépendance supplémentaire.
- L'administration partage les mêmes surfaces, formes, couleurs, états de focus et dimensions tactiles que le site public.
- Les champs spécifiques restent simples et natifs ; leur logique n'est pas déplacée dans une bibliothèque UI.
- Le partage n'a plus de style concurrent.

## Validation

Les contrats CI couvrent les paires d'icônes, les rôles et dimensions des champs administratifs, le libellé du sélecteur de fichier et la réutilisation du bouton partagé. Aucun test ni build local n'est exécuté.
