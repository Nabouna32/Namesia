# État du projet — Namesia

- **Statut :** PRÉ-LANCEMENT / DÉVELOPPEMENT
- **Version :** 1.8
- **Mis à jour le :** 2026-11-27 20:25:06 (Europe/Paris)

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

- Le SMTP Supabase par défaut est conservé pour les essais internes : deux e-mails par heure et destinataires limités aux membres de l'équipe du projet.
- L'option Supabase Auth de nouvelles inscriptions peut rester activée pendant le développement. Les adresses externes ne reçoivent toutefois pas les e-mails avec le SMTP par défaut ; l'inscription publique ne doit pas être annoncée comme opérationnelle.
- Aucun SMTP transactionnel externe n'est configuré tant que le domaine d'envoi n'est pas disponible : [#402](https://github.com/Nabouna32/Namesia/issues/402).
- Aucun fournisseur payant ni changement de plan n'est autorisé sans accord explicite.
- Seule la branche `main` déploie la production.
- Sur le commit `36a9e90c8cb35564d38109daead535eb48a5c775`, le build et le déploiement Cloudflare de production ont réussi, mais la vérification post-déploiement a échoué sur la présence de la référence Open Graph dans le HTML de `/prenoms/alice`. Le Worker a bien été déployé (version `cb4f2f93-dd5d-4b61-860c-a0a0051d5dcc`), mais la validation complète de la production n'est pas verte.

## Travaux en cours

- **PR #403 —** [Comptes Namesia et favoris liés au compte](https://github.com/Nabouna32/Namesia/pull/403) fusionnée dans `main` le 27 novembre 2026, commit `36a9e90c8cb35564d38109daead535eb48a5c775`.
- **PR #407 —** [Refonte et structuration de la documentation](https://github.com/Nabouna32/Namesia/pull/407) fusionnée dans `main` le 27 novembre 2026, commit `34b8f3a12b054d6cdcf4667e71cd5a9d2d71170e`. L'issue [#406](https://github.com/Nabouna32/Namesia/issues/406) est clôturée.
- La CI de vérification de `main` sur le commit `34b8f3a12b054d6cdcf4667e71cd5a9d2d71170e` a réussi. Le Worker Cloudflare a été déployé (version `efea3f64-ae55-4a9d-b930-dddf1ecce35d`), mais le contrôle post-déploiement a échoué sur la présence de la chaîne `opengraph-image` dans le HTML de `/prenoms/alice`.
- L'issue [#408](https://github.com/Nabouna32/Namesia/issues/408) suit l'investigation et la correction de ce contrôle Open Graph. Le déploiement est effectué, mais la validation complète de la production n'est pas encore verte.
- Les favoris sont désormais liés au compte dans `public.user_favorites`. Les anciens stockages locaux de favoris et d'historique sont supprimés sans migration ; l'historique reste suspendu.
- L'issue [#402](https://github.com/Nabouna32/Namesia/issues/402) suit la configuration du SMTP transactionnel après acquisition d'un domaine.
- L'issue [#404](https://github.com/Nabouna32/Namesia/issues/404) reste ouverte pour la suppression du compte et la gestion complète des données personnelles.
- L'issue [#405](https://github.com/Nabouna32/Namesia/issues/405) attend l'arbitrage sur l'activation et la rétention de l'historique.

## Règles d'exploitation

- Une seule PR de travail ouverte à la fois.
- Vérifications, tests, type-check et build exclusivement via GitHub Actions ; aucun contrôle local.
- Ne pas annoncer une vérification réussie avant le résultat CI correspondant.
- Ne jamais fusionner ni déployer avant validation de la CI et des prérequis de mise en service.
