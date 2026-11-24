import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const verification = await readFile(new URL("../docs/material-3-verification.md", import.meta.url), "utf8");
const design = await readFile(new URL("../docs/design.md", import.meta.url), "utf8");
const components = await readFile(new URL("../docs/composants.md", import.meta.url), "utf8");
const sourceVerifier = await readFile(new URL("../scripts/verify-design-sources.mjs", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const lock = JSON.parse(await readFile(new URL("../package-lock.json", import.meta.url), "utf8"));

test("les références de code du contrat M3 pointent vers des révisions immuables", () => {
  const documents = [verification, design, components];
  const links = documents.flatMap((document) =>
    [...document.matchAll(/https:\/\/(?:github\.com|chromium\.googlesource\.com)\/[^\s)]+/g)].map(([url]) => url)
  );
  const sourceLinks = links.filter((url) => /\/blob\/|\/tree\/|\/\+\//.test(url));
  assert.ok(sourceLinks.length > 0, "Les références sources versionnées doivent rester présentes");
  for (const url of sourceLinks) {
    assert.match(url, /(?:\/blob\/|\/tree\/|\/\+\/)[0-9a-f]{40}\//, "Référence mutable ou non épinglée : " + url);
  }
  assert.match(verification, /chromium\.googlesource\.com\/chromium\/src\/\+\/6ffe83723d5b4c60a15ae8c356d51e16a4951b24\/docs\/ui\/android\/dynamic_colors\.md/);
  assert.doesNotMatch(verification, /chromium\.googlesource\.com\/chromium\/src\/\+\/refs\/heads\//);
  assert.match(verification, /CheckboxTokens\.kt/);
  assert.match(verification, /RoundedCornerShape\(2\.0\.dp\)/);
  assert.match(verification, /couche d'état sélectionnée `Primary`/);
  assert.match(verification, /NavigationRailCollapsedTokens\.kt/);
  assert.match(verification, /AppBar\.kt/);
  assert.match(verification, /AppBarSmallTokens\.kt/);
  assert.doesNotMatch(verification, /TopAppBar(?:Small)?Tokens?\.kt/);
  assert.match(verification, /NavigationRailColorTokens\.kt/);
  assert.doesNotMatch(verification, /NavigationRailTokens\.kt/);
});

test("le registre M3 et le tableau AndroidX restent complets et lisibles", () => {
  assert.equal(components.includes("\\n|"), false);
  assert.equal(verification.includes("\\n|"), false);
  assert.match(sourceVerifier, /verifySourcesWithLimit\(sources, 4\)/);
  assert.match(sourceVerifier, /attempt < 3/);
  assert.match(sourceVerifier, /AbortSignal\.timeout\(15_000\)/);
  assert.match(sourceVerifier, /lastError = error/);
  assert.match(sourceVerifier, /\[429, 500, 502, 503, 504\]/);
  for (const source of ["AndroidX Button", "AndroidX Checkbox", "AndroidX Card", "AndroidX SearchBar", "AndroidX TextField", "AndroidX NavigationBar", "AndroidX NavigationRail", "AndroidX Chips", "AndroidX TopAppBar", "AndroidX Snackbar"]) {
    assert.ok(sourceVerifier.includes(source), "Source AndroidX non vérifiée : " + source);
  }
  for (const file of ["AppBarSmallTokens.kt", "PaletteTokens.kt", "BaselineButtonTokens.kt", "ButtonSmallTokens.kt", "OutlinedButtonTokens.kt", "TextButtonTokens.kt", "IconButton.kt", "IconButtonTokens.kt", "ElevatedCardTokens.kt", "FilledCardTokens.kt", "OutlinedCardTokens.kt", "TextFieldDefaults.kt", "FilledTextFieldTokens.kt", "OutlinedTextFieldTokens.kt", "InputChipTokens.kt", "NavigationRailCollapsedTokens.kt", "NavigationRailColorTokens.kt", "NavigationRailBaselineItemTokens.kt", "NavigationRailVerticalItemTokens.kt", "SnackbarTokens.kt"]) {
    assert.ok(sourceVerifier.includes(file), "Source AndroidX documentée non vérifiée : " + file);
  }
  for (const name of ["Button", "Card", "Checkbox", "IconButton", "SearchBar", "TextField", "FilterChip", "InputChip", "Snackbar", "TopAppBar", "NavigationBar", "NavigationRail"]) {
    assert.ok(components.includes("| `" + name + "` |"), "Composant absent du registre : " + name);
    assert.match(verification, new RegExp("\\| " + name + " \\|"));
  }
});
test("les versions des bibliothèques de calcul et des sources AndroidX restent explicites", () => {
  assert.equal(packageJson.dependencies["@material/material-color-utilities"], "0.4.0");
  assert.equal(lock.packages["node_modules/@material/material-color-utilities"].version, "0.4.0");
  assert.match(verification, /Compose Material 3 `1\.5\.0` stable/);
  assert.match(verification, /919e948eaa351c590e7e6fc89d4014fad7a6e78c/);
  assert.match(components, /AndroidX Compose Material 3 1\.5\.0 stable/);
});
