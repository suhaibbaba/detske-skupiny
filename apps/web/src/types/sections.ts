import type { PageByTypeQueryResult } from "@detske-skupiny/types";

/**
 * What `pageByTypeQuery` returns: a page document and its zone of sections.
 *
 * This used to be hand-written, and `sections` had given up entirely -
 * `{ _key: string; _type: string; [k: string]: any }`, which typed the one
 * thing every section shares and nothing else. The generated union carries a
 * member per section type in the Studio, so `Extract`ing by `_type` gives a
 * component the exact fields its own schema defines.
 */
export type PageSections = PageByTypeQueryResult;

/** One entry of a page's `sections[]`, discriminated by `_type`. */
export type PageSection = NonNullable<
  NonNullable<PageSections>["sections"]
>[number];

/** The section document behind one registry key - `SectionOfType<"faq">`. */
export type SectionOfType<T extends PageSection["_type"]> = Extract<
  PageSection,
  { _type: T }
>;
