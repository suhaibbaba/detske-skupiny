"use client";

import {
  alpha,
  Box,
  BoxProps,
  ButtonProps,
  Divider,
  DividerProps,
  IconProps,
  SvgIconProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { FC, useState } from "react";
import MinusIcon from "@mui/icons-material/Remove";
import { routes } from "@/routes";
import { CategoryItem } from "@/sanity/queries";
import Button from "@/components/ui/button";
import { normalizeSlug } from "@/sanity/utilites/helper";
import DoneIcon from "@mui/icons-material/Done";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface Props {
  title: string;
  showDivider?: boolean;
  items?: CategoryItem[];
  selectedSlug?: string;
  initialItemsCount?: number;
}

interface FilterListStyles {
  container?: BoxProps;
  heading?: TypographyProps;
  listContainer?: BoxProps;
  itemButton?: ButtonProps;
  itemContainer?: BoxProps;
  itemIcon?: IconProps;
  itemSelectedIcon?: IconProps;
  itemText?: TypographyProps;
  itemCount?: TypographyProps;
  divider?: DividerProps;
  showMoreIcon?: SvgIconProps;
  showMoreButton?: ButtonProps;
}

const styles: FilterListStyles = {
  heading: {
    fontSize: "18px",
    fontWeight: 500,
    mb: "16px",
    color: "custom.ui13",
    textTransform: "capitalize",
  },
  listContainer: {
    sx: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      pr: "14px",
    },
  },
  itemButton: {
    sx: (theme) => ({
      justifyContent: "space-between",
      minHeight: "auto",
      "&:hover:not(.selected)": {
        bgcolor: alpha(theme.palette.custom.ui14, 0.3),
      },
      "&.selected": {
        border: `1px solid ${theme.palette.custom.ui14}`,
      },
    }),
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
      color: "custom.ui20",
    },
  },
  itemSelectedIcon: {
    sx: {
      fontSize: "18px",
      color: "custom.ui10",
    },
  },
  itemText: {
    color: "custom.ui20",
  },
  itemCount: {
    sx: {
      width: "34px",
      height: "34px",
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
  showMoreIcon: {
    sx: {
      width: 16,
      height: 16,
      mr: "8px",
    },
  },
  showMoreButton: {
    sx: {
      mt: "8px",
      color: "primary.main",
      fontSize: "14px",
      transition: "color 300ms ease-in-out",
      "&:hover": {
        bgcolor: "transparent",
        color: "custom.ui14",
      },
    },
  },
};

const FilterList: FC<Props> = ({
  title,
  items: itemsProps,
  showDivider,
  selectedSlug,
  initialItemsCount = 3,
}) => {
  const [showAll, setShowAll] = useState(false);
  const items = itemsProps?.filter(Boolean);

  if (!items || items.length === 0) {
    return null;
  }

  const shouldShowToggle = items.length > initialItemsCount;
  const displayedItems = showAll ? items : items.slice(0, initialItemsCount);

  return (
    <Box {...styles.container}>
      {showDivider && <Divider {...styles.divider} />}
      <Typography {...styles.heading}>{title}</Typography>
      <Box {...styles.listContainer}>
        {displayedItems.map((district) => {
          const selected =
            normalizeSlug(selectedSlug) === normalizeSlug(district.slug);
          return (
            <React.Fragment key={district.id}>
              <Button
                {...styles.itemButton}
                href={routes.catalogs(district.slug)}
                variant="text"
                className={selected ? "selected" : ""}
                scroll={false}
              >
                <Box {...styles.itemContainer} key={`container_${district.id}`}>
                  {selected ? (
                    <DoneIcon
                      key={`${district.id}_done`}
                      sx={styles.itemSelectedIcon?.sx}
                    />
                  ) : (
                    <MinusIcon
                      key={`${district.id}_minus`}
                      sx={styles.itemIcon?.sx}
                    />
                  )}
                  <Typography key={`${district.id}_name`} {...styles.itemText}>
                    {district.name}
                  </Typography>
                </Box>
                <Typography {...styles.itemCount}>{district.count}</Typography>
              </Button>
            </React.Fragment>
          );
        })}
      </Box>
      {shouldShowToggle && (
        <Button
          {...styles.showMoreButton}
          variant="text"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <RemoveIcon {...styles.showMoreIcon} />
          ) : (
            <AddIcon {...styles.showMoreIcon} />
          )}
          {showAll ? "Show Less" : "Show More"}
        </Button>
      )}
    </Box>
  );
};

export default FilterList;
