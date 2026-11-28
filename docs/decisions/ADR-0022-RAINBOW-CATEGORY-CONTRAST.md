# ADR-0022 — Respecter les rôles de contraste Rainbow par catégorie

- **Statut :** active
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:18:09 (Europe/Paris)
- **Décision prise le :** 2026-11-23 (heure non consignée)

## Contexte

Les cartes d'associations symboliques reçoivent une teinte issue de leur catégorie Rainbow. Le fond du badge utilisait déjà `--category-container` et le schéma fournit `--category-on-container`, mais une surcharge Fidelity imposait ensuite `on-tertiary-container` à tous les badges. Le contraste ne correspondait donc plus à la catégorie affichée. Les règles CSS se superposaient aussi : une première bordure Rainbow était remplacée par une bordure neutre, puis la surface était redéfinie dans une couche tardive.

## Challenge

- **Conserver le rôle on-tertiary-container :** il peut sembler harmonieux pour une carte, mais il ne garantit pas le contraste du conteneur Rainbow réellement utilisé.
- **Appliquer la couleur Rainbow à toute la carte :** cela rendrait la surface trop saturée et ferait perdre la hiérarchie Fidelity.
- **Garder les overrides tardifs :** ils masquent les rôles de catégorie et rendent les styles difficiles à suivre.

## Décision

- Le badge d'une association utilise le couple `category-container` / `category-on-container` de la même catégorie, partagé avec le comparateur.
- Le contour de la carte mélange légèrement la couleur de catégorie avec `outline-variant` ; la surface mélange le conteneur Rainbow avec `surface-container-low`.
- Les textes de contenu restent sur les rôles Fidelity `on-surface` et `on-surface-variant`.
- Le fond dégradé historique est supprimé ; le style complet de la carte est défini dans une seule règle de base.
- La surcharge générique `on-tertiary-container` est supprimée.

## Conséquences

- Le contraste du badge reste cohérent avec la catégorie, en clair comme en sombre.
- Les catégories sont identifiables sans colorer toute la surface.
- Les cartes d'associations et le comparateur partagent le même couple tonal.
- La cascade CSS ne redéfinit plus plusieurs fois la surface et le contour des cartes symboliques.

## Validation

Les contrats CI vérifient le rôle `category-on-container`, l'absence de couleur tertiary générique et l'unicité de la règle de carte. Aucun test ni build local n'est exécuté.
