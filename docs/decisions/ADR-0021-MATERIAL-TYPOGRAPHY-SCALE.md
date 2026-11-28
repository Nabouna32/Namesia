# ADR-0021 — Consolider l'échelle typographique Material 3

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

Les titres de l'accueil, du catalogue, des fiches et du comparateur avaient des tailles très différentes et plusieurs règles responsives se contredisaient. Le hero pouvait atteindre 88 px, le titre de fiche 64 px et certains titres de section grossissaient sur mobile. Une couche CSS Fidelity ajoutée en fin de feuille redéfinissait en outre les mêmes titres une seconde fois. Le rendu ressemblait davantage à une landing page éditoriale qu'à une application Pixel.

## Challenge

- **Conserver les très grands titres :** ils créent une hiérarchie marketing, mais ne correspondent pas à la densité ni à l'échelle d'une application Material 3.
- **Réduire uniquement le hero :** cela laisserait des tailles concurrentes sur les fiches, les comparateurs et les titres de section.
- **Ajouter une bibliothèque de typographie :** les rôles Material se traduisent directement en quelques tokens CSS ; une dépendance supplémentaire n'apporterait rien.
- **Garder les overrides responsives :** ils masquent les tailles de base et rendent le résultat difficile à prévoir.

## Décision

- Définir une seule échelle CSS Material 3 : display small 36/44 px, headline large 32/40 px, headline medium 28/36 px, headline small 24/32 px et body large 16/24 px.
- Utiliser Roboto pour tous les rôles typographiques. Material 3 Android définit Roboto pour les titres comme pour le corps ; Google Sans n’est pas la police de son échelle standard. Une seule famille est déclarée, sans pile de substitution ni police distante.
- Appliquer display small au hero, headline large aux titres de page et de fiche, headline medium aux sections et headline small aux sous-sections et cartes de comparaison.
- Ramener les textes d'introduction et de lecture courante au rôle body large 16/24 px.
- Supprimer les anciennes règles responsives qui remplaçaient ces tailles par 51, 61 ou 88 px et retirer les tokens de police serif inutilisés.
- Conserver les dimensions de mise en page responsives ; seuls les rôles typographiques restent stables.

## Rectification de la décision typographique

La première rédaction de cette ADR introduisait Google Sans pour les titres « si installée », puis Roboto en repli. Ce choix était erroné : il contredisait la direction Roboto de l’ADR-0015 et la typographie standard Material 3 documentée par Android. Il est remplacé par Roboto pour l’ensemble des rôles.

Référence : [Typographie Material 3 pour Jetpack Compose](https://developer.android.com/develop/ui/compose/designsystems/material3), dont l’échelle associe explicitement Roboto à chaque rôle display, headline, title, body et label.

## Conséquences

- Les pages partagent une hiérarchie prévisible, plus proche d'une application Pixel.
- Les titres restent lisibles sans dominer les contenus éditoriaux.
- Les CSS Modules et les media queries ne redéfinissent plus la taille des mêmes titres.
- Aucun chargement de police distant ni dépendance supplémentaire n'est introduit.

## Validation

Les contrats CI vérifient les tokens d'échelle, leur consommation par les titres et l'absence de règles concurrentes pour les sélecteurs principaux. Aucun test ni build local n'est exécuté.
