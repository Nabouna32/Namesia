# Portabilité et réversibilité — Namesia

- **Statut :** référence canonique
- **Version :** 1.2
- **Mis à jour le :** 2026-11-27 01:42:00 (Europe/Paris)

## Objectif

Préserver la maîtrise des données et la capacité raisonnable de changer de fournisseur, sans imposer une neutralité technique absolue ni des abstractions multi-fournisseurs prématurées. La portabilité est évaluée selon la valeur des données, le coût de sortie, les dépendances réelles et le stade du produit.

## Principes

- Les données éditoriales qui constituent le patrimoine de Namesia doivent pouvoir être exportées dans un format documenté, ouvert et réutilisable.
- Les identifiants stables, slugs, versions, statuts éditoriaux, dates réelles et relations entre fiches doivent être conservés lors d’un export/import.
- Le JSON est un format d’échange, pas une raison de stocker tout le modèle dans une colonne JSON. Les champs métier restent relationnels.
- Une dépendance fournisseur est acceptable si elle apporte un bénéfice clair en qualité, simplicité, coût ou fiabilité et si ses conséquences de sortie sont comprises.
- Ne pas créer d’adaptateur, d’abstraction ou de couche de compatibilité sans besoin démontré.
- Les secrets, clés API, mots de passe, sessions et données d’administration ne font jamais partie d’un export éditorial générique.
- Les données personnelles et retours visiteurs sont exportés séparément, avec des droits et protections adaptés.

## Format d’échange cible

Lorsqu’un export éditorial reproductible sera implémenté, privilégier un paquet versionné comprenant :

- un manifeste décrivant la version du format, la date d’export, le nombre d’enregistrements et les versions de schéma ;
- les identités de prénoms ;
- les versions de fiches et leurs champs éditoriaux ;
- les associations symboliques dans une collection séparée liée par identifiant de version ;
- les métadonnées de provenance disponibles, dans un fichier distinct et uniquement lorsqu’elles existent.

Le format doit être validable par schéma et réimportable sans perte des relations. Les champs inconnus, versions non prises en charge, doublons et références orphelines doivent être signalés explicitement. L’export ne doit jamais fabriquer de date, de source ou de métadonnée absente.

Ce format est une cible de conception, pas une fonctionnalité actuellement disponible sur main. Aucun export automatique ou outil de restauration n’est revendiqué tant qu’il n’a pas été implémenté et vérifié.

## Dépendances et stratégie de sortie

| Domaine | Dépendance actuelle | Éléments à préserver lors d’une sortie |
|---|---|---|
| Base et authentification | Supabase / PostgreSQL / Auth | schéma, données, identifiants, contraintes, RLS, rôles, fonctions RPC, comptes et processus d’authentification |
| Hébergement | Cloudflare Workers / OpenNext | routes, runtime, variables d’environnement, cache, domaines, DNS et comportements SSR |
| Génération IA | Workflow GitHub Actions manuel via Groq | prompt et schéma versionnés, contrat d’import, empreintes de prompt/contenu, identifiants de requête et d’exécution, provenance, compteur d’alertes éditoriales et artefacts temporaires ; secrets à reconfigurer chez tout nouveau fournisseur |
| CI/CD | GitHub Actions | workflows, secrets à reconfigurer, permissions, environnements et règles de déclenchement |
| Mesure | Outil d’analytics éventuel | définition des événements, consentement, conservation et capacité d’export des mesures utiles |

Le schéma PostgreSQL et les formats JSON versionnés facilitent les migrations, mais ne suffisent pas à eux seuls : les policies, privilèges, fonctions, extensions, index, tâches planifiées, fichiers, DNS et secrets doivent aussi être inventoriés.

## Procédure de migration

Avant un changement de fournisseur ou une refonte de stockage :

1. Inventorier les données, relations, volumes, extensions, fonctions, policies, privilèges, index, fichiers et traitements réellement utilisés.
2. Produire un export cohérent et vérifier son intégrité, ses comptes et ses références.
3. Préparer le schéma cible et les conversions nécessaires sans supprimer la source.
4. Restaurer l’export dans un environnement cible et vérifier les identifiants, versions, relations, statuts publiés, accès et parcours applicatifs.
5. Comparer les résultats et mesurer les écarts ; corriger avant la bascule.
6. Préparer la bascule, la reconfiguration des secrets, domaines, DNS et workflows, ainsi qu’un retour arrière réaliste.
7. Ne supprimer l’ancien fournisseur et les données sources qu’après validation de la migration et de la période de retour arrière adaptée.

La procédure est proportionnée : les exemples recréables du pré-lancement ne nécessitent pas un dispositif industriel. Les contenus éditoriaux validés et les données réelles de visiteurs justifieront des exports, sauvegardes et tests de restauration renforcés.

## État actuel

- Le modèle métier est relationnel dans PostgreSQL : identités, versions éditoriales et associations symboliques sont séparées.
- Le contrat JSON d’import est versionné ; il ne constitue pas encore un paquet complet d’export de base.
- Aucun export éditorial global, outil de migration inter-fournisseurs ou test de restauration complet n’est actuellement disponible sur main.
- Les dépendances Supabase, Cloudflare et GitHub Actions sont connues ; leurs mécanismes spécifiques doivent être pris en compte dans une migration réelle.
- Le niveau de précaution évoluera avec la valeur des données et l’ouverture publique de Namesia.

## Références

- [Architecture](architecture.md)
- [Modèle de données](modele-donnees.md)
- [Gouvernance](gouvernance.md)
- [Gouvernance éditoriale](qualite-editoriale.md)
- [État du projet](etat-du-projet.md)
