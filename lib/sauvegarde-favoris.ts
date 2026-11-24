const VERSION_SAUVEGARDE = 1;
export const LIMITE_FAVORIS = 10_000;

export type ResultatModificationFavori = {
  slugs: string[];
  action: "ajoute" | "retire" | "limite";
};

export type ResultatFusionFavoris = {
  slugs: string[];
  nombreAjoute: number;
  nombreIgnoreLimite: number;
};
const FORMAT_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normaliserSlugsFavoris(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length > LIMITE_FAVORIS) return null;
  if (!value.every((slug: unknown): slug is string =>
    typeof slug === "string" && FORMAT_SLUG.test(slug)
  )) return null;
  return [...new Set(value)];
}

export function fusionnerFavoris(slugsExistants: string[], slugsImportes: string[]): ResultatFusionFavoris {
  const existants = normaliserSlugsFavoris(slugsExistants);
  const importes = normaliserSlugsFavoris(slugsImportes);
  if (!existants || !importes) throw new Error("La fusion contient des identifiants de prénoms invalides.");

  const slugs = [...existants];
  const presents = new Set(slugs);
  let nombreAjoute = 0;
  let nombreIgnoreLimite = 0;

  for (const slug of importes) {
    if (presents.has(slug)) continue;
    if (slugs.length >= LIMITE_FAVORIS) {
      nombreIgnoreLimite += 1;
      continue;
    }
    presents.add(slug);
    slugs.push(slug);
    nombreAjoute += 1;
  }

  return { slugs, nombreAjoute, nombreIgnoreLimite };
}

export function modifierFavori(slugsExistants: string[], slug: string): ResultatModificationFavori {
  const existants = normaliserSlugsFavoris(slugsExistants);
  if (!existants || !FORMAT_SLUG.test(slug)) throw new Error("La modification contient un identifiant de prénom invalide.");

  if (existants.includes(slug)) {
    return { slugs: existants.filter((favori) => favori !== slug), action: "retire" };
  }
  if (existants.length >= LIMITE_FAVORIS) return { slugs: existants, action: "limite" };
  return { slugs: [...existants, slug], action: "ajoute" };
}

export function creerSauvegardeFavoris(slugs: string[]): string {
  const slugsValides = normaliserSlugsFavoris(slugs);
  if (!slugsValides) throw new Error("La liste contient des identifiants de prénoms invalides.");
  return JSON.stringify({
    schema_version: VERSION_SAUVEGARDE,
    slugs: slugsValides
  }, null, 2);
}

export function lireSauvegardeFavoris(value: unknown): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Le fichier doit contenir un objet JSON de sauvegarde Namesia.");
  }

  const sauvegarde = value as Record<string, unknown>;
  const cles = Object.keys(sauvegarde);
  if (cles.length !== 2 || !cles.includes("schema_version") || !cles.includes("slugs")) {
    throw new Error("Le fichier ne correspond pas au format de sauvegarde Namesia.");
  }

  if (sauvegarde.schema_version !== VERSION_SAUVEGARDE) {
    throw new Error("Cette version de sauvegarde n’est pas prise en charge.");
  }

  if (!Array.isArray(sauvegarde.slugs) || sauvegarde.slugs.length > LIMITE_FAVORIS) {
    throw new Error("La sauvegarde doit contenir au maximum 10 000 favoris.");
  }

  const slugs = normaliserSlugsFavoris(sauvegarde.slugs);
  if (!slugs) throw new Error("La sauvegarde contient un identifiant de prénom invalide.");
  return slugs;
}
