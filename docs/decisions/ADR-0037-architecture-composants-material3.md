# ADR-0037 — Architecture directe des composants Material 3

- **Statut :** acceptée
- **Date :** 2026-11-24
- **Référence Android :** Compose Material 3 1.5.0 stable, commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`
- **Référence Web évaluée :** Material Web 2.5.0, commit `b4de401eb665ec63474f39319a4ba8f2145974cc`
- **Remplace :** les décisions antérieures qui imposent des noms de composants UI Namesia (notamment ADR-0007, ADR-0008, ADR-0011, ADR-0012, ADR-0013, ADR-0034, ADR-0035 et ADR-0036) pour la nomenclature et l'architecture des primitives. Les exigences métier et d'accessibilité restent à réévaluer composant par composant.

## Contexte

Les primitives d'interface étaient centralisées sous `components/ui/`, mais exposaient des noms et des API propres à Namesia (`Bouton`, `ChampRecherche`, `ChipFiltre`, `MessageStatut`). Le registre mélangeait ainsi le nom de référence AndroidX, le contrat visuel et une couche d'adaptation propriétaire. La documentation demandait explicitement de conserver ces adaptateurs.

Cette organisation rendait la fidélité difficile à auditer : un nouveau composant pouvait être nommé selon le produit, diverger de l'API M3 et rester documenté comme conforme. Elle entretenait aussi un vocabulaire en doublon entre les pages, les composants et les sources AndroidX.

## Challenge

- **Garder les wrappers français et documenter le mapping :** améliore la traçabilité mais conserve deux nomenclatures et autorise l'écart d'API.
- **Installer Material Web :** sa bibliothèque propose des composants M3 pour le navigateur, mais son [README officiel](https://github.com/material-components/material-web/blob/b4de401eb665ec63474f39319a4ba8f2145974cc/README.md) indique une maintenance en attente de nouveaux mainteneurs. Elle ne garantit pas la parité avec AndroidX Compose 1.5.0 et son contrat d'implémentation diffère. La dépendance ne devient donc pas la source de vérité du site.
- **Importer AndroidX Compose dans Next.js :** impossible directement, car Compose est une bibliothèque Kotlin/Android.
- **Porter les contrats AndroidX en React/HTML sous les noms M3 :** garde une seule nomenclature, conserve la sémantique Web native et permet de vérifier les dimensions, états et rôles contre une source AndroidX immuable.

## Décision

1. Les composants de présentation M3 vivent dans `components/material3/` et portent leur nom officiel : `Button`, `IconButton`, `Checkbox`, `SearchBar`, `TextField`, `FilterChip`, `InputChip`, `Card`, `Snackbar`, `TopAppBar`, `NavigationBar`, `NavigationRail` et `Icon`.
2. Les composants propres au produit vivent dans `components/features/` et portent un nom métier anglais explicite. Ils composent les composants Material 3 ; ils ne redéfinissent pas leurs états ni leur apparence.
3. Le comparateur compose `Checkbox`, port Web d'AndroidX : un input natif contrôlé conserve la sémantique et le clavier, tandis que l'indicateur, la cible et les états M3 restent centralisés.
4. Les sélecteurs de formulaire conservent le `select` HTML natif : AndroidX Compose Material 3 n'a pas de composant nommé Select et le menu du navigateur apporte clavier et accessibilité natifs. Aucun faux menu ni fallback visuel n'est ajouté.
5. Les éléments de texte restent les éléments HTML sémantiques ; les tokens typographiques M3 sont appliqués directement. Aucun wrapper `Typography` sans contrat supplémentaire n'est introduit.
6. Les liens d'action utilisent la sémantique `a`/Next Link ; Button accepte `href` comme adaptation Web et rend un vrai lien, sans remplacer sa sémantique par un bouton.
7. Les composants M3 non utilisés ne sont pas implémentés par anticipation. Aucun faux composant, alias de compatibilité, export historique, wrapper purement nominal ou fallback de présentation n'est ajouté.
8. Aucun alias de compatibilité ou ancienne primitive Namesia n'est conservé après migration ; les différences inévitables entre Android et Web sont limitées aux frontières réelles du navigateur (sémantique HTML, focus, navigation, clavier, cibles tactiles) et documentées précisément.

## Conséquences

- Le vocabulaire du code suit directement AndroidX et devient vérifiable par recherche.
- La frontière entre composants M3 et logique métier est explicite.
- Les CSS Modules de présentation sont regroupés avec leurs composants ; les styles métier restent dans leurs features ; les tokens typographiques, de forme, de mouvement et d'état sont centralisés dans `styles/material3/tokens.css`.
- La parité pixel n'est pas présumée : chaque adaptation Web est confrontée aux sources AndroidX et aux limites réelles du navigateur.
- Les composants non nécessaires ne sont pas simulés à l'avance. Une nouvelle primitive exige un besoin concret, une référence officielle et un contrat testable.

## Migration

Les anciennes décisions de bibliothèque et de noms d'adaptateurs sont marquées comme remplacées par cet ADR. Les composants historiques `components/ui/` et leurs imports sont supprimés ; les usages sont migrés vers les composants officiels et les compositions métier.

## Validation

La CI vérifie les chemins officiels, les imports, les variantes, les rôles typographiques, les dimensions et les états. Aucun test ni build n'est exécuté localement. La fidélité visuelle doit être revue en clair/sombre, sur mobile, tablette et grand écran.
