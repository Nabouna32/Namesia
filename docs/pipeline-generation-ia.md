# Génération et import des fiches — Namesia

- **Statut :** procédure opérationnelle
- **Version :** 3.2
- **Mis à jour le :** 2026-11-27 01:34:00 (Europe/Paris)

## 1. Périmètre

La génération est effectuée en amont de l’application publique. Le workflow GitHub Actions « Générer une fiche avec Groq » est déclenché manuellement depuis main, pour un seul prénom par exécution. Il n’existe aucune route publique de génération et aucun traitement planifié ou massif.

Le modèle utilisé par défaut est `openai/gpt-oss-20b` via l’API Groq. Ce modèle est choisi parce qu’il prend en charge les sorties structurées strictes de Groq et figure parmi les modèles de production documentés. Le workflow doit rester sur le niveau gratuit ; aucune mise à niveau, aucun moyen de paiement ni aucune dépense ne sont autorisés sans arbitrage préalable du propriétaire. Si le modèle ou les quotas ne sont pas accessibles sur le niveau gratuit du compte, arrêter le processus plutôt que changer d’offre.

Références fournisseur : [Clés API Supabase](https://supabase.com/docs/guides/api/api-keys), [Rôles PostgreSQL Supabase](https://supabase.com/docs/guides/database/postgres/roles), [Structured Outputs](https://console.groq.com/docs/structured-outputs), [Models](https://console.groq.com/docs/models), [Rate Limits](https://console.groq.com/docs/rate-limits), [Billing FAQs](https://console.groq.com/docs/billing-faqs).

## 2. Séparation des contrats

Le modèle répond au schéma strict [fiche-prenom.groq.schema.json](../schemas/fiche-prenom.groq.schema.json). Les propriétés sont toutes requises ; les rubriques facultatives utilisent une chaîne vide lorsqu’elles ne peuvent pas être formulées avec une confiance raisonnable.

Le script normalise ensuite les chaînes vides en propriétés absentes et construit le contrat d’import Namesia 2.0.0 défini par [fiche-prenom.schema.json](../schemas/fiche-prenom.schema.json). Le parseur partagé parseFichePrenom vérifie les types, les propriétés autorisées, les longueurs, le slug, le genre et les associations avant toute écriture.

Le modèle ne produit ni identité technique, ni slug, ni version de schéma, ni statut, ni identifiant de base. Le script construit l’identité de façon déterministe depuis le prénom fourni. L’entrée doit être une graphie latine convertible en slug ASCII ; si ce n’est pas possible, le script s’arrête et demande une translittération explicite plutôt que d’en inventer une. Aucun champ source ou citation n’est demandé au modèle.

## 3. Étapes du pipeline

1. **Déclenchement :** un propriétaire ayant accès au dépôt lance le workflow sur main et saisit une graphie et un genre.
2. **Génération :** le script charge le prompt versionné et le schéma strict, appelle Groq et exige une réponse JSON complète.
3. **Normalisation :** les propriétés facultatives vides sont retirées ; les propriétés inconnues, réponses incomplètes, refus et JSON invalide sont rejetés.
4. **Validation :** le parseur Namesia valide le contrat d’import existant. Une sortie invalide ne peut jamais atteindre Supabase.
5. **Contrôle éditorial heuristique :** le script signale les URL, marqueurs de citation, références à des études sans source, statistiques, années précises et phrases répétées. Le compteur est conservé avec la provenance ; le détail des alertes accompagne l’artefact. Ces alertes ne bloquent pas le brouillon et ne constituent pas une vérification factuelle.
6. **Artefact :** le JSON d’import et un fichier JSON de métadonnées de génération (dont l’identifiant d’exécution GitHub) sont conservés comme artefacts GitHub Actions pendant sept jours. Ils ne contiennent aucun secret.
7. **Import facultatif :** par défaut, le workflow est en dry-run. Si l’option d’import est explicitement activée, la fiche est importée en brouillon dans Supabase.
8. **Publication :** elle reste une action humaine distincte dans l’administration. Le workflow n’a aucun chemin de publication.

L’appel Groq retente de façon limitée les erreurs réseau, 429 et 5xx ; l’import Supabase retente les erreurs réseau et 5xx. Une réponse JSON invalide ou un refus du modèle n’est jamais réessayé. Les secrets ne sont jamais écrits dans les logs ou l’artefact.

## 4. Provenance et idempotence

Pour chaque fiche effectivement importée par le pipeline, les métadonnées sont stockées dans la table relationnelle privée private.name_profile_generation_metadata :

- fournisseur et modèle effectivement retourné ;
- version et empreinte SHA-256 du prompt ;
- version du schéma de génération ;
- empreinte SHA-256 du contenu normalisé ;
- nombre d’alertes éditoriales heuristiques ;
- identifiant de requête Groq et identifiant stable d’exécution GitHub ;
- date de génération ;
- température et limite de sortie ;
- tokens d’entrée et de sortie lorsque fournis.

Aucune colonne JSON de métadonnées n’est ajoutée. La table est dans le schéma PostgreSQL privé, non exposé à la Data API, et accessible uniquement au rôle `service_role`, avec les droits `SELECT` et `INSERT` ; aucun droit direct n’est accordé à `anon` ou `authenticated`. Le nombre d’alertes éditoriales est conservé ; le détail des alertes est dans l’artefact temporaire. L’identifiant de requête Groq et l’identifiant stable de l’exécution GitHub rendent l’import idempotent. Une relance du même workflow retourne la version déjà créée si l’identité et l’empreinte du contenu correspondent ; si le contenu a changé, elle est rejetée au lieu de créer une seconde version. Une nouvelle génération volontaire doit partir d’un nouveau déclenchement manuel, donc d’un nouvel identifiant d’exécution.

L’import est transactionnel : prénom, version brouillon, associations et métadonnées sont créés ensemble ou pas du tout. Les imports administrateur habituels continuent de fonctionner sans métadonnées de génération.

## 5. Secrets et sécurité

- GROQ_API_KEY est un secret GitHub Actions.
- SUPABASE_SECRET_KEY (clé moderne `sb_secret_`) est nécessaire uniquement lorsque l’import est activé ; le script rejette les anciennes clés et l’envoie uniquement dans l’en-tête `apikey` de l’appel RPC. La passerelle Supabase la mappe vers le rôle SQL `service_role`.
- L’URL publique est extraite de `.env.example` sans exécuter ce fichier comme un script shell ; le script valide HTTPS et le domaine Supabase avant d’envoyer la clé.
- Aucun secret privilégié n’est exposé dans le navigateur, une route publique, le dépôt, le prompt ou les artefacts.
- Le workflow ne se déclenche pas sur les pull requests et son job est limité à main.
- La fonction SQL accepte les métadonnées uniquement lorsque current_user vaut service_role. Elle reste SECURITY INVOKER ; le rôle effectif est fourni par la passerelle Supabase, sans utiliser auth.role(). Un administrateur authentifié ne peut pas fabriquer de provenance.
- Le rôle service_role est privilégié : les secrets correspondants doivent être protégés et renouvelés en cas d’exposition.

L’activation opérationnelle attend l’ajout des secrets par le propriétaire dans les paramètres GitHub Actions. Ne jamais demander qu’un secret soit envoyé dans une issue, une PR ou une conversation.

## 6. Limites éditoriales

La génération ne réalise aucune recherche documentaire et ne constitue pas une vérification factuelle. Le prompt interdit l’invention de sources, citations, statistiques, dates, traditions et étymologies ; les champs incertains peuvent rester absents. Cette consigne réduit le risque mais ne garantit pas l’exactitude.

Toute fiche importée reste en brouillon. L’administrateur doit contrôler le contenu, les formulations prudentes, les variantes et les associations symboliques avant une éventuelle publication. Les règles complètes sont dans [politique-editoriale.md](politique-editoriale.md).

## 7. Évolutions non incluses

Pas de génération massive, de planification automatique, de publication automatique, de recherche documentaire, de citations générées, de stockage des prompts bruts, ni de dépense fournisseur sans arbitrage. Toute évolution doit répondre à un besoin réel, être documentée et respecter les arbitrages de [gouvernance.md](gouvernance.md).
