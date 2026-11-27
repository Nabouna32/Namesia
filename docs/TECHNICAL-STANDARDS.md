# Standards techniques et règles de maintenabilité — Namesia

- **Statut ## 6. Qualité, tests et validation

La stratégie de tests, les critères de choix et les diagnostics sont détaillés dans [TESTING-AND-VALIDATION.md](TESTING-AND-VALIDATION.md). Les déclencheurs, jobs et audits de la CI sont décrits dans [GitHub Actions](platform/GITHUB-ACTIONS.md).

:** 1.14
- **Mis à jour le :** 2026-11-27 20:06:22 (Europe/Paris)
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

Les règles détaillées de tokens, CSS, responsive, lisibilité et accessibilité visuelle sont définies dans [les règles d'implémentation du design](design/IMPLEMENTATION-STANDARDS.md). Ce document reste la référence pour les principes transversaux de qualité technique.

## 4. React, Next.js et TypeScript

- Respecter les frontières Server Components / Client Components de l'App Router ; ne rendre interactif côté client que ce qui en a besoin.
- Garder les composants serveur par défaut et limiter les directives use client aux frontières interactives.
- Utiliser les fonctionnalités natives et les conventions documentées de la version Next.js effectivement installée ; ne pas copier une convention d'une version différente sans vérification.
- Éviter les effets React lorsqu'une valeur peut être calculée pendant le rendu ou gérée par l'état du composant.
- Donner des clés stables aux listes et éviter les états dérivés dupliqués.
- TypeScript doit exprimer les contrats réels ; éviter any, les assertions non justifiées et les conversions de type qui masquent une incertitude.
- Les clients Supabase utilisent `createClient<Database>` et `SupabaseClient<Database>` avec `lib/supabase/database.types.ts`, généré depuis le schéma actif après chaque migration.
- Lire et valider `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` exclusivement via `getSupabasePublicConfig()` ; refuser toute configuration invalide, exiger HTTPS en production et réserver HTTP aux hôtes loopback en développement, sans assertion non nulle ni origine de secours.
- Les résultats des requêtes SQL utilisent les types inférés ou des `Pick<Tables<...>>` dérivés du schéma ; proscrire `as unknown as` pour contourner une requête Supabase non typée.
- Valider les données externes à leur frontière d'entrée ; un type TypeScript seul ne valide pas les données à l'exécution.
- Gérer les erreurs explicitement et distinguer une absence légitime de données d'une panne technique.
- Les métadonnées, liens, formulaires et contrôles doivent respecter les conventions d'accessibilité et de SEO de Next.js.
- Toute donnée JSON-LD injectée dans un élément `script` passe par `lib/json-ld.ts` : la sérialisation échappe le caractère `<` avant `dangerouslySetInnerHTML`, sans modifier la valeur JSON après analyse.

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
- Les tests Node natifs importent les modules TypeScript avec des chemins relatifs et l'extension `.ts`. Les fonctions pures testées par Node vivent dans des modules cœur sans alias `@/`, client Supabase ou runtime Next.js ; la couche applicative peut les réexporter.
- Tests d'intégration pour les accès aux données, contrats et interactions entre modules.
- Tests de composants ou E2E pour les parcours utilisateur critiques.
- Playwright Chromium couvre uniquement des parcours fonctionnels stables sur la Preview interne : disponibilité des routes publiques essentielles, absence d'erreurs JavaScript et débordements responsive représentatifs. Les assertions de CSS, de géométrie ou de rendu propres à une correction sont temporaires et supprimées après validation.
- **Aucune capture, vidéo, trace ou rapport Playwright n'est produit ou publié systématiquement.** La configuration normale désactive les captures, vidéos et traces.
- Pour un diagnostic ponctuel sur une PR interne, le label `diagnostic-playwright` active les captures sur échec, les traces d'échec et la publication conditionnelle de `test-results/` comme artefact GitHub Actions avec une rétention d'un jour. Un appel temporaire à `page.screenshot()` permet de capturer aussi un rendu qui passe. L'artefact est consultable depuis le run Actions ; le supprimer dès que le diagnostic est terminé, ou le laisser expirer au plus tard après un jour.
- Retirer le label, le code de diagnostic, les assertions temporaires et les captures une fois le rendu validé. Aucune galerie, baseline visuelle ou collection historique n'est maintenue ; l'upload ne s'exécute jamais sans le label explicite.
- axe-core est exécuté comme diagnostic consultatif ; ses constats sont consignés dans les logs sans bloquer le rendu. Les erreurs HTTP, JavaScript et les débordements responsive restent bloquants.
- Les tests sont choisis selon le risque : métier et parcours critiques d'abord. Éviter les assertions sur les textes éditoriaux, les détails CSS transitoires et les implémentations internes susceptibles d'évoluer. Retirer les tests devenus sans objet au lieu d'accumuler des contrats historiques.
- Les tests E2E n'ouvrent aucune route d'administration et n'utilisent aucune session ni donnée privée. Les PR issues de forks ne reçoivent pas de Preview Cloudflare ni de secrets.
- Vérifications statiques et build dans la CI GitHub Actions.
- Les outils de build Cloudflare et de test navigateur (`@opennextjs/cloudflare`, `wrangler`, `@playwright/test`, `@axe-core/playwright`) sont des dépendances de développement exactes, verrouillées dans `package-lock.json`. Chaque job utilise `npm ci`. La CI exécute deux périmètres distincts : `npm audit --omit=dev --audit-level=high` bloque sur les vulnérabilités hautes ou critiques du graphe de production ; `npm audit --audit-level=high` audite aussi les dépendances de développement à titre diagnostique non bloquant. Ce second résultat apparaît dans les logs et le résumé du job pour suivre les vulnérabilités de l’outillage sans confondre leur présence avec une exposition du Worker. Il ne constitue pas une acceptation définitive : les avis restent à corriger et à réévaluer, notamment pour Wrangler/Miniflare.
- Le workflow dédié `.github/workflows/workflow-security.yml` ne s'exécute que lorsque `.github/workflows/` ou `.github/dependabot.yml` change. Il vérifie les workflows avec `actionlint` 1.7.12 et ShellCheck, puis audite workflows et configuration Dependabot avec `zizmor` 1.33.1 en persona `pedantic`. Les actions et versions des outils sont épinglées.
- Dependabot vérifie npm et les actions GitHub chaque jour calendaire à 12 h (`Europe/Paris`), propose chaque mise à jour dans une PR distincte et conserve un délai de refroidissement de 7 jours ; les correctifs de sécurité suivent leur mécanisme dédié.
- Contrôles manuels ciblés lorsque l'accessibilité, le responsive ou le rendu visuel ne sont pas couverts par l'automatisation.
Ne pas ajouter des tests purement décoratifs. Les tests doivent protéger un comportement ou une règle identifiable. Ne jamais déclarer un contrôle exécuté s'il ne l'a pas été.

Pour une refonte CSS ou de composants, vérifier au minimum :
- l'absence de régression fonctionnelle ;
- les tailles d'écran étroites, intermédiaires et larges ;
- le zoom et les tailles de texte augmentées ;
- les états focus, hover, disabled et erreurs lorsqu'ils existent ;
- les contrastes et la navigation clavier ;
- les pages représentatives, pas uniquement la page d'accueil.

Les builds de PR et les déploiements de production sont exécutés par GitHub Actions vers Cloudflare Workers. Les Previews internes servent aussi de cible aux tests navigateur ; aucune plateforme tierce de build ou de déploiement n'est requise.

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

## 8. Absences, erreurs, sémantique et source de vérité

- Le parcours nominal est le seul parcours de fonctionnement. Ne pas ajouter de fallback de composant, de donnée, de stockage, de configuration, de fournisseur, de cache, de route ou de comportement.
- Une valeur facultative n'est pas un fallback : son absence doit être prévue par le contrat, typée et traitée explicitement à l'endroit où elle est consommée. Ne jamais remplacer une valeur absente par une autre valeur ou une autre source.
- Une erreur technique doit rester une erreur identifiable et être propagée jusqu'à une frontière qui peut l'expliquer à l'utilisateur. Ne pas la convertir en `null`, chaîne vide, tableau vide, donnée fictive, contenu statique ou valeur par défaut.
- Définir une seule source de vérité pour chaque donnée et chaque opération. Ne pas basculer vers un stockage, fournisseur, cache ou chemin secondaire lorsque la source principale est indisponible.
- Les opérateurs `??`, `||`, optional chaining, branches conditionnelles et `try/catch` sont utilisés uniquement pour exprimer un contrat explicite (optionnalité, validation ou frontière d'erreur), jamais pour masquer une absence ou une panne. Ils ne constituent pas une autorisation implicite de fallback.
- En HTML, choisir l'élément natif qui porte le sens et le comportement : `button`, `a`, `main`, `nav`, `header`, `footer`, `section`, `article`, `form`, listes, titres, etc. Éviter les `div`/`span` génériques quand une balise sémantique convient.
- Ne pas recréer manuellement avec `role`, `tabIndex` et des gestionnaires clavier le comportement déjà fourni par un élément natif. Ne pas ajouter d'attributs ARIA redondants ; l'accessibilité doit découler d'abord de la structure et des contrôles natifs.
- Les états vide, chargement et erreur sont des états produit explicites, pas des composants de secours. Ne les créer que lorsqu'ils correspondent à un état réellement possible et les présenter comme tels.

## 9. Dérogations

Une dérogation est acceptable si elle est plus simple, plus sûre ou mieux adaptée au besoin réel. Elle doit être localisée et justifiée dans le code ou la PR : contrainte, alternative écartée, coût et condition de réexamen. Une dérogation temporaire doit avoir un critère de sortie. L'absence de temps ne transforme pas une rustine en solution durable.


## 10. En-têtes HTTP et sécurité du navigateur

Les en-têtes HTTP, protections navigateur et vérifications de session sont détaillés dans [WEB-SECURITY.md](platform/WEB-SECURITY.md).



## 11. Environnement d'exécution et dépendances

- La version de référence de Node.js est définie une seule fois dans `.nvmrc` (26.13.1), sur la branche majeure 26.x ; le runtime Cloudflare/OpenNext et le runner GitHub Actions doivent rester compatibles avec cette branche.
- `package.json` et `package-lock.json` expriment la contrainte compatible `26.x` ; `.npmrc` active `engine-strict=true` pour refuser un runtime incompatible dès l'installation.
- Les types `@types/node` suivent la branche 26 et leur dépendance `undici-types`, afin de ne pas exposer des API de types d'une version Node plus récente que le runtime.
- npm est celui fourni avec l'installation Node.js retenue ; aucune version npm indépendante n'est épinglée.
- GitHub Actions lit directement `.nvmrc` avec `actions/setup-node` ; elle vérifie ensuite que la version réellement installée correspond exactement au fichier.
- Les développeurs utilisent `npm ci` pour installer l'arbre verrouillé, pas `npm install` pour les installations reproductibles.
- Toute montée de version Node doit modifier `.nvmrc`, la contrainte de compatibilité, les types Node et le runtime Cloudflare/OpenNext dans la même PR ; la CI doit valider l'ensemble.
- Les actions GitHub officielles sont maintenues sur des versions stables épinglées par SHA complet, vérifiées contre leur tag officiel.


## 12. Vérification de session administrateur

La gestion des courses de vérification de session et du droit administrateur est détaillée dans [WEB-SECURITY.md](platform/WEB-SECURITY.md).


