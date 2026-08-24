"use client";

import { alpha, Box, Divider, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { FC } from "react";
import { FiltersResponse } from "@/features/catalog/queries";
import useTranslate from "@/hooks/useTranslate";
import { Filters } from "@/features/catalog/useSchoolFilters";
import DataChip from "@/components/ui/DataChip";
import SectionHeading from "@/components/ui/SectionHeading";
import DoneIcon from "@mui/icons-material/Done";

interface Props {
  showDivider?: boolean;
  tags?: FiltersResponse["tags"];
  selectedTags?: string[];
  toggleTag?: (slug: string | null) => void;
  clear?: (key?: keyof Filters) => void;
}

const styles = {
  listContainer: {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(auto-fit, 132px)",
      sm: "repeat(2, 1fr)",
    },
    gap: "16px",
  },
  divider: {
    mt: "20px",
    mb: "16px",
  },
  viewAllContainer: {
    display: "flex",
  },
  viewAll: {
    color: "custom.textLilac",
    fontWeight: 500,
    fontSize: "16px",
    mt: "16px",
    cursor: "pointer",
    alignSelf: "baseline",
    "&:hover": {
      color: "primary.dark",
    },
  },
} satisfies Record<string, SxProps<Theme>>;

/**
 * The pill's outline is the tag's own colour, falling back to the brand
 * purple - so it is a function of the row, not a constant.
 */
const chipSx = (borderColorProps?: string | null): SxProps<Theme> => {
  const borderColor = borderColorProps || "#9980B0";

  return {
    px: "6px",
    py: "2px",
    fontWeight: 400,
    color: "custom.textSecondary",
    bgcolor: "white",
    border: `1px solid ${borderColor}`,
    transition: "all 0.3s ease",
    maxWidth: 180,
    "&.checked": {
      bgcolor: "white",
      borderColor,
    },
    "&:hover": {
      bgcolor: "white",
      borderColor: alpha(borderColor, 0.5),
    },
  };
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
    <Box data-test-selector="FilterTagList">
      {showDivider && <Divider sx={styles.divider} />}
      <SectionHeading>{translate("tags")}</SectionHeading>
      <Box sx={styles.listContainer}>
        {tags?.map((tag) => {
          const checked = selectedTags?.includes(tag.slug ?? "");
          return (
            <DataChip
              key={tag.id}
              label={tag.name}
              onClick={() => toggleTag?.(tag.slug)}
              sx={chipSx(tag.borderColor)}
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
        <Box sx={styles.viewAllContainer}>
          <Typography sx={styles.viewAll} onClick={() => clear("tags")}>
            {translate("viewAll")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FilterTagList;
