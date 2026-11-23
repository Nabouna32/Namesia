# Système de design — Namesia

- **Statut :** référence visuelle canonique
- **Version :** 3.2
- **Mis à jour :** 2026-11-23

## 1. Direction

Namesia adopte **Material 3 Expressive**, le langage visuel moderne d'Android, comme système d'interface de référence. L'objectif est de retrouver sur le Web la sensation d'une application Pixel : composants familiers, surfaces tonales, formes expressives, interactions réactives, navigation adaptative et cohérence entre les écrans.

Ce choix est une référence de conception et de comportement, pas une prétention à reproduire le système Android natif ou ses barres système. Le navigateur conserve ses conventions, ses capacités et ses limites.

La personnalité Namesia reste présente à travers le dégradé rainbow, utilisé comme signature de marque, et quelques accents éditoriaux. Il ne remplace jamais les rôles de couleur Material ni les états sémantiques.

## 2. Source de vérité des couleurs

La palette d'interface est calculée avec la bibliothèque officielle Google **`@material/material-color-utilities`**. Le thème est construit avec :
- couleur source primaire : `#6750A4`, violet Material de référence ;
- variante : `Variant.EXPRESSIVE` ;
- spécification : `2025` ;
- plateforme de calcul : `phone` ;
- niveau de contraste standard : `0` ;
- schémas clair et sombre recalculés selon `prefers-color-scheme`.

Le fournisseur `MaterialThemeProvider` applique les rôles calculés sous forme de variables CSS `--md-sys-color-*`. Les valeurs de la feuille globale sont des valeurs initiales SSR ; la bibliothèque est la source de vérité du thème actif après hydratation. Le thème suit les changements de préférence système sans rechargement.

La couleur source est fixe et maîtrisée par Namesia : le navigateur n'a pas accès au fond d'écran Android et le site ne prétend donc pas récupérer la couleur dynamique du téléphone. Une future personnalisation de la couleur source doit rester une décision explicite, pas une collecte implicite.

### Rôles Material

Les composants consomment les rôles du schéma, jamais des couleurs arbitraires :
- `primary`, `on-primary`, `primary-container`, `on-primary-container` : action principale et sélection ;
- `secondary` et ses conteneurs : navigation et actions secondaires ;
- `tertiary` et ses conteneurs : accent complémentaire ;
- `surface`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest` : plans et hiérarchie des surfaces ;
- `on-surface`, `on-surface-variant`, `outline`, `outline-variant` : texte et contours ;
- `error` et ses conteneurs : erreurs.

Les tokens applicatifs historiques `--color-*` restent des alias de compatibilité vers les rôles Material ou les couleurs sémantiques ; ils ne définissent pas une deuxième palette. Les couleurs de succès, d'avertissement et d'information sont des extensions sémantiques distinctes, car le schéma de base Material ne définit pas ces trois états.

### Signature rainbow

Le dégradé Namesia est défini une seule fois par `--color-rainbow`. Il sert aux détails de marque, au monogramme, aux petits filets décoratifs et à quelques accents de titres. Les longs textes, surfaces de formulaire, contrôles, états de validation et indicateurs de sélection utilisent toujours les rôles Material.

## 3. Formes, typographie et élévation

- Typographie : Roboto en priorité, puis Google Sans si disponible sur la plateforme, avec une pile système sans téléchargement distant. Le corps reste à 16 px minimum pour les contrôles et la lecture courante.
- Échelle : display, headline, title, body et label selon la hiérarchie Material ; les titres utilisent des graisses modérées et un interlettrage resserré, pas une serif éditoriale étrangère à Android.
- Formes : extra-small 4 px, small 8 px, medium 12 px, large 16 px, extra-large 28 px et full/pill.
- Élévation : surfaces tonales en premier ; ombres discrètes uniquement pour les éléments flottants et les plans qui doivent se détacher.
- Densité : cibles tactiles d'au moins 48 × 48 px lorsque l'espace le permet ; les éléments visuels peuvent être plus petits à l'intérieur de leur cible.

## 4. Navigation adaptative

Les destinations de premier niveau sont Accueil, Explorer, Comparer et Favoris. Elles restent identiques sur toutes les tailles d'écran.

- **Compact, moins de 600 px :** navigation bar fixe en bas, quatre destinations avec icône et libellé, prise en compte de `safe-area-inset-bottom`.
- **Medium et plus, à partir de 600 px :** navigation rail fixe sur le bord de départ, largeur de 96 px, icône et libellé empilés. Le rail s'étend temporairement à 280 px et le contenu suit son déplacement.
- **Hauteur compacte, jusqu'à 480 px :** la navigation revient en bas même si la largeur dépasse 600 px, pour les fenêtres paysage peu hautes.
- Le rail peut s'étendre temporairement à 280 px ; les libellés passent alors à côté des icônes.
- La barre supérieure reste présente, avec la marque Namesia et une hauteur de 64 px.
- La destination courante utilise l'indicateur tonal en pilule et `aria-current="page"`.
- La navigation est une navigation de pages, pas un tablist ARIA : les liens natifs conservent l'historique, les ouvertures dans un nouvel onglet et les usages clavier du navigateur.

Ces seuils suivent la logique des window size classes Android : la barre convient aux fenêtres compactes et le rail aux fenêtres plus larges. Les adaptations sont pilotées par la largeur disponible, pas par la détection d'une marque d'appareil.

## 5. Composants et états

Les composants doivent partager les mêmes rôles, formes et interactions :
- boutons remplis, tonals, contour et texte ;
- champs de saisie, recherche et sélection ;
- cartes élevées, remplies ou avec contour ;
- chips de filtre et de suggestion ;
- navigation bar, navigation rail et barre supérieure ;
- dialogues, menus, feuilles et notifications ;
- boutons flottants uniquement lorsqu'une action principale persistante existe réellement.

États attendus : repos, survol, focus clavier, pressé, sélectionné, désactivé, chargement, erreur et succès. Les états sont explicites et ne reposent jamais sur la couleur seule.

Les interactions utilisent des transitions courtes et des courbes d'accélération expressives. Le mouvement doit rendre l'action compréhensible : indicateur qui s'étend, surface qui réagit à la pression, changement d'état animé. Les animations décoratives restent secondaires. `prefers-reduced-motion: reduce` supprime les mouvements non essentiels.

Les SVG d'interface sont des icônes vectorielles monochromes à `currentColor`, généralement sur une grille de 24 × 24 ; leur dessin reste cohérent d'une destination à l'autre. Les SVG de marque peuvent être colorés.

## 6. Responsive, accessibilité et navigateur

- Conception fluide à partir de 320 px, sans débordement horizontal.
- Navigation du pouce en bas sur téléphone ; rail sur tablette et fenêtres larges.
- Contenu principal décalé pour ne jamais passer sous le rail ; espace réservé à la navigation basse sur téléphone.
- Respect du zoom et des préférences de taille de texte.
- Focus clavier visible, structure HTML native et noms accessibles explicites.
- Contraste WCAG AA minimum pour le texte courant et les contrôles.
- Les préférences de thème et de mouvement suivent le système ; aucune permission ou donnée de l'appareil n'est demandée.
- Les barres système, gestes de retour Android et indicateur de geste restent la responsabilité du navigateur et de l'OS ; Namesia ne dessine pas de fausses barres système.

## 7. Architecture

- `@material/material-color-utilities` génère les rôles de couleurs ; aucun autre moteur de thème n'est ajouté.
- `components/material-theme-provider.tsx` synchronise le schéma avec la préférence système.
- `components/navigation-adaptative.tsx` porte la navigation de premier niveau.
- `app/layout.tsx` compose la barre supérieure, le rail/la barre de navigation, le contenu et le pied de page.
- `app/globals.css` contient les rôles de secours SSR, les alias, les formes et les styles partagés.
- Les CSS Modules consomment les tokens partagés. Ils ne redéfinissent pas une palette parallèle.
- Les composants natifs React/HTML sont préférés à une dépendance UI supplémentaire tant qu'une bibliothèque Web officielle maintenue et complète ne répond pas au besoin.

## 8. Références et limites de fidélité

La référence est Material 3 Expressive pour Android, notamment ses principes de navigation adaptative, ses rôles de couleur et ses composants. La bibliothèque officielle Material Web est en mode maintenance en attente de nouveaux mainteneurs ; elle n'est pas retenue comme fondation UI. Material Color Utilities est la dépendance officielle retenue pour les algorithmes de couleur, pas une bibliothèque de composants.

La navigation, les icônes et les surfaces du site sont des implémentations Web accessibles des modèles Material. Le Web ne peut pas reproduire les gestes système, les barres système transparentes, le retour prédictif Android, les animations natives exactes ni l'extraction du fond d'écran. Ces éléments ne doivent pas être simulés de manière trompeuse.
