import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

async function readTypeScriptSources(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const sources = await Promise.all(entries.map(async (entry) => {
    const path = new URL(entry.isDirectory() ? entry.name + "/" : entry.name, directory);
    if (entry.isDirectory()) return readTypeScriptSources(path);
    if (/\.(ts|tsx)$/.test(entry.name)) return readFile(path, "utf8");
    return "";
  }));
  return sources.join("\n");
}

const applicationSource = (
  await Promise.all([
    readTypeScriptSources(new URL("../app/", import.meta.url)),
    readTypeScriptSources(new URL("../components/", import.meta.url)),
    readTypeScriptSources(new URL("../lib/", import.meta.url))
  ])
).join("\n");

test("les comptes Namesia utilisent une authentification e-mail et mot de passe", () => {
  assert.match(applicationSource, /signUp\(/);
  assert.match(applicationSource, /signInWithPassword\(/);
  assert.match(applicationSource, /resetPasswordForEmail\(/);
  assert.match(applicationSource, /updateUser\(/);
  assert.match(applicationSource, /flowType: "pkce"/);
  assert.doesNotMatch(applicationSource, /signInWithOtp/);
});

test("l'administration réutilise le compte Namesia sans créer une connexion distincte", async () => {
  const adminClient = await readFile(new URL("../app/admin/admin-client.tsx", import.meta.url), "utf8");
  assert.match(adminClient, /createSupabaseBrowserClient\(\)/);
  assert.match(adminClient, /\/compte\?redirect=%2Fadmin/);
  assert.doesNotMatch(adminClient, /signInWithOtp/);
});
