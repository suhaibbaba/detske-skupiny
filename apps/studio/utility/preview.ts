import { languageBadge } from "@/utility/language";

/**
 * What a row says under its title.
 *
 * Every list in the studio is scanned rather than read, so a subtitle earns
 * its place only if it distinguishes this row from the one below it: where a
 * school is, who wrote a post, which region an area belongs to. These two
 * helpers exist so that every type says it the same way - one separator, one
 * rule about empty values, one rule about the language badge - instead of each
 * schema inventing its own.
 */

/**
 * Joins the parts of a subtitle, dropping the ones that are not there.
 *
 * The filter is the whole point: a school with an area but no region should
 * read "Praha 6", not "Praha 6 · " or "Praha 6 · undefined", and every one of
 * these fields is optional on some document somewhere.
 */
export const subtitle = (
  ...parts: (string | number | false | null | undefined)[]
): string =>
  parts
    .filter((part) => part !== "" && part !== false && part != null)
    .join(" · ");

/** {@link subtitle}, with the language badge in front when there is one. */
export const localizedSubtitle = (
  language?: string,
  ...parts: (string | number | false | null | undefined)[]
): string => subtitle(languageBadge(language), ...parts);

/**
 * A date as a row wants to read it: "24. srpna 2026".
 *
 * Czech formatting, because that is the language the content is written in and
 * the people reading these lists work in. `Intl` is in every browser the
 * studio runs in, so this needs no dependency - and it is only ever used for
 * display, never for anything the site reads back.
 *
 * Returns `undefined` rather than "Invalid Date" for a missing or unparseable
 * value, so it composes with {@link subtitle}, which drops it.
 */
export const formatDate = (value?: string): string | undefined => {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * How many items are in an array field, phrased for a subtitle.
 *
 * Reads the array the document already carries - `select: {items: "entries"}`
 * hands `prepare` the value itself - so this is a count of something in hand,
 * not a query. Counting the *other* documents that point at this one would be
 * a fetch per row, and a list of four hundred rows would issue four hundred of
 * them; those counts belong in the web app, which computes them once per page
 * in the query it was already running.
 */
export const countLabel = (
  items: unknown,
  singular: string,
  plural = `${singular}s`,
): string => {
  const count = Array.isArray(items) ? items.length : 0;
  return `${count} ${count === 1 ? singular : plural}`;
};
