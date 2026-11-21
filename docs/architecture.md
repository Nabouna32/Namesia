# Architecture — Namesia

- **Statut :** architecture cible de la V1
- **Version :** 1.1
- **Mis à jour :** 2026-11-22

## 1. Décision directrice

Namesia est un monolithe Next.js avec Supabase. Le contenu est généré en dehors du site, sous forme de JSON, puis importé dans une administration privée. L'application ne génère pas encore de contenu IA et ne réalise pas de recherche documentaire.

Le JSON est le contrat d'échange et de validation. PostgreSQL conserve les identités et les versions de fiches ; le contenu éditorial d'une version est stocké dans un champ JSONB. Ce compromis évite une table par rubrique sans transformer l'identité du prénom et le cycle de publication en données non structurées.

## 2. Flux fonctionnel

1. Génération IA hors du site.
2. Production d'un JSON conforme au contrat Namesia.
3. Connexion à l'administration privée.
4. Validation structurelle du JSON.
5. Création d'une nouvelle version en brouillon.
6. Prévisualisation et correction.
7. Publication explicite par l'administrateur.
8. Lecture publique de la version publiée.

La validation automatique porte sur le format, les types, les longueurs, les champs autorisés et quelques contraintes métier. Elle ne valide pas les faits ni les étymologies.

## 3. Composants

### Site public
- Pages serveur Next.js.
- Catalogue et fiches chargés depuis les versions publiées.
- Aucun appel au modèle IA lors de l'affichage.
- Aucun droit d'écriture public.

### Administration
- Page privée /admin.
- Connexion par lien e-mail via Supabase Auth.
- Autorisation fondée sur une liste explicite d'identifiants dans la table admin_users.
- Import d'un fichier ou texte JSON.
- Validation stricte avant écriture.
- Import toujours en brouillon.
- Publication par une action séparée.
- API serveur vérifiant le jeton Supabase et l'appartenance à admin_users.
- Les opérations SQL sont exécutées avec le jeton de l'utilisateur ; aucune clé privilégiée n'est exposée à l'application.

### Données
- names : identité, slug et genre.
- name_profiles : versions, statut, dates et contenu JSONB.
- admin_users : identifiants autorisés à administrer le catalogue.
- Les tables documentaires historiques sont en cours de retrait après migration des contenus utiles.

## 4. Modèle de publication

- brouillon : importé, non visible publiquement.
- publie : version visible.
- archive : ancienne version remplacée ou retirée.

Le backend attribue le numéro de version et le statut. Un import ne publie jamais. La publication archive l'ancienne version et active la nouvelle dans une transaction SQL.

Une version publiée n'est jamais écrasée. Une correction passe par une nouvelle version.

## 5. Sécurité

- RLS activé sur toutes les tables du schéma public.
- Lecture anonyme limitée aux versions publiées.
- Administration réservée aux identifiants présents dans admin_users.
- Aucun droit d'écriture au rôle anon.
- Les fonctions RPC sont en SECURITY INVOKER, pas en SECURITY DEFINER.
- Les clés privilégiées Supabase ne sont pas utilisées par le site.
- Les droits SQL doivent être accordés explicitement : les nouvelles tables ne sont pas nécessairement exposées automatiquement par la Data API.
- Le jeton de session Supabase est conservé par le client Auth dans le navigateur ; protéger l'administration contre les injections et ne jamais y rendre de HTML non fiable.

## 6. Choix écartés

- Une table par rubrique : trop de relations et de jointures pour un contenu essentiellement éditorial.
- Tout stocker dans une seule table JSON : identité, unicité, versions et publication doivent rester relationnelles.
- Un CMS tiers : coût et intégration disproportionnés pour un administrateur unique et un import JSON.
- Génération IA dans le site : non nécessaire tant que la production se fait par conversation ou outil externe.
- Sources, claims et workflow de preuve : ne reflètent pas le processus réellement appliqué.

## 7. Limites et évolutions conditionnelles

- Le contrat JSON est versionné ; toute évolution incompatible nécessite une nouvelle version et une migration explicite.
- Les statistiques ne seront ajoutées que lorsqu'une source et une méthode de mise à jour seront réellement disponibles.
- Le multilingue nécessitera une décision dédiée sur les identités, variantes et profils localisés.
- Une génération automatisée pourra être ajoutée sans changer le flux de publication : elle devra produire le même JSON candidat.

## 8. État de l'implémentation

Le modèle JSON versionné, l'import administrateur et la publication explicite sont en cours d'intégration dans la PR #5. La migration initiale crée name_profiles et copie les six fiches existantes. Les anciennes tables sont conservées temporairement pour permettre une vérification avant suppression définitive.

La connexion par e-mail nécessite de configurer les URL de redirection Supabase Auth et d'ajouter manuellement le premier utilisateur à admin_users. Cette étape est documentée dans le README.
