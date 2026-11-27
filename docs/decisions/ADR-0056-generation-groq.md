# ADR-0056 — Génération contrôlée des fiches via Groq

- **Statut :** remplacée par [ADR-0057](ADR-0057-generation-externe-import.md)
- **Date :** 2026-11-27
- **Décideur :** décision historique du propriétaire, révisée le 2026-11-27
- **Périmètre :** expérimentation de génération et import Groq

## Contexte historique

Cette décision avait autorisé un workflow GitHub Actions manuel appelant Groq, avec validation stricte, import en brouillon, provenance et secrets GitHub. L'implémentation technique a été réalisée, mais le workflow n'a pas été activé : les secrets associés ne sont pas configurés.

## Réexamen

Le propriétaire a précisé que le besoin envisagé pour Groq serait, le cas échéant, une page privée de l'administration dans laquelle il saisit un prénom et déclenche une requête Groq. Il ne s'agit pas d'un workflow GitHub Actions. Cette interface n'est toutefois pas prioritaire, car les fiches pourront être générées directement par un assistant puis importées au moyen du parcours JSON existant.

L'ancienne décision confondait le fournisseur de génération avec le lieu et le parcours d'utilisation. Le fait que le workflow soit techniquement implémenté ne justifie pas de le conserver comme architecture cible.

## Conséquences

- Le workflow GitHub Actions Groq n'est plus le parcours opérationnel retenu et ne doit pas être activé.
- Les secrets GitHub Actions demandés par l'ancienne issue #354 ne sont plus nécessaires.
- L'issue #353 est clôturée comme non planifiée ; l'issue #354 est clôturée car son action n'a plus d'objet.
- Le code expérimental (scripts, prompt, schéma Groq, migrations et provenance) reste à réévaluer avant réutilisation ou suppression. Il ne doit pas être présenté comme un service actif.
- Le parcours courant reste la génération externe, notamment par conversation avec un assistant, puis import JSON dans l'administration et revue humaine.
- Toute interface d'administration Groq fera l'objet d'une décision distincte après comparaison de sa valeur avec la génération directe par un assistant. Elle devra garder la clé côté serveur, appliquer l'autorisation admin, valider le contrat, importer en brouillon et ne jamais publier automatiquement.

Voir [ADR-0057 — Génération externe et import éditorial](ADR-0057-generation-externe-import.md) pour la décision courante.
