import { Alert, Box, BoxProps, Container, ContainerProps } from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import FilterSidebar from "@/app/catalog/[...slug]/components/FilterSidebar";
import { PageProps } from "@/types";
import { getTranslateServer } from "@/hooks/useTranslate";
import {
  getSelectedSlug,
  parseCatalogSlug,
} from "@/app/catalog/[...slug]/utilites/catalog";
import { fetchFilters } from "@/sanity/queries";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import SchoolsCount from "@/app/catalog/[...slug]/components/SchoolCount";
import SchoolGridCard from "@/app/catalog/[...slug]/components/SchoolGridCard";
import { fetchSchoolByFilter } from "@/sanity/queries/school-list";
import { toArray } from "@/sanity/utilites/helper";

type Props = PageProps<{ slug: string[] }>;

interface GroupsPageStyles {
  pageLayout?: PageLayoutStyles;
  pageContainer?: BoxProps;
  container?: ContainerProps;
  contentWrapper?: BoxProps;
  cardGrid?: BoxProps;
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
  contentWrapper: {
    sx: {
      display: "flex",
      flexDirection: "column",
      gap: "26px",
      mt: {
        xs: "44px",
        sm: "0",
      },
    },
  },
  cardGrid: {
    sx: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 278px))",
      gap: "26px",
    },
  },
};

const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const {
    types: typesQuery,
    tags: tagsQuery,
    name,
  } = (await searchParams) as {
    types?: string[];
    tags?: string[];
    name?: string;
  };

  const types = toArray(typesQuery);
  const tags = toArray(tagsQuery);

  const translate = await getTranslateServer();
  const catalog = parseCatalogSlug(slug);
  const selectedSlug = getSelectedSlug(catalog);

  if (!catalog || !catalog.country) {
    return null;
  }

  const filterContent = await fetchFilters(catalog);
  const { pageHero, schools, totalSchools } = await fetchSchoolByFilter({
    country: catalog.country!,
    region: catalog.region,
    area: catalog.area,
    subarea: catalog.subarea,
    types,
    tags,
    search: name,
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
        <Box {...styles.contentWrapper}>
          <SchoolsCount
            filterTotal={schools?.length || 0}
            total={totalSchools}
          />
          <Box {...styles.cardGrid}>
            {schools && schools.length > 0 ? (
              <>
                {schools.map((school, i) => (
                  <SchoolGridCard key={school.id} school={school} />
                ))}
              </>
            ) : (
              <Alert severity="info" sx={{ maxWidth: 600 }}>
                {translate("noSchoolsFound")}
              </Alert>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
