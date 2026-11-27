# Registre des décisions d'architecture

- **Version :** 1.5
- **Mis à jour le :** 2026-11-27 (Europe/Paris)

Les ADR conservent les décisions structurelles, y compris celles qui ont été remplacées. Une ADR marquée « remplacée » est une trace historique et ne décrit pas l'état courant du produit.

Les documents canoniques qui décrivent l'état actuel sont :

- [Design system](../design.md)
- [Registre des composants](../composants.md)
- [Vérification Material 3 et sources AndroidX](../material-3-verification.md)
- [Architecture](../architecture.md)
- [Gouvernance et autonomie](../gouvernance.md)
- [Exploitation, sécurité et qualité](../operations.md)
- [Gouvernance éditoriale et génération](../qualite-editoriale.md)
- [Génération et import des fiches](../pipeline-generation-ia.md)
- [Portabilité et réversibilité](../portabilite-et-reversibilite.md)
- [Mesure et croissance](../mesure-et-croissance.md)

Chaque ADR possède un identifiant unique. Le test `tests/adr-registry.test.mjs` vérifie l'unicité des identifiants, la cohérence entre nom de fichier et titre, ainsi que l'existence des liens internes vers d'autres ADR.

- [ADR-0053 — Compte utilisateur facultatif](ADR-0053-compte-utilisateur-facultatif.md)
- [ADR-0054 — Métadonnées et fraîcheur documentaire](ADR-0054-metadonnees-fraicheur-documentaire.md)

- [ADR-0055 — Gouvernance et autonomie de Namesia](ADR-0055-gouvernance-autonomie.md)
- [ADR-0056 — Génération contrôlée des fiches via Groq (remplacée)](ADR-0056-generation-groq.md)
- [ADR-0057 — Génération externe et import éditorial](ADR-0057-generation-externe-import.md)
