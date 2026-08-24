import type { SxProps, Theme } from "@mui/material/styles";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import { GroupPage } from "@/types";
import Link from "@/components/ui/link";
import { getLocalizedRoutes } from "@/routes";
import { getLocale } from "next-intl/server";
import Image, { type ImageProps } from "@/components/ui/image";

interface Props {
  item?:
    | NonNullable<GroupPage["areas"]>[number]
    | NonNullable<GroupPage["schoolCategories"]>[number];
  baseSlug?: string | null;
  hideNextArrow?: boolean;
}

const styles = {
  container: {
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
  emoji: {
    width: "28px",
    height: "28px",
  },
  stack: {
    gap: "12px",
    alignItems: "center",
    display: "flex",
    width: "100%",
  },
  schoolCountBox: {
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
  schoolCountText: {
    fontSize: "13px",
  },
  arrowBox: {
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
  title: {
    mb: 0,
  },
} satisfies Record<string, SxProps<Theme>>;

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
      <ButtonBase sx={styles.container}>
        <Stack sx={styles.stack} direction="row">
          {"emoji" in item && item.emoji && (
            <Image src={item.emoji} alt="" sizes="24px" sx={styles.emoji} />
          )}
          <Typography sx={styles.title} variant="h3">
            {item.name}
          </Typography>
          <Box
            sx={{
              ml: hideNextArrow ? "auto" : "initial",
            }}
          >
            <Typography sx={styles.schoolCountText}>
              {item.schoolCount}
            </Typography>
          </Box>
        </Stack>
        {!hideNextArrow && (
          <Box sx={styles.arrowBox}>
            <ArrowRightIcon sx={{ fontSize: "12px" }} />
          </Box>
        )}
      </ButtonBase>
    </Link>
  );
};

export default GroupItem;
