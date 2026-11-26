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
    const declared = content.match(/^- \*\*Caractères :\*\* (\d+) /m);

    assert.ok(declared, "Le nombre de caractères doit être déclaré dans " + file);
    assert.equal(content.length, Number(declared[1]), "Le décompte déclaré doit correspondre au fichier UTF-8 décodé.");
    assert.ok(content.length <= 8000, file + " dépasse la limite de 8 000 caractères.");
  });
}
