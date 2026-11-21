# ADR-0003 — Socle du site web et première intégration Supabase

- **Statut :** accepté provisoirement pour la V1
- **Date :** 2026-11-21

## Contexte

Namesia doit être construit comme un produit directement présentable à un visiteur, et non comme une maquette technique exposant des messages de test. Le dépôt initial ne contenait que les fondations documentaires.

## Décision

- Retenir Next.js App Router et TypeScript pour les pages publiques, le rendu serveur et les métadonnées.
- Utiliser le projet Supabase Namesia existant comme source de données du catalogue.
- Accéder à PostgreSQL depuis les composants serveur avec `@supabase/supabase-js` et une clé publishable.
- Protéger toutes les tables exposées avec RLS et n'accorder en lecture publique que les fiches publiées.
- Versionner les fiches, séparer les sources et les affirmations atomiques.
- Fournir six fiches initiales : Alice, Gabriel, Emma, Louis, Lina et Noah, chacune avec un repère symbolique ou culturel contextualisé.
- Garder les parcours publics exempts de messages de debug et d'étiquettes « données de test ».
- Mettre à niveau le socle vers Next.js 16.4.6, React 19.3.1, TypeScript 7.0.2 et Node.js 26 LTS (26.x), sous réserve de validation par CI.
- Réserver les déploiements Vercel à `main` après fusion d'une PR ; interdire les previews et faire exécuter les builds de validation par GitHub Actions.

## Options et compromis

### Next.js plutôt que Vite ou HTML statique

Le rendu serveur et les routes de fiches sont utiles pour le référencement naturel. Vite aurait un démarrage plus léger mais demanderait une stratégie de rendu supplémentaire. Un site statique pur serait simple au début, mais moins adapté à l'évolution du catalogue.

### Supabase plutôt qu'un fichier JSON

Le catalogue doit devenir administrable, versionné et sourcé. Supabase apporte PostgreSQL et RLS sans construire immédiatement une API dédiée. Le risque est de coupler les pages à la structure de données ; les accès sont donc isolés dans `lib/prenoms.ts`.

### Clé publishable et lecture publique

La clé publishable n'est pas un secret. Elle ne donne aucun droit d'écriture par elle-même. Les tables exposées ont RLS activé, des politiques de lecture ciblées et aucun droit public d'écriture. Aucune clé privilégiée n'est intégrée au site.

### Vercel uniquement sur main

Les previews Vercel sont pratiques pour les revues visuelles, mais elles consomment le quota quotidien de builds/déploiements. L'alternative retenue est de faire tourner les contrôles et le build de validation dans GitHub Actions, puis de ne construire/déployer sur Vercel qu'après fusion sur `main`. Le compromis est la perte des URLs Preview ; le quota est protégé et la validation technique reste automatisée.

## Limites connues

- Les six premières fiches constituent un corpus de départ, pas encore un corpus éditorial exhaustif.
- Les références de vulgarisation ne remplacent pas les dictionnaires d'onomastique et les travaux universitaires ; les hypothèses sont présentées comme telles.
- L'administration éditoriale, l'authentification et le pipeline IA restent hors de ce premier incrément.
- Le build Next.js 16 et la compatibilité TypeScript 7 doivent être confirmés par GitHub Actions ; les versions sont déclarées mais pas encore validées localement.

## Validation

- Vérifier les six fiches dans PostgreSQL.
- Vérifier la lecture anonyme par l'API avec les seules politiques RLS.
- Exécuter les advisors Supabase.
- Exécuter le typage, les tests et le build dans GitHub Actions sur PR.
- Vérifier qu'un push de branche n'entraîne aucun build Vercel et qu'un push sur `main` après merge déclenche le déploiement de production.
- Tester les parcours accueil, recherche, catalogue, fiche et 404.
