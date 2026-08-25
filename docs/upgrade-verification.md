# Upgrade verification

Date: 2026-08-23 Commit audited: `23d366b` (branch
`claude/studio-document-action-bugs-s1pqh0`, on top of `main`) Node 22.22.2 /
npm 10.9.7

## Scope note — read this first

This pass was requested as a verification of "the dependency upgrade". **No
dependency upgrade exists in this repository yet.** The tree is still on:

- `next@15.3.6` (latest is 16.3.2)
- the MUI `overrides` block in the root `package.json`, pinning the whole MUI
  family to 7.1.0
- `src/middleware.ts` (the Next 15 convention; the Next 16 `proxy.ts` rename has
  not happened)

There is also no upgrade report to cross-reference intentional pins against, so
check 3 below records the pins that exist and infers their cause from the
lockfile rather than from a stated rationale.

Every check was still run, against the tree as it actually stands. Treat this
document as **the pre-upgrade baseline**, not as a verification that an upgrade
landed correctly.

Two further environment limits shaped part B:

- **Sanity is unreachable from the audit sandbox.** Outbound egress is
  allowlisted and `*.apicdn.sanity.io` is not on the list, so every page render
  fails at the i18n dictionary fetch with a proxy 403. No real project ID is
  committed to the repo either (correctly — it is env-only), so no amount of
  configuration fixes this here.
- Because of that, the page-level status-code checks are recorded as
  **blocked**, with static evidence from the source in place of a live result.
  The `/api/contact` checks were fully exercised and pass.

## Results

| check | status | notes |
| --- | --- | --- |
| 1. `npm ci` from scratch | **pass** (with warnings) | `node_modules` deleted first; exit 0, 1512 packages in ~1m. **Zero peer-dependency errors or warnings.** 14 warning lines total: 1 `EBADENGINE` + 9 deprecations — see "Install warnings" below. |
| 2a. `npm run typecheck` | **pass** | Both workspaces clean (`tsc --noEmit`). |
| 2b. `npm run lint` | **pass** (with gaps) | Exit 0, 4 warnings in web (3× `react-hooks/exhaustive-deps`, 1 unused eslint-disable). **Gap: only web is linted.** `apps/studio` has no `lint` script, and its `.eslintrc.cjs` is broken — running eslint there fails with `rule "@typescript-eslint/semi" ... could not find plugin "@typescript-eslint"`. |
| 2c. `npm run build` | **fail** | Fails at the repo level with no env vars: `Failed to collect page data for /_not-found` → `Configuration must contain 'projectId'`. **The CI workflow defines no `env:` block, so the CI build step fails the same way.** With `NEXT_PUBLIC_SANITY_*` supplied, both workspaces build green (studio 34.8s, web compiles in 25s). |
| 3. `npm outdated --workspaces` | **warn** | 25 entries. MUI family held at 7.1.0 while `apps/web` requests `^7.1.0` (wanted 7.3.11) — the root `overrides` block is the pin. `next` 15.3.6 vs 16.3.2. No upgrade report exists to justify any pin. Anomaly: `sanity-plugin-link-field` resolves to 1.7.0 but the registry `latest` is 1.5.1. |
| 4. single version of `@mui/material` / `react` / `react-dom` / `next` | **pass** | Exactly one each: `@mui/material@7.1.0`, `react@19.2.8`, `react-dom@19.2.8`, `next@15.3.6`. Note the dedupe is *because* the overrides block is still present, not despite it. Unrelated dupe found: `@portabletext/react` at 3.2.4, 4.0.3 and 6.2.0. |
| 5. `npm audit --omit=dev` | **fail** | 17 vulnerabilities: **0 critical, 7 high**, 10 moderate. Fixes exist for all highs. See "Audit summary". |
| 6a. grep `next/dist` | **pass** | 0 occurrences. |
| 6b. grep `middleware` → proxy | **n/a** | 4 references, all in `apps/web/src/middleware.ts`. Correct for Next 15; the rename is a Next 16 migration step that has not been started. |
| 6c. grep `x-current-pathname` | **fail** | 2 occurrences: `src/middleware.ts:11` sets the cookie, `src/components/ui/breadcrumb/Breadcrumbs.tsx:48` reads it. Expected zero — this leftover is still load-bearing, so removing it is not a one-liner and was left alone. |
| 6d. grep `console.log` in `src/app/api` | **pass** | 0 occurrences. (`console.warn`/`console.error` are present and intentional.) |
| 6e. grep `SANITY_STUDIO_API_TOKEN` in `apps/studio` | **pass** | 0 occurrences. |
| 7. `npm run dev:web` boots clean | **partial** | Boots clean: `✓ Ready in 1488ms`, no warnings, no deprecations. **Homepage load could not be verified** — blocked by egress (see scope note), so hydration warnings are unverified. |
| 8. `npm run dev:studio` boots clean, schema loads | **pass** | `✓ Checking configuration files`, ready in 398ms, serves HTTP 200. Loaded in Chromium: React mounts, Vite connects, **zero schema or deprecation errors in the console** — only the expected TLS/network failures against the dummy project. Corroborated by `sanity build` compiling the full schema successfully. |
| 9a. `/` → 200 | **blocked** | Returns 500 in the sandbox; the failure is the egress-blocked dictionary fetch in `src/i18n/request.ts`, not routing. |
| 9b. `/katalog/a/b/c/d/e` → 404 | **blocked (static evidence: correct)** | Cannot be exercised live. By inspection: `parseCatalogSlug` returns `null` for 5+ segments (`catalog.ts:46-48`), and `page.tsx:118` does `if (!catalog \|\| !catalog.country) notFound()`. The 404 path is present and reached before any data fetch. |
| 9c. nonexistent article / group slug → 404 | **blocked (static evidence: correct)** | By inspection: `articles/[slug]/page.tsx:168` `if (!blog) notFound()`; `groups/[group]/page.tsx` guards `school` the same way. |
| 9d. `POST /api/contact` empty body → 400 | **pass** | `400 {"error":"Invalid request"}`. |
| 9e. `POST /api/contact` honeypot `website:"spam"` → 200 | **pass** | `200 {"success":true,"message":"Email sent successfully"}`, no mail sent. |
| 9f. `POST /api/contact` `consent:false` → 400 | **pass** | `400 {"error":"Invalid request"}`. Two extra cases also checked: invalid email → 400, malformed JSON body → 400 (not 500). |
| 10. first-load JS per route | **warn** | 8 of 11 routes exceed 250 kB. See route table and contributors. |
| 11. static vs dynamic | **recorded** | Only `/sitemap.xml` is static. Everything else is dynamic — expected, and consistent with `cacheComponents` being deferred. |

## Install warnings (check 1 detail)

No peer-dependency conflicts. The warnings that matter:

- **`EBADENGINE`: `sanity-plugin-link-field@1.7.0` requires `node >=22.12` and
  `npm >=11.17.0`.** The audit container has npm 10.9.7, so it warns here — and
  **CI pins `node-version: 20`**, which will warn there too and is below the
  package's stated floor.
- **`next@15.3.6` is deprecated by its publisher for a security vulnerability**,
  pointing at the 2025-12-11 Next.js security update.
- `@sanity/next-loader@2.1.2` is deprecated in favour of `next-sanity/live`.
- Remaining deprecations are transitive: `glob@10.5.0`, `uuid@8.3.2` (×2),
  `eslint@9.39.5`, `tsconfck@3.1.6`, `whatwg-encoding@3.1.1`,
  `get-random-values-esm@1.0.2`.

## Build output — full route table

Baseline: **First Load JS shared by all = 102 kB** (`chunks/8315` 46.6 kB +
`chunks/87c73c54` 53.2 kB + 2.36 kB other). Middleware bundle: 45.8 kB.

| route | size | first load JS | marker | over 250 kB |
| --- | --- | --- | --- | --- |
| `/[locale]/catalog/[...slug]` | 15.5 kB | **679 kB** | ƒ dynamic | ⚠ |
| `/[locale]` | 2.43 kB | **654 kB** | ƒ dynamic | ⚠ |
| `/[locale]/cooperation` | 2.43 kB | **654 kB** | ƒ dynamic | ⚠ |
| `/[locale]/groups/[group]` | 1.05 kB | **606 kB** | ƒ dynamic | ⚠ |
| `/[locale]/articles/[slug]` | 730 B | **291 kB** | ƒ dynamic | ⚠ |
| `/[locale]/contact-us` | 6.79 kB | **290 kB** | ƒ dynamic | ⚠ |
| `/[locale]/articles` | 6.2 kB | **263 kB** | ƒ dynamic | ⚠ |
| `/[locale]/groups` | 1.31 kB | **259 kB** | ƒ dynamic | ⚠ |
| `/_not-found` | 261 B | 102 kB | ƒ dynamic | — |
| `/api/contact` | 146 B | 102 kB | ƒ dynamic | — |
| `/sitemap.xml` | 146 B | 102 kB | ○ static | — |

### 5 biggest first-load-JS routes and their contributors

Attribution was done from `.next/app-build-manifest.json` plus per-chunk gzip
sizes, so no `@next/bundle-analyzer` devDependency was added or removed.

| # | route | first load JS | biggest contributors (gzip) |
| --- | --- | --- | --- |
| 1 | `/[locale]/catalog/[...slug]` | 679 kB | **mapbox-gl 256 kB** (vendored inside `@maptiler/sdk`) · **`@maptiler/sdk` 59 kB** · sanity/next-sanity client 72 kB · react-dom 51 kB · shared runtime 45 kB |
| 2 | `/[locale]` | 654 kB | same four as above |
| 3 | `/[locale]/cooperation` | 654 kB | same four as above |
| 4 | `/[locale]/groups/[group]` | 606 kB | same four as above |
| 5 | `/[locale]/articles/[slug]` | 291 kB | sanity/next-sanity 72 kB · react-dom 51 kB · shared runtime 45 kB · MUI/emotion 28 kB · portable-text/rich-text chunk 31 kB |

Two observations, both recorded rather than fixed:

- **The map stack is ~315 kB gzip (~48%) of every heavy route.**
  `MapComponent.tsx` imports `@maptiler/sdk` statically and is imported
  statically by `SchoolsMap`, `MapCollection` and `SchoolMap`, so mapbox-gl
  lands in the initial bundle. A `next/dynamic` import with `ssr: false` would
  move it out of first load.
- **The Sanity client chunk (72 kB gzip) ships to the browser on every route**,
  via the `[locale]` layout.

### Static vs dynamic (phase-3 baseline)

Only `/sitemap.xml` prerenders. All 10 other routes are `ƒ` server-rendered on
demand. This matches expectations: the `[locale]` layout awaits `getSettings()`
and the i18n dictionary on every request, and `middleware.ts` writes a
per-request cookie. Nothing here needs changing before phase 3 — it is the
baseline to compare against once `cacheComponents` is enabled.

## Audit summary (`npm audit --omit=dev`)

**17 total — 0 critical, 7 high, 10 moderate.**

| package | severity | direct | fix available |
| --- | --- | --- | --- |
| `next@15.3.6` | high | yes | **`next@15.5.23` — non-major**, in range |
| `postcss` (via next) | high | no | same `next@15.5.23` bump |
| `sharp` (via next) | high | no | same `next@15.5.23` bump |
| `sanity` | high | yes | `sanity@6.10.1` — **major** |
| `@sanity/cli` | high | no | `sanity@6.10.1` — major |
| `@sanity/runtime-cli` | high | no | `sanity@6.10.1` — major |
| `adm-zip` (GHSA-xcpc-8h2w-3j85, CVSS 7.5) | high | no | `sanity@6.10.1` — major |

`next@15.3.6` alone carries ~30 advisories, the most severe being SSRF via
WebSocket upgrades (GHSA-c4j6-fc7j-m34r, **CVSS 8.6**), plus multiple 7.5 DoS
and middleware/proxy-bypass issues. The moderate findings are
`prismjs`/`refractor` (via `@sanity/orderable-document-list`) and `uuid <11.1.1`
(via `next-sanity`), both needing major bumps.

**The single highest-value action is the `next` 15.3.6 → 15.5.23 bump: it is
non-major, stays within the declared range, and clears 3 of the 7 highs.**

## Ready for phase 3: **no**

Blockers, in order:

1. **`npm run build` fails in CI.** The workflow supplies no
   `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`, so `next
   build` cannot collect page data. Until this is fixed the CI build step cannot
   be trusted as a gate for any upgrade.
2. **7 high-severity advisories in production dependencies**, 3 of which clear
   with a non-major `next` bump that has not been applied.
3. **The upgrade this document was meant to verify has not happened.** `next` is
   on 15, the MUI overrides block is still pinning 7.1.0, and the `proxy.ts`
   rename is not started.

Non-blocking, worth queuing:

- CI runs `node 20`, below `sanity-plugin-link-field@1.7.0`'s declared `>=22.12`
  floor.
- `apps/studio` is not linted at all and its eslint config is broken.
- `x-current-pathname` is still in use (check 6c) and needs a plan, not a
  deletion.
- Layout-level `getSettings()` and the i18n dictionary have no null/error guard,
  so an unreachable or empty Sanity dataset turns **every** route into a 500 —
  including the 404 page. This is exactly what made checks 9a–9c unverifiable
  here, and it is a real availability risk in production.
- Route-level 404 handling itself is correct by inspection; re-run checks 9a–9c
  in an environment with Sanity access to confirm end-to-end.

## Reproducing

```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm ci
npm run typecheck && npm run lint
cp apps/web/.env.example apps/web/.env.local   # build needs the Sanity vars
npm run build
npm outdated --workspaces
npm audit --omit=dev
```
