import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

function readAttribute(tag, name) {
  const pattern = new RegExp(
    `(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i"
  );
  const match = tag.match(pattern);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

export function extractOpenGraphImageUrl(html, siteUrl) {
  if (typeof html !== "string" || typeof siteUrl !== "string") {
    throw new TypeError("Le HTML et l'origine du site doivent être des chaînes.");
  }

  const origin = new URL(siteUrl);
  if (origin.protocol !== "https:") {
    throw new Error("L'origine du site doit utiliser HTTPS.");
  }

  const tags = [...html.matchAll(/<meta\\b[^>]*>/gi)].map(([tag]) => tag);
  const imageTag = tags.find((tag) => readAttribute(tag, "property")?.toLowerCase() === "og:image");
  if (!imageTag) {
    const existing = tags.filter((tag) => /(?:og:|twitter:)/i.test(tag));
    throw new Error(
      `Aucune balise og:image trouvée. Métadonnées sociales présentes : ${existing.join(" | ") || "aucune"}`
    );
  }

  const content = readAttribute(imageTag, "content");
  if (!content) {
    throw new Error("La balise og:image ne contient pas d'attribut content.");
  }

  const imageUrl = new URL(content);
  if (imageUrl.protocol !== "https:") {
    throw new Error("L'URL og:image doit utiliser HTTPS.");
  }
  if (imageUrl.origin !== origin.origin) {
    throw new Error("L'URL og:image doit appartenir à la même origine que le site.");
  }

  return imageUrl.toString();
}

async function main() {
  const [htmlPath, siteUrl] = process.argv.slice(2);
  if (!htmlPath || !siteUrl) {
    throw new Error("Usage : node scripts/verify-open-graph.mjs <fichier-html> <origine-site>");
  }

  const html = await readFile(resolve(htmlPath), "utf8");
  process.stdout.write(extractOpenGraphImageUrl(html, siteUrl));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\\n`);
    process.exitCode = 1;
  });
}
