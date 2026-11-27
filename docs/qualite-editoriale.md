# Gouvernance éditoriale et qualité des fiches — Namesia

- **Statut :** référence canonique
- **Version :** 1.6
- **Mis à jour le :** 2026-11-27 11:05:11 (Europe/Paris)

## 1. Source et limites du contenu

Les fiches sont préparées en amont avec une IA, puis importées dans Namesia. Le JSON est un format d'échange ; les champs éditoriaux sont répartis dans les colonnes et relations Supabase prévues à cet effet.

Une génération valide ne prouve jamais l'exactitude d'une information. Ne jamais inventer de sources, citations, statistiques, références, dates, validations ou statuts de vérification. Une origine ou une étymologie incertaine reste présentée comme telle. Les traditions, symboliques, numérologie et portraits de personnalité ne sont pas des vérités scientifiques ou prédictives.

Lorsqu'une source vérifiable est réellement consultée pendant la revue, sa référence peut guider la correction éditoriale. Le contrat JSON et le modèle actuels ne comportent toutefois aucun champ de sources ou de preuves : ne pas laisser entendre que ces références sont conservées ou affichées dans les fiches.

## 2. Fiabilité et revue

La revue recherche explicitement : affirmations sans fondement identifiable, certitudes excessives, contradictions entre rubriques, confusion entre origine et interprétation, variantes inventées ou assimilées à tort, répétitions, formulations génériques interchangeables, remplissage artificiel et incohérences avec le genre ou la graphie demandés.

Les contrôles structurels et déterministes peuvent être automatisés. La cohérence éditoriale, la plausibilité étymologique et la qualité culturelle nécessitent une appréciation adaptée. Les scores et classifications automatiques ne sont ni des preuves ni des garanties.

## 3. Production et import

Le parcours courant est décrit dans [Génération et import](pipeline-generation-ia.md) : préparation externe, import JSON dans l'administration, validation structurelle, prévisualisation, revue puis publication explicite.

L'import crée un brouillon et ne publie jamais automatiquement. La conformité JSON ne vérifie pas la vérité des affirmations. Les métadonnées de fournisseur, modèle ou prompt ne font pas partie du contrat courant et ne doivent pas être inventées après coup.

## 4. Cycle de vie

Le cycle de vie couvre génération, validation, import, brouillon, publication, mise à jour, correction, dépublication, archivage et suppression. Les changements ciblés doivent éviter de régénérer inutilement toute une fiche. Prévenir doublons, écrasements accidentels, incohérences et publications incomplètes.

Une version publiée n'est pas modifiée en place ; une nouvelle version est créée et sa publication est une action distincte.

## 5. Retours visiteurs

Les visiteurs pourront signaler une erreur ou proposer une correction. Cette capacité n'est pas actuellement disponible : aucun endpoint public d'écriture ne doit être exposé avant la définition des protections anti-abus, de la modération privée et de la conservation. Les arbitrages requis sont suivis dans les issues humaines ouvertes.
