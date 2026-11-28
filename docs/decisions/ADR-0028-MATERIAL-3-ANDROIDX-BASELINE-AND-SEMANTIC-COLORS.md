# ADR-0028 — Baseline Material 3, couleurs sémantiques et référence AndroidX

- **Statut :** active
- **Décision prise le :** 2026-11-24 (heure non consignée)
- **Version :** 1.1
- **Mis à jour le :** 2026-11-28 06:24:20 (Europe/Paris)
- **Remplacement partiel :** seul le choix de couleur source est remplacé par ADR-0045 ; les autres décisions de cette ADR restent applicables.

## Contexte

Les décisions précédentes ont introduit une couleur source `#005AC1` qualifiée à tort de bleu Pixel, puis la PR #154 a supprimé les couleurs success, warning et info au motif qu'elles ne figuraient pas parmi les rôles système M3. La documentation confondait également la version algorithmique ColorSpec 2021 avec une version du système de composants Material 3 et ne désignait pas clairement AndroidX comme référence d'implémentation.

## Challenge

- **Conserver `#005AC1` comme couleur Pixel :** aucune source officielle ne justifie cette attribution. Elle était un choix Namesia présenté comme une identité Pixel.
- **Choisir un bleu Google comme baseline M3 :** la baseline Material 3 publiée par Android Developers utilise le violet `#6750A4` pour son rôle primary. Le bleu Google n'est pas la couleur par défaut du système M3.
- **Supprimer success, warning et info :** M3 n'en fait pas des rôles système standards, mais sa personnalisation avancée autorise des couleurs additionnelles avec quatre rôles tonals. Les états ont une vraie valeur fonctionnelle et doivent rester distincts.
- **Traiter ColorSpec 2021 comme une version de l'interface :** cette valeur versionne l'algorithme de génération des couleurs dans Material Color Utilities. Elle ne décrit ni les composants ni la version du design system.
- **Utiliser uniquement Material Color Utilities comme référence visuelle :** cette bibliothèque décrit le calcul des couleurs, pas l'anatomie ni le comportement des composants. Les sources AndroidX Compose Material 3 sont nécessaires pour vérifier l'implémentation concrète des composants Android.

## Options

1. **Garder le bleu `#005AC1` et les statuts retirés.** Rejetée : la couleur n'est pas la baseline M3 et la suppression des états sémantiques affaiblit l'interface.
2. **Utiliser le bleu Google `#4285F4` comme source personnalisée.** Rejetée : cela resterait une couleur de marque choisie, pas la baseline Material 3 demandée.
3. **Utiliser la source baseline M3 `#6750A4`, conserver Fidelity/Rainbow et réintroduire les statuts comme couleurs personnalisées M3.** Retenue à l'époque : elle suivait les valeurs documentées par Google et séparait clairement rôles système et besoins sémantiques du produit ; la source de génération Namesia a ensuite été remplacée par ADR-0045.

## Décision

- Documenter `#6750A4` comme couleur source de la baseline AndroidX Material 3 par défaut. Ce n'est plus la source de génération de Namesia : [ADR-0045](ADR-0045-GOOGLE-BLUE-MATERIAL-3-SOURCE.md) lui substitue `#0B57D0` pour Fidelity/Rainbow. Les composants continuent à consommer les rôles calculés, pas le code source brut.
- Conserver `Variant.FIDELITY` pour l'interface et `Variant.RAINBOW` pour les catégories éditoriales seulement.
- Fixer `specVersion: "2021"` explicitement. Il s'agit de la version ColorSpec de Material Color Utilities, pas de la version de Material Design 3. La bibliothèque redirige actuellement Fidelity/Rainbow vers cette version lorsque 2025 ou 2026 est demandé.
- Déclarer `platform: "phone"` explicitement pour la génération MCU.
- Restaurer les sources sémantiques existantes : success `#386A20`, warning `#795900`, info `#005B9A`. Les générer via l'utilitaire officiel `customColor` de Material Color Utilities en conservant leur teinte (`blend: false`) et produire les rôles `color`, `onColor`, `colorContainer`, `onColorContainer` pour clair et sombre.
- Exposer ces rôles sous `--namesia-color-*`. Ils ne sont pas des rôles système M3 et ne doivent jamais utiliser `--md-sys-color-*`. Les erreurs continuent d'utiliser `error`/`on-error`/leurs conteneurs M3.
- Utiliser la spécification Material 3 comme référence normative et les sources AndroidX Jetpack Compose Material 3 comme référence d'implémentation des composants, de leurs variantes, états, dimensions et rôles. Ne pas importer Compose dans Next.js : reproduire ses contrats en React/HTML natif.
- Consigner la correspondance des composants et les recettes de composition des pages dans [Bibliothèque de composants](../design/COMPONENTS.md). Toute nouvelle page doit suivre cette bibliothèque et le contrat décrit dans `AGENTS.md`.
- Ne conserver aucune couleur source, dégradé ou style de marque hors des rôles M3 et des extensions sémantiques déclarées.

## Conséquences

Cette décision a aligné le thème sur la baseline Material 3 avant le choix Google Blue de Namesia consigné dans l'ADR-0045. Les statuts restent compréhensibles et disposent de paires de contraste claires/sombres générées par les outils M3. Les composants du site sont implémentés en Web natif mais leur contrat est vérifié à partir de M3 et AndroidX. La fidélité visuelle doit encore être vérifiée page par page ; la conformité des tokens ne prouve pas à elle seule l'équivalence visuelle.

## Vérification

- CI : baseline AndroidX documentée `#6750A4`, source Namesia actuelle `#0B57D0` selon l'ADR-0045, variantes Fidelity/Rainbow, version ColorSpec 2021, plateforme phone et rôles sémantiques `--namesia-*`.
- CI : aucun rôle success/warning/info sous `--md-sys-color-*`, aucun fallback CSS et aucune couleur hexadécimale codée dans les feuilles de style.
- CI : `MessageStatut` expose success/warning/info/error avec les bons rôles et les annonces accessibles.
- Revue : vérifier les modes clair/sombre, les contrastes des quatre rôles personnalisés, les composants M3 et les pages aux largeurs 320/600/840 px et grand écran.
