# ADR-0054 — Métadonnées et fraîcheur documentaire

- **Statut :** accepté
- **Version :** 1.0
- **Décision prise le :** 2026-11-25 09:22:27 (Europe/Paris)
- **Mis à jour le :** 2026-11-25 09:22:27 (Europe/Paris)
- **Décideur :** propriétaire de Namesia

## Contexte

La documentation du dépôt est la mémoire durable de Namesia. Sans métadonnées homogènes, il est difficile de distinguer un document récemment revu d'une règle ancienne qui n'a pas été réexaminée depuis longtemps. Un simple numéro de version sans date, ou une date sans historique de modification, ne suffit pas à rendre cette fraîcheur lisible.

## Options examinées

1. Ajouter une date librement aux documents au fil de l'eau, sans convention commune.
2. Imposer un versionnement et une date/heure à chaque correction, y compris typographique, avec migration immédiate de tout le dépôt.
3. Définir des métadonnées communes, incrémenter les versions lors des évolutions substantielles, actualiser la date/heure à chaque modification et migrer progressivement les documents existants.

## Décision

L'option 3 est retenue.

- Chaque document Markdown maintenu du dépôt porte une version et une date/heure de dernière mise à jour au format `AAAA-MM-JJ HH:mm:ss (Europe/Paris)`.
- Une évolution substantielle du contenu, du contrat ou de la décision incrémente la version. Une correction purement typographique actualise la date/heure sans imposer un incrément.
- Chaque ADR porte en plus sa date et heure de décision, son statut et sa version. Cette date de décision ne change pas lors d'une correction ultérieure.
- Aucune date historique ne doit être inventée. Si l'heure d'une décision ancienne n'a pas été consignée, le document le dit explicitement ; l'historique Git reste la source pour retrouver les commits antérieurs.
- Les documents existants sont mis au nouveau format lors de leur prochaine modification substantielle. Pas de migration de masse uniquement cosmétique.
- Une date ancienne déclenche un examen critique de la validité du document, mais ne l'invalide pas. Une décision reste applicable tant qu'un ADR ne la remplace ou ne la retire pas explicitement.

## Conséquences

- Les documents nouvellement créés sont datés dès leur création.
- Les PR qui modifient substantiellement un document mettent à jour sa version et sa date/heure.
- Les audits documentaires peuvent prioriser les références les plus anciennes et les décisions structurantes, en vérifiant aussi les liens externes, les hypothèses et l'état réel du produit.
- La convention reste légère : pas de journal de versions interne à chaque fichier, l'historique Git assurant le détail des changements.

## Réexamen

Réexaminer cette convention si le nombre de documents ou leur mode de génération rend les métadonnées manuelles plus coûteuses que leur valeur. Toute automatisation éventuelle doit éviter les modifications artificielles à chaque build.