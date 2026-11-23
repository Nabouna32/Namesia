# Architecture — Namesia

- **Statut :** architecture cible retenue pour la V1
- **Version :** 3.60
- **Mis à jour :** 2026-11-23

## 1. Besoin réel

Namesia publie un catalogue de fiches de prénoms. Le contenu est généré en dehors de l'application, soit par une API de modèle, soit dans une conversation avec un assistant. Il est ensuite fourni à Namesia sous la forme d'un JSON conforme au contrat du projet.

Namesia n'intègre pas actuellement de moteur de génération, de collecte documentaire ni de vérification factuelle. L'application importe, conserve, prévisualise et publie le contenu. La génération par IA ne constitue pas une validation de l'exactitude.

## 2. Architecture retenue

```mermaid
flowchart TD
  A["Conversation avec un assistant ou API IA externe"] --> B["JSON conforme au schéma Namesia"]
  B --> C["Administration privée /admin"]
  C --> D["Validation du contrat et prévisualisation"]
  D --> E["API Next.js protégée"]
  E --> F["Supabase Auth + contrôle admin"]
  E --> G["Fonctions SQL transactionnelles"]
  G --> H[("PostgreSQL / Supabase")]
  H --> I["Lecture des fiches publiées"]
  I --> J["Site public Next.js"]
```

Le fournisseur IA est volontairement hors du périmètre applicatif. Il n'existe pas de raison actuelle d'ajouter un adaptateur multi-fournisseurs, un orchestrateur de génération ou une file de traitements.

## 3. Responsabilités

### Production du contenu
- Génération réalisée à l'extérieur de Namesia, par API ou conversation.
- La sortie attendue est un JSON strict conforme à schemas/fiche-prenom.schema.json.
- Le modèle ne choisit jamais le statut de publication.
- Aucun champ de source, référence, preuve ou vérification n'appartient au contrat.

### Administration
- Connexion via Supabase Auth par lien e-mail.
- Autorisation fondée sur la présence de l'identifiant Auth dans private.admin_users.
- Import d'un fichier JSON ou d'un contenu collé.
- Validation du contrat avant envoi.
- Prévisualisation du contenu avant publication.
- Import enregistré comme brouillon ; publication par une action distincte.
- Auto-inscription désactivée ; le premier compte Auth est créé/invité depuis Supabase puis autorisé manuellement.

### API et base de données
- Routes Next.js côté serveur pour les opérations administratives.
- Vérification du jeton Supabase et de l'autorisation par RPC sur chaque requête.
- Fonctions SQL transactionnelles pour créer une version et publier une version.
- Les fonctions sont SECURITY INVOKER ; elles ne contournent pas RLS.
- Aucune clé privilégiée Supabase dans le navigateur.
- Les visiteurs disposent uniquement de la lecture des identités ayant une version publiée et de ces versions publiées.

### Site public
- Rendu serveur Next.js, dynamique pour ne pas dépendre de la disponibilité ou du schéma Supabase pendant le build.
- Shell applicatif Material 3 Fidelity : barre supérieure commune, navigation basse sur fenêtres compactes (largeur ou hauteur) et rail latéral fixe de 80 px sur fenêtres medium/expanded. Les quatre destinations publiques sont partagées entre les deux modes ; les rôles d'interface proviennent du schéma Fidelity ; un schéma Rainbow indépendant fournit des couleurs tonales stables aux catégories éditoriales, avec le rôle on-container correspondant pour leurs badges et leurs libellés. Les deux schémas clair/sombre sont calculés par Material Color Utilities depuis le bleu Pixel `#005AC1` et synchronisés avec le thème système.
- Les contrôles réellement communs sont centralisés dans `components/ui/` : boutons, liens d'action, champ de recherche, action de sélection comparative, puce de filtre et champ de sélection natif. Le registre `components/icone-material.tsx` centralise les tracés Google Material Symbols Rounded 400, embarqués localement ; les variantes pleines ne sont utilisées que lorsqu'un glyphe dispose d'une forme distincte. La sélection des autres destinations est indiquée par l'indicateur tonal. L'échelle typographique Material 3 (display/headline/body) utilise Roboto pour tous les rôles, dans une famille unique définie par les tokens globaux, sans pile de substitution ni surcharges de taille par breakpoint. Les surfaces principales sont définies dans leurs règles CSS de base ; les couches Fidelity ne servent plus à redéfinir tardivement hero, cartes vedettes, fiches, catalogue, comparateur et pied de page. Sur les fiches, le sommaire est rendu en liens natifs présentés comme des chips tonales et les ancres réservent l'espace de la barre supérieure fixe ; le texte éditorial utilise le rôle on-surface. Les actions de réinitialisation et de pagination utilisent la primitive Bouton, et les options de comparaison portent leurs états Material dans les règles de base. L'administration et les parcours visiteurs utilisent les mêmes variantes de bouton. Les champs sont utilisés par le catalogue, le comparateur et les favoris ; l'action de comparaison est commune au catalogue et aux favoris, la liste des prénoms retenus est partagée entre la barre du catalogue et le comparateur, et les filtres de genre et d'initiale composent la même puce et les sélecteurs des favoris partagent le même champ natif. Chaque écran conserve sa propre logique de filtrage, de pagination, de sélection et de synchronisation d'URL.
- Frontière d’erreur globale `app/error.tsx` pour les erreurs de rendu des pages : message compréhensible, référence technique éventuelle, tentative de rechargement du segment et retour à l’accueil ; l’erreur est journalisée côté navigateur sans exposer sa trace à l’utilisateur.
- Lecture des fiches publiées uniquement.
- La recherche compacte de l'accueil affiche jusqu'à 24 résultats pour rester concise ; lorsque d'autres correspondances existent, un lien ouvre le catalogue avec le terme déjà saisi afin de retrouver l'ensemble des résultats sans ressaisie.
- Recherche du catalogue synchronisée avec les paramètres q, genre et lettre de l'URL ; ces valeurs sont validées contre les filtres disponibles, restaurées à l'ouverture du lien et mises à jour sans créer d'entrée d'historique à chaque frappe. Le paramètre limite conserve aussi le nombre de résultats déjà révélés par lots de 24, à l'ouverture d'un lien et au retour d'une fiche ; toute modification de recherche ou de filtre revient à 24 et retire ce paramètre. L'URL canonique reste /prenoms pour éviter l'indexation de combinaisons de filtres.
- Les pages d'accueil, de catalogue, de favoris et le sitemap utilisent un index léger (identité, nom, initiale et genre) ; les rubriques éditoriales ne sont chargées que pour les fiches et outils qui les affichent. Cet index est lu par pages demandées de 500 lignes avec `range()` et un ordre stable (`display_name`, puis `id`). Le premier appel demande un compte exact obligatoire et valide ; son absence, son invalidité ou une incohérence avec les lignes reçues interrompt explicitement la lecture. Les offsets suivants avancent du nombre de lignes réellement reçues, même si le plafond de réponse configuré est inférieur à 500. Une page courte ne prouve jamais à elle seule que le catalogue est complet. Les suggestions de fiches réutilisent ce même index paginé au lieu de lancer une seconde lecture non paginée. La recherche et la vitrine d'accueil ne transfèrent donc pas les textes complets au navigateur.
- Vitrine de trois prénoms sur l'accueil, issue d'un échantillon réparti sur le catalogue alphabétique et décalé chaque jour en UTC ; les cartes couvrent ainsi différentes zones du catalogue au lieu d'afficher trois entrées consécutives. Chaque carte affiche le nom et le genre du prénom. L'échantillon s'adapte aux catalogues de moins de trois fiches et ne modifie jamais l'ordre du catalogue ni les résultats de recherche.
- Découverte aléatoire déclenchée depuis un composant client de l'accueil, à partir de la liste de fiches déjà chargée côté serveur ; le choix reste en mémoire dans le composant et évite la sélection précédente si plusieurs prénoms sont disponibles. Le prénom tiré au sort peut être ajouté ou retiré des favoris locaux directement depuis le résultat, sans ouvrir sa fiche.
- Historique de session des huit dernières fiches consultées : seuls les slugs sont conservés dans `sessionStorage`, sans cookie, compte, appel réseau ni synchronisation entre appareils. L'historique est propre à l'onglet, survit aux rechargements et disparaît à sa fermeture. Il est dédupliqué et réordonné à chaque visite ; l'accueil n'affiche que les prénoms encore publiés, permet d'effacer toute la liste et propose d'ajouter ou retirer chaque entrée des favoris sans ouvrir sa fiche. Si le stockage de session est indisponible, l'historique reste en mémoire jusqu'au rechargement et cette limite est signalée.
- Favoris gérés par un fournisseur client commun : seuls les slugs sont enregistrés dans localStorage ; aucune fiche, donnée personnelle ou information éditoriale n'est copiée dans le stockage du navigateur. L'ajout et le retrait sont disponibles sur les fiches, la vitrine de l'accueil, le résultat de la découverte aléatoire et les cartes de résultats et de suggestions du catalogue/recherche, au moyen d'un bouton compact séparé du lien de navigation. Les erreurs d'accès ou de format du stockage sont signalées une seule fois dans la zone de résultats et ne sont pas présentées comme une liste vide. La page des favoris charge uniquement l'index léger (nom, slug, initiale et genre), jamais les rubriques éditoriales ; elle ne montre que les prénoms encore publiés, propose une recherche locale tolérante aux accents, à la casse et aux séparateurs, un filtre par genre et un tri par ordre d'enregistrement ou par nom croissant/décroissant. Si la recherche ne renvoie aucun résultat exact, le moteur commun de distance d'édition propose jusqu'à cinq prénoms proches parmi les favoris, après application du filtre de genre. Les critères q, genre, tri et limite sont synchronisés dans l'URL, restaurés au rechargement et transmis aux liens de fiche pour revenir à la liste filtrée avec le même lot visible. Seuls les critères d'affichage sont exposés, jamais les slugs des favoris. La page reste non indexée. La copie en texte reprend tous les résultats filtrés (sans se limiter au lot visible). La liste affiche les résultats par lots de 24 (chaque modification de filtre revient au premier lot), et permet de retirer explicitement de la sélection locale les slugs qui ne correspondent plus à une fiche publiée. Elle permet aussi de retenir jusqu'à trois favoris pour les comparer ; cette sélection reste visible malgré les filtres et se transmet au comparateur par URL, sans stockage durable.
- Les favoris ne sont ni envoyés au serveur ni synchronisés entre appareils ; ils restent propres au navigateur utilisé. La page dédiée permet d'exporter une sauvegarde JSON versionnée contenant uniquement les slugs, puis de la réimporter après validation stricte du format. L'import fusionne les identifiants sans remplacer la sélection existante ; les favoris non publiés restent conservés et peuvent être nettoyés explicitement.
- Accès au comparateur depuis une fiche via le paramètre d'URL `prenoms`, qui préselectionne le slug et laisse l'utilisateur choisir les autres prénoms publiés. Depuis le catalogue, les résultats et suggestions permettent aussi de retenir jusqu'à trois prénoms ; la barre de sélection affiche les noms retenus et permet de les retirer individuellement même lorsqu'ils sont masqués par la recherche ou les filtres. La sélection est transmise au comparateur par le même paramètre d'URL, sans stockage durable.
- Suggestions de découverte limitées à trois autres prénoms publiés du même genre. La fiche ne recharge pas l'index complet du catalogue : elle compte les candidats publiés du même genre, puis lit une fenêtre de 64 identités au maximum, déterminée de façon stable par le slug de la fiche et dans un ordre UUID stable. Les trois suggestions sont choisies dans cet échantillon par un score déterministe calculé à partir du slug de la fiche et de chaque candidat ; elles varient d'une fiche à l'autre et restent stables tant que le catalogue ne change pas. Ce compromis borne le transfert de données et le tri côté serveur, sans prétendre sélectionner les trois meilleurs prénoms du catalogue entier. Le genre est le seul critère éditorial ; aucune similarité étymologique ou culturelle n'est sous-entendue. Seul l'index léger est utilisé (identité, nom, initiale et genre), jamais les contenus éditoriaux des fiches suggérées. Chaque carte de suggestion sépare le lien vers la fiche du bouton compact d'ajout ou de retrait des favoris locaux.
- Partage d'une fiche par l'API native du navigateur, avec copie du lien lorsque cette API n'est pas disponible.
- Comparateur client de deux à trois fiches : le sélecteur utilise l'index léger et les rubriques éditoriales sont chargées à la demande uniquement pour les deux ou trois slugs sélectionnés, via une route publique qui valide strictement les paramètres et ne retourne que les fiches publiées. Les slugs sélectionnés sont synchronisés dans l'URL, sans stockage permanent ; le lien partagé ne conserve que ce paramètre de sélection. La page reste non indexée. La recherche normalise accents, casse et séparateurs internes (espaces, tirets, apostrophes) et applique le même classement par pertinence que le catalogue (correspondance exacte, préfixe, puis occurrence la plus proche du début du prénom). Lorsqu'aucune correspondance exacte n'existe et que la recherche comporte au moins quatre caractères, il réutilise le calcul commun de suggestions proches du catalogue (une modification, ou deux à partir de huit caractères), limité à cinq résultats. Chaque fiche comparée peut être ajoutée aux favoris locaux sans quitter le comparateur. Les prénoms sélectionnés restent visibles dans une liste dédiée, avec retrait individuel même s'ils ne figurent pas dans le lot actuellement affiché ou ne correspondent plus à la recherche en cours. Le sélecteur affiche 24 choix au départ, puis révèle les suivants par lots de 24 ; une nouvelle recherche repart du premier lot.
- Images Open Graph générées à la demande depuis les fiches publiées, dans le runtime Node.js pour conserver le client Supabase serveur ; aucune image ni donnée éditoriale supplémentaire n'est stockée.
- Sitemap dynamique construit depuis les fiches publiées ; robots.txt excluant l'administration et les routes API.
- Métadonnées canoniques fondées sur NEXT_PUBLIC_SITE_URL, sans inventer de date de mise à jour.
- Données structurées Schema.org pour le site, le catalogue et les fiches ; aucune date, popularité ou affirmation non disponible n'est ajoutée.
- `lib/site-url.ts` centralise l'origine canonique ; `lib/json-ld.ts` sérialise les données structurées en échappant les chevrons.
- La génération des fichiers d'indexation ne modifie pas les contrôles d'accès ; le domaine Vercel par défaut reste protégé par SSO tant que sa configuration n'est pas changée.
- Pas d'appel à un modèle IA lors de l'affichage.
- Initiale calculée à partir du nom affiché ; elle n'est pas stockée.
- Mention visible indiquant que le contenu est généré par IA et peut comporter des erreurs.
- La recherche du catalogue normalise accents, casse et séparateurs internes (espaces, tirets, apostrophes), applique les filtres de genre et d'initiale, puis classe les résultats par pertinence : correspondance exacte, préfixe, puis occurrence la plus proche du début du prénom ; les correspondances de même rang et de même position conservent l'ordre alphabétique français. Les liens vers une fiche depuis les résultats et suggestions transportent les critères actifs dans des paramètres de retour dédiés ; le fil d'Ariane, le lien de retour et les suggestions suivantes reconstruisent une URL de catalogue avec q, genre et lettre. Ces paramètres de navigation ne changent ni l'URL canonique de la fiche ni ses métadonnées de partage. Les cartes de résultats et les suggestions affichent le genre de chaque prénom pour donner un repère sans ouvrir la fiche. Si aucun résultat normal n'existe et que le terme compte au moins quatre caractères, le client calcule une distance de Levenshtein bornée une seule fois par prénom candidat, sur les caractères Unicode et dans une bande de largeur proportionnelle à la tolérance (une ou deux modifications), puis affiche au plus cinq suggestions proches triées par distance et ordre alphabétique, sans ignorer les filtres actifs. Le catalogue n'affiche initialement que 24 résultats et permet d'en révéler 24 supplémentaires à la demande ; les filtres et la recherche repartent du premier lot.

## 4. Modèle de données

Le modèle cible comporte trois tables métier :
- names : identité stable du prénom (id, slug, display_name, gender, created_at).
- name_profiles : versions éditoriales (id, name_id, version, schema_version, introduction, origin_text, history_text, usage_text, status, created_at, published_at).
- name_profile_associations : associations symboliques structurées, une ligne par association (profile_id, position, category, value, context_note).

L'autorisation administrateur est stockée dans private.admin_users, un schéma PostgreSQL non exposé par la Data API. Les détails et contraintes sont décrits dans [Modèle de données](modele-donnees.md).

Aucune table de sources, références ou preuves n'est nécessaire. Les associations symboliques sont conservées dans une table relationnelle dédiée, car elles sont répétables et filtrables.

## 5. Publication et historique

- Une nouvelle importation crée une nouvelle version en brouillon.
- Une version publiée n'est jamais modifiée en place.
- La publication est explicite et transactionnelle.
- Une seule version est publiée par prénom à un instant donné.
- La version publiée précédente passe à archive.
- Le statut de publication est une donnée Namesia, jamais un champ contrôlé par le JSON entrant.

## 6. Sécurité

- Supabase Auth authentifie l'administrateur.
- private.admin_users autorise explicitement les comptes administrateurs ; les métadonnées utilisateur modifiables ne servent jamais à décider des droits.
- Le schéma private n'est pas exposé à la Data API ; les droits de lecture de la liste sont limités au rôle authenticated et à sa propre ligne.
- Les routes API vérifient le jeton et l'autorisation côté serveur.
- RLS est activé sur toutes les tables exposées.
- Les privilèges SQL sont accordés au strict nécessaire, indépendamment des politiques RLS.
- Les fonctions SQL restent SECURITY INVOKER et vérifient elles-mêmes le rôle administrateur.
- Aucun secret ou clé service_role / secret key dans le code client.
- L'administration n'est pas protégée par le simple masquage d'une page : chaque opération d'écriture vérifie l'autorisation.

## 7. Choix écartés pour la V1

| Option | Décision | Motif |
|---|---|---|
| Génération IA intégrée au site | Écartée | La génération a lieu en amont ; l'import JSON suffit |
| Une table par rubrique de texte | Écartée | Les rubriques ne sont pas exploitées indépendamment |
| Sources et références éditoriales | Écartées | Les fiches sont générées en amont ; Namesia importe le JSON sans workflow documentaire |
| Table dédiée aux associations symboliques | Retenue | Données répétables et filtrables, liées à une version |
| Historique de versions | Conservé | Permet de remplacer et restaurer un contenu sans écraser l'historique |
| Microservices / orchestrateur | Écartés | Complexité sans besoin démontré |
| Clé privilégiée dans le navigateur | Interdite | Risque de compromission des données |

## 8. Schéma en production

Le stockage métier est relationnel et repose sur trois tables :
- `names` porte l'identité stable du prénom ;
- `name_profiles` porte les versions éditoriales et leurs rubriques textuelles ;
- `name_profile_associations` porte les associations symboliques répétables.

Le JSON est uniquement un contrat d'échange à l'import. L'API le valide, puis une fonction SQL crée atomiquement une version brouillon et ses associations. La publication reste une opération distincte et explicite.

Les anciennes tables documentaires, l'ancienne colonne JSONB et les colonnes redondantes ont été supprimées. Le schéma exposé conserve RLS et des privilèges SQL minimaux : lecture publique des seules fiches publiées, opérations d'écriture réservées aux administrateurs autorisés.
## 9. Stack

- Next.js App Router, React et TypeScript.
- Runtime Node.js 26.13.1, défini dans `.nvmrc`, appliqué par GitHub Actions et destiné à être aligné sur le runtime Vercel 26.x ; les types Node 26 suivent cette branche et npm refuse les runtimes incompatibles via `engine-strict`.
- Supabase Auth et PostgreSQL.
- JSON Schema comme contrat d'échange ; validation TypeScript à la frontière de l'API.
- Les cartes Open Graph chargent localement `assets/fonts/Roboto-Regular.ttf.base64` depuis le runtime Node ; le fichier TTF est distribué sous licence Apache 2.0 avec sa notice dans `licenses/Roboto-Apache-2.0.txt`. Le décodage en mémoire évite un appel réseau au moment de générer les aperçus.
- GitHub Actions pour les contrôles des PR.
- Vercel est réservé aux déploiements de production.

## 10. Déploiement et quota

- Le paramètre Vercel `previewDeploymentsDisabled` est activé.
- `vercel.json` appelle `scripts/vercel-ignore-build.sh` avant un build.
- Le script retourne `1` uniquement pour une production issue de `main` ; il retourne `0` dans tous les autres cas, ce qui ignore le build.
- La politique est testée dans GitHub Actions pour les combinaisons production/preview et main/branche.
- Aucune Preview, commande CLI ou création de déploiement par API n'est autorisée.
