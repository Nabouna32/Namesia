import assert from "node:assert/strict";
import test from "node:test";
import { obtenirDatePublicationUnique } from "../lib/publication-prenom.ts";

test("une seule version publiée avec une date valide est acceptée", () => {
  const date = obtenirDatePublicationUnique("alice", [
    { status: "publie", published_at: "2026-11-24T12:30:00.000Z" }
  ]);
  assert.equal(date.toISOString(), "2026-11-24T12:30:00.000Z");
});

test("l'index refuse une relation publiée absente ou multiple", () => {
  assert.throws(() => obtenirDatePublicationUnique("alice", []), /exactement une version publiée/);
  assert.throws(() => obtenirDatePublicationUnique("alice", [
    { status: "publie", published_at: "2026-11-24T12:30:00.000Z" },
    { status: "publie", published_at: "2026-11-25T12:30:00.000Z" }
  ]), /exactement une version publiée/);
});

test("l'index refuse un statut ou une date de publication incohérents", () => {
  assert.throws(() => obtenirDatePublicationUnique("alice", [
    { status: "brouillon", published_at: "2026-11-24T12:30:00.000Z" }
  ]), /n'est pas publiée/);
  assert.throws(() => obtenirDatePublicationUnique("alice", [
    { status: "publie", published_at: null }
  ]), /date de publication.*absente/);
  assert.throws(() => obtenirDatePublicationUnique("alice", [
    { status: "publie", published_at: "pas-une-date" }
  ]), /date de publication.*invalide/);
});
