import { Alert, Box, BoxProps, Container, ContainerProps } from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import FilterSidebar from "@/app/[locale]/catalog/[region]/components/FilterSidebar";
import { fetchSchoolByFilter } from "@/sanity/queries/school-list";
import { PageProps } from "@/types";
import { toOptionalArray } from "@/utilites/strings";
import { SchoolFilterQueryType } from "@/hooks/useRegionFilters";
import SchoolGridCard from "@/app/[locale]/catalog/[region]/components/SchoolGridCard";
import SchoolsCount from "@/app/[locale]/catalog/[region]/components/SchoolCount";
import { getTranslateServer } from "@/hooks/useTranslate";

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

const Page = async ({
  params,
  searchParams,
}: PageProps<{ region: string }>) => {
  const { locale, region: regionSlug } = await params;
  const { area, tag, type } = (await searchParams) as SchoolFilterQueryType;

  const { pageHero, schools, totalSchools } = await fetchSchoolByFilter({
    locale,
    areas: toOptionalArray(area),
    tags: toOptionalArray(tag),
    types: toOptionalArray(type),
    regionSlug,
  });

  const translate = await getTranslateServer(locale);

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
        <FilterSidebar locale={locale} regionSlug={regionSlug} />
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
              <>
                <Alert severity="info" sx={{ maxWidth: 600 }}>
                  {translate("noSchoolsFound")}
                </Alert>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
