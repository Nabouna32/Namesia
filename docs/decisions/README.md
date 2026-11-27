# Registre des décisions d'architecture

- **Version :** 1.3
- **Mis à jour le :** 2026-11-27 20:07:03 (Europe/Paris)

Les ADR conservent les décisions structurelles, y compris celles qui ont été remplacées. Une ADR marquée « remplacée » est une trace historique et ne décrit pas l'état courant du produit.

Les documents canoniques qui décrivent l'état actuel sont :

- [Design system](../DESIGN-SYSTEM.md)
- [Registre des composants](../design/COMPONENTS.md)
- [Vérification Material 3 et sources AndroidX](../MATERIAL-3-VERIFICATION.md)
- [Architecture](../ARCHITECTURE.md)

Les références opérationnelles sont décrites dans les guides [Dependabot](../platform/DEPENDABOT.md), [GitHub Actions](../platform/GITHUB-ACTIONS.md), [Supabase](../platform/SUPABASE.md) et [Cloudflare Workers](../platform/CLOUDFLARE-WORKERS.md).\n\nChaque ADR possède un identifiant unique. Le test `tests/adr-registry.test.mjs` vérifie l'unicité des identifiants, la cohérence entre nom de fichier et titre, ainsi que l'existence des liens internes vers d'autres ADR.

- [ADR-0053 — Compte utilisateur facultatif](ADR-0053-compte-utilisateur-facultatif.md)
- [ADR-0054 — Métadonnées et fraîcheur documentaire](ADR-0054-metadonnees-fraicheur-documentaire.md)
- [ADR-0055 — Authentification des comptes Namesia par mot de passe](ADR-0055-authentification-comptes-partages.md)
