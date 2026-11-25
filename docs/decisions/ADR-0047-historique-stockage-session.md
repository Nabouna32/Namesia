# ADR-0047 — Le stockage de session est la source de vérité de l’historique

- **Statut :** acceptée
- **Date :** 2026-11-25
- **Portée :** historique de navigation du site public

## Contexte

L’historique de consultation est défini comme une donnée de session, conservée dans `sessionStorage`. Le fournisseur maintenait pourtant un état React indépendant et continuait à accepter les consultations lorsque le navigateur refusait le stockage. L’interface affichait alors un historique en mémoire, perdu au rechargement, tout en signalant cette dégradation.

Cette seconde source de vérité rendait le comportement moins prévisible : une action pouvait sembler enregistrée sans l’être durablement dans la session.

## Challenge

- **Conserver l’état mémoire en cas d’échec :** l’historique reste temporairement utilisable, mais sa persistance devient conditionnelle et le contrat produit change silencieusement.
- **Désactiver l’historique sans stockage :** l’action est explicite et l’état affiché correspond toujours à la donnée effectivement conservée.

## Décision

`sessionStorage` est l’unique source de vérité de l’historique.

- Le fournisseur lit le stockage à son initialisation.
- Chaque ajout, retrait ou effacement écrit la nouvelle valeur dans `sessionStorage` avant de modifier l’état React.
- Si la lecture ou l’écriture échoue, l’erreur est exposée et aucune valeur volatile n’est présentée comme un historique conservé.
- Une écriture réussie rétablit le fonctionnement et efface l’état d’erreur.
- Aucune synchronisation inter-onglets ou persistance serveur n’est ajoutée.

## Conséquences

- L’interface n’affiche plus de résultat qui disparaîtra au prochain rechargement.
- Les navigateurs qui bloquent le stockage désactivent cette fonction et reçoivent un message explicite.
- Le contrat est couvert par un test qui vérifie l’ordre écriture/mise à jour et l’absence de mutation mémoire en cas d’échec.

## Validation

La CI GitHub Actions exécute les tests de contrat, le contrôle TypeScript et le build. Aucun contrôle local n’est exécuté conformément à `AGENTS.md`.
