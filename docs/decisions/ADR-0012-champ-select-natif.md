# ADR-0012 — Champ de sélection natif partagé

- **Statut :** remplacée par [ADR-0037](ADR-0037-architecture-composants-material3.md)
- **Portée historique :** la décision décrit l'ancienne organisation. La nomenclature et l'architecture actuelles sont définies par ADR-0037 et `docs/composants.md`.
- **Date :** 2026-11-23

## Contexte

La page des favoris présente deux sélecteurs : filtrage par genre et tri. Ils répétaient le même balisage label/select, les mêmes dimensions, les styles de bordure et les états de focus dans un CSS Module local.

## Challenge

- Garder deux contrôles locaux : peu de code, mais styles et accessibilité peuvent diverger.
- Remplacer les selects natifs par un menu personnalisé : apporte un contrôle visuel, mais dégrade potentiellement les conventions clavier, mobile et lecteur d'écran pour un gain limité.
- Partager un champ qui conserve le select HTML : mutualise label, options et styles tout en laissant le navigateur gérer l'interaction native.

## Décision

Créer `ChampSelect` dans `components/ui/`. Il reçoit un identifiant, un libellé visible, une valeur, une liste d'options et un callback de changement. Il rend un véritable `select` HTML avec des options natives, une cible de 48 px et un focus visible Fidelity.

Les filtres de genre et de tri de la page favoris l'utilisent. La logique de filtrage, la validation du tri et la synchronisation d'URL restent dans `ListeFavoris`. Les anciens styles locaux `.genre select` et `.sort select` sont supprimés.

## Conséquences

- Même apparence et contrat d'accessibilité pour les deux sélecteurs.
- Le menu natif du navigateur et du système est conservé.
- La primitive ne valide pas les valeurs métier : l'écran conserve la validation de `TriFavoris` et la cohérence du genre.
- Pas de dépendance ni de contrôle personnalisé.

## Validation

La CI vérifie le label natif, le select, les options, le focus et l'utilisation par la page favoris. Revue visuelle à effectuer en clair/sombre et sur téléphone/tablette, notamment pour le menu natif.
