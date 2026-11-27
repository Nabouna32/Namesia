# Modèle de données — Namesia

- **Statut :** modèle cible retenu pour la V1
- **Version :** 2.7
- **Mis à jour le :** 2026-11-27 01:08:00 (Europe/Paris)

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

Liste d'autorisation des comptes Supabase Auth. La table réside dans le schéma PostgreSQL privé, qui n'est pas exposé par la Data API.

- user_id : clé primaire et référence à auth.users.id ;
- created_at : date d'autorisation.

RLS est activé. Un utilisateur authentifié peut uniquement lire sa propre autorisation. L'ajout et le retrait d'un administrateur passent par le SQL Editor Supabase, pas par le navigateur.

### private.name_profile_generation_metadata

Une ligne de provenance technique privée par version importée par le pipeline IA. La table est dans le schéma PostgreSQL private, non exposé à la Data API.

| Colonne | Rôle |
|---|---|
| profile_id | Clé primaire et référence à name_profiles.id, suppression en cascade |
| provider, model | Fournisseur et modèle effectivement utilisés |
| prompt_version, prompt_sha256 | Version et empreinte du prompt exécuté |
| content_sha256 | Empreinte SHA-256 du contenu normalisé, pour vérifier l’idempotence |
| response_schema_version | Version du schéma strict de génération |
| request_id | Identifiant de réponse Groq unique, clé d’idempotence |
| input_tokens, output_tokens | Usage retourné par le fournisseur, nullable |
| temperature, max_completion_tokens | Paramètres effectifs de génération |
| generated_at, created_at | Date de génération et date d’enregistrement |

RLS est activé ; aucun droit n’est accordé à anon ou authenticated. Seul service_role peut lire et insérer ces métadonnées via le workflow contrôlé. Aucune donnée de provenance n’est stockée dans une colonne JSON.

## 3. Contrat JSON

Le contrat canonique d'import est [fiche-prenom.schema.json](../schemas/fiche-prenom.schema.json). Le générateur Groq utilise un contrat de réponse strict séparé, puis normalise sa sortie vers le contrat d'import. L'API le valide avant d'appeler une fonction SQL transactionnelle qui répartit le contenu dans les colonnes `name_profiles` et les lignes `name_profile_associations`.

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

- sources et références documentaires vérifiées ;
- affirmations atomiques et statuts de preuve ;
- statistiques structurées ;
- historique exhaustif des tentatives de génération échouées ;
- coûts monétaires détaillés par fournisseur ;
- formes linguistiques et marchés multilingues.

La provenance technique des fiches Groq importées avec succès est désormais conservée dans private.name_profile_generation_metadata. Cette table ne contient que les métadonnées nécessaires à la traçabilité ; elle ne stocke ni prompt brut ni document JSON complet. Les autres éléments absents ne seront ajoutés que lorsqu’un processus concret et contrôlé les justifiera.

## 6. Schéma en production

Le schéma de production correspond au modèle relationnel décrit dans ce document. Les tables `sources`, `claims`, `claim_sources`, `symbolic_associations` et `name_profile_versions` ainsi que la colonne JSONB historique ont été supprimées. Les colonnes redondantes de `names` (`first_letter` et `is_published`) n'existent plus : l'initiale est calculée depuis le nom affiché et la publication appartient à une version de fiche.

Le contrat JSON reste exclusivement un format d'entrée. La persistance se fait dans les colonnes de `name_profiles` et les lignes de `name_profile_associations`, sans document JSON complet stocké en base.
## 7. Administration

La table privée private.admin_users associe un compte Supabase Auth à l'autorisation d'administrer Namesia. Elle ne contient pas de profil utilisateur public ni de rôle générique.

Aucune lecture anonyme, aucun ajout public et aucune modification de l'autorisation depuis le navigateur. L'identifiant du premier administrateur est ajouté explicitement après création du compte Auth. L'auto-inscription est désactivée.
