# Système de design — Namesia

- **Statut :** référence visuelle canonique
- **Version :** 3.5
- **Mis à jour :** 2026-11-23

## 1. Direction

Namesia adopte **Material 3**, avec une palette générale **Fidelity** et une palette complémentaire **Rainbow** réservée aux éléments éditoriaux qui bénéficient d'une différenciation chromatique. L'interface vise la sensation d'une application Pixel : composants familiers, surfaces tonales, formes cohérentes, interactions réactives et navigation adaptative.

Ce choix est une référence de conception et de comportement, pas une prétention à reproduire le système Android natif ou ses barres système. Le navigateur conserve ses conventions, ses capacités et ses limites.

La personnalité Namesia reste présente à travers son dégradé de marque. Les couleurs Rainbow générées par Material Color Utilities servent aux catégories éditoriales identifiées (notamment les associations symboliques). Elles ne sont jamais attribuées en fonction de l'ordre, de la position, du hasard ou du prénom lui-même sans donnée éditoriale qui le justifie. Elles ne remplacent jamais les rôles fonctionnels du thème ni les états sémantiques.

## 2. Source de vérité des couleurs

La palette d'interface est calculée avec la bibliothèque officielle Google **`@material/material-color-utilities`**. Le thème est construit avec :
- couleur source primaire : `#6750A4`, violet Material de référence ;
- variante du thème d'interface : `Variant.FIDELITY` ;
- variante complémentaire des catégories : `Variant.RAINBOW`, calculée séparément avec la même couleur source ;
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

### Signature Rainbow

Le dégradé de marque `--color-rainbow` reste un accent décoratif limité au monogramme et à quelques détails éditoriaux. Les catégories utilisent trois familles de rôles tonals issues du schéma `Variant.RAINBOW` (`--md-category-1` à `--md-category-3`, avec leurs conteneurs et couleurs de premier plan). Une catégorie reçoit toujours la même teinte, quelle que soit la fiche ou l'ordre d'affichage. Une carte de prénom, un bouton ou une surface fonctionnelle ne constitue pas une catégorie : elle utilise les rôles Fidelity neutres ou sémantiques. La vitrine « Les prénoms à découvrir » applique une surface neutre identique à ses cartes ; aucune carte ne reçoit primary, secondary ou tertiary selon sa position. Les variations de mise en page suivent la largeur disponible : trois colonnes sur grand écran, deux sur fenêtre intermédiaire et une sur écran compact.

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
- **Hauteur compacte, jusqu'à 480 px :** la navigation revient en bas même si la largeur dépasse 600 px, pour les fenêtres paysage peu hautes. Les éléments passent alors en disposition horizontale.
- La barre supérieure reste présente, avec la marque Namesia et une hauteur de 64 px.
- La destination courante utilise l'indicateur tonal en pilule et `aria-current="page"`.
- La navigation est une navigation de pages, pas un tablist ARIA : les liens natifs conservent l'historique, les ouvertures dans un nouvel onglet et les usages clavier du navigateur.

Ces seuils suivent la logique des window size classes Android : la barre convient aux fenêtres compactes en largeur ou en hauteur et le rail aux fenêtres plus larges. Les adaptations sont pilotées par l'espace disponible, pas par la détection d'une marque d'appareil.

## 5. Bibliothèque de composants

L'inventaire des composants partagés, leurs responsabilités et les règles d'évolution sont centralisés dans [Bibliothèque de composants](composants.md). Les champs de recherche des parcours catalogue, comparateur et favoris utilisent une même primitive : libellé accessible, icône, effacement, surface Fidelity et focus visible. Le contrôle d'ajout/retrait à la comparaison partage aussi son état tonal, son libellé accessible et son adaptation compacte entre catalogue et favoris. Les prénoms retenus apparaissent sous forme de puces tonales communes, avec un retrait individuel explicite. Les filtres de genre et d'initiale utilisent une puce commune qui rend la sélection explicite par une coche et une surface secondaire tonale. Les sélecteurs de genre et de tri des favoris partagent un champ natif avec libellé visible et focus Fidelity, sans remplacer le menu du navigateur.

Les primitives communes portent les interactions et états transversaux ; les composants métier composent ces primitives et conservent leur logique propre. Les actions de l'administration et des parcours visiteurs utilisent les mêmes variantes de bouton Fidelity ; aucune classe globale de bouton ne constitue une seconde source de style. Les variantes des contrôles utilisent les rôles Fidelity. Une règle de style locale n'est pas une nouvelle primitive.

## 6. Composants et états

Les composants doivent partager les mêmes rôles, formes et interactions :
- boutons filled, tonal, outlined et text ;
- champs de saisie, recherche et sélection ;
- cartes élevées, remplies ou avec contour ;
- chips de filtre et de suggestion ;
- navigation bar, navigation rail et barre supérieure ;
- dialogues, menus, feuilles et notifications ;
- boutons flottants uniquement lorsqu'une action principale persistante existe réellement.

États attendus : repos, survol, focus clavier, pressé, sélectionné, désactivé, chargement, erreur et succès. Les états sont explicites et ne reposent jamais sur la couleur seule.

Les interactions utilisent des transitions courtes et des courbes d'accélération expressives. Le mouvement doit rendre l'action compréhensible : indicateur qui s'étend, surface qui réagit à la pression, changement d'état animé. Les animations décoratives restent secondaires. `prefers-reduced-motion: reduce` supprime les mouvements non essentiels.

Les SVG d'interface sont des icônes vectorielles monochromes à `currentColor`, généralement sur une grille de 24 × 24 ; leur dessin reste cohérent d'une destination à l'autre. Les SVG de marque peuvent être colorés.

## 7. Responsive, accessibilité et navigateur

- Conception fluide à partir de 320 px, sans débordement horizontal.
- Navigation du pouce en bas sur téléphone ; rail sur tablette et fenêtres larges.
- Contenu principal décalé pour ne jamais passer sous le rail ; espace réservé à la navigation basse sur téléphone.
- Respect du zoom et des préférences de taille de texte.
- Focus clavier visible, structure HTML native et noms accessibles explicites.
- Contraste WCAG AA minimum pour le texte courant et les contrôles.
- Les préférences de thème et de mouvement suivent le système ; aucune permission ou donnée de l'appareil n'est demandée.
- Le viewport utilise `viewport-fit=cover` et une couleur de thème claire/sombre pour accorder les zones sûres et la barre du navigateur Android aux surfaces de l'application.
- Les barres système, gestes de retour Android et indicateur de geste restent la responsabilité du navigateur et de l'OS ; Namesia ne dessine pas de fausses barres système.

## 8. Architecture

- `@material/material-color-utilities` génère les rôles de couleurs ; aucun autre moteur de thème n'est ajouté.
- `components/material-theme-provider.tsx` synchronise le schéma avec la préférence système.
- `components/navigation-adaptative.tsx` porte la navigation de premier niveau.
- `components/ui/` contient les primitives d'interface partagées.
- `app/layout.tsx` compose la barre supérieure, le rail/la barre de navigation, le contenu et le pied de page.
- `app/globals.css` contient les rôles de secours SSR, les alias, les formes et les styles structurels partagés.
- Les CSS Modules consomment les tokens partagés. Ils gèrent la disposition propre à un composant, sans redéfinir les styles d'un contrôle commun.
- Les composants natifs React/HTML sont préférés à une dépendance UI supplémentaire tant qu'une bibliothèque Web officielle maintenue et complète ne répond pas au besoin.

## 9. Références et limites de fidélité

La référence est Material 3 pour Android, notamment ses principes de navigation adaptative, ses rôles de couleur et ses composants. La palette principale suit Fidelity ; Rainbow est un système d'accents catégoriels distinct. La bibliothèque officielle Material Web est en mode maintenance en attente de nouveaux mainteneurs ; elle n'est pas retenue comme fondation UI. Material Color Utilities est la dépendance officielle retenue pour les algorithmes de couleur, pas une bibliothèque de composants.

La navigation, les icônes et les surfaces du site sont des implémentations Web accessibles des modèles Material. Le Web ne peut pas reproduire les gestes système, les barres système transparentes, le retour prédictif Android, les animations natives exactes ni l'extraction du fond d'écran. Ces éléments ne doivent pas être simulés de manière trompeuse.
