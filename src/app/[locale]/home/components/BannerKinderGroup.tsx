import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
  Button,
  ButtonProps,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  SanityCtaField,
  SanityImageField,
  SanityRichTextField,
} from "@/sanity/types";
import RichText from "@/sanity/components/RichText";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import React from "react";

interface Props {
  fields: {
    title?: string;
    description?: string;
    background?: SanityImageField;
    cta?: SanityCtaField;
  };
}
interface BannerKinderGroupStyles {
  section?: (imageUrl: string) => BoxProps;
  container?: ContainerProps;
  title?: TypographyProps;
  description?: TypographyProps;
  button?: ButtonProps;
}

const styles: BannerKinderGroupStyles = {
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

const BannerKinderGroup = ({ fields }: Props) => {
  return (
    <Box
      {...styles.section?.(urlImageFor(fields.background))}
      data-test-selector="BannerKinderGroup"
    >
      <Container {...styles.container}>
        <Typography {...styles.title}>{fields.title}</Typography>
        <Typography {...styles.description}>{fields.description}</Typography>
        {fields.cta && (
          <Button
            {...styles.button}
            variant={fields.cta.variant}
            href={fields.cta.url}
          >
            {fields.cta.text}
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default BannerKinderGroup;
