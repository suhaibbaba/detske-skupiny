import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Container } from "@mui/material";
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

const styles = {
  container: {
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
} satisfies Record<string, SxProps<Theme>>;

const ListOfSchools: FC<Props> = async ({ fields, locale }) => {
  const { schools } = await fetchMiniSchools({
    numberOfSchools: 20,
    locale,
  });

  return (
    <Box sx={styles.container} data-test-selector="ListOfSchools">
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
