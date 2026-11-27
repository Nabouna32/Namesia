import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const databaseTypes = await readFile(new URL("../lib/supabase/database.types.ts", import.meta.url), "utf8");
const serverClient = await readFile(new URL("../lib/supabase/server.ts", import.meta.url), "utf8");
const browserClient = await readFile(new URL("../lib/supabase/browser.ts", import.meta.url), "utf8");
const adminAuth = await readFile(new URL("../lib/admin-auth.ts", import.meta.url), "utf8");
const adminClient = await readFile(new URL("../app/admin/admin-client.tsx", import.meta.url), "utf8");
const namesSource = await readFile(new URL("../lib/names.ts", import.meta.url), "utf8");
const publication = await readFile(new URL("../lib/publication-prenom.ts", import.meta.url), "utf8");
const adminCatalog = await readFile(new URL("../lib/admin-catalog.ts", import.meta.url), "utf8");
const architecture = await readFile(new URL("../docs/ARCHITECTURE.md", import.meta.url), "utf8");
const standards = await readFile(new URL("../docs/TECHNICAL-STANDARDS.md", import.meta.url), "utf8");
const supabaseGuide = await readFile(new URL("../docs/platform/SUPABASE.md", import.meta.url), "utf8");

test("les types générés décrivent exactement le modèle relationnel actif", () => {
  assert.ok(databaseTypes.includes('PostgrestVersion: "14.18"'));
  for (const table of ["names", "name_profiles", "name_profile_associations", "user_favorites"]) {
    assert.ok(databaseTypes.includes(`${table}: {`));
  }
  assert.doesNotMatch(databaseTypes, /name_profile_references/);
  assert.match(databaseTypes, /import_name_profile:/);
  assert.match(databaseTypes, /is_namesia_admin:/);
  assert.match(databaseTypes, /publish_name_profile:/);
});

test("tous les clients Supabase utilisent le type Database généré", () => {
  assert.match(serverClient, /createClient<Database>/);
  assert.ok(serverClient.includes("database.types"));
  assert.match(browserClient, /createBrowserClient<Database>/);
  assert.ok(browserClient.includes("database.types"));
  assert.match(adminClient, /createSupabaseBrowserClient\(\)/);
  assert.match(adminAuth, /createSupabaseSessionClient\(\)/);
  assert.match(adminAuth, /SupabaseClient<Database>/);
  assert.ok(adminAuth.includes("database.types"));
});

test("la génération du schéma fait partie du contrat d'architecture", () => {
  assert.ok(architecture.includes("`Database`, généré depuis le schéma PostgreSQL actif"));
  assert.match(standards, /createClient<Database>/);
  assert.match(supabaseGuide, /database\\.types\\.ts/);
  assert.match(supabaseGuide, /est généré depuis le schéma actif/);
  assert.match(supabaseGuide, /est généré depuis le schéma actif/);
});

test("les lectures du catalogue dérivent du schéma sans casts non vérifiés", () => {
  assert.match(namesSource, /Pick<Tables<"names">/);
  assert.match(publication, /Tables<"name_profiles">/);
  assert.match(adminCatalog, /Pick<Tables<"name_profiles">/);
  assert.match(adminCatalog, /Pick<Tables<"names">/);
  assert.doesNotMatch(namesSource, /as unknown as/);
  assert.doesNotMatch(adminCatalog, /as number/);
});
