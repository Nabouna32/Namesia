# Supabase — Données, authentification et exploitation

- **Version :** 1.0
- **Mis à jour le :** 2026-11-27 20:00:48 (Europe/Paris)

## Périmètre et sources de vérité

Supabase fournit la base PostgreSQL et Supabase Auth de Namesia. Le dépôt ne contient pas de `supabase/config.toml` ; les migrations SQL versionnées dans [`supabase/migrations/`](../../supabase/migrations/) et le schéma réellement appliqué au projet connecté sont les références pour la base.

Les paramètres exécutés restent dans le Dashboard Supabase et ne doivent pas être supposés à partir de ce document. Ce guide décrit les invariants applicatifs et les procédures de maintenance.

## Configuration applicative

Les seules variables publiques attendues par les clients sont :
- `NEXT_PUBLIC_SUPABASE_URL` ;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Elles sont validées exclusivement par [`lib/supabase/config.ts`](../../lib/supabase/config.ts). Les clients navigateur, serveur et session sont séparés dans `lib/supabase/`. Le type [`lib/supabase/database.types.ts`](../../lib/supabase/database.types.ts) est généré depuis le schéma actif ; il ne doit pas être édité manuellement.

La clé publishable est destinée au navigateur et n'est pas une clé de service. Ne jamais exposer une clé `service_role`, un mot de passe de base ou une clé privée dans le code, le README, une issue ou un journal.

## Authentification

- Un seul système Supabase Auth par e-mail et mot de passe est partagé entre les visiteurs et l'administration.
- La création d'un compte ne confère aucun droit administrateur.
- Le rôle administrateur est attribué séparément dans `private.admin_users`.
- Le serveur vérifie l'identité avec `auth.getUser()` et les droits dans la table privée ; les métadonnées modifiables par l'utilisateur ne constituent jamais une autorisation.
- Les formulaires Namesia exigent huit caractères minimum, une majuscule et un chiffre, sans symbole obligatoire. Les préréglages serveur Supabase ne permettent pas d'exprimer exactement cette règle ; la composition peut être contournée par un appel direct à l'API Auth.
- La limite technique du mot de passe est de 72 octets UTF-8.
- La protection HIBP n'est pas activée ; ce compromis ne doit pas être présenté comme une conformité complète au NIST.

## E-mails et SMTP

Le SMTP Supabase par défaut est conservé pour le développement. Il est limité à deux e-mails par heure et aux destinataires membres de l'équipe du projet. Il ne convient pas à l'ouverture publique des confirmations et récupérations.

Aucun fournisseur externe n'est configuré tant que le domaine d'envoi n'est pas disponible. Le choix du domaine, la vérification DNS, la configuration SMTP, les URL de redirection et les essais de délivrabilité sont suivis dans [l'issue #402](https://github.com/Nabouna32/Namesia/issues/402). Aucun abonnement payant ne doit être activé sans accord explicite.

## Données et sécurité

- Les tables exposées au client utilisent RLS et des privilèges SQL minimaux.
- Les favoris sont stockés dans `public.user_favorites`, rattachés au propriétaire, limités aux prénoms publiés et protégés par RLS.
- Les droits d'administration résident dans le schéma privé.
- Les clients du navigateur ne reçoivent jamais de secret privilégié.
- Toute mutation sensible est validée côté serveur ; les politiques RLS restent une seconde frontière de sécurité.

Consulter [`DATA-MODEL.md`](../DATA-MODEL.md) pour le schéma et les relations, et les ADR liés à l'authentification pour les raisons des choix.

## Migrations SQL

Avant toute évolution :
1. comparer l'historique des migrations appliquées dans le projet Supabase avec les fichiers de `supabase/migrations/` ;
2. vérifier que chaque version appliquée possède un fichier dont le préfixe correspond exactement à la version distante ;
3. ne jamais réécrire une migration déjà appliquée ;
4. corriger un schéma appliqué par une nouvelle migration additive ;
5. examiner les policies RLS, les privilèges par colonne, les index, les contraintes et les suppressions en cascade ;
6. régénérer `lib/supabase/database.types.ts` depuis le schéma actif ;
7. faire relire les changements par la CI GitHub Actions.

Les migrations appliquées sont immuables. Ne pas conserver un doublon horodaté ou une séquence abandonnée qui crée puis détruit un modèle refusé.

## Vérifications et exploitation

- Consulter Supabase Advisors après une modification de schéma ou de sécurité.
- Une alerte d'index inutilisé sur une table récente ne justifie pas automatiquement sa suppression ; vérifier les usages de FK, de jointure et de cascade.
- Ne pas interpréter l'absence d'alerte Advisor comme une preuve complète de sécurité.
- Ne jamais utiliser des données de production privées dans les Previews.
- Les paramètres Auth (inscriptions, confirmation e-mail, redirections, limites de débit et SMTP) se vérifient dans le Dashboard ; le dépôt n'en constitue pas une source fiable.
