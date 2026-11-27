# ADR-0055 — Authentification des comptes Namesia par mot de passe

- **Statut :** acceptée
- **Version :** 1.7
- **Décision prise le :** 2026-11-27 13:20:36 (Europe/Paris)
- **Mis à jour le :** 2026-11-27 14:23:11 (Europe/Paris)
- **Décideur :** propriétaire de Namesia
- **Portée :** comptes visiteurs, sessions et autorisations administrateur

## Contexte

Namesia doit proposer des comptes classiques, sans imposer de connexion pour consulter le catalogue ou les fiches publiques. Le propriétaire refuse un parcours exclusivement passwordless et souhaite que les administrateurs soient des comptes ordinaires auxquels des droits supplémentaires sont attribués.

L'ancienne ADR-0049 imposait la protection HIBP de Supabase avant toute introduction de mot de passe. Cette contrainte conduisait à rendre un abonnement Supabase Pro obligatoire pour un contrôle que le propriétaire ne souhaite pas activer.

## Challenge

- **Règles de composition :** elles ne sont pas recommandées par NIST/OWASP comme substitut à la longueur et aux contrôles de mots de passe compromis. Supabase Auth propose des préréglages serveur, mais `lower_upper_letters_digits` impose aussi une minuscule et `letters_digits` ne garantit pas une majuscule. Le propriétaire choisit de conserver exactement la règle « majuscule + chiffre » dans les formulaires, sans ajouter une exigence de minuscule.
- **Minimum de 8 caractères :** seuil inférieur aux 15 caractères recommandés par NIST pour un mot de passe utilisé seul. Il est retenu pour réduire la friction à l'inscription et augmente le risque en cas de mot de passe faible ou réutilisé.
- **Minimum de 15 caractères :** option plus robuste, mais écartée pour cette version.
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

- Minimum de **8 caractères Unicode**.
- Au moins une lettre majuscule Unicode et un chiffre sont exigés par les formulaires Namesia. Aucun symbole n'est obligatoire.
- Espaces et phrases de passe acceptés lorsqu'ils respectent ces deux critères.
- Pas de renouvellement périodique imposé.
- Limite technique de **72 octets UTF-8** appliquée par l'implémentation actuelle de Supabase Auth ; l'application la vérifie sans tronquer le mot de passe.
- Le mot de passe est transmis à Supabase Auth via HTTPS ; Namesia ne le stocke jamais et ne réalise pas son propre hachage.

### Contrôles de sécurité

- Le flux PKCE de Supabase Auth est utilisé avec `@supabase/ssr` et des cookies de même origine.
- Les routes API lisent la session depuis les cookies et vérifient l'identité avec `auth.getUser()` ; l'interface ne transmet plus les jetons d'accès dans des en-têtes Bearer.
- Les mutations administrateur exigent un en-tête `Origin` strictement égal à l'origine de la requête ; les routes GET restent en lecture seule.
- Le proxy Next.js rafraîchit la session sur les routes de compte et d'administration, puis impose `Cache-Control: private, no-store` pour éviter qu'une réponse contenant des cookies de session soit mise en cache.
- Les cookies sont de même origine, `SameSite=Lax` et `Secure` en production. Ils ne sont pas `HttpOnly`, car le client navigateur Supabase doit les lire ; la prévention des XSS reste donc essentielle.
- Les erreurs de connexion et de récupération sont formulées de manière générique pour limiter l'énumération des comptes.
- La confirmation de l'adresse e-mail reste activée.
- Les limites de débit natives de Supabase Auth protègent les endpoints d'inscription, de connexion et de récupération ; leurs valeurs de production doivent être vérifiées.
- Les routes administrateur vérifient le jeton avec `auth.getUser()`, puis contrôlent l'autorisation via la base. L'état du navigateur ne suffit jamais à accorder un droit.
- Aucune clé privilégiée Supabase n'est envoyée au navigateur.

### Compromis assumé

- Le minimum de 8 caractères peut être configuré côté Supabase Auth. Les exigences exactes de majuscule et de chiffre sont vérifiées dans les formulaires Namesia, mais aucun préréglage serveur ne les impose sans exiger aussi une minuscule ; un client qui appelle directement l'API Supabase peut donc contourner ces deux règles.
- La protection HIBP des mots de passe compromis n'est pas activée et n'est pas un prérequis. Aucun passage à Supabase Pro n'est imposé.
- Namesia ne revendique donc pas une conformité complète à NIST SP 800-63B-4 : le minimum choisi est inférieur au seuil NIST pour un mot de passe seul, et le contrôle des mots de passe communs, attendus ou compromis n'est pas activé.
- Cette décision est réexaminable si le risque, le volume d'utilisateurs ou le contexte économique évolue.

## Conséquences

- Les comptes visiteurs et administrateurs partagent la même identité et les mêmes parcours.
- La table privée `private.admin_users` ne stocke que l'attribution du droit administrateur ; elle n'est pas un système d'authentification distinct.
- L'ancienne ADR-0049 est remplacée.
- Les e-mails de confirmation et de récupération nécessitent un SMTP transactionnel personnalisé pour délivrer les messages à des adresses externes à l'équipe Supabase. Le service SMTP par défaut est réservé aux membres de l'équipe et limité à deux messages par heure : cela suffit aux essais internes de développement, mais pas à l'inscription publique. La configuration d'un SMTP transactionnel reste un prérequis avant l'ouverture publique et est suivie dans l'issue #402.
- Les favoris et l'historique doivent être liés au compte et synchronisés côté serveur ; ils ne doivent pas rester des fonctions persistantes locales. Leur mise en œuvre, la migration éventuelle des favoris déjà stockés dans le navigateur, la rétention de l'historique et la suppression complète des données sont suivies dans l'issue #404. Le compte reste facultatif pour explorer le catalogue et consulter les fiches.

## Validation

- Les tests de contrat vérifient la présence des flux e-mail/mot de passe et l'absence du flux OTP de connexion.
- Les tests unitaires vérifient le minimum de 8 caractères, la présence d'une majuscule et d'un chiffre, le comptage Unicode et la limite de 72 octets UTF-8.
- La CI GitHub Actions reste l'unique mécanisme de vérification du code.

## Références

- NIST SP 800-63B-4, juillet 2025 : https://pages.nist.gov/800-63-4/sp800-63b.html
- NIST SP 800-63B-4 — FAQ : https://pages.nist.gov/800-63-4-Implementation-Resources/faqs/
- OWASP Authentication Cheat Sheet : https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- Supabase Auth — Password-based Auth : https://supabase.com/docs/guides/auth/passwords
- Supabase Auth — Password Security et préréglages de composition : https://supabase.com/docs/guides/auth/password-security
- Supabase Auth — Mise à jour de la configuration Auth : https://supabase.com/docs/reference/api/v1-update-auth-service-config
- Supabase Auth — Custom SMTP : https://supabase.com/docs/guides/auth/auth-smtp
- Supabase Auth — Server-Side Rendering : https://supabase.com/docs/guides/auth/server-side
- Implémentation Supabase Auth — limite bcrypt de 72 octets, commit immuable : https://github.com/supabase/auth/blob/d7955e9eb54003c4abbd7808e774c810d5d3e6cc/internal/api/password.go
