# Exploitation de Dependabot

- **Version :** 1.1
- **Mis à jour le :** 2026-11-27 20:07:03 (Europe/Paris)

## Périmètre

Ce guide décrit le comportement configuré dans [`.github/dependabot.yml`](../../.github/dependabot.yml). Le fichier YAML reste la source de vérité des paramètres exécutés.

## Écosystèmes suivis

Deux écosystèmes sont surveillés à la racine du dépôt :
- `npm` pour les dépendances du projet ;
- `github-actions` pour les actions utilisées par les workflows.

## Planification et regroupement

Les deux écosystèmes sont vérifiés chaque jour calendaire à 12 h, fuseau `Europe/Paris`, via une planification cron. Le choix de cron évite la limite de la fréquence `daily`, qui ne s'exécute que du lundi au vendredi. Un délai de refroidissement de sept jours (`cooldown.default-days: 7`) est appliqué aux mises à jour de version. Les mises à jour de sécurité, lorsqu'elles sont activées dans les paramètres GitHub du dépôt, restent traitées par le mécanisme distinct de security updates.

La configuration ne regroupe pas les mises à jour en une seule PR : chaque mise à jour dans une PR distincte est proposée et reste isolée.

## Limite de PR ouvertes

La limite configurée est de 1 000 PR ouvertes par écosystème. Cette valeur est volontairement très haute et ne constitue pas un mécanisme de maîtrise du flux. Si le volume devient gênant, réévaluer cette limite plutôt que d'ajouter un traitement automatique.

## Revue et fusion

- Les PR Dependabot sont indépendantes des PR de travail humaines ; elles constituent l'exception documentée à la règle d'une seule PR de travail ouverte.
- Aucune fusion automatique n'est configurée ni autorisée par ce guide.
- Examiner le changelog et les notes de version, les changements de comportement, les ruptures potentielles et les avis de sécurité.
- Vérifier les SHA épinglés pour les actions GitHub et relire le code amont avant toute mise à jour.
- Laisser GitHub Actions exécuter les contrôles applicables. Les PR Dependabot ne reçoivent pas les secrets Cloudflare et ne créent pas de Preview.
- Fusionner manuellement uniquement après revue et succès des contrôles requis.

## Diagnostic

Vérifier la configuration dans `.github/dependabot.yml`, puis consulter l'historique des PR Dependabot et les runs GitHub Actions associés. Une PR en attente ne doit pas être fusionnée uniquement parce qu'elle est générée par Dependabot.

## Évolution de la configuration

Toute modification de calendrier, écosystème, cooldown ou limite doit être expliquée dans la PR et ce document doit être actualisé dans la même PR.
