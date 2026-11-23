const VERSION_SAUVEGARDE = 1;
const LIMITE_FAVORIS = 10_000;
const FORMAT_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function creerSauvegardeFavoris(slugs: string[]): string {
  return JSON.stringify({
    schema_version: VERSION_SAUVEGARDE,
    slugs: [...new Set(slugs)]
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

  if (!sauvegarde.slugs.every((slug): slug is string =>
    typeof slug === "string" && FORMAT_SLUG.test(slug)
  )) {
    throw new Error("La sauvegarde contient un identifiant de prénom invalide.");
  }

  return [...new Set(sauvegarde.slugs)];
}
