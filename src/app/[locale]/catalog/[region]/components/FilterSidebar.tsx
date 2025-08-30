"use client";

import {
  Box,
  BoxProps,
  Typography,
  TypographyProps,
  Divider,
  Button,
  ButtonProps,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  ChipProps,
  LinkProps,
  DividerProps,
  FormGroupProps,
  FormControlLabelProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRegionFilters } from "@/hooks/useRegionFilters";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";

interface FilterSidebarStyles {
  root?: BoxProps;
  header?: BoxProps;
  title?: TypographyProps;
  clearBtn?: ButtonProps;
  sectionTitle?: TypographyProps;
  viewAll?: LinkProps;
  filterItem?: BoxProps;
  chip?: ChipProps;
  tagsContainer?: BoxProps;
  typeBox?: BoxProps;
  formGroup?: FormGroupProps;
  counter?: TypographyProps;
  formControlLabel?: Omit<FormControlLabelProps, "label" | "control">;
  divider?: DividerProps;
}

const styles: FilterSidebarStyles = {
  root: { sx: { width: "100%" } },
  header: {
    sx: (theme) => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      pb: "20px",
      mb: "16px",
      borderBottom: `1px solid ${theme.palette.custom?.ui18 ?? "#eee"}`,
    }),
  },
  title: {
    fontSize: "20px",
    color: "custom.ui13",
    fontWeight: 600,
  },
  clearBtn: {
    variant: "primary",
    startIcon: <CloseIcon sx={{ width: 24, height: 24 }} />,
    sx: {
      p: "8px 12px",
      fontSize: 12,
    },
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 500,
    mb: "16px",
    color: "custom.ui13",
  },
  viewAll: {
    sx: {
      color: "custom.ui11",
      fontWeight: 500,
      fontSize: "16px",
      mt: "16px",
      cursor: "pointer",
      "&:hover": { color: "primary.dark" },
    },
  },
  filterItem: {
    sx: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
  },
  chip: {
    sx: {
      borderRadius: "24px",
      px: "6px",
      py: "2px",
      fontSize: 12,
      fontWeight: 400,
      color: "#475467",
      "& .MuiChip-label": { padding: 0 },
      "& .MuiChip-icon": { mr: "4px", ml: 0 },
    },
  },
  tagsContainer: {
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "repeat(auto-fit, minmax(132px, 1fr))",
        sm: "repeat(2,1fr)",
      },
      gap: "16px",
    },
  },
  typeBox: {
    sx: (theme) => ({
      border: `1px solid ${theme.palette.custom?.ui12 ?? "#e5e7eb"}`,
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
      bgcolor: theme.palette.common.white,
      userSelect: "none",
      "&.selected": {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
      },
      "&:focus-visible": {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 2,
      },
    }),
  },
  formGroup: {
    sx: {
      p: 0,
      display: "flex",
      gap: "16px",
      flexDirection: "column",
      pl: "5px",
    },
  },
  formControlLabel: { sx: { fontSize: "16px" } },
  counter: {
    sx: {
      minWidth: "28px",
      minHeight: "28px",
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
  divider: { sx: { mt: "20px", mb: "16px", backgroundColor: "#AAB0B9" } },
};

const FilterSidebar = ({
  locale,
  regionSlug,
}: {
  locale: string;
  regionSlug: string;
}) => {
  const {
    filter,
    isLoading,
    selectedAreas,
    selectedTypes,
    selectedTags,
    toggleArea,
    toggleType,
    toggleTag,
    clearAll,
    hasActiveFilters,
    clearKey,
  } = useRegionFilters({ locale, regionSlug });

  return (
    <Box {...styles.root} aria-busy={isLoading || undefined}>
      <Box {...styles.header}>
        <Typography {...styles.title}>
          Filters {filter?.region.name ? `— ${filter?.region.name}` : ""}
        </Typography>
        {hasActiveFilters && (
          <Button {...styles.clearBtn} onClick={clearAll}>
            Clear All
          </Button>
        )}
      </Box>

      <Typography {...styles.sectionTitle}>
        Main Districts {filter?.region.name ? `of ${filter?.region.name}` : ""}
      </Typography>
      <FormGroup {...styles.formGroup}>
        <Box key="all" {...styles.filterItem}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={selectedAreas.has("all")}
                onChange={() => toggleArea("all")}
              />
            }
            label="All"
            disableTypography
            {...styles.formControlLabel}
          />
          <Typography {...styles.counter}>
            {filter?.totalSchools || 0}
          </Typography>
        </Box>
        {filter?.mainAreas?.map((area) => {
          const checked = selectedAreas.has(area.slug);
          return (
            <Box key={area.id} {...styles.filterItem}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={checked}
                    onChange={() => toggleArea(area.slug)}
                  />
                }
                label={area.name}
                disableTypography
                {...styles.formControlLabel}
              />
              <Typography {...styles.counter}>{area.count}</Typography>
            </Box>
          );
        })}
      </FormGroup>

      {/* OTHER AREAS */}
      {filter?.otherAreas && filter?.otherAreas.length > 0 && (
        <>
          <Divider {...styles.divider} />
          <Typography {...styles.sectionTitle}>Other Districts</Typography>
          <FormGroup {...styles.formGroup}>
            {filter?.otherAreas.map((area) => {
              const checked = selectedAreas.has(area.slug);
              return (
                <Box key={area.id} {...styles.filterItem}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={checked}
                        onChange={() => toggleArea(area.slug)}
                      />
                    }
                    label={area.name}
                    disableTypography
                    {...styles.formControlLabel}
                  />
                  <Typography {...styles.counter}>{area.count}</Typography>
                </Box>
              );
            })}
          </FormGroup>
        </>
      )}

      {/* TAGS */}
      {filter?.tags && filter?.tags?.length > 0 && (
        <>
          <Divider {...styles.divider} />
          <Typography {...styles.sectionTitle}>Tags</Typography>
          <Box {...styles.tagsContainer}>
            {filter?.tags?.map((tag) => {
              const tagSlug = tag.slug;
              const checked = selectedTags.has(tagSlug);
              return (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  onClick={() => toggleTag(tagSlug)}
                  variant={checked ? "filled" : "outlined"}
                  {...styles.chip}
                  role="checkbox"
                  aria-checked={checked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      toggleTag(tagSlug);
                    }
                  }}
                />
              );
            })}
          </Box>
          <Typography {...styles.viewAll} onClick={() => clearKey("tag")}>
            View All
          </Typography>
        </>
      )}

      {/* TYPES */}
      {filter?.types && filter?.types.length > 0 && (
        <>
          <Divider {...styles.divider} />
          <Typography {...styles.sectionTitle}>Kinder Type</Typography>
          <Box {...styles.tagsContainer}>
            {filter.types.map((type) => {
              const typeSlug = type.slug;
              const checked = selectedTypes.has(typeSlug);
              return (
                <Box
                  key={type.id}
                  {...styles.typeBox}
                  className={checked ? "selected" : ""}
                  onClick={() => toggleType(typeSlug)}
                  role="checkbox"
                  aria-checked={checked}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      toggleType(typeSlug);
                    }
                  }}
                >
                  {type.emoji && (
                    <Box src={urlImageFor(type.emoji)} component="img"></Box>
                  )}
                  {type.name}
                </Box>
              );
            })}
          </Box>
          <Typography {...styles.viewAll} onClick={() => clearKey("type")}>
            View All
          </Typography>
        </>
      )}
    </Box>
  );
};

export default FilterSidebar;
