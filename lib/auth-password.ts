export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_BYTES = 72;

export function validatePassword(password: string): string | null {
  if (Array.from(password).length < MIN_PASSWORD_LENGTH) {
    return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }

  if (!/\p{Lu}/u.test(password)) {
    return "Le mot de passe doit contenir au moins une majuscule.";
  }

  if (!/\p{N}/u.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre.";
  }

  if (new TextEncoder().encode(password).length > MAX_PASSWORD_BYTES) {
    return `Le mot de passe dépasse la limite technique de ${MAX_PASSWORD_BYTES} octets UTF-8 acceptée par Supabase Auth.`;
  }

  return null;
}
