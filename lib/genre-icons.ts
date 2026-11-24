import type { GenrePrenom } from "@/lib/prenoms";
import type { IconName } from "@/components/material3/Icon";

export const GENRE_ICONS: Record<GenrePrenom, IconName> = {
  "Féminin": "gender-female",
  "Masculin": "gender-male",
  "Mixte": "gender-mixed",
  "Genre non renseigné": "gender-unknown"
};
