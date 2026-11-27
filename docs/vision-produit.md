# Vision produit — Namesia

- **Statut :** document canonique
- **Version :** 3.63
- **Mis à jour le :** 2026-11-27 11:05:11 (Europe/Paris)

## 1. Positionnement

Namesia est un média et un outil interactif consacré aux prénoms. Il aide à découvrir des prénoms, à explorer leurs origines possibles, leurs histoires, leurs usages et les représentations culturelles qui leur sont associées.

Le premier marché éditorial visé est la France et les usages francophones. Une ouverture à d'autres pays ou langues devra répondre à un besoin réel et être conçue explicitement ; elle n'est pas un objectif implicite de la V1.

## 2. Proposition de valeur

Proposer un catalogue agréable à parcourir, des fiches lisibles et des outils de recherche, de découverte et de comparaison. La qualité, la clarté et la prudence éditoriale priment sur le volume de fiches ou la multiplication des fonctionnalités.

Le périmètre effectivement disponible est décrit dans [Fonctionnalités actuelles](fonctionnalites.md) et l'état de réalisation dans [État du projet](etat-du-projet.md). La vision ne doit pas servir à déduire qu'une fonction future est déjà implémentée.

## 3. Principes éditoriaux

- Les fiches sont produites à l'aide de l'IA en amont puis importées ; la génération ne prouve pas l'exactitude.
- Ne jamais inventer de sources, citations, statistiques, références ou validations.
- Distinguer les faits documentés, les hypothèses étymologiques, les variantes discutées, les usages observés et les interprétations culturelles.
- Nuancer ou omettre les affirmations incertaines.
- Présenter la symbolique, la numérologie et les portraits de personnalité comme des contenus culturels ou ludiques, jamais comme des vérités scientifiques ou prédictives.
- Signaler clairement que les contenus générés par IA peuvent comporter des erreurs.

Les règles détaillées sont dans [Politique éditoriale](politique-editoriale.md) et [Qualité éditoriale](qualite-editoriale.md).

## 4. Accès et modèle économique

La consultation du catalogue et des fiches reste gratuite et ne nécessite aucun compte. Aucune fonction publique ne doit être conditionnée à une inscription.

Aucun modèle de monétisation, publicité, contenu sponsorisé, partenariat, fonction payante ou changement d'accès n'est activé sans arbitrage préalable du propriétaire. L'étude de ces pistes ne vaut pas autorisation de les mettre en œuvre.

## 5. Périmètre produit

### Produit public

Le produit vise un catalogue de prénoms, des fiches éditoriales, des outils de découverte et de comparaison, ainsi que des repères statistiques clairement sourcés lorsqu'ils sont disponibles. Le périmètre fonctionnel concret et vérifié est maintenu dans [Fonctionnalités actuelles](fonctionnalites.md), pas recopié ici.

### Capacités envisagées, non disponibles

- **Compte visiteur facultatif :** orientation acceptée pour des fonctions personnelles persistantes. L'authentification visiteur, les favoris synchronisés et l'historique multi-appareils ne sont pas implémentés. Les favoris actuels restent dans le navigateur et l'historique est limité à la session.
- **Retours et corrections :** permettre de signaler une erreur ou proposer une correction, avec modération privée et protection anti-abus. Le parcours n'est pas disponible ; aucun endpoint public d'écriture ne doit être exposé avant que les protections et la conservation soient définies.
- **Vérification documentaire :** un processus de sources et de preuves liées aux affirmations pourrait être étudié, mais il ne fait pas partie du contrat JSON ni du fonctionnement actuel.
- **Autres marchés et langues :** à étudier uniquement à partir d'un besoin démontré et d'une conception adaptée.

Ces pistes ne constituent ni une feuille de route datée ni un engagement de livraison.

## 6. Administration et publication

L'administration est privée. L'import valide la structure du JSON et crée une nouvelle version en brouillon. La publication est une action distincte réservée à l'administrateur autorisé. La conformité structurelle ne constitue jamais une validation factuelle.

## 7. Expérience et découvrabilité

Chaque page doit répondre à une intention réelle et apporter une information utile. Éviter les pages quasi identiques, le remplissage générique et la multiplication artificielle de contenus.

Le SEO sert la découvrabilité du produit ; il ne justifie pas de dégrader la qualité éditoriale. Les exigences techniques de référencement et de mesure sont décrites dans [Mesure et croissance](mesure-et-croissance.md).

## 8. Indicateurs de réussite

- Nombre de fiches publiées et qualité perçue.
- Temps nécessaire pour importer, corriger et publier une fiche.
- Taux de corrections après identification d'erreurs.
- Qualité de recherche : absence de résultat, clic vers une fiche et reformulation.
- Utilisation des outils de découverte et de comparaison.
- Trafic organique qualifié et proportion de pages indexées réellement utiles.

Ces indicateurs sont des objectifs de mesure, pas des résultats observés ni des statistiques à communiquer.
