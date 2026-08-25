# 001 — Sanity is the only datastore

## Context

The product is a directory of Czech childcare groups: a geography tree
(country → region → area → subarea), the groups themselves, editorial articles,
and a handful of singleton pages. All of it is editor-owned. None of it is
user-generated, transactional, or written by the web app — `apps/web` has no
write path to content at all.

The inherited system already used Sanity for content, but treated it as a slow
remote API to be defended against: values were copied onto neighbouring
documents so queries could avoid joins (see
[ADR-002](002-remove-denormalization.md)), and the Sanity client itself was
shipped to the browser on every route — 72 kB gzip of it, on pages that never
issued a query.

The obvious alternative was to put Postgres (or Postgres + PostGIS, given the
map) between Sanity and the app, syncing content in and querying it out.

## Decision

**No application database. Sanity is the single source of truth, and the browser
never talks to it.**

Reads go through exactly one function, `apps/web/src/lib/sanity/fetch.ts`, which
is `server-only` and cached (see [ADR-003](003-event-driven-cache.md)). The
geography tree, the counts, the filters and the search all resolve as GROQ
against Sanity, executed on the server, cached until a publish invalidates them.

## Consequences

**What it bought.**

- **One writer, one shape.** There is no sync job, no drift window, and no
  second schema to keep in step with the first. The types the app compiles
  against are generated from the Studio's own schema
  ([ADR-006](006-monorepo.md)), so a renamed field is a build failure rather
  than a runtime `undefined`.
- **The Sanity client left the browser.** It is `server-only`; the import would
  fail the build if a client module reached for it. The bundle it used to
  occupy is gone from every route.
- **Cheap infrastructure.** No database to provision, back up, migrate or
  patch. The read path at rest is a cache lookup.

**What it costs.**

- **GROQ is the only query language available.** Some things it genuinely cannot
  do are stored fields instead — diacritics-stripped names for search, two
  denormalised slugs for filtering, a priority flag for ordering. Those four
  exceptions and their justifications are ADR-002.
- **No geospatial query.** "Groups within 5 km" is not expressible. The map
  filters client-side over an already-fetched region, which is fine at the
  current corpus and would not be at ten times it.
- **Sanity is a hard dependency at request time on a cache miss.** The
  mitigation is that misses only happen after a publish.

## Revisit when

- **The corpus passes roughly 10,000 groups**, or list queries stop being
  answerable within a page's budget on a cold cache. That is the point where
  Postgres + PostGIS earns its keep, fed by the same webhook that drives cache
  invalidation today — Sanity stays the editing surface and the system of
  record, Postgres becomes the read model.
- **A genuine geospatial requirement appears** — radius search, travel-time
  catchments, anything that needs an index rather than a filter.
- **Content stops being editor-only** — user accounts, reviews, bookings or
  availability all want a transactional store, and none of them belong in a CMS.
