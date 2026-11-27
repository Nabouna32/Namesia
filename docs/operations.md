# Exploitation, sécurité et qualité — Namesia

- **Statut :** référence canonique
- **Version :** 1.1
- **Mis à jour le :** 2026-11-27 01:08:00 (Europe/Paris)

Ce document rassemble les décisions opérationnelles validées dans l’issue #345. Les règles de réalisation et de CI restent détaillées dans AGENTS.md et docs/standards-techniques.md.

## Fiabilité et exploitation

L’agent est responsable de la fiabilité opérationnelle et peut remettre en question l’infrastructure, les workflows, les outils et les pratiques existants. L’existant est un point de départ, pas une limite. La solution doit être adaptée aux besoins réels, au stade du produit, aux coûts et aux capacités de maintenance.

- Surveiller les déploiements, la disponibilité, les erreurs et les changements de comportement qui affectent les visiteurs.
- Définir des contrôles utiles, une journalisation proportionnée, des alertes exploitables et des procédures de diagnostic.
- Prévoir des retours arrière réalistes et documenter les dépendances opérationnelles.
- Éviter les vérifications répétitives, les tableaux de bord sans usage et l’observabilité disproportionnée.
- Évaluer les limites des offres gratuites et les coûts avant toute évolution ; tout nouvel engagement payant requiert un arbitrage préalable.

## Incidents et sécurité

La réponse dépend de la gravité, de l’étendue, de la réversibilité et des données concernées. Contenir rapidement une exposition active, préserver les éléments utiles au diagnostic, corriger la cause, évaluer les impacts et documenter les suites. Une suspicion de compromission de secret impose sa révocation ou rotation et la vérification des accès concernés.

La sécurité est intégrée à la conception : contrôle d’accès, RLS, validation des entrées, protection des API, limitation des abus, gestion des secrets, dépendances, sécurité des workflows et séparation des environnements. Ne jamais exposer un secret privilégié dans le navigateur, le dépôt, les logs ou une réponse publique. Les opérations destructrices sont proportionnées à la valeur réelle des données : les exemples recréables du pré-lancement ne justifient pas une procédure de sauvegarde industrielle ; les données éditoriales validées et les données réelles de visiteurs changent ce niveau d’exigence.

## Assurance qualité

La stratégie de tests vise les risques et les parcours réellement importants, pas le volume de tests. Combiner tests unitaires, intégration, contrats, types, build et E2E selon le besoin. Supprimer les tests redondants, fragiles ou devenus sans objet.

- Playwright couvre des parcours publics représentatifs et des régressions coûteuses.
- Les captures, vidéos et traces ne sont pas produites systématiquement.
- Le label diagnostic-playwright active ponctuellement les diagnostics temporaires prévus par le workflow ; les artefacts ont une rétention courte et sont supprimés dès qu’ils ne sont plus utiles.
- Les snapshots ne sont pas régénérés pour des composants déjà vérifiés lorsqu’ils n’ont pas changé.
- Les audits automatisés sont des outils de diagnostic ; ils ne doivent pas provoquer de dégradation silencieuse du design ou de l’expérience.

Une fonctionnalité est terminée lorsqu’elle apporte une valeur réelle et est suffisamment aboutie pour être livrée sereinement, sans exiger une perfection abstraite. L’évaluation couvre l’utilité, l’expérience, le design, la fiabilité, la maintenabilité et la proportionnalité du coût et du risque.

## Accessibilité et éco-conception

L’accessibilité est une exigence de conception permanente : sémantique, clavier, focus, lecteur d’écran, contrastes, zoom, reflow, formulaires, mouvements réduits et compatibilité avec les technologies d’assistance. Les écarts sont évalués et corrigés sans sacrifier arbitrairement Material 3 Fidelity ; un conflit réel est documenté et arbitré.

La performance technique et perçue se mesure notamment par les Core Web Vitals, le chargement des pages et médias, la fluidité des interactions, le poids JavaScript/CSS, le réseau, le cache et les accès Supabase. Les évaluations doivent couvrir des conditions représentatives : mobile, appareils modestes et réseaux plus lents. Les scores synthétiques ne remplacent pas l'observation des parcours réels. Une optimisation ne justifie jamais de dégrader lisibilité, hiérarchie visuelle, accessibilité, animations utiles ou cohérence du design system.

L’éco-conception réduit le poids des pages, ressources, scripts, images, polices, dépendances, requêtes et traitements inutiles. Elle vise les appareils modestes et les réseaux lents sans rendre l’interface fade ni sacrifier la qualité UX/UI.

## Conformité

Évaluer les obligations applicables : RGPD, cookies et consentement, mentions légales, confidentialité, licences, propriété intellectuelle et conditions des fournisseurs. Ne pas se substituer à un conseil juridique spécialisé lorsqu’un enjeu sérieux le nécessite. Ne jamais présenter une analyse automatisée comme un avis juridique.
