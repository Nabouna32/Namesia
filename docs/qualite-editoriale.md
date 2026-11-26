# Gouvernance éditoriale et génération des fiches — Namesia

- **Statut :** référence canonique
- **Version :** 1.0
- **Mis à jour le :** 2026-11-26 20:41:00 (Europe/Paris)

## Source et limites du contenu

Les fiches sont générées en amont par une IA, puis importées dans Namesia. Le JSON est un format d’échange, pas le modèle de stockage : les champs éditoriaux sont répartis dans des colonnes dédiées et des relations adaptées dans Supabase. Aucune colonne JSON fourre-tout ne remplace le modèle relationnel.

Une génération valide ne prouve jamais l’exactitude d’une information. Ne jamais inventer de sources, citations, statistiques, références, dates, validations ou statuts de vérification. Une origine ou une étymologie incertaine reste présentée comme telle. Les traditions, symboliques, numérologie et portraits de personnalité ne sont pas des vérités scientifiques ou prédictives.

## Pipeline cible

Le pipeline automatisé autorisé par le propriétaire peut s’appuyer sur Groq comme point de départ, sans obligation de conserver ce fournisseur si une autre option est objectivement meilleure. Aucun service payant ni engagement financier nouveau n’est activé sans arbitrage préalable.

Le processus sépare explicitement :

1. **Génération :** prompt versionné, modèle identifié, paramètres utiles, schéma de sortie strict et entrées documentées.
2. **Validation :** syntaxe JSON, schéma, types, champs requis, longueurs, valeurs autorisées, cohérence inter-champs, doublons, qualité rédactionnelle et règles de non-invention.
3. **Prévisualisation :** lecture humaine du contenu et de ses limites avant toute intégration ou publication.
4. **Import :** transformation contrôlée vers les colonnes dédiées, transaction si nécessaire, import idempotent et mise à jour ciblée.
5. **Publication :** action explicite de l’administrateur ; le modèle et le validateur ne choisissent jamais le statut public.

Une sortie invalide ne doit jamais écraser une fiche valide. Les erreurs sont explicites ; les reprises sont maîtrisées et ne doivent pas dupliquer ou publier partiellement les données.

## Provenance et cycle de vie des fiches

Conserver les métadonnées utiles à la compréhension et à la correction : provenance réellement disponible, date de génération ou révision, fournisseur et modèle, version du prompt et du schéma, paramètres pertinents, statut de validation et historique des modifications lorsque sa valeur le justifie. Ne jamais inventer ces métadonnées après coup.

Le cycle de vie couvre génération, validation, import, brouillon, publication, mise à jour, correction, dépublication, archivage et suppression. Les changements ciblés doivent éviter de régénérer inutilement toute une fiche. Prévenir doublons, écrasements accidentels, incohérences et publications incomplètes.

Distinguer faits documentés, hypothèses étymologiques, variantes discutées, usages observés et éléments symboliques. Un score automatique ou un statut éditorial peut aider à prioriser une revue, mais ne constitue jamais une garantie de vérité. Les cas ambigus ou insuffisamment vérifiables peuvent être différés, nuancés ou soumis à une revue humaine.

## Retours visiteurs

Les visiteurs pourront disposer d’un moyen simple et accessible de signaler une erreur ou proposer une correction. Le formulaire devra contextualiser la fiche et le passage concernés, distinguer les catégories de retours utiles et limiter les informations personnelles collectées.

Les contributions restent privées par défaut, ne sont jamais publiées automatiquement et ne sont pas considérées comme vérifiées. Le workflow de traitement comprend réception, qualification, vérification, correction ou rejet, clôture et prévention des doublons. Prévoir protection anti-spam et anti-injection sans friction excessive. Toute publication communautaire ou espace public de contributions nécessitera une décision produit distincte.

La qualité éditoriale prime sur le volume : mieux vaut différer, nuancer ou omettre une information insuffisamment étayée que publier une affirmation inventée.
