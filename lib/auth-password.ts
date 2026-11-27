export const MIN_PASSWORD_LENGTH = 15;
export const MAX_PASSWORD_BYTES = 72;

export function validatePassword(password: string): string | null {
  if (Array.from(password).length < MIN_PASSWORD_LENGTH) {
    return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }

  if (new TextEncoder().encode(password).length > MAX_PASSWORD_BYTES) {
    return `Le mot de passe dépasse la limite technique de ${MAX_PASSWORD_BYTES} octets UTF-8 acceptée par Supabase Auth.`;
  }

  return null;
}
