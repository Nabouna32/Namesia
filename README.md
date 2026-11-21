# Namesia

Namesia est une plateforme française de découverte des prénoms : fiches documentées, contenu symbolique clairement contextualisé et outils interactifs pour accompagner la recherche d'un prénom.

## Site web — MVP en construction

Le dépôt contient désormais un premier socle applicatif basé provisoirement sur Next.js, React et TypeScript.

### Démarrer en local

Prérequis : Node.js 20.9 ou supérieur.

```bash
npm install
npm run dev
```

Ouvrir ensuite http://localhost:3000.

Commandes disponibles :

- `npm run dev` : serveur de développement ;
- `npm run typecheck` : vérification TypeScript ;
- `npm run build` : build de production ;
- `npm run start` : serveur de production après build.

Le catalogue contient uniquement quelques fiches de démonstration. Elles ne constituent pas des contenus éditoriaux vérifiés et sont signalées comme telles dans l'interface.

## Règles de contribution

La charte [AGENTS.md](AGENTS.md) s'applique à tout le dépôt, à chaque contribution humaine ou assistée par IA. Elle impose notamment le challenge critique systématique des demandes, propositions, décisions et de l'existant, ainsi que la justification des choix et compromis.

## Documentation canonique

- [Charte de contribution et de challenge](AGENTS.md)
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
7. Challenger en permanence les idées, hypothèses, décisions et éléments existants ; aucune proposition n'est acceptée par défaut.
