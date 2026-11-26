# ADR-0056 — Génération contrôlée des fiches via Groq

- **Statut :** acceptée, implémentation en cours
- **Date :** 2026-11-26
- **Décideur :** propriétaire de Namesia
- **Périmètre :** génération de contenu, import Supabase, provenance et sécurité

## Contexte

Le contenu des fiches est généré en amont et importé dans Supabase via un contrat JSON. Le propriétaire a explicitement autorisé l’intégration d’une API Groq, à condition de conserver la validation, la traçabilité, le contrôle éditorial et l’absence de publication automatique. Les décisions de gouvernance des données et de fiabilité éditoriale imposent également de pouvoir relier une version importée à son modèle et à son prompt.

L’application publique ne doit pas recevoir de clé Groq ou de clé Supabase privilégiée. Le produit est encore en pré-lancement ; la génération massive et l’automatisation permanente seraient prématurées.

## Décision

1. Utiliser un workflow GitHub Actions déclenché manuellement depuis main, pour un seul prénom par exécution.
2. Appeler Groq avec openai/gpt-oss-20b et Structured Outputs en mode strict ; le schéma de génération est distinct du contrat d’import Namesia.
3. Garder le prompt versionné dans le dépôt. Toute modification substantielle du prompt incrémente sa version.
4. Normaliser les chaînes vides des champs facultatifs, construire l’identité et le slug côté script, puis valider la fiche avec le parseur Namesia avant toute écriture.
5. Le dry-run est le comportement par défaut. L’import explicite crée uniquement un brouillon. La publication reste une action humaine distincte.
6. Les métadonnées techniques sont stockées dans private.name_profile_generation_metadata, table relationnelle privée : fournisseur, modèle, version et empreinte du prompt, version du schéma de génération, identifiant de requête, date, paramètres et usage en tokens.
7. L’identifiant de requête Groq est unique et sert de clé d’idempotence pour les reprises réseau.
8. La fonction SQL d’import conserve le parcours administrateur authentifié et autorise le rôle service_role uniquement avec des métadonnées Groq complètes. Le secret service_role est utilisé exclusivement dans l’étape GitHub Actions d’import.
9. Les clés GROQ_API_KEY et SUPABASE_SECRET_KEY sont des secrets GitHub Actions ; elles ne sont jamais stockées dans le dépôt, les artefacts ou le navigateur.
10. Rester sur le niveau gratuit Groq. Aucun moyen de paiement, passage au plan Developer, service payant ou dépense sans arbitrage préalable.

## Alternatives écartées

- **Route de génération dans l’application publique :** rejetée, car elle élargirait la surface d’attaque et placerait l’usage de l’API dans le runtime du site.
- **Génération à chaque visite ou à la demande d’un visiteur :** rejetée, car elle rendrait les coûts, la latence et la qualité imprévisibles.
- **Génération planifiée ou massive :** rejetée à ce stade, sans besoin réel ni corpus de vérification.
- **Publication automatique :** rejetée ; une conformité JSON n’est pas une validation factuelle ou éditoriale.
- **Stockage de la réponse complète et des métadonnées dans une colonne JSON :** rejeté au profit des colonnes métier et d’une table relationnelle privée.
- **Forcer glob/minimatch ou ajouter des overrides :** hors sujet et non nécessaire ; la version Groq choisie prend en charge le schéma strict.

## Conséquences

- La génération peut être testée en dry-run avant l’ajout des secrets d’import.
- L’activation opérationnelle nécessite que le propriétaire ajoute les deux secrets dans les paramètres GitHub Actions ; l’issue [#354](https://github.com/Nabouna32/Namesia/issues/354) décrit cette action.
- Les fiches importées restent en brouillon et doivent être contrôlées dans l’administration.
- Les sorties incertaines peuvent laisser origin, history ou usage absents. Le prompt interdit d’inventer sources, citations, statistiques ou étymologies.
- La génération ne réalise pas de recherche documentaire ; le modèle n’est pas une source et sa sortie ne prouve pas l’exactitude.
- Les tentatives échouées et les coûts monétaires ne sont pas persistés ; les tokens consommés sont conservés lorsqu’ils sont retournés par Groq.
- Le workflow est manuel, séquentiel, limité à main et conserve l’artefact JSON pendant sept jours.

## Références

- [Génération et import des fiches](../pipeline-generation-ia.md)
- [Politique éditoriale](../politique-editoriale.md)
- [Modèle de données](../modele-donnees.md)
- [Documentation Groq — Structured Outputs](https://console.groq.com/docs/structured-outputs)
- [Documentation Groq — modèles](https://console.groq.com/docs/models)
