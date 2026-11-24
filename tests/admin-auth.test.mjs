import test from "node:test";
import assert from "node:assert/strict";
import { verifyAdminAccess } from "../lib/admin-auth.ts";

test("la vérification des droits accepte uniquement un booléen explicite", async () => {
  assert.equal(await verifyAdminAccess(async () => ({ data: true, error: null })), true);
  assert.equal(await verifyAdminAccess(async () => ({ data: false, error: null })), false);
});

test("la vérification des droits rejette les réponses nulles et les erreurs RPC", async () => {
  await assert.rejects(() => verifyAdminAccess(async () => ({ data: null, error: null })));
  await assert.rejects(() => verifyAdminAccess(async () => ({ data: true, error: new Error("offline") })));
});
