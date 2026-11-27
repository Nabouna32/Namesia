# État du projet — Namesia

- **Statut :** source de vérité de l’état courant
- **Version :** 1.3
- **Mis à jour le :** 2026-11-27 01:08:00 (Europe/Paris)

## Phase

**PRÉ-LANCEMENT / DÉVELOPPEMENT** — phase confirmée par le propriétaire. Namesia n’a pas encore été ouvert publiquement sous son domaine propre et ne compte pas d’utilisateurs réels. La présence d’un Worker accessible techniquement ne vaut pas lancement public.

## Produit

Namesia est un site gratuit de découverte et de fiches de prénoms, avec recherche, catalogue, fiches, comparaison, favoris et parcours de découverte. Le contenu éditorial est produit en amont, importé sous forme de JSON puis réparti dans les colonnes dédiées de Supabase. Les contenus sont générés par IA et peuvent comporter des erreurs ; ils ne disposent pas actuellement d’un système de vérification documentaire automatisé.

L’accès public aux fiches ne doit pas dépendre d’un compte. Le compte visiteur facultatif est une orientation produit acceptée, mais son authentification et sa persistance ne sont pas encore implémentées.

## Architecture et exploitation

- **Application :** Next.js App Router, TypeScript et React.
- **Données :** Supabase Auth et PostgreSQL ; schéma et types versionnés dans le dépôt.
- **Hébergement :** Cloudflare Workers avec OpenNext (@opennextjs/cloudflare 1.20.19, @opennextjs/aws 4.2.1).
- **CI/CD :** GitHub Actions ; les vérifications, previews et déploiements suivent les règles de AGENTS.md.
- **Administration :** espace privé protégé par Supabase Auth, liens OTP e-mail.
- **Production technique :** URL workers.dev ; aucun domaine public propre n’est encore déclaré pour le lancement.

## Contenu et génération IA

La génération reste externe au runtime public. Le workflow GitHub Actions manuel via Groq est disponible sur main : une fiche par exécution, schéma de réponse strict, validation par le parseur Namesia, dry-run par défaut et import facultatif en brouillon. Il ne publie jamais et n’effectue aucune recherche documentaire. Les métadonnées des imports sont conservées dans une table relationnelle privée. Son activation opérationnelle attend les secrets GitHub Actions décrits dans l’issue [Action Humaine #354](https://github.com/Nabouna32/Namesia/issues/354). Seules quelques fiches d’exemple sont nécessaires en pré-lancement.

## Décisions structurantes

- Material 3 Fidelity est la base forte du design system.
- Le compte utilisateur est facultatif ; les fonctions publiques restent accessibles sans inscription.
- Le dépôt Git est la mémoire durable ; les décisions et l’état courant sont documentés dans docs/.
- Le propriétaire autorise l’étude d’une monétisation, mais aucun modèle, publicité, partenariat ou service payant n’est activé sans arbitrage.
- Les sujets de gouvernance 1 à 75 ont été discutés ; les décisions acceptées sont consolidées dans les documents canoniques et ADR référencés par le registre.

## Chantiers et limites connus

- Issue #331 clôturée par la [PR #352](https://github.com/Nabouna32/Namesia/pull/352) : OpenNext 1.20.19 intègre le correctif amont pour glob/minimatch ; aucun override hors plage n’a été ajouté.
- Les retours visiteurs, le pipeline de génération automatisé et le compte visiteur facultatif sont des capacités à concevoir ou implémenter, pas des fonctionnalités déjà disponibles.
- Les critères précis de transition entre les phases du produit restent soumis à confirmation du propriétaire via [l’issue Action Humaine #350](https://github.com/Nabouna32/Namesia/issues/350) ; aucune transition automatique n’est permise.

## Sources canoniques

- [Contrat de travail](../AGENTS.md)
- [Gouvernance et autonomie](gouvernance.md)
- [Exploitation, sécurité et qualité](operations.md)
- [Gouvernance éditoriale et génération](qualite-editoriale.md)
- [Génération et import Groq](pipeline-generation-ia.md)
- [Portabilité et réversibilité](portabilite-et-reversibilite.md)
- [Mesure et croissance](mesure-et-croissance.md)
- [Vision produit](vision-produit.md)
- [Architecture](architecture.md)
- [Système de design](design.md)
- [Standards techniques](standards-techniques.md)
- [Registre des ADR](decisions/README.md)
