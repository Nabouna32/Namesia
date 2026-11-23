# ADR-0026 — Borner le chargement des suggestions de fiches

- **Statut :** acceptée
- **Date :** 2026-11-23

## Contexte

Chaque fiche publique affichait jusqu'à trois suggestions du même genre. Pour les choisir, le serveur chargeait l'index léger complet, puis filtrait et classait toutes les entrées. Le visiteur ne recevait que trois suggestions, mais chaque ouverture de fiche déclenchait un transfert et un tri proportionnels à la taille totale du catalogue.

## Challenge

- **Conserver le parcours complet :** il garantit le classement déterministe sur tous les candidats, mais son coût augmente sans bénéfice visible proportionnel pour trois cartes.
- **Choisir les trois premières entrées :** solution peu coûteuse, mais elle rendrait toutes les fiches similaires et dépendantes de l'ordre alphabétique.
- **Échantillonner une fenêtre stable :** borne les données transférées et le tri, tout en gardant une sélection variée et reproductible.

## Décision

Compter exactement les autres fiches publiées du même genre, puis charger au maximum 64 identités dans une fenêtre déterminée par un hash stable du slug de la fiche et ordonnée par UUID. Classer cet échantillon avec le score déterministe existant et ne conserver que trois suggestions.

Les textes éditoriaux ne sont jamais chargés pour cette opération. Le genre reste l'unique critère éditorial ; aucune proximité d'origine ou de signification n'est suggérée.

## Conséquences

Le transfert et le tri côté serveur sont bornés à 64 lignes au lieu de parcourir tout le catalogue. La sélection reste stable pour une fiche tant que le catalogue ne change pas. Elle ne prétend plus être le meilleur classement parmi toutes les fiches publiées : les suggestions sont un point de découverte, pas un classement éditorial.

La requête utilise un compte exact puis une lecture ciblée, soit deux requêtes Supabase. Cette latence supplémentaire est le compromis accepté pour limiter les données lues et transférées.

## Validation

Des tests unitaires couvrent les fenêtres vides, petites, bornées, déterministes et les entrées invalides. La CI GitHub Actions reste l'unique validation automatisée ; aucun test local n'est exécuté.
