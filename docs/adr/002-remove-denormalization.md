# 002 — Derive at read time; seven plugins and two crons become one

## Context

The inherited Studio carried **seven custom `autoPopulate*` plugins** and **two
scheduled scripts**:

```text
apps/studio/plugins/autoPopulateAreaFields.ts
apps/studio/plugins/autoPopulateFieldsJob.ts
apps/studio/plugins/autoPopulateRegionFields.ts
apps/studio/plugins/autoPopulateSchoolCountFields.ts
apps/studio/plugins/autoPopulateSchoolFields.ts
apps/studio/plugins/autoPopulateSchoolOrderFields.ts
apps/studio/plugins/autoPopulateSubareaFields.ts
apps/studio/schedules/randomizeSortOrder.mjs
apps/studio/schedules/updateSchoolCount.mjs
```

Between them they copied counts (`schoolCount`), materialised paths
(`fullSlug`) and a randomised `sortOrder` onto every geography document, so that
GROQ could read a number instead of computing one.

Three things were wrong with this. The counts were only ever as fresh as the
last nightly run, so a published group did not change the number beside its
region until the next day. The scripts were **orphaned** — nothing in the repo
scheduled them; they were run by hand, or not at all. And the write amplification
was severe: publishing one group patched documents all the way up the tree.

## Decision

**Delete the denormalisation. Derive at read time, and store a value only when
GROQ provably cannot compute it.**

The seven plugins and two scripts are replaced by one plugin,
`apps/studio/plugins/computedFields.ts`, which wraps the publish action for
`schools` only. Counts became `count()` subqueries in the web app's GROQ; paths
became composed projections.

Four fields stayed stored, each for a reason that is a limitation of GROQ rather
than a performance preference:

| Field | Why it cannot be derived |
| --- | --- |
| `nameNormalized` | GROQ has no diacritics-stripping function, and search matches against it |
| `countrySlug`, `regionSlug` | filtering every group by a dereferenced path (`area->region->...`) is far slower than an equality check on a stored string |
| `isHighPriority` | list ordering reads it, and GROQ cannot order by a dereferenced field |
| `address.mapLocation` | the result of an external geocoding call to MapTiler |

The daily rotation of the list is no longer stored at all: it is computed at
read time from a seed cached for a day
(`apps/web/src/lib/sanity/dailySeed.ts`).

## Consequences

**What it bought.**

- **Counts are exact.** They agree with the list beside them because they are
  the same query.
- **Publishing one group patches one document.** No fan-out up the tree.
- **Nine moving parts became one**, and that one is scoped to a single document
  type, runs on publish, and is awaited before `publish.execute()` — so a
  published group never carries stale computed values.
- **No `setTimeout` anywhere in the Studio**, and no unscheduled scripts
  pretending to be infrastructure.

**What it costs.**

- **Read queries do more work.** `count()` subqueries are strictly more
  expensive than reading an integer. This is affordable precisely because of
  [ADR-003](003-event-driven-cache.md): the query runs once per publish, not
  once per visit. **These two decisions only work together** — derive-at-read
  without an effective cache would be a straight regression.
- **Geocoding is a third-party call inside a publish.** It is deliberately
  non-fatal: a MapTiler outage publishes the group anyway with a warning toast,
  because the alternative is an editor unable to fix a typo during someone
  else's incident. A broken area reference *is* fatal and blocks the publish.
- **The old values are still on the documents.** Nothing was deleted; the
  fields are simply unread. That kept the change reversible by reverting a
  merge, and leaves an optional cleanup migration for later.

## Revisit when

- **A `count()` subquery becomes the reason a page is slow on a cold cache.**
  The fix then is a materialised read model ([ADR-001](001-sanity-as-single-source.md)),
  not a return to publish-time fan-out.
- **A second document type needs computed fields.** One plugin for `schools` is
  proportionate; a third or fourth type suggests a general mechanism instead.
- **Sanity ships diacritics-insensitive matching or ordering by a dereferenced
  field**, which would retire `nameNormalized` and `isHighPriority`.
