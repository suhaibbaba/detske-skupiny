/**
 * Client-safe surface only.
 *
 * DefaultImageProvider is a Server Component that reads Sanity, and it used to
 * be re-exported from here too. Because `useDefaultImage` is imported from
 * this barrel by Client Components, that pulled the data layer into the client
 * bundle - which `server-only` in lib/sanity now rejects outright. The layout
 * imports the server provider from its own module.
 */
export * from "./DefaultImageClientProvider";
