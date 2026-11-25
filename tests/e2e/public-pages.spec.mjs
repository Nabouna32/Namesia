import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  { name: "accueil", path: "/" },
  { name: "catalogue", path: "/prenoms" },
  { name: "fiche-alice", path: "/prenoms/alice" }
];

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablette", width: 768, height: 1024 },
  { name: "bureau", width: 1440, height: 1000 }
];

for (const route of routes) {
  test(`${route.name} — rendu responsive et accessibilité`, async ({ browser }, testInfo) => {
    test.setTimeout(120_000);
    const blockingViolations = [];
    const pageErrors = [];
    const overflowIssues = [];

    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        locale: "fr-FR",
        colorScheme: "light",
        reducedMotion: "reduce"
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => pageErrors.push({
        route: route.path,
        viewport: viewport.name,
        message: error.message
      }));

      try {
        const response = await page.goto(route.path, {
          waitUntil: "networkidle",
          timeout: 45_000
        });

        expect(response?.status(), `HTTP ${route.path} en ${viewport.name}`).toBeLessThan(400);
        await expect(page.locator("main h1").first()).toBeVisible();
        await page.evaluate(async () => { await document.fonts.ready; });

        const hasHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        if (hasHorizontalOverflow) {
          overflowIssues.push({ route: route.path, viewport: viewport.name });
        }

        const outputDirectory = join("artifacts", "visual");
        mkdirSync(outputDirectory, { recursive: true });
        const screenshotPath = join(outputDirectory, `${route.name}-${viewport.name}.png`);
        await page.screenshot({
          path: screenshotPath,
          animations: "disabled",
          fullPage: false
        });
        await testInfo.attach(`${route.name}-${viewport.name}`, {
          path: screenshotPath,
          contentType: "image/png"
        });

        if (route.name === "accueil") {
          const searchInput = page.locator('input[type="search"]').first();
          await searchInput.focus();
          await expect.poll(() => searchInput.evaluate((input) => input.matches(":focus-visible"))).toBe(true);
          const focusRing = await searchInput.evaluate((input) => {
            const container = getComputedStyle(input.parentElement);
            return {
              style: container.outlineStyle,
              width: container.outlineWidth,
              color: container.outlineColor,
              radius: container.borderRadius
            };
          });
          expect(focusRing).toMatchObject({
            style: "solid",
            width: "2px",
            radius: "9999px"
          });
          const focusScreenshot = join(outputDirectory, `searchbar-focus-${viewport.name}.png`);
          await page.screenshot({ path: focusScreenshot, animations: "disabled" });
          await testInfo.attach(`searchbar-focus-${viewport.name}`, {
            path: focusScreenshot,
            contentType: "image/png"
          });
        }

        if (viewport.name === "bureau") {
          const fullPagePath = join(outputDirectory, `${route.name}-bureau-complet.png`);
          await page.screenshot({
            path: fullPagePath,
            animations: "disabled",
            fullPage: true
          });
          await testInfo.attach(`${route.name}-bureau-complet`, {
            path: fullPagePath,
            contentType: "image/png"
          });
        }

        const accessibility = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const reportPath = join(outputDirectory, `${route.name}-${viewport.name}.axe.json`);
        writeFileSync(reportPath, JSON.stringify(accessibility, null, 2));
        await testInfo.attach(`${route.name}-${viewport.name}-axe`, {
          path: reportPath,
          contentType: "application/json"
        });

        blockingViolations.push(
          ...accessibility.violations
            .filter((violation) => violation.impact === "critical" || violation.impact === "serious")
            .map((violation) => ({
              route: route.path,
              viewport: viewport.name,
              id: violation.id,
              impact: violation.impact,
              description: violation.description,
              help: violation.help,
              nodes: violation.nodes.map((node) => ({
                target: node.target,
                summary: node.failureSummary
              }))
            }))
        );
      } finally {
        await context.close();
      }
    }

    expect(
      overflowIssues,
      `Débordements horizontaux sur ${route.path}`
    ).toEqual([]);
    expect(
      blockingViolations,
      `Violations axe-core sérieuses ou critiques sur ${route.path}`
    ).toEqual([]);
    expect(pageErrors, `Erreurs JavaScript sur ${route.path}`).toEqual([]);
  });
}
