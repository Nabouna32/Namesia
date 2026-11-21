# Vision produit — Namesia

- **Statut :** document canonique
- **Version :** 1.1
- **Mis à jour :** 2026-11-22

## 1. Positionnement

Namesia est un média et un outil interactif consacré aux prénoms. Son nom associe « name » et « IA » et évoque un univers à explorer.

La plateforme s'adresse aux personnes qui souhaitent découvrir des prénoms, explorer leurs origines, leurs histoires, leurs usages et les représentations qui leur sont associées.

Le lancement éditorial vise la France et les usages francophones. Le modèle technique doit permettre d'ajouter d'autres pays et langues sans refonte.

## 2. Proposition de valeur

Proposer des fiches agréables à lire et des outils simples pour rechercher, comparer et découvrir des prénoms.

Les contenus sont produits à l'aide de modèles d'intelligence artificielle. Selon les besoins, la génération peut passer par une API ou par une conversation avec un assistant, puis le contenu est intégré dans la base de données.

**La génération par IA n'est pas une vérification.** Un contenu enregistré ou publié par Namesia n'est pas, de ce seul fait, confirmé par une source indépendante ou validé par un spécialiste. Il peut comporter des erreurs, des approximations ou des informations incomplètes.

Namesia ne promet donc pas actuellement un référencement systématique des affirmations, une vérification indépendante ni une séparation éditoriale garantie entre faits historiques, étymologie et interprétations culturelles.

## 3. Principes de contenu

1. Ne pas présenter la génération par IA comme une preuve ou une garantie d'exactitude.
2. Ne pas inventer de références ni laisser entendre qu'une information a été vérifiée lorsqu'elle ne l'a pas été.
3. Employer une formulation prudente lorsque le contenu généré évoque une origine, une étymologie ou une tradition incertaine.
4. Signaler clairement aux visiteurs que les contenus sont générés par IA et peuvent comporter des erreurs.
5. Corriger les erreurs identifiées sans masquer les limites du processus de production.

Ces principes décrivent le niveau de transparence attendu. Ils ne signifient pas qu'un processus de vérification humaine ou documentaire existe déjà.

## 4. Périmètre du produit

### Inclus

- Catalogue de prénoms francophones et internationaux utilisés en France.
- Page dédiée par prénom avec URL stable.
- Recherche par prénom et filtres de base.
- Fiches de découverte avec des contenus générés par IA et intégrés en base.
- Outils de comparaison et de découverte lorsque leur utilité est établie.
- Interface responsive et fondamentaux SEO (métadonnées, canonical, sitemap, données structurées pertinentes).

### Non garanti à ce stade

- Références bibliographiques pour chaque affirmation.
- Vérification systématique par des sources indépendantes.
- Relecture ou validation par un spécialiste avant chaque publication.
- Exhaustivité ou exactitude garantie des informations générées.
- Distinction systématique et contrôlée entre faits, hypothèses et interprétations.

Ces capacités pourront faire l'objet d'une évolution produit ultérieure, mais ne doivent pas être présentées comme déjà acquises.

## 5. Expérience et SEO

Une page doit répondre à une intention réelle et apporter une information utile. Éviter la génération massive de pages quasi identiques ou de paragraphes génériques artificiellement allongés.

Chaque fiche publiée doit :
- proposer un contenu spécifique et lisible ;
- éviter les affirmations catégoriques lorsque le contenu disponible ne les justifie pas ;
- ne pas afficher de référence fictive ni de statut de vérification trompeur ;
- afficher la mention indiquant que le contenu est généré par IA et peut comporter des erreurs ;
- avoir un titre, une description et une URL cohérents.

Les pages de filtres, recherches internes et combinaisons sans contenu éditorial propre ne doivent pas créer de pièges à indexation.

## 6. Direction visuelle et expérience

La direction visuelle retenue pour le site est **arc-en-ciel, chaleureuse et compacte**.

- Utiliser une palette multicolore visible (rose, orange, jaune, vert, bleu, violet), avec des dégradés et des aplats pastel pour éviter un rendu agressif.
- Garder un contraste suffisant pour les textes, les contrôles et les états interactifs ; l'arc-en-ciel est un langage visuel, pas un substitut aux couleurs fonctionnelles.
- Réduire les espaces verticaux excessifs : privilégier une densité confortable, des sections rapprochées et des cartes plus compactes, sans sacrifier la lisibilité ni les zones tactiles sur mobile.
- Éviter les grandes zones décoratives vides qui repoussent le contenu utile sous la ligne de flottaison.
- Les textes de lecture courante visent une taille de 14 à 16 px sur ordinateur, avec une interligne confortable ; les informations secondaires restent au moins à 12 px lorsqu'elles sont utiles.
- La typographie de navigation utilise des unités relatives (`rem`) et une mise à l'échelle fluide (`clamp()`), afin de respecter les préférences de taille du navigateur tout en restant lisible sur les petits écrans.
- Éviter les microtextes pour les avertissements, statuts et explications : une information nécessaire à la compréhension ne doit jamais être reléguée dans une taille difficile à lire.
- Éviter les numérotations décoratives sans fonction (par exemple 01, 02, 03 devant des principes ou des rubriques) : les titres et la structure sémantique suffisent.
- Cette direction est une décision de design initiale à réévaluer sur mobile et sur les pages de fiches, à partir du rendu réel et de retours d'usage.

## 7. Indicateurs à suivre

- Nombre de fiches disponibles et qualité perçue de leur contenu.
- Taux de corrections après identification d'erreurs.
- Couverture des champs utiles, sans inciter à remplir les champs inconnus.
- Qualité de recherche : zéro résultat, clic vers fiche, reformulation.
- Engagement sur les outils de comparaison et de découverte.
- Trafic organique qualifié et pages indexées utiles.

## 8. Critères de réussite

Le produit progresse lorsque :
- les fiches peuvent être générées, corrigées, intégrées et publiées indépendamment du frontend ;
- la mention relative à la génération par IA est visible et compréhensible ;
- les erreurs identifiées peuvent être corrigées dans la base ;
- le site propose recherche, consultation et navigation responsive ;
- les fondamentaux SEO et les règles d'indexation sont respectés ;
- les procédures réellement en place sont documentées dans le dépôt.
