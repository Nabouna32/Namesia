# État du projet — Namesia

- **Statut :** source de vérité de l’état courant
- **Version :** 1.13
- **Mis à jour le :** 2026-11-27 11:05:11 (Europe/Paris)

## Phase

**PRÉ-LANCEMENT / DÉVELOPPEMENT** — phase confirmée par le propriétaire. Namesia n’a pas encore été ouvert publiquement sous son domaine propre. La présence d’un Worker accessible techniquement ne vaut pas lancement public.

## Produit

Namesia est un site gratuit de découverte et de fiches de prénoms, avec recherche, catalogue, fiches, comparaison, favoris et parcours de découverte. Le périmètre réellement disponible est inventorié dans [Fonctionnalités actuelles](fonctionnalites.md).

La consultation publique ne nécessite aucun compte. Le compte visiteur facultatif est une orientation acceptée, mais son authentification et sa persistance ne sont pas implémentées. Les favoris restent dans le navigateur ; l'historique est limité à la session.

## Architecture et exploitation

- **Application :** Next.js App Router, TypeScript et React.
- **Données :** Supabase Auth et PostgreSQL ; schéma et types versionnés dans le dépôt.
- **Hébergement :** Cloudflare Workers avec OpenNext.
- **CI/CD :** GitHub Actions ; les PR internes humaines éligibles créent une Workers Preview via Wrangler ; les forks et PR Dependabot n'obtiennent pas de Preview. La fusion sur `main` déclenche le déploiement de production.
- **Administration :** espace privé protégé par Supabase Auth, liens OTP e-mail.
- **Production technique :** URL workers.dev ; aucun domaine public propre n’est encore déclaré pour le lancement.

## Contenu et génération IA

Les fiches sont préparées en amont, notamment avec un assistant conversationnel, puis importées en JSON dans l'administration privée. Le contrat est validé et le rendu prévisualisé avant publication explicite. Aucun modèle IA n'est appelé par l'application et aucune vérification factuelle automatique n'est réalisée. Les métadonnées de génération ne font pas partie du contrat d'import courant.

## Décisions structurantes

- Material 3 Fidelity est la base forte du design system.
- Le compte utilisateur est facultatif ; les fonctions publiques restent accessibles sans inscription.
- Le dépôt Git est la mémoire durable ; les décisions et l’état courant sont documentés dans docs/.
- Le propriétaire autorise l’étude d’une monétisation, mais aucun modèle, publicité, partenariat ou service payant n’est activé sans arbitrage.

## Limites et arbitrages en cours

- Les retours visiteurs restent à concevoir ou implémenter. La protection anti-abus du futur formulaire est soumise à l'arbitrage Turnstile de l’[issue Action Humaine #379](https://github.com/Nabouna32/Namesia/issues/379) ; aucun endpoint public d’écriture n’est exposé.
- Les critères précis de transition entre les phases du produit restent soumis à confirmation du propriétaire via [l’issue Action Humaine #350](https://github.com/Nabouna32/Namesia/issues/350) ; aucune transition automatique n’est permise.

## Sources canoniques

- [Contrat de travail](../AGENTS.md)
- [Gouvernance et autonomie](gouvernance.md)
- [Exploitation, sécurité et qualité](operations.md)
- [Vision produit](vision-produit.md)
- [Fonctionnalités actuelles](fonctionnalites.md)
- [Architecture technique](architecture.md)
- [Génération et import](pipeline-generation-ia.md)
- [Qualité éditoriale](qualite-editoriale.md)
- [Modèle de données](modele-donnees.md)
- [Système de design](design.md)
- [Standards techniques](standards-techniques.md)
- [Registre des ADR](decisions/README.md)
