# ADR-0051 — Thème clair/sombre piloté par CSS natif

- **Statut :** acceptée
- **Date :** 2026-11-25
- **Complète :** [ADR-0037 — Architecture directe des composants Material 3](ADR-0037-architecture-composants-material3.md)

## Contexte

Le générateur `lib/material-theme.ts` calcule déjà les schémas Fidelity et Rainbow clair et sombre côté serveur. Il injecte les deux dans le `<head>` : les déclarations claires dans `:root`, les déclarations sombres dans `@media (prefers-color-scheme: dark)`. Le navigateur sait donc sélectionner le schéma et réagir à un changement de préférence système sans exécuter de JavaScript.

Malgré cela, `MaterialThemeProvider` ajoutait un composant client React, un effet `useEffect`, un écouteur `matchMedia` et une réécriture des mêmes variables en styles inline. Il écrivait aussi `data-theme`, attribut qui n'était consommé par aucune feuille CSS. Cette seconde voie dupliquait le comportement du navigateur et imposait une hydratation sans fournir de fonction supplémentaire : Namesia ne propose pas de sélecteur de thème manuel.

## Challenge

- **Conserver le fournisseur :** maintient un mécanisme JavaScript redondant, une frontière client globale et deux chemins d'application des mêmes tokens.
- **Basculer vers une bibliothèque de thème cliente :** ajoute une dépendance et une hydratation sans besoin produit de personnalisation manuelle.
- **Laisser le navigateur appliquer le CSS généré côté serveur :** conserve le rendu immédiat, la réactivité aux préférences système, les couleurs de barre navigateur déclarées par média et supprime la synchronisation DOM.

## Décision

Supprimer `MaterialThemeProvider`, son export et `applyMaterialTheme`. Le générateur serveur reste l'unique source des tokens ; `prefers-color-scheme` est l'unique mécanisme de sélection du schéma dans le navigateur.

Aucun thème manuel n'est ajouté. Une future préférence choisie dans Namesia devra être conçue comme une fonctionnalité produit complète (persistance, priorité sur la préférence système, rendu sans flash et accessibilité) et réévaluée séparément.

## Conséquences

- Le thème reste disponible dès le premier rendu HTML, sans attendre l'hydratation.
- Les changements de préférence système sont pris en charge nativement par CSS.
- Une frontière client globale et un effet React disparaissent.
- Le contrat est plus simple : un générateur, deux schémas, une règle média, aucun état DOM parallèle.
- Les couleurs `theme-color` du navigateur conservent leurs attributs `media` calculés depuis les mêmes schémas.

## Validation

La CI vérifie que les schémas clair/sombre et la règle média sont générés, que le layout ne dépend plus d'un fournisseur client, que l'ancien module et son export ont disparu, et que les couleurs de barre navigateur utilisent les mêmes tokens. Les tests et le build ne sont considérés réussis qu'après confirmation par GitHub Actions.
