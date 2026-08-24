"use client";

/**
 * A Client Component, for the same reason as `catalog/.../TypeBadge.tsx`: it
 * hands MUI's `Chip` an element as its `icon` prop, and an element created on
 * the server does not survive that trip - the server renders the chip without
 * the icon and the client renders it with one, which is a hydration mismatch.
 *
 * This is why demoting `SchoolsCarousel` did not carry the card to the server
 * with it. The carousel demotion still stands on its own: the client boundary
 * now sits on `EmblaCarousel`, which is the thing that actually needs one.
 */
import React from "react";
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
  Chip,
  ChipProps,
  TypographyProps,
  BoxProps,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { MiniSchool } from "@/sanity/types";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { getLocalizedRoutes } from "@/routes";
import { ellipses } from "@/utilites/strings";
import Image, { type ImageProps } from "@/components/ui/image";

interface Props {
  school: MiniSchool;
  locale?: string;
}

interface PreschoolCardStyles {
  container?: CardProps;
  cardMedia?: BoxProps;
  cardContent?: CardContentProps;
  locationChip?: ChipProps;
  schoolTitle?: TypographyProps;
  defaultCardMediaWrapper?: BoxProps;
  defaultCardMedia?: ImageProps;
}

const styles: PreschoolCardStyles = {
  container: {
    /*
     * Was `sx: (theme) => ...`, which a Server Component cannot hand to a
     * Client Component - a function does not serialise across the boundary.
     * Both callbacks only read `palette.common.black`, which the theme pins to
     * #000000, so the shadows are written out directly instead.
     */
    sx: {
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
        0 4px 6px rgba(0, 0, 0, 0.06),
        0 2px 4px rgba(0, 0, 0, 0.08)
      `,
    },
  },
  cardMedia: {
    sx: {
      width: "100%",
      position: "relative",
      height: 158,
      borderRadius: "24px",
    },
  },
  defaultCardMediaWrapper: {
    sx: {
      display: "flex",
      opacity: "0.5",
      justifyContent: "center",
      alignItems: "center",
      bgcolor: "custom.ui12",
      height: "158px",
      borderRadius: "24px",
    },
  },
  defaultCardMedia: {
    sx: {
      width: "80px",
      height: "80px",
      margin: "auto",
    },
  },
  cardContent: {
    sx: {
      p: "10px 20px",
    },
  },
  locationChip: {
    sx: {
      position: "absolute",
      bottom: 17,
      left: 22,
      bgcolor: "white",
      color: "black",
      px: "10px",
      py: "8px",
      borderRadius: "24px",
      boxShadow: `
        0px 4px 6px 0px rgba(0, 0, 0, 0.05),
        0px 10px 15px -3px rgba(0, 0, 0, 0.1)
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
    },
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

const PreschoolCard = ({ school, locale }: Props) => {
  // The default-image fallback lives inside `<Image>` itself, so reading the
  // context here as well was duplicate work - and it was the one thing keeping
  // this card on the client once `SchoolsCarousel` stopped forcing it there.

  return (
    <Card {...styles.container} data-test-selector="PreschoolCard">
      <CardActionArea href={getLocalizedRoutes(locale).group(school.slug)}>
        <Box
          sx={{
            p: "10px",
            position: "relative",
          }}
        >
          {!school.primaryImage ? (
            <Box {...styles.defaultCardMediaWrapper}>
              <Image
                {...styles.defaultCardMedia}
                src={school.primaryImage}
                alt={school.name}
                sizes="80px"
              />
            </Box>
          ) : (
            /*
             * Was a `CardMedia` with no `component`, which renders a div with
             * a CSS background-image: no srcset, no lazy loading, and nothing
             * for a preload scanner to find. The wrapper keeps the same fixed
             * 158px box, so `fill` reserves exactly the space the background
             * used to occupy.
             */
            <Box {...styles.cardMedia}>
              <Image
                src={school.primaryImage}
                alt={school.name}
                fill
                sizes="(max-width: 900px) 100vw, 320px"
                sx={{ objectFit: "cover", borderRadius: "24px" }}
              />
            </Box>
          )}
          {school.area && (
            <Chip
              icon={<LocationOnIcon />}
              label={school.area.name}
              {...styles.locationChip}
            />
          )}
        </Box>
        <CardContent {...styles.cardContent}>
          <Typography {...styles.schoolTitle} title={school.name ?? undefined}>
            {school.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PreschoolCard;
