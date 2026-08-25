# 004 — One document per language, grouped in the Studio

## Context

The site serves two languages on two domains — Czech and English — routed by
`next-intl` on the request's `Host`, not by a path prefix. There is no
`/en/...`; there is `en.<domain>`.

Sanity offers two shapes for translated content: **field-level** (one document,
each field an object keyed by locale) and **document-level** (one document per
language, linked by a `translation.metadata` document). The inherited codebase
had chosen document-level via `@sanity/document-internationalization`, but
without any Studio structure to match — every language's documents sat in one
undifferentiated list, so an editor scrolling the group list saw each group
twice with no indication which was which.

It also had the locale code wrong. The Czech documents carried `language: "cz"`.
`cz` is the ISO 3166 *country* code; the ISO 639-1 *language* code is `cs`. The
web app filtered with `language == $locale`, so the app and the data agreed only
because both were wrong in the same way — and anything standards-aware
(`html lang`, `hreflang`, a content API consumer) was being lied to.

## Decision

**Keep document-level translation, fix the locale code to `cs`, and make the
Studio structure carry the language distinction.**

- Locales are defined once, in `packages/config/src/locales.ts`, and consumed by
  both apps.
- The Studio's structure groups documents by language rather than listing them
  flat, and a dedicated **translations section** acts as a cockpit: what exists
  in which language, and what is still missing.
- The dictionary of UI strings stores one field per locale on each entry, named
  after the locale id, with the row preview naming the languages still empty.
- The `cz` → `cs` rename shipped as a **code change plus a data migration in
  lockstep**: `apps/studio/scripts/migrate-locale-cz-to-cs.mjs`.

## Consequences

**What it bought.**

- **Per-language publishing.** A Czech correction goes live without touching the
  English document, and an untranslated page is *absent* rather than
  half-rendered — which is what the domain split needs.
- **The locale code is now honest.** `html lang="cs"` is asserted on every page
  by the crawler, and `hreflang` alternates in the sitemap are valid.
- **Translation state is visible.** The cockpit and the dictionary previews
  answer "what still needs translating" without a query.

**What it costs.**

- **Two documents per group** — roughly double the document count, and a schema
  change has to be applied to both.
- **The migration was genuinely dangerous**, because the locale code lives in
  three places: `language` on every localised document (drafts included), the
  `_key` of each entry in `translation.metadata`, and the per-locale *field
  names* on dictionary entries. Ship the code without the data, or the reverse,
  and every localised query returns nothing — the site renders empty, not
  broken. The script migrates all three, defaults to a dry run, reads with
  `perspective: "raw"` so drafts come too, and refuses conflicts rather than
  producing a duplicate `_key`.
- **Field-level would have been simpler for the dictionary specifically**, which
  is the one place the two languages are genuinely edited side by side. That
  inconsistency is deliberate but real.

## Revisit when

- **A third language is added.** Two is cheap; at four or five the duplicated
  document count and the structure grouping both start to strain, and
  field-level for short-string types becomes worth re-costing.
- **Editors start asking for side-by-side translation editing** of full
  documents, which document-level does not naturally give.
- **Routing stops being domain-based**, which would remove the strongest reason
  for a hard per-language document split.
