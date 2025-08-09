"use client";

import React from "react";
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import {
  SanityCtaField,
  SanityImageField,
  SanityRichText,
} from "@/sanity/types";

interface Props {
  fields: {
    image: SanityImageField;
    title?: SanityRichText;
    description: SanityRichText;
    cta: SanityCtaField;
  };
}

interface KinderGroupCardStyles {
  container?: BoxProps;
  imageWrapper?: BoxProps;
  image?: BoxProps;
  infoContainer?: BoxProps;
  title?: TypographyProps;
  description?: TypographyProps;
  cta?: ButtonProps;
}

const styles: KinderGroupCardStyles = {
  container: {
    sx: (theme) => ({
      display: "flex",
      maxWidth: "628px",
      borderRadius: "24px",
      border: `1px solid ${theme.palette.custom.ui18}`,
      bgcolor: theme.palette.common.white,
      boxShadow: theme.palette.shadows.ui1,
      flexDirection: {
        xs: "column",
        lg: "row",
      },
    }),
  },
  imageWrapper: {
    maxWidth: {
      xs: "100%",
      lg: "260px",
    },
    flexShrink: 0,
    maxHeight: "277px",
  },
  image: {
    sx: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderTopLeftRadius: "24px",
      borderTopRightRadius: {
        xs: "24px",
        lg: 0,
      },
      borderBottomLeftRadius: {
        xs: "8px",
        lg: "24px",
      },
      borderBottomRightRadius: {
        xs: "8px",
        lg: 0,
      },
    },
  },
  infoContainer: {
    sx: (theme) => ({
      display: "flex",
      flexDirection: "column",
      gap: "13px",
      py: "20px",
      paddingLeft: "16px",
      paddingRight: {
        xs: "16px",
        lg: "20px",
      },
    }),
  },
  title: {
    sx: (theme) => ({
      textAlign: "left",
      color: theme.palette.custom.ui13,
      fontSize: "20px",
      fontWeight: 600,
    }),
  },
  description: {
    textAlign: "left",
  },
  cta: {
    variant: "ghost",
    sx: {
      mt: "7px",
      alignSelf: "baseline",
    },
  },
};

const KinderGroupCard = ({ fields }: Props) => {
  return (
    <Box {...styles.container}>
      <Box {...styles.imageWrapper}>
        <Box component="img" src={fields.image.asset?.url} {...styles.image} />
      </Box>
      <Box {...styles.infoContainer}>
        <Typography {...styles.title}>
          Malvína Preschool – Prague Karlín
        </Typography>
        <Typography sx={{ textAlign: "left" }}>
          A bilingual kindergarten and primary school that blends Czech and
          English learning in a warm, creative environment. Learning is fun,
          age-appropriate, and always child-centered.
        </Typography>
        <Button {...styles.cta}>View this School</Button>
      </Box>
    </Box>
  );
};

export default KinderGroupCard;
