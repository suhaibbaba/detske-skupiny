import { Box, BoxProps, Container } from "@mui/material";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import { SanityCtaField } from "@/sanity/types";
import { FC } from "react";
import { fetchMiniSchools } from "@/sanity/queries";
import SchoolsCarousel from "@/app/[locale]/cooperation/components/SchoolsCarousel";

interface Props {
  fields: {
    title: string;
    subtitle: string;
    cta: SanityCtaField;
  };
  locale?: string;
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
        xs: "120px",
        sm: "20px",
      },
      pb: {
        xs: "100px",
        sm: "120px",
      },
    },
  },
};

const ListOfSchools: FC<Props> = async ({ fields, locale }) => {
  const { schools } = await fetchMiniSchools({
    numberOfSchools: 20,
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
