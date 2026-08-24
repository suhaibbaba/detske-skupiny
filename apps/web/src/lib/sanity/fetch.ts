import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { client } from "@/lib/sanity/client";

/**
 * Every read of Sanity content goes through here.
 *
 * The `"use cache"` body means the result is stored in Next's Data Cache keyed
 * by (query, params, tags) and shared across requests and users. `cacheLife`
 * decides how long an unrevalidated entry may live; `cacheTag` decides how it
 * gets dropped early.
 *
 * "max" is deliberate. Content changes when an editor publishes, not on a
 * timer, so there is no useful revalidate interval - the tags are the
 * invalidation mechanism (see app/api/revalidate/route.ts). Until the Sanity
 * webhook lands, that endpoint is the manual path to refresh.
 *
 * `params` and `tags` are part of the cache key, so callers must pass a stable
 * `$locale` rather than reading the locale in here: a dynamic read inside a
 * cached function is both an error under Cache Components and a correctness
 * bug, since one cache entry would be served to every locale.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown>,
  tags: string[],
): Promise<T> {
  "use cache";
  cacheLife("max");
  for (const tag of tags) {
    cacheTag(tag);
  }

  return client.fetch<T>(query, params);
}
