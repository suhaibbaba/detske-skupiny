# The performance series

Every measurement taken during the rescue, in the order it was taken. Each pair
is a before-report and an after-report produced by the same harness, on the same
dataset, back to back — so the **delta** is attributable to the change even
where the absolute numbers are not production figures.

**Honest results are in here too.** A measurement series that only records wins
is a marketing document, and the two most useful entries below are a change that
made the bundle bigger and a phase that could not measure its own target.

## The standing caveat

Sanity is unreachable from every environment these reports were produced in —
`api.sanity.io` and `cdn.sanity.io` are both refused by the egress policy
(`403` to `CONNECT`). Every report states how it worked around that and what the
workaround costs. In short:

- **Phase 6** ran against a local groq-js stand-in with **no images at all**, so
  LCP is a text element in every run.
- **MUI v9** added a generated image CDN alongside the stand-in, so images load
  at representative sizes — which is why its numbers are the most trustworthy in
  the series.
- **Phase 7** could not produce a build at all and measured source-level proxies
  instead, saying so plainly.

None of these datasets is production-sized. List pages do less work in every
report than they would live.

## The series

| # | Report | What changed | Takeaway |
| --- | --- | --- | --- |
| 1 | [`phase6-before.md`](phase6-before.md) → [`phase6-after.md`](phase6-after.md) | Deferred the map, sized every image, self-hosted the font | **The map was the whole story.** `@maptiler/sdk` behind `dynamic(…, { ssr: false })` took ~315 kB gzip — about half of every heavy route — out of first load. The image work is verified structurally (the attributes in the HTML) and **not** measured, because no image loads in that harness. |
| 2 | [`mui-v9-before.md`](mui-v9-before.md) → [`mui-v9-after.md`](mui-v9-after.md) → [`mui-v9-diff.md`](mui-v9-diff.md) | Material UI 7.3.11 → 9.3.1 | **MUI v9 grew the bundle; kept anyway.** `@mui/*` +25.2 kB parsed (+7.7%) on home, first-load +11.5 kB on every route. Removing the entire system-props API deleted *one 0.4 kB module*; v9's accessibility and platform work added ~13.7 kB. Kept for the a11y and support story — see [ADR-005](../adr/005-stay-on-mui.md) — but **nothing about a v9 upgrade should be sold to this codebase on bundle size.** |
| 3 | [`phase7-before.md`](phase7-before.md) → [`phase7-after.md`](phase7-after.md) | Client-boundary pushdown, `sx` cleanup, lazy lightbox and carousel | **−22.9% client-module source lines** (4,895 → 3,773) and `yet-another-react-lightbox` off all eight routes. But the *target* was shared-client-baseline kilobytes, which needs a build this environment cannot produce — so the report measures a proxy and says so. |
| 4 | [`rsc-boundaries.md`](rsc-boundaries.md) | Fixing three module-graph errors the pushdown left behind | **The correction that matters.** Promoting three `styled()` primitives to client modules *looked* like a partial revert of phase 7 — +115 client source lines — and was the opposite: read off Turbopack's own client reference manifests, **every route got smaller**, and `/` and `/cooperation` each lost a client reference, because `styled.mjs` itself had been sitting in their client module lists. This is why source lines are a proxy and bytes are the number. |

## What the series never managed to measure

Recorded so nobody re-derives it:

- **Anything image-dependent, against real assets.** Every report served images
  from a local generator or not at all.
- **Catalog CLS.** Multi-modal at these sample sizes — the same tree returns
  0.000, 0.192 or 0.672 across runs — and Lighthouse's `layout-shift-elements`
  audit returned no elements in any of the 18 runs across both MUI trees. It
  needs more runs per data point *and* someone to find what actually shifts.
- **Production scale.** The largest synthetic dataset used was 30 schools and
  6 articles.

## Reproducing any of them

Each report carries its own harness notes and exact commands. The two that are
useful outside a full run:

```bash
# Bundle treemaps (webpack analyzer + Next's own analyzer)
ANALYZE=true npm run build -w apps/web -- --webpack   # .next/analyze/*.html
npx next experimental-analyze -o                      # .next/diagnostics/analyze
```

Both need `SANITY_PROJECT_ID` and `SANITY_DATASET` set, because `next build`
fails without them.
