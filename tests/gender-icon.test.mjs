import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const icon = await readFile(new URL("../components/material3/Icon.tsx", import.meta.url), "utf8");
const genderIcon = await readFile(new URL("../components/features/names/GenderIcon.tsx", import.meta.url), "utf8");
const genderMap = await readFile(new URL("../lib/gender-icons.ts", import.meta.url), "utf8");

test("le pictogramme masculin sépare son anneau et sa flèche pour rester lisible à petite taille", () => {
  assert.match(icon, /type IconPathName = Exclude<IconName, "gender-male">/);
  assert.doesNotMatch(icon, /"gender-male": ""/);
  assert.match(icon, /const maleRing = "M360-660a260 260/);
  assert.match(icon, /const maleArrow = "M505-550 690-735/);
  assert.match(icon, /name === "gender-male"/);
  assert.match(icon, /<path d=\{maleRing\} fillRule="evenodd" \/>/);
  assert.match(icon, /<path d=\{maleArrow\} \/>/);
  assert.match(icon, /viewBox="0 -960 960 960"/);
});

test("le pictogramme masculin conserve le même contrat accessible que les autres genres", () => {
  assert.match(genderIcon, /aria-label=\{gender\}/);
  assert.match(genderIcon, /GENDER_ICONS\[gender\]/);
  assert.match(genderMap, /"Masculin": "gender-male"/);
});
