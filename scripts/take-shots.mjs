/**
 * Capture the six screenshots the root README references.
 *
 * The four web shots run unattended against a dev server. The two Studio shots
 * need an authenticated session, so `--studio` opens a headed browser and waits
 * for you to log in before capturing.
 *
 * Usage:
 *   npm run dev:web                  # in one terminal
 *   npm run shots                    # the four web shots
 *
 *   npm run dev:studio               # in one terminal
 *   npm run shots -- --studio        # the two Studio shots (headed, interactive)
 *
 * Options:
 *   --base <url>     web dev server (default http://localhost:3000)
 *   --studio-url <url>  studio dev server (default http://localhost:3333)
 *   --studio         capture the Studio shots instead of the web ones
 *
 * The catalog and detail routes are discovered by following links from the
 * catalog index rather than hard-coded, because the geography slugs are content
 * and differ per dataset.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "docs", "images");

function getArg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index !== -1 ? process.argv[index + 1] : fallback;
}

const BASE = getArg("base", "http://localhost:3000");
const STUDIO = getArg("studio-url", "http://localhost:3333");
const studioMode = process.argv.includes("--studio");

const DESKTOP = { width: 1440, height: 900 };
const DESKTOP_TALL = { width: 1440, height: 1000 };
const MOBILE = { width: 390, height: 844 };

/**
 * Wait for the page to stop moving before the shutter.
 *
 * `networkidle` alone is not enough: the map keeps sockets open, and lazy
 * images below the fold only start loading once they scroll into view. So this
 * scrolls to the bottom and back, then waits for every `<img>` to report
 * complete - a screenshot with a half-loaded hero is worse than no screenshot.
 */
async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page
    .waitForLoadState("networkidle", { timeout: 15_000 })
    .catch(() => {});

  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        y += window.innerHeight;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) {
          requestAnimationFrame(step);
        } else {
          window.scrollTo(0, 0);
          resolve();
        }
      };
      step();
    });
  });

  await page
    .waitForFunction(
      () =>
        Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
      null,
      { timeout: 20_000 },
    )
    .catch(() => console.warn("  ! some images never finished loading"));

  // One more frame for any CSS transition the scroll kicked off.
  await page.waitForTimeout(500);
}

async function shoot(context, { file, url, viewport, fullPage = false }) {
  const page = await context.newPage();
  await page.setViewportSize(viewport);
  console.log(`  → ${file}  ${viewport.width}×${viewport.height}  ${url}`);
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  const status = response?.status() ?? 0;
  if (status >= 400) {
    await page.close();
    throw new Error(`${url} returned ${status} - is the dev server pointed at a dataset with content?`);
  }
  await settle(page);
  await page.screenshot({ path: join(OUT, file), fullPage });
  await page.close();
}

/** Follow a link from the catalog index so the slugs come from the dataset. */
async function discover(context) {
  const page = await context.newPage();
  await page.setViewportSize(DESKTOP);
  await page.goto(`${BASE}/katalog`, { waitUntil: "domcontentloaded" });
  await settle(page);

  const regionHref = await page
    .locator('a[href^="/katalog/"]')
    .first()
    .getAttribute("href")
    .catch(() => null);

  let detailHref = null;
  if (regionHref) {
    await page.goto(`${BASE}${regionHref}`, { waitUntil: "domcontentloaded" });
    await settle(page);
    // A group detail sits deeper than the region it was reached from.
    const depth = regionHref.split("/").filter(Boolean).length;
    detailHref = await page
      .locator('a[href^="/katalog/"]')
      .evaluateAll(
        (links, d) =>
          links
            .map((a) => a.getAttribute("href") ?? "")
            .find((href) => href.split("/").filter(Boolean).length > d) ?? null,
        depth,
      )
      .catch(() => null);
  }

  await page.close();
  return { regionHref, detailHref };
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({
    headless: !studioMode,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
  });
  const context = await browser.newContext({ deviceScaleFactor: 2 });

  try {
    if (studioMode) {
      console.log(`\nStudio shots from ${STUDIO}\n`);
      const page = await context.newPage();
      await page.setViewportSize(DESKTOP);
      await page.goto(STUDIO, { waitUntil: "domcontentloaded" });

      const rl = createInterface({ input: process.stdin, output: process.stdout });
      await rl.question(
        "\n  Log in to the Studio in the browser window, open the desk so the\n" +
          "  sidebar sections are visible, then press Enter here...\n",
      );
      await page.screenshot({ path: join(OUT, "studio-structure.png") });
      console.log("  → studio-structure.png");

      await rl.question(
        "\n  Now open the Groups list (grouped by language), then press Enter...\n",
      );
      await page.screenshot({ path: join(OUT, "studio-schools-list.png") });
      console.log("  → studio-schools-list.png");
      rl.close();
      await page.close();
    } else {
      console.log(`\nWeb shots from ${BASE}\n`);
      await shoot(context, { file: "home-desktop.png", url: BASE, viewport: DESKTOP });
      await shoot(context, { file: "home-mobile.png", url: BASE, viewport: MOBILE });

      const { regionHref, detailHref } = await discover(context);

      if (regionHref) {
        await shoot(context, {
          file: "catalog-region.png",
          url: `${BASE}${regionHref}`,
          viewport: DESKTOP_TALL,
        });
      } else {
        console.warn("  ! no catalog link found - skipping catalog-region.png");
      }

      if (detailHref) {
        await shoot(context, {
          file: "school-detail.png",
          url: `${BASE}${detailHref}`,
          viewport: DESKTOP_TALL,
        });
      } else {
        console.warn("  ! no group detail link found - skipping school-detail.png");
      }
    }

    console.log(`\nWrote to ${OUT}\n`);
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error("\nshots failed:", error.message);
  process.exit(1);
});
