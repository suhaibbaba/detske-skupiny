/**
 * Stands in for the `server-only` package under Vitest.
 *
 * That package throws on import outside a React Server Component, which is
 * exactly what it is for - but it means a test cannot import the Sanity query
 * modules at all. Those modules are only imported here to read the GROQ
 * strings they export; nothing in a test calls the client.
 */
export {};
