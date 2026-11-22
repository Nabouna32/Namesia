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

### Ordre de bascule du modèle en production

Le projet Supabase possède actuellement l'ancien modèle et une première couche JSONB transitoire. La bascule relationnelle est découpée en deux migrations pour éviter toute interruption :

1. **Avant la fusion et le déploiement de la nouvelle application**, appliquer `supabase/migrations/20261122130000_preparer_modele_relationnel.sql`. Cette migration ajoute les colonnes et la table d'associations, reprend les données JSONB, prépare l'import atomique et conserve les anciennes tables ainsi que la colonne JSONB. L'application actuellement en production continue donc de fonctionner.
2. Fusionner la PR et laisser le déploiement de production se faire selon la politique Vercel du dépôt. La nouvelle application lit les colonnes et les lignes relationnelles.
3. Après vérification de la production et sauvegarde/export SQL, appliquer `supabase/migrations/20261122140000_finaliser_nettoyage_modele.sql`. Cette migration est destructive : elle retire le JSONB transitoire, les anciennes tables documentaires et les colonnes redondantes.
4. Vérifier le schéma, les privilèges, RLS et les six fiches publiées.

**Ne pas inverser cet ordre.** La première migration doit précéder le déploiement ; la seconde doit le suivre. Aucune des deux n'a été appliquée dans le cadre de cette PR. Les opérations sur la base de production exigent une autorisation explicite.

Cette migration est destructive pour les anciennes tables documentaires et colonnes redondantes. Elle contrôle la reprise des contenus éditoriaux et des associations symboliques avant leur suppression. **Une sauvegarde ou un export SQL préalable de la base est obligatoire**, notamment des tables sources, claims, claim_sources, symbolic_associations et name_profile_versions. Ne pas appliquer la migration si cette sauvegarde n'est pas disponible.

### Premier accès à l'administration

L'administration est disponible sur /admin. La connexion se fait par lien e-mail via Supabase Auth. Cette procédure est à effectuer après la bascule du schéma décrite ci-dessus.

Pour initialiser le premier compte (l'auto-inscription est désactivée) :

1. Dans Supabase Dashboard, ouvrir Authentication > Users puis inviter l'adresse e-mail de l'administrateur. Le compte doit accepter l'invitation avant sa première connexion.
2. Dans Authentication > URL Configuration, ajouter l'URL locale http://localhost:3000/admin aux Redirect URLs, puis l'URL de production lorsqu'elle sera connue.
3. Dans SQL Editor, autoriser le compte dans la liste privée avec son adresse e-mail :

```sql
insert into private.admin_users (user_id)
select id
from auth.users
where email = lower('adresse-administrateur@example.com')
on conflict (user_id) do nothing;
```

4. Remplacer l'adresse d'exemple par celle du compte invité. La requête ne crée pas de compte Auth : elle autorise un compte déjà existant.
5. Ouvrir /admin, demander un lien de connexion et suivre le lien reçu.

La table privée n'est pas exposée à la Data API. L'autorisation est vérifiée côté serveur et par les politiques RLS. Un compte Auth sans entrée dans cette liste n'a aucun droit d'administration.

L'import crée toujours un brouillon. La publication est une action distincte. Une nouvelle publication archive la version précédente.

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
