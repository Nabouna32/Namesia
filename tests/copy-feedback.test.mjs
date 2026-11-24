import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const catalogue = await readFile(new URL("../components/features/catalog/NameSearch.tsx", import.meta.url), "utf8");
const favoris = await readFile(new URL("../components/features/favorites/FavoritesList.tsx", import.meta.url), "utf8");

test("le catalogue efface le retour de copie lorsque les critères changent", () => {
  assert.match(catalogue, /generationCopie = useRef\(0\)/);
  assert.match(catalogue, /function effacerFeedbackCopie\(\)/);
  assert.match(catalogue, /function changerRecherche\(value: string\) \{\s*effacerFeedbackCopie\(\)/);
  assert.match(catalogue, /function changerGenre\(value: string \| null\) \{\s*effacerFeedbackCopie\(\)/);
  assert.match(catalogue, /function changerLettre\(value: string \| null\) \{\s*effacerFeedbackCopie\(\)/);
});

test("une réponse de copie tardive ne remplace pas le retour de la sélection actuelle", () => {
  for (const component of [catalogue, favoris]) {
    assert.match(component, /generation === generationCopie\.current/);
    assert.match(component, /generationCopie\.current \+= 1/);
  }
});

test("les favoris effacent le retour de copie au changement de recherche, genre ou tri", () => {
  assert.match(favoris, /generationCopie = useRef\(0\)/);
  assert.match(favoris, /function changerGenre\(value: string\) \{\s*effacerFeedbackCopie\(\)/);
  assert.match(favoris, /function changerTri\(value: string\) \{\s*if \([^]*?\) \{\s*effacerFeedbackCopie\(\)/);
  assert.match(favoris, /onChange=\{\(value\) => \{\s*effacerFeedbackCopie\(\)/);
});
