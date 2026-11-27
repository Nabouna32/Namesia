# Génération et import des fiches — Namesia

- **Statut :** procédure opérationnelle
- **Version :** 4.0
- **Mis à jour le :** 2026-11-27 (Europe/Paris)

## 1. Principe retenu

Les fiches sont préparées en amont de l'application, puis importées dans l'administration Namesia au format JSON conforme au contrat du projet. Le contenu peut être généré dans une conversation avec un assistant (notamment ChatGPT), préparé par un éditeur ou provenir ultérieurement d'un outil interne explicitement retenu.

**Le processus opérationnel privilégié à ce stade est la génération assistée hors application, suivie d'un import et d'une revue dans l'administration.** Aucun générateur Groq n'est actuellement proposé dans l'interface d'administration. Une page privée où l'administrateur saisit un prénom et déclenche Groq est une piste possible, mais elle n'est ni prioritaire ni décidée comme chantier immédiat. Elle ne sera construite que si elle apporte un gain réel par rapport à la génération directe par un assistant et à l'import JSON existant.

Le workflow GitHub Actions Groq ajouté dans le cadre de l'ancienne ADR-0056 ne constitue plus la stratégie produit. Il ne doit pas être activé ni alimenté par des secrets. Les scripts, prompts, schémas et éléments de provenance hérités restent du code expérimental à réévaluer avant réutilisation ; leur présence dans le dépôt ne vaut pas décision d'architecture.

## 2. Contrat d'import

Le JSON est un format d'échange, pas le modèle de stockage. Il est validé puis réparti dans les colonnes dédiées et les relations Supabase, dans une transaction SQL.

Le contrat d'import est défini par [fiche-prenom.schema.json](../schemas/fiche-prenom.schema.json) et validé par le parseur partagé `parseFichePrenom`. L'import construit ou vérifie l'identité stable du prénom et crée une nouvelle version de fiche. Une sortie invalide ne doit jamais atteindre Supabase ni écraser une version existante.

Le générateur externe ne décide jamais du slug technique, du statut, de la publication ou de l'identité en base. Les champs facultatifs incertains peuvent être absents. Ne pas inventer de graphie, d'étymologie, de source ou de citation pour remplir le schéma.

## 3. Parcours opérationnel actuel

1. **Préparation :** produire la fiche en amont, avec une attention particulière à la fiabilité des origines, variantes, usages et traditions.
2. **Structuration :** convertir le contenu au contrat JSON Namesia sans ajouter de source, de statistique ou de validation fictive.
3. **Import :** utiliser l'administration privée pour importer le JSON. La validation du contrat précède toute écriture.
4. **Prévisualisation :** contrôler le rendu, les rubriques, la graphie, le genre, les associations et les éventuelles omissions.
5. **Publication :** action explicite distincte de l'administrateur. L'import crée un brouillon ; il ne publie jamais automatiquement.

Pour une génération effectuée directement par un assistant, les métadonnées d'un fournisseur ou d'un prompt ne doivent pas être inventées ou déduites a posteriori. Le modèle de provenance Groq historique n'est pas un prérequis à l'import manuel.

## 4. Piste éventuelle : génération Groq dans l'administration

Une interface privée pourrait permettre à un administrateur de saisir un prénom, d'envoyer une requête à Groq depuis le serveur, de prévisualiser la réponse et de l'importer comme brouillon après validation. Cette piste reste différée et devra être challengée avant toute implémentation.

Si elle est reprise, les exigences minimales seront : clé Groq exclusivement côté serveur ; autorisation administrateur vérifiée sur chaque requête ; limitation du débit et gestion des quotas ; schéma strict puis validation par le parseur Namesia ; prévisualisation et import explicitement déclenchés ; aucune publication automatique ; aucune source, citation, statistique ou preuve inventée ; gestion des refus, réponses tronquées, délais et relances ; décision explicite sur la conservation de la provenance.

Aucune dépense fournisseur n'est autorisée sans arbitrage préalable du propriétaire.

## 5. Limites éditoriales

La génération par IA ne constitue ni une recherche documentaire ni une vérification factuelle. Le modèle n'est pas une source. Une validation JSON prouve uniquement la conformité structurelle.

Distinguer faits documentés, hypothèses étymologiques, variantes discutées, usages observés et interprétations culturelles. En l'absence de source vérifiable, nuancer ou omettre l'affirmation. Les associations symboliques ne sont ni des faits scientifiques ni des prédictions.

La revue éditoriale recherche notamment les affirmations trop certaines, les étymologies confondues, les variantes inventées, les contradictions, les répétitions et le remplissage générique. Les contrôles automatiques peuvent signaler des anomalies, mais ne garantissent jamais l'absence d'hallucination.

## 6. Références

- [Gouvernance éditoriale et génération](qualite-editoriale.md)
- [Modèle de données](modele-donnees.md)
- [Politique éditoriale](politique-editoriale.md)
- [Architecture](architecture.md)
- [ADR-0057 — Génération externe et import éditorial](decisions/ADR-0057-generation-externe-import.md)
