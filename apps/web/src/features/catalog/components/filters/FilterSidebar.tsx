"use client";

import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useTranslate from "@/hooks/useTranslate";
import { CatalogParams } from "@/features/catalog/utils";
import { FiltersResponse } from "@/features/catalog/queries";
import FilterList from "@/features/catalog/components/filters/FilterList";
import FilterCategoriesList from "@/features/catalog/components/filters/FilterCategoriesList";
import FilterTagList from "@/features/catalog/components/filters/FilterTagList";
import { useSchoolFilters } from "@/features/catalog/useSchoolFilters";
import Button from "@/components/ui/button";
import type { SxProps, Theme } from "@mui/material/styles";

export interface Props {
  catalog: CatalogParams;
  selectedSlug: string;
  filterContent: FiltersResponse;
}

const styles = {
  root: {
    width: "100%",
    maxWidth: {
      xs: "100%",
      md: "300px",
    },
  },
  headingContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    pb: "20px",
    mb: "16px",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "custom.borderSubtle",
  },
  heading: {
    color: "custom.textHeading",
    textTransform: "capitalize",
    fontWeight: 900,
    fontSize: "20px",
  },
  clearButton: {
    p: "8px 12px",
    fontSize: 12,
  },
} satisfies Record<string, SxProps<Theme>>;

const FilterSidebar = ({
  catalog,
  selectedSlug,
  filterContent: { regions, areas, subareas, tags, categories },
}: Props) => {
  const translate = useTranslate();
  const { toggleTag, toggleType, hasActiveFilters, filters, clear } =
    useSchoolFilters();

  return (
    <Box sx={styles.root}>
      <Box sx={styles.headingContainer}>
        <Typography sx={styles.heading}>{translate("filters")}</Typography>
        {hasActiveFilters && (
          <Button
            sx={styles.clearButton}
            variant="primary"
            startIcon={<CloseIcon sx={{ width: 24, height: 24 }} />}
            onClick={() => clear()}
          >
            {translate("clearAll")}
          </Button>
        )}
      </Box>
      <FilterList
        title={translate(
          catalog.region ? "mainDistrictsByRegion" : "mainDistricts",
          {
            region: catalog.region || "",
          },
        )}
        selectedSlug={selectedSlug}
        showSearch={+catalog.level > 0}
        items={+catalog.level > 0 ? areas : regions}
      />
      <FilterList
        title={translate(
          catalog.region ? "otherDistrictsByRegion" : "otherDistricts",
          {
            region: catalog.region || "",
          },
        )}
        selectedSlug={selectedSlug}
        items={subareas}
        showDivider={true}
      />
      <FilterTagList
        tags={tags}
        toggleTag={toggleTag}
        selectedTags={filters.tags ?? []}
        clear={clear}
        showDivider={true}
      />
      <FilterCategoriesList
        categories={categories}
        showDivider={true}
        toggleType={toggleType}
        selectedTypes={filters.categories ?? []}
        clear={clear}
      />
    </Box>
  );
};

export default FilterSidebar;
