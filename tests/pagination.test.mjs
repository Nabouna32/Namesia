import assert from "node:assert/strict";
import test from "node:test";
import { lireToutesLesPages } from "../lib/pagination.ts";

test("la pagination rassemble toutes les pages jusqu'à la dernière page partielle", async () => {
  const lignes = Array.from({ length: 7 }, (_, index) => index + 1);
  const plages: [number, number][] = [];

  const resultat = await lireToutesLesPages(async (debut, fin) => {
    plages.push([debut, fin]);
    return { data: lignes.slice(debut, fin + 1), error: null };
  }, 3);

  assert.deepEqual(resultat, lignes);
  assert.deepEqual(plages, [[0, 2], [3, 5], [6, 8]]);
});

test("une collection vide ne déclenche qu'une lecture", async () => {
  let appels = 0;
  const resultat = await lireToutesLesPages(async () => {
    appels += 1;
    return { data: [], error: null };
  }, 500);

  assert.deepEqual(resultat, []);
  assert.equal(appels, 1);
});

test("une erreur Supabase interrompt la pagination", async () => {
  const erreur = new Error("Indisponible");
  await assert.rejects(
    lireToutesLesPages(async () => ({ data: null, error: erreur }), 2),
    erreur
  );
});

test("une réponse sans données ni erreur est rejetée", async () => {
  await assert.rejects(
    lireToutesLesPages(async () => ({ data: null, error: null }), 2),
    /aucune donnée exploitable/
  );
});

test("une taille de page invalide est rejetée avant tout appel", async () => {
  let appels = 0;
  await assert.rejects(
    lireToutesLesPages(async () => {
      appels += 1;
      return { data: [], error: null };
    }, 0),
    RangeError
  );
  assert.equal(appels, 0);
});
