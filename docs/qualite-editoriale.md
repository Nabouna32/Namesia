# Gouvernance éditoriale et génération des fiches — Namesia

- **Statut :** référence canonique
- **Version :** 1.3
- **Mis à jour le :** 2026-11-27 01:08:00 (Europe/Paris)

## Source et limites du contenu

Les fiches sont générées en amont par une IA, puis importées dans Namesia. Le JSON est un format d’échange, pas le modèle de stockage : les champs éditoriaux sont répartis dans des colonnes dédiées et des relations adaptées dans Supabase. Aucune colonne JSON fourre-tout ne remplace le modèle relationnel.

Une génération valide ne prouve jamais l’exactitude d’une information. Ne jamais inventer de sources, citations, statistiques, références, dates, validations ou statuts de vérification. Une origine ou une étymologie incertaine reste présentée comme telle. Les traditions, symboliques, numérologie et portraits de personnalité ne sont pas des vérités scientifiques ou prédictives.

## Fiabilité éditoriale et détection des erreurs IA

La revue d'une fiche générée doit rechercher explicitement : affirmations sans fondement identifiable, certitudes excessives, contradictions entre rubriques, confusion entre origine et interprétation, variantes inventées ou assimilées à tort, répétitions, formulations génériques interchangeables, remplissage artificiel et incohérences avec le genre ou la graphie demandés. Ces signaux servent à déclencher une vérification ou une correction ; aucun détecteur automatique ne garantit l'absence d'hallucination.

Distinguer les faits documentés, hypothèses étymologiques concurrentes, variantes attestées ou discutées, usages observés et interprétations culturelles. Lorsqu'une source vérifiable est disponible, conserver sa référence et le périmètre exact de l'affirmation qu'elle étaye. En l'absence de recherche documentaire, ne pas fabriquer une provenance : laisser le champ vide ou formuler explicitement l'incertitude.

La validation structurelle et les règles déterministes peuvent être automatisées. La cohérence éditoriale, la plausibilité étymologique et la qualité culturelle nécessitent des contrôles adaptés et, pour les cas ambigus, une revue humaine. Les scores ou classifications automatiques ne sont ni des preuves ni des garanties. Les limites de chaque contrôle doivent être documentées.

## Pipeline de génération en place

La génération est exécutée en amont par le workflow GitHub Actions manuel via Groq, limité à main et à un prénom par exécution. Le modèle configuré est `openai/gpt-oss-20b`, choisi pour son support des Structured Outputs stricts. Le workflow utilise un schéma de réponse dédié, normalise les champs facultatifs, puis valide le contrat d’import Namesia avec le parseur partagé. Le dry-run est le comportement par défaut ; un import explicite crée uniquement un brouillon. Aucun endpoint public, traitement massif, planification automatique ou publication par IA n’existe.

Le workflow n’effectue aucune recherche documentaire : le modèle n’est pas une source et sa sortie ne prouve pas la vérité. Il doit rester sur le niveau gratuit Groq ; si l’accès au modèle ou les quotas nécessitent une offre payante, le processus s’arrête et aucun upgrade ou moyen de paiement n’est ajouté sans arbitrage préalable.

Le processus sépare explicitement :

1. **Génération :** prompt versionné, modèle identifié, paramètres utiles, schéma de sortie strict et entrées documentées.
2. **Validation structurelle :** syntaxe JSON, schéma, types, champs requis, longueurs, valeurs autorisées, slug et associations. Cette étape ne vérifie pas la vérité des affirmations.
3. **Alertes heuristiques :** détection indicative des URL, marqueurs de citation, références à des études, statistiques, années précises et phrases répétées. Le compteur est persisté avec la provenance ; le détail reste dans l’artefact temporaire. Ces alertes ne bloquent pas l’import et ne constituent pas un détecteur général d’hallucinations.
4. **Prévisualisation et revue humaine :** lecture du contenu, des alertes et de ses limites avant toute publication ; vérification de la cohérence, de la plausibilité étymologique, des variantes et de la qualité rédactionnelle.
5. **Import :** transformation contrôlée vers les colonnes dédiées, transaction, import idempotent et création d’un brouillon uniquement.
6. **Publication :** action explicite de l’administrateur ; le modèle et le validateur ne choisissent jamais le statut public.

Une sortie invalide ne doit jamais écraser une fiche valide. Les erreurs sont explicites ; les reprises sont maîtrisées et ne doivent pas dupliquer ou publier partiellement les données.

## Provenance et cycle de vie des fiches

Pour chaque génération importée, la table privée `private.name_profile_generation_metadata` conserve fournisseur, modèle, version et empreinte SHA-256 du prompt, empreinte du contenu normalisé, version du schéma de réponse, identifiants de requête et d’exécution GitHub, nombre d’alertes heuristiques, date, paramètres et usage en tokens lorsqu’il est fourni. Elle ne stocke ni prompt brut, ni secret, ni document JSON complet. Un artefact de métadonnées distinct accompagne le JSON de fiche pendant sept jours et contient le détail des alertes heuristiques. Cette traçabilité technique ne constitue pas une validation éditoriale ; le statut de revue humaine et un historique détaillé des modifications ne sont pas encore modélisés. Relier les sources aux affirmations uniquement lorsqu’un véritable processus documentaire existe. Ne jamais inventer ces métadonnées après coup.

Le cycle de vie couvre génération, validation, import, brouillon, publication, mise à jour, correction, dépublication, archivage et suppression. Les changements ciblés doivent éviter de régénérer inutilement toute une fiche. Prévenir doublons, écrasements accidentels, incohérences et publications incomplètes.

Distinguer faits documentés, hypothèses étymologiques, variantes discutées, usages observés et éléments symboliques. Un score automatique ou un statut éditorial peut aider à prioriser une revue, mais ne constitue jamais une garantie de vérité. Les cas ambigus ou insuffisamment vérifiables peuvent être différés, nuancés ou soumis à une revue humaine.

## Retours visiteurs

Les visiteurs pourront disposer d’un moyen simple, accessible et mobile de signaler une erreur ou proposer une correction. Le formulaire contextualise la fiche et le passage concernés et distingue les erreurs factuelles ou étymologiques, fautes, problèmes techniques, contenus inappropriés et suggestions. Il collecte uniquement les informations nécessaires, explique leur usage et leur conservation, et ne demande pas de compte lorsque ce n'est pas utile.

Les contributions restent privées par défaut, ne sont jamais publiées automatiquement et ne sont pas considérées comme vérifiées. Le workflow de traitement comprend réception, qualification, vérification, correction ou rejet, clôture et prévention des doublons. Prévoir protection anti-spam et anti-injection sans friction excessive. Toute publication communautaire ou espace public de contributions nécessitera une décision produit distincte.

La qualité éditoriale prime sur le volume : mieux vaut différer, nuancer ou omettre une information insuffisamment étayée que publier une affirmation inventée.
