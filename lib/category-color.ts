export type CategoryTone = 1 | 2 | 3;

/**
 * Assigne une teinte stable à une catégorie éditoriale, indépendamment de
 * l'ordre d'affichage et de la fiche dans laquelle elle apparaît.
 */
export function categoryTone(category: string): CategoryTone {
  const normalized = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
  let hash = 0;
  for (const character of normalized) {
    hash = (hash * 31 + character.codePointAt(0)!) >>> 0;
  }
  return (hash % 3 + 1) as CategoryTone;
}
