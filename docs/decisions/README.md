# Registre des décisions d'architecture

Les ADR conservent les décisions structurelles, y compris celles qui ont été remplacées. Une ADR marquée « remplacée » est une trace historique et ne décrit pas l'état courant du produit.

Les documents canoniques qui décrivent l'état actuel sont :

- [Design system](../design.md)
- [Registre des composants](../composants.md)
- [Vérification Material 3 et sources AndroidX](../material-3-verification.md)
- [Architecture](../architecture.md)

Chaque ADR possède un identifiant unique. Le test `tests/adr-registry.test.mjs` vérifie l'unicité des identifiants, la cohérence entre nom de fichier et titre, ainsi que l'existence des liens internes vers d'autres ADR.
