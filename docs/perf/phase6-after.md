# Performance after phase 6

Same harness as `docs/perf/phase6-before.md`: a production `next build` served
by `next start`, Lighthouse 12 on Chromium 1194, desktop `--preset=desktop`
and mobile at Lighthouse's default throttling. Both runs were taken back to
back against the same local dataset.

## Read this first

The caveats from the before-report still apply, and one of them decides how
much of this table to believe: **`cdn.sanity.io` is blocked by the sandbox's
egress policy, so no image ever loads in either run.** That is unfortunate
precisely here, because half of phase 6 is about images. Concretely:

- Anything whose payoff is "the right image arrives sooner" is **not measured**
  and is not claimed below. What *is* verified for the image work is
  structural - the attributes in the HTML - and is shown in its own section.
- LCP is a text element on every page in both runs.

Everything else - the JavaScript, the fonts, the map, the hydration work - is
measured normally, and those are the numbers that moved.

Two harness bugs were found and fixed while producing this report, which is
why the before-numbers here differ slightly from the ones first recorded:

1. The script did not stop the previous `next start`, so a second run silently
   measured the previous build on the port that was still bound.
2. next-intl matches the `Host` header **including its port**, so
   `localhost:3100` matched neither configured domain, the proxy fell through
   to the first entry (English), and `/katalog/…` and `/catalog/…` redirected
   at each other. Lighthouse scored the resulting ping-pong as a page with no
   `<head>`.

Both runs below were taken after those fixes.

## Lighthouse scores

| page | form factor | performance | a11y | best practices | seo |
| --- | --- | --- | --- | --- | --- |
| home | desktop | 100 → **100** | 92 → 92 | 96 → 96 | 100 → 100 |
| home | mobile | 68 → **85** | 86 → 86 | 96 → 96 | 100 → 100 |
| catalog | desktop | 85 → **83** | 92 → 92 | 96 → 96 | 92 → 92 |
| catalog | mobile | 49 → **62** | 87 → 87 | 96 → 96 | 92 → 92 |

## Web vitals

| page | form factor | FCP | LCP | TBT | CLS | Speed Index |
| --- | --- | --- | --- | --- | --- | --- |
| home | desktop | 0.44s → 0.31s | 0.76s → 0.76s | 0 → 14 ms | 0.003 → 0.004 | 0.44s → 0.31s |
| home | mobile | 1.38s → 1.07s | 6.03s → 3.51s | 405 → 290 ms | 0.000 → 0.008 | 2.16s → 1.36s |
| catalog | desktop | 0.44s → 0.44s | 0.66s → 1.01s | 2 → 14 ms | 0.304 → 0.308 | 0.51s → 0.74s |
| catalog | mobile | 1.37s → 1.08s | 6.45s → 4.26s | 486 → 362 ms | 0.305 → 0.305 | 2.26s → 1.95s |

The mobile column is the one that matters: **home 68 → 85** and
**catalog 49 → 62**, with Speed Index down 37% and 14% and mobile LCP down
2.5s and 2.2s. Desktop was already at or near 100 and had nowhere to go.

### What did *not* move: catalog CLS

Catalog CLS reads 0.304 before and 0.308 after - unchanged. The map skeleton
was expected to fix this and did not, so the claim is withdrawn rather than
dressed up:

- Lighthouse's `layout-shift-elements` audit returns **no elements** in either
  run, so it does not say what is shifting.
- Loading the same URL in plain Chromium at 1440x900 and recording every
  `layout-shift` entry through a `PerformanceObserver` totals **0.000**.

So the shift only appears under Lighthouse's load conditions and could not be
attributed to a specific element. The map skeleton still reserves the box the
map will occupy - that is visible in the markup and is the right thing
regardless - but it is not the source of this number, and finding the real one
is follow-up work rather than something this phase fixed.

### The catalog desktop LCP regression

Desktop catalog LCP goes 0.66s → 1.01s, and it is the font change: the site now
loads a **second** font file. `subsets: ["latin"]` covered á, í, ú, ý and é but
not ě, š, č, ř, ž, ů, ď, ť or ň - so most Czech words were previously rendered
half in Nunito and half in a system fallback. Loading `latin-ext` as well fixes
that and costs one request before the heading paints. That is the correct
trade, not a regression to undo.

## First-load JavaScript per route

Measured as before: every `/_next/static/chunks/*.js` the served HTML
references, summed on disk, uncompressed.

| route | before (kB) | after (kB) | change |
| --- | ---: | ---: | --- |
| `home` | 2,293 | 1,062 | **-1,232 kB** (-54%) |
| `catalog (country)` | 2,606 | 1,369 | **-1,237 kB** (-47%) |
| `catalog (region)` | 2,606 | 1,369 | **-1,237 kB** (-47%) |
| `school detail` | 2,267 | 1,020 | **-1,247 kB** (-55%) |
| `articles index` | 991 | 1,012 | **+21 kB** (+2%) |
| `article detail` | 982 | 1,002 | **+21 kB** (+2%) |
| `groups index` | 982 | 1,002 | **+21 kB** (+2%) |
| `cooperation` | 2,293 | 1,062 | **-1,232 kB** (-54%) |
| `contact` | 1,013 | 1,053 | **+40 kB** (+4%) |

The whole of that comes from one import. `MapLibre GL` + the MapTiler SDK is a
single 1,284 kB chunk, and `sanity/sections/registry.ts` statically imports
`MapCollection`, so every page rendering `<Zone>` linked it in - including the
cooperation page, which has no map at all. Routing the three map call sites
through `next/dynamic` with `ssr: false` moves it out of every initial bundle
and fetches it only when a map is actually rendered.

The routes that gained a little (articles +21 kB, contact +40 kB) pay for
`next/image` and for two components that had to *become* Client Components -
see the hydration section.

## Build

| | before | after |
| --- | ---: | ---: |
| `next build` | 34s | 32s |

The React Compiler is on. Measured over three runs each: **32 / 33 / 31 s with
it, 31 / 29 / 29 s without** - about +8%, which is cheap enough to keep for
automatic memoization across the whole tree.

## Images: what is verified, since Lighthouse cannot be

Every image now goes through `components/ui/image/Image.tsx`, which wraps
`next/image`. The dimensions come out of the Sanity asset id rather than from a
new GROQ field - `image-<hash>-1600x900-png` and the CDN URL it produces both
carry them - so no query changed shape and no cached response was invalidated
for a number that was already in the string next to it.

Checked directly in the served HTML:

| | before | after |
| --- | --- | --- |
| `width`/`height` on the element | none | intrinsic size of the asset |
| `srcset` | none | 8 candidates, widths chosen by `sizes` |
| `loading` | none (eager) | `lazy` except where `priority` is set |
| `<link rel="preload" as="image">` for the LCP image | none | present |
| format negotiation | original file | `auto=format` (AVIF/WebP) at Sanity's CDN |

`priority` is set on exactly three images: the home hero, the first image of
the school gallery, and the article cover - the LCP candidate of each of those
routes. The header logo is also eager, being above the fold on every page.
Everything else keeps the default lazy loading.

Sanity's CDN does the resizing through a custom `loader`, so `/_next/image`
never fetches and re-encodes a file Sanity has already prepared.
`images.remotePatterns` still names `cdn.sanity.io` for anything that reaches
for `next/image` directly.

### The bug this nearly shipped with

`next/image` writes the intrinsic width and height onto the element. CSS that
constrains only one axis leaves the other at the attribute value - so the
header logo, styled `width: 120px` from a 1600x900 asset, rendered **120px wide
and 900px tall**, pushing the entire page below the fold on a phone. It was
caught because mobile Lighthouse suddenly reported `NO_LCP`.

The component now merges a base `sx` of `{ maxWidth: "100%", height: "auto" }`
underneath the call site's own, so an image sized on one axis keeps its aspect
ratio and one sized on both still wins. There is a unit test for it, and every
page was checked at 412px and 1440px for oversized images and horizontal
overflow - all clean.

## Hydration

The client-component count is unchanged at 34, but the membership moved:

| file | change | why |
| --- | --- | --- |
| `shared/PageHeadingTypography.tsx` | client → **server** | Renders the heading block of nearly every route. Only needed the client for a `useState` that memoized a style merge - and did it with a lazy initialiser, so a changed `extendedStyles` was silently ignored. |
| `groups/[group]/InfoCardGrid.tsx` | client → **server** | Only needed the client for a translation hook; rendered from a Server Component, so it takes the server translator instead. |
| `groups/[group]/InfoCardItem.tsx` | client → **server** | Purely presentational. Its two `(theme) => …` `sx` callbacks became static objects - the theme runs with `cssVariables: true`, so every value is reachable as a CSS variable. |
| `cooperation/SchoolsCarousel.tsx` | client → **server** | The only thing needing a browser was Embla. |
| `shared/EmblaCarousel.tsx` | server → **client** | Where that boundary actually belongs. It was borrowing the directive from its parent. |
| `catalog/…/TypeBadge.tsx` | server → **client** | Fixes a pre-existing hydration mismatch - see below. |
| `cooperation/PreschoolCard.tsx` | server → **client** | Same cause. |
| `ui/map/LazyMap.tsx` | new client | `next/dynamic` with `ssr: false` is only legal inside a Client Component. |

Two demotions were attempted and reverted, which is worth recording because the
reason is not obvious: **`ui/button/Button.tsx` and `ui/link/Link.tsx` must stay
Client Components.** They hand MUI `component={NextLink}`, and a component
reference is a function - functions do not serialise across the server/client
boundary. Their pointless memoization is gone either way, including the same
`useState` lazy-initialiser bug that was in `PageHeadingTypography`.

### Three RSC boundary bugs found

All three are the same shape - a function crossing from a Server Component into
a Client Component - and all three were being logged on every page load.

1. **Both `not-found.tsx` files** passed `component={Link}` to MUI's `Button`.
   Next renders the not-found boundary as part of every route's shell, so this
   threw on *every* request, and the root 404 answered **500 instead of 404**.
   Now fixed; `/neexistuje` returns 404.
2. **`TypeBadge`** hands MUI's `Chip` an element as its `icon` prop. The server
   rendered the chip without the icon and the client rendered it with one -
   a hydration mismatch on any page showing a highlighted school type. This is
   pre-existing: it reproduces with the plain `<img>` the component used to
   render, and was verified as such before being fixed.
3. **`PreschoolCard`** does the same with `icon={<LocationOnIcon />}`.

### Memoization removed

The React Compiler makes these redundant; none of them fed a dependency array:

- `forms/ContactForm.tsx` - `isEmailValid`, `isValid` (two `useMemo`)
- `shared/EmblaCarousel.tsx` - `scrollPrev`, `scrollNext` (two `useCallback`)
- `hooks/useTranslate.ts` - the returned translator (one `useCallback`)
- `ui/button/Button.tsx`, `ui/link/Link.tsx`, `shared/PageHeadingTypography.tsx`
  - style merges (one `useMemo`, two `useState`)

Deliberately kept: `SchoolList`'s `loadMore`, which is handed to
`useInfiniteScroll`, and `MapComponent`'s callbacks, which are in `useEffect`
dependency arrays. An unstable identity there is a re-subscription, not a
wasted render.

## Dead code

`components/icons/`: `IllustrationMain` (9,238 lines),
`IllustrationChildrenGroup` (1,730), `CheckmarkIcon`, `Home` and `Marker` -
**11,044 lines**. Each was re-grepped for its bare name across `src/` and `e2e/`
immediately before deletion; all five had zero references.

First-load JS did not move as a result, which is the expected answer: they were
never imported, so they were never in a bundle to begin with. The win is that
nobody has to wonder about a 9,000-line file again.

Also removed: a dead `WritersSection` import in the articles index. The
component and its `WriterCard` are now unreferenced but were left in place -
they were not on the list, and they may be intended.

## Test suite

| | before | after |
| --- | ---: | ---: |
| unit (vitest) | 273 passed | **283 passed** |
| e2e (chromium) | 32 failed / 47 passed | **26 failed / 53 passed** |
| crawl | 1 failed, 0 broken links | 1 failed, 0 broken links |

Six e2e failures were fixed and none introduced. The remaining 26 are all
sandbox or fixture artifacts, unchanged from the baseline: no `cdn.sanity.io`
(images cannot load), no MapTiler key (the map never initialises), no Turnstile
key (the contact form cannot be submitted), and five `not-found` cases that
expect a 404 where PPR returns 200 because `notFound()` is called below a
Suspense boundary.

The crawl still reports `console` noise from the blocked image CDN, but its
`pageerror` count went **1 → 0** once the hydration mismatches were fixed.

**axe: no new violations.** Compared rule-by-rule by running the a11y spec on
both trees: home 2, catalog 2, school detail 3, identical rule ids either side
(`aria-input-field-name`, `color-contrast`, and `link-name` on the school page).

## Regression guard

`app/[locale]/layout.tsx` has no sequential data fetches: `siteContext` resolves
its two reads through `Promise.all`, `getMessages` is a single await, and Header
and Footer each keep their own `<Suspense>` boundary so neither waits on the
other.
