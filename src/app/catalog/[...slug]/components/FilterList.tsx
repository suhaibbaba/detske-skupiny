import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Divider,
  DividerProps,
  IconProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { FC } from "react";
import MinusIcon from "@mui/icons-material/Remove";
import { routes } from "@/routes";
import { CategoryItem } from "@/sanity/queries";

interface Props {
  title: string;
  showDivider?: boolean;
  items?: CategoryItem[];
}

interface FilterListStyles {
  container?: BoxProps;
  sectionHeading?: TypographyProps;
  listContainer?: BoxProps;
  itemButton?: ButtonProps;
  itemContainer?: BoxProps;
  itemIcon?: IconProps;
  itemText?: TypographyProps;
  itemCount?: TypographyProps;
  divider?: DividerProps;
}

const styles: FilterListStyles = {
  sectionHeading: {
    fontSize: "18px",
    fontWeight: 500,
    mb: "16px",
    color: "custom.ui13",
  },
  listContainer: {
    sx: {
      maxHeight: 190,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
  },
  itemButton: {
    sx: {
      justifyContent: "space-between",
      minHeight: "auto",
      "&:hover": {
        bgcolor: "custom.ui14",
      },
    },
  },
  itemContainer: {
    sx: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: "5px",
    },
  },
  itemIcon: {
    sx: {
      color: "#475467",
    },
  },
  itemText: {
    color: "#475467",
  },
  itemCount: {
    sx: {
      width: "28px",
      height: "28px",
      aspectRatio: 1,
      fontSize: 14,
      color: "custom.ui13",
      fontWeight: 400,
      border: "1px solid #E0C3F9",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: "2px",
    },
  },
  divider: {
    sx: {
      mt: "20px",
      mb: "16px",
      bgcolor: "common.ui18",
    },
  },
};

const FilterList: FC<Props> = ({ title, items, showDivider }) => {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <Box {...styles.container}>
      {showDivider && <Divider {...styles.divider} />}
      <Typography {...styles.sectionHeading}>{title}</Typography>
      {items.length > 0 && (
        <Box {...styles.listContainer}>
          {items.map((district) => {
            return (
              <Button
                {...styles.itemButton}
                key={district.id}
                href={routes.catalogs(district.slug)}
                variant="text"
              >
                <Box {...styles.itemContainer}>
                  <MinusIcon sx={styles.itemIcon?.sx} />
                  <Typography {...styles.itemText}>{district.name}</Typography>
                </Box>
                <Typography {...styles.itemCount}>{district.count}</Typography>
              </Button>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default FilterList;
