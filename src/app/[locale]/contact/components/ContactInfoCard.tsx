import React from "react";
import {
  Box,
  Typography,
  TypographyOwnProps,
  BoxProps,
  SvgIconProps,
  TypographyProps,
} from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";
import { SanityImageField, SanityRichTextField } from "@/sanity/types";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import RichText from "@/sanity/components/RichText";

interface Props {
  image?: SanityImageField;
  title: string;
  description?: SanityRichTextField;
}

interface ContactInfoCardStyles {
  container?: BoxProps;
  iconBox?: BoxProps;
  icon?: SvgIconProps;
  title?: TypographyOwnProps;
  description?: TypographyProps;
}

const styles: ContactInfoCardStyles = {
  container: {
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: "328px",
    },
  },
  iconBox: {
    sx: {
      bgcolor: "secondary.main",
      display: "flex",
      alignSelf: "baseline",
      justifyContent: "center",
      borderRadius: "50%",
      p: "14px",
      mb: 1,
      mx: "auto",
    },
  },
  icon: {
    sx: {
      color: "secondary.dark",
      fontSize: "36px",
    },
  },
  title: {
    variant: "h3",
    mb: 0.5,
  },
  description: {
    sx: {
      textAlign: "center",
      "& p": {
        m: 0,
      },
    },
  },
};

const ContactInfoCard: React.FC<Props> = ({ image, title, description }) => {
  return (
    <Box {...styles.container}>
      {image && <Box component="img" src={urlImageFor(image)} />}
      <Typography {...styles.title}>{title}</Typography>
      {description && (
        <RichText {...styles.description}>{description}</RichText>
      )}
    </Box>
  );
};

export default ContactInfoCard;
