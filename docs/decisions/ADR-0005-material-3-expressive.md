# ADR-0005 — Adopter Material 3 Expressive comme référence d'interface

- **Statut :** supersédée par [ADR-0006](ADR-0006-material-fidelity-rainbow.md)
- **Date :** 2026-11-23

## Contexte

Namesia est une application Web de découverte des prénoms. Sa direction visuelle précédente associait une palette éditoriale propre au site à des composants génériques, sans langage d'interface cohérent. Le besoin est désormais explicite : rapprocher le rendu, les composants, les interactions et l'adaptation multi-écrans d'une application Android Pixel moderne.

La référence pertinente est Material 3 Expressive : elle couvre les rôles de couleur, la typographie, les formes, les surfaces, les états, les animations et les modèles de navigation adaptative. Il ne s'agit pas seulement d'emprunter une palette.

## Challenge et options

1. **Conserver des CSS artisanaux sans référence formelle.** Simple à court terme, mais le risque de dérive visuelle entre pages et composants demeure.
2. **Adopter Material Web (`@material/web`).** Bibliothèque officielle de composants Web Material 3, mais son dépôt annonce un mode maintenance en attente de nouveaux mainteneurs. Son périmètre et son évolution ne donnent pas de garantie suffisante pour en faire la fondation de l'interface.
3. **Adopter une bibliothèque indépendante Material 3 Expressive pour React.** Certaines implémentations Web récentes couvrent beaucoup de composants, mais elles ne sont pas Google, leur niveau de maturité/conformité doit être évalué et leur ajout créerait une dépendance UI structurante.
4. **Utiliser les algorithmes officiels Material Color Utilities et construire le shell/composants avec React, HTML et CSS natifs.** Cette option conserve une source de vérité authentique pour les couleurs, évite le verrouillage prématuré sur une bibliothèque UI tierce et permet de respecter les conventions Next.js et l'accessibilité native.

## Décision

Retenir l'option 4.

- Installer `@material/material-color-utilities`, bibliothèque officielle Google sous licence Apache-2.0.
- Générer le schéma avec `DynamicScheme`, `Variant.EXPRESSIVE`, la spécification 2025 et une couleur source primaire Namesia `#6750A4`.
- Appliquer les rôles de couleurs clair/sombre au document et suivre `prefers-color-scheme`.
- Utiliser Material 3 Expressive comme référence pour les composants, formes, états, SVG et mouvements.
- Construire une navigation adaptative : navigation bar basse sur les fenêtres compactes, navigation rail latérale sur les fenêtres medium/expanded.
- Conserver le rainbow Namesia comme signature de marque secondaire, sans le substituer aux rôles de couleur Material ou aux états sémantiques.

La couleur source reste explicite et fixe. Le navigateur ne peut pas lire le fond d'écran du téléphone ; aucune extraction ou collecte de données d'appareil n'est simulée.

## Conséquences

- Les couleurs récurrentes proviennent des rôles Material ; les anciens tokens applicatifs sont des alias, pas une palette parallèle.
- Le thème peut évoluer sans réécrire les composants.
- La navigation et les composants restent du code Namesia, donc leur conformité doit être entretenue par le dépôt.
- Les interactions Web utilisent des transitions CSS et ne prétendent pas reproduire exactement le moteur de ressort natif Android.
- Les barres système, gestes OS et couleurs de fond d'écran restent hors du périmètre du navigateur.
- La fidélité s'évalue sur les pages et tailles d'écran réelles, pas seulement sur une palette.

## Validation

La CI doit vérifier l'installation verrouillée, le typage, les tests existants et le build. La revue visuelle doit couvrir les fenêtres compactes, medium et expanded, les thèmes clair/sombre, le clavier, le zoom et la réduction des mouvements.
