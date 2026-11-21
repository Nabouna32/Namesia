# Génération et import des fiches — Namesia

- **Statut :** procédure cible de la V1
- **Version :** 2.1
- **Mis à jour :** 2026-11-22

## 1. Périmètre réel

Namesia ne génère pas actuellement les fiches dans son application. Le contenu est produit en amont :
- par une API de modèle IA ;
- ou dans une conversation avec un assistant.

Le résultat est ensuite fourni à Namesia au format JSON. L'application assure la validation structurelle, la prévisualisation, l'enregistrement en brouillon et la publication explicite.

La génération par IA n'est pas une vérification documentaire. La validation technique du JSON ne confirme pas l'exactitude des étymologies, dates, traditions ou usages.

## 2. Contrat de sortie

Le fichier doit respecter exactement [schemas/fiche-prenom.schema.json](../schemas/fiche-prenom.schema.json).

Règles :
- JSON strict, sans commentaire ni texte avant/après ;
- schema_version doit correspondre à une version prise en charge ;
- identity contient le slug, le nom affiché et le genre ;
- content contient l'introduction et les rubriques disponibles ;
- aucune propriété inconnue ;
- aucun statut de publication, date interne, identifiant de base ou rôle administrateur ;
- ne pas inventer de contenu pour remplir les rubriques facultatives ;
- ne pas inventer de sources, références ou statuts de preuve.

## 3. Import dans Namesia

1. Se connecter à /admin avec un compte autorisé.
2. Sélectionner un fichier JSON ou coller son contenu.
3. Prévisualiser le document et contrôler les textes et associations.
4. Corriger le JSON en amont si nécessaire.
5. Importer : l'API valide de nouveau le contrat côté serveur.
6. La base crée une nouvelle version en brouillon.
7. Après relecture de la prévisualisation, publier explicitement.

L'import ne remplace jamais directement la version publiée. La page d'administration liste les fiches et leurs versions, ce qui permet de retrouver un brouillon après reconnexion, de le prévisualiser et de le publier.

## 4. Contrôles effectués par l'application

Les contrôles automatiques portent sur :
- la syntaxe JSON ;
- la version du schéma ;
- les propriétés autorisées ;
- les types et longueurs des champs ;
- le format du slug ;
- les valeurs autorisées du genre ;
- la taille maximale de l'import ;
- l'autorisation administrateur ;
- l'unicité et la numérotation des versions ;
- les transitions de publication.

Ces contrôles sont des contrôles de structure et de cohérence applicative. Ils ne constituent pas un contrôle factuel.

## 5. Publication

- La publication est une action humaine explicite.
- Le backend vérifie le compte administrateur.
- La fonction SQL n'accepte qu'une version existante en brouillon.
- L'ancienne version publiée est archivée dans la même transaction.
- Une seule version est publique par prénom.
- Les dates et statuts sont définis par Namesia, jamais par le JSON.

## 6. Sécurité

- La page d'administration n'est pas une frontière de sécurité.
- Chaque route administrative vérifie le jeton Supabase et l'autorisation présente dans private.admin_users, dans le schéma PostgreSQL privé.
- Les fonctions SQL vérifient également le rôle administrateur.
- Aucune clé privilégiée Supabase n'est envoyée au navigateur.
- L'auto-inscription publique n'est pas nécessaire : seuls les comptes Auth préalablement autorisés peuvent administrer le catalogue.
- Les tables internes ne doivent pas être exposées à anon.
- Les réponses contenant les brouillons et l'historique sont privées et non mises en cache.

## 7. Limites et évolutions

Ne pas ajouter de pipeline de génération, de journal de tokens, de coût fournisseur, de stockage de prompts ou de gestion de sources tant que Namesia n'exécute pas réellement ces opérations et qu'un besoin concret n'existe pas.

Si une génération automatisée est intégrée plus tard, elle devra produire le même contrat JSON et rester séparée de l'import et de la publication.
