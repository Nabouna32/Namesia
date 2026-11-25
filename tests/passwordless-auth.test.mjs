import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const adminClient = await readFile(new URL("../app/admin/admin-client.tsx", import.meta.url), "utf8");

test("l'administration conserve une authentification passwordless par lien OTP", () => {
  assert.match(adminClient, /signInWithOtp/);
  assert.doesNotMatch(adminClient, /signInWithPassword|updateUser|signUp/);
});
