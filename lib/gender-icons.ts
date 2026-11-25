import type { NameGender } from "@/lib/prenoms";
import type { IconName } from "@/components/material3/Icon";

export const GENDER_ICONS: Record<NameGender, IconName> = {
  "Féminin": "gender-female",
  "Masculin": "gender-male",
  "Mixte": "gender-mixed",
  "Genre non renseigné": "gender-unknown"
};
