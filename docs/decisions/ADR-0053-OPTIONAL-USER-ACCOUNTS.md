# ADR-0053 — Compte utilisateur facultatif

- **Statut :** active
- **Version :** 1.3
- **Décision prise le :** 2026-11-25 (heure non consignée)
- **Mis à jour le :** 2026-11-28 06:05:17 (Europe/Paris)
- **Décideur :** propriétaire de Namesia

## Contexte

Namesia doit proposer des fonctions personnelles utiles sans transformer la consultation des fiches en parcours d'inscription. Les favoris et l'historique doivent pouvoir être conservés côté serveur et retrouvés entre appareils, tandis que les visiteurs qui ne souhaitent pas de compte doivent continuer à profiter du site normalement.

## Options examinées

1. Rendre le compte obligatoire pour accéder au site ou à certaines fonctions publiques.
2. Ne proposer aucun compte et conserver les fonctions personnelles uniquement dans le navigateur.
3. Garder l'ensemble du contenu public libre et proposer un compte facultatif pour les fonctions personnelles.

## Décision

L'option 3 est retenue.

- La recherche, la découverte, la lecture des fiches publiques, la comparaison et le partage restent accessibles sans inscription ni connexion.
- Le compte est facultatif pour explorer Namesia, mais il est nécessaire pour utiliser les fonctions personnelles persistantes : favoris et historique synchronisés entre appareils. Ces données sont liées au compte, pas à un stockage local durable du navigateur.
- L'absence de compte ne doit pas être utilisée pour dégrader l'expérience publique ni déclencher des sollicitations d'inscription bloquantes.
- Les fonctionnalités personnelles liées au compte doivent prévoir l'accès, la modification et la suppression des données par leur titulaire.

## Conséquences

- Les pages et parcours publics ne dépendent pas de l'état d'authentification.
- L'architecture doit séparer clairement les données publiques du catalogue et les données privées propres à chaque compte.
- Les favoris sont implémentés dans `public.user_favorites`, stockés côté serveur et isolés par compte via RLS. Aucun mode local-only ne constitue le comportement cible. L'historique reste suspendu jusqu'à l'arbitrage #405 ; il devra être soumis à une activation claire, à une durée de conservation définie et à un effacement simple.
- Aucun transfert des anciennes données locales n'est proposé : le stockage local des favoris et de l'historique est supprimé sans migration, ce projet étant encore en développement. Les anciennes sélections locales sont abandonnées. L'import/export JSON reste disponible pour sauvegarder explicitement les favoris déjà associés au compte. La connexion n'est jamais requise pour consulter le catalogue, rechercher, lire ou partager une fiche.

## Réexamen

Réexaminer cette décision si des retours utilisateurs démontrent un besoin réel, sans remettre en cause par défaut le principe d'accès libre aux fiches publiques.
