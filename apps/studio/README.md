# Dětské skupinky — Studio

The editing interface for the site in `apps/web`. Same dataset, same schema,
one place: everything a visitor reads is a document in here.

```bash
cp .env.example .env.local   # then fill in the project id and dataset
npm run dev -w @detske-skupiny/studio
```

## The sidebar

It is meant to answer "what is this site?" in about three minutes, read top to
bottom.

```
Dětské skupinky
├── Content ............... the pages a visitor lands on
│   ├── Home
│   ├── Cooperation
│   ├── Catalog intro
│   ├── Contact
│   └── Standalone pages
│
├── Schools ............... the catalog, which is what the site is for
│   ├── Catalog page
│   ├── Schools ................. base language, one row per school
│   ├── Schools · all languages . the same plus their translations
│   └── Classification
│       ├── Categories
│       ├── Tags
│       └── Types
│
├── Geography ............. the tree the catalog is indexed by
│   ├── Countries → a country → its Regions → a region → its Areas → …
│   └── Reorder ................. the four drag-to-sort lists
│
├── Blog .................. the magazine beside it
│   ├── Blog page
│   ├── Posts ................... base language, newest first
│   ├── Posts · all languages
│   ├── Authors
│   └── Categories
│
├── Translations .......... the state of the second language
│   ├── Missing EN .............. base documents with no English yet
│   ├── Recently translated (EN)
│   ├── Orphaned EN ............. English whose original was deleted
│   └── Dictionary .............. the UI string table
│
└── Site .................. the chrome, and the settings behind it
    ├── Header
    ├── Footer
    └── Settings
```

## Two things worth knowing before you edit

**A translated document is two documents.** `@sanity/document-internationalization`
pairs them through a separate `translation.metadata` document; neither copy
holds a pointer to the other. So the default lists show one row per entity, in
the base language, and the English copy is reached from the language menu at
the top of the document - which is also the only route that writes the pairing.
Creating an English document any other way produces an orphan, which is what
`Translations → Orphaned EN` finds.

**Geography is a tree, and the site reads its order.** `orderRank` on countries,
regions, areas and subareas is what the catalog's menus sort by, and it can
only be changed by dragging in `Geography → Reorder`. The browse lists sort by
the same field, so both views agree; only one of them can rewrite it.

## What is deliberately not here

**No "Untranslated" document badge.** It is implementable - badges render only
in the document pane, never in a list row, so there is no per-row fetch to
worry about - but it would say what two other things already say. The language
menu sits at the top of every translatable document and already distinguishes
"create English" from "go to English", and `Translations → Missing EN` answers
the same question across the whole dataset without opening anything. A badge
would also need its own live listener per open document to avoid still reading
"Untranslated" the moment after you created the translation. The v5 badges API
is `@beta` and `@hidden`; this is not the thing to spend it on.

**No custom theme.** The brand purple would have to arrive through
`buildLegacyTheme`, and in Sanity 5.31 both that builder and the whole
`StudioTheme` interface are marked for removal in the next major. A legacy
theme also replaces the palette wholesale rather than tinting it, so every
Sanity UI colour added after it lands unstyled. The brand lives in the title
and the navbar mark instead, which are supported surfaces.

**No school counts on geography rows.** A count in a row's subtitle is a
`count(*[...])` per row, re-issued on every keystroke of a list search. The
numbers the site shows are computed once per page by the web app's own query
(see `apps/web/src/lib/sanity/fragments.ts`); a second set here would be slower
and a second source of truth.

## Screenshots to take

Three, and no more - these are the ones that show what changed:

1. **The sidebar**, expanded to the six sections, at the top level.
2. **`Schools → Schools`**, showing one row per school with "Area · Region"
   subtitles and logos - beside `Schools · all languages`, where the same
   schools appear twice and the English rows carry a 🌐 EN badge.
3. **One school document**, on the Basic Information tab, showing the seven
   group tabs in editing order and the field descriptions under each input.

## Docs

- [Sanity: getting started](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Sanity: structure builder](https://www.sanity.io/docs/structure-builder-reference?utm_source=readme)
- [Sanity: workspaces](https://www.sanity.io/docs/workspaces?utm_source=readme)
