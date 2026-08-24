import React from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import DataChip from "@/components/ui/DataChip";
import { SchoolTag as SchoolTagModal } from "@/types";

interface Props {
  tag: SchoolTagModal;
}

/** The pill's outline is the tag's own colour, so this is data, not a constant. */
const chipSx = (borderColor: string | null): SxProps<Theme> => ({
  px: "8px",
  py: "2px",
  color: "custom.labelStrong",
  borderColor,
  height: "auto",
});

const SchoolTag = ({ tag }: Props) => {
  return (
    <DataChip
      label={tag.name}
      sx={chipSx(tag.borderColor)}
      variant="outlined"
    />
  );
};

export default SchoolTag;
