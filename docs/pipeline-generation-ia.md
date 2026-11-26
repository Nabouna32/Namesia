# Génération et import des fiches — Namesia

- **Statut :** procédure opérationnelle
- **Version :** 3.0
- **Mis à jour le :** 2026-11-26 20:41:00 (Europe/Paris)

## 1. Périmètre

La génération est effectuée en amont de l’application publique. Le workflow GitHub Actions « Générer une fiche avec Groq » est déclenché manuellement depuis main, pour un seul prénom par exécution. Il n’existe aucune route publique de génération et aucun traitement planifié ou massif.

Le modèle utilisé par défaut est openai/gpt-oss-20b via l’API Groq. Ce modèle est choisi parce qu’il prend en charge les sorties structurées strictes de Groq. Le workflow doit rester sur le niveau gratuit ; aucune mise à niveau, aucun moyen de paiement ni aucune dépense ne sont autorisés sans arbitrage préalable du propriétaire.

Références fournisseur : [Structured Outputs](https://console.groq.com/docs/structured-outputs), [Models](https://console.groq.com/docs/models), [Rate Limits](https://console.groq.com/docs/rate-limits).

## 2. Séparation des contrats

Le modèle répond au schéma strict [fiche-prenom.groq.schema.json](../schemas/fiche-prenom.groq.schema.json). Les propriétés sont toutes requises ; les rubriques facultatives utilisent null lorsqu’elles ne peuvent pas être formulées avec une confiance raisonnable.

Le script normalise ensuite les valeurs null en propriétés absentes et construit le contrat d’import Namesia 2.0.0 défini par [fiche-prenom.schema.json](../schemas/fiche-prenom.schema.json). Le parseur partagé parseFichePrenom vérifie les types, les propriétés autorisées, les longueurs, le slug, le genre et les associations avant toute écriture.

Le modèle ne produit ni identité technique, ni slug, ni version de schéma, ni statut, ni identifiant de base. Le script construit l’identité de façon déterministe depuis le prénom fourni. Aucun champ source ou citation n’est demandé au modèle.

## 3. Étapes du pipeline

1. **Déclenchement :** un propriétaire ayant accès au dépôt lance le workflow sur main et saisit une graphie et un genre.
2. **Génération :** le script charge le prompt versionné et le schéma strict, appelle Groq et exige une réponse JSON complète.
3. **Normalisation :** les champs facultatifs null sont retirés ; les propriétés inconnues, réponses incomplètes, refus et JSON invalide sont rejetés.
4. **Validation :** le parseur Namesia valide le contrat d’import existant. Une sortie invalide ne peut jamais atteindre Supabase.
5. **Artefact :** un JSON contrôlé est conservé comme artefact GitHub Actions pendant sept jours.
6. **Import facultatif :** par défaut, le workflow est en dry-run. Si l’option d’import est explicitement activée, la fiche est importée en brouillon dans Supabase.
7. **Publication :** elle reste une action humaine distincte dans l’administration. Le workflow n’a aucun chemin de publication.

Le script applique des tentatives limitées aux erreurs réseau, 429 et 5xx. Il ne réessaie pas une réponse invalide ou un refus du modèle. Les secrets ne sont jamais écrits dans les logs ou l’artefact.

## 4. Provenance et idempotence

Pour chaque fiche effectivement importée par le pipeline, les métadonnées sont stockées dans la table relationnelle privée private.name_profile_generation_metadata :

- fournisseur et modèle effectivement retourné ;
- version et empreinte SHA-256 du prompt ;
- version du schéma de génération ;
- identifiant de requête Groq ;
- date de génération ;
- température et limite de sortie ;
- tokens d’entrée et de sortie lorsque fournis.

Aucune colonne JSON de métadonnées n’est ajoutée. La table est dans le schéma PostgreSQL privé, non exposé à la Data API, et accessible en écriture/lecture uniquement au rôle service_role. L’identifiant de requête unique rend l’import idempotent : un nouvel essai réseau pour la même réponse retourne la version déjà créée.

L’import est transactionnel : prénom, version brouillon, associations et métadonnées sont créés ensemble ou pas du tout. Les imports administrateur habituels continuent de fonctionner sans métadonnées de génération.

## 5. Secrets et sécurité

- GROQ_API_KEY est un secret GitHub Actions.
- SUPABASE_SERVICE_ROLE_KEY est nécessaire uniquement lorsque l’import est activé ; il reste limité à l’étape du workflow qui effectue l’appel RPC.
- L’URL Supabase est publique et lue depuis .env.example.
- Aucun secret privilégié n’est exposé dans le navigateur, une route publique, le dépôt, le prompt ou les artefacts.
- Le workflow ne se déclenche pas sur les pull requests et son job est limité à main.
- La fonction SQL accepte les métadonnées uniquement lorsque auth.role() vaut service_role. Un administrateur authentifié ne peut pas fabriquer de provenance.
- Le rôle service_role est privilégié : les secrets correspondants doivent être protégés et renouvelés en cas d’exposition.

L’activation opérationnelle attend l’ajout des secrets par le propriétaire dans les paramètres GitHub Actions. Ne jamais demander qu’un secret soit envoyé dans une issue, une PR ou une conversation.

## 6. Limites éditoriales

La génération ne réalise aucune recherche documentaire et ne constitue pas une vérification factuelle. Le prompt interdit l’invention de sources, citations, statistiques, dates, traditions et étymologies ; les champs incertains peuvent rester absents. Cette consigne réduit le risque mais ne garantit pas l’exactitude.

Toute fiche importée reste en brouillon. L’administrateur doit contrôler le contenu, les formulations prudentes, les variantes et les associations symboliques avant une éventuelle publication. Les règles complètes sont dans [politique-editoriale.md](politique-editoriale.md).

## 7. Évolutions non incluses

Pas de génération massive, de planification automatique, de publication automatique, de recherche documentaire, de citations générées, de stockage des prompts bruts, ni de coût fournisseur. Toute évolution doit répondre à un besoin réel, être documentée et respecter les arbitrages de [gouvernance.md](gouvernance.md).
