"use client";

import { Box, Typography } from "@mui/material";
import { MiniSchool } from "@/types";
import { urlImageFor } from "@/lib/sanity/imageUrl";
import SchoolTag from "@/features/school/components/SchoolTag";
import Ellipsis from "@/components/ui/typography/Ellipsis";
import Location from "@/components/icons/Location";
import Button from "@/components/ui/button";
import useTranslate from "@/hooks/useTranslate";
import { getLocalizedRoutes } from "@/routes";
import Image, { type ImageProps } from "@/components/ui/image";
import SchoolTypesBadge from "@/features/catalog/components/TypeBadge";
import { useLocale } from "next-intl";
import Link from "@/components/ui/link/Link";
import type { SxProps, Theme } from "@mui/material/styles";
import { SCHOOL_CARD } from "@/components/ui/skeleton/geometry";

interface Props {
  school: MiniSchool;
}

const styles = {
  card: (theme) => ({
    border: `1px solid ${theme.palette.custom.divider}`,
    borderRadius: SCHOOL_CARD.radius,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    p: SCHOOL_CARD.padding,
    width: "100%",
    gap: SCHOOL_CARD.gap,
    maxWidth: { md: `${SCHOOL_CARD.maxWidth}px` },
    m: {
      xs: "0 auto",
      sm: "0",
    },
  }),
  imageWrapper: {
    position: "relative",
    width: "100%",
  },
  image: {
    width: "100%",
    height: SCHOOL_CARD.imageHeight,
    objectFit: "cover",
    display: "block",
    borderRadius: SCHOOL_CARD.imageRadius,
  },
  defaultImageWrapper: {
    display: "flex",
    opacity: "0.5",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "custom.divider",
    height: SCHOOL_CARD.imageHeight,
    borderRadius: SCHOOL_CARD.imageRadius,
  },
  defaultImage: {
    width: "80px",
    height: "80px",
    margin: "auto",
  },
  logo: {
    width: "100%",
    height: "100%",
    maxWidth: SCHOOL_CARD.logoSize,
    maxHeight: SCHOOL_CARD.logoSize,
    mt: "4px",
  },
  nameWrapper: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  name: {
    color: "custom.textHeading",
    fontWeight: 900,
    fontSize: "18px",
    minHeight: SCHOOL_CARD.nameMinHeight,
  },
  tagsWrapper: {
    display: "flex",
    gap: SCHOOL_CARD.tagGap,
    // Reserved so a school with no tags does not collapse the row and start
    // everything below it 24px higher than the card beside it. See the note
    // on `tagRowMinHeight`.
    minHeight: SCHOOL_CARD.tagRowMinHeight,
  },
  location: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "custom.textHeading",
    mb: SCHOOL_CARD.locationMarginBottom,
  },
  description: {
    minHeight: SCHOOL_CARD.descriptionMinHeight,
  },
  cta: (theme) => ({
    mt: SCHOOL_CARD.ctaMarginTop,
    py: "8px",
    fontSize: "14px",
    width: "100%",
    borderColor: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
    },
  }),
} satisfies Record<string, SxProps<Theme>>;

const SchoolGridCard = ({ school }: Props) => {
  const locale = useLocale();

  const translate = useTranslate();
  const { shortSummary, name, tags, primaryImage, logo, region, area, types } =
    school;

  return (
    <Box sx={styles.card}>
      <Link
        sx={styles.imageWrapper}
        href={getLocalizedRoutes(locale).group(school.slug)}
      >
        {urlImageFor(primaryImage) === "" ? (
          <Box sx={styles.defaultImageWrapper}>
            <Image sx={styles.defaultImage} alt={name} sizes="80px" />
          </Box>
        ) : (
          <Image
            sx={styles.image}
            src={primaryImage}
            alt={name}
            // The grid is 1 / 2 / 3 columns inside a max-width container, so a
            // card is never wider than about a third of a large viewport.
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        )}

        <SchoolTypesBadge types={types?.filter((t) => t.visibility)} />
      </Link>
      <Link
        sx={styles.nameWrapper}
        href={getLocalizedRoutes(locale).group(school.slug)}
      >
        {logo && <Image sx={styles.logo} src={logo} alt={name} sizes="30px" />}
        <Ellipsis limitOfLine={2} sx={styles.name}>
          {name}
        </Ellipsis>
      </Link>
      <Box sx={styles.tagsWrapper}>
        {tags?.map((tag) => (
          <SchoolTag tag={tag} key={tag.id} />
        ))}
      </Box>
      <Box sx={{ mt: "auto", width: "100%" }}>
        <Typography sx={styles.location}>
          <Location
            sx={{
              width: "16px",
              height: SCHOOL_CARD.locationHeight,
              color: "secondary.dark",
            }}
          />
          {area?.name || region?.name}
        </Typography>
        <Ellipsis limitOfLine={4} sx={styles.description}>
          {shortSummary}
        </Ellipsis>
        <Button
          sx={styles.cta}
          variant="ghost"
          href={getLocalizedRoutes(locale).group(school.slug)}
        >
          {translate("viewSchool")}
        </Button>
      </Box>
    </Box>
  );
};

export default SchoolGridCard;
