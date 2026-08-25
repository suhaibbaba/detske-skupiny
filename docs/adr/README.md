# Architecture decision records

One page per decision that would otherwise have to be re-argued from scratch by
whoever inherits this next. Each records the state of the world at the time, the
call that was made, what it cost, and — the part that matters most — the signal
that should make someone revisit it.

| # | Decision | Supports |
| --- | --- | --- |
| [001](001-sanity-as-single-source.md) | Sanity is the only datastore; no application database | [Architecture](../../README.md#architecture) |
| [002](002-remove-denormalization.md) | Derive at read time; seven plugins and two crons become one | [The journey](../../README.md#the-journey) |
| [003](003-event-driven-cache.md) | `"use cache"` + tags + a publish webhook, not a timer | [Architecture](../../README.md#architecture) |
| [004](004-document-level-i18n.md) | One document per language, grouped in the Studio | [Content management](../../README.md#content-management) |
| [005](005-stay-on-mui.md) | Stay on MUI; take v9 despite a bigger bundle | [The journey](../../README.md#the-journey) |
| [006](006-monorepo.md) | One repo, npm workspaces, generated types across the seam | [Running locally](../../README.md#running-locally) |

## Format

**Context** — what was true when the decision was made.
**Decision** — what was chosen, stated so it can be disagreed with.
**Consequences** — what it bought and what it cost, including the costs that
are still being paid.
**Revisit when** — the concrete signal that invalidates the decision. An ADR
without one is a decision nobody will ever reopen, which is how architecture
rots.
