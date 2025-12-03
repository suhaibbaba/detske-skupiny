import { unstable_cache } from "next/cache";
import { cache } from "react";
import { Settings } from "@/sanity/types";
import { client } from "@/sanity/client";

export const settingsQuery = `*[_type == "settings"][0] {
  ...,
  "defaultImage": defaultImage.asset->url,
}`;

const getSettingsFromSanity = unstable_cache(
  async (): Promise<Settings> => {
    return await client.fetch(settingsQuery);
  },
  ["site-settings"], // Cache key
);

// React cache: Deduplicates requests during a single render pass
export const getSettings = cache(async (): Promise<Settings> => {
  return getSettingsFromSanity();
});
