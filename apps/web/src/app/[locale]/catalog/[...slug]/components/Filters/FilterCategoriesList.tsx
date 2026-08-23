"use client";

import {
  Box,
  BoxProps,
  Divider,
  DividerProps,
  LinkProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { FC } from "react";
import { FiltersResponse } from "@/sanity/queries";
import useTranslate from "@/hooks/useTranslate";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { Filters } from "@/hooks/useSchoolFilters";

interface Props {
  showDivider?: boolean;
  categories?: FiltersResponse["categories"];
  selectedTypes?: string[];
  toggleType?: (slug: string) => void;
  clear?: (key?: keyof Filters) => void;
}

interface FilterListStyles {
  container?: BoxProps;
  sectionHeading?: TypographyProps;
  listContainer?: BoxProps;
  item?: BoxProps;
  viewAllContainer?: BoxProps;
  viewAll?: LinkProps;
  divider?: DividerProps;
}

const styles: FilterListStyles = {
  sectionHeading: {
    fontSize: "18px",
    fontWeight: 900,
    mb: "16px",
    color: "custom.ui13",
    textTransform: "capitalize",
  },
  listContainer: {
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "repeat(auto-fit, 132px)",
        sm: "repeat(2, 1fr)",
      },
      gap: "16px",
    },
  },
  item: {
    sx: {
      border: `1px solid var(--mui-palette-custom-ui12)`,
      borderRadius: "12px",
      p: "8px",
      textAlign: "center",
      fontWeight: 400,
      fontSize: "14px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      cursor: "pointer",
      bgcolor: "common.white",
      userSelect: "none",
      maxWidth: 128,
      "&.selected": {
        borderColor: "primary.main",
        backgroundColor: "primary.light",
      },
      "&:focus-visible": {
        outline: `2px solid var(--mui-palette-primary-main)`,
        outlineOffset: 2,
      },
    },
  },
  divider: {
    sx: {
      mt: "20px",
      mb: "16px",
      bgcolor: "common.ui18",
    },
  },
  viewAllContainer: {
    sx: {
      display: "flex",
    },
  },
  viewAll: {
    sx: {
      color: "custom.ui11",
      fontWeight: 500,
      fontSize: "16px",
      mt: "16px",
      cursor: "pointer",
      alignSelf: "baseline",
      "&:hover": {
        color: "primary.dark",
      },
    },
  },
};

const FilterCategoriesList: FC<Props> = ({
  categories: categoriesProps,
  selectedTypes,
  toggleType,
  clear,
  showDivider,
}) => {
  const translate = useTranslate();
  const categories = categoriesProps?.filter(Boolean);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Box {...styles.container} data-test-selector="FilterTypeList">
      {showDivider && <Divider {...styles.divider} />}
      <Typography {...styles.sectionHeading}>
        {translate("kinderType")}
      </Typography>
      <Box {...styles.listContainer}>
        {categories.map((category) => {
          const checked = selectedTypes?.includes(category.slug);
          return (
            <Box
              key={category.id}
              {...styles.item}
              className={checked ? "selected" : ""}
              onClick={() => toggleType?.(category.slug)}
              role="checkbox"
              aria-checked={checked}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleType?.(category.slug);
                }
              }}
            >
              {category.emoji && (
                <Box src={urlImageFor(category.emoji)} component="img" />
              )}
              {category.name}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default FilterCategoriesList;
