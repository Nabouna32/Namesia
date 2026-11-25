# ADR-0050 — Hébergement Next.js sur Cloudflare Workers

- **Statut :** acceptée pour la migration, bascule de production en attente de validation
- **Date :** 2026-11-25
- **Portée :** hébergement, builds et déploiements de Namesia

## Contexte

Namesia est une application Next.js 16 App Router avec rendu serveur, Route Handlers, administration Supabase Auth et PostgreSQL. Le déploiement Vercel est actuellement limité par le quota quotidien ; le dernier HEAD de `main` n'a pas pu être publié à cause d'un refus « Deployment rate limited ».

Le besoin réel est de réduire la dépendance au quota de builds Vercel, tout en conservant un hébergement compatible avec Next.js et un retour arrière simple.

## Challenge

- **Cloudflare Pages en export statique :** incompatible avec les routes serveur, l'administration et les Route Handlers actuels.
- **Workers Builds :** simple à connecter, mais ferait exécuter les builds par Cloudflare au lieu de GitHub Actions ; ce n'est pas le flux recherché.
- **vinext :** voie recommandée par Cloudflare pour les nouvelles applications Next.js, mais le projet est déjà construit sur Next.js et vinext reste en développement actif avec des écarts de compatibilité documentés.
- **OpenNext :** adaptateur qui consomme le build Next.js standard et documente le support d'App Router, SSR, Route Handlers, RSC et des principales fonctionnalités utilisées ici.

## Décision

Préparer une migration réversible vers **Cloudflare Workers Free**, avec **GitHub Actions comme moteur de build et d'orchestration** et **OpenNext for Cloudflare** comme adaptateur initial.

- Le Worker de production s'appelle `namesia` et utilise le sous-domaine `nabouna.workers.dev` du compte Cloudflare.
- Le build est produit dans GitHub Actions avec des versions d'outils explicitement épinglées dans le workflow.
- Les Pull Requests exécutent le build Cloudflare comme contrôle, sans déploiement distant ni exposition du jeton Cloudflare.
- La branche `main` déploie le Worker de production via `opennextjs-cloudflare deploy`, uniquement après fusion d'une PR. Le workflow peut aussi être lancé manuellement sur `main`.
- Les ressources de production ne doivent pas partager de stockage mutable avec des environnements de test. L'application utilise actuellement Supabase ; les droits RLS restent la frontière de sécurité des données.
- Vercel, son domaine public et sa configuration restent inchangés pendant la validation. Aucun DNS ni alias public n'est basculé par cette migration.

## Limites et conditions de validation

Le plan Workers Free impose notamment une limite CPU par invocation et une taille maximale de Worker compressé. Le build seul ne prouve donc pas que l'application peut fonctionner dans ces limites.

Avant toute bascule publique, valider sur l'URL `workers.dev` :
- le rendu SSR et les Route Handlers ;
- l'authentification OTP et les redirections Supabase ;
- les pages de catalogue, fiches, comparateur, sitemap et images Open Graph ;
- le fonctionnement des sessions et cookies ;
- la taille compressée du Worker et le CPU consommé sur les parcours représentatifs.

Les environnements de test ne doivent contenir aucun secret privilégié. L'administration reste protégée par Supabase Auth et RLS.

Aucune clé Supabase privilégiée n'est ajoutée au Worker ou à GitHub Actions. Seuls l'URL publique Supabase et la clé publishable sont nécessaires.

## Conséquences

- Les builds de contrôle et de déploiement Cloudflare sont exécutés par GitHub Actions, sans dépendre de Workers Builds.
- Les quotas Cloudflare d'exécution, de requêtes, de taille de Worker et d'observabilité restent applicables.
- La migration n'est pas considérée terminée tant que le Worker de production n'a pas été validé sur son URL `workers.dev`.
- Le domaine Vercel et son déploiement restent le mécanisme de retour arrière jusqu'à la bascule finale.
- Réexaminer OpenNext au regard de vinext après la première validation de production, sans changer d'adaptateur dans cette migration initiale.

## Sources vérifiées le 25 novembre 2026

- Cloudflare — [OpenNext adapter](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/) : configuration, runtime Node.js et matrice de fonctionnalités.
- OpenNext — [CLI](https://opennext.js.org/cloudflare/cli) : commandes `build`, `preview` locale et `deploy`.
- OpenNext — [Cloudflare Get Started](https://opennext.js.org/cloudflare/get-started) : migration d'une application Next.js existante.
- Cloudflare — [vinext](https://github.com/cloudflare/vinext) : statut et limites de compatibilité.
