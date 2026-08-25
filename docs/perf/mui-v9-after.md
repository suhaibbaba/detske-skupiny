# MUI v9 upgrade - after

The same audit as `docs/perf/mui-v9-before.md`, repeated on the upgraded tree.
Same dataset, same emulator, same Chrome, same throttling, same commands - the
only difference between the two runs is the upgrade. `docs/perf/mui-v9-diff.md`
puts the two side by side.

| | |
| --- | --- |
| commit | `9a8c198` (post-upgrade) |
| `@mui/material` / `@mui/icons-material` | 9.3.1 |
| `@mui/system` / `@mui/material-nextjs` | 9.3.0 |
| `@emotion/react` / `@emotion/styled` / `@emotion/cache` | 11.14.0 / 11.14.1 / 11.14.0 (unchanged) |
| everything else | unchanged - see the before-report |

Emotion is worth stating explicitly, because it is the first thing people
assume a MUI major changes: **v9 still uses Emotion**, and this app still uses
it. `@mui/material-pigment-css` is an *optional* peer dependency in v9, not the
default styling engine, and adopting it would be a separate piece of work.

Read the before-report's "How these numbers were produced" section first - the
caveats about the local dataset and the synthetic images apply identically
here.

---

## A. Bundle

### A1. Route table, verbatim

**Byte-for-byte identical to the before-run.** Rather than reprint 42 lines,
here is the check:

```text
$ diff before/route-table.txt after/route-table.txt
$ echo $?
0
```

Same routes, same prerender markers, and the same absence of Size and First
Load JS columns (Next 16 / Turbopack does not print them - see the
before-report).

First-load JS, measured the same way, from the chunks the served HTML
references:

| route | chunks | first-load parsed | first-load gzip |
| --- | ---: | ---: | ---: |
| home | 22 | 1,073.0 kB | 344.4 kB |
| catalog (country) | 23 | 1,378.7 kB | 416.9 kB |
| cooperation | 22 | 1,073.0 kB | 344.4 kB |
| articles | 21 | 1,023.6 kB | 327.1 kB |
| contact | 22 | 1,064.9 kB | 340.7 kB |

`next build`: **43 s** (before: 47 s).

### A2. Bundle analysis

From `next experimental-analyze`, over the Turbopack build that ships.

#### home

| | parsed | gzip |
| --- | ---: | ---: |
| total (595 modules) | 2,536.6 kB | 828.5 kB |
| **all `@mui/*`** (7 packages, 294 modules) | **353.9 kB** | **160.5 kB** |
| **all `@emotion/*`** (11 packages, 14 modules) | **38.5 kB** | **18.5 kB** |

10 largest modules:

| # | parsed | gzip | module |
| ---: | ---: | ---: | --- |
| 1 | 1,007.7 kB | 266.7 kB | `maplibre-gl/dist/maplibre-gl.js` |
| 2 | 224.0 kB | 59.4 kB | `@maptiler/sdk/dist/maptiler-sdk.mjs` |
| 3 | 196.0 kB | 61.7 kB | `next/dist/compiled/react-dom/cjs/react-dom-client.production.js` |
| 4 | 110.0 kB | 38.5 kB | `next/dist/build/polyfills/polyfill-nomodule.js` |
| 5 | 100.1 kB | 14.9 kB | `@maptiler/sdk/dist/maptiler-sdk.css` |
| 6 | 27.2 kB | 10.1 kB | `yet-another-react-lightbox/dist/index.js` |
| 7 | 23.7 kB | 5.7 kB | `@mui/material/styles/createThemeWithVars.mjs` |
| 8 | 23.0 kB | 4.7 kB | `@maptiler/client/dist/maptiler-client.mjs` |
| 9 | 22.6 kB | 7.3 kB | `next/dist/compiled/react-server-dom-turbopack/…-client.browser.production.js` |
| 10 | 22.5 kB | 7.0 kB | `next/dist/client/components/segment-cache/cache.js` |

The list is the same ten modules as before, in the same order. Only
`createThemeWithVars` moved at all (23.6 → 23.7 kB), and only because the file
extension changed from `esm/*.js` to `*.mjs`.

By package: `maplibre-gl` 1,007.7 kB, `next` 575.4 kB, `@maptiler/sdk`
324.0 kB, **`@mui/material` 261.2 kB** (was 243.3), **`@mui/system` 70.0 kB**
(was 70.1), app code 55.5 kB (was 56.3).

#### catalog

| | parsed | gzip |
| --- | ---: | ---: |
| total (701 modules) | 2,841.6 kB | 937.8 kB |
| **all `@mui/*`** (7 packages, 306 modules) | **367.0 kB** | **166.3 kB** |
| **all `@emotion/*`** (11 packages, 14 modules) | **38.5 kB** | **18.5 kB** |

10 largest modules: unchanged from the before-run, same order - `maplibre-gl`
1,007.7 kB, `@maptiler/sdk` 224.0 kB, `react-dom-client` 196.0 kB,
`polyfill-nomodule` 110.0 kB, `maptiler-sdk.css` 100.1 kB, `zod/v4/core/schemas`
32.9 kB, `yet-another-react-lightbox` 27.2 kB, `zod/v4/core/to-json-schema`
25.1 kB, `createThemeWithVars` 23.7 kB, `@maptiler/client` 23.0 kB.

By package: **`@mui/material` 274.6 kB** (was 258.3), **`@mui/system` 70.0 kB**
(was 70.1), app code 80.3 kB (was 81.0).

#### Where the extra `@mui` weight comes from

Package totals say `@mui/material` grew; they do not say what grew. Both runs'
webpack reports carry full module lists, so diffing them by module path answers
it directly. (v7 ships `@mui/material/esm/Button/Button.js` and v9 ships
`@mui/material/Button/Button.mjs`; the paths are normalised before comparing so
the diff is about content, not a file-naming change.)

**Added - 19 modules, +13.7 kB:**

| kB | module | what it is |
| ---: | --- | --- |
| 4.1 | `@mui/utils/useRovingTabIndex` | the Menu / MenuList keyboard-navigation rework |
| 3.2 | `@mui/material/internal/Transition` | MUI's own transition, replacing react-transition-group's |
| 1.9 | `@mui/material/ButtonBase/useButtonBase` | the ButtonBase event-handling changes |
| 1.1 | `@mui/material/transitions/useReducedMotion` | `prefers-reduced-motion` support |
| 0.7 | `@mui/utils/fastDeepAssign` | |
| 0.5 | `@mui/material/Select/utils/closedTypeahead` | type-ahead on a closed Select |
| 0.4 | `@mui/material/utils/useFocusableWhenDisabled` | focusable disabled buttons |
| 1.8 | 12 more, each under 0.4 kB | `RovingTabIndexContext`, `MenuListContext`, `createMotion`, `reducedMotion`, `focusWithVisible`, `isEventHandler`, … |

**Removed - 9 modules, -4.2 kB:**

| kB | module |
| ---: | --- |
| 1.7 | `react-transition-group/TransitionGroup` |
| 1.2 | `react-transition-group/utils/ChildMapping` |
| 0.4 | **`@mui/system/styleFunctionSx/extendSxProp`** |
| 0.4 | `@mui/system/Grid/deleteLegacyGridProps` |
| 0.5 | `createSvgIcon`, `formControlState`, `merge`, `memoize`, `assertThisInitialized` |

**Grew:** `Select/SelectInput` +2.8 kB, `ButtonBase/TouchRipple` +1.4 kB,
`InitColorSchemeScript` +1.0 kB, `transitions/utils` +0.8 kB.

`extendSxProp` is the one to look at. That module *is* the system-props
machinery - the thing that read `mt`, `bgcolor` and friends off props and
folded them into `sx`. Deleting the entire system-props API from six components
removed **0.4 kB**. Everything else v9 did to this bundle added weight.

#### Cross-check: the webpack report

| | before | after |
| --- | ---: | ---: |
| whole client build, parsed | 2,747.6 kB | 2,757.9 kB |
| whole client build, gzip | 928.7 kB | 934.7 kB |
| `@mui/*` parsed | 320.4 kB | 338.1 kB |
| `@mui/*` gzip | 141.0 kB | 150.1 kB |
| `@emotion/*` parsed | 16.1 kB | 15.8 kB |
| modules / chunks | 912 / 54 | 913 / 55 |

Same direction, smaller magnitude (+17.7 kB vs Turbopack's +25.2 kB on home).
The two bundlers count differently - Turbopack's figure is per route and counts
a module once per output chunk it lands in, webpack's is over the whole client
build - so the numbers are comparable within a column, not across.

### A3. Static JavaScript on disk

```text
$ du -sh .next/static/chunks
3.0M    .next/static/chunks      (2,965,317 bytes, was 2,958,290)
```

---

## B. Runtime

Identical harness: `next build && next start` on port 3100, Lighthouse 12.8.2,
performance category, 3 runs per page per form factor, median reported.

### B4. Medians of 3 runs

| page | form factor | performance | LCP | TBT | CLS | Speed Index |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| home | desktop | **99** | 997 ms | 36 ms | 0.000 | 696 ms |
| home | mobile | **69** | 4,884 ms | 464 ms | 0.000 | 2,483 ms |
| catalog | desktop | **78** | 1,011 ms | 38 ms | 0.484 | 736 ms |
| catalog | mobile | **59** | 4,902 ms | 585 ms | 0.000 | 2,596 ms |

(FCP: home 492 ms / 1,764 ms, catalog 467 ms / 1,774 ms.)

### The catalog rows are not measuring the upgrade

Two of these numbers moved a long way - catalog mobile performance 44 → 59 and
catalog mobile CLS 0.672 → 0.000 - and **neither is attributable to the
upgrade**. Catalog CLS is not a noisy continuous metric here; it is
*multi-modal*. Every individual run returns one of three values, and which one
is a coin flip:

| run | before | after |
| --- | ---: | ---: |
| catalog / mobile / 1 | 0.000 | 0.000 |
| catalog / mobile / 2 | 0.672 | 0.672 |
| catalog / mobile / 3 | 0.672 | 0.000 |

Both medians are drawn from the same set of outcomes; three samples just landed
differently. Six extra runs on the upgraded tree confirm it:

```text
run 4  CLS 0.000  perf 59      run 7  CLS 0.192  perf 65
run 5  CLS 0.672  perf 44      run 8  CLS 0.672  perf 48
run 6  CLS 0.000  perf 65      run 9  CLS 0.192  perf 64
```

Across all nine runs on the upgraded tree: **0.000 four times, 0.192 twice,
0.672 three times** (median 0.192), with the performance score swinging between
44 and 65 in step with it. Desktop shows the same thing at lower amplitude -
0.484, 0.001, 0.484 across the three after-runs.

So the honest reading of the catalog CLS and catalog mobile performance rows is
**unchanged, and unresolvable at three runs**. Fixing that needs more samples
per data point, and separately, someone should find what is actually shifting -
Lighthouse's `layout-shift-elements` audit returns no elements in any run,
before or after, which is the same dead end `docs/perf/phase6-after.md` hit.

The stable rows are the desktop ones and TBT, and they say the same thing:
home desktop 99 → 99, catalog desktop 78 → 78, TBT within 5 ms everywhere.

### B5. Unused JavaScript on home

| form factor | before | after |
| --- | ---: | ---: |
| desktop | 293.4 kB | **293.3 kB** |
| mobile | 293.3 kB | **293.1 kB** |

Unmoved, and still the same two files: 271.8 kB unused of the 339.5 kB
MapLibre/MapTiler chunk, 21.5 kB unused of the 69.7 kB framework chunk. None of
it is MUI's, so there was no reason to expect this to move.

---

## C. Hydration cost

### C6. Client components

```text
$ grep -rl '"use client"' apps/web/src | wc -l
34
```

**34, unchanged** - and the file list is identical, not merely the count. The
upgrade moved styling from props into `sx`; it did not move a single component
across the server/client boundary, which is what this check exists to catch.

### C7. Main-thread JavaScript execution time (mobile)

| page | before (total / ours) | after (total / ours) |
| --- | ---: | ---: |
| home | 1,980 / 1,969 ms | **1,813 / 1,801 ms** |
| catalog | 2,061 / 2,048 ms | **2,127 / 2,117 ms** |

Home down 8%, catalog up 3%, in opposite directions on the same change - which
is the signature of run-to-run variance rather than of the upgrade. TBT, the
metric that would corroborate a real change in main-thread work, moved by 5 ms
and 38 ms respectively. Nothing here supports a claim in either direction.
