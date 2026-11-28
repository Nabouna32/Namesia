# ADR-0032 — Références Material 3 immuables et versionnées

- **Statut :** active
- **Décision prise le :** 2026-11-24 (heure non consignée)
- **Version :** 1.0
- **Mis à jour le :** 2026-11-28 06:05:17 (Europe/Paris)

## Contexte

Le contrat de design citait plusieurs fichiers depuis des branches `main` : Material Color Utilities, Material Web et Angular Material. Ces URLs changent avec le dépôt et ne prouvent pas quelle version a réellement servi à prendre une décision. Une source officielle mais mouvante ne suffit pas à justifier une conformité précise.

## Challenge

- **Ne citer que les pages de spécification :** elles sont normatives, mais ne suffisent pas toujours à vérifier les détails d'implémentation et les valeurs concrètes des tokens.
- **Citer les branches principales :** pratique pour découvrir les fichiers, mais non reproductible ; leur contenu peut changer sans modification du dépôt Namesia.
- **Citer des versions publiées et des commits immuables :** permet de retrouver exactement le code utilisé, de distinguer les références normatives des implémentations secondaires et de refaire l'audit lors d'une mise à jour.

## Décision

Les spécifications officielles Material 3 restent la référence normative. Les implémentations ne sont que des preuves complémentaires et doivent être épinglées sur des versions publiées et des commits immuables :

- AndroidX Compose Material 3 1.5.0 stable : commit `919e948eaa351c590e7e6fc89d4014fad7a6e78c`.
- Material Color Utilities 0.4.0, version installée par Namesia : commit `b03ef34bb53a15c3ba41bf963eb3e2c5c353c85f`.
- Material Web 2.5.0, utilisé uniquement pour recouper la convention des tokens CSS : commit `b4de401eb665ec63474f39319a4ba8f2145974cc`.
- Angular Material 22.3.0, utilisé comme référence secondaire pour les tokens M3 de mouvement, d'état, d'élévation et de forme : commit `5c7b286a7684599f275a0f7b4b77752ae751b6bd`, fichiers déclarant Material Design system v0.161.

Les versions, commits, fichiers concernés et limites d'interprétation sont centralisés dans [Vérification Material 3](../MATERIAL-3-VERIFICATION.md). Aucun lien vers `main` ou `androidx-main` ne doit servir de preuve de conformité dans ce contrat.

## Conséquences

Les décisions de design deviennent reproductibles : un token peut être retrouvé dans le même état source que celui examiné. Les mises à jour de bibliothèques ne modifient pas silencieusement les preuves utilisées par Namesia. Angular Material et Material Web restent des références secondaires, jamais des autorités supérieures à la spécification Material 3.

Le coût est une revue explicite lors d'une mise à jour de version ; c'est intentionnel pour éviter les dérives de fidélité non détectées.

## Vérification

La CI vérifie que les commits de référence figurent dans le document canonique et qu'aucun lien GitHub de fichier ou d'arbre ne pointe vers la branche mouvante `main` ou `androidx-main`. Une mise à jour de source doit modifier simultanément le document, les assertions de contrat et, si le choix de référence change, cet ADR.
