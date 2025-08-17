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
import Link from "@/components/ui/link/Link";
import { useSearchParams } from "next/navigation";

const filters = {
  mainDistricts: [
    { label: "All", count: 12 },
    { label: "Prague 2", count: 3 },
    { label: "Prague 2", count: 3 },
    { label: "Prague 2", count: 3 },
  ],
  otherDistricts: [
    { label: "All", count: 12 },
    { label: "Beroun", count: 3 },
    { label: "Beroun", count: 3 },
    { label: "Beroun", count: 3 },
  ],
  tags: [
    { label: "Children’s Group", selected: true },
    { label: "Montessori Preschool" },
    { label: "Language Preschool" },
    { label: "Language Preschool", error: true },
  ],
  types: [
    { icon: "🧩", label: "Private Nurseries in Prague", selected: true },
    { icon: "👶", label: "Children’s Group Prague" },
    { icon: "🎨", label: "Art Kindergarten Prague" },
    { icon: "🌟", label: "Music Schools Prague" },
  ],
};

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
  root: {
    sx: {
      width: "100%",
    },
  },
  header: {
    sx: (theme) => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      pb: "20px",
      mb: "16px",
      borderBottom: `1px solid ${theme.palette.custom.ui18}`,
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
      p: "12px",
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
      "&:hover": {
        color: "primary.dark",
      },
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
      "& .MuiChip-label": {
        padding: 0,
      },
      "& .MuiChip-icon": {
        marginRight: "4px",
        marginLeft: 0,
      },
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
      border: `1px solid ${theme.palette.custom.ui12}`,
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
      "&.selected": {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
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
  formControlLabel: {
    sx: {
      fontSize: "16px",
    },
  },
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
  divider: {
    sx: {
      mt: "20px",
      mb: "16px",
      backgroundColor: "#AAB0B9",
    },
  },
};

const FilterSidebar = () => {
  const searchParams = useSearchParams();

  const area = searchParams.get("area"); // e.g. "besiktas"
  const type = searchParams.get("type"); // e.g. "school"
  const sort = searchParams.get("sort"); // e.g. "price_asc"

  console.log({ area });
  return (
    <Box {...styles.root}>
      <Box {...styles.header}>
        <Typography {...styles.title}>Filters</Typography>
        <Button {...styles.clearBtn}>Clear All</Button>
      </Box>
      <Typography {...styles.sectionTitle}>Main Districts Of Prague</Typography>
      <FormGroup {...styles.formGroup}>
        {filters.mainDistricts.map((item, idx) => (
          <Box key={idx} {...styles.filterItem}>
            <FormControlLabel
              control={<Checkbox defaultChecked={idx === 2} size="small" />}
              label={item.label}
              disableTypography
              {...styles.formControlLabel}
            />
            <Typography {...styles.counter}>{item.count}</Typography>
          </Box>
        ))}
      </FormGroup>
      <Link {...styles.viewAll} href="/123">
        View All
      </Link>
      <Divider {...styles.divider} />
      <Typography {...styles.sectionTitle}>Tags</Typography>
      <Box {...styles.tagsContainer}>
        {filters.tags.map((tag, idx) => (
          <Chip
            key={idx}
            label={tag.label}
            variant={tag.selected ? "filled" : "outlined"}
            color={"default"}
            {...styles.chip}
          />
        ))}
      </Box>
      <Typography {...styles.viewAll}>View All</Typography>
      <Divider {...styles.divider} />
      <Typography {...styles.sectionTitle}>Kinder Type</Typography>
      <Box {...styles.tagsContainer}>
        {filters.types.map((type, idx) => (
          <Box
            {...styles.typeBox}
            className={type.selected ? "selected" : ""}
            key={type.label}
          >
            <Box fontSize={20}>{type.icon}</Box>
            {type.label}
          </Box>
        ))}
      </Box>
      <Typography {...styles.viewAll}>View All</Typography>
    </Box>
  );
};

export default FilterSidebar;
