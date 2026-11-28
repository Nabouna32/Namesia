# ADR-0045 — Source Google Blue pour le thème Material 3 Fidelity

- **Statut :** active
- **Version :** 1.1
- **Mis à jour le :** 2026-11-28 06:26:55 (Europe/Paris)
- **Décision prise le :** 2026-11-24 (heure non consignée)
- **Remplace :** uniquement le choix de couleur source de l'[ADR-0028](ADR-0028-MATERIAL-3-ANDROIDX-BASELINE-AND-SEMANTIC-COLORS.md) ; ses autres décisions (Fidelity/Rainbow, ColorSpec, rôles sémantiques et référence AndroidX) restent applicables.

## Contexte

La source de génération du thème Namesia était le violet #6750A4, Primary40 de la baseline AndroidX Material 3. Ce choix était techniquement conforme à la baseline par défaut, mais ne respectait pas la direction produit demandée : un bleu Google pour la couleur principale. La confusion venait du fait que la baseline Material 3 AndroidX et les couleurs de référence Google/Chromium ne sont pas identiques.

## Challenge

- **Présenter #6750A4 comme un bleu Google :** faux ; il s'agit du violet Primary40 de la baseline AndroidX.
- **Utiliser #4285F4 :** c'est un bleu Google historique/marketing, mais il ne correspond pas au bleu de référence du thème Android Chromium retenu ici.
- **Utiliser #0B57D0 :** la documentation Chromium Android l'identifie comme baseline_primary_600 dans son thème Android ; c'est la source bleue la mieux étayée pour répondre à la direction Namesia sans prétendre qu'il s'agit de la baseline AndroidX.

## Décision

- Utiliser #0B57D0 comme couleur source de génération des schémas Variant.FIDELITY et Variant.RAINBOW.
- Décrire cette source comme un choix Google Blue de Namesia, inspiré du baseline_primary_600 de Chromium Android, et non comme la baseline AndroidX Material 3 par défaut.
- Conserver les rôles système M3 calculés, les noms de tokens, les couleurs sémantiques success, warning, info, specVersion 2021 et platform phone.
- Ne recopier aucun hexadécimal bleu dans les composants : ils continuent à consommer les rôles calculés Fidelity.
- Maintenir #6750A4 dans la documentation uniquement pour expliquer la baseline AndroidX par défaut et la différence avec le choix produit.

## Conséquences

Les actions primaires, les sélections, les accents Fidelity et les états associés prennent une dominante bleue en clair comme en sombre. Les surfaces, contrastes et couleurs de premier plan restent calculés par Material Color Utilities ; aucun composant ne reçoit de couleur brute. La palette Rainbow des catégories et les trois couleurs sémantiques restent inchangées dans leur définition et leur rôle.

## Référence

- Chromium UI Platform — How to Develop With Dynamic Colors : https://chromium.googlesource.com/chromium/src/+/6ffe83723d5b4c60a15ae8c356d51e16a4951b24/docs/ui/android/dynamic_colors.md ; colorPrimary utilise baseline_primary_600 (#0B57D0) avant l'application éventuelle des couleurs dynamiques.
- Android Developers — Material 3 theming : https://developer.android.com/codelabs/m3-design-theming ; les couleurs source servent à générer les rôles et peuvent être choisies pour refléter une marque.
