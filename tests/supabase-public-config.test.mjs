import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getSupabasePublicConfig } from "../lib/supabase/config.ts";

function withEnvironment(url, key, nodeEnv, run) {
  const previous = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    nodeEnv: process.env.NODE_ENV
  };

  if (url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = url;
  if (key === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = key;
  process.env.NODE_ENV = nodeEnv;

  try {
    run();
  } finally {
    if (previous.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previous.url;
    if (previous.key === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previous.key;
    if (previous.nodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous.nodeEnv;
  }
}

test("la configuration Supabase exige une URL et une clé explicites", () => {
  withEnvironment(undefined, "sb_publishable_test", "production", () => {
    assert.throws(getSupabasePublicConfig, /configuration publique Supabase/);
  });
  withEnvironment("https://project.supabase.co", undefined, "production", () => {
    assert.throws(getSupabasePublicConfig, /configuration publique Supabase/);
  });
  withEnvironment(" https://project.supabase.co", "sb_publishable_test", "production", () => {
    assert.throws(getSupabasePublicConfig, /configuration publique Supabase/);
  });
});

test("la configuration valide et normalise uniquement l'origine HTTPS", () => {
  withEnvironment("https://project.supabase.co/", "sb_publishable_test", "production", () => {
    assert.deepEqual(getSupabasePublicConfig(), {
      url: "https://project.supabase.co",
      key: "sb_publishable_test"
    });
  });
});

test("HTTP reste réservé au développement local", () => {
  withEnvironment("http://127.0.0.1:54321", "sb_publishable_test", "development", () => {
    assert.equal(getSupabasePublicConfig().url, "http://127.0.0.1:54321");
  });
  withEnvironment("http://127.0.0.1:54321", "sb_publishable_test", "production", () => {
    assert.throws(getSupabasePublicConfig, /HTTP est réservé/);
  });
  withEnvironment("http://remote.example", "sb_publishable_test", "development", () => {
    assert.throws(getSupabasePublicConfig, /HTTP est réservé/);
  });
});

test("la configuration refuse les chemins, paramètres, identifiants et protocoles non HTTP", () => {
  for (const url of [
    "not-a-url",
    "ftp://project.supabase.co",
    "https://project.supabase.co/rest/v1",
    "https://project.supabase.co?query=1",
    "https://project.supabase.co#fragment",
    "https://user:password@project.supabase.co"
  ]) {
    withEnvironment(url, "sb_publishable_test", "production", () => {
      assert.throws(getSupabasePublicConfig, undefined, url);
    });
  }
});

test("les clients Supabase partagent la configuration validée sans assertion non nulle", async () => {
  const server = await readFile(new URL("../lib/supabase/server.ts", import.meta.url), "utf8");
  const adminAuth = await readFile(new URL("../lib/admin-auth.ts", import.meta.url), "utf8");
  const adminClient = await readFile(new URL("../app/admin/admin-client.tsx", import.meta.url), "utf8");

  for (const source of [server, adminAuth, adminClient]) {
    assert.match(source, /getSupabasePublicConfig\(\)/);
    assert.doesNotMatch(source, /NEXT_PUBLIC_SUPABASE_(?:URL|PUBLISHABLE_KEY)!/);
  }
});
