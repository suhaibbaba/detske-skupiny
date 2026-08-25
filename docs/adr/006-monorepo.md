# 006 — One repo, npm workspaces

## Context

The web app and the Sanity Studio are two deployables with one shared
vocabulary: every document type the Studio defines is something the web app
queries, and the locale list has to be identical in both or the site renders
empty ([ADR-004](004-document-level-i18n.md)).

They started as separate concerns and were consolidated into
`apps/web` + `apps/studio` early in the rescue. The question was what to use to
hold them together: npm workspaces, pnpm workspaces, or a build orchestrator
like Turborepo or Nx.

## Decision

**One repository, npm workspaces, no build orchestrator.**

```text
apps/web        Next.js 16 front end — App Router, RSC, Cache Components
apps/studio     Sanity v5 Studio — schemas, desk structure, one plugin, migrations
packages/config Shared constants both apps must agree on (the locale list)
packages/types  Generated Sanity types — schema.json → sanity.generated.ts
e2e             Playwright specs and the full-site crawler
docs            Living docs, perf series, ADRs
```

Root scripts fan out with `--workspaces --if-present`; there is no task graph,
no remote cache, and no `turbo.json`.

## Consequences

**What it bought — and the payoff is mostly typegen.**

The Studio's schema is extracted to `apps/studio/schema.json`, and
`sanity typegen` turns that plus the `defineQuery` call sites into
`packages/types/src/sanity.generated.ts`, which `apps/web` compiles against.
Because both apps are in one tree, **CI can regenerate and fail on a dirty
tree**:

```yaml
- name: TypeGen is up to date
  run: |
    npm run typegen
    git diff --exit-code -- apps/studio/schema.json packages/types/src/sanity.generated.ts
```

A field renamed in the Studio without a regenerate is a red build, not a
runtime `undefined` in production. Across two repos this is a version-bump
dance with a window in between; here there is no window. Both commands are
offline — `schema extract` reads the Studio's own modules and `typegen` reads
`schema.json` plus the query call sites — so the gate needs no project id, no
dataset, and no network.

The same seam is why hand-written `any` in `apps/web/src` went to **zero**: the
shapes come from the generator, so there is nothing to hand-type.

**Why npm and not pnpm or Turbo.** Two apps and two tiny packages do not have a
task graph worth orchestrating; the full CI run is lint, typecheck, 364 unit
tests and a build. Turborepo's remote cache pays off at a scale this repo is
nowhere near, and would add a config file, a daemon and a vocabulary to every
future contributor's onboarding. npm workspaces ship with Node and need no
explanation. pnpm's strict `node_modules` layout is a genuine advantage, but not
one worth a second package manager in a handover.

**What it costs.**

- **One lockfile for everything**, so a Studio-only dependency bump touches the
  same file as a web-only one, and `npm ci` installs both apps' trees even for a
  one-app change.
- **No task-level caching.** CI re-runs everything on every push. At current
  suite times that is cheaper than the machinery to avoid it.
- **`apps/studio` is not linted.** Its eslint config was broken on arrival and
  only `apps/web` has a `lint` script; `--if-present` therefore skips it
  silently. This is a known gap, and it is where the remaining hand-written
  `any` lives.

## Revisit when

- **A third or fourth deployable appears**, or CI wall-clock becomes the thing
  slowing merges down — that is when a task graph and a remote cache start
  paying for themselves.
- **The two apps' dependency trees start fighting** over a shared transitive
  version, which is the case pnpm's layout actually solves.
- **`apps/studio` gets a working lint setup**, at which point the
  `--if-present` skip stops being a silent gap and the root scripts should be
  tightened to fail on a missing script instead.
