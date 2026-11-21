# ADR-0002 — Utiliser le fichier des prénoms de l'Insee comme référence statistique française

- **Statut :** accepté
- **Date :** 2026-11-21
- **Décideurs :** équipe Namesia

## Contexte

Namesia doit afficher la popularité des prénoms en France avec une provenance claire. Les chiffres issus de sites tiers ou de calculs non documentés risquent de mélanger naissances, population vivante, rangs et estimations.

## Décision

Le fichier des prénoms publié par l'Insee est la source primaire de référence pour les statistiques de naissances en France.

Références :
- Publication : https://www.insee.fr/fr/statistiques/8595130
- Méthodologie : https://www.insee.fr/fr/metadonnees/source/serie/s2236
- Jeu de données : https://www.data.gouv.fr/datasets/fichier-des-prenoms-depuis-1900

L'édition consultée le 21 novembre 2026 couvre les naissances de 1900 à 2025. La chaîne d'import doit conserver la date et l'édition exactes de la source.

## Contraintes d'interprétation

- Ces données décrivent les naissances enregistrées par année, pas le nombre de personnes vivantes portant le prénom.
- Les effectifs publiés sont arrondis au multiple de 5 le plus proche dans l'édition consultée.
- Les prénoms attribués moins de trois fois sont soumis aux règles de diffusion et ne doivent pas être reconstitués.
- La couverture géographique n'est pas homogène sur toute la période : les données nationales antérieures à 2012 excluent Mayotte dans l'édition consultée.
- L'Insee signale une exhaustivité moins bonne avant 1946 et la possibilité de corrections ou d'erreurs résiduelles.
- Les statistiques doivent conserver période, territoire, sexe tel que défini dans le fichier, mesure, unité et référence de source.

## Conséquences

- Les séries statistiques sont importées et versionnées indépendamment des textes de fiches.
- Toute visualisation indique la période et le périmètre géographique.
- Les comparaisons temporelles utilisent les valeurs publiées et documentent tout calcul dérivé.
- Une mise à jour annuelle du fichier déclenche une procédure d'import, de contrôle et de datation, pas une réécriture du contenu étymologique.

## Revue

Réexaminer cette décision si l'Insee change la structure, la licence, les seuils de diffusion ou la méthode de calcul.
