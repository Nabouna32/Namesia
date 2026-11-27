# Règles d'implémentation du design — Namesia

- **Version :** 1.0
- **Mis à jour le :** 2026-11-27 20:02:31 (Europe/Paris)
- **Portée :** CSS, tokens, responsive, lisibilité et accessibilité visuelle

Ce document complète le [système de design](../DESIGN-SYSTEM.md), les [fondations visuelles](FOUNDATIONS.md) et la [bibliothèque de composants](COMPONENTS.md). Les règles de qualité générales restent dans [les standards techniques](../TECHNICAL-STANDARDS.md).

## 3. CSS et système de design

- Éviter les numérotations décoratives (01, 02, 03…) lorsqu'elles n'expriment ni ordre fonctionnel ni étape utile. La hiérarchie doit venir des titres, de la sémantique et de la mise en page ; ne pas ajouter de repères visuels qui ne transmettent aucune information.

### 3.1 Source de vérité

- Maintenir un système de design centralisé : couleurs, typographie, espacements, rayons, ombres, largeurs de contenu et niveaux d'élévation sont définis sous forme de variables/tokens CSS.
- Les valeurs de design récurrentes ne doivent pas être recopiées arbitrairement dans chaque règle.
- Organiser les styles par couches et responsabilités : fondations/tokens, styles globaux, composants, pages ou domaines et adaptations responsive.
- Utiliser des conventions de nommage cohérentes et des sélecteurs limités au composant ou domaine concerné.
- Éviter les sélecteurs globaux qui affectent involontairement des composants éloignés.
- Éviter les règles dupliquées, les déclarations contradictoires et les overrides accumulés en fin de fichier. Lors d'une modification, intégrer la règle à son emplacement canonique et supprimer les anciennes règles remplacées.
- Ne pas ajouter de framework CSS ou de préprocesseur sans analyse du besoin, du coût et des alternatives natives.

### 3.2 Responsive et unités

- Concevoir les interfaces en approche mobile-first lorsque cela convient au contenu, puis enrichir les mises en page pour les écrans plus larges.
- Utiliser Flexbox et Grid pour la structure ; les media queries doivent répondre à des ruptures dictées par le contenu, non à une liste arbitraire d'appareils.
- Préférer les unités relatives (rem, em, %, vw, dvh/svh selon le cas) pour les dimensions qui doivent s'adapter.
- Utiliser clamp(), min() et max() pour les échelles fluides lorsqu'elles simplifient réellement les règles.
- Les pixels CSS restent pertinents pour des détails précis (bordures fines, traits, ombres ou contraintes physiques du composant). Ils ne sont pas interdits, mais ne doivent pas être le choix automatique pour toute dimension ou typographie.
- Ne pas confondre unités CSS et pixels physiques : le zoom, les préférences utilisateur et les caractéristiques d'affichage restent à respecter.
- Vérifier les contenus longs, les traductions futures, les tailles de texte augmentées et les largeurs intermédiaires ; ne pas cibler uniquement quelques dimensions d'écran fixes.

### 3.3 Lisibilité et accessibilité

- Respecter les contrastes WCAG pertinents, les états de focus visibles, la navigation clavier et les zones interactives suffisamment grandes.
- Ne pas utiliser la couleur seule pour transmettre une information.
- Prévoir les préférences de réduction des animations et éviter les mouvements non essentiels.
- La hiérarchie typographique doit être cohérente ; les informations nécessaires (sources, avertissements, statuts, aides) ne doivent pas être rendues illisibles par une taille minuscule.
- Préserver la lisibilité à 200 % de zoom et lors de l'augmentation de la taille de texte lorsque le parcours le permet.
- Utiliser les éléments HTML sémantiques avant de reproduire leur comportement avec des éléments génériques.

