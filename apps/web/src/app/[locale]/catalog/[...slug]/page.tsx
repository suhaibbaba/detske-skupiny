import {
  Box,
  BoxProps,
  CircularProgress,
  Container,
  ContainerProps,
} from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import FilterSidebar from "@/app/[locale]/catalog/[...slug]/components/Filters/FilterSidebar";
import { PageProps } from "@/types";
import {
  getSelectedSlug,
  parseCatalogSlug,
} from "@/app/[locale]/catalog/[...slug]/utilites/catalog";
import { fetchFilters } from "@/sanity/queries";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import {
  fetchSchoolList,
  fetchSchoolMarkers,
  fetchSchoolPage,
} from "@/sanity/queries/school-list";
import { Suspense } from "react";
import SchoolList from "@/app/[locale]/catalog/[...slug]/components/SchoolList";
import { CatalogTransitionProvider } from "@/app/[locale]/catalog/[...slug]/components/CatalogTransition";
import {
  PAGE_SIZE,
  loadCatalogSearchParams,
  parseCatalogFilters,
  type LoadMoreInput,
} from "@/app/[locale]/catalog/[...slug]/searchParams";
import { Props as FilterSidebarProps } from "@/app/[locale]/catalog/[...slug]/components/Filters/FilterSidebar";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslateServer } from "@/hooks/useTranslate";
import { getLocalizedRoutes } from "@/routes";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { documentPaths } from "@/lib/seo/routes";
import { fetchCatalogNode } from "@/sanity/queries/seo";

type Props = PageProps<
  { slug: string[] },
  Record<string, string | string[] | undefined>
>;

interface GroupsPageStyles {
  pageLayout?: PageLayoutStyles;
  pageContainer?: BoxProps;
  container?: ContainerProps;
  loadingBox?: BoxProps;
}

const styles: GroupsPageStyles = {
  pageLayout: {
    section: {
      sx: {
        background: "var(--mui-palette-gradients-ui3)",
      },
    },
  },
  pageContainer: {
    sx: {
      pb: {
        xs: "100px",
        sm: "164px",
      },
    },
  },
  container: {
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "300px 1fr",
      },
      columnGap: "60px",
      mt: { xs: "40px", md: "80px" },
    },
  },
  loadingBox: {
    sx: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      py: 4,
    },
  },
};

/**
 * The catalog's metadata, with one canonical per location.
 *
 * `searchParams` is not read: the filters, the search term and the page number
 * are all query state over the same set of schools, so `/katalog/praha`,
 * `/katalog/praha?categories=x` and `/katalog/praha?page=3` are one page as far
 * as a search engine is concerned. Every one of them names the bare location
 * URL as its canonical, which is what stops a combinatorial explosion of
 * filter permutations from being indexed as separate near-duplicates.
 *
 * The location itself comes from the path, and `fetchCatalogNode` resolves it
 * to the geography document behind it - which is also where the counterpart
 * locale's path comes from, since an area's English URL is a different chain
 * of slugs, not a translation of this one.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Metadata is a pure function of the route and the published content, so it
  // is cached rather than computed per request - without this, Cache
  // Components treats the Sanity reads below as runtime data and refuses to
  // prerender the route's head. Same reason as the layout's.
  "use cache";
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const translate = await getTranslateServer();

  const catalog = parseCatalogSlug(slug);
  const leaf = slug[slug.length - 1];
  const node =
    catalog && leaf
      ? await fetchCatalogNode({ level: catalog.level, slug: leaf, locale })
      : null;

  // The canonical is always this URL's own path, never the node's recomposed
  // one - a page has to name the address it was reached at.
  const paths = documentPaths(
    locale,
    slug.join("/"),
    node?.translations,
    (target, path) => getLocalizedRoutes(target).catalogs(path),
  );

  if (!node?.name) {
    return buildPageMetadata({
      locale,
      paths,
      title: translate("catalog"),
      description: translate("catalogMetaDescription"),
    });
  }

  return buildPageMetadata({
    locale,
    paths,
    title: node.name,
    description: translate("catalogLocationMetaDescription", {
      location: node.name,
    }),
  });
}

/**
 * Owns every piece of catalog data.
 *
 * The filters arrive as a query string, are validated here, and drive the
 * queries. Nothing downstream fetches: the list is a presentational Client
 * Component, so a filter change produces exactly one server render and no
 * follow-up request from the browser.
 *
 * `params` and `searchParams` are both dynamic reads, which is why this sits
 * below the Suspense boundary in `Page`.
 */
const CatalogContent = async ({ params, searchParams }: Props) => {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  // Parsed with the same nuqs parsers the controls write with, then validated
  // and normalised - a hand-edited query string reaches GROQ otherwise.
  const raw = loadCatalogSearchParams((await searchParams) ?? {});
  const { categories, tags, name, page } = parseCatalogFilters(raw);

  const catalog = parseCatalogSlug(slug);

  if (!catalog || !catalog.country) {
    notFound();
  }

  const selectedSlug = getSelectedSlug(catalog);
  const scope = {
    country: catalog.country!,
    region: catalog.region,
    area: catalog.area,
    subarea: catalog.subarea,
    locale,
  };

  const [filterContent, { pageHero, totalSchools }] = await Promise.all([
    fetchFilters(catalog, locale),
    fetchSchoolPage({
      country: catalog.country!,
      region: catalog.region,
      locale,
    }),
  ]);

  // A deep link to ?page=N renders pages 1..N in one query, so a reload or a
  // shared URL restores the whole list rather than a lone page N with nothing
  // above it. That is why the range starts at 0.
  const listPromise = fetchSchoolList({
    ...scope,
    categories,
    tags,
    search: name || undefined,
    start: 0,
    end: page * PAGE_SIZE,
  });

  // Markers do not depend on the list filters (see fetchSchoolMarkers), so
  // this entry is shared by every filter combination in this geo scope.
  const markersPromise = fetchSchoolMarkers(scope);

  const filterProps = { catalog, selectedSlug, filterContent };

  return (
    <Box {...styles.pageContainer}>
      <PageLayout
        contentFullWidth={false}
        extendedStyles={styles.pageLayout}
        pathname={getLocalizedRoutes(locale).catalogs(slug.join("/"))}
      >
        <PageHeadingTypography
          title={pageHero?.title}
          description={pageHero?.description}
          ctaList={pageHero?.ctas}
        />
      </PageLayout>
      <CatalogTransitionProvider>
        <Container {...styles.container}>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <FilterSidebar
              catalog={catalog}
              selectedSlug={selectedSlug}
              filterContent={filterContent}
            />
          </Box>
          {/* The hero and the filters stream immediately; only the list waits. */}
          <Suspense
            fallback={
              <Box {...styles.loadingBox}>
                <CircularProgress />
              </Box>
            }
          >
            <SchoolListAsync
              listPromise={listPromise}
              markersPromise={markersPromise}
              totalSchools={totalSchools}
              scope={scope}
              filters={{ categories, tags, name }}
              page={page}
              filterProps={filterProps}
            />
          </Suspense>
        </Container>
      </CatalogTransitionProvider>
    </Box>
  );
};

const SchoolListAsync = async ({
  listPromise,
  markersPromise,
  totalSchools,
  scope,
  filters,
  page,
  filterProps,
}: {
  listPromise: ReturnType<typeof fetchSchoolList>;
  markersPromise: ReturnType<typeof fetchSchoolMarkers>;
  totalSchools: number;
  scope: Omit<LoadMoreInput, "page" | "categories" | "tags" | "name">;
  filters: { categories: string[]; tags: string[]; name: string };
  page: number;
  filterProps: FilterSidebarProps;
}) => {
  const [list, markers] = await Promise.all([listPromise, markersPromise]);
  const schools = list.schools ?? [];

  return (
    <SchoolList
      // Remounts when the filters change, which drops any pages the action
      // appended - they belong to the previous result set.
      key={JSON.stringify(filters)}
      schools={schools}
      markers={markers ?? []}
      totalSelectedSchools={list.totalSelectedSchools}
      totalSchools={totalSchools}
      loadMoreScope={{ ...scope, ...filters }}
      initialPage={page}
      // Compared against the range rendered, not the cards returned: see the
      // same reasoning in the load-more action.
      hasMore={page * PAGE_SIZE < list.totalSelectedSchools}
      filterProps={filterProps}
    />
  );
};

const Page = (props: Props) => (
  <Suspense fallback={null}>
    <CatalogContent {...props} />
  </Suspense>
);

export default Page;
