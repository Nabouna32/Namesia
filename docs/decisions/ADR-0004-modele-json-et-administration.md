# ADR-0004 — Modèle JSON des fiches et administration Namesia

- **Statut :** accepté
- **Date :** 2026-11-22

## Contexte

Le schéma initial séparait les fiches, affirmations, sources et associations symboliques. Ce modèle présupposait un processus documentaire et une validation des affirmations qui ne correspondent pas au fonctionnement réellement retenu : les fiches sont produites par IA, puis intégrées en base.

Le produit est administré par une seule personne. Il faut pouvoir importer un JSON sans modifier le code, tout en conservant une séparation nette entre brouillon et publication.

## Options étudiées

1. Conserver le modèle relationnel détaillé : écarté, car les relations sources/claims ne correspondent pas à un processus réellement exécuté.
2. Stocker toute la fiche et son identité dans un seul JSONB : écarté, car l'identité, l'unicité, les versions et les droits doivent rester relationnels.
3. Utiliser un CMS tiers : écarté, coût et surface fonctionnelle disproportionnés pour le besoin.
4. Identité relationnelle, versions relationnelles et contenu JSONB : retenu.

## Décision

- Le contrat d'import est le JSON Schema Namesia 2.0.0.
- La table names porte l'identité, le slug et le genre.
- La table name_profiles porte une version immuable, son statut et son contenu JSONB.
- La table privée admin_users autorise les comptes Supabase Auth.
- L'administration accepte un JSON, le valide, le prévisualise et crée toujours un brouillon.
- Une publication explicite archive la version précédente et active la nouvelle dans une transaction.
- Les visiteurs anonymes ne lisent que les versions publiées.
- Le modèle ne fournit ni statut, ni version, ni identifiant de base et ne peut pas publier.
- La validation automatique est structurelle ; elle ne constitue pas une vérification factuelle.

## Conséquences

- Le contenu peut être généré depuis une conversation ou une API sans dépendance à un fournisseur.
- Une nouvelle version du schéma nécessite une évolution explicite du validateur et une migration si le stockage change.
- Les tables sources, claims, claim_sources et symbolic_associations ne font plus partie du modèle cible.
- Les tables historiques ne sont supprimées qu'après validation du transfert et du nouveau parcours.
- Les statistiques et références documentaires restent hors périmètre jusqu'à l'existence d'un processus dédié.

## Réexamen

Réexaminer cette décision si Namesia met en place une génération automatisée intégrée, un vrai pipeline de sources, des statistiques importées ou plusieurs marchés/langues.
