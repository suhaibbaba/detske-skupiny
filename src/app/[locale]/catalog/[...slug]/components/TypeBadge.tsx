import { Box, BoxProps, Chip, ChipProps } from "@mui/material";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import Star from "@/components/icons/Star";
import { SchoolType } from "@/sanity/types";
import { FC } from "react";

interface Props {
  types?: SchoolType[];
}

interface SchoolTypesBadgeStyles {
  container?: BoxProps;
  badge: (backgroundColor: string) => ChipProps;
}

const styles: SchoolTypesBadgeStyles = {
  container: {
    sx: {
      position: "absolute",
      top: 12,
      left: 12,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
  },
  badge: (backgroundColor = "secondary.main") => ({
    size: "small",
    sx: {
      bgcolor: backgroundColor,
      color: "custom.ui1",
      fontWeight: 400,
      fontSize: "14px",
      borderRadius: "24px",
      px: "10px",
      borderColor: backgroundColor,
      "& .MuiChip-icon": {
        color: "custom.ui19",
        width: "13px",
        height: "13px",
        fontSize: "10px",
      },
    },
  }),
};

const SchoolTypesBadge: FC<Props> = ({ types }) => {
  if (!types || types.length === 0) {
    return null;
  }

  return (
    <Box {...styles.container}>
      {types.map((type) => {
        let icon;
        if (type.icon) {
          icon = (
            <Box component="img" src={urlImageFor(type.icon)} alt={type.name} />
          );
        } else if (type.highPriority) {
          icon = <Star />;
        }

        console.log({
          bg: type.backgroundColor,
        });
        return (
          <Chip
            key={type.id}
            {...styles.badge?.(type.backgroundColor)}
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
