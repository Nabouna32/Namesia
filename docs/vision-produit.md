# Vision produit — Namesia

- **Statut :** document canonique
- **Version :** 2.8
- **Mis à jour :** 2026-11-22

## 1. Positionnement

Namesia est un média et un outil interactif consacré aux prénoms. La plateforme permet de découvrir des prénoms, leurs origines possibles, leurs histoires, leurs usages et les représentations culturelles qui leur sont associées.

Le lancement éditorial vise la France et les usages francophones. L'ouverture à d'autres marchés et langues n'est pas un objectif du premier périmètre : elle devra répondre à un besoin réel avant d'ajouter des dimensions au modèle.

## 2. Proposition de valeur et limites éditoriales

Proposer des fiches agréables à lire et des outils simples pour rechercher, comparer et découvrir des prénoms.

Les contenus sont générés à l'aide de modèles d'intelligence artificielle, depuis une API ou une conversation avec un assistant. Le résultat est un JSON conforme au contrat Namesia, importé dans l'administration puis enregistré en base.

**La génération par IA n'est pas une vérification.** Un contenu enregistré ou publié n'est pas, de ce seul fait, confirmé par une source indépendante ou validé par un spécialiste. Il peut comporter des erreurs, des approximations ou des informations incomplètes.

Namesia ne promet actuellement ni référencement systématique, ni vérification documentaire, ni validation par un spécialiste, ni distinction épistémique garantie entre faits historiques, hypothèses et interprétations culturelles. Les statistiques structurées restent hors du modèle.

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
- Recherche de prénoms avec prise en compte des accents et des variantes de casse ; classement des résultats par pertinence (correspondance exacte, puis préfixe, puis occurrence), avec filtres combinables par genre et initiale.
- URL partageable du catalogue : la recherche et les filtres actifs sont conservés dans les paramètres q, genre et lettre, puis restaurés à l'ouverture du lien.
- Découverte aléatoire d'un prénom publié depuis l'accueil, sans répétition immédiate tant qu'un autre choix est disponible.
- Favoris locaux : enregistrer des prénoms depuis leur fiche et les retrouver dans une liste dédiée, sans compte ni synchronisation entre appareils.
- Accès direct au comparateur depuis une fiche, avec le prénom déjà sélectionné et la possibilité d'en ajouter jusqu'à deux autres.
- Fiches de découverte avec introduction, origine, histoire, usages, associations symboliques facultatives  ; liens vers d'autres prénoms publiés de même genre et partage natif de la fiche.
- Comparaison partageable de deux ou trois fiches sur leurs informations éditoriales publiées, via l'URL de la sélection.
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
- éviter les affirmations catégoriques non justifiées ;
- ne pas afficher de références fictives ni de statuts de vérification ;
- afficher la mention relative à la génération par IA ;
- avoir un titre, une description et une URL cohérents.

Les pages de filtres, recherches internes et combinaisons sans contenu éditorial propre ne doivent pas créer de pièges à indexation.

## 7. Direction visuelle

La direction visuelle retenue est **arc-en-ciel, chaleureuse et compacte**.

- Palette multicolore visible (rose, orange, jaune, vert, bleu, violet), avec dégradés et surfaces pastel.
- Contrastes suffisants ; la couleur ne remplace pas les états fonctionnels.
- Espacements verticaux contenus sans sacrifier la lisibilité ni les zones tactiles.
- Textes courants de 14 à 16 px sur ordinateur ; informations secondaires utiles d'au moins 12 px.
- Navigation en unités relatives et mise à l'échelle fluide.
- Pas de numérotation décorative sans fonction.
- Donner aux fiches une hiérarchie éditoriale distincte de celle du catalogue : introduction mise en valeur, rubriques aérées, sommaire et repères de lecture ;
- Réévaluer le rendu réel sur mobile et sur les pages de fiches.

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
