# ADR-0057 — Génération externe et import éditorial

- **Statut :** acceptée
- **Date :** 2026-11-27
- **Décideur :** propriétaire de Namesia
- **Périmètre :** production des fiches, outils de génération et administration

## Contexte

Namesia doit disposer de fiches de qualité, structurées dans un contrat JSON puis importées dans les colonnes relationnelles de Supabase. Le besoin prioritaire est la production éditoriale fiable et la simplicité du parcours d'import, pas l'intégration d'un fournisseur IA particulier.

Le propriétaire a précisé que Groq, si cette piste est retenue, correspondrait à une page privée d'administration : saisie d'un prénom, appel serveur à l'API Groq, prévisualisation et import contrôlé. Il ne s'agit pas d'un workflow GitHub Actions. Cette page n'est toutefois pas prioritaire, car la génération des fiches peut être réalisée directement par un assistant, puis importée dans Namesia.

## Options examinées

1. **Workflow GitHub Actions manuel via Groq :** déjà implémenté à titre expérimental, mais ne correspond pas au parcours demandé. Il ajoute des secrets et des artefacts GitHub sans améliorer l'expérience d'administration. Option écartée comme stratégie produit.
2. **Page privée d'administration appelant Groq :** expérience plus cohérente si une génération intégrée devient utile, mais implique clé serveur, route protégée, limites d'usage, gestion des erreurs et maintenance. À différer tant que le besoin n'est pas démontré.
3. **Génération dans une conversation avec un assistant, puis import JSON :** réutilise le parcours d'import et évite d'ajouter un fournisseur, une clé ou une surface d'attaque au runtime. C'est le parcours retenu à ce stade.
4. **Ne pas produire de nouvelles fiches tant que les critères éditoriaux ne sont pas satisfaits :** préférable à augmenter artificiellement le catalogue avec du contenu incertain.

## Décision

- Préparer les fiches en amont, notamment avec un assistant conversationnel, au format JSON Namesia.
- Utiliser l'administration privée existante pour valider, prévisualiser et importer les fiches comme brouillons.
- Maintenir une publication explicitement humaine.
- Ne pas activer ni maintenir comme parcours produit le workflow GitHub Actions Groq issu de l'ADR-0056.
- Différer toute page Groq d'administration. La réexaminer seulement si elle apporte un gain net par rapport à la génération directe par un assistant et au parcours JSON.
- Ne pas configurer les secrets GitHub Actions Groq/Supabase demandés par l'ancienne issue #354.
- Réévaluer séparément le code expérimental, les migrations de provenance et les tables associées avant de les supprimer ou de les réutiliser.

## Fiabilité et sécurité

Un JSON valide ne prouve pas l'exactitude de son contenu. Ne jamais inventer sources, citations, statistiques, dates, traditions, étymologies ou validations. Distinguer faits, hypothèses, usages et symbolique. Les champs incertains peuvent être omis ou nuancés.

Tout import doit passer par le parseur partagé et le parcours d'administration protégé. Une fiche importée reste un brouillon ; aucune génération ne peut publier automatiquement. Si une intégration Groq est ultérieurement retenue, la clé reste côté serveur, les requêtes sont réservées aux administrateurs, les quotas et erreurs sont maîtrisés et l'import est explicitement confirmé.

## Conséquences

- Le parcours de génération actuel ne dépend d'aucun secret Groq.
- La simplicité de l'import JSON est conservée.
- La qualité éditoriale prime sur le volume.
- La décision pourra être réexaminée si le coût manuel de génération/import devient mesurable et justifie une interface dédiée.

## Références

- [Pipeline de génération et import](../pipeline-generation-ia.md)
- [Gouvernance éditoriale](../qualite-editoriale.md)
- [Architecture](../architecture.md)
- [ADR-0056 — décision Groq remplacée](ADR-0056-generation-groq.md)
