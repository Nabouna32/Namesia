# ADR-0001 — Séparer génération IA et publication

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:08:26 (Europe/Paris)
- **Réexamen le :** 2026-11-22 (heure non consignée)
- **Décision prise le :** 2026-11-21 (heure non consignée)

## Contexte

Les fiches Namesia sont produites à l'aide d'un modèle IA, depuis une API externe ou une conversation. Une sortie peut contenir des erreurs, des approximations ou des formulations trompeuses. La génération et l'intégration en base ne constituent pas une vérification factuelle.

## Décision

La génération produit un JSON candidat conforme au contrat Namesia. L'import :
1. valide la syntaxe et la structure du JSON ;
2. contrôle les types, limites et propriétés autorisées ;
3. attribue côté serveur l'identité, le numéro de version et le statut ;
4. crée une nouvelle version en brouillon.

La prévisualisation et la publication sont des actions séparées. La publication est explicite et réservée à un compte administrateur autorisé. Une nouvelle publication archive la version précédente.

**La revue administrative n'est pas une validation scientifique ou documentaire.** Namesia ne promet pas de vérification indépendante du contenu.

## Options écartées

- Publication directe depuis le modèle : le modèle ne doit jamais décider du statut public.
- Import qui remplace la version courante : il ferait perdre l'historique et rendrait le retour arrière difficile.
- Workflow de preuve et validation multi-relecteurs : complexité non justifiée par le fonctionnement éditorial actuel.

## Conséquences

- Le JSON est un contrat d'échange versionné.
- Le statut et le numéro de version sont contrôlés par le backend.
- Les contenus publiés restent consultables tant qu'une nouvelle version n'est pas explicitement publiée.
- La validité structurelle ne garantit pas l'exactitude du texte.
