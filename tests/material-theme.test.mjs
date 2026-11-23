import test from "node:test";
import assert from "node:assert/strict";
import {
  argbFromHex,
  DynamicScheme,
  Hct,
  hexFromArgb,
  Variant
} from "@material/material-color-utilities";

const sourceColor = Hct.fromInt(argbFromHex("#6750A4"));
const roles = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "secondaryContainer",
  "tertiary",
  "tertiaryContainer",
  "error",
  "background",
  "onBackground",
  "surface",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "onSurface",
  "onSurfaceVariant",
  "outline",
  "outlineVariant"
];

function createScheme(isDark) {
  return new DynamicScheme({
    sourceColorHct: sourceColor,
    variant: Variant.EXPRESSIVE,
    contrastLevel: 0,
    isDark,
    platform: "phone",
    specVersion: "2025"
  });
}

test("le schéma Material 3 Expressive expose les rôles nécessaires", () => {
  const scheme = createScheme(false);

  assert.equal(scheme.variant, Variant.EXPRESSIVE);
  assert.equal(scheme.specVersion, "2025");

  for (const role of roles) {
    const color = Reflect.get(scheme, role);
    assert.equal(typeof color, "number", `Le rôle ${role} doit être calculé`);
    assert.match(hexFromArgb(color), /^#[0-9a-f]{6}$/i);
  }
});

test("les schémas clair et sombre sont distincts", () => {
  const clair = createScheme(false);
  const sombre = createScheme(true);

  assert.notEqual(clair.primary, sombre.primary);
  assert.notEqual(clair.surface, sombre.surface);
  assert.notEqual(clair.onSurface, sombre.onSurface);
});
