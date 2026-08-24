# Event-driven revalidation and the studio's computed fields

This describes the two halves of one change: the web app stopped reading
denormalised fields in the same release the studio stopped writing them. They
have to deploy together — see [Deploy order](#deploy-order).

---

## 1. The Sanity webhook

`POST /api/revalidate` drops cached Sanity responses by tag. Content is cached
with `cacheLife("max")`, so nothing expires on a timer: this endpoint is the
only thing that makes a publish visible.

### Creating it

In [Sanity manage](https://www.sanity.io/manage) → your project → **API** →
**Webhooks** → **Create webhook**:

| Field | Value |
| --- | --- |
| **Name** | `Revalidate web (production)` |
| **URL** | `https://<your-production-domain>/api/revalidate` |
| **Dataset** | `production` (create a second webhook for `staging`) |
| **Trigger on** | Create, Update, Delete |
| **Filter** | *(leave empty — every document type is mapped or falls back)* |
| **Projection** | `{_type, _id}` |
| **HTTP method** | `POST` |
| **HTTP headers** | *(none)* |
| **API version** | `v2025-08-09` (or later) |
| **Secret** | generate one, e.g. `openssl rand -hex 32` |
| **Enable drafts** | off — only published documents should invalidate |

Then add the same secret to the web app's environment:

```
SANITY_WEBHOOK_SECRET=<the secret you generated>
```

In Vercel: **Settings → Environment Variables**, name `SANITY_WEBHOOK_SECRET`,
for Production *and* Preview (the preview deploy needs it to test the flow).
Redeploy afterwards — environment variables are read at runtime, but a running
deployment does not pick up a new one.

### How requests are authenticated

Sanity signs the raw request body with the secret and sends the result in the
`sanity-webhook-signature` header; the route verifies it with
`isValidSignature` from `@sanity/webhook`. A replayed or edited payload fails
verification even if the URL leaks.

- No signature header, an unparseable one, a wrong secret, or a body that was
  changed after signing → **401**
- `SANITY_WEBHOOK_SECRET` unset → **503** (fails closed; an unset secret must
  never mean "open to everyone")
- Signed but not JSON → **400**
- Otherwise → **200** with `{"revalidated": ["schools", "geo"]}`

Note the signature carries a timestamp but `isValidSignature` enforces no
freshness window, so a captured request stays replayable. Replaying one only
drops a cache entry a second time, which costs a regeneration and reveals
nothing.

### `_type` → tags

Defined in `apps/web/src/app/api/revalidate/tags.ts`:

| `_type` | Tags dropped |
| --- | --- |
| `schools`, `countries`, `regions`, `areas`, `subareas` | `schools`, `geo` |
| `blogs` | `blogs` |
| `header`, `footer`, `settings` | `settings` |
| `dictionary`, `dictionaries` | `dictionary` |
| `page`, `home`, `group`, `preschool`, `contactUs`, `blogPage`, `schoolPage` | `page:<type>` |
| anything else | `content` |

`content` is the catch-all. Every cached Sanity response carries it in addition
to its own tags (`lib/sanity/fetch.ts`), so an unrecognised document type
invalidates *everything* rather than nothing. That is correct but blunt, and
the route logs a warning naming the type so it can be mapped properly.

Types that currently land on the catch-all: `schoolTypes`, `schoolCategories`,
`schoolTags`, `authors`, `blogCategories`. All five are only ever read
dereferenced from a school or a blog post, so dropping `content` does
invalidate every page that shows them — just more than strictly necessary.
Publishing one is rare.

### Testing it

On the staging dataset against a preview deploy:

1. Publish any school in the studio.
2. Sanity manage → the webhook → **Attempts**: the delivery should be `200`
   with `{"revalidated":["schools","geo"]}`.
3. Reload the school's page on the preview URL. The change is there within a
   few seconds — no rebuild, no waiting out a timer.

To exercise it by hand, sign a body the way Sanity does:

```bash
node -e '
const {encodeSignatureHeader} = require("@sanity/webhook");
const body = JSON.stringify({_type: "schools", _id: "x"});
encodeSignatureHeader(body, Date.now(), process.env.SANITY_WEBHOOK_SECRET)
  .then(sig => console.log(JSON.stringify({body, sig})));
'
```

then POST `body` with that value as the `sanity-webhook-signature` header. An
unsigned request must come back 401.

---

## 2. The studio's one remaining computed field plugin

`apps/studio/plugins/computedFields.ts` replaces seven plugins and two cron
scripts. It wraps the publish action for **`schools` only** and writes four
things before the publish is executed:

| Field | Why it is stored rather than derived |
| --- | --- |
| `nameNormalized` | GROQ has no diacritics-stripping function, and search matches against it |
| `countrySlug`, `regionSlug` | filtering every school by a dereferenced path is far slower than an equality check on a stored string |
| `isHighPriority` | the list ordering reads it; GROQ cannot order by a dereferenced field |
| `address.mapLocation` | the result of an external geocoding call (MapTiler), only made when latitude or longitude is missing |

The patch is awaited before `publish.execute()`, so a published school never
carries stale values. If anything fails — a bad reference, a geocoder outage —
the error is shown to the editor as a toast and **the publish does not happen**.
There is no `setTimeout` anywhere in the studio.

### Manual test on staging

Point the studio at the staging dataset (`SANITY_STUDIO_DATASET=staging`) and:

1. **Geocoding and slugs.** Create or open a school that has a street address
   but no map location, and make sure its **Area** is set. Press **Publish**.
   - In Vision, run:
     ```groq
     *[_type == "schools" && slug.current == "<the-slug>"][0]{
       nameNormalized, countrySlug, regionSlug, isHighPriority,
       "coords": address.mapLocation
     }
     ```
   - `coords` should now hold a `lat`/`lng` near the address, and
     `countrySlug`/`regionSlug` should match the school's area → region →
     country chain.
   - Republishing an unchanged school must **not** move the coordinates: the
     geocoder only runs when one of them is missing.
2. **Errors reach the editor.** Temporarily unset
   `SANITY_STUDIO_API_MAPTILER_API_KEY` and publish a school with no
   coordinates. A red toast should appear and the document should stay
   unpublished — not publish silently.
3. **The action is restricted to schools.** Open a region, area, subarea or
   blog post. The Publish button must be the stock one, with no extra
   "Update school…" actions in the menu.
4. **Counts on the web app.** Open a region page (`/catalog/<country>/<region>`)
   on the preview deploy and check the per-region, per-area and per-subarea
   counts in the filter sidebar against the number of schools actually listed.
   These are now `count()` subqueries, so they should agree exactly — the old
   `schoolCount` field was only as fresh as the last nightly run.

---

## Deploy order

The web app stops reading `schoolCount` / `fullSlug` / `sortOrder` in the same
release the studio stops writing them, so **both apps ship together**.

1. **Create the webhook** in Sanity manage against the *production* URL with a
   fresh secret (settings above), and add `SANITY_WEBHOOK_SECRET` to Vercel for
   Production and Preview.
2. **Test the whole flow on staging first**: staging dataset + preview deploy →
   publish a school → the webhook attempt shows `200` → the page updates within
   seconds. Also walk the manual test above.
3. **Merge and deploy both in one session**: the production web deploy *and*
   `npm run deploy -w apps/studio` (`sanity deploy`). Deploying only the web app
   leaves the studio writing fields nothing reads; deploying only the studio
   leaves the web app reading fields nothing writes.

### Rollback

Reverting the merge restores both halves together. Nothing in this change
deletes data: the stale `schoolCount`, `fullSlug` and `sortOrder` values are
still on the documents, they are simply no longer read or written. A migration
to unset them is optional and deliberately not part of this change.
