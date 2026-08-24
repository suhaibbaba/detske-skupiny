"use client";

import React from "react";
import { Box, IconButton, Typography, ThemeProvider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MarkerData } from "@/types";
import { getLocalizedRoutes } from "@/routes";
import Link from "@/components/ui/link";
import theme from "@/theme";
import { useLocale } from "next-intl";
import type { SxProps, Theme } from "@mui/material/styles";

interface PopupContentProps {
  markerData: MarkerData;
  onClose: () => void;
}

const styles = {
  container: {
    textAlign: "left",
    maxWidth: 300,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: "13px",
    right: "2px",
    zIndex: 10,
    width: 26,
    height: 26,
    bgcolor: "transparent",
    border: "none",
    boxShadow: "none",
    color: "text.secondary",
    "&:hover": {
      bgcolor: "transparent",
      border: "none",
      boxShadow: "none",
      color: "error.main",
    },
    "&:active": {
      bgcolor: "transparent",
      border: "none",
      boxShadow: "none",
      color: "error.dark",
    },
    "&:focus": {
      bgcolor: "transparent",
      border: "none",
      boxShadow: "none",
    },
  },
  titleLink: {
    fontSize: "16px",
    mb: "16px",
    display: "inline-block",
    maxWidth: "95%",
    "&:hover": {
      color: "primary.main",
    },
  },
  address: {
    fontSize: "16px",
    textAlign: "left",
  },
} satisfies Record<string, SxProps<Theme>>;

const PopupContent: React.FC<PopupContentProps> = ({ markerData, onClose }) => {
  const locale = useLocale();
  return (
    <ThemeProvider theme={theme}>
      <Box sx={styles.container} data-test-selector="PopupContent">
        <IconButton
          onClick={onClose}
          sx={styles.closeButton}
          size="small"
          disableRipple
          aria-label="Close popup"
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {markerData.name && markerData.slug && (
          <Link
            href={getLocalizedRoutes(locale).group(markerData.slug)}
            sx={styles.titleLink}
          >
            {markerData.name}
          </Link>
        )}

        {markerData.fullAddress && (
          <Typography
            sx={{
              color: "text.secondary",
            }}
          >
            {markerData.fullAddress}
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default PopupContent;
