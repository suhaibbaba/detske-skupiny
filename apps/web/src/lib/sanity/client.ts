import "server-only";

import { createClient } from "next-sanity";

/**
 * The one Sanity client in the web app.
 *
 * `server-only` is load-bearing: importing this module (directly or through
 * anything in `lib/sanity`) from a Client Component fails the build instead of
 * silently shipping the dataset - and previously the project id - to the
 * browser. That is why the env vars below have no NEXT_PUBLIC_ prefix.
 */
export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: "2025-08-09",
  // The API CDN is a separate, time-based cache in front of Sanity. Next's
  // Data Cache now holds the responses and the revalidate endpoint drops them
  // by tag, so a second cache in between would only delay invalidation.
  useCdn: false,
  perspective: "published",
});
