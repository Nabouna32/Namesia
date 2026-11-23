export const FICHE_SCHEMA_VERSION = "2.0.0" as const;

export type GenrePrenom = "feminin" | "masculin" | "mixte" | "inconnu";

export type AssociationSymbolique = {
  category: string;
  value: string;
  context_note: string;
};


export type ContenuFichePrenom = {
  introduction: string;
  origin?: string;
  history?: string;
  usage?: string;
  symbolic_associations: AssociationSymbolique[];
};

export type FichePrenomImport = {
  schema_version: typeof FICHE_SCHEMA_VERSION;
  identity: {
    slug: string;
    display_name: string;
    gender: GenrePrenom;
  };
  content: ContenuFichePrenom;
};

function estObjet(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function verifierCles(
  value: Record<string, unknown>,
  autorisees: readonly string[],
  chemin: string
): void {
  const inconnues = Object.keys(value).filter((key) => !autorisees.includes(key));
  if (inconnues.length > 0) {
    throw new Error(`${chemin} contient des propriétés inconnues : ${inconnues.join(", ")}.`);
  }
}

function verifierTexte(
  value: unknown,
  chemin: string,
  maximum: number,
  obligatoire = false
): string | undefined {
  if (value === undefined && !obligatoire) return undefined;
  if (typeof value !== "string") {
    throw new Error(`${chemin} doit être une chaîne de caractères.`);
  }
  const texte = value.trim();
  if ((obligatoire && texte.length === 0) || texte.length > maximum) {
    throw new Error(`${chemin} doit contenir entre ${obligatoire ? 1 : 0} et ${maximum} caractères.`);
  }
  return texte || undefined;
}

export function parseFichePrenom(value: unknown): FichePrenomImport {
  if (!estObjet(value)) throw new Error("La fiche doit être un objet JSON.");
  verifierCles(value, ["schema_version", "identity", "content"], "La fiche");

  if (value.schema_version !== FICHE_SCHEMA_VERSION) {
    throw new Error(`Version de schéma non prise en charge. Version attendue : ${FICHE_SCHEMA_VERSION}.`);
  }

  if (!estObjet(value.identity)) throw new Error("identity doit être un objet.");
  verifierCles(value.identity, ["slug", "display_name", "gender"], "identity");

  const slug = verifierTexte(value.identity.slug, "identity.slug", 120, true)!;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("identity.slug doit être un slug en minuscules, sans accent ni espace.");
  }

  const display_name = verifierTexte(value.identity.display_name, "identity.display_name", 100, true)!;
  const gender = value.identity.gender;
  if (gender !== "feminin" && gender !== "masculin" && gender !== "mixte" && gender !== "inconnu") {
    throw new Error("identity.gender doit valoir feminin, masculin, mixte ou inconnu.");
  }

  if (!estObjet(value.content)) throw new Error("content doit être un objet.");
  verifierCles(value.content, ["introduction", "origin", "history", "usage", "symbolic_associations"], "content");

  const introduction = verifierTexte(value.content.introduction, "content.introduction", 600, true)!;
  const origin = verifierTexte(value.content.origin, "content.origin", 3000);
  const history = verifierTexte(value.content.history, "content.history", 3000);
  const usage = verifierTexte(value.content.usage, "content.usage", 3000);

  const associationsBrutes = value.content.symbolic_associations;
  if (!Array.isArray(associationsBrutes) || associationsBrutes.length > 12) {
    throw new Error("content.symbolic_associations doit être une liste de 12 associations maximum.");
  }

  const symbolic_associations = associationsBrutes.map((association, index): AssociationSymbolique => {
    const chemin = `content.symbolic_associations[${index}]`;
    if (!estObjet(association)) throw new Error(`${chemin} doit être un objet.`);
    verifierCles(association, ["category", "value", "context_note"], chemin);
    return {
      category: verifierTexte(association.category, `${chemin}.category`, 80, true)!,
      value: verifierTexte(association.value, `${chemin}.value`, 120, true)!,
      context_note: verifierTexte(association.context_note, `${chemin}.context_note`, 1000, true)!
    };
  });

  return {
    schema_version: FICHE_SCHEMA_VERSION,
    identity: { slug, display_name, gender },
    content: {
      introduction,
      ...(origin ? { origin } : {}),
      ...(history ? { history } : {}),
      ...(usage ? { usage } : {}),
      symbolic_associations
    }
  };
}

export function parseContenuFiche(value: unknown): ContenuFichePrenom {
  return parseFichePrenom({
    schema_version: FICHE_SCHEMA_VERSION,
    identity: { slug: "validation", display_name: "Validation", gender: "inconnu" },
    content: value
  }).content;
}
