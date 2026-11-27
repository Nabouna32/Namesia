# Cloudflare Workers — Hébergement et déploiement

- **Version :** 1.0
- **Mis à jour le :** 2026-11-27 20:00:48 (Europe/Paris)

## Source de vérité

La configuration du Worker est dans [`wrangler.jsonc`](../../wrangler.jsonc) et les workflows de livraison dans [`cloudflare.yml`](../../.github/workflows/cloudflare.yml). Cloudflare Workers est l'unique hébergement de production actuel ; OpenNext construit l'application Next.js pour le runtime Workers.

## Worker de production

- Nom du Worker : `namesia`.
- Entrée : `.open-next/worker.js`.
- Assets : `.open-next/assets`, binding `ASSETS`.
- Compatibilité : `nodejs_compat`, date déclarée dans `wrangler.jsonc`.
- `workers_dev` est activé.
- L'observabilité Cloudflare est activée.
- La variable de runtime `NAMESIA_DEPLOYMENT_ENVIRONMENT` distingue la production des previews.

Les valeurs précises restent définies par `wrangler.jsonc`, pas par ce résumé.

## Environnements Preview

Les PR internes peuvent créer un Worker nommé `pr-<numéro>`. Les previews utilisent le même code de base, mais la variable `NAMESIA_DEPLOYMENT_ENVIRONMENT` vaut `preview`.

Conditions actuelles :
- PR issue du dépôt Namesia ;
- auteur différent de `dependabot[bot]` ;
- variable GitHub `CLOUDFLARE_DEPLOY_ENABLED` égale à `true` ;
- secrets Cloudflare disponibles dans le contexte autorisé.

Les Previews sont accessibles sur `workers.dev`, mais doivent être marquées `noindex`. Elles ne doivent pas utiliser de session de production, exposer l'administration ni contenir de données privées. La fermeture de la PR déclenche leur nettoyage.

## Production

Le déploiement est réalisé par GitHub Actions après un push sur `main`, ou par lancement manuel du workflow ciblant `main`, lorsque `CLOUDFLARE_DEPLOY_ENABLED` vaut `true`.

Aucun déploiement de production local n'est autorisé par le processus du dépôt. Une fusion sur `main` déclenche le workflow ; vérifier le résultat du déploiement et les contrôles HTTP post-déploiement avant d'annoncer la mise en production.

## Secrets et variables

Les secrets `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID` sont consommés par GitHub Actions. Le contrôle `CLOUDFLARE_DEPLOY_ENABLED` est une variable de dépôt. Ne jamais copier leurs valeurs dans le code ou la documentation.

L'origine publique est définie par `NEXT_PUBLIC_SITE_URL` (variable GitHub, avec une origine workers.dev par défaut dans le workflow). Voir [`ENVIRONMENTS-AND-SECRETS.md`](ENVIRONMENTS-AND-SECRETS.md).

## Retour arrière et incident

En cas d'échec :
1. consulter le run GitHub Actions, ses jobs et ses logs ;
2. vérifier si le Worker précédent est toujours disponible ;
3. corriger la cause dans une PR ;
4. utiliser les mécanismes de déploiement/versions Cloudflare uniquement si une restauration est nécessaire et autorisée par les procédures du compte ;
5. vérifier les routes publiques, le catalogue, une fiche, robots/sitemap et les frontières d'administration.

Ne pas prétendre qu'un rollback a eu lieu sans confirmation Cloudflare.
