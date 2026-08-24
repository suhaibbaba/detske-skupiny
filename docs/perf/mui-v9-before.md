# MUI v9 upgrade - before

Baseline for the Material UI 7 → 9 upgrade, taken on the pre-upgrade tree
(`@mui/material` 7.3.11). `docs/perf/mui-v9-after.md` repeats every measurement
below on the upgraded tree and `docs/perf/mui-v9-diff.md` compares them.

| | |
| --- | --- |
| commit | `85e9ee2` (pre-upgrade) |
| `@mui/material` / `@mui/system` / `@mui/icons-material` | 7.3.11 |
| `@mui/material-nextjs` | 7.3.10 |
| `@emotion/react` / `@emotion/styled` / `@emotion/cache` | 11.14.0 / 11.14.1 / 11.14.0 |
| Next.js | 16.3.2, Turbopack, `cacheComponents: true`, React Compiler on |
| Node | 22.22.2 |
| Lighthouse | 12.8.2 on Chromium 141.0.7390.37 |

## How these numbers were produced, and what they are worth

**Sanity is unreachable from this sandbox.** `api.sanity.io` and
`cdn.sanity.io` are both refused by the egress gateway (`403` to `CONNECT`), so
neither `next build` nor a page render can reach the real dataset. Rather than
measure a site with no content, the run serves both from a local stand-in:

- a **groq-js-backed query API** answering the app's real GROQ against a
  synthetic dataset (1 country, 4 regions, 8 areas, 8 subareas, 30 schools,
  6 articles, plus the header/footer/settings/dictionary singletons), and
- a **generated image CDN** returning a real PNG at whatever size the app's
  loader asks for, tuned so an 828px render of a 1200x900 asset weighs ~138 kB -
  about what a photograph of that size costs on the wire.

Both are reached by patching `dns.lookup` inside the Node processes under
measurement and by pointing Chrome at `127.0.0.1` with
`--host-resolver-rules`; no application code, and no file on the machine, was
modified to make this work.

That matters for reading the absolute numbers:

- **The dataset is smaller than production.** The catalog renders 9 cards and a
  load-more, not the real corpus, so list pages do less work here than they
  would live.
- **Images load, and are synthetic.** Unlike the earlier `docs/perf-*-phase6.md`
  runs - where the blocked CDN meant no image ever arrived and LCP was a text
  node on every page - the LCP element here is the hero image, as it would be in
  production. The bytes are representative rather than real.

What the numbers *are* good for is the delta. The after-run uses the same
dataset, the same emulator, the same Chrome and the same throttling, so any
movement is attributable to the upgrade. Every figure below is reproduced by
`run-audit.sh before`; the raw Lighthouse JSON and both analyzer reports are
kept alongside it.

---

## A. Bundle

### A1. Route table, verbatim

```
Route (app)
┌ ƒ /_not-found
├   /[locale]
│ ├ ◐ /[locale]
│ ├ ◐ /cs
│ └ ◐ /en
├   /[locale]/articles
│ ├ ◐ /[locale]/articles
│ ├ ◐ /cs/articles
│ └ ◐ /en/articles
├   /[locale]/articles/[slug]
│ ├ ◐ /[locale]/articles/[slug]
│ ├ ◐ /cs/articles/[slug]
│ └ ◐ /en/articles/[slug]
├   /[locale]/catalog/[...slug]
│ ├ ◐ /[locale]/catalog/[...slug]
│ ├ ◐ /cs/catalog/[...slug]
│ └ ◐ /en/catalog/[...slug]
├   /[locale]/contact-us
│ ├ ◐ /[locale]/contact-us
│ ├ ◐ /cs/contact-us
│ └ ◐ /en/contact-us
├   /[locale]/cooperation
│ ├ ◐ /[locale]/cooperation
│ ├ ◐ /cs/cooperation
│ └ ◐ /en/cooperation
├   /[locale]/groups
│ ├ ◐ /[locale]/groups
│ ├ ◐ /cs/groups
│ └ ◐ /en/groups
├   /[locale]/groups/[group]
│ ├ ◐ /[locale]/groups/[group]
│ ├ ◐ /cs/groups/[group]
│ └ ◐ /en/groups/[group]
├ ƒ /api/contact
├ ƒ /api/revalidate
├ ƒ /robots.txt
└ ƒ /sitemap.xml


ƒ Proxy (Middleware)

◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand
```

**There is no Size or First Load JS column to quote.** That is the whole of
what Next 16's Turbopack build prints - the size columns that older versions
emitted are gone, and no flag brings them back. The brief asks for size and
first-load JS per route, so those are measured instead, from the HTML the
server actually sends: every `/_next/static/chunks/*.js` the document
references, summed on disk and gzipped. This is the same method
`docs/perf-after-phase6.md` used, and it reproduces that report's figures
exactly (home 1,062 kB, catalog 1,369 kB), which is the check that the harness
is measuring the same thing.

| route | chunks | first-load parsed | first-load gzip |
| --- | ---: | ---: | ---: |
| home | 22 | 1,061.5 kB | 340.0 kB |
| catalog (country) | 23 | 1,368.9 kB | 412.9 kB |
| cooperation | 22 | 1,061.5 kB | 340.0 kB |
| articles | 21 | 1,011.7 kB | 322.7 kB |
| contact | 22 | 1,053.3 kB | 336.3 kB |

`next build`: **47 s** (cold, no `.next` cache).

### A2. Bundle analysis

`@next/bundle-analyzer` is now a devDependency of `apps/web` and is wired in
`next.config.ts` behind `ANALYZE=true`. One thing has to be said about it
before any of its numbers are used:

> **It produces nothing under a normal `next build`.** It is a webpack plugin,
> `next build` uses Turbopack, and in that combination the plugin prints
> *"The Next Bundle Analyzer is not compatible with Turbopack builds, no report
> will be generated"* and returns the config untouched.

So there are two commands, and they answer different questions:

```bash
# @next/bundle-analyzer, over a webpack build - writes .next/analyze/*.html
ANALYZE=true npm run build -w apps/web -- --webpack

# Turbopack's own analyzer, over the bundle that actually ships
npx next experimental-analyze -o     # writes .next/diagnostics/analyze
```

The headline numbers below come from **`next experimental-analyze`**, because
that is the build users download. The webpack report is kept as a cross-check
and its treemap is the thing you can actually look at.

Both figures are per route and cover the whole client graph attributable to
that route - the initial chunks *and* the ones it lazy-loads (the map, the
lightbox). First-load alone is the table in A1.

#### home

| | parsed | gzip |
| --- | ---: | ---: |
| total (590 modules) | 2,522.7 kB | 821.2 kB |
| **all `@mui/*`** (7 packages, 281 modules) | **328.7 kB** | **148.7 kB** |
| **all `@emotion/*`** (11 packages, 14 modules) | **38.4 kB** | **18.5 kB** |

10 largest modules:

| # | parsed | gzip | module |
| ---: | ---: | ---: | --- |
| 1 | 1,007.7 kB | 266.7 kB | `maplibre-gl/dist/maplibre-gl.js` |
| 2 | 224.0 kB | 59.4 kB | `@maptiler/sdk/dist/maptiler-sdk.mjs` |
| 3 | 196.0 kB | 61.7 kB | `next/dist/compiled/react-dom/cjs/react-dom-client.production.js` |
| 4 | 110.0 kB | 38.5 kB | `next/dist/build/polyfills/polyfill-nomodule.js` |
| 5 | 100.1 kB | 14.9 kB | `@maptiler/sdk/dist/maptiler-sdk.css` |
| 6 | 27.4 kB | 10.1 kB | `yet-another-react-lightbox/dist/index.js` |
| 7 | 23.6 kB | 5.6 kB | `@mui/material/esm/styles/createThemeWithVars.js` |
| 8 | 23.0 kB | 4.7 kB | `@maptiler/client/dist/maptiler-client.mjs` |
| 9 | 22.6 kB | 7.3 kB | `next/dist/compiled/react-server-dom-turbopack/…-client.browser.production.js` |
| 10 | 22.5 kB | 7.0 kB | `next/dist/client/components/segment-cache/cache.js` |

By package: `maplibre-gl` 1,007.7 kB, `next` 575.5 kB, `@maptiler/sdk`
324.0 kB, **`@mui/material` 243.3 kB**, **`@mui/system` 70.1 kB**, app code
56.3 kB, `yet-another-react-lightbox` 44.0 kB.

#### catalog

| | parsed | gzip |
| --- | ---: | ---: |
| total (697 modules) | 2,829.2 kB | 931.3 kB |
| **all `@mui/*`** (7 packages, 294 modules) | **343.6 kB** | **155.1 kB** |
| **all `@emotion/*`** (11 packages, 14 modules) | **38.4 kB** | **18.5 kB** |

10 largest modules:

| # | parsed | gzip | module |
| ---: | ---: | ---: | --- |
| 1 | 1,007.7 kB | 266.7 kB | `maplibre-gl/dist/maplibre-gl.js` |
| 2 | 224.0 kB | 59.4 kB | `@maptiler/sdk/dist/maptiler-sdk.mjs` |
| 3 | 196.0 kB | 61.7 kB | `next/dist/compiled/react-dom/cjs/react-dom-client.production.js` |
| 4 | 110.0 kB | 38.5 kB | `next/dist/build/polyfills/polyfill-nomodule.js` |
| 5 | 100.1 kB | 14.9 kB | `@maptiler/sdk/dist/maptiler-sdk.css` |
| 6 | 32.9 kB | 8.2 kB | `zod/v4/core/schemas.js` |
| 7 | 27.4 kB | 10.1 kB | `yet-another-react-lightbox/dist/index.js` |
| 8 | 25.1 kB | 3.0 kB | `zod/v4/core/to-json-schema.js` |
| 9 | 23.6 kB | 5.6 kB | `@mui/material/esm/styles/createThemeWithVars.js` |
| 10 | 23.0 kB | 4.7 kB | `@maptiler/client/dist/maptiler-client.mjs` |

By package: `maplibre-gl` 1,007.7 kB, `next` 575.8 kB, `@maptiler/sdk`
324.0 kB, `zod` 272.9 kB, **`@mui/material` 258.3 kB**, app code 81.0 kB,
**`@mui/system` 70.1 kB**.

#### Cross-check: the webpack report

`ANALYZE=true npm run build -w apps/web -- --webpack` writes
`.next/analyze/client.html` (618 kB treemap), `nodejs.html` and `edge.html`.
Over the whole client build it reads 2,747.6 kB parsed / 928.7 kB gzip in 912
modules across 54 chunks, with **`@mui/*` at 320.4 kB parsed / 141.0 kB gzip**
and `@emotion/*` at 16.1 kB / 7.9 kB.

The `@mui/*` figure lands within 3% of Turbopack's, which is the useful part -
two independent bundlers agree on how much Material UI this app pulls in. The
`@emotion/*` figures do not agree (16.1 kB vs 38.4 kB) because webpack's module
concatenation folds most of Emotion into its importers, so those bytes are
counted under `@mui/*` and app code instead of under their own package. Chunk
counts are not comparable at all between the two.

### A3. Static JavaScript on disk

```
$ du -sh .next/static/chunks
2.9M    .next/static/chunks      (2,958,290 bytes)
```

---

## B. Runtime

Production build served by `next start` on port 3100. Lighthouse 12.8.2,
performance category only, **3 runs per page per form factor, median reported**.
Desktop is `--preset=desktop`; mobile is Lighthouse's default (slow 4G, 4x CPU
throttle).

### B4. Medians of 3 runs

| page | form factor | performance | LCP | TBT | CLS | Speed Index |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| home | desktop | **99** | 974 ms | 36 ms | 0.000 | 568 ms |
| home | mobile | **71** | 4,678 ms | 469 ms | 0.000 | 1,872 ms |
| catalog | desktop | **78** | 1,037 ms | 33 ms | 0.484 | 730 ms |
| catalog | mobile | **44** | 6,970 ms | 546 ms | 0.672 | 3,120 ms |

(FCP was recorded too - home 474 ms / 1,688 ms, catalog 475 ms / 1,959 ms - and
is carried into the diff, though the brief did not ask for it.)

That is 20 medians, not the 12 the brief estimates: 2 pages × 2 form factors ×
5 metrics.

**Catalog CLS is 0.48 desktop / 0.67 mobile, and that is a real finding rather
than harness noise.** The earlier phase-6 reports measured 0.30 on both, with
the CDN blocked and no image ever arriving. Now that images load, the number
gets worse - so whatever shifts on the catalog shifts *more* when the card
images arrive. It is not something the MUI upgrade is expected to touch, but it
is the largest single score deduction on that page and is worth its own look.

### B5. Unused JavaScript on home

| form factor | unused (median of 3) |
| --- | ---: |
| desktop | **293.4 kB** |
| mobile | **293.3 kB** |

Almost all of it is one file:

| unused | of | chunk |
| ---: | ---: | --- |
| 271.8 kB | 339.5 kB (80%) | the MapLibre + MapTiler chunk |
| 21.6 kB | 69.7 kB (31%) | the shared framework chunk |

The map chunk is lazily imported (`next/dynamic`, `ssr: false`) so it is not
first-load JS, but the home page does render a `mapCollection` section, so the
browser fetches it during the run and then uses a fifth of it. Nothing here is
MUI's.

---

## C. Hydration cost

### C6. Client components

```
$ grep -rl '"use client"' apps/web/src | wc -l
34
```

34 files. The upgrade must not change this number - if it does, something about
the boundary moved and the after-report says what.

### C7. Main-thread JavaScript execution time (mobile)

From Lighthouse's `bootup-time` audit ("Reduce JavaScript execution time"), on
the median mobile run:

| page | total | attributed to our own origin |
| --- | ---: | ---: |
| home | 1,980 ms | **1,969 ms** |
| catalog | 2,061 ms | **2,048 ms** |

Everything the page loads is served from the measurement origin, so "ours" is
essentially all of it - there is no third-party script to subtract. The
breakdown on home:

| ms | script |
| ---: | --- |
| 1,324 | shared framework chunk |
| 471 | MapLibre + MapTiler chunk |
| 108 | catalog/interaction chunk |
| 66 | the document itself |

---

## Incidental finding: the footer can fail the build

Not part of this audit, but it stopped the first build and is worth recording.
`components/layout/Footer.tsx:236` calls `new Date().getFullYear()` inline while
rendering, guarded only by `footer.copyright` being set:

```tsx
{footer.copyright && (
  <Typography {...styles.copyright}>
    {footer.copyright.replace("{0}", new Date().getFullYear().toString())}
  </Typography>
)}
```

Under `cacheComponents: true` Next refuses to prerender an unstable clock read,
and because the footer is in the root layout this fails **every route**, not
one:

```
Error: Route "/[locale]/articles": Next.js encountered the unstable value
`new Date()` while prerendering.
```

So the site builds only while no `footer` document has a `copyright`. The
dataset used here leaves that field unset for exactly this reason. The fix is
the same one commit `e2c6cc2` applied elsewhere - read the clock inside a
cached scope, or render the year on the client - and it is left alone here so
that the before- and after-trees differ only by the MUI upgrade.

---

## Reproducing

The harness is not committed - it depends on this sandbox's specific egress
situation - but it is entirely mechanical:

1. Serve the app's GROQ from `groq-js` over a synthetic dataset on
   `<project>.api.sanity.io`, and generated PNGs on `cdn.sanity.io`, both over
   TLS with a self-signed certificate.
2. Point Node at them with `--require` a module that patches `dns.lookup`, and
   `NODE_EXTRA_CA_CERTS` at a bundle containing that certificate.
3. Set `NEXT_PUBLIC_CS_DOMAIN=localhost:3100` - next-intl matches the `Host`
   header **including its port**, and a mismatch sends `/katalog/…` and
   `/catalog/…` into a redirect loop that Lighthouse scores as a page with no
   `<head>`.
4. Run Chrome with `--no-proxy-server` as well as `--host-resolver-rules`.
   Without it Chrome picks up the sandbox's `HTTPS_PROXY`, the gateway refuses
   `cdn.sanity.io`, and every image fails with
   `ERR_TUNNEL_CONNECTION_FAILED` - which silently turns LCP back into a text
   node and makes the whole run look 2 s faster than it is.
