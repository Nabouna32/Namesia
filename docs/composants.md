# Bibliothèque de composants — Namesia

- **Statut :** inventaire des composants partagés réellement disponibles
- **Mis à jour :** 2026-11-23

Ce document est le point d'entrée pour les composants d'interface réutilisables. Il distingue les primitives de présentation des composants métier. Il ne constitue pas une obligation de conserver un composant : chaque élément reste soumis au challenge produit et technique.

## Principes

- Une primitive partagée porte une interaction ou un contrat visuel commun, pas seulement un nom générique.
- Les variantes sont explicites et reposent sur les rôles Material 3 Fidelity.
- Une couleur ne doit jamais être attribuée selon la position d'un élément dans une liste. Rainbow est réservé à une catégorie éditoriale identifiée.
- Les CSS Modules des composants métier gèrent leur disposition ; les primitives partagées gèrent leur apparence et leurs états communs.
- Préférer les éléments HTML natifs et les liens Next.js. Garder distincts les contrôles interactifs et les liens de navigation.
- Une primitive est extraite après identification d'au moins deux usages concrets ; elle ne doit pas absorber la logique métier des écrans.

## Primitives partagées

| Composant | Emplacement | Responsabilité |
|---|---|---|
| `Bouton` | `components/ui/bouton.tsx` | Action native avec variantes filled, tonal, outlined et text ; tailles standard et icône |
| `LienBouton` | `components/ui/lien-bouton.tsx` | Navigation Next.js présentée comme une action, sous forme de composant serveur |
| `ChampRecherche` | `components/ui/champ-recherche.tsx` | Champ de recherche contrôlé, libellé accessible, icône, effacement et états Material partagés |

Les contrôles partagés reposent sur les tokens Fidelity et conservent les éléments natifs. Les composants métier gardent leurs règles de recherche, de synchronisation d'URL et de sélection.

## Composants métier

Les composants comme `BoutonFavori`, `NavigationAdaptative`, `RecherchePrenoms` et `ComparateurPrenoms` restent propriétaires de leur logique métier. Ils doivent composer les primitives partagées au lieu de redéfinir les styles d'un contrôle générique.

## Ajouter ou faire évoluer un composant

Avant de créer une primitive, vérifier qu'au moins deux usages réels partagent le même comportement. Définir les variantes et états nécessaires, puis migrer les usages concernés. Éviter les composants fourre-tout et les abstractions basées uniquement sur des classes CSS. Supprimer les anciens styles devenus inutiles, mettre à jour cet inventaire et ajouter des contrats CI lorsque le comportement partagé change.
