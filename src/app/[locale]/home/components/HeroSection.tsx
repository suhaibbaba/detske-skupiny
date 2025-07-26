"use client";

import React, { FC } from "react";
import PageLayout from "@/components/layout/PageLayout";
import {
  Box,
  BoxProps,
  Container,
  Typography,
  TypographyProps,
} from "@mui/material";
import PageHeadingTypography, {
  PageHeadingTypographyStyles,
} from "@/components/shared/PageHeadingTypography";
import { autoClamp, formatMessage } from "@/utilites/strings";
import IllustrationMain from "@/components/icons/IllustrationMain";

interface Props {}

interface HeroSectionStyles {
  section?: BoxProps;
  pageHeadingStyles?: PageHeadingTypographyStyles;
  subtitle?: TypographyProps;
}

const styles: HeroSectionStyles = {
  section: {
    bgcolor: "secondary.main",
    sx: {
      pt: "60px",
      pb: "120px",
    },
  },
  pageHeadingStyles: {
    container: {
      sx: {
        maxWidth: "489px",
        alignItems: "flex-start",
      },
    },
    title: {
      sx: (theme) => ({
        fontSize: autoClamp({
          desktop: 44,
          tablet: 40,
          mobile: 36,
          theme: theme,
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

const HeroSection: FC<Props> = ({}) => {
  const onClickHandler = () => {};

  return (
    <PageLayout
      contentFullWidth={false}
      showBreadcrumb={false}
      sectionStyles={styles.section}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
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
          description={
            "Hundreds of childcare groups are already reaching local families through our platform. Add your listing today to be seen, contacted, and trusted by parents near you."
          }
          ctaList={[
            {
              label: "Kinder Prague",
              variant: "primary",
            },
            {
              label: "Kindr Brno",
              variant: "secondary",
            },
            {
              label: "All Kinder",
              variant: "ghost",
            },
          ]}
          extendedStyles={styles.pageHeadingStyles}
        />
        <Box sx={{ maxWidth: "404px", maxHeight: "460px" }}>
          <IllustrationMain />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default HeroSection;
