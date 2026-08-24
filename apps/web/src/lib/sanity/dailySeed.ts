import "server-only";

import { cacheLife } from "next/cache";
import { dailySeed } from "@/lib/sanity/dailyOrder";

/**
 * The seed the school ordering shuffles by, read once a day.
 *
 * Reading the clock has to happen inside a `"use cache"` body. Under Cache
 * Components a bare `new Date()` is treated as I/O, and a prerender aborts on
 * it - which the home and cooperation pages would do, since their carousels
 * are rendered above any Suspense boundary and are prerendered at build time.
 * A cached scope is explicitly exempt, so this is where the clock is allowed
 * to be read.
 *
 * `cacheLife("days")` rather than "max" is the one deliberate exception to the
 * tags-only rule in fetch.ts, and it is what actually makes the rotation
 * daily: the entry has to expire for a new seed to be produced, and no
 * publish should reshuffle the list, so this value carries no cache tag.
 *
 * Caching it also makes paging correct. The seed is read again by the
 * load-more Server Action, minutes or hours after the page was rendered; if
 * each read saw the current date, a "load more" that crossed midnight UTC
 * would page through a different permutation and show duplicates while
 * dropping other schools. One cached value means every request in a day
 * shuffles identically.
 */
export async function getDailySeed(): Promise<string> {
  "use cache";
  cacheLife("days");

  return dailySeed();
}
