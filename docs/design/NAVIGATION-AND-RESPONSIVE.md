# Navigation, responsive et accessibilité — Namesia

- **Version :** 1.2
- **Mis à jour le :** 2026-11-28 11:12:41 (Europe/Paris)


Ce guide complète les [fondations visuelles](FOUNDATIONS.md), les [composants](COMPONENTS.md) et le [système de design](../DESIGN-SYSTEM.md).

## 4. Navigation adaptative

Les destinations de premier niveau sont Accueil, Explorer, Comparer et Favoris. Elles restent identiques sur toutes les tailles d'écran.

- **Compact, moins de 600 px :** navigation bar fixe en bas de 80 dp (variante haute utilisée par `NavigationBar()`), quatre destinations avec icône et libellé `label-medium` (12/16 px, graisse 500, approche 0,5 px), hauteur augmentée uniquement par `safe-area-inset-bottom`.
- **Medium et plus, à partir de 600 px :** navigation rail fixe sur le bord de départ, largeur de 80 px, icône et libellé `label-medium` (12/16 px, graisse 500, approche 0,5 px) empilés. Le rail reste à 80 px : le modèle Android du rail est conservé, sans tiroir latéral propriétaire qui réduirait inutilement l’espace de lecture.
- **Hauteur compacte, jusqu'à 480 px :** la navigation revient en bas même si la largeur dépasse 600 px, pour les fenêtres paysage peu hautes. Les éléments passent alors en disposition horizontale, mais le conteneur conserve les 80 dp de `TallContainerHeight` et le contenu réserve ces mêmes 80 dp, auxquels s'ajoute la zone sûre.
- La barre supérieure reste présente, avec la marque Namesia et une hauteur de 64 px.
- Le composable AndroidX `NavigationBar()` utilise `TallContainerHeight` (80 dp), et non le token `ContainerHeight` (64 dp) non retenu par son implémentation par défaut. Namesia reproduit ces 80 dp par 64 dp de zone de destinations et 8 dp de padding vertical, sans bordure ajoutée. La zone sûre basse est réservée séparément et le contenu de page reçoit le même dégagement. La destination courante utilise l'indicateur tonal en pilule et `aria-current="page"`.
- La navigation est une navigation de pages, pas un tablist ARIA : les liens natifs conservent l'historique, les ouvertures dans un nouvel onglet et les usages clavier du navigateur. Les destinations restent dans une liste HTML (`ul`/`li`) ; le conteneur ne doit pas utiliser `display: contents`, qui peut retirer la liste de l'arbre d'accessibilité de certains navigateurs.

Les seuils de largeur suivent les window size classes AndroidX : compact sous 600 dp, medium de 600 à 839 dp, expanded de 840 à 1199 dp, large de 1200 à 1599 dp et extra-large à partir de 1600 dp. Sur les fenêtres medium, la fiche prénom conserve une seule colonne éditoriale et place l'encadré de prudence après le contenu, avec une largeur maximale de 460 px. La colonne latérale fixe de 270 px ne s'active qu'à partir de 840 px : le rail de 80 px ne doit pas réduire le texte principal à une largeur résiduelle sur les fenêtres de 600 à 839 px. Les associations symboliques utilisent une grille auto-adaptative avec une largeur minimale de 320 px par carte ; une carte isolée occupe toute la largeur disponible au lieu de rester artificiellement cantonnée à une demi-colonne. La composition du hero et la grille vedette basculent à l'entrée en expanded ; le rail remplace la barre dès medium. La barre reste prioritaire lorsque la hauteur disponible est compacte (moins de 480 dp), même si la largeur est medium ou supérieure. La référence et la date de vérification de ces seuils figurent dans [Vérification Material 3](../MATERIAL-3-VERIFICATION.md). Les adaptations sont pilotées par l'espace disponible, pas par la détection d'une marque d'appareil. Le rail ne possède pas de bouton d'extension artificiel : une navigation de premier niveau reste stable et prévisible.

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
