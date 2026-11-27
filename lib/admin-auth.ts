import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseSessionClient } from "@/lib/supabase/session";

type AdminAccess =
  | { supabase: SupabaseClient<Database>; user: User; error: null }
  | { supabase: null; user: null; error: { message: string; status: number } };

export async function requireAdmin(_request: Request): Promise<AdminAccess> {
  if (process.env.NAMESIA_DEPLOYMENT_ENVIRONMENT === "preview") {
    return { supabase: null, user: null, error: { message: "L’administration est désactivée dans les environnements Preview.", status: 403 } };
  }

  let supabase: SupabaseClient<Database>;
  try {
    supabase = await createSupabaseSessionClient();
  } catch {
    console.error("Configuration Supabase invalide pour une route administrateur.");
    return { supabase: null, user: null, error: { message: "Service momentanément indisponible.", status: 503 } };
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { supabase: null, user: null, error: { message: "Authentification requise ou session expirée.", status: 401 } };
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
