import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FICHE_SCHEMA_VERSION, parseFichePrenom } from "../lib/fiche-prenom.ts";

export const GROQ_MODEL = "openai/gpt-oss-20b";
export const GROQ_PROVIDER = "groq";
export const GENERATION_SCHEMA_VERSION = "1.0.0";
export const GENERATION_TEMPERATURE = 0.2;
export const GENERATION_MAX_COMPLETION_TOKENS = 5000;
export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const PROMPT_URL = new URL("../prompts/fiche-prenom-v1.md", import.meta.url);
const SCHEMA_URL = new URL("../schemas/fiche-prenom.groq.schema.json", import.meta.url);

export function normaliserNom(displayName) {
  if (typeof displayName !== "string") throw new Error("Le prénom doit être une chaîne.");
  if (/[\r\n\t]/u.test(displayName)) throw new Error("Le prénom ne peut pas contenir de retour à la ligne ou de tabulation.");
  const normalizedName = displayName.trim().replace(/ {2,}/g, " ");
  if (!normalizedName || normalizedName.length > 100 || !/^[\p{L}\p{M} .’'-]+$/u.test(normalizedName)) {
    throw new Error("Le prénom contient des caractères non autorisés ou dépasse 100 caractères.");
  }
  return normalizedName;
}

export function slugifierPrenom(displayName) {
  const normalizedName = normaliserNom(displayName);
  const slug = normalizedName
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug || slug.length > 120) throw new Error("Le prénom ne permet pas de créer un slug valide.");
  return slug;
}

export function lireVersionPrompt(prompt) {
  const match = prompt.match(/^Version du prompt : ([0-9]+\.[0-9]+\.[0-9]+)$/m);
  if (!match) throw new Error("La version du prompt est absente ou invalide.");
  return match[1];
}

export function normaliserContenuGroq(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("La réponse Groq doit être un objet JSON.");
  }

  const allowed = ["introduction", "origin", "history", "usage", "symbolic_associations"];
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unknown.length > 0) throw new Error("La réponse Groq contient des propriétés inconnues.");

  if (typeof value.introduction !== "string") throw new Error("L’introduction générée est invalide.");
  for (const field of ["origin", "history", "usage"]) {
    if (value[field] !== null && typeof value[field] !== "string") {
      throw new Error("La rubrique " + field + " doit être une chaîne ou null.");
    }
  }
  if (!Array.isArray(value.symbolic_associations)) {
    throw new Error("Les associations symboliques doivent être une liste.");
  }

  return {
    introduction: value.introduction,
    ...(value.origin === null ? {} : { origin: value.origin }),
    ...(value.history === null ? {} : { history: value.history }),
    ...(value.usage === null ? {} : { usage: value.usage }),
    symbolic_associations: value.symbolic_associations
  };
}

export function construireFicheImport(displayName, gender, generatedContent) {
  const normalizedName = normaliserNom(displayName);
  return parseFichePrenom({
    schema_version: FICHE_SCHEMA_VERSION,
    identity: {
      slug: slugifierPrenom(normalizedName),
      display_name: normalizedName,
      gender
    },
    content: normaliserContenuGroq(generatedContent)
  });
}

export function construireRequeteGroq({ displayName, gender, prompt, schema }) {
  return {
    model: GROQ_MODEL,
    temperature: GENERATION_TEMPERATURE,
    max_completion_tokens: GENERATION_MAX_COMPLETION_TOKENS,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "fiche_prenom_content",
        strict: true,
        schema
      }
    },
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: "Prénom : " + displayName + "\nGenre : " + gender + "\nLangue de rédaction : français."
      }
    ]
  };
}

function attendre(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

async function appelerGroq(apiKey, requestBody, fetchImpl) {
  let response;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      response = await fetchImpl(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(90000)
      });
    } catch {
      if (attempt < 2) {
        await attendre(1000 * (attempt + 1));
        continue;
      }
      throw new Error("La connexion à Groq a échoué après plusieurs tentatives.");
    }

    if (response.ok) break;
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === 2) {
      throw new Error("Groq a refusé la génération (HTTP " + response.status + ").");
    }
    const retryAfter = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(retryAfter * 1000, 15000)
      : 1000 * (attempt + 1);
    await attendre(delay);
  }

  const result = await response.json();
  const choice = result.choices && result.choices[0];
  if (!choice || !choice.message) throw new Error("Groq n’a pas retourné de choix exploitable.");
  if (choice.message.refusal) throw new Error("Groq a refusé cette génération.");
  if (choice.finish_reason && choice.finish_reason !== "stop") {
    throw new Error("La génération Groq est incomplète (finish_reason=" + choice.finish_reason + ").");
  }
  if (typeof choice.message.content !== "string" || !choice.message.content.trim()) {
    throw new Error("Groq n’a pas retourné de contenu JSON.");
  }
  if (typeof result.id !== "string" || !result.id) {
    throw new Error("Groq n’a pas retourné d’identifiant de requête.");
  }

  let generatedContent;
  try {
    generatedContent = JSON.parse(choice.message.content);
  } catch {
    throw new Error("La réponse Groq n’est pas un JSON valide.");
  }

  return { result, generatedContent };
}

async function importerDansSupabase({ supabaseUrl, secretKey, fiche, metadata, fetchImpl }) {
  const endpoint = supabaseUrl.replace(/\/+$/, "") + "/rest/v1/rpc/import_name_profile";
  const body = {
    p_slug: fiche.identity.slug,
    p_display_name: fiche.identity.display_name,
    p_gender: fiche.identity.gender,
    p_content: fiche.content,
    p_schema_version: fiche.schema_version,
    p_generation_provider: metadata.provider,
    p_generation_model: metadata.model,
    p_generation_prompt_version: metadata.promptVersion,
    p_generation_prompt_sha256: metadata.promptSha256,
    p_generation_schema_version: metadata.schemaVersion,
    p_generation_request_id: metadata.requestId,
    p_generation_input_tokens: metadata.inputTokens,
    p_generation_output_tokens: metadata.outputTokens,
    p_generation_temperature: metadata.temperature,
    p_generation_max_completion_tokens: metadata.maxCompletionTokens,
    p_generated_at: metadata.generatedAt
  };

  let response;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      response = await fetchImpl(endpoint, {
        method: "POST",
        headers: {
          apikey: secretKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000)
      });
    } catch {
      if (attempt === 0) continue;
      throw new Error("La connexion à Supabase a échoué pendant l’import.");
    }
    if (response.ok) break;
    if (response.status >= 500 && attempt === 0) continue;
    const errorPayload = await response.json().catch(() => ({}));
    const code = typeof errorPayload.code === "string" ? errorPayload.code : "inconnu";
    throw new Error("Supabase a refusé l’import (HTTP " + response.status + ", code " + code + ").");
  }

  const rows = await response.json();
  if (!Array.isArray(rows) || !rows[0] || typeof rows[0].profile_id !== "string") {
    throw new Error("Supabase n’a pas retourné l’identifiant de la fiche importée.");
  }
  return { profileId: rows[0].profile_id, version: rows[0].version };
}

export async function genererFiche({
  displayName,
  gender,
  importAsDraft = false,
  env = process.env,
  fetchImpl = fetch,
  outputDirectory = resolve("artifacts")
}) {
  const normalizedName = normaliserNom(displayName);
  if (!["feminin", "masculin", "mixte", "inconnu"].includes(gender)) {
    throw new Error("Le genre fourni n’est pas pris en charge.");
  }
  slugifierPrenom(normalizedName);

  if (!env.GROQ_API_KEY) throw new Error("Le secret GitHub GROQ_API_KEY n’est pas configuré.");
  if (importAsDraft && (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY)) {
    throw new Error("L’import exige SUPABASE_URL et le secret SUPABASE_SECRET_KEY.");
  }

  const [prompt, schemaText] = await Promise.all([
    readFile(PROMPT_URL, "utf8"),
    readFile(SCHEMA_URL, "utf8")
  ]);
  const promptVersion = lireVersionPrompt(prompt);
  const promptSha256 = createHash("sha256").update(prompt).digest("hex");
  const schema = JSON.parse(schemaText);
  const requestBody = construireRequeteGroq({
    displayName: normalizedName,
    gender,
    prompt,
    schema
  });
  const groq = await appelerGroq(env.GROQ_API_KEY, requestBody, fetchImpl);
  const fiche = construireFicheImport(normalizedName, gender, groq.generatedContent);
  const generatedAt = new Date().toISOString();
  const slug = fiche.identity.slug;
  const artifactPath = resolve(outputDirectory, "fiche-" + slug + ".json");

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(artifactPath, JSON.stringify(fiche, null, 2) + "\n", "utf8");

  let imported = null;
  if (importAsDraft) {
    imported = await importerDansSupabase({
      supabaseUrl: env.SUPABASE_URL,
      secretKey: env.SUPABASE_SECRET_KEY,
      fiche,
      metadata: {
        provider: GROQ_PROVIDER,
        model: groq.result.model || GROQ_MODEL,
        promptVersion,
        promptSha256,
        schemaVersion: GENERATION_SCHEMA_VERSION,
        requestId: groq.result.id,
        inputTokens: Number.isInteger(groq.result.usage && groq.result.usage.prompt_tokens)
          ? groq.result.usage.prompt_tokens
          : null,
        outputTokens: Number.isInteger(groq.result.usage && groq.result.usage.completion_tokens)
          ? groq.result.usage.completion_tokens
          : null,
        temperature: GENERATION_TEMPERATURE,
        maxCompletionTokens: GENERATION_MAX_COMPLETION_TOKENS,
        generatedAt
      },
      fetchImpl
    });
  }

  return {
    slug,
    displayName: fiche.identity.display_name,
    provider: GROQ_PROVIDER,
    model: groq.result.model || GROQ_MODEL,
    promptVersion,
    promptSha256,
    requestId: groq.result.id,
    inputTokens: groq.result.usage && groq.result.usage.prompt_tokens,
    outputTokens: groq.result.usage && groq.result.usage.completion_tokens,
    artifactPath,
    imported
  };
}

async function main() {
  const importAsDraft = process.env.IMPORT_AS_DRAFT === "true";
  const result = await genererFiche({
    displayName: process.env.DISPLAY_NAME,
    gender: process.env.GENDER,
    importAsDraft
  });
  console.log(JSON.stringify({
    slug: result.slug,
    displayName: result.displayName,
    provider: result.provider,
    model: result.model,
    promptVersion: result.promptVersion,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    imported: result.imported
  }, null, 2));
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  main().catch((error) => {
    console.error("Échec de la génération de fiche :", error instanceof Error ? error.message : "erreur inconnue");
    process.exitCode = 1;
  });
}
