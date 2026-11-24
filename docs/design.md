# Système de design — Namesia

- **Statut :** référence visuelle canonique
- **Version :** 4.27
- **Mis à jour :** 2026-11-24

## 1. Direction

Namesia adopte **Material 3**, avec une palette générale **Fidelity** et une palette complémentaire **Rainbow** réservée aux éléments éditoriaux qui bénéficient d'une différenciation chromatique. L'interface vise la sensation d'une application Pixel : composants familiers, surfaces tonales, formes cohérentes, interactions réactives et navigation adaptative.

Ce choix est une référence de conception et de comportement, pas une prétention à reproduire le système Android natif ou ses barres système. Le navigateur conserve ses conventions, ses capacités et ses limites.

La personnalité Namesia reste présente à travers son dégradé de marque. Les couleurs Rainbow générées par Material Color Utilities servent aux catégories éditoriales identifiées (notamment les associations symboliques). Elles ne sont jamais attribuées en fonction de l'ordre, de la position, du hasard ou du prénom lui-même sans donnée éditoriale qui le justifie. Elles ne remplacent jamais les rôles fonctionnels du thème ni les états sémantiques. Les titres, les actions, les surfaces générales et les repères de navigation restent Fidelity : Rainbow n'est pas un dégradé décoratif appliqué aux textes ou aux fonds de page.

## 2. Source de vérité des couleurs

La palette est calculée avec la bibliothèque officielle Google **`@material/material-color-utilities`**. `lib/material-theme.ts` est l’unique générateur : il calcule les schémas clair et sombre, produit les déclarations CSS intégrées au `<head>` dès le rendu serveur, puis `MaterialThemeProvider` réapplique exactement les mêmes valeurs lorsque la préférence système change. Le CSS des composants ne contient donc aucune palette de secours indépendante. Le thème est construit avec :
- couleur source primaire : `#005AC1`, couleur source bleue choisie par Namesia (sans prétendre à une couleur officielle Pixel) ;
- variante du thème d'interface : `Variant.FIDELITY` ;
- variante complémentaire des catégories : `Variant.RAINBOW`, calculée séparément avec la même couleur source ;
- spécification : `2021`, car les variantes `Fidelity` et `Rainbow` sont définies dans cette version ; demander `2025` ferait retomber implicitement ces variantes sur leurs définitions antérieures ;
- plateforme : non renseignée, car ce paramètre ne s'applique pas à la génération Fidelity/Rainbow 2021 ;
- niveau de contraste standard : `0` ;
- schémas clair et sombre recalculés selon `prefers-color-scheme`.

Le générateur expose les rôles système sous leurs noms M3 exacts `--md-sys-color-*`. Les rôles absents provoquent une erreur explicite : aucun rôle n’est silencieusement ignoré. Le rendu initial et le thème après hydratation proviennent du même calcul, sans palette statique approximative ni bascule visuelle vers une autre variante.

La couleur source est fixe et maîtrisée par Namesia : le navigateur n'a pas accès au fond d'écran Android et le site ne prétend donc pas récupérer la couleur dynamique du téléphone. Une future personnalisation de la couleur source doit rester une décision explicite, pas une collecte implicite.

### Rôles Material

Les composants consomment les rôles du schéma, jamais des couleurs arbitraires :
- `primary`, `on-primary`, `primary-container`, `on-primary-container` : action principale et sélection ;
- `secondary` et ses conteneurs : navigation et actions secondaires ;
- `tertiary` et ses conteneurs : accent complémentaire ;
- `surface`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest` : plans et hiérarchie des surfaces ;
- `on-surface`, `on-surface-variant`, `outline`, `outline-variant` : texte et contours ;
- `error` et ses conteneurs : erreurs.

Les composants consomment directement les rôles `--md-sys-color-*`. Aucun alias applicatif `--color-*`, `--ink`, `--muted` ou `--line` n'est admis. Les extensions Namesia `success`, `warning` et `info` ne sont pas des rôles Material 3 ; elles portent le préfixe distinct `--namesia-color-*` et sont explicitement limitées aux états qui en ont besoin. Aucune valeur de secours n'est autorisée dans `var()` : une donnée de thème absente doit rester visible comme défaut de contrat.

### Signature Rainbow

Le dégradé de marque `--namesia-color-brand-gradient` reste réservé au monogramme Namesia. Les catégories utilisent trois familles de rôles tonals issues du schéma `Variant.RAINBOW` (`--namesia-color-category-1` à `--namesia-color-category-3`, avec leurs conteneurs et couleurs de premier plan). Une catégorie reçoit toujours la même teinte, quelle que soit la fiche ou l'ordre d'affichage. Une carte de prénom, un bouton ou une surface fonctionnelle ne constitue pas une catégorie : elle utilise les rôles Fidelity neutres ou sémantiques. Les titres, les accents typographiques et les fonds de page ne reçoivent pas de dégradé Rainbow. Les cartes d'associations peuvent recevoir une légère teinte stable issue de la catégorie, sur une surface Fidelity ; leur contour et leur badge utilisent respectivement la teinte et le rôle `on-container` de cette même catégorie, jamais un rôle tertiary générique. La vitrine « Les prénoms à découvrir » applique une surface neutre identique à ses cartes ; aucune carte ne reçoit primary, secondary ou tertiary selon sa position. Les variations de mise en page suivent la largeur disponible : trois colonnes sur grand écran, deux sur fenêtre intermédiaire et une sur écran compact.

## 3. Formes, typographie et élévation

- Typographie : Roboto pour tous les rôles, des titres aux contrôles et au corps. La police est chargée au build par `next/font/google`, auto-hébergée sur le domaine Namesia et préchargée ; le navigateur ne contacte pas Google. Les sous-ensembles `latin` et `latin-ext` couvrent les textes français. Les graisses 400 et 500 sont chargées ; aucune police de substitution ni pile générique n’est définie. Le corps courant reste à 16 px.
- Échelle Material 3 : display large/medium/small 57/64, 45/52 et 36/44 px ; headline large/medium/small 32/40, 28/36 et 24/32 px ; title large/medium/small 22/28, 16/24 et 14/20 px ; body large/medium/small 16/24, 14/20 et 12/16 px ; label large/medium/small 14/20, 12/16 et 11/16 px. Les graisses sont strictement 400 et 500. Les libellés ne sont pas forcés en capitales. Chaque rôle possède ses tokens `--md-sys-typescale-*` de famille, taille, graisse, interligne et approche. Aucune surcharge de taille par breakpoint ne réintroduit une hiérarchie concurrente.
- Les espacements suivent une grille de 4 px, avec les pas de 8 px privilégiés. Les rayons sont exclusivement les tokens `--md-sys-shape-corner-*`.
- Formes : extra-small 4 px, small 8 px, medium 12 px, large 16 px, extra-large 28 px et full/pill.
- Élévation : hiérarchie tonale des surfaces en priorité ; aucune ombre CSS décorative n'est conservée. Les niveaux M3 `--md-sys-elevation-level0` à `level5` sont des niveaux d'élévation, pas des valeurs de `box-shadow` ; toute traduction Web future devra être documentée.
- Densité : cibles tactiles d'au moins 48 × 48 px lorsque l'espace le permet ; les éléments visuels peuvent être plus petits à l'intérieur de leur cible.

### Accueil

Les titres de section et leurs liens d'action forment un groupe lisible : sur grand écran, le lien reste aligné au titre ; sous 600 px, il passe sur sa propre ligne, sous le titre, sans comprimer celui-ci. Le lien conserve une cible tactile minimale de 48 px. Le hero sépare le message éditorial et les outils de découverte : introduction à gauche et panneau de recherche à droite à partir de 900 px, puis empilement naturel sur les fenêtres plus étroites. Le panneau utilise une surface Fidelity distincte, un contour discret et un titre explicite ; la recherche et la découverte aléatoire y forment un seul point de départ. Le texte descriptif utilise `on-surface-variant`, jamais la couleur primaire comme simple décoration. La mention de génération par IA reste visible dans le panneau, au même endroit que les outils auxquels elle se rapporte. Les cartes vedettes gardent une hauteur minimale plutôt qu'une hauteur rigide ; les noms longs peuvent revenir à la ligne sans pousser l'action de découverte hors de la carte. Les cartes du catalogue appliquent la même règle de retour à la ligne.

### Fiche de prénom

La fiche est un parcours de lecture : son introduction et ses rubriques utilisent le premier plan `on-surface`, avec l'échelle body large 16/24 px. Les libellés de rubrique et les métadonnées utilisent les rôles label/body adaptés, sans capitales forcées. Le sommaire est composé de liens natifs présentés comme des chips tonales outlined de 48 px de haut, avec états hover réservés aux pointeurs fins, pression tactile et focus clavier visible. Les ancres ménagent 88 px au-dessus de chaque rubrique pour que le titre reste visible sous la barre supérieure fixe. Les surfaces du hero, de la note éditoriale et de la découverte utilisent directement les rôles Fidelity dans leurs règles de base ; aucune couche tardive ne redéfinit ces composants.

## 4. Navigation adaptative

Les destinations de premier niveau sont Accueil, Explorer, Comparer et Favoris. Elles restent identiques sur toutes les tailles d'écran.

- **Compact, moins de 600 px :** navigation bar fixe en bas, quatre destinations avec icône et libellé, prise en compte de `safe-area-inset-bottom`.
- **Medium et plus, à partir de 600 px :** navigation rail fixe sur le bord de départ, largeur de 80 px, icône et libellé empilés. Le rail reste à 80 px : le modèle Android du rail est conservé, sans tiroir latéral propriétaire qui réduirait inutilement l’espace de lecture.
- **Hauteur compacte, jusqu'à 480 px :** la navigation revient en bas même si la largeur dépasse 600 px, pour les fenêtres paysage peu hautes. Les éléments passent alors en disposition horizontale.
- La barre supérieure reste présente, avec la marque Namesia et une hauteur de 64 px.
- La destination courante utilise l'indicateur tonal en pilule et `aria-current="page"`.
- La navigation est une navigation de pages, pas un tablist ARIA : les liens natifs conservent l'historique, les ouvertures dans un nouvel onglet et les usages clavier du navigateur.

Ces seuils suivent la logique des window size classes Android : la barre convient aux fenêtres compactes en largeur ou en hauteur et le rail aux fenêtres plus larges. Les adaptations sont pilotées par l'espace disponible, pas par la détection d'une marque d'appareil. Le rail ne possède pas de bouton d'extension artificiel : une navigation de premier niveau reste stable et prévisible.

## 5. Bibliothèque de composants

L'inventaire des composants partagés, leurs responsabilités et les règles d'évolution sont centralisés dans [Bibliothèque de composants](composants.md). Les champs de recherche des parcours catalogue, comparateur et favoris utilisent une même primitive : libellé accessible, icône, effacement par le bouton iconique Fidelity partagé, surface Fidelity et focus visible. Le bouton natif de suppression du navigateur est masqué afin de ne pas doubler l'action. Le contrôle d'ajout/retrait à la comparaison partage aussi son état tonal, son libellé accessible et son adaptation compacte entre catalogue et favoris. Les prénoms retenus apparaissent sous forme de puces tonales communes, avec un retrait individuel explicite. Les filtres de genre et d'initiale utilisent une puce commune qui rend la sélection explicite par une coche et une surface secondaire tonale. Les sélecteurs de genre et de tri des favoris partagent un champ natif avec libellé visible et focus Fidelity, sans remplacer le menu du navigateur.

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

Les surfaces de l'accueil, des cartes vedettes, des fiches, du catalogue, du comparateur et du pied de page sont définies dans leurs règles canoniques, sans seconde couche de redéfinition tardive. Les actions de réinitialisation, d'effacement et de pagination utilisent la primitive Bouton en variante text ; les options de comparaison appliquent un état tonal sélectionné et des survols réservés aux pointeurs fins.

Les interactions utilisent les tokens M3 `--md-sys-motion-easing-*` et `--md-sys-motion-duration-*` ; les valeurs utilisées sont `short3`, `medium1` et `medium4`. Les couches d'état utilisent `--md-sys-state-hover-state-layer-opacity`, `--md-sys-state-focus-state-layer-opacity` et `--md-sys-state-pressed-state-layer-opacity`, selon l'état réel, plutôt que des pourcentages dupliqués dans les règles. Le lien d'évitement suit les mêmes tokens : aucune durée ni courbe n'est codée localement. La couche utilise la couleur de premier plan du composant, y compris sur l'indicateur sélectionné. Les cartes réagissent par une surface tonale plus élevée et un état pressé, sans déplacement ni ombre artificielle. Le mouvement doit rendre l'action compréhensible : indicateur qui s'étend, surface qui réagit à la pression, changement d'état animé. Les animations décoratives restent secondaires. `prefers-reduced-motion: reduce` supprime les mouvements non essentiels.

Les icônes fonctionnelles utilisent les tracés officiels Google Material Symbols Rounded, poids 400, embarqués localement et affichés sur une grille de 24 × 24 avec `currentColor`. Les variantes pleines ne sont utilisées que lorsqu'elles ont une forme réellement distincte : Accueil et Favoris changent de glyphe à l'état actif ; Recherche et Comparer conservent leur dessin officiel, et leur sélection est portée par l'indicateur tonal et le libellé. Les pictogrammes restent décoratifs pour les technologies d'assistance, le nom étant porté par le lien ou le bouton. Les cibles interactives restent d'au moins 48 × 48 px ; le SVG ne porte pas lui-même la cible. Les SVG de marque peuvent être colorés. Source et licence : `licenses/NOTICE-Material-Symbols.md` et `licenses/Apache-2.0-Material-Symbols.txt`.

### Focus clavier

Un seul sélecteur global applique l'indicateur de focus visible (contour primaire de 3 px avec décalage de 3 px) aux liens, boutons et champs natifs. Les composants peuvent enrichir leur état sélectionné ou pressé, mais ne redéfinissent pas le contour de focus. Le lien d'évitement apparaît sur `:focus-visible`, comme les autres liens : la navigation au clavier est mise en évidence sans afficher un contour au simple toucher.

### Structure verticale et pied de page

L'application occupe au minimum la hauteur de la fenêtre avec une colonne flex. La zone de contenu est elle-même une colonne flex ; son élément principal prend l'espace libre et le pied de page reste après le contenu, poussé en bas lorsque la page est courte. Aucune hauteur minimale arbitraire du contenu éditorial ne sert à simuler cet alignement : les pages longues grandissent naturellement et le pied de page suit leur fin.

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

- Les cartes Open Graph du site et des fiches utilisent la même famille Roboto que l’interface, chargée depuis un fichier TTF local au runtime Node de `ImageResponse`. Le poids 400 suffit à cette surface de partage ; aucun appel Google Fonts, aucune police de substitution et aucune seconde famille ne sont utilisés. Les fonds, textes et accents reprennent les rôles clairs Fidelity ; le dégradé de marque reste limité au monogramme.

- `@material/material-color-utilities` génère les rôles de couleurs ; aucun autre moteur de thème n'est ajouté.
- `lib/material-theme.ts` génère le CSS Fidelity/Rainbow initial et les couleurs de barre navigateur ; `components/material-theme-provider.tsx` synchronise les mêmes valeurs avec les changements de préférence système.
- `app/layout.tsx` charge Roboto via `next/font/google` et expose `--font-roboto` à tous les rôles typographiques ; les tokens ne désignent jamais une famille non chargée.
- `components/navigation-adaptative.tsx` porte la navigation de premier niveau.
- `components/ui/` contient les primitives d'interface partagées.
- `app/layout.tsx` compose la barre supérieure, le rail/la barre de navigation, le contenu et le pied de page.
- `app/globals.css` contient les formes, la typographie et les styles structurels partagés. Les rôles de couleur sont générés par `lib/material-theme.ts` dans le `<head>` dès le rendu serveur ; aucune palette statique parallèle ni fallback CSS n'existe.
- Les CSS Modules consomment les tokens partagés. Ils gèrent la disposition propre à un composant, sans redéfinir les styles d'un contrôle commun.
- Les composants natifs React/HTML sont préférés à une dépendance UI supplémentaire tant qu'une bibliothèque Web officielle maintenue et complète ne répond pas au besoin.

## 9. Références et limites de fidélité

La référence est Material 3 pour Android, notamment ses principes de navigation adaptative, ses rôles de couleur, ses composants et son échelle typographique officielle : [Material 3 — Type scale tokens](https://m3.material.io/styles/typography/type-scale-tokens). Les tailles et interlignes suivent la baseline publiée ; les graisses retenues sont 400 et 500. La référence de mise en œuvre Android est également consultable dans [la documentation Material 3 de Jetpack Compose](https://developer.android.com/develop/ui/compose/designsystems/material3). La palette principale suit Fidelity ; Rainbow est un système d'accents catégoriels distinct. La bibliothèque officielle Material Web est en mode maintenance en attente de nouveaux mainteneurs ; elle n'est pas retenue comme fondation UI. Material Color Utilities est la dépendance officielle retenue pour les algorithmes de couleur, pas une bibliothèque de composants.

Le registre des rôles, les sources officielles, les vérifications automatisées et les exceptions Web sont détaillés dans [Vérification Material 3](material-3-verification.md). La navigation, les icônes et les surfaces du site sont des implémentations Web accessibles des modèles Material. Le Web ne peut pas reproduire les gestes système, les barres système transparentes, le retour prédictif Android, les animations natives exactes ni l'extraction du fond d'écran. Ces éléments ne doivent pas être simulés de manière trompeuse.


## 10. Fidélité d'interaction Pixel

La fidélité ne se limite pas aux couleurs. Les interactions doivent reproduire les conventions observables de Material 3 sur Android :

- Les actions primaires utilisent les boutons filled ; les actions secondaires utilisent tonal, outlined ou text selon leur importance.
- Les états hover, focus-visible, pressed, disabled, selected, loading et error sont cohérents entre les contrôles. Les liens du fil d'Ariane et du pied de fiche ne changent de couleur au survol que sur pointeur fin. Toute règle `:hover` est réservée à `@media (hover: hover) and (pointer: fine)` ; les états tactiles reposent sur `:active` et ne dépendent jamais du hover. Les puces de filtre réservent le survol aux pointeurs fins et conservent un état pressé tactile.
- Les transitions utilisent les tokens de mouvement communs. Les éléments de navigation animent l'indicateur, pas la position des libellés ; les actions ne déclenchent pas de zoom agressif.
- Les composants interactifs gardent une cible tactile de 48 × 48 px au minimum. La taille visuelle de l'icône ne détermine pas celle de la cible.
- Les surfaces suivent les niveaux Material : fond, surface basse, surface, surface haute et surface la plus haute. Les dégradés et ombres ne remplacent pas cette hiérarchie.
- Les icônes restent cohérentes : SVG local, grille 24 px, épaisseur et remplissage harmonisés, couleur héritée. Les pictogrammes de marque ne sont pas mélangés aux icônes fonctionnelles.
- Les barres de navigation compactes et les rails medium/expanded sont des modèles de navigation de page ; ce ne sont ni des onglets ni une imitation des barres système Android.

La fidélité est évaluée sur l'ensemble des parcours (accueil, catalogue, fiche, comparateur, favoris et administration), en clair/sombre, à 320 px, 600 px, 840 px et sur grand écran. Une simple conformité des tokens ne suffit pas si les composants visibles conservent des styles concurrents.
