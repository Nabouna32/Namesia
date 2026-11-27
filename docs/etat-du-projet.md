# État du projet — Namesia

- **Statut :** source de vérité de l’état courant
- **Version :** 1.10
- **Mis à jour le :** 2026-11-27 (Europe/Paris)

## Phase

**PRÉ-LANCEMENT / DÉVELOPPEMENT** — phase confirmée par le propriétaire. Namesia n’a pas encore été ouvert publiquement sous son domaine propre et ne compte pas d’utilisateurs réels. La présence d’un Worker accessible techniquement ne vaut pas lancement public.

## Produit

Namesia est un site gratuit de découverte et de fiches de prénoms, avec recherche, catalogue, fiches, comparaison, favoris et parcours de découverte. Le contenu éditorial est produit en amont, importé sous forme de JSON puis réparti dans les colonnes dédiées de Supabase. Les contenus sont générés par IA et peuvent comporter des erreurs ; ils ne disposent pas actuellement d’un système de vérification documentaire automatisé.

L’accès public aux fiches ne doit pas dépendre d’un compte. Le compte visiteur facultatif est une orientation produit acceptée, mais son authentification et sa persistance ne sont pas encore implémentées.

## Architecture et exploitation

- **Application :** Next.js App Router, TypeScript et React.
- **Données :** Supabase Auth et PostgreSQL ; schéma et types versionnés dans le dépôt.
- **Hébergement :** Cloudflare Workers avec OpenNext (@opennextjs/cloudflare 1.20.19, @opennextjs/aws 4.2.1).
- **CI/CD :** GitHub Actions ; les PR internes humaines éligibles créent une Workers Preview via Wrangler, avec vérification et nettoyage à la fermeture ; les forks et PR Dependabot n'obtiennent pas de Preview. Playwright contrôle les parcours publics et bloque aussi les violations axe-core sur six pages essentielles en bureau et l’accueil en mobile/tablette. La fusion sur `main` déclenche le déploiement de production via OpenNext/Cloudflare.
- **Administration :** espace privé protégé par Supabase Auth, liens OTP e-mail.
- **Production technique :** URL workers.dev ; aucun domaine public propre n’est encore déclaré pour le lancement.

## Contenu et génération IA

Les fiches sont préparées en amont, notamment dans une conversation avec un assistant, puis importées en JSON dans l'administration privée où elles sont validées et prévisualisées avant publication explicite. Le workflow GitHub Actions Groq issu de l'ancienne ADR-0056 n'est plus le parcours retenu et ne doit pas être activé ; l'ajout des secrets GitHub correspondants n'est donc plus requis. Une page d'administration permettant de saisir un prénom et d'appeler Groq côté serveur reste une piste non prioritaire, à comparer avec la génération directe par un assistant. L'ancien CLI et la table privée de provenance sont des artefacts expérimentaux, non utilisés par l'application courante ; ils ne doivent pas être réactivés comme workflow. Toute réutilisation pour une page d'administration devra être conçue séparément. Aucune génération ne réalise de vérification factuelle automatique.

## Décisions structurantes

- Material 3 Fidelity est la base forte du design system.
- Le compte utilisateur est facultatif ; les fonctions publiques restent accessibles sans inscription.
- Le dépôt Git est la mémoire durable ; les décisions et l’état courant sont documentés dans docs/.
- Le propriétaire autorise l’étude d’une monétisation, mais aucun modèle, publicité, partenariat ou service payant n’est activé sans arbitrage.

## Limites et arbitrages en cours

- Les retours visiteurs restent à concevoir ou implémenter. La protection anti-abus du futur formulaire est soumise à l'arbitrage Turnstile de l’[issue Action Humaine #379](https://github.com/Nabouna32/Namesia/issues/379) ; aucun endpoint public d’écriture n’est exposé. Le compte visiteur facultatif reste à concevoir ou implémenter.
- Les critères précis de transition entre les phases du produit restent soumis à confirmation du propriétaire via [l’issue Action Humaine #350](https://github.com/Nabouna32/Namesia/issues/350) ; aucune transition automatique n’est permise.

## Sources canoniques

- [Contrat de travail](../AGENTS.md)
- [Gouvernance et autonomie](gouvernance.md)
- [Exploitation, sécurité et qualité](operations.md)
- [Gouvernance éditoriale et génération](qualite-editoriale.md)
- [Génération assistée et import](pipeline-generation-ia.md)
- [Portabilité et réversibilité](portabilite-et-reversibilite.md)
- [Mesure et croissance](mesure-et-croissance.md)
- [Vision produit](vision-produit.md)
- [Architecture](architecture.md)
- [Système de design](design.md)
- [Standards techniques](standards-techniques.md)
- [Registre des ADR](decisions/README.md)
