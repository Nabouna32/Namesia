# Modèle de données — Namesia

- **Statut :** modèle canonique de la V1
- **Version :** 1.1
- **Mis à jour :** 2026-11-22

## 1. Principes

Le modèle relationnel conserve les données qui nécessitent unicité, relations, droits et cycle de vie. Le texte d'une fiche est stocké dans un JSONB versionné.

Pas de table par rubrique, pas de relation source/affirmation sans processus de vérification réel et pas de colonnes pour des données qui ne sont pas exploitées.

## 2. Tables cibles

### names
Identité stable du prénom :
- id : UUID ;
- slug : identifiant URL unique ;
- display_name : graphie affichée ;
- gender : féminin, masculin, mixte ou inconnu ;
- created_at.

L'initiale est calculée depuis display_name. L'état de publication n'est pas stocké ici : il appartient à la version de fiche.

### name_profiles
Une ligne par version de contenu :
- id : UUID ;
- name_id : référence à names ;
- version : entier croissant par prénom ;
- schema_version : version du contrat JSON ;
- content : contenu éditorial JSONB ;
- status : brouillon, publie ou archive ;
- created_at, published_at.

Contrainte unique sur (name_id, version). Une version publiée doit avoir une date de publication. Le JSON n'accepte pas de statut ni de numéro de version fourni par le modèle.

### admin_users
Liste d'autorisation des comptes Supabase Auth :
- user_id : clé primaire et référence à auth.users.id ;
- created_at.

La table ne peut être modifiée que depuis un canal d'administration de confiance (SQL Editor Supabase). Un utilisateur authentifié peut uniquement lire sa propre autorisation.

## 3. Contrat de contenu

La structure complète est définie dans [schemas/fiche-prenom.schema.json](../schemas/fiche-prenom.schema.json).

- schema_version : version du contrat.
- identity : slug, nom affiché et genre.
- content : introduction, origine, histoire, usages et associations symboliques facultatives.

Les champs éditoriaux facultatifs peuvent être omis lorsqu'ils ne sont pas disponibles. Une association symbolique contient une catégorie, une valeur et un contexte. Elle ne constitue pas un fait scientifique.

## 4. Publication et intégrité

1. Toute importation crée une nouvelle version en brouillon.
2. Le backend calcule le prochain numéro de version.
3. La validation structurelle est exécutée avant l'écriture.
4. La publication est une action distincte et authentifiée.
5. La publication archive l'ancienne version et active la nouvelle dans une transaction.
6. Une version publiée n'est jamais modifiée en place.
7. Les visiteurs anonymes ne lisent que les versions publiées.
8. Les statuts et identifiants de version ne proviennent jamais du JSON.

## 5. Tables historiques à retirer

Le schéma initial comportait sources, claims, claim_sources et symbolic_associations. Ce découpage supposait une traçabilité documentaire et une validation des affirmations qui ne sont pas assurées par le processus de génération retenu.

Les données de contenu et les associations symboliques ont été transférées dans name_profiles.content. Les tables historiques sont conservées pendant la période de transition et seront supprimées après validation du nouveau lecteur et de l'import. Les références documentaires et statuts de preuve ne sont pas conservés comme garanties implicites.

## 6. État réel de la migration

La migration create_jsonb_name_profiles a créé name_profiles et transféré les six versions existantes. Les six versions ont été retrouvées avec le statut publié. Les tables historiques et les colonnes redondantes de names restent temporairement présentes ; leur suppression doit faire l'objet de la migration de nettoyage finale après vérification applicative.

Les nouvelles tables sont protégées par RLS et leurs privilèges Data API sont explicites.
