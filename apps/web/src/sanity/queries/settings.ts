import { groq } from "next-sanity";
import { cache } from "react";
import { Settings } from "@/sanity/types";
import { sanityFetch } from "@/lib/sanity/fetch";
import { imageUrl } from "@/lib/sanity/fragments";

export const settingsQuery = groq`*[_type == "settings"][0] {
  ...,
  ${imageUrl("defaultImage")},
}`;

/**
 * Settings are not language-scoped, so this query takes no $locale.
 *
 * `unstable_cache` used to wrap this; the "use cache" body of sanityFetch
 * replaces it, and the "settings" tag replaces the fixed cache key.
 */
export const getSettings = cache(async (): Promise<Settings> => {
  return sanityFetch<Settings>(settingsQuery, {}, ["settings"]);
});
