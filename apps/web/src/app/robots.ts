import type { MetadataRoute } from "next";
import { absoluteUrl, localeFromRequest } from "@/lib/seo/site";

/**
 * `robots.txt`, per host.
 *
 * Same shape as sitemap.ts and for the same reason: one deployment answers two
 * domains, so the Sitemap: line has to name the sitemap of the host that asked
 * rather than a fixed one. See the module docs there.
 *
 * `/api/` is the only disallowed path. It holds the contact-form endpoint and
 * the Sanity revalidation webhook - neither is a page, both reject anything
 * but a signed or validated POST, and there is nothing there for a crawler to
 * index. Everything else is open: the whole point of the site is to be found.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const locale = await localeFromRequest();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: absoluteUrl(locale, "/sitemap.xml"),
  };
}
