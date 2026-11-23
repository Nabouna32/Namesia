# ADR-0023 — Définir les surfaces Fidelity dans leurs règles canoniques

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

Les styles Material 3 des surfaces principales étaient ajoutés dans une longue couche en fin de `globals.css`. Les règles de base conservaient encore des fonds et des bordures historiques, puis une seconde règle les remplaçait. Le hero, les cartes vedettes, les fiches et le pied de page avaient donc plusieurs sources de vérité, parfois avec des dégradés qui n'étaient neutralisés qu'après coup.

## Challenge

- **Garder une couche de overrides finale :** elle facilite une première migration, mais rend la cascade opaque et laisse des styles obsolètes dans les règles de base.
- **Réécrire toute la feuille globale :** trop risqué dans une seule passe, car les media queries et les composants métier partagent encore certains sélecteurs.
- **Créer de nouveaux composants React pour les surfaces :** inutile ; le problème est la cascade CSS, pas la structure des composants.

## Décision

- Déplacer les rôles Fidelity du hero, de son eyebrow, des cartes vedettes, du hero de fiche et du pied de page dans leurs règles de base.
- Supprimer les anciennes bordures, couleurs et dégradés neutralisés par les overrides.
- Conserver uniquement les règles réellement responsives dans les media queries : dimensions, espacements et disposition.
- Garder la couche Fidelity finale pour les familles qui n'ont pas encore été consolidées ; elle ne redéfinit plus ces surfaces principales.

## Conséquences

- Chaque surface principale possède une source de vérité lisible.
- Le thème clair/sombre agit directement sur les rôles de surface, sans dépendre d'une surcharge tardive.
- Les dégradés historiques du hero de fiche disparaissent réellement au lieu de rester masqués.
- Les états hover/active des cartes vedettes restent définis au même endroit que leur surface de repos.

## Validation

Les contrats CI vérifient les rôles dans les règles de base et l'absence de redéfinitions dans la couche Fidelity pour les sélecteurs concernés. Aucun test ni build local n'est exécuté.
