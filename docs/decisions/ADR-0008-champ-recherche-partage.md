# ADR-0008 — Champ de recherche partagé

- **Statut :** remplacée par [ADR-0037](ADR-0037-architecture-composants-material3.md)
- **Portée historique :** la décision décrit l'ancienne organisation. La nomenclature et l'architecture actuelles sont définies par ADR-0037 et `docs/composants.md`.
- **Date :** 2026-11-23

## Contexte

Le catalogue, le comparateur et la liste des favoris proposaient chacun un champ de recherche avec des structures et des styles différents. Le catalogue avait une icône et un bouton d'effacement, le comparateur et les favoris avaient des contrôles plus simples. Cette divergence n'apportait aucune valeur métier et rendait le comportement clavier, le focus et les états visuels incohérents.

## Challenge

- Garder trois implémentations : liberté locale, mais divergence visuelle et duplication.
- Ajouter une bibliothèque de formulaires complète : disproportionnée pour trois écrans et plusieurs contrôles natifs.
- Extraire un champ de recherche unique : mutualise le contrat commun sans déplacer la recherche, le filtrage ni la synchronisation d'URL dans la bibliothèque.

## Décision

Créer `ChampRecherche` dans `components/ui/`. Il porte le libellé accessible, l'icône, le champ natif contrôlé, le bouton d'effacement, la cible tactile et les états Material 3 Fidelity. Le mode compact masque visuellement le libellé tout en le conservant accessible.

Le catalogue, le comparateur et les favoris gardent chacun leur état, leurs règles de recherche, leur logique de pagination et leur synchronisation d'URL. Le composant partagé ne connaît pas ces métiers.

Les anciennes règles CSS des champs du catalogue et du comparateur sont supprimées ; la feuille locale des favoris ne redéfinit plus l'apparence du champ.

## Conséquences

- Même apparence, focus, icône et affordance d'effacement sur les trois parcours.
- Pas de nouvelle dépendance.
- Les champs de sélection et de saisie administrative ne sont pas inclus : ils n'ont pas encore un contrat commun démontré.
- Toute évolution doit préserver le label natif, le contrôle clavier et le focus visible.

## Validation

La CI doit vérifier que les trois parcours composent la primitive et que celle-ci conserve les éléments natifs, le libellé et l'effacement. Une revue visuelle reste nécessaire en clair/sombre et sur mobile/tablette.
