# AGENTS.md — Charte de travail de Namesia

Ce fichier définit les règles de collaboration applicables à l'ensemble du dépôt. Il s'adresse aux personnes qui contribuent au projet ainsi qu'aux agents IA. Il prime sur les habitudes implicites et s'applique à chaque intervention, petite ou grande.

## 1. Langue et traçabilité

- Toute communication durable dans le dépôt est rédigée en français : documentation, documentation canonique, issues, titres et descriptions de PR, commentaires, revues, ADR, messages de commit et textes de suivi.
- Les identifiants techniques, noms d'API, termes consacrés et extraits de code peuvent rester dans leur langue d'origine lorsque leur traduction nuirait à la précision.
- La conversation de travail est éphémère : toute décision utile à l'avenir doit être consignée dans le dépôt, au bon endroit.
- Ne jamais présenter une hypothèse comme un fait, une proposition comme une décision, ni une action envisagée comme une action réalisée.

## 2. Challenge obligatoire et permanent

Le challenge critique est une obligation à chaque étape, pas une option réservée aux revues de code.

Il s'applique systématiquement :
- aux demandes, idées, intuitions et affirmations de l'utilisateur ;
- aux propositions, analyses et recommandations de l'agent IA ;
- à la vision produit, aux publics, au positionnement, au modèle économique éventuel et au périmètre ;
- aux choix éditoriaux, SEO, métier, juridiques, techniques et architecturaux ;
- aux ADR et décisions déjà acceptées ;
- au code, aux tests, aux schémas, aux données et aux processus existants ;
- aux solutions temporaires qui risquent de devenir permanentes.

Aucune ancienneté, validation passée ou autorité de l'auteur ne rend un choix intouchable. L'existant doit être réévalué à la lumière du contexte actuel. Une décision antérieure peut être conservée, amendée ou annulée, mais jamais simplement reconduite par inertie.

### Méthode de challenge

Pour chaque choix qui a un impact significatif :

1. **Reformuler** le besoin réel et le résultat attendu, sans confondre la solution proposée avec le problème.
2. **Vérifier les prémisses** : faits, données, contraintes, hypothèses, dépendances et zones d'incertitude.
3. **Chercher les angles morts** : cas limites, risques, coûts cachés, dette, sécurité, vie privée, accessibilité, maintenabilité, évolutivité et effets éditoriaux ou SEO.
4. **Comparer des options** : présenter au moins une alternative crédible lorsque le choix n'est pas trivial, y compris l'option de ne rien faire.
5. **Expliquer le choix recommandé** : pourquoi cette option, pourquoi pas les autres, quels compromis et quelles conséquences.
6. **Définir la vérification** : preuve, test, mesure, prototype ou critère qui permettra de confirmer ou de réviser le choix.

Le challenge doit être argumenté, proportionné à l'enjeu et respectueux. Il ne s'agit ni de contredire systématiquement ni de ralentir les changements triviaux. En revanche, aucune proposition importante ne doit être approuvée par complaisance.

### Format de réponse attendu

Pour un arbitrage significatif, expliciter :
- **Constat** : ce qui est établi et ce qui ne l'est pas.
- **Challenge** : faiblesses, risques ou prémisses discutables.
- **Options** : alternatives pertinentes et leurs compromis.
- **Recommandation** : choix proposé et justification.
- **Conséquences** : impacts, coûts, limites et risques résiduels.
- **Validation** : comment vérifier et quand réexaminer.

Si les éléments disponibles ne permettent pas de conclure, le dire clairement et proposer la plus petite investigation utile. Ne pas fabriquer une certitude pour satisfaire une demande.

## 3. Vision produit et décisions

- La vision produit n'est pas sacrée : challenger régulièrement le problème utilisateur, les publics, la proposition de valeur, le périmètre, la différenciation et les indicateurs de réussite.
- Ne pas confondre une préférence personnelle, une intuition de marché et un besoin démontré.
- Toute affirmation de marché, de comportement utilisateur, de concurrence ou de performance SEO doit être étayée ou explicitement qualifiée d'hypothèse.
- Les décisions structurantes sont consignées dans un ADR en français : contexte, problème, options considérées, décision, raisons, conséquences, statut et conditions de réexamen.
- Une ADR existante doit être relue lorsqu'un changement de contexte, une nouvelle preuve ou un coût observé remet en cause ses prémisses.
- Ne pas modifier silencieusement une décision acceptée : proposer un nouvel ADR ou une mise à jour explicite avec historique et justification.
- Une décision provisoire doit être marquée comme telle, avec responsable, échéance ou condition de réévaluation lorsque c'est pertinent.

## 4. Issues GitHub

Toute issue est rédigée en français et doit, selon le sujet, préciser :
- le problème ou besoin, plutôt que prescrire trop tôt une solution ;
- le contexte et les éléments observés ;
- les hypothèses à vérifier et les questions ouvertes ;
- les critères d'acceptation observables ;
- les contraintes, dépendances, risques et éléments hors périmètre.

Challenger également les issues existantes : détecter les doublons, besoins mal formulés, solutions prématurées, critères non testables et priorités non justifiées. Une issue n'est pas une vérité parce qu'elle existe déjà.

## 5. Pull requests et stratégie Git

- Tout changement passe par une branche et une pull request ; ne pas pousser directement sur la branche principale.
- Une PR a un titre, une description et des commentaires en français.
- Une PR doit expliquer le problème, la solution, les choix et compromis, les risques, les vérifications réalisées et les éventuelles tâches restantes.
- Garder les PR aussi ciblées que possible. Éviter de mélanger refonte produit, changements d'architecture et implémentation sans lien.
- Ne jamais fusionner une PR sans autorisation explicite de la personne responsable du dépôt.
- Ne pas déclarer une PR prête si les vérifications annoncées n'ont pas été exécutées.
- Lire le diff complet, pas seulement le résumé. Challenger aussi bien le code ajouté que le code préexistant touché ou rendu obsolète.
- Vérifier les régressions, migrations, compatibilités, sécurité, performances, accessibilité et conséquences opérationnelles.
- Documenter les limites connues plutôt que masquer les contrôles manquants.

### Checklist obligatoire de PR

- [ ] Le besoin est clair et la solution ne traite pas seulement un symptôme.
- [ ] Les hypothèses et choix significatifs ont été challengés ; les alternatives et compromis sont expliqués.
- [ ] L'existant concerné a été réévalué, sans présumer qu'il est correct.
- [ ] La documentation canonique et les ADR sont mises à jour si nécessaire.
- [ ] Les tests pertinents ont été ajoutés ou adaptés et exécutés.
- [ ] Les contrôles qualité, sécurité et accessibilité pertinents ont été effectués.
- [ ] Les migrations et changements de contrat sont documentés et compatibles.
- [ ] La PR indique précisément ce qui a été vérifié et ce qui reste à faire.
- [ ] Aucun secret, donnée personnelle inutile ou contenu non autorisé n'est introduit.

### Politique de sérialisation des pull requests

- Par défaut, maintenir **une seule PR de travail ouverte à la fois** dans le dépôt.
- Ne pas ouvrir une nouvelle PR tant que la précédente n'est pas fusionnée ou fermée : terminer, faire relire et intégrer le travail en cours avant d'entamer une autre PR.
- Cette règle évite les modifications concurrentes des mêmes fichiers, les conflits de fusion, les bases obsolètes, les PR empilées difficiles à relire et les validations répétées.
- Exception uniquement si le travail doit réellement avancer en parallèle et que les périmètres sont indépendants : expliquer pourquoi le parallélisme est nécessaire, vérifier l'absence de chevauchement et annoncer explicitement la stratégie de branches et de bases.
- Ne jamais créer une PR empilée par simple commodité. Si une dépendance entre changements existe, privilégier une seule PR cohérente ou attendre la fusion de la PR parente.
- Avant de créer une PR, vérifier les PR déjà ouvertes du dépôt et leur état. Si une PR existe, contribuer à celle-ci lorsque le périmètre est cohérent, ou attendre sa clôture/fusion.

## 6. Documentation canonique

- Le dépôt est la source de vérité durable du projet.
- La documentation canonique doit évoluer avec le produit et le code, pas plusieurs semaines après.
- Toute PR qui modifie un comportement, un contrat, une architecture, une règle éditoriale ou une décision doit mettre à jour les documents concernés dans la même PR.
- Éviter les doublons : chaque information structurante doit avoir un emplacement canonique clairement identifiable ; les autres documents renvoient vers lui.
- Distinguer explicitement faits, hypothèses, propositions, décisions acceptées et décisions obsolètes.
- Ajouter les sources, dates, limites et conditions de validité pour les informations externes susceptibles d'évoluer.
- Ne pas laisser une documentation connue comme fausse ou obsolète au motif qu'elle n'est pas directement liée à la tâche : signaler le problème et proposer sa correction.

## 7. Exigences de qualité technique

- Privilégier la simplicité explicite, les interfaces stables et les changements réversibles.
- Ne pas ajouter de dépendance sans expliquer le besoin, les alternatives, le coût de maintenance et les implications de sécurité.
- Valider les entrées aux frontières du système ; typer les contrats ; traiter les erreurs explicitement.
- Ne pas introduire de secrets dans le dépôt, les logs, les fixtures ou les réponses client.
- Prévoir les tests au niveau pertinent : unité, intégration, contrat et bout en bout.
- Ne pas prétendre qu'un test, un lint, un build, une migration ou une validation a réussi sans l'avoir exécuté.
- Éviter la sur-ingénierie, mais ne pas sacrifier l'intégrité des données, la sécurité ou la maintenabilité pour aller plus vite.
- Pour les données et contenus, préserver provenance, version, date, statut et possibilité de correction.

## 8. Exigences propres à Namesia

- Séparer strictement les faits documentés des interprétations symboliques ou culturelles.
- Sourcer les affirmations factuelles de manière traçable et au niveau le plus fin raisonnable.
- Ne jamais présenter une symbolique, une numérologie ou un portrait de personnalité comme une vérité scientifique ou prédictive.
- Une sortie d'IA est un candidat à contrôler, jamais une publication autonome.
- Le modèle ne décide ni de la validité d'une preuve ni de l'approbation éditoriale ni de la publication.
- Respecter les limites, périodes, seuils, licences et biais des sources statistiques et historiques.
- Ne pas créer de pages SEO pauvres, trompeuses, artificiellement démultipliées ou sans valeur ajoutée.
- Challenger les choix de stack et d'hébergement : ils restent des moyens au service des besoins, pas des objectifs en soi.

## 9. Conduite de l'agent IA

- Agir concrètement dans le dépôt lorsque la demande le permet ; éviter les réponses qui se limitent à promettre un travail futur.
- Avant toute modification, inspecter le contexte utile, les fichiers concernés, les conventions et l'état Git/PR.
- Ne pas inventer de contenu, de résultats de tests, de sources, de commits, de branches ou d'actions GitHub.
- Signaler les désaccords clairement, avec raisons et proposition alternative.
- Si la demande conduit à un risque important ou à une contradiction avec une décision, exposer le problème avant d'agir ; pour les changements réversibles et à faible risque, proposer puis exécuter une solution cohérente.
- Demander une clarification uniquement lorsqu'une information réellement bloquante manque.
- Ne pas fusionner, supprimer des données, déployer en production ou effectuer une action irréversible sans autorisation explicite.
- À la fin d'une intervention, résumer les changements réellement effectués, les vérifications réellement exécutées, les limites restantes et les liens vers les PR/issues.

## 10. Principe directeur

**Aucune idée, demande, décision, documentation ou ligne de code n'est exemptée du regard critique.** Le rôle de l'équipe est d'améliorer la qualité des décisions et du produit, pas de confirmer automatiquement les choix de qui que ce soit.
