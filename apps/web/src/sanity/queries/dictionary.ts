import { groq } from "next-sanity";
import { cache } from "react";
import { sanityFetch } from "@/lib/sanity/fetch";

/**
 * The locale is interpolated rather than passed as `$locale` because it names
 * a field to read (`entries[].cs`), and GROQ params cannot stand in for a
 * field path. `locales` in i18n/routing is the only source of the values.
 */
export const messagesQuery = (locale: string) => groq`
  *[_type == "dictionaries"][0]{
    "common": entries[]{
      "k": keyword,
      "v": coalesce(${locale}, en)
    }
  }
`;

type Row = { k: string; v: string };
type Wire = { common: Row[] };

async function fetchDictionary(locale: string) {
  const data = await sanityFetch<Wire>(
    messagesQuery(locale),
    {},
    ["dictionary"],
  );

  const common: Record<string, string> = {};
  for (const r of data?.common ?? []) {
    if (r?.k) common[r.k] = r.v;
  }
  return { common };
}

/**
 * React `cache` still earns its place on top of the Data Cache: it collapses
 * the several calls a single render makes into one.
 */
export const getDictionary = cache(async (locale: string) => {
  return fetchDictionary(locale);
});
