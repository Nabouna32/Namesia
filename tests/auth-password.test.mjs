import test from "node:test";
import assert from "node:assert/strict";
import { MAX_PASSWORD_BYTES, MIN_PASSWORD_LENGTH, validatePassword } from "../lib/auth-password.ts";

test("la politique exige 15 caractères sans règle de composition", () => {
  assert.equal(MIN_PASSWORD_LENGTH, 15);
  assert.equal(validatePassword("abcdefghijklmn"), "Le mot de passe doit contenir au moins 15 caractères.");
  assert.equal(validatePassword("abcdefghijklmnop"), null);
  assert.equal(validatePassword("phrase de passe assez longue"), null);
});

test("la longueur compte les points de code Unicode", () => {
  assert.equal(validatePassword("é".repeat(15)), null);
  assert.equal(validatePassword("😀".repeat(15)), null);
});

test("la limite technique Supabase est contrôlée en octets UTF-8", () => {
  assert.equal(MAX_PASSWORD_BYTES, 72);
  assert.equal(validatePassword("a".repeat(72)), null);
  assert.match(validatePassword("a".repeat(73)) ?? "", /72 octets UTF-8/);
  assert.match(validatePassword("😀".repeat(19)) ?? "", /72 octets UTF-8/);
});
