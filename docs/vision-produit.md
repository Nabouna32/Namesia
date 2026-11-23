# Vision produit — Namesia

- **Statut :** document canonique
- **Version :** 3.10
- **Mis à jour :** 2026-11-23

## 1. Positionnement

Namesia est un média et un outil interactif consacré aux prénoms. La plateforme permet de découvrir des prénoms, leurs origines possibles, leurs histoires, leurs usages et les représentations culturelles qui leur sont associées.

Le lancement éditorial vise la France et les usages francophones. L'ouverture à d'autres marchés et langues n'est pas un objectif du premier périmètre : elle devra répondre à un besoin réel avant d'ajouter des dimensions au modèle.

## 2. Proposition de valeur et limites éditoriales

Proposer des fiches agréables à lire et des outils simples pour rechercher, comparer et découvrir des prénoms.

Les contenus sont générés en amont par une IA (API ou conversation). Le JSON reçu est importé depuis l'administration, validé structurellement puis réparti dans les colonnes relationnelles de Supabase.

Les contenus sont générés par IA et peuvent comporter des erreurs, des approximations ou des informations incomplètes.

Namesia ne met en place aucun système de sources ou de vérification documentaire.

## 3. Principes de contenu

1. Ne jamais présenter la génération par IA comme une preuve ou une garantie d'exactitude.
2. Ne pas inventer de références ni laisser entendre qu'une information a été vérifiée.
3. Employer des formulations prudentes pour les origines, étymologies et traditions incertaines.
4. Signaler clairement que les contenus sont générés par IA et peuvent comporter des erreurs.
5. Ne jamais présenter une symbolique, une numérologie ou un portrait de personnalité comme une vérité scientifique ou prédictive.
6. Corriger les erreurs identifiées sans masquer les limites du processus de production.

Ces principes de transparence ne constituent pas un processus de vérification factuelle.

## 4. Périmètre produit

### Inclus

- Catalogue de prénoms utilisé en France.
- Page dédiée par prénom avec URL stable.
- Recherche de prénoms avec prise en compte des accents et des variantes de casse ; classement des résultats par pertinence (correspondance exacte, puis préfixe, puis occurrence la plus proche du début du prénom), avec filtres combinables par genre et initiale. En l'absence de résultat normal, proposer jusqu'à cinq suggestions proches pour les recherches d'au moins quatre caractères, avec une tolérance d'une ou deux modifications selon la longueur et en respectant les filtres actifs. Les résultats et suggestions affichent aussi le genre associé à chaque fiche. Le catalogue présente 24 résultats au départ et révèle les suivants par lots de 24 pour garder une liste facile à parcourir.
- URL partageable du catalogue : la recherche et les filtres actifs sont conservés dans les paramètres q, genre et lettre, puis restaurés à l'ouverture du lien.
- Vitrine d'accueil de trois prénoms répartis sur le catalogue et renouvelés quotidiennement en UTC, plutôt que trois entrées alphabétiques consécutives ; chaque carte indique aussi le genre du prénom. La sélection s'adapte si le catalogue contient moins de trois fiches.
- Découverte aléatoire d'un prénom publié depuis l'accueil, sans répétition immédiate tant qu'un autre choix est disponible.
- Favoris locaux : enregistrer ou retirer un prénom depuis sa fiche ou directement depuis les résultats du catalogue et de la recherche, puis retrouver la sélection dans une liste dédiée, sans compte ni synchronisation entre appareils. Les actions compactes des résultats restent distinctes du lien vers la fiche. La liste utilise uniquement les informations d'index nécessaires à son affichage, pas les textes complets des fiches.
- Accès direct au comparateur depuis une fiche, avec le prénom déjà sélectionné et la possibilité d'en ajouter jusqu'à deux autres. Depuis les résultats et suggestions du catalogue, sélection de deux ou trois prénoms puis ouverture du comparateur avec cette sélection préremplie.
- Fiches de découverte avec introduction, origine, histoire, usages, associations symboliques facultatives ; suggestions de trois autres prénoms publiés du même genre, diversifiées selon la fiche consultée et stables dans le temps. Ce critère ne prétend pas établir une proximité d'origine ou de signification ; partage natif de la fiche.
- Comparaison partageable de deux ou trois fiches sur leurs informations éditoriales publiées, via l'URL de la sélection. Le catalogue de choix ne charge que l'index léger ; les contenus complets sont demandés uniquement pour les fiches sélectionnées. Le sélecteur présente 24 prénoms au départ et permet d'en afficher 24 de plus à chaque étape ; la recherche revient au premier lot.
- Aperçus de partage visuels avec une carte dédiée à chaque fiche.
- Génération hors du site, par API ou conversation, puis import d'un JSON.
- Administration privée : authentification, import, validation structurelle, création de brouillon, prévisualisation et publication explicite.
- Historique des versions afin de remplacer une fiche sans écraser la version précédemment publiée.
- Lecture publique limitée aux versions publiées.
- Interface responsive et navigation accessible au clavier, avec lien d'évitement et respect de la préférence de réduction des mouvements.
- Fondamentaux SEO : URL canoniques, métadonnées sociales, données structurées Schema.org, sitemap des fiches publiées et règles robots.

### Hors périmètre actuel

- Génération IA déclenchée directement depuis l'administration.
- Vérification indépendante des affirmations et workflow de claims/preuves.
- Statistiques de popularité et données Insee.
- Workflow multi-relecteurs, rôles complexes ou validation par spécialiste.
- Gestion multi-pays et multilingue.
- Historique détaillé des coûts, tokens et exécutions de génération.

Ces capacités ne seront ajoutées que si un besoin concret les justifie.

## 5. Administration et publication

Le JSON est un contrat d'échange, pas une preuve de fiabilité. L'import vérifie sa structure, ses types, ses limites et ses champs autorisés. Il ne vérifie pas la véracité du texte.

Toute importation crée une nouvelle version en brouillon. La publication est une action séparée, réservée à un compte explicitement autorisé. Une publication archive la version précédente sans l'écraser.

Les statuts et numéros de version sont attribués par le backend ; ils ne sont jamais acceptés depuis le JSON généré.

## 6. Expérience et SEO

Une page doit répondre à une intention réelle et apporter une information utile. Éviter la génération massive de pages quasi identiques ou de paragraphes génériques artificiellement allongés.

Chaque fiche publiée doit :
- proposer un contenu lisible, suffisamment spécifique et organisé en rubriques clairement identifiables ;
- offrir un sommaire permettant d'accéder directement aux rubriques présentes ;
- afficher la mention relative à la génération par IA ;
- avoir un titre, une description et une URL cohérents.

Les pages de filtres, recherches internes et combinaisons sans contenu éditorial propre ne doivent pas créer de pièges à indexation.

## 7. Direction visuelle

La direction visuelle et ses règles détaillées sont définies dans [docs/design.md](design.md). Toute évolution d'interface doit utiliser ses tokens sémantiques, ses deux thèmes et ses composants cohérents. La sobriété, la lisibilité et le mobile-first priment sur les effets décoratifs.


## 8. Indicateurs

- Nombre de fiches publiées et qualité perçue.
- Temps nécessaire pour importer, corriger et publier une fiche.
- Taux de corrections après identification d'erreurs.
- Qualité de recherche : zéro résultat, clic vers fiche, reformulation.
- Engagement sur les outils de découverte.
- Trafic organique qualifié et pages indexées utiles.

## 9. Critères de réussite

- Un JSON conforme peut être importé sans modifier le code.
- Toute importation crée un brouillon et ne modifie pas la fiche publique existante.
- Une publication est explicite et réservée à l'administrateur.
- Le public ne peut lire que les fiches publiées.
- Les erreurs de structure et les pannes techniques sont distinguées d'une absence de contenu.
- Les limites liées à la génération IA sont clairement visibles.
- Le dépôt décrit fidèlement le fonctionnement réel.
