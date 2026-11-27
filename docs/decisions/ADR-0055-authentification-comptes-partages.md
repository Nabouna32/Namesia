# ADR-0055 — Authentification des comptes Namesia par mot de passe

- **Statut :** acceptée
- **Version :** 1.4
- **Décision prise le :** 2026-11-27 13:20:36 (Europe/Paris)
- **Mis à jour le :** 2026-11-27 13:28:12 (Europe/Paris)
- **Décideur :** propriétaire de Namesia
- **Portée :** comptes visiteurs, sessions et autorisations administrateur

## Contexte

Namesia doit proposer des comptes classiques, sans imposer de connexion pour consulter le catalogue ou les fiches publiques. Le propriétaire refuse un parcours exclusivement passwordless et souhaite que les administrateurs soient des comptes ordinaires auxquels des droits supplémentaires sont attribués.

L'ancienne ADR-0049 imposait la protection HIBP de Supabase avant toute introduction de mot de passe. Cette contrainte conduisait à rendre un abonnement Supabase Pro obligatoire pour un contrôle que le propriétaire ne souhaite pas activer.

## Challenge

- **Majuscule, chiffre et symbole obligatoires :** ces règles sont encore courantes dans des formulaires, mais elles ne constituent pas la recommandation actuelle du NIST ou de l'OWASP. Elles favorisent des transformations prévisibles et compliquent la mémorisation.
- **Minimum de 8 caractères :** c'est un seuil historique encore fréquent et le minimum recommandé par Supabase dans ses réglages génériques. Il est inférieur au seuil NIST actuel pour un mot de passe utilisé seul.
- **Minimum de 15 caractères :** cohérent avec NIST SP 800-63B-4 pour un mot de passe constituant le seul facteur de connexion. Il augmente la longueur minimale sans imposer de composition arbitraire.
- **Protection HIBP obligatoire :** elle nécessite un forfait Supabase payant et n'est pas une condition universelle pour mettre en place une authentification par mot de passe. Le propriétaire ne souhaite pas souscrire à ce forfait pour cette seule fonctionnalité.
- **Authentification distincte pour l'administration :** elle dupliquerait les identités, les sessions et la récupération de compte. Les droits doivent être séparés de l'identité.

## Décision

### Identité et parcours

- Supabase Auth est l'unique fournisseur d'identité pour les comptes visiteurs et administrateurs.
- Les parcours disponibles sont l'inscription, la connexion e-mail/mot de passe, la confirmation d'adresse, la récupération et la modification du mot de passe, ainsi que la déconnexion.
- Le parcours de compte est facultatif et accessible sur `/compte`.
- La consultation du catalogue, la recherche et la lecture des fiches publiques restent accessibles sans compte.
- Les administrateurs utilisent exactement le même compte que les visiteurs. Le rôle est attribué séparément dans `private.admin_users`, hors du navigateur et jamais via `user_metadata` ou une autre donnée modifiable par l'utilisateur.
- Les comptes administrateurs déjà présents dans Supabase Auth conservent leur identifiant et leur autorisation. Leur premier mot de passe est défini par le parcours de récupération.

### Politique de mot de passe

- Minimum de **15 caractères Unicode**.
- Aucune obligation de majuscule, chiffre ou symbole.
- Espaces et phrases de passe acceptés.
- Pas de renouvellement périodique imposé.
- Limite technique de **72 octets UTF-8** appliquée par l'implémentation actuelle de Supabase Auth ; l'application la vérifie sans tronquer le mot de passe.
- Le mot de passe est transmis à Supabase Auth via HTTPS ; Namesia ne le stocke jamais et ne réalise pas son propre hachage.

### Contrôles de sécurité

- Le flux PKCE de Supabase Auth est utilisé avec `@supabase/ssr` et des cookies de même origine.
- Les routes API lisent la session depuis les cookies et vérifient l'identité avec `auth.getUser()` ; l'interface ne transmet plus les jetons d'accès dans des en-têtes Bearer.
- Les mutations administrateur exigent un en-tête `Origin` strictement égal à l'origine de la requête ; les routes GET restent en lecture seule.
- Les cookies sont de même origine, `SameSite=Lax` et `Secure` en production. Ils ne sont pas `HttpOnly`, car le client navigateur Supabase doit les lire ; la prévention des XSS reste donc essentielle.
- Les erreurs de connexion et de récupération sont formulées de manière générique pour limiter l'énumération des comptes.
- La confirmation de l'adresse e-mail reste activée.
- Les limites de débit natives de Supabase Auth protègent les endpoints d'inscription, de connexion et de récupération ; leurs valeurs de production doivent être vérifiées.
- Les routes administrateur vérifient le jeton avec `auth.getUser()`, puis contrôlent l'autorisation via la base. L'état du navigateur ne suffit jamais à accorder un droit.
- Aucune clé privilégiée Supabase n'est envoyée au navigateur.

### Compromis assumé

- La protection HIBP des mots de passe compromis n'est pas activée et n'est pas un prérequis. Aucun passage à Supabase Pro n'est imposé.
- Namesia ne revendique donc pas une conformité complète à NIST SP 800-63B-4 : le référentiel demande également un contrôle des mots de passe communs, attendus ou compromis.
- Cette décision est réexaminable si le risque, le volume d'utilisateurs ou le contexte économique évolue.

## Conséquences

- Les comptes visiteurs et administrateurs partagent la même identité et les mêmes parcours.
- La table privée `private.admin_users` ne stocke que l'attribution du droit administrateur ; elle n'est pas un système d'authentification distinct.
- L'ancienne ADR-0049 est remplacée.
- Les e-mails de confirmation et de récupération nécessitent un SMTP transactionnel personnalisé pour délivrer les messages à des adresses externes à l'équipe Supabase. Le service SMTP par défaut est réservé aux membres de l'équipe et limité à deux messages par heure au moment de la décision. La configuration est suivie dans l'issue #402.
- Les favoris et l'historique restent régis par leurs décisions et leur stockage actuels ; leur synchronisation serveur, la suppression de compte et les contrôles de conservation ne sont pas réputés livrés par cette ADR.

## Validation

- Les tests de contrat vérifient la présence des flux e-mail/mot de passe et l'absence du flux OTP de connexion.
- Les tests unitaires vérifient le minimum de 15 caractères, le comptage Unicode et la limite de 72 octets UTF-8.
- La CI GitHub Actions reste l'unique mécanisme de vérification du code.

## Références

- NIST SP 800-63B-4, juillet 2025 : https://pages.nist.gov/800-63-4/sp800-63b.html
- NIST SP 800-63B-4 — FAQ : https://pages.nist.gov/800-63-4-Implementation-Resources/faqs/
- OWASP Authentication Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- Supabase Auth — Password-based Auth : https://supabase.com/docs/guides/auth/passwords
- Supabase Auth — Password Security : https://supabase.com/docs/guides/auth/password-security
- Supabase Auth — Custom SMTP : https://supabase.com/docs/guides/auth/auth-smtp
- Supabase Auth — Server-Side Rendering : https://supabase.com/docs/guides/auth/server-side
- Implémentation Supabase Auth — limite bcrypt de 72 octets, commit immuable : https://github.com/supabase/auth/blob/d7955e9eb54003c4abbd7808e774c810d5d3e6cc/internal/api/password.go
