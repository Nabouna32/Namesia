# ADR-0037 — Utiliser directement les composants Material 3

- **Statut :** acceptée
- **Date :** 2026-11-24
- **Référence d'implémentation :** AndroidX Compose Material 3 1.5.0 stable, commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`
- **Remplace :** les décisions antérieures qui imposent des noms de composants UI Namesia (notamment ADR-0007, ADR-0008, ADR-0011, ADR-0012, ADR-0013, ADR-0034, ADR-0035 et ADR-0036) pour la nomenclature et l'architecture des primitives. Les exigences métier et d'accessibilité restent à réévaluer composant par composant.

## Contexte

Le site s'est doté progressivement de composants partagés nommés en français (`Bouton`, `ChampRecherche`, `ChipFiltre`, `ChampSelect`, `MessageStatut`) puis d'un tableau de correspondance vers Material 3. Cette architecture inverse le contrat souhaité : le code possède son propre vocabulaire de composants, puis documente qu'il ressemble à M3. Elle entretient des noms, fichiers, API et couches de traduction qui ne correspondent pas à l'API de référence.

## Challenge

- **Conserver les wrappers français et améliorer leur CSS :** ne corrige pas la duplication de vocabulaire et maintient une couche de traduction permanente.
- **Importer Compose Material 3 dans Next.js :** impossible et inadapté ; AndroidX est du Kotlin/Compose, pas une bibliothèque React Web.
- **Utiliser les composants M3 comme contrat direct en React :** conserve React et HTML natif, tout en alignant noms, variantes, anatomie, tokens et états sur les composants AndroidX réels. C'est la seule option qui respecte à la fois la plateforme Web et la demande de fidélité.

## Décision

1. Les primitives d'interface portent les noms officiels Material 3 : `Button`, `IconButton`, `SearchBar`, `TextField`, `FilterChip`, `InputChip`, `Card`, `TopAppBar`, `NavigationBar`, `NavigationRail`, etc.
2. Les noms, exports, fichiers, props et variantes sont normalisés sur les conventions M3 lorsque celles-ci sont applicables. Les textes de l'interface restent en français ; seuls les identifiants techniques de composants sont concernés.
3. Les composants métier Namesia restent autorisés uniquement lorsqu'ils expriment une vraie capacité produit (favoris, comparaison, catalogue, fiche). Ils composent directement les composants M3 et ne créent pas une seconde bibliothèque visuelle.
4. Un lien Next.js stylé comme un bouton reste un lien natif ; il n'introduit pas un composant générique concurrent.
5. Un `select` HTML natif reste un `select` ; il n'est pas renommé artificiellement en composant Material.
6. Les composants M3 non utilisés ne sont pas implémentés par anticipation. Aucun faux composant, alias de compatibilité, export historique, wrapper purement nominal ou fallback de présentation n'est ajouté.
7. Les différences inévitables entre Android et Web sont limitées aux frontières réelles du navigateur (sémantique HTML, focus, navigation, clavier, cibles tactiles) et documentées précisément.

## Conséquences

- La table de correspondance « nom M3 / composant Namesia » disparaît.
- Les fichiers, imports, exports, tests et styles des primitives existantes sont renommés ou supprimés dans la migration, sans période de double API.
- Les composants métier sont challengés séparément ; leur nom n'est pas une justification pour conserver une primitive UI Namesia.
- Les anciennes décisions qui imposaient ces noms sont historiques et ne guident plus les nouvelles pages.
- Le contrat de design devient vérifiable par la CI : aucune primitive UI ne peut réintroduire les anciens noms français ni des alias de compatibilité.

## Validation

- Rechercher dans le code les anciens exports et imports, y compris les tests.
- Vérifier que chaque composant M3 utilisé renvoie à la source AndroidX épinglée et respecte son anatomie, ses variantes, ses états et ses tokens.
- Vérifier le HTML sémantique, le clavier, le focus, les lecteurs d'écran, les modes clair/sombre et les largeurs 320, 600, 840 px et grand écran.
- La CI GitHub Actions reste l'unique autorité pour les tests et le build.
