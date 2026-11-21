export type Prenom = {
  slug: string;
  nom: string;
  lettre: string;
  accroche: string;
};

export const prenoms: Prenom[] = [
  { slug: "alice", nom: "Alice", lettre: "A", accroche: "Une fiche exemple pour découvrir la structure Namesia." },
  { slug: "gabriel", nom: "Gabriel", lettre: "G", accroche: "Une fiche exemple, en attente de documentation sourcée." },
  { slug: "lina", nom: "Lina", lettre: "L", accroche: "Une fiche exemple pour tester la navigation du catalogue." },
  { slug: "noah", nom: "Noah", lettre: "N", accroche: "Une fiche exemple, sans affirmation étymologique non vérifiée." }
];

export function trouverPrenom(slug: string) {
  return prenoms.find((prenom) => prenom.slug === slug);
}
