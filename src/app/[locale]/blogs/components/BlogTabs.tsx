"use client";

import {
  Box,
  Button,
  Stack,
  BoxProps,
  ButtonProps,
  StackProps,
} from "@mui/material";
import React, { forwardRef } from "react";

interface Props {
  selected: string;
  onSelect: (tab: string) => void;
  tabs: string[];
}

interface BlogTabsStyles {
  container?: BoxProps;
  stack?: StackProps;
  button?: (active: boolean) => ButtonProps;
}

const styles: BlogTabsStyles = {
  container: {
    bgcolor: "custom.ui5",
    sx: (theme) => ({
      width: "100%",
      py: "16px",
      px: "24px",
      borderRadius: "32px",
      display: "flex",
      justifyContent: "center",
      border: `1px solid ${theme.palette.custom.ui12}`,
      transform: "translateY(-50%)",
      boxShadow: theme.palette.shadows.ui1,
    }),
  },
  stack: {
    justifyContent: "center",
    width: "100%",
    direction: "row",
    gap: "12px",
    flexWrap: "wrap",
  },
  button: (active) => ({
    variant: "outlined",
    sx: (theme) => ({
      boxSizing: "content-box",
      flex: "1 0 0",
      padding: "10px 20px",
      maxWidth: "230px",
      borderRadius: "24px",
      borderColor: active
        ? theme.palette.custom.ui11
        : theme.palette.custom.ui12,
      bgcolor: theme.palette.common.white,
      color: theme.palette.text.primary,
    }),
  }),
};

const BlogTabs = forwardRef<HTMLDivElement, Props>(
  ({ selected, onSelect, tabs }, ref) => {
    return (
      <Box {...styles.container} ref={ref}>
        <Stack {...styles.stack}>
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => onSelect(tab)}
              {...styles.button?.(selected === tab)}
            >
              {tab}
            </Button>
          ))}
        </Stack>
      </Box>
    );
  },
);

BlogTabs.displayName = "BlogTabs";

export default BlogTabs;
