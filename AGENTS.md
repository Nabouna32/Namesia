# AGENTS.md — Charte de travail de Namesia

- **Version :** 1.9
- **Mis à jour le :** 2026-11-27 07:40:40 (Europe/Paris)

Cette charte fixe les règles communes du dépôt. Les procédures détaillées restent dans les documents spécialisés : ne pas les recopier ici.

## 1. Langue et traçabilité

- Toute communication durable dans le dépôt et sur GitHub est en français : documentation, issues, PR, commentaires, tests et décisions. Les identifiants, noms de fichiers, variables, fonctions, types et exports du code restent en anglais.
- Distinguer faits, hypothèses, propositions, décisions et actions réellement effectuées. Ne jamais inventer de sources, citations, statistiques, validations, résultats ou opérations.
- Le dépôt Git est la mémoire durable ; une décision utile à l'avenir doit être documentée.

## 2. Mission et challenge critique

Namesia est un site gratuit de découverte et de fiches de prénoms. Le catalogue et les fiches restent accessibles sans compte. La phase demeure **PRÉ-LANCEMENT / DÉVELOPPEMENT** jusqu'à confirmation datée du propriétaire.

Le challenge critique est obligatoire pour les besoins, propositions, décisions passées, code, données, processus et documentation. Pour tout choix significatif :
1. reformuler le besoin réel et vérifier les prémisses ;
2. examiner les options crédibles, y compris ne rien faire ;
3. évaluer utilité, sécurité, vie privée, accessibilité, SEO, performance, coûts et maintenance ;
4. recommander une solution et expliciter ses compromis ;
5. définir une vérification adaptée.

Ne pas contredire par principe, mais ne rien conserver par inertie. Corriger la cause plutôt que le symptôme.

## 3. Autonomie et arbitrages

- L'agent décide seul des moyens techniques et des améliorations réversibles, sans demander de validation technique systématique.
- Un arbitrage du propriétaire reste requis pour changer le positionnement ou les promesses fondamentales, activer une monétisation, engager une dépense, conclure un partenariat, lancer une fonction payante ou collecter des données sensibles.
- Une donnée personnelle ordinaire n'est admissible sans arbitrage que si elle est nécessaire à une fonction facultative et privée, minimisée, protégée, expliquée, conservée pour une durée cohérente et supprimable.
- Si un arbitrage humain est indispensable, créer une issue dont le titre commence par **[Action Humaine]**. Suspendre seulement le travail dépendant et poursuivre les chantiers indépendants. Ne pas relancer une issue ouverte sans événement nouveau ou retour du propriétaire.
- Le compte visiteur est une orientation acceptée, mais son authentification et sa persistance ne sont pas implémentées. Ne jamais les présenter comme existantes.

## 4. Produit, données et contenu

- Les fiches sont préparées en amont, puis importées en JSON dans les colonnes relationnelles dédiées de Supabase. Le JSON est un format d'échange, pas le modèle de stockage.
- L'import crée un brouillon ; la publication est une action explicite de l'administrateur. Aucune génération ne publie automatiquement.
- Un JSON valide prouve uniquement la conformité structurelle. Le contenu IA n'est pas vérifié automatiquement : distinguer faits, hypothèses, usages et symbolique ; nuancer ou omettre ce qui n'est pas établi.
- Le parcours actuel est la génération assistée hors application, puis l'import et la revue. **L'ancien workflow GitHub Actions Groq est abandonné et ne doit pas être activé.** Une page privée d'administration appelant Groq reste une piste différée, non prioritaire ; aucun secret Groq ou Supabase associé à l'ancien workflow n'est requis.
- Ne jamais exposer de secret privilégié dans le navigateur, le dépôt, les logs ou une réponse publique.

Références : [qualité éditoriale](docs/qualite-editoriale.md), [pipeline de génération et import](docs/pipeline-generation-ia.md), [modèle de données](docs/modele-donnees.md), [politique éditoriale](docs/politique-editoriale.md).

## 5. Conception et qualité

- **Material 3 Fidelity** est la base forte du design, pas une limite à l'amélioration. Avant un travail d'interface, lire [le système de design](docs/design.md) et [le registre des composants](docs/composants.md) ; réutiliser les primitives canoniques et challenger l'existant.
- Faire progresser ensemble beauté, lisibilité, sémantique HTML, clavier, lecteur d'écran, contrastes, responsive, performance et fiabilité. Les audits automatiques éclairent les décisions ; ils ne remplacent pas le jugement de conception.
- Construire une base simple et modulaire adaptée à la taille réelle du projet. Éviter rustines, duplications, abstractions, dépendances et processus sans bénéfice concret.
- Valider les données aux frontières, traiter explicitement les erreurs et ne jamais transformer une panne en résultat vide ou fictif.
- Les tests protègent les comportements métier et parcours importants, pas chaque classe ou détail de style. La stratégie de tests, l'accessibilité et l'exploitation sont détaillées dans [operations.md](docs/operations.md) et [standards-techniques.md](docs/standards-techniques.md).

## 6. Architecture et documentation

- Supabase/PostgreSQL est la source des données ; Cloudflare Workers/OpenNext héberge l'application. Les choix de stack restent contestables s'ils ne répondent plus aux besoins.
- Toute évolution SQL respecte l'historique des migrations appliquées. Une migration déjà appliquée n'est jamais réécrite ; ajouter une migration corrective. Après une migration, régénérer `lib/supabase/database.types.ts` et vérifier RLS, policies et advisors selon [les procédures d'exploitation](docs/operations.md).
- Mettre à jour dans la même PR les documents canoniques concernés par un changement de comportement, contrat, architecture ou décision. Créer un ADR en français pour une décision structurante : contexte, options, décision, raisons, conséquences et conditions de réexamen.
- `docs/etat-du-projet.md` décrit l'état courant ; `docs/gouvernance.md`, `docs/operations.md`, `docs/qualite-editoriale.md`, `docs/mesure-et-croissance.md`, `docs/architecture.md` et les autres documents spécialisés portent les règles détaillées.
- La documentation courante décrit l'état et les règles encore applicables, pas le journal des opérations passées. Retirer les procédures terminées, consignes obsolètes et doublons ; conserver les décisions durables dans les ADR et l'historique Git.
- Les documents Markdown maintenus portent version et date de mise à jour. Les ADR distinguent la date de décision de celle de leur dernière modification ; ne jamais inventer une date historique.

## 7. Branches, PR, CI et déploiement

- Toute évolution passe par une branche et une PR ; aucun push direct sur `main`. Garder une seule PR de travail ouverte à la fois. Avant un chantier, consulter les PR ouvertes, les issues ouvertes et les runs récents de `main`.
- Les PR, issues, titres, descriptions et commentaires sont en français. Une PR explique le besoin, la solution, les options, les compromis, les risques, la documentation, les vérifications et les limites restantes. Relire son diff complet avant fusion.
- Le propriétaire autorise en permanence la fusion des PR vers `main`. Ne jamais contourner une règle de protection GitHub.
- **La CI GitHub Actions est l'unique mécanisme de test, de build et de vérification : aucune commande locale de test ou de compilation.** Si un contrôle échoue, lire les jobs et leurs logs, corriger la cause puis vérifier la nouvelle exécution. Si la CI est encore en cours, tenter la fusion autorisée sans attendre ; ne jamais annoncer un résultat non confirmé.
- Si la CI de `main` est rouge au début d'un passage, corriger cette régression avant un nouveau chantier.
- Seule la branche `main`, après fusion, déploie la production. Les Workers Previews et le déploiement de production sont gérés par GitHub Actions avec **Wrangler**, conformément à la configuration existante. Aucun déploiement manuel ou autre plateforme de production.
- Décrire factuellement les résultats de CI, de Preview et de déploiement. Une fusion ne prouve pas à elle seule que les tests ou le déploiement ont réussi.

Références : [exploitation et CI](docs/operations.md), [portabilité et réversibilité](docs/portabilite-et-reversibilite.md).

## 8. Boucle autonome

À chaque passage :
1. relire cette charte, l'état du projet et les documents canoniques concernés ;
2. examiner les PR, issues et la CI de `main` ;
3. choisir l'amélioration apportant le plus de valeur réelle aux visiteurs ;
4. challenger le besoin et l'existant, puis réaliser le changement jusqu'à sa fusion ;
5. reprendre un nouvel audit sans s'arrêter à une livraison.

Une passe sur trois est prioritairement consacrée au design, sans ajouter de fonctionnalité produit. Namesia est un projet personnel : ne pas inventer de besoins d'équipe ou d'entreprise, ni ajouter de complexité sans bénéfice concret.

À la fin d'une intervention, résumer les changements réellement effectués, les PR fusionnées, l'état confirmé de la CI et du déploiement, ainsi que les limites restantes.
