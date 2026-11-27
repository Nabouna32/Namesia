import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  { name: "accueil", path: "/" },
  { name: "catalogue", path: "/prenoms" },
  { name: "fiche-alice", path: "/prenoms/alice" },
  { name: "tendances", path: "/tendances" },
  { name: "favoris", path: "/favoris" },
  { name: "comparateur", path: "/comparer" }
];

const responsiveViewports = [
  { name: "mobile compact", width: 320, height: 740 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablette", width: 768, height: 1024 }
];

test("les pages publiques essentielles sont disponibles sur bureau", async ({ page }) => {
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

    expect(
      accessibility.violations,
      `Violations axe-core sur ${route.path} : ${JSON.stringify(
        accessibility.violations.map(({ id, impact, help, nodes }) => ({
          id,
          impact,
          help,
          targets: nodes.map((node) => node.target)
        }))
      )}`
    ).toEqual([]);
  }

  expect(pageErrors, "Erreurs JavaScript sur les parcours publics").toEqual([]);
});

test("la recherche d’accueil propose une correction et ouvre la fiche", async ({ page }) => {
  const response = await page.goto("/", {
    waitUntil: "domcontentloaded",
    timeout: 30_000
  });

  expect(response?.status(), "HTTP accueil pour la recherche").toBeLessThan(400);
  const search = page.getByRole("searchbox", { name: "Rechercher un prénom" });
  await search.fill("Alicee");

  await expect(
    page.getByText("Aucun résultat exact pour « Alicee ». Voici les prénoms les plus proches :")
  ).toBeVisible();

  const suggestion = page.locator('.search-compact a[href="/prenoms/alice"]');
  await expect(suggestion).toBeVisible();
  await suggestion.click();

  await expect(page).toHaveURL(/\/prenoms\/alice$/);
  await expect(page.locator("main h1").first()).toContainText("Alice");
});

test("les pages publiques ne débordent pas sur un écran de 320 pixels", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });

  for (const route of routes) {
    const response = await page.goto(route.path, {
      waitUntil: "domcontentloaded",
      timeout: 30_000
    });

    expect(response?.status(), `HTTP ${route.path} à 320 px`).toBeLessThan(400);
    await expect(page.locator("main h1").first()).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));

    expect(
      dimensions.scrollWidth,
      `Débordement horizontal sur ${route.path} à 320 px (largeur utile : ${dimensions.clientWidth})`
    ).toBeLessThanOrEqual(dimensions.clientWidth);
  }
});

test("les tendances régionales ouvrent les fiches Namesia déjà publiées", async ({ page }) => {
  const response = await page.goto("/tendances", {
    waitUntil: "domcontentloaded",
    timeout: 30_000
  });

  expect(response?.status(), "HTTP tendances").toBeLessThan(400);
  const regionalSection = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Le palmarès varie aussi selon les régions" })
  });
  await expect(regionalSection.getByRole("link", { name: "Gabriel", exact: true }))
    .toHaveAttribute("href", "/prenoms/gabriel");
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

    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(
      accessibility.violations,
      `Violations axe-core sur l’accueil en ${viewport.name} : ${JSON.stringify(
        accessibility.violations.map(({ id, impact, help, nodes }) => ({
          id,
          impact,
          help,
          targets: nodes.map((node) => node.target)
        }))
      )}`
    ).toEqual([]);
  }
});


test("le comparateur restaure et synchronise sa sélection depuis l’URL", async ({ page }) => {
  const response = await page.goto("/comparer?prenoms=alice,gabriel", {
    waitUntil: "domcontentloaded",
    timeout: 30_000
  });

  expect(response?.status(), "HTTP comparateur préselectionné").toBeLessThan(400);
  const alice = page.locator(".compare-option").filter({ hasText: "Alice" }).locator("input");
  const gabriel = page.locator(".compare-option").filter({ hasText: "Gabriel" }).locator("input");

  await expect(alice).toBeChecked();
  await expect(gabriel).toBeChecked();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByRole("rowheader", { name: "Origine & signification" })).toBeVisible();

  await page.getByRole("button", { name: "Retirer Gabriel de la sélection" }).click();
  await expect(page).toHaveURL(/\/comparer\?prenoms=alice$/);
  await expect(alice).toBeChecked();
  await expect(gabriel).not.toBeChecked();
  await expect(page.getByRole("table")).toHaveCount(0);
  await expect(page.getByText("Choisissez encore un prénom pour lancer la comparaison.")).toBeVisible();
});

test("un favori peut être annulé puis retrouvé après rechargement sur mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto("/prenoms/alice", {
    waitUntil: "domcontentloaded",
    timeout: 30_000
  });

  expect(response?.status(), "HTTP fiche Alice").toBeLessThan(400);
  const favoriteButton = page.locator("button[aria-pressed]").first();
  await expect(favoriteButton).toBeEnabled();

  await favoriteButton.click();
  await expect(favoriteButton).toHaveAttribute("aria-pressed", "true");
  const snackbar = page.locator('[role="status"]').filter({ hasText: "Alice ajouté aux favoris" });
  await expect(snackbar).toBeVisible();
  await page.getByRole("button", { name: "Annuler" }).click();
  await expect(favoriteButton).toHaveAttribute("aria-pressed", "false");
  await expect(snackbar).toHaveCount(0);

  await favoriteButton.click();
  await expect(favoriteButton).toHaveAttribute("aria-pressed", "true");
  await expect(snackbar).toBeVisible();
  await page.getByRole("button", { name: "Fermer le message" }).click();
  await expect(favoriteButton).toHaveAttribute("aria-pressed", "true");
  await expect(snackbar).toHaveCount(0);

  await page.goto("/favoris", { waitUntil: "domcontentloaded" });
  const favoriteCard = page.locator(".name-grid").getByText("Alice", { exact: true });
  await expect(favoriteCard).toBeVisible();

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(favoriteCard).toBeVisible();
});
