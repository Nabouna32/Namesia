# ADR-0002 — Statistiques de prénoms issues de l'Insee

- **Statut :** en suspens, non implémenté
- **Décision initiale :** 2026-11-21
- **Réexamen :** 2026-11-22

## Contexte initial

Une intégration des statistiques de naissances françaises avait été envisagée à partir du fichier des prénoms publié par l'Insee.

## Réexamen

Le périmètre éditorial actuel repose sur des fiches générées par IA puis importées en JSON. Namesia ne dispose pas encore d'un processus d'import, de mise à jour et de présentation des statistiques sourcées.

Conserver une décision d'intégration statistique comme si elle faisait partie du produit actuel serait trompeur et pousserait à ajouter prématurément des tables, des sources et des processus qui ne sont pas exploités.

## Décision actuelle

Aucune statistique de popularité ni donnée Insee n'est intégrée au modèle de fiche actuel. L'ancienne décision est mise en suspens, pas supprimée : elle pourra être réexaminée si le produit adopte un véritable pipeline de données statistiques.

## Conditions de réactivation

Avant toute réintégration, définir et implémenter :
- le fichier source et son édition exacte ;
- la méthode d'import et de contrôle ;
- le territoire, la période, la mesure et l'unité ;
- les règles de diffusion et d'arrondi ;
- l'affichage des limites de couverture et de comparabilité.

Références conservées pour une éventuelle reprise :
- https://www.insee.fr/fr/statistiques/8595130
- https://www.insee.fr/fr/metadonnees/source/serie/s2236
- https://www.data.gouv.fr/datasets/fichier-des-prenoms-depuis-1900
