import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import FilterSidebar from "@/app/[locale]/catalog/[region]/components/FilterSidebar";
import SearchBar from "@/app/[locale]/catalog/[region]/components/SearchBar";
import { fetchSchoolByFilter } from "@/sanity/queries/school-list";
import { PageProps } from "@/types";
import { SchoolFilterQueryParams } from "@/sanity/types";
import { toOptionalArray } from "@/utilites/strings";
import { SchoolFilterQueryType } from "@/hooks/useRegionFilters";
import SchoolCard from "@/app/[locale]/home/components/SchoolCard";
import SchoolGridCard from "@/app/[locale]/catalog/[region]/components/SchoolGridCard";

interface GroupsPageStyles {
  pageLayout?: PageLayoutStyles;
  pageContainer?: BoxProps;
  container?: ContainerProps;
  contentWrapper?: BoxProps;
  resultsHeader?: BoxProps;
  resultText?: TypographyProps;
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
  resultsHeader: {
    sx: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "24px",
      width: "100%",
    },
  },
  resultText: {
    sx: {
      fontSize: "28px",
      fontWeight: 600,
      color: "custom.ui13",
    },
  },
  cardGrid: {
    sx: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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

  console.log({ area });
  const { pageHero, schools } = await fetchSchoolByFilter({
    locale,
    areas: toOptionalArray(area),
    tags: toOptionalArray(tag),
    types: toOptionalArray(type),
    regionSlug,
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
        <FilterSidebar locale={locale} regionSlug={regionSlug} />
        <Box {...styles.contentWrapper}>
          <Box {...styles.resultsHeader}>
            <Typography {...styles.resultText}>
              Showing 10 of 15 Results
            </Typography>
            <SearchBar />
          </Box>
          <Box {...styles.cardGrid}>
            {schools?.map((school, i) => (
              <SchoolGridCard key={school.id} school={school} />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
