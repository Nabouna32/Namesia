# Standards techniques et règles de maintenabilité — Namesia

- **Statut :** règle canonique
- **Version :** 1.0
- **Mis à jour :** 2026-11-22
- **Portée :** application web, styles, composants, données et outillage

Ce document définit le niveau de qualité attendu pour les évolutions techniques de Namesia. Il complète [AGENTS.md](../AGENTS.md), qui définit la méthode de travail et le challenge obligatoire.

## 1. Principe directeur

Construire une base simple, cohérente, modulaire et durable. Corriger la cause d'un problème plutôt que masquer son symptôme.

Une rustine est un correctif local qui contourne le problème sans traiter sa cause : surcharge CSS ajoutée en fin de fichier, sélecteur trop général compensé par un autre, duplication de logique, condition spéciale sans modèle clair, ou abstraction artificielle.

- Ne pas empiler des overrides ou des exceptions pour obtenir rapidement un rendu.
- Ne pas conserver volontairement une incohérence connue sans la signaler et définir son traitement.
- Ne pas entreprendre une réécriture générale sans bénéfice démontré : refactoriser par périmètre cohérent, avec comportement observable et critères de non-régression.
- Toute complexité introduite doit résoudre un besoin réel et avoir un coût de maintenance proportionné.
- Une correction doit supprimer ou remplacer l'ancien mécanisme devenu inutile, pas simplement le recouvrir.

## 2. Architecture et modularité

### 2.1 Organisation

- Privilégier un monolithe modulaire adapté à la taille du projet ; pas de microservices sans besoin concret.
- Organiser le code par domaine ou responsabilité métier lorsque cela améliore la cohésion et limite le couplage.
- Garder les frontières explicites : interface utilisateur, logique métier, accès aux données, validation et intégrations externes.
- Les composants d'interface ne doivent pas porter directement des requêtes SQL/Supabase ni des règles métier complexes.
- Centraliser les contrats, types et validations partagés au lieu de les redéfinir dans plusieurs endroits.
- Éviter les fichiers fourre-tout et les modules qui mélangent plusieurs responsabilités.
- Ne pas créer un module, hook, service ou composant uniquement pour déplacer quelques lignes : l'abstraction doit avoir un rôle identifiable, une cohésion et un usage ou une évolution plausible.

### 2.2 Composants réutilisables

Extraire un composant lorsqu'au moins un bénéfice concret existe : réutilisation réelle, cohérence visuelle/comportementale, complexité locale importante, responsabilité autonome, accessibilité partagée ou testabilité améliorée.

- Préférer des composants petits, composables et dotés d'une API explicite.
- Séparer la présentation de la récupération des données lorsque leurs cycles de vie ou responsabilités diffèrent.
- Éviter les composants génériques prématurés, les composants à trop nombreuses propriétés conditionnelles et les abstractions qui cachent le comportement.
- Les variantes visuelles doivent être explicites et limitées ; éviter les chaînes de classes conditionnelles dupliquées.
- Un composant réutilisable doit conserver une sémantique HTML correcte, être accessible au clavier et exposer des états compréhensibles.

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

## 4. React, Next.js et TypeScript

- Respecter les frontières Server Components / Client Components de l'App Router ; ne rendre interactif côté client que ce qui en a besoin.
- Garder les composants serveur par défaut et limiter les directives use client aux frontières interactives.
- Utiliser les fonctionnalités natives et les conventions documentées de la version Next.js effectivement installée ; ne pas copier une convention d'une version différente sans vérification.
- Éviter les effets React lorsqu'une valeur peut être calculée pendant le rendu ou gérée par l'état du composant.
- Donner des clés stables aux listes et éviter les états dérivés dupliqués.
- TypeScript doit exprimer les contrats réels ; éviter any, les assertions non justifiées et les conversions de type qui masquent une incertitude.
- Valider les données externes à leur frontière d'entrée ; un type TypeScript seul ne valide pas les données à l'exécution.
- Gérer les erreurs explicitement et distinguer une absence légitime de données d'une panne technique.
- Les métadonnées, liens, formulaires et contrôles doivent respecter les conventions d'accessibilité et de SEO de Next.js.

## 5. Données et intégrations

- Isoler les accès Supabase et services externes dans des modules dédiés.
- Ne jamais exposer de clé privilégiée au navigateur.
- Appliquer le moindre privilège et vérifier les politiques RLS au niveau des tables et des opérations.
- Ne pas convertir silencieusement une erreur d'accès aux données en résultat vide si cela induit l'utilisateur ou masque une panne.
- Préserver les contrats et statuts éditoriaux : seuls les contenus explicitement publiés sont servis comme contenus publics.
- Les migrations doivent être versionnées, relisibles, cohérentes avec le schéma réel et accompagnées des contrôles nécessaires.
- Les intégrations doivent être remplaçables lorsque le coût reste raisonnable ; éviter de propager les détails d'un fournisseur dans toute l'application.

## 6. Qualité, tests et validation

Chaque changement est validé au niveau adapté à son risque :

- Tests unitaires pour les règles métier et transformations isolées.
- Tests d'intégration pour les accès aux données, contrats et interactions entre modules.
- Tests de composants ou E2E pour les parcours utilisateur critiques.
- Vérifications statiques et build dans la CI GitHub Actions.
- Contrôles manuels ciblés lorsque l'accessibilité, le responsive ou le rendu visuel ne sont pas couverts par l'automatisation.

Ne pas ajouter des tests purement décoratifs. Les tests doivent protéger un comportement ou une règle identifiable. Ne jamais déclarer un contrôle exécuté s'il ne l'a pas été.

Pour une refonte CSS ou de composants, vérifier au minimum :
- l'absence de régression fonctionnelle ;
- les tailles d'écran étroites, intermédiaires et larges ;
- le zoom et les tailles de texte augmentées ;
- les états focus, hover, disabled et erreurs lorsqu'ils existent ;
- les contrastes et la navigation clavier ;
- les pages représentatives, pas uniquement la page d'accueil.

Les builds de PR restent dans GitHub Actions. Respecter strictement la politique Vercel documentée dans [AGENTS.md](../AGENTS.md).

## 7. Refactorisation et dette technique

Avant un refactor :
1. Cartographier les responsabilités et dépendances concernées.
2. Identifier les duplications, incohérences, effets de cascade et contrats implicites.
3. Distinguer les défauts réels des préférences stylistiques.
4. Définir le comportement à préserver et les critères de réussite.
5. Choisir une séquence de changements limitée et réversible.

Pendant le refactor :
- Modifier la source de vérité plutôt que d'ajouter une couche de compensation.
- Supprimer les anciens chemins, styles et abstractions devenus inutiles.
- Ne pas changer simultanément des comportements métier sans raison explicite.
- Garder le diff compréhensible et la documentation alignée.

Après le refactor :
- Vérifier les usages et références résiduels.
- Exécuter les contrôles adaptés.
- Documenter les limites qui subsistent et les raisons de ne pas les traiter immédiatement.

La dette technique est suivie avec honnêteté. Une dette acceptée doit être visible, contextualisée, priorisée selon son impact et réévaluée ; elle ne doit pas être présentée comme une convention moderne.

## 8. Dérogations

Une dérogation est acceptable si elle est plus simple, plus sûre ou mieux adaptée au besoin réel. Elle doit être localisée et justifiée dans le code ou la PR : contrainte, alternative écartée, coût et condition de réexamen. Une dérogation temporaire doit avoir un critère de sortie. L'absence de temps ne transforme pas une rustine en solution durable.
