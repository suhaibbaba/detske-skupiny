"use client";

import {
  Box,
  BoxProps,
  Typography,
  TypographyProps,
  ChipProps,
  ButtonProps,
} from "@mui/material";
import { MiniSchool } from "@/sanity/types";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import SchoolTag from "@/app/[locale]/school/[school]/components/SchoolTag";
import Ellipsis from "@/components/ui/Typography/Ellipsis";
import Location from "@/components/icons/Location";
import Button from "@/components/ui/button";
import useTranslate from "@/hooks/useTranslate";
import { routes } from "@/routes";

interface Props {
  school: MiniSchool;
}

interface KinderGroupCardStyles {
  card?: BoxProps;
  imageWrapper?: BoxProps;
  image?: BoxProps;
  premiumBadge?: ChipProps;
  logo?: BoxProps;
  nameWrapper?: BoxProps;
  name?: TypographyProps;
  tagsWrapper?: BoxProps;
  tag?: ChipProps;
  location?: TypographyProps;
  description?: TypographyProps;
  cta?: ButtonProps;
}

const styles: KinderGroupCardStyles = {
  card: {
    sx: (theme) => ({
      border: `1px solid ${theme.palette.custom.ui12}`,
      borderRadius: "24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      textAlign: "left",
      p: "20px",
      width: "100%",
      gap: "13px",
      maxWidth: "290px",
    }),
  },
  imageWrapper: {
    sx: {
      position: "relative",
    },
  },
  image: {
    sx: {
      width: "100%",
      height: "158px",
      objectFit: "cover",
      display: "block",
      borderRadius: "12px",
    },
  },
  premiumBadge: {
    size: "small",
    sx: (theme) => ({
      position: "absolute",
      top: 12,
      left: 12,
      bgcolor: "secondary.main",
      color: "custom.ui1",
      fontWeight: 400,
      fontSize: "14px",
      borderRadius: "24px",
      px: "10px",
      ".MuiChip-icon": {
        color: theme.palette.custom.ui19,
        ml: 0,
        mr: "4px",
      },
      ".MuiChip-label": {
        p: 0,
      },
    }),
  },
  logo: {
    sx: {
      width: "100%",
      height: "100%",
      maxWidth: "30px",
      maxHeight: "30px",
      mt: "4px",
    },
  },
  nameWrapper: {
    sx: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    },
  },
  name: {
    fontSize: "18px",
    fontWeight: 500,
    color: "custom.ui13",
    sx: {
      minHeight: "54px",
    },
  },
  tagsWrapper: {
    sx: {
      display: "flex",
      gap: "5px",
    },
  },
  tag: {
    size: "small",
    variant: "outlined",
    sx: {
      fontSize: "12px",
      fontWeight: 400,
      borderRadius: "24px",
    },
  },
  location: {
    sx: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: "custom.ui13",
      mb: "13px",
    },
  },
  cta: {
    variant: "ghost",
    sx: (theme) => ({
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
  },
};

const SchoolGridCard = ({ school }: Props) => {
  const translate = useTranslate();
  const { shortSummary, name, tags, primaryImage, logo, region } = school;

  return (
    <Box {...styles.card}>
      <Box
        component="img"
        {...styles.image}
        src={urlImageFor(primaryImage)}
        alt={name}
      />
      <Box {...styles.nameWrapper}>
        <Box
          component="img"
          {...styles.logo}
          src={urlImageFor(logo)}
          alt={name}
        />
        <Ellipsis limitOfLine={2} {...styles.name}>
          {name}
        </Ellipsis>
      </Box>
      <Box {...styles.tagsWrapper}>
        {tags?.map((tag, idx) => (
          <SchoolTag tag={tag} key={tag.id} />
        ))}
      </Box>
      <Box sx={{ mt: "auto", width: "100%" }}>
        <Typography {...styles.location}>
          <Location
            sx={{ width: "16px", height: "20px", color: "secondary.dark" }}
          />
          {region.name}
        </Typography>
        <Ellipsis limitOfLine={4} {...styles.description}>
          {shortSummary}
        </Ellipsis>
        <Button {...styles.cta} href={routes.school(school.slug)}>
          {translate("viewSchool")}
        </Button>
      </Box>
    </Box>
  );
};

export default SchoolGridCard;
