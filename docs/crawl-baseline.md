# Crawl baseline

The committed record of the last known-good full-site crawl, and how to
regenerate it. `e2e/reports/` is git-ignored — it is regenerated on every run
and uploaded as a CI artifact — so this file is the version that survives.

## Status: **no real-dataset baseline recorded yet**

This is a gap, stated plainly rather than filled with invented numbers.

Sanity has been unreachable from every environment this project has been worked
in — `api.sanity.io` and `cdn.sanity.io` are both refused by the egress policy
(`403` to `CONNECT`). The crawler has therefore never been run against the real
site, in this phase or any earlier one. `docs/perf/phase7-after.md` records the
same wall.

**Anyone with dataset access should run the crawl and paste the summary into
the table below.** Until then, the weekly `crawl.yml` workflow is the only thing
that will produce a real result, and it needs the repository secrets to be set.

| Metric | Value | Date | Commit |
| --- | --- | --- | --- |
| Pages visited | _(to fill in)_ | | |
| Pages with issues | _(to fill in)_ | | |
| Broken links | _(to fill in)_ | | |
| External links | _(to fill in)_ | | |
| Slowest page | _(to fill in)_ | | |

## What has been verified

The assertions themselves are exercised, including the raw-key check added in
this phase. Both directions were confirmed by running the **unmodified**
`e2e/crawl.spec.ts` against a controlled four-page fixture site:

| Case | Expected | Result |
| --- | --- | --- |
| A bare `contactFormPrivacyPolicyLinkLabel` text node in an `<a>` | fail, naming the key and its element | **failed as designed** — `raw-key — raw dictionary key rendered as text: contactFormPrivacyPolicyLinkLabel (in <a>)` |
| Czech prose containing the word `useCdn` | no finding | **not flagged** — the check matches whole text nodes, not substrings |
| `sanityFetch(query, params, tags)` inside `<pre><code>` | no finding | **not flagged** — code elements are exempt |
| `hiddenCamelCaseNode` in a `display: none` branch | no finding | **not flagged** |
| The same site with the key replaced by real Czech copy | pass | **4 pages, 0 issues, 0 broken links** |

That establishes the check is correct and wired into the existing assertions. It
does **not** establish that the live site is free of leaked keys — only a run
against the real dataset can do that, and it is the first thing to do once
credentials are available.

## Regenerating

```bash
cp apps/web/.env.example apps/web/.env.local   # SANITY_PROJECT_ID, SANITY_DATASET
npm run test:crawl                             # 300 pages, depth 6
```

Narrow it while iterating:

```bash
CRAWL_MAX_PAGES=50 CRAWL_MAX_DEPTH=3 npm run test:crawl
```

If Playwright's download host is unreachable, point it at a browser already on
the machine:

```bash
PLAYWRIGHT_CHROMIUM_PATH=/path/to/chrome npm run test:crawl
```

Two files land in `e2e/reports/`:

- `crawl.json` — full machine-readable result, every page with its status,
  depth, timing and issues
- `crawl-report.md` — summary, broken links, per-page issues, slowest 10 pages,
  external links

Copy the summary table out of `crawl-report.md` into this file, with the date
and the commit it was run against.

### In CI

`.github/workflows/crawl.yml` runs it weekly (Mondays 04:00 UTC) and on manual
dispatch, with `max_pages` and `max_depth` as workflow inputs, uploading
`e2e/reports/` as an artifact. It needs `SANITY_PROJECT_ID` and `SANITY_DATASET`
as repository secrets; `MAPTILER_API_KEY` is optional. The crawl only follows
links and never submits anything, so pointing it at production is safe.

## What the crawl asserts

Full detail in [testing.md](testing.md#full-site-crawl). On every reachable
page: status under 400, no console errors or uncaught exceptions, exactly one
`h1`, exactly one `<main>`, a skip link that is the first tab stop, `alt` on
every `img`, `html lang="cs"`, a non-empty title, exactly one absolute
canonical, parseable `ld+json`, and no visible text node that is a raw
dictionary key.

A linked page that 404s counts as a broken link and fails the run.
