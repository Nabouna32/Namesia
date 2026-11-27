# Registre des décisions d'architecture

- **Version :** 1.6
- **Mis à jour le :** 2026-11-27 10:38:00 (Europe/Paris)

Les ADR conservent le contexte, les options examinées, les décisions et leurs conséquences. Elles constituent l'historique des arbitrages structurants ; elles ne remplacent pas les documents canoniques qui décrivent l'état actuel.

Une ADR indiquée comme **remplacée** reste conservée pour comprendre l'historique, mais ne fait plus autorité sur le périmètre remplacé. Une ADR **partiellement remplacée** reste applicable uniquement sur les points qui n'ont pas été explicitement remplacés.

## Documents canoniques actuels

- [Documentation de Namesia](../README.md) — index et hiérarchie des sources.
- [État du projet](../etat-du-projet.md)
- [Gouvernance et autonomie](../gouvernance.md)
- [Vision produit](../vision-produit.md)
- [Architecture](../architecture.md)
- [Modèle de données](../modele-donnees.md)
- [Exploitation, sécurité et qualité](../operations.md)
- [Standards techniques](../standards-techniques.md)
- [Système de design](../design.md)
- [Bibliothèque de composants](../composants.md)
- [Vérification Material 3](../material-3-verification.md)
- [Gouvernance éditoriale](../qualite-editoriale.md)
- [Politique éditoriale](../politique-editoriale.md)
- [Génération et import](../pipeline-generation-ia.md)
- [Portabilité et réversibilité](../portabilite-et-reversibilite.md)
- [Mesure et croissance](../mesure-et-croissance.md)

## Index des ADR

### Fondations produit, données et architecture

- [ADR-0001 — Séparer génération IA et publication](ADR-0001-separation-generation-publication.md)
- [ADR-0002 — Statistiques de prénoms issues de l'Insee](ADR-0002-statistiques-insee.md) — partiellement remplacée par ADR-0048
- [ADR-0003 — Socle web et intégration Supabase](ADR-0003-premier-site-web.md)
- [ADR-0004 — Contrat JSON et stockage relationnel pour l'import éditorial](ADR-0004-modele-jsonb-import.md)

### Design system, composants et expérience

- [ADR-0005 — Adopter Material 3 Expressive comme référence d'interface](ADR-0005-material-3-expressive.md) — remplacée par ADR-0006
- [ADR-0006 — Séparer le thème Material Fidelity des accents Rainbow](ADR-0006-material-fidelity-rainbow.md) — remplacée par ADR-0028
- [ADR-0007 — Bibliothèque de composants partagés](ADR-0007-bibliotheque-composants.md) — remplacée par ADR-0037
- [ADR-0008 — Champ de recherche partagé](ADR-0008-champ-recherche-partage.md) — remplacée par ADR-0037
- [ADR-0009 — Action de sélection comparative partagée](ADR-0009-action-comparaison-partagee.md) — remplacée par ADR-0037
- [ADR-0010 — Liste de sélection comparative partagée](ADR-0010-liste-selection-comparaison.md) — remplacée par ADR-0037
- [ADR-0011 — Puce de filtre partagée](ADR-0011-puce-filtre-partagee.md) — remplacée par ADR-0037
- [ADR-0012 — Champ de sélection natif partagé](ADR-0012-champ-select-natif.md) — remplacée par ADR-0037
- [ADR-0013 — Suppression des boutons globaux historiques](ADR-0013-suppression-boutons-globaux.md) — remplacée par ADR-0037
- [ADR-0014 — Neutralité chromatique de la vitrine de prénoms](ADR-0014-neutralite-vitrine.md)
- [ADR-0015 — Direction Pixel Material 3 Fidelity](ADR-0015-direction-pixel-material3.md) — remplacée par ADR-0028
- [ADR-0016 — Usage sémantique de Rainbow et neutralité des surfaces](ADR-0016-usage-semantique-rainbow.md)
- [ADR-0017 — Couches d'état Material pour les interactions](ADR-0017-couches-etat-material.md)
- [ADR-0018 — Icônes actives et formulaires Material 3](ADR-0018-icones-et-formulaires-material.md) — partiellement remplacée par ADR-0020
- [ADR-0019 — Couches d'état de la navigation adaptative](ADR-0019-couches-etat-navigation.md)
- [ADR-0020 — Pictogrammes officiels Material Symbols Rounded](ADR-0020-material-symbols-officiels.md)
- [ADR-0021 — Échelle typographique Material 3](ADR-0021-echelle-typographique-material.md)
- [ADR-0022 — Contraste Rainbow par catégorie](ADR-0022-contraste-rainbow-categories.md)
- [ADR-0023 — Surfaces Fidelity canoniques](ADR-0023-surfaces-fidelity-canoniques.md) — remplacée par ADR-0024
- [ADR-0024 — Contrat design Material 3 sans alias ni overrides](ADR-0024-contrat-design-m3.md)
- [ADR-0025 — Unifier la lecture des fiches sur Material 3](ADR-0025-fiche-material-lecture.md)
- [ADR-0026 — Borner le chargement des suggestions de fiches](ADR-0026-suggestions-bornees.md)
- [ADR-0027 — Génération et vérification stricte des rôles Material 3 Fidelity](ADR-0027-fidelite-material-3-verifiable.md) — remplacée par ADR-0028
- [ADR-0028 — Baseline Material 3, couleurs sémantiques et référence AndroidX](ADR-0028-baseline-material-3-androidx-et-couleurs-semantiques.md) — couleur source remplacée par ADR-0045
- [ADR-0029 — Typographie des destinations de navigation Material 3](ADR-0029-typographie-navigation-material-3.md)
- [ADR-0030 — Géométrie du conteneur NavigationBar](ADR-0030-geometrie-navigation-bar.md) — remplacée par ADR-0031
- [ADR-0031 — Hauteur réelle de NavigationBar avec Compose Material 3 1.5.0](ADR-0031-hauteur-navigation-bar-compose-1-5.md)
- [ADR-0032 — Références Material 3 immuables et versionnées](ADR-0032-sources-material-3-versionnees.md)
- [ADR-0033 — Sémantique et hauteur de la navigation adaptative](ADR-0033-navigation-adaptative-accessibilite.md)
- [ADR-0034 — Géométrie et états du FilterChip AndroidX 1.5.0](ADR-0034-geometrie-filterchip-androidx-1-5.md)
- [ADR-0035 — Fidélité du champ de recherche à SearchBar AndroidX](ADR-0035-searchbar-androidx.md)
- [ADR-0036 — Géométrie et états des boutons AndroidX](ADR-0036-geometrie-boutons-androidx.md)
- [ADR-0037 — Architecture directe des composants Material 3](ADR-0037-architecture-composants-material3.md)
- [ADR-0038 — Migration effective des primitives Material 3](ADR-0038-migration-effective-material-3.md)
- [ADR-0039 — Séparer les composants du shell Material 3](ADR-0039-shell-material-3.md)
- [ADR-0040 — Nomenclature anglaise des composants](ADR-0040-nomenclature-composants.md)
- [ADR-0041 — Centraliser les surfaces de contenu avec Card](ADR-0041-card-material-3.md)
- [ADR-0042 — Centraliser les champs de formulaire avec TextField](ADR-0042-text-field-material-3.md)
- [ADR-0043 — Actions de prénom et pictogrammes de genre](ADR-0043-actions-et-pictogrammes-de-genre.md)
- [ADR-0044 — Historique des surfaces et actions du catalogue et du comparateur](ADR-0044-catalogue-comparateur-material.md) — remplacée par ADR-0037, ADR-0041 et ADR-0043
- [ADR-0045 — Source Google Blue pour le thème Material 3 Fidelity](ADR-0045-source-google-blue-material-3.md)
- [ADR-0046 — Confirmer la publication avec AlertDialog Material 3](ADR-0046-alert-dialog-material-3.md)

### Données, exploitation, gouvernance et production éditoriale

- [ADR-0047 — Le stockage de session est la source de vérité de l'historique](ADR-0047-historique-stockage-session.md)
- [ADR-0048 — Publier un instantané annuel du classement Insee](ADR-0048-classement-insee-2025.md)
- [ADR-0049 — Authentification administrateur passwordless](ADR-0049-authentification-admin-passwordless.md)
- [ADR-0050 — Hébergement Next.js sur Cloudflare Workers](ADR-0050-hebergement-cloudflare-workers.md)
- [ADR-0051 — Thème clair/sombre piloté par CSS natif](ADR-0051-theme-css-natif.md)
- [ADR-0052 — Propositions Dependabot quotidiennes et revue humaine](ADR-0052-dependabot-quotidien.md)
- [ADR-0053 — Compte utilisateur facultatif](ADR-0053-compte-utilisateur-facultatif.md)
- [ADR-0054 — Métadonnées et fraîcheur documentaire](ADR-0054-metadonnees-fraicheur-documentaire.md)
- [ADR-0055 — Gouvernance et autonomie de Namesia](ADR-0055-gouvernance-autonomie.md)
- [ADR-0056 — Génération contrôlée des fiches via Groq](ADR-0056-generation-groq.md) — remplacée par ADR-0057
- [ADR-0057 — Génération externe et import éditorial](ADR-0057-generation-externe-import.md)

## Contrat du registre

Le test `tests/adr-registry.test.mjs` vérifie l'unicité des identifiants, la cohérence entre nom de fichier et titre, les liens internes entre ADR et la présence de chaque ADR dans le présent registre. Toute nouvelle ADR doit être ajoutée à cet index dans la même demande de fusion ; une ADR remplacée n'est pas supprimée.
