# Politique de maintenance des ADR

- **Version :** 1.2
- **Mis à jour le :** 2026-11-28 06:18:09 (Europe/Paris)

Ce document définit le cycle de vie des décisions d'architecture de Namesia. Il s'applique à toute contribution humaine ou assistée par IA, indépendamment de l'historique des conversations.

## 1. Rôle d'une ADR

Une ADR conserve une décision structurante qui reste utile pour comprendre ou faire évoluer l'architecture.

Elle documente :
- le problème et les contraintes déterminantes ;
- les options réellement examinées et leurs compromis ;
- la décision retenue et sa justification ;
- les conséquences et les exigences de vérification ;
- les références nécessaires à sa compréhension.

Une ADR n'est pas un journal de développement, un historique de commits ou un compte rendu exhaustif des modifications.

Les détails d'implémentation qui n'ont plus de valeur décisionnelle appartiennent à l'historique Git. Les règles toujours applicables appartiennent aux documents canoniques de leur domaine.

## 2. Création

Créer une ADR lorsqu'un choix :
- engage durablement l'architecture ou les contrats techniques ;
- introduit une contrainte structurante pour les évolutions futures ;
- écarte des alternatives dont le retour aurait un coût significatif ;
- mérite une justification indépendante de la conversation qui l'a fait émerger.

Ne pas créer une ADR pour une correction locale, une évolution d'interface ordinaire ou une décision déjà couverte par une ADR existante.

Avant toute création, rechercher les décisions proches et vérifier si une mise à jour est préférable.

Les identifiants sont uniques, séquentiels et ne sont jamais réutilisés, même après suppression d'une ADR.

## 3. Mise à jour

Modifier une ADR existante lorsque le besoin, le périmètre et la décision restent fondamentalement les mêmes.

Créer une nouvelle ADR lorsqu'un choix indépendant est pris ou lorsqu'une nouvelle décision remplace substantiellement une décision précédente.

Une mise à jour :
- conserve l'identifiant ;
- incrémente la version lors d'une évolution substantielle ;
- actualise la date de mise à jour ;
- conserve la date initiale de décision ;
- explique les changements de portée lorsqu'ils sont significatifs.

Ne pas ajouter une chronologie de chaque correction : l'historique Git suffit.

## 4. Statuts

Les statuts normalisés sont :

- **active** : décision encore applicable ;
- **remplacée** : décision entièrement remplacée par une ou plusieurs nouvelles ADR ;
- **retirée** : décision explicitement abandonnée sans remplacement ;
- **obsolète** : décision devenue sans objet ou inapplicable.

Une décision partiellement remplacée reste au statut `active`. Ajouter le champ `Remplacement partiel` pour distinguer la portée encore applicable de celle remplacée.

Une ADR remplacée, retirée ou obsolète n'a pas vocation à être conservée automatiquement.

## 5. Remplacement

Lorsqu'une nouvelle ADR remplace une décision :
1. la nouvelle ADR explique le besoin et la portée du remplacement ;
2. elle référence l'ancienne décision ;
3. l'ancienne ADR indique son statut remplacé et la décision qui lui succède ;
4. les documents canoniques sont actualisés pour refléter la décision courante.

Ne jamais laisser deux décisions contradictoires apparaître simultanément comme actives.

Un remplacement partiel doit préciser les exigences qui restent applicables dans l'ancienne ADR.

## 6. Retrait et suppression

Avant tout retrait ou suppression, effectuer une recherche des dépendances dans :
- le code et la configuration ;
- les tests et scripts de vérification ;
- les autres ADR ;
- les documents canoniques et les index ;
- les issues et PR pertinentes lorsque leur contexte apporte une information utile.

Déterminer si la décision contient encore une exigence applicable.

Si une exigence reste valable :
1. la transférer dans le document canonique de son domaine ;
2. vérifier que le document décrit l'implémentation réelle ;
3. corriger les références et les tests concernés.

Supprimer le fichier lorsque :
- sa décision n'est plus applicable ;
- son contenu utile est déjà repris ailleurs ou n'a plus de valeur ;
- aucune référence nécessaire ne dépend encore du fichier.

Conserver une ADR remplacée uniquement si son contexte apporte une information décisionnelle encore utile et non récupérable autrement.

Ne jamais conserver une décision uniquement par réflexe patrimonial. Git conserve son historique.

Ne jamais supprimer une décision encore active sans transférer préalablement ses exigences utiles.

Les identifiants supprimés ne sont jamais réattribués.

## 7. Audit périodique

Réexaminer les ADR :
- lors de tout chantier touchant directement leur domaine ;
- lorsqu'une évolution technique rend leurs hypothèses incertaines ;
- lors d'un audit transversal périodique, au minimum annuel.

L'audit vérifie :
- l'applicabilité réelle de la décision ;
- sa cohérence avec le code et la configuration ;
- sa cohérence avec les documents canoniques ;
- les références entrantes et sortantes ;
- l'existence éventuelle d'une décision plus récente.

Une date ancienne ne suffit jamais à rendre une ADR obsolète.

## 8. Métadonnées et nommage

Tous les documents Markdown maintenus portent :
- un numéro de version ;
- une date et heure de dernière mise à jour au format `AAAA-MM-JJ HH:mm:ss (Europe/Paris)`.

Chaque ADR porte également, avec ces libellés normalisés :
- `Statut` : exactement `active`, `remplacée`, `retirée` ou `obsolète` ;
- `Version` : numéro de version documentaire ;
- `Décision prise le` : date et heure exactes lorsqu'elles sont connues ; sinon la date connue suivie de `(heure non consignée)` ;
- `Mis à jour le` : date et heure de la dernière mise à jour documentaire.

Si la date historique est connue mais que l'heure n'a pas été consignée, utiliser explicitement `AAAA-MM-JJ (heure non consignée)`. Ne jamais inventer une heure ou antidater une décision.

Lorsqu'une ADR ne possède pas de champ `Mis à jour le`, le renseigner avec la date et l'heure réelles de la normalisation documentaire. Cet horodatage indique quand la fiche a été normalisée ; il ne remplace jamais et ne doit jamais être interprété comme la date de décision.

Les évolutions substantielles incrémentent la version. Les corrections purement typographiques actualisent uniquement la date.

Les ADR utilisent le format :
`ADR-NNNN-ENGLISH-DESCRIPTIVE-SLUG.md`

Les noms descriptifs Markdown sont en anglais, en majuscules et en `UPPERCASE-KEBAB-CASE.md`. Les dossiers restent en minuscules.

Les noms imposés par l'écosystème, notamment `README.md` et `AGENTS.md`, sont conservés.

La CI vérifie les métadonnées, les identifiants, les statuts, le nommage et les références locales. Elle ne prétend pas vérifier la véracité historique d'une date.

## 9. Registre

`docs/decisions/README.md` est exclusivement l'index des ADR conservées.

La présente politique est un document distinct. Elle est référencée depuis `AGENTS.md` et le registre des décisions.

Toute modification du registre doit être accompagnée de la mise à jour des références concernées et des tests de contrat.
