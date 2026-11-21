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
- Une affirmation atomique par enregistrement : `id`, `version_id`, `field_path`, `claim_text`.
- `source_id` et `evidence_note` pour relier chaque affirmation à sa preuve.
- `claim_status` : établi, discuté, incertain ou non documenté.
- Une affirmation établie ou discutée doit avoir au moins une source ; le contrôle de pertinence reste humain.
- Pas de score de confiance numérique sans méthode validée.

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

## 5. Sources statistiques et éditoriales

La politique détaillée est maintenue dans [Politique éditoriale et sources](politique-editoriale-et-sources.md). Le fichier des prénoms de l'Insee est la référence pour les naissances en France ; il ne mesure pas les personnes vivantes portant un prénom. Les statistiques sont stockées comme observations datées et reliées à une source.

## 6. À préciser avant migration SQL

- Authentification et rôles de relecteurs.
- Référentiel de fiabilité des sources.
- Taxonomie exacte des types de sources et des affirmations.
- Gestion des prénoms épicènes et des usages genrés selon les pays.
- Stratégie de fusion des homonymes et des étymologies concurrentes.
- Source statistique et granularité des séries françaises.


## 7. Schéma effectivement créé pour la première version

Le schéma conceptuel ci-dessus reste la cible à challenger. La première migration réellement appliquée au projet Supabase Namesia crée un sous-ensemble relationnel volontairement plus simple :

| Table | Responsabilité actuelle |
|---|---|
| `names` | Identité, slug, nom affiché, initiale, genre éditorial et publication |
| `name_profile_versions` | Versions numérotées d'une fiche et contenus éditoriaux |
| `sources` | Références documentaires et notes de portée |
| `claims` | Affirmations atomiques, section, statut et note de preuve |
| `claim_sources` | Relation plusieurs-à-plusieurs entre affirmations et sources |
| `symbolic_associations` | Emplacement réservé aux associations culturelles contextualisées |

Les migrations sont conservées dans `supabase/migrations/`. Les six tables ont RLS activé. Les rôles `anon` et `authenticated` disposent uniquement de la lecture, et les politiques filtrent les versions publiées. Les opérations d'écriture restent réservées aux opérations de confiance qui seront conçues avec l'administration.

### Écarts assumés avec la cible

- Le modèle actuel ne possède pas encore `name_forms`, `name_profiles`, `statistics_observations` ni `generation_runs`.
- Le profil est directement lié à `names` ; le découpage par langue et marché sera nécessaire avant une ouverture multilingue.
- Les sources sont reliées aux affirmations par `claim_sources`, ce qui permet plusieurs références pour une affirmation et plusieurs affirmations pour une source.
- Le statut d'une affirmation dans la première migration est limité à `etabli` ou `discute`. Les statuts `incertain` et `non_documente` restent à intégrer.
- Les premières fiches n'ont qu'une version chacune. Les versions publiées ne doivent pas être modifiées en place.

Ne pas étendre le schéma au fil de l'eau sans mettre à jour cette section, les migrations, les types applicatifs et les tests RLS.
