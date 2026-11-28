# Composants et interactions — Namesia

- **Version :** 1.8
- **Mis à jour le :** 2026-11-28 11:41:28 (Europe/Paris)


Pour les API et recettes d'implémentation, consulter la [bibliothèque de composants](COMPONENTS.md). La source des contrats M3 est détaillée dans la [vérification Material 3](../MATERIAL-3-VERIFICATION.md).

## 5. Bibliothèque de composants

Le registre complet, les API, les états, les recettes de composition et les conventions d'implémentation sont maintenus dans la [bibliothèque de composants](COMPONENTS.md). Cette section ne duplique pas cet inventaire.


## 6. Composants et états

Les composants doivent partager les mêmes rôles, formes et interactions :
- boutons filled, tonal, outlined et text ;
- champs de saisie, recherche et sélection ;
- cartes élevées, remplies ou avec contour ;
- chips de filtre et de suggestion ;
- navigation bar, navigation rail et barre supérieure ;
- notifications via `Snackbar`, avec actions et fermeture optionnelles ;
- confirmations nécessitant une décision explicite via `AlertDialog` ;
- menus, feuilles et boutons flottants uniquement lorsqu'un parcours utilisateur réel les justifie. Ils ne font pas partie de la bibliothèque actuelle et ne doivent pas être créés par anticipation : le besoin produit, le contrat AndroidX et les états nécessaires doivent être établis avant leur ajout.

États attendus : repos, survol, focus clavier, pressé, sélectionné, désactivé, chargement, erreur et succès. Les états sont explicites et ne reposent jamais sur la couleur seule.

Les surfaces de l'accueil, des cartes vedettes, des fiches, du catalogue, du comparateur et du pied de page sont définies dans leurs règles canoniques, sans seconde couche de redéfinition tardive. Les actions de réinitialisation, d'effacement et de pagination utilisent `Button` en variante `text` ; les options de comparaison appliquent un état tonal sélectionné et des survols réservés aux pointeurs fins.

Les interactions utilisent les tokens M3 `--md-sys-motion-easing-*` et `--md-sys-motion-duration-*` ; les valeurs utilisées sont `short3`, `medium1` et `medium4`. Les couches d'état utilisent `--md-sys-state-hover-state-layer-opacity`, `--md-sys-state-focus-state-layer-opacity` et `--md-sys-state-pressed-state-layer-opacity`, selon l'état réel. Les valeurs M3 unitaires 0,08/0,12/0,16 sont exprimées en pourcentages CSS équivalents pour `color-mix`. Aucun pourcentage d'état n'est recopié dans les règles. Le lien d'évitement suit les mêmes tokens : aucune durée ni courbe n'est codée localement. La couche utilise la couleur de premier plan du composant, y compris sur l'indicateur sélectionné. Les cartes réagissent par une surface tonale plus élevée et un état pressé, sans déplacement ni ombre artificielle. Le mouvement doit rendre l'action compréhensible : indicateur qui s'étend, surface qui réagit à la pression, changement d'état animé. Les animations décoratives restent secondaires. `prefers-reduced-motion: reduce` supprime les mouvements non essentiels.

Les icônes fonctionnelles utilisent les tracés officiels Google Material Symbols Rounded, poids 400, embarqués localement et affichés sur une grille de 24 × 24 avec `currentColor`. Les variantes pleines ne sont utilisées que lorsqu'elles ont une forme réellement distincte : Accueil et Favoris changent de glyphe à l'état actif ; Recherche et Comparer conservent leur dessin officiel, et leur sélection est portée par l'indicateur tonal et le libellé. Les pictogrammes restent décoratifs pour les technologies d'assistance, le nom étant porté par le lien ou le bouton. Sur toutes les cartes qui naviguent vers une fiche interne (découverte, suggestions liées, résultats de recherche et favoris), la carte entière est l'unique lien `Card` ; le chevron `chevron_right` est rendu par le composant partagé `Icon`, décoratif (`aria-hidden`), sans `IconButton` imbriqué, cercle de fond ni seconde action. Les liens internes utilisent `chevron_right` pour progresser et `chevron_left` pour revenir dans la hiérarchie. `arrow_outward` est réservé aux ressources qui quittent le site ; il ne remplace jamais un chevron interne. Les glyphes directionnels sont centralisés dans `components/material3/Icon.tsx`, et leurs sources officielles Google sont consignées dans `licenses/NOTICE-MATERIAL-SYMBOLS.md`. Le registre `Icon` ne contient que des glyphes Google vérifiés au commit épinglé ; les pictogrammes de genre sont des formes Namesia propres aux données, isolées dans `GenderIcon` et `lib/gender-icons.ts`, sans être présentées comme des Material Symbols. Les états vides des favoris utilisent également `Card` en variante `outlined` ; les CSS métier ne redéfinissent que leur disposition et leurs espacements, pas la surface, la bordure ni la forme M3. L'encadré de prudence et la section de suggestions des fiches suivent la même règle et composent `Card` outlined ; le glyphe d'information utilise le symbole Google `info` centralisé. Les cibles interactives restent d'au moins 48 × 48 px ; le SVG ne porte pas lui-même la cible. Les SVG de marque peuvent être colorés. Source et licence : `licenses/NOTICE-MATERIAL-SYMBOLS.md` et `licenses/Apache-2.0-Material-Symbols.txt`.

### Focus clavier

Le sélecteur global applique l'indicateur de focus visible (contour primaire de 3 px avec décalage de 3 px) aux liens, boutons et champs natifs standards. `SearchBar` constitue une exception intentionnelle et documentée : l'anneau primaire de 2 px entoure le conteneur complet de la capsule (`CornerFull`), déclenché par `:has(input:focus-visible)` ; le champ intérieur ne dessine aucun rectangle concurrent. Cette géométrie est une partie du rendu M3/Fidelity et ne doit pas être remplacée par un indicateur générique. Les composants peuvent enrichir leur état sélectionné ou pressé, mais toute géométrie de focus propre à un composant doit être vérifiée contre son anatomie AndroidX et observée ponctuellement dans un vrai navigateur lorsqu'une modification le justifie. Cette vérification visuelle est un diagnostic de développement : elle ne crée ni capture persistante ni assertion Playwright permanente une fois le rendu validé. Le sélecteur de fichier des favoris conserve son input natif transparent sur toute la surface du libellé : le focus clavier reste ainsi visible autour du contrôle réellement focalisé, sans simuler un focus sur le libellé. Le lien d'évitement apparaît sur `:focus-visible`, comme les autres liens : la navigation au clavier est mise en évidence sans afficher un contour au simple toucher. Son calque reste au-dessus de la barre supérieure et des navigations fixes afin que le lien ne soit jamais masqué lorsqu'il reçoit le focus.

### Structure verticale et pied de page

L'application occupe au minimum la hauteur de la fenêtre avec une colonne flex. La zone de contenu est elle-même une colonne flex ; son élément principal prend l'espace libre et le pied de page reste après le contenu, poussé en bas lorsque la page est courte. Aucune hauteur minimale arbitraire du contenu éditorial ne sert à simuler cet alignement : les pages longues grandissent naturellement et le pied de page suit leur fin.

## 8. Architecture

- Les cartes Open Graph du site et des fiches utilisent la même famille Roboto que l’interface, chargée depuis un fichier TTF local au runtime Node de `ImageResponse`. Le poids 400 suffit à cette surface de partage ; aucun appel Google Fonts, aucune police de substitution et aucune seconde famille ne sont utilisés. Les fonds, textes et accents reprennent les rôles clairs Fidelity ; aucun dégradé de marque hors M3 n'est conservé.

- `@material/material-color-utilities` génère les rôles Fidelity/Rainbow et les quatre rôles des couleurs sémantiques personnalisées ; aucun autre moteur de thème n'est ajouté.
- Les images Open Graph du site et des fiches utilisent le schéma clair généré par `getMaterialThemeTokens(false)` : fond, surfaces, textes, monogramme et accents proviennent des rôles Fidelity. Elles ne définissent aucune couleur hexadécimale ni dégradé de marque parallèle.
- Les références de composants sont les guides M3 et les sources AndroidX Compose Material 3 ; les ports React/HTML portent les noms M3 et sont centralisés dans `components/material3/`.
- Material 3 Fidelity est la base visuelle et comportementale forte : les composants M3 réalisables proprement en React/HTML sont privilégiés. Une adaptation Web ou une exception est motivée par un besoin concret (accessibilité, ergonomie, limite de plateforme, qualité ou maintenance), documentée et réexaminable ; elle ne vaut pas interdiction d'évoluer ultérieurement.
- `lib/material-theme.ts` génère le CSS Fidelity/Rainbow et les couleurs de barre navigateur. Le navigateur applique les schémas clair/sombre avec `prefers-color-scheme` ; aucune couche React cliente n'est nécessaire.
- `app/layout.tsx` charge Roboto via `next/font/google` et expose `--font-roboto` à tous les rôles typographiques ; les tokens ne désignent jamais une famille non chargée.
- `components/material3/TopAppBar.tsx`, `NavigationBar.tsx` et `NavigationRail.tsx` portent le shell ; `NavigationDestinations.tsx` centralise les quatre destinations sans dupliquer leurs liens ni leurs états.
- `components/material3/` contient les composants de présentation M3 ; `components/features/` contient les compositions propres au produit.
- `app/layout.tsx` compose la barre supérieure, le rail/la barre de navigation, le contenu et le pied de page.
- `styles/material3/tokens.css` centralise les rôles typographiques, formes, mouvements et couches d'état M3. `app/globals.css` porte la structure du shell et les règles sémantiques globales ; les couleurs sont générées par `lib/material-theme.ts` dans le `<head>` dès le rendu serveur. Aucune palette statique parallèle ni fallback CSS n'existe.
- Les CSS Modules consomment les tokens partagés. Ils gèrent la disposition propre à un composant, sans redéfinir les styles d'un contrôle commun.
- Les contrats AndroidX sont portés explicitement en React/HTML. Material Web 2.5.0 n'est pas retenu comme dépendance structurante : son projet est en maintenance en attente de nouveaux mainteneurs et son implémentation ne garantit pas la parité AndroidX.

## 10. Fidélité d'interaction Pixel

La fidélité ne se limite pas aux couleurs. Les interactions doivent reproduire les conventions observables de Material 3 sur Android :

- Les actions primaires utilisent les boutons filled ; les actions secondaires utilisent tonal, outlined ou text selon leur importance.
- Les états hover, focus-visible, pressed, disabled, selected, loading et error sont cohérents entre les contrôles. Les liens du fil d'Ariane et du pied de fiche ne changent de couleur au survol que sur pointeur fin. Toute règle `:hover` est réservée à `@media (hover: hover) and (pointer: fine)` ; les états tactiles reposent sur `:active` et ne dépendent jamais du hover. Les puces de filtre réservent le survol aux pointeurs fins et conservent un état pressé tactile.
- Les transitions utilisent les tokens de mouvement communs. Les éléments de navigation animent l'indicateur, pas la position des libellés ; les actions ne déclenchent pas de zoom agressif.
- Les composants interactifs gardent une cible tactile de 48 × 48 px au minimum. La taille visuelle de l'icône ne détermine pas celle de la cible.
- Les surfaces suivent les niveaux Material : fond, surface basse, surface, surface haute et surface la plus haute. Les dégradés et ombres ne remplacent pas cette hiérarchie.
- Les icônes restent cohérentes : SVG local, grille 24 px, épaisseur et remplissage harmonisés, couleur héritée. Les pictogrammes de genre sont centralisés dans `GenderIcon` et remplacent les libellés visibles sur toutes les vues de prénoms ; leur nom reste accessible aux lecteurs d'écran. Les pictogrammes de marque ne sont pas mélangés aux icônes fonctionnelles.
- Les cartes de découverte restent des surfaces de navigation sobres : aucun bouton de favori ou de comparaison ne vient réduire l'espace du nom, de son initiale ou de ses métadonnées. Ces deux actions sont proposées sur la fiche du prénom ; la page Comparateur conserve uniquement son mécanisme de sélection propre à cet outil.
- Les barres de navigation compactes et les rails medium/expanded sont des modèles de navigation de page ; ce ne sont ni des onglets ni une imitation des barres système Android.

La fidélité est évaluée sur l'ensemble des parcours (accueil, catalogue, fiche, comparateur, favoris et administration), en clair/sombre, à 320 px, 600 px, 840 px et sur grand écran. Une simple conformité des tokens ne suffit pas si les composants visibles conservent des styles concurrents.

## Tableau comparatif

Le comparateur utilise un tableau HTML natif : les critères sont des en-têtes de ligne et les prénoms des en-têtes de colonne. Le conteneur de défilement horizontal est focalisable au clavier ; sur petit écran, la colonne des critères reste fixe pendant le défilement. Les cellules conservent les surfaces, séparateurs, typographies et contrastes des rôles Fidelity. Ne pas remplacer ce tableau par des cartes indépendantes : l'alignement des critères est la fonction principale de cette vue.
