# MUI v9 upgrade - before vs after

Every row is `docs/perf/mui-v9-before.md` against `docs/perf/mui-v9-after.md`:
MUI 7.3.11 → 9.3.1 on `apps/web`, same dataset, same emulator, same Chrome,
same throttling, nothing else changed between the two runs.

The table is generated from the two runs' raw output rather than transcribed,
so both columns are read by the same code from the same files.

**There are no good/bad markers in the delta column on purpose.** Several rows
are dominated by run-to-run variance, and a tick beside them would assert
something the data does not support. Which rows mean something is below the
table.

| metric | before | after | delta | delta % |
| --- | ---: | ---: | ---: | ---: |
| .next/static/chunks total | 2889.0 kB | 2895.8 kB | +6.9 kB | +0.2% |
| next build | 47 s | 43 s | -4 s | -8.5% |
| first-load JS, home (parsed) | 1061.5 kB | 1073.0 kB | +11.5 kB | +1.1% |
| first-load JS, home (gzip) | 340.0 kB | 344.4 kB | +4.4 kB | +1.3% |
| first-load chunks, home | 22 | 22 | 0 | 0.0% |
| first-load JS, catalog (parsed) | 1368.9 kB | 1378.7 kB | +9.8 kB | +0.7% |
| first-load JS, catalog (gzip) | 412.9 kB | 416.9 kB | +3.9 kB | +1.0% |
| first-load chunks, catalog | 23 | 23 | 0 | 0.0% |
| first-load JS, cooperation (parsed) | 1061.5 kB | 1073.0 kB | +11.5 kB | +1.1% |
| first-load JS, cooperation (gzip) | 340.0 kB | 344.4 kB | +4.4 kB | +1.3% |
| first-load chunks, cooperation | 22 | 22 | 0 | 0.0% |
| first-load JS, articles (parsed) | 1011.7 kB | 1023.6 kB | +11.9 kB | +1.2% |
| first-load JS, articles (gzip) | 322.7 kB | 327.1 kB | +4.4 kB | +1.4% |
| first-load chunks, articles | 21 | 21 | 0 | 0.0% |
| first-load JS, contact (parsed) | 1053.3 kB | 1064.9 kB | +11.6 kB | +1.1% |
| first-load JS, contact (gzip) | 336.3 kB | 340.7 kB | +4.4 kB | +1.3% |
| first-load chunks, contact | 22 | 22 | 0 | 0.0% |
| analyzer home: total parsed | 2522.7 kB | 2536.6 kB | +14.0 kB | +0.6% |
| analyzer home: total gzip | 821.2 kB | 828.5 kB | +7.3 kB | +0.9% |
| analyzer home: modules | 590 | 595 | +5 | +0.8% |
| analyzer home: @mui/* parsed | 328.7 kB | 353.9 kB | +25.2 kB | +7.7% |
| analyzer home: @mui/* gzip | 148.7 kB | 160.5 kB | +11.8 kB | +7.9% |
| analyzer home: @emotion/* parsed | 38.4 kB | 38.5 kB | +0.0 kB | +0.1% |
| analyzer home: @emotion/* gzip | 18.5 kB | 18.5 kB | +0.0 kB | +0.1% |
| analyzer catalog: total parsed | 2829.2 kB | 2841.6 kB | +12.3 kB | +0.4% |
| analyzer catalog: total gzip | 931.3 kB | 937.8 kB | +6.5 kB | +0.7% |
| analyzer catalog: modules | 697 | 701 | +4 | +0.6% |
| analyzer catalog: @mui/* parsed | 343.6 kB | 367.0 kB | +23.4 kB | +6.8% |
| analyzer catalog: @mui/* gzip | 155.1 kB | 166.3 kB | +11.1 kB | +7.2% |
| analyzer catalog: @emotion/* parsed | 38.4 kB | 38.5 kB | +0.0 kB | +0.1% |
| analyzer catalog: @emotion/* gzip | 18.5 kB | 18.5 kB | +0.0 kB | +0.1% |
| catalog/desktop performance | 78 | 78 | 0 | 0.0% |
| catalog/desktop LCP ms | 1037 ms | 1011 ms | -26 ms | -2.5% |
| catalog/desktop TBT ms | 33 ms | 38 ms | +5 ms | +16.9% |
| catalog/desktop CLS | 0.484 | 0.484 | 0 | 0.0% |
| catalog/desktop Speed Index ms | 730 ms | 736 ms | +7 ms | +0.9% |
| catalog/desktop FCP ms | 475 ms | 467 ms | -8 ms | -1.6% |
| catalog/mobile performance | 44 | 59 | +15 | +34.1% |
| catalog/mobile LCP ms | 6970 ms | 4902 ms | -2067 ms | -29.7% |
| catalog/mobile TBT ms | 546 ms | 585 ms | +38 ms | +7.0% |
| catalog/mobile CLS | 0.672 | 0 | -0.672 | -100.0% |
| catalog/mobile Speed Index ms | 3120 ms | 2596 ms | -524 ms | -16.8% |
| catalog/mobile FCP ms | 1959 ms | 1774 ms | -185 ms | -9.5% |
| catalog/mobile bootup total ms | 2061 ms | 2127 ms | +66 ms | +3.2% |
| catalog/mobile bootup ours ms | 2048 ms | 2117 ms | +69 ms | +3.4% |
| home/desktop performance | 99 | 99 | 0 | 0.0% |
| home/desktop LCP ms | 974 ms | 997 ms | +23 ms | +2.3% |
| home/desktop TBT ms | 36 ms | 36 ms | 0 ms | -0.0% |
| home/desktop CLS | 0 | 0 | 0 | n/a |
| home/desktop Speed Index ms | 568 ms | 696 ms | +127 ms | +22.4% |
| home/desktop FCP ms | 474 ms | 492 ms | +18 ms | +3.9% |
| home/desktop unused JS bytes | 293.4 kB | 293.3 kB | -0.1 kB | -0.0% |
| home/mobile performance | 71 | 69 | -2 | -2.8% |
| home/mobile LCP ms | 4678 ms | 4884 ms | +206 ms | +4.4% |
| home/mobile TBT ms | 469 ms | 464 ms | -5 ms | -1.1% |
| home/mobile CLS | 0 | 0 | 0 | n/a |
| home/mobile Speed Index ms | 1872 ms | 2483 ms | +610 ms | +32.6% |
| home/mobile FCP ms | 1688 ms | 1764 ms | +76 ms | +4.5% |
| home/mobile unused JS bytes | 293.3 kB | 293.1 kB | -0.2 kB | -0.1% |
| home/mobile bootup total ms | 1980 ms | 1813 ms | -167 ms | -8.4% |
| home/mobile bootup ours ms | 1969 ms | 1801 ms | -168 ms | -8.5% |
| "use client" files | 34 | 34 | 0 | 0.0% |

## Interpretation

**v9's smaller-bundle claim did not materialise here - the bundle grew.**
`@mui/*` is up 25.2 kB parsed (+7.7%) on home and 23.4 kB (+6.8%) on catalog,
and first-load JS is up ~11.5 kB on every route. Diffing the two builds module
by module says exactly why: removing the entire system-props API from `Box`,
`Stack`, `Typography`, `Grid` and `Link` deleted **one 0.4 kB module**
(`@mui/system/styleFunctionSx/extendSxProp`), while v9's accessibility and
platform work added 13.7 kB of new modules - `useRovingTabIndex` for the Menu
keyboard rework, MUI's own `Transition` and `useReducedMotion` replacing
react-transition-group, `useButtonBase` and `useFocusableWhenDisabled` for the
ButtonBase changes. That is a defensible trade, but it is not a smaller bundle,
and nothing about a v9 upgrade should be sold to this codebase on bundle size.

**`@emotion/*` did not move at all** (38.4 → 38.5 kB), because v9 still uses
Emotion. `@mui/material-pigment-css` is an optional peer dependency, not the
default engine - if the goal is to get Emotion's runtime out of the bundle,
that is a separate project and this upgrade is only the prerequisite.

**sx performance did not show up in TBT, and TBT is the only runtime row worth
reading.** TBT moved 36 → 36 ms on home desktop, 469 → 464 ms on home mobile,
33 → 38 ms and 546 → 585 ms on catalog: noise in both directions. The large
catalog movements in this table - mobile performance 44 → 59, mobile CLS 0.672
→ 0.000 - are **not** the upgrade: catalog CLS is multi-modal, returning
0.000, 0.192 or 0.672 depending on the run, and nine runs on the upgraded tree
produce all three (median 0.192). Both three-run medians are draws from the
same distribution. The same caution applies to `bootup ours ms`, which fell 8%
on home and rose 3% on catalog from one change.

## What is solid

| | |
| --- | --- |
| bundle grew | `@mui/*` +25.2 kB parsed / +11.8 kB gzip on home; first-load +11.5 kB |
| Emotion unchanged | 38.4 → 38.5 kB - v9 still ships it |
| hydration unchanged | 34 client components before and after, same files |
| route table unchanged | `diff` of the two build outputs is empty |
| unused JS unchanged | 293.4 → 293.3 kB on home, all of it the map chunk |
| desktop scores unchanged | home 99 → 99, catalog 78 → 78 |

## What this run cannot answer

- **Catalog CLS.** Multi-modal at this sample size; needs more runs per data
  point, and separately needs someone to find what shifts - Lighthouse's
  `layout-shift-elements` audit returns no elements in any of the 18 runs
  across both trees, which is where `docs/perf-after-phase6.md` also stopped.
- **Anything image-dependent.** `cdn.sanity.io` is blocked in this sandbox, so
  images are served by a local generator at representative but not real sizes.
- **Production scale.** The dataset is 30 schools and 6 articles, so list pages
  do less work here than they would live.

## Artefacts

Both runs keep their raw output - Lighthouse JSON, both analyzers' reports, the
route tables and the build logs - under `perf-harness/results/{before,after}/`
in the session scratchpad. The `@next/bundle-analyzer` treemaps are the
browsable ones:

| | path |
| --- | --- |
| before, client bundle | `results/before/analyze-html/client.html` (618 kB) |
| before, server bundles | `results/before/analyze-html/{nodejs,edge}.html` |
| after, client bundle | `results/after/analyze-html/client.html` (593 kB) |
| after, server bundles | `results/after/analyze-html/{nodejs,edge}.html` |

Regenerate either with:

```bash
ANALYZE=true npm run build -w apps/web -- --webpack   # writes .next/analyze/*.html
npx next experimental-analyze -o                      # writes .next/diagnostics/analyze
```

No screenshots were taken: the treemaps are interactive HTML and a static image
of one is strictly less useful than the file.
