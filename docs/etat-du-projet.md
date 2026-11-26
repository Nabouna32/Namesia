# État du projet — Namesia

- **Statut :** source de vérité de l’état courant
- **Version :** 1.2
- **Mis à jour le :** 2026-11-26 20:41:00 (Europe/Paris)

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

La génération est actuellement externe à l’application. Un workflow manuel GitHub Actions de génération Groq est présent dans le dépôt. Il utilise un schéma JSON strict, le parseur Namesia et un import facultatif en brouillon. Son activation opérationnelle attend les secrets GitHub GROQ_API_KEY et SUPABASE_SERVICE_ROLE_KEY ; aucune clé n’est dans le dépôt. Le dry-run est le comportement par défaut et aucune publication n’est automatique. Seules quelques fiches d’exemple sont nécessaires en pré-lancement.

## Décisions structurantes

- Material 3 Fidelity est la base forte du design system.
- Le compte utilisateur est facultatif ; les fonctions publiques restent accessibles sans inscription.
- Le dépôt Git est la mémoire durable ; les décisions et l’état courant sont documentés dans docs/.
- Le propriétaire autorise l’étude d’une monétisation, mais aucun modèle, publicité, partenariat ou service payant n’est activé sans arbitrage.
- Les sujets de gouvernance 1 à 75 ont été discutés ; les décisions acceptées sont consolidées dans les documents canoniques et ADR référencés par le registre.

## Chantiers et limites connus

- Les avis glob/minimatch suivis dans l’issue #331 ont été corrigés par OpenNext 1.20.19 ; la CI confirme zéro vulnérabilité dans l’audit complet.
- Le workflow Groq est implémenté ; son activation attend les secrets décrits dans [l’issue Action Humaine #354](https://github.com/Nabouna32/Namesia/issues/354). Les retours visiteurs et le compte visiteur facultatif restent à concevoir ou implémenter.
- Les critères précis de transition entre les phases du produit restent soumis à confirmation du propriétaire via [l’issue Action Humaine #350](https://github.com/Nabouna32/Namesia/issues/350) ; aucune transition automatique n’est permise.

## Sources canoniques

- [Contrat de travail](../AGENTS.md)
- [Gouvernance et autonomie](gouvernance.md)
- [Exploitation, sécurité et qualité](operations.md)
- [Gouvernance éditoriale et génération](qualite-editoriale.md)
- [Mesure et croissance](mesure-et-croissance.md)
- [Vision produit](vision-produit.md)
- [Architecture](architecture.md)
- [Système de design](design.md)
- [Standards techniques](standards-techniques.md)
- [Registre des ADR](decisions/README.md)
