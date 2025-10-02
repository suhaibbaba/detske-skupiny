"use client";

import {
  Box,
  BoxProps,
  Typography,
  TypographyProps,
  ButtonProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useTranslate from "@/hooks/useTranslate";
import { CatalogParams } from "@/app/[locale]/catalog/[...slug]/utilites/catalog";
import { FiltersResponse } from "@/sanity/queries";
import FilterList from "@/app/[locale]/catalog/[...slug]/components/FilterList";
import FilterTypeList from "@/app/[locale]/catalog/[...slug]/components/FilterTypeList";
import FilterTagList from "@/app/[locale]/catalog/[...slug]/components/FilterTagList";
import { useSchoolFilters } from "@/hooks/useSchoolFilters";
import Button from "@/components/ui/button";

interface Props {
  catalog: CatalogParams;
  selectedSlug: string;
  filterContent: FiltersResponse;
}

interface FilterSidebarStyles {
  root?: BoxProps;
  headingContainer?: BoxProps;
  heading?: TypographyProps;
  clearButton?: ButtonProps;
}

const styles: FilterSidebarStyles = {
  root: {
    sx: {
      width: "100%",
      maxWidth: "300px",
    },
  },
  headingContainer: {
    sx: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      pb: "20px",
      mb: "16px",
      borderBottom: `1px solid var(--mui-palette-custom-ui18)`,
    },
  },
  heading: {
    fontSize: "20px",
    color: "custom.ui13",
    fontWeight: 600,
  },
  clearButton: {
    variant: "primary",
    startIcon: <CloseIcon sx={{ width: 24, height: 24 }} />,
    sx: {
      p: "8px 12px",
      fontSize: 12,
    },
  },
};

const FilterSidebar = ({
  catalog,
  selectedSlug,
  filterContent: { regions, areas, subareas, tags, types },
}: Props) => {
  const translate = useTranslate();
  const { toggleTag, toggleType, hasActiveFilters, filters, clear } =
    useSchoolFilters();

  return (
    <Box {...styles.root}>
      <Box {...styles.headingContainer}>
        <Typography {...styles.heading}>{translate("filters")}</Typography>
        {hasActiveFilters && (
          <Button {...styles.clearButton} onClick={() => clear()}>
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
      <FilterTypeList
        types={types}
        showDivider={true}
        toggleType={toggleType}
        selectedTypes={filters.types ?? []}
        clear={clear}
      />
    </Box>
  );
};

export default FilterSidebar;
