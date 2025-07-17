"use client";

import { Box, BoxProps, Container, TypographyOwnProps } from "@mui/material";
import useSafeTranslations from "@/hooks/useSafeTranslations";
import PageLayout from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/custom/PageHeadingTypography";
import data from "@/data/catalogue";
import EmblaCarousel from "@/components/custom/EmblaCarousel";
import PreschoolCard from "@/app/[locale]/catalogue/PreschoolCard";
import WhyJoinUs from "@/app/[locale]/catalogue/WhyJoinUs";
import PortalsOffered from "@/app/[locale]/catalogue/PortalsOffered";
import OurPricing from "@/app/[locale]/catalogue/OurPricing";

interface ContactUsStyles {
  section?: BoxProps;
  container?: BoxProps;
  innerContainer?: BoxProps;
  headingContainer?: BoxProps;
  title?: TypographyOwnProps;
}

const styles: ContactUsStyles = {
  section: {
    sx: (theme) => ({
      background: theme.palette.gradients.ui1,
      pt: 5,
      pb: 12.5,
    }),
  },
  container: {
    sx: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: {
        xs: "100px",
        sm: "120px",
      },
    },
  },
  innerContainer: {
    sx: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "54px",
    },
  },
};

const Page = () => {
  const translate = useSafeTranslations("CataloguePage");

  const addPreSchoolOnClick = () => {
    return;
  };

  return (
    <PageLayout fullWidth={false}>
      <Box {...styles.container}>
        <Box {...styles.innerContainer}>
          <Container>
            <PageHeadingTypography
              title={translate(data.heading)}
              description={translate(data.description)}
              ctaList={[
                {
                  label: translate(data.ctaLabel),
                  onClick: addPreSchoolOnClick,
                },
              ]}
            />
          </Container>
          <EmblaCarousel gap={24}>
            {data.perSchoolList.map((item) => (
              <PreschoolCard
                key={item.image}
                title={item.title}
                image={item.image}
                location={item.location}
              />
            ))}
          </EmblaCarousel>
        </Box>
        <Box>
          <WhyJoinUs />
          <PortalsOffered />
        </Box>
        <OurPricing />
      </Box>
    </PageLayout>
  );
};

export default Page;
