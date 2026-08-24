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

Being "interactive-looking" is not a reason. A hover effect is CSS, and `sx`
and `styled` both run on the server. A link is a link.

## The inventory

| File | Lines | Why it is client |
| --- | ---: | --- |
| `theme/index.ts` | 19 | library - MUI's `ThemeProvider` |
| `providers/DefaultImageClientProvider.tsx` | 22 | context - the fallback image every `<Image>` reads |
| `features/blog/components/DynamicOffsetVar.tsx` | 28 | effect, browser - measures its own height into a CSS variable |
| `lib/i18n/IntlErrorHandlingProvider.tsx` | 29 | context - next-intl's provider |
| `components/layout/CopyrightYear.tsx` | 36 | effect - reads the clock per visitor, so the cached footer cannot go stale |
| `app/[locale]/error.tsx` | 39 | framework - Next requires error boundaries to be client |
| `features/catalog/components/CatalogTransition.tsx` | 49 | context, state - shares one `useTransition` between the filters and the list |
| `features/catalog/components/filters/FilterSidebarDialog.tsx` | 64 | state - the mobile filter dialog's open flag |
| `features/catalog/components/SchoolCount.tsx` | 66 | rendered by `SchoolList`, which is client |
| `components/rich-text/GalleryLightbox.tsx` | 72 | state - which slide the lightbox is on |
| `components/map/LazyMap.tsx` | 75 | library - `next/dynamic` with `ssr: false` is only legal in a client file |
| `components/ui/EmblaCarousel.tsx` | 81 | state, handler - the embla instance and its prev/next buttons |
| `components/layout/HeaderDrawer.tsx` | 82 | state - whether the mobile drawer is open |
| `components/ui/button/Button.tsx` | 85 | function prop - hands MUI `component={NextLink}` |
| `components/ui/link/Link.tsx` | 88 | function prop - same |
| `features/catalog/components/TypeBadge.tsx` | 97 | library - MUI `Chip` clones its `icon` element, which does not survive the boundary |
| `features/catalog/useSchoolFilters.ts` | 99 | state - nuqs URL state for the catalog filters |
| `features/home/components/MapRegionFilter.tsx` | 101 | state - the region the pills and the map agree on |
| `components/map/PopupContent.tsx` | 106 | handler - rendered into a MapTiler popup through a portal |
| `components/ui/language/LanguageSwitcher.tsx` | 114 | browser - reads `window.location` to pick the current domain |
| `features/blog/components/BlogCategories.tsx` | 114 | handler - pushes the selected category into the URL |
| `features/catalog/components/filters/FilterSidebar.tsx` | 115 | handler - the clear-filters button |
| `features/catalog/components/SearchBar.tsx` | 125 | state, effect - a debounced input |
| `features/catalog/components/filters/FilterCategoriesList.tsx` | 127 | handler - toggles a category |
| `components/forms/TurnstileWidget.tsx` | 131 | browser - loads and mounts Cloudflare's widget |
| `features/catalog/components/filters/FilterTagList.tsx` | 132 | handler - toggles a tag |
| `features/catalog/components/SchoolGridCard.tsx` | 175 | rendered by `SchoolList`, which is client |
| `features/cooperation/components/PreschoolCard.tsx` | 175 | library - same MUI `Chip` icon problem as `TypeBadge` |
| `features/catalog/components/SchoolList.tsx` | 177 | state - appends the load-more page without a navigation |
| `components/ui/image/Image.tsx` | 192 | context - reads the fallback image; also `styled(NextImage)` |
| `features/catalog/components/filters/FilterList.tsx` | 235 | state - the in-list search box |
| `components/forms/ContactForm.tsx` | 299 | state, handler - the contact form |
| `components/map/MapComponent.tsx` | 424 | browser, library - MapTiler needs a DOM node |

33 files, 3,773 lines.

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
