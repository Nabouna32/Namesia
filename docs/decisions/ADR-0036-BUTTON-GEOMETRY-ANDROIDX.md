# ADR-0036 — Géométrie et états des boutons AndroidX

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:05:17 (Europe/Paris)
- **Évolution de structure :** le composant est désormais `Button` dans `components/material3/`. Les dimensions et états AndroidX décrits ici restent la référence ; la nomenclature et l'architecture sont définies par ADR-0037.
- **Décision prise le :** 2026-11-24 (heure non consignée)
- **Référence :** Compose Material 3 1.5.0 stable, commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`

## Contexte

La primitive `Bouton` partageait bien ses variantes entre les parcours, mais son conteneur visuel occupait toute la cible tactile de 48 px. Son apparence divergeait ainsi du Button AndroidX : la capsule standard mesure 40 dp. La variante Outlined utilisait `outline` et `primary`, alors qu'AndroidX définit `outline-variant` et `on-surface-variant`. TextButton reste `primary` dans l'implémentation AndroidX, malgré un token contradictoire. Enfin, l'état désactivé appliquait une opacité globale de 38 %, ce qui atténuait aussi le conteneur au lieu de séparer les opacités des tokens.

## Challenge

- **Conserver un conteneur de 48 px :** confond la zone tactile Web avec la surface visuelle AndroidX.
- **Réduire le bouton natif à 40 px :** reproduit la capsule, mais perd la cible minimale de 48 px sur les appareils tactiles.
- **Conserver les couleurs locales des variantes :** contredit les tokens OutlinedButton et TextButton.
- **Appliquer `opacity: .38` au bouton entier :** rend le conteneur trop pâle et ne respecte pas les deux opacités distinctes.
- **Ajouter une bibliothèque de boutons :** inutile ; la primitive Namesia couvre déjà les quatre variantes et les usages iconiques.

## Décision

Conserver `Bouton` et ses variantes métier, avec les correspondances AndroidX suivantes :

- capsule standard de 40 dp dans une cible native de 48 px ; largeur minimale 58 dp ;
- padding horizontal 24 dp pour Button/FilledTonalButton/OutlinedButton et 12 dp pour TextButton ;
- icônes internes Button de 18 dp (`ButtonDefaults.IconSize`), IconButton de 24 dp ;
- OutlinedButton : contour `outline-variant`, contenu `on-surface-variant` ;
- TextButton : contenu `primary`, car `Button.kt` sélectionne explicitement cette couleur dans `defaultTextButtonColors` malgré le token `TextButtonTokens.LabelColor = OnSurfaceVariant` (TODO documenté dans la source) ; Fidelity suit le comportement effectif AndroidX ;
- état désactivé : conteneur `on-surface` à 10 % pour Filled et FilledTonal, contenu `on-surface-variant` à 38 %, contour Outlined à 10 % ;
- forme `full` au repos et `corner-small` à l'état pressé ;
- Filled et FilledTonal passent à l'élévation 1 au survol des pointeurs fins. La traduction CSS de ce niveau est appliquée au pseudo-élément qui dessine la capsule, pas à la cible tactile.

Les boutons iconiques gardent une cible de 48 px et dessinent un conteneur de 40 dp. Le nom de la primitive et les composants métier restent propres à Namesia.

## Conséquences

- La taille visuelle ne sacrifie plus l'accessibilité tactile.
- Outlined utilise les rôles `outline-variant` et `on-surface-variant` ; TextButton suit la couleur `primary` effectivement appliquée par AndroidX.
- Les états désactivés distinguent le conteneur, le contour et le contenu.
- Les états pressés et survolés reproduisent la forme et l'élévation définies par AndroidX.

## Vérification

Les assertions CI contrôlent les dimensions, les espacements, les couleurs, les opacités, les couches d'état et la présence des tokens dans la documentation. Les sources sont épinglées dans `docs/material-3-verification.md`. Une revue visuelle reste nécessaire en clair/sombre et sur mobile, tablette et grand écran.
