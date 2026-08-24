import {
  Box,
  BoxProps,
  ButtonBase,
  ButtonProps,
  Stack,
  StackProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import { GroupPage } from "@/sanity/types";
import Link from "@/components/ui/link";
import { getLocalizedRoutes } from "@/routes";
import { getLocale } from "next-intl/server";
import Image, { type ImageProps } from "@/components/ui/image";

interface Props {
  item?: GroupPage["areas"][number] | GroupPage["schoolCategories"][number];
  baseSlug?: string;
  hideNextArrow?: boolean;
}

interface GroupItemStyles {
  container?: ButtonProps;
  emoji?: ImageProps;
  stack?: StackProps;
  schoolCountBox?: BoxProps;
  schoolCountText?: TypographyProps;
  arrowBox?: BoxProps;
  title?: TypographyProps;
}

const styles: GroupItemStyles = {
  container: {
    sx: {
      width: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "24px",
      backgroundColor: "white",
      border: 1,
      padding: "16px",
      borderColor: "#EDEEF0",
      transition: "all 300ms ease-in-out",
      "&:hover": {
        backgroundColor: "#EDDDFC",
      },
    },
  },
  emoji: {
    sx: {
      width: "28px",
      height: "28px",
    },
  },
  stack: {
    alignItems: "center",
    direction: "row",
    gap: "12px",
    sx: {
      display: "flex",
      width: "100%",
    },
  },
  schoolCountBox: {
    sx: {
      width: "36px",
      height: "36px",
      aspectRatio: 1,
      borderRadius: "24px",
      border: 1,
      textAlign: "center",
      borderColor: "secondary.dark",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  schoolCountText: {
    sx: {
      fontSize: "13px",
    },
  },
  arrowBox: {
    sx: {
      display: "flex",
      width: "28px",
      height: "28px",
      justifyContent: "center",
      alignItems: "center",
      border: 1,
      borderColor: "primary.main",
      borderRadius: "24px",
      flexShrink: 0,
    },
  },
  title: {
    variant: "h3",
    sx: {
      mb: 0,
    },
  },
};

const GroupItem = async ({ baseSlug, item, hideNextArrow }: Props) => {
  const locale = await getLocale();

  if (!item) {
    return null;
  }

  let url = getLocalizedRoutes(locale).catalogs(item.slug);
  if (baseSlug) {
    url = `${getLocalizedRoutes(locale).catalogs(baseSlug)}?types=${item.slug}`;
  }

  return (
    <Link href={url}>
      <ButtonBase {...styles.container}>
        <Stack {...styles.stack}>
          {"emoji" in item && item.emoji && (
            <Image src={item.emoji} alt="" sizes="24px" {...styles.emoji} />
          )}
          <Typography {...styles.title}>{item.name}</Typography>
          <Box
            {...styles.schoolCountBox}
            ml={hideNextArrow ? "auto" : "initial"}
          >
            <Typography {...styles.schoolCountText}>
              {item.schoolCount}
            </Typography>
          </Box>
        </Stack>
        {!hideNextArrow && (
          <Box {...styles.arrowBox}>
            <ArrowRightIcon sx={{ fontSize: "12px" }} />
          </Box>
        )}
      </ButtonBase>
    </Link>
  );
};

export default GroupItem;
