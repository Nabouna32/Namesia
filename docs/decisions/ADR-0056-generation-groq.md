# ADR-0056 — Génération contrôlée des fiches via Groq

- **Statut :** acceptée, implémentée ; activation opérationnelle en attente des secrets GitHub
- **Date :** 2026-11-27
- **Décideur :** propriétaire de Namesia
- **Périmètre :** génération de contenu, import Supabase, provenance et sécurité

## Contexte

Le contenu des fiches est généré en amont et importé dans Supabase via un contrat JSON. Le propriétaire a explicitement autorisé l’intégration d’une API Groq, à condition de conserver la validation, la traçabilité, le contrôle éditorial et l’absence de publication automatique. Les décisions de gouvernance des données et de fiabilité éditoriale imposent également de pouvoir relier une version importée à son modèle et à son prompt.

L’application publique ne doit pas recevoir de clé Groq ou de clé Supabase privilégiée. Le produit est encore en pré-lancement ; la génération massive et l’automatisation permanente seraient prématurées.

## Décision

1. Utiliser un workflow GitHub Actions déclenché manuellement depuis main, pour un seul prénom par exécution.
2. Appeler Groq avec `openai/gpt-oss-20b` et Structured Outputs en mode strict ; le modèle est listé parmi les modèles de production et les modèles compatibles avec le mode strict. Le schéma de génération est distinct du contrat d’import Namesia.
3. Garder le prompt versionné dans le dépôt. Toute modification substantielle du prompt incrémente sa version.
4. Normaliser les chaînes vides des champs facultatifs, construire l’identité et le slug côté script, puis valider la fiche avec le parseur Namesia avant toute écriture.
5. Le dry-run est le comportement par défaut. L’import explicite crée uniquement un brouillon. La publication reste une action humaine distincte.
6. Les métadonnées techniques sont stockées dans private.name_profile_generation_metadata, table relationnelle privée : fournisseur, modèle, version et empreinte du prompt, empreinte du contenu normalisé, version du schéma de génération, identifiants de requête et d’exécution GitHub, nombre d’alertes éditoriales heuristiques, date, paramètres et usage en tokens.
7. Un contrôle heuristique non bloquant signale les URL, citations, références à des études, statistiques, années précises et phrases répétées. Le nombre d’alertes est persisté ; leur détail reste dans l’artefact temporaire. Il ne s’agit pas d’une vérification factuelle.

L’identifiant de requête Groq et l’identifiant stable du workflow GitHub servent de clés d’idempotence. Une relance du même workflow ne retourne la fiche existante que si l’identité et l’empreinte du contenu correspondent ; une sortie différente est rejetée plutôt que d’ajouter une seconde version. Une nouvelle génération volontaire nécessite un nouveau déclenchement manuel.
8. La fonction SQL d’import conserve le parcours administrateur authentifié et autorise le rôle service_role uniquement avec des métadonnées Groq complètes. La clé secrète Supabase moderne `sb_secret_` est utilisée uniquement dans l’en-tête `apikey` de l’étape GitHub Actions d’import ; la passerelle mappe cette clé vers le rôle SQL `service_role`.
9. Les clés GROQ_API_KEY et SUPABASE_SECRET_KEY (clé moderne sb_secret_) sont des secrets GitHub Actions ; la clé Supabase est transmise uniquement dans l’en-tête apikey, puis la passerelle la mappe vers service_role. Elles ne sont jamais stockées dans le dépôt, les artefacts ou le navigateur.
10. Rester sur le niveau gratuit Groq. Si le modèle ou les quotas ne sont pas disponibles sur ce niveau, arrêter le processus. Aucun moyen de paiement, passage au plan Developer, service payant ou dépense sans arbitrage préalable.

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
- Le workflow est manuel, séquentiel, limité à main et conserve pendant sept jours le JSON d’import ainsi qu’un fichier de métadonnées de génération, sans secret.

## Références

- [Génération et import des fiches](../pipeline-generation-ia.md)
- [Portabilité et réversibilité](../portabilite-et-reversibilite.md)
- [Politique éditoriale](../politique-editoriale.md)
- [Modèle de données](../modele-donnees.md)
- [Clés API Supabase](https://supabase.com/docs/guides/api/api-keys)
- [Rôles PostgreSQL Supabase](https://supabase.com/docs/guides/database/postgres/roles)
- [Documentation Groq — Structured Outputs](https://console.groq.com/docs/structured-outputs)
- [Documentation Groq — modèles]
- [Documentation Groq — facturation](https://console.groq.com/docs/models)
