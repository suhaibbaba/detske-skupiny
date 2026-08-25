# 005 — Stay on MUI, and take v9 despite a bigger bundle

## Context

The inherited app was on Material UI 7.1.0, pinned by an `overrides` block in
the root `package.json` — the whole MUI family held at one version while
`apps/web` asked for `^7.1.0`. Nothing recorded why.

MUI is not a small dependency. `@mui/*` plus Emotion accounted for a
substantial share of every route's first load, and the styling in the codebase
leaned on MUI's *system props* — `<Box mt={2} bgcolor="...">` — which v9
removes.

Three options were on the table: stay on v7 and accept the pin, migrate off MUI
entirely, or upgrade to v9 and pay the migration.

## Decision

**Stay on MUI, drop the pin, and upgrade 7 → 9 — accepting a measured bundle
increase.**

The upgrade was measured before and after on the same dataset, emulator, Chrome
and throttling: `docs/perf/mui-v9-before.md`,
`docs/perf/mui-v9-after.md`, and the generated comparison
`docs/perf/mui-v9-diff.md`.

## Consequences

**The bundle grew. v9's smaller-bundle claim did not materialise here.**

| Metric | v7.3.11 | v9.3.1 | Delta |
| --- | ---: | ---: | ---: |
| `@mui/*` parsed, home | 328.7 kB | 353.9 kB | **+25.2 kB (+7.7%)** |
| `@mui/*` gzip, home | 148.7 kB | 160.5 kB | +11.8 kB (+7.9%) |
| First-load JS, home (gzip) | 340.0 kB | 344.4 kB | +4.4 kB (+1.3%) |
| `@emotion/*` parsed | 38.4 kB | 38.5 kB | +0.0 kB |
| Client components | 34 | 34 | 0 |

Diffing the two builds module by module says exactly why: removing the entire
system-props API deleted **one 0.4 kB module**
(`@mui/system/styleFunctionSx/extendSxProp`), while v9's accessibility and
platform work added ~13.7 kB of new ones — `useRovingTabIndex` for the Menu
keyboard rework, MUI's own `Transition` and `useReducedMotion` replacing
`react-transition-group`, `useButtonBase` and `useFocusableWhenDisabled`.

**It was taken anyway**, because the accessibility work is what the project
needed (the axe gate is strict — see the README's testing section), and because
v7 was a dead-end pin on a dependency with open advisories. But **nothing about
a v9 upgrade should be sold to this codebase on bundle size.**

**sx performance did not show up either.** TBT moved 36 → 36 ms on home desktop
and 469 → 464 ms on home mobile: noise. The large catalog movements in the diff
(mobile performance 44 → 59, CLS 0.672 → 0.000) are **not** the upgrade —
catalog CLS is multi-modal, returning 0.000, 0.192 or 0.672 across runs on the
same tree.

**Pigment CSS was spiked and rejected.** `@mui/material-pigment-css` is an
optional peer dependency, not v9's default engine; `@emotion/*` did not move at
all because v9 still ships Emotion. Getting Emotion's runtime out of the bundle
is a separate project, for which this upgrade is the prerequisite, not the
delivery.

**Three styling lessons, each now enforced by a lint rule** (full text in
`docs/client-surface.md`):

1. **`styled()` is a module-graph boundary.** Emotion's `styled` carries
   `"use client"` down its whole import chain, so a server module that imports
   it gets a client *reference* and throws at module evaluation. Styled
   primitives live in their own small client files; Server Components render
   them freely. → `boundary/client-only-styled`
2. **An `sx` written in a server module must be serialisable.** A
   `(theme) => ...` callback — or one function-valued key inside the object —
   crosses the boundary and fails. → `boundary/serializable-sx`
3. **Styles go in `sx`, never spread as props.** `<Button {...styles.button}>`
   worked while system props existed and now fails in the worst way: a JSX
   spread is not excess-property checked, so it still typechecks, and every
   declaration lands on the DOM node as a bare HTML attribute that Emotion never
   sees. The component renders unstyled and **nothing warns**. The blog category
   pills shipped like that. → `boundary/no-style-object-spread`

## Revisit when

- **Pigment CSS becomes MUI's default engine**, or ships a migration path worth
  the diff — that is the only route to removing Emotion's runtime, and it is
  now a one-project change rather than a two-major-version one.
- **Bundle size becomes the binding constraint on a route.** The measured
  contributors are recorded per route; MUI is a known ~350 kB parsed, and a
  lighter component set for the catalog specifically would be the first cut.
- **A future major removes something else load-bearing.** The three lint rules
  above are the early-warning system; if a fourth is needed, the cost of staying
  is rising.
