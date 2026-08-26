# Dětské skupinky — Studio

The editing interface for the site in `apps/web`: same project, same dataset.

```bash
cp .env.example .env.local   # project id, dataset, API keys
npm run dev -w @detske-skupiny/studio   # localhost:3333
```

**Content structure.** The sidebar has six sections — Content, Groups,
Geography, Blog, Translations and Site. Geography is a tree (country → region →
area → subarea) whose `orderRank` the catalog sorts by; drag to reorder it under
`Geography → Reorder`.

**Translations.** One document per language, paired through
`translation.metadata`. Create the second language from the language menu at the
top of a document — that is the only route that writes the pairing. The
`Translations` section lists what is missing, recently translated, or orphaned.

**Adding a language.** Add it to `packages/config/src/locales.ts`, the one list
both apps read; it flows into the internationalization config, the per-locale
dictionary fields and the language grouping in the structure. Then add the
matching `NEXT_PUBLIC_<LOCALE>_DOMAIN` to the web app.

**Scripts.** `scripts/` holds Node-only content scripts. Both default to a dry
run and need `SANITY_SCRIPT_TOKEN`, an Editor token deliberately *not*
`SANITY_STUDIO_*`-prefixed, because every variable with that prefix is inlined
into the publicly served Studio bundle.

```bash
npm run migrate:dictionary                               # dry run
npm run migrate:dictionary -- --dataset staging --apply  # fill missing UI strings
```

**Computed fields.** `plugins/computedFields.ts` wraps the publish action for
`schools` only and resolves four values GROQ cannot derive — `nameNormalized`,
`countrySlug`, `regionSlug` and `isHighPriority` — plus `address.mapLocation`
from a MapTiler geocode when coordinates are missing. The patch is awaited
before the publish completes.
