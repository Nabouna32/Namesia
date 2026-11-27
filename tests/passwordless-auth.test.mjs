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

test("l'application conserve une authentification passwordless par lien OTP", () => {
  assert.match(applicationSource, /signInWithOtp/);
  assert.match(applicationSource, /shouldCreateUser: false/);
  // Interdire les méthodes par leur nom, même si le client Supabase est renommé localement.
  assert.doesNotMatch(applicationSource, /\b(?:signInWithPassword|signUp|updateUser)\b/);
});
