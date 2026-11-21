# Modèle de données — Namesia

- **Statut :** modèle cible retenu pour la V1
- **Version :** 2.0
- **Mis à jour :** 2026-11-22

## 1. Principes

Le besoin réel est de stocker un catalogue de prénoms et des versions de fiches éditoriales importées en JSON.

Le modèle doit rester relationnel pour les identités et les versions, et utiliser JSONB pour le document éditorial complet. Les rubriques ne sont pas des entités indépendantes et ne justifient pas une table chacune.

Le JSON est le contrat d'import et le contenu canonique d'une version. Il est validé par le schéma versionné avant son enregistrement.

## 2. Tables métier

### `names`

Identité stable d'un prénom.

| Colonne | Rôle |
|---|---|
| `id` | UUID, clé primaire |
| `slug` | Identifiant URL unique et stable |
| `display_name` | Graphie affichée |
| `gender` | `feminin`, `masculin`, `mixte` ou `inconnu` |
| `created_at` | Date de création |

L'initiale est calculée depuis `display_name`. Un booléen de publication n'est pas stocké ici : la publication appartient à une version de fiche.

### `name_profiles`

Une ligne représente une version complète d'une fiche.

| Colonne | Rôle |
|---|---|
| `id` | UUID, clé primaire |
| `name_id` | Référence à `names.id` |
| `version` | Numéro croissant par prénom |
| `schema_version` | Version du contrat JSON |
| `content` | Document éditorial JSONB |
| `status` | `brouillon`, `publie` ou `archive` |
| `created_at` | Date d'import |
| `published_at` | Date de publication, nulle tant que la version n'a jamais été publiée |

Contraintes :
- unicité de `(name_id, version)` ;
- `version > 0` ;
- `content` est un objet JSON ;
- une version publiée possède une date de publication ;
- au plus une version publiée par prénom ;
- une version publiée n'est jamais écrasée.

## 3. Contrat JSON

Le contrat canonique est [fiche-prenom.schema.json](../schemas/fiche-prenom.schema.json).

Structure :
- `schema_version` : version du schéma ;
- `identity` : slug, graphie et genre ;
- `content` : introduction, origine, histoire, usages et associations symboliques.

Les rubriques facultatives peuvent être absentes lorsqu'une information n'est pas disponible. Une génération ne doit pas inventer de texte pour remplir artificiellement le document.

Les associations symboliques restent explicitement présentées comme des interprétations culturelles ou éditoriales, sans valeur scientifique ou prédictive.

## 4. Publication

1. L'import valide le JSON et crée une nouvelle version `brouillon`.
2. L'administration affiche une prévisualisation du contenu importé.
3. Une action distincte demande la publication.
4. La fonction SQL archive l'ancienne version publiée et publie la version brouillon dans une seule transaction.
5. Le site public ne lit que les versions publiées.

Le JSON entrant ne contient aucun statut, date de publication ou identifiant interne contrôlé par le modèle.

## 5. Données volontairement absentes

Les éléments suivants ne sont pas modélisés dans la V1 :
- sources documentaires et liens de preuve ;
- affirmations atomiques et statuts de preuve ;
- statistiques structurées ;
- tables séparées pour les associations symboliques ;
- formes linguistiques et marchés multilingues ;
- exécutions de génération et coûts par fournisseur.

Ils ne seront ajoutés que lorsqu'un besoin produit concret et un processus réellement appliqué le justifieront. Ne pas créer de tables anticipant un workflow inexistant.

## 6. Migration depuis le modèle historique

Le projet Supabase contient actuellement les deux modèles :
- ancien : `name_profile_versions`, `sources`, `claims`, `claim_sources`, `symbolic_associations` ;
- cible JSONB : `names`, `name_profiles`, `admin_users`.

L'audit de la base au 22 novembre 2026 constate six prénoms, six anciennes versions, six versions JSONB, six associations symboliques historiques et six associations reprises dans JSONB. Les six prénoms possèdent une version JSONB publiée.

Les sources et affirmations historiques ne sont pas reprises dans le nouveau modèle, car Namesia ne garantit plus de vérification documentaire. Leur suppression doit néanmoins rester une migration explicite et contrôlée, pas une suppression manuelle improvisée.

Les migrations du dépôt doivent utiliser exactement les versions présentes dans l'historique Supabase. Les deux migrations JSONB et administration ont été identifiées avec des noms de fichiers qui ne correspondent pas aux versions enregistrées ; cette dérive doit être corrigée avant toute nouvelle migration.

## 7. Administration

La table `admin_users` associe un compte Supabase Auth à l'autorisation d'administrer Namesia. Elle ne contient pas de profil utilisateur public ni de rôle générique.

La table est privée : aucune lecture anonyme, aucun ajout public et aucune modification de l'autorisation depuis le navigateur.

L'identifiant du premier administrateur est ajouté explicitement après création du compte Auth. Cette initialisation n'est pas ouverte à l'auto-inscription.
