# Tests et validation — Namesia

- **Version :** 1.1
- **Mis à jour le :** 2026-11-28 06:35:20 (Europe/Paris)
- **Portée :** stratégie de tests, vérification des comportements et diagnostics

Ce guide définit quels comportements protéger et comment valider les changements. Les workflows exécutés et les résultats CI sont décrits dans [GitHub Actions](platform/GITHUB-ACTIONS.md). Les diagnostics visuels s'exécutent sur les Previews Cloudflare décrites dans [Cloudflare Workers](platform/CLOUDFLARE-WORKERS.md).

## Stratégie de validation

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
- Les tests de gouvernance documentaire vérifient les métadonnées de tous les Markdown maintenus, le nommage descriptif, l'unicité et les métadonnées des ADR, la cohérence exacte du registre, l'indexation des documents canoniques et l'existence des cibles des liens Markdown locaux.
- Les outils de build Cloudflare et de test navigateur (`@opennextjs/cloudflare`, `wrangler`, `@playwright/test`, `@axe-core/playwright`) sont des dépendances de développement exactes, verrouillées dans `package-lock.json`. Chaque job utilise `npm ci`. La CI exécute deux périmètres distincts : `npm audit --omit=dev --audit-level=high` bloque sur les vulnérabilités hautes ou critiques du graphe de production ; `npm audit --audit-level=high` audite aussi les dépendances de développement à titre diagnostique non bloquant. Ce second résultat apparaît dans les logs et le résumé du job pour suivre les vulnérabilités de l’outillage sans confondre leur présence avec une exposition du Worker. Il ne constitue pas une acceptation définitive : les avis restent à corriger et à réévaluer, notamment pour Wrangler/Miniflare.
- Les audits de configuration CI et les contrôles Dependabot sont décrits dans les guides [GitHub Actions](platform/GITHUB-ACTIONS.md) et [Dependabot](platform/DEPENDABOT.md).
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
