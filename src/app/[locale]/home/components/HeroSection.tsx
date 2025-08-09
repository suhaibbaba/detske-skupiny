"use client";

import React, { FC } from "react";
import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import PageLayout from "@/components/layout/PageLayout";
import PageHeadingTypography, {
  PageHeadingTypographyStyles,
} from "@/components/shared/PageHeadingTypography";
import IllustrationMain from "@/components/icons/IllustrationMain";
import { autoClamp, formatMessage } from "@/utilites/strings";
import {
  SanityCtaField,
  SanityImageField,
  SanityRichText,
} from "@/sanity/types";
import RichText from "@/sanity/components/RichText";

interface Props {
  fields: {
    image: SanityImageField;
    title?: SanityRichText;
    ctas: SanityCtaField[];
    description: SanityRichText;
  };
}

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

const HeroSection: FC<Props> = ({ fields }: Props) => {
  return (
    <PageLayout
      contentFullWidth={false}
      showBreadcrumb={false}
      sectionStyles={styles.section}
    >
      <Box {...styles.contentWrapper}>
        <PageHeadingTypography
          title={<RichText>{fields.title}</RichText>}
          description={<RichText>{fields.description}</RichText>}
          ctaList={fields.ctas}
          extendedStyles={styles.pageHeadingStyles}
        />
        <Box sx={{ maxWidth: 404, maxHeight: 460 }}>
          <Box component="img" src={fields.image.asset?.url} />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default HeroSection;
