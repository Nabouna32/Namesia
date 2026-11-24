import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const chemins = [
  new URL("../app/opengraph-image.tsx", import.meta.url),
  new URL("../app/prenoms/[slug]/opengraph-image.tsx", import.meta.url)
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
