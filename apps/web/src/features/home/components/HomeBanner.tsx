import { Box, Container, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SanityCtaField, SanityImageField } from "@/types";
import { urlImageFor } from "@/lib/sanity/imageUrl";
import React from "react";
import { parseLinkField } from "@/components/ui/link/parser";
import Button from "@/components/ui/button";
import { getLocale } from "next-intl/server";
import type { SxProps, Theme } from "@mui/material/styles";

interface Props {
  fields: {
    title?: string;
    description?: string;
    background?: SanityImageField;
    cta?: SanityCtaField;
  };
}
/** The background is content, so this one is a function of the row. */
const sectionSx = (imageUrl: string): SxProps<Theme> => ({
  backgroundImage: `linear-gradient(0deg, rgba(250,243,192,0.8), rgba(250,243,192,0.8)), url("${imageUrl}")`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  textAlign: "center",
  py: { xs: "50px", md: "96px" },
});

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "36px",
    mb: "16px",
  },
  description: {
    mb: "32px",
  },
  button: {
    mt: "32px",
    "& .MuiButton-startIcon": {
      marginRight: "8px",
    },
  },
} satisfies Record<string, SxProps<Theme>>;

const HomeBanner = async ({ fields }: Props) => {
  const locale = await getLocale();
  const link = parseLinkField(fields.cta?.link, { locale });

  return (
    <Box
      sx={sectionSx(urlImageFor(fields.background))}
      data-test-selector="HomeBanner"
    >
      <Container sx={styles.container}>
        <Typography sx={styles.title} variant="h1">
          {fields.title}
        </Typography>
        <Typography sx={styles.description}>{fields.description}</Typography>
        {fields.cta && (
          <Button
            sx={styles.button}
            startIcon={<AddIcon />}
            variant={fields.cta.variant}
            href={link.url}
          >
            {link.text}
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default HomeBanner;
