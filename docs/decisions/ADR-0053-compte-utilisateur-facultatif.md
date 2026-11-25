# ADR-0053 — Compte utilisateur facultatif

- **Statut :** accepté
- **Version :** 1.0
- **Décision prise le :** 2026-11-25 (heure non consignée)
- **Mis à jour le :** 2026-11-25 09:22:27 (Europe/Paris)
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
- Le compte est facultatif et sert au confort personnel : préférences et paramètres, favoris persistants et historique synchronisé entre appareils.
- L'absence de compte ne doit pas être utilisée pour dégrader l'expérience publique ni déclencher des sollicitations d'inscription bloquantes.
- Les fonctionnalités personnelles liées au compte doivent prévoir l'accès, la modification et la suppression des données par leur titulaire.

## Conséquences

- Les pages et parcours publics ne dépendent pas de l'état d'authentification.
- L'architecture doit séparer clairement les données publiques du catalogue et les données privées propres à chaque compte.
- Les favoris et l'historique persistants nécessitent une conception de sécurité, de confidentialité, de rétention et de suppression avant leur implémentation.
- Les choix précis d'authentification, de récupération de compte, de conservation de l'historique et de migration des favoris existants restent à définir dans un ADR technique dédié.

## Réexamen

Réexaminer cette décision si des retours utilisateurs démontrent un besoin réel, sans remettre en cause par défaut le principe d'accès libre aux fiches publiques.
