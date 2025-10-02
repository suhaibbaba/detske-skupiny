import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
  ButtonProps,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SanityCtaField, SanityImageField } from "@/sanity/types";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import React from "react";
import { parseLinkField } from "@/components/ui/link/parser";
import Button from "@/components/ui/button";

interface Props {
  fields: {
    title?: string;
    description?: string;
    background?: SanityImageField;
    cta?: SanityCtaField;
  };
}
interface HomeBannerStyles {
  section?: (imageUrl: string) => BoxProps;
  container?: ContainerProps;
  title?: TypographyProps;
  description?: TypographyProps;
  button?: ButtonProps;
}

const styles: HomeBannerStyles = {
  section: (imageUrl: string) => ({
    sx: {
      backgroundImage: `linear-gradient(0deg, rgba(250,243,192,0.8), rgba(250,243,192,0.8)), url("${imageUrl}")`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      textAlign: "center",
      py: "96px",
    },
  }),
  container: {
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  title: {
    variant: "h1",
    fontSize: "36px",
    sx: {
      mb: "16px",
    },
  },
  description: {
    sx: {
      mb: "32px",
    },
  },
  button: {
    variant: "primary",
    sx: {
      mt: "32px",
      "& .MuiButton-startIcon": {
        marginRight: "8px",
      },
    },
    startIcon: <AddIcon />,
  },
};

const HomeBanner = ({ fields }: Props) => {
  const link = parseLinkField(fields.cta?.link);
  return (
    <Box
      {...styles.section?.(urlImageFor(fields.background))}
      data-test-selector="HomeBanner"
    >
      <Container {...styles.container}>
        <Typography {...styles.title}>{fields.title}</Typography>
        <Typography {...styles.description}>{fields.description}</Typography>
        {fields.cta && (
          <Button
            {...styles.button}
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
