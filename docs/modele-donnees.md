# Modèle de données éditorial — Namesia

- **Statut :** modèle conceptuel initial
- **Version :** 1.0
- **Mis à jour :** 2026-11-21

## 1. Principes

Le JSON de fiche est un contrat de transport et de validation. PostgreSQL reste le stockage canonique relationnel pour les entités, les sources, les versions et les statistiques.

Ne pas stocker toutes les données dans un unique champ JSONB : cela compliquerait les contraintes, les recherches, les relations et les mises à jour ciblées. Un instantané JSONB validé peut néanmoins être conservé pour l'audit et l'export.

## 2. Entités proposées

### `names`
Identité du prénom indépendamment de sa présentation locale.
- `id` : UUID.
- `canonical_key` : clé normalisée unique.
- `created_at`, `updated_at`.

### `name_forms`
Formes écrites et variantes.
- `id`, `name_id`.
- `form`, `normalized_form`.
- `form_type` : forme principale, variante, diminutif, translittération.
- `language_code` nullable.
- Contrainte d'unicité adaptée au nom et à la langue.

### `name_profiles`
Contenu éditorial par marché et langue.
- `id`, `name_id`.
- `market_code` (ex. FR), `language_code` (ex. fr).
- `slug` stable et unique dans son périmètre.
- `current_published_version_id` nullable.
- Contrainte unique sur nom + marché + langue.

### `name_profile_versions`
Versions immuables du contenu.
- `id`, `profile_id`, `version_number`.
- `schema_version`, `content_json`.
- `status`, `generated_at`, `reviewed_at`, `published_at`.
- `model_provider`, `model_name`, `prompt_version`.
- `created_by`, `reviewed_by` selon le système d'identité retenu.
- Contrainte unique sur profil + numéro de version.

### `sources`
Références bibliographiques ou numériques vérifiées.
- `id`, `title`, `publisher`, `author`.
- `source_type`, `url`, `accessed_at`, `published_at`.
- `reliability_note`, `language_code`.
- Une source est une référence, pas une preuve automatique de toutes les affirmations.

### `claims`
Affirmations factuelles atomiques liées à une version.
- `id`, `version_id`, `field_path`, `claim_text`.
- `source_id`, `evidence_note`.
- `confidence` facultatif et défini par une méthode documentée.
- Une affirmation sans source vérifiée ne doit pas être promue comme fait établi.

### `symbolic_associations`
Interprétations symboliques distinctes des faits.
- `id`, `version_id`, `category`, `value`.
- `tradition_or_framework`, `explanation`, `caveat`.
- Ne pas confondre association éditoriale, tradition culturelle et résultat scientifique.

### `statistics_observations`
Données quantitatives temporelles.
- `id`, `name_id`, `market_code`, `period`.
- `metric`, `value`, `unit`, `source_id`.
- `retrieved_at`.
- Les statistiques ne sont pas enfouies dans un paragraphe intemporel.

### `generation_runs`
Traçabilité du pipeline.
- `id`, `profile_id`, `version_id`.
- `provider`, `model`, `prompt_version`, `schema_version`.
- `input_fingerprint`, `started_at`, `finished_at`.
- `validation_report`, `token_usage`, `cost_estimate`, `run_status`.

## 3. Relations principales

- Un prénom possède plusieurs formes.
- Un prénom possède un profil par marché et langue.
- Un profil possède plusieurs versions immuables.
- Une version possède plusieurs affirmations et associations symboliques.
- Une affirmation peut référencer une source vérifiée.
- Une observation statistique est datée et sourcée.
- Une exécution de génération produit au plus une version candidate identifiable.

## 4. Règles d'intégrité

1. Une version publiée doit avoir passé la validation du schéma et les contrôles éditoriaux obligatoires.
2. Une version publiée n'est jamais écrasée.
3. Une fiche peut omettre une information inconnue ; ne pas inventer une valeur pour remplir le modèle.
4. Les sources sont enregistrées indépendamment du texte généré.
5. Les dates, pays, unités et périodes des statistiques sont obligatoires.
6. Les codes de langue suivent BCP 47 ; les codes pays suivent ISO 3166-1 alpha-2.
7. Les slugs sont stables ; une modification de slug nécessite une redirection permanente.
8. Le statut de publication appartient à la version, pas à une sortie libre du modèle.

## 5. À préciser avant migration SQL

- Authentification et rôles de relecteurs.
- Référentiel de fiabilité des sources.
- Taxonomie exacte des types de sources et des affirmations.
- Gestion des prénoms épicènes et des usages genrés selon les pays.
- Stratégie de fusion des homonymes et des étymologies concurrentes.
- Source statistique et granularité des séries françaises.
