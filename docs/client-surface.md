# The client surface

Every file below carries `"use client"`. Each one is here because something in
it cannot run on the server, and the line next to it says what.

**Adding `"use client"` to a file means adding a row here with its reason.** A
file that cannot be given one belongs on the server, or belongs split - a
static shell that renders an interactive leaf, with the leaf taking the shell's
contents as `children`. Children handed from a server component through a
client component stay server-rendered; that is the mechanism most of the
demotions below used.

## What counts as a reason

- **state** - `useState`, `useReducer`, `useTransition`
- **effect** - `useEffect`, `useLayoutEffect`, `useSyncExternalStore`
- **handler** - an event handler the component itself owns
- **browser** - `window`, `document`, a DOM measurement
- **context** - `createContext` / `useContext`
- **function prop** - hands a component or callback to another component,
  which cannot cross the server/client boundary
- **library** - a dependency that is client-only
- **styled** - the module calls `styled()`; see the rule below

Being "interactive-looking" is not a reason. A hover effect is CSS. A link is
a link.

## Three rules about styling, all learned the hard way

**1. Any module that calls `styled()` is a client module.**

`styled` is Emotion, and Emotion's `styled` carries `"use client"` all the way
down - `@mui/material/styles/styled.mjs` and `@mui/system/styled` both have the
directive. A server module that imports it does not get a function, it gets a
client *reference*, so calling it throws at module evaluation:

```text
Attempted to call the default export of .../@mui/material/styles/styled.mjs
from the server, but it's on the client.
```

This is about the module graph, not about rendering: the output SSRs perfectly
well. So the fix is never to stop using `styled`, and it is certainly not
`"use server"` - that directive declares a Server Action and has nothing to do
with serialisation.

**Styled primitives live in their own small `"use client"` files, and Server
Components import and render them freely.** A Server Component may render a
Client Component; what it may not do is *be* one. The children it hands that
component stay server-rendered, so the phase 7 pushdown survives intact. The
three primitives below cost nothing extra either way - each wraps a MUI
component (`Chip`, `Typography`, `TextareaAutosize`) that already carries the
directive, so the boundary sits exactly where it always did.

Where the styling does not need `styled()` at all, express it as `sx` at the
call site instead and keep the module on the server.

`eslint`'s `boundary/client-only-styled` fails the build on a `styled(` call in
a module without the directive.

**2. An `sx` written in a server module has to be serialisable.**

Every MUI component is a Client Component, so whatever a Server Component puts
in `sx` is serialised across the boundary. A `(theme) => ...` callback - or a
single function-valued key inside the object, which is easier to miss - is:

```text
Functions cannot be passed directly to Client Components unless you
explicitly expose it by marking it with "use server".
```

Again, `"use server"` is not the fix. The theme reaches `sx` without a callback
in two ways: palette values as string paths (`bgcolor: "primary.light"`,
`color: "custom.textHeading"`), and the non-palette tokens as the plain
constants exported from `theme/custom.ts`. `theme.custom` and
`sx={(theme) => ...}` stay the right way in from a client module.

`eslint`'s `boundary/serializable-sx` fails the build on a function inside an
`sx={...}` attribute or a `satisfies Record<string, SxProps<Theme>>` table in a
module without the directive. A helper that *returns* an sx object
(`const chipSx = (colour): SxProps<Theme> => ({...})`) is called at the call
site and produces a plain object, so it is not this bug and is not reported.

**3. Styles go in `sx`. They are never spread onto a component as props.**

```tsx
<Button {...styles.button}>          // no
<Button sx={styles.button}>          // yes
```

MUI v9 removed the system props from components. The spread form worked while
they existed, and now fails in the worst possible way: a JSX spread is *not*
excess-property checked, so it still typechecks, and at runtime every
declaration lands on the DOM node as a bare HTML attribute -
`padding="10px 20px"`, `bgcolor="var(--mui-palette-common-white)"` - which
Emotion never sees. The component renders unstyled and nothing warns. The blog
category pills shipped like that; see `docs/perf/rsc-boundaries.md`.

Compose with MUI's array form, later entries winning. Never object-spread two
`sx` values (`{...base, ...extra}`): `sx` is as legally an array or a callback
as it is an object, so the spread is wrong for two of the three shapes - and
never reintroduce a deep merge for it.

```tsx
sx={[styles.base, callerSx]}                       // compose
sx={selected ? styles.active : styles.button}      // choose
const styles = { button: [pill, { ... }] }         // share a base
```

When a component takes `sx` and also spreads the rest of its props, pull `sx`
out of the rest first - otherwise the later spread puts the caller's `sx` back
on the element and silently discards the component's own.

`eslint`'s `boundary/no-style-object-spread` fails the build on a spread of a
`styles`-ish member, of either branch of a ternary, of a local const whose
object literal is mostly style properties, and of an inline style literal. It
has no allowlist: genuine props spreads (`{...props}`, `{...otherProps}`,
`{...sizing}`, `{...{ fields: section }}`) are all quiet because they are
either parameters or objects whose keys are real props. If a component ever
does take `width` and `padding` as genuine props, disable the rule on that line
rather than widening the pattern.

## Variant candidates

Style objects that now repeat across files, listed rather than built - each is
a judgement call about whether a shared name is worth the indirection, and
`theme/components.ts` already carries three `MuiButton` variants (`primary`,
`secondary`, `ghost`) that are the natural home for the first two.

| Repeated shape | Where | Suggested |
| --- | --- | --- |
| Selected/unselected pill: `borderRadius: 24px`, white when unselected, theme colours when selected | `features/blog/BlogCategories` (ternary `sx`), `features/home/MapRegionFilter.filterButton` and `features/catalog/filters/FilterCategoriesList.item` (both via an `&.selected` class) | `MuiButton` variant `pill`, with the selected state as a class the three already agree on |
| Card surface: `bgcolor: common.white` + `borderRadius: 24px` + `custom.shadows.card` | `catalog/SchoolsMap.mapWrapper`, `school/SchoolMap.mapWrapper`, `home/MapRegionFilter.mapWrapper`, `home/SchoolCard.card`, `home/InfoBlock`, `blog/BlogCard.card` (20px, the one outlier) | `theme/custom.ts` token `surfaces.card`, or a `Surface` styled primitive |
| "View all" text link: `custom.textLilac`, 500/16px, `mt: 16px`, `cursor: pointer`, `alignSelf: baseline`, `&:hover → primary.dark` | `catalog/filters/FilterTagList.viewAll` and `FilterCategoriesList.viewAll` - byte-identical | shared `sx` const, or a `MuiLink` variant `quiet` |

Three files still hold a hand-written `var(--mui-palette-*)` string where a
theme path would do - `layout/Footer`, `home/SchoolCard`, `home/InfoBlock`,
plus a `2px solid var(--mui-palette-primary-main)` outline in
`FilterCategoriesList`. Left alone deliberately: none of them was being edited,
and a colour sweep wants to be its own diff.

## The inventory

| File | Lines | Why it is client |
| --- | ---: | --- |
| `theme/index.ts` | 19 | library - MUI's `ThemeProvider` |
| `providers/DefaultImageClientProvider.tsx` | 22 | context - the fallback image every `<Image>` reads |
| `features/blog/components/DynamicOffsetVar.tsx` | 28 | effect, browser - measures its own height into a CSS variable |
| `lib/i18n/IntlErrorHandlingProvider.tsx` | 29 | context - next-intl's provider |
| `components/ui/DataChip.tsx` | 30 | styled - `styled(Chip)`; `Chip` is a client module already |
| `components/ui/SectionHeading.tsx` | 32 | styled - `styled(Typography)`; `Typography` is a client module already |
| `components/layout/CopyrightYear.tsx` | 36 | effect - reads the clock per visitor, so the cached footer cannot go stale |
| `app/[locale]/error.tsx` | 39 | framework - Next requires error boundaries to be client |
| `components/map/LazyMap.tsx` | 48 | library - `next/dynamic` with `ssr: false` is only legal in a client file |
| `features/catalog/components/CatalogTransition.tsx` | 49 | context, state - shares one `useTransition` between the filters and the list |
| `components/ui/textarea/Textarea.tsx` | 53 | styled - `styled(TextareaAutosize)`; its only call site, `ContactForm`, is client anyway |
| `components/rich-text/GalleryLightboxDialog.tsx` | 54 | library - `yet-another-react-lightbox`, reached only through `dynamic(..., { ssr: false })` |
| `components/rich-text/GalleryLightbox.tsx` | 65 | state - which slide the lightbox is on |
| `features/catalog/components/SchoolCount.tsx` | 66 | rendered by `SchoolList`, which is client |
| `features/catalog/components/filters/FilterSidebarDialog.tsx` | 68 | state - the mobile filter dialog's open flag |
| `components/ui/EmblaCarousel.tsx` | 81 | state, handler - the embla instance and its prev/next buttons |
| `components/ui/button/Button.tsx` | 85 | function prop - hands MUI `component={NextLink}` |
| `components/ui/link/Link.tsx` | 88 | function prop - same |
| `components/layout/HeaderDrawer.tsx` | 95 | state - whether the mobile drawer is open |
| `features/catalog/components/TypeBadge.tsx` | 97 | library - MUI `Chip` clones its `icon` element, which does not survive the boundary |
| `features/catalog/useSchoolFilters.ts` | 99 | state - nuqs URL state for the catalog filters |
| `features/home/components/MapRegionFilter.tsx` | 101 | state - the region the pills and the map agree on |
| `features/blog/components/BlogCategories.tsx` | 114 | handler - pushes the selected category into the URL |
| `features/catalog/components/filters/FilterSidebar.tsx` | 114 | handler - the clear-filters button |
| `features/catalog/components/SearchBar.tsx` | 125 | state, effect - a debounced input |
| `features/catalog/components/filters/FilterCategoriesList.tsx` | 127 | handler - toggles a category |
| `components/map/PopupContent.tsx` | 130 | handler - rendered into a MapTiler popup through a portal |
| `components/forms/TurnstileWidget.tsx` | 131 | browser - loads and mounts Cloudflare's widget |
| `features/catalog/components/filters/FilterTagList.tsx` | 132 | handler - toggles a tag |
| `components/ui/language/LanguageSwitcher.tsx` | 143 | browser - reads `window.location` to pick the current domain |
| `features/cooperation/components/PreschoolCard.tsx` | 175 | library - same MUI `Chip` icon problem as `TypeBadge` |
| `features/catalog/components/SchoolGridCard.tsx` | 184 | rendered by `SchoolList`, which is client |
| `components/ui/image/Image.tsx` | 192 | context - reads the fallback image; also styled - `styled(NextImage)` |
| `features/catalog/components/SchoolList.tsx` | 224 | state - appends the load-more page without a navigation |
| `features/catalog/components/filters/FilterList.tsx` | 235 | state - the in-list search box |
| `components/forms/ContactForm.tsx` | 354 | state, handler - the contact form |
| `components/map/MapComponent.tsx` | 555 | browser, library - MapTiler needs a DOM node; the school list beside it is its accessible alternative, see docs/a11y.md |

37 files, 4,219 lines.

The three `styled` rows and `GalleryLightboxDialog` are the only additions
since phase 7; the line counts moved because the accessibility and Studio
branches landed in between. Phase 7's own figures are in
`docs/perf/phase7-after.md` and are left as they were measured.

## What moved to the server in phase 7

| Component | Was | Now |
| --- | --- | --- |
| `HeaderClientPage` (225 lines) | the entire header - logo, nav, CTA, MUI shell | deleted. `Header` is a Server Component; `HeaderDrawer` (82 lines) holds the one `useState` and takes its panel as `children` |
| `Menu` | client, for an `onItemClick` that closed the drawer | server. `HeaderDrawer` closes on a delegated click on any link or button inside it |
| `MapCollection` | client - heading, copy, region pills and map together | server shell; `MapRegionFilter` is the client half |
| `SchoolGallery` (222 lines) | client - every tile, including the page's LCP image, carried an `onClick` | server. `GalleryLightbox` (72 lines) reads `data-gallery-index` off the click |
| `Footer` | read the clock while rendering | server, plus the `CopyrightYear` leaf |

## Measurement

Client-module **source lines** - the lines in files carrying the directive -
went from 4,895 to 3,773, **-22.9%**. Roughly two thirds of that is the styling
pass (style objects lost a wrapper level and 165 unused imports went with them)
and one third is the boundary work above.

Source lines are a proxy, and a rough one: they do not count what a client
module drags in behind it, which is the number that matters and the one the
target of "-15-25% of the shared client baseline" was written against. That
number needs a production build, and this sandbox cannot produce one - the
build stops at the Sanity credentials it has no network egress for. See
`docs/perf/phase7-before.md`.

## Measurement, after the boundary fixes

The three `styled` promotions add 115 source lines to the client surface, which
sounds like a partial revert of the phase 7 win and is not one. Real per-route
client-chunk bytes, read off Turbopack's own client reference manifests, are in
`docs/perf/rsc-boundaries.md`: every route got *smaller*, and `/` and
`/cooperation` lost a client reference, because `styled.mjs` itself had been
sitting in their client module list - which is exactly the bug.
