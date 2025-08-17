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
    background?: SanityImageField;
    title?: string;
    subtitle?: SanityRichTextField;
    cta?: SanityCtaField;
  };
}
interface BannerKinderGroupStyles {
  section?: BoxProps;
  container?: ContainerProps;
  title?: TypographyProps;
  description?: TypographyProps;
  button?: ButtonProps;
}

const styles: BannerKinderGroupStyles = {
  section: {
    sx: {
      backgroundImage:
        "linear-gradient(0deg, rgba(250, 243, 192, 0.8), rgba(250, 243, 192, 0.8)), url('/balloon-bg.jpg')",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      textAlign: "center",
      py: "96px",
    },
  },
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
      "& .MuiButton-startIcon": {
        marginRight: "8px",
      },
    },
    startIcon: <AddIcon />,
  },
};

const BannerKinderGroup = ({ fields }: Props) => {
  const bgUrl = React.useMemo(
    () => urlImageFor(fields.background) ?? "/balloon-bg.jpg",
    [fields.background],
  );

  return (
    <Box
      {...styles.section}
      sx={{
        ...styles.section?.sx,
        backgroundImage: `linear-gradient(0deg, rgba(250,243,192,0.8), rgba(250,243,192,0.8)), url("${bgUrl}")`,
      }}
    >
      <Container {...styles.container}>
        <Typography {...styles.title}>{fields.title}</Typography>
        <RichText {...styles.description}>{fields.subtitle}</RichText>
        <Button {...styles.button} variant={fields.cta?.variant}>
          {fields.cta?.text}
        </Button>
      </Container>
    </Box>
  );
};

export default BannerKinderGroup;
