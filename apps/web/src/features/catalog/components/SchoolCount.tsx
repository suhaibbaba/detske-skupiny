"use client";

import { Box, Typography } from "@mui/material";
import SearchBar from "@/features/catalog/components/SearchBar";
import useTranslate from "@/hooks/useTranslate";
import FilterSidebarDialog from "@/features/catalog/components/filters/FilterSidebarDialog";
import { Props as FilterSidebarProps } from "@/features/catalog/components/filters/FilterSidebar";
import type { SxProps, Theme } from "@mui/material/styles";

interface Props {
  total: number;
  filterTotal: number;
  filterProps: FilterSidebarProps;
}

const styles = {
  container: {
    display: "grid",
    gap: "24px",
    width: "100%",
    gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
  },
  topRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: "12px",
  },
  text: {
    fontSize: "28px",
    fontWeight: 900,
    color: "custom.textHeading",
  },
} satisfies Record<string, SxProps<Theme>>;

const SchoolsCount = ({
  total,
  filterTotal,
  filterProps: { catalog, selectedSlug, filterContent },
}: Props) => {
  const translate = useTranslate();
  return (
    <Box sx={styles.container}>
      <Box>
        <Typography sx={styles.text}>
          {translate("showingResultsShort", {
            filterTotal,
          })}
        </Typography>
      </Box>
      <Box sx={styles.topRow}>
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
