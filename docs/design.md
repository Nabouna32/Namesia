# Système de design — Namesia

- **Statut :** référence visuelle canonique
- **Version :** 4.49
- **Mis à jour :** 2026-11-24

## 1. Direction

Namesia adopte **Material 3**, avec une palette générale **Fidelity** et une palette complémentaire **Rainbow** réservée aux éléments éditoriaux qui bénéficient d'une différenciation chromatique. L'interface vise la sensation d'une application Pixel : composants familiers, surfaces tonales, formes cohérentes, interactions réactives et navigation adaptative.

Ce choix est une référence de conception et de comportement, pas une prétention à reproduire le système Android natif ou ses barres système. Le navigateur conserve ses conventions, ses capacités et ses limites.

La marque Namesia utilise les rôles Fidelity, y compris pour son monogramme. Les couleurs Rainbow générées par Material Color Utilities servent uniquement aux catégories éditoriales identifiées (notamment les associations symboliques) : elles ne sont jamais attribuées selon l'ordre, la position, le hasard ou le prénom lui-même. Elles ne remplacent ni les rôles fonctionnels Fidelity ni les couleurs sémantiques success/warning/info. Les titres, les actions, les surfaces générales et les repères de navigation restent Fidelity ; Rainbow n'est pas un dégradé décoratif appliqué aux textes ou aux fonds de page. Les états de succès, d'avertissement et d'information conservent leurs couleurs sémantiques comme couleurs personnalisées M3 distinctes des rôles système.

## 2. Source de vérité des couleurs

La palette est calculée avec la bibliothèque officielle Google **`@material/material-color-utilities`**. `lib/material-theme.ts` est l’unique générateur : il calcule les schémas clair et sombre, produit les déclarations CSS intégrées au `<head>` dès le rendu serveur, puis `MaterialThemeProvider` réapplique exactement les mêmes valeurs lorsque la préférence système change. Le CSS des composants ne contient donc aucune palette de secours indépendante. Le thème est construit avec :
- couleur source primaire : `#6750A4`, violet de la palette Material 3 baseline documentée par Android Developers ; ce n'est pas un bleu Google. Fidelity calcule les rôles à partir de cette source, elle n'est pas recopiée telle quelle dans chaque composant. Le résultat Fidelity n'est pas le schéma statique Tonal Spot baseline : il conserve la variante Fidelity demandée ;
- variante du thème d'interface : `Variant.FIDELITY` ;
- variante complémentaire des catégories : `Variant.RAINBOW`, calculée séparément avec la même couleur source ;
- bibliothèque de calcul : `@material/material-color-utilities` version `0.4.0`, épinglée dans `package-lock.json` et dans [Vérification Material 3](material-3-verification.md) ;
- version d'algorithme : `specVersion: "2021"`, version de `ColorSpec` dans Material Color Utilities ; ce n'est pas une version de Material Design 3 ni une référence à l'ancien système de composants. Le code de la bibliothèque redirige explicitement Fidelity et Rainbow vers 2021 lorsqu'une spécification 2025 leur est demandée, car ces variantes ne sont pas prises en charge par les spécifications 2025 et 2026 ;
- plateforme MCU : `phone`, paramètre de calcul du schéma correspondant à la cible Android mobile, sans accès aux API Android depuis le navigateur ;
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

Les composants consomment directement les rôles `--md-sys-color-*` et, pour les seules extensions explicitement définies, `--namesia-color-*`. Aucun alias applicatif générique `--color-*`, `--ink`, `--muted` ou `--line` n'est admis. Material 3 ne définit pas `success`, `warning` et `info` parmi ses rôles système de base. Il prévoit toutefois l'extension d'un schéma par des couleurs personnalisées et leurs quatre rôles tonals. Namesia conserve les sources sémantiques éprouvées `success` (`#386A20`), `warning` (`#795900`) et `info` (`#005B9A`) ; `customColor` de Material Color Utilities génère pour chacune `color`, `onColor`, `colorContainer` et `onColorContainer` en clair et sombre. Ces extensions portent exclusivement le préfixe `--namesia-color-*` et ne sont jamais présentées comme des rôles système. Les erreurs utilisent les rôles M3 `error`. Aucune valeur de secours n'est autorisée dans `var()` : une donnée de thème absente doit rester visible comme défaut de contrat.

### Signature Rainbow

Les catégories utilisent trois familles de rôles tonals issues du schéma `Variant.RAINBOW` (`--namesia-color-category-1` à `--namesia-color-category-3`, avec leurs conteneurs et couleurs de premier plan). Une catégorie reçoit toujours la même teinte, quelle que soit la fiche ou l'ordre d'affichage. Une carte de prénom, un bouton ou une surface fonctionnelle ne constitue pas une catégorie : elle utilise les rôles Fidelity neutres ou sémantiques. Les titres, les accents typographiques et les fonds de page ne reçoivent pas de dégradé Rainbow. Les cartes d'associations peuvent recevoir une légère teinte stable issue de la catégorie, sur une surface Fidelity ; leur contour et leur badge utilisent respectivement la teinte et le rôle `on-container` de cette même catégorie, jamais un rôle tertiary générique. La vitrine « Les prénoms à découvrir » applique une surface neutre identique à ses cartes ; aucune carte ne reçoit primary, secondary ou tertiary selon sa position. Les variations de mise en page suivent la largeur disponible : trois colonnes sur grand écran, deux sur fenêtre intermédiaire et une sur écran compact.

## 3. Formes, typographie et élévation

- Typographie : Roboto pour tous les rôles, des titres aux contrôles et au corps. La police est chargée au build par `next/font/google`, auto-hébergée sur le domaine Namesia et préchargée ; `display: block` et `adjustFontFallback: false` empêchent l'ajout d'une police de substitution ; le navigateur ne contacte pas Google. Les sous-ensembles `latin` et `latin-ext` couvrent les textes français. Les graisses 400 et 500 sont chargées ; aucune police de substitution ni pile générique n’est définie. Le corps courant reste à 16 px.
- Échelle Material 3 : display large/medium/small 57/64, 45/52 et 36/44 px ; headline large/medium/small 32/40, 28/36 et 24/32 px ; title large/medium/small 22/28, 16/24 et 14/20 px ; body large/medium/small 16/24, 14/20 et 12/16 px ; label large/medium/small 14/20, 12/16 et 11/16 px. Les graisses sont strictement 400 et 500. Les libellés ne sont pas forcés en capitales. Chaque rôle possède ses tokens `--md-sys-typescale-*` de famille, taille, graisse, interligne et approche. Tous les textes utilisent l'interligne et l'approche du rôle correspondant, sans valeurs locales qui créent une échelle concurrente. Seuls les glyphes décoratifs surdimensionnés (initiale de vitrine et monogramme de fiche) conservent une boîte de ligne volontairement resserrée ; ils ne portent aucun contenu textuel.
- Les boutons (`Button`) et filtres sélectionnables (`FilterChip`) utilisent intégralement le rôle `label-large` : famille, taille, graisse, interligne et approche. La taille seule ne suffit pas à identifier un rôle typographique ; les variantes métier ne doivent pas remplacer ce rôle par un style `body`. Le Button AndroidX 1.5.0 dessine un conteneur de 40 dp (`ButtonSmallTokens.ContainerHeight`) dans une cible Web de 48 px, avec une largeur minimale de 58 dp, 24 dp de padding horizontal et 12 dp pour TextButton. Les icônes de Button font 18 dp (`ButtonDefaults.IconSize`) et celles d’IconButton 24 dp. OutlinedButton utilise `outline-variant` et `on-surface-variant` ; TextButton utilise `primary` conformément à l'implémentation AndroidX. Les états désactivés utilisent 10 % pour le conteneur Filled/Tonal (et pour le contour Outlined) et 38 % pour le contenu. L’état pressé adopte `corner-small`. Le `FilterChip` AndroidX 1.5.0 a un conteneur visuel de 32 dp (`FilterChipTokens.ContainerHeight`) ; sa cible tactile reste de 48 dp. L’adaptateur Web conserve un bouton natif de 48 px et dessine la capsule de 32 px dans cette cible, sans agrandir artificiellement la surface.
- Le champ de recherche (`SearchBar`) utilise un conteneur replié de 56 dp, une forme `full`, la couleur `surface-container-high` et le rôle `body-large` pour la saisie. L’icône initiale utilise `on-surface`, l’action finale `on-surface-variant`. Le champ garde un libellé HTML accessible même si seul le placeholder est visible. L’expansion native de SearchBar n’est pas reproduite : Namesia présente les résultats dans le flux de la page.
- Les espacements suivent une grille de 4 px, avec les pas de 8 px privilégiés. Les rayons sont exclusivement les tokens `--md-sys-shape-corner-*`.
- Formes : extra-small 4 px, small 8 px, medium 12 px, large 16 px, extra-large 28 px et full/pill.
- Élévation : hiérarchie tonale des surfaces en priorité ; aucune ombre CSS décorative n’est conservée. Les ombres ne sont utilisées que lorsqu’un composant AndroidX définit explicitement un niveau : Button et FilledTonalButton appliquent le niveau 1 au survol sur leur capsule visuelle, avec le rôle système `shadow`. Les niveaux M3 `--md-sys-elevation-level0` à `level5` restent des valeurs dp et ne sont pas directement des valeurs `box-shadow` ; la traduction Web est localisée dans le composant et documentée.
- Densité : cibles tactiles d'au moins 48 × 48 px lorsque l'espace le permet ; les éléments visuels peuvent être plus petits à l'intérieur de leur cible.

### Accueil

Les titres de section et leurs liens d'action forment un groupe lisible : sur grand écran, le lien reste aligné au titre ; sous 600 px, il passe sur sa propre ligne, sous le titre, sans comprimer celui-ci. Le lien conserve une cible tactile minimale de 48 px. Le hero sépare le message éditorial et les outils de découverte : introduction à gauche et panneau de recherche à droite à partir de 900 px, puis empilement naturel sur les fenêtres plus étroites. Le panneau utilise une surface Fidelity distincte, un contour discret et un titre explicite ; la recherche et la découverte aléatoire y forment un seul point de départ. Le texte descriptif utilise `on-surface-variant`, jamais la couleur primaire comme simple décoration. La mention de génération par IA reste visible dans le panneau, au même endroit que les outils auxquels elle se rapporte. Les cartes vedettes gardent une hauteur minimale plutôt qu'une hauteur rigide ; les noms longs peuvent revenir à la ligne sans pousser l'action de découverte hors de la carte. Les cartes du catalogue appliquent la même règle de retour à la ligne.

### Fiche de prénom

La fiche est un parcours de lecture : son introduction et ses rubriques utilisent le premier plan `on-surface`, avec l'échelle body large 16/24 px. Les libellés de rubrique et les métadonnées utilisent les rôles label/body adaptés, sans capitales forcées. Le sommaire est composé de liens natifs présentés comme des chips tonales outlined de 48 px de haut, avec états hover réservés aux pointeurs fins, pression tactile et focus clavier visible. Les ancres ménagent 88 px au-dessus de chaque rubrique pour que le titre reste visible sous la barre supérieure fixe. Les surfaces du hero, de la note éditoriale et de la découverte utilisent directement les rôles Fidelity dans leurs règles de base ; aucune couche tardive ne redéfinit ces composants.

## 4. Navigation adaptative

Les destinations de premier niveau sont Accueil, Explorer, Comparer et Favoris. Elles restent identiques sur toutes les tailles d'écran.

- **Compact, moins de 600 px :** navigation bar fixe en bas de 80 dp (variante haute utilisée par `NavigationBar()`), quatre destinations avec icône et libellé `label-medium` (12/16 px, graisse 500, approche 0,5 px), hauteur augmentée uniquement par `safe-area-inset-bottom`.
- **Medium et plus, à partir de 600 px :** navigation rail fixe sur le bord de départ, largeur de 80 px, icône et libellé `label-medium` (12/16 px, graisse 500, approche 0,5 px) empilés. Le rail reste à 80 px : le modèle Android du rail est conservé, sans tiroir latéral propriétaire qui réduirait inutilement l’espace de lecture.
- **Hauteur compacte, jusqu'à 480 px :** la navigation revient en bas même si la largeur dépasse 600 px, pour les fenêtres paysage peu hautes. Les éléments passent alors en disposition horizontale, mais le conteneur conserve les 80 dp de `TallContainerHeight` et le contenu réserve ces mêmes 80 dp, auxquels s'ajoute la zone sûre.
- La barre supérieure reste présente, avec la marque Namesia et une hauteur de 64 px.
- Le composable AndroidX `NavigationBar()` utilise `TallContainerHeight` (80 dp), et non le token `ContainerHeight` (64 dp) non retenu par son implémentation par défaut. Namesia reproduit ces 80 dp par 64 dp de zone de destinations et 8 dp de padding vertical, sans bordure ajoutée. La zone sûre basse est réservée séparément et le contenu de page reçoit le même dégagement. La destination courante utilise l'indicateur tonal en pilule et `aria-current="page"`.
- La navigation est une navigation de pages, pas un tablist ARIA : les liens natifs conservent l'historique, les ouvertures dans un nouvel onglet et les usages clavier du navigateur. Les destinations restent dans une liste HTML (`ul`/`li`) ; le conteneur ne doit pas utiliser `display: contents`, qui peut retirer la liste de l'arbre d'accessibilité de certains navigateurs.

Ces seuils suivent la logique des window size classes Android : la barre convient aux fenêtres compactes en largeur ou en hauteur et le rail aux fenêtres plus larges. Les adaptations sont pilotées par l'espace disponible, pas par la détection d'une marque d'appareil. Le rail ne possède pas de bouton d'extension artificiel : une navigation de premier niveau reste stable et prévisible.

## 5. Bibliothèque de composants

L'inventaire canonique est [Bibliothèque Material 3](composants.md). Les contrôles de présentation portent directement les noms AndroidX (`Button`, `IconButton`, `SearchBar`, `FilterChip`, `InputChip`, `Snackbar`, `TopAppBar`, `NavigationBar`, `NavigationRail`, `Icon`, `Card`, `TextField`) et sont implémentés dans `components/material3/`. Les champs de recherche utilisent `SearchBar` replié : 56 dp, forme `full`, surface `surface-container-high` et typographie `body-large`. Le libellé HTML reste présent ; l'effacement utilise `IconButton` et le contrôle natif de suppression du navigateur est masqué pour éviter une action concurrente. Les fonctions métier `FavoriteButton` et `ComparisonSelection` résident dans `components/features/` et composent les composants M3 sans les redéfinir. Les cartes de découverte sont des surfaces de navigation sobres : initiale, prénom, pictogramme de genre et flèche. Le résultat de la découverte aléatoire présente le même pictogramme à côté du prénom tiré au sort. Les pictogrammes sont centralisés dans `GenreIcon` et `lib/genre-icons.ts`, sans libellé visible redondant ; leur nom reste accessible aux technologies d'assistance. Les actions de favori et d'entrée dans le comparateur sont regroupées sur la fiche du prénom, où elles bénéficient du contexte complet. Le comparateur conserve ses cases à cocher pour sélectionner plusieurs prénoms. Les filtres de genre utilisent `FilterChip` icon-only avec nom accessible ; le filtre d'initiale conserve ses libellés. Le tri reste un élément `select` natif, habillé avec les tokens M3 ; aucun faux menu n'est créé.

`Card` centralise les variantes `elevated`, `filled` et `outlined` des surfaces de contenu. Les champs de formulaire utilisent `TextField` avec une variante explicite ; les sélecteurs spécialisés restent natifs. Les primitives communes portent les interactions et états transversaux ; les composants métier composent ces primitives et conservent leur logique propre. Les actions de l'administration et des parcours visiteurs utilisent les mêmes variantes de bouton Fidelity ; aucune classe globale de bouton ne constitue une seconde source de style. Les variantes des contrôles utilisent les rôles Fidelity. Une règle de style locale n'est pas une nouvelle primitive.

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

Les surfaces de l'accueil, des cartes vedettes, des fiches, du catalogue, du comparateur et du pied de page sont définies dans leurs règles canoniques, sans seconde couche de redéfinition tardive. Les actions de réinitialisation, d'effacement et de pagination utilisent `Button` en variante `text` ; les options de comparaison appliquent un état tonal sélectionné et des survols réservés aux pointeurs fins.

Les interactions utilisent les tokens M3 `--md-sys-motion-easing-*` et `--md-sys-motion-duration-*` ; les valeurs utilisées sont `short3`, `medium1` et `medium4`. Les couches d'état utilisent `--md-sys-state-hover-state-layer-opacity`, `--md-sys-state-focus-state-layer-opacity` et `--md-sys-state-pressed-state-layer-opacity`, selon l'état réel. Les valeurs M3 unitaires 0,08/0,12/0,16 sont exprimées en pourcentages CSS équivalents pour `color-mix`. Aucun pourcentage d'état n'est recopié dans les règles. Le lien d'évitement suit les mêmes tokens : aucune durée ni courbe n'est codée localement. La couche utilise la couleur de premier plan du composant, y compris sur l'indicateur sélectionné. Les cartes réagissent par une surface tonale plus élevée et un état pressé, sans déplacement ni ombre artificielle. Le mouvement doit rendre l'action compréhensible : indicateur qui s'étend, surface qui réagit à la pression, changement d'état animé. Les animations décoratives restent secondaires. `prefers-reduced-motion: reduce` supprime les mouvements non essentiels.

Les icônes fonctionnelles utilisent les tracés officiels Google Material Symbols Rounded, poids 400, embarqués localement et affichés sur une grille de 24 × 24 avec `currentColor`. Les variantes pleines ne sont utilisées que lorsqu'elles ont une forme réellement distincte : Accueil et Favoris changent de glyphe à l'état actif ; Recherche et Comparer conservent leur dessin officiel, et leur sélection est portée par l'indicateur tonal et le libellé. Les pictogrammes restent décoratifs pour les technologies d'assistance, le nom étant porté par le lien ou le bouton. Les cibles interactives restent d'au moins 48 × 48 px ; le SVG ne porte pas lui-même la cible. Les SVG de marque peuvent être colorés. Source et licence : `licenses/NOTICE-Material-Symbols.md` et `licenses/Apache-2.0-Material-Symbols.txt`.

### Focus clavier

Un seul sélecteur global applique l'indicateur de focus visible (contour primaire de 3 px avec décalage de 3 px) aux liens, boutons et champs natifs. Les composants peuvent enrichir leur état sélectionné ou pressé, mais ne redéfinissent pas le contour de focus. Le sélecteur de fichier des favoris conserve son input natif transparent sur toute la surface du libellé : le focus clavier reste ainsi visible autour du contrôle réellement focalisé, sans simuler un focus sur le libellé. Le lien d'évitement apparaît sur `:focus-visible`, comme les autres liens : la navigation au clavier est mise en évidence sans afficher un contour au simple toucher. Son calque reste au-dessus de la barre supérieure et des navigations fixes afin que le lien ne soit jamais masqué lorsqu'il reçoit le focus.

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

- Les cartes Open Graph du site et des fiches utilisent la même famille Roboto que l’interface, chargée depuis un fichier TTF local au runtime Node de `ImageResponse`. Le poids 400 suffit à cette surface de partage ; aucun appel Google Fonts, aucune police de substitution et aucune seconde famille ne sont utilisés. Les fonds, textes et accents reprennent les rôles clairs Fidelity ; aucun dégradé de marque hors M3 n'est conservé.

- `@material/material-color-utilities` génère les rôles Fidelity/Rainbow et les quatre rôles des couleurs sémantiques personnalisées ; aucun autre moteur de thème n'est ajouté.
- Les images Open Graph du site et des fiches utilisent le schéma clair généré par `getMaterialThemeTokens(false)` : fond, surfaces, textes, monogramme et accents proviennent des rôles Fidelity. Elles ne définissent aucune couleur hexadécimale ni dégradé de marque parallèle.
- Les références de composants sont les guides M3 et les sources AndroidX Compose Material 3 ; les ports React/HTML portent les noms M3 et sont centralisés dans `components/material3/`.
- `lib/material-theme.ts` génère le CSS Fidelity/Rainbow initial et les couleurs de barre navigateur ; `components/material3/MaterialThemeProvider.tsx` synchronise les mêmes valeurs avec les changements de préférence système.
- `app/layout.tsx` charge Roboto via `next/font/google` et expose `--font-roboto` à tous les rôles typographiques ; les tokens ne désignent jamais une famille non chargée.
- `components/navigation-adaptative.tsx` porte la navigation de premier niveau.
- `components/material3/` contient les composants de présentation M3 ; `components/features/` contient les compositions propres au produit.
- `app/layout.tsx` compose la barre supérieure, le rail/la barre de navigation, le contenu et le pied de page.
- `styles/material3/tokens.css` centralise les rôles typographiques, formes, mouvements et couches d'état M3. `app/globals.css` porte la structure du shell et les règles sémantiques globales ; les couleurs sont générées par `lib/material-theme.ts` dans le `<head>` dès le rendu serveur. Aucune palette statique parallèle ni fallback CSS n'existe.
- Les CSS Modules consomment les tokens partagés. Ils gèrent la disposition propre à un composant, sans redéfinir les styles d'un contrôle commun.
- Les contrats AndroidX sont portés explicitement en React/HTML. Material Web 2.5.0 n'est pas retenu comme dépendance structurante : son projet est en maintenance en attente de nouveaux mainteneurs et son implémentation ne garantit pas la parité AndroidX.

## 9. Références et limites de fidélité

La spécification [Material Design 3](https://m3.material.io/) est la référence normative pour les rôles, les composants, l'anatomie, les états et les comportements. Les sources AndroidX Jetpack Compose Material 3 (`androidx/compose/material3`) sont la référence d'implémentation concrète : API `MaterialTheme`/`ColorScheme`, valeurs baseline et implémentation des composants standards. Les sources AndroidX sont consultées pour reproduire les mêmes noms, variantes, dimensions et états ; elles ne sont pas importées dans Next.js, car Compose est une implémentation Kotlin/Android. Le Web traduit ces contrats en React et HTML natif. Material Color Utilities est la source de l'algorithme Fidelity/Rainbow et des couleurs personnalisées. La version `2021` citée plus haut concerne uniquement son algorithme ColorSpec. Le système visuel Namesia reste Material 3 standard, pas Material 3 Expressive.

Le registre des rôles, les sources officielles, les vérifications automatisées et les exceptions Web sont détaillés dans [Vérification Material 3](material-3-verification.md). La navigation, les icônes et les surfaces du site sont des implémentations Web accessibles des modèles Material. Le Web ne peut pas reproduire les gestes système, les barres système transparentes, le retour prédictif Android, les animations natives exactes ni l'extraction du fond d'écran. Ces éléments ne doivent pas être simulés de manière trompeuse.


## 10. Fidélité d'interaction Pixel

La fidélité ne se limite pas aux couleurs. Les interactions doivent reproduire les conventions observables de Material 3 sur Android :

- Les actions primaires utilisent les boutons filled ; les actions secondaires utilisent tonal, outlined ou text selon leur importance.
- Les états hover, focus-visible, pressed, disabled, selected, loading et error sont cohérents entre les contrôles. Les liens du fil d'Ariane et du pied de fiche ne changent de couleur au survol que sur pointeur fin. Toute règle `:hover` est réservée à `@media (hover: hover) and (pointer: fine)` ; les états tactiles reposent sur `:active` et ne dépendent jamais du hover. Les puces de filtre réservent le survol aux pointeurs fins et conservent un état pressé tactile.
- Les transitions utilisent les tokens de mouvement communs. Les éléments de navigation animent l'indicateur, pas la position des libellés ; les actions ne déclenchent pas de zoom agressif.
- Les composants interactifs gardent une cible tactile de 48 × 48 px au minimum. La taille visuelle de l'icône ne détermine pas celle de la cible.
- Les surfaces suivent les niveaux Material : fond, surface basse, surface, surface haute et surface la plus haute. Les dégradés et ombres ne remplacent pas cette hiérarchie.
- Les icônes restent cohérentes : SVG local, grille 24 px, épaisseur et remplissage harmonisés, couleur héritée. Les pictogrammes de genre sont centralisés dans `GenreIcon` et remplacent les libellés visibles sur toutes les vues de prénoms ; leur nom reste accessible aux lecteurs d'écran. Les pictogrammes de marque ne sont pas mélangés aux icônes fonctionnelles.
- Les cartes de découverte restent des surfaces de navigation sobres : aucun bouton de favori ou de comparaison ne vient réduire l'espace du nom, de son initiale ou de ses métadonnées. Ces deux actions sont proposées sur la fiche du prénom ; la page Comparateur conserve uniquement son mécanisme de sélection propre à cet outil.
- Les barres de navigation compactes et les rails medium/expanded sont des modèles de navigation de page ; ce ne sont ni des onglets ni une imitation des barres système Android.

La fidélité est évaluée sur l'ensemble des parcours (accueil, catalogue, fiche, comparateur, favoris et administration), en clair/sombre, à 320 px, 600 px, 840 px et sur grand écran. Une simple conformité des tokens ne suffit pas si les composants visibles conservent des styles concurrents.


## Tableau comparatif

Le comparateur utilise un tableau HTML natif : les critères sont des en-têtes de ligne et les prénoms des en-têtes de colonne. Le conteneur de défilement horizontal est focalisable au clavier ; sur petit écran, la colonne des critères reste fixe pendant le défilement. Les cellules conservent les surfaces, séparateurs, typographies et contrastes des rôles Fidelity. Ne pas remplacer ce tableau par des cartes indépendantes : l'alignement des critères est la fonction principale de cette vue.
