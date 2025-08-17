import {
  Box,
  BoxProps,
  ButtonBase,
  ButtonProps,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import { Area, SchoolType } from "@/sanity/types";
import { FC } from "react";
import Link from "@/components/ui/link";

interface Props {
  item?: Area | SchoolType;
  regionUrl?: string;
  hideNextArrow?: boolean;
}

interface GroupItemStyles {
  container?: ButtonProps;
  emoji?: BoxProps;
  stack?: StackProps;
  schoolCountBox?: BoxProps;
  arrowBox?: BoxProps;
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
      width: "24px",
      height: "24px",
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
};

const GroupItem: FC<Props> = ({ item, regionUrl, hideNextArrow }) => {
  if (!item) {
    return null;
  }

  return (
    <Link href={`${regionUrl}?area=${encodeURIComponent(item.slug)}`}>
      <ButtonBase {...styles.container}>
        <Stack {...styles.stack}>
          {(item as SchoolType).emoji && (
            <Box
              component="img"
              src={(item as SchoolType).emoji}
              {...styles.emoji}
            />
          )}
          <Typography variant="h3">{item.name}</Typography>
          <Box
            {...styles.schoolCountBox}
            ml={hideNextArrow ? "auto" : "initial"}
          >
            <Typography>{item.schoolCount}</Typography>
          </Box>
        </Stack>
        {!hideNextArrow && (
          <Box {...styles.arrowBox}>
            <ArrowRightIcon />
          </Box>
        )}
      </ButtonBase>
    </Link>
  );
};

export default GroupItem;
