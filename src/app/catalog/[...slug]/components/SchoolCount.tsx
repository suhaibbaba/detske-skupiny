"use client";

import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import SearchBar from "@/app/catalog/[...slug]/components/SearchBar";
import useTranslate from "@/hooks/useTranslate";
import { useTranslations } from "next-intl";

interface Props {
  total: number;
  filterTotal: number;
}

interface SchoolCountStyles {
  container?: BoxProps;
  text?: TypographyProps;
}

const styles: SchoolCountStyles = {
  container: {
    sx: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "24px",
      width: "100%",
    },
  },
  text: {
    sx: {
      fontSize: "28px",
      fontWeight: 600,
      color: "custom.ui13",
    },
  },
};

const SchoolsCount = ({ total, filterTotal }: Props) => {
  const translate = useTranslate("common");
  return (
    <Box {...styles.container}>
      <Typography {...styles.text}>
        {translate("showingResults", {
          total,
          filterTotal,
        })}
      </Typography>
      <SearchBar />
    </Box>
  );
};

export default SchoolsCount;
