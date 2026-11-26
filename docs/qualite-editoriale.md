# Qualité éditoriale et gouvernance des fiches — Namesia

- **Statut :** index canonique
- **Version :** 1.2
- **Mis à jour le :** 2026-11-26 20:41:00 (Europe/Paris)

Ce document donne les principes communs. Les procédures détaillées sont maintenues dans les références spécialisées existantes afin d’éviter les règles dupliquées :

- [Politique éditoriale](politique-editoriale.md) : prudence étymologique, formulation, symbolique, transparence et publication.
- [Génération et import IA](pipeline-generation-ia.md) : workflow Groq, contrats JSON, validation, secrets, provenance et import.
- [Modèle de données](modele-donnees.md) : colonnes relationnelles, versions, associations et métadonnées privées.
- [État du projet](etat-du-projet.md) : capacités effectivement disponibles et limites restantes.

## Principes non négociables

1. Un contenu généré par IA n’est pas une information vérifiée.
2. Ne jamais inventer de source, citation, statistique, date, origine, variante ou validation.
3. Distinguer fait documenté, hypothèse, usage et interprétation culturelle ; signaler l’incertitude ou laisser le champ absent.
4. Une sortie JSON valide prouve uniquement la conformité structurelle.
5. Les champs éditoriaux sont stockés dans des colonnes dédiées ; le JSON est un format d’échange.
6. La provenance technique des générations importées est conservée dans une table relationnelle privée, distincte du contenu.
7. Une génération ou un import crée un brouillon ; la publication est une action administrative explicite.
8. Les corrections créent une nouvelle version ; une version publiée n’est jamais écrasée.
9. Les retours visiteurs sont privés par défaut, vérifiés et jamais publiés automatiquement.
10. La qualité prime sur le volume : différer ou omettre une information incertaine vaut mieux que remplir artificiellement une fiche.

## Cycle de vie

Génération → validation structurelle → prévisualisation → import en brouillon → contrôle éditorial → publication explicite → correction versionnée, dépublication ou archivage selon le besoin.

La provenance ne doit jamais être inventée après coup. Un modèle, un prompt ou une validation technique ne sont pas des sources factuelles. Les métadonnées et limites du pipeline sont décrites dans le document de génération.
