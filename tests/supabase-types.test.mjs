import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const databaseTypes = await readFile(new URL("../lib/supabase/database.types.ts", import.meta.url), "utf8");
const serverClient = await readFile(new URL("../lib/supabase/server.ts", import.meta.url), "utf8");
const adminAuth = await readFile(new URL("../lib/admin-auth.ts", import.meta.url), "utf8");
const adminClient = await readFile(new URL("../app/admin/admin-client.tsx", import.meta.url), "utf8");
const namesSource = await readFile(new URL("../lib/names.ts", import.meta.url), "utf8");
const publication = await readFile(new URL("../lib/publication-prenom.ts", import.meta.url), "utf8");
const adminCatalog = await readFile(new URL("../lib/admin-catalog.ts", import.meta.url), "utf8");

test("les types générés décrivent le modèle relationnel actif", () => {
  assert.ok(databaseTypes.includes('PostgrestVersion: "14.18"'));
  for (const table of ["names", "name_profiles", "name_profile_associations"]) {
    assert.ok(databaseTypes.includes(table + ": {"));
  }
  assert.doesNotMatch(databaseTypes, /name_profile_references/);
  assert.match(databaseTypes, /import_name_profile:/);
  assert.match(databaseTypes, /is_namesia_admin:/);
  assert.match(databaseTypes, /publish_name_profile:/);
});

test("tous les clients Supabase utilisent le type Database généré", () => {
  for (const source of [serverClient, adminAuth, adminClient]) {
    assert.match(source, /createClient<Database>/);
    assert.ok(source.includes("database.types"));
  }
  assert.match(adminAuth, /SupabaseClient<Database>/);
});

test("les lectures du catalogue dérivent du schéma sans casts non vérifiés", () => {
  assert.match(namesSource, /Pick<Tables<"names">/);
  assert.match(publication, /Tables<"name_profiles">/);
  assert.match(adminCatalog, /Pick<Tables<"name_profiles">/);
  assert.match(adminCatalog, /Pick<Tables<"names">/);
  assert.doesNotMatch(namesSource, /as unknown as/);
  assert.doesNotMatch(adminCatalog, /as number/);
});
