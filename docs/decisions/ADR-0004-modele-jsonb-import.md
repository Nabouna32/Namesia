# ADR-0004 — Modèle JSONB et chaîne d'import éditoriale

- **Statut :** acceptée
- **Date :** 2026-11-22
- **Décideur :** propriétaire de Namesia

## Contexte

Namesia publie des fiches générées en amont par IA, via API ou conversation, puis intégrées au catalogue. L'application n'effectue pas de recherche documentaire ni de vérification indépendante. Le modèle initial reposait pourtant sur des sources, des affirmations atomiques, des statuts de preuve et des associations symboliques stockées séparément.

Une première évolution a déjà introduit name_profiles en JSONB, un schéma JSON versionné et une administration d'import. L'ancien modèle relationnel subsiste en parallèle, créant deux représentations du même contenu.

## Décision

Pour la V1, le modèle métier est limité à deux tables :
- names pour l'identité stable d'un prénom ;
- name_profiles pour ses versions éditoriales complètes, stockées en JSONB.

Le JSON Schema versionné est le contrat unique d'import. La validation est effectuée côté client pour aider l'administrateur, puis obligatoirement côté serveur avant l'écriture.

Le processus est : génération externe → JSON → import brouillon → prévisualisation → publication explicite.

La publication est transactionnelle, conserve les anciennes versions et n'autorise qu'une version publiée par prénom.

Les tables historiques de sources, claims, relations claims-sources, associations symboliques séparées et anciennes versions ne font plus partie de la cible. Les associations symboliques restent dans le JSON avec un avertissement éditorial. Les initiales sont calculées et les états de publication sont portés par les versions, pas par l'identité.

## Options écartées

- **Conserver toutes les tables relationnelles :** rejeté, car elles décrivent un processus de preuve inexistant.
- **Tout stocker dans une seule table sans version :** rejeté, car la correction d'une fiche écraserait l'historique.
- **Créer une table par rubrique :** rejeté, car les rubriques ne sont pas exploitées indépendamment.
- **Intégrer un fournisseur IA à Namesia :** rejeté pour la V1, car la génération a lieu en amont.
- **Publier automatiquement après import :** rejeté, car l'import technique ne doit pas déclencher une publication.

## Conséquences

- Modèle plus petit et contrat de contenu explicite.
- Pas de promesse de vérification factuelle.
- Administration privée obligatoire pour importer et publier.
- Historique des versions conservé.
- Une migration destructive doit vérifier la reprise du contenu JSONB et révoquer les accès des anciennes tables avant leur retrait.
- La création du premier administrateur est une opération explicite après création de son compte Supabase Auth.

## Sécurité et exploitation

- Authentification Supabase et autorisation via private.admin_users, table placée dans un schéma PostgreSQL non exposé à la Data API.
- Vérification serveur sur chaque route administrative et vérification SQL dans les fonctions d'écriture.
- RLS et privilèges SQL minimaux sur les tables exposées.
- Aucune clé privilégiée dans le navigateur.
- Les migrations du dépôt doivent correspondre exactement à l'historique de migrations appliqué dans Supabase.

## Réexamen

Réexaminer cette décision si Namesia adopte un véritable processus de recherche documentaire, de statistiques structurées, de génération intégrée ou de localisation multilingue.
