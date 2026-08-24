import type {
  SchoolBySlugQueryResult,
  SchoolCardsQueryResult,
} from "@detske-skupiny/types";

/**
 * A school as a card grid or carousel renders it.
 *
 * `schoolCardFields` in lib/sanity/fragments.ts is the one projection behind
 * every card on the site, so the card type is that query's row. Notably
 * narrower than the hand-written type it replaces, which claimed `region` was
 * the full `Region` document - the projection returns an id, a name and a slug.
 */
export type MiniSchool = SchoolCardsQueryResult[number];

/** The school detail page's document. */
export type School = NonNullable<SchoolBySlugQueryResult["school"]>;

export type SchoolCategory = NonNullable<MiniSchool["categories"]>[number];
export type SchoolType = NonNullable<MiniSchool["types"]>[number];
export type SchoolTag = NonNullable<MiniSchool["tags"]>[number];
