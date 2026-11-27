# Gouvernance éditoriale et génération des fiches — Namesia

- **Statut :** référence canonique
- **Version :** 1.5
- **Mis à jour le :** 2026-11-27 10:42:38 (Europe/Paris)

## Source et limites du contenu

Les fiches sont générées en amont par une IA, puis importées dans Namesia. Le JSON est un format d’échange, pas le modèle de stockage : les champs éditoriaux sont répartis dans des colonnes dédiées et des relations adaptées dans Supabase. Aucune colonne JSON fourre-tout ne remplace le modèle relationnel.

Une génération valide ne prouve jamais l’exactitude d’une information. Ne jamais inventer de sources, citations, statistiques, références, dates, validations ou statuts de vérification. Une origine ou une étymologie incertaine reste présentée comme telle. Les traditions, symboliques, numérologie et portraits de personnalité ne sont pas des vérités scientifiques ou prédictives.

## Fiabilité éditoriale et détection des erreurs IA

La revue d'une fiche générée doit rechercher explicitement : affirmations sans fondement identifiable, certitudes excessives, contradictions entre rubriques, confusion entre origine et interprétation, variantes inventées ou assimilées à tort, répétitions, formulations génériques interchangeables, remplissage artificiel et incohérences avec le genre ou la graphie demandés. Ces signaux servent à déclencher une vérification ou une correction ; aucun détecteur automatique ne garantit l'absence d'hallucination.

Distinguer les faits documentés, hypothèses étymologiques concurrentes, variantes attestées ou discutées, usages observés et interprétations culturelles. Lorsqu'une source vérifiable est réellement consultée, utiliser sa référence et son périmètre exact pendant la revue éditoriale. Le contrat JSON et le modèle de données actuels ne comportent toutefois aucun champ de sources ou de preuves : ne pas laisser entendre que ces références sont conservées ou affichées dans les fiches. En l'absence de recherche documentaire, ne pas fabriquer une provenance : nuancer ou omettre l'affirmation.

La validation structurelle et les règles déterministes peuvent être automatisées. La cohérence éditoriale, la plausibilité étymologique et la qualité culturelle nécessitent des contrôles adaptés et, pour les cas ambigus, une revue humaine. Les scores ou classifications automatiques ne sont ni des preuves ni des garanties. Les limites de chaque contrôle doivent être documentées.

## Production et import des fiches

Les fiches sont préparées en amont de l'application, notamment dans une conversation avec un assistant, puis importées dans l'administration via le contrat JSON Namesia. L'administration valide la structure, prévisualise le contenu et crée un brouillon ; la publication reste une action distincte.

Le workflow GitHub Actions Groq décrit par l'ancienne ADR-0056 n'est plus le parcours retenu et ne doit pas être activé. Une page privée de génération Groq, où un administrateur saisit un prénom, reste une piste éventuelle et non prioritaire. Elle devra être comparée au bénéfice de la génération directe par un assistant et à l'import JSON existant avant d'être planifiée. Voir [Pipeline de génération et import](pipeline-generation-ia.md) et [ADR-0057](decisions/ADR-0057-generation-externe-import.md).

La conformité JSON ne vérifie pas la vérité des affirmations. Aucune source, citation, statistique ou validation ne doit être inventée. Une fiche incertaine doit être nuancée, documentée lorsqu'une source réelle est disponible, ou omise.

## Provenance et cycle de vie des fiches

Le seul mécanisme de provenance technique présent dans le dépôt est hérité du script expérimental Groq (`scripts/generate-prenom.mjs`). Ce script écrit localement un fichier `.metadata.json` associé au JSON de fiche et peut transmettre certaines métadonnées à la fonction SQL via `service_role`, qui les conserve dans `private.name_profile_generation_metadata`. Le workflow GitHub Actions Groq n'est plus présent et ce mécanisme n'est pas utilisé par le parcours courant de génération assistée par conversation puis d'import manuel. L'artefact local n'a pas de politique de conservation automatique définie dans le processus actuel. L'import manuel ne fournit pas ces métadonnées : ne jamais les inventer après coup. Cette traçabilité technique ne constitue pas une validation éditoriale ; le statut de revue humaine et un historique détaillé des modifications ne sont pas encore modélisés. Relier les sources aux affirmations uniquement lorsqu'un véritable processus documentaire existe.

Le cycle de vie couvre génération, validation, import, brouillon, publication, mise à jour, correction, dépublication, archivage et suppression. Les changements ciblés doivent éviter de régénérer inutilement toute une fiche. Prévenir doublons, écrasements accidentels, incohérences et publications incomplètes.

Distinguer faits documentés, hypothèses étymologiques, variantes discutées, usages observés et éléments symboliques. Un score automatique ou un statut éditorial peut aider à prioriser une revue, mais ne constitue jamais une garantie de vérité. Les cas ambigus ou insuffisamment vérifiables peuvent être différés, nuancés ou soumis à une revue humaine.

## Retours visiteurs

Les visiteurs pourront disposer d’un moyen simple, accessible et mobile de signaler une erreur ou proposer une correction. Le formulaire contextualise la fiche et le passage concernés et distingue les erreurs factuelles ou étymologiques, fautes, problèmes techniques, contenus inappropriés et suggestions. Il collecte uniquement les informations nécessaires, explique leur usage et leur conservation, et ne demande pas de compte lorsque ce n'est pas utile.

Les contributions restent privées par défaut, ne sont jamais publiées automatiquement et ne sont pas considérées comme vérifiées. Le workflow de traitement comprend réception, qualification, vérification, correction ou rejet, clôture et prévention des doublons. Prévoir protection anti-spam et anti-injection sans friction excessive. Toute publication communautaire ou espace public de contributions nécessitera une décision produit distincte.

La qualité éditoriale prime sur le volume : mieux vaut différer, nuancer ou omettre une information insuffisamment étayée que publier une affirmation inventée.
