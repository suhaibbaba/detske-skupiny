"use client";

import { Box, Divider } from "@mui/material";
import { FC } from "react";
import { FiltersResponse } from "@/features/catalog/queries";
import useTranslate from "@/hooks/useTranslate";

import { Filters } from "@/features/catalog/useSchoolFilters";
import Image from "@/components/ui/image";
import type { SxProps, Theme } from "@mui/material/styles";
import SectionHeading from "@/components/ui/SectionHeading";

interface Props {
  showDivider?: boolean;
  categories?: FiltersResponse["categories"];
  selectedTypes?: string[];
  toggleType?: (slug: string | null) => void;
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
  item: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "custom.divider",
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
  divider: {
    mt: "20px",
    mb: "16px",
    bgcolor: "common.ui18",
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
    <Box data-test-selector="FilterTypeList">
      {showDivider && <Divider sx={styles.divider} />}
      <SectionHeading>{translate("kinderType")}</SectionHeading>
      <Box sx={styles.listContainer}>
        {categories.map((category) => {
          const checked = selectedTypes?.includes(category.slug ?? "");
          return (
            <Box
              key={category.id}
              sx={styles.item}
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
                <Image src={category.emoji} alt="" sizes="24px" />
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
