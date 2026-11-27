# Environnements et secrets

- **Version :** 1.0
- **Mis à jour le :** 2026-11-27 20:00:48 (Europe/Paris)

## Principe

Les environnements de développement, Preview et production doivent être distingués. Les valeurs publiques de configuration peuvent être présentes dans le navigateur ; les secrets privilégiés restent dans les paramètres sécurisés de GitHub Actions ou du fournisseur concerné.

## Variables publiques

Les variables suivantes sont publiques par conception et ne doivent jamais contenir de secret :
- `NEXT_PUBLIC_SUPABASE_URL` : origine du projet Supabase ;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` : clé publishable Supabase ;
- `NEXT_PUBLIC_SITE_URL` : origine canonique du site.

Le fichier [`.env.example`](../../.env.example) fournit les noms et valeurs de configuration publique de référence pour le développement et les workflows. Le code valide la configuration Supabase dans `lib/supabase/config.ts`.

## Secrets GitHub Actions

Les secrets Cloudflare utilisés par le workflow sont :
- `CLOUDFLARE_API_TOKEN` ;
- `CLOUDFLARE_ACCOUNT_ID`.

La variable `CLOUDFLARE_DEPLOY_ENABLED` active ou désactive les opérations de déploiement et de Preview. Elle n'est pas un secret.

Ne jamais :
- committer un secret dans Git ;
- afficher une valeur de secret dans un log, une issue ou une PR ;
- copier une clé privilégiée dans un fichier `NEXT_PUBLIC_*` ;
- transmettre des secrets Cloudflare à un fork ou à une PR Dependabot.

## Séparation des environnements

- Le build CI utilise la configuration publique déclarée dans le workflow.
- Les Previews Cloudflare sont isolées par PR et doivent rester sans sessions ni données privées de production.
- Le Worker distingue le contexte Preview et production via `NAMESIA_DEPLOYMENT_ENVIRONMENT`.
- Les opérations de compte et d'administration sont désactivées dans les Previews.
- Les paramètres Supabase Auth et les clés privilégiées sont gérés dans le Dashboard Supabase, jamais déduits d'un fichier du dépôt.

## Rotation et incident

En cas d'exposition suspectée :
1. identifier le secret concerné et les systèmes qui l'utilisent ;
2. révoquer ou faire tourner le secret depuis le fournisseur ;
3. mettre à jour le secret dans GitHub Actions ou le gestionnaire approprié ;
4. vérifier les runs et services concernés ;
5. documenter l'incident sans publier la valeur compromise.

La rotation d'un secret n'autorise pas à afficher son ancienne ou sa nouvelle valeur dans le suivi public.
