import React, { FC } from "react";
import {
  Card,
  CardProps,
  CardMedia,
  CardMediaProps,
  CardContent,
  CardContentProps,
  Typography,
  CardActionArea,
  Box,
  alpha,
  Chip,
  ChipProps,
  TypographyProps,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { MiniSchool } from "@/sanity/types";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { routes } from "@/routes";
import { ellipses } from "@/utilites/strings";

interface Props {
  school: MiniSchool;
}

interface PreschoolCardStyles {
  container?: CardProps;
  cardMedia?: CardMediaProps;
  cardContent?: CardContentProps;
  locationChip?: ChipProps;
  schoolTitle?: TypographyProps;
}

const styles: PreschoolCardStyles = {
  container: {
    sx: (theme) => ({
      width: {
        xs: "272px",
        sm: "302px",
      },
      flexShrink: 0,
      borderRadius: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      boxShadow: `
        0 4px 6px ${alpha(theme.palette.common.black, 0.06)},
        0 2px 4px ${alpha(theme.palette.common.black, 0.08)}
      `,
    }),
  },
  cardMedia: {
    sx: {
      width: "100%",
      position: "relative",
      height: 158,
      borderRadius: "24px",
    },
  },
  cardContent: {
    sx: {
      p: "10px 20px",
    },
  },
  locationChip: {
    sx: (theme) => ({
      position: "absolute",
      bottom: 17,
      left: 22,
      bgcolor: "white",
      color: "black",
      px: "10px",
      py: "8px",
      borderRadius: "24px",
      boxShadow: `
        0px 4px 6px 0px ${alpha(theme.palette.common.black, 0.05)}, 
        0px 10px 15px -3px ${alpha(theme.palette.common.black, 0.1)}
      `,
      "& .MuiChip-icon": {
        width: "20px",
        height: "20px",
        ml: 0,
        color: "secondary.dark",
        fontSize: "20px",
      },
      "& .MuiChip-label": {
        fontSize: "14px",
        p: "0 0 0 6px",
        fontWeight: 400,
      },
    }),
  },
  schoolTitle: {
    variant: "h4",
    sx: {
      fontWeight: "500",
      mb: 0,
      ...ellipses(1),
    },
  },
};

const PreschoolCard: FC<Props> = ({ school }) => {
  return (
    <Card {...styles.container} data-test-selector="PreschoolCard">
      <CardActionArea href={routes.group(school.slug)}>
        <Box p="10px" position="relative">
          <CardMedia
            {...styles.cardMedia}
            image={urlImageFor(school.primaryImage) || ""}
            title={school.name}
          />
          {school.area && (
            <Chip
              icon={<LocationOnIcon />}
              label={school.area.name}
              {...styles.locationChip}
            />
          )}
        </Box>
        <CardContent {...styles.cardContent}>
          <Typography {...styles.schoolTitle} title={school.name}>
            {school.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PreschoolCard;
