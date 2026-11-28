import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  { name: "accueil", path: "/" },
  { name: "catalogue", path: "/prenoms" },
  { name: "fiche-alice", path: "/prenoms/alice" }
];

const responsiveViewports = [
  { name: "mobile-etroit", width: 320, height: 740 },
  { name: "mobile", width: 390, height: 844 },
  { name: "medium-minimum", width: 600, height: 900 },
  { name: "tablette", width: 768, height: 1024 },
  { name: "hauteur-compacte", width: 768, height: 420 },
  { name: "expanded", width: 840, height: 900 },
  { name: "bureau-large", width: 1280, height: 900 }
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

test("l’accueil reste utilisable sur les classes de fenêtre Material et en hauteur compacte", async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: "light" });
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

    if (process.env.PLAYWRIGHT_DIAGNOSTICS === "true") {
      await page.screenshot({
        path: testInfo.outputPath(`accueil-${viewport.name}.png`),
        fullPage: true
      });
      if (viewport.name === "mobile") {
        await page.screenshot({
          path: testInfo.outputPath("accueil-mobile-premier-ecran.png")
        });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.screenshot({
          path: testInfo.outputPath("accueil-mobile-bas-de-page.png")
        });
      }
    }
  }
});


test("les fiches restent consultables sans compte et les favoris renvoient vers la connexion sur mobile", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const viewport of [
    { name: "mobile", width: 390, height: 844 },
    { name: "medium-minimum", width: 600, height: 900 },
    { name: "expanded", width: 840, height: 900 }
  ]) {
    await page.emulateMedia({ colorScheme: "light" });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const response = await page.goto("/prenoms/alice", {
      waitUntil: "domcontentloaded",
      timeout: 30_000
    });

    expect(response?.status(), `HTTP fiche Alice en ${viewport.name}`).toBeLessThan(400);
    await expect(page.locator("main h1").first()).toBeVisible();
    const relatedChevron = page.locator(".profile-discovery .card-arrow svg").first();
    await expect(relatedChevron).toBeVisible();
    const readingColumnWidth = await page.locator(".profile-sections").evaluate((element) => element.getBoundingClientRect().width);
    expect(readingColumnWidth, `Largeur de lecture en ${viewport.name}`).toBeGreaterThan(300);
    if (process.env.PLAYWRIGHT_DIAGNOSTICS === "true") {
      await page.screenshot({
        path: testInfo.outputPath(`fiche-alice-${viewport.name}-clair.png`),
        fullPage: true
      });
      if (viewport.name === "mobile") {
        await page.screenshot({
          path: testInfo.outputPath("fiche-alice-mobile-premier-ecran.png")
        });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.screenshot({
          path: testInfo.outputPath("fiche-alice-mobile-bas-de-page.png")
        });
      }
    }
  }

  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/prenoms/alice", { waitUntil: "domcontentloaded", timeout: 30_000 });
  if (process.env.PLAYWRIGHT_DIAGNOSTICS === "true") {
    await page.screenshot({
      path: testInfo.outputPath("fiche-alice-mobile-sombre.png"),
      fullPage: true
    });
  }

  const favoriteLink = page.getByRole("link", { name: "Se connecter pour enregistrer" });
  await expect(favoriteLink).toBeVisible();
  await expect(favoriteLink).toBeEnabled();
  await expect(favoriteLink).toHaveAttribute("href", "/compte?redirect=%2Fprenoms%2Falice");
  await expect(page.getByText("Les favoris sont conservés dans votre compte et synchronisés entre vos appareils.")).toBeVisible();
});


test("les parcours secondaires disposent de captures diagnostiques pleine page", async ({ page }, testInfo) => {
  test.skip(process.env.PLAYWRIGHT_DIAGNOSTICS !== "true", "Captures temporaires réservées à la revue visuelle.");

  const routesToCapture = [
    { name: "catalogue", path: "/prenoms" },
    { name: "comparateur", path: "/comparer" },
    { name: "favoris", path: "/favoris" },
    { name: "compte", path: "/compte" }
  ];
  const viewports = [
    { name: "mobile", width: 390, height: 844 },
    { name: "expanded", width: 1280, height: 900 }
  ];

  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme });
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      for (const route of routesToCapture) {
        const response = await page.goto(route.path, {
          waitUntil: "domcontentloaded",
          timeout: 30_000
        });
        expect(response?.status(), `HTTP ${route.path} en ${viewport.name} / ${theme}`).toBeLessThan(400);
        await expect(page.locator("main h1").first()).toBeVisible();
        if (route.name === "favoris") {
          await expect(page.getByRole("link", { name: "Se connecter" })).toBeVisible();
        }
        await page.screenshot({
          path: testInfo.outputPath(`${route.name}-${viewport.name}-${theme}.png`),
          fullPage: true
        });
      }
    }
  }
});


test("l’accueil dispose d’une capture pleine page en thème sombre", async ({ page }, testInfo) => {
  test.skip(process.env.PLAYWRIGHT_DIAGNOSTICS !== "true", "Capture temporaire réservée à la revue visuelle.");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30_000 });
  expect(response?.status(), "HTTP accueil sombre").toBeLessThan(400);
  await expect(page.locator("main h1").first()).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("accueil-mobile-sombre.png"),
    fullPage: true
  });
});
