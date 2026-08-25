# Changelog

The rescue, in the order it happened. Each entry is one merged branch.

This project is not versioned or released — it is a continuously deployed site,
so there are no version numbers and no tags. Entries are keyed by **branch
name** rather than PR number, because the repository carries two separate PR
numbering sequences (`#1`–`#5` appear twice) and a bare `#3` would be ambiguous.

The *why* behind the structural decisions is in [docs/adr/](docs/adr/); the
before/after numbers are in [docs/perf/](docs/perf/); the summary is the journey
table in the [README](README.md#the-journey).

---

## Phase 9 — documentation and closure · `claude/docs-final-closure-h1644w`

- **Fixed a leaked dictionary key.** `contactFormPrivacyPolicyLinkLabel`
  rendered as literal text beside the contact form's GDPR consent checkbox,
  because next-intl is configured to fall back to the key itself. Added a
  `migrate:dictionary` script that upserts missing entries by keyword without
  overwriting editor text, covering `contactFormConsentLabel` as well — the same
  bug one cleared field away from being visible.
- **Added a raw-key crawler assertion** so the class of bug cannot return
  silently: any visible text node whose entire trimmed content is a camelCase
  identifier fails the crawl. Verified in both directions against a fixture site
  using the unmodified spec.
- **Rewrote the root README** as the project's entry point: architecture
  diagram, a sourced journey table, the CI gates, and known next steps.
- **Added six ADRs**, each with an explicit revisit condition.
- **Reorganised the docs**: the perf series gained a chronological index, the
  phase-6 reports moved into `docs/perf/`, testing moved out of the README into
  `docs/testing.md`, and a markdown lint config now holds the house style.
- Added `LICENSE` (proprietary, with an open TODO on the copyright holder), a
  root `package.json` description, and `npm run shots`.

## Phase 8 — the errors the refactor left behind

**`fix/sx-spread`** — Styles were being object-spread onto components
(`<Button {...styles.button}>`) rather than passed as `sx`. MUI v9 removed the
system props that made this work; a JSX spread is not excess-property checked,
so it still typechecked while every declaration landed on the DOM as a bare HTML
attribute Emotion never saw. Components rendered unstyled with no warning.

**`claude/post-refactor-errors-perf-w506gz`** — Three module-graph errors from
the boundary pushdown. Promoting three `styled()` primitives to client modules
looked like a partial revert and was the opposite: read off Turbopack's client
reference manifests, every route got smaller, because `styled.mjs` itself had
been sitting in two routes' client module lists.

## Phase 7 — accessibility · `feat/ux-a11y`

Fixed the accessibility failures, then made the gate strict: serious and
critical axe violations now fail the build. Moderate and minor print on every
run as a visible backlog.

## Phase 6 — the Studio as a product · `feat/studio-excellence`

Rebuilt the sidebar as a tour of the content model rather than a dump of it,
put each form in the order a school is actually filled in, gave every list row a
meaningful preview, branded the shell, and removed the sidebar entries that
offered ways to break the site.

## Phase 5 — refactor and typegen · `claude/phase-7-refactor-2jk2af`

- Generated Sanity types from the schema and the query call sites, then typed
  the whole query layer from them — the change that took hand-written `any` in
  `apps/web/src` to zero.
- One folder per thing, with an ESLint rule that keeps it that way.
- `sx` objects instead of fake props objects; named colours instead of raw
  `var(--mui-palette-*)`.
- Pushed the client boundary down to the leaves that need it, and took the
  lightbox and carousel off every route.
- Loading states shaped like the thing that is loading.

## Phase 4 — MUI 7 → 9 · `claude/mui-v9-perf-bundle-audit-v0rkod`

Measured before and after on the same harness. **The bundle grew** — `@mui/*`
+25.2 kB parsed on home — and the upgrade was taken anyway for the accessibility
and support story. See [ADR-005](docs/adr/005-stay-on-mui.md).

## Phase 3 — performance and SEO

**`perf/render`** — Deferred the map behind `dynamic(…, { ssr: false })`, taking
~315 kB gzip off every heavy route; sized every image; self-hosted the font.

**`claude/seo-sitemap-metadata-em5jjw`** — Per-domain sitemap, metadata and
structured data.

## Phase 2 — the data layer

**`feat/sanity-layer`** — A `server-only` Sanity data layer with tag-based
caching. The Sanity client left the browser.

**`feat/catalog-server-state`** — Catalog filters became URL state; load-more
became a Server Action.

**`claude/webhook-studio-cleanup-38rasw`** — Webhook-driven revalidation, and a
Studio that stops denormalising: seven `autoPopulate*` plugins and two
unscheduled cron scripts became one publish-time plugin. See
[ADR-002](docs/adr/002-remove-denormalization.md) and
[ADR-003](docs/adr/003-event-driven-cache.md).

## Phase 1 — upgrades · `claude/monorepo-dependency-upgrades-ejm7zx`

Node 22 LTS and TypeScript 5.9; Next.js 15 → 16 with the `middleware` → `proxy`
rename; React pinned to 19.2.8; the MUI `overrides` block dropped and MUI moved
to 7.3.11; the Studio upgraded; a single-pass lockfile regeneration.

## Phase 0 — making the tree legible

**`claude/routing-data-500s-qwl2ha`** — Routing and data bugs stopped returning
500s on bad URLs.

**`claude/contact-form-security-tjpv7w`** — Contact form hardened against spam;
GDPR consent added.

**`claude/studio-document-action-bugs-s1pqh0`** — Async and logic bugs in the
custom document actions.

**`chore/upgrade-verify`** — The pre-upgrade baseline audit
([docs/upgrade-verification.md](docs/upgrade-verification.md)), which is where
most of the "starting state" column in the README comes from.

**`fix/locale-cs`** — Czech locale code renamed `cz` → `cs`, code and data in
lockstep. See [ADR-004](docs/adr/004-document-level-i18n.md).

**`test/full-suite`** — The Vitest unit layer, the Playwright e2e suite, the
full-site crawler and CI. The tree went from **0 tests** to a suite that has
gated every branch since.
