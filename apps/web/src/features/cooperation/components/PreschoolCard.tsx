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
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  Chip,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { MiniSchool } from "@/types";

import { getLocalizedRoutes } from "@/routes";
import { ellipses } from "@/utils/strings";
import Image, { type ImageProps } from "@/components/ui/image";
import type { SxProps, Theme } from "@mui/material/styles";

interface Props {
  school: MiniSchool;
  locale?: string;
}

const styles = {
  /*
   * The card shadow is written out rather than taken from `theme.custom`: it
   * is a two-layer shadow this card alone uses, not the site's one elevation.
   * Written as a literal rather than an `sx: (theme) => ...` callback, which a
   * Server Component cannot hand to a Client Component: the only theme value
   * it needs is `common.black`, which the theme pins to #000000.
   */
  container: {
    width: { xs: "272px", sm: "302px" },
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
  cardMedia: {
    width: "100%",
    position: "relative",
    height: 158,
    borderRadius: "24px",
  },
  defaultCardMediaWrapper: {
    display: "flex",
    opacity: "0.5",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "custom.divider",
    height: "158px",
    borderRadius: "24px",
  },
  defaultCardMedia: {
    width: "80px",
    height: "80px",
    margin: "auto",
  },
  cardContent: {
    p: "10px 20px",
  },
  locationChip: {
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
  schoolTitle: {
    fontWeight: "500",
    mb: 0,
    ...ellipses(1),
  },
} satisfies Record<string, SxProps<Theme>>;

const PreschoolCard = ({ school, locale }: Props) => {
  // The default-image fallback lives inside `<Image>` itself, so this card
  // does not read the context - which is what keeps it off the client.

  return (
    <Card sx={styles.container} data-test-selector="PreschoolCard">
      <CardActionArea href={getLocalizedRoutes(locale).group(school.slug)}>
        <Box
          sx={{
            p: "10px",
            position: "relative",
          }}
        >
          {!school.primaryImage ? (
            <Box sx={styles.defaultCardMediaWrapper}>
              <Image
                sx={styles.defaultCardMedia}
                src={school.primaryImage}
                alt={school.name}
                sizes="80px"
              />
            </Box>
          ) : (
            /*
             * A real `<img>` rather than a CSS background-image, which carries
             * no srcset, no lazy loading, and nothing for a preload scanner to
             * find. The wrapper holds a fixed 158px box, so `fill` has exact
             * space to reserve.
             */
            <Box sx={styles.cardMedia}>
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
              sx={styles.locationChip}
            />
          )}
        </Box>
        <CardContent sx={styles.cardContent}>
          <Typography
            variant="h4"
            sx={styles.schoolTitle}
            title={school.name ?? undefined}
          >
            {school.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PreschoolCard;
