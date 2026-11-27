# État du projet — Namesia

- **Statut :** PRÉ-LANCEMENT / DÉVELOPPEMENT
- **Version :** 1.6
- **Mis à jour le :** 2026-11-27 20:01:28 (Europe/Paris)

Ce document résume l'état opérationnel et les arbitrages actifs. Les détails d'architecture, de sécurité et de données restent dans les ADR et documents spécialisés.

## Produit

- Le catalogue, la recherche et toutes les fiches publiques restent gratuits et accessibles sans compte.
- Le compte est facultatif pour explorer Namesia.
- Les favoris et l'historique sont des fonctions personnelles liées au compte, pas des données persistantes locales.
- Les fiches sont générées en amont puis importées dans les colonnes dédiées avant publication.
- Namesia ne revendique pas de vérification documentaire des textes générés par IA.

## Comptes et sécurité

- Un seul système Supabase Auth par e-mail et mot de passe sert les visiteurs et les administrateurs.
- Les formulaires exigent au moins 8 caractères, une majuscule et un chiffre ; aucun symbole n'est obligatoire.
- La règle de composition exacte est contrôlée dans les formulaires Namesia et peut être contournée par un appel direct à l'API Supabase Auth. Le minimum de longueur doit être configuré côté serveur avant l'ouverture publique.
- La protection HIBP n'est pas activée et aucun passage à Supabase Pro n'est prévu.
- Le droit administrateur est attribué séparément via `private.admin_users`.
- Les sessions utilisent PKCE et les cookies SSR `@supabase/ssr`.

## Données personnelles

- **Favoris :** table `public.user_favorites` créée dans Supabase, versionnée par les migrations `20261127133138`, `20261127133505` et `20261127134241`. RLS isole les lignes par `auth.uid()`, l'insertion exige un prénom publié et est limitée aux colonnes `user_id` et `name_id`, et les suppressions de compte/prénom déclenchent les cascades.
- L'ancien stockage local des favoris et de l'historique est purgé au prochain chargement, sans migration ; les anciennes sélections ne sont pas récupérées. L'import/export JSON reste disponible pour les sauvegardes explicites du compte.
- **Historique :** suspendu. L'ancien moteur `sessionStorage`, ses composants d'interface et ses utilitaires sont supprimés ; aucune visite n'est enregistrée et aucune ancienne donnée n'est migrée. L'activation explicite, la rétention proposée de 30 jours et la limite de huit entrées attendent l'arbitrage humain [#405](https://github.com/Nabouna32/Namesia/issues/405).
- La suppression autonome du compte et la gestion complète des données personnelles restent à développer dans [#404](https://github.com/Nabouna32/Namesia/issues/404).

## Mise en service

- Le SMTP Supabase par défaut suffit aux essais internes : deux e-mails par heure, destinataires limités aux membres de l'équipe du projet.
- Un SMTP transactionnel externe et la configuration des paramètres Auth restent nécessaires avant l'ouverture publique des inscriptions : [#402](https://github.com/Nabouna32/Namesia/issues/402).
- Aucun fournisseur payant ni changement de plan n'est autorisé sans accord explicite.
- Seule la branche `main` déploie la production.

## Travaux en cours

- **PR #403 —** [Comptes Namesia et favoris liés au compte](https://github.com/Nabouna32/Namesia/pull/403), en brouillon sur `feat/comptes-utilisateurs-mot-de-passe`.
- La PR inclut l'authentification partagée, les favoris synchronisés, la suppression des anciens stockages locaux sans migration, la suspension de l'historique en attente de décision et la correction de la référence Open Graph des fiches.
- La CI GitHub Actions est la source de vérité : chaque commit relance les audits, les tests, le contrôle TypeScript et le build ; les PR internes exécutent aussi une Preview Cloudflare et les parcours Playwright.
- Le dernier contrôle post-déploiement Cloudflare de `main` avait échoué sur la présence de la référence Open Graph dans le HTML. La correction est vérifiée sur la Preview de la PR ; `main` reste inchangée tant que la PR n'est pas fusionnée.
- Les migrations des favoris ont été appliquées au projet Supabase et sont présentes dans la branche de travail. Aucun favori de test n'a été conservé.
- Le code n'est pas fusionné dans `main` et aucun déploiement de production n'a été effectué.
- L'issue [#404](https://github.com/Nabouna32/Namesia/issues/404) reste ouverte pour l'historique, l'accès/suppression des données et la suppression du compte.
- L'issue [#405](https://github.com/Nabouna32/Namesia/issues/405) attend l'arbitrage sur l'activation et la rétention de l'historique.

## Règles d'exploitation

- Une seule PR de travail ouverte à la fois.
- Vérifications, tests, type-check et build exclusivement via GitHub Actions ; aucun contrôle local.
- Ne pas annoncer une vérification réussie avant le résultat CI correspondant.
- Ne jamais fusionner ni déployer avant validation de la CI et des prérequis de mise en service.
