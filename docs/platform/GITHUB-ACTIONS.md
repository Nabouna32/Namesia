# GitHub Actions — CI et automatisation

- **Version :** 1.1
- **Mis à jour le :** 2026-11-27 20:26:08 (Europe/Paris)

## Sources de vérité

Les workflows exécutés sont dans [`.github/workflows/`](../../.github/workflows/). Ce guide décrit leur rôle ; leurs fichiers YAML font autorité pour les déclencheurs, permissions, conditions et commandes.

## Workflows actuels

### Vérifications — `ci.yml`

Déclencheurs : chaque PR et chaque push sur `main`.

Le job `quality` :
1. récupère le dépôt sans conserver les identifiants Git ;
2. installe la version Node définie dans `.nvmrc` et les dépendances via `npm ci` ;
3. exécute l'audit bloquant des dépendances de production (`npm audit --omit=dev --audit-level=high`) ;
4. exécute un audit complet du graphe à titre diagnostique non bloquant ;
5. vérifie les sources Material 3 épinglées ;
6. exécute les tests, le contrôle TypeScript et le build ;
7. publie une synthèse distincte des résultats.

Les tests, types et build sont exécutés même si l'un des contrôles précédents échoue afin de diagnostiquer les causes indépendantes. La synthèse échoue si l'audit de production, les tests, les types ou le build échouent. Un diagnostic de dépendances de développement seul ne bloque pas le job.

### Déploiement Cloudflare — `cloudflare.yml`

Déclencheurs : PR ouvertes, synchronisées, réouvertes, labellisées ou fermées ; push sur `main` ; lancement manuel.

- Les PR internes peuvent obtenir une Preview Cloudflare si le dépôt source est le dépôt Namesia, si l'auteur n'est pas Dependabot et si `CLOUDFLARE_DEPLOY_ENABLED` vaut `true`.
- Les PR de forks et Dependabot ne reçoivent pas les secrets Cloudflare et ne créent pas de Preview.
- La Preview est contrôlée par HTTP et Playwright sur des parcours publics ; elle doit rester sans données privées et porter `X-Robots-Tag: noindex`.
- Le job publie l'URL de Preview dans la conversation de la PR.

Sur les Previews et après le déploiement de production, le workflow extrait la balise `og:image` du HTML de la fiche avec `scripts/verify-open-graph.mjs`. Le script exige une URL HTTPS absolue de même origine ; le workflow récupère ensuite cette URL et vérifie le type MIME `image/png`. Ce contrôle valide la ressource réellement annoncée par la page plutôt que de rechercher un nom de route codé en dur.
- La fermeture d'une PR déclenche le nettoyage de sa Preview.
- Seul un push sur `main` ou un lancement manuel ciblant `main`, avec le déploiement activé, peut déployer la production.

Les captures, vidéos et traces Playwright ne sont pas publiées systématiquement. Le diagnostic visuel ponctuel utilise le label `diagnostic-playwright` et un artefact temporaire à rétention d'un jour.

### Sécurité des workflows — `workflow-security.yml`

Déclencheurs : PR ou push sur `main` touchant `.github/workflows/**` ou `.github/dependabot.yml`, ainsi que lancement manuel.

Le job utilise actionlint (avec ShellCheck) et zizmor pour auditer les workflows et la configuration Dependabot.

## Sécurité des workflows

- Les actions tierces sont épinglées sur un SHA complet ; le tag lisible reste en commentaire.
- Les workflows appliquent le moindre privilège via les permissions déclarées.
- `persist-credentials: false` est utilisé sur le checkout lorsqu'aucune écriture Git n'est nécessaire.
- Les secrets ne sont pas exposés aux forks ni aux PR Dependabot.
- Ne jamais afficher, copier dans une issue ou documenter la valeur d'un secret.

## Procédure de diagnostic

1. Identifier le workflow, le SHA exact et l'événement déclencheur.
2. Lire le résumé puis les jobs et les logs de chaque job en échec.
3. Distinguer une régression de code, un contrat de test devenu obsolète, une panne externe et une erreur de configuration.
4. Corriger la cause et attendre un run complet sur le nouveau SHA.
5. Ne jamais déclarer une vérification réussie avant la conclusion GitHub Actions correspondante.

## Règles de livraison

- Une seule PR de travail humaine ouverte à la fois ; les PR Dependabot indépendantes sont l'exception.
- Ne pas fusionner tant qu'un contrôle requis est en cours, en attente ou en échec.
- Si la CI de `main` est rouge, la corriger avant un nouveau chantier.
- Seule `main` déploie la production ; aucune commande de build, test ou déploiement local ne remplace la CI.
