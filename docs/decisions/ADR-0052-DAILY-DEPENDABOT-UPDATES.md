# ADR-0052 — Propositions Dependabot quotidiennes et revue humaine

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:05:17 (Europe/Paris)
- **Décision prise le :** 2026-11-25 (heure non consignée)

## Contexte

Namesia doit rester au niveau des versions stables les plus récentes compatibles, pour les dépendances de production comme pour les outils de développement, de test, de typage, de build et les Actions GitHub. Les versions bêta, alpha, RC et autres préversions ne sont pas une cible de mise à jour.

## Options examinées

1. **Conserver une cadence hebdomadaire et des groupes** : moins de PR, mais visibilité plus lente et changements agrégés difficiles à arbitrer.
2. **Cadence quotidienne avec groupes** : fraîcheur améliorée, mais plusieurs dépendances peuvent être mélangées dans une même proposition.
3. **Cadence quotidienne, une PR par mise à jour** : visibilité complète et diff isolé, au prix d'un volume de PR potentiellement élevé.

## Décision

Retenir l'option 3 pour les écosystèmes présents dans le dépôt :

- **npm**, à la racine : toutes les dépendances déclarées directement dans les manifestes, y compris `dependencies` et `devDependencies`, sans filtre de type ni de niveau SemVer. Chaque proposition met à jour le lockfile. Dependabot ne crée pas une PR indépendante pour chaque dépendance transitive ; les mises à jour transitives suivent les contraintes de leurs dépendances parentes et le lockfile.
- **GitHub Actions**, à la racine : actions référencées par les workflows de CI, de contrôle et de déploiement. Les références épinglées sur SHA restent soumises à vérification du tag et du commit amont.

Les deux écosystèmes sont vérifiés **tous les jours calendaires à 12 h, fuseau `Europe/Paris`**, avec le calendrier cron `0 12 * * *`. Le choix de cron est intentionnel : l'intervalle Dependabot `daily` ne s'exécute que du lundi au vendredi. Chaque mise à jour est proposée dans une PR distincte : aucun groupe et une limite de PR suffisamment haute pour ne pas réduire artificiellement le flux de propositions (1 000 par écosystème).

Un délai de refroidissement explicite de **7 jours** est appliqué aux mises à jour de version des deux écosystèmes. Il satisfait le contrôle de sécurité `zizmor` du dépôt et donne le temps de détecter une publication compromise. Les mises à jour de sécurité, lorsqu'elles sont activées dans les paramètres GitHub du dépôt, restent traitées par le mécanisme distinct de security updates.

## Versions stables et limites réelles

La politique vise la version stable la plus récente compatible, jamais une préversion choisie volontairement. Dependabot ne met pas à jour Node.js dans `.nvmrc` ou dans le champ `engines` de `package.json` : ces versions de runtime doivent être vérifiées explicitement et alignées entre les deux fichiers, les workflows et l'environnement de production.

L'inspection du lockfile au moment de cette décision a relevé des préversions transitives, notamment :

- `wrangler@4.164.0` déclare `miniflare@5.20261117.0-beta`, qui déclare à son tour `youch@4.1.0-beta.10` ;
- `cloudflare@4.4.1` entraîne `formdata-node@4.4.1`, qui déclare `web-streams-polyfill@4.0.0-beta.3`.

Ces versions ne sont pas des dépendances directes choisies par Namesia : elles sont imposées par les arbres de dépendances amont. Les remplacer artificiellement par une version stable via `overrides` pourrait casser les outils concernés ; aucune substitution non vérifiée n'est donc introduite. Il faut surveiller les mises à jour amont de Wrangler et Cloudflare, puis laisser leurs versions stables remplacer ces préversions lorsqu'elles seront publiées et compatibles. Le contrôle du lockfile doit continuer à signaler leur présence.

## Revue et garde-fous

- Aucune fusion automatique, aucun auto-merge et aucune approbation automatique.
- Chaque PR doit être examinée : notes de version, changements amont, compatibilité, sécurité, lockfile, CI et effets sur la production.
- Pour les Actions GitHub, vérifier le tag officiel et le SHA complet correspondant ; ne jamais accepter un retour à une référence mutable.
- Pour npm, examiner les changements majeurs et les dépendances transitives ; une mise à jour proposée n'est pas une preuve de compatibilité.
- Les PR Dependabot peuvent coexister pour rendre toutes les propositions consultables. Elles constituent l'exception explicite à la règle d'une seule PR de travail humaine ouverte à la fois.
- Une PR rouge ou non comprise reste ouverte ou est fermée avec une raison ; aucune proposition n'est fusionnée automatiquement.

## Conséquences

La revue quotidienne peut présenter un nombre important de PR, notamment lors du rattrapage initial. C'est intentionnel : chaque mise à jour reste isolée et visible. La fraîcheur est recherchée sans sacrifier la stabilité : versions stables les plus récentes compatibles, délai de refroidissement, vérification amont et CI obligatoire.
