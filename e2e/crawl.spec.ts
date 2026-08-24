import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { isAllowedConsoleMessage, LOCALE } from "./helpers";

/**
 * Breadth-first crawl of the whole site from "/", asserting the things that
 * should hold on every page. This is the layer that catches a broken link in a
 * corner of the catalog nobody wrote a spec for.
 *
 * Read-only: it follows links and never submits a form or mutates content.
 */
const MAX_PAGES = Number(process.env.CRAWL_MAX_PAGES ?? 300);
const MAX_DEPTH = Number(process.env.CRAWL_MAX_DEPTH ?? 6);

// Specs are compiled as CommonJS by Playwright, so __dirname is available.
const REPORT_DIR = join(__dirname, "reports");

interface PageIssue {
  type:
    | "status"
    | "console"
    | "pageerror"
    | "h1"
    | "img-alt"
    | "lang"
    | "title"
    | "canonical"
    | "jsonld";
  detail: string;
}

interface VisitedPage {
  url: string;
  depth: number;
  status: number;
  ms: number;
  issues: PageIssue[];
  linkedFrom: string | null;
}

/** Strip hash and query so ?page=2 and #section are not separate pages. */
function normalize(rawUrl: string, base: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl, base);
  } catch {
    return null;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  parsed.hash = "";
  parsed.search = "";

  // Drop a trailing slash so "/kontakt" and "/kontakt/" are one page.
  if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }

  return parsed.toString();
}

test.describe("full-site crawl", () => {
  // The whole crawl is one test so the report is written once, at the end.
  test.setTimeout(30 * 60_000);

  test("every reachable page is healthy", async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const start = normalize("/", origin)!;

    const queue: Array<{ url: string; depth: number; from: string | null }> = [
      { url: start, depth: 0, from: null },
    ];
    const seen = new Set<string>([start]);
    const visited: VisitedPage[] = [];
    const externalLinks = new Map<string, string>();

    let truncated = false;

    while (queue.length > 0) {
      if (visited.length >= MAX_PAGES) {
        truncated = true;
        break;
      }

      const { url, depth, from } = queue.shift()!;
      const issues: PageIssue[] = [];

      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      const onConsole = (
        message: import("@playwright/test").ConsoleMessage,
      ) => {
        if (message.type() !== "error") return;
        if (isAllowedConsoleMessage(message.text())) return;
        consoleErrors.push(message.text());
      };
      const onPageError = (error: Error) => {
        if (isAllowedConsoleMessage(error.message)) return;
        pageErrors.push(error.message);
      };

      page.on("console", onConsole);
      page.on("pageerror", onPageError);

      const startedAt = Date.now();
      let status = 0;
      let isHtml = true;

      try {
        const response = await page.goto(url, {
          waitUntil: "domcontentloaded",
        });
        status = response?.status() ?? 0;
        // The site links to a PDF in public/. Everything below asks about an
        // HTML document - a heading, a lang attribute, a canonical - and an
        // asset has none of them by definition, so judging one as a page just
        // manufactures issues nobody can fix.
        const contentType = response?.headers()["content-type"] ?? "";
        isHtml = contentType.includes("html");
        await page
          .waitForLoadState("networkidle", { timeout: 15_000 })
          .catch(() => {
            /* networkidle is best-effort; the map keeps sockets open */
          });
      } catch (error) {
        issues.push({
          type: "status",
          detail: `navigation failed: ${(error as Error).message}`,
        });
      }

      const ms = Date.now() - startedAt;

      // A page linked from the site must not be missing.
      if (status >= 400) {
        issues.push({
          type: "status",
          detail: `HTTP ${status}${from ? ` (linked from ${from})` : ""}`,
        });
      }

      if (status > 0 && status < 400 && isHtml) {
        const h1Count = await page.locator("h1").count();
        if (h1Count !== 1) {
          issues.push({ type: "h1", detail: `${h1Count} h1 elements` });
        }

        const imagesWithoutAlt = await page.$$eval("img", (images) =>
          images
            .filter((img) => !img.hasAttribute("alt"))
            .map((img) => img.getAttribute("src") ?? "(no src)"),
        );
        for (const src of imagesWithoutAlt) {
          issues.push({ type: "img-alt", detail: `img without alt: ${src}` });
        }

        const lang = await page
          .locator("html")
          .getAttribute("lang")
          .catch(() => null);
        if (lang !== LOCALE) {
          issues.push({
            type: "lang",
            detail: `html lang is "${lang}", expected "${LOCALE}"`,
          });
        }

        const title = (await page.title()).trim();
        if (!title) {
          issues.push({ type: "title", detail: "empty <title>" });
        }

        /*
         * Every page has to name itself.
         *
         * A missing canonical is the failure mode this crawl is best placed to
         * catch: the catalog produces an unbounded number of URLs that differ
         * only by query string, and one route forgetting its canonical is
         * enough to have all of them indexed separately. Being absolute is
         * part of the check because the site is served from two domains, and a
         * relative canonical resolves against whichever one served the page.
         */
        const canonicals = await page.$$eval('link[rel="canonical"]', (links) =>
          links.map((link) => link.getAttribute("href") ?? ""),
        );

        if (canonicals.length === 0) {
          issues.push({ type: "canonical", detail: "no canonical link" });
        } else if (canonicals.length > 1) {
          issues.push({
            type: "canonical",
            detail: `${canonicals.length} canonical links: ${canonicals.join(", ")}`,
          });
        } else if (!/^https?:\/\//.test(canonicals[0])) {
          issues.push({
            type: "canonical",
            detail: `canonical is not absolute: ${canonicals[0]}`,
          });
        }

        /*
         * Structured data is optional, but broken structured data is worse
         * than none: a block that does not parse is discarded silently by
         * every consumer, so nothing downstream would ever report it. The
         * payloads are built from editor-entered content, which is exactly the
         * kind of input that breaks JSON.
         */
        const jsonLdBlocks = await page.$$eval(
          'script[type="application/ld+json"]',
          (scripts) => scripts.map((script) => script.textContent ?? ""),
        );

        for (const [index, block] of jsonLdBlocks.entries()) {
          try {
            const parsed = JSON.parse(block);
            if (!parsed || typeof parsed !== "object") {
              issues.push({
                type: "jsonld",
                detail: `ld+json block ${index} is not an object`,
              });
            }
          } catch (error) {
            issues.push({
              type: "jsonld",
              detail: `ld+json block ${index} is not valid JSON: ${
                (error as Error).message
              }`,
            });
          }
        }

        // Collect links before detaching the listeners.
        if (depth < MAX_DEPTH) {
          const hrefs = await page.$$eval("a[href]", (anchors) =>
            anchors.map((a) => a.getAttribute("href") ?? ""),
          );

          for (const href of hrefs) {
            const absolute = normalize(href, url);
            if (!absolute) continue;

            if (!absolute.startsWith(origin)) {
              if (!externalLinks.has(absolute)) {
                externalLinks.set(absolute, url);
              }
              continue;
            }

            if (seen.has(absolute)) continue;
            seen.add(absolute);
            queue.push({ url: absolute, depth: depth + 1, from: url });
          }
        }
      }

      page.off("console", onConsole);
      page.off("pageerror", onPageError);

      for (const detail of consoleErrors)
        issues.push({ type: "console", detail });
      for (const detail of pageErrors)
        issues.push({ type: "pageerror", detail });

      visited.push({
        url,
        depth,
        status,
        ms,
        issues,
        linkedFrom: from,
      });
    }

    // ---------------------------------------------------------------- report

    const brokenLinks = visited
      .filter((entry) => entry.status >= 400 || entry.status === 0)
      .map((entry) => ({
        url: entry.url,
        status: entry.status,
        linkedFrom: entry.linkedFrom,
      }));

    const pagesWithIssues = visited.filter((entry) => entry.issues.length > 0);
    const slowest = [...visited].sort((a, b) => b.ms - a.ms).slice(0, 10);

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl: origin,
      limits: { maxPages: MAX_PAGES, maxDepth: MAX_DEPTH, truncated },
      totals: {
        visited: visited.length,
        withIssues: pagesWithIssues.length,
        brokenLinks: brokenLinks.length,
        externalLinks: externalLinks.size,
      },
      pages: visited,
      brokenLinks,
      externalLinks: [...externalLinks.entries()].map(([url, foundOn]) => ({
        url,
        foundOn,
      })),
      slowest: slowest.map((entry) => ({ url: entry.url, ms: entry.ms })),
    };

    await mkdir(REPORT_DIR, { recursive: true });
    await writeFile(
      `${REPORT_DIR}/crawl.json`,
      JSON.stringify(report, null, 2),
      "utf8",
    );

    const issueLines = pagesWithIssues
      .map(
        (entry) =>
          `### ${entry.url}\n\n` +
          `status ${entry.status} · depth ${entry.depth} · ${entry.ms}ms\n\n` +
          entry.issues
            .map((issue) => `- **${issue.type}** - ${issue.detail}`)
            .join("\n"),
      )
      .join("\n\n");

    const markdown = `# Crawl report

Generated: ${report.generatedAt}
Base URL: ${origin}
Limits: maxPages=${MAX_PAGES}, maxDepth=${MAX_DEPTH}${
      truncated ? " **(hit the page cap - not exhaustive)**" : ""
    }

## Summary

| metric | count |
| --- | --- |
| pages visited | ${visited.length} |
| pages with issues | ${pagesWithIssues.length} |
| broken links | ${brokenLinks.length} |
| external links (listed, not visited) | ${externalLinks.size} |

## Broken links

${
  brokenLinks.length === 0
    ? "None."
    : brokenLinks
        .map(
          (link) =>
            `- \`${link.url}\` returned **${link.status}** (linked from ${
              link.linkedFrom ?? "the start URL"
            })`,
        )
        .join("\n")
}

## Pages with issues

${issueLines || "None."}

## Slowest 10 pages

${slowest.map((entry) => `- ${entry.ms}ms - \`${entry.url}\``).join("\n")}

## External links

${
  externalLinks.size === 0
    ? "None."
    : [...externalLinks.entries()]
        .map(([url, foundOn]) => `- \`${url}\` (from \`${foundOn}\`)`)
        .join("\n")
}
`;

    await writeFile(`${REPORT_DIR}/crawl-report.md`, markdown, "utf8");

    console.log(
      `\nCrawled ${visited.length} pages - ${pagesWithIssues.length} with issues, ` +
        `${brokenLinks.length} broken links. Report: e2e/reports/crawl-report.md`,
    );

    if (truncated) {
      console.log(
        `NOTE: stopped at the ${MAX_PAGES}-page cap; coverage is not exhaustive. ` +
          `Raise CRAWL_MAX_PAGES to go further.`,
      );
    }

    // A linked page that 404s is a broken link and fails the run.
    expect(
      brokenLinks.map((link) => `${link.url} -> ${link.status}`),
      "broken links found; see e2e/reports/crawl-report.md",
    ).toEqual([]);

    const hardFailures = pagesWithIssues.flatMap((entry) =>
      entry.issues
        .filter(
          (issue) => issue.type === "console" || issue.type === "pageerror",
        )
        .map((issue) => `${entry.url}: [${issue.type}] ${issue.detail}`),
    );

    expect(
      hardFailures,
      "console errors or uncaught exceptions; see e2e/reports/crawl-report.md",
    ).toEqual([]);

    const contentFailures = pagesWithIssues.flatMap((entry) =>
      entry.issues
        .filter(
          (issue) => issue.type !== "console" && issue.type !== "pageerror",
        )
        .map((issue) => `${entry.url}: [${issue.type}] ${issue.detail}`),
    );

    expect(
      contentFailures,
      "structural issues; see e2e/reports/crawl-report.md",
    ).toEqual([]);
  });
});
