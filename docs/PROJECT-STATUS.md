# État du projet — Namesia

- **Statut :** PRÉ-LANCEMENT / DÉVELOPPEMENT
- **Version :** 2.8
- **Mis à jour le :** 2026-11-28 06:40:43 (Europe/Paris)

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
- Le déploiement du commit `d9901bd26f23e5639fb893f60449a69a5d67dd3a` est validé. La CI de vérification, l'audit des workflows, le build Cloudflare et le contrôle post-déploiement ont tous réussi (run [#46059472795](https://github.com/Nabouna32/Namesia/actions/runs/46059472795)).
- Le contrôle post-déploiement vérifie désormais la balise `og:image` réellement annoncée (HTTP 200, `image/png`), robots.txt et le sitemap, l'API publique, la configuration Auth et les statuts attendus de la frontière administrateur.

## Travaux en cours

- **PR #403 —** [Comptes Namesia et favoris liés au compte](https://github.com/Nabouna32/Namesia/pull/403) fusionnée dans `main` le 27 novembre 2026.
- **PR #407 —** [Refonte et structuration de la documentation](https://github.com/Nabouna32/Namesia/pull/407) fusionnée dans `main`. Le README racine sert d'index, AGENTS.md contient le socle commun et les procédures détaillées sont réparties par domaine.
- Les PR #409, #410, #412 et #414 ont fiabilisé les contrôles post-déploiement Open Graph, robots.txt et CSRF ; la dernière exécution de production est entièrement verte.
- **PR #417 —** [Refondre la gouvernance et le registre des ADR](https://github.com/Nabouna32/Namesia/pull/417) : refonte documentaire en cours ; les contrôles CI automatisés des métadonnées, du nommage, du registre, de l'index et des références locales sont en cours d'intégration dans cette PR ; le périmètre couvre aussi la notice d'attribution des Material Symbols dans `licenses/`. Leur activation ne sera confirmée qu'après réussite de la CI sur le nouveau SHA.
- Les issues #406, #408, #411 et #413 sont clôturées.
- L'issue [#402](https://github.com/Nabouna32/Namesia/issues/402) reste ouverte pour la configuration du SMTP transactionnel après acquisition d'un domaine.
- L'issue [#404](https://github.com/Nabouna32/Namesia/issues/404) reste ouverte pour la suppression du compte et la gestion complète des données personnelles.
- L'issue [#405](https://github.com/Nabouna32/Namesia/issues/405) attend l'arbitrage sur l'activation et la rétention de l'historique.

## Règles d'exploitation

- Une seule PR de travail ouverte à la fois.
- Vérifications, tests, type-check et build exclusivement via GitHub Actions ; aucun contrôle local.
- Ne pas annoncer une vérification réussie avant le résultat CI correspondant.
- Ne jamais fusionner ni déployer avant validation de la CI et des prérequis de mise en service.
