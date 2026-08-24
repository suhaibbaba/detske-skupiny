"use client";

import React, { useEffect, useRef } from "react";
import { Box, IconButton, Typography, ThemeProvider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MarkerData } from "@/types";
import { getLocalizedRoutes } from "@/routes";
import Link from "@/components/ui/link";
import theme from "@/theme";
import { useLocale } from "next-intl";
import useTranslate from "@/hooks/useTranslate";
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
    /*
     * Resets the fill and the shadow, deliberately not the outline: the
     * `:focus-visible` ring from theme/components.ts is the only thing marking
     * this button, which is the first thing focused when the popup opens.
     */
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
  const translate = useTranslate();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * Move focus into the popup when it opens.
   *
   * Clicking a marker opens a panel somewhere else in the DOM entirely - it is
   * portalled into MapTiler's own container - so without this, focus stays on
   * the map canvas and a keyboard user has no route to the school's link or to
   * the close button. Focusing the close button first means Escape, Tab and
   * Enter all do something sensible from the moment it opens.
   */
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [markerData.id]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={styles.container} data-test-selector="PopupContent">
        <IconButton
          ref={closeButtonRef}
          onClick={onClose}
          sx={styles.closeButton}
          size="small"
          disableRipple
          // Was the English literal "Close popup" on both domains.
          aria-label={translate("closeMapPopup")}
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
