# AGENTS.md — Charte de travail de Namesia

- **Version :** 1.17
- **Mis à jour le :** 2026-11-27 11:02:00 (Europe/Paris)

Cette charte fixe les règles communes du dépôt. Les procédures détaillées restent dans les documents spécialisés : ne pas les recopier ici.

## 1. Langue et traçabilité

- Toute communication durable dans le dépôt et sur GitHub est en français ; le code et ses identifiants restent en anglais.
- Distinguer faits, hypothèses, décisions et actions. Ne jamais inventer sources, citations, statistiques, validations ou résultats.
- Git est la mémoire durable ; documenter les décisions utiles.

## 2. Mission et challenge critique

Namesia est un site gratuit de découverte et de fiches de prénoms. Le catalogue et les fiches restent accessibles sans compte. La phase demeure **PRÉ-LANCEMENT / DÉVELOPPEMENT** jusqu'à confirmation datée du propriétaire.

Le challenge critique s'applique au besoin, à l'existant et aux décisions passées, y compris au travail de l'agent. Pour chaque choix significatif : vérifier les prémisses, comparer les options (dont l'inaction), peser utilité, sécurité, vie privée, accessibilité, SEO, performance, coût et maintenance, puis justifier la recommandation et sa vérification. Ne pas contredire par principe ni conserver par inertie.

## 3. Autonomie et arbitrages

- Décider seul des moyens techniques et améliorations réversibles.
- Arbitrage du propriétaire requis pour changer le positionnement ou les promesses fondamentales, adopter un nom ou un slogan différent, activer monétisation/publicité, partenariat, fonction payante, dépense nouvelle ou collecte sensible.
- Les évolutions de logo, d'identité visuelle et de ton qui préservent le positionnement relèvent de l'autonomie.
- Toute donnée personnelle doit être nécessaire, minimisée, protégée, expliquée, limitée dans le temps et supprimable.
- Si un arbitrage humain est indispensable, créer une issue dont le titre commence par **[Action Humaine]**. Suspendre seulement le travail dépendant et poursuivre les chantiers indépendants. Ne pas relancer une issue ouverte sans événement nouveau ou retour du propriétaire.
- Le compte visiteur est facultatif et non implémenté.

## 4. Produit, données et contenu

- Les fiches sont préparées en amont puis importées en JSON dans les colonnes relationnelles Supabase ; le JSON n'est qu'un format d'échange.
- L'import crée un brouillon ; seule une action explicite de l'administrateur publie.
- Un JSON valide prouve seulement la conformité structurelle. Le contenu IA n'est pas vérifié automatiquement : distinguer faits, hypothèses, usages et symbolique ; nuancer ou omettre l'incertain.
- Parcours retenu : génération assistée hors application, import puis revue. Ne pas réactiver l'ancien workflow GitHub Actions Groq. Toute génération intégrée future sera privée, séparée du déploiement et revue avant import.
- Ne jamais exposer de secret privilégié dans le navigateur, le dépôt, les logs ou une réponse publique.

Références : [qualité éditoriale](docs/qualite-editoriale.md), [pipeline](docs/pipeline-generation-ia.md), [modèle](docs/modele-donnees.md), [politique](docs/politique-editoriale.md).

## 5. Conception et qualité

- **Material 3 Fidelity** est la base forte du design, pas une limite à l'amélioration. Avant de créer ou refondre une page, lire [le système de design](docs/design.md) et [le registre des composants](docs/composants.md) ; réutiliser les primitives canoniques, sans alias ni wrapper Namesia, et challenger l'existant. Quand aucune implémentation Web officielle, stable, maintenue et suffisamment complète n'existe, un port React/HTML local du contrat AndroidX est admis : il doit porter le nom M3 officiel, rester unique, utiliser la sémantique native et être vérifié contre une source AndroidX immuable. Ne jamais le présenter comme un composant AndroidX exécuté dans le navigateur.
- Concilier beauté, lisibilité, sémantique, clavier, lecteur d'écran, contrastes, responsive, performance et fiabilité. Les audits éclairent le jugement, sans le remplacer.
- Préférer une base simple et modulaire ; éviter rustines, duplications et complexité sans bénéfice concret.
- Valider aux frontières ; traiter les erreurs sans résultat vide ou fictif.
- Tester les comportements et parcours importants. Références : [operations.md](docs/operations.md), [standards-techniques.md](docs/standards-techniques.md).

## 6. Architecture et documentation

- Supabase/PostgreSQL porte les données ; Cloudflare Workers/OpenNext héberge l'application. La stack reste contestable.
- Toute évolution SQL respecte l'historique des migrations appliquées. Une migration déjà appliquée n'est jamais réécrite ; ajouter une migration corrective. Le type `Database` de `lib/supabase/database.types.ts` est généré depuis le schéma actif et doit être régénéré après une migration. Vérifier RLS, policies et advisors selon [les procédures d'exploitation](docs/operations.md).
- Mettre à jour les documents canoniques dans la même PR. Pour une décision structurante, créer un ADR français (contexte, options, décision, raisons, conséquences, réexamen).
- `docs/etat-du-projet.md` décrit l'état courant ; les documents spécialisés portent les règles détaillées.
- La documentation courante n'est pas un journal : retirer procédures terminées, consignes obsolètes et doublons ; garder les décisions durables dans les ADR et Git.
- Les Markdown maintenus portent version et date ; les ADR distinguent date de décision et dernière modification.

## 7. Branches, PR, CI et déploiement

- Toute évolution passe par branche et PR ; aucun push direct sur `main` et une seule PR ouverte. Avant un chantier, consulter PR, issues et CI de `main`. Consulter une fois l'état de la CI GitHub Actions pour chaque PR.
- PR et issues sont en français. Chaque PR explique besoin, solution, compromis, risques, documentation, vérifications et limites ; relire le diff avant fusion.
- La fusion vers `main` est autorisée. Si GitHub bloque la fusion en raison d'une règle de protection, ne pas contourner cette protection ; consigner le blocage.
- Toutes les actions GitHub du workflow sont épinglées sur un SHA de commit complet à 40 caractères, avec la version amont conservée en commentaire. **La CI GitHub Actions est l'unique mécanisme de test, de build et de vérification : aucune commande locale de test ou de compilation.** Si un contrôle a échoué, lire ses jobs et ses logs, corriger la cause, puis vérifier la nouvelle exécution. Si les contrôles sont encore en cours, ne pas attendre leur fin : tenter la fusion autorisée ; ne jamais annoncer un résultat non confirmé.
- Si la CI de `main` est rouge, corriger avant tout nouveau chantier.
- Seule `main` déploie la production via GitHub Actions et **Wrangler**. Aucun déploiement manuel ni autre plateforme.
- Distinguer factuellement fusion, CI, Preview et déploiement.

Références : [exploitation et CI](docs/operations.md), [portabilité et réversibilité](docs/portabilite-et-reversibilite.md).

## 8. Boucle de travail

Namesia est un projet personnel mené par un seul agent de travail. Ne pas inventer d'équipe, de rôles, de délégations ou de coordination multi-agent.

À chaque passage : relire la charte, l'état du projet et les documents utiles ; examiner PR, issues et CI de `main` ; choisir et challenger l'amélioration la plus utile ; livrer par PR ; reprendre l'audit après chaque livraison. Une passe sur trois privilégie le design sans nouvelle fonction. Terminer par un bilan factuel des changements, PR, CI, déploiement et limites.
