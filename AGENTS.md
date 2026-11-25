# AGENTS.md — Charte de travail de Namesia

Cette charte s'applique à tout le dépôt, aux contributions humaines et aux agents IA.

## 1. Langue et traçabilité

- Toute communication durable dans le dépôt est en français : documentation, issues, PR, commentaires, revues, ADR et suivi.
- Les identifiants techniques et termes consacrés peuvent rester dans leur langue d'origine.
- La conversation est éphémère : toute décision utile doit être inscrite dans le dépôt.
- Distinguer faits, hypothèses, propositions, décisions et actions réellement effectuées.

## 2. Challenge obligatoire

Le challenge critique s'applique systématiquement aux demandes, idées, recommandations, décisions passées, code, schémas, données, processus et documentation. Aucun choix n'est intouchable parce qu'il existe déjà ou a été accepté auparavant.

Pour tout choix significatif :
1. Reformuler le besoin réel sans confondre problème et solution proposée.
2. Vérifier les prémisses, contraintes, dépendances et incertitudes.
3. Chercher les angles morts : sécurité, vie privée, accessibilité, maintenabilité, coûts, SEO, dette et conséquences opérationnelles.
4. Comparer les options crédibles, y compris ne rien faire lorsque pertinent.
5. Expliquer la recommandation, les compromis et les conséquences.
6. Définir comment vérifier le résultat.

Le challenge doit être argumenté et proportionné. Il ne s'agit pas de contredire par principe, mais aucune proposition importante ne doit être approuvée par complaisance.

Pour un arbitrage significatif, expliciter le constat, le challenge, les options, la recommandation, les conséquences et la validation. Ne jamais fabriquer une certitude faute d'éléments.

## 3. Vision et décisions

- Challenger régulièrement le problème utilisateur, le périmètre, la proposition de valeur et les indicateurs.
- Ne pas confondre préférence, intuition et besoin démontré.
- Les décisions structurantes sont consignées dans un ADR en français : contexte, options, décision, raisons, conséquences et conditions de réexamen.
- Une décision antérieure doit être réévaluée si le contexte change ; ne pas la reconduire par inertie.
- Toute modification d'une décision acceptée doit être explicite et motivée.

## 4. Issues et pull requests

- Toute évolution passe par une branche et une PR ; aucun push direct sur main.
- Titres, descriptions, commentaires, issues et revues sont en français.
- Une PR explique le besoin, la solution, les choix, les compromis, les risques, les vérifications et les limites restantes.
- Lire le diff complet et challenger aussi le code préexistant touché ou rendu obsolète.
- Garder une seule PR de travail ouverte à la fois. Contribuer à la PR existante si le périmètre est cohérent ; ne pas créer de PR empilée par commodité.
- Autorisation permanente : fusionner les PR vers main sans demander d'autorisation supplémentaire.
- Autorisation permanente : supprimer des données, effectuer les migrations nécessaires et faire évoluer ou refondre la base de données lorsque cela sert l'objectif du projet. Préserver l'intégrité des données et documenter les opérations structurantes.
- La CI GitHub Actions est l'unique mécanisme de vérification : ne pas exécuter de commandes de test, de build ou de contrôle localement.
- Consulter l'état de la CI GitHub Actions une fois pour chaque PR. Si elle est en échec, corriger avant de fusionner. Si elle est encore en cours, ne pas l'attendre et fusionner. Si la CI de main est rouge au passage suivant, la corriger en priorité.
- Pour consulter un run, utiliser l'API REST GitHub Actions par SHA : `GET /repos/{owner}/{repo}/actions/runs?head_sha={sha}&per_page=10`. Si aucun résultat n'est retourné, recouper une seule fois avec `GET /repos/{owner}/{repo}/actions/runs?per_page=10` et filtrer le SHA exact ; certaines vues spécialisées peuvent retourner une liste vide alors qu'un run existe. Une liste vide ne prouve donc pas que la CI n'a pas démarré.
- Pour un run en échec, lire les jobs puis les logs du job en échec avant toute correction. Ne pas se limiter au résumé du statut : les logs distinguent une régression de code d'un contrat de test devenu obsolète.
- Le job `quality` audite les dépendances de production (`npm audit --omit=dev --audit-level=high`), puis exécute les tests, le contrôle TypeScript et le build même si l'un échoue. La synthèse finale inclut les quatre résultats ; sur un run rouge, lire chaque `outcome` et ses logs avant de corriger afin de traiter toutes les causes indépendantes dans la même boucle.
- Ne jamais déclarer un test, build ou contrôle réussi sans que la CI GitHub Actions l'ait confirmé.
- Toutes les actions GitHub (`uses`) sont épinglées sur un SHA de commit complet à 40 caractères, avec le tag de version conservé en commentaire. Avant une mise à jour, vérifier que le SHA correspond au tag officiel et relire les changements amont ; ne jamais revenir à une référence de tag mutable. Le checkout désactive `persist-credentials` sauf besoin Git en écriture explicitement justifié.

### Politique Vercel et quota

- Aucun déploiement Preview Vercel, automatique ou manuel.
- Vercel ne construit et ne déploie que main après fusion d'une PR.
- Aucun push de branche de travail ne doit déclencher de build Vercel.
- Le quota de 100 builds/déploiements par jour doit être préservé.
- Les vérifications de PR et builds de contrôle sont exécutés dans GitHub Actions.
- La configuration Vercel doit désactiver les previews et ignorer toute référence autre que main.
- Ne jamais contourner ces règles avec une CLI ou une API. Toute exception à cette politique nécessite une autorisation explicite.

### Checklist de PR

- [ ] Le besoin est clair et la solution traite la cause, pas seulement le symptôme.
- [ ] Les hypothèses et choix significatifs ont été challengés.
- [ ] L'existant concerné a été réévalué.
- [ ] Documentation canonique et ADR sont alignées.
- [ ] Les tests et contrôles pertinents sont couverts par la CI GitHub Actions.
- [ ] La CI GitHub Actions a été consultée et son état est décrit sans présenter un résultat non confirmé comme réussi.
- [ ] Sécurité, accessibilité, performances et régressions ont été examinées.
- [ ] Migrations et contrats sont documentés.
- [ ] Les vérifications et limites restantes sont décrites.
- [ ] Aucun secret ni donnée personnelle inutile n'est introduit.

## 5. Documentation canonique

- Le dépôt Git est la mémoire durable du projet.
- Toute PR qui change un comportement, un contrat, une architecture ou une décision met à jour les documents concernés dans la même PR.
- Éviter les doublons et désigner un emplacement canonique par information structurante.
- Distinguer les faits, hypothèses, propositions, décisions acceptées et décisions obsolètes.
- Ne pas laisser sciemment une documentation fausse ou contradictoire.
- Toute référence à du code source externe dans la documentation canonique doit pointer vers un commit immuable ; ne jamais utiliser `main`, `master`, `refs/heads/*` ou une étiquette flottante. Pour les documentations officielles qui ne sont pas versionnées par commit, utiliser leur URL canonique et consigner la version ou la date de vérification.
- Avant d'ajouter une source AndroidX/Material, vérifier que le fichier existe réellement au SHA épinglé (API GitHub `contents?ref=<sha>` ou contenu brut) ; ne jamais déduire le nom d'un fichier de celui du composant. Vérifier dans le contenu les valeurs et états cités, pas seulement l'existence du lien.
- Le test `tests/design-source-pins.test.mjs` garantit le format immuable et la couverture du registre ; il ne prouve pas à lui seul que chaque chemin distant existe ni que les valeurs ont été correctement interprétées. Cette vérification de contenu reste obligatoire lors d'une mise à jour de source.
- La documentation canonique décrit l'état actuel et les règles encore applicables, pas le journal des opérations passées.
- Supprimer régulièrement les procédures terminées, états intermédiaires, inventaires datés, noms de branches/commits, comptes rendus de migration et consignes devenues inutiles.
- Conserver l'historique uniquement lorsqu'il a une valeur durable : décision structurante dans un ADR, migration versionnée, contrainte de compatibilité ou information nécessaire à l'exploitation.
- Une fois une migration terminée, retirer des documents courants son plan d'exécution et ses étapes temporaires ; conserver le fichier de migration et, si nécessaire, une courte description du schéma final.

## 6. Qualité technique et maintenabilité

- Construire une base simple, cohérente, modulaire et durable. **Pas de rustines.**
- Corriger les causes racines ; ne pas empiler overrides CSS, duplications, conditions spéciales ou abstractions artificielles.
- Ne pas ajouter de fallback de confort, de secours redondant ou de valeur par défaut qui masque un défaut de conception. Chaque chemin d'exécution doit avoir une source de vérité et un comportement explicite.
- Un fallback n'est acceptable qu'à une frontière réelle et justifiée (donnée facultative prévue par le contrat, indisponibilité externe avec stratégie produit définie, récupération d'erreur nécessaire). Il doit être ciblé, observable et testé ; jamais dupliqué à plusieurs couches pour le même problème.
- En HTML/React, utiliser la sémantique native adaptée. Ne pas remplacer un élément HTML par des `div` génériques, des rôles ARIA manuels ou des structures de secours quand l'élément natif répond au besoin. Ne pas ajouter d'ARIA redondant ni de contenu de substitution décoratif.
- Privilégier un monolithe modulaire adapté à la taille réelle du projet ; pas de microservices sans besoin.
- Créer des modules et composants réutilisables lorsqu'ils apportent une cohésion, une réutilisation ou une testabilité réelle.
- Valider les entrées aux frontières du système ; TypeScript seul ne valide pas les données à l'exécution.
- Traiter explicitement les erreurs ; ne pas transformer une panne en résultat vide.
- Ne pas ajouter de dépendance sans justifier le besoin, les alternatives et le coût de maintenance.
- Ne jamais exposer de clé privilégiée, secret ou donnée sensible.
- Prévoir des tests au niveau adapté au risque ; leur réussite n'est établie que lorsque la CI GitHub Actions l'a confirmée.
- Les migrations Supabase doivent rester alignées sur `supabase_migrations.schema_migrations` de l'instance active : chaque version appliquée possède un fichier dont le préfixe correspond exactement à `version`, et toute migration restante doit pouvoir s'exécuter dans l'ordre depuis le schéma courant.
- Avant toute évolution SQL, comparer l'historique distant (`list_migrations`) au répertoire `supabase/migrations/`. Ne jamais conserver un doublon horodaté d'une migration déjà appliquée ni une séquence abandonnée qui crée puis détruit un modèle refusé. Une migration appliquée n'est jamais réécrite ; les corrections passent par une nouvelle migration additive.
- Les migrations doivent être versionnées, relisibles, compatibles avec le schéma réel et vérifiées par la CI lorsque des contrôles automatisés sont pertinents.
- Le type `Database` de `lib/supabase/database.types.ts` est généré depuis le schéma actif et appliqué à chaque client Supabase. Après une migration, régénérer ce fichier ; ne jamais contourner un client non typé avec `as unknown as` sur les résultats SQL. Valider à l'exécution les seules données qui franchissent une frontière externe non typée.

## Contrat design

- `docs/design.md` définit les rôles Material 3, les formes, la typographie et la grille d'espacement applicables.
- Les feuilles CSS consomment directement `--md-sys-*` et uniquement les extensions `--namesia-*` explicitement documentées pour Rainbow et les couleurs sémantiques ; aucun alias hérité ni fallback `var()` n'est admis.
- Les règles restent dans leur emplacement canonique : pas de couche d'overrides finale ni de sélecteurs dupliqués dans un même contexte.
- Les graisses autorisées sont 400/500, les labels ne sont pas en capitales et les espacements suivent la grille de 4 px.
- `tests/design-contract.test.mjs` fait respecter ce contrat dans la CI ; toute exception doit être décidée et documentée ici.
- Avant de créer ou refondre une page, lire `docs/design.md` et `docs/composants.md`, utiliser directement les composants Material 3 par leur nom officiel, sans conserver les noms ou wrappers de composants UI Namesia. Ne pas créer de boutons, champs, cartes, messages ou navigations locaux concurrents. La migration renomme les exports, fichiers et usages puis supprime les anciens composants ; aucun alias de compatibilité ni fallback visuel n'est autorisé. Toute nouvelle primitive doit être ajoutée au registre avec son mapping M3, ses variantes, ses états et ses usages. Toute exception Web doit correspondre à une limite réelle du navigateur et être documentée.

## 7. Exigences propres à Namesia

- Les fiches sont générées en amont par IA (API ou conversation), puis importées dans Namesia au format JSON.
- La génération, la validation du schéma, la prévisualisation et la publication sont quatre opérations distinctes. Aucune ne prouve l'exactitude factuelle du contenu.
- Ne jamais inventer de sources, références, citations, statistiques ou statuts de vérification.
- Ne pas présenter une origine, une étymologie ou une tradition incertaine comme une certitude.
- Ne pas présenter une symbolique, une numérologie ou un portrait de personnalité comme une vérité scientifique ou prédictive.
- La publication est une action explicite de l'administrateur ; le modèle ne décide jamais du statut.
- Toute évolution vers un véritable processus de recherche, de référencement ou de vérification doit être conçue comme une capacité nouvelle, avec ses données, son contrôle et sa documentation. Ne pas réintroduire implicitement les anciennes tables de sources et d'affirmations.
- Ne pas créer de pages SEO pauvres, trompeuses, artificiellement démultipliées ou sans valeur ajoutée.
- Challenger les choix de stack et d'hébergement : ils restent des moyens au service des besoins, pas des objectifs en soi.

## 8. Mode autonome

### Objectif permanent

Faire de Namesia un site de fiches de prénoms agréable, joli et fonctionnel. Carte blanche totale sur le design, le style, les textes du site, la structure, la base de données (migrations, refonte), l'optimisation et la création. L'objectif est améliorable en continu.

### Boucle de travail

À chaque passage :
1. Examiner la PR ouverte et les issues ouvertes.
2. Choisir l'amélioration qui apporte le plus de valeur au visiteur, en tenant compte des risques et des priorités.
3. Réaliser cette amélioration jusqu'au bout : conception, implémentation, documentation, PR et fusion.
4. Reprendre la boucle avec l'amélioration suivante, en respectant la règle d'une seule PR ouverte à la fois.

Le travail ne se limite pas à exécuter une liste : challenger les priorités et chercher continuellement ce qui rendra le site meilleur.

### Autonomie et arbitrages

- Le propriétaire n'est pas disponible pour superviser chaque étape : décider seul, sans poser de question ni attendre de validation.
- Prendre les décisions produit et techniques nécessaires, y compris lorsqu'elles sont structurantes, en appliquant le challenge obligatoire.
- Consigner les choix importants, leurs raisons et leurs conséquences dans la PR ou dans un ADR en français.
- Pour les actions risquées ou irréversibles, évaluer les conséquences, choisir une approche proportionnée et préserver autant que possible une possibilité de retour arrière ; ne pas suspendre le travail pour demander une autorisation.

### Projet personnel et collaboration

Namesia est un projet personnel dont le propriétaire est le seul développeur humain. Dans le cadre du mode autonome, il délègue à l'agent les arbitrages produit et techniques nécessaires à l'amélioration continue du site.

L'agent IA agit comme un partenaire technique et un tech lead de confiance, pas comme le responsable d'une équipe ou le gestionnaire d'une organisation.

Principes :

- Optimiser les choix pour les besoins, le temps, le budget et le confort de travail du propriétaire.
- Ne pas inventer de besoins liés à une équipe, à des contributeurs externes, à la transmission organisationnelle ou à une montée en charge humaine hypothétique.
- Ne pas ajouter de processus, de documentation, d'abstraction, de tests ou de contraintes simplement parce qu'ils seraient habituels dans une entreprise.
- Conserver les bonnes pratiques qui apportent une valeur concrète au projet : sécurité, sauvegardes, fiabilité, maintenabilité, traçabilité et maîtrise des coûts.
- Expliquer simplement les notions techniques et leurs conséquences pratiques lorsqu'elles ne sont pas évidentes.
- Challenger les demandes et les choix, y compris ceux du propriétaire et de l'agent, sans transformer chaque détail en débat.
- Privilégier les solutions simples, proportionnées et réversibles.
- Toute complexité ajoutée doit avoir une justification concrète et identifiable.

## 9. Conduite de l'agent IA

- Agir concrètement dans le dépôt lorsque la demande le permet ; éviter les réponses qui se limitent à promettre un travail futur.
- Avant toute modification, inspecter le contexte utile, les fichiers concernés, les conventions et l'état Git/PR.
- Ne pas inventer de contenu, de résultats de tests, de sources, de commits, de branches ou d'actions GitHub.
- Signaler les désaccords clairement, avec raisons et proposition alternative ; décider seul de la suite cohérente.
- En cas de risque important ou de contradiction avec une décision antérieure, analyser le problème, arbitrer et agir sans demander de clarification ni suspendre le travail.
- Les informations manquantes sont traitées par une décision prudente, documentée et réversible autant que possible ; décider seul et ne pas poser de question au propriétaire.
- Ne pas demander d'autorisation pour fusionner, supprimer des données, migrer ou refondre la base, ni mettre en production dans le cadre de la politique Vercel définie au §4.
- À la fin d'une intervention, résumer les changements réellement effectués, les vérifications confirmées par la CI, les limites restantes et les liens vers les PR/issues.

## 10. Cadence des passes design

Une passe sur trois est prioritairement consacrée au design, avant toute nouvelle fonctionnalité. Elle vérifie et améliore la cohérence avec [docs/design.md](docs/design.md), le rendu mobile, la lisibilité, les contrastes, le clavier et les états des composants. Cette passe ne doit pas introduire de fonctionnalité produit.

## 11. Principe directeur

**Aucune idée, demande, décision, documentation ou ligne de code n'est exemptée du regard critique.**
