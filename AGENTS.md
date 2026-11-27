# AGENTS.md — Règles communes de Namesia

- **Version :** 2.0
- **Mis à jour le :** 2026-11-27 20:02:53 (Europe/Paris)

Ce document est le socle impératif de toute contribution humaine ou assistée par IA. Il définit les règles communes ; les contrats et guides spécialisés détaillent leur application.

## 1. Langue et traçabilité

- Toute communication durable dans le dépôt et sur GitHub est en français : documentation, issues, PR, commentaires, revues et ADR.
- Les identifiants de code et noms descriptifs de fichiers sont en anglais. Les fichiers Markdown descriptifs suivent `UPPERCASE-KEBAB-CASE.md` ; les dossiers restent en minuscules. Conserver les noms imposés par l'écosystème, notamment `AGENTS.md` et `README.md`.
- Les routes publiques existantes ne sont pas renommées sans stratégie explicite de compatibilité et de redirection.
- Le dépôt Git est la mémoire durable. Une décision utile à long terme est documentée ; distinguer faits, hypothèses, propositions, décisions et actions effectuées.
- Ne jamais inventer de source, citation, statistique, validation, résultat de CI, branche, commit ou action GitHub.

## 2. Challenge obligatoire

Challenger les besoins, propositions, décisions passées et l'existant sans complaisance ni contradiction artificielle. Pour tout choix significatif :
1. reformuler le besoin réel ;
2. vérifier hypothèses, contraintes et dépendances ;
3. identifier risques, effets secondaires et angles morts ;
4. comparer les options crédibles, y compris l'inaction ;
5. recommander clairement et expliquer les compromis ;
6. définir la validation attendue.

Le challenge est proportionné : ne pas transformer chaque détail en débat.

## 3. Gouvernance et limites d'autonomie

Les contrats définissent le comportement attendu selon le mode de travail :
- [Contrat coopératif](docs/COOP-CONTRACT.md) ;
- [Contrat autonome](docs/AUTONOMOUS-CONTRACT.md).

Un accord exploratoire ne vaut pas automatiquement ordre de lancer un chantier distinct. Les dépenses nouvelles, changements de positionnement ou de promesses fondamentales, modèle économique, publicité, partenariats engageants, fonctions payantes et collectes sensibles exigent un accord explicite. Pour tout arbitrage humain requis, créer ou mettre à jour une issue intitulée **[Action Humaine]**, puis poursuivre les travaux indépendants.

## 4. Issues, branches et pull requests

- Toute évolution passe par une branche et une PR ; aucun push direct sur `main`.
- Titres, descriptions, issues et commentaires GitHub sont en français.
- Garder une seule PR de travail humaine ouverte à la fois. Les PR Dependabot indépendantes sont l'exception ; elles restent soumises à une revue et une fusion manuelles.
- Avant de créer une branche ou une PR, consulter les PR ouvertes et les runs récents pour éviter les doublons et repérer les travaux concurrents.
- Lire le diff complet et challenger le code préexistant touché. Documenter les choix, risques, vérifications et limites.
- Autorisation permanente : fusionner les PR vers `main` sans demander une validation supplémentaire, dès que les contrôles requis sont terminés et réussis.
- Autorisation permanente : réaliser les migrations et refontes de base nécessaires, en préservant l'intégrité et en documentant les opérations structurantes.

## 5. CI et déploiement

- GitHub Actions est l'unique mécanisme de test, build, contrôle et déploiement. Ne pas exécuter de test, build ou contrôle localement.
- Consulter les runs associés au SHA exact. Lire les jobs et logs en cas d'échec ; corriger les causes puis attendre un nouveau run complet.
- Ne jamais fusionner tant qu'un contrôle requis est en cours, en attente ou en échec. Ne jamais annoncer une réussite sans confirmation GitHub Actions.
- Si la CI de `main` est rouge, la corriger avant tout nouveau chantier.
- Seule la branche `main`, après fusion, déploie la production Cloudflare. Les previews de PR ne sont pas la production.
- Ne jamais exposer les secrets Cloudflare aux forks ou aux PR Dependabot. Les previews ne contiennent pas de données privées ni de sessions de production.

Les procédures détaillées sont dans [GitHub Actions](docs/platform/GITHUB-ACTIONS.md) et [Cloudflare Workers](docs/platform/CLOUDFLARE-WORKERS.md).

## 6. Sécurité et qualité

- Ne jamais exposer de secret, clé privilégiée ou donnée personnelle inutile. Aucune clé `service_role` dans le navigateur.
- Valider les données aux frontières du système ; TypeScript ne valide pas les entrées à l'exécution.
- Utiliser RLS et des privilèges SQL minimaux pour les données exposées. Les mutations sensibles sont validées côté serveur.
- Corriger les causes racines : pas de rustines, duplications, overrides ou abstractions artificielles.
- Privilégier la sémantique HTML native et l'accessibilité clavier. Ne pas ajouter d'ARIA redondant.
- Traiter explicitement les erreurs ; ne pas transformer une panne en résultat vide ou fictif.
- Ne pas ajouter de dépendance sans besoin concret, alternatives et coût de maintenance.
- Les standards d'ingénierie sont détaillés dans [TECHNICAL-STANDARDS.md](docs/TECHNICAL-STANDARDS.md).

## 7. Contraintes propres à Namesia

- Namesia reste en phase **PRÉ-LANCEMENT / DÉVELOPPEMENT** tant qu'un changement daté n'a pas été confirmé.
- Le catalogue et les fiches sont gratuits et accessibles sans compte.
- Les fiches sont générées en amont puis importées. Génération, validation du schéma, prévisualisation et publication sont des opérations distinctes ; aucune ne prouve l'exactitude factuelle.
- Ne jamais inventer de sources, références, citations, statistiques ou validations. Distinguer faits, hypothèses et symbolique.
- La publication est une action explicite de l'administration.
- Challenger la stack et l'hébergement : ce sont des moyens, pas des objectifs.

Les références produit et éditoriales sont dans [PRODUCT-VISION.md](docs/PRODUCT-VISION.md), [EDITORIAL-POLICY.md](docs/EDITORIAL-POLICY.md) et [AI-GENERATION-PIPELINE.md](docs/AI-GENERATION-PIPELINE.md).

## 8. Documentation canonique

- Le [README racine](README.md) est l'index général du dépôt.
- Une information structurante possède une seule source canonique ; les autres documents renvoient vers elle.
- Toute PR qui modifie un comportement, un contrat, une architecture ou une décision met à jour les documents concernés dans la même PR.
- Les documents Markdown maintenus portent un numéro de version et une date/heure de mise à jour au format `AAAA-MM-JJ HH:mm:ss (Europe/Paris)`. Incrémenter la version lors d'une évolution substantielle ; une correction purement typographique actualise seulement la date.
- Les ADR portent aussi le statut, la version et la date/heure exacte de décision. Ne jamais inventer ou antidater une date de décision.
- La documentation courante décrit l'état présent et les règles applicables ; les ADR conservent le contexte et la justification historique.
- Toute source externe technique doit être immuable lorsqu'elle est versionnée. Pour une documentation officielle non versionnée, consigner l'URL canonique et la date ou version de vérification.

Consulter l'index du [README](README.md) pour les guides de design, plateforme, données, produit et exploitation.
