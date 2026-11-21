# Vision produit — Namesia

- **Statut :** document canonique initial
- **Version :** 1.0
- **Mis à jour :** 2026-11-22

## 1. Positionnement

Namesia est un média et un outil interactif consacré aux prénoms. Son nom associe « name » et « IA » et évoque un univers à explorer.

La plateforme s'adresse à deux publics :
- les futurs parents qui recherchent, comparent et sélectionnent un prénom ;
- les personnes curieuses de son origine, de son histoire, de sa signification et de ses représentations.

Le lancement éditorial vise la France et les usages francophones. Le modèle technique doit permettre d'ajouter d'autres pays et langues sans refonte.

## 2. Proposition de valeur

Proposer des fiches agréables à lire, utiles à la décision et transparentes sur la nature de leurs informations :
- **faits documentés** : étymologie, langues, histoire, variantes, fête et statistiques lorsqu'une source fiable existe ;
- **contenus symboliques** : traditions, représentations culturelles et interprétations ludiques, explicitement présentées comme telles ;
- **outils** : recherche, filtres, comparaisons et parcours de découverte.

Namesia ne présente jamais une interprétation symbolique, une association de couleur, une numérologie ou un profil de personnalité comme un fait scientifique.

## 3. Principes éditoriaux

1. Toute affirmation factuelle importante doit être traçable à une source.
2. Une source doit être qualifiée : organisme, ouvrage, publication, date, URL ou référence bibliographique.
3. L'absence de preuve est représentée comme une donnée inconnue, jamais comblée par une invention.
4. Les variantes, homonymes et étymologies discutées sont signalés.
5. Les statistiques sont contextualisées par pays, période, population et source.
6. Les contenus symboliques identifient leur tradition ou leur cadre d'interprétation lorsqu'il est connu.
7. Les fiches sont relues et validées selon un workflow explicite avant publication.
8. La génération IA ne constitue pas une source.

## 4. Périmètre du MVP

### Inclus
- Catalogue de prénoms francophones et internationaux utilisés en France.
- Page dédiée par prénom avec URL stable.
- Recherche par prénom et filtres de base (initiale, genre d'usage, origine lorsque connue).
- Fiche séparant clairement faits, symbolique et données statistiques.
- Sources visibles et date de dernière vérification.
- Suggestions de prénoms liés, uniquement si la relation est justifiée.
- Pipeline de génération JSON, validation structurelle et contrôle éditorial.
- Interface responsive et fondamentaux SEO (métadonnées, canonical, sitemap, données structurées pertinentes).

### Hors périmètre initial
- Comptes utilisateurs et favoris synchronisés.
- Contributions publiques.
- Conseils médicaux, psychologiques ou prédictifs.
- Génération libre publiée sans validation.
- Traduction automatique et déploiement international complet.

## 5. Expérience et SEO

Une page doit répondre à une intention réelle et apporter une information distincte. Pas de génération massive de pages quasi identiques.

Chaque fiche publiée doit :
- avoir un contenu suffisamment documenté et spécifique ;
- afficher les incertitudes et les informations indisponibles ;
- éviter les paragraphes génériques artificiellement allongés ;
- avoir un titre, une description et une URL cohérents ;
- être indexable seulement si les critères éditoriaux minimaux sont satisfaits.

Les pages de filtres, recherches internes et combinaisons sans contenu éditorial propre ne doivent pas créer de pièges à indexation.

## 6. Direction visuelle et expérience

La direction visuelle retenue pour le site est **arc-en-ciel, chaleureuse et compacte**.

- Utiliser une palette multicolore visible (rose, orange, jaune, vert, bleu, violet), avec des dégradés et des aplats pastel pour éviter un rendu agressif.
- Garder un contraste suffisant pour les textes, les contrôles et les états interactifs ; l'arc-en-ciel est un langage visuel, pas un substitut aux couleurs fonctionnelles.
- Réduire les espaces verticaux excessifs : privilégier une densité confortable, des sections rapprochées et des cartes plus compactes, sans sacrifier la lisibilité ni les zones tactiles sur mobile.
- Éviter les grandes zones décoratives vides qui repoussent le contenu utile sous la ligne de flottaison.
- Les textes de lecture courante visent une taille de 14 à 16 px sur ordinateur, avec une interligne confortable ; les informations secondaires restent au moins à 12 px lorsqu'elles sont utiles.
- La typographie de navigation utilise des unités relatives (`rem`) et une mise à l'échelle fluide (`clamp()`), afin de respecter les préférences de taille du navigateur tout en restant lisible sur les petits écrans.
- Éviter les microtextes pour les sources, avertissements, statuts et explications : une information nécessaire à la compréhension ne doit jamais être reléguée dans une taille difficile à lire.
- Cette direction est une décision de design initiale à réévaluer sur mobile et sur les pages de fiches, à partir du rendu réel et de retours d'usage.

## 7. Indicateurs à suivre

- Part des fiches publiées disposant de sources exploitables.
- Taux de corrections après publication.
- Couverture des champs utiles, sans inciter à remplir les champs inconnus.
- Qualité de recherche : zéro résultat, clic vers fiche, reformulation.
- Engagement sur les outils de comparaison et de découverte.
- Trafic organique qualifié et pages indexées utiles.
- Fraîcheur des données statistiques.

## 7. Critères de réussite du MVP

Le MVP est prêt lorsque :
- le schéma JSON est versionné et validé automatiquement ;
- les fiches peuvent être générées, contrôlées, corrigées et publiées indépendamment du frontend ;
- une fiche publiée expose les sources de ses affirmations factuelles ;
- une fiche non validée ne peut pas être servie comme contenu éditorial publié ;
- le site propose recherche, consultation et navigation responsive ;
- les fondamentaux SEO et les règles d'indexation sont testés ;
- les procédures sont documentées dans le dépôt.
