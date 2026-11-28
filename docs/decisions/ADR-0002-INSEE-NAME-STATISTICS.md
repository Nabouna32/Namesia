# ADR-0002 — Statistiques de prénoms issues de l'Insee

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:05:17 (Europe/Paris)
- **Remplacement partiel :** le snapshot annuel limité est couvert par ADR-0048 ; la décision de ne pas intégrer un historique statistique complet reste active.
- **Décision initiale :** 2026-11-21
- **Réexamen le :** 2026-11-25 (heure non consignée)

## Contexte initial

Une intégration des statistiques historiques de naissances françaises avait été envisagée à partir du fichier des prénoms publié par l'Insee.

## Réexamen

Le périmètre éditorial de Namesia repose sur des fiches générées en amont puis importées en JSON. Le produit ne dispose pas d'un pipeline d'import, de mise à jour et de contrôle d'un historique statistique complet.

Conserver une décision d'intégration de l'ensemble des séries Insee comme si elle faisait partie du produit actuel pousserait à ajouter prématurément des tables, des sources et des processus qui ne sont pas exploités.

Un besoin plus limité est apparu : donner un repère récent et vérifiable sur les prénoms les plus attribués. Ce besoin est couvert par un snapshot annuel des deux top 10 2025, décrit précisément dans l'ADR-0048.

## Décision actuelle

L'intégration d'un historique statistique complet, d'un pipeline de synchronisation et de tables statistiques en base reste en suspens.

Le produit accepte uniquement le périmètre restreint de l'ADR-0048 :
- un snapshot typé du top 10 féminin et masculin pour un millésime publié ;
- les rangs et effectifs issus de la source officielle, avec leurs règles d'arrondi ;
- une page éditoriale distincte du modèle des fiches ;
- aucune synchronisation réseau, table statistique ou table de références.

Aucune statistique Insee n'est ajoutée au modèle de fiche `name_profiles`. Le classement reste une donnée de produit distincte, sourcée et versionnée dans le dépôt. L'ADR-0048 est la décision courante pour cette fonctionnalité.

## Conditions de réactivation du périmètre historique complet

Avant toute intégration d'un historique ou d'un pipeline automatisé, définir et implémenter :
- le fichier source et son édition exacte ;
- la méthode d'import, de mise à jour et de contrôle ;
- le territoire, la période, la mesure et l'unité ;
- les règles de diffusion et d'arrondi ;
- les limites de couverture et de comparabilité ;
- la politique de conservation et de correction des millésimes.

Références conservées pour une éventuelle reprise du fichier historique :
- https://www.insee.fr/fr/statistiques/8595130
- https://www.insee.fr/fr/metadonnees/source/serie/s2236
- https://www.data.gouv.fr/datasets/fichier-des-prenoms-depuis-1900
