"use client";

import React, { FC } from "react";
import { Box, BoxProps, TypographyProps } from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography, {
  PageHeadingTypographyStyles,
} from "@/components/shared/PageHeadingTypography";
import { autoClamp } from "@/utilites/strings";
import {
  SanityCtaField,
  SanityImageField,
  SanityRichTextField,
} from "@/sanity/types";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";

interface Props {
  fields: {
    image: SanityImageField;
    title?: SanityRichTextField;
    description?: string;
    ctas: SanityCtaField[];
  };
}

interface HeroSectionStyles {
  pageLayout?: PageLayoutStyles;
  contentWrapper?: BoxProps;
  pageHeadingStyles?: PageHeadingTypographyStyles;
  subtitle?: TypographyProps;
  imageWrapper?: BoxProps;
}

const styles: HeroSectionStyles = {
  pageLayout: {
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
          md: "540px",
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
    cta: {
      sx: {
        p: "14px 26px",
      },
    },
  },
  subtitle: {
    variant: "inherit",
    component: "span",
  },
  imageWrapper: {
    sx: {
      maxWidth: 404,
      maxHeight: 460,
    },
  },
};

const HeroSection: FC<Props> = ({ fields }: Props) => {
  return (
    <PageLayout
      contentFullWidth={false}
      showBreadcrumb={false}
      extendedStyles={styles.pageLayout}
    >
      <Box {...styles.contentWrapper}>
        <PageHeadingTypography
          title={fields.title}
          description={fields.description}
          ctaList={fields.ctas}
          extendedStyles={styles.pageHeadingStyles}
        />
        <Box {...styles.imageWrapper}>
          <Box component="img" src={urlImageFor(fields.image)} />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default HeroSection;
