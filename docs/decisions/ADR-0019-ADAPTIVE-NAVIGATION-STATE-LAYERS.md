# ADR-0019 — Couches d'état de la navigation adaptative

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

La navigation basse et le rail latéral utilisaient une surface opaque `surface-container-high` au survol. La règle s'appliquait également aux appareils tactiles, où `:hover` peut rester collé après une pression. Les boutons partagés avaient déjà adopté le modèle Material de couches translucides, mais la navigation conservait une interaction différente.

## Challenge

- **Garder la surface opaque au survol :** elle remplace la surface de base au lieu de signaler un état temporaire ; elle est aussi appliquée sur les écrans tactiles.
- **Appliquer un filtre de luminosité :** il modifie les couleurs du composant et peut réduire la lisibilité.
- **Ajouter une bibliothèque de mouvement :** inutile pour une couche CSS dont la couleur et l'opacité suffisent.

## Décision

- Sur pointeur fin uniquement, le survol applique une couche de 8 % de la couleur de premier plan sur l'indicateur, qu'il soit inactif ou sélectionné.
- Le focus visible et la pression appliquent une couche de 12 % ; la couleur de premier plan est celle du texte inactif ou celle du contenu de l'indicateur sélectionné.
- La couche est appliquée à l'indicateur tonal, pas au conteneur du lien : la géométrie de navigation reste stable.
- Les transitions utilisent les tokens globaux de durée courte et de courbe standard.
- Aucun état `:hover` n'est imposé aux appareils tactiles.

## Conséquences

- La barre basse et le rail suivent le même langage d'interaction que les boutons Fidelity.
- La sélection reste identifiable pendant le survol et la pression.
- Les appareils tactiles ne conservent pas un état de survol artificiel.
- Aucune dépendance ou abstraction supplémentaire n'est introduite.

## Validation

Les contrats CI vérifient les couches 8 % et 12 %, le traitement distinct de l'indicateur sélectionné, l'absence de surface opaque et l'absence de durées locales. Aucun test ni build local n'est exécuté.
