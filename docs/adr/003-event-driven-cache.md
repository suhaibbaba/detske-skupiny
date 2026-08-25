# 003 — Cache until publish, not for five minutes

## Context

The inherited caching was time-based and, in one place, accidental:

```js
// apps/web/src/sanity/utilites/fetch.ts
useCdn: true,
next: { revalidate: 300 },      // 5 minutes

// apps/web/src/sanity/queries/dictionary.ts
{ next: { revalidate: 0.5 } },  // revalidate every 5 minutes
```

That last line is the whole problem in miniature. `revalidate` is **seconds**,
so the comment is wrong by two orders of magnitude: the UI dictionary — needed
to render *any* page — was re-fetched every half second, which in practice
meant **every visit hit Sanity**. The rest of the content sat behind a 300-second
timer, so an editor publishing a correction watched a stale page for up to five
minutes, then guessed at whether it had worked.

Both failure modes come from the same root: a timer expresses "how stale am I
willing to be", when the actual question is "has anything changed".

## Decision

**Cache Sanity reads indefinitely and invalidate them on the publish event.**

One function, `apps/web/src/lib/sanity/fetch.ts`:

```ts
"use cache";
cacheLife("max");
cacheTag(CATCH_ALL_TAG);
for (const tag of tags) cacheTag(tag);
```

A Sanity webhook POSTs to `/api/revalidate` on every create, update and delete.
The route verifies Sanity's signature with `@sanity/webhook`, maps `_type` to
cache tags, and calls `revalidateTag`. Content changes when an editor publishes,
so the publish is the only event that should move the cache.

Two deliberate details:

- **Every entry also carries a catch-all tag.** A document type the webhook has
  no mapping for drops that tag, so an unrecognised publish **over**-invalidates
  rather than doing nothing. Silent staleness is the worse failure.
- **The endpoint fails closed.** No signature, a bad signature, or an unset
  `SANITY_WEBHOOK_SECRET` returns 401/503. An unset secret must never mean
  "open to everyone".

## Consequences

**What it bought.**

- **Sanity requests went from per-visit to per-publish.** The dictionary alone
  was one round trip per page render.
- **Publish-to-live went from a five-minute timer to seconds**, and became
  *observable*: the delivery attempt in Sanity manage shows `200` with the tags
  it dropped, so "did my change go out" has an answer.
- **Derive-at-read became affordable.** [ADR-002](002-remove-denormalization.md)
  traded stored counts for `count()` subqueries; that is only sane because the
  subquery runs once per publish.

**What it costs.**

- **Correctness now depends on a webhook.** If it is misconfigured, unreachable,
  or the secret drifts, the site serves stale content **forever** rather than
  for five minutes. This is a real trade: the failure mode got rarer and worse.
  It is mitigated by failing closed, by the catch-all tag, and by the delivery
  log — but it is the thing to check first when content looks stuck.
- **Two apps must deploy together.** The web app stopped reading the fields the
  Studio stopped writing in the same release; `docs/webhook-and-computed-fields.md`
  documents the order.
- **The cache key is now load-bearing.** `params` and `tags` are part of it, so
  a caller reading the locale *inside* the cached function would serve one
  locale's content to both domains. Callers pass `$locale` in explicitly.
- **Signatures carry a timestamp but no freshness window**, so a captured
  request stays replayable. Replaying one only drops a cache entry twice, which
  costs a regeneration and reveals nothing.

## Revisit when

- **A document type needs finer invalidation than its tag gives it** — e.g.
  publishing one article dropping every article page becomes measurably
  expensive. Per-document tags are the next step.
- **The catch-all starts firing often.** It is instrumented with a warning
  naming the unmapped type; a type that appears repeatedly should get a real
  mapping.
- **Content stops being publish-driven** — anything that changes on a schedule
  or from user action needs a different mechanism, not a longer tag list.
