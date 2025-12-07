"use client";

import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import SearchBar from "@/app/[locale]/catalog/[...slug]/components/SearchBar";
import useTranslate from "@/hooks/useTranslate";
import FilterSidebarDialog from "@/app/[locale]/catalog/[...slug]/components/Filters/FilterSidebarDialog";
import { Props as FilterSidebarProps } from "@/app/[locale]/catalog/[...slug]/components/Filters/FilterSidebar";

interface Props {
  total: number;
  filterTotal: number;
  filterProps: FilterSidebarProps;
}

interface SchoolCountStyles {
  container?: BoxProps;
  topRow?: BoxProps;
  text?: TypographyProps;
}

const styles: SchoolCountStyles = {
  container: {
    sx: {
      display: "grid",
      gap: "24px",
      width: "100%",
      gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
    },
  },
  topRow: {
    sx: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexWrap: "nowrap",
      gap: "12px",
    },
  },
  text: {
    sx: {
      fontSize: "28px",
      fontWeight: 900,
      color: "custom.ui13",
    },
  },
};

const SchoolsCount = ({
  total,
  filterTotal,
  filterProps: { catalog, selectedSlug, filterContent },
}: Props) => {
  const translate = useTranslate();
  return (
    <Box {...styles.container}>
      <Box>
        <Typography {...styles.text}>
          {translate("showingResults", {
            total,
            filterTotal,
          })}
        </Typography>
      </Box>
      <Box {...styles.topRow}>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <FilterSidebarDialog
            catalog={catalog}
            selectedSlug={selectedSlug}
            filterContent={filterContent}
          />
        </Box>
        <SearchBar />
      </Box>
    </Box>
  );
};

export default SchoolsCount;
