# ADR-0042 — Centraliser les champs de formulaire avec TextField

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:05:17 (Europe/Paris)
- **Décision prise le :** 2026-11-24 (heure non consignée)
- **Référence :** AndroidX Compose Material 3 1.5.0 stable, commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`

## Contexte

L'administration utilisait des champs email et textarea stylés localement dans son CSS Module. La forme, les états, le label, la typographie et le focus étaient donc gérés en dehors de la bibliothèque Material 3.

## Décision

L’implémentation canonique est `components/material3/TextField.tsx` et `components/material3/TextField.module.css`.

- Créer `TextField` avec les variantes explicites `filled` et `outlined`.
- Reproduire l'anatomie M3 : conteneur, label flottant, saisie, supporting text, état d'erreur, désactivation et focus.
- Utiliser les rôles typographiques `body-large`, `label-small` et `body-small` ainsi que les tokens de couleur, forme et mouvement.
- Migrer le champ e-mail et le champ JSON de l'administration.
- Conserver le sélecteur de fichier comme contrôle HTML natif spécialisé.
- Garder dans les CSS Modules des pages uniquement les adaptations de contenu (par exemple la police monospace de l'éditeur JSON), jamais la surface ou l'état du champ.
- Réutiliser l'indicateur de focus global ; le composant ne crée pas un second anneau.

## Conséquences

Les champs ont la même anatomie et les mêmes états partout. Les variantes sont choisies explicitement et les contrôles natifs spécialisés ne sont pas artificiellement renommés.

## Validation

La CI vérifie les variantes, le label flottant, les états, les tokens, l'usage dans l'administration et l'absence des styles locaux concurrents.
