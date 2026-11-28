# ADR-0029 — Typographie des destinations de navigation Material 3

- **Statut :** acceptée
- **Date :** 2026-11-24
- **Version :** 1.0
- **Mis à jour le :** 2026-11-27 20:10:47 (Europe/Paris)

## Contexte

La navigation partagée Namesia utilise body-small pour les libellés de ses destinations. Une règle spécifique aux fenêtres de 360 px et moins les réduit encore à label-small. Cette hiérarchie n'est pas celle des composants AndroidX Material 3.

## Challenge

- Conserver body-small : lisible, mais le rôle ne correspond pas au contrat des composants de navigation.
- Réduire à label-small sur les petits écrans : gagne peu de place et crée une variante typographique non prévue par le composant.
- Employer label-medium partout : reprend exactement le token déclaré par les composants AndroidX et évite une exception responsive.

## Décision

Utiliser les quatre tokens du rôle label-medium (taille, graisse, interligne et approche) sur les libellés des destinations. Supprimer la règle compacte qui remplaçait la taille par label-small.

Les dimensions et la disposition de la navigation ne sont pas modifiées dans cette décision : elles feront l'objet d'une vérification distincte contre les tokens de composants et les contraintes tactiles Web.

## Conséquences

La NavigationBar et la NavigationRail partagent la même typographie officielle M3 sur toutes les largeurs. Les libellés peuvent occuper légèrement plus d'espace horizontal que la règle locale antérieure sur les écrans très étroits ; le texte conserve sa troncature existante plutôt que de changer de rôle typographique.

## Vérification

La CI vérifie les quatre tokens label-medium dans la règle commune et interdit les substitutions body-small/label-small dans les règles de navigation. Les références de source sont consignées dans [Vérification Material 3](../MATERIAL-3-VERIFICATION.md).
