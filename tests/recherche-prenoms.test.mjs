import assert from "node:assert/strict";
import test from "node:test";
import { distanceEditionBornee, normaliserRecherche, suggererPrenomsProches } from "../lib/recherche-prenoms.ts";

test("la recherche ignore les accents et la casse", () => {
  assert.equal(normaliserRecherche(" ÉLODIE "), "elodie");
});

test("la recherche rapproche les séparateurs des prénoms composés", () => {
  assert.equal(normaliserRecherche("Jean Luc"), "jeanluc");
  assert.equal(normaliserRecherche("Jean-Luc"), "jeanluc");
  assert.equal(normaliserRecherche("O Connor"), "oconnor");
  assert.equal(normaliserRecherche("O’Connor"), "oconnor");
});

test("un séparateur isolé ne devient pas une recherche vide", () => {
  assert.equal(normaliserRecherche("-"), "-");
});

test("la recherche développe les ligatures françaises et latines", () => {
  assert.equal(normaliserRecherche("CŒLIA"), "coelia");
  assert.equal(normaliserRecherche("ÆLIA"), "aelia");
  assert.equal(normaliserRecherche("Cœur"), "coeur");
});


test("la distance bornée reconnaît les substitutions, insertions et suppressions", () => {
  assert.equal(distanceEditionBornee("alice", "alixe", 1), 1);
  assert.equal(distanceEditionBornee("alice", "allice", 1), 1);
  assert.equal(distanceEditionBornee("alice", "alie", 1), 1);
  assert.equal(distanceEditionBornee("alice", "bob", 2), 3);
});

test("la distance utilise les caractères Unicode, pas les unités UTF-16", () => {
  assert.equal(distanceEditionBornee("😀a", "😀b", 1), 1);
  assert.equal(distanceEditionBornee("😀", "a", 1), 1);
});

test("la distance bornée gère les chaînes vides et la limite nulle", () => {
  assert.equal(distanceEditionBornee("", "", 0), 0);
  assert.equal(distanceEditionBornee("a", "", 1), 1);
  assert.equal(distanceEditionBornee("", "abc", 2), 3);
  assert.equal(distanceEditionBornee("alice", "alice", 0), 0);
  assert.equal(distanceEditionBornee("alice", "alixe", 0), 1);
});

test("la distance rejette une limite invalide", () => {
  assert.throws(() => distanceEditionBornee("a", "b", -1), RangeError);
  assert.throws(() => distanceEditionBornee("a", "b", 1.5), RangeError);
});

test("la distance bornée traite rapidement les chaînes de longueurs incompatibles", () => {
  assert.equal(distanceEditionBornee("a".repeat(10000), "alice", 2), 3);
});

function distanceReference(a, b) {
  const gauche = Array.from(a);
  const droite = Array.from(b);
  let precedent = Array.from({ length: droite.length + 1 }, (_, index) => index);

  for (let i = 1; i <= gauche.length; i += 1) {
    const courant = [i];
    for (let j = 1; j <= droite.length; j += 1) {
      courant[j] = Math.min(
        precedent[j] + 1,
        courant[j - 1] + 1,
        precedent[j - 1] + (gauche[i - 1] === droite[j - 1] ? 0 : 1)
      );
    }
    precedent = courant;
  }

  return precedent[droite.length];
}

function genererChaines(alphabet, longueurMax) {
  const chaines = [""];
  for (let longueur = 1; longueur <= longueurMax; longueur += 1) {
    const debut = chaines.filter((chaine) => Array.from(chaine).length === longueur - 1);
    for (const chaine of debut) {
      for (const caractere of alphabet) chaines.push(chaine + caractere);
    }
  }
  return chaines;
}

test("la distance bornée correspond à Levenshtein sur un ensemble exhaustif de petites chaînes", () => {
  const chaines = genererChaines(["a", "b"], 4);
  for (const gauche of chaines) {
    for (const droite of chaines) {
      const reference = distanceReference(gauche, droite);
      for (const limite of [0, 1, 2, 3]) {
        assert.equal(
          distanceEditionBornee(gauche, droite, limite),
          reference <= limite ? reference : limite + 1,
          `distance inattendue entre « ${gauche} » et « ${droite} » avec limite ${limite}`
        );
      }
    }
  }
});


test("les suggestions proches sont mutualisées, bornées et classées par distance", () => {
  const prenoms = ["Alice", "Alix", "Alise", "Aline", "Alina", "Alisa", "Alicia"]
    .map((nom) => ({ id: nom, slug: nom.toLowerCase(), nom, lettre: "A", genre: "Féminin" }));

  assert.deepEqual(
    suggererPrenomsProches(prenoms, "Alis").map((prenom) => prenom.nom),
    ["Alisa", "Alise", "Alina", "Alisa", "Alice"].sort((a, b) => a.localeCompare(b, "fr")).slice(0, 5)
  );
  assert.deepEqual(suggererPrenomsProches(prenoms, "ali"), []);
  assert.deepEqual(suggererPrenomsProches(prenoms, "Alice"), []);
});

test("les suggestions proches autorisent deux modifications pour les recherches longues", () => {
  const prenoms = [
    { id: "1", slug: "alexandra", nom: "Alexandra", lettre: "A", genre: "Féminin" },
    { id: "2", slug: "alexandrine", nom: "Alexandrine", lettre: "A", genre: "Féminin" }
  ];
  assert.deepEqual(
    suggererPrenomsProches(prenoms, "alexandrx"),
    ["Alexandra"]
  );
});
