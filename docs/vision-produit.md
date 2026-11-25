# Vision produit — Namesia

- **Statut :** document canonique
- **Version :** 3.59
- **Mis à jour :** 2026-11-25

## 1. Positionnement

Namesia est un média et un outil interactif consacré aux prénoms. La plateforme permet de découvrir des prénoms, leurs origines possibles, leurs histoires, leurs usages et les représentations culturelles qui leur sont associées.

Le lancement éditorial vise la France et les usages francophones. L'ouverture à d'autres marchés et langues n'est pas un objectif du premier périmètre : elle devra répondre à un besoin réel avant d'ajouter des dimensions au modèle.

## 2. Proposition de valeur et limites éditoriales

Proposer des fiches agréables à lire et des outils simples pour rechercher, comparer et découvrir des prénoms.

Les contenus sont générés en amont par une IA (API ou conversation). Le JSON reçu est importé depuis l'administration, validé structurellement puis réparti dans les colonnes relationnelles de Supabase.

Les contenus sont générés par IA et peuvent comporter des erreurs, des approximations ou des informations incomplètes.

Les fiches générées par IA ne disposent pas d'un système de sources ou de vérification documentaire. Le classement statistique 2025 est une donnée éditoriale distincte, reliée directement à la publication officielle de l'Insee et accompagnée de ses limites d'arrondi.

## 3. Principes de contenu

1. Ne jamais présenter la génération par IA comme une preuve ou une garantie d'exactitude.
2. Ne pas inventer de références ni laisser entendre qu'une information a été vérifiée.
3. Employer des formulations prudentes pour les origines, étymologies et traditions incertaines.
4. Signaler clairement que les contenus sont générés par IA et peuvent comporter des erreurs.
5. Ne jamais présenter une symbolique, une numérologie ou un portrait de personnalité comme une vérité scientifique ou prédictive.
6. Corriger les erreurs identifiées sans masquer les limites du processus de production.

Ces principes de transparence ne constituent pas un processus de vérification factuelle.

## 4. Accès public et compte facultatif

La consultation de Namesia ne nécessite jamais de compte. Toute personne peut librement rechercher, découvrir, lire, comparer et partager les fiches publiques sans inscription ni connexion. Aucune de ces fonctions publiques ne doit être conditionnée à la création d'un compte.

Le compte est facultatif et apporte du confort : paramètres et préférences personnels, favoris persistants, historique de consultation synchronisé entre les appareils et autres fonctions personnelles clairement identifiées. L'absence de compte ne doit pas dégrader artificiellement l'accès au contenu ni multiplier les demandes d'inscription.

Les données personnelles liées au compte restent sous le contrôle de leur titulaire : accès, modification et suppression doivent être prévus dans la conception. Les choix d'authentification, de confidentialité, de conservation et de suppression seront détaillés dans un ADR d'architecture avant l'implémentation.

## 4. Périmètre produit

### Inclus

- Catalogue de prénoms utilisé en France, avec un accès direct depuis la vitrine de découverte de l’accueil.
- Page `/tendances` présentant les dix prénoms féminins et masculins les plus attribués en France en 2025, avec leur rang et leur effectif arrondi. Le classement est un instantané annuel issu de l'Insee, pas une donnée temps réel. Les entrées sans fiche publiée restent visibles et sont explicitement signalées ; les fiches disponibles ouvrent leur page Namesia.
- Page dédiée par prénom avec URL stable.
- Recherche de prénoms avec prise en compte des accents, des variantes de casse et des séparateurs des prénoms composés (espace, tiret, apostrophe), y compris lorsqu'un séparateur est saisi en fin de préfixe ; classement des résultats par pertinence (correspondance exacte, puis préfixe, puis occurrence la plus proche du début du prénom), avec filtres combinables par genre et initiale. La recherche compacte de l'accueil affiche au plus six résultats ; un lien ouvre le catalogue avec le terme déjà saisi dès que d'autres correspondances existent. En l'absence de résultat normal, proposer jusqu'à cinq suggestions proches pour les recherches d'au moins quatre caractères, avec une tolérance d'une ou deux modifications selon la longueur et en respectant les filtres actifs. Les résultats et suggestions affichent aussi le genre associé à chaque fiche. Le catalogue présente 24 résultats au départ et révèle les suivants par lots de 24 pour garder une liste facile à parcourir. Les résultats filtrés du catalogue peuvent être copiés sous forme de liste de noms, y compris ceux qui ne sont pas encore visibles dans les lots de 24. Le retour de copie disparaît quand la recherche ou un filtre change, et une réponse asynchrone issue de l’ancienne sélection n’est pas affichée.
- URL partageable du catalogue : la recherche, les filtres actifs et le nombre de résultats déjà révélés (paramètre limite) sont conservés dans l'URL. Lorsque ces critères sont actifs, une action partage le lien avec uniquement q, genre, lettre et limite. Le retour depuis une fiche et ses suggestions restaure ces critères et le lot visible, sans les intégrer à l'URL canonique de la fiche. Modifier la recherche ou un filtre repart du premier lot.
- Vitrine d'accueil de trois prénoms répartis sur le catalogue et renouvelés quotidiennement en UTC, plutôt que trois entrées alphabétiques consécutives ; chaque carte affiche l'initiale, le prénom, le pictogramme de genre et un accès à la fiche. La sélection s'adapte si le catalogue contient moins de trois fiches. Les actions de favori et de comparaison sont réservées à la fiche.
- Découverte aléatoire d'un prénom publié depuis l'accueil, sans répétition immédiate tant qu'un autre choix est disponible. Le résultat affiche le pictogramme de genre accessible et un lien vers la fiche ; les actions de favori et de comparaison restent sur cette fiche.
- Reprise de la découverte depuis l'accueil : afficher les dernières fiches consultées dans l'espace du compte utilisateur, avec un historique persistant et synchronisé entre les appareils connectés. L'utilisateur peut retirer une consultation individuellement et effacer son historique. Les entrées ne donnent accès qu'aux fiches encore publiées ; les contenus éditoriaux sont relus depuis le catalogue public et seuls les identifiants nécessaires à l'historique sont conservés. L'historique ne doit pas disparaître à la fermeture d'un onglet. Sa durée de conservation, son éventuelle limite et les contrôles de confidentialité seront définis dans la conception du compte.
- Favoris associés au compte utilisateur : enregistrer ou retirer un prénom depuis sa fiche et retrouver la même sélection sur tous les appareils connectés. La sélection est persistante côté serveur et liée au compte, avec une page dédiée permettant de rechercher, filtrer, trier, exporter et importer les favoris. Les données enregistrées restent limitées aux identifiants de prénoms ; les textes des fiches sont relus depuis le catalogue publié. L'utilisateur doit pouvoir gérer et supprimer ses favoris sans dépendre du navigateur utilisé. La liste utilise uniquement les informations d'index nécessaires à son affichage, pas les textes complets des fiches. Une sauvegarde JSON des seuls identifiants peut être exportée puis importée dans un autre navigateur ; l'import fusionne la sélection sans effacer les favoris déjà présents. Si la limite de 10 000 favoris empêche certains ajouts, le nombre d'identifiants ignorés est annoncé explicitement avec un état d'avertissement distinct d'un import complet ; une tentative d'ajout depuis une fiche affiche aussi un avertissement et ne modifie pas la sélection. La liste peut être filtrée par nom, sans distinction d'accents, de casse ou de séparateurs, par genre au moyen de FilterChip icon-only, et triée par ordre d'enregistrement ou par nom croissant/décroissant. Elle affiche 24 favoris au départ puis les suivants par lots de 24 ; une nouvelle recherche ou un changement de filtre revient au premier lot. La recherche, le genre, le tri et le nombre de résultats révélés sont conservés dans l'URL de la page non indexée, restaurés au rechargement et préservés en ouvrant une fiche puis en revenant aux favoris ; seuls ces critères sont transmis, jamais la liste des prénoms enregistrés. Si la recherche ne renvoie aucun résultat exact, jusqu'à cinq suggestions proches sont proposées parmi les favoris, en respectant le filtre de genre actif. La liste filtrée peut être copiée sous forme de texte, y compris les résultats au-delà des 24 premiers affichés. Le retour de copie est réinitialisé lorsque la recherche, le genre ou le tri change, sans afficher tardivement le résultat d’une copie lancée sur l’ancienne sélection. Les favoris ne proposent pas de sélection de comparaison : celle-ci se fait dans le comparateur.
- Accès direct au comparateur depuis une fiche, avec le prénom déjà sélectionné et la possibilité d'en ajouter jusqu'à deux autres. Le comparateur utilise l'index léger, le composant Checkbox Material 3 et une sélection de deux ou trois prénoms synchronisée dans l'URL ; les puces de retrait restent visibles indépendamment de la recherche. Les cartes du catalogue, des favoris, de l'historique et des suggestions ne portent pas d'action de comparaison.
- Fiches de découverte avec introduction, origine, histoire, usages, associations symboliques facultatives ; suggestions de trois autres prénoms publiés du même genre, diversifiées selon la fiche consultée et stables dans le temps. Ce critère ne prétend pas établir une proximité d'origine ou de signification ; partage natif de la fiche. Les suggestions sont de simples liens vers les fiches et ne proposent pas d'action de favori ou de comparaison.
- Comparaison partageable de deux ou trois fiches sur leurs informations éditoriales publiées, via l'URL de la sélection. Le catalogue de choix ne charge que l'index léger ; les contenus complets sont demandés uniquement pour les fiches sélectionnées. Ces réponses publiques sont mises en cache pendant une minute au plus dans les caches partagés pour accélérer les comparaisons répétées. La recherche sans distinction d'accents, de casse ni de séparateurs internes (espaces, tirets, apostrophes) classe les correspondances exactes avant les préfixes, puis les occurrences plus éloignées, comme dans le catalogue. En l'absence de résultat exact, le sélecteur propose jusqu'à cinq prénoms proches selon le même seuil de distance bornée que le catalogue. Chaque colonne donne aussi accès à la fiche complète correspondante ; le lien conserve les deux ou trois slugs sélectionnés afin que le fil d'Ariane et l'action de retour ramènent au même comparateur. Les prénoms sélectionnés restent affichés avec une action de retrait individuelle, indépendamment de la pagination et du filtre de recherche. Le sélecteur présente 24 prénoms au départ et permet d'en afficher 24 de plus à chaque étape ; la recherche revient au premier lot. Le résultat est un tableau comparatif accessible : les critères sont alignés en lignes et les prénoms en colonnes, avec défilement horizontal sur mobile sans masquer la colonne des critères.
- Aperçus de partage visuels avec une carte dédiée à chaque fiche.
- Génération hors du site, par API ou conversation, puis import d'un JSON.
- Administration privée : authentification, import, validation structurelle, création de brouillon, prévisualisation et publication explicite.
- Historique des versions afin de remplacer une fiche sans écraser la version précédemment publiée.
- Lecture publique limitée aux versions publiées.
- Interface responsive et navigation accessible au clavier, avec lien d'évitement et respect de la préférence de réduction des mouvements.
- Fondamentaux SEO : URL canoniques, métadonnées sociales, données structurées Schema.org, sitemap des fiches publiées avec date réelle de publication de chaque version, et règles robots.

### Hors périmètre actuel

- Génération IA déclenchée directement depuis l'administration.
- Vérification indépendante des affirmations et workflow de claims/preuves.
- Statistiques de popularité en temps réel, historiques de classement pluriannuels et autres jeux de données Insee au-delà du classement 2025 décrit ci-dessus.
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

La direction visuelle canonique est **Material 3 Fidelity** pour l'interface générale, avec **Material 3 Rainbow** comme palette complémentaire pour les catégories éditoriales et les repères qui bénéficient d'une variation de couleur. Les deux schémas sont calculés par Material Color Utilities à partir du bleu Google `#0B57D0` (`baseline_primary_600` utilisé par Chromium Android), choisi explicitement comme source Namesia ; la baseline AndroidX Material 3 par défaut reste le violet `#6750A4`. La navigation et les actions restent pilotées par Fidelity. Les états success/warning/info utilisent des couleurs personnalisées sémantiques M3, distinctes des rôles système. Aucun dégradé de marque hors M3 n'est conservé. Les règles détaillées et les limites Web sont définies dans [docs/design.md](design.md).


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
