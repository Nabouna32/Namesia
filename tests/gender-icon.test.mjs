import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const icon = await readFile(new URL("../components/material3/Icon.tsx", import.meta.url), "utf8");
const genderIcon = await readFile(new URL("../components/features/names/GenderIcon.tsx", import.meta.url), "utf8");
const genderMap = await readFile(new URL("../lib/gender-icons.ts", import.meta.url), "utf8");
const genderStyles = await readFile(new URL("../components/features/names/GenderIcon.module.css", import.meta.url), "utf8");

test("les pictogrammes de genre restent hors du registre Material Symbols", () => {
  assert.doesNotMatch(icon, /gender-(female|male|mixed|unknown)/);
  assert.match(genderMap, /Record<NameGender, GenderIconDefinition>/);
  assert.match(genderMap, /"Féminin": \{/);
  assert.match(genderMap, /"Masculin": \{/);
  assert.match(genderMap, /"Mixte": \{/);
  assert.match(genderMap, /"Genre non renseigné": \{/);
});

test("le pictogramme masculin sépare son anneau et sa flèche", () => {
  assert.match(genderMap, /path: "M360-660a260 260/);
  assert.match(genderMap, /fillRule: "evenodd"/);
  assert.match(genderMap, /secondaryPath: "M505-550 690-735/);
  assert.match(genderIcon, /<path d=\{definition\.path\} fillRule=\{definition\.fillRule\} \/>/);
  assert.match(genderIcon, /definition\.secondaryPath && <path d=\{definition\.secondaryPath\}/);
  assert.match(genderIcon, /viewBox="0 -960 960 960"/);
  assert.match(genderIcon, /size = 20/);
  assert.match(genderIcon, /width=\{size\}[\s\S]*?height=\{size\}/);
  assert.match(genderIcon, /size === 18 \? styles\.compact : styles\.icon/);
  assert.match(genderStyles, /\.compact \{[\s\S]*?width: 18px;[\s\S]*?height: 18px;[\s\S]*?flex-basis: 18px;/);
});

test("GenderIcon expose un nom accessible ou devient décoratif dans un filtre", () => {
  assert.match(genderIcon, /role=\{decorative \? undefined : "img"\}/);
  assert.match(genderIcon, /aria-label=\{decorative \? undefined : gender\}/);
  assert.match(genderIcon, /<svg[\s\S]*?aria-hidden="true"/);
});
