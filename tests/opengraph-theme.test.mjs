import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const chemins = [
  new URL("../app/opengraph-image.tsx", import.meta.url)
];

test("les aperçus Open Graph utilisent exclusivement les rôles Material 3 Fidelity", async () => {
  for (const chemin of chemins) {
    const source = await readFile(chemin, "utf8");
    assert.match(source, /getMaterialThemeTokens\(false\)/);
    assert.match(source, /--md-sys-color-background/);
    assert.match(source, /--md-sys-color-primary/);
    assert.match(source, /--md-sys-color-surface-container-lowest/);
    assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b/i);
    assert.doesNotMatch(source, /linear-gradient\s*\(/i);
  }
});


test("la police Open Graph est incluse dans le système de fichiers virtuel du Worker", async () => {
  const wrangler = JSON.parse(await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
  assert.equal(wrangler.find_additional_modules, true);
  assert.equal(wrangler.base_dir, ".");
  assert.equal(wrangler.preserve_file_names, true);
  assert.ok(wrangler.rules.some((rule) =>
    rule.type === "Text" && rule.globs.includes("assets/fonts/Roboto-Regular.ttf.base64") && rule.fallthrough === true
  ));
  await readFile(new URL("../assets/fonts/Roboto-Regular.ttf.base64", import.meta.url), "utf8");
});


test("les fiches héritent de l’image Open Graph statique commune", async () => {
  const profilePage = await readFile(new URL("../app/prenoms/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(profilePage, /new URL\("\/opengraph-image", siteUrl\)/);\n  assert.match(profilePage, /images: \[\{ url: imageUrl, width: 1200, height: 630/);
  await assert.rejects(readFile(new URL("../app/prenoms/[slug]/opengraph-image.tsx", import.meta.url)));
});
