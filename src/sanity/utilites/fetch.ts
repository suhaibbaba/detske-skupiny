import { client } from "@/sanity/client";
import { expandLinks } from "@/sanity/utilites/expandLinks";
import type { SanityClient } from "next-sanity";
import { getLocale } from "next-intl/server";
import { defaultLocale } from "@/i18n/routing";
import { currentLocale } from "@/utilites/localeStore";

type FetchParams = Parameters<SanityClient["fetch"]>[1];

function getClientLocale() {
  return currentLocale ?? defaultLocale;
}

export async function sanityFetch<T>(
  query: string,
  params?: FetchParams,
): Promise<T> {
  const locale = await getLocale();
  const queryParams = { ...(params || {}), locale };
  const data = await client.fetch<T>(query, queryParams, {
    useCdn: true,
    perspective: "published", // Only published content
    next: {
      revalidate: 300, // Next.js caches in seconds
    },
  });
  return expandLinks(data);
}

export async function clientFetch<T>(query: string, params?: FetchParams) {
  let locale: string;

  if (typeof window === "undefined") {
    locale = (await getLocale()) || defaultLocale;
  } else {
    locale = getClientLocale();
  }

  const queryParams = { ...(params || {}), locale };
  const data = await client.fetch<T>(query, queryParams, {
    useCdn: true,
    perspective: "published", // Only published content
    next: {
      revalidate: 300, // Next.js caches in seconds
    },
  });

  return expandLinks(data);
}
