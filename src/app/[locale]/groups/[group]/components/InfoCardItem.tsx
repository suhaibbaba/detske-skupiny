"use client";

import { Box, Typography, BoxProps, TypographyProps } from "@mui/material";
import { ReactNode } from "react";

export interface InfoCardItemProps {
  icon: ReactNode;
  title: string;
  content: ReactNode;
  show?: boolean;
}

interface InfoCardItemStyles {
  container?: BoxProps;
  iconWrapper?: BoxProps;
  title?: TypographyProps;
  content?: BoxProps;
}

const styles: InfoCardItemStyles = {
  title: {
    sx: (theme) => ({
      fontSize: "16px",
      fontWeight: 600,
      color: theme.palette.custom.ui13,
      mb: "8px",
    }),
  },
};

const InfoCardItem = ({ icon, title, content, show }: InfoCardItemProps) => {
  return (
    <Box
      sx={(theme) => ({
        bgcolor: "primary.light",
        border: `1px solid ${theme.palette.custom.ui14}`,
        borderRadius: "12px",
        p: "24px 12px",
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
        mt: "2px",
        ".MuiSvgIcon-root": {
          width: "20px",
          height: "20px",
          color: theme.palette.secondary.dark,
        },
        opacity: !show ? 0.5 : 1,
      })}
    >
      <Box {...styles.iconWrapper}>{icon}</Box>
      <Box data-test-selector={"info-card"}>
        <Typography {...styles.title}>{title}</Typography>
        <Box {...styles.content}>{content}</Box>
      </Box>
    </Box>
  );
};

export default InfoCardItem;
