# ADR-0015 — Direction Pixel Material 3 Fidelity

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

Namesia annonce déjà Material 3 Fidelity et Rainbow, mais l'implémentation mélange encore des choix visuels éditoriaux, des styles historiques et des comportements de navigation propriétaires. La demande est de rapprocher l'ensemble du site d'une application Android Pixel, pas seulement de colorer les composants.

## Challenge

- **Garder le violet Material par défaut :** il s'agit d'une couleur de démonstration générique, pas d'une identité Pixel. Le bleu Pixel donne une direction plus reconnaissable, et Fidelity calcule les rôles à partir de cette source.
- **Étendre le rail à 280 px au clic :** ce tiroir improvisé n'est pas nécessaire pour quatre destinations et masque une partie du contenu. Le rail fixe de 80 px est plus proche du modèle Material et plus prévisible.
- **Ajouter une bibliothèque UI complète :** Material Web est en maintenance et une dépendance UI entière imposerait un coût disproportionné. Les primitives Namesia restent natives, mais leurs contrats visuels et interactions sont alignés sur Material 3.
- **Multiplier les dégradés et couleurs :** Rainbow ne doit pas colorer les actions fonctionnelles ni les cartes de prénoms sans signification éditoriale. Il reste réservé à la marque et aux catégories.

## Décision

- Utiliser `#005AC1` comme couleur source Fidelity, avec `Variant.FIDELITY` pour l'interface et `Variant.RAINBOW` pour les catégories.
- Remplacer le rail extensible par un rail fixe de 80 px sur les fenêtres d'au moins 600 px ; garder la barre de navigation basse sur les fenêtres compactes en largeur ou en hauteur.
- Aligner les tokens de typographie sur Roboto et la pile système, les courbes et durées de mouvement, les surfaces tonales et les états tactiles.
- Garder les SVG locaux, monochromes et cohérents, sans télécharger de police ou de bibliothèque de composants distante.
- Ne pas simuler les barres système, les gestes de retour ou la couleur dynamique du fond d'écran Android : le navigateur ne donne pas ces capacités au site.

## Conséquences

- L'identité fonctionnelle devient plus proche d'une application Pixel ; le bleu primaire est une décision de marque réversible.
- Le rail n'a plus d'état développé ; le contenu garde une largeur stable.
- Les composants natifs restent légers et accessibles.
- La fidélité visuelle complète reste un travail continu : cette décision établit les règles de référence et corrige le shell, sans prétendre que chaque écran est déjà identique à Android.

## Validation

La CI GitHub Actions est le mécanisme de vérification. La revue doit couvrir le rendu clair/sombre, les quatre destinations, les fenêtres compactes, medium, expanded et paysage, ainsi que les états focus et reduced-motion. Aucun test ni build local n'est exécuté.
