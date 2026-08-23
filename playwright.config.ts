import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The dev server reads apps/web/.env.local; load it here too so the specs and
 * the server agree on the Sanity project and the domain mapping.
 */
// Playwright loads this config as CommonJS, so __dirname is the config's
// directory and import.meta is unavailable.
const webEnv = join(__dirname, "apps", "web", ".env.local");
if (existsSync(webEnv)) {
  loadEnv({ path: webEnv });
}

const PORT = Number(process.env.E2E_PORT ?? 3000);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * next-intl routes by DOMAIN, not by path prefix, so the locale a request gets
 * depends entirely on its Host. A browser cannot override Host for a top-level
 * navigation, so rather than faking headers we point the Czech domain at plain
 * `localhost` and the English one at `en.localhost`. Browsing to
 * http://localhost:3000 then resolves to "cs", which is what every spec
 * asserts. i18n.spec.ts fails loudly if this mapping is wrong.
 *
 * Both default to "localhost" in routing.ts, and the English domain is matched
 * first, so leaving them unset would resolve every request to English.
 */
const E2E_ENV = {
  NEXT_PUBLIC_CZ_DOMAIN: "localhost",
  NEXT_PUBLIC_EN_DOMAIN: "en.localhost",
};

/**
 * Use a browser that is already on the machine instead of the one Playwright
 * downloads. Set PLAYWRIGHT_CHROMIUM_PATH when the download host is
 * unreachable or the image ships its own Chrome. Unset in normal use.
 */
const chromiumOverride = process.env.PLAYWRIGHT_CHROMIUM_PATH
  ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } }
  : {};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["list"]],
  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], ...chromiumOverride },
      testIgnore: ["**/crawl.spec.ts"],
    },
    // Opt in with `--project=webkit`; not part of the default run.
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testIgnore: ["**/crawl.spec.ts"],
    },
    // Separate project so `test:e2e` can exclude the crawl and `test:crawl`
    // can run only it.
    {
      name: "crawl",
      use: { ...devices["Desktop Chrome"], ...chromiumOverride },
      testMatch: ["**/crawl.spec.ts"],
    },
  ],

  webServer: {
    command: "npm run dev:web",
    // Wait for the port to accept connections rather than for a 2xx at "/".
    // If the homepage is unhealthy we want the specs to fail with a real
    // assertion, not an opaque "timed out waiting for webServer".
    port: PORT,
    reuseExistingServer: true,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
    env: { ...E2E_ENV },
  },
});
