import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { cache } from "react";
import { getLocale } from "next-intl/server";

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

/** Actually fetch from Sanity (once) */
async function fetchDictionary(locale: string) {
  const data = await client.fetch<Wire>(
    messagesQuery(locale),
    {},
    { next: { revalidate: 300 } }, // revalidate every 5 minutes
  );

  const common: Record<string, string> = {};
  for (const r of data?.common ?? []) {
    if (r?.k) common[r.k] = r.v;
  }
  return { common };
}

/** Cached per-locale dictionary (does NOT re-fetch on every call) */
export const getDictionary = cache(async (locale: string) => {
  return fetchDictionary(locale);
});
