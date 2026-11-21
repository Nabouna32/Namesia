# Pipeline de génération IA — Namesia

- **Statut :** spécification initiale
- **Version :** 1.0
- **Mis à jour :** 2026-11-21

## 1. Objectif

Produire des candidats de fiches structurés et traçables, sans permettre au modèle de publier, d'inventer des sources ou de masquer les incertitudes.

Le pipeline est indépendant du frontend et du fournisseur de modèle.

## 2. Entrées

Une demande de génération doit préciser :
- identifiant interne du prénom et graphie cible ;
- marché et langue ;
- périmètre des sections à produire ;
- version du schéma JSON ;
- version du prompt système et du prompt métier ;
- dossier de recherche contenant les sources déjà collectées et leurs identifiants ;
- éventuelles variantes ou hypothèses à examiner.

Le modèle ne doit pas recevoir l'instruction de « compléter tous les champs à tout prix ».

## 3. Étapes

1. **Préparer** : résoudre l'identité du prénom et réunir des sources vérifiées.
2. **Générer** : produire uniquement le JSON demandé, sans texte autour.
3. **Parser** : refuser toute sortie qui n'est pas un JSON strict.
4. **Valider le schéma** : appliquer exactement la version déclarée du JSON Schema.
5. **Valider les références** : chaque identifiant de source cité doit exister dans le dossier ; les URLs et références bibliographiques sont contrôlées hors du modèle.
6. **Valider le métier** : contrôler cohérence locale, langues, dates, unités, statuts de preuve, champs requis et absence de valeurs interdites.
7. **Contrôler les risques** : repérer les affirmations sans preuve, sources hors sujet, contradictions, formulations déterministes, contenu dupliqué et données personnelles.
8. **Revue humaine** : un relecteur corrige ou rejette le candidat.
9. **Approuver** : créer une version éditoriale immuable.
10. **Publier** : action explicite du backend ou d'un rôle autorisé ; jamais du modèle.

## 4. Contrat de sortie

- Le modèle retourne une fiche conforme à `schemas/fiche-prenom.schema.json`.
- Les faits doivent être décomposés en affirmations atomiques, chacune associée à ses sources.
- Une information inconnue reste inconnue.
- Les sources doivent provenir du dossier de recherche fourni ; le modèle ne peut pas créer de nouvel identifiant de source.
- Les associations symboliques doivent avoir un cadre explicite et le disclaimer canonique.
- Les métadonnées d'exécution (coût, tokens, identifiant de run, fournisseur) sont ajoutées par le backend, pas inventées par le modèle.
- Les statuts d'approbation et de publication sont exclusivement gérés côté serveur.

## 5. Contrôles métier obligatoires

### Références
- Tous les `source_ids` pointent vers une source présente.
- Toute affirmation marquée `etabli` ou `discute` possède au moins une source.
- La source doit réellement étayer l'affirmation après revue.
- Une source non consultée ou non vérifiée ne peut pas être qualifiée de vérifiée.

### Statistiques
- Les statistiques sont séparées du texte éditorial.
- Chaque observation possède une période, un territoire, une unité et une source.
- Les valeurs Insee respectent les limites de diffusion et l'arrondi publiés.
- Les données anciennes sont accompagnées des avertissements de couverture applicables.

### Symbolique
- Pas de formulation causale (« ce prénom rend… », « garantit… »).
- Pas de prédiction du caractère ou de l'avenir.
- Pas de pseudo-diagnostic ni de compatibilité présentée comme objective.
- Le cadre culturel ou éditorial est explicite.

### Qualité de texte
- Pas de remplissage destiné à atteindre une longueur.
- Pas de répétition entre résumé, étymologie et histoire.
- Pas de superlatifs ou de classements non sourcés.
- Pas de citations longues de sources protégées.
- Les variantes ne sont pas présentées comme synonymes sans justification.

## 6. Idempotence et reprise

- Une génération est identifiée par une empreinte des entrées, du prompt, du modèle et du schéma.
- Une relance identique ne doit pas créer plusieurs versions publiées.
- Les échecs sont conservés avec leur rapport de validation.
- Les reprises ciblent l'étape en échec lorsque c'est possible ; elles ne doivent pas écraser les candidats précédents.
- Un changement de schéma déclenche une nouvelle validation ou une nouvelle génération selon la compatibilité.

## 7. Observabilité et coûts

Enregistrer côté serveur :
- identifiant de génération ;
- horodatages et durée ;
- fournisseur et identifiant exact du modèle ;
- versions de prompt et schéma ;
- empreinte du dossier de sources ;
- tokens entrants/sortants et coût estimé lorsque disponibles ;
- erreurs, tentatives et rapport de validation.

Ne jamais journaliser de secrets ou de données sensibles inutiles.

## 8. Tests à prévoir

- JSON invalide ou tronqué.
- Champ inconnu / propriété supplémentaire.
- Source inexistante ou hors dossier.
- Affirmation établie sans source.
- Étymologies concurrentes.
- Prénom absent des statistiques Insee.
- Effectif masqué ou arrondi.
- Sortie symbolique sans cadre ou disclaimer.
- Prompt injection présente dans une page source.
- Doublon de génération et reprise après panne.
- Tentative de publication via un champ fourni par le modèle.

## 9. Critère de sortie du pipeline

Un candidat peut passer en revue humaine uniquement si les validations structurelles et les contrôles automatiques bloquants sont réussis. Il ne devient public qu'après validation humaine et transition explicite du backend.
