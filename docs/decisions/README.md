# Registre des décisions d'architecture

- **Version :** 1.8
- **Mis à jour le :** 2026-11-28 06:35:20 (Europe/Paris)

Ce registre indexe les décisions d'architecture encore applicables et les décisions historiques dont le contexte conserve une valeur utile.

Une ADR remplacée, retirée ou obsolète n'est pas conservée automatiquement. Sa suppression est possible après vérification des dépendances et transfert des exigences encore applicables vers les documents canoniques.

Les documents canoniques décrivant l'état courant sont accessibles depuis le [README racine](../../README.md). Les guides opérationnels sont [Dependabot](../platform/DEPENDABOT.md), [GitHub Actions](../platform/GITHUB-ACTIONS.md), [Supabase](../platform/SUPABASE.md) et [Cloudflare Workers](../platform/CLOUDFLARE-WORKERS.md).

La politique complète de création, de révision, d'audit et de suppression est définie dans [ADR-MAINTENANCE.md](ADR-MAINTENANCE.md).

Chaque ADR possède un identifiant unique et un statut normalisé. Les 37 décisions conservées sont actuellement actives ; les remplacements partiels sont explicités dans les ADR concernées. Les tests `tests/adr-registry.test.mjs` et `tests/documentation-index.test.mjs` vérifient le nommage, l'unicité des identifiants, les métadonnées et statuts, la correspondance exacte entre les ADR et le registre, l'indexation documentaire et les liens Markdown locaux.

## Décisions

- [ADR-0001 — Separation generation publication](ADR-0001-SEPARATE-GENERATION-AND-PUBLICATION.md) — `active`
- [ADR-0002 — Statistiques insee](ADR-0002-INSEE-NAME-STATISTICS.md) — `active`
- [ADR-0003 — Premier site web](ADR-0003-WEB-PLATFORM-AND-SUPABASE-FOUNDATION.md) — `active`
- [ADR-0004 — Modele jsonb import](ADR-0004-JSON-IMPORT-AND-RELATIONAL-DATA-MODEL.md) — `active`
- [ADR-0014 — Neutralite vitrine](ADR-0014-FEATURED-NAMES-CHROMATIC-NEUTRALITY.md) — `active`
- [ADR-0016 — Usage semantique rainbow](ADR-0016-SEMANTIC-RAINBOW-AND-NEUTRAL-SURFACES.md) — `active`
- [ADR-0017 — Couches etat material](ADR-0017-MATERIAL-INTERACTION-STATE-LAYERS.md) — `active`
- [ADR-0018 — Icones et formulaires material](ADR-0018-MATERIAL-ICONS-AND-ADMIN-FORMS.md) — `active`
- [ADR-0019 — Couches etat navigation](ADR-0019-ADAPTIVE-NAVIGATION-STATE-LAYERS.md) — `active`
- [ADR-0020 — Material symbols officiels](ADR-0020-OFFICIAL-MATERIAL-SYMBOLS-ROUNDED.md) — `active`
- [ADR-0021 — Echelle typographique material](ADR-0021-MATERIAL-TYPOGRAPHY-SCALE.md) — `active`
- [ADR-0022 — Contraste rainbow categories](ADR-0022-RAINBOW-CATEGORY-CONTRAST.md) — `active`
- [ADR-0024 — Contrat design m3](ADR-0024-MATERIAL-3-DESIGN-CONTRACT.md) — `active`
- [ADR-0025 — Fiche material lecture](ADR-0025-MATERIAL-3-PROFILE-READING.md) — `active`
- [ADR-0026 — Suggestions bornees](ADR-0026-BOUNDED-PROFILE-SUGGESTIONS.md) — `active`
- [ADR-0028 — Baseline material 3 androidx et couleurs semantiques](ADR-0028-MATERIAL-3-ANDROIDX-BASELINE-AND-SEMANTIC-COLORS.md) — `active`
- [ADR-0029 — Typographie navigation material 3](ADR-0029-MATERIAL-3-NAVIGATION-TYPOGRAPHY.md) — `active`
- [ADR-0031 — Hauteur navigation bar compose 1 5](ADR-0031-NAVIGATION-BAR-HEIGHT-COMPOSE-1-5.md) — `active`
- [ADR-0032 — Sources material 3 versionnees](ADR-0032-VERSIONED-MATERIAL-3-SOURCES.md) — `active`
- [ADR-0033 — Navigation adaptative accessibilite](ADR-0033-ADAPTIVE-NAVIGATION-ACCESSIBILITY.md) — `active`
- [ADR-0034 — Geometrie filterchip androidx 1 5](ADR-0034-FILTER-CHIP-GEOMETRY-ANDROIDX-1-5.md) — `active`
- [ADR-0035 — Searchbar androidx](ADR-0035-SEARCH-BAR-ANDROIDX.md) — `active`
- [ADR-0036 — Geometrie boutons androidx](ADR-0036-BUTTON-GEOMETRY-ANDROIDX.md) — `active`
- [ADR-0037 — Architecture composants material3](ADR-0037-MATERIAL-3-COMPONENT-ARCHITECTURE.md) — `active`
- [ADR-0039 — Shell material 3](ADR-0039-MATERIAL-3-APP-SHELL.md) — `active`
- [ADR-0040 — Nomenclature composants](ADR-0040-COMPONENT-NAMING-CONVENTION.md) — `active`
- [ADR-0041 — Card material 3](ADR-0041-MATERIAL-3-CARD.md) — `active`
- [ADR-0042 — Text field material 3](ADR-0042-MATERIAL-3-TEXT-FIELD.md) — `active`
- [ADR-0043 — Actions et pictogrammes de genre](ADR-0043-NAME-ACTIONS-AND-GENDER-ICONS.md) — `active`
- [ADR-0045 — Source google blue material 3](ADR-0045-GOOGLE-BLUE-MATERIAL-3-SOURCE.md) — `active`
- [ADR-0046 — Alert dialog material 3](ADR-0046-MATERIAL-3-ALERT-DIALOG.md) — `active`
- [ADR-0048 — Classement insee 2025](ADR-0048-INSEE-2025-NAME-RANKINGS.md) — `active`
- [ADR-0050 — Hebergement cloudflare workers](ADR-0050-CLOUDFLARE-WORKERS-HOSTING.md) — `active`
- [ADR-0051 — Theme css natif](ADR-0051-NATIVE-CSS-THEME.md) — `active`
- [ADR-0052 — Dependabot quotidien](ADR-0052-DAILY-DEPENDABOT-UPDATES.md) — `active`
- [ADR-0053 — Compte utilisateur facultatif](ADR-0053-OPTIONAL-USER-ACCOUNTS.md) — `active`
- [ADR-0055 — Authentification comptes partages](ADR-0055-SHARED-ACCOUNT-PASSWORD-AUTHENTICATION.md) — `active`
