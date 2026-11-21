# Politique éditoriale et sources — Namesia

- **Statut :** canonique
- **Version :** 1.0
- **Mis à jour :** 2026-11-21

## 1. Règle fondamentale

Chaque information affichée doit être identifiable comme l'une des catégories suivantes :
- **Fait documenté** : assertion vérifiable, liée à une ou plusieurs sources.
- **Hypothèse ou étymologie discutée** : proposition attribuée à une source, avec désaccord explicité.
- **Information inconnue** : absence de source suffisante ; le champ reste vide ou indique clairement que l'information n'est pas établie.
- **Interprétation symbolique** : association culturelle, traditionnelle ou ludique, présentée sans prétention scientifique.

L'IA n'est jamais citée comme source.

## 2. Hiérarchie des sources

### Statistiques de prénoms en France
Source primaire de référence : fichier des prénoms de l'Insee.
- Publication : https://www.insee.fr/fr/statistiques/8595130
- Méthodologie : https://www.insee.fr/fr/metadonnees/source/serie/s2236
- Les fichiers couvrent les naissances enregistrées en France depuis 1900, au niveau national, régional et départemental.
- L'édition consultée le 21 novembre 2026 couvre les naissances jusqu'en 2025.
- Les effectifs diffusés sont arrondis au multiple de 5 le plus proche ; ne pas présenter ces effectifs comme exacts.
- Les prénoms très rares sont soumis à des règles de diffusion (seuil de 3 occurrences dans la documentation actuelle).
- Avant 1946, l'exhaustivité est plus limitée ; des rectifications et erreurs résiduelles sont possibles.
- Les données antérieures à 2012 excluent Mayotte dans la série nationale actuelle.
- Le fichier mesure les naissances par année, pas la population vivante portant actuellement le prénom.

**Interdit :** convertir ces statistiques en « nombre de personnes vivantes portant ce prénom » ou en probabilités individuelles.

Pour la popularité, préférer des comparaisons contextualisées (année, sexe tel que fourni par la source, zone géographique, effectif et rang). Toute fréquence calculée doit documenter son dénominateur et les arrondis utilisés.

### Étymologie, langue et histoire
Ordre de préférence :
1. Ouvrages scientifiques et dictionnaires spécialisés d'onomastique / anthroponymie.
2. Travaux universitaires, articles scientifiques et corpus historiques.
3. Dictionnaires historiques et étymologiques reconnus.
4. Ressources institutionnelles ou bibliothèques pour vérifier les références bibliographiques.
5. Ressources collaboratives comme piste de recherche seulement, à recouper avant publication.

Ressources de départ :
- ATILF / TLFi et projet TLF-Étym : https://www.atilf.fr/ressources/tlfi/
- Catalogue général de la BnF : https://catalogue.bnf.fr/
- Persée : https://www.persee.fr/
- Wiktionnaire : https://fr.wiktionary.org/ (piste secondaire, jamais source unique pour une étymologie litigieuse).

Attention : le TLFi porte principalement sur le français des XIXe et XXe siècles et l'ATILF précise que la ressource est close en l'état ; son existence ne garantit pas qu'une notice traite correctement un prénom donné. Les ouvrages de référence imprimés doivent être cités avec auteur, titre, éditeur, année et page si disponible.

### Fêtes et calendriers
- Identifier la tradition ou le calendrier concerné (calendrier catholique romain, orthodoxe, calendrier civil ou autre).
- Vérifier la date auprès d'une source propre à cette tradition.
- S'il existe plusieurs dates ou saints homonymes, l'expliquer.
- Ne pas inventer une fête à partir d'une simple association de prénom.

### Symbolique
Les associations de personnalité, couleurs, pierres, animaux et numérologie ne sont pas des propriétés objectives d'un prénom.
- Nommer le cadre : tradition culturelle, croyance populaire, système numérologique ou interprétation éditoriale.
- Citer une source lorsque l'association est attribuée à une tradition identifiable.
- Si l'association est une création éditoriale de Namesia, l'indiquer comme telle.
- Ne jamais affirmer qu'un prénom détermine le caractère, le destin, la compatibilité amoureuse ou les capacités d'une personne.
- Éviter les diagnostics psychologiques et les généralisations sur des groupes humains.

## 3. Niveau de preuve

Chaque affirmation factuelle reçoit un statut :
- `etabli` : sources pertinentes et concordantes ;
- `discute` : plusieurs hypothèses ou sources divergentes ;
- `incertain` : preuve partielle ou indirecte ;
- `non_documente` : aucune source suffisante.

Ces statuts sont éditoriaux, pas des probabilités statistiques. Un score numérique de confiance ne doit pas être inventé par le modèle.

## 4. Traçabilité minimale d'une source

Conserver autant que possible :
- identifiant interne stable ;
- titre ;
- auteur ou organisme ;
- éditeur / publication ;
- type de source ;
- URL pérenne ou identifiant bibliographique ;
- date de publication ;
- date de consultation ;
- page, chapitre ou section utile ;
- note sur la portée et les limites de la source.

Une URL seule n'est pas une preuve. Le relecteur doit vérifier que la source soutient bien l'affirmation associée.

## 5. Droits et réutilisation

- Une référence bibliographique peut être citée ; le texte protégé d'une source ne doit pas être reproduit.
- Vérifier la licence des jeux de données, textes et médias avant ingestion ou republication.
- Conserver l'attribution et la version de licence lorsqu'elles sont requises.
- Ne pas aspirer massivement une ressource sous conditions incompatibles avec un usage commercial.
- Les données Insee doivent conserver leur attribution et les mentions de licence applicables à l'édition utilisée.

## 6. Revue et publication

Une fiche n'est publiable que si :
- ses assertions factuelles sont sourcées et vérifiées ;
- les controverses et inconnues sont correctement signalées ;
- les données statistiques ont une période, un territoire, une unité et une source ;
- le contenu symbolique est explicitement contextualisé ;
- le texte est original, utile, non répétitif et relu ;
- les droits des sources utilisées sont compatibles avec la publication.

## 7. Révision de cette politique

Toute nouvelle famille de contenus (personnalités, astrologie, compatibilité, prénoms régionaux, etc.) doit être ajoutée ici avant d'être intégrée au prompt de génération ou au site.


## 9. Corpus initial de la V1

Le premier jeu de six fiches (Alice, Gabriel, Emma, Louis, Lina et Noah) sert à alimenter l'expérience publique et à valider le circuit de lecture Supabase.

- Les cinq pistes étymologiques d'Alice, Gabriel, Emma, Louis et Lina sont reliées à un extrait de *L’Officiel des prénoms 2019* diffusé par Albin Michel ; elles sont enregistrées au statut `discute`, et non comme des certitudes académiques.
- Le repère sur Noé/Noah est relié au texte de la Genèse pour attester le personnage biblique ; cette source ne prouve pas l'étymologie du prénom.
- Les fiches et leur contenu doivent être enrichis par des dictionnaires spécialisés et des travaux d'onomastique avant d'être considérés comme un corpus éditorial de référence.
- Les messages techniques de démonstration ne doivent pas être exposés au public. La nuance éditoriale appartient au contenu lui-même : formulation prudente, statut de preuve et référence consultable.

Ce corpus initial est une base de travail éditoriale. Il ne justifie pas de généraliser ses hypothèses à d'autres prénoms.
