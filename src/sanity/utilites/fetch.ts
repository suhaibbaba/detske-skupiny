import { client } from "@/sanity/client";
import { expandLinks } from "@/sanity/utilites/expandLinks";
import type { SanityClient } from "next-sanity";
import { getLocale } from "next-intl/server";

type FetchParams = Parameters<SanityClient["fetch"]>[1];

function getClientLocale() {
  if (typeof window === "undefined") return "en"; // fallback

  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  return match ? match[1] : "en";
}

export async function sanityFetch<T>(
  query: string,
  params?: FetchParams,
): Promise<T> {
  const locale = await getLocale();
  const queryParams = { ...(params || {}), locale };
  const data = await client.fetch<T>(query, queryParams);
  return expandLinks(data);
}

export async function clientFetch<T>(query: string, params?: FetchParams) {
  let locale: string;

  if (typeof window === "undefined") {
    locale = await getLocale();
  } else {
    locale = getClientLocale();
  }

  const queryParams = { ...(params || {}), locale };
  const data = await client.fetch<T>(query, queryParams);
  return data;
}
