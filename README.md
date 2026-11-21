# Namesia

Namesia est une plateforme française de découverte des prénoms : fiches documentées, contenu symbolique clairement contextualisé et outils interactifs pour accompagner la recherche d'un prénom.

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

Le projet Supabase Namesia est configuré dans la région Europe de l'Ouest. Le schéma et les six premières fiches sont versionnés dans `supabase/migrations/`.

Les variables requises sont :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

La clé publishable est conçue pour être exposée au client ; la sécurité des données repose sur les privilèges SQL et les politiques RLS. Ne jamais utiliser une clé `service_role` ou une clé secrète dans le frontend.

### Commandes

- `npm run dev` : serveur de développement ;
- `npm run typecheck` : vérification TypeScript ;
- `npm run build` : build de production ;
- `npm run start` : serveur de production après build.

## Déploiement et quota Vercel

Aucun déploiement Preview n'est autorisé. Vercel ne construit et ne déploie que `main`, après la fusion d'une PR. Les validations des PR, y compris le build de contrôle, sont exécutées par GitHub Actions. Cette règle protège le quota Vercel de 100 builds/déploiements par jour ; voir la politique détaillée dans [AGENTS.md](AGENTS.md).

## Règles éditoriales

Les faits et interprétations symboliques sont séparés. Les affirmations importantes sont atomiques et reliées à des sources. Les hypothèses étymologiques restent identifiées comme telles. Une fiche publiée ne doit pas laisser croire qu'une interprétation symbolique décrit scientifiquement la personnalité d'une personne.

## Règles de contribution

La charte [AGENTS.md](AGENTS.md) s'applique à tout le dépôt, à chaque contribution humaine ou assistée par IA. Elle impose notamment le challenge critique systématique des demandes, propositions, décisions et de l'existant, ainsi que la justification des choix et compromis.

## Documentation canonique

- [Charte de contribution et de challenge](AGENTS.md)
- [Vision produit](docs/vision-produit.md)
- [Architecture cible](docs/architecture.md)
- [Modèle de données](docs/modele-donnees.md)
- [Politique éditoriale et sources](docs/politique-editoriale-et-sources.md)
- [Pipeline de génération IA](docs/pipeline-generation-ia.md)
- [Contrat JSON des fiches](schemas/fiche-prenom.schema.json)
- [Décisions d'architecture](docs/decisions/)
