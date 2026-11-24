export type ProfilPublication = {
  status: string;
  published_at: string | null;
};

export function obtenirDatePublicationUnique(slug: string, profils: ProfilPublication[]): Date {
  if (profils.length !== 1) {
    throw new Error(`Le prénom "${slug}" doit avoir exactement une version publiée.`);
  }

  const profil = profils[0];
  if (profil.status !== "publie") {
    throw new Error(`La version du prénom "${slug}" n'est pas publiée.`);
  }
  if (!profil.published_at) {
    throw new Error(`La date de publication du prénom "${slug}" est absente.`);
  }

  const datePublication = new Date(profil.published_at);
  if (Number.isNaN(datePublication.getTime())) {
    throw new Error(`La date de publication du prénom "${slug}" est invalide.`);
  }

  return datePublication;
}
