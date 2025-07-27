"use client";

import { FC } from "react";
import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import PageLayout from "@/components/layout/PageLayout";
import PageHeadingTypography, {
  PageHeadingTypographyStyles,
} from "@/components/shared/PageHeadingTypography";
import IllustrationMain from "@/components/icons/IllustrationMain";
import { autoClamp, formatMessage } from "@/utilites/strings";

interface Props {}

interface HeroSectionStyles {
  section?: BoxProps;
  contentWrapper?: BoxProps;
  pageHeadingStyles?: PageHeadingTypographyStyles;
  subtitle?: TypographyProps;
}

const styles: HeroSectionStyles = {
  section: {
    bgcolor: "secondary.main",
    sx: {
      pt: "60px",
      pb: {
        xs: "75px",
        sm: "120px",
      },
    },
  },
  contentWrapper: {
    sx: {
      display: "flex",
      flexDirection: {
        xs: "column",
        sm: "row",
      },
      alignItems: "center",
      justifyContent: "space-between",
      gap: 3,
    },
  },
  pageHeadingStyles: {
    container: {
      sx: {
        maxWidth: {
          xs: "100%",
          md: "489px",
        },
        alignItems: "flex-start",
      },
    },
    title: {
      sx: (theme) => ({
        fontSize: autoClamp({
          desktop: 44,
          tablet: 40,
          mobile: 36,
          theme,
        }),
        textAlign: "left",
      }),
    },
    description: {
      sx: {
        textAlign: "left",
      },
    },
  },
  subtitle: {
    variant: "inherit",
    component: "span",
  },
};

const HeroSection: FC<Props> = () => {
  return (
    <PageLayout
      contentFullWidth={false}
      showBreadcrumb={false}
      sectionStyles={styles.section}
    >
      <Box {...styles.contentWrapper}>
        <PageHeadingTypography
          title={formatMessage(
            "Your Guide to Private Kindergartens in {0}, {1} & Beyond",
            <Typography {...styles.subtitle} color="primary.main">
              Prague
            </Typography>,
            <Typography {...styles.subtitle} color="secondary.dark">
              Brno
            </Typography>,
          )}
          description="Hundreds of childcare groups are already reaching local families through our platform. Add your listing today to be seen, contacted, and trusted by parents near you."
          ctaList={[
            { label: "Kinder Prague", variant: "primary" },
            { label: "Kindr Brno", variant: "secondary" },
            { label: "All Kinder", variant: "ghost" },
          ]}
          extendedStyles={styles.pageHeadingStyles}
        />
        <Box sx={{ maxWidth: 404, maxHeight: 460 }}>
          <IllustrationMain />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default HeroSection;
