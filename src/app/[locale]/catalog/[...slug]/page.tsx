import { Box, BoxProps, Container, ContainerProps } from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import FilterSidebar from "@/app/[locale]/catalog/[...slug]/components/FilterSidebar";
import { PageProps } from "@/types";
import {
  getSelectedSlug,
  parseCatalogSlug,
} from "@/app/[locale]/catalog/[...slug]/utilites/catalog";
import { fetchFilters } from "@/sanity/queries";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import { fetchSchoolPage } from "@/sanity/queries/school-list";
import { toArray } from "@/sanity/utilites/helper";
import SchoolList from "@/app/[locale]/catalog/[...slug]/components/SchoolList";

type Props = PageProps<{ slug: string[] }>;

interface GroupsPageStyles {
  pageLayout?: PageLayoutStyles;
  pageContainer?: BoxProps;
  container?: ContainerProps;
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
        sm: "300px 1fr",
      },
      columnGap: "60px",
      mt: "80px",
    },
  },
};

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

  const filterContent = await fetchFilters(catalog);
  const { pageHero, totalSchools } = await fetchSchoolPage({
    country: catalog.country!,
    region: catalog.region,
  });

  return (
    <Box {...styles.pageContainer}>
      <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
        <PageHeadingTypography
          title={pageHero.title}
          description={pageHero.description}
          ctaList={pageHero.ctas}
        />
      </PageLayout>
      <Container {...styles.container}>
        <FilterSidebar
          catalog={catalog}
          selectedSlug={selectedSlug}
          filterContent={filterContent}
        />
        <SchoolList
          totalSchools={totalSchools}
          initialFilters={{
            catalog,
            categories,
            tags,
            searchName,
          }}
        />
      </Container>
    </Box>
  );
};

export default Page;
