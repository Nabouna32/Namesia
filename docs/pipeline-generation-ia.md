# Production et import des fiches IA — Namesia

- **Statut :** procédure canonique de la V1
- **Version :** 1.1
- **Mis à jour :** 2026-11-22

## 1. Objectif

Permettre de produire une fiche avec un assistant IA (conversation) ou un outil externe (API), puis de l'intégrer dans Namesia sans modifier le code.

Namesia ne génère pas encore les contenus et ne vérifie pas indépendamment leur exactitude.

## 2. Production du JSON

Le modèle reçoit le prénom et les consignes éditoriales utiles. Il retourne uniquement un objet conforme à schemas/fiche-prenom.schema.json, version 2.0.0.

Le JSON contient :
- l'identité du prénom : slug, graphie affichée et genre ;
- une introduction ;
- des textes facultatifs sur l'origine, l'histoire et les usages ;
- zéro à douze associations symboliques contextualisées.

Le modèle ne fournit ni identifiant de base, ni numéro de version, ni statut, ni date de publication. Il ne décide jamais de publier.

## 3. Import dans l'administration

1. Se connecter à /admin avec un compte autorisé.
2. Charger le fichier JSON ou coller son contenu.
3. L'administration vérifie que le JSON est valide et respecte le contrat.
4. Le backend vérifie à nouveau les données et les limites de taille.
5. Une fonction SQL atomique crée ou met à jour l'identité du prénom et ajoute une version en brouillon.
6. L'administrateur peut prévisualiser la fiche sur le site et corriger le JSON en important une nouvelle version.

Un import ne modifie jamais la version publique existante.

## 4. Validation : ce qui est contrôlé et ce qui ne l'est pas

### Contrôles automatiques
- JSON strictement parseable ;
- version de schéma prise en charge ;
- propriétés inconnues refusées ;
- types, longueurs et formats contrôlés ;
- slug et genre conformes ;
- nombre et structure des associations symboliques contrôlés ;
- statut et version attribués côté serveur ;
- compte administrateur vérifié par Supabase Auth et RLS.

### Hors contrôle automatique
- exactitude de l'étymologie ;
- exactitude historique ;
- existence ou pertinence d'une tradition ;
- absence d'hallucination ;
- originalité éditoriale ;
- qualité SEO ou valeur informative réelle.

Un JSON valide n'est pas un contenu vérifié. La prévisualisation est une revue éditoriale personnelle, pas une validation scientifique.

## 5. Publication

La publication est une action distincte réservée à un administrateur. Elle archive l'ancienne version et publie la version choisie dans une transaction SQL.

Le contenu fourni par le modèle ne peut pas contourner cette étape. Les visiteurs ne peuvent lire que les versions publiées.

## 6. Évolutions non implémentées

- Génération directement depuis l'administration.
- Historique des modèles, prompts, coûts et tokens.
- Import par lots.
- Contrôle anti-doublon sémantique.
- Références et vérification documentaire.
- Statistiques sourcées.

Ne pas ajouter ces mécanismes avant d'avoir un usage concret et une méthode fiable.
