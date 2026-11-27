import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

const migrationsDirectory = new URL("../supabase/migrations/", import.meta.url);
const migrationFiles = (await readdir(migrationsDirectory)).filter((file) => file.endsWith(".sql"));
const migrationVersions = migrationFiles.map((file) => file.slice(0, 14));
const associationPolicyMigration = await readFile(
  new URL("../supabase/migrations/20261125005358_consolider_policies_lecture_associations.sql", import.meta.url),
  "utf8"
);
const associationPolicyNamingMigration = await readFile(
  new URL("../supabase/migrations/20261125011430_rename_association_policies_english.sql", import.meta.url),
  "utf8"
);
const favoritesMigration = await readFile(
  new URL("../supabase/migrations/20261127133138_user_favorites.sql", import.meta.url),
  "utf8"
);
const favoritesPolicyFixMigration = await readFile(
  new URL("../supabase/migrations/20261127133505_fix_user_favorites_insert_policy.sql", import.meta.url),
  "utf8"
);
const favoritesPrivilegeMigration = await readFile(
  new URL("../supabase/migrations/20261127134241_limit_user_favorites_insert_columns.sql", import.meta.url),
  "utf8"
);
const architecture = await readFile(new URL("../docs/ARCHITECTURE.md", import.meta.url), "utf8");

test("les migrations locales restent alignées sur les versions Supabase appliquées", () => {
  assert.ok(migrationFiles.includes("20261122002440_finaliser_nettoyage_modele.sql"));
  assert.ok(migrationFiles.includes("20261125005358_consolider_policies_lecture_associations.sql"));
  assert.ok(migrationFiles.includes("20261125011430_rename_association_policies_english.sql"));
  assert.ok(migrationFiles.includes("20261127133138_user_favorites.sql"));
  assert.ok(migrationFiles.includes("20261127133505_fix_user_favorites_insert_policy.sql"));
  assert.ok(migrationFiles.includes("20261127134241_limit_user_favorites_insert_columns.sql"));
  assert.equal(new Set(migrationVersions).size, migrationVersions.length);
  assert.ok(migrationFiles.every((file) => /^\d{14}_[a-z0-9_]+\.sql$/.test(file)));
  assert.ok(migrationVersions.every((version) => /^\d{14}$/.test(version)));
  assert.equal(migrationFiles.some((file) => /20261122140000|references_editoriales|versionner_reprise_editoriale/.test(file)), false);
});

test("l'architecture documente les policies RLS actives des associations", () => {
  assert.match(architecture, /read_published_profile_associations/);
  assert.match(architecture, /read_published_or_admin_profile_associations/);
  assert.match(architecture, /admin_insert_profile_associations/);
});

test("les policies de la table des associations utilisent des identifiants anglais", () => {
  assert.match(associationPolicyNamingMigration, /rename to "admin_insert_profile_associations"/);
  assert.match(associationPolicyNamingMigration, /rename to "read_published_or_admin_profile_associations"/);
  assert.match(associationPolicyNamingMigration, /rename to "read_published_profile_associations"/);
});

test("les lectures RLS des associations sont séparées par rôle", () => {
  assert.match(associationPolicyMigration, /drop policy if exists "Lecture publique des associations des fiches publiées"/);
  assert.match(associationPolicyMigration, /drop policy if exists "Administrateurs : lecture de toutes les associations"/);
  assert.match(associationPolicyMigration, /for select to anon/i);
  assert.match(associationPolicyMigration, /for select to authenticated/i);
  assert.match(associationPolicyMigration, /private\.admin_users/);
  assert.doesNotMatch(associationPolicyMigration, /for select to anon,\s*authenticated/i);
});

test("les favoris sont privés, liés au compte et limités aux prénoms publiés", () => {
  assert.match(favoritesMigration, /references auth\.users \(id\) on delete cascade/);
  assert.match(favoritesMigration, /references public\.names \(id\) on delete cascade/);
  assert.match(favoritesMigration, /primary key \(user_id, name_id\)/);
  assert.match(favoritesMigration, /alter table public\.user_favorites enable row level security/);
  assert.match(favoritesMigration, /for select\s+to authenticated/);
  assert.match(favoritesMigration, /for insert\s+to authenticated/);
  assert.match(favoritesMigration, /for delete\s+to authenticated/);
  assert.match(favoritesMigration, /n\.id = user_favorites\.name_id/);
  assert.match(favoritesMigration, /grant select, delete on table public\.user_favorites to authenticated/);
  assert.match(favoritesMigration, /grant insert \(user_id, name_id\) on table public\.user_favorites to authenticated/);
  assert.doesNotMatch(favoritesMigration, /grant .* to anon/);
  assert.doesNotMatch(favoritesMigration, /grant insert on table public\.user_favorites to authenticated/);
  assert.match(favoritesPolicyFixMigration, /n\.id = user_favorites\.name_id/);
  assert.match(favoritesPolicyFixMigration, /auth\.uid\(\)\) = user_favorites\.user_id/);
  assert.match(favoritesPrivilegeMigration, /revoke insert on table public\.user_favorites from authenticated/);
  assert.match(favoritesPrivilegeMigration, /grant insert \(user_id, name_id\) on table public\.user_favorites to authenticated/);
});
