/**
 * Client-safe surface only.
 *
 * `useDefaultImage` is imported from this barrel by Client Components, so
 * nothing that reaches Sanity may be re-exported here - `server-only` in
 * lib/sanity rejects it outright. `DefaultImageProvider` is a Server Component
 * and the layout imports it from its own module.
 */
export * from "./DefaultImageClientProvider";
