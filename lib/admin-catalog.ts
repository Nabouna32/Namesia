export type AdminProfile = {
  id: string;
  version: number;
  status: "brouillon" | "publie" | "archive";
  created_at: string;
};

export type AdminName = {
  id: string;
  slug: string;
  display_name: string;
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
  if (!isRecord(value)
    || !isNonEmptyString(value.id)
    || !Number.isSafeInteger(value.version)
    || (value.version as number) < 1
    || (value.status !== "brouillon" && value.status !== "publie" && value.status !== "archive")
    || !isNonEmptyString(value.created_at)
    || !Number.isFinite(Date.parse(value.created_at))) {
    throw new Error(`Le profil administrateur ${index} reçu de l'API est invalide.`);
  }

  return {
    id: value.id,
    version: value.version as number,
    status: value.status,
    created_at: value.created_at
  };
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
  if (!isRecord(value)
    || !Array.isArray(value.names)
    || value.names.length > 100
    || !Number.isSafeInteger(value.total)
    || (value.total as number) < 0
    || !(value.nextOffset === null
      || (Number.isSafeInteger(value.nextOffset) && (value.nextOffset as number) > 0 && (value.nextOffset as number) <= (value.total as number)))) {
    throw new Error("La réponse du catalogue administrateur ne respecte pas son contrat.");
  }

  return {
    names: value.names.map(parseName),
    total: value.total as number,
    nextOffset: value.nextOffset as number | null
  };
}
