import { client } from "@/sanity/client";
import { expandLinks } from "@/sanity/utilites/expandLinks";
import type { SanityClient } from "next-sanity";

type FetchParams = Parameters<SanityClient["fetch"]>[1];

export async function sanityFetch<T>(
  query: string,
  params?: FetchParams,
): Promise<T> {
  const data = await client.fetch<T>(query, params || {});
  return expandLinks(data);
}
