# Système de design — Namesia

- **Statut :** référence visuelle canonique
- **Version :** 1.6
- **Mis à jour :** 2026-11-23

## Intention

Une interface éditoriale contemporaine, calme et précise. La priorité est donnée à la lecture, à la navigation évidente et à une hiérarchie nette. Les références de qualité sont les grandes interfaces produit sobres : peu d'effets, des surfaces bien séparées, des composants prévisibles et des états explicites.

La direction précédente « arc-en-ciel, chaleureuse et compacte » est abandonnée : elle multipliait les accents, les dégradés et les contrastes décoratifs sans aider à comprendre le contenu. Namesia conserve une personnalité par la qualité de sa typographie, ses compositions et son ton, pas par une palette multicolore.

## Couleurs sémantiques

Les variables sont définies dans `app/globals.css`. L'accent unique est un bleu franc (`#2457c5` en clair, `#91b2ff` en sombre) : il est immédiatement identifiable comme couleur d'action, reste adapté à un univers éditorial et offre un contraste élevé avec les surfaces.

| Token | Mode clair | Mode sombre | Usage |
|---|---|---|---|
| `--color-background` | `#f7f8fb` | `#101522` | Fond global |
| `--color-surface` | `#ffffff` | `#171f30` | Cartes, champs, navigation |
| `--color-surface-muted` | `#eef1f6` | `#222d40` | Surface secondaire |
| `--color-text` | `#172033` | `#edf2fb` | Texte principal |
| `--color-text-muted` | `#526078` | `#b2bfd2` | Texte secondaire |
| `--color-border` | `#d8deea` | `#39465c` | Séparateurs et contours |
| `--color-accent` | `#2457c5` | `#91b2ff` | Liens et actions |
| `--color-success` | `#176b45` | `#72d6a4` | Succès |
| `--color-warning` | `#854d0e` | `#f2c078` | Avertissement |
| `--color-error` | `#b42318` | `#ff9b91` | Erreur |
| `--color-info` | `#2457c5` | `#91b2ff` | Information |

Le bleu est la seule couleur d'accent. Succès, avertissement, erreur et information sont des couleurs d'état, pas des accents décoratifs interchangeables.

Les couples texte/fond, texte atténué/fond et accent/fond sont choisis pour dépasser le seuil WCAG AA de 4,5:1 pour le texte courant dans les deux thèmes. Les grandes surfaces ne reposent jamais sur la couleur seule pour exprimer un état. Les contrôles utilisent une bordure, un libellé ou un pictogramme en plus de la couleur.

## Typographie

Une seule famille sans empattement : pile système (Inter lorsqu'elle est installée, puis polices natives de la plateforme). Pas de police distante ni de chargement réseau. Échelle :

- 12 px : métadonnées non essentielles uniquement ;
- 14 px : aides et informations secondaires ;
- 16 px : corps de texte et contrôles ;
- 18–20 px : introduction et texte mis en avant ;
- 24–32 px : titres de section ;
- 40–56 px : titre principal, fluide selon l'écran.

Corps à interligne confortable (1,6 à 1,75). Les textes éditoriaux sont limités en largeur pour éviter les longues lignes.

## Espacements, rayons et ombres

Les espacements suivent une base de 4 px : 4, 8, 12, 16, 20, 24, 32, 40 et 48 px. Les composants utilisent les variables `--space-*` plutôt que des valeurs inventées.

Rayons : 8 px (petit), 12 px (standard), 16 px (grand), 24 px (mise en avant), pilule uniquement pour les éléments réellement arrondis. Ombres discrètes, réservées à la séparation de plans ; la bordure suffit pour la plupart des cartes.

## Comportement des composants

- **Survol :** changement léger de couleur/bordure ; pas de déplacement important ni d'animation décorative.
- **Focus :** contour de 3 px utilisant `--color-focus`, avec un décalage de 3 px ; la règle s'applique uniformément aux liens, boutons, champs et sélecteurs, y compris dans le comparateur et la recherche. Aucun composant ne réduit ou ne supprime cet indicateur.
- **Désactivé :** opacité réduite et curseur adapté, sans perdre la lisibilité du libellé.
- **Chargement :** conserver l'espace du contrôle et annoncer l'état si une opération asynchrone existe ; pas de faux indicateur sur une action synchrone.
- **Erreur :** message explicite proche du champ ou de l'action, associé sémantiquement au contrôle ; utiliser `--color-error`.
- **Succès / avertissement / information :** utiliser les tokens d'état et un texte explicite.

## Thèmes et responsive

Le thème suit `prefers-color-scheme` sans réglage applicatif supplémentaire. Les composants utilisent les mêmes tokens sémantiques dans les deux thèmes. La mise en page est conçue d'abord pour les écrans étroits, puis s'étend ; le contenu ne doit pas déborder à 320 px et reste lisible à 200 % de zoom. Les adaptations des écrans les plus étroits sont déclarées après les règles des seuils plus larges afin de conserver leur priorité dans la cascade CSS.

Les zones tactiles interactives visent au moins 44 × 44 px, y compris les filtres du catalogue, les actions d'effacement et les liens de navigation. La navigation principale passe sur plusieurs lignes sous 360 px afin de rester utilisable lorsque le zoom réduit fortement la largeur du viewport ; le logo et les liens ne doivent ni se chevaucher ni provoquer de défilement horizontal. Les libellés peuvent rester visuellement compacts, mais la zone cliquable ne doit pas être réduite pour gagner quelques pixels. Les boutons de partage et les filtres du catalogue conservent également cette hauteur minimale sur mobile. La réduction des animations respecte `prefers-reduced-motion`.

## Architecture CSS et dépendances

La stack utilise Next.js, React et des feuilles CSS natives / CSS Modules. Un framework supplémentaire n'est pas retenu : Tailwind ou shadcn/ui ajouterait une seconde convention de styles et une migration de composants alors que le besoin est d'unifier une interface existante, pas de construire un kit complet. Les variables CSS natives fournissent thèmes, tokens et adaptation au système sans dépendance, compilation ni dette de version. Les composants React existants restent les briques partagées ; les styles de domaine consomment les mêmes tokens.

## Application

- `app/globals.css` porte les tokens et les règles globales communes.
- Les CSS Modules des composants ne redéfinissent pas la palette ; ils consomment les tokens.
- Les pages accueil et fiche prénom partagent les mêmes surfaces, échelles et états.
- Les autres pages utilisent les mêmes variables : aucun style de page ne doit introduire une couleur d'accent indépendante.
- L'en-tête utilise une surface neutre et une bordure sémantique ; les liens de navigation sont en texte secondaire au repos et passent à l'accent au survol. Ne jamais placer un texte de navigation dans la même couleur que son fond.
