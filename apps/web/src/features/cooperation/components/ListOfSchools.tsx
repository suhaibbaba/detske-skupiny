import { Box, BoxProps, Container } from "@mui/material";
import PageHeadingTypography from "@/components/ui/PageHeadingTypography";
import { SanityCtaField } from "@/types";
import { FC } from "react";
import { fetchMiniSchools } from "@/features/school/queries";
import SchoolsCarousel from "@/features/cooperation/components/SchoolsCarousel";

interface Props {
  fields: {
    title: string;
    subtitle: string;
    cta: SanityCtaField;
  };
  /** Supplied by Zone, which spreads the page's route params onto sections. */
  locale: string;
}

interface ListOfSchoolsStyles {
  container?: BoxProps;
  headingContainer?: BoxProps;
}

const styles: ListOfSchoolsStyles = {
  container: {
    sx: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "54px",
      pt: {
        md: "20px",
      },
      pb: {
        xs: "40px",
        md: "80px",
      },
    },
  },
};

const ListOfSchools: FC<Props> = async ({ fields, locale }) => {
  const { schools } = await fetchMiniSchools({
    numberOfSchools: 20,
    locale,
  });

  return (
    <Box {...styles.container} data-test-selector="ListOfSchools">
      <Container>
        <PageHeadingTypography
          title={fields?.title}
          description={fields?.subtitle}
          ctaList={fields.cta ? [fields.cta] : undefined}
        />
      </Container>
      <SchoolsCarousel schools={schools} locale={locale} />
    </Box>
  );
};

export default ListOfSchools;
