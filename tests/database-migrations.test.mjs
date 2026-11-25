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

test("les migrations locales restent alignées sur les versions Supabase appliquées", () => {
  assert.ok(migrationFiles.includes("20261122002440_finaliser_nettoyage_modele.sql"));
  assert.ok(migrationFiles.includes("20261125005358_consolider_policies_lecture_associations.sql"));
  assert.equal(new Set(migrationVersions).size, migrationVersions.length);
  assert.ok(migrationVersions.every((version) => /^\\d{14}$/.test(version)));
  assert.equal(migrationFiles.some((file) => /20261122140000|references_editoriales|versionner_reprise_editoriale/.test(file)), false);
});

test("les lectures RLS des associations sont séparées par rôle", () => {
  assert.match(associationPolicyMigration, /drop policy if exists "Lecture publique des associations des fiches publiées"/);
  assert.match(associationPolicyMigration, /drop policy if exists "Administrateurs : lecture de toutes les associations"/);
  assert.match(associationPolicyMigration, /for select to anon/i);
  assert.match(associationPolicyMigration, /for select to authenticated/i);
  assert.match(associationPolicyMigration, /private\\.admin_users/);
  assert.doesNotMatch(associationPolicyMigration, /for select to anon,\\s*authenticated/i);
});
