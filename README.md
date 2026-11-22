# Namesia

Namesia est une plateforme française de découverte des prénoms. Les fiches sont générées à l'aide d'une IA, importées en JSON puis publiées depuis une administration privée. Les contenus peuvent comporter des erreurs ; Namesia ne promet pas de vérification documentaire.

## Application web

Le site utilise Next.js App Router, React, TypeScript et Supabase (PostgreSQL).

### Démarrage local

Prérequis : Node.js 24.22.3 exactement. La version de référence est définie dans `.nvmrc` ; npm refuse les versions de Node incompatibles grâce à `.npmrc`.

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
- `NEXT_PUBLIC_SITE_URL` (optionnelle, origine canonique du site ; défaut : `https://namesia.vercel.app`)

La clé publishable peut être exposée au navigateur. La sécurité repose sur les privilèges SQL, RLS et l'autorisation administrateur. Aucune clé service_role ou clé secrète ne doit être intégrée au site.

### Schéma de production

Le stockage est relationnel et repose sur trois tables métier : `names` pour l'identité stable, `name_profiles` pour les versions éditoriales et `name_profile_associations` pour les associations symboliques répétables. Le JSON n'est qu'un format d'import : ses champs sont validés puis répartis dans les colonnes et lignes relationnelles au cours d'une transaction SQL.

Les anciennes tables documentaires, l'ancien stockage JSONB et les colonnes redondantes ont été supprimés. Les règles RLS et les privilèges SQL limitent la lecture publique aux fiches publiées et réservent les écritures aux administrateurs autorisés.
### Administration

L'administration est disponible sur `/admin`. L'accès utilise Supabase Auth par lien e-mail et la liste privée `private.admin_users`. Le compte propriétaire initial est déjà autorisé en production. L'auto-inscription reste désactivée.

Tout nouveau compte doit être invité dans Supabase Auth puis ajouté explicitement à la liste d'autorisation. Un compte Auth non autorisé ne dispose d'aucun droit d'administration.

### Contrat JSON

Le contrat courant est schemas/fiche-prenom.schema.json, version 2.0.0. Il est uniquement utilisé à l'import ; la base stocke les rubriques dans des colonnes SQL et les associations dans des lignes dédiées. Il comprend :

- identity : slug, nom affiché et genre ;
- content : introduction, origine, histoire, usages et associations symboliques facultatives.

Le JSON ne contient ni identifiant de base, ni numéro de version, ni statut de publication. Ces valeurs sont attribuées par le backend. La validation vérifie la structure, pas la véracité des contenus.

### Commandes

- npm run dev : serveur de développement ;
- npm run typecheck : vérification TypeScript ;
- npm run build : build de production ;
- npm run start : serveur de production après build.

## Référencement public

Le site publie un sitemap dynamique limité aux fiches effectivement publiées, ainsi qu'un fichier robots.txt qui exclut l'administration et les routes API. `NEXT_PUBLIC_SITE_URL` définit l'origine canonique ; renseigner le domaine public réellement utilisé avant l'ouverture à l'indexation. Le domaine Vercel par défaut est actuellement protégé par SSO : ces routes ne rendent pas le site public et ne remplacent jamais l'authentification ni les règles RLS.

## Déploiement et quota Vercel

Les déploiements Preview sont désactivés dans les paramètres du projet Vercel. `vercel.json` appelle `scripts/vercel-ignore-build.sh`, qui autorise uniquement une production issue de `main`. Les validations des PR, y compris le build de contrôle et le test de cette politique, sont exécutées par GitHub Actions. Cette règle protège le quota Vercel de 100 builds/déploiements par jour ; voir la politique détaillée dans AGENTS.md.

## Règles éditoriales

Les contenus sont générés par IA et peuvent comporter des erreurs. L'enregistrement, la validation JSON ou la publication ne constituent pas une vérification factuelle. Ne pas inventer de références ni présenter les associations symboliques comme des propriétés scientifiques ou prédictives.

## Règles de contribution

La charte AGENTS.md s'applique à tout le dépôt, à chaque contribution humaine ou assistée par IA. Elle impose notamment le challenge critique systématique des demandes, propositions, décisions et de l'existant.

## Documentation canonique

- Charte de contribution et de challenge : AGENTS.md
- Standards techniques et règles de maintenabilité : docs/standards-techniques.md
- Vision produit : docs/vision-produit.md
- Architecture : docs/architecture.md
- Modèle de données : docs/modele-donnees.md
- Principes éditoriaux et transparence IA : docs/politique-editoriale.md
- Production et import des fiches : docs/pipeline-generation-ia.md
- Contrat JSON des fiches : schemas/fiche-prenom.schema.json
- Décisions d'architecture : docs/decisions/
