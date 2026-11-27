import test from "node:test";
import assert from "node:assert/strict";
import { MAX_PASSWORD_BYTES, MIN_PASSWORD_LENGTH, validatePassword } from "../lib/auth-password.ts";

test("la politique exige 8 caractères, une majuscule et un chiffre", () => {
  assert.equal(MIN_PASSWORD_LENGTH, 8);
  assert.equal(validatePassword("Abcdef1x"), null);
  assert.equal(validatePassword("abcdef1"), "Le mot de passe doit contenir au moins 8 caractères.");
  assert.equal(validatePassword("abcdefgh"), "Le mot de passe doit contenir au moins une majuscule.");
  assert.equal(validatePassword("ABCDEFGH"), "Le mot de passe doit contenir au moins un chiffre.");
});

test("la longueur compte les points de code Unicode", () => {
  assert.equal(validatePassword("Éabcdef1"), null);
  assert.equal(validatePassword("😀😀😀😀😀😀A1"), null);
});

test("la limite technique Supabase est contrôlée en octets UTF-8", () => {
  assert.equal(MAX_PASSWORD_BYTES, 72);
  assert.equal(validatePassword("A".repeat(71) + "1"), null);
  assert.match(validatePassword("A".repeat(72) + "1") ?? "", /72 octets UTF-8/);
  assert.match(validatePassword("😀".repeat(18) + "A1") ?? "", /72 octets UTF-8/);
});
