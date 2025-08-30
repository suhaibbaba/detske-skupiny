"use client";

import React from "react";
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  SvgIconProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { MiniSchool } from "@/sanity/types";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import Location from "@/components/icons/Location";
import Ellipsis from "@/components/ui/Typography/Ellipsis";
import SchoolTag from "@/app/[locale]/catalog/[region]/[school]/components/SchoolTag";
import { routes } from "@/routes";

interface Props {
  school: MiniSchool;
}

interface KinderGroupCardStyles {
  container?: BoxProps;
  imageWrapper?: BoxProps;
  image?: BoxProps;
  infoContainer?: BoxProps;
  tagWrapper?: BoxProps;
  title?: TypographyProps;
  description?: TypographyProps;
  cta?: ButtonProps;
  area?: TypographyProps;
  locationIcon?: SvgIconProps;
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
    position: "relative",
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
  area: {
    sx: {
      position: "absolute",
      width: "100%",
      bottom: 0,
      background: "rgba(30, 35, 43, 0.6)",
      backdropFilter: "blur(16px)",
      py: "12px",
      px: "10px",
      borderBottomLeftRadius: {
        xs: "8px",
        lg: "24px",
      },
      borderBottomRightRadius: {
        xs: "8px",
        lg: 0,
      },
      fontSize: "14px",
      color: "primary.light",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
  },
  locationIcon: {
    sx: {
      fontSize: "20px",
      color: "primary.light",
    },
  },
  infoContainer: {
    sx: {
      display: "flex",
      flexDirection: "column",
      gap: "13px",
      py: "20px",
      paddingLeft: "16px",
      paddingRight: {
        xs: "16px",
        lg: "20px",
      },
    },
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
    sx: {
      mt: "auto",
    },
  },
  cta: {
    variant: "ghost",
    sx: {
      py: "10px",
      alignSelf: "baseline",
      borderColor: "primary.main",
      boxShadow: "none",
      fontWeight: 500,
      "&:hover": {
        color: "common.white",
        backgroundColor: "primary.main",
        borderColor: "primary.main",
      },
    },
  },
  tagWrapper: {
    sx: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      gap: "12px",
    },
  },
};

const SchoolCard = ({ school }: Props) => {
  return (
    <Box {...styles.container}>
      <Box {...styles.imageWrapper}>
        <Box
          component="img"
          src={urlImageFor(school.primaryImage)}
          {...styles.image}
        />
        {school.area?.name && (
          <Typography {...styles.area}>
            <Location {...styles.locationIcon} />
            {school.area?.name}
          </Typography>
        )}
      </Box>
      <Box {...styles.infoContainer}>
        <Ellipsis {...styles.title} limitOfLine={1}>
          {school.name}
        </Ellipsis>
        {school.tags && school.tags.length > 0 && (
          <Box {...styles.tagWrapper}>
            {school.tags.map((tag) => (
              <SchoolTag tag={tag} key={tag.id} />
            ))}
          </Box>
        )}
        <Ellipsis limitOfLine={4} {...styles.description}>
          {school.shortSummary}
        </Ellipsis>
        <Button
          {...styles.cta}
          href={routes.school(school.region.name, school.slug)}
        >
          View this School
        </Button>
      </Box>
    </Box>
  );
};

export default SchoolCard;
