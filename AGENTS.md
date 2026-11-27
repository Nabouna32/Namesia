# AGENTS.md — Charte de travail de Namesia

- **Version :** 1.2
- **Mis à jour le :** 2026-11-27 13:20:36 (Europe/Paris)

Cette charte s'applique à tout le dépôt, aux contributions humaines et aux agents IA.

## 1. Langue et traçabilité

- Toute communication durable dans le dépôt est en français : documentation, issues, PR, commentaires, revues, ADR et suivi.
- Les identifiants, noms de fichiers, modules, types, variables, fonctions et exports créés ou modifiés sont en anglais ; les commentaires de code, textes de tests, documentation, issues, PR et échanges GitHub restent en français. Les primitives d'interface ne doivent pas être recréées dans les features ni masquées derrière des wrappers Namesia. Lorsqu'aucune implémentation Web officielle, stable, maintenue et suffisamment complète n'existe, un port React/HTML local du contrat AndroidX est admis : il doit porter le nom M3 officiel, rester unique, utiliser la sémantique native et être vérifié contre une source AndroidX immuable. Ne jamais prétendre qu'un port Web est un composant AndroidX exécuté dans le navigateur. Le legacy se migre progressivement lorsqu'il est touché, sans refactor global hors sujet.
- Les segments de routes, paramètres de requête et chemins d'API publics peuvent rester en français pour préserver le SEO et les contrats existants ; ne pas les renommer sans migration explicite des URL canoniques, du sitemap, des redirections et des liens entrants.
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
- Garder une seule PR de travail ouverte à la fois. Contribuer à la PR existante si le périmètre est cohérent ; ne pas créer de PR empilée par commodité. Exception : Dependabot peut maintenir plusieurs PR indépendantes ouvertes afin de proposer chaque mise à jour séparément ; elles restent toutes soumises à une revue humaine et ne sont jamais fusionnées automatiquement.
- Avant de créer une branche ou une PR, consulter les PR ouvertes et les runs GitHub Actions récents pour repérer les travaux concurrents. Si un périmètre équivalent existe déjà, réutiliser ou compléter sa branche de référence ; ne pas ouvrir de PR doublon. Si un doublon est déjà ouvert, le fermer en indiquant où les changements utiles sont conservés.
- Autorisation permanente : fusionner les PR vers main sans demander d'autorisation supplémentaire.
- Autorisation permanente : supprimer des données, effectuer les migrations nécessaires et faire évoluer ou refondre la base de données lorsque cela sert l'objectif du projet. Préserver l'intégrité des données et documenter les opérations structurantes.
- La CI GitHub Actions est l'unique mécanisme de vérification : ne pas exécuter de commandes de test, de build ou de contrôle localement.
- Consulter l'état de la CI GitHub Actions pour chaque PR et attendre la fin de tous les contrôles requis avant de fusionner. Ne jamais fusionner tant qu'un contrôle est en cours ou en attente. Si un contrôle échoue, lire ses jobs et ses logs, corriger la cause puis attendre une nouvelle exécution complète. Si la CI de main est rouge, la corriger en priorité avant tout autre chantier.
- Pour consulter un run, utiliser l'API REST GitHub Actions par SHA : `GET /repos/{owner}/{repo}/actions/runs?head_sha={sha}&per_page=10`. Si aucun résultat n'est retourné, recouper une seule fois avec `GET /repos/{owner}/{repo}/actions/runs?per_page=10` et filtrer le SHA exact ; certaines vues spécialisées peuvent retourner une liste vide alors qu'un run existe. Une liste vide ne prouve donc pas que la CI n'a pas démarré.
- Pour un run en échec, lire les jobs puis les logs du job en échec avant toute correction. Ne pas se limiter au résumé du statut : les logs distinguent une régression de code d'un contrat de test devenu obsolète.
- Le job `quality` bloque sur l'audit des dépendances de production (`npm audit --omit=dev --audit-level=high`) et exécute aussi un audit complet du graphe (`npm audit --audit-level=high`) à titre diagnostique non bloquant, pour suivre les vulnérabilités des outils de développement. Il exécute ensuite les tests, le contrôle TypeScript et le build même si l'un échoue. La synthèse finale distingue l'audit bloquant de production, le diagnostic complet, les tests, les types et le build ; sur un run rouge, lire chaque `outcome` et ses logs avant de corriger afin de traiter toutes les causes indépendantes dans la même boucle. Une vulnérabilité de développement n'est pas une exposition directe du Worker, mais elle reste une dette de sécurité à corriger, jamais un résultat à masquer.
- Ne jamais déclarer un test, build ou contrôle réussi sans que la CI GitHub Actions l'ait confirmé.

- Playwright vérifie un petit nombre de parcours publics représentatifs sur la Workers Preview des PR internes, jamais sur un environnement authentifié ou contenant des données privées : disponibilité des routes essentielles, erreurs JavaScript et débordements responsive représentatifs. Les contrôles visuels temporaires ne deviennent pas des tests permanents.
- **Aucune capture d'écran systématique en CI.** Les captures sont réservées au diagnostic ponctuel d'un défaut visuel ou à une comparaison explicitement demandée ; elles ne sont ni générées ni publiées à chaque PR.
- **Aucun artefact Playwright n'est produit ou publié systématiquement.** Par défaut, captures, vidéos et traces sont désactivées et aucun rapport n'est archivé.
- Pour un diagnostic visuel ponctuel sur une PR interne, ajouter temporairement le label `diagnostic-playwright` : le workflow réactive les captures sur échec et les traces d'échec, et publie `test-results/` uniquement pour ce run, avec une rétention d'un jour. Un `page.screenshot()` ajouté temporairement permet aussi de capturer un rendu qui passe. Retirer le label, le code de diagnostic et les fichiers de capture dès validation ; supprimer immédiatement l'artefact depuis Actions si le diagnostic est terminé avant son expiration. Ne jamais créer de galerie, baseline visuelle ou historique de captures.
- axe-core est consultatif : ses constats sont visibles dans les logs, mais ne bloquent pas le rendu. Les vrais défauts fonctionnels, erreurs JavaScript, échecs HTTP et débordements vérifiés restent bloquants.
- Les tests permanents protègent des comportements métier, parcours critiques ou régressions coûteuses. Ne pas tester chaque texte, classe CSS, valeur de style ou détail transitoire ; supprimer ou réviser les tests devenus obsolètes quand le produit évolue.
- Les vérifications visuelles sont ponctuelles : lorsqu'une modification le justifie, un contrôle Playwright temporaire peut servir à observer/corriger le rendu. La capture peut être récupérée depuis l'artefact temporaire décrit ci-dessus, puis le code de diagnostic et les captures sont supprimés une fois le résultat validé. Ne pas pérenniser une assertion de CSS, de géométrie ou de style pour un détail déjà vérifié (notamment SearchBar). Les tests Playwright permanents couvrent des comportements stables et des parcours représentatifs, pas l'historique des corrections visuelles.
- Toutes les actions GitHub (`uses`) sont épinglées sur un SHA de commit complet à 40 caractères, avec le tag de version conservé en commentaire. Avant une mise à jour, vérifier que le SHA correspond au tag officiel et relire les changements amont ; ne jamais revenir à une référence de tag mutable. Le checkout désactive `persist-credentials` sauf besoin Git en écriture explicitement justifié.

### Déploiement et CI

- Cloudflare Workers est l'unique hébergement de production ; GitHub Actions est l'unique moteur de build, de vérification et de déploiement.
- Les PR internes humaines peuvent créer une Workers Preview isolée ; les secrets Cloudflare ne sont jamais exposés aux forks ni aux PR créées par Dependabot. Ces dernières conservent les vérifications de build et de qualité, mais ne tentent pas de créer ou supprimer une Preview.
- Seule la branche `main`, après fusion d'une PR, déploie la production. Le lancement manuel du workflow est réservé à `main`.
- Les vérifications de PR et les contrôles visuels s'exécutent dans GitHub Actions ; aucun hébergeur tiers de build ou de déploiement n'est requis.

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

- **Métadonnées documentaires obligatoires :** tout document Markdown maintenu du dépôt (AGENTS.md, README, documentation canonique et ADR) porte un numéro de version et une date/heure de dernière mise à jour au format `AAAA-MM-JJ HH:mm:ss (Europe/Paris)`. Incrémenter la version lors d'une évolution substantielle du contenu ou du contrat ; une correction purement typographique ne force pas une nouvelle version, mais actualise la date/heure.
- **ADR :** ajouter en plus la date et l'heure exactes de la décision (`Décision prise le`), son statut et sa version. La date de décision est distincte de la date de dernière modification. Ne jamais antidater ni inventer une heure : si elle n'a pas été consignée à l'origine, le signaler explicitement et conserver l'historique Git comme source de traçabilité.
- **Documents existants :** appliquer ces métadonnées lors de leur prochaine modification substantielle, sans créer une PR de masse ni inventer rétroactivement des dates. Pour connaître l'ancienneté d'un document non encore migré, consulter son historique Git.
- **Audit de fraîcheur :** une date ancienne est un signal pour réexaminer la pertinence, les liens, les hypothèses et les décisions ; elle ne rend pas automatiquement le document obsolète. Une décision reste applicable tant qu'elle n'est pas explicitement remplacée, retirée ou révisée dans un ADR. Les documents de référence doivent être audités lorsque leur contexte change et lors des passages d'audit documentaire, en priorisant les plus anciens et les plus structurants.

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
- Ne pas ajouter de fallback préventif ou de seconde implémentation par confort. Une erreur ou l'indisponibilité d'une dépendance indispensable doit être traitée explicitement, sans résultat fictif, valeur de remplacement trompeuse ni conversion silencieuse en absence de données. Une exception de repli n'est admise que pour répondre à un besoin utilisateur concret ; son périmètre, sa raison, son comportement, ses limites et sa validation sont documentés. Cette décision reste réexaminable et doit être remplacée si une meilleure solution apparaît. Un port React/HTML du contrat AndroidX est l'implémentation Web principale, pas un fallback.
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
- Les modules TypeScript exécutés directement par Node dans les tests natifs utilisent des imports relatifs explicites avec extension `.ts` ; les alias `@/` sont réservés aux modules résolus par le bundler Next.js. Les tests de logique pure importent un module cœur sans dépendance au client ou au runtime applicatif.
- Les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` sont validées uniquement par `lib/supabase/config.ts`. Tous les clients utilisent `getSupabasePublicConfig()` ; aucune assertion non nulle ni origine de secours n'est autorisée.
- Les comptes Namesia utilisent un système unique Supabase Auth par e-mail et mot de passe, partagé entre visiteurs et administrateurs. Le mot de passe comporte au moins 15 caractères, sans règle de composition (pas de majuscule, chiffre ou symbole obligatoire) ; les phrases de passe sont acceptées. Supabase Auth limite actuellement les mots de passe à 72 octets UTF-8. La protection HIBP des mots de passe compromis n'est pas un prérequis et aucun passage à Supabase Pro n'est imposé ; cette dérogation ne doit pas être présentée comme une conformité complète au NIST. La confirmation e-mail, les réponses anti-énumération, les limites de débit Auth et la récupération de compte restent obligatoires. Les droits administrateur sont attribués séparément via `private.admin_users`, jamais via des métadonnées modifiables par l'utilisateur ([ADR-0055](docs/decisions/ADR-0055-authentification-comptes-partages.md)).
- Après chaque migration SQL appliquée, relancer les advisors Supabase `security` et `performance`, puis vérifier les policies réellement présentes dans `pg_policies`. Les limites liées au forfait ou à une configuration externe sont documentées dans une issue ; elles ne sont jamais contournées par du code applicatif.

## Contrat design

- `docs/design.md` définit Material 3 Fidelity comme référence forte des rôles, composants, formes, typographie et interactions.
- Les composants M3 portés proprement en React/HTML sont le choix par défaut ; une solution générique moins fidèle ne peut les remplacer par simple commodité.
- Les feuilles CSS consomment directement `--md-sys-*` et uniquement les extensions `--namesia-*` documentées. Les alias, overrides et fallbacks restent évités ; une exception doit répondre à un besoin concret et être documentée.
- Les règles restent dans leur emplacement canonique et les tokens M3 sont privilégiés. Les conventions de typographie et d'espacement sont les valeurs par défaut, pas des interdictions aveugles.
- `tests/design-contract.test.mjs` protège les invariants utiles. Les exceptions validées sont explicites, testées à leur niveau de risque et réexaminables.
- **Material 3 Fidelity est la base forte, pas une option décorative :** dès qu'un composant ou motif M3 peut être porté proprement en React/HTML, il constitue le choix par défaut. Ne pas le remplacer par un thème générique ou un composant standard moins fidèle par simple facilité. Adapter les contrats aux conventions Web (HTML natif, clavier, focus, responsive et accessibilité) sans abandonner leur identité. Un écart significatif n'est permis que pour un bénéfice concret ou une limite réelle ; documenter le besoin, les options, la raison, le périmètre et les conséquences. Toute exception reste réexaminable et ne devient jamais une interdiction de revenir à une meilleure solution. Les audits automatiques sont des outils de diagnostic, pas des directeurs artistiques : corriger les problèmes réels d'accessibilité, y compris lorsqu'une adaptation M3 documentée est nécessaire.
- Les indicateurs de focus font partie de l'anatomie de chaque composant : préserver le contour sur la capsule complète de `SearchBar` (anneau `primary` 2 px, rayon `full`, clavier uniquement). Ne pas le remplacer par le contour rectangulaire générique du champ intérieur.
- axe-core reste un audit consultatif : ses constats sont consignés dans les logs et triés, mais ses violations ne font pas échouer le parcours visuel ni ne déclenchent de modification de style automatique. Aucun rapport d'audit de réussite n'est archivé. Les régressions fonctionnelles, erreurs JavaScript, échecs HTTP et débordements de mise en page restent bloquants. Corriger les constats sémantiques ou de nommage lorsqu'ils ne dégradent pas le design ; tout conflit visuel est arbitré contre les sources AndroidX et la direction Fidelity.
- Avant de créer ou refondre une page, lire `docs/design.md` et `docs/composants.md`. Réutiliser les primitives M3 uniques du registre ; ne jamais créer une seconde implémentation concurrente, un wrapper nominal ou un alias de compatibilité. Un composant local n'est admis que comme port Web principal d'un contrat M3 sans équivalent Web officiel répondant aux exigences de maintenance, de couverture et d'accessibilité. Toute nouvelle primitive doit être ajoutée au registre avec son mapping M3, ses variantes, ses états, ses usages et sa justification face aux alternatives Web officielles. Toute adaptation doit correspondre à une limite réelle du navigateur et être documentée.

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
- Ne pas demander d'autorisation pour fusionner, supprimer des données, migrer ou refondre la base, ni déployer la production Cloudflare selon le workflow défini au §4.
- À la fin d'une intervention, résumer les changements réellement effectués, les vérifications confirmées par la CI, les limites restantes et les liens vers les PR/issues.

## 10. Cadence des passes design

Une passe sur trois est prioritairement consacrée au design, avant toute nouvelle fonctionnalité. Elle vérifie et améliore la cohérence avec [docs/design.md](docs/design.md), le rendu mobile, la lisibilité, les contrastes, le clavier et les états des composants. Cette passe ne doit pas introduire de fonctionnalité produit.

## 11. Principe directeur

**Aucune idée, demande, décision, documentation ou ligne de code n'est exemptée du regard critique.**
