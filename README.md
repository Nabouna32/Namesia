# Namesia

Namesia est une plateforme française de découverte des prénoms. Les fiches sont générées à l'aide d'une IA, importées en JSON puis publiées depuis une administration privée. Les contenus peuvent comporter des erreurs ; Namesia ne promet pas de vérification documentaire.

## Application web

Le site utilise Next.js App Router, React, TypeScript et Supabase (PostgreSQL).

### Démarrage local

Prérequis : Node.js 26 LTS (26.x).

```bash
cp .env.example .env.local
npm install
npm run dev
```

Ouvrir ensuite http://localhost:3000.

### Configuration Supabase

Le projet Supabase Namesia est configuré dans la région Europe de l'Ouest. Les migrations et les six fiches initiales sont versionnées dans supabase/migrations/.

Variables requises :

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

La clé publishable peut être exposée au navigateur. La sécurité repose sur les privilèges SQL, RLS et l'autorisation administrateur. Aucune clé service_role ou clé secrète ne doit être intégrée au site.

### Schéma de production

Le schéma relationnel cible est préparé en production. La migration additive `20261122001208_preparer_modele_relationnel.sql` a repris les données éditoriales et les associations tout en conservant temporairement l'ancien modèle pour la compatibilité avec l'application actuellement déployée.

La migration destructive `20261122140000_finaliser_nettoyage_modele.sql` sera appliquée après le déploiement et la vérification de l'application relationnelle. Elle supprime les anciennes tables documentaires, l'ancien stockage JSONB et les colonnes redondantes. Une sauvegarde reste la pratique recommandée avant toute suppression définitive de données.
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

## Déploiement et quota Vercel

Aucun déploiement Preview n'est autorisé. Vercel ne construit et ne déploie que main, après la fusion d'une PR. Les validations des PR, y compris le build de contrôle, sont exécutées par GitHub Actions. Cette règle protège le quota Vercel de 100 builds/déploiements par jour ; voir la politique détaillée dans AGENTS.md.

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
