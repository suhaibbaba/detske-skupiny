import React, { FC } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import PageLayout from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/ui/PageHeadingTypography";
import { autoClamp } from "@/utils/strings";
import { SanityCtaField, SanityImageField, SanityRichTextField } from "@/types";
import Image from "@/components/ui/image";

interface Props {
  fields: {
    image: SanityImageField;
    title?: SanityRichTextField;
    description?: string;
    ctas: SanityCtaField[];
  };
}

const styles = {
  pageLayout: {
    bgcolor: "secondary.main",
    pt: "60px",
    pb: { xs: "75px", sm: "120px" },
  },
  contentWrapper: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    alignItems: "center",
    justifyContent: "space-between",
    gap: 3,
  },
  imageWrapper: {
    maxWidth: 404,
    maxHeight: 460,
  },
} satisfies Record<string, SxProps<Theme>>;

/** The hero's overrides for the shared heading block, slot by slot. */
const headingSx = {
  container: {
    maxWidth: { xs: "100%", md: "540px" },
    alignItems: "flex-start",
  },
  title: {
    fontSize: autoClamp({ desktop: 44, tablet: 40, mobile: 36 }),
    textAlign: "left",
    span: { fontWeight: "inherit" },
  },
  description: { textAlign: "left" },
  cta: { p: "14px 26px" },
} satisfies Record<string, SxProps<Theme>>;

const HeroSection: FC<Props> = ({ fields }: Props) => {
  return (
    <PageLayout
      contentFullWidth={false}
      showBreadcrumb={false}
      sx={styles.pageLayout}
    >
      <Box sx={styles.contentWrapper}>
        <PageHeadingTypography
          title={fields?.title}
          description={fields?.description}
          ctaList={fields?.ctas}
          sx={headingSx}
        />
        <Box sx={styles.imageWrapper}>
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
