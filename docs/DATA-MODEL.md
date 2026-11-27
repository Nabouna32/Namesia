# Modèle de données — Namesia

- **Statut :** modèle cible retenu pour la V1
- **Version :** 2.8
- **Mis à jour le :** 2026-11-27 20:05:03 (Europe/Paris)

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
- introduction est non vide ;
- les longueurs maximales des rubriques sont contrôlées ;
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

Les rubriques textuelles restent des colonnes de `name_profiles` : une table supplémentaire par paragraphe n'apporterait rien. Une fiche publiée est immuable : toute correction ou enrichissement crée une nouvelle ligne versionnée, puis archive l'ancienne lors de la publication explicite. Les associations sont copiées vers la nouvelle version lorsqu'elles restent pertinentes. Les associations ont leur table car elles sont répétables, structurées et potentiellement filtrables. Les index ne sont pas ajoutés par anticipation sur chaque colonne : ils seront choisis à partir des filtres réellement proposés et des volumes observés. La recherche plein texte pourra utiliser un index dédié lorsqu'elle fera partie du besoin produit.

### private.admin_users

Affectation du droit administrateur à un compte Supabase Auth ordinaire. La table réside dans le schéma PostgreSQL privé, qui n'est pas exposé par la Data API.

- user_id : clé primaire et référence à auth.users.id ;
- created_at : date d'attribution du droit.

Cette table ne stocke aucun mot de passe et ne constitue pas un second système d'identité : Supabase Auth gère l'identité et la session, tandis que `private.admin_users` représente uniquement l'autorisation d'administrer le catalogue. Un compte qui n'y figure pas reste un compte utilisateur ordinaire.

RLS est activé. Un utilisateur authentifié peut uniquement lire sa propre autorisation. L'ajout et le retrait d'un administrateur passent par le SQL Editor Supabase, jamais par le navigateur ni par des métadonnées modifiables par l'utilisateur.

### user_favorites

Favoris personnels d'un compte Namesia, synchronisés entre appareils.

| Colonne | Rôle |
|---|---|
| user_id | Référence à `auth.users.id`, propriétaire du favori |
| name_id | Référence à `names.id` |
| created_at | Date d'enregistrement du favori |

Contraintes et sécurité :
- clé primaire composite `(user_id, name_id)`, sans doublon ;
- suppression en cascade lorsque le compte ou le prénom est supprimé ;
- RLS activé ; `SELECT` et `DELETE` sont accordés à `authenticated`, tandis que `INSERT` est limité aux colonnes `user_id` et `name_id` ; `created_at` est exclusivement fourni par défaut par PostgreSQL ;
- chaque policy vérifie que `auth.uid() = user_id` ;
- l'insertion exige qu'une version publiée du prénom existe ;
- aucun accès n'est accordé au rôle `anon` ;
- l'index sur `name_id` sert aux recherches inverses et aux suppressions en cascade d'un prénom.

Les favoris sont lus et modifiés depuis le client Supabase public, dont les requêtes restent soumises à RLS. Aucune clé privilégiée n'est utilisée. Les anciens favoris `localStorage` ne sont envoyés qu'après une action explicite de migration ; la clé locale n'est effacée qu'après confirmation du transfert complet.

L'historique de consultation n'a pas encore de table. Son activation, sa rétention et sa limite sont soumises à l'arbitrage humain #405 ; aucune visite n'est actuellement enregistrée.

## 3. Contrat JSON

Le contrat canonique d'entrée est [fiche-prenom.schema.json](../schemas/fiche-prenom.schema.json). L'API le valide avant d'appeler une fonction SQL transactionnelle qui répartit le contenu dans les colonnes `name_profiles` et les lignes `name_profile_associations`.

Structure du contrat 2.0.0 :
- schema_version : version du schéma ;
- identity : slug, graphie et genre ;
- content : introduction, origine, histoire, usages et tableau `symbolic_associations` obligatoire, qui peut être vide lorsqu'aucune association n'est retenue.

Les rubriques `origin`, `history` et `usage` peuvent être absentes lorsqu'une information n'est pas disponible. `symbolic_associations` est un tableau obligatoire, éventuellement vide : son absence est une entrée invalide et ne doit pas être convertie silencieusement en liste vide. Une génération ne doit pas inventer de texte pour remplir artificiellement le document.

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
- sources, références documentaires et statuts de vérification ;
- affirmations atomiques et statuts de preuve ;
- statistiques structurées ;
- génération IA intégrée et métadonnées de fournisseur ;
- formes linguistiques et marchés multilingues ;
- exécutions de génération et coûts par fournisseur.

Ils ne seront ajoutés que lorsqu'un besoin produit concret et un processus réellement appliqué le justifieront. Ne pas créer de tables anticipant un workflow inexistant.

## 6. Schéma en production

Le schéma de production correspond au modèle relationnel décrit dans ce document. Les tables `sources`, `claims`, `claim_sources`, `symbolic_associations` et `name_profile_versions` ainsi que la colonne JSONB historique ont été supprimées. Les colonnes redondantes de `names` (`first_letter` et `is_published`) n'existent plus : l'initiale est calculée depuis le nom affiché et la publication appartient à une version de fiche.

Le contrat JSON reste exclusivement un format d'entrée. La persistance se fait dans les colonnes de `name_profiles` et les lignes de `name_profile_associations`, sans document JSON complet stocké en base.
## 7. Administration

La table privée private.admin_users associe un compte Supabase Auth à l'autorisation d'administrer Namesia. Elle ne contient pas de profil utilisateur public ni de rôle générique.

Aucune lecture anonyme, aucun ajout public et aucune modification de l'autorisation depuis le navigateur. L'identifiant du premier administrateur est ajouté explicitement après création du compte Auth. L'auto-inscription est désactivée.
