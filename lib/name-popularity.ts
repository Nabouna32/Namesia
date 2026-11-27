export type NamePopularity2025 = {
  slug: string;
  name: string;
  gender: "Féminin" | "Masculin";
  rank: number;
  births: number;
};

export const NAME_POPULARITY_2025_SOURCE_URL = "https://www.insee.fr/fr/statistiques/9040114";

export const NAME_POPULARITY_2025: readonly NamePopularity2025[] = [
  { slug: "louise", name: "Louise", gender: "Féminin", rank: 1, births: 3070 },
  { slug: "jade", name: "Jade", gender: "Féminin", rank: 2, births: 2925 },
  { slug: "ambre", name: "Ambre", gender: "Féminin", rank: 3, births: 2805 },
  { slug: "alma", name: "Alma", gender: "Féminin", rank: 4, births: 2500 },
  { slug: "alba", name: "Alba", gender: "Féminin", rank: 5, births: 2360 },
  { slug: "rose", name: "Rose", gender: "Féminin", rank: 6, births: 2320 },
  { slug: "emma", name: "Emma", gender: "Féminin", rank: 7, births: 2310 },
  { slug: "romy", name: "Romy", gender: "Féminin", rank: 8, births: 2245 },
  { slug: "adele", name: "Adèle", gender: "Féminin", rank: 9, births: 2225 },
  { slug: "alice", name: "Alice", gender: "Féminin", rank: 10, births: 2130 },
  { slug: "gabriel", name: "Gabriel", gender: "Masculin", rank: 1, births: 4625 },
  { slug: "noah", name: "Noah", gender: "Masculin", rank: 2, births: 3465 },
  { slug: "leo", name: "Léo", gender: "Masculin", rank: 3, births: 3420 },
  { slug: "raphael", name: "Raphaël", gender: "Masculin", rank: 4, births: 3285 },
  { slug: "louis", name: "Louis", gender: "Masculin", rank: 5, births: 3260 },
  { slug: "jules", name: "Jules", gender: "Masculin", rank: 6, births: 3040 },
  { slug: "arthur", name: "Arthur", gender: "Masculin", rank: 7, births: 2875 },
  { slug: "leon", name: "Léon", gender: "Masculin", rank: 8, births: 2840 },
  { slug: "adam", name: "Adam", gender: "Masculin", rank: 9, births: 2810 },
  { slug: "mael", name: "Maël", gender: "Masculin", rank: 10, births: 2700 }
];

export function getNamePopularity2025(slug: string): NamePopularity2025 | undefined {
  return NAME_POPULARITY_2025.find((entry) => entry.slug === slug);
}

export type NameRegionalLeader2025 = {
  slug: string;
  name: string;
  gender: "Féminin" | "Masculin";
  regions: readonly string[];
  distinction?: string;
};

export const NAME_REGIONAL_LEADERS_2025: readonly NameRegionalLeader2025[] = [
  { slug: "louise", name: "Louise", gender: "Féminin", regions: ["Nouvelle-Aquitaine", "Bourgogne-Franche-Comté", "Bretagne", "Occitanie"] },
  { slug: "jade", name: "Jade", gender: "Féminin", regions: ["Auvergne-Rhône-Alpes", "Normandie", "Grand Est"] },
  { slug: "ambre", name: "Ambre", gender: "Féminin", regions: ["Hauts-de-France", "Centre-Val de Loire"] },
  { slug: "alba", name: "Alba", gender: "Féminin", regions: ["Provence-Alpes-Côte d’Azur", "Corse"] },
  { slug: "adele", name: "Adèle", gender: "Féminin", regions: ["Pays de la Loire"] },
  { slug: "alma", name: "Alma", gender: "Féminin", regions: ["Île-de-France"] },
  { slug: "inaya", name: "Inaya", gender: "Féminin", regions: ["Martinique", "Guyane", "La Réunion", "Mayotte"] },
  { slug: "luna", name: "Luna", gender: "Féminin", regions: ["Guadeloupe"] },
  { slug: "gabriel", name: "Gabriel", gender: "Masculin", regions: [], distinction: "12 régions sur 18" },
  { slug: "malo", name: "Malo", gender: "Masculin", regions: ["Bretagne"] },
  { slug: "jayden", name: "Jayden", gender: "Masculin", regions: ["Guyane"] },
  { slug: "kais", name: "Kaïs", gender: "Masculin", regions: ["La Réunion"] },
  { slug: "rayane", name: "Rayane", gender: "Masculin", regions: ["Mayotte"] },
  { slug: "noah", name: "Noah", gender: "Masculin", regions: ["Guadeloupe", "Martinique"] }
];
