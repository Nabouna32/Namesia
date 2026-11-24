import assert from "node:assert/strict";

const sources = [
  {
    name: "AndroidX Button",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt",
    markers: ["FilledTonalButton", "OutlinedButton", "ButtonDefaults", "public val IconSize: Dp = 18.dp"],
  },
  {
    name: "AndroidX Checkbox",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Checkbox.kt",
    markers: ["Checkbox", "RoundedCornerShape"],
  },
  {
    name: "AndroidX Card",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Card.kt",
    markers: ["ElevatedCard", "FilledCard", "OutlinedCard"],
  },
  {
    name: "AndroidX SearchBar",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SearchBar.kt",
    markers: ["SearchBarDefaults", "InputField", "ContainerHeight"],
  },
  {
    name: "AndroidX TextField",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/TextField.kt",
    markers: ["OutlinedTextField", "TextFieldDefaults"],
  },
  {
    name: "AndroidX Checkbox tokens",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/CheckboxTokens.kt",
    markers: ["get() = 18.0.dp", "get() = 40.0.dp", "UnselectedDisabledContainerOpacity = 0.38f"],
  },
  {
    name: "AndroidX SearchBar tokens",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SearchBarTokens.kt",
    markers: ["get() = 56.0.dp", "get() = ShapeKeyTokens.CornerFull", "get() = ColorSchemeKeyTokens.SurfaceContainerHigh"],
  },
  {
    name: "AndroidX NavigationBar tokens",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationBarTokens.kt",
    markers: ["get() = 80.0.dp", "get() = TypographyKeyTokens.LabelMedium"],
  },
  {
    name: "AndroidX FilterChip tokens",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/FilterChipTokens.kt",
    markers: ["get() = 32.0.dp", "get() = TypographyKeyTokens.LabelLarge"],
  },
  {
    name: "Material Color Utilities Fidelity",
    url: "https://raw.githubusercontent.com/material-foundation/material-color-utilities/b03ef34bb53a15c3ba41bf963eb3e2c5c353c85f/typescript/dynamiccolor/dynamic_scheme.ts",
    markers: ["Variant.FIDELITY", "specVersion"],
  },
  {
    name: "Angular Material elevation",
    url: "https://raw.githubusercontent.com/angular/components/5c7b286a7684599f275a0f7b4b77752ae751b6bd/src/material/core/tokens/m3/_md-sys-elevation.scss",
    markers: ["md-sys-elevation-values", "level1"],
  },
  {
    name: "Angular Material motion",
    url: "https://raw.githubusercontent.com/angular/components/5c7b286a7684599f275a0f7b4b77752ae751b6bd/src/material/core/tokens/m3/_md-sys-motion.scss",
    markers: ["duration-short3", "md-sys-motion-values"],
  },
  {
    name: "Angular Material state",
    url: "https://raw.githubusercontent.com/angular/components/5c7b286a7684599f275a0f7b4b77752ae751b6bd/src/material/core/tokens/m3/_md-sys-state.scss",
    markers: ["hover-state-layer-opacity", "pressed-state-layer-opacity"],
  },
  {
    name: "Chromium Google Blue",
    url: "https://chromium.googlesource.com/chromium/src/+/6ffe83723d5b4c60a15ae8c356d51e16a4951b24/docs/ui/android/dynamic_colors.md?format=TEXT",
    base64: true,
    markers: ["baseline_primary_600", "0B57D0"],
  },
];

async function fetchSource(source) {
  let response;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch(source.url, { signal: AbortSignal.timeout(15_000) });
    if (response.ok) break;
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 2) {
      throw new Error(`${source.name}: HTTP ${response.status} pour ${source.url}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000 * (attempt + 1)));
  }

  const payload = await response.text();
  const content = source.base64 ? Buffer.from(payload.trim(), "base64").toString("utf8") : payload;
  for (const marker of source.markers) {
    assert.ok(content.includes(marker), `${source.name}: contenu inattendu, marqueur absent « ${marker} »`);
  }
  process.stdout.write(`Source vérifiée : ${source.name}\n`);
}

await Promise.all(sources.map(fetchSource));
