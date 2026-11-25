import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  { name: "accueil", path: "/" },
  { name: "catalogue", path: "/prenoms" },
  { name: "fiche-alice", path: "/prenoms/alice" }
];

const responsiveViewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablette", width: 768, height: 1024 }
];

test("les trois parcours publics essentiels sont disponibles sur bureau", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const route of routes) {
    const response = await page.goto(route.path, {
      waitUntil: "domcontentloaded",
      timeout: 30_000
    });

    expect(response?.status(), `HTTP ${route.path}`).toBeLessThan(400);
    await expect(page.locator("main h1").first()).toBeVisible();

    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    if (accessibility.violations.length > 0) {
      console.warn(
        `Audit axe-core consultatif pour ${route.path} : ${JSON.stringify(
          accessibility.violations.map(({ id, impact, help, nodes }) => ({
            id,
            impact,
            help,
            targets: nodes.map((node) => node.target)
          }))
        )}`
      );
    }
  }

  expect(pageErrors, "Erreurs JavaScript sur les parcours publics").toEqual([]);
});

test("l’accueil reste utilisable sur mobile et tablette", async ({ page }) => {
  for (const viewport of responsiveViewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const response = await page.goto("/", {
      waitUntil: "domcontentloaded",
      timeout: 30_000
    });

    expect(response?.status(), `HTTP accueil en ${viewport.name}`).toBeLessThan(400);
    await expect(page.locator("main h1").first()).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalOverflow, `Débordement horizontal en ${viewport.name}`).toBe(false);
  }
});
\n