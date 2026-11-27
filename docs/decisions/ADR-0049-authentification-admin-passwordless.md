# ADR-0049 — Authentification administrateur passwordless

- **Statut :** remplacée par [ADR-0055 — Authentification des comptes Namesia par mot de passe](ADR-0055-authentification-comptes-partages.md)
- **Version :** 1.1
- **Décision prise le :** 2026-11-25 (heure non consignée)
- **Mis à jour le :** 2026-11-27 13:20:36 (Europe/Paris)
- **Portée :** historique de l'authentification administrateur avant l'ouverture des comptes visiteurs

## Contexte historique

L'administration utilisait Supabase Auth avec `signInWithOtp` et des liens de connexion envoyés par e-mail. `shouldCreateUser: false` imposait que le compte administrateur existe déjà ; l'application ne créait pas de compte depuis l'écran de connexion.

Le Security Advisor Supabase signalait `auth_leaked_password_protection` parce que la protection contre les mots de passe compromis était désactivée.

## Décision historique

La décision initiale consistait à conserver une authentification administrateur passwordless par lien OTP e-mail et à ne pas introduire de mot de passe sans activer préalablement la protection HIBP sur un forfait compatible.

Cette décision est désormais remplacée. Elle ne constitue plus une contrainte applicable au code courant.

## Motif du remplacement

Le propriétaire a confirmé le besoin d'un système de comptes classique par adresse e-mail et mot de passe, commun aux visiteurs et aux administrateurs. Le coût récurrent de Supabase Pro uniquement pour activer HIBP n'est pas retenu. La politique actuelle et ses compromis sont consignés dans ADR-0055.

## Références

- [ADR-0055 — Authentification des comptes Namesia par mot de passe](ADR-0055-authentification-comptes-partages.md)
- Supabase Auth — Password security : https://supabase.com/docs/guides/auth/password-security
