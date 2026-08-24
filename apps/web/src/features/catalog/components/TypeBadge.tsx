"use client";

/**
 * A Client Component because it hands MUI's `Chip` a React element as its
 * `icon` prop.
 *
 * `Chip` clones that element, and an element created on the server and passed
 * into a Client Component does not survive the trip: the server rendered the
 * chip with its label and no icon, the client rendered it with both, and React
 * reported a hydration mismatch on every page showing a highlighted school
 * type. It only surfaced on the home page - the catalog's card is already a
 * Client Component, so there was no boundary for the icon to cross.
 *
 * Pre-existing; it predates the switch to `next/image` here and reproduces
 * with the plain `<img>` this used to render.
 */
import { Box, Chip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

import Star from "@/components/icons/Star";
import { SchoolType } from "@/types";
import { FC } from "react";
import Image from "@/components/ui/image";

interface Props {
  types?: SchoolType[];
}

const styles = {
  container: {
    position: "absolute",
    top: 12,
    left: 12,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
} satisfies Record<string, SxProps<Theme>>;

/**
 * The badge takes its fill from the school type, so it is a function of the
 * row. Deliberately not the shared `DataChip`: this one keeps MUI's own chip
 * icon margins, and inheriting DataChip's would move the star.
 */
const badgeSx = (backgroundColorProps: string | null): SxProps<Theme> => ({
  bgcolor: backgroundColorProps || "white",
  color: "custom.labelStrong",
  fontWeight: 400,
  fontSize: "14px",
  borderRadius: "24px",
  px: "10px",
  borderColor: backgroundColorProps || "primary.main",
  "& .MuiChip-icon": {
    color: "custom.labelOnCream",
    width: "13px",
    height: "13px",
    fontSize: "10px",
  },
});

const SchoolTypesBadge: FC<Props> = ({ types: typesProps }) => {
  const types = typesProps?.sort((a, b) => {
    if (a.highPriority && !b.highPriority) return -1;
    if (!a.highPriority && b.highPriority) return 1;
    return 0;
  });

  if (!types || types.length === 0) {
    return null;
  }

  return (
    <Box sx={styles.container}>
      {types.map((type) => {
        let icon;
        if (type.icon) {
          icon = <Image src={type.icon} alt={type.name} sizes="24px" />;
        } else if (type.highPriority) {
          icon = <Star />;
        }

        return (
          <Chip
            key={type.id}
            size="small"
            sx={badgeSx(type.backgroundColor)}
            label={type.name}
            variant="outlined"
            icon={icon}
          />
        );
      })}
    </Box>
  );
};

export default SchoolTypesBadge;
