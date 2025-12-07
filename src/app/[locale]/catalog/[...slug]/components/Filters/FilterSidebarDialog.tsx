"use client";

import * as React from "react";
import { Box, Dialog, DialogContent } from "@mui/material";
import FilterSidebar, {
  Props as FilterSidebarProps,
} from "@/app/[locale]/catalog/[...slug]/components/Filters/FilterSidebar";
import TuneIcon from "@mui/icons-material/Tune";
import useTranslate from "@/hooks/useTranslate";
import { DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function FilterSidebarDialog({
  catalog,
  selectedSlug,
  filterContent,
}: FilterSidebarProps) {
  const [open, setOpen] = React.useState(false);
  const translate = useTranslate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ flexShrink: 0 }}>
      <IconButton
        size="small"
        onClick={handleClickOpen}
        sx={{ aspectRatio: 1, border: 1, borderColor: "primary.main", p: 1 }}
      >
        <TuneIcon
          sx={{ width: 30, height: 30, aspectRatio: 1, color: "primary.main" }}
        />
      </IconButton>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle sx={{ m: 0, p: 3 }} />
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <FilterSidebar
            catalog={catalog}
            selectedSlug={selectedSlug}
            filterContent={filterContent}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
