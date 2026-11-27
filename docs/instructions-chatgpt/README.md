# Instructions ChatGPT de Namesia

- **Version :** 1.3
- **Mis à jour le :** 2026-11-27 11:02:00 (Europe/Paris)

Ce dossier contient deux modes d’instructions à copier dans les instructions du projet ChatGPT. Choisir le mode adapté à la mission ; ne pas fusionner les deux par défaut.

## Instructions à copier

- [Mode autonome](mode-autonome.txt) — à utiliser lorsque ChatGPT prend en charge les travaux de Namesia de façon autonome.
- [Mode discussion](mode-discussion.txt) — à utiliser pour réfléchir, challenger et concevoir avec le propriétaire, sans transformer automatiquement chaque accord exploratoire en ordre de développement.

Les deux fichiers restent volontairement au format **TXT** : leur contenu est destiné à être copié tel quel dans ChatGPT. Ils ne contiennent donc ni titre documentaire, ni version, ni date, ni compteur, ni rappel de limite de saisie, ni mise en forme Markdown susceptible d’être copiée inutilement.

## Répartition des responsabilités

Ces textes sont des résumés opérationnels, pas la documentation complète du projet. Ils conservent uniquement les règles nécessaires au rôle, à la langue, au challenge critique, aux limites d’autonomie et au renvoi vers la source de vérité.

- [AGENTS.md](../../AGENTS.md) porte les règles de contribution et de livraison.
- [État du projet](../etat-du-projet.md) décrit l’état réel du produit.
- Les documents thématiques et les ADR portent les détails techniques, les procédures et les décisions structurantes.

Une technologie ou un fournisseur particulier ne doit pas être ajouté aux instructions générales sauf s’il change une règle durable de comportement.

## Limites et entretien

La limite de référence de ChatGPT pour les instructions d'un projet est de **8 000 caractères par fichier**. Le test CI Namesia impose volontairement un budget plus strict de **5 000 caractères** à chacun des deux TXT, afin de conserver une marge de sécurité. Ce seuil CI est un choix de maintenance du dépôt, pas la limite de référence de ChatGPT.

Lors d’une évolution, modifier le fichier d’instructions concerné et ce README dans la même PR. Garder les textes copiables courts, cohérents et sous le budget CI. Ne pas intégrer aux fichiers TXT des compteurs, limites, dates, versions, historiques, explications sur leur propre format ou détails déjà couverts par la documentation canonique.

Vérifier que les deux modes restent cohérents sans les rendre redondants : le mode autonome décrit l’exécution et la livraison ; le mode discussion décrit l’accompagnement et la distinction entre réflexion et ordre d’agir.

Ne jamais déplacer une règle durable hors de la documentation canonique au seul motif qu’elle a été retirée des instructions copiables.
