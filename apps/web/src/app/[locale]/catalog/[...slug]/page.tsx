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
import { fetchBlogBySlug, fetchFilters } from "@/sanity/queries";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import {
  fetchSchoolByFilter,
  fetchSchoolPage,
} from "@/sanity/queries/school-list";
import { toArray } from "@/sanity/utilites/helper";
import { Suspense } from "react";
import SchoolListClient from "@/app/[locale]/catalog/[...slug]/components/SchoolListClient";
import { CatalogParams } from "@/app/[locale]/catalog/[...slug]/utilites/catalog";
import { Props as FilterSidebarProps } from "@/app/[locale]/catalog/[...slug]/components/Filters/FilterSidebar";
import { Metadata } from "next";
import { getTranslateServer } from "@/hooks/useTranslate";
import { fetchBreadcrumbList } from "@/sanity/queries/breadcrumb";

type Props = PageProps<{ slug: string[] }>;
const PAGE_SIZE = 9;

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
  const translate = await getTranslateServer();
  const { slug } = await params;

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

const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const {
    categories: categoriesQuery,
    tags: tagsQuery,
    name: searchName,
  } = (await searchParams) as {
    categories?: string[];
    tags?: string[];
    name?: string;
  };

  const categories = toArray(categoriesQuery);
  const tags = toArray(tagsQuery);

  const catalog = parseCatalogSlug(slug);
  const selectedSlug = getSelectedSlug(catalog);

  if (!catalog || !catalog.country) {
    return null;
  }

  const [filterContent, { pageHero, totalSchools }] = await Promise.all([
    fetchFilters(catalog),
    fetchSchoolPage({
      country: catalog.country!,
      region: catalog.region,
    }),
  ]);

  const schoolsDataPromise = fetchSchoolByFilter({
    country: catalog.country,
    region: catalog.region,
    area: catalog.area,
    subarea: catalog.subarea,
    categories,
    tags,
    search: searchName,
    start: 0,
    end: PAGE_SIZE,
  });

  const filterProps = { catalog, selectedSlug, filterContent };
  const initialFilters = { catalog, categories, tags, searchName };
  return (
    <Box {...styles.pageContainer}>
      <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
        <PageHeadingTypography
          title={pageHero?.title}
          description={pageHero?.description}
          ctaList={pageHero?.ctas}
        />
      </PageLayout>
      <Container {...styles.container}>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <FilterSidebar
            catalog={catalog}
            selectedSlug={selectedSlug}
            filterContent={filterContent}
          />
        </Box>
        <Suspense
          fallback={
            <Box {...styles.loadingBox}>
              <CircularProgress />
            </Box>
          }
        >
          <SchoolListAsync
            schoolsDataPromise={schoolsDataPromise}
            totalSchools={totalSchools}
            initialFilters={initialFilters}
            pageSize={PAGE_SIZE}
            filterProps={filterProps}
          />
        </Suspense>
      </Container>
    </Box>
  );
};

// New component to unwrap the promise
const SchoolListAsync = async ({
  schoolsDataPromise,
  totalSchools,
  initialFilters,
  pageSize,
  filterProps,
}: {
  schoolsDataPromise: ReturnType<typeof fetchSchoolByFilter>;
  totalSchools: number;
  pageSize: number;
  initialFilters: {
    categories: string[];
    tags: string[];
    searchName?: string;
    catalog: CatalogParams;
  };
  filterProps: FilterSidebarProps;
}) => {
  const schoolsDataView = await schoolsDataPromise;

  return (
    <SchoolListClient
      initialSchools={schoolsDataView.schools ?? []}
      initialMarkers={schoolsDataView.markers ?? []}
      initialTotalSelected={schoolsDataView.totalSelectedSchools}
      totalSchools={totalSchools}
      initialFilters={initialFilters}
      pageSize={pageSize}
      filterProps={filterProps}
    />
  );
};

export default Page;
