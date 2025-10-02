"use client";

import {
  alpha,
  Box,
  BoxProps,
  Chip,
  ChipProps,
  Divider,
  DividerProps,
  LinkProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { FC } from "react";
import { FiltersResponse } from "@/sanity/queries";
import useTranslate from "@/hooks/useTranslate";
import { Filters } from "@/hooks/useSchoolFilters";
import DoneIcon from "@mui/icons-material/Done";

interface Props {
  showDivider?: boolean;
  tags?: FiltersResponse["tags"];
  selectedTags?: string[];
  toggleTag?: (slug: string) => void;
  clear?: (key?: keyof Filters) => void;
}

interface FilterListStyles {
  container?: BoxProps;
  sectionHeading?: TypographyProps;
  listContainer?: BoxProps;
  chip?: (backgroundColor?: string) => ChipProps;
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
  divider: {
    sx: {
      mt: "20px",
      mb: "16px",
      bgcolor: "common.ui18",
    },
  },
  chip: (backgroundColor?: string) => ({
    sx: {
      borderRadius: "24px",
      px: "6px",
      py: "2px",
      fontSize: 12,
      fontWeight: 400,
      color: "custom.ui20",
      bgcolor: backgroundColor,
      border: `1px solid ${backgroundColor}`,
      "& .MuiChip-label": {
        padding: 0,
      },
      "&.checked": {
        borderColor: "var(--mui-palette-primary-main)",
      },
      "&:hover": {
        bgcolor: alpha(backgroundColor || "#FFFFFF", 0.5),
      },
      "& .MuiChip-icon": {
        mr: "4px",
        ml: 0,
      },
    },
  }),
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

const FilterTagList: FC<Props> = ({
  tags: tagsProps,
  selectedTags,
  toggleTag,
  showDivider,
  clear,
}) => {
  const translate = useTranslate();
  const tags = tagsProps?.filter(Boolean);

  if (!tags || tags.length === 0) {
    return null;
  }
  return (
    <Box {...styles.container} data-test-selector="FilterTagList">
      {showDivider && <Divider {...styles.divider} />}
      <Typography {...styles.sectionHeading}>{translate("tags")}</Typography>
      <Box {...styles.listContainer}>
        {tags?.map((tag) => {
          const checked = selectedTags?.includes(tag.slug);
          return (
            <Chip
              key={tag.id}
              label={tag.name}
              onClick={() => toggleTag?.(tag.slug)}
              {...styles.chip?.(tag.backgroundColor)}
              role="checkbox"
              aria-checked={checked}
              tabIndex={0}
              className={checked ? "checked" : ""}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleTag?.(tag.slug);
                }
              }}
              icon={
                checked ? <DoneIcon sx={{ fontSize: "16px" }} /> : undefined
              }
            />
          );
        })}
      </Box>
      {clear && selectedTags && selectedTags.length > 0 && (
        <Box {...styles.viewAllContainer}>
          <Typography {...styles.viewAll} onClick={() => clear("tags")}>
            {translate("viewAll")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FilterTagList;
