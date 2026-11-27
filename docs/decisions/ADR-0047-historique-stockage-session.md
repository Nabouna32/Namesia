# ADR-0047 — Ancienne décision de stockage local de l’historique

- **Statut :** remplacée par ADR-0053 et suspendue dans l'attente de l'arbitrage #405
- **Version :** 1.1
- **Mis à jour le :** 2026-11-27 15:13:01 (Europe/Paris)
- **Date :** 2026-11-25
- **Portée :** historique de navigation du site public

## Contexte

L’historique de consultation est défini comme une donnée de session, conservée dans `sessionStorage`. Le fournisseur maintenait pourtant un état React indépendant et continuait à accepter les consultations lorsque le navigateur refusait le stockage. L’interface affichait alors un historique en mémoire, perdu au rechargement, tout en signalant cette dégradation.

Cette seconde source de vérité rendait le comportement moins prévisible : une action pouvait sembler enregistrée sans l’être durablement dans la session.

## Challenge

- **Conserver l’état mémoire en cas d’échec :** l’historique reste temporairement utilisable, mais sa persistance devient conditionnelle et le contrat produit change silencieusement.
- **Désactiver l’historique sans stockage :** l’action est explicite et l’état affiché correspond toujours à la donnée effectivement conservée.

## Ancienne décision (historique)

`sessionStorage` avait été retenu comme source de vérité pour l'historique temporaire de navigation. Cette décision n'est plus applicable depuis l'adoption du compte facultatif et des fonctions personnelles liées au compte dans ADR-0053.

## État actuel

- Le code de stockage `sessionStorage` et ses utilitaires sont supprimés. Aucune ancienne donnée n'est lue, supprimée, migrée ou récupérée.
- Aucune visite n'est actuellement enregistrée, localement ou côté serveur.
- L'historique cible doit être privé, associé au compte, activé explicitement, limité dans le temps et effaçable.
- L'activation et la durée de conservation proposées sont suivies dans l'issue [#405](https://github.com/Nabouna32/Namesia/issues/405).

## Conséquences

- L'ancienne persistance locale est désactivée et les visites ne sont plus enregistrées avant l'arbitrage #405.
- La consultation des fiches reste libre, sans compte ni collecte d'historique.

## Validation

La CI GitHub Actions vérifie que le code historique ne lit ni n'écrit plus dans le stockage local. Aucun contrôle local n'est exécuté conformément à `AGENTS.md`.
