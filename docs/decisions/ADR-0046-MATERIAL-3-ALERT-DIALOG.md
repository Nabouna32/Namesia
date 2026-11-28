# ADR-0046 — Confirmer la publication avec AlertDialog Material 3

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:18:09 (Europe/Paris)
- **Décision prise le :** 2026-11-25 (heure non consignée)
- **Référence :** AndroidX Compose Material 3 1.5.0 stable, commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`

## Contexte

La publication d'une fiche la rend visible publiquement et archive la version publiée précédente. Le bouton d'administration déclenchait cette opération immédiatement, sans étape de confirmation. Il s'agit d'une action éditoriale conséquente qui mérite une décision explicite avant l'envoi de la requête.

## Décision

Créer `components/material3/AlertDialog.tsx` comme port Web du contrat AndroidX `AlertDialog`, puis l'utiliser avant toute publication depuis l'administration.

- Employer l'élément HTML natif `dialog` avec `showModal()` : le navigateur fournit le top layer, le confinement du focus, la sémantique modale et la fermeture clavier.
- Reprendre `DialogTokens` : `surface-container-high`, `corner-extra-large`, `Level3`, `headline-small`, `body-medium` et actions `label-large`.
- Utiliser les boutons M3 existants en variante `text` ; le bouton Annuler précède Publier dans l'ordre DOM afin de recevoir le focus initial.
- Fermer sur Échap, clic sur le scrim ou Annuler ; conserver le nœud DOM monté quand le dialogue est fermé afin que le navigateur restitue le focus à son déclencheur.
- La confirmation ferme le dialogue puis déclenche la publication.
- Garder le composant contrôlé et limité au besoin actuel : titre, description et deux actions. Ne pas créer un système de dialogue générique ni ajouter des variantes non utilisées.

## Options écartées

| Option | Décision | Motif |
|---|---|---|
| `window.confirm()` | Écartée | Présentation et comportement contrôlés par le navigateur, sans fidélité visuelle M3. |
| `div` avec `role="dialog"` | Écartée | Oblige à réimplémenter le top layer, le focus trap, l'Échap et le retour du focus. |
| Dialogue propriétaire sans source AndroidX | Écarté | Duplique un contrat M3 existant et rend la fidélité invérifiable. |
| Importer Compose directement | Impossible | AndroidX Compose est une bibliothèque Kotlin/Android, pas une dépendance React exécutable dans Next.js. |

## Conséquences

La publication ne peut plus être déclenchée par un seul clic accidentel. Le dialogue reste une composition Web explicite du contrat AndroidX ; il n'introduit ni dépendance UI externe, ni primitive concurrente, ni fallback. Les menus, feuilles et autres types de dialogues ne seront ajoutés qu'en présence d'un parcours produit qui les justifie.

## Validation

La CI vérifie les sources AndroidX épinglées `AlertDialog.kt` et `DialogTokens.kt`, leur présence dans le registre canonique, l'usage de `showModal()`, la fermeture clavier et le scrim, ainsi que le parcours de confirmation de publication dans l'administration.
