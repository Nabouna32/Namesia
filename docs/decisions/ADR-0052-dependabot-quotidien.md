# ADR-0052 — Propositions Dependabot quotidiennes et revue humaine

- **Statut :** accepté
- **Date :** 2026-11-25

## Contexte

Les mises à jour de dépendances doivent être visibles et proposées régulièrement, y compris celles qui ne participent pas directement au code livré : dépendances de développement, outils de test, lint, typage, build et actions GitHub utilisées par la CI et le déploiement. Une cadence hebdomadaire, des groupes de mises à jour et une période de refroidissement retardent ou masquent certaines propositions et ne permettent pas d'examiner chaque changement indépendamment.

## Options examinées

1. **Conserver la cadence hebdomadaire et les groupes** : moins de PR, mais visibilité plus lente et changements agrégés difficiles à arbitrer.
2. **Cadence quotidienne avec groupes** : fraîcheur améliorée, mais plusieurs dépendances peuvent être mélangées dans une même proposition.
3. **Cadence quotidienne, une PR par mise à jour** : visibilité complète et diff isolé, au prix d'un volume de PR potentiellement élevé.

## Décision

Retenir l'option 3 pour les écosystèmes présents dans le dépôt :

- **npm**, à la racine : dépendances directes et transitives, de production comme de développement. Dependabot suit les manifestes et le fichier de verrouillage ; les dépendances de développement ne sont pas exclues.
- **GitHub Actions**, à la racine : actions référencées par les workflows de CI, de contrôle et de déploiement.

Les deux écosystèmes sont vérifiés **tous les jours calendaires à 12 h, fuseau `Europe/Paris`**, avec le calendrier cron `0 12 * * *`. Le choix de cron est intentionnel : l'intervalle Dependabot `daily` ne s'exécute que du lundi au vendredi. Chaque mise à jour est proposée dans une PR distincte : aucun groupe, aucune période de refroidissement et une limite de PR suffisamment haute pour ne pas réduire artificiellement le flux de propositions (1 000 par écosystème).

Les mises à jour de sécurité Dependabot restent également activables par les mécanismes de sécurité GitHub et ne sont pas retardées par la cadence planifiée.

## Revue et garde-fous

- Aucune fusion automatique, aucun auto-merge et aucune approbation automatique.
- Chaque PR doit être examinée avant fusion : notes de version, changements amont, compatibilité, risques de sécurité, lockfile, CI et effets sur la production.
- Pour les actions GitHub, vérifier le tag officiel et le SHA complet correspondant avant toute fusion ; ne jamais accepter un retour à une référence mutable.
- Pour npm, examiner les changements majeurs et les dépendances transitives, puis s'appuyer sur la CI du dépôt.
- Les PR Dependabot peuvent coexister pour rendre toutes les propositions consultables. Elles constituent l'exception explicite à la règle d'une seule PR de travail humaine ouverte à la fois.
- Une PR rouge ou non comprise reste ouverte ou est fermée avec une raison ; la présence d'une proposition n'est pas une autorisation de la fusionner.

## Conséquences

La revue quotidienne peut présenter un nombre important de PR, notamment lors du rattrapage initial. C'est intentionnel : le propriétaire choisit avec l'agent lesquelles fusionner. Le coût de cette visibilité est une file de revue plus volumineuse ; elle peut être réduite ultérieurement par une décision explicite de regroupement, de filtrage ou de cadence, sans désactiver le suivi des dépendances de développement et de CI.
