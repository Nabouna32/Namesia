# Modèle de données — Namesia

- **Statut :** modèle cible retenu pour la V1
- **Version :** 2.1
- **Mis à jour :** 2026-11-22

## 1. Principes

Le besoin réel est de stocker un catalogue de prénoms et des versions de fiches éditoriales importées en JSON.

Le modèle de stockage est relationnel. Le JSON est uniquement le contrat d'échange avec le générateur et l'API d'import : il est validé, puis décomposé en colonnes et lignes dans une transaction SQL unique. Aucune colonne ne conserve le document complet.

## 2. Tables métier

### names

Identité stable d'un prénom.

| Colonne | Rôle |
|---|---|
| id | UUID, clé primaire |
| slug | Identifiant URL unique et stable |
| display_name | Graphie affichée |
| gender | feminin, masculin, mixte ou inconnu |
| created_at | Date de création |

L'initiale est calculée depuis display_name. Un booléen de publication n'est pas stocké ici : la publication appartient à une version de fiche. Dès la création, slug, display_name et gender sont stables : un import de contenu ne peut pas les modifier. Un renommage éventuel devra être une opération administrative dédiée.

### name_profiles

Une ligne représente une version complète d'une fiche.

| Colonne | Rôle |
|---|---|
| id | UUID, clé primaire |
| name_id | Référence à names.id |
| version | Numéro croissant par prénom |
| schema_version | Version du contrat JSON reçu à l'import |
| introduction | Présentation courte, colonne texte |
| origin_text | Origine, colonne texte nullable |
| history_text | Histoire, colonne texte nullable |
| usage_text | Usages et variantes, colonne texte nullable |
| status | brouillon, publie ou archive |
| created_at | Date d'import |
| published_at | Date de publication, nulle tant que la version n'a jamais été publiée |

Contraintes :
- unicité de (name_id, version) ;
- version strictement positive ;
- content est un objet JSON ;
- une version publiée possède une date de publication ;
- au plus une version publiée par prénom ;
- une version publiée n'est jamais écrasée.

### name_profile_associations

Une ligne par association symbolique d'une version de fiche. Cette séparation permet de filtrer par catégorie ou valeur sans parcourir un document JSON.

| Colonne | Rôle |
|---|---|
| id | UUID, clé primaire |
| profile_id | Référence à name_profiles.id |
| position | Ordre éditorial dans la fiche |
| category | Catégorie filtrable |
| value | Valeur ou association filtrable |
| context_note | Explication éditoriale |

Les rubriques textuelles restent des colonnes de `name_profiles` : une table supplémentaire par paragraphe n'apporterait rien. Les associations ont leur table car elles sont répétables, structurées et potentiellement filtrables.

### private.admin_users

Liste d'autorisation des comptes Supabase Auth. La table réside dans le schéma PostgreSQL privé, qui n'est pas exposé par la Data API.

- user_id : clé primaire et référence à auth.users.id ;
- created_at : date d'autorisation.

RLS est activé. Un utilisateur authentifié peut uniquement lire sa propre autorisation. L'ajout et le retrait d'un administrateur passent par le SQL Editor Supabase, pas par le navigateur.

## 3. Contrat JSON

Le contrat canonique d'entrée est [fiche-prenom.schema.json](../schemas/fiche-prenom.schema.json). L'API le valide avant d'appeler une fonction SQL transactionnelle qui répartit le contenu dans les colonnes `name_profiles` et les lignes `name_profile_associations`.

Structure :
- schema_version : version du schéma ;
- identity : slug, graphie et genre ;
- content : introduction, origine, histoire, usages et associations symboliques.

Les rubriques facultatives peuvent être absentes lorsqu'une information n'est pas disponible. Une génération ne doit pas inventer de texte pour remplir artificiellement le document.

Les associations symboliques restent explicitement présentées comme des interprétations culturelles ou éditoriales, sans valeur scientifique ou prédictive.

## 4. Publication

1. L'import valide le JSON et crée une nouvelle version brouillon.
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
- table dédiée aux associations symboliques (elles sont structurées et filtrables) ;
- formes linguistiques et marchés multilingues ;
- exécutions de génération et coûts par fournisseur.

Ils ne seront ajoutés que lorsqu'un besoin produit concret et un processus réellement appliqué le justifieront. Ne pas créer de tables anticipant un workflow inexistant.

## 6. Migration depuis le modèle historique

Le projet Supabase contient encore l'ancien modèle en parallèle du nouveau :
- ancien : name_profile_versions, sources, claims, claim_sources et symbolic_associations ;
- cible : names, name_profiles et private.admin_users.

L'audit de la base au 22 novembre 2026 constate six prénoms, six anciennes versions, six versions JSONB, six associations symboliques historiques et six associations reprises dans JSONB. Les six prénoms possèdent une version éditoriale importée au format JSON, puis stockée dans le modèle relationnel cible.

Les sources et affirmations historiques ne sont pas reprises dans le nouveau modèle, car Namesia ne garantit plus de vérification documentaire. L'audit constate actuellement 2 sources, 6 affirmations et 6 liaisons claim-source ; ces éléments seront supprimés volontairement, sans migration vers le JSON éditorial. Les 6 associations symboliques, elles, sont reprises dans la table relationnelle `name_profile_associations`. La migration 20261122130000_simplifier_modele_catalogue.sql vérifie la reprise des champs et associations avant de supprimer les anciennes tables et colonnes. Une sauvegarde préalable est obligatoire.

Les migrations déjà appliquées dans Supabase sont versionnées dans le dépôt avec leurs versions exactes : 20261121234038, 20261121234130, 20261121234347 et 20261121234359. La migration de simplification finale reste en attente de validation applicative. Elle ne doit être appliquée qu'après fusion et déploiement de la nouvelle application, afin que le code en production n'utilise plus les anciennes tables. Une sauvegarde Supabase et une autorisation explicite sont obligatoires avant son application.

## 7. Administration

La table privée private.admin_users associe un compte Supabase Auth à l'autorisation d'administrer Namesia. Elle ne contient pas de profil utilisateur public ni de rôle générique.

Aucune lecture anonyme, aucun ajout public et aucune modification de l'autorisation depuis le navigateur. L'identifiant du premier administrateur est ajouté explicitement après création du compte Auth. L'auto-inscription est désactivée.
