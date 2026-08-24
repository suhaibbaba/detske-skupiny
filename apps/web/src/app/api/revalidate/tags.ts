/**
 * Maps a Sanity document `_type` onto the cache tags a publish of it must drop.
 *
 * The webhook projection is `{_type, _id}` - deliberately the smallest payload
 * that still says what changed - so this is the only thing standing between an
 * editor pressing Publish and the right pages regenerating. Everything here is
 * a pure function of `_type` so it can be tested without a request.
 *
 * The tags themselves are chosen by the queries in src/sanity/queries; a tag
 * added there has to be reachable from here or the query it guards will never
 * be invalidated.
 */

/**
 * The tag every cached Sanity read carries in addition to its own.
 *
 * A `_type` this file does not know about drops this instead of guessing, so a
 * new document type added in the studio invalidates too much rather than
 * nothing at all. The mapping below is what turns that back into a precise
 * invalidation - see the "unmapped types" note in the module docs of
 * lib/sanity/fetch.ts.
 */
export const CATCH_ALL_TAG = "content";

/** Geography and the schools placed in it. Counts tie the two together. */
const SCHOOL_AND_GEO_TYPES = [
  "schools",
  "countries",
  "regions",
  "areas",
  "subareas",
] as const;

/** Site chrome, all of it read through one "settings" tag. */
const SETTINGS_TYPES = ["header", "footer", "settings"] as const;

/**
 * Documents that back a page and are fetched under a `page:<type>` tag.
 *
 * Note `schoolPage` and `blogPage` are the *page* documents (hero, copy), not
 * the school or blog entries themselves - those are "schools" and "blogs".
 */
const PAGE_TYPES = [
  "page",
  "home",
  "group",
  "preschool",
  "contactUs",
  "blogPage",
  "schoolPage",
] as const;

/**
 * `dictionaries` is the schema name; "dictionary" is the tag the web app
 * fetches under. Both spellings are accepted so a rename on either side does
 * not silently stop invalidating translations.
 */
const DICTIONARY_TYPES = ["dictionary", "dictionaries"] as const;

const TAGS_BY_TYPE = new Map<string, readonly string[]>([
  ...SCHOOL_AND_GEO_TYPES.map(
    (type) => [type, ["schools", "geo"]] as [string, readonly string[]],
  ),
  ...SETTINGS_TYPES.map(
    (type) => [type, ["settings"]] as [string, readonly string[]],
  ),
  ...DICTIONARY_TYPES.map(
    (type) => [type, ["dictionary"]] as [string, readonly string[]],
  ),
  ...PAGE_TYPES.map(
    (type) => [type, [`page:${type}`]] as [string, readonly string[]],
  ),
  ["blogs", ["blogs"]],
]);

export type TagMapping = {
  tags: string[];
  /** True when `_type` fell through to {@link CATCH_ALL_TAG}. */
  unmapped: boolean;
};

/**
 * The tags to revalidate for a published document of type `type`.
 *
 * Never returns an empty list: an unrecognised type revalidates everything
 * through {@link CATCH_ALL_TAG}, which is correct but blunt, so the caller
 * logs it.
 */
export function tagsForType(type: unknown): TagMapping {
  const mapped = typeof type === "string" ? TAGS_BY_TYPE.get(type) : undefined;

  return mapped
    ? { tags: [...mapped], unmapped: false }
    : { tags: [CATCH_ALL_TAG], unmapped: true };
}
