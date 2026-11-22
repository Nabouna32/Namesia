# ADR-0003 — Socle web et intégration Supabase

- **Statut :** accepté pour la V1, révisé le 22 novembre 2026
- **Date initiale :** 2026-11-21

## Contexte

Namesia doit proposer un site public rapide et indexable, alimenté par un catalogue de prénoms administrable. Le projet est personnel et ne nécessite pas une architecture distribuée ni un CMS multi-équipes.

## Décision

- Next.js App Router et TypeScript pour les pages publiques et l'administration.
- Supabase PostgreSQL comme stockage du catalogue.
- Accès serveur au catalogue public avec la clé publishable et des politiques RLS.
- Administration privée avec Supabase Auth, liste d'autorisation stockée dans le schéma PostgreSQL privé et API serveur.
- Identité des prénoms et versions conservées relationnellement ; contenu éditorial d'une version stocké en JSONB.
- Import JSON en brouillon, prévisualisation et publication explicite.
- Pas de clé privilégiée dans le code de l'application.
- Les builds de validation restent dans GitHub Actions ; aucun déploiement Preview Vercel.

## Options et compromis

### Next.js plutôt que Vite ou HTML statique

Le rendu serveur et les routes de fiches sont utiles pour le référencement naturel. Vite serait plus léger au démarrage mais demanderait une stratégie de rendu supplémentaire. Le site statique pur serait simple au début mais moins adapté à l'évolution du catalogue.

### Supabase plutôt qu'un fichier JSON

Le catalogue doit être modifiable sans déploiement du code, avec des identifiants stables, des versions et des droits. PostgreSQL apporte ces garanties sans construire une API de données dédiée.

### JSONB plutôt qu'une table par rubrique

Les rubriques sont principalement des blocs éditoriaux affichés ensemble. Les normaliser dans de nombreuses tables augmenterait les jointures et le coût de maintenance sans besoin de requêtes indépendantes. Les identités, versions, statuts et droits restent relationnels.

### Administration maison plutôt qu'un CMS tiers

Un import JSON et une seule personne administratrice ne justifient pas le coût d'un CMS externe. L'interface reste volontairement limitée à l'import, la prévisualisation et la publication.

## Limites connues

- Le contenu est généré par IA et peut comporter des erreurs.
- La validation JSON ne vérifie pas les affirmations.
- Les statistiques, sources documentaires, multi-langue et génération IA intégrée ne font pas partie de la V1.
- La session Supabase Auth du panneau admin utilise le stockage navigateur du client Supabase ; la protection dépend également de RLS et de l'autorisation côté API.
- Les tables historiques du modèle initial sont conservées jusqu'à la validation de la migration et du nouveau parcours.

## Validation attendue

- Six fiches existantes transférées sans perte des champs éditoriaux utiles.
- Lecture publique limitée aux versions publiées.
- Écriture impossible sans session et autorisation administrateur.
- Import toujours en brouillon.
- Publication atomique et version précédente archivée.
- Typecheck, build et tests dans GitHub Actions.
