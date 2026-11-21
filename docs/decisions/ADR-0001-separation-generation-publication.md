# ADR-0001 — Séparer génération IA et publication éditoriale

- **Statut :** accepté
- **Date :** 2026-11-21
- **Décideurs :** équipe Namesia

## Contexte

Namesia produira des fiches de prénoms à l'aide d'un modèle IA. Ces fiches contiendront des informations factuelles et des interprétations symboliques. Une génération peut contenir des erreurs, des références inventées, des contradictions ou des formulations trompeuses.

La publication directe d'une sortie de modèle exposerait le site à des risques éditoriaux, juridiques et SEO.

## Décision

La génération produit uniquement une version candidate. La publication est une action distincte, conditionnée par :
1. la validation syntaxique et structurelle contre une version du schéma ;
2. les contrôles métier et de cohérence ;
3. la vérification des références factuelles ;
4. une revue éditoriale humaine ;
5. une action explicite de publication.

Les versions sont immuables. Toute correction après publication crée une nouvelle version.

## Conséquences positives

- Traçabilité des générations et des décisions.
- Possibilité de changer de fournisseur IA.
- Réduction du risque de publier des hallucinations.
- Historique éditorial et retour arrière possibles.
- Séparation claire entre brouillon et contenu public.

## Coûts et limites

- Un workflow de revue doit être construit.
- La mise à jour du catalogue est moins instantanée.
- Il faut gérer les versions, les statuts et les migrations de schéma.

## Garde-fous

Aucun statut fourni par le modèle ne peut autoriser une publication. Le backend est seul responsable des transitions d'état.
