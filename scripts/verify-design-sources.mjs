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
    name: "AndroidX NavigationBar implementation",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationBar.kt",
    markers: ["NavigationBarTokens", "TallContainerHeight"],
  },
  {
    name: "AndroidX NavigationRail implementation",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/NavigationRail.kt",
    markers: ["NavigationRailCollapsedTokens", "NavigationRail"],
  },
  {
    name: "AndroidX Chips implementation",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Chip.kt",
    markers: ["FilterChip", "InputChip", "FilterChipTokens"],
  },
  {
    name: "AndroidX TopAppBar implementation",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/AppBar.kt",
    markers: ["TopAppBar", "AppBarSmallTokens"],
  },
  {
    name: "AndroidX Snackbar implementation",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Snackbar.kt",
    markers: ["Snackbar", "SnackbarTokens"],
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
    name: "AndroidX TextFieldDefaults",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/TextFieldDefaults.kt",
    markers: ["TextFieldDefaults"],
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
  {
    name: "Material Web README — état de maintenance",
    url: "https://raw.githubusercontent.com/material-components/material-web/d4f63c567f73b16717f4c04b57fa6390d0b2312d/README.md",
    markers: ["@material/web", "MWC is in maintenance mode pending new maintainers"],
  },
  {
    name: "Material Web roadmap — couverture stable",
    url: "https://raw.githubusercontent.com/material-components/material-web/d4f63c567f73b16717f4c04b57fa6390d0b2312d/docs/roadmap.md",
    markers: ["There is no current work planned for new features or components.", "Card", "Navigation bar", "Navigation rail", "Search", "Snackbar", "Top app bar"],
  },
];

const additionalAndroidxSources = [
  ["AppBarSmallTokens.kt", "AppBarSmallTokens"],
  ["PaletteTokens.kt", "PaletteTokens"],
  ["BaselineButtonTokens.kt", "BaselineButtonTokens"],
  ["ButtonSmallTokens.kt", "ButtonSmallTokens"],
  ["OutlinedButtonTokens.kt", "OutlinedButtonTokens"],
  ["TextButtonTokens.kt", "TextButtonTokens"],
  ["IconButton.kt", "IconButton"],
  ["IconButtonTokens.kt", "StandardIconButtonTokens"],
  ["ElevatedCardTokens.kt", "ElevatedCardTokens"],
  ["FilledCardTokens.kt", "FilledCardTokens"],
  ["OutlinedCardTokens.kt", "OutlinedCardTokens"],
  ["FilledTextFieldTokens.kt", "FilledTextFieldTokens"],
  ["OutlinedTextFieldTokens.kt", "OutlinedTextFieldTokens"],
  ["InputChipTokens.kt", "InputChipTokens"],
  ["NavigationRailCollapsedTokens.kt", "NavigationRailCollapsedTokens"],
  ["NavigationRailColorTokens.kt", "NavigationRailColorTokens"],
  ["NavigationRailBaselineItemTokens.kt", "NavigationRailBaselineItemTokens"],
  ["NavigationRailVerticalItemTokens.kt", "NavigationRailVerticalItemTokens"],
  ["SnackbarTokens.kt", ["SnackbarTokens", "ContainerElevation", "CornerExtraSmall", "InverseSurface", "InverseOnSurface", "SingleLineContainerHeight", "TwoLinesContainerHeight"]],
  ["ElevationTokens.kt", ["ElevationTokens", "Level3", "get() = 6.0.dp"]],
].map(([file, marker]) => ({
  name: `AndroidX ${file}`,
  url: `https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/${file === "IconButton.kt" ? file : `tokens/${file}`}`,
  markers: Array.isArray(marker) ? marker : [marker],
}));

async function fetchSource(source) {
  let response;
  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      response = await fetch(source.url, { signal: AbortSignal.timeout(15_000) });
      if (response.ok) break;
      if (![429, 500, 502, 503, 504].includes(response.status)) {
        throw new Error(`${source.name}: HTTP ${response.status} pour ${source.url}`);
      }
      lastError = new Error(`${source.name}: HTTP ${response.status}`);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith(`${source.name}: HTTP `)) throw error;
      lastError = error;
    }

    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 1_000 * 2 ** attempt));
    }
  }

  if (!response?.ok) {
    throw new Error(`${source.name}: échec après 3 tentatives (${lastError instanceof Error ? lastError.message : "erreur réseau inconnue"})`);
  }

  const payload = await response.text();
  const content = source.base64 ? Buffer.from(payload.trim(), "base64").toString("utf8") : payload;
  for (const marker of source.markers) {
    assert.ok(content.includes(marker), `${source.name}: contenu inattendu, marqueur absent « ${marker} »`);
  }
  process.stdout.write(`Source vérifiée : ${source.name}\n`);
}

async function verifySourcesWithLimit(items, concurrency) {
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      await fetchSource(items[index]);
    }
  });
  await Promise.all(workers);
}

const verifiedSources = [...sources, ...additionalAndroidxSources];
const androidxSourceCount = verifiedSources.filter(({ name }) => name.startsWith("AndroidX ")).length;
assert.equal(androidxSourceCount, 35, "Le registre doit vérifier exactement les 35 fichiers AndroidX documentés");

await verifySourcesWithLimit(verifiedSources, 4);
