import assert from "node:assert/strict";
import test from "node:test";
import { lireToutesLesPages } from "../lib/pagination.ts";

test("la pagination rassemble toutes les pages jusqu'à la dernière page partielle", async () => {
  const lignes = Array.from({ length: 7 }, (_, index) => index + 1);
  const plages = [];

  const resultat = await lireToutesLesPages(async (debut, fin, compter) => {
    plages.push([debut, fin]);
    return {
      data: lignes.slice(debut, fin + 1),
      error: null,
      count: compter ? lignes.length : null
    };
  }, 3);

  assert.deepEqual(resultat, lignes);
  assert.deepEqual(plages, [[0, 2], [3, 5], [6, 8]]);
});

test("une collection vide exige et accepte un compte exact nul", async () => {
  let appels = 0;
  const resultat = await lireToutesLesPages(async () => {
    appels += 1;
    return { data: [], error: null, count: 0 };
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
    lireToutesLesPages(async () => ({ data: null, error: null, count: 0 }), 2),
    /aucune donnée exploitable/
  );
});

test("une taille de page invalide est rejetée avant tout appel", async () => {
  let appels = 0;
  await assert.rejects(
    lireToutesLesPages(async () => {
      appels += 1;
      return { data: [], error: null, count: 0 };
    }, 0),
    RangeError
  );
  assert.equal(appels, 0);
});

test("un catalogue dépassant mille lignes est entièrement parcouru", async () => {
  const lignes = Array.from({ length: 1201 }, (_, index) => index);
  const plages = [];
  const resultat = await lireToutesLesPages(async (debut, fin, compter) => {
    plages.push([debut, fin]);
    return {
      data: lignes.slice(debut, fin + 1),
      error: null,
      count: compter ? lignes.length : null
    };
  });

  assert.deepEqual(resultat, lignes);
  assert.deepEqual(plages, [[0, 499], [500, 999], [1000, 1499]]);
});

test("un plafond API inférieur à la taille demandée ne tronque pas le catalogue", async () => {
  const lignes = Array.from({ length: 1201 }, (_, index) => index);
  const plages = [];
  const tailles = [];
  const resultat = await lireToutesLesPages(async (debut, fin, compter) => {
    plages.push([debut, fin]);
    tailles.push(compter);
    return {
      data: lignes.slice(debut, Math.min(fin + 1, debut + 100)),
      error: null,
      count: compter ? lignes.length : null
    };
  });

  assert.deepEqual(resultat, lignes);
  assert.deepEqual(plages, [
    [0, 499], [100, 599], [200, 699], [300, 799], [400, 899], [500, 999],
    [600, 1099], [700, 1199], [800, 1299], [900, 1399], [1000, 1499], [1100, 1599], [1200, 1699]
  ]);
  assert.equal(tailles.filter(Boolean).length, 1);
});

test("un compte exact absent est une erreur, même si la première page est courte", async () => {
  await assert.rejects(
    lireToutesLesPages(async () => ({ data: [1, 2], error: null }), 500),
    /compte exact du catalogue n’a pas été retourné/
  );
});

test("un compte exact invalide est rejeté", async () => {
  for (const count of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    await assert.rejects(
      lireToutesLesPages(async () => ({ data: [], error: null, count }), 500),
      /nombre total de lignes retourné par Supabase est invalide/
    );
  }
});

test("une première page plus grande que le compte exact est rejetée", async () => {
  await assert.rejects(
    lireToutesLesPages(async () => ({ data: [1, 2, 3], error: null, count: 2 }), 5),
    /plus de lignes que le compte exact/
  );
});

test("une pagination qui n'avance plus échoue explicitement", async () => {
  await assert.rejects(
    lireToutesLesPages(async () => ({ data: [], error: null, count: 20 }), 5),
    /n’a pas progressé/
  );
});

test("des pages qui dépassent le compte exact sont rejetées", async () => {
  let appels = 0;
  await assert.rejects(
    lireToutesLesPages(async () => {
      appels += 1;
      return { data: [1, 2, 3], error: null, count: 4 };
    }, 3),
    /dépassent le compte exact/
  );
  assert.equal(appels, 2);
});
