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
  types?: FiltersResponse["types"];
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
    fontWeight: 500,
    mb: "16px",
    color: "custom.ui13",
  },
  listContainer: {
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "repeat(auto-fit, minmax(132px, 1fr))",
        sm: "repeat(2,1fr)",
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

const FilterTypeList: FC<Props> = ({
  types: typesProps,
  selectedTypes,
  toggleType,
  clear,
  showDivider,
}) => {
  const translate = useTranslate();
  const types = typesProps?.filter(Boolean);

  if (!types || types.length === 0) {
    return null;
  }

  return (
    <Box {...styles.container} data-test-selector="FilterTypeList">
      {showDivider && <Divider {...styles.divider} />}
      <Typography {...styles.sectionHeading}>
        {translate("kinderType")}
      </Typography>
      <Box {...styles.listContainer}>
        {types.map((type) => {
          const checked = selectedTypes?.includes(type.slug);
          return (
            <Box
              key={type.id}
              {...styles.item}
              className={checked ? "selected" : ""}
              onClick={() => toggleType?.(type.slug)}
              role="checkbox"
              aria-checked={checked}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleType?.(type.slug);
                }
              }}
            >
              {type.emoji && (
                <Box src={urlImageFor(type.emoji)} component="img" />
              )}
              {type.name}
            </Box>
          );
        })}
      </Box>
      {clear && selectedTypes && selectedTypes.length > 0 && (
        <Box {...styles.viewAllContainer}>
          <Typography {...styles.viewAll} onClick={() => clear("types")}>
            {translate("viewAll")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FilterTypeList;
