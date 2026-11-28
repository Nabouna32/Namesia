# ADR-0048 — Publier un instantané annuel du classement Insee

- **Statut :** acceptée
- **Date :** 2026-11-25
- **Portée :** classement de popularité des prénoms en France
- **Remplace partiellement :** [ADR-0002](ADR-0002-statistiques-insee.md)

## Contexte

Le catalogue Namesia contient des fiches éditoriales, mais ne donne aucun repère objectif sur la fréquence récente des prénoms. L’Insee a publié le 16 septembre 2026 son étude « 80 ans de prénoms : de plus en plus de diversité », qui fournit le top 10 féminin et masculin des prénoms attribués en France en 2025.

## Challenge

- **Créer une table statistique en base :** ajoute un modèle et une synchronisation pour une seule photographie annuelle, sans besoin actuel de requête historique ou géographique.
- **Récupérer le classement à chaque rendu :** introduit une dépendance réseau et rend le résultat variable, alors que le millésime publié est stable.
- **Épingler un snapshot typé dans le dépôt :** donne une source de vérité versionnée, testable et indépendante de la disponibilité d'un service externe.

## Décision

Conserver le top 10 de chaque genre dans `lib/name-popularity.ts`, avec le slug, le libellé, le rang et l'effectif publiés par l'Insee.

- La page `/tendances` présente les deux classements complets.
- Les effectifs sont explicitement indiqués comme arrondis au multiple de cinq, conformément à la méthode de diffusion de l'Insee.
- Une entrée n'ouvre une fiche Namesia que si cette fiche est réellement publiée ; les autres restent visibles comme données de classement et portent la mention « Fiche non publiée sur Namesia ».
- Les fiches du top 10 affichent une carte de popularité avec leur rang et leur effectif.
- Le catalogue et le sitemap référencent la page de tendances.
- Aucun schéma SQL, table de sources, système de synchronisation ou faux contenu de fiche n'est ajouté.
- Le snapshot est réévalué lors de la publication du millésime Insee suivant ; les rangs et effectifs ne sont jamais extrapolés.

## Source et limites

- Insee, Amandine Rodrigues, *80 ans de prénoms : de plus en plus de diversité*, Insee Première n° 2127, publié le 16 septembre 2026 : https://www.insee.fr/fr/statistiques/9040114
- L'étude précise que les effectifs diffusés sont arrondis au multiple de cinq et que les variantes accentuées ou orthographiques sont comptabilisées séparément.
- Le classement porte sur les naissances en France en 2025 ; il ne mesure ni les personnes vivantes ni la popularité dans d'autres pays.
- Les informations étymologiques des fiches Namesia restent éditoriales et distinctes de ce classement statistique.

## Validation

- Test de contrat : dix entrées par genre, rangs consécutifs, slugs uniques, effectifs positifs et URL officielle.
- CI GitHub Actions : tests, TypeScript et build.
