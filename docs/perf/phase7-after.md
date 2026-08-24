# Phase 7 - after

Read `phase7-before.md` first: it explains why there is no build, no bundle
snapshot and no Lighthouse run in either file, and how to produce all three
with credentials.

Everything below is measured against the branch point, `b4c01e0`.

## Client-module source lines

| | Files | Lines |
| --- | ---: | ---: |
| Before | 34 | 4,895 |
| After | 33 | 3,773 |
| Diff | -1 | **-1,122 (-22.9%)** |

Roughly two thirds of the reduction is the styling pass - style objects lost a
wrapper level and took 165 unused imports with them - and one third is the
boundary work. The split, measured at the commit between them: 4,895 -> 4,130
(styling, -15.6%), 4,130 -> 3,773 (boundaries, -8.6%).

Source lines are a proxy for the number the phase target was written against,
which is the shared client baseline in kilobytes. See `phase7-before.md`.

## Heavy packages reachable from a route through static imports

Walking `import` statements from each route's `page.tsx`, skipping
`import type` (erased) and `import(...)` (a chunk boundary).

| Route | Before | After |
| --- | --- | --- |
| `/` | embla · lightbox · MUI | MUI |
| `/catalog` | nuqs · lightbox · MUI | nuqs · MUI |
| `/groups` | lightbox · MUI | MUI |
| `/school` | lightbox · MUI | MUI |
| `/articles` | lightbox · MUI | MUI |
| `/article` | lightbox · MUI | MUI |
| `/cooperation` | embla · lightbox · MUI | MUI |
| `/contact` | lightbox · MUI | MUI |

`@maptiler/sdk` is absent from both columns - phase 6 already put it behind
`dynamic(..., { ssr: false })`, and this phase confirmed it rather than
changing it.

What moved:

- **`yet-another-react-lightbox`, off all eight routes.** It was reachable from
  every page, including the contact page, because the rich text renderer
  imports every block type statically and one of those blocks is the school
  gallery. `GalleryLightboxDialog` is now the only module that imports it, and
  `GalleryLightbox` reaches that module through `dynamic(..., { ssr: false })`
  and mounts it only once a visitor has actually tapped a photo. A closed
  lightbox renders nothing, so nothing is lost by not having it.
- **`embla-carousel-react`, off `/` and `/cooperation`.** The carousel is well
  below the fold on both. `dynamic()` without `ssr: false`, so the cards inside
  it are still server-rendered - they reach the carousel as children.

## Changes that were made, and why each one is defensible without a build

| Change | Basis |
| --- | --- |
| Lightbox behind `next/dynamic`, mounted on open | Removes it from all eight routes' static graph (table above) |
| Carousel behind `next/dynamic` | Removes it from two routes' static graph |
| `preconnect` to `cdn.sanity.io`, `dns-prefetch` to it and to `api.maptiler.com` | Adds three `<link>` tags; no JavaScript, no bundle effect. Every image on the site is a Sanity CDN URL |
| Header, `Menu`, `MapCollection`, `SchoolGallery` moved to the server | Fewer client modules, measured above |

## Changes that were considered and NOT made

The plan's rule was to keep only measured wins and revert anything that did not
move a number. With no build there is no number for most of what a bundle pass
would normally try, so the following were left alone rather than committed on
faith:

- **`@mui/icons-material` per-icon imports.** Already the case - all 18 import
  sites are deep imports like `@mui/icons-material/Check`. Verified, not
  changed.
- **`@maptiler/sdk` absent from non-map routes.** Already the case. Verified,
  not changed.
- **"Any route exceeding the shared baseline by >50 kB gets its heavy imports
  lazy-loaded."** This needs the per-route first-load figures from `next build`
  to identify which routes those are. Not attempted.
- **Splitting MUI further, or swapping components for lighter ones.** Every
  candidate here is a guess without a treemap.

## Suspense granularity

Checked, not changed: the catalog's hero and filter sidebar still render
outside the `Suspense` boundary that the school list streams behind, so the
page shell paints without waiting on the list query. The boundary survived the
folder restructure - `app/[locale]/catalog/[...slug]/page.tsx` still wraps
`SchoolListAsync` alone.

Its fallback changed from a bare `CircularProgress` to a `CardGridSkeleton`
that matches the grid's real geometry; see the skeleton work in the same phase.
