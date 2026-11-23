import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const bouton = await readFile(new URL("../components/ui/bouton.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../components/ui/bouton.module.css", import.meta.url), "utf8");
const favoris = await readFile(new URL("../components/bouton-favori.tsx", import.meta.url), "utf8");
const decouverte = await readFile(new URL("../components/decouverte-aleatoire.tsx", import.meta.url), "utf8");
const vitrine = await readFile(new URL("../components/prenoms-vedette.tsx", import.meta.url), "utf8");
const notFound = await readFile(new URL("../app/not-found.tsx", import.meta.url), "utf8");

test("les primitives partagées exposent des variantes sémantiques et préservent les éléments natifs", () => {
  assert.match(bouton, /export function Bouton\(/);
  assert.match(bouton, /export function LienBouton\(/);
  assert.match(bouton, /<button/);
  assert.match(bouton, /<Link/);
  for (const variante of ["filled", "tonal", "outlined", "text"]) {
    assert.match(styles, new RegExp(`\\.${variante} \\{`));
  }
  assert.match(styles, /min-height: 48px/);
  assert.match(styles, /width: 48px/);
});

test("les composants métier réutilisent les primitives au lieu de redéfinir leurs boutons", () => {
  assert.match(favoris, /import \{ Bouton \} from "@\/components\/ui\/bouton"/);
  assert.match(favoris, /<Bouton/);
  assert.doesNotMatch(favoris, /<button/);
  assert.match(decouverte, /<Bouton/);
  assert.doesNotMatch(decouverte, /<button/);
  assert.match(notFound, /<LienBouton/);
});

test("la vitrine n'attribue aucune couleur selon l'index du prénom", () => {
  assert.match(vitrine, /prenoms\.map\(\(prenom\)/);
  assert.doesNotMatch(vitrine, /featured-\$\{index/);
  assert.doesNotMatch(vitrine, /featured-\d/);
});
