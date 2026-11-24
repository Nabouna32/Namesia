import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const icon = await readFile(new URL("../components/material3/Icon.tsx", import.meta.url), "utf8");
const genreIcon = await readFile(new URL("../components/features/names/GenreIcon.tsx", import.meta.url), "utf8");
const genreMap = await readFile(new URL("../lib/genre-icons.ts", import.meta.url), "utf8");

test("le pictogramme masculin sépare son anneau et sa flèche pour rester lisible à petite taille", () => {
  assert.match(icon, /const maleRing = "M360-660a260 260/);
  assert.match(icon, /const maleArrow = "M505-550 690-735/);
  assert.match(icon, /name === "gender-male"/);
  assert.match(icon, /<path d=\{maleRing\} fillRule="evenodd" \/>/);
  assert.match(icon, /<path d=\{maleArrow\} \/>/);
  assert.match(icon, /viewBox="0 -960 960 960"/);
});

test("le pictogramme masculin conserve le même contrat accessible que les autres genres", () => {
  assert.match(genreIcon, /aria-label=\{genre\}/);
  assert.match(genreIcon, /GENRE_ICONS\[genre\]/);
  assert.match(genreMap, /"Masculin": "gender-male"/);
});
