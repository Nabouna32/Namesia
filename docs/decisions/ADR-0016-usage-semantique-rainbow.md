# ADR-0016 — Usage sémantique de Rainbow et neutralité des surfaces

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

La palette Rainbow est générée séparément de Fidelity, mais plusieurs éléments généraux de l'interface l'utilisaient encore : titres, accent sous le hero et texte du titre de fiche. Ces accents rendaient le dégradé omniprésent et brouillaient la distinction entre identité de marque, catégorie éditoriale et action fonctionnelle. Les cartes d'associations symboliques recevaient en outre une surface tertiary commune, alors que leur catégorie dispose déjà d'une teinte Rainbow stable.

## Challenge

- **Conserver Rainbow sur les titres et les grands fonds :** cela augmente le bruit visuel et attribue une variation chromatique à des contenus qui ne sont pas des catégories.
- **Supprimer toute couleur Rainbow :** cela ferait perdre une différenciation utile aux associations éditoriales et à la marque.
- **Colorer chaque carte indépendamment :** cela créerait une signification arbitraire, notamment si la couleur dépendait de l'ordre d'affichage.

## Décision

- Réserver le dégradé de marque au monogramme Namesia.
- Garder Rainbow pour les repères et associations dont la catégorie est explicitement identifiée et stable ; les cartes symboliques utilisent une teinte légère issue de leur conteneur Rainbow, mélangée à une surface Fidelity neutre.
- Utiliser Fidelity pour les titres, les actions, les fonds de page, les surfaces générales et les états de navigation.
- Épurer le hero et la fiche de prénom : surfaces tonales neutres, accent primaire sur les titres, suppression de la bande dégradée décorative.
- Réduire l'échelle des titres d'accueil et de fiche pour se rapprocher de la hiérarchie typographique Material 3.

## Conséquences

- Rainbow redevient un signal éditorial plutôt qu'un décor universel.
- La marque conserve son monogramme dégradé.
- Les catégories restent visuellement distinguables et cohérentes entre fiche et comparateur.
- L'interface gagne en calme et en proximité avec les surfaces d'une application Pixel.

## Validation

La CI protège l'absence de dégradé Rainbow sur les titres et le hero ainsi que l'usage de la teinte catégorielle sur les cartes symboliques. Aucun test ni build local n'est exécuté.
