import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

type AdminAccess =
  | { supabase: SupabaseClient<Database>; user: User; error: null }
  | { supabase: null; user: null; error: { message: string; status: number } };

export async function requireAdmin(request: Request): Promise<AdminAccess> {
  const authorization = request.headers.get("authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return { supabase: null, user: null, error: { message: "Authentification requise.", status: 401 } };
  }

  let config: ReturnType<typeof getSupabasePublicConfig>;
  try {
    config = getSupabasePublicConfig();
  } catch {
    console.error("Configuration Supabase invalide pour une route administrateur.");
    return { supabase: null, user: null, error: { message: "Service momentanément indisponible.", status: 503 } };
  }

  const supabase = createClient<Database>(config.url, config.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: {
      headers: { Authorization: `Bearer ${token}` }
    }
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return { supabase: null, user: null, error: { message: "Session invalide ou expirée.", status: 401 } };
  }

  const { data: authorized, error: authorizationError } = await supabase.rpc("is_namesia_admin");
  if (authorizationError) {
    console.error("Échec de la vérification du rôle administrateur :", authorizationError);
    return { supabase: null, user: null, error: { message: "Vérification des droits impossible.", status: 503 } };
  }

  if (authorized !== true) {
    return { supabase: null, user: null, error: { message: "Ce compte n'est pas autorisé à administrer Namesia.", status: 403 } };
  }

  return { supabase, user, error: null };
}

export { verifyAdminAccess } from "./admin-auth-core";
