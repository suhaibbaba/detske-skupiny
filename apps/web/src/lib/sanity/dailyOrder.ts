/**
 * The deterministic daily shuffle the school listings are ordered by.
 *
 * Computed from the school's `_id` and the current date rather than read from a
 * stored sort field: the order is a presentation concern, so nothing about it
 * is content an editor sees or a write anything has to make.
 *
 * Two properties matter:
 *
 *  - Stable within a day. Every request on the same date produces the same
 *    order, so paging through the catalog cannot show a school twice or skip
 *    one, and a shared link renders what the sender saw.
 *  - Different between days. The seed is the date, so which schools sit at the
 *    top rotates once a day without anything being written anywhere.
 *
 * High-priority schools sort first; the shuffle only decides the order within
 * each of the two groups.
 */

export type DailyOrderable = {
  id: string;
  isHighPriority?: boolean | null;
};

/**
 * The seed for a given day, as `YYYY-MM-DD` in UTC.
 *
 * UTC rather than local time so that every server rendering the site agrees on
 * which day it is, and the rotation happens once rather than once per timezone.
 */
export function dailySeed(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/**
 * FNV-1a, 32-bit.
 *
 * Not a security hash - it just has to spread ids evenly and give the same
 * answer on every machine. `Math.imul` keeps the multiply in 32-bit range, and
 * the final `>>> 0` makes the result an unsigned integer so comparisons are
 * not thrown off by a sign bit.
 */
export function stableHash(input: string): number {
  let hash = 0x811c9dc5;

  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

/**
 * Orders schools by priority, then by the shuffle for `seed`.
 *
 * Returns a new array; the input is not mutated. Ties on the hash fall back to
 * the id, so the result is a total order even in the (unlikely) case of a
 * 32-bit collision - without that, two colliding schools could swap places
 * between two renders of the same page and break paging.
 *
 * `seed` is required rather than defaulting to today. Under Cache Components a
 * bare `new Date()` aborts a prerender, so the clock may only be read inside a
 * cached scope - which is what `lib/sanity/dailySeed.ts` is for. Making the
 * argument mandatory means a new caller cannot reintroduce that by leaving it
 * out.
 */
export function orderByDailyShuffle<T extends DailyOrderable>(
  items: readonly T[],
  seed: string,
): T[] {
  const rank = new Map(
    items.map((item) => [item.id, stableHash(`${item.id}:${seed}`)]),
  );

  return [...items].sort((a, b) => {
    const priority =
      Number(Boolean(b.isHighPriority)) - Number(Boolean(a.isHighPriority));
    if (priority !== 0) {
      return priority;
    }

    const hashed = (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0);
    if (hashed !== 0) {
      return hashed;
    }

    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}
