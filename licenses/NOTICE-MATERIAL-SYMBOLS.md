# Attribution — Google Material Symbols

- **Version :** 1.2
- **Mis à jour le :** 2026-11-28 11:12:41 (Europe/Paris)

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

## Retour dans la hiérarchie interne

Le glyphe `chevron_left` signale un retour vers le niveau précédent d'un parcours interne. Il a été vérifié directement dans le dépôt officiel Google :

- Fichier source : [chevron_left_24px.svg](https://github.com/google/material-design-icons/blob/10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7/symbols/web/chevron_left/materialsymbolsrounded/chevron_left_24px.svg)
- Commit source immuable : `10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7`.
- Variante : `materialsymbolsrounded`, format 24 px, axes par défaut, poids 400.
- Tracé original : `m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z`.
- Licence : Apache License 2.0, conservée dans `Apache-2.0-Material-Symbols.txt`.

Les liens de retour internes utilisent `chevron_left` ; ils ne dessinent pas de flèche Unicode dans les pages.

## Ouverture d’une ressource externe

Le glyphe `arrow_outward` est utilisé uniquement pour signaler l'ouverture d'une ressource externe (par exemple l'étude de l'Insee). Il a été vérifié directement dans le dépôt officiel Google :

- Fichier source : [arrow_outward_24px.svg](https://github.com/google/material-design-icons/blob/10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7/symbols/web/arrow_outward/materialsymbolsrounded/arrow_outward_24px.svg)
- Commit source immuable : `10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7`.
- Variante : `materialsymbolsrounded`, format 24 px, axes par défaut, poids 400.
- Tracé original : `M640-624 284-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l356-356H280q-17 0-28.5-11.5T240-720q0-17 11.5-28.5T280-760h400q17 0 28.5 11.5T720-720v400q0 17-11.5 28.5T680-280q-17 0-28.5-11.5T640-320v-304Z`.
- Licence : Apache License 2.0, conservée dans `Apache-2.0-Material-Symbols.txt`.

Les liens internes de navigation hiérarchique utilisent `chevron_right` ; ce glyphe diagonal est réservé aux sorties vers une autre origine.

## Ressources et licence

- Source amont officielle : [google/material-design-icons](https://github.com/google/material-design-icons).
- Distribution SVG communautaire utilisée pour les ressources historiques : [marella/material-symbols](https://github.com/marella/material-symbols), paquet `@material-symbols/svg-400` 0.49.0.
- Licence des Material Symbols : Apache License 2.0 ; la copie applicable est conservée dans `Apache-2.0-Material-Symbols.txt`.
- Les glyphes sont embarqués localement ; aucune ressource distante ni dépendance d'icônes n'est chargée à l'exécution.
