import React from "react";
import {
  Box,
  IconButton,
  Typography,
  TypographyProps,
  LinkProps,
  ButtonProps,
  BoxProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MarkerData } from "@/sanity/types";
import { routes } from "@/routes";
import Link from "@/components/ui/link";

interface PopupContentProps {
  markerData: MarkerData;
  onClose: () => void;
}

interface PopupStyles {
  container: BoxProps;
  closeButton: ButtonProps;
  titleLink: LinkProps;
  address: TypographyProps;
}

const styles: PopupStyles = {
  container: {
    overflow: "hidden",
    maxWidth: 300,
    textAlign: "left",
  },
  closeButton: {
    size: "small",
    disableRipple: true,
    sx: {
      position: "absolute",
      top: "14px",
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
  },
  titleLink: {
    sx: {
      fontSize: "16px",
      mb: "16px",
      display: "inline-block",
    },
  },
  address: {
    sx: {
      fontSize: "16px",
      textAlign: "left",
    },
  },
};

const PopupContent: React.FC<PopupContentProps> = ({ markerData, onClose }) => {
  return (
    <Box {...styles.container} data-test-selector="PopupContent">
      <IconButton
        onClick={onClose}
        {...styles.closeButton}
        aria-label="Close popup"
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {markerData.name && markerData.slug && (
        <Link href={routes.school(markerData.slug)} {...styles.titleLink}>
          {markerData.name}
        </Link>
      )}

      {markerData.fullAddress && (
        <Typography color="text.secondary" {...styles.address}>
          {markerData.fullAddress}
        </Typography>
      )}
    </Box>
  );
};

export default PopupContent;
