# Next.js i18n Domain-Based Routing Setup

This guide explains how to set up domain-based internationalization (i18n) routing for local development on macOS.

## Overview

This project uses `next-intl` with domain-based routing, where different domains serve different languages:
- `en.school.local` → English
- `cs.school.local` → Czech

## Prerequisites

- Node.js installed
- macOS (for the setup commands below)
- Terminal access with sudo privileges

## Local Development Setup

### 1. Configure Local Domains

Add custom domain entries to your hosts file:

```bash
sudo nano /etc/hosts
```

Add these lines at the end of the file:

```
127.0.0.1 en.school.local
127.0.0.1 cs.school.local
```

**Save and exit:** Press `Ctrl + X`, then `Y`, then `Enter`

**Flush DNS cache** to make changes take effect immediately:

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

### 3. Run Development Server

```bash
npm run dev
```

## Troubleshooting

### Issue: Getting 404 errors

**Solution:** Ensure you have the `[locale]` folder in your app directory. All routes must be inside `src/app/[locale]/`.

### Issue: Still showing English on Czech domain

**Solution:** 
1. Clear Next.js cache: `rm -rf .next`
2. Restart the dev server
3. Make sure you're accessing via the correct domain (not `localhost`)

### Issue: Cross-origin warnings

**Solution:** Add this to your `next.config.js`:

```javascript
const nextConfig = {
  allowedDevOrigins: [
    'http://en.school.local',
    'http://cs.school.local',
  ],
};
```

## Production Deployment

In production, point your actual domains to your server:
- `en.yourdomain.com` → Your server IP
- `cs.yourdomain.com` → Your server IP

Update environment variables:
```env
NEXT_PUBLIC_EN_DOMAIN=en.yourdomain.com
NEXT_PUBLIC_CS_DOMAIN=cs.yourdomain.com
```

No hosts file modifications or port forwarding needed in production.
---

# Testing

Three layers, all runnable locally with npm scripts.

| layer | command | what it covers | needs Sanity? |
| --- | --- | --- | --- |
| Unit (Vitest) | `npm run test` | pure functions, the contact schema and route, component smoke tests | no |
| E2E (Playwright) | `npm run test:e2e` | one spec per route, against a real dev server | yes |
| Crawl (Playwright) | `npm run test:crawl` | every reachable page, breadth-first | yes |

`npm run test:all` runs all three in order.

## Unit tests

```bash
npm run test                      # all workspaces
npm run test -w apps/web          # web only
npm run test:watch -w apps/web    # watch mode
```

Tests live next to the code they cover as `*.test.ts` / `*.test.tsx`. Vitest runs
two projects: pure functions in `node`, anything that renders in `jsdom`. No
network, no Sanity, no env setup - `vitest.config.ts` injects dummy values for
the few modules that build a Sanity client at import time.

## E2E tests

E2E drives a real dev server against a **real Sanity dataset**, so it needs
credentials. Every spec is read-only: nothing submits a form against the live
API (the contact specs stub `/api/contact`) and nothing writes content.

```bash
cp apps/web/.env.example apps/web/.env.local   # fill in the Sanity values
npm run test:e2e                               # chromium
npx playwright test --project=webkit           # optional second browser
npx playwright test e2e/catalog.spec.ts        # a single spec
npx playwright test --ui                       # interactive
```

Playwright starts `npm run dev:web` itself and reuses an already-running server
if one is listening on port 3000.

**Locale routing.** `next-intl` picks the locale from the request's domain, and
a browser cannot fake a `Host` header on a navigation. `playwright.config.ts`
therefore maps the Czech domain onto plain `localhost` and English onto
`en.localhost`, so `http://localhost:3000` resolves to `cs` - which is what every
spec asserts. `e2e/i18n.spec.ts` fails loudly if that mapping breaks.

**Using a browser you already have.** If the Playwright download host is
unreachable, point it at an existing Chrome:

```bash
PLAYWRIGHT_CHROMIUM_PATH=/path/to/chrome npm run test:e2e
```

### Specs

| spec | covers |
| --- | --- |
| `home.spec.ts` | homepage, header nav, footer, images, console errors |
| `catalog.spec.ts` | school list, filters, search, load-more |
| `catalog-levels.spec.ts` | walks country → region → area → subarea through the UI |
| `school.spec.ts` | catalog → detail: name, address, map |
| `article.spec.ts` | articles index → article, rich text, images actually loaded, internal links resolve |
| `groups-index.spec.ts` | group listing and card links |
| `cooperation.spec.ts` | the remaining static routes (cooperation, contact) |
| `not-found.spec.ts` | bad catalog depth and bad slugs → 404, never 500 |
| `contact.spec.ts` | consent gating, honeypot, success and error states |
| `i18n.spec.ts` | `html lang="cs"`, Czech paths, language switcher target |
| `a11y.spec.ts` | axe on home, catalog and school detail |

`a11y.spec.ts` fails only on **serious** and **critical** violations, but prints
every violation it finds so the backlog stays visible.

## Full-site crawl

```bash
npm run test:crawl
CRAWL_MAX_PAGES=50 CRAWL_MAX_DEPTH=3 npm run test:crawl
```

Breadth-first from `/`, following same-origin links only (external links are
listed, never visited). Defaults: 300 pages, depth 6.

On every page it checks the status is under 400, there are no console errors or
uncaught exceptions, there is exactly one `h1`, every `img` has an `alt`,
`html lang` is `cs`, and the title is non-empty. A linked page that 404s counts
as a broken link and fails the run.

Reports land in `e2e/reports/` (git-ignored, uploaded as a CI artifact):

- `crawl.json` - full machine-readable result
- `crawl-report.md` - summary, broken links, per-page issues, slowest 10 pages,
  external links

Third-party console noise (map tile aborts, analytics) is filtered through an
allowlist in `e2e/helpers.ts`. Keep that list short - every entry is something
you have chosen not to see.

## CI

- **`ci.yml`** runs lint, typecheck, unit tests and build, then e2e in a second
  job. Runs on every PR.
- **`crawl.yml`** runs the crawl weekly (Mondays 04:00 UTC) and on manual
  dispatch, uploading `e2e/reports/` as an artifact. It is kept out of PR runs
  because it is slow.

Both workflows need the `SANITY_PROJECT_ID` and `SANITY_DATASET` repository
secrets; `MAPTILER_API_KEY` is optional. The required secrets are documented in
comments at the top of each workflow file.
