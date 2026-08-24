import {
  createLoader,
  parseAsInteger,
  parseAsNativeArrayOf,
  parseAsString,
} from "nuqs/server";
import { z } from "zod";
import { locales } from "@/i18n/routing";

export const PAGE_SIZE = 9;

/** Guards against a hand-edited `?page=` asking for thousands of documents. */
const MAX_PAGE = 200;

/**
 * The catalog's query string, in one place.
 *
 * `parseAsNativeArrayOf` keeps the repeated-key form the URLs have always
 * used - `?tags=a&tags=b` - rather than nuqs's default comma-joined single
 * key, so existing links and bookmarks keep working.
 *
 * `page` is here because it is URL state like the rest, but it behaves
 * differently: filter changes navigate (shallow: false) so the server
 * re-renders, while `page` is written shallowly after a Server Action has
 * already returned the data. See SchoolList.
 */
export const catalogParsers = {
  categories: parseAsNativeArrayOf(parseAsString).withDefault([]),
  tags: parseAsNativeArrayOf(parseAsString).withDefault([]),
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

/** Parses `searchParams` on the server exactly as the client wrote them. */
export const loadCatalogSearchParams = createLoader(catalogParsers);

const slugList = z
  .array(z.string().trim().min(1).max(200))
  .max(100)
  .transform((values) => Array.from(new Set(values)));

/**
 * Validation and normalisation of the filter state.
 *
 * Shared deliberately: the page applies it to whatever is in the URL, and the
 * load-more Server Action applies it to whatever a caller posts. A Server
 * Action is a public endpoint, so the action's input cannot be trusted any
 * more than a query string can.
 */
export const catalogFiltersSchema = z.object({
  categories: slugList.default([]),
  tags: slugList.default([]),
  name: z.string().trim().max(200).default(""),
  page: z.coerce.number().int().min(1).max(MAX_PAGE).default(1),
});

export type CatalogFilters = z.infer<typeof catalogFiltersSchema>;

/**
 * The geo scope, which comes from the path rather than the query string, plus
 * the locale. The action needs both to reproduce the page's query.
 */
export const catalogScopeSchema = z.object({
  country: z.string().trim().min(1).max(200),
  region: z.string().trim().max(200).optional(),
  area: z.string().trim().max(200).optional(),
  subarea: z.string().trim().max(200).optional(),
  locale: z.string().refine((value) => locales.includes(value), {
    message: "unknown locale",
  }),
});

export const loadMoreInputSchema =
  catalogScopeSchema.merge(catalogFiltersSchema);

export type LoadMoreInput = z.infer<typeof loadMoreInputSchema>;

/**
 * Falls back to unfiltered rather than throwing: a malformed query string
 * should still render the catalog, the way it did before any of this was
 * validated.
 */
export function parseCatalogFilters(input: unknown): CatalogFilters {
  const parsed = catalogFiltersSchema.safeParse(input);

  return parsed.success
    ? parsed.data
    : { categories: [], tags: [], name: "", page: 1 };
}
