import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const instructionFiles = [
  "mode-autonome.txt",
  "mode-discussion.txt",
];

for (const file of instructionFiles) {
  test(file + " reste un texte brut concis et copiable", async () => {
    const content = await readFile(new URL("../docs/instructions-chatgpt/" + file, import.meta.url), "utf8");

    assert.ok(content.length <= 5000, file + " doit conserver une marge confortable sous la limite ChatGPT.");
    assert.doesNotMatch(content, /(?:Caractères\s*:|limite stricte|sous 8\s*000|8\s*000 caractères|Version\s*:|Mis à jour le\s*:)/i);
    assert.doesNotMatch(content, /Groq|GROQ_API_KEY|SUPABASE_SECRET_KEY/);
    assert.doesNotMatch(content, /[*#`]/, "Le texte copiable reste sans marqueurs Markdown.");
    assert.match(content, /challenge critique est obligatoire|challenge obligatoirement/i);
    assert.match(content, /Réponds en français/);
    assert.match(content, /Toute communication durable dans le dépôt et sur GitHub est en français/i);
    assert.match(content, /Le dépôt Git est la (?:source de vérité|mémoire durable)/);
  });
}
