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
import { fetchBreadcrumbList } from "@/sanity/queries/breadcrumb";
import { getLocalizedRoutes } from "@/routes";
import { setRequestLocale } from "next-intl/server";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const translate = await getTranslateServer();

  const lastSegment = slug[slug.length - 1];
  if (!lastSegment) {
    return {
      title: translate("catalog"),
      description: translate("catalogMetaDescription"),
    };
  }
  const pages = await fetchBreadcrumbList({ slugs: [lastSegment] });
  return {
    title: pages.length > 0 ? pages[0].name : translate("catalog"),
    description:
      pages.length > 0
        ? translate("catalogLocationMetaDescription", {
            location: pages[0].name,
          })
        : translate("catalogMetaDescription"),
  };
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
