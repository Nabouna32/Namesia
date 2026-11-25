export const MAX_HISTORY_ITEMS = 8;

export function addHistoryVisit(slugs: string[], slug: string): string[] {
  if (!slug) return slugs;
  return [slug, ...slugs.filter((item) => item !== slug)].slice(0, MAX_HISTORY_ITEMS);
}

export function parseSessionHistory(value: string | null): string[] {
  if (value === null) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || !parsed.every(
    (slug): slug is string => typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  )) {
    throw new TypeError("Le contenu de l’historique est invalide.");
  }
  return [...new Set(parsed)].slice(0, MAX_HISTORY_ITEMS);
}

export function removeHistoryVisit(slugs: string[], slug: string): string[] {
  return slugs.filter((item) => item !== slug);
}
