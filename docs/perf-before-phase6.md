# Performance baseline - before phase 6

Captured on the `perf/render` branch immediately before any phase 6 change,
from a production build (`next build`) served by `next start` on port 3100.

## How to read these numbers

**The absolute scores are not production numbers, and are not meant to be.**
This session cannot reach Sanity: `cdn.sanity.io` is refused by the sandbox's
egress policy (`403 host_not_allowed`), and the dataset is a local groq-js
stand-in rather than the real one. So:

- **No image ever loads.** Every `<img>` fails at the network layer, which
  makes LCP a text element on every page.
- The dataset is small (5 schools, 2 articles, 4 regions), so list pages render
  fewer nodes than production would.

What the numbers *are* good for is the **delta**: the after-run uses the same
build pipeline, dataset, Chrome and throttling, so a change in JS bytes,
blocking time or paint timing is attributable to the code. Where a phase 6 item
cannot be measured here at all, `docs/perf-after-phase6.md` says so rather than
inventing a number.

Lighthouse 12, Chromium 1194 (`/opt/pw-browsers/chromium`), categories
performance / accessibility / best-practices / seo. Desktop is
`--preset=desktop`; mobile is Lighthouse's default (slow 4G, 4x CPU throttle).

Note: this file was regenerated after two harness bugs were found - a stale
server left bound to the measurement port, and a `Host`-vs-port mismatch that
sent every catalog request into a `/katalog` <-> `/catalog` redirect loop. The
figures below are from the corrected harness. See the after-report for detail.

## Lighthouse

| page | form factor | perf | a11y | best practices | seo | FCP | LCP | TBT | CLS | Speed Index |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| home | desktop | **100** | 92 | 96 | 100 | 0.44s | 0.76s | 0 ms | 0.003 | 0.44s |
| home | mobile | **68** | 86 | 96 | 100 | 1.38s | 6.03s | 405 ms | 0.000 | 2.16s |
| catalog | desktop | **85** | 92 | 96 | 92 | 0.44s | 0.66s | 2 ms | 0.304 | 0.51s |
| catalog | mobile | **49** | 87 | 96 | 92 | 1.37s | 6.45s | 486 ms | 0.305 | 2.26s |

The LCP element is the page's `<h1>` in all four runs - the hero image beside
it would be the real candidate in production but cannot load here.

Catalog CLS is **0.30** on both form factors. It is not caused by the missing
images (home reads 0.000 with the same handicap), and phase 6 did not move it -
see the after-report.

## First-load JavaScript per route

Next 16's Turbopack route table no longer prints a First Load JS column, and
the per-route build manifests only list the chunks every route shares. These
figures are measured from the HTML the server actually sends - every
`/_next/static/chunks/*.js` it references, summed on disk (**uncompressed**;
the wire is roughly a third of this after Brotli).

| route | first-load JS (kB) | chunks |
| --- | ---: | ---: |
| `home` | 2,293 | 20 |
| `catalog (country)` | 2,606 | 21 |
| `catalog (region)` | 2,606 | 21 |
| `school detail` | 2,267 | 20 |
| `articles index` | 991 | 19 |
| `article detail` | 982 | 19 |
| `groups index` | 982 | 19 |
| `cooperation` | 2,293 | 20 |
| `contact` | 1,013 | 19 |

### Where the weight is

One chunk dominates: **1,284.5 kB uncompressed** of MapLibre GL plus the
MapTiler SDK, loaded by **home, catalog and cooperation**.

Catalog is obvious - the school list renders a map. Home and cooperation are
not: neither shows a map above the fold and cooperation has none at all. They
pull it in because `src/sanity/sections/registry.ts` statically imports every
section component, `MapCollection` among them, so any page rendering `<Zone>`
links the whole map stack into its client bundle.

That single import is the largest lever in this phase.

## Build

`next build` (Turbopack): **34 s**, exit 0. Eight app routes, all partial
prerender, plus `/api/contact`, `/api/revalidate`, `/robots.txt` and
`/sitemap.xml` as dynamic routes.
