# Namesia

- **Version :** 2.2
- **Mis à jour le :** 2026-11-27 20:09:24 (Europe/Paris)

Namesia est un catalogue de fiches de prénoms. Le dépôt contient l'application web, les contrats de données, les règles éditoriales, les décisions d'architecture et les procédures d'exploitation.

**Phase actuelle : PRÉ-LANCEMENT / DÉVELOPPEMENT.** Le catalogue et les fiches restent gratuits et accessibles sans compte. Les détails et limites à jour figurent dans [l'état du projet](docs/PROJECT-STATUS.md).

## Documentation

Ce README est le portail de navigation du dépôt. Les documents détaillés sont les sources canoniques de leur domaine ; le README ne les duplique pas.

### Gouvernance et contribution

| Document | Objet |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Règles communes impératives pour toute contribution |
| [Contrat coopératif](docs/COOP-CONTRACT.md) | Dialogue, challenge, arbitrages humains et périmètre d'action |
| [Contrat autonome](docs/AUTONOMOUS-CONTRACT.md) | Délégation, priorisation, autonomie et compte rendu |
| [Registre des ADR](docs/decisions/README.md) | Index des décisions d'architecture |

### Produit et contenu

| Document | Objet |
| --- | --- |
| [Vision produit](docs/PRODUCT-VISION.md) | Positionnement, proposition de valeur et périmètre |
| [État du projet](docs/PROJECT-STATUS.md) | Phase, fonctionnalités présentes, limites et travaux en cours |
| [Politique éditoriale](docs/EDITORIAL-POLICY.md) | Fiabilité, prudence des formulations, symbolique et transparence IA |
| [Pipeline de génération et d'import](docs/AI-GENERATION-PIPELINE.md) | Production des fiches, validation structurelle, import et publication |
| [Schéma JSON des fiches](schemas/fiche-prenom.schema.json) | Contrat machine utilisé à l'import |

### Architecture et données

| Document | Objet |
| --- | --- |
| [Architecture](docs/ARCHITECTURE.md) | Vue d'ensemble des systèmes, responsabilités et flux |
| [Modèle de données](docs/DATA-MODEL.md) | Tables, relations, publication, RLS et données personnelles |
| [Standards techniques](docs/TECHNICAL-STANDARDS.md) | Maintenabilité, modularité, TypeScript et intégrations |
| [Tests et validation](docs/TESTING-AND-VALIDATION.md) | Stratégie de tests, parcours critiques et diagnostics |
| [Sécurité Web](docs/platform/WEB-SECURITY.md) | En-têtes HTTP, protections navigateur et sessions administrateur |

### Design et expérience

| Document | Objet |
| --- | --- |
| [Système de design](docs/DESIGN-SYSTEM.md) | Point d'entrée et principes directeurs |
| [Fondations visuelles](docs/design/FOUNDATIONS.md) | Direction, couleurs, formes, typographie et élévation |
| [Composants et interactions](docs/design/COMPONENTS-AND-INTERACTIONS.md) | États, comportements, architecture et fidélité d'interaction |
| [Bibliothèque de composants](docs/design/COMPONENTS.md) | Inventaire Material 3, API, recettes et conventions |
| [Implémentation du design](docs/design/IMPLEMENTATION-STANDARDS.md) | CSS, tokens, responsive, lisibilité et accessibilité visuelle |
| [Navigation et responsive](docs/design/NAVIGATION-AND-RESPONSIVE.md) | Navigation adaptative, écrans et comportement navigateur |
| [Vérification Material 3](docs/MATERIAL-3-VERIFICATION.md) | Sources AndroidX/Material, contrôles et limites Web |
| [ADR des composants Material 3](docs/decisions/ADR-0037-architecture-composants-material3.md) | Décision structurante de la bibliothèque |

### Plateforme et exploitation

| Guide | Objet |
| --- | --- |
| [Dependabot](docs/platform/DEPENDABOT.md) | Écosystèmes, planification, cooldown et revue des PR |
| [GitHub Actions](docs/platform/GITHUB-ACTIONS.md) | CI, workflows, contrôles, previews et diagnostic |
| [Supabase](docs/platform/SUPABASE.md) | Auth, base, RLS, migrations, types et exploitation |
| [Cloudflare Workers](docs/platform/CLOUDFLARE-WORKERS.md) | Runtime, Previews, production et incidents |
| [Environnements et secrets](docs/platform/ENVIRONMENTS-AND-SECRETS.md) | Variables publiques, secrets et séparation des environnements |

### Configuration et code de référence

| Chemin | Rôle |
| --- | --- |
| [`.github/dependabot.yml`](.github/dependabot.yml) | Configuration exécutée de Dependabot |
| [`.github/workflows/`](.github/workflows/) | Workflows GitHub Actions |
| [`wrangler.jsonc`](wrangler.jsonc) | Configuration du Worker Cloudflare |
| [`supabase/migrations/`](supabase/migrations/) | Migrations SQL versionnées |
| [`lib/supabase/`](lib/supabase/) | Clients Supabase et types générés |
| [`schemas/`](schemas/) | Contrats JSON |
| [`tests/`](tests/) | Tests de contrats et comportements |
| [`scripts/`](scripts/) | Scripts de vérification et maintenance |

## Navigation rapide

- Pour comprendre le produit : commencer par [la vision](docs/PRODUCT-VISION.md), puis [l'état du projet](docs/PROJECT-STATUS.md).
- Pour modifier une page : lire le [système de design](docs/DESIGN-SYSTEM.md), les [composants](docs/design/COMPONENTS.md) et les règles de [navigation/responsive](docs/design/NAVIGATION-AND-RESPONSIVE.md).
- Pour toucher aux données : lire le [modèle de données](docs/DATA-MODEL.md) et le guide [Supabase](docs/platform/SUPABASE.md).
- Pour modifier CI ou hébergement : lire [GitHub Actions](docs/platform/GITHUB-ACTIONS.md), [Cloudflare Workers](docs/platform/CLOUDFLARE-WORKERS.md) et [Environnements et secrets](docs/platform/ENVIRONMENTS-AND-SECRETS.md).
- Pour mettre à jour une dépendance : lire [Dependabot](docs/platform/DEPENDABOT.md).

## Application

L'application Next.js est construite pour Cloudflare Workers avec OpenNext. Les paramètres opérationnels et procédures de livraison sont décrits dans les guides de plateforme ci-dessus. La configuration réelle du code et des workflows fait toujours autorité sur leur description documentaire.
