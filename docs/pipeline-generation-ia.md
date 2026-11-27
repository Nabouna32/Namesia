# Génération et import des fiches — Namesia

- **Statut :** procédure opérationnelle
- **Version :** 4.1
- **Mis à jour le :** 2026-11-27 11:05:11 (Europe/Paris)

## 1. Parcours retenu

Les fiches sont préparées en amont de l'application, notamment avec un assistant conversationnel, puis structurées au format JSON Namesia.

**Le parcours opérationnel est : génération assistée hors application, import dans l'administration, prévisualisation et revue, puis publication explicite.** L'application ne déclenche aucun appel à un modèle IA et ne réalise aucune vérification factuelle automatique.

Aucun générateur IA intégré à l'administration n'est actuellement disponible ni engagé comme chantier. La présence éventuelle de code expérimental dans le dépôt ne constitue pas une fonctionnalité, une dépendance opérationnelle ou une décision de réactivation.

## 2. Contrat d'import

Le JSON est un format d'échange, pas le modèle de stockage. Il est validé puis réparti dans les colonnes dédiées et les relations Supabase, dans une transaction SQL.

Le contrat est défini par [fiche-prenom.schema.json](../schemas/fiche-prenom.schema.json) et validé par le parseur partagé `parseFichePrenom`. L'import construit ou vérifie l'identité stable du prénom et crée une nouvelle version de fiche. Une sortie invalide ne doit jamais atteindre Supabase ni écraser une version existante.

Le générateur externe ne décide jamais du slug technique, du statut, de la publication ou de l'identité en base. Les champs facultatifs incertains peuvent être absents. Ne pas inventer de graphie, d'étymologie, de source ou de citation pour remplir le schéma.

## 3. Parcours opérationnel

1. **Préparation :** produire la fiche en amont en vérifiant autant que possible les origines, variantes, usages et traditions.
2. **Structuration :** convertir le contenu au contrat JSON sans ajouter de source, statistique ou validation fictive.
3. **Import :** utiliser l'administration privée ; la validation du contrat précède toute écriture.
4. **Prévisualisation :** contrôler le rendu, les rubriques, la graphie, le genre, les associations et les éventuelles omissions.
5. **Publication :** action explicite distincte de l'administrateur. L'import crée un brouillon et ne publie jamais automatiquement.

Les métadonnées d'un fournisseur ou d'un prompt ne font pas partie du contrat courant. Ne pas les inventer ou les déduire a posteriori.

## 4. Limites éditoriales

La génération par IA ne constitue ni une recherche documentaire ni une vérification factuelle. Le modèle n'est pas une source. Une validation JSON prouve uniquement la conformité structurelle.

Distinguer faits documentés, hypothèses étymologiques, variantes discutées, usages observés et interprétations culturelles. En l'absence de source vérifiable, nuancer ou omettre l'affirmation. Les associations symboliques ne sont ni des faits scientifiques ni des prédictions.

La revue éditoriale recherche notamment les affirmations trop certaines, les étymologies confondues, les variantes inventées, les contradictions, les répétitions et le remplissage générique. Les contrôles automatiques peuvent signaler des anomalies, mais ne garantissent jamais l'absence d'hallucination.

## 5. Références

- [Qualité éditoriale](qualite-editoriale.md)
- [Modèle de données](modele-donnees.md)
- [Politique éditoriale](politique-editoriale.md)
- [Fonctionnalités actuelles](fonctionnalites.md)
