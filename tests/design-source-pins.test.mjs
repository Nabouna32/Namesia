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
  assert.match(verification, /AlertDialog\.kt/);
  assert.match(verification, /DialogTokens\.kt/);
  assert.match(verification, /RoundedCornerShape\(2\.0\.dp\)/);
  assert.match(verification, /couche d'état sélectionnée `Primary`/);
  assert.match(verification, /NavigationRailCollapsedTokens\.kt/);
  assert.match(verification, /AppBar\.kt/);
  assert.match(verification, /AppBarSmallTokens\.kt/);
  assert.doesNotMatch(verification, /TopAppBar(?:Small)?Tokens?\.kt/);
  assert.match(verification, /NavigationRailColorTokens\.kt/);
  assert.doesNotMatch(verification, /NavigationRailTokens\.kt/);
});

test("le registre M3 et ses sources de référence restent complets et lisibles", () => {
  assert.equal(components.includes("\\n|"), false);
  assert.equal(verification.includes("\\n|"), false);
  assert.match(sourceVerifier, /const verifiedSources = \[\.\.\.sources, \.\.\.additionalAndroidxSources\]/);
  assert.match(sourceVerifier, /filter\(\(\{ name \}\) => name\.startsWith\("AndroidX "\)\)/);
  assert.match(sourceVerifier, /assert\.equal\(androidxSourceCount, 37/);
  assert.match(sourceVerifier, /verifySourcesWithLimit\(verifiedSources, 4\)/);
  assert.match(sourceVerifier, /attempt < 3/);
  assert.match(sourceVerifier, /AbortSignal\.timeout\(15_000\)/);
  assert.match(sourceVerifier, /lastError = error/);
  assert.match(sourceVerifier, /\[429, 500, 502, 503, 504\]/);
  for (const source of ["AndroidX Button", "AndroidX AlertDialog", "AndroidX Checkbox", "AndroidX Card", "AndroidX SearchBar", "AndroidX TextField", "AndroidX NavigationBar", "AndroidX NavigationRail", "AndroidX Chips", "AndroidX TopAppBar", "AndroidX Snackbar", "Material Web README — état de maintenance", "Material Web roadmap — couverture stable"]) {
    assert.ok(sourceVerifier.includes(source), "Source de référence non vérifiée : " + source);
  }
  for (const file of ["AlertDialog.kt", "DialogTokens.kt", "AppBarSmallTokens.kt", "ElevationTokens.kt", "PaletteTokens.kt", "BaselineButtonTokens.kt", "ButtonSmallTokens.kt", "OutlinedButtonTokens.kt", "TextButtonTokens.kt", "IconButton.kt", "IconButtonTokens.kt", "ElevatedCardTokens.kt", "FilledCardTokens.kt", "OutlinedCardTokens.kt", "TextFieldDefaults.kt", "FilledTextFieldTokens.kt", "OutlinedTextFieldTokens.kt", "InputChipTokens.kt", "NavigationRailCollapsedTokens.kt", "NavigationRailColorTokens.kt", "NavigationRailBaselineItemTokens.kt", "NavigationRailVerticalItemTokens.kt", "SnackbarTokens.kt"]) {
    assert.ok(sourceVerifier.includes(file), "Source AndroidX documentée non vérifiée : " + file);
  }
  for (const name of ["AlertDialog", "Button", "Card", "Checkbox", "IconButton", "SearchBar", "TextField", "FilterChip", "InputChip", "Snackbar", "TopAppBar", "NavigationBar", "NavigationRail"]) {
    assert.ok(components.includes("| `" + name + "` |"), "Composant absent du registre : " + name);
    assert.match(verification, new RegExp("\\| " + name + " \\|"));
  }
});
test("les versions des bibliothèques de calcul et des sources AndroidX restent explicites", () => {
  assert.equal(packageJson.dependencies["@material/material-color-utilities"], "0.4.0");
  assert.equal(lock.packages["node_modules/@material/material-color-utilities"].version, "0.4.0");
  assert.match(verification, /Compose Material 3 `1\.5\.0` stable/);
  assert.match(verification, /919e948eaa351c590e7e6fc89d4014fad7a6e78c/);
  assert.match(sourceVerifier, /d4f63c567f73b16717f4c04b57fa6390d0b2312d/);
  assert.match(verification, /maintenance sans nouvelles fonctionnalités planifiées/);
  assert.match(components, /AndroidX Compose Material 3 1\.5\.0 stable/);
});

test("la décision Material Web repose uniquement sur les snapshots officiels vérifiés", () => {
  const revision = "d4f63c567f73b16717f4c04b57fa6390d0b2312d";
  assert.ok(components.includes(`https://github.com/material-components/material-web/blob/${revision}/README.md`));
  assert.ok(components.includes(`https://github.com/material-components/material-web/blob/${revision}/docs/roadmap.md`));
  assert.doesNotMatch(components, /material-components\/material-web\/discussions\//);
  assert.match(components, /aucune nouvelle fonctionnalité ni aucun nouveau composant ne sont planifiés/);
  assert.match(components, /scripts\/verify-design-sources\.mjs/);
  assert.match(sourceVerifier, /Material Web README — état de maintenance/);
  assert.match(sourceVerifier, /Material Web roadmap — couverture stable/);
});

test("aucune source Material Web non vérifiée ne reste dans le contrat canonique", () => {
  assert.doesNotMatch(verification, /material-components\/material-web\/blob\/b4de401eb665ec63474f39319a4ba8f2145974cc/);
  assert.doesNotMatch(verification, /b4de401eb665ec63474f39319a4ba8f2145974cc/);
  assert.match(verification, /d4f63c567f73b16717f4c04b57fa6390d0b2312d/);
  assert.match(verification, /Material Web est documenté uniquement par les snapshots README et roadmap/);
});
