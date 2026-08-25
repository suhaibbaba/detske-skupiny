# README screenshots

Six files, referenced by the [root README](../../README.md). Capture them with
`npm run shots` against a dev server pointed at a **readable dataset with real
content** — an empty or synthetic dataset produces screenshots that
misrepresent the product.

```bash
cp apps/web/.env.example apps/web/.env.local   # fill in SANITY_PROJECT_ID / SANITY_DATASET
npm run dev:web                                # in one terminal
npm run shots                                  # in another
```

## The six files

| File | Viewport | Route | Shows |
| --- | --- | --- | --- |
| `home-desktop.png` | 1440×900 | `/` | The homepage hero, region picker and card grid. Used twice: as the README's hero image and as the left cell of the responsive comparison. |
| `home-mobile.png` | 390×844 | `/` | The same homepage stacked to one column. |
| `catalog-region.png` | 1440×1000 | `/katalog/<country>/<region>` | The catalog filtered to one region — filter sidebar, clustered map, results grid. |
| `school-detail.png` | 1440×1000 | `/katalog/.../<group>` | A group detail page — gallery, address, rich text, map pin. |
| `studio-structure.png` | 1440×900 | Studio `/` | The desk sidebar: the six named sections, expanded. |
| `studio-schools-list.png` | 1440×900 | Studio, Groups list | The groups list grouped by language, with rich row previews. |

## Rules

- **PNG**, captured at `deviceScaleFactor: 2` so they stay sharp on a HiDPI
  screen. `npm run shots` sets this.
- **No personal data.** The dataset is a public directory, but check that no
  draft, internal note or contact detail is visible before committing.
- **Keep the filenames.** The README references them by path; renaming one
  silently breaks an image.
- **Alt text lives in the README**, not here, and it is not optional — the
  repository enforces a strict axe gate, and a README that ships an
  undescribed image does not live up to it.

## Capturing the Studio shots

`npm run shots` captures the four web screenshots unattended. The two Studio
shots need an authenticated session, so the script opens a headed browser,
pauses for you to log in, and captures once you continue. Run it with a Studio
dev server on `localhost:3333`:

```bash
npm run dev:studio     # in one terminal
npm run shots -- --studio
```
