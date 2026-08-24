import { defineQuery } from "next-sanity";
import { cache } from "react";
import type { SettingsQueryResult } from "@detske-skupiny/types";
import { sanityFetch } from "@/lib/sanity/fetch";
import { imageUrl } from "@/lib/sanity/fragments";

export const settingsQuery = defineQuery(`*[_type == "settings"][0] {
  ...,
  ${imageUrl("defaultImage")},
}`);

/**
 * Settings are not language-scoped, so this query takes no $locale.
 *
 * `unstable_cache` used to wrap this; the "use cache" body of sanityFetch
 * replaces it, and the "settings" tag replaces the fixed cache key.
 */
export const getSettings = cache(async (): Promise<SettingsQueryResult> => {
  return sanityFetch<SettingsQueryResult>(settingsQuery, {}, ["settings"]);
});
