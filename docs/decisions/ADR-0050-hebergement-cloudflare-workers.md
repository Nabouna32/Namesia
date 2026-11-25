# ADR-0050 — Hébergement Next.js sur Cloudflare Workers

- **Statut :** production déployée ; validation fonctionnelle complète en cours
- **Date :** 2026-11-25
- **Portée :** hébergement, builds, déploiements et previews de Namesia

## Contexte

Namesia est une application Next.js 16 App Router avec rendu serveur, Route Handlers, administration Supabase Auth et PostgreSQL. Le déploiement Vercel est actuellement limité par le quota quotidien ; le dernier HEAD de `main` n'a pas pu être publié à cause d'un refus « Deployment rate limited ».

Le besoin réel est de réduire la dépendance au quota de builds Vercel, tout en conservant un hébergement compatible avec Next.js et un retour arrière simple.

## Challenge

- **Cloudflare Pages en export statique :** incompatible avec les routes serveur, l'administration et les Route Handlers actuels.
- **Workers Builds :** simple à connecter, mais ferait exécuter les builds par Cloudflare au lieu de GitHub Actions ; ce n'est pas le flux recherché.
- **vinext :** voie recommandée par Cloudflare pour les nouvelles applications Next.js, mais le projet est déjà construit sur Next.js et vinext reste en développement actif avec des écarts de compatibilité documentés.
- **OpenNext :** adaptateur qui consomme le build Next.js standard et documente le support d'App Router, SSR, Route Handlers, RSC et des principales fonctionnalités utilisées ici.

## Décision

Utiliser **Cloudflare Workers Free**, avec **GitHub Actions comme moteur de build et d'orchestration** et **OpenNext for Cloudflare** comme adaptateur.

- Le Worker de production s'appelle `namesia` et utilise le sous-domaine `nabouna.workers.dev` du compte Cloudflare.
- Le build est produit dans GitHub Actions avec des versions d'outils explicitement épinglées dans les workflows.
- La branche `main` déploie le Worker de production via `opennextjs-cloudflare deploy`, uniquement après fusion d'une PR. Le workflow peut aussi être lancé manuellement sur `main`.
- Les Pull Requests internes créent ou mettent à jour une **Workers Preview** nommée `pr-<numéro>` via `wrangler preview`. Le workflow `.github/workflows/cloudflare.yml` commente l'URL dans la PR, vérifie le HTML, le catalogue public et l'en-tête `X-Robots-Tag: noindex`, puis supprime la Preview à la fermeture de la PR.
- Les secrets Cloudflare ne sont jamais exposés aux PR provenant de forks : seuls les événements dont le dépôt source est le dépôt courant peuvent créer ou supprimer une Preview.
- Les previews sont publiques par défaut sur `workers.dev`. Elles ne contiennent que le catalogue public ; leur URL reçoit le signal `noindex` de Cloudflare.
- Le bloc Wrangler `previews` définit explicitement `NAMESIA_DEPLOYMENT_ENVIRONMENT=preview`, distinct de `production`. La page d'administration n'affiche pas son client d'authentification et toutes les routes d'administration refusent les requêtes en Preview. Aucune clé privilégiée Supabase n'est fournie.
- Les fichiers lus à l'exécution via `node:fs` doivent être inclus explicitement dans le système de fichiers virtuel du Worker. Wrangler utilise `find_additional_modules`, une règle `Text` et `preserve_file_names` pour embarquer la police Open Graph à son chemin attendu ; les fichiers non importés ne sont pas présents automatiquement dans `/bundle`.
- Les previews utilisent les lectures publiques du projet Supabase de production ; elles n'ont aucun chemin d'écriture applicatif disponible. Toute activation future de l'administration dans un environnement de test exige un projet Supabase de staging distinct et des secrets propres à cet environnement.
- Aucun binding mutable de production n'est déclaré dans le bloc `previews`. Toute nouvelle ressource liée doit être explicitement évaluée et isolée.
- Vercel, son domaine public et sa configuration restent inchangés pendant la validation. Aucun DNS ni alias public n'est basculé par cette migration.

## Limites et conditions de validation

Le plan Workers Free impose notamment une limite CPU par invocation et une taille maximale de Worker compressé. Le build seul ne prouve donc pas que l'application peut fonctionner dans ces limites.

Les images Open Graph des fiches référencent explicitement l'image statique commune. Le rendu Satori dynamique par fiche a été retiré après des annulations HTTP 500 sur le Worker ; les métadonnées textuelles restent personnalisées.

Avant toute bascule publique, valider sur l'URL `workers.dev` :
- le rendu SSR du catalogue et d'une fiche, l'API de comparaison et les Route Handlers ;
- les réponses `401` des routes d'administration sans jeton ;
- robots.txt, sitemap et l'image Open Graph statique commune, référencée par les fiches dont le titre et la description restent spécifiques ;
- l'API Supabase Auth et le fournisseur e-mail activé (contrôle automatique) ;
- l'envoi et le clic réels d'un OTP, l'URL de redirection autorisée et la session locale (contrôle manuel sur le domaine final) ;
- la taille compressée du Worker et le CPU consommé sur les parcours représentatifs.

Les environnements de test ne doivent contenir aucun secret privilégié. L'administration reste protégée par Supabase Auth et RLS en production et est entièrement désactivée dans les Previews.

Aucune clé Supabase privilégiée n'est ajoutée au Worker ou à GitHub Actions. Seuls l'URL publique Supabase et la clé publishable sont nécessaires aux lectures du catalogue.

## Conséquences

- Les builds de contrôle, de Preview et de production Cloudflare sont exécutés par GitHub Actions, sans dépendre de Workers Builds.
- Les PR internes disposent d'une URL stable de Preview et d'une URL de déploiement propre à chaque mise à jour.
- Les previews ouvertes peuvent être consultées publiquement ; leur suppression automatique évite de conserver les environnements de PR fermées.
- Les quotas Cloudflare d'exécution, de requêtes, de taille de Worker et d'observabilité restent applicables.
- La migration n'est pas considérée terminée tant que le contrôle HTTP post-déploiement du Worker et les parcours SSR, Route Handlers, authentification OTP, cookies, catalogue, sitemap et images Open Graph n'ont pas été validés sur son URL `workers.dev`.
- Le domaine Vercel et son déploiement restent le mécanisme de retour arrière jusqu'à la bascule finale.
- Réexaminer OpenNext au regard de vinext après la première validation de production, sans changer d'adaptateur dans cette migration initiale.

## Sources vérifiées le 25 novembre 2026

- Cloudflare — [Workers Previews](https://developers.cloudflare.com/workers/previews/) : cycle de vie, URLs, isolation et limites.
- Cloudflare — [Previews configuration](https://developers.cloudflare.com/workers/previews/configuration/) : variables, secrets et bindings dédiés.
- Cloudflare — [GitHub Actions examples](https://developers.cloudflare.com/workers/previews/examples/) : création, commentaire, probe et suppression des Previews.
- Cloudflare — [Compare workflows](https://developers.cloudflare.com/workers/previews/compare-workflows/) : différence entre Previews, Version URLs et environnements Wrangler.
- Cloudflare — [OpenNext adapter](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/) : configuration et matrice de fonctionnalités.
- Cloudflare — [Wrangler bundling](https://developers.cloudflare.com/workers/wrangler/bundling/) et [Node.js fs](https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/) : inclusion des modules additionnels dans le système de fichiers virtuel du Worker.
- OpenNext — [CLI](https://opennext.js.org/cloudflare/cli) : commandes `build`, `preview` locale et `deploy`.
- OpenNext — [Cloudflare Get Started](https://opennext.js.org/cloudflare/get-started) : migration d'une application Next.js existante.
- Cloudflare — [vinext](https://github.com/cloudflare/vinext) : statut et limites de compatibilité.
