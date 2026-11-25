# ADR-0049 — Authentification administrateur passwordless

- **Statut :** acceptée
- **Date :** 2026-11-25
- **Portée :** authentification des administrateurs dans l'application Namesia

## Contexte

L'administration utilise Supabase Auth avec \`signInWithOtp\` et des liens de connexion envoyés par e-mail. \`shouldCreateUser: false\` impose que le compte administrateur existe déjà ; l'application ne crée pas de compte depuis l'écran de connexion.

Le Security Advisor Supabase signale \`auth_leaked_password_protection\` parce que la protection contre les mots de passe compromis est désactivée. Cette fonction concerne les mots de passe lors de leur création ou de leur modification. L'application n'expose actuellement aucun flux de connexion, de création ou de modification par mot de passe.

## Challenge

- **Passer au forfait Pro pour activer la protection :** coût récurrent pour une capacité qui ne protège aucun parcours utilisé par l'application aujourd'hui.
- **Activer une authentification par mot de passe sans protection :** ajoute une surface d'attaque sans bénéfice produit et aggrave l'alerte actuelle.
- **Conserver le lien OTP et réexaminer avant toute évolution :** maintient un parcours simple, sans secret de mot de passe à gérer dans l'application.

## Décision

Conserver l'authentification administrateur passwordless par lien OTP e-mail.

- Les comptes administrateurs sont créés explicitement hors de l'écran de connexion.
- L'application utilise \`signInWithOtp\` avec \`shouldCreateUser: false\`.
- Aucun écran ou appel \`signInWithPassword\`, \`signUp\` ou \`updateUser\` pour définir un mot de passe n'est autorisé.
- Ne pas faire évoluer le forfait Supabase uniquement pour supprimer l'alerte \`auth_leaked_password_protection\` tant que l'application n'expose aucun flux mot de passe.
- Avant toute introduction d'un flux mot de passe, activer la protection contre les mots de passe compromis sur un forfait compatible, vérifier les parcours et relancer le Security Advisor.

## Conséquences

- L'alerte \`auth_leaked_password_protection\` reste visible dans Supabase Advisor ; elle est documentée comme non applicable au parcours OTP actuel, pas comme résolue.
- L'application ne gère aucun mot de passe administrateur.
- Toute évolution vers un flux mot de passe doit réexaminer cette décision et sa condition de sécurité.

## Références

- Supabase Auth — Password Security : https://supabase.com/docs/guides/auth/password-security
- Supabase Auth — Passwordless email logins : https://supabase.com/docs/guides/auth/auth-email-passwordless
