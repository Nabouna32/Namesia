# Namesia

Namesia est une plateforme française de découverte des prénoms. Les fiches sont générées à l'aide d'une IA, importées en JSON puis publiées depuis une administration privée. Les contenus peuvent comporter des erreurs ; Namesia ne promet pas de vérification documentaire.

## Application web

Le site utilise Next.js App Router, React, TypeScript et Supabase (PostgreSQL). L'interface suit Material 3 Fidelity pour le thème général et utilise une palette Material 3 Rainbow pour les catégories éditoriales. Les deux schémas sont calculés par `@material/material-color-utilities`. La navigation est basse sur téléphone et latérale (rail de 80 px) sur tablette et écrans larges. La source de génération Fidelity/Rainbow est le bleu Google `#0B57D0` (`baseline_primary_600` de Chromium Android), choisi explicitement pour Namesia ; Rainbow reste réservé aux catégories éditoriales. Les aperçus Open Graph consomment les rôles Fidelity clairs, sans palette ni dégradé parallèle.

### Démarrage local

Prérequis : Node.js 26.13.1 (branche 26.x). La version exacte est définie dans `.nvmrc`, la compatibilité de la branche dans `package.json` et `.npmrc` fait refuser les versions de Node incompatibles. npm est celui fourni avec l'installation Node.js.

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Ouvrir ensuite http://localhost:3000.

### Configuration Supabase

Le projet Supabase Namesia est configuré dans la région Europe de l'Ouest. Les migrations et les six fiches initiales sont versionnées dans supabase/migrations/.

Variables d'environnement :

- `NEXT_PUBLIC_SUPABASE_URL` (requise)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (requise)
- `NEXT_PUBLIC_SITE_URL` (requise, origine canonique HTTPS du site en production)

La clé publishable peut être exposée au navigateur. La sécurité repose sur les privilèges SQL, RLS et l'autorisation administrateur. Aucune clé service_role ou clé secrète ne doit être intégrée au site.

### Schéma de production

Le stockage est relationnel : `names` porte l'identité stable, `name_profiles` les versions éditoriales et leurs rubriques en colonnes dédiées, et `name_profile_associations` les associations symboliques répétables. Le JSON n'est qu'un format d'import : ses champs sont validés puis répartis dans les colonnes et lignes relationnelles au cours d'une transaction SQL.

Les anciennes tables documentaires, l'ancien stockage JSONB et les colonnes redondantes ont été supprimés. Les règles RLS et les privilèges SQL limitent la lecture publique aux fiches publiées et réservent les écritures aux administrateurs autorisés.

### Administration

L'administration est disponible sur `/admin`. L'accès utilise Supabase Auth par lien e-mail et la liste privée `private.admin_users`. Le compte propriétaire initial est déjà autorisé en production. L'auto-inscription reste désactivée.

Tout nouveau compte doit être invité dans Supabase Auth puis ajouté explicitement à la liste d'autorisation. Un compte Auth non autorisé ne dispose d'aucun droit d'administration.

### Contrat JSON

Le contrat courant est `schemas/fiche-prenom.schema.json`, version 2.0.0. Il est uniquement utilisé à l'import ; la base stocke les rubriques dans des colonnes SQL et les associations dans des lignes dédiées. Il comprend :

- identity : slug, nom affiché et genre ;
- content : introduction, origine, histoire, usages et tableau `symbolic_associations` obligatoire (vide si aucune association ne s’applique).

Le JSON ne contient ni identifiant de base, ni numéro de version, ni statut de publication. Ces valeurs sont attribuées par le backend. La validation vérifie la structure, pas la véracité des contenus.

### Commandes

- `npm run dev` : serveur de développement ;
- `npm run typecheck` : vérification TypeScript ;
- `npm run build` : build de production ;
- `npm run start` : serveur de production après build.

## Référencement public

Le site publie un sitemap dynamique limité aux fiches effectivement publiées, ainsi qu'un fichier robots.txt qui exclut l'administration et les routes API. `NEXT_PUBLIC_SITE_URL` définit l'origine canonique ; renseigner le domaine public réellement utilisé avant l'ouverture à l'indexation. L'origine canonique de production est actuellement `https://namesia.nabouna.workers.dev`. Le domaine personnalisé sera défini explicitement avant toute bascule DNS ; l'authentification et les règles RLS restent indépendantes de l'hébergeur.

## Déploiement

Cloudflare Workers est l'hébergement de production : GitHub Actions construit l'application avec OpenNext, déploie le Worker `namesia`, puis vérifie sa disponibilité HTTP. Le workflow qualité contrôle séparément les tests, les types et le build Next.js.

Les PR internes disposent d'une Workers Preview Cloudflare dédiée (`pr-<numéro>`). L'URL est publiée dans la conversation de la PR ; le workflow vérifie le rendu HTML, le catalogue public et l'en-tête `noindex`, puis exécute quelques contrôles Playwright ciblés sur les parcours publics, le responsive et les composants concernés. axe-core fournit un diagnostic consultatif. Playwright ne publie et ne conserve aucun artefact : ni capture d'écran, ni vidéo, ni trace, ni rapport, même en cas d'échec. Les fichiers temporaires disparaissent avec le runner GitHub Actions. Les vérifications visuelles sont ponctuelles et leurs assertions de diagnostic sont supprimées après validation ; les tests permanents restent limités aux parcours fonctionnels et aux comportements responsive stables. La Preview est supprimée lorsque la PR est fermée. Les PR provenant de forks ne reçoivent jamais le jeton Cloudflare. Les previews utilisent uniquement les lectures publiques du catalogue ; l'interface et les routes d'administration y sont désactivées. Elles sont publiques sur `workers.dev`, mais Cloudflare ajoute `X-Robots-Tag: noindex`.


## Règles éditoriales

Les contenus sont générés par IA et peuvent comporter des erreurs. L'enregistrement, la validation JSON ou la publication ne constituent pas une vérification factuelle. Ne pas inventer de références ni présenter les associations symboliques comme des propriétés scientifiques ou prédictives.

## Règles de contribution

La charte `AGENTS.md` s'applique à tout le dépôt, à chaque contribution humaine ou assistée par IA. Elle impose notamment le challenge critique systématique des demandes, propositions, décisions et de l'existant.

## Documentation canonique

- Charte de contribution et de challenge : `AGENTS.md`
- Standards techniques et règles de maintenabilité : `docs/standards-techniques.md`
- Vision produit : `docs/vision-produit.md`
- Architecture : `docs/architecture.md`
- Modèle de données : `docs/modele-donnees.md`
- Principes éditoriaux et transparence IA : `docs/politique-editoriale.md`
- Production et import des fiches : `docs/pipeline-generation-ia.md`
- Contrat JSON des fiches : `schemas/fiche-prenom.schema.json`
- Décisions d'architecture : `docs/decisions/`
