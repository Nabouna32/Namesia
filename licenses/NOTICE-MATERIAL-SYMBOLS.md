# Attribution — Google Material Symbols

- **Version :** 1.1
- **Mis à jour le :** 2026-11-28 09:22:21 (Europe/Paris)

Les pictogrammes fonctionnels de Namesia appartiennent à la famille **Google Material Symbols**, style **Rounded**, poids **400**. Les SVG déjà intégrés proviennent de la distribution communautaire `@material-symbols/svg-400` 0.49.0 publiée par `marella` ; cette distribution n'est pas maintenue ni vérifiée par Google. Les sources amont et le statut des distributions sont décrits dans le [dépôt officiel Google](https://github.com/google/material-design-icons).

## Chevron de navigation

Le glyphe `chevron_right` utilisé par les cartes de découverte a été vérifié directement dans le dépôt officiel Google :

- Fichier source : [chevron_right_24px.svg](https://github.com/google/material-design-icons/blob/10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7/symbols/web/chevron_right/materialsymbolsrounded/chevron_right_24px.svg)
- Commit source immuable : `10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7` (23 octobre 2026).
- Variante : `materialsymbolsrounded`, format 24 px, axes par défaut, poids 400.
- Codepoint : `e5cc`, confirmé dans l'index `MaterialSymbolsRounded[FILL,GRAD,opsz,wght].codepoints` du même commit.
- Le tracé original utilise `viewBox="0 -960 960 960"` ; le registre partagé conserve ce repère commun sans variante conditionnelle.
- Licence : Apache License 2.0. La copie de la licence est conservée dans `Apache-2.0-Material-Symbols.txt`.

Le chemin du glyphe est centralisé dans `components/material3/Icon.tsx`. Les composants métier ne contiennent ni SVG ni chemin d'icône. La page utilise uniquement le nom typé `chevron-right` du registre partagé.

## Ressources et licence

- Source amont officielle : [google/material-design-icons](https://github.com/google/material-design-icons).
- Distribution SVG communautaire utilisée pour les ressources historiques : [marella/material-symbols](https://github.com/marella/material-symbols), paquet `@material-symbols/svg-400` 0.49.0.
- Licence des Material Symbols : Apache License 2.0 ; la copie applicable est conservée dans `Apache-2.0-Material-Symbols.txt`.
- Les glyphes sont embarqués localement ; aucune ressource distante ni dépendance d'icônes n'est chargée à l'exécution.
