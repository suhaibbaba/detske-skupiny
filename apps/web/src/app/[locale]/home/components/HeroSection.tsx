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
import Image from "@/components/ui/image";

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
      sx: {
        bgcolor: "secondary.main",
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
      sx: {
        fontSize: autoClamp({
          desktop: 44,
          tablet: 40,
          mobile: 36,
        }),
        textAlign: "left",
        span: {
          fontWeight: "inherit",
        },
      },
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
          title={fields?.title}
          description={fields?.description}
          ctaList={fields?.ctas}
          extendedStyles={styles.pageHeadingStyles}
        />
        <Box {...styles.imageWrapper}>
          {/*
           * The hero image is the home page's LCP element. `priority` drops
           * the lazy attribute and adds a preload, so it starts downloading
           * with the HTML rather than after the layout settles - and the
           * width/height `<Image>` derives from the asset means it no longer
           * reserves zero space and then shoves the page down on arrival.
           */}
          <Image
            src={fields.image}
            alt=""
            priority
            sizes="(max-width: 900px) 100vw, 404px"
          />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default HeroSection;
