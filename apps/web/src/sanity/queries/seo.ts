import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/lib/sanity/fetch";
import { excludeDraft, languageQuery } from "@/sanity/queries/filters";
import {
  areaPath,
  catalogPathBySelfType,
  regionPath,
  schoolCountForArea,
  schoolCountForCountry,
  schoolCountForRegion,
  schoolCountForSubarea,
  subareaPath,
  translationCatalogPaths,
  translationSlugs,
} from "@/lib/sanity/fragments";
import { FilterTypes } from "@/app/[locale]/catalog/[...slug]/utilites/catalog";

/**
 * The reads that exist only to build the sitemap and the hreflang pairs.
 *
 * They go through `sanityFetch` like every other read, under the same tags the
 * page queries use, so a publish that changes a slug drops the sitemap with
 * the pages: "schools" for schools, "blogs" for articles, "geo" for the
 * catalog tree.
 */

/** One entry of a document's `translation.metadata` array. */
export type TranslationPath = {
  locale: string;
  path: string | null;
};

/** A URL the sitemap should list, before it is turned into an absolute one. */
export type SitemapEntry = {
  /** Path of the document itself - a slug, or a composed catalog chain. */
  path: string;
  updatedAt?: string;
  translations?: TranslationPath[] | null;
};

export type CatalogSitemapEntry = SitemapEntry & {
  level: "country" | "region" | "area" | "subarea";
  schoolCount: number;
};

/**
 * A catalog level is listed only when it actually has schools under it.
 *
 * An empty subarea renders a page with a heading and no results, which is a
 * thin page a crawler should not be pointed at - and the tree has many more
 * subareas than it has subareas with schools. The count is the same aggregate
 * the filter sidebar shows, so a level is in the sitemap exactly when the
 * catalog would show a non-zero number next to it.
 *
 * The filter is applied to the projection rather than inside `*[...]` because
 * that is where the count fragments are written to run - see the note on `^`
 * in lib/sanity/fragments.ts.
 *
 * Every call below wraps its fragment arguments as `` `${fragment}` `` rather
 * than passing the identifier. Sanity TypeGen resolves a call's arguments
 * statically and only understands literals: a bare identifier gives "Could not
 * find binding", and the query it feeds is dropped from the generated types
 * without failing the run. Wrapping makes the argument a template literal,
 * which TypeGen does resolve. The GROQ produced is byte-identical.
 */
const catalogLevel = (
  type: string,
  level: string,
  path: string,
  count: string,
) => `*[
    _type == "${type}" &&
    ${languageQuery} &&
    ${excludeDraft} &&
    defined(slug.current)
  ]{
    "level": "${level}",
    "path": ${path},
    "updatedAt": _updatedAt,
    "schoolCount": ${count},
    ${translationCatalogPaths}
  }[schoolCount > 0]`;

export const sitemapQuery = defineQuery(`{
    "schools": *[
      _type == "schools" &&
      ${languageQuery} &&
      ${excludeDraft} &&
      defined(slug.current)
    ]{
      "path": slug.current,
      "updatedAt": _updatedAt,
      ${translationSlugs}
    },

    "articles": *[
      _type == "blogs" &&
      ${languageQuery} &&
      ${excludeDraft} &&
      defined(slug.current)
    ]{
      "path": slug.current,
      "updatedAt": _updatedAt,
      ${translationSlugs}
    },

    "catalog":
      ${catalogLevel("countries", "country", `"/" + slug.current`, `${schoolCountForCountry}`)}
      + ${catalogLevel("regions", "region", `${regionPath}`, `${schoolCountForRegion}`)}
      + ${catalogLevel("areas", "area", `${areaPath}`, `${schoolCountForArea}`)}
      + ${catalogLevel("subareas", "subarea", `${subareaPath}`, `${schoolCountForSubarea}`)}
  }`);

export type SitemapContent = {
  schools: SitemapEntry[];
  articles: SitemapEntry[];
  catalog: CatalogSitemapEntry[];
};

export async function fetchSitemapContent(locale: string) {
  return sanityFetch<SitemapContent>(sitemapQuery, { locale }, [
    "schools",
    "blogs",
    "geo",
  ]);
}

/**
 * The catalog root the site's search box submits into.
 *
 * The home page's `SearchAction` needs a URL template, and the catalog's
 * search lives at a country page (`/katalog/<country>?name=...`) rather than
 * at a bare `/katalog`. Returning the first country by its studio ordering
 * makes that template concrete; a dataset with no country returns null and the
 * home page then omits the action rather than publishing one that 404s.
 */
export const searchCountrySlugQuery = defineQuery(`*[
    _type == "countries" &&
    ${languageQuery} &&
    ${excludeDraft} &&
    defined(slug.current)
  ] | order(orderRank)[0].slug.current`);

export async function fetchSearchCountrySlug(locale: string) {
  return sanityFetch<string | null>(searchCountrySlugQuery, { locale }, [
    "geo",
  ]);
}

/** Maps a parsed catalog level onto the document type that backs it. */
const CATALOG_TYPE_BY_LEVEL: Record<string, string> = {
  [FilterTypes.country]: "countries",
  [FilterTypes.region]: "regions",
  [FilterTypes.area]: "areas",
  [FilterTypes.subarea]: "subareas",
};

/**
 * The geography document a catalog URL resolves to, with its counterpart path.
 *
 * `$type` is part of the filter because slugs are only unique within a level -
 * a region and an area may both be "praha". The level comes from how many
 * segments the URL had, which is the same thing the page itself uses to decide
 * which query to run.
 */
export const catalogNodeQuery = defineQuery(`*[
    _type == $type &&
    slug.current == $slug &&
    ${languageQuery} &&
    ${excludeDraft}
  ][0]{
    name,
    "path": ${catalogPathBySelfType},
    "updatedAt": _updatedAt,
    ${translationCatalogPaths}
  }`);

export type CatalogNode = {
  name?: string;
  path?: string;
  updatedAt?: string;
  translations?: TranslationPath[] | null;
};

export async function fetchCatalogNode(params: {
  level: string;
  slug: string;
  locale: string;
}): Promise<CatalogNode | null> {
  const type = CATALOG_TYPE_BY_LEVEL[params.level];
  if (!type) return null;

  return sanityFetch<CatalogNode | null>(
    catalogNodeQuery,
    { type, slug: params.slug, locale: params.locale },
    ["geo"],
  );
}
