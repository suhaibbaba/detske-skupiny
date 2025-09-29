import { client } from "@/sanity/client";
import { expandLinks } from "@/sanity/utilites/expandLinks";
import type { SanityClient } from "next-sanity";
import { getLocale } from "next-intl/server";

type FetchParams = Parameters<SanityClient["fetch"]>[1];

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
  const locale = await getLocale();
  const queryParams = { ...(params || {}), locale };
  const data = await client.fetch<T>(query, queryParams);
  return data;
}
