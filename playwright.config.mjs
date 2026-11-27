import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL;
const diagnosticsEnabled = process.env.PLAYWRIGHT_DIAGNOSTICS === "true";

if (!baseURL) {
  throw new Error("PLAYWRIGHT_BASE_URL est requis pour auditer une Workers Preview.");
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"]],
  outputDir: "test-results",
  use: {
    baseURL,
    browserName: "chromium",
    headless: true,
    locale: "fr-FR",
    colorScheme: "light",
    reducedMotion: "reduce",
    screenshot: diagnosticsEnabled ? "only-on-failure" : "off",
    video: "off",
    trace: diagnosticsEnabled ? "retain-on-failure" : "off"
  }
});
