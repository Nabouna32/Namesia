# Système de design — Namesia

- **Statut :** référence visuelle canonique
- **Version :** 3.1
- **Mis à jour :** 2026-11-23

## Intention

Namesia est un univers éditorial consacré aux prénoms : son interface doit être chaleureuse, expressive, lumineuse et immédiatement reconnaissable. La couleur fait partie de son identité. Le rainbow historique est conservé comme signature visuelle, accompagné d'accents rose, violet, pêche, doré, vert et bleu. Les pages ne doivent pas être ramenées à une interface monochrome ou à un bleu d'action omniprésent.

La qualité s'appuie sur des conventions éprouvées des produits web soignés : hiérarchie visuelle claire, typographie lisible, grilles cohérentes, espaces généreux, contrastes contrôlés, composants prévisibles, retours d'interaction discrets et navigation mobile robuste. La personnalité vient de l'association de ces fondamentaux avec une palette éditoriale colorée, pas d'une accumulation d'effets.

La couleur est organisée par rôle :
- les couleurs de marque et les dégradés donnent le ton et distinguent les espaces éditoriaux ;
- les couleurs d'accent guident vers les liens et les actions ;
- les couleurs sémantiques signalent exclusivement un succès, un avertissement, une erreur ou une information ;
- les surfaces et le texte restent suffisamment neutres pour préserver le confort de lecture.

## Palette et tokens

Les tokens sont définis dans `app/globals.css`. Les CSS Modules consomment ces variables et ne recréent pas leur propre palette.

| Token | Mode clair | Mode sombre | Usage |
|---|---|---|---|
| `--color-background` | `#fffafd` | `#191421` | Fond général |
| `--color-surface` | `#ffffff` | `#241c2d` | Cartes, champs, navigation |
| `--color-surface-muted` | `#fff1f7` | `#302338` | Fonds secondaires |
| `--color-text` | `#30243b` | `#f8effa` | Texte principal |
| `--color-text-muted` | `#6f6278` | `#d1bfd8` | Texte secondaire |
| `--color-border` | `#eedfeb` | `#4b3852` | Contours et séparateurs |
| `--color-accent` | `#8b3fa5` | `#dda2e9` | Liens et actions |
| `--color-accent-hover` | `#6d2e83` | `#f0c6f5` | Survol des liens et actions |
| `--color-success` | `#176b4b` | `#83d7ad` | Confirmation et réussite |
| `--color-warning` | `#8a5a0a` | `#f1c276` | Attention et précaution |
| `--color-error` | `#b4234d` | `#ff9baa` | Erreurs et validation invalide |
| `--color-info` | `#2868a6` | `#91c5f2` | Information neutre |
| `--color-focus` | `#9c4fba` | `#e2a9f0` | Indicateur de focus |

Les accents complémentaires (`--color-pink`, `--color-orange`, `--color-gold`, `--color-green`, `--color-blue`, `--color-violet`) et `--color-rainbow` servent aux compositions de marque et aux surfaces éditoriales. Le dégradé rainbow est réservé aux signatures, titres mis en valeur et détails décoratifs ; il ne sert jamais de fond à un long texte ni d'indicateur d'état.

Les couleurs d'état sont distinctes des couleurs de marque. Une erreur ne devient pas violette, une information ne devient pas un succès et un dégradé ne remplace jamais un message explicite. Ne jamais exprimer une information uniquement par la couleur : conserver un libellé, une icône ou une indication textuelle adaptée.

Les couleurs de texte courant et secondaire doivent conserver un contraste WCAG AA d'au moins 4,5:1 sur leur surface réelle. Vérifier les combinaisons effectivement utilisées, y compris les thèmes sombres et les cartes colorées ; ne pas supposer qu'une paire est conforme parce que ses couleurs semblent douces.

## Typographie

Deux registres complémentaires :
- pile sans empattement système pour le corps, la navigation, les contrôles et les données ;
- Georgia (ou serif système équivalente) pour les grands titres éditoriaux, les noms de prénoms et les compositions de découverte.

Aucune police distante ni dépendance typographique n'est nécessaire. Échelle indicative :
- 12 px : métadonnées uniquement ;
- 14 px : aides, avertissements, navigation et actions secondaires ;
- 16 px : corps, contrôles et textes de fiche ;
- 18–21 px : introductions et textes mis en avant ;
- 24–38 px : titres de section ;
- 40–88 px : titres principaux, fluides selon l'écran.

Le corps utilise un interligne de 1,6 à 1,75. Les paragraphes éditoriaux restent limités en largeur. Aucun texte utile (aide, avertissement, erreur, action) ne doit être réduit pour faire tenir une composition.

## Composition, espacements et surfaces

- Grille et largeur de lecture cohérentes, avec un conteneur principal plafonné à 1 120 px.
- Échelle d'espacement basée sur 4 px : 4, 8, 12, 16, 20, 24, 32, 40 et 48 px.
- Rayons : 8 px (petit), 12 px (standard), 16 px (grand), 24 px (mise en avant) ; pilule pour les badges et filtres adaptés.
- Ombres douces pour les plans qui doivent se détacher ; les bordures suffisent pour les séparations simples.
- Surfaces éditoriales pastel autorisées et encouragées lorsqu'elles distinguent une section ou une carte. Les textes qui y figurent restent dans une couleur foncée contrastée.
- Les cartes de prénoms mis en avant peuvent avoir des variantes de couleurs distinctes, mais conservent les mêmes dimensions, la même hiérarchie et les mêmes interactions.

## Interactions et mouvement

- Les interactions ont un retour perceptible : couleur, bordure, ombre ou léger déplacement. Les cartes peuvent se soulever de quelques pixels au survol ; les flèches et détails peuvent bouger subtilement.
- Les transitions restent courtes (environ 150 à 250 ms) et ne doivent pas retarder les actions.
- Les animations décoratives sont lentes, discrètes et ne doivent jamais gêner la lecture ou détourner l'attention des contrôles.
- `prefers-reduced-motion: reduce` désactive les mouvements non essentiels et les transitions ; aucune information ne dépend d'une animation.
- **Focus :** contour de 3 px utilisant `--color-focus`, avec un décalage de 3 px, visible sur les liens, boutons, champs et sélecteurs.
- **Désactivé :** opacité réduite et curseur adapté, sans perdre la lisibilité.
- **Chargement :** conserver l'espace du contrôle et annoncer l'état si une opération asynchrone existe.
- **Erreur / succès / avertissement / information :** utiliser le token sémantique correspondant et un texte explicite.

## Thèmes et responsive

Le thème suit `prefers-color-scheme`. Les tokens et les composants doivent fonctionner dans les deux thèmes ; les surfaces pastel du mode clair sont adaptées en tons profonds dans le mode sombre, sans conserver des textes sombres sur des fonds foncés.

La conception part du mobile. À 320 px et à 200 % de zoom, le contenu ne déborde pas horizontalement. Les zones tactiles visent au moins 44 × 44 px. La navigation conserve un espacement explicite, peut revenir à la ligne et ne réduit jamais les zones cliquables pour gagner quelques pixels. Les adaptations des écrans étroits sont déclarées après les règles des seuils plus larges.

## Architecture et application

- `app/globals.css` porte les tokens, thèmes, composants globaux et règles de mouvement.
- Les CSS Modules consomment les tokens ; ils ne réintroduisent pas de couleurs arbitraires pour des éléments récurrents.
- Accueil, catalogue, comparateur, fiches et administration partagent les mêmes règles de typographie, de contraste, de focus et d'espacement.
- Les pages peuvent avoir des compositions colorées propres à leur rôle, à condition de respecter les tokens et le contraste.
- Les champs et actions de l'administration gardent une hauteur tactile minimale de 44 px ; les contrôles de saisie utilisent 16 px et les aides courantes 14 px.
- Les rubriques éditoriales et les notes d'association utilisent le texte principal pour les titres et le texte secondaire pour les descriptions ; les couleurs de marque servent à identifier les catégories et les repères, pas à colorer tous les paragraphes.
- Le comparateur garde des états de sélection clairement visibles, un focus global et des zones tactiles de 44 px.
- La stack reste fondée sur CSS natif et CSS Modules : aucun framework visuel supplémentaire n'est nécessaire pour retrouver une identité cohérente.
