# ADR-0037 — Architecture directe des composants Material 3

- **Statut :** active
- **Version :** 1.1
- **Mis à jour le :** 2026-11-28 06:24:20 (Europe/Paris)
- **Décision prise le :** 2026-11-24 (heure non consignée)
- **Référence Android :** Compose Material 3 1.5.0 stable, commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`
- **Référence Web évaluée :** Material Web 2.5.0, publié le 14 juillet 2026 au commit `b4de401eb665ec63474f39319a4ba8f2145974cc` ; état du dépôt revérifié le 24 novembre 2026 au commit `d4f63c567f73b16717f4c04b57fa6390d0b2312d`
- **Remplace :** les conventions antérieures de nommage et d'architecture des primitives UI. Les exigences métier et d'accessibilité encore applicables ont été réévaluées et transférées dans les documents canoniques et les composants concernés.

## Contexte

Les primitives d'interface étaient centralisées sous `components/ui/`, mais exposaient des noms et des API propres à Namesia (`Bouton`, `ChampRecherche`, `ChipFiltre`, `MessageStatut`). Le registre mélangeait ainsi le nom de référence AndroidX, le contrat visuel et une couche d'adaptation propriétaire. La documentation demandait explicitement de conserver ces adaptateurs.

Cette organisation rendait la fidélité difficile à auditer : un nouveau composant pouvait être nommé selon le produit, diverger de l'API M3 et rester documenté comme conforme. Elle entretenait aussi un vocabulaire en doublon entre les pages, les composants et les sources AndroidX.

## Challenge

- **Garder les wrappers français et documenter le mapping :** améliore la traçabilité mais conserve deux nomenclatures et autorise l'écart d'API.
- **Adopter Material Web (`@material/web`) :** c'est la bibliothèque officielle M3 pour le navigateur et son API stable couvre certains contrôles utiles. Cependant, le [README au snapshot du 24 novembre 2026](https://github.com/material-components/material-web/blob/d4f63c567f73b16717f4c04b57fa6390d0b2312d/README.md) confirme la maintenance en attente de nouveaux mainteneurs. Sa [roadmap au même commit](https://github.com/material-components/material-web/blob/d4f63c567f73b16717f4c04b57fa6390d0b2312d/docs/roadmap.md) précise qu'aucune nouvelle fonctionnalité ni aucun nouveau composant ne sont planifiés et liste encore Card, Navigation bar, Navigation rail, Search, Snackbar et Top app bar parmi les composants non construits. Les ajouts observés dans `labs` ne constituent pas un contrat stable. N'utiliser que les composants déjà disponibles créerait deux piles de composants (Lit/Web Components et React) sans couvrir le shell ni le catalogue. Cette option est écartée pour le produit, tout en conservant ses tokens comme référence secondaire.
- **Importer AndroidX Compose dans Next.js :** impossible directement, car Compose est une bibliothèque Kotlin/Android.
- **Porter les contrats AndroidX en React/HTML sous les noms M3 :** garde une seule nomenclature, conserve la sémantique Web native et permet de vérifier les dimensions, états et rôles contre une source AndroidX immuable.

## Décision

Le critère littéral « aucun composant maison » est techniquement incompatible avec la cible Next.js/React tant qu'aucune bibliothèque Web officielle, maintenue et complète ne fournit les composants requis. AndroidX Compose cible Kotlin/Android ; Material Web est en maintenance et ne couvre pas le shell ni plusieurs composants nécessaires. Remplacer les ports locaux par des composants tiers non officiels ou des composants expérimentaux dégraderait la provenance, la maintenance ou la fidélité. La bonne exigence n'est donc pas zéro code d'interface local, mais zéro primitive concurrente ou wrapper arbitraire : chaque port local doit être l'implémentation principale, unique et traçable d'un contrat AndroidX sur le Web. Cette décision constitue une dérogation explicite à la formulation littérale antérieure et doit être réexaminée si une alternative officielle stable et complète devient disponible.

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

## Inventaire des alternatives et décision

| Surface | Alternative Web officielle | Décision Namesia |
|---|---|---|
| Button, IconButton, Checkbox, TextField, FilterChip, InputChip | Material Web fournit des éléments pour une partie de ces contrôles, mais son projet est en maintenance et ses contrats Lit ne sont pas AndroidX Compose. | Conserver les ports React/HTML AndroidX déjà utilisés : pas de migration vers une dépendance non pérenne ni de double pile. |
| Card, NavigationBar, NavigationRail, SearchBar, Snackbar, TopAppBar | Absents de la couverture stable Material Web vérifiée au commit épinglé ; les éléments expérimentaux ne sont pas un contrat de production. | Conserver les ports uniquement lorsqu'ils sont utilisés ; utiliser les éléments HTML natifs pour les comportements de plateforme. |
| Dialog | Élément HTML natif `dialog` disponible. | Utiliser `dialog` comme primitive de plateforme et appliquer le contrat visuel M3 ; pas de moteur modal maison. |
| Select, liens, boutons de formulaire, typographie | Éléments HTML natifs. | Préférer directement `select`, `a`, `button`, `input` et les éléments typographiques sémantiques ; ne pas fabriquer de primitive locale. |

L'inventaire est une décision d'architecture, pas une affirmation de parité parfaite. Les ports existants doivent être challengés individuellement lorsqu'ils sont touchés ; les composants inutilisés sont supprimés. Une alternative ne sera adoptée que si sa disponibilité stable, maintenance, accessibilité, API React/Next et fidélité sont démontrées.

## Validation

La CI vérifie les chemins officiels, les imports, les variantes, les rôles typographiques, les dimensions et les états. Aucun test ni build n'est exécuté localement. La fidélité visuelle doit être revue en clair/sombre, sur mobile, tablette et grand écran.
