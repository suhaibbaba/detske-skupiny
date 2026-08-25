import type { SxProps, Theme } from "@mui/material/styles";
import React from "react";
import { Box, Typography } from "@mui/material";
import { MiniSchool } from "@/types";
import Location from "@/components/icons/Location";
import Ellipsis from "@/components/ui/typography/Ellipsis";
import SchoolTag from "@/features/school/components/SchoolTag";
import { getLocalizedRoutes } from "@/routes";
import Button from "@/components/ui/button";
import { getTranslateServer } from "@/hooks/useTranslate";
import SchoolTypesBadge from "@/features/catalog/components/TypeBadge";
import Image, { type ImageProps } from "@/components/ui/image";
import { getLocale } from "next-intl/server";
import Link from "@/components/ui/link/Link";
import { custom } from "@/theme/custom";

interface Props {
  school: MiniSchool;
}

const styles = {
  container: {
    display: "flex",
    maxWidth: "628px",
    borderRadius: "24px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "custom.borderSubtle",
    bgcolor: "var(--mui-palette-common-white)",
    boxShadow: custom.shadows.card,
    flexDirection: {
      xs: "column",
      lg: "row",
    },
  },
  imageWrapper: {
    maxHeight: "277px",
    flexShrink: 0,
    height: {
      xs: "227px",
      lg: "auto",
    },
    width: {
      xs: "100%",
      lg: "260px",
    },
    position: "relative",
  },
  image: {
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
  defaultImageWrapper: {
    display: "flex",
    opacity: "0.5",
    justifyContent: "center",
    alignItems: "center",
    bgcolor: "custom.divider",
    height: "calc(100% - 45px)",
    borderTopLeftRadius: "24px",
    borderTopRightRadius: {
      xs: "24px",
      lg: 0,
    },
  },
  defaultImage: {
    width: "120px",
    height: "120px",
    margin: "auto",
  },
  area: {
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
  locationIcon: {
    fontSize: "20px",
    color: "primary.light",
  },
  infoContainer: {
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
  title: {
    textAlign: "left",
    color: "custom.textHeading",
    fontSize: "20px",
    fontWeight: 900,
  },
  description: {
    textAlign: "left",
    flexGrow: 1,
  },
  cta: {
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
  tagWrapper: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: "12px",
  },
} satisfies Record<string, SxProps<Theme>>;

const SchoolCard = async ({ school }: Props) => {
  const translate = await getTranslateServer();
  const locale = await getLocale();

  return (
    <Box sx={styles.container} data-test-selector="SchoolCard">
      <Box sx={styles.imageWrapper}>
        {school.primaryImage ? (
          <Image
            src={school.primaryImage}
            alt={school.name}
            sx={styles.image}
            // The carousel shows one card at a time on a phone and two on a
            // wide screen, inside a 628px-max card.
            sizes="(max-width: 900px) 100vw, 628px"
          />
        ) : (
          <Box sx={styles.defaultImageWrapper}>
            <Image sx={styles.defaultImage} alt={school.name} sizes="120px" />
          </Box>
        )}
        {school.area?.name && (
          <Typography sx={styles.area}>
            <Location sx={styles.locationIcon} />
            {school.area?.name}
          </Typography>
        )}
        <SchoolTypesBadge types={school.types?.filter((t) => t.visibility)} />
      </Box>
      <Box sx={styles.infoContainer}>
        <Link href={getLocalizedRoutes(locale).group(school.slug)}>
          <Ellipsis sx={styles.title} limitOfLine={1}>
            {school.name}
          </Ellipsis>
        </Link>
        {school.tags && school.tags.length > 0 && (
          <Box sx={styles.tagWrapper}>
            {school.tags.map((tag) => (
              <SchoolTag tag={tag} key={tag.id} />
            ))}
          </Box>
        )}
        <Ellipsis limitOfLine={4} sx={styles.description}>
          {school.shortSummary}
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

export default SchoolCard;
