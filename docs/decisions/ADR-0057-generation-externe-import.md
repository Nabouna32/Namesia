# ADR-0057 — Génération externe et import éditorial

- **Statut :** acceptée
- **Version :** 1.1
- **Décision prise le :** 2026-11-27 (heure non consignée)
- **Mis à jour le :** 2026-11-27 11:05:11 (Europe/Paris)
- **Décideur :** propriétaire de Namesia
- **Périmètre :** production des fiches et administration

## Contexte

Namesia doit disposer de fiches structurées dans un contrat JSON puis importées dans les colonnes relationnelles de Supabase. Le besoin prioritaire est la qualité éditoriale et la simplicité du parcours d'import, pas l'intégration d'un fournisseur IA particulier.

## Options examinées

1. **Génération intégrée à l'application :** ajoute un fournisseur, des secrets, des quotas, une route protégée et une surface d'attaque. Aucun gain suffisant n'est établi.
2. **Génération dans une conversation avec un assistant, puis import JSON :** réutilise le parcours d'import existant sans ajouter de dépendance IA au runtime. Option retenue.
3. **Suspendre la production de nouvelles fiches :** préférable à augmenter artificiellement le catalogue avec du contenu incertain.

## Décision

- Préparer les fiches en amont, notamment avec un assistant conversationnel, au format JSON Namesia.
- Utiliser l'administration privée pour valider, prévisualiser et importer les fiches comme brouillons.
- Maintenir une publication explicitement humaine.
- Ne pas intégrer d'appel à un modèle IA dans le runtime public ou le parcours d'administration actuel.
- Ne pas ajouter de fournisseur, secret, coût ou traitement automatisé sans réexamen explicite du besoin.

## Fiabilité et sécurité

Un JSON valide ne prouve pas l'exactitude de son contenu. Ne jamais inventer sources, citations, statistiques, dates, traditions, étymologies ou validations. Distinguer faits, hypothèses, usages et symbolique. Les champs incertains peuvent être omis ou nuancés.

Tout import passe par le parseur partagé et l'administration protégée. Une fiche importée reste un brouillon ; aucune génération ne peut publier automatiquement.

## Conséquences

- Le parcours courant ne dépend d'aucun fournisseur IA ou secret de génération.
- La simplicité de l'import JSON est conservée.
- La qualité éditoriale prime sur le volume.
- Une intégration future devra démontrer un gain réel et être réévaluée selon ses coûts, risques et contraintes de sécurité.

## Références

- [Pipeline de génération et import](../pipeline-generation-ia.md)
- [Gouvernance éditoriale](../qualite-editoriale.md)
- [Architecture](../architecture.md)
