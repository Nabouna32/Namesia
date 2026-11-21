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
- Fournir six fiches initiales : Alice, Gabriel, Emma, Louis, Lina et Noah.
- Garder les parcours publics exempts de messages de debug et d'étiquettes « données de test ».

## Options et compromis

### Next.js plutôt que Vite ou HTML statique

Le rendu serveur et les routes de fiches sont utiles pour le référencement naturel. Vite aurait un démarrage plus léger mais demanderait une stratégie de rendu supplémentaire. Un site statique pur serait simple au début, mais moins adapté à l'évolution du catalogue.

### Supabase plutôt qu'un fichier JSON

Le catalogue doit devenir administrable, versionné et sourcé. Supabase apporte PostgreSQL et RLS sans construire immédiatement une API dédiée. Le risque est de coupler les pages à la structure de données ; les accès sont donc isolés dans `lib/prenoms.ts`.

### Clé publishable et lecture publique

La clé publishable n'est pas un secret. Elle ne donne aucun droit d'écriture par elle-même. Les tables exposées ont RLS activé, des politiques de lecture ciblées et aucun droit public d'écriture. Aucune clé privilégiée n'est intégrée au site.

## Limites connues

- Les six premières fiches constituent un corpus de départ, pas encore un corpus éditorial exhaustif.
- Les références de vulgarisation ne remplacent pas les dictionnaires d'onomastique et les travaux universitaires ; les hypothèses sont présentées comme telles.
- L'administration éditoriale, l'authentification et le pipeline IA restent hors de ce premier incrément.
- Les contrôles de build et de typage doivent être exécutés avant de considérer la PR comme fusionnable.

## Validation

- Vérifier les six fiches dans PostgreSQL.
- Vérifier la lecture anonyme par l'API avec les seules politiques RLS.
- Exécuter les advisors Supabase.
- Exécuter le typage, les tests et le build.
- Tester les parcours accueil, recherche, catalogue, fiche et 404.
