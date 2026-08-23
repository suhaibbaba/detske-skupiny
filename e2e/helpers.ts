import { expect, type Page, type ConsoleMessage } from "@playwright/test";

/** Czech path segments, mirroring pathnames in apps/web/src/i18n/routing.ts. */
export const PATHS = {
  home: "/",
  catalog: "/katalog",
  articles: "/clanky",
  groups: "/skupiny",
  cooperation: "/spoluprace",
  contact: "/kontakt",
} as const;

export const LOCALE = "cs";

/**
 * Console noise that is not the app's fault and must not fail a spec.
 *
 * Keep this list short and justified - every entry is a thing we have decided
 * not to see. Anything not listed here is treated as a real error.
 */
export const CONSOLE_ALLOWLIST: RegExp[] = [
  // MapTiler/mapbox-gl abort in-flight tile and glyph requests whenever the
  // viewport moves or the map unmounts; the browser reports the cancelled
  // fetch as an error even though nothing is wrong.
  /maptiler/i,
  /mapbox/i,
  /AbortError/i,
  /Failed to load resource.*(tile|glyph|sprite)/i,
  // Google Maps and analytics beacons are third-party and blocked in CI.
  /pirsch/i,
  /googleapis\.com/i,
  // React DevTools nag.
  /Download the React DevTools/i,
  // Next dev-only HMR chatter.
  /\[Fast Refresh\]/i,
];

export function isAllowedConsoleMessage(text: string): boolean {
  return CONSOLE_ALLOWLIST.some((pattern) => pattern.test(text));
}

export interface PageProblems {
  consoleErrors: string[];
  pageErrors: string[];
}

/**
 * Start collecting console errors and uncaught exceptions. Call before
 * navigating, assert after.
 */
export function watchForProblems(page: Page): PageProblems {
  const problems: PageProblems = { consoleErrors: [], pageErrors: [] };

  page.on("console", (message: ConsoleMessage) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (isAllowedConsoleMessage(text)) return;
    problems.consoleErrors.push(text);
  });

  page.on("pageerror", (error: Error) => {
    if (isAllowedConsoleMessage(error.message)) return;
    problems.pageErrors.push(error.message);
  });

  return problems;
}

export function expectNoProblems(problems: PageProblems) {
  expect(
    problems.pageErrors,
    `uncaught exceptions:\n${problems.pageErrors.join("\n")}`,
  ).toEqual([]);
  expect(
    problems.consoleErrors,
    `console errors:\n${problems.consoleErrors.join("\n")}`,
  ).toEqual([]);
}

/**
 * The first catalog link on the page, used to walk down the catalog tree
 * without hard-coding slugs that only exist in one dataset.
 */
export async function firstCatalogHref(page: Page): Promise<string | null> {
  const links = page.locator(`a[href^="${PATHS.catalog}/"]`);
  const count = await links.count();

  for (let i = 0; i < count; i += 1) {
    const href = await links.nth(i).getAttribute("href");
    if (href) return href;
  }
  return null;
}

/** Depth of a /katalog/... path: 1 = country, 4 = subarea. */
export function catalogDepth(href: string): number {
  return href
    .split("?")[0]
    .replace(`${PATHS.catalog}/`, "")
    .split("/")
    .filter(Boolean).length;
}

/** Wait for whichever of the page's main landmarks settles first. */
export async function waitForContent(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await expect(page.locator("body")).toBeVisible();
}
