import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { cache } from "react";
import { getLocale } from "@/i18n/cookie";

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
    { next: { revalidate: 0.5 } }, // revalidate every 5 minutes
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

/** Returns translator function bound to a locale */
export async function getTranslator() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (enWord: string) => {
    // keep the key exactly as it is in Sanity ("Contact Us", "Tax Id"...)
    const value = dict.common[enWord];
    return value ?? enWord;
  };
}

/** One-off translate helper */
export async function translate(enWord: string) {
  const t = await getTranslator();
  return t(enWord);
}
