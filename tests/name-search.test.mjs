import assert from "node:assert/strict";
import test from "node:test";
import { boundedEditDistance, normalizeSearchTerm, suggestSimilarNames } from "../lib/name-search.ts";

test("la recherche ignore les accents et la casse", () => {
  assert.equal(normalizeSearchTerm(" ÉLODIE "), "elodie");
});

test("la recherche rapproche les séparateurs des prénoms composés", () => {
  assert.equal(normalizeSearchTerm("Jean Luc"), "jeanluc");
  assert.equal(normalizeSearchTerm("Jean-Luc"), "jeanluc");
  assert.equal(normalizeSearchTerm("O Connor"), "oconnor");
  assert.equal(normalizeSearchTerm("O’Connor"), "oconnor");
});

test("un séparateur isolé ne devient pas une recherche vide", () => {
  assert.equal(normalizeSearchTerm("-"), "-");
});

test("les séparateurs en bord de préfixe ne bloquent pas les prénoms composés", () => {
  assert.equal(normalizeSearchTerm("Jean-"), "jean");
  assert.equal(normalizeSearchTerm("Jean - "), "jean");
  assert.equal(normalizeSearchTerm("-Jean"), "jean");
  assert.equal(normalizeSearchTerm("O’"), "o");
  assert.equal(normalizeSearchTerm("--"), "--");
});

test("la recherche développe les ligatures françaises et latines", () => {
  assert.equal(normalizeSearchTerm("CŒLIA"), "coelia");
  assert.equal(normalizeSearchTerm("ÆLIA"), "aelia");
  assert.equal(normalizeSearchTerm("Cœur"), "coeur");
});


test("la distance bornée reconnaît les substitutions, insertions et suppressions", () => {
  assert.equal(boundedEditDistance("alice", "alixe", 1), 1);
  assert.equal(boundedEditDistance("alice", "allice", 1), 1);
  assert.equal(boundedEditDistance("alice", "alie", 1), 1);
  assert.equal(boundedEditDistance("alice", "bob", 2), 3);
});

test("la distance utilise les caractères Unicode, pas les unités UTF-16", () => {
  assert.equal(boundedEditDistance("😀a", "😀b", 1), 1);
  assert.equal(boundedEditDistance("😀", "a", 1), 1);
});

test("la distance bornée gère les chaînes vides et la limite nulle", () => {
  assert.equal(boundedEditDistance("", "", 0), 0);
  assert.equal(boundedEditDistance("a", "", 1), 1);
  assert.equal(boundedEditDistance("", "abc", 2), 3);
  assert.equal(boundedEditDistance("alice", "alice", 0), 0);
  assert.equal(boundedEditDistance("alice", "alixe", 0), 1);
});

test("la distance rejette une limite invalide", () => {
  assert.throws(() => boundedEditDistance("a", "b", -1), RangeError);
  assert.throws(() => boundedEditDistance("a", "b", 1.5), RangeError);
});

test("la distance bornée traite rapidement les chaînes de longueurs incompatibles", () => {
  assert.equal(boundedEditDistance("a".repeat(10000), "alice", 2), 3);
});

function distanceReference(a, b) {
  const left = Array.from(a);
  const right = Array.from(b);
  let previousRow = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let i = 1; i <= left.length; i += 1) {
    const currentRow = [i];
    for (let j = 1; j <= right.length; j += 1) {
      currentRow[j] = Math.min(
        previousRow[j] + 1,
        currentRow[j - 1] + 1,
        previousRow[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1)
      );
    }
    previousRow = currentRow;
  }

  return previousRow[right.length];
}

function generateStrings(alphabet, longueurMax) {
  const strings = [""];
  for (let longueur = 1; longueur <= longueurMax; longueur += 1) {
    const prefixes = strings.filter((chaine) => Array.from(chaine).length === longueur - 1);
    for (const string of prefixes) {
      for (const character of alphabet) chaines.push(string + character);
    }
  }
  return chaines;
}

test("la distance bornée correspond à Levenshtein sur un ensemble exhaustif de petites chaînes", () => {
  const strings = generateStrings(["a", "b"], 4);
  for (const gauche of chaines) {
    for (const droite of chaines) {
      const referenceDistance = distanceReference(gauche, droite);
      for (const limit of [0, 1, 2, 3]) {
        assert.equal(
          boundedEditDistance(left, right, limit),
          referenceDistance <= limit ? reference : limit + 1,
          `distance inattendue entre « ${gauche} » et « ${droite} » avec limite ${limite}`
        );
      }
    }
  }
});


test("les suggestions proches excluent les préfixes déjà valides et classent par distance", () => {
  const names = ["Alice", "Alix", "Alise", "Aline", "Alina", "Alisa", "Alicia"]
    .map((name) => ({ id: name, slug: name.toLowerCase(), name, initial: "A", gender: "Féminin" }));

  assert.deepEqual(
    suggestSimilarNames(names, "Alis").map((name) => name.name),
    ["Alix"]
  );
  assert.deepEqual(suggestSimilarNames(names, "ali"), []);
  assert.deepEqual(suggestSimilarNames(names, "Alice"), []);
});

test("les suggestions proches autorisent deux modifications pour les recherches longues", () => {
  const names = [
    { id: "1", slug: "alexandra", name: "Alexandra", initial: "A", gender: "Féminin" },
    { id: "2", slug: "alexandrine", name: "Alexandrine", initial: "A", gender: "Féminin" }
  ];
  assert.deepEqual(
    suggestSimilarNames(names, "alexandrx").map((name) => name.name),
    ["Alexandra"]
  );
});
