# ADR-0039 — Séparer les composants du shell Material 3

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:18:09 (Europe/Paris)
- **Décision prise le :** 2026-11-24 (heure non consignée)
- **Référence :** AndroidX Compose Material 3 1.5.0 stable, commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`
- **Complète :** ADR-0038

## Contexte

Le shell du site utilisait une seule fonction `NavigationAdaptative` qui rendait simultanément deux navigations et une barre supérieure directement écrite dans le layout. Le rendu CSS choisissait le modèle visible selon la fenêtre. Le résultat fonctionnait, mais le code ne reflétait pas les composants Material 3 et leur anatomie propre.

## Challenge

- Renommer simplement `NavigationAdaptative` en `Navigation` aurait conservé un composant fourre-tout qui n'existe pas dans M3.
- Importer les composants Compose Android dans Next.js n'est pas possible.
- Dupliquer la logique de destinations entre deux composants créerait un risque de divergence de libellés, liens et états actifs.

## Décision

- Créer `TopAppBar`, `NavigationBar` et `NavigationRail` comme composants Web distincts, sous leurs noms Material 3.
- Garder un unique composant interne `NavigationDestinations` pour le rendu des quatre liens, l'icône et l'état courant.
- Composer explicitement les trois composants dans `app/layout.tsx`.
- Conserver les classes CSS et seuils responsives validés ; les deux modèles restent présents dans le DOM et CSS n'en affiche qu'un selon la fenêtre.
- Supprimer `NavigationAdaptative` sans alias de compatibilité.

## Conséquences

Le layout exprime maintenant directement le shell M3. Les responsabilités sont séparées sans dupliquer les destinations. Les liens restent des liens HTML accessibles avec `aria-current="page"`, et non des tabs ARIA. La navigation compacte et le rail restent pilotés par la taille de fenêtre, pas par la marque de l'appareil.

## Validation

La CI vérifie les exports, le shell du layout, la sémantique des listes, les seuils responsives, les cibles tactiles et les rôles typographiques `label-medium`. Aucun succès n'est déclaré avant le résultat GitHub Actions.
