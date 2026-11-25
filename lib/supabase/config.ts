export type SupabasePublicConfig = {
  url: string;
  key: string;
};

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || url.trim() !== url || key.trim() !== key) {
    throw new Error("La configuration publique Supabase est absente ou invalide.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL doit être une URL absolue valide.");
  }

  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL doit utiliser HTTP ou HTTPS.");
  }

  const isLocalHost = ["localhost", "127.0.0.1", "[::1]"].includes(parsedUrl.hostname);
  if (parsedUrl.protocol === "http:" && (process.env.NODE_ENV === "production" || !isLocalHost)) {
    throw new Error("HTTP est réservé à une instance Supabase locale en développement.");
  }

  if (parsedUrl.pathname !== "/" || parsedUrl.search || parsedUrl.hash || parsedUrl.username || parsedUrl.password) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL doit contenir uniquement l'origine du projet.");
  }

  return { url: parsedUrl.origin, key };
}
