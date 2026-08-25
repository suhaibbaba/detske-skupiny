# Post-refactor RSC boundary errors, and what the fixes cost

Three runtime errors survived the phase 7 boundary pushdown. All three are
module-graph problems rather than rendering problems, which is why the build
compiled and the unit tests passed through all of them.

## 1. `Functions cannot be passed directly to Client Components ... [..., function pageLayout]`

Seven route files declared their section wash as an `sx` callback:

```ts
const styles = {
  pageLayout: (theme: Theme) => ({
    background: theme.custom.gradients.pageCreamToLilac,
  }),
} satisfies Record<string, SxProps<Theme>>;
```

and handed it to `PageLayout`, which is a Server Component and passes it
straight through to MUI's `Box`, which is not:

```tsx
<Box component="section" sx={[sectionSx, ...(Array.isArray(sx) ? sx : [sx])]}>
```

`Box` is a Client Component, so `sx` is serialised. The array in that line is
what the error message's `[..., function pageLayout]` is naming - the composed
array with the route's callback as its second entry.

`components/layout/SkipLink.tsx` had the same bug in the harder-to-see shape: a
plain object with two *function-valued keys* (`zIndex`, `boxShadow`). It renders
on every route, in the root layout.

**Fixed** by reading the tokens as plain constants. `theme/custom.ts` is already
an ordinary object that `createTheme` merges onto the theme, so `custom.gradients.pageCreamToLilac`
is the same string `theme.custom.gradients.pageCreamToLilac` was; it is just
reachable without a callback. `features/school/components/InfoCardItem.tsx` had
already been fixed this way during phase 7 and carries the comment explaining
it - these eight files were simply missed.

`SkipLink`'s `zIndex` was `theme.zIndex.tooltip + 1`. MUI exports the `ZIndex`
*type* but not the scale as a value, so the arithmetic is written out as
`custom.zIndex.skipLink` and `theme/custom.test.ts` fails the build if it ever
stops equalling `theme.zIndex.tooltip + 1`.

### The sibling sweep

Everything that could carry a function across the boundary, and what was found:

| Checked | Result |
| --- | --- |
| `sections=` on a Client Component | none. `Zone` is a Server Component; both call sites (`/` and `/cooperation`) are Server Components, and `sections` is Sanity data |
| Registry output (`sections/registry.ts`) | never crosses a boundary. `Zone` looks a component up by `_type` and renders it itself - `<Section {...{fields: section}} {...props} />` - so the components stay values inside the server graph |
| `components=` on a Client Component | one call site, `RichText` → `PortableText`. `@portabletext/react` ships a `react-server` export condition and carries no `"use client"` anywhere, so the renderer and its components object both stay on the server |
| `blocks=` / `fields=` on a Client Component | no call sites |
| `on*={...}` handlers written in a server module | none outside tests |
| `component=` / `render*=` / `as=` written in a server module | none. `Button` and `Link` hand MUI `component={NextLink}` from *inside* their own `"use client"` files |
| Arrow functions in any JSX attribute in a server module | none |
| `(theme) => ...` in a server module | the eight files above, now zero |
| `filterProps`, `loadMoreScope`, `filters`, `scope` (catalog → `SchoolList`) | plain data objects |

## 2. The deprecated `@sanity/image-url` default export

`lib/sanity/imageUrl.ts` and `lib/seo/images.ts` both did
`import imageUrlBuilder from "@sanity/image-url"`, which logs

```
The default export of @sanity/image-url has been deprecated.
Use the named export `createImageUrlBuilder` instead.
```

once per process. Both now use the named export. Those are the only two
importers in the repo.

## 3. `Attempted to call the default export of @mui/material/styles/styled.mjs from the server`

`styled` is Emotion, and Emotion's `styled` is a client module. A Server
Component *rendering* a styled primitive is fine - the output SSRs normally.
A server module *calling* `styled()` is not: it holds a client reference, and
calling one throws at module evaluation.

Three files called `styled()` without the directive. `components/ui/image/Image.tsx`
is a fourth `styled()` call site and already had it.

| File | `styled()` target | Reached from the server graph? | Choice |
| --- | --- | --- | --- |
| `components/ui/DataChip.tsx` | `styled(Chip)` | **yes** - `features/home/components/SchoolCard.tsx` is a Server Component and imports `SchoolTag`, which imports this. That is the crash, on `/` and `/cooperation` | re-promoted to `"use client"` |
| `components/ui/SectionHeading.tsx` | `styled(Typography, {shouldForwardProp})` | no - only the three catalog filter lists, all client | re-promoted to `"use client"` |
| `components/ui/textarea/Textarea.tsx` | `styled(BaseTextareaAutosize)` | no - only `ContactForm`, which is client | re-promoted to `"use client"` |
| `components/ui/image/Image.tsx` | `styled(NextImage)` | n/a | already `"use client"`, unchanged |

Nothing was converted to `sx` instead. Each of the three wraps a MUI component
that already carries `"use client"` - `Chip`, `Typography`, `TextareaAutosize` -
so keeping the primitive is free at the boundary, and rewriting the
`shouldForwardProp` heading and the template-literal textarea as `sx` would have
been churn for no bytes. The numbers below confirm that.

## The guard

Two inline ESLint rules in `apps/web/eslint.config.mjs`, both errors, both in
`npm run lint`, which CI runs before the build:

- `boundary/client-only-styled` - a `styled(` call (or a `styled.div\`\``
  tagged template) in a module with no `"use client"` directive prologue.
- `boundary/serializable-sx` - a function inside an `sx={...}` attribute, or
  anywhere inside a `satisfies Record<string, SxProps<Theme>>` table, in a
  module with no directive. This catches the nested `zIndex: (theme) => ...`
  shape as well as the top-level callback.

Both were confirmed against deliberately broken files before being left in
place. A helper that *returns* an sx object is called at its call site and
produces a plain object, so it is not reported.

## Client chunks, before and after

Measured from Turbopack's own `page_client-reference-manifest.js` files: for
each route, the union of the JS chunks every client module on that route pulls
in, summed by on-disk size. Two builds of the same tree, `766ec92` and this
branch.

| Route | Client refs | Bytes before | Bytes after | Delta |
| --- | --- | ---: | ---: | ---: |
| `/` | 66 → **65** | 475,811 | 475,725 | **-86** |
| `/cooperation` | 66 → **65** | 475,811 | 475,725 | **-86** |
| `/catalog/[...slug]` | 53 → 53 | 780,522 | 780,426 | -96 |
| `/groups/[group]` | 54 → 54 | 434,430 | 434,301 | -129 |
| `/groups` | 51 → 51 | 421,314 | 421,185 | -129 |
| `/articles` | 54 → 54 | 429,913 | 429,784 | -129 |
| `/articles/[slug]` | 50 → 50 | 421,314 | 421,185 | -129 |
| `/contact-us` | 51 → 51 | 475,010 | 474,881 | -129 |
| `/_not-found` | 13 → 13 | 135,359 | 135,359 | 0 |

**No route grew.** Three files gained `"use client"` and the client surface
still got smaller, which is worth stating plainly because the source-line
proxy in `docs/client-surface.md` says the opposite (+115 lines).

The reason is in the module list for `/`:

```
removed: @mui/material/Chip/Chip.mjs
removed: @mui/material/styles/styled.mjs      <- the bug, visible in the manifest
added:   src/components/ui/DataChip.tsx
```

`styled.mjs` was in the home page's client module list, which is precisely what
"called from the server" means. With `DataChip` a client module, `Chip` and
`styled` are ordinary imports *inside* its chunk rather than two more boundary
crossings, and the route ends up one reference lighter.

The routes that gained nothing still shed ~129 bytes; that is the
`@sanity/image-url` change, which reaches the client graph through
`components/ui/image/Image.tsx`.

The phase 7 pushdown is intact: `/catalog` and the school page have byte-for-
byte the same client module list as before.

## What this sandbox could not verify

No Sanity credentials and no egress to `sanity.io` (`403 Host not in allowlist`),
which is the same wall `docs/perf/phase7-before.md` describes.

| Check | Result |
| --- | --- |
| `npm run lint` | pass, 0 errors, 0 warnings |
| `npm run typecheck` | pass |
| `npm run test` | 358 passing, 21 files |
| `npm run build` | `✓ Compiled successfully in 11.9s`, then `Export encountered an error on /[locale]/articles/page` - Sanity 403 |
| `npm run start` | cannot run; a failed export writes no `prerender-manifest.json` |
| `npm run test:e2e` | 5 passed, 42 failed, 41 skipped - every failure is a 500 behind 437 Sanity 403s |
| `npm run test:crawl` | 1 failed: `http://localhost:3000/ -> 500`, same cause |

The three errors themselves *were* reproduced and fixed against a running dev
server, on a temporary route that renders `PageLayout`, `SchoolTag` (a Server
Component, so `DataChip` is reached from the server graph), `SectionHeading`,
`Textarea` and `urlImageFor` without touching Sanity. Before:

```
⨯ Error: Attempted to call the default export of .../styled.mjs from the server
    at module evaluation (src/components/ui/DataChip.tsx:15:24)
    at module evaluation (src/features/school/components/SchoolTag.tsx:3:1)
⨯ Error: Functions cannot be passed directly to Client Components ...
  [..., function pageLayout]
The default export of @sanity/image-url has been deprecated.
```

After: `GET 200`, no errors, no warnings, with the gradient, the chip, the
heading and the textarea all in the served HTML. The probe route is not
committed.

## The catalog's 2.7s, unresolved

The production number for `/catalog/czech-republic` needs a real dataset. What
can be said without one is where the awaits sit, because the route serialises
three Sanity round trips that do not have to be serial:

```ts
// app/[locale]/catalog/[...slug]/page.tsx
const [filterContent, { pageHero, totalSchools }] = await Promise.all([
  fetchFilters(catalog, locale),      //  round trip 1  ┐ blocks the shell
  fetchSchoolPage({ ... }),           //  round trip 1  ┘
]);

const listPromise = fetchSchoolList({ ... });   // created only after that await
const markersPromise = fetchSchoolMarkers(scope);
```

- `fetchSchoolList` is itself two serial queries - `schoolOrderQuery` for every
  matching id, then `schoolCardsQuery` to hydrate the requested page - so the
  chain is **filters → order → cards**, three round trips deep, and the first
  two are not overlapped with anything.
- `listPromise` and `markersPromise` are constructed *after* the `await`, so
  neither starts until the filter and hero queries have both come back. Hoisting
  them above the `await` would overlap the deepest chain with the shell's own
  queries at no behavioural cost - but that is a change to make against a
  measurement, not before one.
- `fetchSchoolMarkers` for `country: czech-republic` returns every school in the
  country with no filter narrowing (deliberately - it is shared across filter
  combinations), so it is the largest payload on the route even though it is not
  the longest chain.

Every one of these is `"use cache"` with `cacheLife("max")`, so the number only
appears on a cold entry. Whether the 2.7s the dev server reported was that cold
path or the aborted render is not answerable here: the serialisation error is
thrown inside `CatalogContent`, which is *above* the `Suspense` boundary the
school list streams behind, so the failure discarded the shell rather than
letting it paint - the "application-code" figure covers a render that was never
going to stream. That makes the dev number an upper bound and not evidence of a
query problem.

To settle it, with credentials:

```bash
npm run build -w apps/web && npm run start -w apps/web
# cold, then warm:
curl -o /dev/null -s -w '%{time_starttransfer} %{time_total}\n' \
  http://localhost:3000/katalog/ceska-republika
```

and read the per-request `application-code` timings the server logs. If the
uncached number is still over a second, the chain above is where to look first.
