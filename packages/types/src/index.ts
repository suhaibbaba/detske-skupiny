/**
 * Types generated from the Sanity schema.
 *
 * Nothing in here is hand-written. `npm run typegen` at the repo root extracts
 * `apps/studio/schema.json` from the Studio's own schema definitions and then
 * turns every `defineQuery`-tagged GROQ string in apps/web into a result type.
 * CI re-runs both and fails on a dirty tree, so a schema change that nobody
 * regenerated for cannot merge.
 *
 * The package sits outside apps/web because the generator has to run from the
 * studio workspace (it needs the Studio config to resolve the schema) while
 * the types are consumed by the web workspace. A shared package is the only
 * place both can reach without one app importing the other's internals.
 */
export * from "./sanity.generated";
