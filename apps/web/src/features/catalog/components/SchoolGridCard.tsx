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

interface Props {
  school: MiniSchool;
}

const styles = {
  card: (theme) => ({
    border: `1px solid ${theme.palette.custom.divider}`,
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    p: "20px",
    width: "100%",
    gap: "13px",
    maxWidth: { md: "280px" },
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
    height: "158px",
    objectFit: "cover",
    display: "block",
    borderRadius: "12px",
  },
  defaultImageWrapper: {
    display: "flex",
    opacity: "0.5",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "custom.divider",
    height: "158px",
    borderRadius: "12px",
  },
  defaultImage: {
    width: "80px",
    height: "80px",
    margin: "auto",
  },
  logo: {
    width: "100%",
    height: "100%",
    maxWidth: "30px",
    maxHeight: "30px",
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
    minHeight: "54px",
  },
  tagsWrapper: {
    display: "flex",
    gap: "5px",
  },
  location: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "custom.textHeading",
    mb: "13px",
  },
  description: {
    minHeight: "100px",
  },
  cta: (theme) => ({
    mt: "13px",
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
            sx={{ width: "16px", height: "20px", color: "secondary.dark" }}
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
