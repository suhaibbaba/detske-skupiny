# Testing

Three layers, all runnable locally with npm scripts. The CI gates they enforce
are summarised in the [README](../README.md#testing); this is the detail.

| Layer | Command | What it covers | Needs Sanity? |
| --- | --- | --- | --- |
| Unit (Vitest) | `npm run test` | pure functions, the contact and revalidate routes, every GROQ query, component smoke tests | no |
| E2E (Playwright) | `npm run test:e2e` | one spec per route, against a real dev server | yes |
| Crawl (Playwright) | `npm run test:crawl` | every reachable page, breadth-first | yes |

`npm run test:all` runs all three in order.

**Current counts:** 364 unit tests in 23 files; 88 e2e tests in 12 files; 1
crawl test. Counts are a footnote — the gates are the point.

## Unit tests

```bash
npm run test                      # all workspaces
npm run test -w apps/web          # web only
npm run test:watch -w apps/web    # watch mode
```

Tests live next to the code they cover as `*.test.ts` / `*.test.tsx`. Vitest
runs two projects: pure functions in `node`, anything that renders in `jsdom`.
No network, no Sanity, no env setup — `vitest.config.ts` injects dummy values
for the few modules that build a Sanity client at import time.

`src/lib/sanity/queries.test.ts` is the exception worth knowing about: it parses
every exported GROQ query with `groq-js` and evaluates the migrated ones against
a small synthetic dataset. The queries are assembled from shared fragments, and
a fragment that expands to something ungrammatical produces a query that fails
only when Sanity is asked to run it — which neither a build nor any other unit
test would notice.

## E2E tests

E2E drives a real dev server against a **real Sanity dataset**, so it needs
credentials. Every spec is read-only: nothing submits a form against the live
API (the contact specs stub `/api/contact`) and nothing writes content.

```bash
cp apps/web/.env.example apps/web/.env.local   # fill in the Sanity values
npm run test:e2e                               # chromium
npx playwright test --project=webkit           # optional second browser
npx playwright test e2e/catalog.spec.ts        # a single spec
npx playwright test --ui                       # interactive
```

Playwright starts `npm run dev:web` itself and reuses an already-running server
if one is listening on port 3000.

**Locale routing.** `next-intl` picks the locale from the request's domain, and
a browser cannot fake a `Host` header on a navigation. `playwright.config.ts`
therefore maps the Czech domain onto plain `localhost` and English onto
`en.localhost`, so `http://localhost:3000` resolves to `cs` — which is what
every spec asserts. `e2e/i18n.spec.ts` fails loudly if that mapping breaks.

**Using a browser you already have.** If the Playwright download host is
unreachable, point it at an existing Chrome:

```bash
PLAYWRIGHT_CHROMIUM_PATH=/path/to/chrome npm run test:e2e
```

### Specs

| Spec | Tests | Covers |
| --- | ---: | --- |
| `home.spec.ts` | 7 | homepage, header nav, footer, images, console errors |
| `catalog.spec.ts` | 12 | school list, filters, search, load-more |
| `catalog-levels.spec.ts` | 2 | walks country → region → area → subarea through the UI |
| `school.spec.ts` | 6 | catalog → detail: name, address, map |
| `article.spec.ts` | 10 | articles index → article, rich text, images actually loaded, internal links resolve |
| `groups-index.spec.ts` | 3 | group listing and card links |
| `cooperation.spec.ts` | 7 | the remaining static routes (cooperation, contact) |
| `not-found.spec.ts` | 11 | bad catalog depth and bad slugs → 404, never 500 |
| `contact.spec.ts` | 7 | consent gating, honeypot, success and error states |
| `i18n.spec.ts` | 5 | `html lang="cs"`, Czech paths, language switcher target |
| `seo.spec.ts` | 11 | canonicals, metadata, structured data, robots and sitemap |
| `a11y.spec.ts` | 7 | axe on home, catalog and school detail |

`a11y.spec.ts` **fails** on serious and critical violations, but prints every
violation it finds so the backlog stays visible.

## Full-site crawl

```bash
npm run test:crawl
CRAWL_MAX_PAGES=50 CRAWL_MAX_DEPTH=3 npm run test:crawl
```

Breadth-first from `/`, following same-origin links only (external links are
listed, never visited). Defaults: 300 pages, depth 6.

On every page it checks:

- the status is under 400 — a linked page that 404s is a broken link and fails
  the run;
- there are no console errors or uncaught exceptions;
- there is exactly one `h1` and exactly one `<main>`;
- a skip link to `#main-content` exists **and is the first tab stop**;
- every `img` has an `alt`;
- `html lang` is `cs`;
- the title is non-empty;
- there is exactly one canonical link, and it is absolute;
- every `ld+json` block parses;
- **no visible text node is a raw dictionary key** — see below.

### The raw-key check

next-intl is configured in `apps/web/src/i18n/request.ts` with a
`getMessageFallback` that returns the key itself and an `onError` that swallows
the miss. A keyword never added to the Sanity dictionary therefore does not
render blank and does not throw — it renders as
`contactFormPrivacyPolicyLinkLabel`, in the page, in production. That is exactly
what shipped next to the contact form's GDPR consent checkbox, and every other
assertion in this crawler said the page was healthy.

The check flags any visible text node whose **entire trimmed content** matches
`/^[a-z]+([A-Z][a-z]+)+$/`. Matching the whole node rather than searching inside
it is what keeps it quiet — Czech prose may contain a camelCase word, but it
does not consist of one. Exempt: text inside `<code>`, `<pre>`, `<kbd>`,
`<samp>`, `<var>`, and anything in a `display: none` branch. Visually-hidden
screen-reader text is **not** exempt, because a leaked key is still leaked to a
screen reader.

Fix a hit by adding the entry to the dictionary, not by suppressing the check:

```bash
npm run migrate:dictionary -w apps/studio            # dry run
npm run migrate:dictionary -w apps/studio -- --apply
```

### Reports

Reports land in `e2e/reports/` (git-ignored, uploaded as a CI artifact):

- `crawl.json` — full machine-readable result
- `crawl-report.md` — summary, broken links, per-page issues, slowest 10 pages,
  external links

A committed baseline of the last known-good run lives at
[`docs/crawl-baseline.md`](crawl-baseline.md), with instructions for
regenerating it.

Third-party console noise (map tile aborts, analytics) is filtered through an
allowlist in `e2e/helpers.ts`. Keep that list short — every entry is something
you have chosen not to see.

## CI

- **`ci.yml`** runs typegen-drift, lint, typecheck, unit tests and build, then
  e2e in a second job. Runs on every PR.
- **`crawl.yml`** runs the crawl weekly (Mondays 04:00 UTC) and on manual
  dispatch, uploading `e2e/reports/` as an artifact. It is kept out of PR runs
  because it is slow.

Both workflows need the `SANITY_PROJECT_ID` and `SANITY_DATASET` repository
secrets; `MAPTILER_API_KEY` is optional. The required secrets are documented in
comments at the top of each workflow file.
