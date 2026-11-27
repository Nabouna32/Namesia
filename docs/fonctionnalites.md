# Fonctionnalités actuelles — Namesia

- **Statut :** inventaire fonctionnel des capacités disponibles
- **Version :** 1.0
- **Mis à jour le :** 2026-11-27 11:05:11 (Europe/Paris)

Ce document décrit les comportements produit présents, pas les intentions ni la feuille de route. [État du projet](etat-du-projet.md) prévaut pour qualifier la disponibilité ; [Architecture](architecture.md) décrit les mécanismes techniques.

## Accueil et découverte

- Vitrine de trois prénoms répartis sur le catalogue et renouvelés quotidiennement.
- Découverte aléatoire d'un prénom publié, sans répétition immédiate lorsqu'un autre choix est disponible.
- Historique limité aux huit dernières fiches consultées dans l'onglet courant ; il repose sur `sessionStorage`, sans compte ni synchronisation.

## Catalogue et recherche

- Recherche tolérante aux accents, à la casse et aux séparateurs des prénoms composés.
- Filtres combinables par genre et initiale.
- Classement par pertinence : correspondance exacte, préfixe, puis occurrence.
- Suggestions proches lorsque la recherche ne renvoie aucun résultat normal.
- Affichage progressif par lots de 24 résultats.
- Recherche, filtres et nombre de résultats visibles partageables dans l'URL ; le retour depuis une fiche restaure le contexte.
- Copie de la liste filtrée en texte brut.

## Fiches de prénoms

- Fiches publiques accessibles par URL stable, avec rubriques éditoriales et associations symboliques facultatives.
- Mention visible indiquant que le contenu est généré par IA et peut comporter des erreurs.
- Suggestions de trois autres prénoms publiés du même genre, sans prétendre à une proximité étymologique ou culturelle.
- Partage natif du lien de la fiche.
- Actions de favori et d'accès au comparateur depuis la fiche.

## Favoris

- Favoris conservés localement dans le navigateur, dans `localStorage` ; ils ne sont ni envoyés au serveur ni synchronisés entre appareils.
- Recherche, filtre de genre, tri et affichage progressif par lots de 24.
- Export et import d'une sauvegarde JSON contenant les seuls identifiants de prénoms.
- Les favoris qui ne correspondent plus à une fiche publiée peuvent être conservés puis retirés explicitement.
- La page des favoris n'est pas indexée.

## Comparaison

- Comparaison de deux ou trois fiches publiées dans un tableau sémantique.
- Sélection partageable dans l'URL, sans stockage permanent.
- Recherche des prénoms à comparer et retrait individuel des sélections.
- Défilement horizontal du tableau sur les écrans étroits.

## Repères statistiques

- Page `/tendances` présentant les classements nationaux des dix prénoms féminins et masculins les plus attribués en France en 2025 selon l'Insee.
- Les effectifs sont arrondis au multiple de cinq selon la diffusion de l'Insee.
- Une entrée ouvre une fiche Namesia uniquement si celle-ci est publiée ; les autres entrées restent visibles comme données statistiques.
- Les fiches du catalogue présentes dans ces classements affichent leur rang et leur effectif.

Le classement est un instantané annuel, pas une mesure en temps réel. Il ne décrit ni les personnes vivantes ni la popularité dans d'autres pays. La décision et les limites de la source sont documentées dans [ADR-0048](decisions/ADR-0048-classement-insee-2025.md).

## Administration

- Accès privé par lien e-mail OTP.
- Import d'un fichier JSON ou d'un contenu collé.
- Validation du contrat et prévisualisation avant écriture.
- Import en brouillon ; publication explicite et séparée.
- Historique des versions éditoriales.

## Non disponible

Ne pas décrire comme des fonctions actuelles :
- compte visiteur et synchronisation multi-appareils ;
- favoris persistants côté serveur ;
- historique de consultation synchronisé ;
- formulaire public de signalement ou de correction ;
- génération IA depuis l'administration ;
- collecte documentaire et preuves liées aux affirmations ;
- statistiques en temps réel ou historiques pluriannuels.
