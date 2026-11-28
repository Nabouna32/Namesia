# ADR-0035 — Fidélité du champ de recherche à SearchBar AndroidX

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:05:17 (Europe/Paris)
- **Évolution de structure :** le champ porte désormais le nom officiel `SearchBar` dans `components/material3/`. Le périmètre Web reste le champ replié, sans panneau expansé simulé ; voir ADR-0037.
- **Décision prise le :** 2026-11-24 (heure non consignée)
- **Référence :** Compose Material 3 1.5.0 stable, commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`
- **Remplace :** uniquement les choix de présentation du champ décrits dans ADR-0008 ; le partage de la primitive et la séparation de la logique métier restent valides.

## Contexte

`ChampRecherche` est partagé entre le catalogue, le comparateur et les favoris. Son apparence antérieure mélangeait une surface `surface-container-low`, un contour de champ de formulaire, un rayon `large` et une variante compacte propre à l'accueil. Ce mélange ne correspondait pas à un composant AndroidX identifié. Il donnait aussi des traitements différents au même contrôle selon son écran.

## Challenge

- **Conserver l'ancien champ outlined :** son contour et son rayon de 16 px relèvent d'une adaptation de formulaire improvisée, alors que ce contrôle est une recherche.
- **Le convertir en `OutlinedTextField` :** composant valide pour un formulaire, mais moins adapté à l'intention de recherche et à la forme de recherche Material 3.
- **Reproduire entièrement `SearchBar` :** cela imposerait l'expansion, le panneau de suggestions, le scrim et le comportement clavier Android ; Namesia affiche déjà les résultats dans le flux de page et ne doit pas créer un faux panneau.
- **Reprendre seulement son champ replié :** conserve le parcours de recherche existant tout en alignant sa surface et sa géométrie sur AndroidX.

## Décision

Conserver le nom métier `ChampRecherche` et son API de valeur contrôlée, mais aligner son champ replié sur `SearchBarTokens` AndroidX 1.5.0 :

- hauteur de 56 dp ;
- forme `CornerFull` ;
- surface `SurfaceContainerHigh` ;
- texte de saisie `BodyLarge` ;
- icône initiale `OnSurface` et action finale `OnSurfaceVariant` ;
- élévation tonale et ombre nulles (`Level0`) ;
- indicateur de focus clavier dessiné sur le conteneur complet de la capsule, avec `primary`, un contour de 2 px et le même rayon `full` ; le champ intérieur ne dessine pas de rectangle concurrent.

Le label HTML demeure présent et accessible, mais il n'est plus affiché au-dessus du champ ; le placeholder visible ne devient jamais le seul nom accessible. Le bouton d'effacement reste une action Namesia partagée et restitue le focus au champ. Le bouton de suppression natif du navigateur reste masqué pour éviter une action concurrente.

La variante visuelle `compact` du champ est supprimée. La compacité de l'accueil reste une décision de composition du parcours et de limitation des résultats, pas une variante du composant M3.

## Conséquences

- Une seule apparence de recherche sur les parcours accueil, catalogue, comparateur et favoris.
- Le rayon de formulaire et le contour outlined ne sont plus appliqués à une recherche.
- Les résultats restent intégrés au flux Namesia ; aucune expansion ou surface de résultats fictive n'est introduite.
- Le focus clavier conserve un anneau continu autour de toute la capsule, au lieu d'un rectangle autour du seul input. Le sélecteur `:focus-visible` évite de déclencher cet anneau au simple clic ; `:has()` transmet l'état du champ à son conteneur sans ajouter de wrapper interactif.

## Vérification

La CI vérifie la hauteur, la forme, la surface, la typographie, les couleurs d'icônes, l'accessibilité du label et l'absence de variante compacte. Les tokens sont sourcés dans `SearchBar.kt` et `SearchBarTokens.kt` sur le commit AndroidX épinglé. La revue visuelle reste nécessaire en clair/sombre, à 320 px, 600 px et sur grand écran.
