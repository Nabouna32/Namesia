import type { Tables } from "@/lib/supabase/database.types";

export type AdminProfile = Pick<Tables<"name_profiles">, "id" | "version" | "created_at"> & {
  status: "brouillon" | "publie" | "archive";
};

export type AdminName = Pick<Tables<"names">, "id" | "slug" | "display_name"> & {
  name_profiles: AdminProfile[];
};

export type AdminCatalogPage = {
  names: AdminName[];
  total: number;
  nextOffset: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseProfile(value: unknown, index: number): AdminProfile {
  if (!isRecord(value)) {
    throw new Error(`Le profil administrateur ${index} reçu de l'API est invalide.`);
  }

  const { id, version, status, created_at } = value;
  if (!isNonEmptyString(id)
    || typeof version !== "number"
    || !Number.isSafeInteger(version)
    || version < 1
    || (status !== "brouillon" && status !== "publie" && status !== "archive")
    || !isNonEmptyString(created_at)
    || !Number.isFinite(Date.parse(created_at))) {
    throw new Error(`Le profil administrateur ${index} reçu de l'API est invalide.`);
  }

  return { id, version, status, created_at };
}

function parseName(value: unknown, index: number): AdminName {
  if (!isRecord(value)
    || !isNonEmptyString(value.id)
    || !isNonEmptyString(value.slug)
    || !isNonEmptyString(value.display_name)
    || !Array.isArray(value.name_profiles)) {
    throw new Error(`Le prénom administrateur ${index} reçu de l'API est invalide.`);
  }

  return {
    id: value.id,
    slug: value.slug,
    display_name: value.display_name,
    name_profiles: value.name_profiles.map(parseProfile)
  };
}

export function parseAdminCatalog(value: unknown): AdminCatalogPage {
  if (!isRecord(value)) {
    throw new Error("La réponse du catalogue administrateur ne respecte pas son contrat.");
  }

  const { names, total, nextOffset } = value;
  if (!Array.isArray(names)
    || names.length > 100
    || typeof total !== "number"
    || !Number.isSafeInteger(total)
    || total < 0
    || !(nextOffset === null
      || (typeof nextOffset === "number"
        && Number.isSafeInteger(nextOffset)
        && nextOffset > 0
        && nextOffset <= total))) {
    throw new Error("La réponse du catalogue administrateur ne respecte pas son contrat.");
  }

  return {
    names: names.map(parseName),
    total,
    nextOffset
  };
}
