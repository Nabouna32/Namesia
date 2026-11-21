# Namesia

Namesia est une plateforme française de découverte des prénoms : fiches documentées, contenu symbolique clairement contextualisé et outils interactifs pour accompagner la recherche d'un prénom.

## Documentation canonique

- [Vision produit](docs/vision-produit.md)
- [Architecture cible](docs/architecture.md)
- [Modèle de données](docs/modele-donnees.md)
- [Politique éditoriale et sources](docs/politique-editoriale-et-sources.md)
- [Pipeline de génération IA](docs/pipeline-generation-ia.md)
- [Contrat JSON des fiches](schemas/fiche-prenom.schema.json)
- [Décisions d'architecture](docs/decisions/)

## Principes non négociables

1. Distinguer les faits vérifiables des interprétations symboliques.
2. Associer les affirmations factuelles à des sources traçables.
3. Valider chaque contenu généré avant publication.
4. Versionner les schémas et conserver l'historique éditorial.
5. Ne pas créer de pages SEO pauvres, dupliquées ou sans valeur ajoutée.
6. Faire évoluer la documentation canonique dans chaque PR qui modifie une décision ou un comportement du produit.

## État du projet

Phase de cadrage et de fondation. Les choix décrits comme « cible » restent soumis à validation par ADR avant implémentation.
