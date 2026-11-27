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
  const accountPage = await readFile(new URL("../app/compte/page.tsx", import.meta.url), "utf8");
  const adminAuth = await readFile(new URL("../lib/admin-auth.ts", import.meta.url), "utf8");
  const sessionClient = await readFile(new URL("../lib/supabase/session.ts", import.meta.url), "utf8");
  const proxy = await readFile(new URL("../proxy.ts", import.meta.url), "utf8");
  assert.match(adminClient, /createSupabaseBrowserClient\(\)/);
  assert.match(adminClient, /\/compte\?redirect=%2Fadmin/);
  assert.doesNotMatch(adminClient, /signInWithOtp/);
  assert.doesNotMatch(adminClient, /Authorization/);
  assert.match(adminAuth, /createSupabaseSessionClient\(\)/);
  assert.match(adminAuth, /auth\.getUser\(\)/);
  assert.doesNotMatch(adminAuth, /Bearer/);
  assert.match(adminAuth, /Origine de requête non autorisée/);
  assert.match(adminAuth, /request\.headers\.get\("origin"\)/);
  assert.match(adminAuth, /new URL\(request\.url\)\.origin/);
  assert.match(sessionClient, /createServerClient/);
  assert.match(sessionClient, /getAll\(\)/);
  assert.match(sessionClient, /setAll\(cookiesToSet\)/);
  assert.match(sessionClient, /sameSite: "lax"/);
  assert.match(sessionClient, /secure: process\.env\.NODE_ENV === "production"/);
  assert.match(proxy, /NAMESIA_DEPLOYMENT_ENVIRONMENT === "preview"/);
  assert.match(proxy, /supabase\.auth\.getUser\(\)/);
  assert.match(proxy, /Cache-Control/);
  assert.match(proxy, /\/api\/admin\/:path\*/);
  assert.match(accountPage, /NAMESIA_DEPLOYMENT_ENVIRONMENT === "preview"/);
  assert.match(accountPage, /firstParam\(params\.redirect\) === "\/admin" \? "\/admin" : "\/"/);
});
