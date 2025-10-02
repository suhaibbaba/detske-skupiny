"use client";

import { Chip, ChipProps } from "@mui/material";
import React from "react";
import { SchoolTag as SchoolTagModal } from "@/sanity/types";

interface Props {
  tag: SchoolTagModal;
}

interface SchoolTagStyles {
  chip?: (borderColor: string) => ChipProps;
}

const styles: SchoolTagStyles = {
  chip: (borderColor: string) => ({
    sx: {
      borderRadius: "24px",
      px: "8px",
      py: "2px",
      fontSize: 12,
      color: "custom.ui1",
      borderColor: borderColor,
      height: "auto",
      "& .MuiChip-label": {
        padding: 0,
      },
      "& .MuiChip-icon": {
        marginRight: "4px",
        marginLeft: 0,
      },
    },
  }),
};

const SchoolTag = ({ tag }: Props) => {
  return (
    <Chip
      label={tag.name}
      {...styles.chip?.(tag.backgroundColor)}
      variant="outlined"
    />
  );
};

export default SchoolTag;
