import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";
import { SanityCtaField, SanityImageField } from "@/types";

import { parseLinkField } from "@/components/ui/link/parser";
import Button from "@/components/ui/button";
import { sharedClassNames } from "@/features/home/utils";
import { getLocale } from "next-intl/server";
import Image from "@/components/ui/image";
import { custom } from "@/theme/custom";

interface Props {
  fields: {
    image?: SanityImageField;
    title: string;
    description: string;
    cta?: SanityCtaField;
  };
}

const styles = {
  section: {
    bgcolor: "common.white",
    py: {
      xs: "100px",
      md: "120px",
    },
  },
  container: {
    display: "flex",
    flexDirection: {
      xs: "column",
      md: "row",
    },
    alignItems: "center",
    justifyContent: "space-between",
    gap: "80px",
  },
  textBlock: {
    flex: 1,
    maxWidth: "467px",
  },
  heading: {
    mb: "12px",
  },
  description: {
    mb: "24px",
    textAlign: {
      xs: "center",
      md: "left",
    },
  },
  imageWrapper: {
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: custom.shadows.card,
    bgcolor: "var(--mui-palette-common-white)",
    p: "20px 24px",
  },
} satisfies Record<string, SxProps<Theme>>;

const InfoBlock = async ({ fields }: Props) => {
  const locale = await getLocale();
  const link = parseLinkField(fields.cta?.link, { locale });

  return (
    <Box sx={styles.section} className={sharedClassNames.infoBlock}>
      <Container sx={styles.container}>
        <Box sx={styles.textBlock}>
          <Typography sx={styles.heading} component="h1" variant="h1">
            {fields.title}
          </Typography>
          <Typography sx={styles.description}>{fields.description}</Typography>
          {fields.cta && (
            <Button variant={fields.cta.variant} href={link.url}>
              {link.text}
            </Button>
          )}
        </Box>

        <Box sx={styles.imageWrapper}>
          <Image
            src={fields.image}
            alt={fields.title}
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default InfoBlock;
