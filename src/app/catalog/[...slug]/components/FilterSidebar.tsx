import {
  Box,
  BoxProps,
  Typography,
  TypographyProps,
  ButtonProps,
  ChipProps,
  LinkProps,
  DividerProps,
  FormGroupProps,
  FormControlLabelProps,
  IconProps,
  Icon,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getTranslateServer } from "@/hooks/useTranslate";
import { CatalogParams } from "@/app/catalog/[...slug]/utilites/catalog";
import { fetchFilters } from "@/sanity/queries";
import Button from "@/components/ui/button";
import MinusIcon from "@mui/icons-material/Remove";
import { routes } from "@/routes";
import FilterList from "@/app/catalog/[...slug]/components/FilterList";

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
      pr: "14px",
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
  // viewAll: {
  //   sx: {
  //     color: "custom.ui11",
  //     fontWeight: 500,
  //     fontSize: "16px",
  //     mt: "16px",
  //     cursor: "pointer",
  //     "&:hover": {
  //       color: "primary.dark",
  //     },
  //   },
  // },
  // chip: {
  //   sx: {
  //     borderRadius: "24px",
  //     px: "6px",
  //     py: "2px",
  //     fontSize: 12,
  //     fontWeight: 400,
  //     color: "#475467",
  //     "& .MuiChip-label": { padding: 0 },
  //     "& .MuiChip-icon": { mr: "4px", ml: 0 },
  //   },
  // },
  // tagsContainer: {
  //   sx: {
  //     display: "grid",
  //     gridTemplateColumns: {
  //       xs: "repeat(auto-fit, minmax(132px, 1fr))",
  //       sm: "repeat(2,1fr)",
  //     },
  //     gap: "16px",
  //   },
  // },
  // typeBox: {
  //   sx: {
  //     border: `1px solid var(--mui-palette-custom-ui12)`,
  //     borderRadius: "12px",
  //     p: "8px",
  //     textAlign: "center",
  //     fontWeight: 400,
  //     fontSize: "14px",
  //     display: "flex",
  //     flexDirection: "column",
  //     alignItems: "center",
  //     gap: "6px",
  //     cursor: "pointer",
  //     bgcolor: "common.white",
  //     userSelect: "none",
  //     "&.selected": {
  //       borderColor: "primary.main",
  //       backgroundColor: "primary.light",
  //     },
  //     "&:focus-visible": {
  //       outline: `2px solid var(--mui-palette-primary-main)`,
  //       outlineOffset: 2,
  //     },
  //   },
  // },
  // formGroup: {
  //   sx: {
  //     p: 0,
  //     display: "flex",
  //     gap: "16px",
  //     flexDirection: "column",
  //     pl: "5px",
  //   },
  // },
  // formControlLabel: {
  //   sx: {
  //     fontSize: "16px",
  //   },
  // },
  // count: {
  //   sx: {
  //     width: "28px",
  //     height: "28px",
  //     aspectRatio: 1,
  //     fontSize: 14,
  //     color: "custom.ui13",
  //     fontWeight: 400,
  //     border: "1px solid #E0C3F9",
  //     borderRadius: "50%",
  //     display: "flex",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     p: "2px",
  //   },
  // },
};

const FilterSidebar = async ({ catalog }: { catalog: CatalogParams }) => {
  const translate = await getTranslateServer();
  const { regions, areas, subareas } = await fetchFilters(catalog);

  return (
    <Box {...styles.root}>
      <Box {...styles.headingContainer}>
        <Typography {...styles.heading}>{translate("filters")}</Typography>
      </Box>
      <FilterList
        title={translate(
          catalog.region ? "mainDistrictsByRegion" : "mainDistricts",
          {
            region: catalog.region || "",
          },
        )}
        items={+catalog.level > 0 ? areas : regions}
      />
      <FilterList
        title={translate(
          catalog.region ? "otherDistrictsByRegion" : "otherDistricts",
          {
            region: catalog.region || "",
          },
        )}
        items={subareas}
        showDivider={true}
      />
    </Box>
  );
};

export default FilterSidebar;
