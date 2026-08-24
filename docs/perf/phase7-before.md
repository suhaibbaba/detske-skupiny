# Phase 7 - baseline

Branch point: `b4c01e0`.

## What could not be measured, and why

The plan for this phase called for a route table from `next build`, an
`ANALYZE=true` bundle snapshot, and a three-run median Lighthouse pass on the
home and catalog pages. None of the three ran.

`next build` reaches "Compiled successfully" and finishes TypeScript, then
stops:

```
Collecting page data using 3 workers ...
Error: Failed to collect configuration for /sitemap.xml
  [cause]: Error: Configuration must contain `projectId`
      at module evaluation (src/lib/sanity/client.ts:13:23)
```

Supplying a placeholder project id gets one step further and then fails the
same way for a different reason:

```
GET https://<project>.api.sanity.io/... resulted in HTTP 403 Forbidden
(Host not in allowlist: <project>.api.sanity.io.)
```

The environment this branch was built in has no Sanity credentials and its
network egress allowlist does not include `sanity.io`. Every page in this app
reads Sanity - `generateStaticParams`, `generateMetadata`, the sitemap and the
page bodies - so there is no production build to weigh, no chunk list to
analyse, and no server to point Lighthouse at.

Those numbers are worth having, and the commands are written down at the end of
this file so the next person with credentials can produce them in one pass.

## What was measured instead

Two things can be read off the source tree with no build, and both are stated
as what they are: proxies.

### 1. Client-module source lines

Every file carrying `"use client"`, counted.

| | Files | Lines |
| --- | ---: | ---: |
| Baseline (`b4c01e0`) | 34 | 4,895 |

This does not count what a client module drags in behind it, which is the
number that matters. It does track the direction of the boundary work.

### 2. Heavy packages reachable from a route through static imports

Walking `import` statements from each route's `page.tsx` (skipping
`import type`, which is erased, and `import(...)`, which is a chunk boundary),
which third-party packages does the route reach?

| Route | Reachable |
| --- | --- |
| `/` | `embla-carousel-react` · `yet-another-react-lightbox` · MUI |
| `/catalog` | `nuqs` · `yet-another-react-lightbox` · MUI |
| `/groups` | `yet-another-react-lightbox` · MUI |
| `/school` | `yet-another-react-lightbox` · MUI |
| `/articles` | `yet-another-react-lightbox` · MUI |
| `/article` | `yet-another-react-lightbox` · MUI |
| `/cooperation` | `embla-carousel-react` · `yet-another-react-lightbox` · MUI |
| `/contact` | `yet-another-react-lightbox` · MUI |

Two things stand out.

`@maptiler/sdk` is absent from every route, which is the phase 6 `LazyMap`
boundary doing its job - the only import of it sits behind
`dynamic(() => import(...), { ssr: false })`.

`yet-another-react-lightbox` is reachable from **all eight**, including the
contact page and the article index, neither of which has a gallery. The path is
`RichText` -> `SchoolGallery` -> the lightbox: the rich text renderer's
component map imports every block type statically, so one page's gallery puts
the library in every page's graph.

## Reproducing the missing numbers

With `SANITY_PROJECT_ID` and `SANITY_DATASET` set, and egress to `sanity.io`:

```bash
# route table and first-load JS per route
npm run build -w apps/web

# Turbopack's own analyzer, over the bundle that actually ships
cd apps/web && npx next experimental-analyze -o

# webpack's treemap - module sizes are real, chunk boundaries are not what ships
ANALYZE=true npm run build -w apps/web -- --webpack

# lighthouse, mobile, three runs, take the median
npm run build -w apps/web && npm run start -w apps/web &
npx lighthouse http://localhost:3000/       --preset=perf --form-factor=mobile
npx lighthouse http://localhost:3000/katalog/cesko --preset=perf --form-factor=mobile
```

The static reachability table above comes from a throwaway import-graph walker;
it is reproduced in `docs/perf/phase7-after.md` for the post state.
