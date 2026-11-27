# Sécurité du navigateur et des sessions — Namesia

- **Version :** 1.1
- **Mis à jour le :** 2026-11-27 20:45:42 (Europe/Paris)
- **Portée :** en-têtes HTTP, protections navigateur et état de session administrateur

Ce document décrit les protections applicatives côté navigateur. Les politiques Auth, RLS et données sont détaillées dans [Supabase](SUPABASE.md) ; l'architecture globale est décrite dans [ARCHITECTURE.md](../ARCHITECTURE.md).

## En-têtes HTTP et sécurité du navigateur

Next.js applique les en-têtes de sécurité communs à toutes les routes dans `next.config.ts` :

- `X-Content-Type-Options: nosniff` empêche le navigateur de deviner un type MIME différent de celui annoncé.
- `X-Frame-Options: DENY` interdit l'intégration de Namesia dans une frame, qui n'est pas un parcours produit pris en charge.
- `Referrer-Policy: strict-origin-when-cross-origin` limite les informations de navigation transmises aux autres origines sans supprimer le référent sur les liens internes.
- `Permissions-Policy` désactive caméra, microphone et géolocalisation, fonctionnalités que l'application ne demande pas.

Les en-têtes sont appliqués au niveau Next.js à l'ensemble des routes, y compris les routes API. Ne pas ajouter de politique CSP restrictive sans inventorier d'abord les scripts et styles inline produits par Next.js et les intégrations réellement utilisées. HSTS relève du domaine HTTPS et de sa configuration d'hébergement ; ne pas activer `includeSubDomains` ou `preload` sans maîtriser tous les sous-domaines concernés.

## Vérification de session administrateur

La session Supabase et le droit d'accès administrateur sont deux états distincts. La vérification de rôle rejette toute réponse autre qu'un booléen explicite et propage les erreurs réseau ou RPC vers l'interface. Le client affiche un état d'erreur au lieu de rester indéfiniment en chargement ou de confondre une panne avec un refus d'accès.

Les changements de session peuvent se chevaucher (lecture initiale et événements d'authentification). Chaque vérification est versionnée : seule la réponse correspondant au dernier événement peut modifier l'état. Le démontage du composant invalide les opérations encore en cours. Aucune session ancienne ou réponse tardive ne doit rétablir un accès révoqué.


Les routes administrateur appliquent le contrôle d'origine avant la vérification de session pour toute mutation :
- GET sans session : 401 (authentification requise) ;
- POST sans en-tête Origin valide : 403 (protection CSRF) ;
- POST avec Origin correspondant à l'origine de la requête mais sans session : 401.

Cette différence est intentionnelle. Un POST sans Origin ne doit pas être attendu à 401 : le contrôle CSRF le rejette avant l'authentification. Le workflow post-déploiement vérifie séparément ces trois cas.
