import test from "node:test";
import assert from "node:assert/strict";
import { parseAdminCatalog } from "../lib/admin-catalog.ts";

const profile = {
  id: "profile-1",
  version: 1,
  status: "publie",
  created_at: "2026-11-24T10:00:00.000Z"
};

const name = {
  id: "name-1",
  slug: "amelie",
  display_name: "Amélie",
  name_profiles: [profile]
};

test("le catalogue administrateur valide strictement la réponse paginée", () => {
  assert.deepEqual(parseAdminCatalog({ names: [name], total: 1, nextOffset: null }), {
    names: [name],
    total: 1,
    nextOffset: null
  });
  assert.deepEqual(parseAdminCatalog({ names: [], total: 200, nextOffset: 100 }), {
    names: [],
    total: 200,
    nextOffset: 100
  });
});

test("le catalogue administrateur rejette une réponse incomplète ou mal formée", () => {
  for (const value of [
    null,
    {},
    { names: null, total: 0, nextOffset: null },
    { names: [], total: null, nextOffset: null },
    { names: [], total: 1, nextOffset: 0 },
    { names: [], total: 1, nextOffset: 2 },
    { names: [null], total: 1, nextOffset: null },
    { names: [{ ...name, name_profiles: null }], total: 1, nextOffset: null },
    { names: [{ ...name, name_profiles: [{ ...profile, status: "unknown" }] }], total: 1, nextOffset: null },
    { names: [{ ...name, name_profiles: [{ ...profile, version: "1" }] }], total: 1, nextOffset: null },
    { names: [], total: "1", nextOffset: null },
    { names: [], total: 1, nextOffset: "1" }
  ]) {
    assert.throws(() => parseAdminCatalog(value));
  }
});
