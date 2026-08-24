import { Box } from "@mui/material";
import { fetchPageByType } from "@/sanity/queries";
import Zone from "@/sanity/components/Zone";
import { PageProps } from "@/types";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Suspense } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { webSiteJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata, siteContext } from "@/lib/seo/metadata";
import { staticRoutePaths } from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/seo/site";
import { fetchSearchCountrySlug } from "@/sanity/queries/seo";
import { getLocalizedRoutes } from "@/routes";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Metadata is a pure function of the route and the published content, so it
  // is cached rather than computed per request - without this, Cache
  // Components treats the Sanity reads below as runtime data and refuses to
  // prerender the route's head. Same reason as the layout's.
  "use cache";
  const { locale } = await params;
  setRequestLocale(locale);
  const { siteName, translate } = await siteContext(locale);

  const metadata = await buildPageMetadata({
    locale,
    paths: staticRoutePaths("home"),
    title: siteName,
    description: translate("metaDescription"),
  });

  // `absolute` rather than a bare string: the layout's title template would
  // otherwise render the site name twice, as "Detske skupinky | Detske
  // skupinky".
  return { ...metadata, title: { absolute: siteName } };
}

/**
 * The site's `WebSite` entry, with the catalog search as its `SearchAction`.
 *
 * Split out so the country lookup it needs sits below a Suspense boundary
 * rather than holding up the page shell - the JSON-LD is for crawlers, and
 * nothing visible depends on it.
 */
const HomeJsonLd = async ({ locale }: { locale: string }) => {
  const [{ siteName, translate }, countrySlug] = await Promise.all([
    siteContext(locale),
    fetchSearchCountrySlug(locale),
  ]);

  return (
    <JsonLd
      data={webSiteJsonLd({
        name: siteName,
        url: absoluteUrl(locale, getLocalizedRoutes(locale).home),
        description: translate("metaDescription"),
        // The catalog's search is `?name=` on a country page, so the template
        // is only publishable once we know which country the dataset has.
        searchUrl: countrySlug
          ? absoluteUrl(
              locale,
              getLocalizedRoutes(locale).catalogs(countrySlug),
            )
          : undefined,
      })}
    />
  );
};

const Page = async ({ params }: PageProps) => {
  const queryParams = await params;
  setRequestLocale(queryParams.locale);
  const data = await fetchPageByType("home", queryParams.locale);

  return (
    <Box data-test-selector="home-page">
      <Suspense fallback={null}>
        <HomeJsonLd locale={queryParams.locale} />
      </Suspense>
      <Zone sections={data?.sections} types="all" {...queryParams} />
    </Box>
  );
};

export default Page;
