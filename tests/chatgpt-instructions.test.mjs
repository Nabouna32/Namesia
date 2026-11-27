import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const instructionFiles = [
  "mode-autonome.md",
  "mode-discussion.md",
];

for (const file of instructionFiles) {
  test(file + " respecte la limite de 8 000 caractères et son décompte déclaré", async () => {
    const content = await readFile(new URL("../docs/instructions-chatgpt/" + file, import.meta.url), "utf8");
    const declared = content.match(/^Caractères : (\d+) /m);

    assert.ok(declared, "Le nombre de caractères doit être déclaré dans " + file);
    assert.equal(content.length, Number(declared[1]), "Le décompte déclaré doit correspondre au fichier UTF-8 décodé.");
    assert.ok(content.length <= 8000, file + " dépasse la limite de 8 000 caractères.");
  });

  test(file + " est en texte brut français et impose le challenge critique", async () => {
    const content = await readFile(new URL("../docs/instructions-chatgpt/" + file, import.meta.url), "utf8");

    assert.doesNotMatch(content, /[*#\x60]/, "Les instructions ne doivent pas contenir de marqueurs Markdown.");
    assert.match(content, /challenge critique est obligatoire à chaque passage/i);
    assert.match(content, /Toute communication durable dans le dépôt et sur GitHub est en français/i);
    assert.match(content, /Le dépôt Git est la mémoire durable/i);
  });
}
