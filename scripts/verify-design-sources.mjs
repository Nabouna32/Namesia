import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const sources = [
  {
    name: "AndroidX Button",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt",
    markers: ["FilledTonalButton", "OutlinedButton", "ButtonDefaults", "public val IconSize: Dp = 18.dp"],
  },
  {
    name: "AndroidX Checkbox",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Checkbox.kt",
    markers: ["Checkbox", "RoundedCornerShape", "StateLayerSize", "focusRingShape", "minimumInteractiveComponentSize", "triStateToggleable"],
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
    markers: ["Snackbar", "SnackbarTokens", "actionOnNewLine", "dismissAction", "OneRowSnackbar", "NewLineButtonSnackbar", "SnackbarTokens.SingleLineContainerHeight", "SnackbarTokens.TwoLinesContainerHeight", "SnackbarTokens.ActionLabelTextColor", "SnackbarTokens.ActionLabelTextFont", "SnackbarTokens.SupportingTextFont"],
  },
  {
    name: "AndroidX Checkbox tokens",
    url: "https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/CheckboxTokens.kt",
    markers: ["get() = 18.0.dp", "get() = 40.0.dp", "StateLayerShape", "ShapeKeyTokens.CornerFull", "StateLayerSize", "FocusIndicatorColor", "ColorSchemeKeyTokens.Secondary", "UnselectedFocusOutlineColor", "ColorSchemeKeyTokens.OnSurface", "UnselectedHoverOutlineColor", "UnselectedPressedOutlineColor", "UnselectedDisabledContainerOpacity = 0.38f"],
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
    markers: ["Variant.FIDELITY", "specVersion", "maybeFallbackSpecVersion", "case Variant.EXPRESSIVE", "case Variant.NEUTRAL", "return '2021';"],
  },
  {
    name: "Material Color Utilities ColorSpec versions",
    url: "https://raw.githubusercontent.com/material-foundation/material-color-utilities/b03ef34bb53a15c3ba41bf963eb3e2c5c353c85f/typescript/dynamiccolor/color_spec.ts",
    markers: ["SpecVersion = '2021'|'2025'", "case '2025'", "Unsupported spec version"],
  },
  {
    name: "Material Color Utilities ColorSpec 2025",
    url: "https://raw.githubusercontent.com/material-foundation/material-color-utilities/b03ef34bb53a15c3ba41bf963eb3e2c5c353c85f/typescript/dynamiccolor/color_spec_2025.ts",
    markers: ["ColorSpecDelegateImpl2025", "extends ColorSpecDelegateImpl2021"],
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

const googleIconCommit = "10ecc14790612ca8fd164e3f4ffe9c16fc50d5b7";
const googleIconSources = [
  {
    name: "Google Material Symbol home",
    registryName: "home",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/home/materialsymbolsrounded/home_24px.svg`,
    markers: [`d="M240-200h120v-200q0-17 11.5-28.5T400-440h160q17 0 28.5 11.5T600-400v200h120v-360L480-740 240-560v360Zm-80 0v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H560q-17 0-28.5-11.5T520-160v-200h-80v200q0 17-11.5 28.5T400-120H240q-33 0-56.5-23.5T160-200Zm320-270Z"`],
  },
  {
    name: "Google Material Symbol home_fill1",
    registryName: "home-filled",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/home/materialsymbolsrounded/home_fill1_24px.svg`,
    markers: [`d="M160-200v-360q0-19 8.5-36t23.5-28l240-180q21-16 48-16t48 16l240 180q15 11 23.5 28t8.5 36v360q0 33-23.5 56.5T720-120H600q-17 0-28.5-11.5T560-160v-200q0-17-11.5-28.5T520-400h-80q-17 0-28.5 11.5T400-360v200q0 17-11.5 28.5T360-120H240q-33 0-56.5-23.5T160-200Z"`],
  },
  {
    name: "Google Material Symbol favorite",
    registryName: "favorite",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/favorite/materialsymbolsrounded/favorite_24px.svg`,
    markers: [`d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Zm-38-543q-29-41-62-62.5T300-774q-60 0-100 40t-40 100q0 52 37 110.5T285.5-410q51.5 55 106 103t88.5 79q34-31 88.5-79t106-103Q726-465 763-523.5T800-634q0-60-40-100t-100-40q-47 0-80 21.5T518-690q-7 10-17 15t-21 5q-11 0-21-5t-17-15Zm38 189Z"`],
  },
  {
    name: "Google Material Symbol favorite_fill1",
    registryName: "favorite-filled",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/favorite/materialsymbolsrounded/favorite_fill1_24px.svg`,
    markers: [`d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Z"`],
  },
  {
    name: "Google Material Symbol search",
    registryName: "search",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/search/materialsymbolsrounded/search_24px.svg`,
    markers: [`d="M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"`],
  },
  {
    name: "Google Material Symbol shuffle",
    registryName: "shuffle",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/shuffle/materialsymbolsrounded/shuffle_24px.svg`,
    markers: [`d="M600-160q-17 0-28.5-11.5T560-200q0-17 11.5-28.5T600-240h64l-99-99q-12-12-11.5-28.5T566-396q12-12 28.5-12t28.5 12l97 98v-62q0-17 11.5-28.5T760-400q17 0 28.5 11.5T800-360v160q0 17-11.5 28.5T760-160H600Zm-428-12q-11-11-11-28t11-28l492-492h-64q-17 0-28.5-11.5T560-760q0-17 11.5-28.5T600-800h160q17 0 28.5 11.5T800-760v160q0 17-11.5 28.5T760-560q-17 0-28.5-11.5T720-600v-64L228-172q-11 11-28 11t-28-11Zm-1-560q-11-11-11-28t11-28q11-11 27.5-11t28.5 11l168 167q11 11 11.5 27.5T395-565q-11 11-28 11t-28-11L171-732Z"`],
  },
  {
    name: "Google Material Symbol compare_arrows",
    registryName: "compare-arrows",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/compare_arrows/materialsymbolsrounded/compare_arrows_24px.svg`,
    markers: [`d="M367-320H120q-17 0-28.5-11.5T80-360q0-17 11.5-28.5T120-400h247l-75-75q-11-11-11-27.5t11-28.5q12-12 28.5-12t28.5 12l143 143q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L348-188q-12 12-28 11.5T292-189q-11-12-11.5-28t11.5-28l75-75Zm226-240 75 75q11 11 11 27.5T668-429q-12 12-28.5 12T611-429L468-572q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l144-144q12-12 28-11.5t28 12.5q11 12 11.5 28T668-715l-75 75h247q17 0 28.5 11.5T880-600q0 17-11.5 28.5T840-560H593Z"`],
  },
  {
    name: "Google Material Symbol check",
    registryName: "check",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/check/materialsymbolsrounded/check_24px.svg`,
    markers: [`d="m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z"`],
  },
  {
    name: "Google Material Symbol close",
    registryName: "close",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/close/materialsymbolsrounded/close_24px.svg`,
    markers: [`d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"`],
  },
  {
    name: "Google Material Symbol chevron_left",
    registryName: "chevron-left",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/chevron_left/materialsymbolsrounded/chevron_left_24px.svg`,
    markers: [`d="m432-480 156 156q11 11 11 28t-11 28q-11 11-28 11t-28-11L348-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 28-11t28 11q11 11 11 28t-11 28L432-480Z"`],
  },
  {
    name: "Google Material Symbol chevron_right",
    registryName: "chevron-right",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/chevron_right/materialsymbolsrounded/chevron_right_24px.svg`,
    markers: [`d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"`],
  },
  {
    name: "Google Material Symbol arrow_outward",
    registryName: "arrow-outward",
    url: `https://raw.githubusercontent.com/google/material-design-icons/${googleIconCommit}/symbols/web/arrow_outward/materialsymbolsrounded/arrow_outward_24px.svg`,
    markers: [`d="M640-624 284-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l356-356H280q-17 0-28.5-11.5T240-720q0-17 11.5-28.5T280-760h400q17 0 28.5 11.5T720-720v400q0 17-11.5 28.5T680-280q-17 0-28.5-11.5T640-320v-304Z"`],
  }
];

const additionalAndroidxSources = [
  ["AlertDialog.kt", ["AlertDialog", "BasicAlertDialog", "DialogMinWidth", "DialogMaxWidth", "AlertDialogFlowRow"]],
  ["DialogTokens.kt", ["DialogTokens", "SurfaceContainerHigh", "ElevationTokens.Level3", "CornerExtraLarge", "HeadlineSmall", "BodyMedium", "LabelLarge", "IconSize"]],
  ["AppBarSmallTokens.kt", "AppBarSmallTokens"],
  ["PaletteTokens.kt", "PaletteTokens"],
  ["BaselineButtonTokens.kt", "BaselineButtonTokens"],
  ["ButtonSmallTokens.kt", "ButtonSmallTokens"],
  ["OutlinedButtonTokens.kt", "OutlinedButtonTokens"],
  ["TextButtonTokens.kt", "TextButtonTokens"],
  ["IconButton.kt", ["IconButton", "minimumInteractiveComponentSize", "smallContainerSize", "48 x 48dp", "24 x 24 dp"]],
  ["IconButtonDefaults.kt", ["smallContainerSize", "standardShape", "LocalContentColor.current", "defaultIconButtonColors", "iconButtonVibrantColors", "StandardIconButtonTokens.Color", "DisabledOpacity"]],
  ["IconButtonTokens.kt", "StandardIconButtonTokens"],
  ["SmallIconButtonTokens.kt", ["ContainerHeight", "40.0.dp", "IconSize", "24.0.dp", "ContainerShapeRound", "CornerFull"]],
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
  ["SnackbarTokens.kt", ["SnackbarTokens", "ActionLabelTextColor", "ActionLabelTextFont", "LabelLarge", "SupportingTextFont", "BodyMedium", "InversePrimary", "ContainerColor", "InverseSurface", "ContainerElevation", "Level3", "ContainerShape", "CornerExtraSmall", "SupportingTextColor", "InverseOnSurface", "IconSize", "24.0.dp", "SingleLineContainerHeight", "48.0.dp", "TwoLinesContainerHeight", "68.0.dp"]],
  ["ElevationTokens.kt", ["ElevationTokens", "Level3", "get() = 6.0.dp"]],
].map(([file, marker]) => ({
  name: `AndroidX ${file}`,
  url: `https://raw.githubusercontent.com/androidx/androidx/919e948eaa351c590e7e6fc89d4014fad7a6e78c/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/${["IconButton.kt", "IconButtonDefaults.kt", "AlertDialog.kt"].includes(file) ? file : `tokens/${file}`}`,
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

const verifiedSources = [...sources, ...googleIconSources, ...additionalAndroidxSources];
const androidxSourceCount = verifiedSources.filter(({ name }) => name.startsWith("AndroidX ")).length;
assert.equal(androidxSourceCount, 39, "Le registre doit vérifier exactement les 39 fichiers AndroidX documentés");
assert.equal(googleIconSources.length, 12, "Le registre doit vérifier les 12 glyphes Material Symbols utilisés");

await verifySourcesWithLimit(verifiedSources, 4);

const iconRegistry = await readFile(new URL("../components/material3/Icon.tsx", import.meta.url), "utf8");
for (const source of googleIconSources) {
  const marker = source.markers[0];
  const path = marker.slice(3, -1);
  const registryKey = /^[a-z][a-zA-Z0-9]*$/.test(source.registryName)
    ? source.registryName
    : `"${source.registryName}"`;
  assert.ok(
    iconRegistry.includes(`${registryKey}: "${path}"`),
    `Icon ${source.registryName}: le tracé ne correspond pas au SVG Google épinglé.`
  );
  process.stdout.write(`Tracé du registre vérifié : ${source.registryName}\\n`);
}
